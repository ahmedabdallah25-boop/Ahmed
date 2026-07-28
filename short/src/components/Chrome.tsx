import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../theme';

export type Chapter = {
  /** first frame this chapter label is on screen */
  from: number;
  label: string;
};

const useChapter = (chapters: Chapter[], frame: number) => {
  let active = chapters[0];
  for (const c of chapters) {
    if (frame >= c.from) {
      active = c;
    }
  }
  return active;
};

/** Top chapter chip + bottom brand bar + a hairline progress rule. */
export const Chrome: React.FC<{chapters: Chapter[]}> = ({chapters}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const chapter = useChapter(chapters, frame);

  const intro = spring({frame, fps, config: {damping: 200}, durationInFrames: 18});
  // re-pop the chip every time the chapter changes
  const swap = spring({
    frame: frame - chapter.from,
    fps,
    config: {damping: 14, stiffness: 140},
    durationInFrames: 22,
  });

  const progress = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {/* ── top chapter chip ───────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: 96,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          opacity: intro,
          transform: `translateY(${interpolate(intro, [0, 1], [-40, 0])}px)`,
        }}
      >
        <div
          key={chapter.label}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '14px 30px 13px',
            borderRadius: 999,
            background: C.rust,
            boxShadow: `0 10px 0 -4px ${C.rustDeep}55, 0 18px 34px rgba(23,21,15,0.22)`,
            transform: `scale(${interpolate(swap, [0, 1], [0.86, 1])})`,
          }}
        >
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: C.goldSoft,
              opacity: 0.55 + 0.45 * Math.sin(frame / 5),
            }}
          />
          <span
            style={{
              fontFamily: FONT.ui,
              fontWeight: 800,
              fontSize: 30,
              letterSpacing: 5,
              color: '#FFF6E4',
              textTransform: 'uppercase',
            }}
          >
            {chapter.label}
          </span>
        </div>
      </div>

      {/* ── standing headline ──────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: 190,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: FONT.ui,
          fontWeight: 900,
          fontSize: 78,
          lineHeight: 1.04,
          letterSpacing: -2.5,
          color: C.ink,
          opacity: intro,
          transform: `translateY(${interpolate(intro, [0, 1], [22, 0])}px)`,
        }}
      >
        The Moment Most
        <br />
        People <span style={{color: C.rust}}>Quit</span>
      </div>

      {/* ── bottom brand bar ───────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: 268,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 26,
          opacity: intro,
        }}
      >
        <div style={{width: 620, height: 6, borderRadius: 999, background: `${C.ink}1F`}}>
          <div
            style={{
              width: `${progress * 100}%`,
              height: '100%',
              borderRadius: 999,
              background: `linear-gradient(90deg, ${C.olive}, ${C.gold} 62%, ${C.rust})`,
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            fontFamily: FONT.ui,
            fontWeight: 700,
            fontSize: 27,
            letterSpacing: 3.5,
            color: C.inkSoft,
            textTransform: 'uppercase',
          }}
        >
          <span>Deen &amp; Dinar</span>
          <span style={{color: C.rust}}>◆</span>
          <span>Episode 1</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
