// Rewrites student-loan-scene-pack.txt's FULL VO SCRIPT block from the pack's
// own per-scene VO lines, so the block is derived rather than a second source
// of truth that can drift from the scenes.
//
// It drifted. The block as first drafted held 41 paragraphs against 46 scenes,
// and carried roughly 34 words the scene lines had since tightened away — a
// whole sentence in the two-minute check ("Both are on your statement or your
// loan servicer's site"), a looser reading of the overpaying step, and two
// beats the scenes had merged. The pack tells you to record the block exactly
// as written, so recording it would have produced a read with lines no scene
// could hold, and forced alignment is per scene.
//
// The scene lines win: they are what carries the timecodes, the captions and
// the image prompts, and they are visibly the later edit.
import {readFileSync, writeFileSync} from 'node:fs';

const here = (p) => new URL(p, import.meta.url).pathname;
const PACK = here('../../student-loan-scene-pack.txt');
const scenes = JSON.parse(readFileSync(here('./student-loan-scenes.json'), 'utf8'));

const HEAD = 'FULL VO SCRIPT — one block, ElevenLabs v3 tags included\n';
const RULE = '='.repeat(80);

// Wrap to the pack's own 80-column body width, without splitting a word.
const wrap = (line, width = 80) => {
  const out = [];
  let cur = '';
  for (const word of line.split(' ')) {
    if (cur && (cur + ' ' + word).length > width) {
      out.push(cur);
      cur = word;
    } else {
      cur = cur ? cur + ' ' + word : word;
    }
  }
  if (cur) out.push(cur);
  return out.join('\n');
};

const src = readFileSync(PACK, 'utf8');
const headAt = src.indexOf(HEAD);
if (headAt < 0) throw new Error('FULL VO SCRIPT heading not found');

const bodyAt = src.indexOf('\n', src.indexOf(RULE, headAt)) + 1;
const endAt = src.indexOf('\n' + RULE, bodyAt);
if (bodyAt <= 0 || endAt < 0) throw new Error('could not bound the VO block');

// Everything between the heading rule and the next rule, minus the blank lines
// the next section header carries in front of it.
const tail = src.slice(endAt).replace(/^\n+/, '');

// One paragraph per scene, which is what makes the block derived rather than a
// second draft. The cost is that a line suspended on an em-dash now has a
// paragraph break after it, and pasted into ElevenLabs a paragraph break reads
// as a pause. Those lines are held across the cut by design — the pack's own
// rule is to cut on the beat, and an em-dash is a beat — so the recorder is
// told which ones carry through rather than left to infer it.
const carry = scenes.filter((s) => /—\s*$/.test(s.vo)).map((s) => s.n);
const note = carry.length
  ? `\nOne paragraph per scene, in scene order. Lines ${carry.join(' and ')} end on an\n` +
    `em-dash and carry straight into the next line — read them through, no pause.\n`
  : '';

const block = note + '\n' + scenes.map((s) => wrap(s.vo)).join('\n\n') + '\n\n\n';

writeFileSync(PACK, src.slice(0, bodyAt) + block + tail);

const words = (t) => t.replace(/\[[^\]]*\]/g, ' ').trim().split(/\s+/).length;
console.log(`VO block rebuilt from ${scenes.length} scene lines, ${scenes.reduce((n, s) => n + words(s.vo), 0)} spoken words`);
