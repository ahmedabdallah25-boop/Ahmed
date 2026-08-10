import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {DrawRule, EndCard, KineticLine, ProgressRule, StepTrack} from './graphics';
import {accentFor, CAPTION_TOP, FONT, P, SAFE_X} from './palette';
import {Scene, SCENES} from './timeline';

const TEXT_WIDTH = 1080 - SAFE_X * 2;

// One size per scene, chosen from whichever of its two caption lines is longer,
// so the pair reads as one block instead of two unrelated sizes.
const sizeFor = (scene: Scene): number => {
  const longest = Math.max(scene.cap1.length, scene.cap2.length, 1);
  return Math.round(Math.max(46, Math.min(80, TEXT_WIDTH / longest / 0.55)));
};

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
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dur = scene.durationInFrames;
  const size = sizeFor(scene);
  const accent = accentFor(scene.tag);

  // Line one lands with the cut; line two lands with the second half of the
  // spoken phrase, which is what the pack's CAPTION 2 always is.
  const cap1Start = 2;
  const words1 = scene.cap1.split(' ').length;
  const cap2Start = Math.max(Math.round(dur * 0.42), cap1Start + words1 * 2 + 4);
  const stagger = dur < 40 ? 1 : 2;

  // The rule is reserved for the turns the voice actually marks.
  const ruled = scene.tag === 'emphatic' || scene.tag === 'warmly';
  const ruleWidth = Math.min(TEXT_WIDTH * 0.5, scene.cap2.length * size * 0.42);

  const exit = interpolate(frame, [dur - 4, dur], [1, 0.92], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: 'center',
        paddingTop: CAPTION_TOP,
        paddingLeft: SAFE_X,
        paddingRight: SAFE_X,
      }}
    >
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: exit}}>
        <KineticLine
          text={scene.cap1}
          start={cap1Start}
          size={size}
          color={P.ink}
          stagger={stagger}
        />
        {scene.cap2 ? (
          <div style={{marginTop: size * 0.16, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <KineticLine
              text={scene.cap2}
              start={cap2Start}
              size={size}
              color={accent}
              stagger={stagger}
            />
            {ruled ? (
              <DrawRule start={cap2Start + 4} color={accent} width={ruleWidth} />
            ) : null}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

const Shot: React.FC<{scene: Scene}> = ({scene}) => (
  <AbsoluteFill>
    <Still scene={scene} />
    {/* A whisper of a scrim. The art already leaves the top clear, so this is
        insurance for the few frames a pushed-in still creeps upward. */}
    <AbsoluteFill
      style={{
        background: `linear-gradient(to bottom, ${P.cream}E6 0%, ${P.cream}B0 26%, ${P.cream}00 48%)`,
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
