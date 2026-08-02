// Times the Inflation short's captions against the recording.
//
// Adapted from scripts/make-srt.mjs, which did the same job for Episode 2.
// Two differences: the text is one continuous voiceover rather than a
// storyboard split into scenes, and the output is vertical, so cues are much
// narrower and shorter.
//
// The method, and its limits:
//
//   1. ffmpeg silencedetect measures where speech actually starts and stops in
//      public/inflation.mp4. Those marks are real.
//   2. The script's words are laid across those speech runs in proportion to
//      their length, skipping the silences. Word positions are therefore
//      INTERPOLATED, not recognised — no ASR model host is reachable from this
//      environment, so nothing here knows what was said when.
//   3. Cues break at sentence and clause ends, capped to two short lines.
//   4. Each cue boundary is snapped to a nearby cut in the footage, so captions
//      change with the picture rather than across it.
//
// Because of (2), captions show a whole cue at a time and accent one keyword —
// a per-word karaoke sweep would be inventing precision that is not there.
// Cue boundaries land on measured pauses, so they hold up; if a cue still
// drifts against the read, nudge its text in the script and re-run.
//
// Usage: node scripts/make-inflation-srt.mjs [script.md]

import {spawnSync} from 'child_process';
import {existsSync, readFileSync, writeFileSync} from 'fs';
import {CUTS, SOURCE_FRAMES} from '../src/inflation/cuts.ts';

const FFMPEG = 'node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg';
const MEDIA = 'public/inflation.mp4';
const SCRIPT = process.argv[2] ?? '../inflation-script.md';
const TS_OUT = 'src/inflation/captions.ts';
const SRT_OUT = '../media/inflation.srt';

const FPS = 24;
const TOTAL = SOURCE_FRAMES / FPS;

// Vertical format: short lines, short cues. A Short is read at arm's length on
// a phone, and two lines of ~26 characters is about the most that can be taken
// in before the next cue is due.
const MAX_LINE = 26;
const MAX_CUE = 3.0;
const CLAUSE_CUE = 2.2;
const MIN_CUE = 1.0;
const SNAP_FRAMES = 8;

if (!existsSync(SCRIPT)) {
  console.error(`No script at ${SCRIPT}.`);
  console.error(
    'Write the voiceover there as plain prose (markdown headings and blockquote\n' +
      'markers are stripped), then re-run. Captions cannot be timed without it —\n' +
      'no speech-recognition model is reachable from this environment.',
  );
  process.exit(1);
}

// ── 1. speech intervals ──────────────────────────────────────────────────────
const run = spawnSync(
  FFMPEG,
  [
    '-hide_banner',
    '-i', MEDIA,
    // The source carries video too, and the null muxer would try to find an
    // encoder for it and fail. Only the audio is being measured.
    '-vn',
    '-af', 'silencedetect=noise=-45dB:d=0.25',
    '-f', 'null', '-',
  ],
  {encoding: 'utf8', maxBuffer: 32 * 1024 * 1024},
);
const probe = `${run.stdout ?? ''}${run.stderr ?? ''}`;
if (!/silence_start/.test(probe)) {
  throw new Error('silencedetect produced no marks — check the ffmpeg path and media file');
}
const marks = [...probe.matchAll(/silence_(start|end): ([0-9.]+)/g)].map((m) => [
  m[1],
  Number(m[2]),
]);

const speech = [];
let cursor = 0;
for (const [kind, t] of marks) {
  if (kind === 'start') {
    if (t > cursor) speech.push([cursor, Math.min(t, TOTAL)]);
  } else {
    cursor = t;
  }
}
if (cursor < TOTAL) speech.push([cursor, TOTAL]);

const speakable = speech.reduce((n, [a, b]) => n + (b - a), 0);
if (speakable <= 0) throw new Error('no speech detected in the voiceover');

