import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {C, FONT} from './theme';
import {Ground, Line, Retention, Stage, Tag} from './kinetic';
import {count, money, reveal} from './motion';

// ─────────────────────────────────────────────────────────────────────────────
// Part 15 — "You Paid For Five Years And Owe More" (student loans → Qard Hasan)
//
// 20s, kinetic typography, channel formula: personal-stakes paradox in line 1,
// the receipt, the mechanism, the halal fix, the CTA.
//
// The arithmetic on screen is real: $30,000 at 7% APR against a $150/month
// income-driven payment. Interest bills $175/month, so $25/month is capitalised
// back onto the balance — after 60 payments ($9,000 paid) the balance is
// $31,790. See scripts/part15-math.mjs.
// ─────────────────────────────────────────────────────────────────────────────

const Hook: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const flash = interpolate(frame, [40, 43, 58], [0, 0.16, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <Stage dur={dur}>
      <AbsoluteFill style={{background: C.red, opacity: flash}} />
      <Line text="YOU'VE PAID" at={0} size={148} />
      <Line
        text="FOR FIVE YEARS."
        at={6}
        size={148}
        color={C.gold}
        hit={[1]}
        style={{marginTop: 8}}
      />
      <Line
        text="YOU OWE MORE THAN YOU BORROWED."
        at={40}
        size={104}
        color={C.red}
        hit={[2]}
        style={{marginTop: 48}}
      />
    </Stage>
  );
};

const Receipt: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const paid = count(frame, 34, 20, 0, 9000);
  const owed = count(frame, 62, 24, 30000, 31790);
  const row = (
    label: string,
    value: string,
    w: number,
    color: string,
    at: number,
  ) => {
    const r = reveal(frame, at, 8);
    const grow = interpolate(frame, [at + 4, at + 24], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.poly(3)),
    });
    return (
      <div style={{opacity: r.opacity, transform: r.transform, marginBottom: 34}}>
        <div
          style={{
            color: C.dim,
            fontSize: 32,
            letterSpacing: 4,
            fontWeight: 700,
            marginBottom: 10,
          }}
        >
          {label}
        </div>
        <div style={{fontSize: 108, fontWeight: 700, color, letterSpacing: -4}}>
          {value}
        </div>
        <div
          style={{
            height: 14,
            marginTop: 14,
            width: `${w * grow * 100}%`,
            background: color,
            borderRadius: 7,
          }}
        />
      </div>
    );
  };
  return (
    <Stage dur={dur}>
      <Tag text="THE RECEIPT" at={0} color={C.gold} />
      {row('YOU BORROWED', money(30000), 0.66, C.gold, 8)}
      {row('YOU HAVE PAID', money(paid), 0.2, C.ink, 30)}
      {row('YOU STILL OWE', money(owed), 0.7, C.red, 58)}
      <Line
        text="THE DEBT GREW WHILE YOU PAID IT."
        at={100}
        size={64}
        color={C.ink}
        hit={[1]}
        style={{marginTop: 8}}
      />
    </Stage>
  );
};

const Mechanism: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const bar = (label: string, value: string, w: number, color: string, at: number) => {
    const r = reveal(frame, at, 8);
    const grow = interpolate(frame, [at + 3, at + 22], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.poly(3)),
    });
    return (
      <div
        style={{
          opacity: r.opacity,
          transform: r.transform,
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          marginBottom: 22,
        }}
      >
        <div
          style={{
            height: 78,
            width: `${w * grow * 100}%`,
            background: color,
            borderRadius: 10,
          }}
        />
        <div style={{fontSize: 46, fontWeight: 700, color, whiteSpace: 'nowrap'}}>
          {value}
          <span style={{color: C.dim, fontSize: 30, marginLeft: 12}}>{label}</span>
        </div>
      </div>
    );
  };
  const gap = reveal(frame, 88, 9);
  return (
    <Stage dur={dur}>
      <Tag text="THE MECHANISM" at={0} color={C.ink} />
      <Line text="YOU DIDN'T BORROW" at={6} size={92} />
      <Line
        text="A THING. YOU RENTED MONEY."
        at={16}
        size={92}
        color={C.gold}
        hit={[2]}
        style={{marginTop: 6}}
      />
      <div style={{marginTop: 52}}>
        {bar('INTEREST BILLED', '$175', 0.5, C.red, 40)}
        {bar('YOU PAY', '$150', 0.43, C.ink, 62)}
      </div>
      <div
        style={{
          opacity: gap.opacity,
          transform: gap.transform,
          fontSize: 62,
          fontWeight: 700,
          color: C.red,
          marginTop: 14,
        }}
      >
        THE $25 GAP IS ADDED TO WHAT YOU OWE.
      </div>
    </Stage>
  );
};

