import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, STAGE} from '../theme';
import {Figure, Label, useRise} from '../components/Ui';

const W = STAGE.width;
const H = 340;

const line = (fn: (t: number) => number, n = 44) =>
  Array.from({length: n + 1}, (_, i) => {
    const t = i / n;
    return `${i === 0 ? 'M' : 'L'}${(t * W).toFixed(1)},${(H - fn(t) * H).toFixed(1)}`;
  }).join(' ');

const SAMMY = line((t) => (t < 0.68 ? 0.3 + t * 0.68 : 0.76 - (t - 0.68) * 1.42));
const ADAM = line((t) => 0.4 + t * 0.16);

export const Act5Adam: React.FC = () => {
  const frame = useCurrentFrame();
  const drawAdam = interpolate(frame, [1330, 1392], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const badge = useRise(1414, 22);
  const ahead = useRise(1484, 24);

  return (
    <div style={{width: W, display: 'flex', flexDirection: 'column', alignItems: 'stretch'}}>
      <Label size={26}>Adam · cash, untouched</Label>
      <svg width={W} height={H + 16} style={{marginTop: 20, overflow: 'visible'}}>
        <line x1={0} y1={H} x2={W} y2={H} stroke={C.ink} strokeWidth={3} opacity={0.4} />
        {/* Sammy's ride, pushed to the background */}
        <path
          d={SAMMY}
          fill="none"
          stroke={C.rust}
          strokeWidth={10}
          opacity={0.28}
          strokeLinecap="round"
        />
        {/* Adam's straight, boring, unbroken line */}
        <path
          d={ADAM}
          fill="none"
          stroke={C.teal}
          strokeWidth={14}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - drawAdam}
        />
        {drawAdam > 0.98 ? (
          <circle
            cx={W}
            cy={H - 0.56 * H}
            r={14 + Math.sin(frame / 5) * 3}
            fill={C.teal}
            stroke={C.paperLift}
            strokeWidth={5}
          />
        ) : null}
      </svg>

      <div style={{display: 'flex', gap: 26, marginTop: 48, alignItems: 'stretch'}}>
        <div
          style={{
            flex: 1,
            background: C.ink,
            borderRadius: 26,
            padding: '26px 32px 30px',
            boxShadow: '0 14px 0 -4px rgba(23,21,15,0.35)',
            opacity: Math.min(1, badge * 1.6),
            transform: `translateY(${interpolate(badge, [0, 1], [40, 0])}px)`,
          }}
        >
          <div
            style={{
              fontFamily: FONT.ui,
              fontWeight: 800,
              fontSize: 26,
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: C.goldSoft,
            }}
          >
            Losses taken
          </div>
          <div
            style={{fontFamily: FONT.display, fontSize: 112, color: '#FBF4E4', lineHeight: 1.05}}
          >
            ZERO
          </div>
        </div>

        <div
          style={{
            flex: 1,
            background: C.paperLift,
            border: `3px solid ${C.ink}`,
            borderRadius: 26,
            padding: '26px 32px 30px',
            boxShadow: `0 14px 0 -4px ${C.teal}`,
            opacity: Math.min(1, ahead * 1.6),
            transform: `translateY(${interpolate(ahead, [0, 1], [40, 0])}px)`,
          }}
        >
          <Label color={C.teal}>Ahead by</Label>
          <div style={{height: 10}} />
          <Figure at={1490} value={5300} size={104} />
        </div>
      </div>
    </div>
  );
};
