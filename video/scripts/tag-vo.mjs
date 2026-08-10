// Sets the ElevenLabs v3 performance tag on every scene VO line in
// student-loan-scene-pack.txt, then leaves sync-vo-block.mjs to rebuild the
// recording block from them.
//
// WHY THIS EXISTS. The pack was drafted with its own tag vocabulary —
// [thoughtful] and [warm] — which appears in no other pack in the repo. The
// house set, used by pension, klarna and inflation, is [serious], [emphatic],
// [calm], [whispers], [warmly] and [sad]. The two tags that carry actual
// intensity, [emphatic] and [whispers], were missing entirely, where pension
// and klarna use emphatic eight times each. Two lines also stacked two tags,
// which the pension pack's TAG NOTES forbid.
//
// PLACEMENT follows the pension rule — sparse, and strongest at the emotional
// turns — against this pack's own documented beats: the crossover at the 19/20
// cut (40%), Adam under the block at 24 (50%), the comply/default flip at 25,
// the write-off payoff at 31, and the close at 45.
//
// 25 of 46 lines carry a tag. The rest are deliberately bare: on a 46-line
// read, a tag on every line flattens into no tags at all.
import {readFileSync, writeFileSync} from 'node:fs';

const PACK = new URL('../../student-loan-scene-pack.txt', import.meta.url).pathname;

// scene -> tag, or [tag, 'text the tag goes immediately before'] to place it
// mid-line where the turn happens inside a single scene.
const TAGS = {
  1: 'serious',
  2: 'emphatic',
  4: 'calm',
  10: 'serious',
  11: 'emphatic',
  12: 'warmly',
  13: 'calm',
  14: 'emphatic',
  17: 'serious',
  19: 'emphatic',
  20: 'calm',
  22: 'serious',
  23: 'emphatic',
  24: 'sad',
  25: ['emphatic', 'That is what happens when you comply.'],
  28: 'serious',
  31: 'emphatic',
  34: 'calm',
  37: 'serious',
  38: 'warmly',
  39: 'calm',
  41: 'serious',
  44: 'calm',
  45: 'whispers',
  46: 'warmly',
};

const HOUSE = new Set(['serious', 'emphatic', 'calm', 'whispers', 'warmly', 'sad']);
for (const [n, spec] of Object.entries(TAGS)) {
  const tag = Array.isArray(spec) ? spec[0] : spec;
  if (!HOUSE.has(tag)) throw new Error(`scene ${n}: "${tag}" is not in the house tag set`);
}

let src = readFileSync(PACK, 'utf8');
let changed = 0;
let scene = 0;

// The pack wraps its body at 80 columns, so a long VO value spans more than
// one physical line — scene 25's does. Rewrapping is why this walks lines and
// splices rather than doing a single regex replace.
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
  return out;
};

const LABEL = /^(?:VO|CAPTION 1|CAPTION 2|IMAGE PROMPT):/;

const lines = src.split('\n');
for (let i = 0; i < lines.length; i++) {
  const head = lines[i].match(/^SCENE (\d+) \| /);
  if (head) {
    scene = Number(head[1]);
    continue;
  }
  if (!scene || !lines[i].startsWith('VO: ')) continue;

  // Take the label line plus any continuation lines up to the next label.
  let end = i + 1;
  while (end < lines.length && lines[end].trim() && !LABEL.test(lines[end])) end++;

  const raw = lines.slice(i, end).join(' ');
  const bare = raw.slice(4).replace(/\[\w+\]\s*/g, '').replace(/\s+/g, ' ').trim();
  const spec = TAGS[scene];

  let next;
  if (!spec) {
    next = bare;
  } else if (Array.isArray(spec)) {
    const [tag, anchor] = spec;
    if (!bare.includes(anchor)) throw new Error(`scene ${scene}: anchor not found: ${anchor}`);
    next = bare.replace(anchor, `[${tag}] ${anchor}`);
  } else {
    next = `[${spec}] ${bare}`;
  }

  const rewrapped = wrap(`VO: ${next}`);
  if (rewrapped.join(' ') !== raw.replace(/\s+/g, ' ')) changed++;
  lines.splice(i, end - i, ...rewrapped);
  i += rewrapped.length - 1;
  scene = 0;
}

writeFileSync(PACK, lines.join('\n'));

const counts = {};
for (const spec of Object.values(TAGS)) {
  const tag = Array.isArray(spec) ? spec[0] : spec;
  counts[tag] = (counts[tag] || 0) + 1;
}
console.log(`${changed} VO lines rewritten`);
console.log(`${Object.keys(TAGS).length}/46 lines tagged: ` +
  Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([t, c]) => `${t} ${c}`).join(', '));
