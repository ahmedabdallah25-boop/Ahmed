/**
 * Measures the voiceover for each cut and retimes the compositions to it.
 *
 *   npm run vo
 *
 * Writes src/vo-timing.ts — beat boundaries and in-beat cues per cut. Every frame number
 * in the composition that has to land on a word comes from there, so the timeline follows
 * the recording rather than the script's estimates.
 *
 * Three sources, in priority order, per cut:
 *
 * 1. MASTER — `public/vo-source/<cut>.mp3`, one continuous take (e.g. ElevenLabs, or a
 *    real recording). Line boundaries are FOUND in the audio; see findBoundaries.
 * 2. PER-LINE — `public/vo-lines/<cut>/01.wav … 08.wav`, with `--from-recordings`.
 *    Durations are measured directly, which needs no detection at all.
 * 3. SYNTH — Kokoro-82M via `npx hyperframes tts`, the fallback so a clean checkout can
 *    always produce something.
 *
 * A master take is the normal path once real audio exists: drop the file in and re-run.
 */
import { execFileSync, spawnSync } from 'node:child_process';
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

/**
 * Locates the line boundaries inside one continuous take.
 *
 * Whisper alignment is not available offline here (the model download is blocked), so
 * this uses silence detection plus TWO independent checks that must agree:
 *
 *  a) the N-1 longest gaps should be the line boundaries — a reader pauses longer between
 *     paragraphs than between sentences within one;
 *  b) each of those gaps should fall where the script's own length proportions predict,
 *     measured in cumulative SPEECH (not wall time, which the pauses distort).
 *
 * If the two disagree the take probably does not match the script, so it throws rather
 * than silently mis-timing the whole video.
 */
const findBoundaries = (file, cut) => {
  const total = duration(file);

  // ffmpeg logs silencedetect to stderr, not stdout.
  const probe = spawnSync(
    'ffmpeg',
    ['-hide_banner', '-nostats', '-i', file, '-af', 'silencedetect=noise=-35dB:d=0.25', '-f', 'null', '-'],
    { encoding: 'utf8' },
  );
  const nums = `${probe.stdout ?? ''}${probe.stderr ?? ''}`.match(/silence_(?:start|end): [0-9.]+/g) ?? [];
  const marks = nums.map((m) => parseFloat(m.split(': ')[1]));
  const gaps = [];
  for (let i = 0; i + 1 < marks.length; i += 2) gaps.push({ start: marks[i], end: marks[i + 1] });
  if (gaps.length < cut.lines.length) {
    throw new Error(`${file}: only ${gaps.length} pauses found, need ${cut.lines.length - 1} boundaries`);
  }

  // speech = the complement of the detected silences
  const speech = [];
  let t = 0;
  for (const g of gaps) {
    if (g.start > t) speech.push([t, g.start]);
    t = Math.max(t, g.end);
  }
  if (t < total) speech.push([t, total]);
  const speechTotal = speech.reduce((a, [x, y]) => a + (y - x), 0);
  const speechBefore = (x) => speech.reduce((a, [s0, e0]) => a + Math.max(0, Math.min(e0, x) - s0), 0);

  // (a) the longest gaps, back in time order.
  //
  // Lead-in and trailing silence are excluded first: the tail on this take is 1.2s, longer
  // than any pause inside it, so leaving it in displaces a real boundary from the list.
  const need = cut.lines.length - 1;
  const internal = gaps.filter((g) => g.start > 0.01 && total - g.end > 0.05);
  if (internal.length < need) {
    throw new Error(`${file}: only ${internal.length} internal pauses, need ${need}`);
  }
  const longest = [...internal]
    .sort((p, q) => q.end - q.start - (p.end - p.start))
    .slice(0, need)
    .sort((p, q) => p.start - q.start);

  // (b) where the script's proportions say each boundary should be
  const weights = cut.lines.map((l) => l.text.length);
  const wTotal = weights.reduce((a, b) => a + b, 0);

  longest.forEach((g, i) => {
    const expected = weights.slice(0, i + 1).reduce((a, b) => a + b, 0) / wTotal;
    const actual = speechBefore(g.start) / speechTotal;
    const err = Math.abs(actual - expected);
    if (err > 0.05) {
      throw new Error(
        `${file}: boundary ${i + 1} at ${g.start.toFixed(2)}s sits at ${(actual * 100).toFixed(1)}% ` +
          `of the speech but the script predicts ${(expected * 100).toFixed(1)}% — does this take match the script?`,
      );
    }
    console.log(
      `  boundary ${i + 1}: ${g.start.toFixed(2)}-${g.end.toFixed(2)}s ` +
        `(gap ${(g.end - g.start).toFixed(2)}s, ${(actual * 100).toFixed(1)}% vs ${(expected * 100).toFixed(1)}% expected)`,
    );
  });

  return { total, gaps: longest, leadIn: gaps[0].start === 0 ? gaps[0].end : 0 };
};

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
  return {
    name,
    source: fromRecordings ? 'per-line recordings' : `Kokoro ${VOICE} @ ${cut.speed}x`,
    audio: `vo-${name}.mp3`,
    totalSeconds,
    totalFrames,
    beats,
    order,
    cues,
    parts,
    chainRows: cut.chainRows,
  };
};

