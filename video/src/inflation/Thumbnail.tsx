import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {FONT} from '../theme';
import {L} from '../longform/ui';

// Three thumbnail options for the Inflation short, each testing a different
// hook, in the same spirit as the five Episode 2 options in ../Thumbnails.tsx.
//
//   A  the mechanism  — MORE MONEY / SAME BREAD   (the hero frame)
//   B  the stakes     — THE TAX NOBODY VOTED FOR  (the pack's own pick)
//   C  the fix        — MONEY THEY CANNOT PRINT   (gold)
//
// These are 1080x1920, not 1280x720. A Short's custom thumbnail is shown in the
// channel's Shorts grid, in search and in the subscriptions feed — never in the
// Shorts feed itself, which just plays the video. So it is worth having, but it
// is a browse-and-search asset, not the thing that wins the swipe.
//
// Rules held across all three, carried over from the Episode 2 set: at most two
// visual elements, headline type large enough to survive a thumbnail shelf, and
// nothing that has to be read at full size to work. The base image does the
// storytelling; the type only names the claim.

export const THUMB_W = 1080;
export const THUMB_H = 1920;

const Base: React.FC<{file: string; children: React.ReactNode}> = ({file, children}) => (
  <AbsoluteFill style={{background: L.bg, fontFamily: FONT}}>
    <Img
      src={staticFile(file)}
      style={{width: '100%', height: '100%', objectFit: 'cover'}}
    />
    {children}
  </AbsoluteFill>
);

/** Headline block. Type is set huge and tight — this has to read at grid size. */
const Head: React.FC<{
  lines: {text: string; color?: string}[];
  top?: number;
  size?: number;
}> = ({lines, top = 0.06, size = 132}) => (
  <div
    style={{
      position: 'absolute',
      top: `${top * 100}%`,
      left: 0,
      right: 0,
      padding: '0 56px',
      textAlign: 'center',
    }}
  >
    {lines.map((l, i) => (
      <div
        key={i}
        style={{
          fontSize: size,
          fontWeight: 800,
          lineHeight: 1.02,
          letterSpacing: -size * 0.035,
          textTransform: 'uppercase',
          color: l.color ?? L.ink,
          textShadow:
            '0 6px 22px rgba(0,0,0,0.85), 0 0 70px rgba(0,0,0,0.7)',
        }}
      >
        {l.text}
      </div>
    ))}
  </div>
);

/** Scrim so type holds up over the brighter plates. */
const Scrim: React.FC<{from?: string}> = ({from = 'top'}) => (
  <AbsoluteFill
    style={{
      background:
        from === 'top'
          ? 'linear-gradient(to bottom, rgba(4,6,9,0.82) 0%, rgba(4,6,9,0.35) 30%, rgba(4,6,9,0) 52%)'
          : 'linear-gradient(to top, rgba(4,6,9,0.85) 0%, rgba(4,6,9,0.3) 32%, rgba(4,6,9,0) 55%)',
    }}
  />
);

// ── A · the mechanism ────────────────────────────────────────────────────────
// The hero frame: a tower of notes beside one loaf. This is the option that
// needs no reading at all — the picture is already the argument, and the words
// only confirm what the eye has done.
export const ThumbInflationA: React.FC = () => (
  <Base file="thumb-hero.jpg">
    <Scrim />
    <Head
      lines={[
        {text: 'More money.'},
        {text: 'Same bread.', color: L.red},
      ]}
    />
  </Base>
);

// ── B · the stakes ───────────────────────────────────────────────────────────
// The lone figure under an enormous sky — the scene pack's own thumbnail pick,
// and the film's emotional peak. Weakest at grid size (the subject is tiny), so
// the type carries more here.
export const ThumbInflationB: React.FC = () => (
  <Base file="thumb-stakes.jpg">
    <Scrim />
    <Head
      lines={[{text: 'The tax'}, {text: 'nobody'}, {text: 'voted for', color: L.red}]}
      size={124}
    />
  </Base>
);

// ── C · the fix ──────────────────────────────────────────────────────────────
// Gold and silver on black. The only option that leads with the answer instead
// of the problem — worth testing, because the channel's biggest winners are
// "how to" framings, not grievance framings.
export const ThumbInflationC: React.FC = () => (
  <Base file="thumb-fix.jpg">
    <Scrim from="bottom" />
    <Head
      lines={[{text: 'Money they'}, {text: 'cannot print', color: L.gold}]}
      top={0.62}
      size={126}
    />
  </Base>
);

export const INFLATION_THUMBS = [
  {id: 'Inflation-Thumb-A-MoreMoney', component: ThumbInflationA},
  {id: 'Inflation-Thumb-B-TheTax', component: ThumbInflationB},
  {id: 'Inflation-Thumb-C-CannotPrint', component: ThumbInflationC},
] as const;
