import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, STAGE} from '../theme';
import {Bar, Figure, Label, useRise} from '../components/Ui';

const W = STAGE.width;
const DEPOSITED = 19200;
const WORTH = 14600;
const BAR_MAX = W - 320;

/** 36 monthly deposits — one dot each, three years of them. */
const Dots: React.FC<{at: number}> = ({at}) => {
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
        return (
          <div
            key={i}
            style={{
              width: 66,
              height: 66,
              borderRadius: 16,
              border: `3px solid ${C.ink}`,
              background: t > 0.5 ? C.olive : 'transparent',
              opacity: 0.22 + t * 0.78,
              transform: `scale(${interpolate(t, [0, 1], [0.4, 1])})`,
              boxShadow: t > 0.5 ? '0 7px 0 -2px rgba(23,21,15,0.28)' : 'none',
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
            height: 13,
            background: C.rust,
            borderRadius: 999,
            transform: 'rotate(-3deg)',
            boxShadow: '0 5px 0 -1px rgba(142,47,31,0.4)',
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

  // both halves live in one fixed-height box so the swap cross-fades in place
  const half = (content: React.ReactNode, show: number, shift: number) => (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: 0,
        width: W,
        opacity: show,
        pointerEvents: 'none',
        transform: `translateY(calc(-50% + ${shift}px))`,
      }}
    >
      {content}
    </div>
  );

  const ledger = (
    <div style={{width: W}}>
      <Label size={26}>36 deposits · never missed one</Label>
      <div style={{height: 36}} />
      <Dots at={660} />
      <div style={{height: 48}} />
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'baseline',
          gap: 20,
          padding: '16px 34px 20px',
          borderRadius: 22,
          background: C.ink,
          boxShadow: '0 13px 0 -4px rgba(23,21,15,0.35)',
        }}
      >
        <span
          style={{
            fontFamily: FONT.ui,
            fontWeight: 800,
            fontSize: 30,
            letterSpacing: 4,
            color: C.goldSoft,
            textTransform: 'uppercase',
          }}
        >
          Still short by
        </span>
        <span style={{fontFamily: FONT.display, fontSize: 76, color: '#FBF4E4'}}>$4,600</span>
      </div>
    </div>
  );

  const bars = (
    <div style={{width: W}}>
      <Label size={26}>Paid in vs. worth today</Label>

      <div style={{height: 44}} />
      <div style={{display: 'flex', alignItems: 'center', gap: 26}}>
        <Bar at={414} width={bw(DEPOSITED)} color={C.olive} height={86} />
        <Figure at={420} value={DEPOSITED} size={68} />
      </div>
      <div style={{height: 12}} />
      <Label size={23}>Deposited over 3 years</Label>

      <div style={{height: 48}} />
      <div style={{display: 'flex', alignItems: 'center', gap: 26}}>
        <Bar at={474} width={bw(WORTH)} color={C.rust} height={86} />
        <Figure at={480} value={WORTH} size={68} />
      </div>
      <div style={{height: 12}} />
      <Label size={23}>Worth today</Label>

      {/* the shortfall between the two bars */}
      <div
        style={{
          marginTop: 56,
          display: 'flex',
          alignItems: 'center',
          gap: 22,
          opacity: Math.min(1, gapR * 1.8),
          transform: `translateX(${interpolate(gapR, [0, 1], [-40, 0])}px)`,
        }}
      >
        <div
          style={{
            width: bw(DEPOSITED) - bw(WORTH),
            height: 22,
            marginLeft: bw(WORTH),
            background: `repeating-linear-gradient(45deg, ${C.rust} 0 12px, transparent 12px 24px)`,
            borderTop: `3px solid ${C.rust}`,
            borderBottom: `3px solid ${C.rust}`,
          }}
        />
        <div style={{fontFamily: FONT.display, fontSize: 82, color: C.rust, letterSpacing: 1}}>
          −$4,600
        </div>
      </div>
    </div>
  );

  return (
    <div style={{width: W, height: 620, position: 'relative'}}>
      {half(bars, 1 - swap, interpolate(swap, [0, 1], [0, -50]))}
      {half(ledger, swap, interpolate(swap, [0, 1], [60, 0]))}
    </div>
  );
};
