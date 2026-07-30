import React from 'react';
import {AbsoluteFill} from 'remotion';
import {CANON, ROWS} from './longform/amort';
import {L} from './longform/ui';
import {FONT} from './theme';

// Five thumbnail options for Episode 2. Each tests a different hook:
//   A  the brand promise      — 0% RIBA
//   B  the number             — £188,443, a second house
//   C  the injustice          — 10 years in, you still owe more
//   D  the mechanism          — £420 of £1,461
//   E  the payoff             — three halal ways out
//
// Rules held across all five: two visual elements at most, headline type at
// 120px+ so it survives the 168px shelf, and nothing that needs reading at
// full size to work.

const W = 1280;
const H = 720;
const BG = '#04060A';

const Frame: React.FC<{children: React.ReactNode; bg?: string}> = ({children, bg = BG}) => (
  <AbsoluteFill style={{background: bg, fontFamily: FONT, color: L.ink}}>
    {children}
  </AbsoluteFill>
);

// ── A · 0% RIBA ──────────────────────────────────────────────────────────────
const HOUSE = 'M640 60 L1120 370 L1040 370 L1040 560 L240 560 L240 370 L160 370 Z';
const MID = W / 2;

export const ThumbA: React.FC = () => {
  const debt = ROWS.filter((_, i) => i % 6 === 0).map((r, i, arr) => {
    const x = 170 + (i / (arr.length - 1)) * (MID - 200);
    const y = 160 + (1 - r.balance / ROWS[0].balance) * 340;
    return `${x},${y}`;
  });
  return (
    <Frame>
      <svg width={W} height={H}>
        <defs>
          <clipPath id="a-house">
            <path d={HOUSE} />
          </clipPath>
          <clipPath id="a-left">
            <rect x={0} y={0} width={MID - 6} height={H} />
          </clipPath>
          <clipPath id="a-right">
            <rect x={MID + 6} y={0} width={MID} height={H} />
          </clipPath>
        </defs>
        <g clipPath="url(#a-house)">
          <g clipPath="url(#a-left)">
            <rect x={0} y={0} width={W} height={H} fill="#2A0C0F" />
            <polyline points={debt.join(' ')} fill="none" stroke={L.red} strokeWidth={16} strokeLinecap="round" />
          </g>
          <g clipPath="url(#a-right)">
            <rect x={0} y={0} width={W} height={H} fill="#06251A" />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <rect key={i} x={MID + 40 + i * 78} y={550 - (i + 1) * 52} width={58} height={(i + 1) * 52} fill={L.green} rx={6} />
            ))}
          </g>
        </g>
        <path d={HOUSE} fill="none" stroke="#FFFFFF22" strokeWidth={6} />
        <line x1={MID} y1={40} x2={MID} y2={580} stroke={BG} strokeWidth={12} />
      </svg>
      <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 34}}>
        <div
          style={{
            background: L.gold,
            color: BG,
            fontSize: 152,
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
    </Frame>
  );
};

// ── B · THE SECOND HOUSE ─────────────────────────────────────────────────────
export const ThumbB: React.FC = () => (
  <Frame>
    <AbsoluteFill style={{padding: 70, justifyContent: 'center'}}>
      <div style={{fontSize: 40, letterSpacing: 6, color: L.dim, fontWeight: 700}}>
        INTEREST ON A £250,000 MORTGAGE
      </div>
      <div
        style={{
          fontSize: 250,
          fontWeight: 900,
          color: L.red,
          letterSpacing: -14,
          lineHeight: 0.95,
          marginTop: 6,
        }}
      >
        £188,443
      </div>
      <div style={{fontSize: 76, fontWeight: 900, color: L.ink, letterSpacing: -2, marginTop: 14}}>
        THAT&rsquo;S A SECOND HOUSE
      </div>
      <div style={{fontSize: 48, fontWeight: 700, color: L.gold, marginTop: 10}}>
        You don&rsquo;t get to live in it.
      </div>
    </AbsoluteFill>
    {/* the second house — tucked into the corner so it never fights the type */}
    <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
      <g opacity={0.3} transform="translate(880,470) scale(0.28)">
        <path d={HOUSE} fill={L.red} />
      </g>
    </svg>
  </Frame>
);

