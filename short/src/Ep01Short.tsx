import React from 'react';
import {AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {C, STAGE, loadFonts} from './theme';
import {Paper} from './components/Paper';
import {Chrome, type Chapter} from './components/Chrome';
import {Kinetic} from './components/Kinetic';
import {SCRIPT} from './data/script';
import {Act1Crash} from './scenes/Act1Crash';
import {Act2Gap} from './scenes/Act2Gap';
import {Act3Fork} from './scenes/Act3Fork';
import {Act4Voices} from './scenes/Act4Voices';
import {Act5Adam} from './scenes/Act5Adam';
import {Act6SellHere} from './scenes/Act6SellHere';

loadFonts();

const ACTS = [
  {from: 0, to: 405, Comp: Act1Crash},
  {from: 405, to: 776, Comp: Act2Gap},
  {from: 776, to: 960, Comp: Act3Fork},
  {from: 960, to: 1312, Comp: Act4Voices},
  {from: 1312, to: 1566, Comp: Act5Adam},
  {from: 1566, to: 1800, Comp: Act6SellHere},
];

const CHAPTERS: Chapter[] = [
  {from: 0, label: 'Year 2 · The Crash'},
  {from: 405, label: 'The Real Gap'},
  {from: 776, label: 'The Moment'},
  {from: 960, label: 'The Noise'},
  {from: 1312, label: 'Adam Is Ahead'},
  {from: 1566, label: 'The Sell Button'},
];

const FADE = 11;

/** Cross-fades the act's graphics in and out at its boundaries. */
const ActLayer: React.FC<{from: number; to: number; children: React.ReactNode}> = ({
  from,
  to,
  children,
}) => {
  const frame = useCurrentFrame();
  if (frame < from - FADE || frame > to + FADE) {
    return null;
  }
  const opacity =
    interpolate(frame, [from - FADE, from + 2], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }) *
    interpolate(frame, [to - FADE, to], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  const drift = interpolate(frame, [to - FADE, to], [0, -34], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill
      style={{
        top: STAGE.top,
        height: STAGE.height,
        opacity,
        transform: `translateY(${drift}px)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** A one-frame-ish paper flash on the hardest beats. */
const BeatFlash: React.FC = () => {
  const frame = useCurrentFrame();
  const beats = SCRIPT.filter((p) => p.style === 'alarm').map((p) => p.s);
  const near = beats.find((b) => frame >= b && frame < b + 7);
  if (near === undefined) {
    return null;
  }
  const o = interpolate(frame, [near, near + 6], [0.3, 0], {extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{background: C.paperLift, opacity: o}} />;
};

export const Ep01Short: React.FC = () => {
  const frame = useCurrentFrame();
  const phrase = SCRIPT.find((p) => frame >= p.s && frame <= p.e);

  return (
    <AbsoluteFill style={{backgroundColor: C.paper}}>
      <Audio src={staticFile('audio.wav')} />

      <Paper />

      {ACTS.map(({from, to, Comp}) => (
        <ActLayer key={from} from={from} to={to}>
          <Comp />
        </ActLayer>
      ))}

      <BeatFlash />

      {/* the kinetic caption block owns the lower third */}
      <AbsoluteFill
        style={{
          top: 1110,
          height: 400,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {phrase ? <Kinetic key={phrase.s} phrase={phrase} /> : null}
      </AbsoluteFill>

      <Chrome chapters={CHAPTERS} />
    </AbsoluteFill>
  );
};
