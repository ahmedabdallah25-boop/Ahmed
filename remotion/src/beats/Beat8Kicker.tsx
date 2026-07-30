import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Camera, Plate } from '../lib/Plate';
import { KickerCard } from '../overlays/KickerCard';
import { BEATS, GOLD, SANS, useLayout } from '../theme';

/**
 * Beat 8, 0:54–1:04. "Same money. One system needs you not to look. Tomorrow: where the
 * ninety-seven actually goes. No jargon, just mechanisms."
 *
 * Holds Beat 7's final camera position so the cut is invisible, then darkens under the
 * kicker type. Wordmark springs in at local 120.
 */
export const Beat8Kicker: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = useLayout();

  const logo = spring({ frame: frame - 120, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* Beat 7's crane ends at L.crane, so start here — otherwise the cut jumps. */}
      <Camera scale={L.vaultCam.scale} x={L.vaultCam.x} y={L.vaultCam.y + L.crane}>
        <Plate name="real-assets" />
      </Camera>
      <AbsoluteFill style={{ backgroundColor: '#000', opacity: 0.55 }} />

      <KickerCard />

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: L.kicker.wordmark,
          textAlign: 'center',
          opacity: logo,
          transform: `translateY(${(1 - logo) * 24}px)`,
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: L.kicker.wordmarkSize,
          letterSpacing: '.06em',
          color: '#fff',
        }}
      >
        FINANCE <span style={{ color: GOLD }}>%</span> DECODED
      </div>
    </AbsoluteFill>
  );
};
