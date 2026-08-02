import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {FONT} from '../theme';
import {L} from '../longform/ui';

// ─────────────────────────────────────────────────────────────────────────────
// The overlay's shape language.
//
// Borrowed from the reference film: high corner radius, cards that pop on a
// backOut curve, paths that draw themselves on, large soft shadows for depth.
// Not borrowed: its palette. The channel's own colours already carry meaning —
// gold is money, red is what riba costs you, green is the halal fix — so a
// graphic's colour is a statement, and swapping in someone else's yellow would
// throw that away.
//
// Everything here sits over photoreal footage, so every surface is slightly
// translucent and blurred behind: the image stays visible through the graphic
// instead of being boxed out by it.
// ─────────────────────────────────────────────────────────────────────────────

export const RADIUS = 26;
export const SHADOW = '0 24px 60px rgba(0,0,0,0.55)';

/** The film's one current runs left, matching hyperframes/inflation-ledger.json. */
const CURRENT = -1;
const TRAVEL = 90;

const backOut = Easing.bezier(0.34, 1.56, 0.64, 1);

export type Vector = 'current' | 'arrival';

/**
 * Seam for an overlay element: it arrives already in flight from the right and
 * leaves to the left, so nothing ever starts or stops dead. `arrival` spends
 * the reserved Z vector instead — kept for the one problem → fix boundary.
 */
export const beatSeam = (
  frame: number,
  dur: number,
  entry: Vector = 'current',
  exit: Vector = 'current',
  enterFrames = 10,
  exitFrames = 8,
) => {
  let x = 0;
  let y = 0;
  let scale = 1;
  let opacity = 1;
  let blur = 0;

  if (frame < enterFrames) {
    const p = interpolate(frame, [0, enterFrames], [0, 1], {
      easing: backOut,
      extrapolateRight: 'clamp',
    });
    if (entry === 'arrival') {
      scale = interpolate(p, [0, 1], [1.22, 1]);
    } else {
      x = interpolate(p, [0, 1], [-CURRENT * TRAVEL, 0]);
      scale = interpolate(p, [0, 1], [0.92, 1]);
    }
    y = interpolate(p, [0, 1], [14, 0]);
    opacity = interpolate(frame, [0, enterFrames * 0.55], [0, 1], {
      extrapolateRight: 'clamp',
    });
    blur = interpolate(p, [0, 1], [10, 0]);
  }

  const e = dur - exitFrames;
  if (frame > e) {
    const p = interpolate(frame, [e, dur], [0, 1], {
      easing: Easing.in(Easing.cubic),
      extrapolateLeft: 'clamp',
    });
    if (exit === 'arrival') {
      scale = interpolate(p, [0, 1], [1, 0.86]);
    } else {
      x = interpolate(p, [0, 1], [0, CURRENT * TRAVEL]);
    }
    opacity = Math.min(
      opacity,
      interpolate(p, [0.35, 1], [1, 0], {extrapolateLeft: 'clamp'}),
    );
  }

  return {
    opacity,
    filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : undefined,
    transform: `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) scale(${scale.toFixed(4)})`,
  };
};

/** Wraps any overlay element in the seam, and unmounts it once it is gone. */
export const Beat: React.FC<{
  dur: number;
  children: React.ReactNode;
  entry?: Vector;
  exit?: Vector;
  style?: React.CSSProperties;
}> = ({dur, children, entry, exit, style}) => {
  const frame = useCurrentFrame();
  const s = beatSeam(frame, dur, entry, exit);
  if (s.opacity <= 0.001) return null;
  return <div style={{...style, ...s, fontFamily: FONT}}>{children}</div>;
};

// ── surfaces ─────────────────────────────────────────────────────────────────

const glass: React.CSSProperties = {
  background: `${L.panel}D9`,
  backdropFilter: 'blur(18px)',
  WebkitBackdropFilter: 'blur(18px)',
  border: `2px solid ${L.ink}1A`,
  borderRadius: RADIUS,
  boxShadow: SHADOW,
};

/**
 * Section marker — the small uppercase label that names what is happening.
 *
 * It carries its own dark pill rather than sitting as bare type. Over the
 * darker shots a text shadow would have been enough, but the footage also lands
 * on bright cream walls and pale skies, where gold-on-cream disappears. The
 * pill makes the tag legible on every shot in the film instead of most of them.
 */
export const Tag: React.FC<{text: string; color?: string}> = ({
  text,
  color = L.gold,
}) => (
  <div
    style={{
      ...glass,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 18,
      padding: '18px 32px 18px 22px',
      borderRadius: 999,
    }}
  >
    <div
      style={{
        width: 10,
        height: 40,
        background: color,
        borderRadius: 5,
        boxShadow: `0 0 26px ${color}80`,
      }}
    />
    <div
      style={{
        fontSize: 36,
        fontWeight: 800,
        letterSpacing: 6,
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        color,
        textShadow: '0 4px 18px rgba(0,0,0,0.7)',
      }}
    >
      {text}
    </div>
  </div>
);

/**
 * A figure with its label. `accent` is the whole point — gold for money, red
 * for what it costs, green for the fix — so it is required rather than
 * defaulted, to stop cards drifting into a decorative grey.
 */
