/**
 * Bake the evidence frames in evidence.html to PNGs for the Remotion timeline.
 *
 *   node hyperframes/render.mjs
 *
 * Screenshots each <section class="frame"> at its own id, at 1920x1080, into
 * remotion/public/memes/, then prints the MEMES array to paste into
 * remotion/src/lib/assets.ts.
 *
 * Uses the Chromium already on the box (PLAYWRIGHT_BROWSERS_PATH), so this does
 * not download anything.
 */

import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { mkdir, readFile, readdir } from 'node:fs/promises';

const here = dirname(fileURLToPath(import.meta.url));
const page_url = 'file://' + resolve(here, 'evidence.html');
const outDir = resolve(here, '../remotion/public/memes');

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await page.goto(page_url, { waitUntil: 'networkidle' });
// The @font-face files are loaded off disk relative to the HTML; without this
// the first frame screenshots in a fallback face.
await page.evaluate(() => document.fonts.ready);

const ids = await page.$$eval('section.frame', (nodes) => nodes.map((n) => n.id));

for (const id of ids) {
  const el = await page.$(`#${id}`);
  await el.screenshot({ path: resolve(outDir, `${id}.png`) });
  console.log(`→ ${id}.png`);
}

await browser.close();

const written = (await readdir(outDir)).filter((f) => f.endsWith('.png')).sort();
console.log('\nPaste into remotion/src/lib/assets.ts:\n');
console.log('export const MEMES: string[] = [');
for (const f of written) console.log(`  '${f}',`);
console.log('];');
