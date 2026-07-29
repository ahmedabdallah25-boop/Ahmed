import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, STAGE} from '../theme';
import {Readout, useRise} from '../components/Ui';

const W = STAGE.width;
const H = 472;

/** t -> height fraction: the climb, the crash, and the recovery nobody waits for. */
const curve = (t: number) => {
  if (t < 0.46) return 0.24 + t * 1.15;
  if (t < 0.66) return 0.77 - (t - 0.46) * 2.55;
  return 0.26 + (t - 0.66) * 1.9;
};

const seg = (a: number, b: number, n = 34) =>
  Array.from({length: n + 1}, (_, i) => {
    const t = a + ((b - a) * i) / n;
    return `${i === 0 ? 'M' : 'L'}${(t * W).toFixed(1)},${(H - curve(t) * H).toFixed(1)}`;
  }).join(' ');

const BEFORE = seg(0, 0.66);
const BEFORE_FILL = `${BEFORE} L${(0.66 * W).toFixed(1)},${H} L0,${H} Z`;
const AFTER = seg(0.66, 1);
const TROUGH_X = 0.66 * W;
const TROUGH_Y = H - curve(0.66) * H;

export const Act6SellHere: React.FC = () => {
  const frame = useCurrentFrame();
  const drawn = interpolate(frame, [1572, 1616], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const mark = useRise(1596, 20, 12);
  const after = interpolate(frame, [1694, 1756], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const close = useRise(1770, 22);

  return (
    <div style={{width: W, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div style={{width: '100%'}}>
        <Readout>The whole ride</Readout>
      </div>

      <div style={{width: W, height: H + 24, position: 'relative', marginTop: 24}}>
        <svg width={W} height={H + 24} style={{overflow: 'visible'}}>
          <defs>
            <linearGradient id="rideFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.loss} stopOpacity={0.32} />
              <stop offset="100%" stopColor={C.loss} stopOpacity={0} />
            </linearGradient>
            <clipPath id="rideClip">
              <rect x={-10} y={-40} width={(W + 20) * drawn} height={H + 70} />
            </clipPath>
          </defs>

          <line x1={0} y1={H} x2={W} y2={H} stroke={C.hairLit} strokeWidth={2} />

          <g clipPath="url(#rideClip)">
            <path d={BEFORE_FILL} fill="url(#rideFill)" />
            <path
              d={BEFORE}
              fill="none"
              stroke={C.loss}
              strokeWidth={12}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{filter: `drop-shadow(0 0 16px ${C.loss}AA)`}}
            />
          </g>

          {/* what happens after the sell button — dashed, because they never see it */}
          <path
            d={AFTER}
            fill="none"
            stroke={C.gain}
            strokeWidth={12}
            strokeLinecap="round"
            strokeDasharray="20 18"
            opacity={after}
            style={{
              strokeDashoffset: -frame * 0.9,
              filter: `drop-shadow(0 0 14px ${C.gain}88)`,
            }}
          />

          {mark > 0 ? (
            <>
              <circle
                cx={TROUGH_X}
                cy={TROUGH_Y}
                r={(26 + Math.sin(frame / 4) * 6) * Math.min(1, mark * 1.4)}
                fill="none"
                stroke={C.loss}
                strokeWidth={4}
              />
              <circle
                cx={TROUGH_X}
                cy={TROUGH_Y}
                r={14}
                fill={C.loss}
                style={{filter: `drop-shadow(0 0 18px ${C.loss})`}}
              />
              <line
                x1={TROUGH_X}
                y1={TROUGH_Y - 34}
                x2={TROUGH_X}
                y2={TROUGH_Y - 88}
                stroke={C.loss}
                strokeWidth={4}
                opacity={mark}
              />
            </>
          ) : null}
        </svg>

        {mark > 0 ? (
          <div
            style={{
              position: 'absolute',
              top: TROUGH_Y - 164,
              left: TROUGH_X - 240,
              width: 480,
              display: 'flex',
              justifyContent: 'center',
              opacity: Math.min(1, mark * 1.7),
              transform: `translateY(${interpolate(mark, [0, 1], [26, 0])}px) scale(${interpolate(
                mark,
                [0, 1],
                [0.82, 1],
              )})`,
            }}
          >
            <div
              style={{
                padding: '12px 26px 16px',
                border: `3px solid ${C.loss}`,
                background: `${C.void}D8`,
                color: C.loss,
                fontFamily: FONT.mono,
                fontWeight: 800,
                fontSize: 40,
                letterSpacing: 1,
                whiteSpace: 'nowrap',
                boxShadow: `0 0 32px ${C.loss}55`,
              }}
            >
              MOST PEOPLE SELL HERE
            </div>
          </div>
        ) : null}

        {after > 0.05 ? (
          <div
            style={{
              position: 'absolute',
              top: H - curve(1) * H - 62,
              right: -6,
              opacity: after,
              transform: `translateX(${interpolate(after, [0, 1], [40, 0])}px)`,
              fontFamily: FONT.mono,
              fontWeight: 700,
              fontSize: 26,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: C.gain,
              textShadow: `0 0 20px ${C.gain}66`,
            }}
          >
            The part they never see
          </div>
        ) : null}
      </div>

      {/* closing beat */}
      <div
        style={{
          marginTop: 58,
          padding: '18px 42px 22px',
          border: `2px solid ${C.live}55`,
          borderTop: `5px solid ${C.live}`,
          background: `${C.surface}F0`,
          fontFamily: FONT.display,
          fontSize: 40,
          letterSpacing: -0.5,
          color: C.text,
          textTransform: 'uppercase',
          opacity: Math.min(1, close * 1.8),
          transform: `scale(${interpolate(close, [0, 1], [0.88, 1])})`,
        }}
      >
        Selling is not the safe choice
      </div>
    </div>
  );
};
