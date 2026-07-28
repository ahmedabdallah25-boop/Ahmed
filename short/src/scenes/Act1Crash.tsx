import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, STAGE} from '../theme';
import {Card, Figure, Label, Stamp} from '../components/Ui';

const W = STAGE.width;
const H = 480;

/** Sammy's book value across 30 months: a patient climb, then the year-two hit. */
const SERIES = (() => {
  const pts: number[] = [];
  for (let i = 0; i <= 20; i++) {
    pts.push(6200 + i * 780 + Math.sin(i * 1.7) * 620);
  }
  const peak = pts[20];
  for (let i = 1; i <= 9; i++) {
    pts.push(peak - (peak - 14600) * (i / 9) ** 0.72);
  }
  return pts;
})();

// the axis hugs the data so the line fills the plot instead of floating in it
const MAX = Math.max(...SERIES) * 1.06;
const MIN = Math.min(...SERIES) - 2600;
const toXY = (v: number, i: number) => [
  (i / (SERIES.length - 1)) * W,
  H - ((v - MIN) / (MAX - MIN)) * H,
];

const path = (from: number, to: number) =>
  SERIES.slice(from, to + 1)
    .map((v, k) => {
      const [x, y] = toXY(v, from + k);
      return `${k === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

const RISE = path(0, 20);
const FALL = path(20, SERIES.length - 1);
const END = toXY(SERIES[SERIES.length - 1], SERIES.length - 1);
const PEAK_Y = toXY(SERIES[20], 20)[1];

const Draw: React.FC<{d: string; at: number; dur: number; color: string; width: number}> = ({
  d,
  at,
  dur,
  color,
  width,
}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - t}
    />
  );
};

export const Act1Crash: React.FC = () => {
  const frame = useCurrentFrame();

  // the chart owns the frame, then folds up to make room for the two accounts
  const fold = interpolate(frame, [104, 140], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scale = interpolate(fold, [0, 1], [1, 0.58]);
  const cardsH = interpolate(frame, [112, 142], [0, 234], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const chipH = interpolate(frame, [294, 318], [0, 128], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{width: W, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div style={{width: '100%', height: (H + 46) * scale, position: 'relative'}}>
        <div style={{transform: `scale(${scale})`, transformOrigin: 'top center', width: W}}>
          <Label size={24}>Sammy · book value · months 1–30</Label>
          <svg width={W} height={H + 14} style={{marginTop: 14, overflow: 'visible'}}>
            <line x1={0} y1={H} x2={W} y2={H} stroke={C.ink} strokeWidth={3} opacity={0.45} />
            <line
              x1={0}
              y1={PEAK_Y}
              x2={W}
              y2={PEAK_Y}
              stroke={C.ink}
              strokeWidth={2}
              strokeDasharray="10 12"
              opacity={interpolate(frame, [40, 60], [0, 0.4], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })}
            />
            <Draw d={RISE} at={4} dur={44} color={C.olive} width={12} />
            <Draw d={FALL} at={50} dur={52} color={C.rust} width={14} />
            {frame > 96 ? (
              <circle
                cx={END[0]}
                cy={END[1]}
                r={15 + Math.sin(frame / 4) * 3}
                fill={C.rust}
                stroke={C.paperLift}
                strokeWidth={5}
              />
            ) : null}
          </svg>
        </div>

        {/* −35% slams over the plunge */}
        <div
          style={{
            position: 'absolute',
            top: (H * 0.42 + 46) * scale,
            left: 0,
            width: W,
            display: 'flex',
            justifyContent: 'center',
            opacity: interpolate(frame, [150, 178], [1, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          <Stamp at={66} text="−35%" />
        </div>
      </div>

      {/* the two slots below open up rather than pop in, so nothing ever jumps */}
      <div style={{width: '100%', height: cardsH, overflow: 'hidden'}}>
        <div style={{paddingTop: 40, display: 'flex', gap: 26}}>
          <Card at={134} accent={C.rustDeep} style={{flex: 1}}>
            <Label color={C.rust}>Sammy · total</Label>
            <div style={{height: 12}} />
            <Figure at={186} value={14600} size={96} />
          </Card>
          <Card at={280} accent={C.ink} style={{flex: 1}}>
            <Label color={C.olive}>Adam · total</Label>
            <div style={{height: 12}} />
            <Figure at={292} value={19900} size={96} />
          </Card>
        </div>
      </div>

      <div
        style={{
          width: '100%',
          height: chipH,
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            marginTop: 34,
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            padding: '14px 34px 17px',
            borderRadius: 999,
            background: C.rust,
            boxShadow: `0 11px 0 -3px ${C.rustDeep}`,
            fontFamily: FONT.display,
            fontSize: 62,
            color: '#FFF3E2',
            letterSpacing: 2,
            transform: `translateY(${interpolate(frame, [300, 318], [26, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })}px)`,
          }}
        >
          BEHIND BY $5,300
        </div>
      </div>
    </div>
  );
};
