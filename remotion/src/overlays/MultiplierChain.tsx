import React from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { GOLD, MONO, RESERVE, TEAL, useLayout, useVO } from '../theme';

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

export const MultiplierChain: React.FC = () => {
  const frame = useCurrentFrame();
  const C = useLayout().chain;
  // The short read only narrates two rounds of lending, so it only shows two rows —
  // rows three to five were reinforcement, not new information.
  const rows = chain.slice(0, useVO().chainRows);
  // Row 1 waits for "You deposited a hundred" to land, then one row per ~0.9s so the
  // chain builds across the line instead of finishing before the sentence does.
  const { start: START, stagger: STAGGER } = C;

  return (
    <div
      style={{
        // 16:9 gives the chain the right half, clear of the cascade, so it needs no scrim.
        // 9:16 has nowhere to put it but over the coins, so the layout supplies one.
        position: 'absolute',
        left: C.left,
        right: C.right,
        top: C.top === 'auto' ? undefined : C.top,
        bottom: C.bottom,
        zIndex: 10,
        padding: C.scrim ? '34px 0' : undefined,
        background: C.scrim ?? undefined,
        display: 'flex',
        // Rows arrive bottom-up, so the newest (smallest) loan is always at the bottom.
        flexDirection: 'column-reverse',
        justifyContent: C.justify,
        alignItems: C.align,
      }}
    >
      {rows.map((row, i) => {
        const start = START + i * STAGGER;
        const appear = interpolate(frame, [start, start + 10], [0, 1], {
          easing: Easing.out(Easing.quad),
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        // Each row 12% smaller and 15% more transparent than the one below it.
        const scale = C.scaleStep ** i;
        const fade = 0.85 ** i;

        return (
          <div
            key={i}
            style={{
              opacity: appear * fade,
              transform: `scale(${scale})`,
              transformOrigin: C.align === 'center' ? 'center' : 'left center',
            }}
          >
            {/* connector drawn as the row lands */}
            {i > 0 ? (
              <div
                style={{
                  width: 2,
                  height: 22 * appear,
                  marginLeft: C.connectorIndent,
                  marginRight: C.connectorIndent ? undefined : 'auto',
                  background: `linear-gradient(180deg, transparent, ${TEAL})`,
                }}
              />
            ) : null}
            <div
              style={{
                display: 'flex',
                gap: C.gap,
                alignItems: 'baseline',
                fontFamily: MONO,
                fontSize: C.fontSize,
                letterSpacing: '-.01em',
                transform: `translateY(${(1 - appear) * 10}px)`,
              }}
            >
              <span style={{ color: '#e8eef7', minWidth: C.depositWidth, textAlign: 'right' }}>
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
