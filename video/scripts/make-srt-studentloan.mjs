// Writes ../../media/student-loan-crossover.srt from the forced alignment.
// The on-screen captions are the pack's shortened CAPTION lines; the subtitle
// track is the spoken script itself, timed to the same boundaries as the cuts.
// Same split as part16's track — one cue per scene — because caption treatment
// is a held variable on this upload.
import {readFileSync, writeFileSync} from 'node:fs';

const here = (p) => new URL(p, import.meta.url).pathname;
const scenes = JSON.parse(readFileSync(here('./student-loan-scenes.json'), 'utf8'));
const aligned = JSON.parse(readFileSync(here('./aligned-studentloan.json'), 'utf8'));

if (scenes.length !== aligned.length)
  throw new Error(`${scenes.length} lines vs ${aligned.length} timings`);

const stamp = (t) => {
  const ms = Math.max(0, Math.round(t * 1000));
  const h = String(Math.floor(ms / 3600000)).padStart(2, '0');
  const m = String(Math.floor(ms / 60000) % 60).padStart(2, '0');
  const s = String(Math.floor(ms / 1000) % 60).padStart(2, '0');
  return `${h}:${m}:${s},${String(ms % 1000).padStart(3, '0')}`;
};

const out = scenes.map((scene, i) => {
  const a = aligned[i];
  // The v3 performance tags are direction for the read, not words anyone said.
  const text = scene.vo.replace(/\[[^\]]*\]/g, '').replace(/\s+/g, ' ').trim();
  return `${i + 1}\n${stamp(a.start)} --> ${stamp(a.end)}\n${text}\n`;
}).join('\n');

writeFileSync(here('../../media/student-loan-crossover.srt'), out);

const longest = Math.max(...aligned.map((a) => a.end - a.start));
console.log(`${scenes.length} subtitle cues written, longest ${longest.toFixed(1)}s`);
