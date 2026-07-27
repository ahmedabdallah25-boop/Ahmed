import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  OffthreadVideo,
  Sequence,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  getAudioDurationInSeconds,
  useAudioData,
  visualizeAudio,
} from '@remotion/media-utils';
import {z} from 'zod';
import {cardSchema} from './Short';
import {FONT_FAMILY} from './font';

export const FPS = 30;

export const voiceoverSchema = z.object({
  /** Audio file under public/, e.g. "hook.mp3". */
  audio: z.string(),
  /**
   * Caption cards. Left empty, calculateMetadata loads
   * public/<audio-stem>.timings.json, which automation/voiceover_timings.py writes.
   */
  cards: z.array(cardSchema).default([]),
  /** Optional b-roll under public/. Plays muted behind the captions. */
  broll: z.string().default(''),
  accent: z.string().default('#19c37d'),
  /** Bottom-corner watermark. Empty hides it. */
  handle: z.string().default('@Financeundoubtlydecoded'),
});

type VoiceoverProps = z.infer<typeof voiceoverSchema>;

const stemOf = (file: string) => file.replace(/\.[^./]+$/, '');

/**
 * Duration comes from the audio itself, so a re-recorded take needs no edits —
 * drop the new file in public/ and re-render.
 */
export const calculateVoiceoverMetadata = async ({props}: {props: VoiceoverProps}) => {
  let cards = props.cards;

  if (cards.length === 0) {
    const res = await fetch(staticFile(`${stemOf(props.audio)}.timings.json`));
    if (res.ok) {
      cards = (await res.json()).cards ?? [];
    }
  }

  const seconds = await getAudioDurationInSeconds(staticFile(props.audio));

  return {
    // A short tail so the last card and the audio don't cut on the same frame.
    durationInFrames: Math.ceil((seconds + 0.4) * FPS),
    props: {...props, cards},
  };
};

/**
 * Slow-drifting accent glow that breathes with the speaker's amplitude, over a
 * near-black bed. Keeps the frame alive under a talking-head-free voiceover
 * without competing with the captions.
 */
const Backdrop: React.FC<{audio: string; accent: string}> = ({audio, accent}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const audioData = useAudioData(staticFile(audio));

  // Mean energy of the low bands — loud syllables push the glow out.
  let energy = 0.35;
  if (audioData) {
    const bands = visualizeAudio({audioData, frame, fps, numberOfSamples: 16});
    energy = bands.slice(0, 6).reduce((a, b) => a + b, 0) / 6;
  }

  const pulse = interpolate(energy, [0, 0.4], [1, 1.35], {extrapolateRight: 'clamp'});
  const drift = frame / fps;
  const x = 50 + Math.sin(drift * 0.22) * 18;
  const y = 55 + Math.cos(drift * 0.17) * 14;

  return (
    <AbsoluteFill style={{backgroundColor: '#070b09'}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(${Math.round(46 * pulse)}% ${Math.round(
            30 * pulse,
          )}% at ${x}% ${y}%, ${accent}55 0%, ${accent}18 45%, transparent 72%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(38% 26% at ${100 - x}% ${
            100 - y
          }%, #f0b90b22 0%, transparent 70%)`,
        }}
      />
      {/* Static speckle, re-seeded every 4 frames — reads as grain, costs nothing. */}
      <AbsoluteFill style={{opacity: 0.05}}>
        {new Array(70).fill(0).map((_, i) => {
          const seed = `${i}-${Math.floor(frame / 4)}`;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: random(`x${seed}`) * width,
                top: random(`y${seed}`) * height,
                width: 3,
                height: 3,
                borderRadius: 3,
                backgroundColor: 'white',
              }}
            />
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(75% 55% at 50% 45%, transparent 40%, rgba(0,0,0,0.72) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};

/** One spoken chunk: hard cut in, 3-frame settle, no fade. */
const Card: React.FC<z.infer<typeof cardSchema> & {accent: string}> = ({
  text,
  band,
  accent,
}) => {
  const frame = useCurrentFrame();
  const {height} = useVideoConfig();

  const settle = interpolate(frame, [0, 3], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const scale = interpolate(settle, [0, 1], [1.08, 1]);
  const lift = interpolate(settle, [0, 1], [14, 0]);

  // A number or a currency figure is the payload of a finance line — accent it.
  const isFigure = /[\d%$£€]/.test(text);

  return (
    <AbsoluteFill
      // In px, not %: percentage padding resolves against width, which would put
      // every card at roughly half its intended height on a 9:16 frame.
      style={{justifyContent: 'flex-start', alignItems: 'center', paddingTop: band * height}}
    >
      <div
        style={{
          transform: `translateY(calc(-50% + ${lift}px)) scale(${scale})`,
          fontFamily: FONT_FAMILY,
          fontSize: 152,
          lineHeight: 0.95,
          letterSpacing: 2,
          color: isFigure ? accent : 'white',
          textAlign: 'center',
          textTransform: 'uppercase',
          textShadow: '0 10px 38px rgba(0,0,0,0.8)',
          padding: '0 70px',
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

/** Thin accent bar showing how much of the clip is left — cheap retention cue. */
const Progress: React.FC<{accent: string}> = ({accent}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  return (
    <AbsoluteFill style={{justifyContent: 'flex-end'}}>
      <div
        style={{
          height: 8,
          width: `${(frame / Math.max(1, durationInFrames - 1)) * 100}%`,
          backgroundColor: accent,
        }}
      />
    </AbsoluteFill>
  );
};

export const Voiceover: React.FC<VoiceoverProps> = ({
  audio,
  cards,
  broll,
  accent,
  handle,
}) => {
  const {fps} = useVideoConfig();

  return (
    <AbsoluteFill>
      {broll ? (
        <AbsoluteFill>
          <OffthreadVideo src={staticFile(broll)} muted style={{objectFit: 'cover'}} />
          <AbsoluteFill style={{backgroundColor: 'rgba(0,0,0,0.45)'}} />
        </AbsoluteFill>
      ) : (
        <Backdrop audio={audio} accent={accent} />
      )}

      <Audio src={staticFile(audio)} />

      {cards.map((card, i) => (
        <Sequence
          key={`${card.from}-${i}`}
          from={Math.round(card.from * fps)}
          durationInFrames={Math.max(1, Math.round((card.to - card.from) * fps))}
        >
          <Card {...card} accent={accent} />
        </Sequence>
      ))}

      {handle ? (
        <AbsoluteFill
          style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 56}}
        >
          <div
            style={{
              fontFamily: FONT_FAMILY,
              fontSize: 38,
              letterSpacing: 3,
              color: 'rgba(255,255,255,0.55)',
            }}
          >
            {handle}
          </div>
        </AbsoluteFill>
      ) : null}

      <Progress accent={accent} />
    </AbsoluteFill>
  );
};
