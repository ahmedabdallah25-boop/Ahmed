// Copies session-uploaded stills into video/public/scenes/ in IMG_#### order.
// Re-runnable: each batch of uploads is re-sorted and renumbered from scratch.
import {readdirSync, mkdirSync, copyFileSync, existsSync, rmSync} from 'node:fs';
import {join, extname} from 'node:path';

// Second argument names the destination under public/. It matters: this script
// wipes its destination before copying, so ingesting a second pack's stills
// into the default directory would delete the first pack's. `scenes` is the
// pension pack's and media/pension-default-fund.mp4 cannot be re-rendered
// without it.
const SRC = process.argv[2];
const DEST = process.argv[3] || 'scenes';
const OUT = new URL(`../public/${DEST}/`, import.meta.url).pathname;

if (!SRC || !existsSync(SRC)) {
  console.error('usage: node scripts/ingest-scenes.mjs <uploads-dir> [dest-under-public]');
  console.error('  dest defaults to "scenes" (the pension pack). Pass a new name');
  console.error('  for a new pack — the destination is wiped before copying.');
  process.exit(1);
}

if (!/^[a-z0-9-]+$/.test(DEST)) {
  console.error(`refusing to wipe "${DEST}": destination must be a plain name under public/`);
  process.exit(1);
}

const num = (f) => {
  const m = f.match(/IMG[_-]?(\d+)/i);
  return m ? Number(m[1]) : Number.POSITIVE_INFINITY;
};

const files = readdirSync(SRC)
  .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
  .sort((a, b) => num(a) - num(b) || a.localeCompare(b));

if (existsSync(OUT)) rmSync(OUT, {recursive: true});
mkdirSync(OUT, {recursive: true});

files.forEach((f, i) => {
  const dest = String(i + 1).padStart(2, '0') + extname(f).toLowerCase();
  copyFileSync(join(SRC, f), join(OUT, dest));
  console.log(dest, '<-', f);
});
console.log(`\n${files.length} stills ingested`);
