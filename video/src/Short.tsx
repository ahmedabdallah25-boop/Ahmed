import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion';
import {C, FONT} from './theme';
import {Line, Stage, Tag} from './kinetic';
import {count, money, reveal} from './motion';

// ── scenes ───────────────────────────────────────────────────────────────────

const Hook: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  // The screen takes the hit when the second line lands.
  const flash = interpolate(frame, [56, 59, 74], [0, 0.16, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <Stage dur={dur}>
      <AbsoluteFill style={{background: C.red, opacity: flash}} />
      <Line text="YOUR RAISE" at={0} size={150} hit={[]} weight={700} />
      <Line
        text="WAS 5%."
        at={8}
        size={150}
        color={C.gold}
        hit={[1]}
        style={{marginTop: 8}}
      />
      <Line
        text="YOU STILL GOT POORER."
        at={56}
        size={132}
        color={C.red}
        hit={[3]}
        style={{marginTop: 56}}
      />
    </Stage>
  );
};

const Receipt: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const salary = count(frame, 24, 26, 52000, 54600);
  const basket = count(frame, 74, 26, 52000, 55692); // same basket, +7.1%
  const barA = interpolate(frame, [24, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.poly(3)),
  });
  const barB = interpolate(frame, [74, 100], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.poly(3)),
  });
  const row = (
    label: string,
    value: string,
    w: number,
    color: string,
    at: number,
  ) => {
    const r = reveal(frame, at, 8);
    return (
      <div style={{opacity: r.opacity, transform: r.transform, marginBottom: 46}}>
        <div
          style={{
            color: C.dim,
            fontSize: 34,
            letterSpacing: 4,
            fontWeight: 700,
            marginBottom: 14,
          }}
        >
          {label}
        </div>
        <div style={{fontSize: 118, fontWeight: 700, color, letterSpacing: -4}}>
          {value}
        </div>
        <div
          style={{
            height: 16,
            marginTop: 18,
            width: `${w * 100}%`,
            background: color,
            borderRadius: 8,
          }}
        />
      </div>
    );
  };
  return (
    <Stage dur={dur}>
      <Tag text="THE RECEIPT" at={0} color={C.gold} />
      {row('YOUR PAY', money(salary), barA * 0.62, C.gold, 16)}
      {row('THE SAME BASKET OF STUFF', money(basket), barB * 0.72, C.red, 66)}
      <Line
        text="YOUR MONEY BUYS 2% LESS."
        at={128}
        size={92}
        color={C.ink}
        hit={[3]}
        style={{marginTop: 20}}
      />
      <Line
        text="THE RAISE WAS A PAY CUT WITH BETTER NEWS."
        at={150}
        size={54}
        color={C.dim}
        weight={700}
        style={{marginTop: 26}}
      />
    </Stage>
  );
};

const Mechanism: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  // Money supply stack: units keep appearing — the frame gains information.
  const units = 24;
  return (
    <Stage dur={dur}>
      <Tag text="THE MECHANISM" at={0} color={C.ink} />
      <Line text="NOBODY TOOK IT" at={10} size={104} />
      <Line
        text="OUT OF YOUR ACCOUNT."
        at={20}
        size={104}
        style={{marginTop: 6}}
      />
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 14,
          margin: '54px 0',
          maxWidth: 880,
        }}
      >
        {new Array(units).fill(0).map((_, i) => {
          const at = 62 + i * 2.2;
          const r = reveal(frame, at, 8);
          const old = i < 6;
          return (
            <div
              key={i}
              style={{
                width: 96,
                height: 96,
                borderRadius: 14,
                background: old ? C.gold : C.panel,
                border: `4px solid ${old ? C.gold : C.gold + '55'}`,
                opacity: old ? 1 : r.opacity * 0.9,
                transform: old ? 'none' : r.transform,
              }}
            />
          );
        })}
      </div>
      <Line
        text="THEY TOOK IT OUT OF WHAT EACH ONE IS WORTH."
        at={136}
        size={86}
        color={C.red}
        hit={[6]}
      />
    </Stage>
  );
};

