import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../theme';
import type {Num} from './timing';

// ─────────────────────────────────────────────────────────────────────────────
// The burn-in figures.
//
// Every still in the pack was generated with blank cards, blank tags and blank
// screens on purpose, and the negative spine forbids typography in the image —
// generated text garbles, gets the currency wrong and dates the frame. So every
// number in this film is type laid on in the edit. That is the whole reason the
// pictures are empty.
//
// The palette is the pack's, not the channel's default stage palette, because
// these sit *on* the pack's frames: terracotta for what it costs you, cream for
// neutral figures, gold for the fixed price, a cold blue-white for the one cold
// frame. Nothing here uses the channel's green — this film's "fix" is a locked
// price, and the lock reads better in gold than in green.
// ─────────────────────────────────────────────────────────────────────────────

const P = {
  terracotta: '#E85F42',
  cream: '#E8DCC8',
  gold: '#F5D76E',
  cold: '#BFD4E8',
  ink: '#0B0D10',
};

/** Rises a few px and fades in, settling on a spring. Used by every figure. */
const useRise = (at: number, distance = 26) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - at, fps, config: {damping: 200, mass: 0.7}});
  return {
    opacity: interpolate(s, [0, 1], [0, 1]),
    transform: `translateY(${interpolate(s, [0, 1], [distance, 0]).toFixed(2)}px)`,
  };
};

const Shell: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  at,
  children,
  style,
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 18,
      fontFamily: FONT,
      ...useRise(at),
      ...style,
    }}
  >
    {children}
  </div>
);

const pill: React.CSSProperties = {
  padding: '16px 30px',
  borderRadius: 999,
  background: 'rgba(12,14,18,0.72)',
  border: '1px solid rgba(232,220,200,0.20)',
  backdropFilter: 'blur(14px)',
  color: P.cream,
  fontSize: 46,
  fontWeight: 650,
  letterSpacing: -0.5,
  whiteSpace: 'nowrap',
};

/**
 * The hook figure. The 0% is ringed in terracotta because it is the claim the
 * whole film is about to take apart — the ring is the only thing on screen that
 * disagrees with the words being spoken.
 */
const Hook: React.FC<{n: Extract<Num, {kind: 'hook'}>; at: number}> = ({n, at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const draw = spring({frame: frame - at - 10, fps, config: {damping: 200, mass: 1.1}});
  return (
    <Shell at={at} style={{flexDirection: 'column', gap: 14}}>
      <div style={pill}>{n.text}</div>
      <div style={{position: 'relative', padding: '10px 30px'}}>
        <span
          style={{fontSize: 52, fontWeight: 750, color: P.cream, letterSpacing: -1, textShadow: '0 3px 20px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.8)',}}
        >
          {n.sub}
        </span>
        <svg
          width={300}
          height={110}
          viewBox="0 0 300 110"
          style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)'}}
        >
          <ellipse
            cx={150}
            cy={55}
            rx={132}
            ry={44}
            fill="none"
            stroke={P.terracotta}
            strokeWidth={5}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - draw}
            transform="rotate(-3 150 55)"
          />
        </svg>
      </div>
    </Shell>
  );
};

const Chip: React.FC<{text: string; at: number; color?: string}> = ({text, at, color}) => (
  <Shell at={at}>
    <div style={{...pill, color: color ?? P.cream}}>{text}</div>
  </Shell>
);

/** £90 → £85, with the difference named underneath. The fee, made arithmetic. */
const Split: React.FC<{n: Extract<Num, {kind: 'split'}>; at: number}> = ({n, at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - at - 12, fps, config: {damping: 200}});
  return (
    <Shell at={at} style={{flexDirection: 'column', gap: 12}}>
      <div style={{...pill, display: 'flex', alignItems: 'center', gap: 22}}>
        <span style={{opacity: interpolate(s, [0, 1], [1, 0.42])}}>{n.from}</span>
        <span style={{color: P.terracotta, fontSize: 40}}>→</span>
        <span style={{color: P.cream, fontWeight: 750}}>{n.to}</span>
      </div>
      <div
        style={{
          fontSize: 38,
          fontWeight: 650,
          color: P.terracotta,
          opacity: s,
          letterSpacing: 0.2,
          textShadow: '0 3px 20px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.8)',
        }}
      >
        {n.note}
      </div>
    </Shell>
  );
};

