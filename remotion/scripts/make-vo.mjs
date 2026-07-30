/**
 * Synthesises both voiceover cuts and retimes the compositions to them.
 *
 *   npm run vo
 *
 * Writes:
 *   public/vo-full.mp3   the long-form read
 *   public/vo-short.mp3  the ~45s Shorts read
 *   src/vo-timing.ts     measured beat boundaries + in-beat cues, for BOTH cuts
 *
 * The point is the last file. Every frame number in the composition that has to land on a
 * word comes from here, so the timeline follows the recording instead of the script's
 * estimates. Re-run after changing a line, a pause, or the voice in scripts/vo-cuts.mjs.
 *
 * To use a human recording instead: drop one .wav per line in public/vo-lines/<cut>/
 * named 01.wav … 08.wav and run with --from-recordings. Durations are measured the same
 * way, so the retime is identical.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, existsSync, writeFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { CUTS } from './vo-cuts.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WORK = path.join(ROOT, '.vo-work');
const FPS = 30;
const VOICE = 'am_michael';

const sh = (cmd, args) =>
  execFileSync(cmd, args, { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] }).toString();

const duration = (file) =>
  parseFloat(
    sh('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]),
  );

const fromRecordings = process.argv.includes('--from-recordings');
const f = (seconds) => Math.round(seconds * FPS);

rmSync(WORK, { recursive: true, force: true });

/** Synthesise, measure and assemble one cut. Returns its timing block. */
const buildCut = (name, cut) => {
  const work = path.join(WORK, name);
  mkdirSync(work, { recursive: true });
  console.log(`\n== ${name}`);

  const parts = [];
  cut.lines.forEach((line, i) => {
    const n = String(i + 1).padStart(2, '0');
    const raw = path.join(work, `${n}.wav`);

    if (fromRecordings) {
      const src = path.join(ROOT, 'public', 'vo-lines', name, `${n}.wav`);
      if (!existsSync(src)) throw new Error(`--from-recordings: missing ${src}`);
      sh('ffmpeg', ['-y', '-i', src, '-ac', '1', '-ar', '24000', raw]);
    } else {
      // Kokoro-82M via the HyperFrames CLI. Local model, no account needed.
      sh('npx', ['hyperframes', 'tts', line.text, '-o', raw, '-v', VOICE, '-s', String(cut.speed)]);
    }

    const spoken = duration(raw);

    // Append the scripted pause as real silence, so the concatenated file IS the timeline.
    const padded = path.join(work, `${n}-p.wav`);
    sh('ffmpeg', ['-y', '-i', raw, '-af', `apad=pad_dur=${line.pad}`, padded]);

    parts.push({ ...line, file: padded, spoken, total: spoken + line.pad });
    console.log(`  ${n}  ${spoken.toFixed(2)}s + ${line.pad}s  ${line.beat}`);
  });

  const lead = path.join(work, '00-lead.wav');
  sh('ffmpeg', ['-y', '-f', 'lavfi', '-t', String(cut.lead), '-i', 'anullsrc=r=24000:cl=mono', lead]);

  const listFile = path.join(work, 'concat.txt');
  writeFileSync(listFile, [lead, ...parts.map((p) => p.file)].map((x) => `file '${x}'`).join('\n'));

  const out = path.join(ROOT, 'public', `vo-${name}.mp3`);
  sh('ffmpeg', ['-y', '-f', 'concat', '-safe', '0', '-i', listFile, '-c:a', 'libmp3lame', '-q:a', '3', out]);

  const totalSeconds = duration(out);
  const totalFrames = Math.round(totalSeconds * FPS);

  // Beat boundaries, by summing the lines that belong to each beat.
  const beats = {};
  const order = [];
  let cursor = cut.lead;
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
  beats[order.at(-1)].durationInFrames += totalFrames - f(cut.lead) - summed;

  /**
   * In-beat cues that must land on a specific word.
   *  rollStart — the odometer starts the instant line 2 begins ("Three cents of YOURS").
   *  slam      — the shutter lands just before line 6 ends, on "the same day".
   */
  const cues = {
    rollStart: f(cut.lead + parts[0].total) - beats.balance.from,
    slam: f(parts[5].spoken) - 4,
  };

  console.log(`  -> ${totalSeconds.toFixed(2)}s / ${totalFrames} frames`);
  return { name, totalSeconds, totalFrames, beats, order, cues, parts, chainRows: cut.chainRows };
};

const built = Object.entries(CUTS).map(([name, cut]) => buildCut(name, cut));

// ---- generate src/vo-timing.ts ----------------------------------------------------
const block = (b) => `  ${b.name}: {
    audio: 'vo-${b.name}.mp3',
    totalFrames: ${b.totalFrames},
    /** How many rows of the lending chain this read actually narrates. */
    chainRows: ${b.chainRows},
    beats: {
${b.order.map((k) => `      ${k}: { from: ${b.beats[k].from}, durationInFrames: ${b.beats[k].durationInFrames} },`).join('\n')}
    },
    cues: {
      /** frames into the balance beat where line 2 starts */
      rollStart: ${b.cues.rollStart},
      /** frames into the run beat where the shutter lands */
      slam: ${b.cues.slam},
    },
    lines: [
${b.parts.map((p, i) => `      { n: ${i + 1}, beat: '${p.beat}', spoken: ${p.spoken.toFixed(3)}, pad: ${p.pad} },`).join('\n')}
    ],
  },`;

const ts = `/**
 * GENERATED by scripts/make-vo.mjs — do not edit by hand.
 *
 * Measured from the audio in public/ (${fromRecordings ? 'human recordings' : `Kokoro ${VOICE}`}).
${built.map((b) => ` * ${b.name}: ${b.totalSeconds.toFixed(2)}s / ${b.totalFrames} frames @ ${CUTS[b.name].speed}x`).join('\n')}
 *
 * Re-run \`npm run vo\` after any change to scripts/vo-cuts.mjs.
 */
export const VO = {
${built.map(block).join('\n')}
} as const;

export type Cut = keyof typeof VO;
`;

writeFileSync(path.join(ROOT, 'src', 'vo-timing.ts'), ts);
rmSync(WORK, { recursive: true, force: true });

console.log('\nsrc/vo-timing.ts written');
built.forEach((b) => console.log(`  ${b.name}: ${b.totalSeconds.toFixed(2)}s  cues rollStart=${b.cues.rollStart} slam=${b.cues.slam}`));
