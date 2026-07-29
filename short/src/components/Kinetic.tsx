import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../theme';
import type {Phrase, PhraseStyle, Word} from '../data/script';

const BLOCK = 940;

/** Archivo Black is wide, so long phrases step down hard to stay on one screen. */
const sizeFor = (chars: number, style: PhraseStyle) => {
  const base = chars <= 12 ? 112 : chars <= 20 ? 96 : chars <= 28 ? 82 : chars <= 38 ? 70 : 60;
  return style === 'number' ? base * 0.94 : base;
};

type Skin = {
  font: string;
  weight: number;
  caps: boolean;
  track: number;
  /** colour of a word that has landed but is not being spoken */
  base: string;
  /** block painted behind the word currently being spoken */
  liveBg: string;
  liveFg: string;
  /** colour a key word keeps once it has been spoken */
  keep: string;
  panel: boolean;
  accent: string;
  shake: boolean;
};

const SKINS: Record<PhraseStyle, Skin> = {
  chip: {
    font: FONT.display,
    weight: 400,
    caps: true,
    track: -0.5,
    base: C.text,
    liveBg: C.live,
    liveFg: C.void,
    keep: C.live,
    panel: false,
    accent: C.live,
    shake: false,
  },
  slab: {
    font: FONT.display,
    weight: 400,
    caps: true,
    track: -0.5,
    base: C.text,
    liveBg: C.cool,
    liveFg: C.void,
    keep: C.cool,
    panel: true,
    accent: C.cool,
    shake: false,
  },
  alarm: {
    font: FONT.display,
    weight: 400,
    caps: true,
    track: 0,
    base: '#FFD9D9',
    liveBg: C.loss,
    liveFg: '#FFFFFF',
    keep: C.loss,
    panel: false,
    accent: C.loss,
    shake: true,
  },
  number: {
    font: FONT.mono,
    weight: 800,
    caps: true,
    track: -1,
    base: C.text,
    liveBg: C.gain,
    liveFg: C.void,
    keep: C.gain,
    panel: false,
    accent: C.gain,
    shake: false,
  },
};

const WordCell: React.FC<{word: Word; live: boolean; skin: Skin; size: number}> = ({
  word,
  live,
  skin,
  size,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const inn = spring({
    frame: frame - word.s,
    fps,
    config: {damping: 12, stiffness: 220, mass: 0.6},
    durationInFrames: 18,
  });
  if (inn <= 0) {
    return null;
  }

  const pop = live
    ? interpolate(
        spring({
          frame: frame - word.s,
          fps,
          config: {damping: 8, stiffness: 300, mass: 0.45},
          durationInFrames: 14,
        }),
        [0, 1],
        [1.16, 1],
        {extrapolateRight: 'clamp'},
      )
    : 1;

  const spoken = frame >= word.s;
  const color = live ? skin.liveFg : word.hi && spoken ? skin.keep : skin.base;

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 14px 8px',
        background: live ? skin.liveBg : 'transparent',
        color,
        fontSize: size,
        lineHeight: 1.0,
        whiteSpace: 'pre',
        transformOrigin: 'center bottom',
        transform: `translateY(${interpolate(inn, [0, 1], [40, 0])}px) scale(${
          interpolate(inn, [0, 1], [0.6, 1]) * pop
        })`,
        opacity: Math.min(1, inn * 1.7),
        boxShadow: live ? `0 0 34px ${skin.liveBg}70` : 'none',
        textShadow: live ? 'none' : `0 4px 18px rgba(0,0,0,0.6)`,
      }}
    >
      {skin.caps ? word.t.toUpperCase() : word.t}
    </span>
  );
};

/**
 * The caption engine: one phrase at a time, each word landing on the frame it
 * is spoken, the live word painted into a solid block.
 */
export const Kinetic: React.FC<{phrase: Phrase}> = ({phrase}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const skin = SKINS[phrase.style];

  const chars = phrase.words.reduce((n, w) => n + w.t.length + 1, 0);
  const size = sizeFor(chars, phrase.style);

  let liveIndex = -1;
  phrase.words.forEach((w, i) => {
    if (frame >= w.s) {
      liveIndex = i;
    }
  });

  const enter = spring({
    frame: frame - phrase.s,
    fps,
    config: {damping: 200},
    durationInFrames: 10,
  });
  const outAt = phrase.e - 6;
  const exit =
    frame > outAt
      ? interpolate(frame, [outAt, phrase.e], [0, 1], {extrapolateRight: 'clamp'})
      : 0;

  // alarm phrases get a short kick on entry
  const age = frame - phrase.s;
  const kick = skin.shake && age < 9 ? Math.sin(age * 2.6) * (1 - age / 9) * 9 : 0;

  return (
    <div
      style={{
        width: BLOCK,
        display: 'flex',
        justifyContent: 'center',
        opacity: (1 - exit) * Math.min(1, enter * 2),
        transform: `translate(${kick}px, ${interpolate(exit, [0, 1], [0, -30])}px) scale(${
          1 - exit * 0.05
        })`,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'flex-end',
          gap: `${size * 0.1}px ${size * 0.08}px`,
          padding: skin.panel ? `${size * 0.34}px ${size * 0.3}px ${size * 0.3}px` : 0,
          background: skin.panel ? `${C.surface}E8` : 'transparent',
          border: skin.panel ? `2px solid ${skin.accent}55` : 'none',
          borderTop: skin.panel ? `5px solid ${skin.accent}` : 'none',
          boxShadow: skin.panel ? `0 24px 70px rgba(0,0,0,0.55)` : 'none',
          fontFamily: skin.font,
          fontWeight: skin.weight,
          letterSpacing: skin.track,
          maxWidth: BLOCK,
        }}
      >
        {phrase.words.map((w, i) => (
          <WordCell key={`${phrase.s}-${i}`} word={w} live={i === liveIndex} skin={skin} size={size} />
        ))}
      </div>
    </div>
  );
};
