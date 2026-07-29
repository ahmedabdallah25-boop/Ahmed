import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {FONT} from '../theme';

// Colour language from the storyboard: bank grey, you green, riba red.
export const L = {
  bg: '#06080B',
  ink: '#F4F1EA',
  dim: '#8B929C',
  line: '#1B2029',
  panel: '#0D1117',
  gold: '#E9B949',
  red: '#E5484D',
  green: '#2BB673',
  grey: '#5A626D',
};

export const PAD = 128;

export const ease = (
  frame: number,
  at: number,
  dur: number,
  e: (n: number) => number = Easing.out(Easing.cubic),
) =>
  interpolate(frame, [at, at + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: e,
  });

/** Staged reveal — content arrives on the narration beat, then stays still. */
export const rise = (frame: number, at: number, dur = 14) => {
  const p = ease(frame, at, dur);
  return {
    opacity: ease(frame, at, dur * 0.6),
    transform: `translateY(${(1 - p) * 26}px)`,
  };
};

export const Scene: React.FC<{
  children: React.ReactNode;
  dur: number;
  /** seconds of the scene's own length, used for the exit */
  fade?: number;
}> = ({children, dur, fade = 12}) => {
  const frame = useCurrentFrame();
  // Scenes hand off on a soft dissolve — a documentary cut, not a kinetic seam.
  const opacity =
    ease(frame, 0, fade) * (1 - ease(frame, dur - fade, fade));
  const drift = interpolate(frame, [0, dur], [0, -18], {
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill
      style={{
        opacity,
        fontFamily: FONT,
        color: L.ink,
        padding: PAD,
        transform: `translateY(${drift}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const Kicker: React.FC<{
  children: React.ReactNode;
  at?: number;
  color?: string;
}> = ({children, at = 0, color = L.gold}) => {
  const frame = useCurrentFrame();
  const r = rise(frame, at, 10);
  return (
    <div
      style={{
        ...r,
        color,
        fontSize: 30,
        fontWeight: 700,
        letterSpacing: 6,
        textTransform: 'uppercase',
        marginBottom: 28,
      }}
    >
      {children}
    </div>
  );
};

export const H1: React.FC<{
  children: React.ReactNode;
  at?: number;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({children, at = 0, size = 92, color = L.ink, style}) => {
  const frame = useCurrentFrame();
  const r = rise(frame, at);
  return (
    <div
      style={{
        ...r,
        ...style,
        fontSize: size,
        fontWeight: 700,
        letterSpacing: -size * 0.03,
        lineHeight: 1.04,
        color,
      }}
    >
      {children}
    </div>
  );
};

export const Body: React.FC<{
  children: React.ReactNode;
  at?: number;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({children, at = 0, size = 42, color = L.dim, style}) => {
  const frame = useCurrentFrame();
  const r = rise(frame, at, 12);
  return (
    <div style={{...r, ...style, fontSize: size, lineHeight: 1.35, color}}>
      {children}
    </div>
  );
};

/** A number that counts up to its value, then holds. */
export const Counter: React.FC<{
  to: number;
  at: number;
  dur?: number;
  from?: number;
  format: (n: number) => string;
  size?: number;
  color?: string;
}> = ({to, at, dur = 34, from = 0, format, size = 120, color = L.ink}) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [at, at + dur], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div
      style={{
        fontSize: size,
        fontWeight: 700,
        letterSpacing: -size * 0.035,
        color,
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {format(v)}
    </div>
  );
};

export const Panel: React.FC<{
  children: React.ReactNode;
  at?: number;
  accent?: string;
  style?: React.CSSProperties;
}> = ({children, at = 0, accent = L.line, style}) => {
  const frame = useCurrentFrame();
  const r = rise(frame, at, 12);
  return (
    <div
      style={{
        ...r,
        ...style,
        background: L.panel,
        border: `2px solid ${L.line}`,
        borderLeft: `8px solid ${accent}`,
        borderRadius: 14,
        padding: '30px 34px',
      }}
    >
      {children}
    </div>
  );
};

/** Horizontal magnitude bar — grows from the left on its beat. */
export const Bar: React.FC<{
  at: number;
  width: number; // 0..1 of track
  color: string;
  height?: number;
  dur?: number;
}> = ({at, width, color, height = 26, dur = 30}) => {
  const frame = useCurrentFrame();
  const p = ease(frame, at, dur);
  return (
    <div
      style={{
        height,
        background: '#FFFFFF0D',
        borderRadius: height / 2,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height,
          width: `${width * p * 100}%`,
          background: color,
          borderRadius: height / 2,
        }}
      />
    </div>
  );
};

export const Tick: React.FC<{on: boolean; color?: string; off?: string}> = ({
  on,
  color = L.green,
  off = L.grey,
}) => (
  <span style={{color: on ? color : off, fontWeight: 700}}>{on ? '✓' : '✗'}</span>
);
