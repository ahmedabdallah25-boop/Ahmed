import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, STAGE} from '../theme';
import {Figure, Panel, Readout, Slam} from '../components/Ui';

const W = STAGE.width;
const H = 612;

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
const MAX = Math.max(...SERIES) * 1.05;
const MIN = Math.min(...SERIES) - 2800;
const xy = (v: number, i: number): [number, number] => [
  (i / (SERIES.length - 1)) * W,
  H - ((v - MIN) / (MAX - MIN)) * H,
];

const line = (from: number, to: number) =>
  SERIES.slice(from, to + 1)
    .map((v, k) => {
      const [x, y] = xy(v, from + k);
      return `${k === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

const area = (from: number, to: number) =>
  `${line(from, to)} L${xy(0, to)[0].toFixed(1)},${H} L${xy(0, from)[0].toFixed(1)},${H} Z`;

const RISE = line(0, 20);
const FALL = line(20, SERIES.length - 1);
const RISE_A = area(0, 20);
const FALL_A = area(20, SERIES.length - 1);
const END = xy(SERIES[SERIES.length - 1], SERIES.length - 1);
const PEAK = xy(SERIES[20], 20);

const Trace: React.FC<{
  d: string;
  fill: string;
  at: number;
  dur: number;
  color: string;
}> = ({d, fill, at, dur, color}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const id = `g${at}`;
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.36} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
        <clipPath id={`c${at}`}>
          <rect x={-10} y={-40} width={(W + 20) * t} height={H + 60} />
        </clipPath>
      </defs>
      <g clipPath={`url(#c${at})`}>
        <path d={fill} fill={`url(#${id})`} />
        <path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={9}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{filter: `drop-shadow(0 0 16px ${color}AA)`}}
        />
      </g>
    </>
  );
};

export const Act1Crash: React.FC = () => {
  const frame = useCurrentFrame();

  // the chart owns the frame, then folds up to make room for the two accounts
  const fold = interpolate(frame, [104, 140], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const scale = interpolate(fold, [0, 1], [1, 0.66]);
  const panelsH = interpolate(frame, [112, 142], [0, 232], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const chipH = interpolate(frame, [294, 318], [0, 152], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div style={{width: W, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div style={{width: '100%', height: (H + 48) * scale, position: 'relative'}}>
        <div style={{transform: `scale(${scale})`, transformOrigin: 'top center', width: W}}>
          <Readout>Sammy · book value · mo 1–30</Readout>
          <svg width={W} height={H + 12} style={{marginTop: 16, overflow: 'visible'}}>
            <line x1={0} y1={H} x2={W} y2={H} stroke={C.hairLit} strokeWidth={2} />
            <line
              x1={0}
              y1={PEAK[1]}
              x2={W}
              y2={PEAK[1]}
              stroke={C.text}
              strokeWidth={2}
              strokeDasharray="8 14"
              opacity={interpolate(frame, [40, 60], [0, 0.35], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })}
            />
            <Trace d={RISE} fill={RISE_A} at={4} dur={46} color={C.gain} />
            <Trace d={FALL} fill={FALL_A} at={50} dur={52} color={C.loss} />
            {frame > 98 ? (
              <circle
                cx={END[0]}
                cy={END[1]}
                r={12 + Math.sin(frame / 4) * 3}
                fill={C.loss}
                style={{filter: `drop-shadow(0 0 18px ${C.loss})`}}
              />
            ) : null}
          </svg>
        </div>

        <div
          style={{
            position: 'absolute',
            top: (H * 0.4 + 48) * scale,
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
          <Slam at={66} text="−35%" />
        </div>
      </div>

      {/* the two accounts open up rather than pop in, so nothing ever jumps */}
      <div style={{width: '100%', height: panelsH, overflow: 'hidden'}}>
        <div style={{paddingTop: 40, display: 'flex', gap: 24}}>
          <Panel at={134} accent={C.loss} style={{flex: 1}}>
            <Readout color={C.loss}>Sammy · total</Readout>
            <div style={{height: 14}} />
            <Figure at={186} value={14600} size={88} color={C.text} />
          </Panel>
          <Panel at={280} accent={C.gain} style={{flex: 1}}>
            <Readout color={C.gain}>Adam · total</Readout>
            <div style={{height: 14}} />
            <Figure at={292} value={19900} size={88} color={C.text} />
          </Panel>
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
            marginTop: 36,
            padding: '14px 34px 18px',
            border: `3px solid ${C.loss}`,
            background: `${C.loss}1C`,
            fontFamily: FONT.mono,
            fontWeight: 800,
            fontSize: 52,
            letterSpacing: 1,
            color: C.loss,
            textShadow: `0 0 24px ${C.loss}88`,
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
