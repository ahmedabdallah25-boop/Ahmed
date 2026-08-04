import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {FONT} from '../theme';

// ─────────────────────────────────────────────────────────────────────────────
// The motion-graphic cards.
//
// 125 of this film's 173 seconds arrived with no picture at all. These cover it.
// They are not filler: the stretch they carry (86s-139s) is the argument — "so is
// it halal / ask three questions" — and an argument reads better as type that
// arrives in order than as another still life of a brass object. The stills carry
// what can be photographed; the cards carry what has to be reasoned.
//
// RULES THEY ALL FOLLOW
//  * Nothing is ever on a flat black field. Every card sits on one of the 16
//    stills, blurred and pushed down to near-black, drifting slowly. The film
//    should not visibly change medium when it runs out of photography.
//  * Type arrives, it does not appear. Words land one at a time on a spring, with
//    the whole stagger inside ~500ms, matching src/Short.tsx's kinetic idiom.
//  * One idea per card. If a card needs two sentences it gets a sub line, and the
//    sub arrives after the head has landed — never together.
//  * Colour carries meaning, the same way it does on the stills: terracotta for
//    what it costs you, gold for the fixed price, cold blue for the late-fee
//    frames, cream for everything neutral.
// ─────────────────────────────────────────────────────────────────────────────

const P = {
  terracotta: '#E85F42',
  cream: '#E8DCC8',
  gold: '#F5D76E',
  cold: '#BFD4E8',
  dim: 'rgba(232,220,200,0.52)',
  ink: '#05070A',
};

const SHADOW = '0 4px 34px rgba(0,0,0,0.80), 0 2px 8px rgba(0,0,0,0.7)';

/** Spring 0→1, `at` frames after the card starts. */
const useAt = (at: number, mass = 0.6) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - at, fps, config: {damping: 200, mass}});
};

/**
 * The still behind a card: blurred, desaturated, pushed to near-black, and drifting
 * a little so the frame is never actually static. Which still is chosen per card in
 * klarna-edit.mjs — normally the one the section is about, so the background keeps
 * a thread back to the photography.
 */
export const CardBg: React.FC<{still: number; dur: number; cold?: boolean; own?: boolean}> = ({
  still,
  dur,
  cold,
  own,
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, dur], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{backgroundColor: P.ink, overflow: 'hidden'}}>
      <Img
        src={staticFile(`broll/klarna/klarna-${String(still).padStart(2, '0')}.jpg`)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: own
            ? `saturate(${cold ? 0.72 : 0.94}) brightness(0.82)`
            : `blur(26px) saturate(${cold ? 0.5 : 0.75}) brightness(0.42)`,
          transform: `scale(${(1.14 + 0.04 * t).toFixed(4)}) translateX(${(t * -18).toFixed(1)}px)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: cold
            ? `radial-gradient(70% 50% at 50% 46%, rgba(30,58,95,${own ? 0.16 : 0.34}), rgba(4,8,14,${own ? 0.52 : 0.84}) 76%)`
            : `radial-gradient(70% 50% at 50% 46%, rgba(232,140,66,${own ? 0.07 : 0.12}), rgba(5,7,10,${own ? 0.5 : 0.84}) 76%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/** A line of kinetic type: words land left to right, whole stagger under ~500ms. */
const Words: React.FC<{
  text: string;
  at: number;
  size: number;
  color?: string;
  accent?: string;
  weight?: number;
  align?: 'center' | 'left';
}> = ({text, at, size, color = P.cream, accent, weight = 750, align = 'center'}) => {
  const words = text.split(' ');
  const step = Math.min(3, 15 / Math.max(1, words.length));
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: `${size * 0.12}px ${size * 0.26}px`,
        justifyContent: align === 'center' ? 'center' : 'flex-start',
        maxWidth: 920,
      }}
    >
      {words.map((w, i) => (
        <Word
          key={i}
          w={w}
          at={at + i * step}
          size={size}
          weight={weight}
          color={
            accent && w.replace(/[^\w’']/g, '').toLowerCase() === accent.toLowerCase()
              ? P.terracotta
              : color
          }
        />
      ))}
    </div>
  );
};

const Word: React.FC<{w: string; at: number; size: number; weight: number; color: string}> = ({
  w,
  at,
  size,
  weight,
  color,
}) => {
  const s = useAt(at);
  return (
    <span
      style={{
        fontFamily: FONT,
        fontSize: size,
        lineHeight: 1.04,
        fontWeight: weight,
        letterSpacing: -size * 0.022,
        color,
        textShadow: SHADOW,
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [26, 0]).toFixed(2)}px)`,
        display: 'inline-block',
      }}
    >
      {w}
    </span>
  );
};

const Stage: React.FC<{children: React.ReactNode; gap?: number}> = ({children, gap = 34}) => (
  <AbsoluteFill
    style={{
      padding: '0 80px',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap,
      fontFamily: FONT,
    }}
  >
    {children}
  </AbsoluteFill>
);

const Sub: React.FC<{text: string; at: number; color?: string}> = ({text, at, color = P.dim}) => {
  const s = useAt(at, 0.8);
  return (
    <span
      style={{
        fontSize: 44,
        fontWeight: 600,
        color,
        textAlign: 'center',
        lineHeight: 1.28,
        maxWidth: 860,
        textShadow: SHADOW,
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [16, 0]).toFixed(2)}px)`,
      }}
    >
      {text}
    </span>
  );
};

