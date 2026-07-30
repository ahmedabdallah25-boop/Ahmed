import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { Plate } from '../lib/Plate';
import { OwnershipTally } from '../overlays/OwnershipTally';
import { H, LAYOUT, W } from '../theme';

/**
 * Beat 5, 0:26–0:35. "One deposit. Thirty different people now believe they own it.
 * And every one of them is right, as long as nobody asks."
 *
 * Local frames: 30 screens light in a stagger over 0–75; the grid blurs 90–240 while
 * the single coin stays sharp. The coin not moving is the point — one dollar, thirty
 * claims on it.
 */

// Grid geometry comes from LAYOUT — 10 x 3 in landscape.
const { cols: COLS, rows: ROWS, cellW: CELL_W, cellH: CELL_H, gap: GAP, inset: INSET } = LAYOUT.grid;
const GRID_W = COLS * CELL_W + (COLS - 1) * GAP; // 1698
const GRID_H = ROWS * CELL_H + (ROWS - 1) * GAP; // 794
const LEFT = (W - GRID_W) / 2; // 111
const TOP = (H - GRID_H) / 2; // 143

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
