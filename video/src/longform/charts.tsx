import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ROWS, gbp} from './amort';
import {Bar, L, ease, rise} from './ui';

const CW = 1664; // chart width inside the page padding
const CH = 420;

/**
 * The 25-year amortisation sweep — red interest stacked over green principal.
 * Built once, reused in Scenes 2, 5 and 12 (storyboard asset list).
 */
export const Amortisation: React.FC<{
  at: number;
  dur: number;
  /** 0..1 of the term to reveal */
  to?: number;
  markYear?: number;
  height?: number;
}> = ({at, dur, to = 1, markYear, height = CH}) => {
  const frame = useCurrentFrame();
  const p = ease(frame, at, dur) * to;
  const max = ROWS[0].interest + ROWS[0].principal;
  const x = (i: number) => (i / (ROWS.length - 1)) * CW;
  const y = (v: number) => height - (v / max) * height;


  // interest sits on top of principal: total line = payment, split by principal
  const interestTop = ROWS.map((r, i) => `${x(i)},${y(r.interest + r.principal)}`).join(' L');
  const principalTop = ROWS.map((r, i) => `${x(i)},${y(r.principal)}`).join(' L');

  const clipW = CW * p;
  const markX = markYear ? x(markYear * 12) : 0;

  return (
    <div style={{position: 'relative', width: CW, height}}>
      <svg width={CW} height={height} style={{display: 'block'}}>
        <defs>
          <clipPath id="sweep">
            <rect x={0} y={0} width={clipW} height={height} />
          </clipPath>
        </defs>
        <g clipPath="url(#sweep)">
          <path d={`M0,${height} L${interestTop} L${CW},${height} Z`} fill={L.red} opacity={0.85} />
          <path d={`M0,${height} L${principalTop} L${CW},${height} Z`} fill={L.green} opacity={0.95} />
        </g>
        {/* playhead */}
        {p > 0 && p < 1 ? (
          <line x1={clipW} y1={0} x2={clipW} y2={height} stroke={L.ink} strokeWidth={3} />
        ) : null}
        {markYear && p > markYear / 25 ? (
          <>
            <line x1={markX} y1={0} x2={markX} y2={height} stroke={L.gold} strokeWidth={3} strokeDasharray="10 10" />
            <text x={markX + 16} y={40} fill={L.gold} fontSize={30} fontWeight={700}>
              YEAR {markYear}
            </text>
          </>
        ) : null}
        <line x1={0} y1={height} x2={CW} y2={height} stroke={L.line} strokeWidth={2} />
      </svg>
      <div
        style={{
          display: 'flex',
          gap: 40,
          marginTop: 20,
          fontSize: 28,
          color: L.dim,
          fontWeight: 700,
          letterSpacing: 2,
        }}
      >
        <span style={{color: L.red}}>■ INTEREST</span>
        <span style={{color: L.green}}>■ BUYS THE HOUSE</span>
        <span style={{marginLeft: 'auto'}}>YEAR 1 → YEAR 25</span>
      </div>
    </div>
  );
};

/** Two stacked bars: what you paid vs what you still owe. The screenshot moment. */
export const PaidVsOwed: React.FC<{at: number; paid: number; owed: number}> = ({
  at,
  paid,
  owed,
}) => {
  const frame = useCurrentFrame();
  const max = Math.max(paid, owed);
  const rowStyle: React.CSSProperties = {marginBottom: 54};
  return (
    <div style={{width: CW}}>
      <div style={rowStyle}>
        <div style={{...rise(frame, at, 10), display: 'flex', alignItems: 'baseline', gap: 24}}>
          <span style={{fontSize: 34, letterSpacing: 4, color: L.dim, fontWeight: 700}}>
            YOU PAID
          </span>
          <span style={{fontSize: 84, fontWeight: 700, color: L.ink}}>{gbp(paid)}</span>
        </div>
        <div style={{marginTop: 16}}>
          <Bar at={at + 6} width={paid / max} color={L.green} height={34} />
        </div>
      </div>
      <div style={rowStyle}>
        <div style={{...rise(frame, at + 22, 10), display: 'flex', alignItems: 'baseline', gap: 24}}>
          <span style={{fontSize: 34, letterSpacing: 4, color: L.dim, fontWeight: 700}}>
            YOU STILL OWE
          </span>
          <span style={{fontSize: 84, fontWeight: 700, color: L.red}}>{gbp(owed)}</span>
        </div>
        <div style={{marginTop: 16}}>
          <Bar at={at + 28} width={owed / max} color={L.red} height={34} />
        </div>
      </div>
    </div>
  );
};

const Box: React.FC<{
  label: string;
  color: string;
  at: number;
  sub?: string;
  wide?: boolean;
}> = ({label, color, at, sub, wide}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        ...rise(frame, at, 12),
        width: wide ? 440 : 340,
        padding: '34px 30px',
        borderRadius: 16,
        border: `3px solid ${color}`,
        background: L.panel,
        textAlign: 'center',
      }}
    >
      <div style={{fontSize: 48, fontWeight: 700, color, letterSpacing: 2}}>{label}</div>
      {sub ? <div style={{fontSize: 28, color: L.dim, marginTop: 10}}>{sub}</div> : null}
    </div>
  );
};