// ── statement ────────────────────────────────────────────────────────────────
const Statement: React.FC<{c: any}> = ({c}) => (
  <Stage gap={30}>
    {c.text.split('\n').map((line: string, i: number) => (
      <Words key={i} text={line} at={2 + i * 8} size={c.big ? 116 : 88} accent={c.accent} />
    ))}
    {c.sub ? <Sub text={c.sub} at={16} /> : null}
  </Stage>
);

// ── flow: KLARNA → THE SHOP → YOU ────────────────────────────────────────────
const FlowNode: React.FC<{n: string; i: number; lit: boolean}> = ({n, i, lit}) => {
  const s = useAt(2 + i * 7);
  const link = useAt(5 + i * 7);
  return (
    <>
      {i > 0 ? (
        <div
          style={{
            width: 3,
            height: 46,
            background: P.terracotta,
            opacity: link,
            transformOrigin: 'top',
            transform: `scaleY(${link.toFixed(3)})`,
          }}
        />
      ) : null}
      <div
        style={{
          padding: '20px 44px',
          borderRadius: 18,
          border: `2px solid ${lit ? P.terracotta : 'rgba(232,220,200,0.26)'}`,
          background: lit ? 'rgba(232,95,66,0.14)' : 'rgba(12,14,18,0.66)',
          color: lit ? P.terracotta : P.cream,
          fontSize: 54,
          fontWeight: 750,
          letterSpacing: 2,
          opacity: s,
          transform: `translateY(${interpolate(s, [0, 1], [24, 0]).toFixed(2)}px)`,
          textShadow: SHADOW,
        }}
      >
        {n}
      </div>
    </>
  );
};

const Flow: React.FC<{c: any}> = ({c}) => (
  <Stage gap={40}>
    <div style={{display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center'}}>
      {c.nodes.map((n: string, i: number) => (
        <FlowNode key={n} n={n} i={i} lit={i === c.lit} />
      ))}
    </div>
    {c.caption ? <Sub text={c.caption} at={26} /> : null}
  </Stage>
);

// ── number: £90 → £85 ────────────────────────────────────────────────────────
const NumberCard: React.FC<{c: any}> = ({c}) => {
  const a = useAt(2);
  const b = useAt(12);
  return (
    <Stage gap={26}>
      <div style={{display: 'flex', alignItems: 'center', gap: 40}}>
        <span
          style={{
            fontSize: 130,
            fontWeight: 750,
            color: P.cream,
            opacity: interpolate(a, [0, 1], [0, 1]) * interpolate(b, [0, 1], [1, 0.4]),
            textShadow: SHADOW,
          }}
        >
          {c.from}
        </span>
        <span style={{fontSize: 84, color: P.terracotta, opacity: b, textShadow: SHADOW}}>→</span>
        <span
          style={{
            fontSize: 130,
            fontWeight: 750,
            color: P.terracotta,
            opacity: b,
            transform: `translateY(${interpolate(b, [0, 1], [22, 0]).toFixed(2)}px)`,
            textShadow: SHADOW,
          }}
        >
          {c.to}
        </span>
      </div>
      {c.note ? <Sub text={c.note} at={22} /> : null}
    </Stage>
  );
};

// ── pct: a bar that fills from 3% to 6% ──────────────────────────────────────
const Pct: React.FC<{c: any}> = ({c}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - 6, fps, config: {damping: 200, mass: 1.4}});
  const v: number = interpolate(s, [0, 1], [Number(c.from), Number(c.to)]);
  return (
    <Stage gap={30}>
      <span style={{fontSize: 40, letterSpacing: 7, color: P.dim, opacity: useAt(2), textShadow: SHADOW}}>
        {c.label}
      </span>
      <span style={{fontSize: 190, fontWeight: 780, color: P.terracotta, textShadow: SHADOW, opacity: useAt(4)}}>
        {v.toFixed(0)}%
      </span>
      <div style={{width: 620, height: 12, borderRadius: 99, background: 'rgba(232,220,200,0.16)'}}>
        <div
          style={{
            height: '100%',
            borderRadius: 99,
            width: `${(v / 10) * 100}%`,
            background: P.terracotta,
          }}
        />
      </div>
      <Sub text="of every sale — not just the Klarna ones" at={24} />
    </Stage>
  );
};

