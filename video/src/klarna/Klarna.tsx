import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {FONT} from '../theme';
import {Card} from './Cards';
import {Figure} from './Graphics';
import {SHOTS, Shot, TOTAL_FRAMES} from './timing';

// ─────────────────────────────────────────────────────────────────────────────
// Klarna — 1080x1920, 30fps, 2:53.
//
// The supplied .mov is sixteen static stills held a flat 3.00s each — 48.0s of
// picture, then 125.2s of black — under the full 173.28s long-form voiceover.
// Measured: sixteen hard cuts at exactly 3.0s, blackdetect from 48.04s, mean
// intra-clip pixel delta ~0.3/255.
//
// So this composition does two jobs at once, and they are genuinely different:
//
//   1. THE STILLS MOVE. Nothing in the source moves, which makes the image pack's
//      MOVE column load-bearing rather than decorative. Every push, drift and rise
//      is applied here, including F08's specified dead still.
//   2. THE GAP IS FILLED. Where the film has no photograph — most of 86s-139s, the
//      "so is it halal / ask three questions" argument — a motion-graphic card
//      carries it instead. See ./Cards.tsx for why those are type and not more
//      still life.
//
// WHY REMOTION AND NOT HYPERFRAMES. Both are in this repo. HyperFrames renders
// hosted HTML projects and is right when the deliverable is a shareable project
// edited in a browser; its MCP compose/render tools are also disabled for local
// CLI agents, so a scripted build could not drive it end to end. This deliverable
// is a file that has to stay frame-exact against a fixed voiceover, rebuild from a
// script, and diff in git — and the pack's own WIRING note says to drive these
// stills the way src/inflation/ drives its stills.
//
// Layer order, bottom to top: still or card, grade, scrim, caption, figure, rail.
// ─────────────────────────────────────────────────────────────────────────────

const P = {
  cream: '#E8DCC8',
  terracotta: '#E85F42',
  ink: '#05070A',
};

/** Eased-out travel: most of the move happens early, then it settles. */
const ease = (frame: number, dur: number) =>
  interpolate(frame, [0, dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

/**
 * A still, moving. The base scale covers the canvas (the source is 1072x1920
 * against 1080x1920) plus whatever margin this shot's drift needs, so a drift
 * never exposes an edge.
 */
const Frame: React.FC<{shot: Shot}> = ({shot}) => {
  const frame = useCurrentFrame();
  const {push = 0, dx = 0, dy = 0} = shot.move;
  const t = ease(frame, shot.durationInFrames);

  const base = Math.max(1.008, 1 + (2 * Math.abs(dx)) / 1080, 1 + (2 * Math.abs(dy)) / 1920) + 0.004;
  // A negative push is the pack's "pull back": start in, arrive at rest.
  const zoom = push >= 0 ? 1 + push * t : 1 + Math.abs(push) * (1 - t);

  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: P.ink}}>
      <Img
        src={staticFile(`broll/klarna/klarna-${String(shot.still).padStart(2, '0')}.jpg`)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${(base * zoom).toFixed(4)}) translate(${(dx * t).toFixed(2)}px, ${(
            dy * t
          ).toFixed(2)}px)`,
        }}
      />
      {/* Grade. Warm amber on every frame except the late-fee pair, which the pack
          keeps deliberately cold — the temperature break is the sting, so the warm
          pass is switched off there and a cold one takes its place. */}
      <AbsoluteFill
        style={{
          background: shot.cold
            ? 'radial-gradient(58% 42% at 50% 62%, rgba(120,170,220,0.16), rgba(4,10,18,0.42) 70%)'
            : 'radial-gradient(64% 46% at 50% 64%, rgba(232,140,66,0.10), rgba(5,7,10,0.30) 72%)',
          mixBlendMode: 'soft-light',
        }}
      />
    </AbsoluteFill>
  );
};

const CaptionLine: React.FC<{line: string; at: number; size: number}> = ({line, at, size}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - at, fps, config: {damping: 200, mass: 0.6}});
  return (
    <span
      style={{
        fontFamily: FONT,
        fontSize: size,
        lineHeight: 1.08,
        fontWeight: 750,
        letterSpacing: -1.6,
        color: P.cream,
        textAlign: 'center',
        textWrap: 'balance',
        textShadow: '0 4px 34px rgba(0,0,0,0.72), 0 2px 8px rgba(0,0,0,0.6)',
        opacity: s,
        transform: `translateY(${interpolate(s, [0, 1], [22, 0]).toFixed(2)}px)`,
      }}
    >
      {line}
    </span>
  );
};

/**
 * Captions sit in the top third, in the dark headroom every prompt in the pack
 * reserved for them ("subject in the lower two-thirds, dark open headroom above
 * for captions"). Lines arrive one at a time, so a long hold still has something
 * changing on it.
 */
const Caption: React.FC<{shot: Shot}> = ({shot}) => {
  const lines = (shot.cap ?? '').split('\n');
  const step = Math.min(11, (shot.durationInFrames * 0.42) / Math.max(1, lines.length));
  return (
    <AbsoluteFill style={{padding: '250px 76px 0', alignItems: 'center'}}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center'}}>
        {lines.map((line, i) => (
          <CaptionLine key={i} line={line} at={3 + i * step} size={lines.length > 2 ? 74 : 82} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Scrim: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        'linear-gradient(180deg, rgba(5,7,10,0.80) 0%, rgba(5,7,10,0.52) 26%, rgba(5,7,10,0) 46%)',
    }}
  />
);

/** A hairline that fills across the film. Cheap, and it reads as "nearly done". */
const Rail: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end'}}>
      <div style={{height: 5, background: 'rgba(232,220,200,0.14)'}}>
        <div
          style={{
            height: '100%',
            width: `${((frame / TOTAL_FRAMES) * 100).toFixed(2)}%`,
            background: P.terracotta,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

const Shot: React.FC<{shot: Shot}> = ({shot}) => (
  <>
    {shot.card ? (
      <Card c={shot.card} dur={shot.durationInFrames} />
    ) : (
      <>
        <Frame shot={shot} />
        <Scrim />
      </>
    )}
    {shot.cap ? <Caption shot={shot} /> : null}
    {shot.num ? (
      <AbsoluteFill style={{paddingTop: shot.figureY, alignItems: 'center'}}>
        <Figure num={shot.num} at={8} />
      </AbsoluteFill>
    ) : null}
  </>
);

export const Klarna: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: P.ink}}>
    <Audio src={staticFile('klarna-vo.m4a')} />
    {SHOTS.map((shot, i) => (
      <Sequence key={i} from={shot.from} durationInFrames={shot.durationInFrames}>
        <Shot shot={shot} />
      </Sequence>
    ))}
    <Rail />
  </AbsoluteFill>
);

export const KLARNA_DURATION = TOTAL_FRAMES;
