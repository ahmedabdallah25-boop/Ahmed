import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, STAGE} from '../theme';
import {Figure, Panel, Readout} from '../components/Ui';

const W = STAGE.width;
const H = 380;

const line = (fn: (t: number) => number, n = 44) =>
  Array.from({length: n + 1}, (_, i) => {
    const t = i / n;
    return `${i === 0 ? 'M' : 'L'}${(t * W).toFixed(1)},${(H - fn(t) * H).toFixed(1)}`;
  }).join(' ');

const SAMMY = line((t) => (t < 0.68 ? 0.3 + t * 0.68 : 0.76 - (t - 0.68) * 1.42));
const ADAM = line((t) => 0.4 + t * 0.16);
const ADAM_FILL = `${ADAM} L${W},${H} L0,${H} Z`;

export const Act5Adam: React.FC = () => {
  const frame = useCurrentFrame();
  const drawAdam = interpolate(frame, [1330, 1392], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div style={{width: W, display: 'flex', flexDirection: 'column'}}>
      <Readout>Adam · cash, untouched</Readout>

      <svg width={W} height={H + 16} style={{marginTop: 22, overflow: 'visible'}}>
        <defs>
          <linearGradient id="adamFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.cool} stopOpacity={0.3} />
            <stop offset="100%" stopColor={C.cool} stopOpacity={0} />
          </linearGradient>
          <clipPath id="adamClip">
            <rect x={-10} y={-40} width={(W + 20) * drawAdam} height={H + 60} />
          </clipPath>
        </defs>

        <line x1={0} y1={H} x2={W} y2={H} stroke={C.hairLit} strokeWidth={2} />

        {/* Sammy's ride, pushed into the background */}
        <path d={SAMMY} fill="none" stroke={C.loss} strokeWidth={8} opacity={0.32} strokeLinecap="round" />

        {/* Adam's straight, boring, unbroken line */}
        <g clipPath="url(#adamClip)">
          <path d={ADAM_FILL} fill="url(#adamFill)" />
          <path
            d={ADAM}
            fill="none"
            stroke={C.cool}
            strokeWidth={11}
            strokeLinecap="round"
            style={{filter: `drop-shadow(0 0 16px ${C.cool}AA)`}}
          />
        </g>
        {drawAdam > 0.98 ? (
          <circle
            cx={W}
            cy={H - 0.56 * H}
            r={12 + Math.sin(frame / 5) * 3}
            fill={C.cool}
            style={{filter: `drop-shadow(0 0 18px ${C.cool})`}}
          />
        ) : null}
      </svg>

      <div style={{display: 'flex', gap: 24, marginTop: 52, alignItems: 'stretch'}}>
        <Panel at={1414} accent={C.cool} style={{flex: 1}}>
          <Readout color={C.cool}>Losses taken</Readout>
          <div
            style={{
              fontFamily: FONT.display,
              fontSize: 100,
              color: C.text,
              lineHeight: 1.12,
              textShadow: `0 0 26px ${C.cool}55`,
            }}
          >
            ZERO
          </div>
        </Panel>

        <Panel at={1484} accent={C.gain} style={{flex: 1}}>
          <Readout color={C.gain}>Ahead by</Readout>
          <div style={{height: 14}} />
          <Figure at={1490} value={5300} size={92} color={C.gain} />
        </Panel>
      </div>
    </div>
  );
};
