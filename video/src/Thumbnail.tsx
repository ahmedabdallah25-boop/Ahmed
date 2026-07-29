import React from 'react';
import {AbsoluteFill} from 'remotion';
import {ROWS} from './longform/amort';
import {L} from './longform/ui';
import {FONT} from './theme';

// Thumbnail per the storyboard: house silhouette split down the centre — left
// half red with the debt curve that barely falls, right half green with the
// ownership bar climbing. Two visual elements, three characters of text.
const W = 1280;
const H = 720;
const MID = W / 2;

const HOUSE =
  'M640 90 L1120 400 L1040 400 L1040 660 L240 660 L240 400 L160 400 Z';

export const Thumbnail: React.FC = () => {
  // Debt curve: outstanding balance over the term — visibly still high at year 10.
  const debt = ROWS.filter((_, i) => i % 6 === 0).map((r, i, arr) => {
    const x = 170 + (i / (arr.length - 1)) * (MID - 200);
    const y = 200 + (1 - r.balance / ROWS[0].balance) * 380;
    return `${x},${y}`;
  });

  return (
    <AbsoluteFill style={{background: '#04060A', fontFamily: FONT}}>
      <svg width={W} height={H}>
        <defs>
          <clipPath id="house">
            <path d={HOUSE} />
          </clipPath>
          <clipPath id="left">
            <rect x={0} y={0} width={MID - 6} height={H} />
          </clipPath>
          <clipPath id="right">
            <rect x={MID + 6} y={0} width={MID} height={H} />
          </clipPath>
        </defs>

        <g clipPath="url(#house)">
          {/* left: riba */}
          <g clipPath="url(#left)">
            <rect x={0} y={0} width={W} height={H} fill="#2A0C0F" />
            <polyline
              points={debt.join(' ')}
              fill="none"
              stroke={L.red}
              strokeWidth={16}
              strokeLinecap="round"
            />
          </g>
          {/* right: ownership */}
          <g clipPath="url(#right)">
            <rect x={0} y={0} width={W} height={H} fill="#06251A" />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <rect
                key={i}
                x={MID + 40 + i * 78}
                y={600 - (i + 1) * 62}
                width={58}
                height={(i + 1) * 62}
                fill={L.green}
                rx={6}
              />
            ))}
          </g>
        </g>

        <path d={HOUSE} fill="none" stroke="#FFFFFF22" strokeWidth={6} />
        <line x1={MID} y1={60} x2={MID} y2={680} stroke="#04060A" strokeWidth={12} />
      </svg>

      <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 24}}>
        <div
          style={{
            background: L.gold,
            color: '#04060A',
            fontSize: 168,
            fontWeight: 900,
            letterSpacing: -6,
            padding: '0 42px',
            borderRadius: 18,
            lineHeight: 1.05,
          }}
        >
          0% RIBA
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
