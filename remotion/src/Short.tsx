import React from 'react';
import {
  AbsoluteFill,
  cancelRender,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {loadFont} from '@remotion/fonts';

// Bundled locally (public/fonts) rather than pulled from Google Fonts, so a
// render never depends on network access. Same face the burned-in captions in
// automation/cinematic_captions.py use.
const fontFamily = 'Bebas Neue';

loadFont({
  family: fontFamily,
  url: staticFile('fonts/BebasNeue-Regular.woff2'),
  weight: '400',
}).catch((err) => cancelRender(err));

export type Card = {
  /** Caption text. Rendered ALL-CAPS, 1-3 words per card reads best. */
  text: string;
  /** How long this card stays on screen, in seconds. */
  seconds: number;
};

export type ShortProps = {
  cards: Card[];
  /** Small always-on label in the lower third. */
  brand: string;
  accent: string;
};

export const defaultShortProps: ShortProps = {
  brand: 'Finance % Decoded',
  accent: '#f5c542',
  cards: [
    {text: 'Your savings', seconds: 1.2},
    {text: 'are shrinking', seconds: 1.2},
    {text: 'while you sleep', seconds: 1.6},
    {text: "Here's why", seconds: 1.4},
  ],
};

/** Total composition length for a given card list, in frames. */
export const durationInFrames = (cards: Card[], fps: number) =>
  Math.max(1, Math.round(cards.reduce((sum, c) => sum + c.seconds, 0) * fps));

const Background: React.FC<{accent: string}> = ({accent}) => {
  const frame = useCurrentFrame();
  const {durationInFrames: total} = useVideoConfig();
  // Slow push-in so a static background never reads as a freeze-frame.
  const scale = interpolate(frame, [0, total], [1, 1.12]);

  return (
    <AbsoluteFill style={{backgroundColor: '#07090d'}}>
      <AbsoluteFill
        style={{
          transform: `scale(${scale})`,
          background:
            `radial-gradient(circle at 50% 32%, ${accent}26 0%, transparent 55%),` +
            'linear-gradient(160deg, #101725 0%, #07090d 60%, #0d1017 100%)',
        }}
      />
    </AbsoluteFill>
  );
};

const CaptionCard: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  // Hard cut in, tiny settle — matches the burned-in caption style in automation/.
  const settle = spring({frame, fps, config: {damping: 200}, durationInFrames: 8});
  const scale = interpolate(settle, [0, 1], [0.94, 1]);

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0 90px',
      }}
    >
      <h1
        style={{
          fontFamily,
          fontSize: 150,
          lineHeight: 1.02,
          letterSpacing: 2,
          margin: 0,
          color: 'white',
          textAlign: 'center',
          textTransform: 'uppercase',
          textShadow: '0 12px 40px rgba(0,0,0,0.85)',
          transform: `scale(${scale})`,
        }}
      >
        {text}
      </h1>
    </AbsoluteFill>
  );
};

const Brand: React.FC<{brand: string; accent: string}> = ({brand, accent}) => (
  <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 190}}>
    <div
      style={{
        fontFamily,
        fontSize: 44,
        letterSpacing: 6,
        textTransform: 'uppercase',
        color: accent,
        opacity: 0.9,
      }}
    >
      {brand}
    </div>
  </AbsoluteFill>
);

const ProgressBar: React.FC<{accent: string}> = ({accent}) => {
  const frame = useCurrentFrame();
  const {durationInFrames: total} = useVideoConfig();
  const pct = interpolate(frame, [0, total - 1], [0, 100], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{justifyContent: 'flex-end'}}>
      <div style={{height: 10, width: `${pct}%`, backgroundColor: accent}} />
    </AbsoluteFill>
  );
};

export const Short: React.FC<ShortProps> = ({cards, brand, accent}) => {
  const {fps} = useVideoConfig();
  let from = 0;

  return (
    <AbsoluteFill>
      <Background accent={accent} />
      {cards.map((card, i) => {
        const length = Math.max(1, Math.round(card.seconds * fps));
        const sequence = (
          <Sequence key={`${card.text}-${i}`} from={from} durationInFrames={length}>
            <CaptionCard text={card.text} />
          </Sequence>
        );
        from += length;
        return sequence;
      })}
      <Brand brand={brand} accent={accent} />
      <ProgressBar accent={accent} />
    </AbsoluteFill>
  );
};
