/**
 * Shared palette, type and motion helpers.
 *
 * The palette is sampled from the source render so the re-treated short still
 * reads as the same series: the chart keeps its cream/olive/rust document look,
 * but it now sits on a dark cinematic canvas instead of a flat beige page.
 */
export {ANTON, INTER} from './fonts';

export const C = {
  ink: '#0B0B0C',
  ink2: '#151517',
  cream: '#F2EDE0',
  white: '#FBF9F4',
  amber: '#E8B44F',
  rust: '#C2503C',
  olive: '#8A8F5B',
  teal: '#1F5F63',
  muted: '#8A8375',
} as const;

/** 1080x1920 @ 30fps. */
export const W = 1080;
export const H = 1920;
export const FPS = 30;
export const DURATION = 1800;

/**
 * The source render is a static beige page: only rows 656-1263 ever change
 * (measured by per-row temporal variance across the 60s). Everything else is a
 * headline and a footer that never move. We crop to the live band and drop the
 * last ~68px, which held the original 24px caption pill and the axis rail —
 * both are rebuilt at a legible size in the new layout.
 */
export const BAND_Y = 656;
export const BAND_H = 539;

/** Hold a value on an N-frame grid — the "posterize time" look. */
export const posterize = (frame: number, step: number) =>
  Math.floor(frame / step) * step;

/** Deterministic [-1, 1] hash noise. */
export const hashNoise = (n: number, seed: number) => {
  const x = Math.sin(n * 12.9898 + seed * 78.233) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
};

/**
 * "Boil": the sub-pixel wander that separates a dead still from a living one.
 * Stepped at 12fps so it reads as hand-held, not as smooth CSS easing.
 */
export const boil = (frame: number, seed: number, amp = 1.2) => {
  const t = posterize(frame, 3);
  return {
    x: hashNoise(t, seed) * amp,
    y: hashNoise(t, seed + 41) * amp,
    r: hashNoise(t, seed + 97) * amp * 0.08,
  };
};

/** Film gate weave — the whole frame drifts a hair, like real projected film. */
export const gateWeave = (frame: number) => ({
  x: Math.sin(frame / 17) * 1.1 + Math.sin(frame / 6.3) * 0.4,
  y: Math.cos(frame / 21) * 1.0 + Math.sin(frame / 8.1) * 0.3,
  r: Math.sin(frame / 29) * 0.05,
});

/** Ease used for punch-ins: fast out of the gate, long settle. */
export const easeOutExpo = (t: number) =>
  t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
