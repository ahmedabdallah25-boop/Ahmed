import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C} from '../theme';

/** Static noise plate — rendered once, then only offset per frame. */
const NOISE = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'>
     <filter id='n'>
       <feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/>
       <feColorMatrix type='saturate' values='0'/>
     </filter>
     <rect width='260' height='260' filter='url(%23n)' opacity='0.6'/>
   </svg>`,
)}")`;

/** Deterministic jitter so the grain is identical on every render pass. */
const jitter = (frame: number, salt: number) => {
  const x = Math.sin((frame + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return (x - Math.floor(x)) * 260;
};

/**
 * The night-terminal backdrop: a deep well of blue-black, a chart grid that
 * breathes, two slow colour blooms, grain, and a scan line that sweeps the
 * frame once every few seconds.
 */
export const Field: React.FC<{heat?: number}> = ({heat = 0}) => {
  const frame = useCurrentFrame();
  const sweep = (frame % 190) / 190;

  return (
    <AbsoluteFill style={{backgroundColor: C.base}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 62% at 50% 16%, #16202C 0%, ${C.base} 52%, ${C.void} 100%)`,
        }}
      />

      {/* chart grid — the room this all happens in */}
      <AbsoluteFill
        style={{
          backgroundImage: `repeating-linear-gradient(to bottom, ${C.hair} 0px, ${C.hair} 1px, transparent 1px, transparent 76px)`,
          opacity: 0.9,
          transform: `translateY(${interpolate(frame % 152, [0, 152], [0, -76])}px)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `repeating-linear-gradient(to right, ${C.hair} 0px, ${C.hair} 1px, transparent 1px, transparent 76px)`,
          opacity: 0.55,
        }}
      />

      {/* two slow blooms keep the dark from ever going flat */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(34% 22% at ${
            50 + Math.sin(frame / 104) * 20
          }% ${30 + Math.cos(frame / 138) * 10}%, ${C.cool}1F 0%, transparent 72%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(40% 26% at ${
            50 - Math.cos(frame / 120) * 22
          }% ${72 + Math.sin(frame / 92) * 9}%, ${C.loss}${heat > 0 ? '2A' : '14'} 0%, transparent 74%)`,
        }}
      />

      {/* a single scan sweep, slow enough to read as atmosphere */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(to bottom, transparent ${sweep * 100 - 14}%, ${
            C.text
          }0A ${sweep * 100}%, transparent ${sweep * 100 + 14}%)`,
        }}
      />

      <AbsoluteFill
        style={{
          backgroundImage: NOISE,
          backgroundPosition: `${jitter(frame, 1)}px ${jitter(frame, 2)}px`,
          opacity: 0.09,
          mixBlendMode: 'screen',
        }}
      />

      <AbsoluteFill
        style={{
          background:
            'radial-gradient(80% 56% at 50% 46%, transparent 48%, rgba(0,0,0,0.62) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};
