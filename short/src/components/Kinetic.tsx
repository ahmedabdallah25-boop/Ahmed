import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../theme';
import type {Phrase, PhraseStyle, Word} from '../data/script';

const BLOCK_WIDTH = 960;

/** Long phrases step down in size so a line never runs off the safe area. */
const fontSizeFor = (chars: number, style: PhraseStyle) => {
  const base = chars <= 12 ? 128 : chars <= 20 ? 112 : chars <= 28 ? 98 : chars <= 38 ? 86 : 74;
  return style === 'number' ? base * 1.06 : base;
};

type Skin = {
  /** one slab behind the whole phrase, or a chip per word */
  slab: boolean;
  bg: string;
  fg: string;
  activeBg: string;
  activeFg: string;
  shadow: string;
  font: string;
  caps: boolean;
  track: number;
};

const SKINS: Record<PhraseStyle, Skin> = {
  chip: {
    slab: false,
    bg: C.paperLift,
    fg: C.ink,
    activeBg: C.ink,
    activeFg: C.goldSoft,
    shadow: 'rgba(23,21,15,0.30)',
    font: FONT.ui,
    caps: false,
    track: -1,
  },
  slab: {
    slab: true,
    bg: C.ink,
    fg: '#FBF4E4',
    activeBg: C.gold,
    activeFg: C.ink,
    shadow: 'rgba(23,21,15,0.38)',
    font: FONT.ui,
    caps: false,
    track: -1.5,
  },
  alarm: {
    slab: true,
    bg: C.rust,
    fg: '#FFF3E2',
    activeBg: C.goldSoft,
    activeFg: C.rustDeep,
    shadow: 'rgba(142,47,31,0.42)',
    font: FONT.ui,
    caps: true,
    track: 1,
  },
  number: {
    slab: true,
    bg: C.ink,
    fg: C.goldSoft,
    activeBg: C.gold,
    activeFg: C.ink,
    shadow: 'rgba(23,21,15,0.40)',
    font: FONT.display,
    caps: true,
    track: 2,
  },
};

const WordChip: React.FC<{
  word: Word;
  active: boolean;
  skin: Skin;
  size: number;
}> = ({word, active, skin, size}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const inn = spring({
    frame: frame - word.s,
    fps,
    config: {damping: 13, stiffness: 190, mass: 0.7},
    durationInFrames: 20,
  });
  if (inn <= 0) {
    return null;
  }

  // the pop that lands exactly on the syllable
  const hit = spring({
    frame: frame - word.s,
    fps,
    config: {damping: 9, stiffness: 260, mass: 0.5},
    durationInFrames: 16,
  });
  const punch = active ? interpolate(hit, [0, 1], [1.14, 1], {extrapolateRight: 'clamp'}) : 1;

  // a word stays lit once it has been spoken if it is one of the key words
  const lit = active || (word.hi && frame >= word.s);

  return (
    <span
      style={{
        display: 'inline-block',
        transform: `translateY(${interpolate(inn, [0, 1], [34, 0])}px) scale(${
          interpolate(inn, [0, 1], [0.66, 1]) * punch
        }) rotate(${interpolate(inn, [0, 1], [-3.5, 0])}deg)`,
        opacity: Math.min(1, inn * 1.6),
        padding: skin.slab ? '0 2px' : '6px 20px 9px',
        borderRadius: skin.slab ? 0 : 18,
        background: skin.slab ? 'transparent' : lit ? skin.activeBg : skin.bg,
        color: skin.slab ? (lit ? skin.activeBg : skin.fg) : lit ? skin.activeFg : skin.fg,
        boxShadow: skin.slab ? 'none' : `0 9px 0 -2px ${lit ? 'rgba(23,21,15,0.55)' : skin.shadow}`,
        transformOrigin: 'center bottom',
        fontSize: size,
        lineHeight: 1.02,
        whiteSpace: 'pre',
      }}
    >
      {skin.caps ? word.t.toUpperCase() : word.t}
    </span>
  );
};

/**
 * The kinetic caption block: one phrase at a time, each word landing on the
 * frame it is spoken, the live word lit up.
 */
export const Kinetic: React.FC<{phrase: Phrase}> = ({phrase}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const skin = SKINS[phrase.style];

  const chars = phrase.words.reduce((n, w) => n + w.t.length + 1, 0);
  const size = fontSizeFor(chars, phrase.style);

  const activeIndex = (() => {
    let idx = -1;
    phrase.words.forEach((w, i) => {
      if (frame >= w.s) {
        idx = i;
      }
    });
    return idx;
  })();

  const enter = spring({
    frame: frame - phrase.s,
    fps,
    config: {damping: 200},
    durationInFrames: 12,
  });
  const outAt = phrase.e - 6;
  const exit =
    frame > outAt
      ? interpolate(frame, [outAt, phrase.e], [0, 1], {
          extrapolateRight: 'clamp',
        })
      : 0;

  // the slab grows as words land, so the box always hugs the phrase
  const revealed = phrase.words.filter((w) => frame >= w.s).length;
  const slabGrow = spring({
    frame: frame - (phrase.words[Math.max(0, revealed - 1)]?.s ?? phrase.s),
    fps,
    config: {damping: 15, stiffness: 150},
    durationInFrames: 18,
  });

  return (
    <div
      style={{
        width: BLOCK_WIDTH,
        display: 'flex',
        justifyContent: 'center',
        opacity: (1 - exit) * Math.min(1, enter * 2),
        transform: `translateY(${interpolate(exit, [0, 1], [0, -26])}px) scale(${1 - exit * 0.06})`,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'flex-end',
          gap: skin.slab ? `${size * 0.14}px ${size * 0.24}px` : '18px 14px',
          padding: skin.slab ? `${size * 0.26}px ${size * 0.34}px ${size * 0.3}px` : 0,
          borderRadius: skin.slab ? 34 : 0,
          background: skin.slab ? skin.bg : 'transparent',
          boxShadow: skin.slab
            ? `0 16px 0 -6px ${skin.shadow}, 0 34px 60px rgba(23,21,15,0.20)`
            : 'none',
          fontFamily: skin.font,
          fontWeight: skin.font === FONT.display ? 400 : 800,
          letterSpacing: skin.track,
          transform: `scale(${interpolate(slabGrow, [0, 1], [0.985, 1])})`,
          maxWidth: BLOCK_WIDTH,
        }}
      >
        {phrase.words.map((w, i) => (
          <WordChip
            key={`${phrase.s}-${i}`}
            word={w}
            active={i === activeIndex}
            skin={skin}
            size={size}
          />
        ))}
      </div>
    </div>
  );
};
