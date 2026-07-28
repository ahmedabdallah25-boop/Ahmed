import React from 'react';
import {AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame} from 'remotion';
import {BAND_H, BAND_Y, C, W, boil, clamp, easeOutExpo} from './theme';
import {SCENES} from './beats';

const STAGE_W = W;
const STAGE_TOP = 486;

/**
 * The chart panel.
 *
 * The source video is cropped to its live band and then choreographed per
 * scene: each scene opens on a hard cut with a small overshoot, then rides a
 * slow push through. A second, slower transform on the shadow/frame layer gives
 * the parallax separation that keeps a flat panel from looking like a slide.
 */
export const Stage: React.FC = () => {
  const frame = useCurrentFrame();

  const scene =
    SCENES.find((s) => frame >= s.from && frame < s.from + s.duration) ??
    SCENES[SCENES.length - 1];

  const local = frame - scene.from;
  const t = clamp(local / scene.duration);

  // Slow push through the scene.
  const push = scene.zoomFrom + (scene.zoomTo - scene.zoomFrom) * easeOutExpo(t * 0.9);

  // Entrance: a short overshoot on the cut, settling within ~10 frames.
  const entry = clamp(local / 10);
  const overshoot = (1 - easeOutExpo(entry)) * 0.045;

  // Drift across the panel, direction alternating per scene.
  const drift = scene.panX * t;
  const driftY = scene.panY * t;

  const b = boil(frame, scene.index * 17, 1.0);

  const scale = push + overshoot;

  return (
    <AbsoluteFill>
      {/* Key light behind the panel, so it reads as lit rather than pasted on. */}
      <div
        style={{
          position: 'absolute',
          left: -160,
          top: STAGE_TOP - 220,
          width: W + 320,
          height: BAND_H + 440,
          background: `radial-gradient(ellipse 52% 46% at 50% 50%, rgba(232,180,79,0.16), rgba(232,180,79,0.04) 55%, transparent 75%)`,
        }}
      />

      {/* Shadow / frame plate — moves slower than the panel (parallax). */}
      <div
        style={{
          position: 'absolute',
          left: -14,
          top: STAGE_TOP - 14,
          width: STAGE_W + 28,
          height: BAND_H + 28,
          transform: `scale(${1 + (scale - 1) * 0.35})`,
          background: C.ink2,
          boxShadow: '0 40px 90px rgba(0,0,0,0.62), 0 0 0 1px rgba(232,180,79,0.14)',
        }}
      />

      {/* The cropped source band. */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: STAGE_TOP,
          width: STAGE_W,
          height: BAND_H,
          overflow: 'hidden',
          transform: `translate(${drift + b.x}px, ${driftY + b.y}px) scale(${scale})`,
          transformOrigin: `${scene.originX}% ${scene.originY}%`,
        }}
      >
        <OffthreadVideo
          src={staticFile('source.mp4')}
          style={{
            position: 'absolute',
            left: 0,
            top: -BAND_Y,
            width: 1080,
            height: 1920,
          }}
        />
      </div>

      {/* Top/bottom feather so the panel bleeds into the canvas. */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: STAGE_TOP - 2,
          width: STAGE_W,
          height: 46,
          background: `linear-gradient(to bottom, ${C.ink} 0%, rgba(11,11,12,0) 100%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: STAGE_TOP + BAND_H - 44,
          width: STAGE_W,
          height: 46,
          background: `linear-gradient(to top, ${C.ink} 0%, rgba(11,11,12,0) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

export {STAGE_TOP};
