import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, STAGE} from '../theme';
import {useRise} from '../components/Ui';

type Voice = {at: number; who: string; line: string; accent: string; side: 'l' | 'r'};

/** Each card carries only wording the narration itself uses. */
const VOICES: Voice[] = [
  {at: 970, who: 'Friends', line: '“have opinions now”', accent: C.cool, side: 'l'},
  {at: 1060, who: 'Brother-in-law', line: '“you’ve been sold a story”', accent: C.live, side: 'r'},
  {at: 1164, who: 'Father', line: '“somewhere safe?”', accent: C.loss, side: 'l'},
];

const Card: React.FC<{v: Voice}> = ({v}) => {
  const frame = useCurrentFrame();
  const r = useRise(v.at, 24, 14);
  // older cards settle back as newer ones arrive
  const newer = VOICES.filter((o) => o.at > v.at && frame >= o.at).length;
  const recede = interpolate(newer, [0, 2], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <div
      style={{
        alignSelf: v.side === 'l' ? 'flex-start' : 'flex-end',
        maxWidth: 820,
        opacity: Math.min(1, r * 1.6) * (1 - recede * 0.55),
        transform: `translateX(${interpolate(r, [0, 1], [v.side === 'l' ? -70 : 70, 0])}px)
                    scale(${interpolate(r, [0, 1], [0.9, 1]) * (1 - recede * 0.07)})`,
        transformOrigin: v.side === 'l' ? 'left center' : 'right center',
      }}
    >
      <div
        style={{
          position: 'relative',
          background: `${C.surface}EE`,
          border: `2px solid ${v.accent}44`,
          [v.side === 'l' ? 'borderLeft' : 'borderRight']: `6px solid ${v.accent}`,
          padding: '24px 36px 28px',
          boxShadow: `0 20px 56px rgba(0,0,0,0.5)`,
        }}
      >
        <div
          style={{
            fontFamily: FONT.mono,
            fontWeight: 700,
            fontSize: 25,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: v.accent,
            marginBottom: 12,
          }}
        >
          {v.who}
        </div>
        <div
          style={{
            fontFamily: FONT.display,
            fontSize: 50,
            lineHeight: 1.16,
            color: C.text,
            letterSpacing: -1,
          }}
        >
          {v.line}
        </div>
      </div>
    </div>
  );
};

export const Act4Voices: React.FC = () => {
  return (
    <div
      style={{
        width: STAGE.width,
        display: 'flex',
        flexDirection: 'column',
        gap: 36,
      }}
    >
      {VOICES.map((v) => (
        <Card key={v.who} v={v} />
      ))}
    </div>
  );
};
