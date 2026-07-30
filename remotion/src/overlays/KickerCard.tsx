import React from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { GOLD, SANS } from '../theme';

const LINES = [['SAME', 'MONEY.'], ['ONE', 'SYSTEM', 'NEEDS', 'YOU', 'NOT', 'TO', 'LOOK.']];

const WORD_STAGGER = 2; // 60ms @ 30fps
const HOLD = 45;
const WIPE = 90;

export const KickerCard: React.FC = () => {
  const frame = useCurrentFrame();

  let wordIndex = 0;
  const wipe = interpolate(frame, [WIPE, WIPE + 12], [0, 1], {
    easing: Easing.inOut(Easing.quad),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: 80,
          right: 80,
          top: 700,
          transform: `translateY(${-wipe * 90}px)`,
          opacity: 1 - wipe,
        }}
      >
        {LINES.map((line, li) => (
          <div
            key={li}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0 20px',
              justifyContent: 'center',
              fontFamily: SANS,
              fontWeight: 800,
              fontSize: li === 0 ? 128 : 78,
              lineHeight: 1.06,
              letterSpacing: '-.02em',
              color: li === 0 ? '#fff' : GOLD,
              marginBottom: li === 0 ? 30 : 0,
            }}
          >
            {line.map((word) => {
              const start = wordIndex * WORD_STAGGER;
              wordIndex += 1;
              const appear = interpolate(frame, [start, start + 6], [0, 1], {
                easing: Easing.out(Easing.quad),
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });
              return (
                <span
                  key={word}
                  style={{
                    opacity: appear,
                    transform: `translateY(${(1 - appear) * 8}px)`,
                    display: 'inline-block',
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>
        ))}
      </div>

      {/* lower third revealed by the wipe */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 210,
          opacity: wipe,
          transform: `translateY(${(1 - wipe) * 40}px)`,
          textAlign: 'center',
          fontFamily: SANS,
          fontSize: 34,
          letterSpacing: '.16em',
          color: 'rgba(232,238,247,.9)',
          padding: '22px 0',
          borderTop: `1px solid ${GOLD}`,
          borderBottom: `1px solid ${GOLD}`,
          background: 'rgba(11,26,46,.55)',
        }}
      >
        PART 15 · NO JARGON, JUST MECHANISMS
      </div>
    </>
  );
};
