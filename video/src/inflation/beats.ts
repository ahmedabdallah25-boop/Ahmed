import {L} from '../longform/ui';
import {CUTS, SOURCE_FRAMES} from './cuts';

// ─────────────────────────────────────────────────────────────────────────────
// Graphic beats.
//
// Every beat is anchored to a scene index — that is, to a cut the footage
// already makes — so a graphic never lands mid-shot. The brief was
// "punctuated": the photography leads, and a graphic arrives on roughly every
// second or third cut to hit a mechanism beat.
//
// ── WHAT A BEAT IS ALLOWED TO SAY ───────────────────────────────────────────
// Captions now carry every line of the voiceover, so a graphic that restates
// the line under it is just the same sentence twice in two type sizes. The
// first pass did exactly that — a "Same bread" card sitting under a "More
// money. Same bread." caption — and it read as a bug.
//
// So the division is strict:
//   * TAGS name the film's STRUCTURE — the symptom, the mechanism, the cost,
//     the fix. Four of them, one per movement. They are chapter markers, and
//     they never quote the narration.
//   * CARDS, BARS and CALLOUTS carry a figure or a mechanic the narration does
//     not state outright — a price, a supply curve, a thing to point at.
// If a beat can only repeat its caption, it is cut. The hero frame (pack 20)
// and the emotional peak (pack 25) are deliberately left to the caption alone.
//
// Placement rule: a beat and its scene's caption are never in the same third of
// the frame. Captions default to the top (see ./placement.ts), so most beats sit
// low; where a caption is pushed low, its beat goes up.
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
  // ── I · the symptom ───────────────────────────────────────────────────────
  {
    kind: 'tag',
    // pack 06 · the character reading his payslip in the aisle. First movement:
    // something is wrong and it shows up at the till.
    scene: 5,
    text: 'The symptom',
    anchor: {x: 0.5, y: 0.8},
  },

  // ── II · the mechanism ────────────────────────────────────────────────────
  {
    kind: 'bar',
    // pack 12 · the endless grid of notes. The grid is the supply; the bar is
    // what the supply does to each note. This is the film's central mechanic
    // and it is mirrored in green at scene 31.
    scene: 11,
    label: 'What each note buys',
    from: 1,
    to: 0.66,
    accent: L.red,
    caption: 'Supply up. Value down.',
    anchor: {x: 0.5, y: 0.75},
  },
  {
    kind: 'tag',
    // pack 13 · the banker, "Money isn't printed. It is LENT into existence."
    // Caption sits low in this shot (his hat is high), so the tag takes the top.
    scene: 12,
    text: 'The mechanism',
    anchor: {x: 0.5, y: 0.16},
  },
  // pack 16, the empty vault, deliberately carries no graphic. A callout
  // pointing into it can only say "nothing in here", and that scene's own
  // caption already reads "there was nothing in there". The shot makes the
  // point on its own; the beat that followed it makes the sharper one.
  {
    kind: 'callout',
    // pack 17 · the monitor. The dot lands left of the numeral and the elbow
    // drops into the dark desk; routing right would lay the label across the
    // number it is pointing at.
    scene: 16,
    text: 'One keystroke',
    dir: 'right',
    run: 150,
    drop: 250,
    anchor: {x: 0.2, y: 0.45, align: 'anchor'},
  },

  // ── III · the cost ────────────────────────────────────────────────────────
  // Note the gap here: pack 20, the hero frame the pack says "has to be
  // understood", carries no graphic at all. Its caption already says "More
  // money. Same bread." — anything else on that frame is noise.
  {
    kind: 'stat',
    // pack 21 · the shelf price is legible in the shot and reads $3.49, so the
    // card matches it. A card that disagrees with the thing beside it costs
    // more credibility than the currency choice is worth.
    scene: 20,
    label: 'The shelf',
    value: '$3.49',
    sub: 'Your wage did not move.',
    accent: L.red,
    anchor: {x: 0.06, y: 0.72, align: 'left'},
  },
  {
    kind: 'tag',
    // pack 25 · THUMBNAIL CANDIDATE, the lone figure under the sky. The caption
    // names the tax; the tag only marks the movement.
    scene: 24,
    text: 'The cost',
    color: L.red,
    anchor: {x: 0.5, y: 0.46},
  },

  // ── IV · the fix ──────────────────────────────────────────────────────────
  // The one place the reserved Z vector is spent: the film turns here, from
  // what is being done to you to what you can do about it. Matching entry and
  // exit signs mean the conclusion rises out of the problem rather than sliding
  // in beside it. See hyperframes/inflation-ledger.json.
  {
    kind: 'tag',
    // pack 29 · the cut to gold and silver. The footage turns here too.
    scene: 28,
    text: 'The fix',
    color: L.green,
    anchor: {x: 0.5, y: 0.2},
    entry: 'arrival',
    exit: 'arrival',
  },
  {
    kind: 'stat',
    // pack 30 · the coin's milled edge. The narration says you cannot type gold
    // into existence; the card gives the reason underneath it.
    scene: 29,
    label: 'Issuer',
    value: 'None',
    sub: 'Nobody can add to it.',
    accent: L.gold,
    anchor: {x: 0.5, y: 0.76},
  },
  {
    kind: 'bar',
    // pack 32 · the coin going into the box. Deliberately the same label and
    // shape as the red bar at scene 11 — the rhyme is the argument.
    scene: 31,
    label: 'What each coin buys',
    from: 0.62,
    to: 1,
    accent: L.green,
    caption: 'Supply fixed. Value held.',
    anchor: {x: 0.5, y: 0.24},
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
