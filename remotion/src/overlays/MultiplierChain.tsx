import React from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { GOLD, MONO, RESERVE, TEAL } from '../theme';

/** The chain the VO narrates: keep 3%, lend the rest, the rest gets deposited again. */
const chain = (() => {
  const rows: { deposit: number; keep: number; lend: number }[] = [];
  let deposit = 100;
  for (let i = 0; i < 5; i += 1) {
    const keep = deposit * RESERVE;
    const lend = deposit - keep;
    rows.push({ deposit, keep, lend });
    deposit = lend;
  }
  return rows;
})();

const money = (n: number) => `$${n.toFixed(2)}`;

const STAGGER = 9; // 300ms @ 30fps

export const MultiplierChain: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        // Landscape: the chain gets the right half, clear of the cascade in the left.
        // No scrim needed — the portrait cut had to overlay the coins and fight them.
        position: 'absolute',
        left: 1010,
        right: 50,
        top: 0,
        bottom: 0,
        display: 'flex',
        // Rows arrive bottom-up, so the newest (smallest) loan is always at the bottom.
        flexDirection: 'column-reverse',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      {chain.map((row, i) => {
        const start = i * STAGGER;
        const appear = interpolate(frame, [start, start + 10], [0, 1], {
          easing: Easing.out(Easing.quad),
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        // Each row 12% smaller and 15% more transparent than the one below it.
        const scale = 0.90 ** i;
        const fade = 0.85 ** i;

        return (
          <div
            key={i}
            style={{
              opacity: appear * fade,
              transform: `scale(${scale})`,
              transformOrigin: 'left center',
            }}
          >
            {/* connector drawn as the row lands */}
            {i > 0 ? (
              <div
                style={{
                  width: 2,
                  height: 22 * appear,
                  marginLeft: 100,
                  background: `linear-gradient(180deg, transparent, ${TEAL})`,
                }}
              />
            ) : null}
            <div
              style={{
                display: 'flex',
                gap: 14,
                alignItems: 'baseline',
                fontFamily: MONO,
                fontSize: 38,
                letterSpacing: '-.01em',
                transform: `translateY(${(1 - appear) * 10}px)`,
              }}
            >
              <span style={{ color: '#e8eef7', minWidth: 168, textAlign: 'right' }}>
                {money(row.deposit)}
              </span>
              <span style={{ color: 'rgba(232,238,247,.45)' }}>→</span>
              <span style={{ color: GOLD }}>keep {money(row.keep)}</span>
              <span style={{ color: 'rgba(232,238,247,.35)' }}>·</span>
              <span style={{ color: TEAL }}>lend {money(row.lend)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