// ── ledger: label / value rows ───────────────────────────────────────────────
const LedgerRow: React.FC<{label: string; value: string; i: number; last: boolean}> = ({
  label,
  value,
  i,
  last,
}) => {
  const s = useAt(3 + i * 10);
  const neg = value === 'NO';
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        width: 880,
        paddingBottom: 16,
        borderBottom: '1px solid rgba(232,220,200,0.18)',
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [20, 0]).toFixed(2)}px)`,
      }}
    >
      <span style={{fontSize: 50, fontWeight: 620, color: P.dim, textShadow: SHADOW}}>{label}</span>
      <span
        style={{
          fontSize: 74,
          fontWeight: 780,
          color: neg ? P.dim : last ? P.terracotta : P.cream,
          textShadow: SHADOW,
        }}
      >
        {value}
      </span>
    </div>
  );
};

const Ledger: React.FC<{c: any}> = ({c}) => (
  <Stage gap={22}>
    {c.rows.map(([label, value]: [string, string], i: number) => (
      <LedgerRow key={label} label={label} value={value} i={i} last={i === c.rows.length - 1} />
    ))}
  </Stage>
);

// ── question: ONE / TWO / THREE ──────────────────────────────────────────────
const Question: React.FC<{c: any}> = ({c}) => {
  const s = useAt(1);
  return (
    <Stage gap={30}>
      <div style={{display: 'flex', alignItems: 'center', gap: 22, opacity: s}}>
        <div style={{width: 58, height: 3, background: P.terracotta}} />
        <span style={{fontSize: 46, fontWeight: 780, letterSpacing: 10, color: P.terracotta, textShadow: SHADOW}}>
          {c.n}
        </span>
        <div style={{width: 58, height: 3, background: P.terracotta}} />
      </div>
      {c.q.split('\n').map((line: string, i: number) => (
        <Words key={i} text={line} at={6 + i * 8} size={92} />
      ))}
      {c.sub ? <Sub text={c.sub} at={26} /> : null}
    </Stage>
  );
};

// ── verdict: a stamp that lands ──────────────────────────────────────────────
const Verdict: React.FC<{c: any}> = ({c}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - 2, fps, config: {damping: 13, mass: 0.7, stiffness: 170}});
  return (
    <Stage>
      <div
        style={{
          padding: '26px 56px',
          border: `4px solid ${P.terracotta}`,
          borderRadius: 14,
          color: P.terracotta,
          fontSize: c.text.length > 18 ? 62 : 82,
          fontWeight: 800,
          letterSpacing: 3,
          textAlign: 'center',
          textShadow: SHADOW,
          background: 'rgba(12,14,18,0.60)',
          opacity: interpolate(frame, [0, 4], [0, 1], {extrapolateRight: 'clamp'}),
          transform: `scale(${interpolate(s, [0, 1], [1.5, 1]).toFixed(3)}) rotate(-3deg)`,
        }}
      >
        {c.text}
      </div>
    </Stage>
  );
};

// ── balance: what is permitted vs what ends the argument ─────────────────────
// Stacked, not side by side. Two columns of running text in a 9:16 frame gives
// each side ~380px and wraps "A higher price for waiting" onto three lines; one
// block above the other gives both the full column width and reads top-to-bottom,
// which is the direction the frame already runs.
const BalanceItem: React.FC<{it: string; at: number; on: boolean}> = ({it, at, on}) => {
  const s = useAt(at);
  return (
    <span
      style={{
        fontSize: 44,
        fontWeight: 650,
        color: on ? P.cream : P.dim,
        textShadow: SHADOW,
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [14, 0]).toFixed(2)}px)`,
      }}
    >
      {it}
    </span>
  );
};

