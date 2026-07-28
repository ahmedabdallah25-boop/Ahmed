/**
 * Look book for the channel's long-form cut.
 *
 * Reverse-engineered from the Kurtis Conner commentary grade (warm practicals,
 * crushed-but-not-black shadows, a hair of grain) and re-tinted to the
 * Finance % Decoded set that the host plate was shot on: charcoal acoustic
 * foam, amber LED strips, walnut desk.
 */

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

/** 7 minutes on the nose. Every scene budget in the scripts sums to this. */
export const RUNTIME_FRAMES = 7 * 60 * FPS;

export const COLORS = {
  /** Never pure black — the grade lifts to this so grain stays visible. */
  bg: '#0d0b0a',
  bgLift: '#191412',
  /** Amber LED strip on the foam wall behind the host. */
  amber: '#f0a03c',
  amberDeep: '#b4671a',
  walnut: '#6d4a30',
  /** Caption white is slightly warm so it sits in the grade, not on top of it. */
  white: '#fdf8f2',
  /** The "wrong answer" red used for MS-Paint annotations and receipts. */
  red: '#e5342a',
  /** The "this is the real number" green. Used sparingly — it reads as a punchline. */
  green: '#38c172',
  /** Sponsor / bumper accent. */
  cyan: '#4cc8e0',
  shadow: 'rgba(0,0,0,0.55)',
} as const;

/**
 * `display` is Bebas Neue — the same face the channel's Shorts already burn in
 * (see automation/cinematic_captions.py), so a Short clipped out of this
 * long-form is visually continuous with the video it came from.
 * `caption` is Inter for body weight, `mono` is IBM Plex Mono for receipts,
 * fine print, and the undercut gags.
 */
export { FONT_FAMILY as FONTS } from './lib/fonts';

/**
 * Cut rhythm. The whole style lives here: the edit never lets a shot sit.
 * `breath` is the longest a static host shot is allowed to run before the
 * timeline is required to punch in, cut away, or jump-cut.
 */
export const RHYTHM = {
  breath: 4.5 * FPS,
  /** Hard punch-in: no easing, lands in a single frame. */
  punchFrames: 1,
  /** A beat of dead air after a joke. Comedy lives in this number. */
  deadAir: Math.round(1.1 * FPS),
  /** Emphasis word cards flash and leave. Long enough to read, short enough to feel involuntary. */
  flash: 9,
} as const;

export const px = (n: number) => `${n}px`;