const Fix: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const cards = [
    ['QARD HASAN', 'Borrow 30,000. Repay 30,000. A loan earns nothing — ever.'],
    ['INCOME SHARE', 'They take a share of what you earn. No earnings, no payment.'],
  ];
  return (
    <Stage dur={dur} entry="arrival" exit="arrival">
      <Tag text="THE FIX" at={2} color={C.green} />
      <Line text="MONEY IS NOT" at={8} size={100} />
      <Line
        text="A THING YOU RENT."
        at={16}
        size={100}
        color={C.green}
        hit={[3]}
        style={{marginTop: 4}}
      />
      <div style={{marginTop: 44}}>
        {cards.map(([t, s], i) => {
          const at = 44 + i * 16;
          const r = reveal(frame, at, 9);
          return (
            <div
              key={i}
              style={{
                opacity: r.opacity,
                transform: r.transform,
                background: C.panel,
                borderLeft: `10px solid ${C.green}`,
                borderRadius: 12,
                padding: '24px 28px',
                marginBottom: 18,
              }}
            >
              <div style={{fontSize: 56, fontWeight: 700, color: C.ink}}>{t}</div>
              <div style={{fontSize: 34, color: C.dim, marginTop: 8}}>{s}</div>
            </div>
          );
        })}
      </div>
      <Line
        text="THE LENDER TAKES RISK, OR TAKES NOTHING."
        at={84}
        size={50}
        color={C.gold}
        style={{marginTop: 22}}
      />
    </Stage>
  );
};

const CTA: React.FC<{dur: number}> = ({dur}) => (
  <Stage dur={dur} entry="lift">
    <Line text="PART 15" at={0} size={70} color={C.gold} />
    <Line
      text="THE MONEY MACHINE, DECODED"
      at={5}
      size={90}
      style={{marginTop: 10}}
    />
    <Line
      text="No jargon, just mechanisms."
      at={22}
      size={46}
      color={C.dim}
      style={{marginTop: 30}}
    />
    <Line
      text="FOLLOW — PART 16: BUY NOW, PAY LATER"
      at={38}
      size={48}
      color={C.green}
      style={{marginTop: 38}}
    />
  </Stage>
);

// ── film ─────────────────────────────────────────────────────────────────────

const SCENES: {C: React.FC<{dur: number}>; dur: number}[] = [
  {C: Hook, dur: 100},
  {C: Receipt, dur: 145},
  {C: Mechanism, dur: 145},
  {C: Fix, dur: 120},
  {C: CTA, dur: 90},
]; // 600 frames = 20.0s @ 30fps

export const PART15_FRAMES = SCENES.reduce((n, s) => n + s.dur, 0);

export const Part15: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  let t = 0;
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      <Ground />
      {SCENES.map((s, i) => {
        const from = t;
        t += s.dur;
        return (
          <Sequence key={i} from={from} durationInFrames={s.dur}>
            <s.C dur={s.dur} />
          </Sequence>
        );
      })}
      <Retention frame={frame} total={durationInFrames} />
    </AbsoluteFill>
  );
};
