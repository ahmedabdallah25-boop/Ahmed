import React from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame} from 'remotion';
import {C, posterize, hashNoise, W, H} from './theme';

/**
 * The film treatment "sandwich".
 *
 * Order matters: grade -> scanlines -> two grain passes at different scales and
 * blend modes -> corner blur -> vignette. Each pass is weak on its own; stacked
 * they are what turns a flat digital chart into something that reads as shot.
 */

/**
 * Animated grain, stepped at 10fps so it crawls like emulsion, not like noise.
 *
 * This used to be an feTurbulence filter. Animating its seed regenerated the
 * whole noise field every frame and made it, with the corner blur, most of the
 * render cost — the full 1800 frames were tracking at nearly three hours. A
 * pre-baked fractal tile that simply translates looks the same and costs
 * essentially nothing, since the compositor just repeats one texture.
 */
const Grain: React.FC<{
  opacity: number;
  size: number;
  blend: React.CSSProperties['mixBlendMode'];
  seed: number;
}> = ({opacity, size, blend, seed}) => {
  const frame = useCurrentFrame();
  const step = posterize(frame, 3);
  const dx = hashNoise(step, seed) * size;
  const dy = hashNoise(step, seed + 13) * size;

  return (
    <div
      style={{
        position: 'absolute',
        // Oversized so the per-frame jitter never exposes an edge.
        left: -size,
        top: -size,
        width: W + size * 2,
        height: H + size * 2,
        opacity,
        mixBlendMode: blend,
        backgroundImage: `url(${staticFile('grain.png')})`,
        backgroundRepeat: 'repeat',
        backgroundSize: `${size}px ${size}px`,
        transform: `translate(${dx}px, ${dy}px)`,
        pointerEvents: 'none',
      }}
    />
  );
};

/** 1.6px black line at 16% on a 4px period — the spec from the reference reel. */
const ScanLines: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundImage: `repeating-linear-gradient(
        to bottom,
        rgba(0,0,0,0.16) 0px,
        rgba(0,0,0,0.16) 1.6px,
        rgba(0,0,0,0) 1.6px,
        rgba(0,0,0,0) 4px
      )`,
      mixBlendMode: 'multiply',
      opacity: 0.4,
      pointerEvents: 'none',
    }}
  />
);

/**
 * Lens falloff, so the eye is pinned to the middle third.
 *
 * A masked `backdrop-filter: blur()` gives a truer edge softening, but headless
 * Chrome re-composites the whole frame through it every time and it was the
 * single most expensive layer here. At this radius the difference between a
 * blurred edge and a warm haze plus a slight lift is not visible at phone size.
 */
const EdgeHaze: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 76% 58% at 50% 46%,
        rgba(0,0,0,0) 68%,
        rgba(24,20,16,0.16) 86%,
        rgba(24,20,16,0.30) 100%)`,
      pointerEvents: 'none',
    }}
  />
);

const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse 92% 72% at 50% 44%,
        rgba(0,0,0,0) 52%,
        rgba(0,0,0,0.14) 80%,
        rgba(0,0,0,0.42) 100%)`,
      pointerEvents: 'none',
    }}
  />
);

/** Warm highlights, cool shadows, crushed blacks — a cheap but effective grade. */
const Grade: React.FC = () => (
  <>
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${C.amber}22 0%, transparent 45%, ${C.teal}1F 100%)`,
        mixBlendMode: 'soft-light',
        pointerEvents: 'none',
      }}
    />
    <AbsoluteFill
      style={{
        background: 'rgba(12,10,8,0.05)',
        mixBlendMode: 'multiply',
        pointerEvents: 'none',
      }}
    />
  </>
);

export const FilmTreatment: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <Grade />
    <ScanLines />
    <Grain opacity={0.17} size={420} blend="overlay" seed={3} />
    <Grain opacity={0.10} size={900} blend="soft-light" seed={29} />
    <EdgeHaze />
    <Vignette />
  </AbsoluteFill>
);
