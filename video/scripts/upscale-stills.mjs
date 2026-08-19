// Pre-upscales the delivered stills for the 1080p timeline.
//
// Every plate came back 1376x768, so a 1920x1080 frame already asks for a ~1.4x
// enlargement before any push starts, and the detail re-frames ask for up to 2x
// on top of that. Left to the renderer, that enlargement is the browser's own
// scaler working on every frame; done here once with Lanczos, the ink linework
// keeps its edge and the render has less to do per frame rather than more.
//
// Writes a parallel directory rather than overwriting: the originals are what
// was delivered, and they stay untouched and tracked.
import {execFileSync} from 'node:child_process';
import {readdirSync, mkdirSync, existsSync} from 'node:fs';
import {join} from 'node:path';

const here = (p) => new URL(p, import.meta.url).pathname;
const FFMPEG = here('../node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg');
const SRC = here('../public/parents');
const OUT = here('../public/parents-2x');

mkdirSync(OUT, {recursive: true});
const files = readdirSync(SRC).filter((f) => /\.(jpe?g|png)$/i.test(f));
let done = 0;
for (const f of files) {
  const out = join(OUT, f);
  if (existsSync(out)) continue;
  execFileSync(FFMPEG, ['-y', '-v', 'error', '-i', join(SRC, f),
    '-vf', 'scale=iw*2:ih*2:flags=lanczos', '-q:v', '2', out]);
  done++;
}
console.log(`${files.length} stills, ${done} upscaled 2x (lanczos) -> public/parents-2x`);
