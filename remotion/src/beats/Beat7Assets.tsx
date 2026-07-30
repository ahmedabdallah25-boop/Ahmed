import React from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';
import { Camera, Plate, usePlateResolver } from '../lib/Plate';
import { noise } from '../lib/rng';
import { BEATS, GOLD, useLayout } from '../theme';

/**
 * Beat 7, 0:43–0:54. "The alternative already exists. Your deposit stays YOUR deposit —
 * held, not lent. Money only multiplies when something real was actually built."
 *
 * The three things fill while the VO says they get built — "money only multiplies when
 * something real was actually built" lands around local frame 210, so they start at
 * 150 / 195 / 240 rather than in the first second.
 *
 * 16:9 pushes the vault LEFT and stacks the blueprints down the right. 9:16 pushes it UP
 * and lays them in a row along the bottom. Slots come from the layout.
 */

/**
 * Each blueprint is drawn centred in its plate. `originY` is the art's own vertical
 * centre and `bbox` its real extent, both as offsets from frame centre — the clip has to
 * sit on the art, because clipping the whole frame would spend most of the reveal on
 * empty space above the drawing.
 */
const BLUEPRINTS = [
  { name: 'blueprint-house', originY: 80, bboxTop: -90, bboxH: 340, at: 150 },
  { name: 'blueprint-panels', originY: 120, bboxTop: 20, bboxH: 200, at: 195 },
  { name: 'blueprint-truck', originY: 100, bboxTop: 0, bboxH: 200, at: 240 },
] as const;

const FILL = 40;
const N = noise(53, 120);

export const Beat7Assets: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const cam = L.vaultCam;
  const plate = usePlateResolver();

  const craneY = interpolate(frame, [0, BEATS.assets.durationInFrames], [0, L.crane], {
    extrapolateRight: 'clamp',
  });

  /**
   * Where the gold leaves the vault, in FRAME coordinates. The plate is inside <Camera>
   * but the particles and blueprints are not, so the plate-space mouth is mapped through
   * the camera transform.
   */
  const mouth = [
    (L.blueprints.mouth[0] - L.w / 2) * cam.scale + L.w / 2 + cam.x,
    (L.blueprints.mouth[1] - L.h / 2) * cam.scale + L.h / 2 + cam.y,
  ];

  const cx = L.w / 2;
  const cy = L.h / 2;

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* Only the plate rides the camera — the blueprints and particles are positioned in
          frame coordinates, so shifting them too would undo the layout. A translated
          plate also only covers the frame while scale >= 1 + 2*|offset|/size. */}
      <Camera scale={cam.scale} x={cam.x} y={cam.y + craneY}>
        <Plate name="real-assets" />
      </Camera>

      {BLUEPRINTS.map(({ name, originY, bboxTop, bboxH, at }, bi) => {
        const src = plate(name);
        const [tx, ty] = L.blueprints.slots[bi];
        const p = interpolate(frame, [at, at + FILL], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

        return (
          <div
            key={name}
            style={{
              position: 'absolute',
              inset: 0,
              transformOrigin: `${cx}px ${cy + originY}px`,
              transform: `translate(${tx - cx}px, ${ty - (cy + originY)}px) scale(${L.blueprints.scale})`,
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: cy + bboxTop,
                width: L.w,
                height: bboxH,
                // fills bottom-to-top: top inset 100% -> 0%
                clipPath: `inset(${(1 - p) * 100}% 0 0 0)`,
              }}
            >
              <Img
                src={src}
                style={{ position: 'absolute', left: 0, top: -(cy + bboxTop), width: L.w, height: L.h }}
              />
            </div>
          </div>
        );
      })}

      {/* gold streaming out of the vault into each thing that got built */}
      {L.blueprints.slots.map(([x1, y1], bi) =>
        Array.from({ length: 14 }, (_, i) => {
          const idx = bi * 14 + i;
          const t = ((frame + i * 6 + bi * 11) % 90) / 90;
          const [x0, y0] = mouth;
          // quadratic bezier, control point lifted so the stream arcs rather than cuts
          const cxp = (x0 + x1) / 2 + (N[idx] - 0.5) * 120;
          const cyp = Math.min(y0, y1) - L.blueprints.arcLift;
          const u = 1 - t;
          const x = u * u * x0 + 2 * u * t * cxp + t * t * x1;
          const y = u * u * y0 + 2 * u * t * cyp + t * t * y1;
          const size = 5 + N[(idx + 40) % N.length] * 7;

          return (
            <div
              key={`${bi}-${i}`}
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
