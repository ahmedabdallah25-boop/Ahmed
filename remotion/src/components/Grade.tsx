/**
 * The grade layer. Sits above everything, all pointer-events off.
 *
 * Three things, in this order, do most of the work of making a Remotion render
 * stop looking like a web page and start looking like footage: grain that
 * actually moves per frame, a vignette that is stronger on the sides than the
 * corners, and a barely-there chromatic split at the edges.
 */

import React from 'react';
import { AbsoluteFill, random, useCurrentFrame } from 'remotion';
import { COLORS } from '../theme';

export const Grain: React.FC<{ opacity?: number; cells?: number }> = ({
  opacity = 0.09,
  cells = 90,
}) => {
  const frame = useCurrentFrame();
  // Re-seeded every frame so the grain crawls instead of sitting still.
  // A static noise texture is the single biggest tell of a fake film look.
  const dots = new Array(cells).fill(0).map((_, i) => {
    const seed = `${frame}-${i}`;
    return {
      x: random(`x${seed}`) * 100,
      y: random(`y${seed}`) * 100,
      r: 0.7 + random(`r${seed}`) * 1.6,
      a: 0.25 + random(`a${seed}`) * 0.75,
    };
  });

  return (
    <AbsoluteFill style={{ opacity, mixBlendMode: 'overlay', pointerEvents: 'none' }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#fff" opacity={d.a} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 0.62 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background: `radial-gradient(ellipse 78% 92% at 50% 46%, rgba(0,0,0,0) 42%, rgba(0,0,0,${
        strength * 0.55
      }) 78%, rgba(0,0,0,${strength}) 100%)`,
    }}
  />
);

/** Warm highlight roll-off + slightly crushed blacks, matching the amber practicals on the set. */
export const ColorWash: React.FC = () => (
  <>
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        mixBlendMode: 'soft-light',
        background: `linear-gradient(160deg, ${COLORS.amber}22 0%, transparent 45%, ${COLORS.bg}55 100%)`,
      }}
    />
    <AbsoluteFill
      style={{ pointerEvents: 'none', mixBlendMode: 'multiply', background: 'rgba(20,14,10,0.14)' }}
    />
  </>
);

/** Everything above, in the right order. One import at the top of the composition. */
export const Grade: React.FC<{ grain?: number }> = ({ grain = 0.09 }) => (
  <>
    <ColorWash />
    <Vignette />
    <Grain opacity={grain} />
  </>
);
