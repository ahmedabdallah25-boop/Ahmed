// Writes ../media/pension-default-fund.srt from the forced alignment.
// The on-screen captions are the pack's shortened CAPTION lines; the subtitle
// track is the spoken script itself, timed to the same boundaries.
import {readFileSync, writeFileSync} from 'node:fs';

const here = (p) => new URL(p, import.meta.url);
const aligned = JSON.parse(readFileSync(here('./aligned.json'), 'utf8'));
const pack = readFileSync(here('../../pension-scene-pack.txt'), 'utf8');
const lines = pack.split(/VOICEOVER — full script[^\n]*\n/)[1].split(/\nTAG NOTES:/)[0]
  .split('\n').filter((l) => l.trim() && !/^=+$/.test(l.trim()));

if (lines.length !== aligned.length) throw new Error(`${lines.length} lines vs ${aligned.length} timings`);

const stamp = (t) => {
  const ms = Math.max(0, Math.round(t * 1000));
  const h = String(Math.floor(ms / 3600000)).padStart(2, '0');
  const m = String(Math.floor(ms / 60000) % 60).padStart(2, '0');
  const s = String(Math.floor(ms / 1000) % 60).padStart(2, '0');
  return `${h}:${m}:${s},${String(ms % 1000).padStart(3, '0')}`;
};

const out = lines.map((line, i) => {
  const a = aligned[i];
  const text = line.replace(/\[[^\]]*\]/g, '').replace(/\s+/g, ' ').trim();
  return `${i + 1}\n${stamp(a.start)} --> ${stamp(a.end)}\n${text}\n`;
}).join('\n');

writeFileSync(here('../../media/pension-default-fund.srt'), out);
console.log(`${lines.length} subtitle cues written`);
