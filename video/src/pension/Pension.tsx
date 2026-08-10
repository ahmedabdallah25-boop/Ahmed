import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {EndCard, PhraseBlock, ProgressRule, StepTrack} from './graphics';
import {FONT, P, SAFE_X} from './palette';
import {Scene, SCENES} from './timeline';

const Still: React.FC<{scene: Scene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const dur = scene.durationInFrames;

  // A slow push, direction alternating by scene, so consecutive stills do not
  // drift the same way and the sequence never feels like a slideshow. Kept
  // small: flat vector art shows its edges if you scale it hard.
  const progress = interpolate(frame, [0, Math.max(dur - 1, 1)], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const push = 1.015 + progress * 0.042;
  const drift = (scene.n % 2 === 0 ? 1 : -1) * progress * 14;

  // The cut itself: a fast settle rather than a dissolve. The stills carry hard
  // cuts on the voice, and a crossfade would blur exactly the beat they land on.
  const settle = interpolate(frame, [0, 5], [0.985, 1], {extrapolateRight: 'clamp'});
  const fade = interpolate(frame, [0, 3], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{backgroundColor: P.cream, opacity: fade}}>
      <Img
        src={staticFile(`scenes/${scene.still}`)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${push * settle}) translateY(${drift}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

const Captions: React.FC<{scene: Scene}> = ({scene}) => {
  const dur = scene.durationInFrames;

  // One phrase at a time. CAPTION 1 holds the first part of the spoken line and
  // CAPTION 2 takes over for the second, so a block changes roughly every 1.5s
  // on the average scene — the cadence the reference cuts at.
  const swap = scene.cap2 ? Math.round(dur * 0.46) : dur;

  // The band is this scene's own: it stops short of where the subject actually
  // begins in this still, measured by scripts/measure-headroom.py.
  const TOP_MARGIN = 64;
  const band = scene.capBottom;
  const budgetH = Math.max(180, band - TOP_MARGIN);

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: SAFE_X,
        paddingRight: SAFE_X,
      }}
    >
      <div
        style={{
          height: band,
          paddingTop: TOP_MARGIN,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <PhraseBlock text={scene.cap1} start={0} end={swap} color={P.ink} budgetH={budgetH} />
        {scene.cap2 ? (
          <PhraseBlock text={scene.cap2} start={swap} end={dur} color={P.ink} budgetH={budgetH} />
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

const Shot: React.FC<{scene: Scene}> = ({scene}) => (
  <AbsoluteFill>
    <Still scene={scene} />
    {/* The reference sets its type naked over the picture, and on this cream
        ground that mostly works already. This is only insurance: a gradient of
        the background colour itself, invisible where the art is empty, enough
        to hold the ink legible if a pushed-in still creeps up under a phrase.
        It is not a caption box — there is no edge to see. */}
    <AbsoluteFill
      style={{
        background: `linear-gradient(to bottom, ${P.cream}CC 0%, ${P.cream}66 22%, ${P.cream}00 38%)`,
      }}
    />
    {scene.cap1 ? <Captions scene={scene} /> : <EndCard line={scene.vo} />}
  </AbsoluteFill>
);

export const Pension: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: P.cream, fontFamily: FONT}}>
    <Audio src={staticFile('vo-pension.mp3')} />
    {SCENES.map((scene) => (
      <Sequence
        key={scene.n}
        from={scene.from}
        durationInFrames={scene.durationInFrames}
        name={`S${String(scene.n).padStart(2, '0')} ${scene.cap1 || 'outro'}`}
      >
        <Shot scene={scene} />
      </Sequence>
    ))}
    <StepTrack />
    <ProgressRule />
  </AbsoluteFill>
);
