import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { Camera, Plate } from '../lib/Plate';
import { noise } from '../lib/rng';
import { BEATS, GOLD, H, W } from '../theme';

/**
 * Beat 7, 0:43–0:54. "The alternative already exists. Your deposit stays YOUR deposit —
 * held, not lent. Money only multiplies when something real was actually built."
 *
 * The three things fill while the VO says they get built — "money only multiplies when
 * something real was actually built" lands around local frame 210, so they start at
 * 150 / 195 / 240 rather than in the first second. Crane-up runs the whole beat.
 */

/**
 * The generator draws each blueprint centred in the frame. They get placed into their
 * own slots here: transformOrigin is the art's own centre in full-frame coordinates, so
 * translate+scale position it without shearing. `bbox` is the art's real vertical extent
 * — the clip has to sit on it, because clipping the full frame would spend most of the
 * reveal on empty space above the drawing.
 *
 * Landscape layout: the vault is pushed left and the three blueprints stack down the
 * right. Stacking reads better than a row here — the frame is wide but short, and a row
 * of three would collide with the vault.
 */
const BLUEPRINTS = [
  { name: 'blueprint-house', cx: 960, cy: 620, bbox: [450, 340], to: [1480, 250], at: 150 },
  { name: 'blueprint-panels', cx: 960, cy: 660, bbox: [560, 200], to: [1480, 540], at: 195 },
  { name: 'blueprint-truck', cx: 960, cy: 640, bbox: [545, 190], to: [1480, 830], at: 240 },
] as const;

const SCALE = 0.62;
const FILL = 40;

/**
 * Camera move on the vault plate: pushed left to clear the right-hand column.
 *
 * A translated plate only covers the frame if it is scaled up enough to absorb the
 * shift: `scale >= 1 + 2 * |x| / W`. At 1.18/-330 the requirement is 1.34, so the right
 * edge of the frame showed through as a black strip. 1.20/-180 needs 1.1875.
 */
const VAULT_CAM = { scale: 1.2, x: -180 };

/**
 * Where the gold leaves the vault, in FRAME coordinates. The plate is inside <Camera>
 * but the particles and blueprints are not, so this is the pre-transform mouth (960,800)
 * mapped through VAULT_CAM.
 */
const VAULT_MOUTH = [
  (960 - W / 2) * VAULT_CAM.scale + W / 2 + VAULT_CAM.x,
  (800 - H / 2) * VAULT_CAM.scale + H / 2,
] as const;
const N = noise(53, 120);

export const Beat7Assets: React.FC = () => {
  const frame = useCurrentFrame();

  const craneY = interpolate(frame, [0, BEATS.assets.durationInFrames], [0, -80], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* Only the plate rides the camera — the blueprints and particles are positioned in
          frame coordinates, so shifting them too would undo the layout. Scaling past 1
          also keeps the pushed-left plate from exposing the frame edge. */}
      <Camera scale={VAULT_CAM.scale} x={VAULT_CAM.x} y={craneY}>
        <Plate name="real-assets" />
      </Camera>

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
                  width: W,
                  height: bHeight,
                  // fills bottom-to-top: top inset 100% -> 0%
                  clipPath: `inset(${(1 - p) * 100}% 0 0 0)`,
                }}
              >
                <Img
                  src={staticFile(`plates/${name}.png`)}
                  style={{ position: 'absolute', left: 0, top: -bTop, width: W, height: H }}
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
            const cyp = Math.min(y0, y1) - 140;
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
    </AbsoluteFill>
  );
};
