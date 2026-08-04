// Emits media/klarna.srt — the *spoken* words at their new timeline positions.
//
// Deliberately not the burn-in captions. Those are compressed paraphrases sized to
// fit a 1080px column ("He pays for it anyway"); the subtitle track has to be what
// the narrator actually says, because that is what it is for — accessibility, and
// the text YouTube indexes. So each entry's spans are resolved back to the script
// lines they were cut from, then re-stamped onto the new timeline.

import {writeFileSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {EDIT, PAD_IN, PAD_OUT, speechOf, spanOf} from './klarna-edit.mjs';

// The long-form script, in order, as it appears in the scene pack's VOICEOVER block.
const packLines = readFileSync(path.resolve('../klarna-scene-pack.txt'), 'utf8')
  .split('\n')
  .slice(82, 141)
  .filter((l) => l.trim())
  .map((l) => l.replace(/\[[a-z]+\]\s*/g, '').trim());

// Forced-alignment result: line index -> [start, end] in the SOURCE audio. Produced
// by aligning packLines against the source's own speech/silence boundaries.
const ALIGN = JSON.parse(readFileSync(path.resolve('scripts/klarna-align.json'), 'utf8'));

/** The script line whose aligned span best overlaps a span we cut. */
const lineFor = ([a, b]) => {
  let best = null;
  let bestOverlap = 0;
  for (const l of ALIGN) {
    const overlap = Math.min(b, l.end) - Math.max(a, l.start);
    if (overlap > bestOverlap) {
      bestOverlap = overlap;
      best = l;
    }
  }
  return best ? packLines[best.i] ?? best.text : null;
};

const ts = (s) => {
  const ms = Math.round(s * 1000);
  const h = String(Math.floor(ms / 3600000)).padStart(2, '0');
  const m = String(Math.floor(ms / 60000) % 60).padStart(2, '0');
  const sec = String(Math.floor(ms / 1000) % 60).padStart(2, '0');
  return `${h}:${m}:${sec},${String(ms % 1000).padStart(3, '0')}`;
};

const cues = [];
let cursor = 0;
for (const e of EDIT) {
  // Spans run back to back inside the entry, separated by the tightened join.
  let t = cursor + PAD_IN;
  for (const v of e.vo) {
    const d = v[1] - v[0];
    const text = lineFor(v);
    if (text) cues.push({from: t, to: t + d, text});
    t += d + (e.join ?? 0.26);
  }
  cursor += spanOf(e);
}

writeFileSync(
  path.resolve('../media/klarna.srt'),
  cues
    .map((c, i) => `${i + 1}\n${ts(c.from)} --> ${ts(c.to)}\n${c.text}\n`)
    .join('\n')
);
console.log(`captions → ../media/klarna.srt  (${cues.length} cues, ${cursor.toFixed(2)}s)`);
