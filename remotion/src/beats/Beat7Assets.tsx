import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { Camera, Plate } from '../lib/Plate';
import { noise } from '../lib/rng';
import { GOLD } from '../theme';

/**
 * Beat 7, 0:36–0:46. "The alternative already exists. Your deposit stays YOUR deposit —
 * held, not lent. Money only multiplies when something real was actually built."
 *
 * Local frames: house fills at 30, panels at 60, truck at 90 (absolute 1110/1140/1170),
 * each over 40 frames. Crane-up runs the whole beat.
 */

/**
 * The generator draws all three blueprints in the same bottom region, overlapping. They
 * get laid out side by side here: transformOrigin is the art's own centre in full-frame
 * coordinates, so translate+scale place it without shearing. `bbox` is the art's real
 * vertical extent — the clip has to sit on it, because clipping the full 1920 frame
 * would spend 80% of the reveal on empty space above the drawing.
 */
const BLUEPRINTS = [
  { name: 'blueprint-house', cx: 540, cy: 1535, bbox: [1290, 500], to: [250, 1560], at: 30 },
  { name: 'blueprint-panels', cx: 540, cy: 1675, bbox: [1540, 280], to: [540, 1560], at: 60 },
  { name: 'blueprint-truck', cx: 530, cy: 1694, bbox: [1560, 280], to: [830, 1560], at: 90 },
] as const;

const SCALE = 0.55;
const FILL = 40;

const VAULT_MOUTH = [540, 1150] as const;
const N = noise(53, 120);

export const Beat7Assets: React.FC = () => {
  const frame = useCurrentFrame();

  const craneY = interpolate(frame, [0, 300], [0, -80], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <Camera y={craneY}>
        <Plate name="real-assets" />

        {BLUEPRINTS.map(({ name, cx, cy, bbox, to, at }) => {
          const p = interpolate(frame, [at, at + FILL], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const [bTop, bHeight] = bbox;

          return (
            <div
              key={name}
              style={{
                position: 'absolute',
                inset: 0,
                transformOrigin: `${cx}px ${cy}px`,
                transform: `translate(${to[0] - cx}px, ${to[1] - cy}px) scale(${SCALE})`,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: bTop,
                  width: 1080,
                  height: bHeight,
                  // fills bottom-to-top: top inset 100% -> 0%
                  clipPath: `inset(${(1 - p) * 100}% 0 0 0)`,
                }}
              >
                <Img
                  src={staticFile(`plates/${name}.png`)}
                  style={{ position: 'absolute', left: 0, top: -bTop, width: 1080, height: 1920 }}
                />
              </div>
            </div>
          );
        })}

        {/* gold streaming out of the vault into each thing that got built */}
        {BLUEPRINTS.map(({ name, to }, bi) =>
          Array.from({ length: 14 }, (_, i) => {
            const idx = bi * 14 + i;
            const t = (((frame + i * 6 + bi * 11) % 90) / 90);
            const [x0, y0] = VAULT_MOUTH;
            const [x1, y1] = to;
            // quadratic bezier, control point lifted so the stream arcs rather than cuts
            const cxp = (x0 + x1) / 2 + (N[idx] - 0.5) * 120;
            const cyp = Math.min(y0, y1) - 180;
            const u = 1 - t;
            const x = u * u * x0 + 2 * u * t * cxp + t * t * x1;
            const y = u * u * y0 + 2 * u * t * cyp + t * t * y1;
            const size = 5 + N[(idx + 40) % N.length] * 7;

            return (
              <div
                key={`${name}-${i}`}
                style={{
                  position: 'absolute',
                  left: x,
                  top: y,
                  width: size,
                  height: size,
                  borderRadius: '50%',
                  background: GOLD,
                  boxShadow: `0 0 12px ${GOLD}`,
                  opacity: Math.sin(t * Math.PI) * 0.9,
                }}
              />
            );
          }),
        )}
      </Camera>
    </AbsoluteFill>
  );
};
