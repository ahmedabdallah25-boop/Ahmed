import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {count, punch, reveal} from '../motion';
import {C, FONT} from '../theme';

// A 5-second vertical hook card, built only to show what the free local
// renderer produces: no API, no credits, no watermark. The beat structure is
// the channel's own — small number, big number, and the gap named.

export const SAMPLE_5S_SECONDS = 5;

const Line: React.FC<{
  at: number;
  size: number;
  color: string;
  weight?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({at, size, color, weight = 800, style, children}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        fontFamily: FONT,
        fontSize: size,
        fontWeight: weight,
        color,
        lineHeight: 1.04,
        letterSpacing: '-0.02em',
        textAlign: 'center',
        ...reveal(frame, at),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Sample5s: React.FC = () => {
  const frame = useCurrentFrame();

  const theirs = count(frame, 14, 26, 0, 1); // what you get
  const yours = count(frame, 74, 26, 0, 7); // what they get

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 96px',
        gap: 18,
      }}
    >
      <Line at={2} size={62} color={C.dim} weight={700} style={{letterSpacing: '0.04em'}}>
        YOUR BANK PAYS YOU
      </Line>

      <div style={{transform: `scale(${punch(frame, 40)})`}}>
        <Line at={12} size={300} color={C.gold}>
          {theirs.toFixed(1)}%
        </Line>
      </div>

      <div
        style={{
          width: 220,
          height: 3,
          backgroundColor: C.panel,
          margin: '26px 0',
          ...reveal(frame, 60, 12),
        }}
      />

      <Line at={62} size={62} color={C.dim} weight={700} style={{letterSpacing: '0.04em'}}>
        IT LENDS THE SAME MONEY AT
      </Line>

      <div style={{transform: `scale(${punch(frame, 100)})`}}>
        <Line at={72} size={300} color={C.red}>
          {yours.toFixed(0)}%
        </Line>
      </div>

      <Line at={116} size={58} color={C.ink} weight={800} style={{marginTop: 40}}>
        The gap <span style={{color: C.gold}}>is</span> the business.
      </Line>
    </AbsoluteFill>
  );
};
