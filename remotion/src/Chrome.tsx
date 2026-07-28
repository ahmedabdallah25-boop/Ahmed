import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ANTON, C, DURATION, INTER, W, boil, clamp, easeOutExpo} from './theme';
import {END_CARD, SCENES, STATS, TITLE} from './beats';

/** Thin retention rail with a tick at every scene cut. */
export const ProgressRail: React.FC = () => {
  const frame = useCurrentFrame();
  const p = clamp(frame / DURATION);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: 7}}>
      <div style={{position: 'absolute', inset: 0, background: 'rgba(251,249,244,0.13)'}} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: 7,
          width: W * p,
          background: `linear-gradient(90deg, ${C.rust}, ${C.amber})`,
          boxShadow: `0 0 22px ${C.amber}99`,
        }}
      />
      {SCENES.map((s) => (
        <div
          key={s.index}
          style={{
            position: 'absolute',
            left: (s.from / DURATION) * W,
            top: 0,
            width: 2,
            height: 7,
            background: 'rgba(11,11,12,0.85)',
          }}
        />
      ))}
    </div>
  );
};

/** Scene label. Hard-cuts on the scene boundary, then settles. */
export const ChapterChip: React.FC = () => {
  const frame = useCurrentFrame();
  const scene =
    SCENES.find((s) => frame >= s.from && frame < s.from + s.duration) ?? SCENES[0];
  const local = frame - scene.from;
  const t = easeOutExpo(clamp(local / 9));

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 44,
        width: W,
        display: 'flex',
        justifyContent: 'center',
        transform: `translateY(${(1 - t) * -10}px)`,
        opacity: 0.35 + 0.65 * t,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '10px 26px',
          borderRadius: 999,
          background: 'rgba(232,180,79,0.10)',
          border: '1px solid rgba(232,180,79,0.34)',
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            background: C.rust,
            opacity: frame % 30 < 18 ? 1 : 0.35,
          }}
        />
        <span
          style={{
            fontFamily: INTER,
            fontWeight: 800,
            fontSize: 27,
            letterSpacing: 3.6,
            color: C.amber,
            textTransform: 'uppercase',
          }}
        >
          {scene.chip}
        </span>
      </div>
    </div>
  );
};

/** Series title, parked compactly under the chip once the hook has cleared. */
export const TitleBlock: React.FC<{from: number}> = ({from}) => {
  const frame = useCurrentFrame();
  if (frame < from || frame >= END_CARD.from) return null;
  const t = easeOutExpo(clamp((frame - from) / 14));
  const b = boil(frame, 7, 0.6);

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 132,
        width: W,
        padding: '0 90px',
        textAlign: 'center',
        transform: `translate(${b.x}px, ${(1 - t) * 18 + b.y}px)`,
        opacity: t,
      }}
    >
      <div
        style={{
          fontFamily: ANTON,
          fontSize: 92,
          lineHeight: 0.96,
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          color: C.white,
          textShadow: '0 10px 40px rgba(0,0,0,0.7)',
        }}
      >
        {TITLE}
      </div>
      <div
        style={{
          margin: '22px auto 0',
          width: 92,
          height: 4,
          background: C.amber,
          transform: `scaleX(${t})`,
        }}
      />
    </div>
  );
};

/**
 * The number under the panel. Counts up on entry, so the eye has something
 * moving in the gap between the chart and the caption line.
 */
export const StatStrip: React.FC = () => {
  const frame = useCurrentFrame();
  const stat = STATS.find((s) => frame >= s.from && frame < s.to);
  if (!stat) return null;

  const t = easeOutExpo(clamp((frame - stat.from) / 16));
  const shown = stat.countTo
    ? Math.round(stat.countTo * t).toLocaleString('en-US')
    : null;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 1046,
        width: W,
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'center',
        gap: 20,
        opacity: t,
        transform: `translateY(${(1 - t) * 12}px)`,
      }}
    >
      <span
        style={{
          fontFamily: ANTON,
          fontSize: 78,
          letterSpacing: 1,
          color: stat.tone === 'down' ? C.rust : C.amber,
          textShadow: '0 6px 26px rgba(0,0,0,0.65)',
        }}
      >
        {shown === null ? stat.value : `${stat.prefix ?? ''}${shown}`}
      </span>
      <span
        style={{
          fontFamily: INTER,
          fontWeight: 700,
          fontSize: 26,
          letterSpacing: 3.2,
          textTransform: 'uppercase',
          color: 'rgba(251,249,244,0.62)',
        }}
      >
        {stat.label}
      </span>
    </div>
  );
};

export const BrandChip: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      bottom: 62,
      width: W,
      textAlign: 'center',
      fontFamily: INTER,
      fontWeight: 700,
      fontSize: 25,
      letterSpacing: 4.4,
      textTransform: 'uppercase',
      color: 'rgba(251,249,244,0.40)',
    }}
  >
    Deen &amp; Dinar · Episode 01
  </div>
);
