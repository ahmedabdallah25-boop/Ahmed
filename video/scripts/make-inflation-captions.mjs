// Builds the Inflation short's captions from the scene pack.
//
// This replaces the silencedetect-and-interpolate approach that was written
// before the scene pack existed. It is strictly better, and the reason is worth
// keeping in mind: the pack gives caption text PER SCENE, and the footage cuts
// between those same scenes. So a caption's start and end are not estimated at
// all — they are the cut frames themselves. The pack's own spec asks for
// exactly this: "the caption change and the picture cut land together."
//
// No speech recognition is involved and none is needed.
//
// ── THE SCENE OFFSET ────────────────────────────────────────────────────────
// The pack describes 37 scenes. The delivered footage contains 36: pack scene
// 35 (the brass balance scale, "Your money should hold its weight") was never
// generated. Its voiceover is still in the recording, so its caption is folded
// onto the house-frontage shot that follows the vault — which the pack marks as
// a silent beat with no caption of its own, so nothing is displaced.
//
// Everything before that point maps one to one. See PACK_TO_CUT below.
//
// Usage: node scripts/make-inflation-captions.mjs

import {readFileSync, writeFileSync} from 'fs';
import {CUTS, SOURCE_FRAMES} from '../src/inflation/cuts.ts';

const PACK = '../inflation-scene-pack.txt';
const TS_OUT = 'src/inflation/captions.ts';
const SRT_OUT = '../media/inflation.srt';
const FPS = 24;

/**
 * Pack scene number (1-based) -> detected scene index (0-based), or null to
 * drop. Pack 1..34 land on cuts 0..33; pack 35's caption rides cut 34, the
 * shot the pack itself leaves silent; pack 36 is that silent beat and so has no
 * caption of its own; pack 37 is the end card on the last cut.
 */
const PACK_TO_CUT = (n) => {
  if (n >= 1 && n <= 34) return n - 1;
  if (n === 35) return 34; // folded onto the house frontage
  if (n === 36) return null; // silent beat, pack gives "(none)"
  if (n === 37) return 35; // end card
  return null;
};

// ── parse the pack ───────────────────────────────────────────────────────────
const raw = readFileSync(PACK, 'utf8');
const blocks = raw.split(/^SCENE (\d+)/m);

const scenes = [];
for (let i = 1; i < blocks.length; i += 2) {
  const n = Number(blocks[i]);
  const body = blocks[i + 1];
  const grab = (label) => {
    const m = body.match(new RegExp(`^${label}:[ \\t]*(.+)$`, 'm'));
    if (!m) return '';
    const v = m[1].trim();
    return /^\(none\)$/i.test(v) ? '' : v;
  };
  scenes.push({n, line1: grab('CAPTION 1'), line2: grab('CAPTION 2')});
}

if (scenes.length !== 37) {
  console.warn(`warning: parsed ${scenes.length} scenes from the pack, expected 37`);
}

// ── map onto the footage's cuts ──────────────────────────────────────────────
const cueFor = (cut) => {
  const from = CUTS[cut];
  const to = cut + 1 < CUTS.length ? CUTS[cut + 1] : SOURCE_FRAMES;
  return {from, to};
};

const cues = [];
for (const s of scenes) {
  const cut = PACK_TO_CUT(s.n);
  if (cut === null || cut >= CUTS.length) continue;
  if (!s.line1 && !s.line2) continue;
  const {from, to} = cueFor(cut);
  cues.push({from, to, line1: s.line1, line2: s.line2, pack: s.n, cut});
}
cues.sort((a, b) => a.from - b.from);

// ── write ────────────────────────────────────────────────────────────────────
const esc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
const header = readFileSync(TS_OUT, 'utf8').split('export const CUES')[0];

writeFileSync(
  TS_OUT,
  `${header}export const CUES: Cue[] = [\n` +
    cues
      .map(
        (c) =>
          `  {from: ${c.from}, to: ${c.to}, line1: '${esc(c.line1)}'` +
          (c.line2 ? `, line2: '${esc(c.line2)}'` : '') +
          `}, // pack ${String(c.pack).padStart(2, '0')} · cut ${c.cut} · ${(
            c.from / FPS
          ).toFixed(2)}s`,
      )
      .join('\n') +
    '\n];\n',
);

const stamp = (f) => {
  const ms = Math.max(0, Math.round((f / FPS) * 1000));
  const p = (n, w = 2) => String(n).padStart(w, '0');
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(
    Math.floor(ms / 1000) % 60,
  )},${p(ms % 1000, 3)}`;
};
writeFileSync(
  SRT_OUT,
  cues
    .map(
      (c, i) =>
        `${i + 1}\n${stamp(c.from)} --> ${stamp(c.to)}\n` +
        `${c.line1}${c.line2 ? `\n${c.line2}` : ''}\n`,
    )
    .join('\n'),
);

const longest = cues.reduce(
  (a, c) => Math.max(a, c.line1.length, c.line2?.length ?? 0),
  0,
);
console.log(`${cues.length} cues -> ${TS_OUT} and ${SRT_OUT}`);
console.log(`  every boundary is a real cut in the footage — nothing interpolated`);
console.log(`  longest caption line: ${longest} characters`);
const gaps = CUTS.map((_, i) => i).filter((i) => !cues.some((c) => c.cut === i));
if (gaps.length) console.log(`  scenes with no caption: ${gaps.join(', ')}`);
