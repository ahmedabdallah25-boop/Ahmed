import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';

// ─────────────────────────────────────────────────────────────────────────────
// Scene kit for the 3D-mannequin documentary lane (the "Blackfiles" look):
// faceless matte figures, one hard key light through haze, teal shadows,
// amber practicals, slow camera pushes, film grain, letterbox.
// Everything is drawn procedurally so a render never needs an asset or a model.
// ─────────────────────────────────────────────────────────────────────────────

export const D = {
  black: '#04070A',
  shadow: '#0A141C', // teal-lifted black
  steel: '#3E4C57',
  figure: '#8A949B', // matte mannequin grey
  figureLit: '#D8DDE0',
  amber: '#E0A45C',
  amberHot: '#FFD9A0',
  ice: '#7FB4CC',
  red: '#C4483C',
  paper: '#C9C4B6',
};

export const MONO = '"Liberation Mono", "Courier New", monospace';

/** Deterministic pseudo-random: same value for the same (i, salt) every render. */
export const rnd = (i: number, salt = 1) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/**
 * Camera for one shot: a slow push (or pull) plus a shallow handheld drift.
 * Documentary cameras are never quite still and never obviously moving.
 */
export const Cam: React.FC<{
  children: React.ReactNode;
  dur: number;
  from?: number;
  to?: number;
  panX?: number;
  panY?: number;
  seed?: number;
}> = ({children, dur, from = 1.04, to = 1.14, panX = 0, panY = 0, seed = 1}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, dur], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });
  const driftX = Math.sin((frame / 30) * 0.9 + seed) * 4;
  const driftY = Math.cos((frame / 30) * 0.7 + seed * 2) * 3;
  return (
    <AbsoluteFill
      style={{
        transform: `scale(${from + (to - from) * p}) translate(${
          panX * p + driftX
        }px, ${panY * p + driftY}px)`,
        transformOrigin: 'center center',
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** A hard key light raking through haze — the genre's single most-used element. */
export const Shaft: React.FC<{
  x: number;
  y: number;
  angle: number;
  width: number;
  length: number;
  color?: string;
  opacity?: number;
  blur?: number;
}> = ({
  x,
  y,
  angle,
  width,
  length,
  color = D.amberHot,
  opacity = 0.16,
  blur = 60,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width,
      height: length,
      transform: `rotate(${angle}deg)`,
      transformOrigin: 'top center',
      background: `linear-gradient(to bottom, ${color}, transparent 78%)`,
      filter: `blur(${blur}px)`,
      opacity,
    }}
  />
);

/** Dust in the beam. Slow, sparse, never sparkly. */
export const Dust: React.FC<{count?: number; seed?: number}> = ({
  count = 46,
  seed = 3,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {new Array(count).fill(0).map((_, i) => {
        const x = rnd(i, seed) * 1080;
        const y0 = rnd(i, seed + 1) * 1920;
        const sp = 6 + rnd(i, seed + 2) * 16;
        const y = (y0 - frame * (sp / 30)) % 1920;
        const s = 2 + rnd(i, seed + 3) * 4;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y < 0 ? y + 1920 : y,
              width: s,
              height: s,
              borderRadius: '50%',
              background: D.amberHot,
              opacity: 0.06 + rnd(i, seed + 4) * 0.12,
              filter: 'blur(1px)',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/**
 * The faceless mannequin. Matte grey, no features, lit from one side —
 * the whole niche is built on this figure.
 */
export const Figure: React.FC<{
  x: number;
  y: number;
  scale?: number;
  pose?: 'sit' | 'stand' | 'lean';
  flip?: boolean;
  tone?: string;
  litFrom?: 'left' | 'right';
  opacity?: number;
}> = ({
  x,
  y,
  scale = 1,
  pose = 'stand',
  flip = false,
  tone = D.figure,
  litFrom = 'left',
  opacity = 1,
}) => {
  const lit = litFrom === 'left' ? '18%' : '82%';
  const skin = `radial-gradient(60% 60% at ${lit} 24%, ${D.figureLit} 0%, ${tone} 42%, #1B242B 100%)`;
  const limb = (
    style: React.CSSProperties,
  ): React.CSSProperties => ({
    position: 'absolute',
    background: skin,
    ...style,
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 300,
        height: 620,
        transform: `scale(${scale}) scaleX(${flip ? -1 : 1})`,
        transformOrigin: 'bottom center',
        opacity,
      }}
    >
      {/* head — no face, ever */}
      <div
        style={limb({
          left: 108,
          top: 0,
          width: 84,
          height: 104,
          borderRadius: '46% 46% 44% 44% / 52% 52% 48% 48%',
        })}
      />
      {/* neck */}
      <div style={limb({left: 134, top: 96, width: 32, height: 34, borderRadius: 12})} />
      {/* torso */}
      <div
        style={limb({
          left: 88,
          top: 122,
          width: 124,
          height: pose === 'sit' ? 176 : 208,
          borderRadius: '44px 44px 30px 30px',
        })}
      />
      {/* arms */}
      <div
        style={limb({
          left: pose === 'lean' ? 54 : 62,
          top: 138,
          width: 34,
          height: pose === 'sit' ? 132 : 176,
          borderRadius: 18,
          transform: `rotate(${pose === 'sit' ? 12 : pose === 'lean' ? -14 : 5}deg)`,
          transformOrigin: 'top center',
        })}
      />
      <div
        style={limb({
          left: 210,
          top: 138,
          width: 34,
          height: pose === 'sit' ? 132 : 176,
          borderRadius: 18,
          transform: `rotate(${pose === 'sit' ? -16 : -5}deg)`,
          transformOrigin: 'top center',
        })}
      />
      {/* legs */}
      {pose === 'sit' ? (
        <>
          <div
            style={limb({
              left: 96,
              top: 292,
              width: 46,
              height: 150,
              borderRadius: 20,
              transform: 'rotate(-72deg)',
              transformOrigin: 'top center',
            })}
          />
          <div
            style={limb({
              left: 154,
              top: 292,
              width: 46,
              height: 150,
              borderRadius: 20,
              transform: 'rotate(-70deg)',
              transformOrigin: 'top center',
            })}
          />
        </>
      ) : (
        <>
          <div
            style={limb({left: 100, top: 320, width: 46, height: 250, borderRadius: 22})}
          />
          <div
            style={limb({left: 154, top: 320, width: 46, height: 250, borderRadius: 22})}
          />
        </>
      )}
    </div>
  );
};

/** A sheet of paper / statement / contract, lit from the side. */
export const Sheet: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  rotate?: number;
  children?: React.ReactNode;
  tone?: string;
}> = ({x, y, w, h, rotate = 0, children, tone = D.paper}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: h,
      transform: `rotate(${rotate}deg)`,
      background: `linear-gradient(150deg, ${tone} 0%, #8E8B80 62%, #4B4D4A 100%)`,
      boxShadow: '0 40px 90px rgba(0,0,0,0.65)',
      padding: 34,
      overflow: 'hidden',
    }}
  >
    {children}
  </div>
);

/** Ruled lines of unreadable text on a document. */
export const Ruled: React.FC<{rows: number; width: number; gap?: number}> = ({
  rows,
  width,
  gap = 22,
}) => (
  <div style={{marginTop: 14}}>
    {new Array(rows).fill(0).map((_, i) => (
      <div
        key={i}
        style={{
          height: 7,
          marginBottom: gap,
          width: width * (0.55 + rnd(i, 7) * 0.45),
          background: '#2B2E2C',
          opacity: 0.5,
        }}
      />
    ))}
  </div>
);

/** The grade: teal shadows, amber bloom, vignette, letterbox, grain. */
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/></filter><rect width='140' height='140' filter='url(%23n)' opacity='0.55'/></svg>\")";

export const Grade: React.FC<{bars?: number}> = ({bars = 96}) => {
  const frame = useCurrentFrame();
  return (
    <>
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${D.shadow}55 0%, transparent 34%, transparent 66%, ${D.black}99 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(82% 56% at 50% 44%, transparent 42%, ${D.black}A6 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: GRAIN,
          backgroundPosition: `${Math.round(rnd(frame, 11) * 140)}px ${Math.round(
            rnd(frame, 12) * 140,
          )}px`,
          opacity: 0.07,
          mixBlendMode: 'overlay',
        }}
      />
      <AbsoluteFill style={{justifyContent: 'space-between'}}>
        <div style={{height: bars, background: D.black}} />
        <div style={{height: bars, background: D.black}} />
      </AbsoluteFill>
    </>
  );
};

/** Case-file slug, top left, under the bar. Monospace, tracked out, dim. */
export const Slug: React.FC<{text: string; at?: number}> = ({text, at = 0}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 10], [0, 0.62], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: 64,
        top: 130,
        fontFamily: MONO,
        fontSize: 26,
        letterSpacing: 6,
        color: D.ice,
        opacity: o,
      }}
    >
      {text}
    </div>
  );
};

