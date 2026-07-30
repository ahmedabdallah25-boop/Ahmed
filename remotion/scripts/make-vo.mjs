/**
 * Synthesises the Part 15 voiceover and retimes the composition to it.
 *
 *   npm run vo
 *
 * Writes:
 *   public/vo.mp3     one line per script beat, with the scripted pauses between them
 *   src/vo-timing.ts  measured beat boundaries + in-beat cues, imported by theme.ts
 *
 * The point is the second file. Every frame number in the composition that has to land
 * on a word comes from here, so the timeline follows the recording instead of the
 * script's estimates. Re-run after changing a line, a pause, or the voice.
 *
 * To use a human recording instead: drop one .wav per line in public/vo-lines/ named
 * 01.wav … 08.wav and run with --from-recordings. Durations are measured the same way,
 * so the retime is identical.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, existsSync, writeFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WORK = path.join(ROOT, '.vo-work');
const FPS = 30;
const VOICE = 'am_michael';
const SPEED = 0.96; // a touch under 1.0 — the hook needs to land flat and unhurried

/**
 * One entry per script beat, in order. `pad` is the silence appended AFTER the line,
 * in seconds — these are the pauses in vo-script.txt's delivery notes, not padding for
 * its own sake. `beat` maps the line onto a composition beat; `balance` takes two lines
 * (the hook and its turn), everything else is one to one.
 */
const LINES = [
  {
    beat: 'balance',
    text: 'Right now your bank is holding about three cents of every dollar you think you own.',
    pad: 0.55,
  },
  {
    beat: 'balance',
    text: "Not three percent of the bank's money. Three cents of yours.",
    pad: 0.8, // "punch yours, then a full beat of silence"
  },
  {
    beat: 'vault',
    text: "The rest isn't in a vault. It isn't anywhere. It's a promise, typed into a screen.",
    pad: 0.5,
  },
  {
    beat: 'cascade',
    text: 'You deposited a hundred. The bank kept three and lent out ninety-seven. That ninety-seven got deposited somewhere else, and lent again.',
    pad: 0.45,
  },
  {
    beat: 'owners',
    text: 'One deposit. Thirty different people now believe they own it. And every one of them is right, as long as nobody asks.',
    pad: 0.65, // let "nobody asks" hang
  },
  {
    beat: 'run',
    text: "That's why a healthy bank dies in a single afternoon. Nothing was stolen. Everyone just showed up on the same day.",
    pad: 0.5,
  },
  {
    beat: 'assets',
    text: 'The alternative already exists. Your deposit stays your deposit. Held, not lent. Money only multiplies when something real was actually built.',
    pad: 0.5,
  },
  {
    beat: 'kicker',
    text: 'Same money. One system needs you not to look. Tomorrow: where the ninety-seven actually goes. No jargon, just mechanisms.',
    pad: 1.1, // tail for the wordmark
  },
];

const LEAD = 0.2; // minimal — the hook is the whole video, it should not wait

const sh = (cmd, args) =>
  execFileSync(cmd, args, { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] }).toString();