/** The sticker moving. Old price struck through, new one in terracotta. */
const Arrow: React.FC<{n: Extract<Num, {kind: 'arrow'}>; at: number}> = ({n, at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - at - 12, fps, config: {damping: 200}});
  return (
    <Shell at={at}>
      <div style={{...pill, display: 'flex', alignItems: 'center', gap: 20}}>
        <span style={{position: 'relative', opacity: 0.55}}>
          {n.from}
          <span
            style={{
              position: 'absolute',
              left: -4,
              right: -4,
              top: '52%',
              height: 4,
              borderRadius: 2,
              background: P.terracotta,
              transform: `scaleX(${s})`,
              transformOrigin: 'left',
            }}
          />
        </span>
        <span style={{color: P.terracotta, fontSize: 40, opacity: s}}>→</span>
        <span style={{color: P.terracotta, fontWeight: 750, opacity: s}}>{n.to}</span>
      </div>
    </Shell>
  );
};

/** The late fee. The one figure allowed to arrive hard, on the one cold frame. */
const Alert: React.FC<{n: Extract<Num, {kind: 'alert'}>; at: number}> = ({n, at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - at, fps, config: {damping: 14, mass: 0.5, stiffness: 180}});
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        fontFamily: FONT,
        opacity: interpolate(frame - at, [0, 4], [0, 1], {extrapolateRight: 'clamp'}),
        transform: `scale(${interpolate(s, [0, 1], [0.86, 1]).toFixed(3)})`,
      }}
    >
      <div
        style={{
          ...pill,
          color: P.cold,
          borderColor: 'rgba(191,212,232,0.42)',
          background: 'rgba(10,16,24,0.80)',
          letterSpacing: 3,
          fontWeight: 750,
        }}
      >
        {n.text}
      </div>
    </div>
  );
};

/** The rule. Gold, and it does not move — the price stops moving with it. */
const Locked: React.FC<{n: Extract<Num, {kind: 'locked'}>; at: number}> = ({n, at}) => (
  <Shell at={at} style={{flexDirection: 'column', gap: 10}}>
    <div
      style={{
        ...pill,
        color: P.gold,
        fontSize: 60,
        fontWeight: 750,
        borderColor: 'rgba(245,215,110,0.42)',
      }}
    >
      {n.text}
    </div>
    <div style={{fontSize: 34, fontWeight: 700, color: P.gold, letterSpacing: 6, textShadow: '0 3px 20px rgba(0,0,0,0.85), 0 1px 4px rgba(0,0,0,0.8)',}}>
      {n.sub}
    </div>
  </Shell>
);

/** Murabaha's arithmetic, disclosed the way murabaha discloses it. */
const Sum: React.FC<{n: Extract<Num, {kind: 'sum'}>; at: number}> = ({n, at}) => (
  <Shell at={at}>
    <div style={{...pill, fontSize: 39, color: P.gold, borderColor: 'rgba(245,215,110,0.34)'}}>
      {n.text}
    </div>
  </Shell>
);

/** The same price as the locked one, fractured — same shape, built wrong. */
const Cracked: React.FC<{n: Extract<Num, {kind: 'cracked'}>; at: number}> = ({n, at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - at - 8, fps, config: {damping: 200}});
  return (
    <Shell at={at}>
      <div style={{...pill, color: P.gold, fontSize: 60, fontWeight: 750, position: 'relative'}}>
        {n.text}
        <span
          style={{
            position: 'absolute',
            left: '48%',
            bottom: 6,
            width: 3,
            height: `${interpolate(s, [0, 1], [0, 58]).toFixed(1)}%`,
            background: P.terracotta,
            transform: 'rotate(6deg)',
            transformOrigin: 'bottom',
          }}
        />
      </div>
    </Shell>
  );
};

export const Figure: React.FC<{num: Num; at: number}> = ({num, at}) => {
  switch (num.kind) {
    case 'hook':
      return <Hook n={num} at={at} />;
    case 'chip':
      return <Chip text={num.text} at={at} />;
    case 'split':
      return <Split n={num} at={at} />;
    case 'arrow':
      return <Arrow n={num} at={at} />;
    case 'alert':
      return <Alert n={num} at={at} />;
    case 'locked':
      return <Locked n={num} at={at} />;
    case 'sum':
      return <Sum n={num} at={at} />;
    case 'cracked':
      return <Cracked n={num} at={at} />;
  }
};
