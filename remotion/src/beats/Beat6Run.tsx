import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { Plate } from '../lib/Plate';

/**
 * Beat 6, 0:30–0:36. "That's why a healthy bank dies in a single afternoon. Nothing was
 * stolen. Everyone just showed up on the same day."
 *
 * Camera locked off — no scale, no translate. The only moves are rain, and the shutter.
 * Local frames: shutter descends 60–150, slams at 150, blackout 150–156.
 */

// The arched doorway in bank-run.png: 440x460 at x=320, y=430. shutter.png is rendered
// to exactly those dimensions so it can be clipped to the arch.
const ARCH = { left: 320, top: 430, width: 440, height: 460 };

const RAIN_PERIOD = 960; // rain-tile.png repeats every 960px
const SLAM = 150;

export const Beat6Run: React.FC = () => {
  const frame = useCurrentFrame();

  const rainY = (frame * 22) % RAIN_PERIOD;

  const shutterY = interpolate(frame, [60, SLAM], [-ARCH.height, 0], {
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

      <div
        style={{
          position: 'absolute',
          left: ARCH.left,
          top: ARCH.top,
          width: ARCH.width,
          height: ARCH.height,
          borderRadius: `${ARCH.width / 2}px ${ARCH.width / 2}px 0 0`,
          overflow: 'hidden',
        }}
      >
        <Img
          src={staticFile('plates/shutter.png')}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: ARCH.width,
            height: ARCH.height,
            transform: `translateY(${shutterY}px)`,
          }}
        />
      </div>

      {/* two copies 960px apart so the tile loops with no seam */}
      {[0, -RAIN_PERIOD].map((offset) => (
        <Img
          key={offset}
          src={staticFile('plates/rain-tile.png')}
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
