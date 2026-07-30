import { VO } from './vo-timing';

/** Series constants. Palette matches scripts/make-plates.mjs — change both together. */
export const W = 1920;
export const H = 1080;
export const FPS = 30;

/**
 * Geometry the beats share with the plate generator. These mirror the constants at the
 * top of scripts/make-plates.mjs; nothing checks them against each other, so if you move
 * something in the generator, move it here too.
 */
export const LAYOUT = {
  /** vault-door.png: the door is centred, so its hinge (left edge) is here. */
  doorHinge: { x: (W - 780) / 2, y: H / 2 },
  /** The arched doorway in bank-run.png, and the size shutter.png is rendered at. */
  arch: { left: (W - 380) / 2, top: 200, width: 380, height: 380 },
  /** thirty-owners.png: 10 x 3 in landscape. */
  grid: { cols: 10, rows: 3, cellW: 150, cellH: 250, gap: 22, inset: 10 },
  /** lending-cascade.png: five tiers down the left half. */
  tiers: [0, 1, 2, 3, 4].map((i) => ({
    width: 620 - i * 95,
    top: 110 + i * 190,
    centerX: 620,
  })),
  tierPitch: 190,
  tierBar: 28,
  /** rain-tile.png repeats every this many px vertically. */
  rainPeriod: 540,
} as const;

export const GOLD = '#D4A24C';
export const TEAL = '#3E8E8C';
export const NAVY = '#0B1A2E';

export const SANS = '"Helvetica Neue", Helvetica, Arial, ui-sans-serif, system-ui, sans-serif';
export const MONO = 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace';

/**
 * Beat boundaries, MEASURED from the voiceover by scripts/make-vo.mjs.
 *
 * Do not hand-edit these — change a line or a pause in that script and re-run
 * `npm run vo`. Every beat component reads its length from here, so the whole timeline
 * follows the recording. The script's own estimate was 52s; the read is 64s.
 *
 * Note each component's internal frame numbers are Sequence-LOCAL (useCurrentFrame
 * restarts at 0 inside a Sequence), so a cue 30 frames into a beat starting at 1080 is
 * local frame 30, not 1110. VO.cues holds the two that must land on a word.
 */
export const BEATS = VO.beats;
export const CUES = VO.cues;

export const TOTAL_FRAMES = VO.totalFrames;

/** The reserve ratio the whole script hangs on. */
export const RESERVE = 0.03;

/**
 * public/vo.mp3 is committed, so this is on. If you delete the file, turn this off too —
 * Remotion throws on a missing staticFile, it does not warn.
 */
export const HAS_VO = true;
