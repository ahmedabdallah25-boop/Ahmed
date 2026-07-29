import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {FONT} from '../theme';
import {S1, S10, S11, S12, S13, S2, S3, S4, S5, S6, S7, S8, S9} from './scenes';
import {CHAPTERS, CUTS} from './timing';
import {L, ease} from './ui';

const SCENES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13];

/** Chapter lower-third — names the section, then gets out of the way. */
const ChapterCard: React.FC<{label: string; n: number}> = ({label, n}) => {
  const frame = useCurrentFrame();
  const inp = ease(frame, 6, 14);
  const out = ease(frame, 96, 14);
  const opacity = inp * (1 - out);
  if (opacity <= 0.001) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: 128,
        bottom: 96,
        opacity,
        transform: `translateX(${(1 - inp) * -20}px)`,
        display: 'flex',
        alignItems: 'center',
        gap: 20,
      }}
    >
      <div style={{width: 6, height: 54, background: L.gold}} />
      <div>
        <div style={{fontSize: 22, letterSpacing: 5, color: L.gold, fontWeight: 700}}>
          CHAPTER {n}
        </div>
        <div style={{fontSize: 34, fontWeight: 700, color: L.ink}}>{label}</div>
      </div>
    </div>
  );
};

export const Longform: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const grain = interpolate(frame % 90, [0, 90], [0, 1]);
  return (
    <AbsoluteFill style={{background: L.bg, fontFamily: FONT}}>
      <Audio src={staticFile('vo-ep2.mp3')} />

      {/* Ground plane: a fixed grid + vignette so every scene sits in one room. */}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${L.ink}08 1px, transparent 1px), linear-gradient(90deg, ${L.ink}08 1px, transparent 1px)`,
          backgroundSize: '120px 120px',
          opacity: 0.9 + grain * 0.05,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(110% 75% at 50% 40%, transparent 40%, ${L.bg} 100%)`,
        }}
      />

      {SCENES.map((S, i) => {
        const from = Math.round(CUTS[i] * fps);
        const dur = Math.round(CUTS[i + 1] * fps) - from;
        return (
          <Sequence key={i} from={from} durationInFrames={dur} name={CHAPTERS[i]}>
            <S dur={dur} />
            <ChapterCard label={CHAPTERS[i]} n={i + 1} />
          </Sequence>
        );
      })}

      {/* Progress hairline — the only element that survives every cut. */}
      <AbsoluteFill style={{justifyContent: 'flex-end'}}>
        <div style={{height: 5, background: '#FFFFFF10'}}>
          <div
            style={{
              height: 5,
              width: `${(frame / durationInFrames) * 100}%`,
              background: L.gold,
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
