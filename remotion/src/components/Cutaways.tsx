/**
 * Cutaways: the evidence half of a commentary video.
 *
 * Full-frame stills, picture-in-picture over them, freeze-frame reactions, and
 * the deliberately-crude MS-Paint annotation set. The crudeness is the joke —
 * these are drawn with hand-wobbled SVG rather than clean shapes, because a
 * perfect circle reads as a corporate infographic and kills the bit.
 */

import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  OffthreadVideo,
  interpolate,
  random,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { COLORS, FONTS } from '../theme';
import type { Annotation } from '../lib/timeline';

export const Cutaway: React.FC<{ src: string; kenBurns?: boolean; deepFried?: boolean }> = ({
  src,
  kenBurns = true,
  deepFried = false,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const scale = kenBurns
    ? interpolate(frame, [0, durationInFrames], [1.04, 1.16], {
        extrapolateRight: 'clamp',
        easing: Easing.inOut(Easing.ease),
      })
    : 1;

  // "Deep fried": the escalating over-sharpened zoom used when the host is
  // making fun of how much the source wants you to look at something.
  const fry = deepFried
    ? interpolate(frame, [0, durationInFrames], [1, 2.6], { extrapolateRight: 'clamp' })
    : 1;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: 'hidden' }}>
      <Img
        src={staticFile(`memes/${src}`)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          transform: `scale(${scale * fry})`,
          filter: deepFried
            ? `saturate(${1 + fry * 1.4}) contrast(${1 + fry * 0.5}) brightness(1.05)`
            : 'saturate(0.95)',
        }}
      />
    </AbsoluteFill>
  );
};

/** Host shrunk into a corner while the cutaway owns the frame. */
export const PictureInPicture: React.FC<{
  take: string;
  corner?: 'br' | 'bl' | 'tr' | 'tl';
  zoom?: number;
}> = ({ take, corner = 'br', zoom = 1.35 }) => {
  const frame = useCurrentFrame();
  const pop = interpolate(frame, [0, 5], [0.86, 1], { extrapolateRight: 'clamp' });

  const pos: React.CSSProperties = {
    br: { bottom: 60, right: 60 },
    bl: { bottom: 60, left: 60 },
    tr: { top: 60, right: 60 },
    tl: { top: 60, left: 60 },
  }[corner];

  return (
    <div
      style={{
        position: 'absolute',
        ...pos,
        width: 330,
        height: 330,
        borderRadius: '50%',
        overflow: 'hidden',
        transform: `scale(${pop})`,
        border: `5px solid ${COLORS.white}`,
        boxShadow: '0 24px 70px rgba(0,0,0,0.6)',
      }}
    >
      <OffthreadVideo
        src={staticFile(`host/${take}`)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${zoom})`,
          transformOrigin: '50% 30%',
        }}
      />
    </div>
  );
};

/**
 * The reaction shot. A single held frame of the host, punched in, while the
 * sound design does the talking. `frame` is the source frame to hold.
 */
export const FreezeFrame: React.FC<{ take: string; frame: number; zoom?: number }> = ({
  take,
  frame: sourceFrame,
  zoom = 1.5,
}) => {
  const frame = useCurrentFrame();
  const shake = frame < 6 ? (random(`fz${frame}`) - 0.5) * 14 : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, overflow: 'hidden' }}>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ height: '100%', aspectRatio: '9 / 16', overflow: 'hidden' }}>
          <OffthreadVideo
            src={staticFile(`host/${take}`)}
            startFrom={sourceFrame}
            muted
            // Playback rate near zero holds the frame; Remotion still resolves a
            // real decoded frame, so the grade and grain match the moving shots.
            playbackRate={0.01}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${zoom}) translate(${shake}px, ${shake * 0.4}px)`,
              transformOrigin: '50% 30%',
              filter: 'contrast(1.08) saturate(0.9)',
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const wobblePath = (seed: string, points: [number, number][]) =>
  points
    .map(([x, y], i) => {
      const jx = (random(`${seed}x${i}`) - 0.5) * 1.6;
      const jy = (random(`${seed}y${i}`) - 0.5) * 1.6;
      return `${i === 0 ? 'M' : 'L'} ${x + jx} ${y + jy}`;
    })
    .join(' ');

export const Annotations: React.FC<{ items: Annotation[] }> = ({ items }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        {items.map((item, i) => {
          const delay = item.delay ?? 0;
          if (frame < delay) return null;
          const draw = interpolate(frame - delay, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
          const seed = `${item.kind}${i}`;

          if (item.kind === 'circle') {
            return (
              <ellipse
                key={i}
                cx={item.x}
                cy={item.y}
                rx={9 * draw}
                ry={7 * draw}
                fill="none"
                stroke={COLORS.red}
                strokeWidth={0.55}
                transform={`rotate(${(random(seed) - 0.5) * 20} ${item.x} ${item.y})`}
                vectorEffect="non-scaling-stroke"
              />
            );
          }

          if (item.kind === 'box') {
            return (
              <rect
                key={i}
                x={item.x - 11 * draw}
                y={item.y - 7 * draw}
                width={22 * draw}
                height={14 * draw}
                fill="none"
                stroke={COLORS.red}
                strokeWidth={0.55}
                vectorEffect="non-scaling-stroke"
              />
            );
          }

          if (item.kind === 'arrow') {
            const path = wobblePath(seed, [
              [item.x + 22, item.y - 16],
              [item.x + 11, item.y - 7],
              [item.x + 3, item.y - 1],
            ]);
            return (
              <g key={i} opacity={draw}>
                <path d={path} fill="none" stroke={COLORS.red} strokeWidth={0.6} vectorEffect="non-scaling-stroke" />
                <path
                  d={`M ${item.x} ${item.y} L ${item.x + 5} ${item.y - 3.4} L ${item.x + 4.4} ${item.y + 1.6} Z`}
                  fill={COLORS.red}
                />
              </g>
            );
          }

          const scribble = wobblePath(
            seed,
            new Array(9).fill(0).map((_, k) => [item.x - 10 + k * 2.5, item.y + (k % 2 ? 2.6 : -2.6)]),
          );
          return (
            <path
              key={i}
              d={scribble}
              fill="none"
              stroke={COLORS.red}
              strokeWidth={0.7}
              opacity={draw}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>

      {items
        .filter((item) => item.label && frame >= (item.delay ?? 0) + 6)
        .map((item, i) => (
          <div
            key={`l${i}`}
            style={{
              position: 'absolute',
              left: `${item.x}%`,
              top: `${item.y + 9}%`,
              transform: 'translateX(-50%) rotate(-2.5deg)',
              fontFamily: FONTS.caption,
              fontWeight: 800,
              fontSize: 40,
              color: COLORS.red,
              textShadow: '0 2px 10px rgba(0,0,0,0.8)',
              whiteSpace: 'nowrap',
            }}
          >
            {item.label}
          </div>
        ))}
    </AbsoluteFill>
  );
};
