// Bundle once, then shoot a contact sheet of stills — much faster than
// calling `remotion still` per frame while iterating on the design.
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const CHROME = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const frames = process.argv.slice(2).map(Number);
const outDir = path.resolve('out/stills');
fs.mkdirSync(outDir, {recursive: true});

const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const composition = await selectComposition({
  serveUrl,
  id: 'Ep01Short',
  browserExecutable: CHROME,
});

for (const frame of frames) {
  const output = path.join(outDir, `f${String(frame).padStart(4, '0')}.png`);
  await renderStill({
    composition,
    serveUrl,
    output,
    frame,
    browserExecutable: CHROME,
    overwrite: true,
  });
  console.log('shot', frame);
}
process.exit(0);
