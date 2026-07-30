// Builds an SRT for Episode 2 from the storyboard's VO text.
//
// There is no transcript: no ASR model host is reachable from this environment,
// so the timings come from measurement rather than recognition.
//
//   1. ffmpeg silencedetect gives every speech interval in the VO.
//   2. Each scene's VO text is taken from the storyboard, and the scene's own
//      cut window comes from src/longform/timing.ts.
//   3. Words are laid across that scene's speech intervals in proportion to
//      their length, skipping the silences, so no cue starts inside a pause.
//   4. Words are grouped into cues at sentence boundaries where possible,
//      capped at 2 lines x 42 chars and ~3.4s.
//
// The result tracks the script, not the recording. Where the read departs from
// the script the cue text is still right but its timing drifts — see the
// caveats printed at the end.
//
// Usage: node scripts/make-srt.mjs [outfile]

import {spawnSync} from 'child_process';
import {readFileSync, writeFileSync} from 'fs';
import {CUTS} from '../src/longform/timing.ts';

const FFMPEG = 'node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg';
const AUDIO = 'public/vo-ep2.mp3';
const STORYBOARD = '../storyboard-ep2-halal-mortgage.md';
const OUT = process.argv[2] ?? '../media/ep2-halal-mortgage.srt';

const MAX_LINE = 42;
const MAX_CUE = 3.4;
const CLAUSE_CUE = 2.4; // past this, a comma or dash is a good enough break
const MIN_CUE = 1.1;

// ── 1. speech intervals ──────────────────────────────────────────────────────
// silencedetect reports on stderr, so both streams are read.
const run = spawnSync(
  FFMPEG,
  ['-hide_banner', '-i', AUDIO, '-af', 'silencedetect=noise=-45dB:d=0.35', '-f', 'null', '-'],
  {encoding: 'utf8', maxBuffer: 32 * 1024 * 1024},
);
const probe = `${run.stdout ?? ''}${run.stderr ?? ''}`;
if (!/silence_start/.test(probe)) {
  throw new Error('silencedetect produced no marks — check the ffmpeg path and audio file');
}
const marks = [...probe.matchAll(/silence_(start|end): ([0-9.]+)/g)].map((m) => [
  m[1],
  Number(m[2]),
]);

const total = CUTS[CUTS.length - 1];
const speech = [];
let cursor = 0;
for (const [kind, t] of marks) {
  if (kind === 'start') {
    if (t > cursor) speech.push([cursor, t]);
  } else {
    cursor = t;
  }
}
if (cursor < total) speech.push([cursor, total]);

/** Speech intervals clipped to a scene window. */
const speechIn = (from, to) =>
  speech
    .map(([a, b]) => [Math.max(a, from), Math.min(b, to)])
    .filter(([a, b]) => b - a > 0.05);

