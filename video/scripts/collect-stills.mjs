// Merges generated still URLs into student-loan-stills.json, keyed by scene.
// Called as: node scripts/collect-stills.mjs <scene>=<url> [<scene>=<url> ...]
// Re-runnable: a scene given again replaces its previous URL, so a re-rolled
// scene is recorded by running this once more rather than editing the file.
import {readFileSync, writeFileSync, existsSync} from 'node:fs';

const OUT = new URL('./student-loan-stills.json', import.meta.url).pathname;
const have = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : {};

for (const arg of process.argv.slice(2)) {
  const at = arg.indexOf('=');
  const n = Number(arg.slice(0, at));
  const url = arg.slice(at + 1);
  if (!Number.isInteger(n) || n < 1 || n > 46) throw new Error(`bad scene number: ${arg.slice(0, at)}`);
  if (!/^https:\/\//.test(url)) throw new Error(`bad url for scene ${n}`);
  have[n] = url;
}

const keys = Object.keys(have).map(Number).sort((a, b) => a - b);
writeFileSync(OUT, JSON.stringify(Object.fromEntries(keys.map((k) => [k, have[k]])), null, 2) + '\n');

const missing = [];
for (let n = 1; n <= 46; n++) if (!have[n]) missing.push(n);
console.log(`${keys.length}/46 stills recorded`);
if (missing.length) console.log(`missing: ${missing.join(', ')}`);
