import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, posterize, hashNoise, W, H} from './theme';

/**
 * The film treatment "sandwich".
 *
 * Order matters: grade -> scanlines -> two grain passes at different scales and
 * blend modes -> corner blur -> vignette. Each pass is weak on its own; stacked
 * they are what turns a flat digital chart into something that reads as shot.
 */

/** Animated grain, stepped at 10fps so it crawls like emulsion, not like noise. */
const Grain: React.FC<{
  opacity: number;
  scale: number;
  blend: React.CSSProperties['mixBlendMode'];
  seed: number;
}> = ({opacity, scale, blend, seed}) => {
  const frame = useCurrentFrame();
  const step = posterize(frame, 3);
  const dx = hashNoise(step, seed) * 60;
  const dy = hashNoise(step, seed + 13) * 60;

  return (
    <AbsoluteFill
      style={{
        opacity,
        mixBlendMode: blend,
        transform: `translate(${dx}px, ${dy}px) scale(1.3)`,
        pointerEvents: 'none',
      }}
    >
      {/* Rendered at half resolution and stretched: feTurbulence over a full
          1080x1920 rect twice per frame dominates the render otherwise, and at
          this grain size the upscale is invisible. */}
      <svg width={W / 2} height={H / 2} style={{width: '100%', height: '100%'}}>
        <filter id={`grain-${seed}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency={scale}
            numOctaves={3}
            stitchTiles="stitch"
            seed={seed + (step % 7)}
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
      </svg>
    </AbsoluteFill>
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

/** Lens falloff: corners go soft, so the eye is pinned to the middle third. */
const CornerBlur: React.FC = () => (
  <AbsoluteFill
    style={{
      backdropFilter: 'blur(4px)',
      WebkitMaskImage:
        'radial-gradient(ellipse 80% 62% at 50% 46%, rgba(0,0,0,0) 72%, rgba(0,0,0,1) 100%)',
      maskImage:
        'radial-gradient(ellipse 80% 62% at 50% 46%, rgba(0,0,0,0) 72%, rgba(0,0,0,1) 100%)',
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
    <Grain opacity={0.16} scale={0.5} blend="overlay" seed={3} />
    <Grain opacity={0.09} scale={0.2} blend="soft-light" seed={29} />
    <CornerBlur />
    <Vignette />
  </AbsoluteFill>
);
