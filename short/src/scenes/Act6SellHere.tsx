import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, STAGE} from '../theme';
import {Label, useRise} from '../components/Ui';

const W = STAGE.width;
const H = 420;

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
const AFTER = seg(0.66, 1);
const TROUGH_X = 0.66 * W;
const TROUGH_Y = H - curve(0.66) * H;

export const Act6SellHere: React.FC = () => {
  const frame = useCurrentFrame();
  const drawn = interpolate(frame, [1572, 1616], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const mark = useRise(1596, 20, 11);
  const after = interpolate(frame, [1694, 1756], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const pain = useRise(1770, 22);

  return (
    <div style={{width: W, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div style={{width: '100%'}}>
        <Label size={26}>The whole ride</Label>
      </div>

      <div style={{width: W, height: H + 20, position: 'relative', marginTop: 20}}>
        <svg width={W} height={H + 20} style={{overflow: 'visible'}}>
          <line x1={0} y1={H} x2={W} y2={H} stroke={C.ink} strokeWidth={3} opacity={0.4} />
          <path
            d={BEFORE}
            fill="none"
            stroke={C.rust}
            strokeWidth={14}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - drawn}
          />
          {/* what happens after the sell button — dashed, because they never see it */}
          <path
            d={AFTER}
            fill="none"
            stroke={C.olive}
            strokeWidth={14}
            strokeLinecap="round"
            strokeDasharray="22 18"
            opacity={after}
            style={{strokeDashoffset: -frame * 0.9}}
          />
          {mark > 0 ? (
            <>
              <circle
                cx={TROUGH_X}
                cy={TROUGH_Y}
                r={(28 + Math.sin(frame / 4) * 5) * Math.min(1, mark * 1.4)}
                fill="none"
                stroke={C.rust}
                strokeWidth={6}
              />
              <circle cx={TROUGH_X} cy={TROUGH_Y} r={16} fill={C.rust} />
              <line
                x1={TROUGH_X}
                y1={TROUGH_Y - 36}
                x2={TROUGH_X}
                y2={TROUGH_Y - 92}
                stroke={C.rust}
                strokeWidth={5}
                opacity={mark}
              />
            </>
          ) : null}
        </svg>

        {mark > 0 ? (
          <div
            style={{
              position: 'absolute',
              top: TROUGH_Y - 168,
              left: TROUGH_X - 230,
              width: 460,
              display: 'flex',
              justifyContent: 'center',
              opacity: Math.min(1, mark * 1.7),
              transform: `translateY(${interpolate(mark, [0, 1], [26, 0])}px) scale(${interpolate(
                mark,
                [0, 1],
                [0.8, 1],
              )})`,
            }}
          >
            <div
              style={{
                padding: '13px 28px 16px',
                borderRadius: 18,
                background: C.rust,
                color: '#FFF3E2',
                fontFamily: FONT.display,
                fontSize: 50,
                letterSpacing: 2,
                boxShadow: `0 11px 0 -3px ${C.rustDeep}`,
                whiteSpace: 'nowrap',
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
              top: H - curve(1) * H - 66,
              right: -6,
              opacity: after,
              transform: `translateX(${interpolate(after, [0, 1], [40, 0])}px)`,
              fontFamily: FONT.ui,
              fontWeight: 800,
              fontSize: 28,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: C.olive,
            }}
          >
            The part they never see
          </div>
        ) : null}
      </div>

      {/* final beat */}
      <div
        style={{
          marginTop: 54,
          padding: '18px 44px 22px',
          borderRadius: 24,
          background: C.ink,
          fontFamily: FONT.ui,
          fontWeight: 900,
          fontSize: 44,
          letterSpacing: 2,
          color: C.goldSoft,
          textTransform: 'uppercase',
          boxShadow: '0 14px 0 -4px rgba(23,21,15,0.35)',
          opacity: Math.min(1, pain * 1.8),
          transform: `scale(${interpolate(pain, [0, 1], [0.86, 1])})`,
        }}
      >
        Selling is not the safe choice
      </div>
    </div>
  );
};
