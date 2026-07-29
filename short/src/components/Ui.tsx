import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../theme';

/** Springs 0 -> 1 starting at `at`, with the house bounce. */
export const useRise = (at: number, duration = 22, damping = 15) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({
    frame: frame - at,
    fps,
    config: {damping, stiffness: 160, mass: 0.8},
    durationInFrames: duration,
  });
};

/** Mono label — every piece of data on screen is introduced by one of these. */
export const Readout: React.FC<{
  children: React.ReactNode;
  color?: string;
  size?: number;
}> = ({children, color = C.textDim, size = 26}) => (
  <div
    style={{
      fontFamily: FONT.mono,
      fontWeight: 600,
      fontSize: size,
      letterSpacing: 3,
      textTransform: 'uppercase',
      color,
    }}
  >
    {children}
  </div>
);

/** A terminal panel: dark surface, hairline border, accent rule on top. */
export const Panel: React.FC<{
  at: number;
  accent?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({at, accent = C.cool, children, style}) => {
  const r = useRise(at);
  return (
    <div
      style={{
        position: 'relative',
        background: `${C.surface}F0`,
        border: `2px solid ${accent}44`,
        borderTop: `5px solid ${accent}`,
        padding: '26px 30px 30px',
        opacity: Math.min(1, r * 1.7),
        transform: `translateY(${interpolate(r, [0, 1], [44, 0])}px)`,
        boxShadow: `0 22px 60px rgba(0,0,0,0.5)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Big money figure that counts up into place, set in mono. */
export const Figure: React.FC<{
  at: number;
  value: number;
  prefix?: string;
  size?: number;
  color?: string;
  duration?: number;
  lit?: boolean;
}> = ({at, value, prefix = '$', size = 92, color = C.text, duration = 26, lit = true}) => {
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
        fontFamily: FONT.mono,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1,
        letterSpacing: -2,
        color,
        textShadow: lit ? `0 0 26px ${color}55` : 'none',
        transform: `scale(${interpolate(r, [0, 1], [0.86, 1])})`,
        opacity: Math.min(1, r * 2),
      }}
    >
      {prefix}
      {shown.toLocaleString('en-US')}
    </div>
  );
};

/** The hard beat: an outlined accent box that slams in at an angle. */
export const Slam: React.FC<{at: number; text: string; color?: string; rotate?: number}> = ({
  at,
  text,
  color = C.loss,
  rotate = -6,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const r = spring({
    frame: frame - at,
    fps,
    config: {damping: 11, stiffness: 240, mass: 0.9},
    durationInFrames: 18,
  });
  if (r <= 0) {
    return null;
  }
  const shake = frame < at + 10 ? Math.sin((frame - at) * 2.6) * (1 - r) * 12 : 0;
  return (
    <div
      style={{
        fontFamily: FONT.display,
        fontSize: 104,
        letterSpacing: -1,
        color,
        border: `6px solid ${color}`,
        padding: '14px 30px 20px',
        background: `${C.void}D0`,
        boxShadow: `0 0 40px ${color}55, inset 0 0 30px ${color}22`,
        transform: `rotate(${rotate + shake}deg) scale(${interpolate(r, [0, 1], [2.4, 1])})`,
        opacity: Math.min(1, r * 2.2),
      }}
    >
      {text}
    </div>
  );
};

/** Horizontal magnitude bar that wipes open, lit from within. */
export const Bar: React.FC<{
  at: number;
  width: number;
  color: string;
  height?: number;
  duration?: number;
}> = ({at, width, color, height = 66, duration = 24}) => {
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
        background: `linear-gradient(90deg, ${color}55, ${color})`,
        borderRight: `4px solid ${color}`,
        boxShadow: `0 0 26px ${color}66`,
      }}
    />
  );
};