export const StatCard: React.FC<{
  label: string;
  value: string;
  sub?: string;
  accent: string;
}> = ({label, value, sub, accent}) => (
  <div
    style={{
      ...glass,
      borderLeft: `10px solid ${accent}`,
      padding: '34px 44px 38px',
      minWidth: 520,
    }}
  >
    <div
      style={{
        fontSize: 27,
        fontWeight: 700,
        letterSpacing: 5,
        textTransform: 'uppercase',
        color: L.dim,
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontSize: 108,
        fontWeight: 800,
        letterSpacing: -4,
        lineHeight: 1.05,
        marginTop: 8,
        color: accent,
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {value}
    </div>
    {sub ? (
      <div
        style={{
          fontSize: 32,
          lineHeight: 1.3,
          color: L.ink,
          marginTop: 10,
          // Explicit line breaks in copy are honoured, so a two-beat sub line
          // ("The stack grew. / The basket shrank.") breaks where it is meant to.
          whiteSpace: 'pre-line',
        }}
      >
        {sub}
      </div>
    ) : null}
  </div>
);

/**
 * Counts a figure up (or down) to its value and holds. Used where the number
 * itself is the point — the moment the audience should watch it move.
 */
export const CountCard: React.FC<{
  label: string;
  from: number;
  to: number;
  accent: string;
  format: (n: number) => string;
  dur?: number;
  sub?: string;
}> = ({label, from, to, accent, format, dur = 34, sub}) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [6, 6 + dur], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return <StatCard label={label} value={format(v)} sub={sub} accent={accent} />;
};

/**
 * The purchasing-power bar: a track that visibly loses ground. This is the
 * whole mechanism of the film in one shape — the number of pounds never
 * changes, the bar does.
 */
export const PowerBar: React.FC<{
  label: string;
  from: number; // 0..1
  to: number; // 0..1
  accent: string;
  dur?: number;
  caption?: string;
}> = ({label, from, to, accent, dur = 40, caption}) => {
  const frame = useCurrentFrame();
  const w = interpolate(frame, [8, 8 + dur], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  return (
    <div style={{...glass, padding: '34px 40px 36px', width: 780}}>
      <div
        style={{
          fontSize: 27,
          fontWeight: 700,
          letterSpacing: 5,
          textTransform: 'uppercase',
          color: L.dim,
          marginBottom: 20,
        }}
      >
        {label}
      </div>
      <div
        style={{
          height: 40,
          borderRadius: 20,
          background: '#FFFFFF12',
          overflow: 'hidden',
          // Ghost of where the bar started, so the loss is visible, not implied.
          boxShadow: `inset 0 0 0 2px ${L.ink}14`,
        }}
      >
        <div
          style={{
            height: 40,
            width: `${w * 100}%`,
            borderRadius: 20,
            background: accent,
            boxShadow: `0 0 30px ${accent}66`,
          }}
        />
      </div>
      {caption ? (
        <div style={{fontSize: 30, color: L.ink, marginTop: 18}}>{caption}</div>
      ) : null}
    </div>
  );
};

/**
 * Points at something in the photograph: a dot on the subject, an elbow drawn
 * out from it, and a label at the far end. The line uses stroke-dashoffset so
 * it draws on rather than fading in.
 *
 * The anchor is the DOT, not the box. That matters: a callout exists to touch
 * one thing in the frame, so the thing it touches is what you position, and the
 * label is expressed as an offset from it. `drop` may be negative to route the
 * label upward when the space below the subject is occupied.
 */
export const Callout: React.FC<{
  text: string;
  accent?: string;
  /** Horizontal reach of the elbow, px. */
  run?: number;
  /** Vertical reach, px. Negative routes the label above the dot. */
  drop?: number;
  /** Which way the elbow leaves the dot. */
  dir?: 'left' | 'right';
}> = ({text, accent = L.gold, run = 220, drop = 120, dir = 'right'}) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [4, 20], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const labelIn = interpolate(frame, [16, 26], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: backOut,
  });
  const s = dir === 'right' ? 1 : -1;
  const path = `M 0 0 L ${s * run * 0.45} ${drop} L ${s * run} ${drop}`;
  const len = Math.hypot(run * 0.45, drop) + run * 0.55;

  return (
    <div style={{position: 'relative', width: 0, height: 0}}>
      <svg width={1} height={1} style={{position: 'absolute', overflow: 'visible'}}>
        <circle cx={0} cy={0} r={11} fill={accent} />
        <circle
          cx={0}
          cy={0}
          r={22}
          fill="none"
          stroke={accent}
          strokeWidth={3}
          opacity={0.45}
        />
        <path
          d={path}
          fill="none"
          stroke={accent}
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={len}
          strokeDashoffset={len * draw}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: dir === 'right' ? run + 24 : undefined,
          right: dir === 'right' ? undefined : run + 24,
          top: drop,
          transform: `translateY(-50%) translateX(${(1 - labelIn) * s * -18}px)`,
          opacity: labelIn,
          whiteSpace: 'nowrap',
          fontSize: 36,
          fontWeight: 800,
          letterSpacing: 1,
          color: L.ink,
          textShadow: '0 3px 16px rgba(0,0,0,0.9), 0 0 40px rgba(0,0,0,0.7)',
        }}
      >
        {text}
      </div>
    </div>
  );
};

/** Gold swipe that wipes in under a word. */
export const Underline: React.FC<{width: number; accent?: string; at?: number}> = ({
  width,
  accent = L.gold,
  at = 0,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div
      style={{
        width: width * p,
        height: 8,
        borderRadius: 4,
        background: accent,
        boxShadow: `0 0 20px ${accent}80`,
      }}
    />
  );
};

/**
 * The one element that survives every cut. A hairline, not a bar — it should
 * read as a progress hint, never as furniture.
 */
export const Progress: React.FC<{progress: number}> = ({progress}) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: 5,
      background: '#FFFFFF14',
    }}
  >
    <div
      style={{
        height: 5,
        width: `${progress * 100}%`,
        background: L.gold,
        boxShadow: `0 0 16px ${L.gold}AA`,
      }}
    />
  </div>
);
