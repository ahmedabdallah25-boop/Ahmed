import React from 'react';
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {FONT} from '../theme';
import {L} from '../longform/ui';
import {money} from '../motion';
import {BEATS, Beat, beatWindow} from './beats';
import {Captions} from './Captions';
import {SOURCE_FRAMES} from './cuts';
import {
  Beat as BeatWrap,
  Callout,
  CountCard,
  PowerBar,
  Progress,
  StatCard,
  Tag,
} from './graphics';

// ─────────────────────────────────────────────────────────────────────────────
// Inflation — 1080x1920, 24fps, 100s.
//
// The footage is the film. It arrived as a finished run of AI-generated 3-5s
// scenes with its own hard cuts, and nothing here re-times, re-cuts, or
// transitions it: no dissolves laid over its cuts, no push-in fighting its own
// motion. The overlay's whole job is to land *with* the picture. Every graphic
// and every caption change is keyed to a frame in ./cuts.ts, which is where the
// footage already changes shot.
//
// Layer order, bottom to top: footage, legibility scrim, graphic beats,
// captions, progress hairline.
// ─────────────────────────────────────────────────────────────────────────────

const fmt = {
  pct: (n: number) => `${n.toFixed(0)}%`,
  gbp: (n: number) => money(n),
  plain: (n: number) => n.toFixed(1),
};

const BeatBody: React.FC<{beat: Beat}> = ({beat}) => {
  switch (beat.kind) {
    case 'tag':
      return <Tag text={beat.text} color={beat.color} />;
    case 'stat':
      return (
        <StatCard
          label={beat.label}
          value={beat.value}
          sub={beat.sub}
          accent={beat.accent}
        />
      );
    case 'count':
      return (
        <CountCard
          label={beat.label}
          from={beat.from}
          to={beat.to}
          accent={beat.accent}
          sub={beat.sub}
          format={fmt[beat.format]}
        />
      );
    case 'bar':
      return (
        <PowerBar
          label={beat.label}
          from={beat.from}
          to={beat.to}
          accent={beat.accent}
          caption={beat.caption}
        />
      );
    case 'callout':
      return (
        <Callout
          text={beat.text}
          accent={beat.accent}
          dir={beat.dir}
          run={beat.run}
          drop={beat.drop}
        />
      );
  }
};

/** Positions a beat by its anchor, then hands off to the seam wrapper. */
const PlacedBeat: React.FC<{beat: Beat; dur: number}> = ({beat, dur}) => {
  const {x, y, align = 'center'} = beat.anchor;
  const shift =
    align === 'left'
      ? '0, -50%'
      : align === 'right'
        ? '-100%, -50%'
        : // 'anchor' means the element positions itself from this exact point
          // rather than being centred on it — what a callout's dot needs.
          align === 'anchor'
          ? '0, 0'
          : '-50%, -50%';
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: `${x * 100}%`,
          top: `${y * 100}%`,
          transform: `translate(${shift})`,
        }}
      >
        <BeatWrap dur={dur} entry={beat.entry} exit={beat.exit}>
          <BeatBody beat={beat} />
        </BeatWrap>
      </div>
    </AbsoluteFill>
  );
};

export const Inflation: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  return (
    <AbsoluteFill style={{background: L.bg, fontFamily: FONT}}>
      <OffthreadVideo
        src={staticFile('inflation.mp4')}
        // The source is 1072x1920 against a 1080x1920 canvas — a hair narrower.
        // `cover` keeps the aspect and trims a few pixels top and bottom rather
        // than stretching the frame to fit.
        style={{width: '100%', height: '100%', objectFit: 'cover'}}
      />

      {/* Legibility scrim. Very light — the per-caption scrim does the real
          work; this only stops type at the extreme top or bottom of frame from
          sitting on a bright sky or a pale wall. */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(to bottom, rgba(4,6,9,0.40) 0%, rgba(4,6,9,0) 22%, rgba(4,6,9,0) 74%, rgba(4,6,9,0.45) 100%)',
          pointerEvents: 'none',
        }}
      />

      {BEATS.map((beat, i) => {
        const {from, dur} = beatWindow(beat);
        return (
          <Sequence
            key={i}
            from={from}
            durationInFrames={dur}
            name={`beat ${i} · ${beat.kind} · scene ${beat.scene}`}
          >
            <PlacedBeat beat={beat} dur={dur} />
          </Sequence>
        );
      })}

      <Captions />

      <Progress progress={frame / durationInFrames} />
    </AbsoluteFill>
  );
};

export const INFLATION_DURATION = SOURCE_FRAMES;
