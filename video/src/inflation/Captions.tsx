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
// Content and hierarchy come from the scene pack: CAPTION 1 carries the point,
// CAPTION 2 is the quieter qualifier under it. Treatment is this project's —
// a centred block on a soft scrim with a short pop, rather than the pack's
// solid black boxes.
//
// Two deliberate departures from the pack's burn-in spec, both settled with the
// author:
//
//   * Position. The spec says "lower third", but all 37 image prompts end with
//     "subject in the lower two-thirds, clean headroom above for captions" —
//     the footage was composed with the space reserved at the TOP and the
//     subject placed low. Lower-third captions would sit on the character in
//     most shots, so captions go where the pictures actually left room. The
//     per-scene exceptions live in ./placement.ts.
//   * The spec's 20px left offset on line 2 is dropped. It belongs to a
//     left-aligned two-box layout; on a centred block it reads as a mistake.
//     Line 2 stays distinct through colour, italic and size instead.
//
// Timing is not interpolated: every cue begins and ends on a cut in the
// footage. See ./captions.ts.
// ─────────────────────────────────────────────────────────────────────────────

const IN = 5;
const backOut = Easing.bezier(0.34, 1.56, 0.64, 1);

/** Soft gold for line 2, from the pack's burn-in spec. */
const GOLD_2 = '#F5D76E';

const CaptionBlock: React.FC<{cue: Cue; local: number; zoneY: number}> = ({
  cue,
  local,
  zoneY,
}) => {
  const p = interpolate(local, [0, IN], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: backOut,
  });
  const opacity = interpolate(local, [0, IN * 0.6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const blur = (1 - p) * 7;

  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: `${zoneY * 100}%`,
        width: `${CAPTION_MAX_WIDTH * 100}%`,
        transform: `translate(-50%, -50%) translateY(${(1 - p) * 9}px) scale(${(
          0.95 +
          p * 0.05
        ).toFixed(4)})`,
        opacity,
        filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : undefined,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
        fontFamily: FONT,
        textAlign: 'center',
      }}
    >
      {/* Scrim: sized to the block, not the frame, so the photograph stays
          visible everywhere the type is not.

          Deliberately weak, with a long falloff. A denser scrim reads fine over
          a busy supermarket shelf but shows up as a dark smudge on the flat
          skies this footage keeps cutting to. Legibility over the busy shots is
          carried by the text shadows instead, which cost nothing on a clean
          background. */}
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
          fontSize: 64,
          fontWeight: 800,
          lineHeight: 1.14,
          letterSpacing: -1.4,
          color: L.ink,
          textShadow: '0 3px 10px rgba(0,0,0,0.72), 0 0 42px rgba(0,0,0,0.55)',
          textWrap: 'balance',
        }}
      >
        {cue.line1}
      </div>

      {cue.line2 ? (
        <div
          style={{
            position: 'relative',
            fontSize: 41,
            fontWeight: 600,
            fontStyle: 'italic',
            lineHeight: 1.2,
            letterSpacing: -0.3,
            color: GOLD_2,
            textShadow: '0 3px 10px rgba(0,0,0,0.78), 0 0 36px rgba(0,0,0,0.6)',
            textWrap: 'balance',
          }}
        >
          {cue.line2}
        </div>
      ) : null}
    </div>
  );
};

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const cue = CUES.find((c) => frame >= c.from && frame < c.to);
  if (!cue) return null;

  // Cues are contiguous and every boundary is a cut, so there is no exit fade:
  // one caption is replaced by the next at the same instant the picture
  // changes. Fading out would soften a cut the footage makes hard.
  const zone = zoneForScene(sceneAt(cue.from));

  return <CaptionBlock cue={cue} local={frame - cue.from} zoneY={ZONE_Y[zone]} />;
};
