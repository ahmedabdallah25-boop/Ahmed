import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, STAGE} from '../theme';
import {Readout, useRise} from '../components/Ui';

const W = STAGE.width;
const H = 400;
const NODE_X = 280;
const NODE_Y = 236;
const UP = -196;
const DOWN = 118;

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
  const pulse = 1 + Math.sin(frame / 4.5) * 0.12;
  const mathIn = useRise(890, 22);
  const strike = draw(922, 24);

  return (
    <div style={{width: W, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div style={{width: '100%'}}>
        <Readout>The fork · month 30</Readout>
      </div>

      <div style={{width: W, height: H, position: 'relative', marginTop: 24}}>
        <svg width={W} height={H} style={{overflow: 'visible'}}>
          <path
            d={`M0,${NODE_Y} L${NODE_X},${NODE_Y}`}
            stroke={C.textDim}
            strokeWidth={9}
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
            stroke={C.loss}
            strokeWidth={11}
            strokeLinecap="round"
            fill="none"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - sell}
            style={{filter: `drop-shadow(0 0 14px ${C.loss}AA)`}}
          />
          <path
            d={`M${NODE_X},${NODE_Y} C${NODE_X + 200},${NODE_Y} ${NODE_X + 260},${
              NODE_Y + UP + 12
            } ${W},${NODE_Y + UP}`}
            stroke={C.gain}
            strokeWidth={11}
            strokeLinecap="round"
            fill="none"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - hold}
            style={{filter: `drop-shadow(0 0 14px ${C.gain}AA)`}}
          />
          {stem > 0.9 ? (
            <>
              <circle
                cx={NODE_X}
                cy={NODE_Y}
                r={30 * pulse}
                fill="none"
                stroke={C.live}
                strokeWidth={4}
                opacity={0.8}
              />
              <circle
                cx={NODE_X}
                cy={NODE_Y}
                r={15}
                fill={C.live}
                style={{filter: `drop-shadow(0 0 20px ${C.live})`}}
              />
            </>
          ) : null}
        </svg>

        <div
          style={{
            position: 'absolute',
            top: NODE_Y + UP - 80,
            right: 0,
            opacity: hold,
            transform: `translateX(${interpolate(hold, [0, 1], [40, 0])}px)`,
            fontFamily: FONT.display,
            fontSize: 62,
            color: C.gain,
            textShadow: `0 0 26px ${C.gain}88`,
          }}
        >
          HOLD
        </div>
        <div
          style={{
            position: 'absolute',
            top: NODE_Y + DOWN + 14,
            right: 0,
            opacity: sell,
            transform: `translateX(${interpolate(sell, [0, 1], [40, 0])}px)`,
            fontFamily: FONT.display,
            fontSize: 62,
            color: C.loss,
            textShadow: `0 0 26px ${C.loss}88`,
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
              width: 114,
              height: 114,
              border: `2px solid ${C.textDim}77`,
              background: `${C.surfaceLift}F0`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: FONT.mono,
              fontWeight: 800,
              fontSize: 62,
              color: C.text,
              opacity: 1 - strike * 0.6,
              transform: `rotate(${(i % 2 ? 1 : -1) * strike * 8}deg) translateY(${strike * 16}px)`,
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
              height: 8,
              background: C.live,
              boxShadow: `0 0 22px ${C.live}`,
              transform: 'rotate(-2deg)',
            }}
          />
        ) : null}
      </div>
    </div>
  );
};
