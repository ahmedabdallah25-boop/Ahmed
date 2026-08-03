import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {punch, reveal, seam} from '../motion';
import {FONT} from '../theme';
import {SCENES} from './beats';
import {GRAPHICS, K} from './graphics';

// Anton carries the caption type in the Adobe Express cut of this Short. It is
// not bundled here and fonts.ts explains why nothing in this project fetches a
// font at render time, so the captions use Inter at 900 with the tracking
// pulled in — the same condensed-heavy read, from the font already inlined.
const CAP: React.CSSProperties = {
  position: 'absolute',
  left: 80,
  width: 920,
  fontFamily: FONT,
  textTransform: 'uppercase',
};

/** Caption line: words land one after another, never all at once. */
const Cap1: React.FC<{text: string; hit: number[]}> = ({text, hit}) => {
  const frame = useCurrentFrame();
  const words = text.split(' ');
  return (
    <div
      style={{
        ...CAP,
        top: 1190,
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px 22px',
        fontSize: 104,
        fontWeight: 900,
        lineHeight: 0.94,
        letterSpacing: -3,
        color: K.ink,
      }}
    >
      {words.map((w, i) => {
        const at = 8 + i * 3;
        const r = reveal(frame, at, 9);
        const p = hit.includes(i) ? punch(frame, at + 4) : 1;
        return (
          <span
            key={i}
            style={{
              display: 'block',
              opacity: r.opacity,
              transform: `${r.transform} scale(${p})`,
              transformOrigin: 'left bottom',
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

const Cap2: React.FC<{text: string; at: number}> = ({text, at}) => {
  const frame = useCurrentFrame();
  const r = reveal(frame, at, 10);
  return (
    <div
      style={{
        ...CAP,
        top: 1470,
        textTransform: 'none',
        fontSize: 46,
        fontWeight: 400,
        lineHeight: 1.22,
        color: K.dim,
        opacity: r.opacity,
        transform: r.transform,
      }}
    >
      {text}
    </div>
  );
};

const Wordmark: React.FC = () => {
  const frame = useCurrentFrame();
  const r = reveal(frame, 120, 12);
  return (
    <div
      style={{
        position: 'absolute',
        left: 80,
        top: 1740,
        fontFamily: FONT,
        fontSize: 30,
        fontWeight: 700,
        letterSpacing: 7,
        textTransform: 'uppercase',
        color: '#4A5058',
        opacity: r.opacity,
        transform: r.transform,
      }}
    >
      Finance % Decoded
    </div>
  );
};

export const Klarna: React.FC = () => {
  let from = 0;
  // fontFamily is set on the root, not per-element: the scene graphics are
  // plain divs, and with no inherited family they fall back to a serif.
  return (
    <AbsoluteFill style={{background: K.bg, fontFamily: FONT}}>
      <Audio src={staticFile('klarna-vo.mp3')} />
      {SCENES.map((s, i) => {
        const start = from;
        from += s.dur;
        const G = GRAPHICS[s.id];
        return (
          <Sequence key={s.id} from={start} durationInFrames={s.dur} name={s.id}>
            <Scene dur={s.dur} last={i === SCENES.length - 1}>
              <G />
              <Cap1 text={s.cap1} hit={s.hit ?? []} />
              <Cap2 text={s.cap2} at={8 + s.cap1.split(' ').length * 3 + 6} />
            </Scene>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

/** Seam carrier — every scene enters already in flight and exits still moving. */
const Scene: React.FC<{
  dur: number;
  last: boolean;
  children: React.ReactNode;
}> = ({dur, last, children}) => {
  const frame = useCurrentFrame();
  // The close doesn't slide out — the film has to come to rest on the wordmark.
  const s = seam(frame, dur, 'current', last ? 'lift' : 'current');
  return (
    <AbsoluteFill
      style={{
        transform: `translateX(${s.x}px) scale(${s.scale})`,
        opacity: last ? 1 : s.opacity,
      }}
    >
      {children}
      {last ? <Wordmark /> : null}
    </AbsoluteFill>
  );
};
