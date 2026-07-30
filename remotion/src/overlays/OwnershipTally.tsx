import React from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { GOLD, MONO, SANS } from '../theme';

const TICK_START = 0;
const TICK_END = 75; // 2.5s, matched to the 30-screen stagger in Beat5Owners
const FLASH = TICK_END + 4;
const STRIKE = FLASH + 10;
const TYPE_START = STRIKE + 6;

const BELIEVE = 'BELIEVE';

export const OwnershipTally: React.FC = () => {
  const frame = useCurrentFrame();

  const count = Math.round(
    interpolate(frame, [TICK_START, TICK_END], [1, 30], {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );

  const flash = interpolate(frame, [FLASH, FLASH + 3, FLASH + 9], [0, 0.85, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const strike = interpolate(frame, [STRIKE, STRIKE + 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 2 frames per character
  const typed = Math.max(0, Math.min(BELIEVE.length, Math.floor((frame - TYPE_START) / 2)));

  return (
    <>
      <div
        style={{
          // Landscape: a bottom band, so the centred coin in the plate stays clear.
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          textAlign: 'center',
          // sits over 30 lit screens, so it needs its own ground
          zIndex: 10,
          // bottom pad keeps the squares clear of the player's control overlay
          padding: '30px 0 96px',
          background:
            'linear-gradient(0deg, rgba(4,8,15,.94) 0%, rgba(4,8,15,.88) 62%, transparent)',
        }}
      >
        <div
          style={{
            fontFamily: SANS,
            fontSize: 28,
            letterSpacing: '.20em',
            color: 'rgba(232,238,247,.65)',
          }}
        >
          <span style={{ position: 'relative', display: 'inline-block' }}>
            PEOPLE WHO OWN THIS DOLLAR
            {/* the strike lands on "OWN" only */}
            <span
              style={{
                position: 'absolute',
                left: '38%',
                top: '52%',
                width: `${strike * 15}%`,
                height: 2,
                background: GOLD,
              }}
            />
          </span>
        </div>

        <div
          style={{
            marginTop: 4,
            fontFamily: MONO,
            fontSize: 104,
            lineHeight: '1em',
            color: '#fff',
            fontVariantNumeric: 'tabular-nums',
            textShadow: '0 0 40px rgba(255,255,255,.35)',
          }}
        >
          {count}
        </div>

        {/* fixed height so the squares below never reflow as the word types in */}
        <div
          style={{
            height: 46,
            fontFamily: SANS,
            fontSize: 34,
            letterSpacing: '.20em',
            color: GOLD,
          }}
        >
          {BELIEVE.slice(0, typed)}
          {typed > 0 && typed < BELIEVE.length ? '▌' : ''}
        </div>

        {/* one square per owner, filling in on the same tick as the counter. All 30 on
            one row — the wide frame fits them, the portrait cut needed 10 x 3. */}
        <div
          style={{
            width: 30 * 24 + 29 * 9,
            margin: '16px auto 0',
            display: 'grid',
            gridTemplateColumns: 'repeat(30, 24px)',
            gap: 9,
          }}
        >
          {Array.from({ length: 30 }, (_, i) => (
            <div
              key={i}
              style={{
                width: 24,
                height: 24,
                border: `1px solid ${i < count ? GOLD : 'rgba(232,238,247,.28)'}`,
                background: i < count ? GOLD : 'transparent',
                boxShadow: i < count ? `0 0 10px rgba(212,162,76,.5)` : 'none',
              }}
            />
          ))}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#fff',
          opacity: flash,
          mixBlendMode: 'screen',
        }}
      />
    </>
  );
};
