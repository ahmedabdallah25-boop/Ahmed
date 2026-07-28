/**
 * The host plate — the cloned presenter.
 *
 * The source takes are 720x1280 vertical (that is what the avatar renderer
 * outputs), and this composition is 1920x1080. Rather than upscale-and-crop a
 * vertical face into a wide frame — which loses the desk, the mic and the LED
 * wall, i.e. everything that sells the set as real — the plate is kept vertical
 * and set into the wide frame against a blurred, pushed-in copy of itself.
 * That is a deliberate commentary-video look, not a fallback: it gives the
 * caption stack somewhere to live and keeps the face at native resolution.
 *
 * If a take is genuinely 16:9 (see clone/README.md — the avatar renderer can be
 * asked for wide), pass `plate="wide"` and it fills the frame instead.
 */

import React from 'react';
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { COLORS } from '../theme';

export type HostProps = {
  /** File in public/host, e.g. "ep01-a01.mp4". */
  take: string;
  plate?: 'vertical' | 'wide';
  /** 1 = as shot. 1.25–1.45 is the punch-in. Applied instantly, no ramp. */
  zoom?: number;
  /**
   * Number of jump cuts inside this beat. Each one silently drops ~10 source
   * frames, which is what makes the delivery feel de-breathed and fast.
   */
  jumpCuts?: number;
  /** Source frame the take starts on. */
  startFrom?: number;
  /** Slow drift so a long shot is never perfectly locked off. */
  drift?: boolean;
  muted?: boolean;
};

const JUMP_DROP = 10;

export const Host: React.FC<HostProps> = ({
  take,
  plate = 'vertical',
  zoom = 1,
  jumpCuts = 0,
  startFrom = 0,
  drift = true,
  muted = false,
}) => {
  const frame = useCurrentFrame();

  // Every jump cut the playhead has already passed adds to the amount of
  // source we skip, so time is removed rather than repeated.
  const cutsPassed = jumpCuts > 0 ? Math.floor(frame / Math.max(1, 90 / jumpCuts)) : 0;
  const sourceStart = startFrom + cutsPassed * JUMP_DROP;

  const wobble = drift
    ? interpolate(frame, [0, 240], [0, 1.6], {
        extrapolateRight: 'clamp',
        easing: Easing.inOut(Easing.ease),
      })
    : 0;

  const src = staticFile(`host/${take}`);

  if (plate === 'wide') {
    return (
      <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: 'hidden' }}>
        <OffthreadVideo
          src={src}
          startFrom={sourceStart}
          muted={muted}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: `scale(${zoom}) translateY(${wobble}px)`,
            transformOrigin: '50% 42%',
          }}
        />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: 'hidden' }}>
      {/* Set extension: the same take, blown out and blurred, so the wide frame
          reads as the same room rather than as black bars. */}
      <AbsoluteFill>
        <OffthreadVideo
          src={src}
          startFrom={sourceStart}
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scale(1.9)',
            filter: 'blur(48px) saturate(0.7) brightness(0.42)',
          }}
        />
      </AbsoluteFill>

      {/* The plate itself. */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            position: 'relative',
            height: '100%',
            aspectRatio: '9 / 16',
            overflow: 'hidden',
            boxShadow: `0 0 120px 30px rgba(0,0,0,0.55), 0 0 0 1px ${COLORS.amberDeep}33`,
          }}
        >
          <OffthreadVideo
            src={src}
            startFrom={sourceStart}
            muted={muted}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${zoom}) translateY(${wobble}px)`,
              transformOrigin: '50% 34%',
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