/**
 * Derives the timing block from a single continuous take.
 *
 * Cuts land on the MIDPOINT of each boundary pause, so the outgoing shot keeps a little
 * tail and the incoming one gets a little pre-roll before the voice arrives.
 */
const measureMaster = (name, cut, file) => {
  console.log(`\n== ${name} (master take)`);
  const { total, gaps } = findBoundaries(file, cut);
  const totalFrames = Math.round(total * FPS);
  const mid = (g) => (g.start + g.end) / 2;

  // One boundary per line gap; beats group lines, so `balance` spans the first two.
  const lineStarts = [0, ...gaps.map(mid)];
  const beats = {};
  const order = [];
  cut.lines.forEach((line, i) => {
    if (!beats[line.beat]) {
      beats[line.beat] = { from: f(lineStarts[i]), durationInFrames: 0 };
      order.push(line.beat);
    }
  });
  order.forEach((k, i) => {
    const end = i + 1 < order.length ? beats[order[i + 1]].from : totalFrames;
    beats[k].durationInFrames = end - beats[k].from;
  });

  const cues = {
    // the frame line 2's speech actually starts
    rollStart: f(gaps[0].end) - beats.balance.from,
    // 4 frames before line 6's speech ends
    slam: f(gaps[5].start) - 4 - beats.run.from,
  };

  console.log(`  -> ${total.toFixed(2)}s / ${totalFrames} frames`);
  return {
    name,
    source: `master (${path.basename(file)})`,
    audio: `vo-source/${name}.mp3`,
    totalSeconds: total,
    totalFrames,
    beats,
    order,
    cues,
    parts: cut.lines.map((l, i) => ({ ...l, spoken: 0, n: i + 1 })),
    chainRows: cut.chainRows,
  };
};

const built = Object.entries(CUTS).map(([name, cut]) => {
  const master = path.join(ROOT, 'public', 'vo-source', `${name}.mp3`);
  return existsSync(master) ? measureMaster(name, cut, master) : buildCut(name, cut);
});

// ---- generate src/vo-timing.ts ----------------------------------------------------
const block = (b) => `  ${b.name}: {
    /** ${b.source} */
    audio: '${b.audio}',
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
${b.parts.map((p, i) => `      { n: ${i + 1}, beat: '${p.beat}' },`).join('\n')}
    ],
  },`;

const ts = `/**
 * GENERATED by scripts/make-vo.mjs — do not edit by hand.
 *
 * Measured from the audio in public/.
${built.map((b) => ` * ${b.name}: ${b.totalSeconds.toFixed(2)}s / ${b.totalFrames} frames — ${b.source}`).join('\n')}
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
