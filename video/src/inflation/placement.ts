// Where a caption may sit in each scene, so it never covers the subject.
//
// This is hand-authored, not generated. scripts/analyse-frames.py scores the
// three candidate bands of every scene for busy-ness and produces a draft, but
// the score is a proxy — it cannot tell a face from a texture. Every entry
// below was set by looking at the contact sheet that script builds, and the
// comment names what is actually in the shot so the next person can re-judge it
// without re-deriving anything.
//
// There is no true "behind the subject" compositing here. That needs a subject
// matte, and no segmentation model is reachable from the build environment. The
// substitute is honest: put the type in the part of the frame that is genuinely
// empty, and lay a soft radial scrim under it so it reads as part of the image
// rather than stuck on top.

export type Zone = 'top' | 'middle' | 'bottom';

/**
 * Vertical anchor of each zone, as a fraction of frame height, measured to the
 * caption block's centre.
 *
 * These are pulled in from the frame edges further than the analysis bands
 * because this is a Short: YouTube's own UI eats roughly the bottom 14% (title,
 * channel, description) and the right 16% (like/comment/share rail). `bottom`
 * therefore sits higher than a 16:9 lower-third would, and no caption runs the
 * full width — see CAPTION_MAX_WIDTH.
 */
export const ZONE_Y: Record<Zone, number> = {
  top: 0.19,
  middle: 0.5,
  bottom: 0.72,
};

/** Fraction of frame width a caption block may occupy, clear of the action rail. */
export const CAPTION_MAX_WIDTH = 0.82;

/**
 * One zone per detected scene, indexed to CUTS in ./cuts.ts.
 *
 * The footage is a faceless 3D character moving through money scenarios, so
 * "the subject" is usually either the character or the one object the shot is
 * about (a receipt, a price, a coin). Both are protected.
 */
export const PLACEMENT: Zone[] = [
  'top', // 0  supermarket aisle, character at the checkout — ceiling is clear
  'top', // 1  receipt curling through frame, blurred store behind
  'top', // 2  mailbox on a cream wall, letters — plain wall above
  'bottom', // 3  man in hat at a desk; his hat is high in frame, so go low
  'top', // 4  crumpled paper on dark wood — top is near-black
  'top', // 5  supermarket aisle again, character reading a receipt
  'top', // 6  dark room, character at a desk under a hanging lamp
  'top', // 7  papers pinned to a dark board
  'top', // 8  banknote and document on a dark table
  'top', // 9  wide dark office, small figure at a desk
  'top', // 10 extreme close-up of a $100 bill — keep off Franklin's face
  'top', // 11 endless grid of money stacks receding to a horizon; sky above
  'bottom', // 12 character at an office desk, hat sits in the top band
  'top', // 13 hand signing a document, warm pool of light; top is dark
  'bottom', // 14 money stack in a light beam — floor below is empty
  'bottom', // 15 blue-lit vault corridor, clean reflective floor
  'top', // 16 monitor reading 4,512.67 — the number must stay uncovered
  'top', // 17 aerial suburb, busy everywhere; top is marginally calmest
  'top', // 18 removal truck, two characters lifting a box; open sky above
  'bottom', // 19 tall money stack beside a small loaf — bare concrete below
  'top', // 20 supermarket, character reaching a shelf; price tag stays clear
  'top', // 21 character on a dark teal street at night
  'top', // 22 cream wall, small meter box, hard shadow — very clean above
  'top', // 23 petrol station at night, character refuelling a red car
  'middle', // 24 tiny figure under an enormous empty sky — type floats in it
  'top', // 25 dark office, chair and documents on a desk
  'top', // 26 concrete wall with a circular sculpture
  'bottom', // 27 character sitting on steps with a phone; roof and tree above
  'bottom', // 28 gold coins close-up on black — the area below them is empty
  'top', // 29 extreme close-up of a coin edge; top is pure black
  'top', // 30 two characters carrying a crate through orange haze
  'bottom', // 31 hands placing coins into a wooden box; table below is clear
  'top', // 32 character walking past a brick house at sunset
  'top', // 33 vault door, dark blue — top is deep shadow
  'top', // 34 two houses at sunset, open sky above the rooflines
  'bottom', // 35 blurred house at golden hour — soft grass below
];

/** Zone for the scene containing a frame; falls back to bottom past the end. */
export const zoneForScene = (scene: number): Zone => PLACEMENT[scene] ?? 'bottom';
