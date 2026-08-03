#!/usr/bin/env node
// Render an HTML/GSAP page to MP4 with nothing but Chromium and ffmpeg.
//
//   node scripts/capture-html.mjs hyperframes/sample-5s.html ../media/samples/gsap-5s.mp4
//
// The page is expected to read ?f=<frame> and seek its timeline there, so each
// screenshot is a deterministic still rather than a screen recording. That is
// the whole trick: no wall-clock, no dropped frames, no capture card.
//
// Both binaries already ship with this container — Playwright's Chromium and
// Remotion's ffmpeg — so this path costs nothing and needs no extra install.

import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync, mkdtempSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname, resolve} from 'node:path';

const FPS = 30;
const SECONDS = 5;
const WIDTH = 1080;
const HEIGHT = 1920;

const CHROME =
  process.env.CHROME_BIN ??
  '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const FFMPEG =
  process.env.FFMPEG_BIN ??
  resolve('node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg');

const [page, output] = process.argv.slice(2);
if (!page || !output) {
  console.error('usage: capture-html.mjs <page.html> <out.mp4>');
  process.exit(1);
}
for (const [name, bin] of [['Chromium', CHROME], ['ffmpeg', FFMPEG]]) {
  if (!existsSync(bin)) {
    console.error(`${name} not found at ${bin} — set CHROME_BIN / FFMPEG_BIN.`);
    process.exit(1);
  }
}

const frames = FPS * SECONDS;
const shots = mkdtempSync(resolve(tmpdir(), 'capture-'));
const url = `file://${resolve(page)}`;

console.log(`Capturing ${frames} frames at ${WIDTH}x${HEIGHT}…`);
for (let f = 0; f < frames; f++) {
  execFileSync(
    CHROME,
    [
      '--headless',
      '--no-sandbox',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      `--window-size=${WIDTH},${HEIGHT}`,
      // Let fonts and the first layout settle, then freeze: the page has already
      // seeked its timeline, so there is nothing left to animate.
      '--virtual-time-budget=1200',
      `--screenshot=${shots}/${String(f).padStart(4, '0')}.png`,
      `${url}?f=${f}`,
    ],
    {stdio: 'ignore'},
  );
  if (f % 30 === 0) {
    process.stdout.write(`  frame ${f}/${frames}\n`);
  }
}

mkdirSync(dirname(resolve(output)), {recursive: true});
console.log('Encoding…');
execFileSync(
  FFMPEG,
  [
    '-y',
    '-framerate', String(FPS),
    '-i', `${shots}/%04d.png`,
    '-c:v', 'libx264',
    '-preset', 'slow',
    '-crf', '18',
    '-pix_fmt', 'yuv420p',
    resolve(output),
  ],
  {stdio: 'inherit'},
);
rmSync(shots, {recursive: true, force: true});
console.log(`Wrote ${output}`);
