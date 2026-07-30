import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { Camera, Plate } from '../lib/Plate';
import { ReserveCounter } from '../overlays/ReserveCounter';
import { BEATS, CUES } from '../theme';

const LEN = BEATS.balance.durationInFrames;

/**
 * Beats 1-2, 0:00–0:10. "Right now your bank is holding about three cents of every
 * dollar you think you own." / "Not three percent of the bank's money. Three cents of
 * YOURS."
 *
 * Landscape split: the phone holds the left third (it's the plate), the balance figure
 * gets the right two thirds. The counter is inside <Camera> so it pushes in with the
 * frame rather than sliding against it.
 */
export const Beat1Balance: React.FC = () => {
  const frame = useCurrentFrame();

  // Gentler than the portrait cut — a wide frame shows scale artefacts sooner.
  const scale = interpolate(frame, [0, LEN], [1, 1.06], { extrapolateRight: 'clamp' });

  // 4px handheld drift on two incommensurate periods so it never visibly repeats
  const driftX = Math.sin(frame / 17) * 4;
  const driftY = Math.sin(frame / 23) * 4;

  // Screen light drops as the number falls — same window as the odometer roll
  const glow = interpolate(frame, [CUES.rollStart, CUES.rollStart + 36], [1, 0.8], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <Camera scale={scale} x={driftX} y={driftY}>
        <Plate name="phone-balance" />
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(22% 38% at 22% 50%, rgba(150,190,255,.28), transparent 70%)',
            mixBlendMode: 'screen',
            opacity: glow,
          }}
        />
        <ReserveCounter />
      </Camera>
    </AbsoluteFill>
  );
};
