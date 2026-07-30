import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { Camera, Plate } from '../lib/Plate';
import { ReserveCounter } from '../overlays/ReserveCounter';
import { useBeats, useCues, useLayout } from '../theme';

/**
 * Beats 1-2, 0:00–0:10. "Right now your bank is holding about three cents of every
 * dollar you think you own." / "Not three percent of the bank's money. Three cents of
 * YOURS."
 *
 * 16:9 splits — phone left third, figure right two thirds. 9:16 stacks — phone up top,
 * figure under it. Either way the counter is inside <Camera> so it pushes in with the
 * frame instead of sliding against it.
 */
export const Beat1Balance: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const LEN = useBeats().balance.durationInFrames;
  const cues = useCues();

  // The wide frame shows scale artefacts sooner, so it pushes in less than the tall one.
  const scale = interpolate(frame, [0, LEN], [1, L.push], { extrapolateRight: 'clamp' });

  // 4px handheld drift on two incommensurate periods so it never visibly repeats
  const driftX = Math.sin(frame / 17) * 4;
  const driftY = Math.sin(frame / 23) * 4;

  // Screen light drops as the number falls — same window as the odometer roll
  const glow = interpolate(frame, [cues.rollStart, cues.rollStart + 36], [1, 0.8], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <Camera scale={scale} x={driftX} y={driftY}>
        <Plate name="phone-balance" />
        <AbsoluteFill
          style={{
            background: `radial-gradient(${L.phoneGlow}, rgba(150,190,255,.28), transparent 70%)`,
            mixBlendMode: 'screen',
            opacity: glow,
          }}
        />
        <ReserveCounter />
      </Camera>
    </AbsoluteFill>
  );
};
