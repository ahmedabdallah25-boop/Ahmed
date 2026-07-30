import React from 'react';
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { GOLD, MONO } from '../theme';

/** The roll is VO-synced to "three cents of YOURS" at 0:04, i.e. local frame 120. */
const ROLL_START = 120;
const ROLL_END = 156;
const FROM = 14208;
const TO = 426.24;

const SIZE = 72; // font size
const ROW = 78; // wheel row height in px — geometry is all px, see Wheel
const ROWS = 11; // 0-9 plus a repeated 0 so the 9 -> 0 wrap rolls forward

/**
 * One odometer wheel.
 *
 * Geometry is in pixels, not percentages: a percentage translateY resolves against the
 * strip's own height (11 rows), which makes the offset per digit a fraction that never
 * lands cleanly on a row.
 *
 * `settled` snaps to the exact digit once the roll is over. Without it the units wheel
 * rests 24% of the way to the next digit for a value of 426.24 — correct odometer
 * physics, but it reads as a rendering bug when the number is supposed to be still.
 */
const Wheel: React.FC<{ place: number; value: number; settled: boolean }> = ({
  place,
  value,
  settled,
}) => {
  // Settled digits come off an integer cent count. Going through the float directly
  // renders 426.24 as "426.23", because 426.24 * 100 is 42623.999... in binary.
  const cents = Math.round(value * 100);
  const settledDigit = Math.floor(cents / 10 ** (place + 2)) % 10;

  // Only the cents wheels roll continuously. Letting the dollar wheels sit between
  // digits too leaves the whole figure mid-glyph for the length of the roll, which is
  // unreadable in the hook — this way the dollars read as a hard countdown and the
  // cents carry the motion.
  const continuous = settled
    ? settledDigit
    : place >= 0
      ? Math.floor(value / 10 ** place) % 10
      : (((value / 10 ** place) % 10) + 10) % 10;

  return (
    <span
      style={{
        display: 'inline-block',
        width: 44,
        height: ROW,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <span
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          display: 'block',
          transform: `translateY(${-continuous * ROW}px)`,
        }}
      >
        {Array.from({ length: ROWS }, (_, i) => (
          <span
            key={i}
            style={{
              display: 'block',
              width: 44,
              height: ROW,
              lineHeight: `${ROW}px`,
              textAlign: 'center',
            }}
          >
            {i % 10}
          </span>
        ))}
      </span>
    </span>
  );
};

export const ReserveCounter: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const value = interpolate(frame, [ROLL_START, ROLL_END], [FROM, TO], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const settled = frame >= ROLL_END;

  // 400ms overshoot settle on the figure as it lands
  const settle = spring({
    frame: frame - ROLL_END,
    fps,
    config: { damping: 9, mass: 0.5 },
    durationInFrames: 12,
  });
  const pop = 1 + settle * 0.05;

  // Bar tracks the same timing: 100% of the deposit -> the 3% actually held.
  const barWidth = interpolate(frame, [ROLL_START, ROLL_END], [100, 3], {
    easing: Easing.out(Easing.cubic),
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const labelOpacity = interpolate(frame, [ROLL_END, ROLL_END + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Leading places are dropped entirely rather than hidden, so the figure collapses
  // leftward as it shrinks instead of leaving a gap after the $.
  const places = [4, 3, 2, 1, 0].filter((p) => value >= 10 ** p || p === 0);

  return (
    // Locked to the blank balance field left deliberately empty in phone-balance.png
    <div style={{ position: 'absolute', left: 340, top: 548, width: 420 }}>
      <div
        style={{
          fontFamily: MONO,
          fontSize: SIZE,
          color: '#0f1826',
          fontVariantNumeric: 'tabular-nums',
          transform: `scale(${pop})`,
          transformOrigin: 'left center',
          display: 'flex',
          alignItems: 'center',
          height: ROW,
        }}
      >
        <span style={{ lineHeight: `${ROW}px`, marginRight: 4 }}>$</span>
        {places.map((p) => (
          <React.Fragment key={p}>
            <Wheel place={p} value={value} settled={settled} />
            {p === 3 ? <span style={{ lineHeight: `${ROW}px` }}>,</span> : null}
          </React.Fragment>
        ))}
        <span style={{ lineHeight: `${ROW}px` }}>.</span>
        <Wheel place={-1} value={value} settled={settled} />
        <Wheel place={-2} value={value} settled={settled} />
      </div>

      <div style={{ marginTop: 14, height: 6, background: 'rgba(15,24,38,.12)', borderRadius: 3 }}>
        <div
          style={{
            width: `${barWidth}%`,
            height: '100%',
            borderRadius: 3,
            background: GOLD,
            boxShadow: `0 0 18px ${GOLD}`,
          }}
        />
      </div>
      <div
        style={{
          marginTop: 10,
          fontFamily: MONO,
          fontSize: 28,
          letterSpacing: '.10em',
          color: GOLD,
          opacity: labelOpacity,
        }}
      >
        3% HELD
      </div>
    </div>
  );
};
