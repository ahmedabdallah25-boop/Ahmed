import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Camera, Plate } from '../lib/Plate';
import { KickerCard } from '../overlays/KickerCard';
import { GOLD, SANS } from '../theme';

/**
 * Beat 8, 0:46–0:52. "Same money. One system needs you not to look. Tomorrow: where the
 * ninety-seven actually goes. No jargon, just mechanisms."
 *
 * Holds Beat 7's last camera position (scale 1.2, x -180, y -80) so the cut is
 * invisible, then darkens under the kicker type. Wordmark springs in at local 120
 * (absolute 1500).
 */
export const Beat8Kicker: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logo = spring({ frame: frame - 120, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* holds Beat 7's last camera position exactly, so the cut is invisible */}
      <Camera scale={1.2} x={-180} y={-80}>
        <Plate name="real-assets" />
      </Camera>
      <AbsoluteFill style={{ backgroundColor: '#000', opacity: 0.55 }} />

      <KickerCard />

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 130,
          textAlign: 'center',
          opacity: logo,
          transform: `translateY(${(1 - logo) * 24}px)`,
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 44,
          letterSpacing: '.06em',
          color: '#fff',
        }}
      >
        FINANCE <span style={{ color: GOLD }}>%</span> DECODED
      </div>
    </AbsoluteFill>
  );
};
