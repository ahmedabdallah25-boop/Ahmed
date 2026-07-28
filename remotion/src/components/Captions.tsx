/**
 * Burned-in captions, emphasis flashes, and the undercut line.
 *
 * The rule this style runs on: the caption is not a transcript, it is a second
 * comedian. It cuts on the word, it occasionally disagrees with the voice, and
 * it is never on screen long enough to feel like a subtitle track.
 */

import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONTS, RHYTHM } from '../theme';
import { toCaptionCards } from '../lib/timeline';

/**
 * Bottom scrim. Cutaways are frequently bright — a checkout page, a bank ad —
 * and white captions vanish into them. This sits under the caption stack and
 * over the picture, and is the single cheapest legibility fix in the whole cut.
 */
export const CaptionScrim: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.58) 16%, rgba(0,0,0,0.30) 30%, transparent 46%)',
    }}
  />
);

/**
 * 2–4 word ALL-CAPS cards, hard-cut across the beat with no fades. Timing is
 * derived from the beat length rather than from a transcript so a script edit
 * never desyncs the captions from the VO it was written for.
 */
export const Captions: React.FC<{ vo: string; wordsPerCard?: number; bottom?: number }> = ({
  vo,
  wordsPerCard = 3,
  bottom = 132,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const cards = toCaptionCards(vo, wordsPerCard);
  if (cards.length === 0) return null;

  const per = durationInFrames / cards.length;
  const index = Math.min(cards.length - 1, Math.floor(frame / per));
  const text = cards[index].join(' ');

  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', pointerEvents: 'none' }}>
      <div
        style={{
          marginBottom: bottom,
          padding: '0 120px',
          textAlign: 'center',
          fontFamily: FONTS.display,
          fontSize: 96,
          letterSpacing: 2,
          lineHeight: 1,
          color: COLORS.white,
          textTransform: 'uppercase',
          WebkitTextStroke: '3px rgba(0,0,0,0.55)',
          paintOrder: 'stroke fill',
          textShadow: `0 6px 26px ${COLORS.shadow}, 0 2px 0 rgba(0,0,0,0.5)`,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

/**
 * The full-frame emphasis card. Slams on, sits for ~9 frames, gone.
 * A tiny counter-rotation stops it feeling like a UI element.
 */
export const EmphasisFlash: React.FC<{ word: string; at: number; color?: string }> = ({
  word,
  at,
  color = COLORS.white,
}) => {
  const frame = useCurrentFrame();
  const live = frame >= at && frame < at + RHYTHM.flash;
  if (!live) return null;

  const local = frame - at;
  const scale = interpolate(local, [0, 2, RHYTHM.flash], [1.22, 1, 1.04], {
    extrapolateRight: 'clamp',
  });
  const tilt = ((at % 5) - 2) * 0.9;

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
      <div
        style={{
          transform: `scale(${scale}) rotate(${tilt}deg)`,
          fontFamily: FONTS.display,
          fontSize: 260,
          color,
          letterSpacing: 4,
          textTransform: 'uppercase',
          WebkitTextStroke: `6px rgba(0,0,0,0.75)`,
          paintOrder: 'stroke fill',
          textShadow: `0 16px 60px rgba(0,0,0,0.7)`,
        }}
      >
        {word}
      </div>
    </AbsoluteFill>
  );
};

/**
 * The undercut: small type at the very bottom that contradicts, corrects, or
 * quietly betrays what the host just said. It is never spoken aloud.
 */
export const Undercut: React.FC<{ text: string; delay?: number }> = ({ text, delay = 12 }) => {
  const frame = useCurrentFrame();
  if (frame < delay) return null;

  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', alignItems: 'center', pointerEvents: 'none' }}>
      <div
        style={{
          marginBottom: 52,
          padding: '6px 18px',
          background: 'rgba(0,0,0,0.55)',
          fontFamily: FONTS.mono,
          fontSize: 30,
          color: 'rgba(253,248,242,0.92)',
          letterSpacing: 0.4,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

/** Persistent lower-third for named claims, sources, and "he actually said this" moments. */
export const LowerThird: React.FC<{ line1: string; line2?: string }> = ({ line1, line2 }) => {
  const frame = useCurrentFrame();
  const slide = interpolate(frame, [0, 7], [-40, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ justifyContent: 'flex-end', pointerEvents: 'none' }}>
      <div style={{ transform: `translateX(${slide}px)`, margin: '0 0 232px 96px', maxWidth: 900 }}>
        <div
          style={{
            display: 'inline-block',
            background: COLORS.amber,
            color: '#140d06',
            fontFamily: FONTS.caption,
            fontWeight: 800,
            fontSize: 34,
            padding: '10px 20px',
          }}
        >
          {line1}
        </div>
        {line2 ? (
          <div
            style={{
              display: 'block',
              background: 'rgba(13,11,10,0.9)',
              color: COLORS.white,
              fontFamily: FONTS.mono,
              fontSize: 26,
              padding: '8px 20px',
              maxWidth: 'fit-content',
            }}
          >
            {line2}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
