import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT, P} from './palette';
import {SCENES, TOTAL_FRAMES} from './timeline';

// ---------------------------------------------------------------------------
// Kinetic typography
//
// Each word rises out of its own clipping box rather than fading in place: the
// mask is what makes it read as typography rather than as a caption track. The
// stagger is per-word, so a line assembles at roughly the speed it is spoken.
// ---------------------------------------------------------------------------
export const KineticLine: React.FC<{
  text: string;
  start: number;
  size: number;
  color: string;
  weight?: number;
  stagger?: number;
}> = ({text, start, size, color, weight = 800, stagger = 2}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = text.split(' ');

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        columnGap: size * 0.26,
      }}
    >
      {words.map((word, i) => {
        const local = frame - start - i * stagger;
        const rise = spring({frame: local, fps, config: {damping: 200, mass: 0.55}});
        return (
          <span
            key={`${word}-${i}`}
            style={{
              display: 'block',
              overflow: 'hidden',
              paddingBottom: size * 0.14,
              marginBottom: -size * 0.14,
            }}
          >
            <span
              style={{
                display: 'block',
                fontFamily: FONT,
                fontSize: size,
                fontWeight: weight,
                lineHeight: 1.06,
                letterSpacing: '-0.022em',
                color,
                transform: `translateY(${(1 - rise) * size * 1.15}px)`,
                opacity: local < 0 ? 0 : 1,
              }}
            >
              {word}
            </span>
          </span>
        );
      })}
    </div>
  );
};

// A rule that draws itself under the payoff line. Anchored to the text block's
// width so it never runs wider than the words it belongs to.
export const DrawRule: React.FC<{start: number; color: string; width: number}> = ({
  start,
  color,
  width,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const grow = spring({frame: frame - start, fps, config: {damping: 200, mass: 0.9}});
  return (
    <div
      style={{
        width: width * grow,
        height: 7,
        borderRadius: 4,
        backgroundColor: color,
        marginTop: 20,
        opacity: frame < start ? 0 : 1,
      }}
    />
  );
};

// ---------------------------------------------------------------------------
// Persistent chrome — these sit above every scene and never move, which is what
// makes the cuts underneath them feel deliberate.
// ---------------------------------------------------------------------------

// Progress hairline. Sand on cream: present, but never competing with the art.
export const ProgressRule: React.FC = () => {
  const frame = useCurrentFrame();
  const done = Math.min(frame / TOTAL_FRAMES, 1);
  return (
    <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 8}}>
      <div style={{position: 'absolute', inset: 0, backgroundColor: P.sand, opacity: 0.32}} />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: `${done * 100}%`,
          backgroundColor: P.camel,
        }}
      />
    </div>
  );
};

// The three-step checklist. The pack's script numbers the steps out loud
// ("One." / "Two." / "Three."), so the track is driven by those lines rather
// than by a hand-picked frame range.
const STEP_SCENES = SCENES.filter((s) => s.step > 0);
const STEPS_FROM = STEP_SCENES[0]?.from ?? 0;
const STEPS_UNTIL = SCENES.find((s) => s.n === 45)?.from ?? TOTAL_FRAMES;

export const StepTrack: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < STEPS_FROM || frame >= STEPS_UNTIL) return null;

  const reached = STEP_SCENES.filter((s) => s.from <= frame);
  const active = reached.length ? reached[reached.length - 1].step : 0;
  const appear = spring({frame: frame - STEPS_FROM, fps, config: {damping: 200}});

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 132,
        display: 'flex',
        justifyContent: 'center',
        gap: 22,
        opacity: appear,
        transform: `translateY(${(1 - appear) * 26}px)`,
      }}
    >
      {[1, 2, 3].map((n) => {
        const on = n <= active;
        const isCurrent = n === active;
        return (
          <div
            key={n}
            style={{
              width: 74,
              height: 74,
              borderRadius: 999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: FONT,
              fontSize: 34,
              fontWeight: 800,
              color: on ? P.cream : P.ink,
              backgroundColor: on ? P.teal : 'transparent',
              border: `3px solid ${on ? P.teal : P.ink}`,
              opacity: on ? 1 : 0.34,
              transform: `scale(${isCurrent ? 1 + 0.06 * Math.sin((frame - STEPS_FROM) / 6) : 1})`,
            }}
          >
            {n}
          </div>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Outro. The pack specifies scene 46 as a plain plate "with a clean centre
// reserved for a logo overlay to be added in post" — this is that overlay.
// ---------------------------------------------------------------------------
export const EndCard: React.FC<{line: string}> = ({line}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inn = spring({frame: frame - 4, fps, config: {damping: 200, mass: 0.7}});
  const rule = spring({frame: frame - 16, fps, config: {damping: 200, mass: 0.9}});

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 260,
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontSize: 62,
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: P.ink,
          textAlign: 'center',
          opacity: inn,
          transform: `translateY(${(1 - inn) * 30}px)`,
        }}
      >
        {line}
      </div>
      <div
        style={{
          marginTop: 34,
          width: 420 * rule,
          height: 6,
          borderRadius: 4,
          backgroundColor: P.sage,
        }}
      />
      <div
        style={{
          marginTop: 34,
          fontFamily: FONT,
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: P.grey,
          opacity: interpolate(frame, [24, 40], [0, 1], {extrapolateRight: 'clamp'}),
        }}
      >
        Finance % Decoded
      </div>
    </div>
  );
};
