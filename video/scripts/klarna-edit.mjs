// Klarna Short — the edit definition, and the only place timing is decided.
//
// WHAT THE SUPPLIED FILE ACTUALLY IS
// The .mov is not a cut. It is 16 static stills, each held a flat 3.00s — 48.0s
// of picture, then 125.2s of black — carrying a voiceover of the *long-form*
// 47-scene script: 173.28s of narration against 48s of image. Measured, not
// assumed: 16 hard cuts at exactly 3.0s intervals, blackdetect from 48.04s, and
// a mean intra-clip pixel delta of ~0.3/255 (i.e. nothing moves).
//
// The image pack (klarnaimageprompts.txt v2) specifies a 55.37s Short over those
// same 16 frames. So the picture is right, and the audio is the wrong cut of the
// right read. This file re-cuts the narration: per frame it selects the sentences
// from the long read that carry that frame's idea. The voice, room tone and
// delivery are the supplied ones — nothing is re-synthesised.
//
// SPANS are seconds into the supplied audio, from a forced alignment of the known
// script (klarna-scene-pack.txt VOICEOVER block) against the file's own speech and
// silence boundaries. Spans are padded into the natural room tone either side, so
// joins carry the original ambience rather than digital silence.
//
// THE PACK'S CUT TABLE IS HONOURED AS A SPEC, NOT A STOPWATCH. Frame order,
// per-frame move, hold discipline and the under-60s constraint all hold. Exact
// in-points land on the sentence rather than on the pack's arithmetic — which is
// what the pack itself asks for ("Cut on the caption instead where you can").
//
// NUMBERS ARE ON £90, NOT £75. The pack's burn-in table is internally inconsistent:
// F01/F02A carry "4 × £22.50" (= £90) and F04/F08/F09/F10 carry a £75 basket. The
// voiceover is unambiguously on £90 ("A ninety pound jacket", "the shop kept
// eighty-five"), and the audio cannot be changed without re-synthesising the read.
// So every figure here is arithmetic off £90 and agrees with what is being said.

export const SOURCE_STILL_COUNT = 16;

/** Pad taken into the surrounding room tone, seconds. */
export const PAD_IN = 0.14;
export const PAD_OUT = 0.20;

/**
 * One entry per still, in pack order F01 … F11B.
 *   vo      — list of [start, end] spans in the supplied audio, spoken in order
 *   join    — silence between consecutive vo spans (tightens the original pause)
 *   gap     — silence held after this frame's last span
 *   move    — the pack's MOVE column; push is total travel, eased out
 *   cold    — suppress the warm amber grade (F06B is the one cold frame)
 *   cap     — burn-in caption
 *   num     — burn-in figure
 */
export const EDIT = [
  {
    id: 'F01', still: 1, vo: [[0.0, 1.88]], gap: 0.8,
    figureY: 545,
    move: {push: 0.06},
    cap: 'Four payments.\nZero interest.',
    num: {kind: 'hook', text: '4 payments of £22.50', sub: '0% interest'},
  },
  {
    id: 'F02A', still: 2, vo: [[26.13, 27.79]], gap: 0.4,
    figureY: 655,
    move: {push: 0.04},
    cap: 'Four payments of\n£22.50.',
    num: {kind: 'chip', text: '£22.50 × 4  =  £90'},
  },
  {
    id: 'F02B', still: 3, vo: [[2.8, 5.34]], gap: 0.4,
    figureY: 655,
    move: {push: -0.08, dx: -30},
    cap: 'So who is paying\nfor it?',
    num: {kind: 'chip', text: 'the fifth payment: ?'},
  },
  {
    id: 'F03', still: 4, vo: [[28.68, 30.68]], gap: 0.35,
    figureY: 800,
    move: {push: 0.05},
    cap: 'The shop does not\nreceive £90.',
    num: {kind: 'split', from: '£90', to: '£85', note: '−6% to Klarna'},
  },
  {
    id: 'F04', still: 5, vo: [[51.78, 54.2]], gap: 0.3,
    figureY: 800,
    move: {push: 0.09},
    cap: 'It builds it into\nthe sticker.',
    num: {kind: 'arrow', from: '£90.00', to: '£95.40'},
  },
  {
    id: 'F05A', still: 6, vo: [[55.15, 57.19]], gap: 0.25,
    move: {push: 0.1},
    cap: 'The price goes up.\nFor everyone.',
    num: null,
  },
  {
    id: 'F05B', still: 7, vo: [[57.77, 58.67], [59.42, 61.02]], join: 0.26, gap: 0.25,
    move: {push: 0.06},
    cap: 'Including the man\npaying cash.',
    num: null,
  },
  {
    id: 'F06A', still: 8, vo: [[62.3, 63.74]], gap: 0.4,
    move: {push: 0.07, dy: 20},
    cap: 'He pays for it\nanyway.',
    num: null,
  },
  {
    id: 'F06B', still: 9, vo: [[67.65, 69.86]], gap: 0.4,
    figureY: 790,
    move: {push: 0.08},
    cold: true,
    cap: 'Then the late fee.',
    num: {kind: 'alert', text: 'LATE FEE'},
  },
  {
    id: 'F07A', still: 10, vo: [[76.93, 78.08], [78.69, 80.6]], join: 0.16, gap: 0.18,
    figureY: 800,
    move: {push: 0.06, dy: -40},
    cap: 'Split it in four,\nand people spend more.',
    num: {kind: 'chip', text: 'BIGGER BASKET'},
  },
  {
    id: 'F07B', still: 11, vo: [[81.89, 85.6]], gap: 0.3,
    move: {push: 0.05},
    cap: "That's not a side effect.\nThat's the product.",
    num: null,
  },
  {
    id: 'F08', still: 12, vo: [[158.37, 160.75]], gap: 0.8,
    figureY: 1330,
    move: {},                    // pack: NONE. Dead still — the price stops moving.
    cap: 'One price.\nOne owner.\nNo penalty.',
    num: {kind: 'locked', text: '£90.00', sub: 'LOCKED'},
  },
  {
    id: 'F09', still: 13, vo: [[139.29, 140.77]], gap: 0.5,
    figureY: 790,
    move: {dx: 30},
    cap: "It's called murabaha.",
    num: {kind: 'sum', text: 'COST £75  +  MARKUP £15  =  £90 FIXED'},
  },
  {
    id: 'F10', still: 14, vo: [[162.25, 164.07]], gap: 0.35,
    figureY: 1545,
    move: {push: 0.12},
    cap: '"Pay later" was never\nthe problem.',
    num: {kind: 'cracked', text: '£90.00'},
  },
  {
    id: 'F11A', still: 15, vo: [[164.96, 167.92]], gap: 0.3,
    figureY: 800,
    move: {push: 0.04},
    cap: 'The problem is who\nearns on the "later".',
    num: {kind: 'chip', text: '0% is never zero'},
  },
  {
    id: 'F11B', still: 16, vo: [[168.3, 172.95]], gap: 0.45,
    move: {push: 0.03},
    cap: 'Three questions.\nAsk them before you click.',
    num: null,
  },
];

/** Spoken length of one entry, including the tightened joins between its spans. */
export const speechOf = (e) => {
  const spans = e.vo.reduce((t, [a, b]) => t + (b - a), 0);
  const joins = (e.vo.length - 1) * (e.join ?? 0.26);
  return spans + joins;
};

/** Seconds of picture for one entry: padded speech + the gap held after it. */
export const spanOf = (e) => speechOf(e) + PAD_IN + PAD_OUT + e.gap;

export const totalSeconds = () => EDIT.reduce((t, e) => t + spanOf(e), 0);