/** An arrow between two parties that draws itself on its beat. */
const Arrow: React.FC<{
  at: number;
  label: string;
  color: string;
  reverse?: boolean;
  dashed?: boolean;
  width?: number;
}> = ({at, label, color, reverse, dashed, width = 300}) => {
  const frame = useCurrentFrame();
  const p = ease(frame, at, 16);
  return (
    <div style={{width, textAlign: 'center', opacity: ease(frame, at, 8)}}>
      <div style={{fontSize: 26, color, fontWeight: 700, letterSpacing: 2, marginBottom: 10}}>
        {label}
      </div>
      <div style={{position: 'relative', height: 10}}>
        <div
          style={{
            height: 8,
            width: `${p * 100}%`,
            marginLeft: reverse ? `${(1 - p) * 100}%` : 0,
            background: dashed
              ? `repeating-linear-gradient(90deg, ${color} 0 18px, transparent 18px 32px)`
              : color,
            borderRadius: 4,
          }}
        />
      </div>
    </div>
  );
};

export const FlowDiagram: React.FC<{
  at: number;
  steps: {label: string; color: string; dashed?: boolean; reverse?: boolean}[];
  parties: {label: string; color: string; sub?: string}[];
}> = ({at, steps, parties}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 30}}>
    {parties.map((p, i) => (
      <React.Fragment key={i}>
        <Box label={p.label} color={p.color} sub={p.sub} at={at + i * 8} />
        {steps[i] ? (
          <Arrow
            at={at + 20 + i * 26}
            label={steps[i].label}
            color={steps[i].color}
            dashed={steps[i].dashed}
            reverse={steps[i].reverse}
          />
        ) : null}
      </React.Fragment>
    ))}
  </div>
);

/** Diminishing Musharaka: your green share eats the bank's grey share. */
export const SharedOwnership: React.FC<{at: number; dur: number}> = ({at, dur}) => {
  const frame = useCurrentFrame();
  const p = ease(frame, at, dur);
  const yours = 0.1 + p * 0.9;
  return (
    <div style={{width: CW}}>
      <div
        style={{
          display: 'flex',
          height: 96,
          borderRadius: 14,
          overflow: 'hidden',
          border: `2px solid ${L.line}`,
        }}
      >
        <div
          style={{
            width: `${yours * 100}%`,
            background: L.green,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 24,
            fontSize: 40,
            fontWeight: 700,
            color: '#06251A',
          }}
        >
          YOU {Math.round(yours * 100)}%
        </div>
        <div
          style={{
            flex: 1,
            background: L.grey,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: 24,
            fontSize: 40,
            fontWeight: 700,
            color: '#0B0D10',
          }}
        >
          {1 - yours > 0.1 ? `BANK ${Math.round((1 - yours) * 100)}%` : ''}
        </div>
      </div>
      <div style={{display: 'flex', gap: 40, marginTop: 34}}>
        <div style={{flex: 1}}>
          <div style={{fontSize: 30, letterSpacing: 3, color: L.dim, fontWeight: 700}}>
            RENT — ON THE BANK'S SHARE ONLY
          </div>
          <div style={{marginTop: 12}}>
            <div
              style={{
                height: 26,
                width: `${(1 - yours) * 100}%`,
                background: L.gold,
                borderRadius: 13,
              }}
            />
          </div>
          <div style={{fontSize: 28, color: L.gold, marginTop: 10}}>
            falls every month
          </div>
        </div>
        <div style={{flex: 1}}>
          <div style={{fontSize: 30, letterSpacing: 3, color: L.dim, fontWeight: 700}}>
            BUY-OUT — MOVES THE BOUNDARY
          </div>
          <div style={{marginTop: 12}}>
            <div style={{height: 26, width: '100%', background: L.green, borderRadius: 13}} />
          </div>
          <div style={{fontSize: 28, color: L.green, marginTop: 10}}>
            same amount every month
          </div>
        </div>
      </div>
      <div style={{...rise(frame, at + dur * 0.8, 14), fontSize: 34, color: L.ink, marginTop: 30}}>
        Your position improves as time passes — not in spite of it.
      </div>
    </div>
  );
};

/** Ijara: rent now, title at the end. */
export const OwnershipProgress: React.FC<{at: number; dur: number}> = ({at, dur}) => {
  const frame = useCurrentFrame();
  const p = ease(frame, at, dur);
  const done = p > 0.985;
  return (
    <div style={{width: CW}}>
      <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 14}}>
        <span style={{fontSize: 32, letterSpacing: 4, color: L.dim, fontWeight: 700}}>
          OWNERSHIP
        </span>
        <span style={{fontSize: 32, fontWeight: 700, color: done ? L.green : L.gold}}>
          {Math.round(p * 100)}%
        </span>
      </div>
      <Bar at={at} width={1} color={done ? L.green : L.gold} height={40} dur={dur} />
      <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 22, fontSize: 32}}>
        <span style={{color: done ? L.dim : L.ink}}>
          TITLE: {done ? 'YOU' : 'BANK'}
        </span>
        <span style={{color: L.dim}}>
          Structural insurance · major repairs · total loss → the owner
        </span>
      </div>
    </div>
  );
};
