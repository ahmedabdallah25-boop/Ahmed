import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { Camera, Plate } from '../lib/Plate';
import { ReserveCounter } from '../overlays/ReserveCounter';
import { BEATS } from '../theme';

const LEN = BEATS.balance.durationInFrames; // 240

/**
 * Beats 1-2, 0:00–0:08. "Right now your bank is holding about three cents of every
 * dollar you think you own." / "Not three percent of the bank's money. Three cents of
 * YOURS."
 *
 * The counter lives inside <Camera> so it scales with the push-in and stays welded to
 * the phone screen. Pulling it out drifts it off the glass by the end of the beat.
 */
export const Beat1Balance: React.FC = () => {
  const frame = useCurrentFrame();

  const scale = interpolate(frame, [0, LEN], [1, 1.08], { extrapolateRight: 'clamp' });

  // 4px handheld drift on two incommensurate periods so it never visibly repeats
  const driftX = Math.sin(frame / 17) * 4;
  const driftY = Math.sin(frame / 23) * 4;

  // Screen light drops as the number falls (same window as the odometer roll)
  const glow = interpolate(frame, [120, 156], [1, 0.8], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <Camera scale={scale} x={driftX} y={driftY}>
        <Plate name="phone-balance" />
        <AbsoluteFill
          style={{
            background: 'radial-gradient(38% 26% at 50% 44%, rgba(150,190,255,.28), transparent 70%)',
            mixBlendMode: 'screen',
            opacity: glow,
          }}
        />
        <ReserveCounter />
      </Camera>
    </AbsoluteFill>
  );
};
