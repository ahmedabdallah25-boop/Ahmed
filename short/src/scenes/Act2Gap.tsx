import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, STAGE} from '../theme';
import {Bar, Figure, Readout, useRise} from '../components/Ui';

const W = STAGE.width;
const DEPOSITED = 19200;
const WORTH = 14600;
const BAR_MAX = W - 330;

/** 36 monthly deposits — one cell each, three years of them. */
const Ledger: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const struck = interpolate(frame, [742, 764], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div style={{width: W, display: 'flex', flexWrap: 'wrap', gap: 12, position: 'relative'}}>
      {Array.from({length: 36}).map((_, i) => {
        const t = interpolate(frame - (at + i * 1.15), [0, 7], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const on = t > 0.5;
        return (
          <div
            key={i}
            style={{
              width: 66,
              height: 66,
              border: `2px solid ${on ? C.gain : C.hairLit}`,
              background: on ? `${C.gain}30` : 'transparent',
              boxShadow: on ? `0 0 18px ${C.gain}44` : 'none',
              opacity: 0.3 + t * 0.7,
              transform: `scale(${interpolate(t, [0, 1], [0.45, 1])})`,
            }}
          />
        );
      })}
      {struck > 0 ? (
        <div
          style={{
            position: 'absolute',
            top: '48%',
            left: 0,
            width: W * struck,
            height: 8,
            background: C.loss,
            boxShadow: `0 0 22px ${C.loss}`,
            transform: 'rotate(-2.5deg)',
          }}
        />
      ) : null}
    </div>
  );
};

export const Act2Gap: React.FC = () => {
  const frame = useCurrentFrame();
  const bw = (v: number) => (v / DEPOSITED) * BAR_MAX;

  // the bars hand the stage over to the deposit ledger
  const swap = interpolate(frame, [636, 664], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const gapR = useRise(492, 24);

  const half = (content: React.ReactNode, show: number, shift: number) => (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: 0,
        width: W,
        opacity: show,
        transform: `translateY(calc(-50% + ${shift}px))`,
      }}
    >
      {content}
    </div>
  );

  const bars = (
    <div style={{width: W}}>
      <Readout>Paid in vs. worth today</Readout>

      <div style={{height: 46}} />
      <div style={{display: 'flex', alignItems: 'center', gap: 26}}>
        <Bar at={414} width={bw(DEPOSITED)} color={C.gain} height={84} />
        <Figure at={420} value={DEPOSITED} size={64} color={C.gain} />
      </div>
      <div style={{height: 14}} />
      <Readout size={23}>Deposited over 3 years</Readout>

      <div style={{height: 50}} />
      <div style={{display: 'flex', alignItems: 'center', gap: 26}}>
        <Bar at={474} width={bw(WORTH)} color={C.loss} height={84} />
        <Figure at={480} value={WORTH} size={64} color={C.loss} />
      </div>
      <div style={{height: 14}} />
      <Readout size={23}>Worth today</Readout>

      {/* the shortfall between the two bars */}
      <div
        style={{
          marginTop: 58,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          opacity: Math.min(1, gapR * 1.8),
          transform: `translateX(${interpolate(gapR, [0, 1], [-40, 0])}px)`,
        }}
      >
        <div
          style={{
            width: bw(DEPOSITED) - bw(WORTH),
            height: 22,
            marginLeft: bw(WORTH),
            background: `repeating-linear-gradient(115deg, ${C.loss} 0 3px, transparent 3px 14px)`,
            borderTop: `2px solid ${C.loss}`,
            borderBottom: `2px solid ${C.loss}`,
          }}
        />
        <div
          style={{
            fontFamily: FONT.mono,
            fontWeight: 800,
            fontSize: 62,
            color: C.loss,
            letterSpacing: -2,
            textShadow: `0 0 26px ${C.loss}77`,
          }}
        >
          −$4,600
        </div>
      </div>
    </div>
  );

  const ledger = (
    <div style={{width: W}}>
      <Readout>36 deposits · never missed one</Readout>
      <div style={{height: 38}} />
      <Ledger at={660} />
      <div style={{height: 52}} />
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'baseline',
          gap: 22,
          padding: '16px 32px 20px',
          border: `2px solid ${C.loss}55`,
          borderTop: `5px solid ${C.loss}`,
          background: `${C.surface}F0`,
        }}
      >
        <span
          style={{
            fontFamily: FONT.mono,
            fontWeight: 600,
            fontSize: 28,
            letterSpacing: 3,
            color: C.textDim,
            textTransform: 'uppercase',
          }}
        >
          Still short by
        </span>
        <span
          style={{
            fontFamily: FONT.mono,
            fontWeight: 800,
            fontSize: 72,
            color: C.loss,
            letterSpacing: -2,
            textShadow: `0 0 24px ${C.loss}77`,
          }}
        >
          $4,600
        </span>
      </div>
    </div>
  );

  return (
    <div style={{width: W, height: 700, position: 'relative'}}>
      {half(bars, 1 - swap, interpolate(swap, [0, 1], [0, -50]))}
      {half(ledger, swap, interpolate(swap, [0, 1], [60, 0]))}
    </div>
  );
};
