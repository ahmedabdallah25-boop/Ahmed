// Assembles the film's audio: the nineteen recorded clips in script order, with
// a silent gap cut in at each Quranic card.
//
// The pack's music-and-sound note is explicit that the cards play under silence,
// and the script's ASSEMBLY note asks for 1.5s either side of one. The clips as
// delivered are a continuous read with no room for any of that, so the gaps are
// cut here rather than left to the edit — and cut at the sentence boundaries the
// alignment found, never inside a sentence.
import {execFileSync} from 'node:child_process';
import {readFileSync, writeFileSync, mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

const here = (p) => new URL(p, import.meta.url).pathname;
const FFMPEG = here('../node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg');
const CLIPS = process.argv[2];
const OUT = process.argv[3] || here('../public/vo-parents.mp3');
if (!CLIPS) {
  console.error('usage: node scripts/build-vo-parents.mjs <clips-dir> [out.mp3]');
  process.exit(1);
}

const map = JSON.parse(readFileSync(here('./parents-clip-map.json'), 'utf8')).clips
  .sort((a, b) => a.file.split('Benjamin')[1].localeCompare(b.file.split('Benjamin')[1]));
const plan = JSON.parse(readFileSync(here('./parents-timeline-vo.json'), 'utf8'));
const cuts = plan.cards.map((c) => c.cutAt).sort((a, b) => a - b);

const tmp = mkdtempSync(join(tmpdir(), 'vo-'));
const ff = (args) => execFileSync(FFMPEG, ['-y', '-v', 'error', ...args]);

// One continuous read first, so a cut lands at the time the alignment measured
// rather than at whatever offset a clip boundary happens to sit at.
const list = join(tmp, 'clips.txt');
writeFileSync(list, map.map((c) => `file '${join(CLIPS, c.file)}'`).join('\n'));
const read = join(tmp, 'read.wav');
ff(['-f', 'concat', '-safe', '0', '-i', list, '-ar', '44100', '-ac', '1', read]);

const parts = [];
let from = 0;
cuts.forEach((at, i) => {
  const piece = join(tmp, `p${i}.wav`);
  ff(['-i', read, '-ss', String(from), '-to', String(at), piece]);
  const gap = join(tmp, `g${i}.wav`);
  ff(['-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=mono', '-t', String(plan.gap), gap]);
  parts.push(piece, gap);
  from = at;
});
const tail = join(tmp, 'tail.wav');
ff(['-i', read, '-ss', String(from), tail]);
parts.push(tail);

const partList = join(tmp, 'parts.txt');
writeFileSync(partList, parts.map((p) => `file '${p}'`).join('\n'));
ff(['-f', 'concat', '-safe', '0', '-i', partList, '-b:a', '192k', OUT]);

const dur = Number(execFileSync(FFMPEG.replace('ffmpeg', 'ffprobe'),
  ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', OUT]).toString());
console.log(`${map.length} clips + ${cuts.length} card gaps -> ${OUT}`);
console.log(`  ${dur.toFixed(2)}s (${Math.floor(dur / 60)}:${String(Math.round(dur % 60)).padStart(2, '0')}), ` +
  `plan expects ${plan.total.toFixed(2)}s`);
if (Math.abs(dur - plan.total) > 1)
  console.error(`  MISMATCH of ${(dur - plan.total).toFixed(2)}s against the timeline — rebuild the timeline`);