// ── C · TEN YEARS IN ─────────────────────────────────────────────────────────
export const ThumbC: React.FC = () => {
  const bar = (label: string, value: string, w: number, color: string) => (
    <div style={{marginBottom: 34}}>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 20}}>
        <span style={{fontSize: 34, letterSpacing: 5, color: L.dim, fontWeight: 700}}>{label}</span>
        <span style={{fontSize: 96, fontWeight: 900, color, letterSpacing: -4}}>{value}</span>
      </div>
      <div style={{height: 30, width: `${w * 100}%`, background: color, borderRadius: 15, marginTop: 8}} />
    </div>
  );
  return (
    <Frame>
      <AbsoluteFill style={{padding: 70, justifyContent: 'center'}}>
        <div style={{fontSize: 62, fontWeight: 900, letterSpacing: -1, marginBottom: 26}}>
          10 YEARS OF PAYMENTS
        </div>
        {bar('PAID', '£175,377', 0.86, L.green)}
        {bar('STILL OWE', '£184,811', 0.95, L.red)}
        <div style={{fontSize: 72, fontWeight: 900, color: L.gold, letterSpacing: -2, marginTop: 8}}>
          YOU OWE MORE THAN YOU PAID
        </div>
      </AbsoluteFill>
    </Frame>
  );
};

// ── D · THE £420 ─────────────────────────────────────────────────────────────
export const ThumbD: React.FC = () => {
  const RENT = 0.713;
  const BAR = 1140;
  return (
    <Frame>
      <AbsoluteFill style={{padding: 70, justifyContent: 'center'}}>
        <div style={{fontSize: 40, letterSpacing: 6, color: L.dim, fontWeight: 700}}>
          YOUR £1,461 MORTGAGE PAYMENT
        </div>
        <div style={{position: 'relative', height: 120, width: BAR, marginTop: 26}}>
          <div style={{position: 'absolute', left: 0, width: BAR * RENT - 14, height: 120, background: L.red, borderRadius: 16}} />
          <div style={{position: 'absolute', left: BAR * RENT + 14, width: BAR * (1 - RENT) - 14, height: 120, background: L.green, borderRadius: 16}} />
        </div>
        <div style={{display: 'flex', width: BAR, justifyContent: 'space-between', marginTop: 22}}>
          <div>
            <div style={{fontSize: 92, fontWeight: 900, color: L.red, letterSpacing: -4}}>£1,042</div>
            <div style={{fontSize: 34, letterSpacing: 4, color: L.dim, fontWeight: 700}}>RENT ON MONEY</div>
          </div>
          <div style={{textAlign: 'right'}}>
            <div style={{fontSize: 92, fontWeight: 900, color: L.green, letterSpacing: -4}}>£420</div>
            <div style={{fontSize: 34, letterSpacing: 4, color: L.dim, fontWeight: 700}}>BUYS THE HOUSE</div>
          </div>
        </div>
        <div style={{fontSize: 66, fontWeight: 900, color: L.gold, letterSpacing: -2, marginTop: 30}}>
          71% NEVER TOUCHES IT
        </div>
      </AbsoluteFill>
    </Frame>
  );
};

// ── E · THREE WAYS OUT ───────────────────────────────────────────────────────
export const ThumbE: React.FC = () => {
  const names = ['MURABAHA', 'IJARA', 'MUSHARAKA'];
  return (
    <Frame>
      <AbsoluteFill style={{padding: 70, justifyContent: 'center'}}>
        <div style={{fontSize: 150, fontWeight: 900, letterSpacing: -8, lineHeight: 0.95}}>
          3 WAYS TO BUY
        </div>
        <div style={{fontSize: 150, fontWeight: 900, letterSpacing: -8, lineHeight: 0.95, color: L.green}}>
          WITHOUT INTEREST
        </div>
        <div style={{display: 'flex', gap: 22, marginTop: 44}}>
          {names.map((n) => (
            <div
              key={n}
              style={{
                flex: 1,
                background: L.panel,
                border: `3px solid ${L.green}`,
                borderRadius: 14,
                padding: '22px 0',
                textAlign: 'center',
                fontSize: 42,
                fontWeight: 900,
                letterSpacing: 1,
              }}
            >
              {n}
            </div>
          ))}
        </div>
      </AbsoluteFill>
    </Frame>
  );
};

export const THUMBS = {
  'Thumb-A-Riba': ThumbA,
  'Thumb-B-SecondHouse': ThumbB,
  'Thumb-C-TenYears': ThumbC,
  'Thumb-D-420': ThumbD,
  'Thumb-E-ThreeWays': ThumbE,
} as const;

export const THUMB_SIZE = {width: W, height: H};

// CANON is imported so the figures stay tied to the film's single source.
void CANON;
