import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {FONT} from '../theme';
import {L} from '../longform/ui';
import {CUES, Cue} from './captions';
import {sceneAt} from './cuts';
import {CAPTION_MAX_WIDTH, ZONE_Y, zoneForScene} from './placement';

// ─────────────────────────────────────────────────────────────────────────────
// Captions.
//
// Cue-level, not word-level: see the note in ./captions.ts for why a karaoke
// sweep would be a guess here. Each cue arrives whole on a measured pause, one
// keyword carries the gold accent, and the block is placed into whichever third
// of the frame that scene actually leaves empty (./placement.ts).
// ─────────────────────────────────────────────────────────────────────────────

const IN = 6;
const OUT = 4;
const backOut = Easing.bezier(0.34, 1.56, 0.64, 1);

/** Splits a line so the keyword can be accented without losing the spacing. */
const parts = (text: string, keyword?: string) => {
  if (!keyword) return [{text, hit: false}];
  const i = text.toLowerCase().indexOf(keyword.toLowerCase());
  if (i === -1) return [{text, hit: false}];
  return [
    {text: text.slice(0, i), hit: false},
    {text: text.slice(i, i + keyword.length), hit: true},
    {text: text.slice(i + keyword.length), hit: false},
  ].filter((p) => p.text.length > 0);
};

const CaptionBlock: React.FC<{cue: Cue; local: number; dur: number; zoneY: number}> = ({
  cue,
  local,
  dur,
  zoneY,
}) => {
  const p = interpolate(local, [0, IN], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: backOut,
  });
  const fade = interpolate(local, [dur - OUT, dur], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = Math.min(
    interpolate(local, [0, IN * 0.6], [0, 1], {extrapolateRight: 'clamp'}),
    fade,
  );
  const blur = (1 - p) * 8;

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: `${zoneY * 100}%`,
        width: `${CAPTION_MAX_WIDTH * 100}%`,
        transform: `translate(-50%, -50%) translateY(${(1 - p) * 10}px) scale(${(
          0.94 +
          p * 0.06
        ).toFixed(4)})`,
        opacity,
        filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : undefined,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Scrim: sized to the block, not the frame, so the photograph stays
          visible everywhere the type is not.

          Deliberately weak, with a long falloff. A denser scrim reads fine over
          a busy supermarket shelf but shows up as a dark smudge on the flat
          skies this footage keeps cutting to. Legibility over the busy shots is
          carried by the text shadow below instead, which costs nothing on a
          clean background. */}
      <div
        style={{
          position: 'absolute',
          inset: '-96px -120px',
          background:
            'radial-gradient(74% 70% at 50% 50%, rgba(4,6,9,0.62) 0%, rgba(4,6,9,0.36) 44%, rgba(4,6,9,0.11) 72%, rgba(4,6,9,0) 100%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'relative',
          fontFamily: FONT,
          fontSize: 78,
          fontWeight: 800,
          lineHeight: 1.16,
          letterSpacing: -1.6,
          textAlign: 'center',
          color: L.ink,
          // Two shadows: a tight one for edge definition against mid-tones, and
          // a wide soft one that does the work the scrim used to.
          textShadow:
            '0 3px 10px rgba(0,0,0,0.72), 0 0 42px rgba(0,0,0,0.55)',
          textWrap: 'balance',
        }}
      >
        {cue.text.split('\n').map((line, i) => (
          <div key={i}>
            {parts(line, cue.keyword).map((seg, j) => (
              <span key={j} style={seg.hit ? {color: L.gold} : undefined}>
                {seg.text}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = CUES.find((c) => frame >= c.from && frame < c.to);
  if (!cue) return null;

  // The zone is chosen by the scene the cue *starts* in, so a caption never
  // jumps across the frame partway through its own life.
  const zone = zoneForScene(sceneAt(cue.from));

  return (
    <CaptionBlock
      cue={cue}
      local={frame - cue.from}
      dur={cue.to - cue.from}
      zoneY={ZONE_Y[zone]}
    />
  );
};
