import {L} from '../longform/ui';
import {CUTS, SOURCE_FRAMES} from './cuts';

// ─────────────────────────────────────────────────────────────────────────────
// Graphic beats.
//
// Every beat is anchored to a scene index — that is, to a cut the footage
// already makes — so a graphic never lands in the middle of a shot. The brief
// was "punctuated": the photography leads, and a graphic arrives on roughly
// every second or third cut to hit a mechanism beat.
//
// Each beat's `anchor` is chosen against two things: what is in that shot (see
// the contact sheet from scripts/analyse-frames.py) and where that scene's
// caption sits (./placement.ts). A beat and a caption are never put in the same
// third of the frame.
//
// ── ON THE WORDING AND THE FIGURES ──────────────────────────────────────────
// The recording's script has not been supplied yet, so the copy below is drawn
// from the channel's own Part 14 inflation script in src/Short.tsx — same
// topic, same voice, already written by hand. It is deliberately the nearest
// true source rather than invented filler, but it is still PROVISIONAL: every
// figure must be checked against what the voiceover actually says before this
// ships, because a number on screen that contradicts the narration is worse
// than no number at all. Changing them is a one-line edit each.
// ─────────────────────────────────────────────────────────────────────────────

export type Anchor = {
  /** Fractions of frame width/height. */
  x: number;
  y: number;
  /**
   * How the element sits relative to the point. 'anchor' places the element's
   * own origin there instead of centring it — callouts use this so the anchor
   * is the dot that touches the subject.
   */
  align?: 'left' | 'center' | 'right' | 'anchor';
};

type Common = {
  /** Index into CUTS — the beat starts on this cut. */
  scene: number;
  /** Frames to hold. Defaults to the scene's own length, minus a little. */
  hold?: number;
  anchor: Anchor;
  /**
   * 'arrival' spends the reserved Z vector. Per the HyperFrames ledger it is
   * used exactly once, on the problem → fix boundary.
   */
  entry?: 'current' | 'arrival';
  exit?: 'current' | 'arrival';
};

export type Beat = Common &
  (
    | {kind: 'tag'; text: string; color?: string}
    | {kind: 'stat'; label: string; value: string; sub?: string; accent: string}
    | {
        kind: 'count';
        label: string;
        from: number;
        to: number;
        accent: string;
        format: 'pct' | 'gbp' | 'plain';
        sub?: string;
      }
    | {
        kind: 'bar';
        label: string;
        from: number;
        to: number;
        accent: string;
        caption?: string;
      }
    | {
        kind: 'callout';
        text: string;
        accent?: string;
        dir?: 'left' | 'right';
        run?: number;
        drop?: number;
      }
  );

export const BEATS: Beat[] = [
  // ── the receipt ───────────────────────────────────────────────────────────
  {
    kind: 'tag',
    scene: 2, // mailbox and letters — caption is up top, so this sits low
    text: 'The receipt',
    anchor: {x: 0.09, y: 0.79, align: 'left'},
  },
  {
    kind: 'stat',
    scene: 4, // crumpled paper on dark wood
    label: 'What your money now buys',
    value: '−2%',
    sub: 'Same wage. Smaller basket.',
    accent: L.red,
    anchor: {x: 0.5, y: 0.75},
  },

  // ── the mechanism ─────────────────────────────────────────────────────────
  {
    kind: 'tag',
    scene: 10, // extreme close-up of a banknote
    text: 'The mechanism',
    anchor: {x: 0.09, y: 0.8, align: 'left'},
  },
  {
    kind: 'bar',
    scene: 11, // endless grid of money stacks — the bar belongs over this
    label: 'Purchasing power',
    from: 1,
    to: 0.82,
    accent: L.red,
    caption: 'Nobody took it out of your account.',
    anchor: {x: 0.5, y: 0.74},
  },
  {
    kind: 'callout',
    // Monitor reading 4,512.67. The dot lands just left of the figure and the
    // elbow drops into the dark desk below it — routing the label to the right
    // would lay it straight across the number the callout is pointing at.
    scene: 16,
    text: 'Still the same number',
    dir: 'right',
    run: 150,
    drop: 250,
    anchor: {x: 0.2, y: 0.45, align: 'anchor'},
  },

  // ── what it costs ─────────────────────────────────────────────────────────
  {
    kind: 'stat',
    // Tall money stack beside a small loaf. The stack IS the shot, so the card
    // goes right, over the bare wall, rather than centred across the stack.
    scene: 19,
    label: 'Ten years',
    value: '−34%',
    sub: 'The stack grew.\nThe basket shrank.',
    accent: L.red,
    anchor: {x: 0.96, y: 0.2, align: 'right'},
  },
  {
    kind: 'stat',
    // Supermarket shelf. Everything in this frame is busy — shelves left, the
    // character reaching on the right, the price tag low-centre — so a callout
    // has nowhere clean to route its label. A card on its own backing holds up
    // over the clutter; it sits left to leave the price tag readable.
    scene: 20,
    label: 'The shelf',
    // The price tag is legible in this shot and reads $3.49, so the card says
    // dollars too. A card that disagrees with the thing it is sitting next to
    // costs more credibility than the currency choice is worth.
    value: '$3.49',
    sub: 'Was $2.60.',
    accent: L.red,
    anchor: {x: 0.06, y: 0.72, align: 'left'},
  },
  {
    kind: 'count',
    scene: 24, // tiny figure under an enormous sky; caption sits mid-frame
    label: 'Printed since 2020',
    from: 0,
    to: 9.2,
    format: 'plain',
    sub: 'trillion, out of nothing',
    accent: L.red,
    anchor: {x: 0.5, y: 0.2},
  },
  {
    kind: 'tag',
    scene: 26, // concrete wall and sculpture
    text: 'Why it happens',
    anchor: {x: 0.09, y: 0.8, align: 'left'},
  },

  // ── the fix ───────────────────────────────────────────────────────────────
  // The one place the reserved Z vector is spent: the film turns here, from
  // what is being done to you to what you can do about it. Matching entry and
  // exit signs mean the conclusion rises out of the problem rather than
  // sliding in beside it. See hyperframes/inflation-ledger.json.
  {
    kind: 'tag',
    scene: 28, // gold coins emerging from black
    text: 'The fix',
    color: L.green,
    anchor: {x: 0.5, y: 0.2},
    entry: 'arrival',
    exit: 'arrival',
  },
  {
    kind: 'stat',
    scene: 29, // extreme close-up of a coin edge
    label: 'Money they cannot print',
    value: '0%',
    sub: 'No issuer. No dilution.',
    accent: L.gold,
    anchor: {x: 0.5, y: 0.74},
  },
  {
    kind: 'bar',
    scene: 31, // hands placing coins into a box
    label: 'Purchasing power',
    from: 0.55,
    to: 1,
    accent: L.green,
    caption: '1,400 years old. Still the only exit.',
    anchor: {x: 0.5, y: 0.24},
  },
  {
    kind: 'tag',
    scene: 34, // two houses at sunset — the close
    text: 'No jargon. Just mechanisms.',
    anchor: {x: 0.09, y: 0.8, align: 'left'},
  },
];

/** Absolute frame window for a beat, derived from the cut it is anchored to. */
export const beatWindow = (b: Beat) => {
  const from = CUTS[b.scene];
  const sceneEnd = b.scene + 1 < CUTS.length ? CUTS[b.scene + 1] : SOURCE_FRAMES;
  // Default: hold for the shot, handing back a few frames so the graphic is
  // gone before the picture changes under it.
  const dur = b.hold ?? Math.max(sceneEnd - from - 3, 18);
  return {from, dur};
};