// ── 2. the script ────────────────────────────────────────────────────────────
const text = readFileSync(SCRIPT, 'utf8')
  .replace(/^---[\s\S]*?---/, '') // front matter
  .replace(/^#+ .*$/gm, '') // headings
  .replace(/^>\s?/gm, '') // blockquote markers
  .replace(/[*_`]/g, '')
  .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links
  .replace(/\s+/g, ' ')
  .replace(/[—–]/g, '—')
  .trim();

const toks = text.split(' ').filter(Boolean);
if (!toks.length) throw new Error(`${SCRIPT} has no usable text`);

// ── 3. lay words across the speech time ──────────────────────────────────────
const weights = toks.map((w) => Math.max(1, w.replace(/[^A-Za-z0-9']/g, '').length));
const weightTotal = weights.reduce((a, b) => a + b, 0);

let seg = 0;
let used = 0;
const advance = (secs) => {
  let remaining = secs;
  let mark = speech[seg][0] + used;
  while (remaining > 0 && seg < speech.length) {
    const left = speech[seg][1] - (speech[seg][0] + used);
    if (remaining <= left) {
      used += remaining;
      mark = speech[seg][0] + used;
      remaining = 0;
    } else {
      remaining -= left;
      seg += 1;
      used = 0;
      mark = seg < speech.length ? speech[seg][0] : speech[speech.length - 1][1];
    }
  }
  return mark;
};

const words = [];
let at = speech[0][0];
toks.forEach((w, k) => {
  const start = at;
  const end = advance((weights[k] / weightTotal) * speakable);
  words.push({word: w, start, end});
  at = end;
});

// ── 4. group into cues ───────────────────────────────────────────────────────
const wrap = (t) => {
  if (t.length <= MAX_LINE) return t;
  const ws = t.split(' ');
  const mid = t.length / 2;
  let best = null;
  let run2 = 0;
  for (let i = 0; i < ws.length - 1; i++) {
    run2 += ws[i].length + (i ? 1 : 0);
    const a = ws.slice(0, i + 1).join(' ');
    const b = ws.slice(i + 1).join(' ');
    if (a.length > MAX_LINE || b.length > MAX_LINE) continue;
    const cost = Math.abs(run2 - mid);
    if (!best || cost < best.cost) best = {cost, a, b};
  }
  if (best) return `${best.a}\n${best.b}`;
  // Nothing splits into two lines that both fit — e.g. a long run of short
  // words with no break near the middle. Fall back to a greedy fill rather
  // than returning the line unwrapped, which would overflow the safe width.
  const lines = [];
  let cur = '';
  for (const w of ws) {
    if (!cur) cur = w;
    else if (`${cur} ${w}`.length <= MAX_LINE) cur += ` ${w}`;
    else {
      lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines.join('\n');
};

const cues = [];
let buf = [];
const flush = () => {
  if (!buf.length) return;
  cues.push({
    start: buf[0].start,
    end: buf[buf.length - 1].end,
    text: wrap(buf.map((w) => w.word).join(' ')),
  });
  buf = [];
};

for (const w of words) {
  buf.push(w);
  const span = w.end - buf[0].start;
  const flat = buf.map((x) => x.word).join(' ');
  if (
    (/[.?!]["')]?$/.test(w.word) && span >= MIN_CUE) ||
    (/[,;:—]$/.test(w.word) && span >= CLAUSE_CUE) ||
    span >= MAX_CUE ||
    flat.length >= MAX_LINE * 2
  ) {
    flush();
  }
}
flush();

for (let i = cues.length - 1; i > 0; i--) {
  if (cues[i].end - cues[i].start < 0.6) {
    cues[i - 1].end = cues[i].end;
    cues[i - 1].text = wrap(
      `${cues[i - 1].text.replace(/\n/g, ' ')} ${cues[i].text.replace(/\n/g, ' ')}`,
    );
    cues.splice(i, 1);
  }
}

// ── 5. pick the accent word ──────────────────────────────────────────────────
// One per cue, and only when a word clearly earns it: a figure, a currency, a
// percentage. Otherwise the longest content word. If nothing stands out the cue
// gets no accent at all, which is correct — gold means "this is the point", and
// it stops meaning that if every cue has some.
const STOP = new Set(
  ('the a an and or but of to in on at for with your you it is was are were that this ' +
    'they them from by as be been have has had not no so if then than what when which ' +
    'who how why into out up down over under about their there here its will would can').split(' '),
);
// The words this film is actually about. Checked before falling back to "the
// longest word", which on its own reaches for things like "somebody" and
// "already" — long, and not the point of the line.
const SALIENT =
  /^(inflation|money|monies|pound|pounds|dollar|dollars|price|prices|priced|wage|wages|salary|raise|rent|savings?|saver|savers|bank|banks|print|prints|printed|printing|debt|loan|loans|interest|riba|gold|silver|value|worth|buys?|bought|basket|receipt|shrank|shrink|shrinking|weaker|diluted|dilution|trillion|billion|million|percent|tax|taxed|exit|mechanism|halal|haram)$/i;

const keywordFor = (t) => {
  const flat = t.replace(/\n/g, ' ').split(' ');
  const figure = flat.find((w) => /[£$€]?\d/.test(w) || /%$/.test(w));
  if (figure) return figure.replace(/[.,;:!?]+$/, '');
  const content = flat
    .map((w) => w.replace(/[^A-Za-z0-9'£$€%-]/g, ''))
    .filter((w) => w.length > 3 && !STOP.has(w.toLowerCase()));
  if (!content.length) return undefined;
  const salient = content.filter((w) => SALIENT.test(w));
  const pool = salient.length ? salient : content.filter((w) => w.length > 4);
  if (!pool.length) return undefined;
  return pool.reduce((a, b) => (b.length > a.length ? b : a));
};

// ── 6. snap to the footage's cuts ────────────────────────────────────────────
const snap = (frame) => {
  let best = frame;
  let bestD = Infinity;
  for (const c of CUTS) {
    const d = Math.abs(c - frame);
    if (d < bestD) {
      bestD = d;
      best = c;
    }
  }
  return bestD <= SNAP_FRAMES ? best : frame;
};

let snapped = 0;
const frames = cues.map((c) => {
  const from0 = Math.round(c.start * FPS);
  const to0 = Math.round(c.end * FPS);
  const from = snap(from0);
  const to = snap(to0);
  if (from !== from0 || to !== to0) snapped++;
  return {...c, from, to: Math.max(to, from + 12)};
});

// Never let two cues overlap after snapping.
for (let i = 1; i < frames.length; i++) {
  if (frames[i].from < frames[i - 1].to) frames[i - 1].to = frames[i].from;
}
const final = frames.filter((c) => c.to - c.from >= 8 && c.from < SOURCE_FRAMES);

// ── 7. write ─────────────────────────────────────────────────────────────────
const esc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
const header = readFileSync(TS_OUT, 'utf8').split('export const CUES')[0];
writeFileSync(
  TS_OUT,
  `${header}export const CUES: Cue[] = [\n` +
    final
      .map((c) => {
        const kw = keywordFor(c.text);
        return (
          `  {from: ${c.from}, to: ${c.to}, text: '${esc(c.text)}'` +
          (kw ? `, keyword: '${esc(kw)}'` : '') +
          `}, // ${(c.from / FPS).toFixed(2)}s`
        );
      })
      .join('\n') +
    '\n];\n',
);

const stamp = (f) => {
  const ms = Math.max(0, Math.round((f / FPS) * 1000));
  const h = String(Math.floor(ms / 3600000)).padStart(2, '0');
  const m = String(Math.floor(ms / 60000) % 60).padStart(2, '0');
  const s = String(Math.floor(ms / 1000) % 60).padStart(2, '0');
  return `${h}:${m}:${s},${String(ms % 1000).padStart(3, '0')}`;
};
writeFileSync(
  SRT_OUT,
  final
    .map((c, i) => `${i + 1}\n${stamp(c.from)} --> ${stamp(c.to)}\n${c.text}\n`)
    .join('\n'),
);

console.log(`${final.length} cues -> ${TS_OUT} and ${SRT_OUT}`);
console.log(`  ${snapped} boundaries snapped to a cut in the footage`);
console.log(`  speech ${speakable.toFixed(1)}s of ${TOTAL.toFixed(1)}s`);
console.log(
  '\nCue boundaries are measured; word positions inside a cue are interpolated.',
);
console.log('Check the keyword accents — they are picked heuristically.');
