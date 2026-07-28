/**
 * Full-frame cards: chapters, dead air, receipts, the sponsor wall, the end card.
 *
 * Every one of these is a hard cut in and a hard cut out. No dissolves anywhere
 * in this style — a crossfade instantly makes the video feel like a documentary
 * instead of a guy talking.
 */

import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { COLORS, FONTS } from '../theme';

export const TitleCard: React.FC<{ title: string; kicker?: string }> = ({ title, kicker }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 200, mass: 0.4 } });
  const slide = interpolate(enter, [0, 1], [70, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Amber sweep, mirroring the LED strip behind the host so chapter cards
          feel like they were shot on the same set. */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(105deg, transparent 30%, ${COLORS.amberDeep}55 50%, transparent 70%)`,
          transform: `translateX(${interpolate(enter, [0, 1], [-60, 20])}%)`,
        }}
      />
      <div style={{ textAlign: 'center', transform: `translateY(${slide}px)` }}>
        {kicker ? (
          <div
            style={{
              fontFamily: FONTS.mono,
              fontSize: 34,
              letterSpacing: 8,
              color: COLORS.amber,
              textTransform: 'uppercase',
              marginBottom: 26,
            }}
          >
            {kicker}
          </div>
        ) : null}
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 168,
            lineHeight: 0.94,
            letterSpacing: 3,
            color: COLORS.white,
            textTransform: 'uppercase',
            maxWidth: 1500,
            whiteSpace: 'pre-line',
            textShadow: '0 24px 80px rgba(0,0,0,0.8)',
          }}
        >
          {title}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/**
 * Dead air. Black frame, no music, no caption unless you insist.
 * Resist the urge to put something here — the emptiness is the joke.
 */
export const DeadAir: React.FC<{ caption?: string }> = ({ caption }) => (
  <AbsoluteFill style={{ backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
    {caption ? (
      <div style={{ fontFamily: FONTS.mono, fontSize: 32, color: 'rgba(253,248,242,0.55)' }}>
        {caption}
      </div>
    ) : null}
  </AbsoluteFill>
);

/**
 * The receipt slate. This is the one place the video drops the bit and shows
 * the actual arithmetic — the reason a finance channel gets away with a
 * comedy edit. Lines land one at a time; the highlighted line lands in green.
 */
export const Receipt: React.FC<{ lines: string[]; highlight?: number }> = ({ lines, highlight }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bgLift,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 120,
      }}
    >
      <div style={{ width: '100%', maxWidth: 1360 }}>
        {lines.map((line, i) => {
          const at = i * 14;
          if (frame < at) return null;
          const isHighlight = highlight === i;
          const pop = interpolate(frame - at, [0, 6], [0.94, 1], { extrapolateRight: 'clamp' });

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                gap: 40,
                padding: '22px 0',
                borderBottom: `2px solid ${isHighlight ? COLORS.green : 'rgba(253,248,242,0.14)'}`,
                transform: `scale(${pop})`,
                transformOrigin: 'left center',
                fontFamily: FONTS.mono,
                fontSize: isHighlight ? 68 : 52,
                color: isHighlight ? COLORS.green : COLORS.white,
              }}
            >
              <span>{line.split('|')[0]?.trim()}</span>
              <span style={{ fontFamily: FONTS.display, fontSize: isHighlight ? 96 : 72 }}>
                {line.split('|')[1]?.trim()}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/**
 * Sponsor bumper. Visually walled off — different accent, hard border, a
 * timer in the corner — so viewers can see exactly where the ad starts and
 * stops. Retention goes up when you stop pretending the ad isn't an ad.
 */
export const Sponsor: React.FC<{ brand: string; body: string }> = ({ brand, body }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const left = Math.ceil((durationInFrames - frame) / fps);

  return (
    <AbsoluteFill style={{ backgroundColor: '#07171b', padding: 90 }}>
      <div
        style={{
          flex: 1,
          border: `6px solid ${COLORS.cyan}`,
          padding: 70,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 34,
        }}
      >
        <div style={{ fontFamily: FONTS.mono, fontSize: 32, letterSpacing: 8, color: COLORS.cyan }}>
          PAID PROMOTION
        </div>
        <div style={{ fontFamily: FONTS.display, fontSize: 150, color: COLORS.white, lineHeight: 0.95 }}>
          {brand}
        </div>
        <div style={{ fontFamily: FONTS.caption, fontSize: 46, lineHeight: 1.35, color: 'rgba(253,248,242,0.9)' }}>
          {body}
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 110,
          right: 120,
          fontFamily: FONTS.mono,
          fontSize: 40,
          color: COLORS.cyan,
        }}
      >
        ad ends in {left}s
      </div>
    </AbsoluteFill>
  );
};

export const EndCard: React.FC<{ next: string }> = ({ next }) => {
  const frame = useCurrentFrame();
  const rise = interpolate(frame, [0, 20], [40, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 40,
      }}
    >
      <div style={{ transform: `translateY(${rise}px)`, textAlign: 'center' }}>
        <div style={{ fontFamily: FONTS.mono, fontSize: 34, letterSpacing: 8, color: COLORS.amber }}>
          NEXT EPISODE
        </div>
        <div
          style={{
            fontFamily: FONTS.display,
            fontSize: 132,
            color: COLORS.white,
            maxWidth: 1500,
            lineHeight: 1,
            margin: '28px 0 60px',
            whiteSpace: 'pre-line',
            textTransform: 'uppercase',
          }}
        >
          {next}
        </div>
        <div style={{ fontFamily: FONTS.caption, fontWeight: 700, fontSize: 44, color: 'rgba(253,248,242,0.75)' }}>
          No jargon. Just mechanisms.
        </div>
      </div>
    </AbsoluteFill>
  );
};
