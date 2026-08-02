// Where a caption may sit in each scene, so it never covers the subject.
//
// Hand-authored, not generated. scripts/analyse-frames.py scores the three
// candidate bands of every scene for busy-ness and builds a labelled contact
// sheet, but the score is a proxy — it cannot tell a subject from a texture.
// Every entry below was set by looking at that sheet, then checked against the
// scene pack's own image prompt for the shot.
//
// ── WHY TOP IS THE DEFAULT ──────────────────────────────────────────────────
// The pack's burn-in spec says "POSITION: lower third". Its image prompts say
// the opposite, all 37 of them: "subject in the lower two-thirds, clean
// headroom above for captions". The footage was generated from the prompts, so
// the subject really is low in frame and the room really is up top — a
// lower-third caption would sit on the character in most shots. Captions
// therefore go where the pictures actually left room. Settled with the author.
//
// The exceptions below are the shots where the top is genuinely occupied:
// the banker's bucket hat sits high, a few close-ups fill the upper frame.
//
// There is no true "behind the subject" compositing here. That needs a subject
// matte, and no segmentation model is reachable from the build environment. The
// substitute is honest: put the type in the part of the frame that is genuinely
// empty, and lay a soft scrim under it so it reads as part of the image rather
// than stuck on top.

export type Zone = 'top' | 'middle' | 'bottom';

/**
 * Vertical anchor of each zone, as a fraction of frame height, measured to the
 * caption block's centre.
 *
 * Pulled in from the frame edges further than the analysis bands because this
 * is a Short: YouTube's UI eats roughly the bottom 14% (title, channel,
 * description) and the right 16% (like/comment/share rail). `bottom` therefore
 * sits higher than a 16:9 lower-third would, and no caption runs the full
 * width — see CAPTION_MAX_WIDTH.
 */
export const ZONE_Y: Record<Zone, number> = {
  top: 0.19,
  middle: 0.5,
  bottom: 0.72,
};

/** Fraction of frame width a caption block may occupy, clear of the action rail. */
export const CAPTION_MAX_WIDTH = 0.82;

/**
 * One zone per detected scene, indexed to CUTS in ./cuts.ts. The comment gives
 * the scene pack's number for that cut — they run 1:1 until pack scene 35, the
 * balance scale, which was never generated (see make-inflation-captions.mjs).
 */
export const PLACEMENT: Zone[] = [
  'top', // 0  pack 01 · supermarket checkout, character reading a receipt
  'top', // 1  pack 02 · extreme close-up, hands holding the receipt
  'top', // 2  pack 03 · empty letterbox on a cream wall
  'bottom', // 3  pack 04 · banker at his desk — the navy bucket hat sits high
  'top', // 4  pack 05 · macro of a worn banknote, near-black above
  'top', // 5  pack 06 · supermarket aisle, character holding a payslip
  'top', // 6  pack 07 · kitchen table at night, bills under a pendant lamp
  'top', // 7  pack 08 · overhead scatter of unpaid bills
  'top', // 8  pack 09 · one crisp banknote alone on a table
  'top', // 9  pack 10 · the same note beside a half-full grocery bag
  'top', // 10 pack 11 · extreme macro of the banknote surface
  'top', // 11 pack 12 · endless grid of notes to the horizon; open sky above
  'bottom', // 12 pack 13 · banker at the desk again — hat high in frame
  'top', // 13 pack 14 · macro, pen nib on the signature line
  'bottom', // 14 pack 15 · stack of notes on the desk, empty surface below
  'bottom', // 15 pack 16 · open vault, clean reflective floor
  'top', // 16 pack 17 · monitor showing the rising numeral — keep it uncovered
  'top', // 17 pack 18 · aerial suburb; busy everywhere, sky at the very top
  'top', // 18 pack 19 · two workers lifting a box at the truck; open sky
  'bottom', // 19 pack 20 · HERO — the stack rises out of frame, so type goes low
  'top', // 20 pack 21 · supermarket shelf; the price tag stays clear
  'top', // 21 pack 22 · night bus stop, dark space above
  'top', // 22 pack 23 · letterbox callback, plain cream wall
  'top', // 23 pack 24 · petrol station at night
  'top', // 24 pack 25 · THUMBNAIL — lone figure under an enormous sky
  'top', // 25 pack 26 · the signed loan document, alone on the desk
  'top', // 26 pack 27 · banknotes in a closed ring on concrete
  'bottom', // 27 pack 28 · character on the doorstep — roof and tree fill the top
  'bottom', // 28 pack 29 · gold and silver coins; the tag beat takes the top
  'top', // 29 pack 30 · macro of the coin's milled edge
  'top', // 30 pack 31 · two workers lifting a crate at dusk
  'bottom', // 31 pack 32 · a coin going into the wooden box; the bar takes the top
  'top', // 32 pack 33 · character at his own front gate, golden hour
  'top', // 33 pack 34 · the vault door swinging closed
  'top', // 34 pack 36 · empty house frontage (also carries pack 35's caption)
  'middle', // 35 pack 37 · END CARD — blurred plate, nothing to avoid
];

/** Zone for the scene containing a frame; falls back to bottom past the end. */
export const zoneForScene = (scene: number): Zone => PLACEMENT[scene] ?? 'bottom';