const BalanceBlock: React.FC<{items: string[]; on: boolean; at: number; tint: string}> = ({
  items,
  on,
  at,
  tint,
}) => (
  <div
    style={{
      width: 920,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      padding: '28px 34px',
      borderRadius: 22,
      border: `2px solid ${on ? tint : 'rgba(232,220,200,0.12)'}`,
      background: on ? `${tint}1A` : 'rgba(10,12,16,0.46)',
      opacity: on ? 1 : 0.34,
    }}
  >
    {items.map((it, i) => (
      <BalanceItem key={it} it={it} at={at + i * 6} on={on} />
    ))}
  </div>
);

const Balance: React.FC<{c: any}> = ({c}) => {
  const litLeft = c.lit === 'left';
  const v = useAt(30);
  return (
    <Stage gap={22}>
      {c.head ? <Sub text={c.head} at={0} color={P.cream} /> : null}
      <BalanceBlock items={c.left} on={litLeft} at={4} tint={P.gold} />
      <BalanceBlock items={c.right} on={!litLeft} at={4} tint={P.terracotta} />
      <div
        style={{
          fontSize: 62,
          fontWeight: 800,
          letterSpacing: 2,
          color: litLeft ? P.gold : P.terracotta,
          textShadow: SHADOW,
          opacity: v,
          transform: `translateY(${interpolate(v, [0, 1], [18, 0]).toFixed(2)}px)`,
        }}
      >
        {c.verdict}
      </div>
    </Stage>
  );
};

// ── era: 1,400 years ─────────────────────────────────────────────────────────
const Era: React.FC<{c: any}> = ({c}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - 4, fps, config: {damping: 200, mass: 1.6}});
  return (
    <Stage gap={20}>
      <Sub text={c.text} at={1} />
      <span
        style={{
          fontSize: 150,
          fontWeight: 800,
          color: P.gold,
          letterSpacing: -3,
          textShadow: SHADOW,
          opacity: useAt(4),
        }}
      >
        {Math.round(interpolate(s, [0, 1], [0, 1400])).toLocaleString()}
      </span>
      <span style={{fontSize: 56, fontWeight: 700, color: P.gold, letterSpacing: 6, opacity: useAt(14)}}>
        YEARS
      </span>
    </Stage>
  );
};

// ── steps: the murabaha sequence ─────────────────────────────────────────────
const Step: React.FC<{it: string; i: number}> = ({it, i}) => {
  const s = useAt(3 + i * 11);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 26,
        width: 880,
        opacity: s,
        transform: `translateX(${interpolate(s, [0, 1], [-26, 0]).toFixed(2)}px)`,
      }}
    >
      <span
        style={{
          width: 62,
          height: 62,
          flexShrink: 0,
          borderRadius: 99,
          border: `2px solid ${P.gold}`,
          color: P.gold,
          fontSize: 34,
          fontWeight: 780,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {i + 1}
      </span>
      <span style={{fontSize: 58, fontWeight: 700, color: P.cream, textShadow: SHADOW}}>{it}</span>
    </div>
  );
};

const Steps: React.FC<{c: any}> = ({c}) => (
  <Stage gap={24}>
    {c.items.map((it: string, i: number) => (
      <Step key={it} it={it} i={i} />
    ))}
  </Stage>
);

export const Card: React.FC<{c: any; dur: number; own?: boolean}> = ({c, dur, own}) => {
  const body = () => {
    switch (c.type) {
      case 'statement':
        return <Statement c={c} />;
      case 'flow':
        return <Flow c={c} />;
      case 'number':
        return <NumberCard c={c} />;
      case 'pct':
        return <Pct c={c} />;
      case 'ledger':
        return <Ledger c={c} />;
      case 'question':
        return <Question c={c} />;
      case 'verdict':
        return <Verdict c={c} />;
      case 'balance':
        return <Balance c={c} />;
      case 'era':
        return <Era c={c} />;
      case 'steps':
        return <Steps c={c} />;
      default:
        return null;
    }
  };
  return (
    <AbsoluteFill>
      {own ? null : <CardBg still={c.bg} dur={dur} cold={c.cold} />}
      {body()}
    </AbsoluteFill>
  );
};
