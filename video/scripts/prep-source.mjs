// Prepares the Inflation short's source footage for Remotion.
//
// The camera-negative is HEVC (hvc1), and neither Chromium nor Remotion's
// preview can decode H.265 — Studio would show a black frame and the render
// would fail. So the source is transcoded once to H.264 and that transcode
// becomes the composition's input.
//
// Two deliberate choices:
//
//   * No scaling. The source is 1072x1920 (0.5583 aspect), the canvas is
//     1080x1920 (0.5625). Scaling to fit would stretch it horizontally by
//     0.75%. Instead the frame stays native and the composition covers with
//     `objectFit: cover`, which preserves the aspect and crops ~7px off the
//     top and bottom. One fewer resample, and no distortion.
//   * CRF 17. The source is only 1778 kb/s, so this is visually transparent
//     against what we were given — there is no detail left to protect.
//
// The AAC track is stream-copied into the same file, so <OffthreadVideo> in
// the composition carries the voiceover and there is no second asset to keep
// in sync.
//
// Usage: node scripts/prep-source.mjs [path to .MOV]

import {spawnSync} from 'child_process';
import {existsSync, mkdirSync, statSync} from 'fs';
import {dirname} from 'path';

const FFMPEG = 'node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg';
const SRC =
  process.argv[2] ??
  '/root/.claude/uploads/6f8e6ed1-8627-5421-a5e7-cd5f1113df20/742e218e-Inflation.MOV';
const VIDEO_OUT = 'public/inflation.mp4';

if (!existsSync(SRC)) {
  console.error(`source not found: ${SRC}`);
  console.error('Uploads are ephemeral — re-attach the file, or pass a path.');
  process.exit(1);
}

const ff = (args, label) => {
  mkdirSync(dirname(args[args.length - 1]), {recursive: true});
  const r = spawnSync(FFMPEG, ['-hide_banner', '-y', ...args], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
  if (r.status !== 0) {
    console.error(`${label} failed:\n${r.stderr?.slice(-4000) ?? ''}`);
    process.exit(1);
  }
};

console.log('transcoding HEVC -> H.264 (this takes a minute)…');
ff(
  [
    '-i', SRC,
    '-map', '0:v:0',
    '-c:v', 'libx264',
    '-preset', 'slow',
    '-crf', '17',
    '-pix_fmt', 'yuv420p',
    '-color_primaries', 'bt709',
    '-color_trc', 'bt709',
    '-colorspace', 'bt709',
    // Keep the source cadence exactly: 24fps in, 24fps out, no pull-up.
    '-r', '24',
    '-movflags', '+faststart',
    // The voiceover rides along untouched — no re-encode, no drift.
    '-map', '0:a:0',
    '-c:a', 'copy',
    VIDEO_OUT,
  ],
  'video transcode',
);

console.log(`  ${VIDEO_OUT}  ${(statSync(VIDEO_OUT).size / 1e6).toFixed(1)} MB`);
console.log('done.');
