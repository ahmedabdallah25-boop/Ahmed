import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ANTON, C, W, clamp, posterize} from './theme';
import {CAPTIONS} from './beats';

/** The caption zone owns the whole lower third, vertically centred inside it. */
const BLOCK_TOP = 1108;
const BLOCK_H = 636;

/**
 * Word-synced kinetic captions.
 *
 * The source burned its narration in at ~24px inside the chart — unreadable on
 * a phone. Timings were recovered from that original caption track (the amber
 * highlight marks the spoken word), so these land on the same syllables, just
 * ~4x the size, on hard cuts with no fades.
 */
export const Captions: React.FC = () => {
  const frame = useCurrentFrame();

  const chunk = CAPTIONS.find((c) => frame >= c.from && frame < c.to);
  if (!chunk) return null;

  const local = frame - chunk.from;

  // Hard cut in, with a 3-frame stepped pop. No fade — fades read as slow.
  const popT = clamp(posterize(local, 1) / 4);
  const scale = 0.955 + 0.045 * (1 - Math.pow(1 - popT, 3));
  const lift = (1 - popT) * 14;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: BLOCK_TOP,
        width: W,
        height: BLOCK_H,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignContent: 'center',
        gap: '0 24px',
        padding: '0 66px',
        transform: `translateY(${lift}px) scale(${scale})`,
        transformOrigin: '50% 50%',
      }}
    >
      {chunk.words.map((w, i) => {
        const active = frame >= w.from && frame < w.to;
        const spoken = frame >= w.from;
        return (
          <span
            key={i}
            style={{
              fontFamily: ANTON,
              fontSize: 112,
              lineHeight: 1.02,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              color: active ? C.amber : spoken ? C.white : 'rgba(251,249,244,0.60)',
              transform: active ? 'translateY(-5px)' : 'none',
              textShadow: active
                ? `0 0 44px rgba(232,180,79,0.42), 0 8px 24px rgba(0,0,0,0.6)`
                : '0 8px 24px rgba(0,0,0,0.6)',
              transition: 'none',
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};
