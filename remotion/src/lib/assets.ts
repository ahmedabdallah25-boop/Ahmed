/**
 * Asset manifest.
 *
 * Remotion runs in a browser context and cannot stat the filesystem, so a
 * missing `staticFile()` target is a hard render failure rather than a silent
 * gap. Everything optional is therefore declared here: if it is not listed, the
 * composition renders without it instead of crashing.
 *
 * As `clone/build_takes.sh` produces real files, add their names here.
 */

/**
 * Cloned-presenter takes present in public/host, mapped to their length in
 * seconds.
 *
 * The length is not decoration. A beat can ask for a source frame past the end
 * of its take — always, while the 10-second placeholder stands in for every
 * take in every script, and occasionally with a real take that came back
 * shorter than the beats assigned to it. An out-of-range request to the frame
 * extractor is never answered and the render dies on a delayRender timeout that
 * reads like a performance problem. Knowing the length lets `takeFrame()` wrap
 * the request instead. `clone/build_takes.sh` measures and prints this map.
 */
export const TAKES: Record<string, number> = {
  'placeholder.mp4': 10,
};

export const TAKE_NAMES = Object.keys(TAKES);

/** Sound effects present in public/sfx (filenames without extension). */
export const SFX: string[] = [];

/** Music beds present in public/music (filenames without extension). */
export const MUSIC: string[] = [];

/**
 * Cutaway stills present in public/memes. Generated from
 * hyperframes/evidence.html — `node hyperframes/render.mjs` re-bakes them all
 * and prints this array.
 */
export const MEMES: string[] = [
  'balance-sheet.png',
  'bank-ad-still-2.png',
  'bank-ad-still.png',
  'bingo-card.png',
  'checkout-pay-in-4.png',
  'guru-thumbnails.png',
  'hours-chart.png',
  'latte-math.png',
  'merchant-fee-table.png',
  'revolver-chart.png',
  'scale-compare.png',
  'score-breakdown.png',
];

/**
 * Locked narration track per episode, in public/vo. The cloned voice is
 * rendered once as a continuous track, picture is cut to it, and the avatar
 * takes are generated *from* it — which is the only way the lip sync holds up.
 * Host takes are muted; this is the sole voice source.
 */
export const NARRATION: Record<string, string | null> = {
  ep01: null,
};

/**
 * Any take referenced by a script falls back to the placeholder until the real
 * one is rendered, so the whole 7 minutes previews end-to-end from day one.
 */
export const resolveTake = (take: string): string =>
  take in TAKES ? take : (TAKE_NAMES[0] ?? 'placeholder.mp4');

/**
 * Wrap a source frame into a take's actual length, so no decode is ever asked
 * for a frame that doesn't exist. `frame` is in composition frames, which is
 * what OffthreadVideo's `startFrom` expects regardless of the take's own fps.
 */
export const takeFrame = (take: string, frame: number, fps: number): number => {
  const seconds = TAKES[take];
  if (!seconds) return Math.max(0, frame);
  const length = Math.max(1, Math.floor(seconds * fps) - 1);
  return ((Math.max(0, Math.round(frame)) % length) + length) % length;
};

export const hasSfx = (name?: string): name is string => !!name && SFX.includes(name);
export const hasMusic = (name?: string | null): name is string => !!name && MUSIC.includes(name);
export const hasMeme = (name: string): boolean => MEMES.includes(name);