// ── 2. VO text per scene ─────────────────────────────────────────────────────
const md = readFileSync(STORYBOARD, 'utf8');
const scenes = md.split(/\n## SCENE /).slice(1);
const voPerScene = scenes.map((s) => {
  const m = s.match(/\*\*VO:\*\*\n([\s\S]*?)(?:\n\*\*|\n---)/);
  if (!m) return '';
  return m[1]
    .replace(/^>\s?/gm, '')
    .replace(/\s+/g, ' ')
    .replace(/[—–]/g, '—')
    .trim();
});

if (voPerScene.length !== CUTS.length - 1) {
  throw new Error(
    `storyboard has ${voPerScene.length} scenes, timing.ts has ${CUTS.length - 1} cuts`,
  );
}

// ── 3. lay words across each scene's speech time ─────────────────────────────
/** @type {{word: string, start: number, end: number}[]} */
const words = [];
voPerScene.forEach((text, i) => {
  if (!text) return;
  const segs = speechIn(CUTS[i], CUTS[i + 1]);
  const speakable = segs.reduce((n, [a, b]) => n + (b - a), 0);
  if (!speakable) return;

  const toks = text.split(' ').filter(Boolean);
  // Longer words take longer to say; a 1-char floor keeps punctuation honest.
  const weights = toks.map((w) => Math.max(1, w.replace(/[^A-Za-z0-9']/g, '').length));
  const weightTotal = weights.reduce((a, b) => a + b, 0);

  let seg = 0;
  let used = 0; // seconds consumed inside the current segment
  const advance = (secs) => {
    // Walk forward through the scene's speech segments, skipping silences.
    let remaining = secs;
    let mark = segs[seg][0] + used;
    while (remaining > 0 && seg < segs.length) {
      const left = segs[seg][1] - (segs[seg][0] + used);
      if (remaining <= left) {
        used += remaining;
        mark = segs[seg][0] + used;
        remaining = 0;
      } else {
        remaining -= left;
        seg += 1;
        used = 0;
        mark = seg < segs.length ? segs[seg][0] : segs[segs.length - 1][1];
      }
    }
    return mark;
  };

  let at = segs[0][0];
  toks.forEach((w, k) => {
    const dur = (weights[k] / weightTotal) * speakable;
    const start = at;
    const end = advance(dur);
    words.push({word: w, start, end});
    at = end;
  });
});

// ── 4. group words into cues ─────────────────────────────────────────────────
/** Two balanced lines: break at the word boundary nearest the middle. */
const wrap = (text) => {
  if (text.length <= MAX_LINE) return text;
  const toks = text.split(' ');
  const mid = text.length / 2;
  let best = null;
  let run = 0;
  for (let i = 0; i < toks.length - 1; i++) {
    run += toks[i].length + (i ? 1 : 0);
    const a = toks.slice(0, i + 1).join(' ');
    const b = toks.slice(i + 1).join(' ');
    if (a.length > MAX_LINE || b.length > MAX_LINE) continue;
    const cost = Math.abs(run - mid);
    if (!best || cost < best.cost) best = {cost, a, b};
  }
  return best ? `${best.a}\n${best.b}` : text;
};

const cues = [];
let buf = [];
const flush = () => {
  if (!buf.length) return;
  const text = buf.map((w) => w.word).join(' ');
  cues.push({start: buf[0].start, end: buf[buf.length - 1].end, text: wrap(text)});
  buf = [];
};

for (const w of words) {
  buf.push(w);
  const text = buf.map((x) => x.word).join(' ');
  const span = w.end - buf[0].start;
  const sentenceEnd = /[.?!]["')]?$/.test(w.word);
  const clauseEnd = /[,;:—]$/.test(w.word);
  if (
    (sentenceEnd && span >= MIN_CUE) ||
    (clauseEnd && span >= CLAUSE_CUE) ||
    span >= MAX_CUE ||
    text.length >= MAX_LINE * 2
  ) {
    flush();
  }
}
flush();

// Merge any cue too short to read into its neighbour.
for (let i = cues.length - 1; i > 0; i--) {
  if (cues[i].end - cues[i].start < 0.7) {
    cues[i - 1].end = cues[i].end;
    cues[i - 1].text = wrap(cues[i - 1].text.replace(/\n/g, ' ') + ' ' + cues[i].text.replace(/\n/g, ' '));
    cues.splice(i, 1);
  }
}

// ── 5. write the SRT ─────────────────────────────────────────────────────────
const stamp = (t) => {
  const ms = Math.max(0, Math.round(t * 1000));
  const h = String(Math.floor(ms / 3600000)).padStart(2, '0');
  const m = String(Math.floor((ms % 3600000) / 60000)).padStart(2, '0');
  const s = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
  return `${h}:${m}:${s},${String(ms % 1000).padStart(3, '0')}`;
};

const srt = cues
  .map((c, i) => `${i + 1}\n${stamp(c.start)} --> ${stamp(c.end)}\n${c.text}\n`)
  .join('\n');
writeFileSync(OUT, srt + '\n');

console.log(`${cues.length} cues -> ${OUT}`);
console.log(`speech measured: ${speech.reduce((n, [a, b]) => n + (b - a), 0).toFixed(1)}s of ${total}s`);
