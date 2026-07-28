import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../theme';

/** Springs 0 -> 1 starting at `at`, with the house bounce. */
export const useRise = (at: number, duration = 22, damping = 14) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({
    frame: frame - at,
    fps,
    config: {damping, stiffness: 150, mass: 0.8},
    durationInFrames: duration,
  });
};

/** The house card: paper stock, ink rule, hard drop shadow. */
export const Card: React.FC<{
  at: number;
  children: React.ReactNode;
  accent?: string;
  style?: React.CSSProperties;
}> = ({at, children, accent = C.ink, style}) => {
  // never unmounts — the card holds its slot so the layout does not jump
  const r = useRise(at);
  return (
    <div
      style={{
        background: C.paperLift,
        border: `3px solid ${C.ink}`,
        borderRadius: 26,
        boxShadow: `0 14px 0 -4px ${accent}, 0 26px 44px rgba(23,21,15,0.18)`,
        padding: '26px 32px',
        opacity: Math.min(1, r * 1.6),
        transform: `translateY(${interpolate(r, [0, 1], [46, 0])}px) scale(${interpolate(
          r,
          [0, 1],
          [0.9, 1],
        )})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Label: React.FC<{children: React.ReactNode; color?: string; size?: number}> = ({
  children,
  color = C.inkSoft,
  size = 26,
}) => (
  <div
    style={{
      fontFamily: FONT.ui,
      fontWeight: 800,
      fontSize: size,
      letterSpacing: 4,
      textTransform: 'uppercase',
      color,
    }}
  >
    {children}
  </div>
);

/** Big money figure that counts up into place. */
export const Figure: React.FC<{
  at: number;
  value: number;
  prefix?: string;
  size?: number;
  color?: string;
  duration?: number;
  signed?: boolean;
}> = ({at, value, prefix = '$', size = 96, color = C.ink, duration = 26, signed = false}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const eased = 1 - Math.pow(1 - t, 3);
  const shown = Math.round((value * eased) / 10) * 10;
  const r = useRise(at, 18);
  return (
    <div
      style={{
        fontFamily: FONT.display,
        fontSize: size,
        lineHeight: 1,
        letterSpacing: 1,
        color,
        transform: `scale(${interpolate(r, [0, 1], [0.82, 1])})`,
        opacity: Math.min(1, r * 2),
      }}
    >
      {signed && value < 0 ? '−' : ''}
      {prefix}
      {Math.abs(shown).toLocaleString('en-US')}
    </div>
  );
};

/** Rust stamp that slams in at an angle — used for the crash beats. */
export const Stamp: React.FC<{at: number; text: string; rotate?: number}> = ({
  at,
  text,
  rotate = -8,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const r = spring({
    frame: frame - at,
    fps,
    config: {damping: 11, stiffness: 220, mass: 0.9},
    durationInFrames: 20,
  });
  if (r <= 0) {
    return null;
  }
  const shake = frame < at + 10 ? Math.sin((frame - at) * 2.4) * (1 - r) * 10 : 0;
  return (
    <div
      style={{
        fontFamily: FONT.display,
        fontSize: 108,
        letterSpacing: 3,
        color: C.rust,
        border: `9px solid ${C.rust}`,
        borderRadius: 20,
        padding: '10px 30px 16px',
        background: 'rgba(244,236,217,0.55)',
        transform: `rotate(${rotate + shake}deg) scale(${interpolate(r, [0, 1], [2.6, 1])})`,
        opacity: Math.min(1, r * 2.2),
        textShadow: `0 6px 0 rgba(142,47,31,0.25)`,
      }}
    >
      {text}
    </div>
  );
};

/** Horizontal magnitude bar that wipes open. */
export const Bar: React.FC<{
  at: number;
  width: number;
  color: string;
  height?: number;
  duration?: number;
}> = ({at, width, color, height = 64, duration = 24}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const eased = 1 - Math.pow(1 - t, 4);
  return (
    <div
      style={{
        width: width * eased,
        height,
        background: color,
        border: `3px solid ${C.ink}`,
        borderRadius: 12,
        boxShadow: `0 8px 0 -2px rgba(23,21,15,0.30)`,
      }}
    />
  );
};
