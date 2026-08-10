// Parses ../pension-scene-pack.txt into a structured scene index.
import {readFileSync, writeFileSync} from 'node:fs';

const src = readFileSync(new URL('../../pension-scene-pack.txt', import.meta.url), 'utf8');
const toSec = (t) => {const [m, s] = t.split(':').map(Number); return m * 60 + s;};

const scenes = [];
let cur = null;
for (const line of src.split('\n')) {
  const head = line.match(/^SCENE (\d+) \| (\d+:\d+)-(\d+:\d+)(.*)$/);
  if (head) {
    cur = {n: Number(head[1]), packStart: toSec(head[2]), packEnd: toSec(head[3]), note: head[4].replace(/^\s*\|\s*/, '').trim()};
    scenes.push(cur);
    continue;
  }
  if (!cur) continue;
  const vo = line.match(/^VO: (.*)$/);
  if (vo) {cur.vo = vo[1].trim(); continue;}
  const c1 = line.match(/^CAPTION 1: (.*)$/);
  if (c1) {cur.cap1 = c1[1].trim(); continue;}
  const c2 = line.match(/^CAPTION 2: (.*)$/);
  if (c2) {cur.cap2 = c2[1].trim(); continue;}
}

const missing = scenes.filter((s) => !s.vo || !s.cap1 || !s.cap2);
console.log(`scenes: ${scenes.length}, incomplete: ${missing.length}`);
console.log(`pack designed runtime: ${scenes.at(-1).packEnd}s`);
writeFileSync(new URL('./scenes.json', import.meta.url), JSON.stringify(scenes, null, 2));
