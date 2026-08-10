// Parses ../../student-loan-scene-pack.txt into a structured scene index.
// Same shape as parse-pack.mjs produces for the pension pack, but the student
// loan pack carries two CAPTION lines per scene rather than one, so the caption
// fields are kept separate here and joined only at burn-in.
import {readFileSync, writeFileSync} from 'node:fs';

const here = (p) => new URL(p, import.meta.url).pathname;
const src = readFileSync(here('../../student-loan-scene-pack.txt'), 'utf8');

// The SCENES section only — everything above it is rationale, everything below
// is upload metadata, and both contain lines that would otherwise match.
const body = src.slice(src.indexOf('\nSCENES\n'));

const blocks = body.split(/^-{40,}$/m);
const scenes = [];

for (let i = 0; i < blocks.length; i++) {
  const head = blocks[i].trim();
  const m = head.match(/^SCENE (\d+) \| (\d+:\d+)-(\d+:\d+)(?: \| (.+))?$/m);
  if (!m) continue;

  // The header sits in its own block; the content follows in the next one.
  const rest = (blocks[i + 1] || '').trim();

  // No `m` flag on purpose: IMAGE PROMPT's value starts on the line after its
  // label, so a multiline `$` would terminate the capture before it began.
  // Here `$` means end-of-block and the label is anchored with an explicit \n.
  const field = (label) => {
    const re = new RegExp(`(?:^|\\n)${label}:[ \\t]*([\\s\\S]*?)(?=\\n[A-Z][A-Z0-9 ]*:|$)`);
    const hit = rest.match(re);
    return hit ? hit[1].trim().replace(/\s*\n\s*/g, ' ') : '';
  };

  const secs = (t) => {
    const [mm, ss] = t.split(':').map(Number);
    return mm * 60 + ss;
  };

  scenes.push({
    n: Number(m[1]),
    beat: m[4] || '',
    start: secs(m[2]),
    end: secs(m[3]),
    vo: field('VO'),
    caption1: field('CAPTION 1'),
    caption2: field('CAPTION 2'),
    prompt: field('IMAGE PROMPT'),
  });
}

const out = here('./student-loan-scenes.json');
writeFileSync(out, JSON.stringify(scenes, null, 2) + '\n');

console.log(`${scenes.length} scenes parsed -> ${out}`);
console.log(`runtime from timecodes: ${scenes.at(-1)?.end}s`);

let bad = 0;
for (const key of ['vo', 'caption1', 'caption2', 'prompt']) {
  const missing = scenes.filter((s) => !s[key]).map((s) => s.n);
  if (missing.length) {
    console.error(`missing ${key}: scenes ${missing.join(', ')}`);
    bad++;
  }
}
if (bad) process.exit(1);
