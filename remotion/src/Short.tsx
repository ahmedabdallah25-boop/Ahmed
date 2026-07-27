import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  Video,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {z} from 'zod';
import {FONT_FAMILY} from './font';

/** One caption card: 1-3 ALL-CAPS words, hard cut in and out. */
export const cardSchema = z.object({
  text: z.string(),
  from: z.number(), // seconds
  to: z.number(),
  /** 0-1 fraction of frame height, matching the five bands used by cinematic_captions.py */
  band: z.number().min(0).max(1).default(0.5),
});

export const shortSchema = z.object({
  /** File under public/, e.g. "part13.mp4". Leave empty for a plain black bed. */
  source: z.string().default(''),
  cards: z.array(cardSchema).default([]),
});

const Card: React.FC<z.infer<typeof cardSchema>> = ({text, band}) => {
  const frame = useCurrentFrame();
  const {height} = useVideoConfig();
  // Punch-in on the first two frames only — a hard cut, never a fade.
  const scale = interpolate(frame, [0, 2], [1.06, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        // In px, not %: percentage padding resolves against width, not height.
        paddingTop: band * height,
      }}
    >
      <div
        style={{
          transform: `translateY(-50%) scale(${scale})`,
          fontFamily: FONT_FAMILY,
          fontSize: 150,
          lineHeight: 1,
          letterSpacing: 2,
          color: 'white',
          textAlign: 'center',
          textTransform: 'uppercase',
          textShadow: '0 8px 32px rgba(0,0,0,0.75)',
          padding: '0 80px',
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

export const Short: React.FC<z.infer<typeof shortSchema>> = ({source, cards}) => {
  const {fps} = useVideoConfig();

  return (
    <AbsoluteFill style={{backgroundColor: 'black'}}>
      {source ? <Video src={staticFile(source)} /> : null}
      {cards.map((card, i) => (
        <Sequence
          key={`${card.from}-${i}`}
          from={Math.round(card.from * fps)}
          durationInFrames={Math.max(1, Math.round((card.to - card.from) * fps))}
        >
          <Card {...card} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
