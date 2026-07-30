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
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 300,
        // Above the falling coins, with a scrim: coins pass straight through this band
        // and shred the numbers without it.
        zIndex: 10,
        padding: '34px 0',
        background:
          'linear-gradient(180deg, transparent, rgba(4,8,15,.90) 16%, rgba(4,8,15,.90) 84%, transparent)',
        display: 'flex',
        // Rows arrive bottom-up, so the newest (smallest) loan is always at the bottom.
        flexDirection: 'column-reverse',
        alignItems: 'center',
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
        const scale = 0.88 ** i;
        const fade = 0.85 ** i;

        return (
          <div key={i} style={{ opacity: appear * fade, transform: `scale(${scale})` }}>
            {/* connector drawn as the row lands */}
            {i > 0 ? (
              <div
                style={{
                  width: 2,
                  height: 26 * appear,
                  margin: '0 auto',
                  background: `linear-gradient(180deg, transparent, ${TEAL})`,
                }}
              />
            ) : null}
            <div
              style={{
                display: 'flex',
                gap: 18,
                alignItems: 'baseline',
                fontFamily: MONO,
                fontSize: 46,
                letterSpacing: '-.01em',
                transform: `translateY(${(1 - appear) * 10}px)`,
              }}
            >
              <span style={{ color: '#e8eef7', minWidth: 200, textAlign: 'right' }}>
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
