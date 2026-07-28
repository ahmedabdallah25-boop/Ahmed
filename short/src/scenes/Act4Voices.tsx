import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, FONT, STAGE} from '../theme';
import {useRise} from '../components/Ui';

type Voice = {at: number; who: string; line: string; accent: string; side: 'l' | 'r'};

/** Each card carries only wording the narration itself uses. */
const VOICES: Voice[] = [
  {at: 970, who: 'Friends', line: '“have opinions now”', accent: C.olive, side: 'l'},
  {at: 1060, who: 'Brother-in-law', line: '“you’ve been sold a story”', accent: C.gold, side: 'r'},
  {at: 1164, who: 'Father', line: '“somewhere safe?”', accent: C.rust, side: 'l'},
];

const Bubble: React.FC<{v: Voice}> = ({v}) => {
  const frame = useCurrentFrame();
  const r = useRise(v.at, 24, 13);
  // older cards settle back as newer ones arrive
  const newer = VOICES.filter((o) => o.at > v.at && frame >= o.at).length;
  const recede = interpolate(newer, [0, 2], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <div
      style={{
        alignSelf: v.side === 'l' ? 'flex-start' : 'flex-end',
        maxWidth: 810,
        opacity: Math.min(1, r * 1.6) * (1 - recede * 0.5),
        transform: `translateX(${interpolate(r, [0, 1], [v.side === 'l' ? -70 : 70, 0])}px)
                    scale(${interpolate(r, [0, 1], [0.88, 1]) * (1 - recede * 0.07)})`,
        transformOrigin: v.side === 'l' ? 'left center' : 'right center',
      }}
    >
      <div
        style={{
          background: C.paperLift,
          border: `3px solid ${C.ink}`,
          borderRadius: 34,
          borderBottomLeftRadius: v.side === 'l' ? 8 : 34,
          borderBottomRightRadius: v.side === 'r' ? 8 : 34,
          padding: '26px 40px 30px',
          boxShadow: `0 14px 0 -4px ${v.accent}, 0 28px 44px rgba(23,21,15,0.16)`,
        }}
      >
        <div
          style={{
            fontFamily: FONT.ui,
            fontWeight: 800,
            fontSize: 26,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: v.accent,
            marginBottom: 10,
          }}
        >
          {v.who}
        </div>
        <div
          style={{
            fontFamily: FONT.ui,
            fontWeight: 700,
            fontSize: 58,
            lineHeight: 1.12,
            color: C.ink,
            letterSpacing: -1.5,
          }}
        >
          {v.line}
        </div>
      </div>
    </div>
  );
};

export const Act4Voices: React.FC = () => {
  const frame = useCurrentFrame();
  // pressure builds as the third voice lands
  const heat = interpolate(frame, [966, 1180], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const alpha = Math.round(heat * 36)
    .toString(16)
    .padStart(2, '0');

  return (
    <>
      <AbsoluteFill
        style={{
          top: -STAGE.top,
          height: 1920,
          background: `radial-gradient(56% 30% at 50% 46%, ${C.rust}${alpha} 0%, transparent 72%)`,
        }}
      />
      <div
        style={{
          width: STAGE.width,
          display: 'flex',
          flexDirection: 'column',
          gap: 34,
        }}
      >
        {VOICES.map((v) => (
          <Bubble key={v.who} v={v} />
        ))}
      </div>
    </>
  );
};
