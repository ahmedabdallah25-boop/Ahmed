import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { Plate } from '../lib/Plate';
import { OwnershipTally } from '../overlays/OwnershipTally';

/**
 * Beat 5, 0:22–0:30. "One deposit. Thirty different people now believe they own it.
 * And every one of them is right, as long as nobody asks."
 *
 * Local frames: 30 screens light in a stagger over 0–75; the grid blurs 90–240 while
 * the single coin stays sharp. The coin not moving is the point — one dollar, thirty
 * claims on it.
 */

// Grid geometry mirrors scripts/make-plates.mjs: 5 x 150px cols, 6 x 250px rows, 22 gap.
const COLS = 5;
const CELL_W = 150;
const CELL_H = 250;
const GAP = 22;
const GRID_W = COLS * CELL_W + (COLS - 1) * GAP; // 838
const GRID_H = 6 * CELL_H + 5 * GAP; // 1610
const LEFT = (1080 - GRID_W) / 2; // 121
const TOP = (1920 - GRID_H) / 2; // 155
const INSET = 10; // inner screen inset inside each phone body

export const Beat5Owners: React.FC = () => {
  const frame = useCurrentFrame();

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
          const col = i % COLS;
          const row = Math.floor(i / COLS);
          // 2.5 frames apart -> all 30 lit in 75 frames (2.5s)
          const start = i * 2.5;
          const on = interpolate(frame, [start, start + 9], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: LEFT + col * (CELL_W + GAP) + INSET,
                top: TOP + row * (CELL_H + GAP) + INSET,
                width: CELL_W - INSET * 2,
                height: CELL_H - INSET * 2,
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
      <Img
        src={staticFile('plates/owners-coin.png')}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />

      <OwnershipTally />
    </AbsoluteFill>
  );
};
