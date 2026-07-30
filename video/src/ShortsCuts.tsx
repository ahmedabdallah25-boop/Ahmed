import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {CANON} from './longform/amort';
import {gbp} from './longform/amort';
import {L, count, ease, rise} from './longform/ui';
import {FONT, FPS} from './theme';

// Vertical cuts of Episode 2 for the Shorts feed — the channel's proven surface
// (its five 900+ view videos are all Shorts, against a 172-subscriber base).
//
// Each pulls a slice of the SAME VO, so the audio is the real read, not a
// re-record: the audio is trimmed with startFrom/endAt and the visuals are
// rebuilt vertically. Each ends on the same card pointing at the full episode.

const trim = (fromSec: number, toSec: number) => ({
  startFrom: Math.round(fromSec * FPS),
  endAt: Math.round(toSec * FPS),
});

const Stage: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: L.bg, fontFamily: FONT, color: L.ink}}>
    <AbsoluteFill
      style={{
        backgroundImage: `linear-gradient(${L.ink}0A 1px, transparent 1px), linear-gradient(90deg, ${L.ink}0A 1px, transparent 1px)`,
        backgroundSize: '90px 90px',
      }}
    />
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 70% at 50% 30%, transparent 30%, ${L.bg} 100%)`,
      }}
    />
    {children}
  </AbsoluteFill>
);

/**
 * The end card every cut shares. Its whole job is the handoff to the long-form,
 * so it has to say what to DO — naming the payoff without an instruction is how
 * Episode 1 ended up at 2 views. The arrow points down at the description link.
 */
const EndCard: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const r = rise(frame, at, 14);
  return (
    <div
      style={{
        ...r,
        marginTop: 60,
        background: L.panel,
        border: `3px solid ${L.gold}`,
        borderRadius: 18,
        padding: '30px 34px',
      }}
    >
      <div style={{fontSize: 44, fontWeight: 700, color: L.gold, letterSpacing: 2}}>
        WATCH THE FULL BREAKDOWN
      </div>
      <div style={{fontSize: 52, fontWeight: 700, color: L.ink, marginTop: 10, lineHeight: 1.1}}>
        3 halal structures · 4 questions
      </div>
      <div style={{fontSize: 46, fontWeight: 700, color: L.ink, marginTop: 18}}>
        ↓ Link in the description
      </div>
    </div>
  );
};

const Frame: React.FC<{children: React.ReactNode; from: number; to: number}> = ({
  children,
  from,
  to,
}) => (
  <Stage>
    <Audio src={staticFile('vo-ep2.mp3')} {...trim(from, to)} />
    <AbsoluteFill style={{padding: '0 80px', justifyContent: 'center'}}>{children}</AbsoluteFill>
  </Stage>
);

// ── SHORT 1 · the £420 (VO 0.0–16.4s) ────────────────────────────────────────
export const ShortSplit: React.FC = () => {
  const frame = useCurrentFrame();
  const pay = count(frame, 6, 26, 0, CANON.payment);
  const green = ease(frame, 200, 18); // "£420 buys your house" at ~6.9s
  const red = ease(frame, 330, 26); // "the other £1,042 is rent" at ~11.1s
  const H = 150;
  return (
    <Frame from={0} to={16.4}>
      <div style={{fontSize: 40, letterSpacing: 5, color: L.dim, fontWeight: 700}}>
        MONTH 1 · YOUR MORTGAGE PAYMENT
      </div>
      <div style={{fontSize: 150, fontWeight: 700, letterSpacing: -6, marginTop: 8}}>
        {gbp(pay)}
      </div>
      {/* the bar runs vertically so it fills a 9:16 frame */}
      <div style={{position: 'relative', height: 640, marginTop: 50}}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: L.panel,
            border: `2px solid ${L.line}`,
            borderRadius: 18,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 640 * 0.713 * red,
            background: L.red,
            borderRadius: 18,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 640 * 0.287 * green,
            background: L.green,
            borderRadius: 18,
          }}
        />
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 34}}>
        <div style={{...rise(frame, 342, 14)}}>
          <div style={{fontSize: 84, fontWeight: 700, color: L.red}}>{gbp(CANON.m1Interest)}</div>
          <div style={{fontSize: 34, color: L.dim, letterSpacing: 2}}>RENT ON MONEY</div>
        </div>
        <div style={{...rise(frame, 206, 14), textAlign: 'right'}}>
          <div style={{fontSize: 84, fontWeight: 700, color: L.green}}>{gbp(CANON.m1Principal)}</div>
          <div style={{fontSize: 34, color: L.dim, letterSpacing: 2}}>BUYS YOUR HOUSE</div>
        </div>
      </div>
      <div style={{...rise(frame, 440, 16), fontSize: 56, fontWeight: 700, color: L.gold, marginTop: 44}}>
        71% never touches the property.
      </div>
      <EndCard at={470} />
      <div style={{height: H * 0}} />
    </Frame>
  );
};

// ── SHORT 2 · ten years in (VO 20.0–51.2s, trimmed to the payoff) ────────────
export const ShortTenYears: React.FC = () => {
  const frame = useCurrentFrame();
  const bar = (label: string, value: number, w: number, color: string, at: number) => {
    const p = ease(frame, at, 30);
    return (
      <div style={{marginBottom: 60}}>
        <div style={{...rise(frame, at, 12)}}>
          <div style={{fontSize: 36, letterSpacing: 5, color: L.dim, fontWeight: 700}}>{label}</div>
          <div style={{fontSize: 120, fontWeight: 700, color, letterSpacing: -5}}>
            {gbp(count(frame, at, 30, 0, value))}
          </div>
        </div>
        <div style={{height: 40, background: '#FFFFFF0D', borderRadius: 20, marginTop: 10}}>
          <div style={{height: 40, width: `${w * p * 100}%`, background: color, borderRadius: 20}} />
        </div>
      </div>
    );
  };
  return (
    <Frame from={20.03} to={44}>
      <div style={{fontSize: 44, letterSpacing: 5, color: L.gold, fontWeight: 700, marginBottom: 40}}>
        10 YEARS · 120 PAYMENTS · NEVER MISSED
      </div>
      {bar('YOU PAID', CANON.paid10y, 0.86, L.green, 210)}
      {bar('YOU STILL OWE', CANON.owed10y, 0.95, L.red, 300)}
      <div style={{...rise(frame, 400, 16), fontSize: 76, fontWeight: 700, color: L.ink, marginTop: 10, lineHeight: 1.1}}>
        You owe more than you have paid.
      </div>
      <EndCard at={560} />
    </Frame>
  );
};

// ── SHORT 3 · the four questions (VO 472.3–500s) ─────────────────────────────
export const ShortQuestions: React.FC = () => {
  const frame = useCurrentFrame();
  const qs = [
    'Does the bank take legal title?',
    'Is the profit fixed at signing?',
    'Who pays if it burns down?',
    'What happens if you pay late?',
  ];
  return (
    <Frame from={472.31} to={500}>
      <div style={{fontSize: 44, letterSpacing: 5, color: L.red, fontWeight: 700}}>
        IS YOUR ISLAMIC MORTGAGE REAL?
      </div>
      <div style={{fontSize: 118, fontWeight: 700, letterSpacing: -5, marginTop: 14, lineHeight: 1}}>
        FOUR QUESTIONS
      </div>
      <div style={{marginTop: 56}}>
        {qs.map((q, i) => {
          const last = i === 3;
          const at = 90 + i * 90;
          const r = rise(frame, at, 14);
          return (
            <div
              key={i}
              style={{
                ...r,
                background: L.panel,
                borderLeft: `10px solid ${last ? L.gold : L.green}`,
                borderRadius: 14,
                padding: '28px 30px',
                marginBottom: 24,
              }}
            >
              <span style={{fontSize: 44, fontWeight: 700, color: last ? L.gold : L.green, marginRight: 20}}>
                {i + 1}
              </span>
              <span style={{fontSize: 46, color: last ? L.gold : L.ink}}>{q}</span>
            </div>
          );
        })}
      </div>
      <div style={{...rise(frame, 470, 16), fontSize: 48, fontWeight: 700, color: L.dim, marginTop: 30}}>
        Number four is the one nobody asks.
      </div>
      <EndCard at={620} />
    </Frame>
  );
};

export const SHORTS = {
  'Ep2Short-1-Split': {c: ShortSplit, sec: 16.4},
  'Ep2Short-2-TenYears': {c: ShortTenYears, sec: 24},
  'Ep2Short-3-FourQuestions': {c: ShortQuestions, sec: 27.7},
} as const;

// interpolate is used by the helpers above via ui.ts; keep the import honest.
void interpolate;
void Sequence;
