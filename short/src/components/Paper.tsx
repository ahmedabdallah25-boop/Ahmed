import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
import {C} from '../theme';

/** Static grain plate — rendered once, then only translated per frame. */
const GRAIN = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'>
     <filter id='n'>
       <feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/>
       <feColorMatrix type='saturate' values='0'/>
     </filter>
     <rect width='300' height='300' filter='url(%23n)' opacity='0.5'/>
   </svg>`,
)}")`;

/** Deterministic 1-D hash so the grain jitter is identical on every render pass. */
const jitter = (frame: number, salt: number) => {
  const x = Math.sin((frame + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return (x - Math.floor(x)) * 300;
};

export const Paper: React.FC<{intensity?: number}> = ({intensity = 1}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{backgroundColor: C.paper}}>
      {/* warm top-light + settled shadow at the foot of the page */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(125% 82% at 50% 6%, #FFFAEC 0%, ${C.paper} 52%, ${C.paperDeep} 100%)`,
        }}
      />

      {/* ledger rules — the page this story is being written on */}
      <AbsoluteFill
        style={{
          backgroundImage: `repeating-linear-gradient(to bottom, ${C.inkFaint} 0px, ${C.inkFaint} 1px, transparent 1px, transparent 84px)`,
          opacity: 0.42,
          transform: `translateY(${interpolate(frame % 168, [0, 168], [0, -84])}px)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `repeating-linear-gradient(to right, ${C.inkFaint} 0px, ${C.inkFaint} 1px, transparent 1px, transparent 84px)`,
          opacity: 0.22,
        }}
      />

      {/* two slow ink washes that keep the page from ever feeling static */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(38% 26% at ${
            50 + Math.sin(frame / 96) * 16
          }% ${28 + Math.cos(frame / 130) * 9}%, ${C.olive}1C 0%, transparent 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(42% 28% at ${
            50 - Math.cos(frame / 112) * 18
          }% ${74 + Math.sin(frame / 88) * 8}%, ${C.rust}18 0%, transparent 72%)`,
        }}
      />

      {/* grain */}
      <AbsoluteFill
        style={{
          backgroundImage: GRAIN,
          backgroundPosition: `${jitter(frame, 1)}px ${jitter(frame, 2)}px`,
          opacity: 0.07 * intensity,
          mixBlendMode: 'multiply',
        }}
      />

      {/* vignette pulls the eye to the middle third */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(84% 60% at 50% 46%, transparent 56%, rgba(23,21,15,0.13) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};
