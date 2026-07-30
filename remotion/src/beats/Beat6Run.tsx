import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, useCurrentFrame } from 'remotion';
import { Plate, usePlate } from '../lib/Plate';
import { CUES, useLayout } from '../theme';

/**
 * Beat 6, 0:35–0:43. "That's why a healthy bank dies in a single afternoon. Nothing was
 * stolen. Everyone just showed up on the same day."
 *
 * Camera locked off — no scale, no translate. The only moves are rain, and the shutter.
 * The slam is VO-synced to the end of the line, on "the same day" (CUES.slam); the
 * shutter takes the 90 frames before it to come down.
 */

const SLAM = CUES.slam;
const DESCENT = 90;

export const Beat6Run: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const shutter = usePlate('shutter');
  const rain = usePlate('rain-tile');

  const rainY = (frame * 22) % L.rainPeriod;

  const shutterY = interpolate(frame, [SLAM - DESCENT, SLAM], [-L.arch.height, 0], {
    easing: Easing.in(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // All light cuts on the impact. The doorway glow is baked into bank-run.png, so the
  // shutter occludes the arch itself and this blackout kills the surrounding bloom.
  const black = interpolate(frame, [SLAM, SLAM + 6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <Plate name="bank-run" />

      {/* shutter.png is rendered at exactly the arch's dimensions, so it clips to it */}
      <div
        style={{
          position: 'absolute',
          left: L.arch.left,
          top: L.arch.top,
          width: L.arch.width,
          height: L.arch.height,
          borderRadius: `${L.arch.width / 2}px ${L.arch.width / 2}px 0 0`,
          overflow: 'hidden',
        }}
      >
        <Img
          src={shutter}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: L.arch.width,
            height: L.arch.height,
            transform: `translateY(${shutterY}px)`,
          }}
        />
      </div>

      {/* two copies one period apart so the tile loops with no seam */}
      {[0, -L.rainPeriod].map((offset) => (
        <Img
          key={offset}
          src={rain}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            transform: `translateY(${rainY + offset}px)`,
            opacity: 0.75,
          }}
        />
      ))}

      <AbsoluteFill style={{ backgroundColor: '#000', opacity: black }} />
    </AbsoluteFill>
  );
};
