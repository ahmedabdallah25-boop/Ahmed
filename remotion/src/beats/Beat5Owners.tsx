import React from 'react';
import { AbsoluteFill, Img, interpolate, useCurrentFrame } from 'remotion';
import { Plate, usePlate } from '../lib/Plate';
import { OwnershipTally } from '../overlays/OwnershipTally';
import { useLayout } from '../theme';

/**
 * Beat 5, 0:26–0:35. "One deposit. Thirty different people now believe they own it.
 * And every one of them is right, as long as nobody asks."
 *
 * Local frames: 30 screens light in a stagger over 0–75; the grid blurs 90–240 while
 * the single coin stays sharp. The coin not moving is the point — one dollar, thirty
 * claims on it. Grid is 10 x 3 wide, 5 x 6 tall.
 */
export const Beat5Owners: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const coin = usePlate('owners-coin');
  const { cols, cellW, cellH, gap, inset } = L.grid;

  const blur = interpolate(frame, [90, 240], [0, 6], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {/* everything that defocuses goes inside this wrapper */}
      <AbsoluteFill style={{ filter: `blur(${blur}px)` }}>
        <Plate name="thirty-owners" />

        {Array.from({ length: 30 }, (_, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          // 2.5 frames apart -> all 30 lit in 75 frames (2.5s)
          const on = interpolate(frame, [i * 2.5, i * 2.5 + 9], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: L.gridOrigin.left + col * (cellW + gap) + inset,
                top: L.gridOrigin.top + row * (cellH + gap) + inset,
                width: cellW - inset * 2,
                height: cellH - inset * 2,
                borderRadius: 13,
                background: 'linear-gradient(180deg, #cfe0f5, #8fb2dc)',
                opacity: on * 0.9,
                boxShadow: `0 0 ${28 * on}px rgba(150,190,255,.55)`,
              }}
            />
          );
        })}
      </AbsoluteFill>

      {/* the one actual dollar — never animates, never blurs */}
      <Img src={coin} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />

      <OwnershipTally />
    </AbsoluteFill>
  );
};
