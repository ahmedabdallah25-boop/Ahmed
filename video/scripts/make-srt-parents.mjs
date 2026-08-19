// Writes the subtitle track from the forced alignment, in the finished film's
// timebase — the read plus the gaps cut for the Quranic cards.
//
// One cue per script sentence, which is the grain the alignment measured. A
// sentence the read never says gets no cue rather than a guessed one.
import {readFileSync, writeFileSync} from 'node:fs';

const here = (p) => new URL(p, import.meta.url).pathname;
const units = JSON.parse(readFileSync(here('./parents-units.json'), 'utf8'));
const aligned = JSON.parse(readFileSync(here('./parents-aligned.json'), 'utf8'));
const plan = JSON.parse(readFileSync(here('./parents-timeline-vo.json'), 'utf8'));

const cuts = plan.cards.map((c) => c.cutAt).sort((a, b) => a - b);
const final = (t) => t + cuts.filter((c) => c <= t).length * plan.gap;

const stamp = (t) => {
  const ms = Math.max(0, Math.round(t * 1000));
  return `${String(Math.floor(ms / 3600000)).padStart(2, '0')}:` +
    `${String(Math.floor(ms / 60000) % 60).padStart(2, '0')}:` +
    `${String(Math.floor(ms / 1000) % 60).padStart(2, '0')},` +
    `${String(ms % 1000).padStart(3, '0')}`;
};

// A cue that runs to the next sentence's start would sit on screen through a
// [pause], and this script pauses 49 times. Hold a cue for its own speech and
// let the screen clear, unless the gap is short enough to read through.
const HOLD_THROUGH = 0.9;

const cues = [];
for (let i = 0; i < units.length; i++) {
  const a = aligned[i];
  if (a.start === null) continue;
  const next = aligned.slice(i + 1).find((x) => x.start !== null);
  const gap = next ? next.start - a.end : 0;
  const end = gap > HOLD_THROUGH ? a.end + HOLD_THROUGH / 2 : a.end;
  cues.push({start: final(a.start), end: final(end), text: units[i].text, est: a.estimated});
}

const srt = cues.map((c, i) =>
  `${i + 1}\n${stamp(c.start)} --> ${stamp(c.end)}\n${c.text}\n`).join('\n');
writeFileSync(here('../../media/parents-one-sound.srt'), srt);

const est = cues.filter((c) => c.est).length;
console.log(`${cues.length} cues written (${units.length - cues.length} unrecorded sentences skipped)`);
console.log(`  ${est} carry an interpolated boundary rather than an acoustic one`);
console.log(`  longest cue ${Math.max(...cues.map((c) => c.end - c.start)).toFixed(1)}s`);
