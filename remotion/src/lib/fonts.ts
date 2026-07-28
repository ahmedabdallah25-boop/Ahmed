/**
 * Fonts are self-hosted out of public/fonts rather than pulled from Google at
 * render time. Two reasons, both learned the hard way here: a render that
 * reaches the network can fail halfway through a seven-minute export, and a
 * headless Chromium behind a proxy fails the gstatic TLS handshake outright and
 * silently falls back to a system face — one wrong-looking title card in the
 * middle of an otherwise finished video.
 *
 * Loading is deliberately *not* done at module scope. A `delayRender()`
 * registered during module evaluation belongs to whichever page evaluated the
 * module, and on a long multi-page render some of those handles are never
 * cleared — the render then dies on a timeout whose stack points at the font
 * loader and looks nothing like the actual problem. `<FontFaces />` declares
 * the faces as plain CSS and blocks on `document.fonts` inside the component
 * lifecycle instead, so the handle is created and cleared on the same page.
 */

export const FONT_FAMILY = {
  display: 'BebasNeueLocal, Impact, sans-serif',
  caption: 'InterLocal, "Helvetica Neue", Arial, sans-serif',
  mono: 'IBMPlexMonoLocal, Menlo, monospace',
} as const;

export const FONT_FACES: { family: string; file: string; weight: string }[] = [
  { family: 'BebasNeueLocal', file: 'fonts/BebasNeue-400.woff2', weight: '400' },
  // Inter ships as a variable font — one file covers the whole weight range.
  { family: 'InterLocal', file: 'fonts/Inter-var.woff2', weight: '100 900' },
  { family: 'IBMPlexMonoLocal', file: 'fonts/IBMPlexMono-400.woff2', weight: '400' },
  { family: 'IBMPlexMonoLocal', file: 'fonts/IBMPlexMono-500.woff2', weight: '500' },
];
