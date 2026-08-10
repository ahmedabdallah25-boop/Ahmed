import React from 'react';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ADVANCE, CONTENT_EM} from './metrics';
import {FONT, P, TEXT_WIDTH} from './palette';
import {TOTAL_FRAMES} from './timeline';

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
const MIN_SIZE = 64;
export const LINE_H = 0.98;

// How the phrase actually breaks, using the font's real advances. An earlier
// version divided the character count evenly across N lines, which is not how
// wrapping works — a line cannot hold part of a word. "you would never buy"
// then fell to four lines where two were predicted, and the block overran its
// band by 200px. This walks the same greedy break the browser does.
const advance = (ch: string): number => ADVANCE[ch] ?? 0.6;
const wordEm = (word: string): number =>
  Array.from(word).reduce((sum, ch) => sum + advance(ch), 0);

export const wrapPhrase = (
  text: string,
  size: number,
): {lines: number; widest: number} => {
  const words = text.toLowerCase().split(/\s+/).filter(Boolean);
  const spaceW = advance(' ') * size;
  let lines = 1;
  let cur = 0;
  let widest = 0;
  for (const word of words) {
    const w = wordEm(word) * size;
    if (cur === 0) cur = w;
    else if (cur + spaceW + w <= TEXT_WIDTH) cur += spaceW + w;
    else {
      lines += 1;
      cur = w;
    }
    widest = Math.max(widest, cur);
  }
  return {lines, widest};
};

// The largest size at which the phrase both fits the safe width and stays
// inside this scene's height budget.
// Ink, not the box. line-height 0.98 is tighter than the font's own line box,
// so ink spills roughly 0.115em past each edge — measured, not guessed, from
// the font's ascent and descent. Budgeting for the box alone put phrases up to
// 20px lower than intended.
const INK_SPILL = CONTENT_EM - LINE_H;

export const blockInkHeight = (lines: number, size: number): number =>
  lines * LINE_H * size + INK_SPILL * size;

export const sizeForPhrase = (text: string, budgetH: number): number => {
  for (let size = MAX_SIZE; size > MIN_SIZE; size -= 1) {
    const {lines, widest} = wrapPhrase(text, size);
    if (widest <= TEXT_WIDTH && blockInkHeight(lines, size) <= budgetH) return size;
  }
  return MIN_SIZE;
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
        lineHeight: LINE_H,
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
          lineHeight: LINE_H,
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
