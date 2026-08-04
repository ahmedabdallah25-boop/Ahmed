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
import {Figure} from './Graphics';
import {SHOTS, Shot, TOTAL_FRAMES} from './timing';

// ─────────────────────────────────────────────────────────────────────────────
// Klarna — 1080x1920, 30fps, 51.0s.
//
// This is the opposite job to src/inflation/. There the footage was a finished
// cut and the overlay's whole task was to keep out of its way. Here the supplied
// .mov is sixteen *static* stills held a flat 3.00s each — measured, mean
// intra-clip pixel delta ~0.3/255 — so there is no cut to respect and no motion
// to avoid fighting. All of the movement in this film is made here.
//
// Which is exactly what the image pack assumes: it specifies 16 stills and gives
// each one a MOVE (total travel, eased out), because "a 6.53s static frame in a
// Short is a scroll". Those moves are implemented in Frame below, one per shot,
// with the pack's own numbers.
//
// WHY REMOTION AND NOT HYPERFRAMES. Both are in this repo. HyperFrames renders
// hosted HTML projects and is the right tool when the deliverable is a shareable
// project someone edits in a browser; its MCP compose/render tools are also
// disabled for local CLI agents, so a build here could not drive it end to end.
// This deliverable is a file — a 1080x1920 mp4 that has to be frame-exact against
// a re-cut voiceover, reproducible from a script, and diffable in git. That is
// Remotion's job, it is what src/inflation/ already does with supplied footage,
// and the pack's own WIRING note says to drive these stills "the way src/inflation/
// drives its stills". So: Remotion.
//
// Layer order, bottom to top: still, grade, legibility scrim, caption, figure,
// progress hairline.
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
 * The still, moving. Scale starts from a base that covers the canvas (the source
 * is 1072x1920 against 1080x1920) plus whatever margin this shot's drift needs,
 * so a drift never exposes an edge.
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
      {/* Grade. Every frame carries a warm amber accent except F06B, which the
          pack keeps deliberately cold — the temperature break is the sting, so
          the warm pass is switched off there and a cold one takes its place. */}
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

/**
 * Captions sit in the top third, in the dark headroom every prompt in the pack
 * reserved for them ("subject in the lower two-thirds, dark open headroom above
 * for captions"). Lines arrive one at a time across the shot's speech window, so
 * a long hold still has something changing on it — which is what stops the five
 * shots that run past 3.3s from reading as a frozen frame.
 */
const Caption: React.FC<{shot: Shot}> = ({shot}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const lines = shot.cap.split('\n');
  const [sIn, sOut] = shot.speech;
  const start = Math.max(0, sIn - shot.from - 4);
  const window = Math.max(12, (sOut - sIn) * 0.55);
  const step = lines.length > 1 ? window / lines.length : 0;

  return (
    <AbsoluteFill style={{padding: '250px 76px 0', alignItems: 'center'}}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center'}}>
        {lines.map((line, i) => {
          const at = start + i * step;
          const s = spring({frame: frame - at, fps, config: {damping: 200, mass: 0.6}});
          return (
            <span
              key={i}
              style={{
                fontFamily: FONT,
                fontSize: lines.length > 2 ? 74 : 82,
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
        })}
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
const Progress: React.FC = () => {
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

export const Klarna: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: P.ink}}>
    <Audio src={staticFile('klarna-vo.m4a')} />
    {SHOTS.map((shot) => (
      <Sequence key={shot.id} from={shot.from} durationInFrames={shot.durationInFrames}>
        <Frame shot={shot} />
        <Scrim />
        <Caption shot={shot} />
        {shot.num ? (
          <AbsoluteFill style={{paddingTop: shot.figureY, alignItems: 'center'}}>
            <Figure num={shot.num} at={Math.max(0, shot.speech[0] - shot.from + 6)} />
          </AbsoluteFill>
        ) : null}
      </Sequence>
    ))}
    <Progress />
  </AbsoluteFill>
);

export const KLARNA_DURATION = TOTAL_FRAMES;
