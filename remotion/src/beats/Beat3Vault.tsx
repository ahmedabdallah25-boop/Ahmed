import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Camera, Plate } from '../lib/Plate';
import { noise } from '../lib/rng';

/**
 * Beat 3, 0:08–0:14. "The rest isn't in a vault. It isn't anywhere. It's a promise,
 * typed into a screen."
 *
 * Local frames: door opens 0–45, camera dollies 45–180 (absolute 285–420).
 */

// vault-door.png is full-frame with the 880px door centred, so its hinge (left edge)
// sits at x=100, y=960. Rotating about anything else swings the door off its hinge.
const HINGE = '100px 960px';

const MOTES = noise(31, 60); // 20 motes x 3 values

export const Beat3Vault: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Heavy inertia + settle-bounce: damping 12 / mass 2 overshoots ~4deg and returns.
  const swing = spring({ frame, fps, config: { damping: 12, mass: 2 }, durationInFrames: 45 });
  const angle = swing * 90;

  const scale = interpolate(frame, [45, 180], [1, 1.25], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <Camera scale={scale}>
        <Plate name="empty-vault" />

        {/* dust motes drifting up through the shaft of light inside the vault */}
        {Array.from({ length: 20 }, (_, i) => {
          const x = 200 + MOTES[i * 3] * 680;
          const speed = 0.35 + MOTES[i * 3 + 1] * 0.5;
          const size = 3 + MOTES[i * 3 + 2] * 4;
          const y = 1320 - ((frame * speed + i * 47) % 700);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                width: size,
                height: size,
                borderRadius: '50%',
                background: 'rgba(255,236,190,.55)',
                filter: 'blur(1px)',
              }}
            />
          );
        })}

        <AbsoluteFill style={{ perspective: 1600 }}>
          <Img
            src={staticFile('plates/vault-door.png')}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              transformOrigin: HINGE,
              transform: `rotateY(${-angle}deg)`,
            }}
          />
        </AbsoluteFill>
      </Camera>
    </AbsoluteFill>
  );
};