const Cause: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const chain = ['A LOAN IS WRITTEN', 'NEW MONEY EXISTS', 'YOURS IS WORTH LESS'];
  return (
    <Stage dur={dur}>
      <Tag text="WHY IT HAPPENS" at={0} color={C.gold} />
      <Line text="BANKS DON'T LEND" at={8} size={98} />
      <Line
        text="SAVED MONEY."
        at={18}
        size={98}
        color={C.gold}
        style={{marginTop: 4}}
      />
      <Line
        text="THEY TYPE IT."
        at={44}
        size={98}
        color={C.gold}
        hit={[1]}
        style={{marginTop: 4}}
      />
      <div style={{marginTop: 60}}>
        {chain.map((t, i) => {
          const at = 78 + i * 18;
          const r = reveal(frame, at, 9);
          // Each link is visibly launched by the one above it.
          const lineGrow = interpolate(frame, [at + 6, at + 16], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.poly(3)),
          });
          return (
            <div key={i}>
              <div
                style={{
                  opacity: r.opacity,
                  transform: r.transform,
                  fontSize: 62,
                  fontWeight: 700,
                  color: i === 2 ? C.red : C.ink,
                  letterSpacing: -1,
                }}
              >
                {t}
              </div>
              {i < 2 ? (
                <div
                  style={{
                    width: 8,
                    height: 46 * lineGrow,
                    background: C.gold,
                    margin: '10px 0 10px 6px',
                    borderRadius: 4,
                  }}
                />
              ) : null}
            </div>
          );
        })}
      </div>
      <Line
        text="YOUR RAISE WAS CHASING MONEY THAT WAS ALREADY PRINTED."
        at={150}
        size={52}
        color={C.dim}
        style={{marginTop: 46}}
      />
    </Stage>
  );
};

const Fix: React.FC<{dur: number}> = ({dur}) => {
  const frame = useCurrentFrame();
  const cards = [
    ['OWN THE ASSET', 'Equity, property, a share of a real business'],
    ['GET PAID IN RISK', 'Profit-share (mudarabah) reprices with the economy'],
    ['HOLD SOUND MONEY', 'Something no one can type into existence'],
  ];
  return (
    <Stage dur={dur} entry="arrival" exit="arrival">
      <Tag text="THE FIX" at={4} color={C.green} />
      <Line
        text="STOP GETTING PAID"
        at={10}
        size={104}
        color={C.ink}
      />
      <Line
        text="IN SOMETHING THEY CAN PRINT."
        at={20}
        size={104}
        color={C.green}
        hit={[3]}
        style={{marginTop: 4}}
      />
      <div style={{marginTop: 56}}>
        {cards.map(([t, s], i) => {
          const at = 62 + i * 16;
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
                padding: '26px 30px',
                marginBottom: 20,
              }}
            >
              <div style={{fontSize: 58, fontWeight: 700, color: C.ink}}>{t}</div>
              <div style={{fontSize: 34, color: C.dim, marginTop: 8}}>{s}</div>
            </div>
          );
        })}
      </div>
      <Line
        text="1,400 YEARS OLD. STILL THE ONLY EXIT."
        at={128}
        size={56}
        color={C.gold}
        style={{marginTop: 30}}
      />
    </Stage>
  );
};

const CTA: React.FC<{dur: number}> = ({dur}) => (
  <Stage dur={dur} entry="lift">
    <Line text="PART 14" at={0} size={72} color={C.gold} />
    <Line
      text="THE MONEY MACHINE, DECODED"
      at={6}
      size={94}
      color={C.ink}
      style={{marginTop: 10}}
    />
    <Line
      text="No jargon, just mechanisms."
      at={26}
      size={48}
      color={C.dim}
      weight={700}
      style={{marginTop: 34}}
    />
    <Line
      text="FOLLOW — PART 15: STUDENT LOANS"
      at={44}
      size={52}
      color={C.green}
      style={{marginTop: 44}}
    />
  </Stage>
);

// ── film ─────────────────────────────────────────────────────────────────────

const SCENES: {C: React.FC<{dur: number}>; dur: number}[] = [
  {C: Hook, dur: 120},
  {C: Receipt, dur: 210},
  {C: Mechanism, dur: 210},
  {C: Cause, dur: 210},
  {C: Fix, dur: 210},
  {C: CTA, dur: 120},
];

export const Short: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  let t = 0;
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: FONT}}>
      {/* Static ground plane — a carrier that never cuts, so the eye stays put. */}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.ink}0A 1px, transparent 1px), linear-gradient(90deg, ${C.ink}0A 1px, transparent 1px)`,
          backgroundSize: '90px 90px',
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 70% at 50% 22%, transparent 30%, ${C.bg} 100%)`,
        }}
      />

      {SCENES.map((s, i) => {
        const from = t;
        t += s.dur;
        return (
          <Sequence key={i} from={from} durationInFrames={s.dur}>
            <s.C dur={s.dur} />
          </Sequence>
        );
      })}

      {/* Retention bar — the only element that spans every cut. */}
      <AbsoluteFill style={{justifyContent: 'flex-start'}}>
        <div style={{height: 10, background: '#ffffff14'}}>
          <div
            style={{
              height: 10,
              width: `${(frame / durationInFrames) * 100}%`,
              background: C.gold,
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
