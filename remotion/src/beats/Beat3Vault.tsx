import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Camera, Plate, usePlate } from '../lib/Plate';
import { noise } from '../lib/rng';
import { BEATS, useLayout } from '../theme';

/**
 * Beat 3, 0:10–0:16. "The rest isn't in a vault. It isn't anywhere. It's a promise,
 * typed into a screen."
 *
 * Local frames: door opens 0–45, then the camera dollies for the rest of the beat.
 * Reading the end off BEATS keeps the move complete when the VO retimes the beat.
 */

const MOTES = noise(31, 60); // 20 motes x 3 values

export const Beat3Vault: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const L = useLayout();
  const door = usePlate('vault-door');

  // Heavy inertia + settle-bounce: damping 12 / mass 2 overshoots ~4deg and returns.
  const swing = spring({ frame, fps, config: { damping: 12, mass: 2 }, durationInFrames: 45 });
  const angle = swing * 90;

  const scale = interpolate(frame, [45, BEATS.vault.durationInFrames], [1, 1.25], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Motes stay inside the vault interior, expressed against its radius so the field
  // lands correctly in both orientations.
  const r = L.vault.size / 2;
  const span = r * 1.7;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <Camera scale={scale}>
        <Plate name="empty-vault" />

        {/* dust motes drifting up through the shaft of light inside the vault */}
        {Array.from({ length: 20 }, (_, i) => {
          const x = L.w / 2 - r * 0.85 + MOTES[i * 3] * span;
          const speed = 0.35 + MOTES[i * 3 + 1] * 0.5;
          const size = 3 + MOTES[i * 3 + 2] * 4;
          const y = L.h / 2 + r * 0.85 - ((frame * speed + i * 47) % span);
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
            src={door}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              // The door is centred in the plate, so its hinge is its left edge.
              // Rotating about anything else swings it off the hinge.
              transformOrigin: `${L.doorHinge.x}px ${L.doorHinge.y}px`,
              transform: `rotateY(${-angle}deg)`,
            }}
          />
        </AbsoluteFill>
      </Camera>
    </AbsoluteFill>
  );
};
