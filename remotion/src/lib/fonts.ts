/**
 * Fonts are self-hosted out of public/fonts rather than pulled from Google at
 * render time. Two reasons, both learned the hard way: a render that reaches
 * the network can fail halfway through a seven-minute export, and a headless
 * Chromium behind a proxy will silently fall back to a system face and leave
 * one wrong-looking title card in the middle of an otherwise finished video.
 *
 * `loadFont` registers with delayRender, so the renderer waits for the file.
 */

import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';

const DISPLAY = 'BebasNeueLocal';
const CAPTION = 'InterLocal';
const MONO = 'IBMPlexMonoLocal';

const loaders = [
  loadFont({ family: DISPLAY, url: staticFile('fonts/BebasNeue-400.woff2'), weight: '400' }),
  // Inter ships as a variable font — one file covers the whole weight range.
  loadFont({ family: CAPTION, url: staticFile('fonts/Inter-var.woff2'), weight: '100 900' }),
  loadFont({ family: MONO, url: staticFile('fonts/IBMPlexMono-400.woff2'), weight: '400' }),
  loadFont({ family: MONO, url: staticFile('fonts/IBMPlexMono-500.woff2'), weight: '500' }),
];

export const FONT_FAMILY = {
  display: `${DISPLAY}, Impact, sans-serif`,
  caption: `${CAPTION}, "Helvetica Neue", Arial, sans-serif`,
  mono: `${MONO}, Menlo, monospace`,
} as const;

export const waitForFonts = () => Promise.all(loaders);
