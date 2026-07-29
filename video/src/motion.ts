import {Easing, interpolate} from 'remotion';

// ─────────────────────────────────────────────────────────────────────────────
// Motion doctrine (HyperFrames): the film has ONE current — LEFT.
// Every ordinary seam exits left mid-motion and the next scene enters from the
// right already in flight. Reserved vectors (Z) are spent on meaning only.
// ─────────────────────────────────────────────────────────────────────────────

export const CURRENT = -1; // left
const TRAVEL = 300; // px of seam travel
const ENTRY = 11; // frames — entry is ~127% of exit (cut-the-curve inversion)
const EXIT = 8;

export type Vector = 'current' | 'arrival' | 'lift';

/**
 * Seam transform for a scene, given its local frame and length.
 * Entry picks up >50% through the notional path (never from rest);
 * exit is still moving when the cut lands.
 */
export const seam = (
  frame: number,
  durationInFrames: number,
  entryVector: Vector = 'current',
  exitVector: Vector = 'current',
) => {
  let x = 0;
  let scale = 1;
  let opacity = 1;

  // entry
  if (frame < ENTRY) {
    const p = interpolate(frame, [0, ENTRY], [0, 1], {
      easing: Easing.out(Easing.poly(4)),
      extrapolateRight: 'clamp',
    });
    if (entryVector === 'arrival') {
      // Z backward: something bigger lands — enter oversized, settle down.
      scale = interpolate(p, [0, 1], [1.28, 1]);
    } else if (entryVector === 'lift') {
      x = 0;
      scale = interpolate(p, [0, 1], [1.06, 1]);
    } else {
      x = interpolate(p, [0, 1], [-CURRENT * TRAVEL * 0.55, 0]);
    }
    opacity = interpolate(p, [0, 0.45], [0, 1], {extrapolateRight: 'clamp'});
  }

  // exit
  const e = durationInFrames - EXIT;
  if (frame > e) {
    const p = interpolate(frame, [e, durationInFrames], [0, 1], {
      easing: Easing.in(Easing.poly(4)),
      extrapolateLeft: 'clamp',
    });
    if (exitVector === 'arrival') {
      scale = interpolate(p, [0, 1], [1, 0.82]); // keep pulling back: same Z sign
    } else {
      x = interpolate(p, [0, 1], [0, CURRENT * TRAVEL]);
    }
    opacity = interpolate(p, [0.55, 1], [1, 0], {extrapolateLeft: 'clamp'});
  }

  return {x, scale, opacity};
};

/** Staged reveal: content keeps arriving on the beat. No idle wobble anywhere. */
export const reveal = (frame: number, at: number, dur = 9) => {
  const p = interpolate(frame, [at, at + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.back(1.5)),
  });
  const o = interpolate(frame, [at, at + dur * 0.6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return {
    opacity: o,
    transform: `translateY(${(1 - p) * 46}px) scale(${0.86 + p * 0.14})`,
  };
};

/** A word that gets hit — hard scale punch on the beat, then dead still. */
export const punch = (frame: number, at: number) =>
  interpolate(frame, [at, at + 3, at + 9], [1, 1.14, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.quad),
  });

export const count = (
  frame: number,
  at: number,
  dur: number,
  from: number,
  to: number,
) =>
  interpolate(frame, [at, at + dur], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.poly(3)),
  });

export const money = (n: number) =>
  '$' + Math.round(n).toLocaleString('en-US');
