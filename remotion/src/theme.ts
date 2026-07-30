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
 * Beat boundaries in absolute frames, from the script's timings.
 *
 * These are the SCRIPT's timings, not the recording's. After vo.mp3 exists, re-cut
 * these from the waveform — every beat component reads its length from here, so the
 * whole timeline follows.
 *
 * Note each component's internal frame numbers are Sequence-LOCAL (useCurrentFrame
 * restarts at 0 inside a Sequence), so a cue at absolute 1110 inside a beat starting
 * at 1080 is local frame 30. The conversion is commented at each use.
 */
export const BEATS = {
  /** "three cents of every dollar" + "$14,208 -> $426.24"  (0:00–0:08) */
  balance: { from: 0, durationInFrames: 240 },
  /** "it isn't anywhere. it's a promise"                   (0:08–0:14) */
  vault: { from: 240, durationInFrames: 180 },
  /** "kept three, lent ninety-seven"                       (0:14–0:22) */
  cascade: { from: 420, durationInFrames: 240 },
  /** "thirty different people believe they own it"          (0:22–0:30) */
  owners: { from: 660, durationInFrames: 240 },
  /** "a healthy bank dies in a single afternoon"            (0:30–0:36) */
  run: { from: 900, durationInFrames: 180 },
  /** "your deposit stays your deposit"                      (0:36–0:46) */
  assets: { from: 1080, durationInFrames: 300 },
  /** "same money. one system needs you not to look."        (0:46–0:52) */
  kicker: { from: 1380, durationInFrames: 180 },
} as const;

export const TOTAL_FRAMES = 1560; // 52s @ 30fps

/** The reserve ratio the whole script hangs on. */
export const RESERVE = 0.03;

/**
 * Flip to true once public/vo.mp3 exists. Left off so the composition renders on a
 * clean checkout — Remotion throws on a missing staticFile, it does not warn.
 */
export const HAS_VO = false;
