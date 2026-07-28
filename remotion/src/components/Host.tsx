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
 *
 * Source frames are wrapped through `takeFrame()` against the take's declared
 * length. A beat can legitimately ask for a frame past the end of its take —
 * always, while the 10-second placeholder stands in for every take in the
 * script. An out-of-range request to the frame extractor is simply never
 * answered, and the render dies on a delayRender timeout that reads like a
 * performance problem rather than a bad seek.
 */

import React from 'react';
import {
  AbsoluteFill,
  Easing,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { COLORS } from '../theme';
import { takeFrame } from '../lib/assets';

export type HostProps = {
  /** File in public/host, e.g. "ep01-a01.mp4". */
  take: string;
  plate?: 'vertical' | 'wide';
  /** 1 = as shot. 1.25–1.45 is the punch-in. Applied instantly, no ramp. */
  zoom?: number;
  /**
   * Number of jump cuts inside this beat — the actual count, spaced evenly
   * across the beat. Each one silently drops ~10 source frames, which is what
   * makes the delivery feel de-breathed and fast.
   */
  jumpCuts?: number;
  /** Source frame the take starts on. */
  startFrom?: number;
  /** Slow drift so a long shot is never perfectly locked off. */
  drift?: boolean;
  muted?: boolean;
};

const JUMP_DROP = 10;

/** The blurred set extension is painted at a quarter of frame size, then scaled up. */
const BACKDROP_SCALE = 4;
const BACKDROP_W = 1920 / BACKDROP_SCALE;
const BACKDROP_H = 1080 / BACKDROP_SCALE;

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
  // Inside a <Sequence>, this is the beat's own length — so the cuts are spaced
  // across the beat rather than at a fixed cadence that ignores how long it is.
  const { durationInFrames, fps } = useVideoConfig();

  // Every jump cut the playhead has already passed adds to the amount of
  // source we skip, so time is removed rather than repeated.
  const spacing = jumpCuts > 0 ? durationInFrames / (jumpCuts + 1) : 0;
  const cutsPassed = spacing > 0 ? Math.min(jumpCuts, Math.floor(frame / spacing)) : 0;
  const sourceStart = takeFrame(take, startFrom + cutsPassed * JUMP_DROP, fps);

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
          reads as the same room rather than as black bars.

          Painted at quarter size and scaled up, rather than blurred at full
          frame. Chromium's blur cost scales with painted area, and a full-frame
          48px blur on a 1.9x-scaled 1080p layer is expensive enough to blow the
          delayRender budget partway through a long render. At 1/4 scale the
          same look costs ~16x less, and it is a blur — nothing is lost. */}
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            width: BACKDROP_W,
            height: BACKDROP_H,
            transform: `scale(${BACKDROP_SCALE * 1.9})`,
            overflow: 'hidden',
          }}
        >
          <OffthreadVideo
            src={src}
            startFrom={sourceStart}
            muted
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: `blur(${48 / BACKDROP_SCALE}px) saturate(0.7) brightness(0.42)`,
            }}
          />
        </div>
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
