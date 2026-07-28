import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, STAGE} from '../theme';
import {Label, useRise} from '../components/Ui';

const W = STAGE.width;
const H = 330;
const NODE_X = 280;
const NODE_Y = 214;
const UP = -176;
const DOWN = 104;

const GLYPHS = ['+', '−', '×', '÷', '%', '='];

export const Act3Fork: React.FC = () => {
  const frame = useCurrentFrame();

  const draw = (at: number, dur: number) =>
    interpolate(frame, [at, at + dur], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

  const stem = draw(782, 22);
  const sell = draw(812, 26);
  const hold = draw(824, 30);
  const pulse = 1 + Math.sin(frame / 4.5) * 0.09;
  const mathIn = useRise(890, 22);
  const strike = draw(922, 24);

  return (
    <div style={{width: W, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div style={{width: '100%'}}>
        <Label size={26}>The fork · month 30</Label>
      </div>

      <div style={{width: W, height: H, position: 'relative', marginTop: 22}}>
        <svg width={W} height={H} style={{overflow: 'visible'}}>
          <path
            d={`M0,${NODE_Y} L${NODE_X},${NODE_Y}`}
            stroke={C.ink}
            strokeWidth={11}
            strokeLinecap="round"
            fill="none"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - stem}
          />
          <path
            d={`M${NODE_X},${NODE_Y} C${NODE_X + 190},${NODE_Y} ${NODE_X + 250},${
              NODE_Y + DOWN - 10
            } ${W},${NODE_Y + DOWN}`}
            stroke={C.rust}
            strokeWidth={13}
            strokeLinecap="round"
            fill="none"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - sell}
          />
          <path
            d={`M${NODE_X},${NODE_Y} C${NODE_X + 200},${NODE_Y} ${NODE_X + 260},${
              NODE_Y + UP + 12
            } ${W},${NODE_Y + UP}`}
            stroke={C.olive}
            strokeWidth={13}
            strokeLinecap="round"
            fill="none"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - hold}
          />
          {stem > 0.9 ? (
            <>
              <circle
                cx={NODE_X}
                cy={NODE_Y}
                r={32 * pulse}
                fill="none"
                stroke={C.gold}
                strokeWidth={5}
                opacity={0.75}
              />
              <circle cx={NODE_X} cy={NODE_Y} r={18} fill={C.ink} />
            </>
          ) : null}
        </svg>

        <div
          style={{
            position: 'absolute',
            top: NODE_Y + UP - 84,
            right: 0,
            opacity: hold,
            transform: `translateX(${interpolate(hold, [0, 1], [40, 0])}px)`,
            fontFamily: FONT.display,
            fontSize: 70,
            color: C.olive,
            letterSpacing: 2,
          }}
        >
          HOLD
        </div>
        <div
          style={{
            position: 'absolute',
            top: NODE_Y + DOWN + 12,
            right: 0,
            opacity: sell,
            transform: `translateX(${interpolate(sell, [0, 1], [40, 0])}px)`,
            fontFamily: FONT.display,
            fontSize: 70,
            color: C.rust,
            letterSpacing: 2,
          }}
        >
          SELL
        </div>
      </div>

      {/* it is not a maths problem */}
      <div
        style={{
          width: W,
          marginTop: 76,
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          gap: 24,
          opacity: Math.min(1, mathIn * 1.6),
          transform: `translateY(${interpolate(mathIn, [0, 1], [40, 0])}px)`,
        }}
      >
        {GLYPHS.map((g, i) => (
          <div
            key={g}
            style={{
              width: 118,
              height: 118,
              borderRadius: 24,
              border: `3px solid ${C.ink}`,
              background: C.paperLift,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: FONT.display,
              fontSize: 68,
              color: C.ink,
              boxShadow: '0 10px 0 -3px rgba(23,21,15,0.28)',
              opacity: 1 - strike * 0.55,
              transform: `rotate(${(i % 2 ? 1 : -1) * strike * 7}deg) translateY(${strike * 14}px)`,
            }}
          >
            {g}
          </div>
        ))}
        {strike > 0 ? (
          <div
            style={{
              position: 'absolute',
              top: 52,
              left: 0,
              width: W * strike,
              height: 14,
              background: C.ink,
              borderRadius: 999,
              transform: 'rotate(-2.5deg)',
              boxShadow: '0 5px 0 -1px rgba(23,21,15,0.32)',
            }}
          />
        ) : null}
      </div>
    </div>
  );
};
