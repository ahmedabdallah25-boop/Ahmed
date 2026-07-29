import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../theme';

export type Chapter = {
  /** first frame this chapter tag is on screen */
  from: number;
  label: string;
  /** the accent this stretch of the film runs on */
  accent: string;
};

const chapterAt = (chapters: Chapter[], frame: number) => {
  let active = chapters[0];
  for (const c of chapters) {
    if (frame >= c.from) {
      active = c;
    }
  }
  return active;
};

const clock = (frames: number, fps: number) => {
  const total = Math.floor(frames / fps);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

const Corner: React.FC<{x: 'l' | 'r'; y: 't' | 'b'}> = ({x, y}) => (
  <div
    style={{
      position: 'absolute',
      [x === 'l' ? 'left' : 'right']: 44,
      [y === 't' ? 'top' : 'bottom']: 44,
      width: 46,
      height: 46,
      [x === 'l' ? 'borderLeft' : 'borderRight']: `3px solid ${C.hairLit}`,
      [y === 't' ? 'borderTop' : 'borderBottom']: `3px solid ${C.hairLit}`,
    }}
  />
);

/** Viewfinder chrome: chapter tag, running clock, progress rail, wordmark. */
export const Hud: React.FC<{chapters: Chapter[]}> = ({chapters}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const chapter = chapterAt(chapters, frame);

  const intro = spring({frame, fps, config: {damping: 200}, durationInFrames: 16});
  const swap = spring({
    frame: frame - chapter.from,
    fps,
    config: {damping: 15, stiffness: 150},
    durationInFrames: 20,
  });
  const progress = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: intro}}>
      <Corner x="l" y="t" />
      <Corner x="r" y="t" />
      <Corner x="l" y="b" />
      <Corner x="r" y="b" />

      {/* ── chapter tag + clock ────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: 96,
          left: 108,
          right: 108,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          key={chapter.label}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '11px 20px 12px',
            border: `2px solid ${chapter.accent}`,
            background: `${chapter.accent}18`,
            transform: `translateX(${interpolate(swap, [0, 1], [-22, 0])}px)`,
            opacity: Math.min(1, swap * 2.2),
          }}
        >
          <span
            style={{
              width: 11,
              height: 11,
              background: chapter.accent,
              opacity: 0.35 + 0.65 * Math.abs(Math.sin(frame / 7)),
            }}
          />
          <span
            style={{
              fontFamily: FONT.mono,
              fontWeight: 700,
              fontSize: 27,
              letterSpacing: 3,
              color: chapter.accent,
              textTransform: 'uppercase',
            }}
          >
            {chapter.label}
          </span>
        </div>

        <span
          style={{
            fontFamily: FONT.mono,
            fontWeight: 500,
            fontSize: 26,
            letterSpacing: 2,
            color: C.textDim,
          }}
        >
          {clock(frame, fps)}
          <span style={{opacity: 0.42}}> / {clock(durationInFrames, fps)}</span>
        </span>
      </div>

      <div
        style={{position: 'absolute', top: 168, left: 108, right: 108, height: 1, background: C.hair}}
      />

      {/* ── progress rail + wordmark ───────────────────────────────────── */}
      <div style={{position: 'absolute', bottom: 208, left: 108, right: 108}}>
        <div style={{height: 3, background: C.hair}}>
          <div
            style={{
              width: `${progress * 100}%`,
              height: '100%',
              background: chapter.accent,
              boxShadow: `0 0 12px ${chapter.accent}`,
            }}
          />
        </div>
        <div
          style={{
            marginTop: 24,
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: FONT.mono,
            fontWeight: 600,
            fontSize: 24,
            letterSpacing: 4,
            color: C.textDim,
            textTransform: 'uppercase',
          }}
        >
          <span>Deen &amp; Dinar</span>
          <span>Ep.01</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
