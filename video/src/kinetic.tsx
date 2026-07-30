import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FONT} from './theme';
import {punch, reveal, seam, Vector} from './motion';

// Shared kinetic-typography primitives for the vertical Shorts lane.

export const Stage: React.FC<{
  children: React.ReactNode;
  dur: number;
  entry?: Vector;
  exit?: Vector;
}> = ({children, dur, entry = 'current', exit = 'current'}) => {
  const frame = useCurrentFrame();
  const s = seam(frame, dur, entry, exit);
  return (
    <AbsoluteFill
      style={{
        transform: `translateX(${s.x}px) scale(${s.scale})`,
        opacity: s.opacity,
        padding: '0 88px',
        justifyContent: 'center',
        fontFamily: FONT,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Kinetic line: words land one after another, ≤500ms total stagger. */
export const Line: React.FC<{
  text: string;
  at: number;
  size: number;
  color?: string;
  hit?: number[]; // indices punched on the beat
  weight?: number;
  gap?: number;
  style?: React.CSSProperties;
}> = ({text, at, size, color = C.ink, hit = [], weight = 700, gap = 3, style}) => {
  const frame = useCurrentFrame();
  const words = text.split(' ');
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: `${size * 0.06}px ${size * 0.24}px`,
        lineHeight: 0.98,
        fontSize: size,
        fontWeight: weight,
        letterSpacing: -size * 0.035,
        color,
        ...style,
      }}
    >
      {words.map((w, i) => {
        const t = at + i * gap;
        const r = reveal(frame, t);
        const p = hit.includes(i) ? punch(frame, t + 4) : 1;
        return (
          <span
            key={i}
            style={{
              display: 'block',
              opacity: r.opacity,
              transform: `${r.transform} scale(${p})`,
              transformOrigin: 'left bottom',
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

export const Tag: React.FC<{text: string; at: number; color: string}> = ({
  text,
  at,
  color,
}) => {
  const frame = useCurrentFrame();
  const r = reveal(frame, at, 7);
  return (
    <div
      style={{
        alignSelf: 'flex-start',
        opacity: r.opacity,
        transform: r.transform,
        transformOrigin: 'left center',
        background: color,
        color: C.bg,
        fontSize: 34,
        fontWeight: 700,
        letterSpacing: 3,
        padding: '12px 22px',
        borderRadius: 8,
        marginBottom: 34,
      }}
    >
      {text}
    </div>
  );
};

/** The film's carrier: static ground plane + vignette + retention bar. */
export const Ground: React.FC = () => (
  <>
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
  </>
);

export const Retention: React.FC<{frame: number; total: number}> = ({
  frame,
  total,
}) => (
  <AbsoluteFill style={{justifyContent: 'flex-start'}}>
    <div style={{height: 10, background: '#ffffff14'}}>
      <div
        style={{
          height: 10,
          width: `${(frame / total) * 100}%`,
          background: C.gold,
        }}
      />
    </div>
  </AbsoluteFill>
);
