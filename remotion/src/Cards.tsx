import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ANTON, C, INTER, W, boil, clamp, easeOutExpo, posterize} from './theme';
// TitleBlock hides itself once the close takes over the same zone.
import {END_CARD, HOOK} from './beats';

/**
 * Open on a statement, not on a chart.
 *
 * The original short spent its first three seconds on a static headline over a
 * flat page — nothing moved, so there was nothing to stop a scroll. This card
 * lands one line hard, holds it, then wipes to reveal the panel underneath.
 */
export const HookCard: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame >= HOOK.until) return null;

  const out = clamp((frame - (HOOK.until - 12)) / 12);
  const wipe = easeOutExpo(out);
  const b = boil(frame, 5, 1.4);

  return (
    <AbsoluteFill
      style={{
        background: C.ink,
        clipPath: `inset(0 0 ${wipe * 100}% 0)`,
        zIndex: 40,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 40% at 50% 42%, rgba(232,180,79,0.16), transparent 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 78px',
          transform: `translate(${b.x}px, ${b.y}px)`,
        }}
      >
        <div style={{width: '100%', textAlign: 'center'}}>
          {HOOK.lines.map((line, i) => {
            const at = i * 7;
            const t = easeOutExpo(clamp((posterize(frame, 1) - at) / 9));
            return (
              <div
                key={i}
                style={{
                  fontFamily: ANTON,
                  fontSize: line.big ? 138 : 104,
                  lineHeight: 1.0,
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                  color: line.accent ? C.amber : C.white,
                  opacity: t,
                  transform: `translateY(${(1 - t) * 42}px) scale(${0.94 + 0.06 * t})`,
                  textShadow: line.accent
                    ? `0 0 60px rgba(232,180,79,0.45)`
                    : '0 12px 44px rgba(0,0,0,0.8)',
                  marginBottom: 6,
                }}
              >
                {line.text}
              </div>
            );
          })}
          <div
            style={{
              marginTop: 44,
              fontFamily: INTER,
              fontWeight: 700,
              fontSize: 28,
              letterSpacing: 5,
              textTransform: 'uppercase',
              color: 'rgba(251,249,244,0.5)',
              opacity: easeOutExpo(clamp((frame - 20) / 10)),
            }}
          >
            {HOOK.kicker}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * The close takes over the title zone instead of covering the frame, so the
 * last two spoken lines still land underneath it.
 */
export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < END_CARD.from) return null;

  const local = frame - END_CARD.from;
  const t = easeOutExpo(clamp(local / 18));
  const b = boil(frame, 11, 0.7);

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 126,
        width: W,
        padding: '0 78px',
        textAlign: 'center',
        zIndex: 30,
        transform: `translate(${b.x}px, ${(1 - t) * 22 + b.y}px)`,
      }}
    >
      <div
        style={{
          fontFamily: ANTON,
          fontSize: 104,
          lineHeight: 0.98,
          letterSpacing: 1.4,
          textTransform: 'uppercase',
          color: C.white,
          opacity: t,
          textShadow: '0 12px 44px rgba(0,0,0,0.85)',
        }}
      >
        {END_CARD.question}
      </div>
      <div
        style={{
          margin: '26px auto 0',
          width: 120,
          height: 5,
          background: C.amber,
          transform: `scaleX(${t})`,
        }}
      />
      <div
        style={{
          marginTop: 24,
          fontFamily: INTER,
          fontWeight: 800,
          fontSize: 30,
          letterSpacing: 4.6,
          textTransform: 'uppercase',
          color: C.amber,
          opacity: easeOutExpo(clamp((local - 12) / 16)),
        }}
      >
        {END_CARD.cta} — {END_CARD.sub}
      </div>
    </div>
  );
};
