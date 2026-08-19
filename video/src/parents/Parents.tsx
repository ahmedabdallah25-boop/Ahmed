import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import './fonts';
import {FONT, NASKH, P} from './palette';
import {Event, EVENTS, FPS, VO} from './timeline';

// A shot: one still, one move. Nothing in this film moves faster than about 4%
// of frame width per second (pack, section 06), and every move here is a fixed
// total travel rather than a rate, which puts the fastest of them well inside
// that. The move itself comes from the timeline — a still gets a slow push, a
// re-frame gets the specific move the pack wrote for it.
const Shot: React.FC<{event: Event}> = ({event}) => {
  const frame = useCurrentFrame();
  const dur = Math.max(event.durationInFrames - 1, 1);
  const t = interpolate(frame, [0, dur], [0, 1], {extrapolateRight: 'clamp'});

  const scale = interpolate(t, [0, 1], [event.scaleFrom, event.scaleTo]);
  // A lateral move holds its scale and travels sideways instead. The scale it
  // holds is what makes the travel possible without exposing the frame edge.
  const x = event.move === 'lateral' ? interpolate(t, [0, 1], [-5, 5]) : 0;

  return (
    <AbsoluteFill style={{backgroundColor: P.cream, overflow: 'hidden'}}>
      <Img
        src={staticFile(`parents/${event.asset}`)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale}) translateX(${x}%)`,
        }}
      />
    </AbsoluteFill>
  );
};

// A shot whose still has not been generated yet. It holds its full duration so
// the cut stays whole and every later timecode stays true, and it says on the
// frame which shot is missing — a hole you can see beats a hole you cannot.
const Slate: React.FC<{event: Event}> = ({event}) => (
  <AbsoluteFill
    style={{
      backgroundColor: P.cream,
      color: P.navy,
      fontFamily: FONT,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 12%',
      textAlign: 'center',
      gap: 28,
    }}
  >
    <div style={{fontSize: 34, letterSpacing: 6, color: P.ochre, fontWeight: 700}}>
      NOT YET GENERATED
    </div>
    <div style={{fontSize: 96, fontWeight: 800, letterSpacing: -2}}>
      {event.id}
      {event.parent ? ` — re-frame of ${event.parent}` : ''}
    </div>
    <div style={{fontSize: 30, lineHeight: 1.5, opacity: 0.72, maxWidth: 1200}}>
      {event.note}…
    </div>
  </AbsoluteFill>
);

// One of the nine Quranic cards. Typeset here, never generated: an image model
// asked for Arabic returns convincing nonsense, and on a channel called Clarity
// in the Quran that is the error you do not come back from.
//
// The text still needs a human proof against a mushaf before publish — a
// diacritic lost to a font substitution is invisible from here. That is the
// pack's own highest-risk item and this component does not discharge it.
const Card: React.FC<{event: Event}> = ({event}) => {
  const frame = useCurrentFrame();
  const dur = Math.max(event.durationInFrames - 1, 1);
  // The pack allows the cards one move and one only: a 3% push.
  const scale = interpolate(frame, [0, dur], [1, 1.03], {extrapolateRight: 'clamp'});
  const fade = interpolate(frame, [0, 8], [0, 1], {extrapolateRight: 'clamp'});

  const [left, right] = event.split ? event.arabic.split('/') : [event.arabic, null];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: P.cream,
        color: P.navy,
        fontFamily: FONT,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fade,
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 80,
          direction: 'rtl',
        }}
      >
        <div style={{fontFamily: NASKH, fontSize: event.split ? 130 : 150, lineHeight: 1.6}}>
          {left.trim()}
        </div>
        {right ? (
          <>
            {/* C7 is the only split card — birr left, 'uquq right, a hairline
                rule between. Set rtl, so the first half sits on the right. */}
            <div style={{width: 2, height: 170, backgroundColor: P.navy, opacity: 0.35}} />
            <div style={{fontFamily: NASKH, fontSize: 130, lineHeight: 1.6}}>{right.trim()}</div>
          </>
        ) : null}
      </div>
      <div
        style={{
          marginTop: 46,
          fontSize: 30,
          letterSpacing: 8,
          fontWeight: 600,
          color: P.ochre,
          textTransform: 'uppercase',
        }}
      >
        {event.translit}
      </div>
      <div style={{marginTop: 22, fontSize: 40, maxWidth: 1300, textAlign: 'center'}}>
        {event.meaning}
      </div>
    </AbsoluteFill>
  );
};

export const Parents: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: P.cream}}>
    {/* The assembled read, with the silence for the Quranic cards already cut
        into it by scripts/build-vo-parents.mjs. The picture is timed against
        this exact file — rebuild both together or they drift apart. */}
    <Audio src={staticFile(VO)} />
    {EVENTS.map((event) => (
      <Sequence
        key={event.id}
        from={event.from}
        durationInFrames={event.durationInFrames}
        name={`${event.id} ${event.chapter} ${event.kind}${event.present ? '' : ' MISSING'}`}
      >
        {event.kind === 'card' ? (
          <Card event={event} />
        ) : event.present ? (
          <Shot event={event} />
        ) : (
          <Slate event={event} />
        )}
      </Sequence>
    ))}
  </AbsoluteFill>
);

export const PARENTS_FPS = FPS;
