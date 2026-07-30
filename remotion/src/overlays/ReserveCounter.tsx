import React from 'react';
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { GOLD, MONO, useCues, useLayout } from '../theme';

const ROLL = 36; // frames the figure takes to fall
const FROM = 14208;
const TO = 426.24;

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
const Wheel: React.FC<{
  place: number;
  value: number;
  settled: boolean;
  row: number;
  wheelW: number;
}> = ({ place, value, settled, row: ROW, wheelW: WHEEL_W }) => {
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
        width: WHEEL_W,
        height: ROW,
        overflow: 'hidden',
        position: 'relative',
        // Fades the digits entering and leaving the window. Without it the neighbouring
        // digit reads as a stray glyph rather than as a drum turning — much more obvious
        // at this size than it was in the portrait cut.
        WebkitMaskImage:
          'linear-gradient(180deg, transparent 0%, #000 26%, #000 74%, transparent 100%)',
        maskImage:
          'linear-gradient(180deg, transparent 0%, #000 26%, #000 74%, transparent 100%)',
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
              width: WHEEL_W,
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
  const C = useLayout().counter;

  /**
   * The roll fires the instant line 2 begins ("Not three percent of the bank's money.
   * Three cents of YOURS"). Measured from the voiceover per cut, so it tracks the
   * recording rather than the script's estimate.
   */
  const ROLL_START = useCues().rollStart;
  const ROLL_END = ROLL_START + ROLL;

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
    // 16:9 puts the figure beside the phone; 9:16 puts it underneath. Both from layout.
    <div style={{ position: 'absolute', left: C.left, top: C.top, width: C.width }}>
      <div
        style={{
          fontFamily: MONO,
          fontSize: C.labelSize,
          letterSpacing: '.22em',
          color: 'rgba(232,238,247,.55)',
          marginBottom: 18,
        }}
      >
        BALANCE
      </div>
      <div
        style={{
          fontFamily: MONO,
          fontSize: C.size,
          // Sits on the void, not on the phone's white screen.
          color: '#fff',
          fontVariantNumeric: 'tabular-nums',
          transform: `scale(${pop})`,
          transformOrigin: 'left center',
          display: 'flex',
          alignItems: 'center',
          height: C.row,
          textShadow: '0 0 60px rgba(150,190,255,.25)',
        }}
      >
        <span style={{ lineHeight: `${C.row}px`, marginRight: 4 }}>$</span>
        {places.map((p) => (
          <React.Fragment key={p}>
            <Wheel place={p} value={value} settled={settled} row={C.row} wheelW={C.wheelW} />
            {p === 3 ? <span style={{ lineHeight: `${C.row}px` }}>,</span> : null}
          </React.Fragment>
        ))}
        <span style={{ lineHeight: `${C.row}px` }}>.</span>
        <Wheel place={-1} value={value} settled={settled} row={C.row} wheelW={C.wheelW} />
        <Wheel place={-2} value={value} settled={settled} row={C.row} wheelW={C.wheelW} />
      </div>

      <div
        style={{
          marginTop: 34,
          width: C.barWidth,
          height: C.barHeight,
          background: 'rgba(232,238,247,.14)',
          borderRadius: 5,
        }}
      >
        <div
          style={{
            width: `${barWidth}%`,
            height: '100%',
            borderRadius: 5,
            background: GOLD,
            boxShadow: `0 0 24px ${GOLD}`,
          }}
        />
      </div>
      <div
        style={{
          marginTop: 18,
          fontFamily: MONO,
          fontSize: C.heldSize,
          letterSpacing: '.12em',
          color: GOLD,
          opacity: labelOpacity,
        }}
      >
        3% HELD
      </div>
    </div>
  );
};