/** Burned-in narration caption — the genre standard, bottom third, uppercase. */
export const Caption: React.FC<{
  text: string;
  at?: number;
  color?: string;
  size?: number;
}> = ({text, at = 0, color = '#F2EFE9', size = 62}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const y = interpolate(frame, [at, at + 12], [16, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return (
    <>
      {/* scrim: narration must read over any footage */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 96,
          height: 520,
          background: `linear-gradient(180deg, transparent 0%, ${D.black}D9 55%, ${D.black}F2 100%)`,
          opacity: o,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 72,
          right: 72,
          bottom: 210,
          textAlign: 'center',
          fontSize: size,
          fontWeight: 700,
          lineHeight: 1.1,
          letterSpacing: -0.5,
          color,
          opacity: o,
          transform: `translateY(${y}px)`,
          textShadow: '0 8px 40px rgba(0,0,0,0.95)',
        }}
      >
        {text}
      </div>
    </>
  );
};

/** Figure counter, rendered like a readout on the footage. */
export const Readout: React.FC<{
  label: string;
  value: string;
  at: number;
  color?: string;
  x?: number;
  y?: number;
}> = ({label, value, at, color = D.amberHot, x = 72, y = 980}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const w = interpolate(frame, [at + 4, at + 26], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: o}}>
      <div
        style={{
          fontFamily: MONO,
          fontSize: 24,
          letterSpacing: 6,
          color: D.ice,
          marginBottom: 12,
        }}
      >
        {label}
      </div>
      <div style={{fontSize: 104, fontWeight: 700, color, letterSpacing: -3}}>
        {value}
      </div>
      <div
        style={{
          height: 3,
          marginTop: 12,
          width: 420 * w,
          background: color,
          opacity: 0.7,
        }}
      />
    </div>
  );
};
