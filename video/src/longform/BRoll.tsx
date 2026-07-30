import React from 'react';
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {SHOTS, BRollShot} from './broll';
import {L, ease} from './ui';

/** One still: fades up, pushes in 5%, fades out. Never holds still. */
const Shot: React.FC<{shot: BRollShot; dur: number}> = ({shot, dur}) => {
  const frame = useCurrentFrame();
  const fade = 14;
  const o =
    shot.opacity * ease(frame, 0, fade) * (1 - ease(frame, dur - fade, fade));
  const push = interpolate(frame, [0, dur], [1, 1.05], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{opacity: o}}>
      <Img
        src={staticFile(`broll/${shot.file}`)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${push})`,
        }}
      />
      {/* Scrim: keeps the type readable over the brighter parts of the frame. */}
      <AbsoluteFill
        style={{
          background:
            shot.mode === 'full'
              ? `linear-gradient(${L.bg}CC, ${L.bg}55 40%, ${L.bg}CC)`
              : `${L.bg}66`,
        }}
      />
    </AbsoluteFill>
  );
};

/** Sits above the ground plane and below every scene's type. */
export const BRoll: React.FC = () => {
  const {fps} = useVideoConfig();
  return (
    <>
      {SHOTS.map((shot, i) => {
        const from = Math.round(shot.at * fps);
        const dur = Math.round(shot.dur * fps);
        return (
          <Sequence key={i} from={from} durationInFrames={dur} name={`b-roll ${shot.file}`}>
            <Shot shot={shot} dur={dur} />
          </Sequence>
        );
      })}
    </>
  );
};