const duration = (file) =>
  parseFloat(
    sh('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]),
  );

const fromRecordings = process.argv.includes('--from-recordings');

rmSync(WORK, { recursive: true, force: true });
mkdirSync(WORK, { recursive: true });

// ---- 1. one audio file per line ------------------------------------------------
const parts = [];
LINES.forEach((line, i) => {
  const n = String(i + 1).padStart(2, '0');
  const raw = path.join(WORK, `${n}.wav`);

  if (fromRecordings) {
    const src = path.join(ROOT, 'public', 'vo-lines', `${n}.wav`);
    if (!existsSync(src)) throw new Error(`--from-recordings: missing ${src}`);
    sh('ffmpeg', ['-y', '-i', src, '-ac', '1', '-ar', '24000', raw]);
  } else {
    // Kokoro-82M via the HyperFrames CLI. Local model, no account needed.
    sh('npx', [
      'hyperframes', 'tts', line.text,
      '-o', raw, '-v', VOICE, '-s', String(SPEED),
    ]);
  }

  const spoken = duration(raw);

  // Append the scripted pause as real silence, so the concatenated file is the timeline.
  const padded = path.join(WORK, `${n}-p.wav`);
  sh('ffmpeg', ['-y', '-i', raw, '-af', `apad=pad_dur=${line.pad}`, padded]);

  parts.push({ ...line, file: padded, spoken, total: spoken + line.pad });
  console.log(`${n}  ${spoken.toFixed(2)}s speech + ${line.pad}s pause  ${line.beat}`);
});

// ---- 2. assemble -----------------------------------------------------------------
const lead = path.join(WORK, '00-lead.wav');
sh('ffmpeg', ['-y', '-f', 'lavfi', '-t', String(LEAD), '-i', 'anullsrc=r=24000:cl=mono', lead]);

const listFile = path.join(WORK, 'concat.txt');
writeFileSync(
  listFile,
  [lead, ...parts.map((p) => p.file)].map((f) => `file '${f}'`).join('\n'),
);

const out = path.join(ROOT, 'public', 'vo.mp3');
mkdirSync(path.dirname(out), { recursive: true });
sh('ffmpeg', ['-y', '-f', 'concat', '-safe', '0', '-i', listFile, '-c:a', 'libmp3lame', '-q:a', '3', out]);

const totalSeconds = duration(out);
const totalFrames = Math.round(totalSeconds * FPS);

// ---- 3. derive the timeline ------------------------------------------------------
const f = (seconds) => Math.round(seconds * FPS);

/** Beat boundaries, by summing the lines that belong to each beat. */
const beats = {};
let cursor = LEAD;
const order = [];
for (const p of parts) {
  if (!beats[p.beat]) {
    beats[p.beat] = { from: f(cursor), durationInFrames: 0 };
    order.push(p.beat);
  }
  beats[p.beat].durationInFrames += f(p.total);
  cursor += p.total;
}
// Absorb rounding into the last beat so the sequences tile the composition exactly.
const summed = order.reduce((a, k) => a + beats[k].durationInFrames, 0);
beats[order[order.length - 1]].durationInFrames += totalFrames - f(LEAD) - summed;

/**
 * In-beat cues that must land on a specific word.
 *  rollStart — the odometer starts the instant line 2 begins ("Three cents of YOURS").
 *  slam      — the shutter lands just before line 6 ends, on "the same day".
 */
const cues = {
  rollStart: f(LEAD + parts[0].total) - beats.balance.from,
  slam: f(parts[5].spoken) - 4,
};

const ts = `/**
 * GENERATED by scripts/make-vo.mjs — do not edit by hand.
 *
 * Measured from public/vo.mp3 (${fromRecordings ? 'human recordings' : `Kokoro ${VOICE} @ ${SPEED}x`}).
 * Total ${totalSeconds.toFixed(2)}s / ${totalFrames} frames at ${FPS}fps.
 *
 * Re-run \`npm run vo\` after any change to a line, a pause, or the voice.
 */
export const VO = {
  totalFrames: ${totalFrames},
  beats: {
${order.map((k) => `    ${k}: { from: ${beats[k].from}, durationInFrames: ${beats[k].durationInFrames} },`).join('\n')}
  },
  cues: {
    /** frames into the balance beat where line 2 starts */
    rollStart: ${cues.rollStart},
    /** frames into the run beat where the shutter lands */
    slam: ${cues.slam},
  },
  lines: [
${parts.map((p, i) => `    { n: ${i + 1}, beat: '${p.beat}', spoken: ${p.spoken.toFixed(3)}, pad: ${p.pad} },`).join('\n')}
  ],
} as const;
`;

writeFileSync(path.join(ROOT, 'src', 'vo-timing.ts'), ts);
rmSync(WORK, { recursive: true, force: true });

console.log(`\npublic/vo.mp3  ${totalSeconds.toFixed(2)}s`);
console.log(`src/vo-timing.ts  ${totalFrames} frames`);
console.log(order.map((k) => `  ${k}: ${beats[k].from}+${beats[k].durationInFrames}`).join('\n'));
console.log(`  cues: rollStart=${cues.rollStart} slam=${cues.slam}`);
