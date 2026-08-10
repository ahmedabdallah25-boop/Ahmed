import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT, P, TEXT_WIDTH} from './palette';
import {SCENES, TOTAL_FRAMES} from './timeline';

// ---------------------------------------------------------------------------
// Captions — phrase blocks
//
// Styled after the reference Short: one phrase on screen at a time, set very
// large and all-lowercase in the heaviest weight available, naked against the
// picture with no stroke, shadow or pill behind it. It eases in on opacity and
// leaves by blurring out as it fades, and blocks change on the voice's own
// pauses rather than word by word.
//
// Two things in that reference cannot carry over and are deliberately not
// imitated. Its type is white in an Overlay blend over dark footage — on this
// video's cream ground that is invisible, so the fill is the ink the artwork
// already draws its outlines in. And its type sits at the vertical centre
// because it is masked behind the subject; there is no segmentation model
// reachable here, so type stays above the subject line instead.
// ---------------------------------------------------------------------------

// Inter 900. The reference uses a geometric (Poppins/Montserrat class); Inter
// is a grotesque, and it is what this project has. Google's font CDN is not
// reachable at render time and src/fonts.ts documents why nothing here may
// depend on a network fetch mid-render.
const CAPTION_WEIGHT = 900;

// Size is set per phrase — short phrases go big, long ones break to more lines
// — which is how the reference's type behaves. The height budget is what keeps
// a tall block from reaching the subject: the art gives roughly the top third
// as headroom, and type has to live inside it.
const MAX_SIZE = 230;
const CHAR_W = 0.58; // Inter 900 average advance, in ems

export const sizeForPhrase = (text: string, budgetH: number): number => {
  const chars = text.replace(/\s/g, '').length;
  const longest = Math.max(...text.split(' ').map((w) => w.length), 1);
  let best = 0;
  for (let lines = 1; lines <= 4; lines++) {
    const byWidth = TEXT_WIDTH / (Math.ceil(chars / lines) * CHAR_W);
    const byWord = TEXT_WIDTH / (longest * CHAR_W);
    const byHeight = budgetH / (lines * 0.98);
    best = Math.max(best, Math.min(byWidth, byWord, byHeight, MAX_SIZE));
  }
  return Math.round(Math.max(64, best));
};

export const PhraseBlock: React.FC<{
  text: string;
  start: number;
  end: number;
  color: string;
  budgetH: number;
}> = ({text, start, end, color, budgetH}) => {
  const frame = useCurrentFrame();
  const local = frame - start;
  const life = Math.max(end - start, 1);
  if (local < 0 || local >= life) return null;

  // Short scenes cannot afford the full in/out, so both are scaled to fit.
  const IN = Math.max(3, Math.min(9, Math.floor(life * 0.42)));
  const OUT = Math.max(3, Math.min(8, Math.floor(life * 0.34)));

  const appear = interpolate(local, [0, IN], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const leave = interpolate(local, [life - OUT, life], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });

  const blur = leave * 18;
  const size = sizeForPhrase(text, budgetH);

  return (
    <div
      style={{
        maxWidth: TEXT_WIDTH,
        textAlign: 'center',
        fontFamily: FONT,
        fontSize: size,
        fontWeight: CAPTION_WEIGHT,
        lineHeight: 0.98,
        letterSpacing: '-0.035em',
        textTransform: 'lowercase',
        color,
        opacity: appear * (1 - leave),
        transform: `scale(${interpolate(appear, [0, 1], [1.045, 1])})`,
        filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
      }}
    >
      {text}
    </div>
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
          fontSize: 96,
          fontWeight: CAPTION_WEIGHT,
          letterSpacing: '-0.035em',
          lineHeight: 0.98,
          textTransform: 'lowercase',
          color: P.ink,
          textAlign: 'center',
          maxWidth: TEXT_WIDTH,
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
