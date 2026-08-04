// Pulls the 31 generated gap frames down to the filenames build-klarna.mjs adopts.
//
//   node scripts/fetch-gap-frames.mjs
//
// Writes public/broll/klarna/gap-01.jpg … gap-31.jpg, then `node
// scripts/build-klarna.mjs <source.mov>` picks every one of them up on its next
// run — that adoption is already wired, nothing else has to change.
//
// This exists as a separate step because the session that generated the frames
// could not download them. Generation goes out over the MCP transport, but the
// sandbox's own egress is policy-restricted and the CDN host answers 403 to
// CONNECT, so curl cannot reach a URL the generator returns. Run this from a
// machine with ordinary internet access.
//
// Idempotent: a frame already on disk is left alone. Pass --force to refetch.

import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync, readFileSync, writeFileSync, unlinkSync} from 'node:fs';
import path from 'node:path';

const HERE = path.dirname(new URL(import.meta.url).pathname);
const MANIFEST = JSON.parse(readFileSync(path.join(HERE, 'klarna-gap-manifest.json'), 'utf8'));
const OUT = path.resolve(HERE, '../public/broll/klarna');
const FORCE = process.argv.includes('--force');

// Same ffmpeg the rest of the pipeline uses — the generator returns PNG and the
// composition reads .jpg, so every frame is transcoded rather than renamed.
const FF = execFileSync('python3', [
  '-c',
  'import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())',
])
  .toString()
  .trim();

mkdirSync(OUT, {recursive: true});

let fetched = 0;
let skipped = 0;
const failed = [];

for (const frame of MANIFEST.frames) {
  const nn = String(frame.n).padStart(2, '0');
  const jpg = path.join(OUT, `gap-${nn}.jpg`);
  if (existsSync(jpg) && !FORCE) {
    skipped += 1;
    continue;
  }

  const url = MANIFEST.base_url + frame.file;
  const tmp = path.join(OUT, `.gap-${nn}.png`);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    writeFileSync(tmp, Buffer.from(await res.arrayBuffer()));
    execFileSync(FF, ['-hide_banner', '-loglevel', 'error', '-i', tmp, '-q:v', '2', jpg, '-y']);
    fetched += 1;
    console.log(`  gap-${nn}  ${frame.id}  ${frame.line}`);
  } catch (err) {
    // Generated images expire from the CDN eventually. A 403 or 404 here means
    // that frame has to be regenerated from klarna-gap-frames.txt, not refetched.
    failed.push(`gap-${nn} (${frame.id}): ${err.message}`);
  } finally {
    if (existsSync(tmp)) unlinkSync(tmp);
  }
}

console.log(`\nfetched ${fetched}, already present ${skipped}, failed ${failed.length}`);
for (const f of failed) console.log(`  ! ${f}`);
if (failed.length) {
  console.log('\nA failure here is usually an expired CDN URL — regenerate those frames');
  console.log('from klarna-gap-frames.txt rather than retrying this script.');
  process.exit(1);
}
console.log('\nNow: node scripts/build-klarna.mjs <source.mov>   (adopts all 31)');
