// Klarna — the edit definition, and the only place timing is decided.
//
// WHAT THE SUPPLIED FILE IS
// 16 static stills held a flat 3.00s each (48.0s of picture, then 125.2s of
// black) carrying the full 173.28s long-form voiceover. Measured: 16 hard cuts at
// exactly 3.0s intervals, blackdetect from 48.04s, mean intra-clip pixel delta
// ~0.3/255 — nothing moves. So the picture is 16 frames and the narration is a
// 47-scene script, and 125 seconds of it has no picture at all.
//
// WHAT THIS BUILD DOES
// Keeps the film at its supplied length and fills the hole. Every one of the 59
// voiceover lines is force-aligned to the audio's own speech boundaries, and each
// gets a visual: one of the 16 stills where a still depicts that idea, and a
// motion-graphic card where none does. The cards are not filler — the section
// they cover (86s-139s, "so is it halal / ask three questions") is an argument,
// and an argument is better read than illustrated.
//
// Cards carry a darkened, blurred, slowly drifting still behind them rather than
// flat black, so the film keeps looking shot rather than turning into a slide
// deck halfway through.
//
// LENGTH. 173.28s. The two packs disagree — klarnaimageprompts.txt demands under
// 60s, klarna-scene-pack.txt says "~150s sits inside the 133-180s band that
// produced four of this channel's five best videos. Do not cut it to 60s." The
// recorded voiceover is the long-form script, which settles it: the sub-60s cut
// would need a different read. The channel's own buckets back this — the dead
// bucket is 61-90s (n=3, median 6.9 v/day, no survivors); >90s is n=11, median
// 42.4 v/day.
//
// NUMBERS ARE ON £90. The image pack's burn-in table contradicts itself (4 x
// £22.50 = £90 in F01/F02A, a £75 basket from F04 on). The voiceover says "a
// ninety pound jacket" and "the shop kept eighty-five" out loud, so the type
// agrees with the audio.

export const FPS = 30;
export const TOTAL = 173.28;

// Stills, by the pack's frame id:
//  1 F01 phone+hands   2 F02A four cards   3 F02B cards+gap   4 F03 shopkeeper
//  5 F04 tag on jacket 6 F05A aisle        7 F05B figure/till 8 F06A counting
//  9 F06B cold phone  10 F07A basket      11 F07B plinth     12 F08 stamp+card
// 13 F09 jacket+bar   14 F10 cracked      15 F11A Amir       16 F11B walking

/**
 * `at` is the shot's in-point in seconds, taken from the forced alignment so the
 * picture changes on the line it belongs to. Each shot runs until the next one.
 *   still — a still index, with the pack's MOVE for that frame
 *   card  — a motion-graphic card; `bg` is the still blurred behind it
 *   cap   — burn-in caption; \n splits into staggered lines
 *   num   — burn-in figure (see Graphics.tsx)
 */
export const SHOTS = [
  // ── the hook ───────────────────────────────────────────────────────────────
  {at: 0.00, still: 1, move: {push: 0.06}, cap: 'Four payments.\nZero interest.',
   num: {kind: 'hook', text: '4 payments of £22.50', sub: '0% interest'}, figureY: 545},
  {at: 2.60, still: 3, move: {push: -0.08, dx: -30}, cap: 'So who is paying\nfor it?',
   num: {kind: 'chip', text: 'the fifth payment: ?'}, figureY: 655},
  {at: 6.00, card: {type: 'statement', text: 'Because somebody is.', bg: 3}, cap: null, num: null},
  {at: 8.20, card: {type: 'statement', text: 'And it might be you.', sub: 'Just not where you’re looking.', bg: 3}, cap: null, num: null},

  // ── the mechanism ──────────────────────────────────────────────────────────
  {at: 11.30, card: {type: 'statement', text: 'Klarna does not\nlend you money.', accent: 'not', bg: 1}, cap: null, num: null},
  {at: 16.40, still: 4, move: {push: 0.05}, cap: 'It pays the shop.\nToday. In full.', num: null},
  {at: 20.90, card: {type: 'flow', nodes: ['KLARNA', 'THE SHOP', 'YOU'], lit: 2, bg: 4}, cap: 'Then you owe Klarna.', num: null},
  {at: 22.60, card: {type: 'statement', text: 'It decides everything.', bg: 4}, cap: null, num: null},

  // ── the arithmetic ─────────────────────────────────────────────────────────
  {at: 24.60, still: 5, move: {push: 0.09}, cap: 'A £90 jacket.', num: null},
  {at: 25.95, still: 2, move: {push: 0.04}, cap: 'Four payments\nof £22.50.',
   num: {kind: 'chip', text: '£22.50 × 4  =  £90'}, figureY: 655},
  {at: 28.40, still: 4, move: {push: 0.05, dx: 20}, cap: 'The shop does not\nreceive £90.', num: null},
  {at: 31.30, card: {type: 'number', from: '£90', to: '£85', note: 'what the shop actually receives', bg: 4}, cap: null, num: null},
  {at: 34.10, card: {type: 'pct', label: 'KLARNA KEEPS', from: 3, to: 6, bg: 2}, cap: 'Often 3 to 6%.', num: null},
  {at: 39.60, still: 3, move: {push: 0.06}, cap: 'So where did that\n£5 come from?',
   num: {kind: 'chip', text: 'the missing fifth'}, figureY: 655},
  {at: 41.60, card: {type: 'ledger', rows: [['You paid', '£90'], ['The shop kept', '£85']], bg: 2}, cap: null, num: null},
  {at: 44.20, card: {type: 'statement', text: 'It was already\ninside the price.', accent: 'already', bg: 5}, cap: null, num: null},
  {at: 47.20, card: {type: 'statement', text: 'No shop absorbs\nthat fee.', bg: 5}, cap: null, num: null},
  {at: 51.40, still: 5, move: {push: 0.09}, cap: 'It builds it into\nthe sticker.',
   num: {kind: 'arrow', from: '£90.00', to: '£95.40'}, figureY: 800},

  // ── everyone pays ──────────────────────────────────────────────────────────
  {at: 54.90, still: 6, move: {push: 0.10}, cap: 'The price goes up.\nFor everyone.', num: null},
  {at: 57.55, still: 7, move: {push: 0.06}, cap: 'Including the man\npaying cash.', num: null},
  {at: 59.20, still: 8, move: {push: 0.07, dy: 20}, cap: 'He never used Klarna.\nHe pays for it anyway.', num: null},

  // ── the late fee ───────────────────────────────────────────────────────────
  {at: 64.05, still: 9, cold: true, move: {push: 0.05}, cap: 'Then there is\nbeing late.', num: null},
  {at: 67.40, still: 9, cold: true, move: {push: 0.08}, cap: 'Where late fees apply,\nthat is revenue.',
   num: {kind: 'alert', text: 'LATE FEE'}, figureY: 790},
  {at: 70.40, card: {type: 'statement', text: 'A penalty that becomes\ntheir profit.', accent: 'profit', cold: true, bg: 9}, cap: null, num: null},
  {at: 72.50, card: {type: 'statement', text: 'That is the oldest\nobjection there is.', bg: 9}, cap: null, num: null},

  // ── the actual product ─────────────────────────────────────────────────────
  {at: 76.60, still: 10, move: {push: 0.06, dy: -40}, cap: 'Split it in four,\nand people spend more.',
   num: {kind: 'chip', text: 'BIGGER BASKET'}, figureY: 800},
  {at: 81.50, still: 11, move: {push: 0.05}, cap: "That's not a side effect.\nThat's the product.", num: null},

  // ── the three questions ────────────────────────────────────────────────────
  {at: 86.50, card: {type: 'statement', text: 'So is it halal?', big: true, bg: 11}, cap: null, num: null},
  {at: 88.35, card: {type: 'statement', text: 'Don’t ask about the brand.', sub: 'Ask three questions.', accent: 'three', bg: 11}, cap: null, num: null},

  {at: 92.00, card: {type: 'question', n: 'ONE', q: 'Is this a sale,\nor a loan?', bg: 4}, cap: null, num: null},
  {at: 95.80, card: {type: 'flow', nodes: ['KLARNA', 'THE SHOP', 'YOU'], lit: 2, caption: 'They paid the shop. You owe them.', bg: 4}, cap: null, num: null},
  {at: 98.10, card: {type: 'verdict', text: 'THAT IS A LOAN', bg: 4}, cap: null, num: null},

  {at: 100.00, card: {type: 'question', n: 'TWO', q: 'Does anybody profit\nfrom that loan?', bg: 13}, cap: null, num: null},
  {at: 103.40, card: {type: 'ledger', rows: [['From you', 'NO'], ['From the merchant’s fee', 'YES']], bg: 13}, cap: null, num: null},
  {at: 106.60, card: {type: 'statement', text: 'A loan that brings a benefit\nto the lender.', accent: 'benefit', bg: 13}, cap: null, num: null},
  {at: 110.60, card: {type: 'statement', text: 'The exact phrase the\nscholars argue over.', bg: 13}, cap: null, num: null},

  {at: 114.40, card: {type: 'question', n: 'THREE', q: 'Would cash have\nbeen cheaper?',
   sub: 'If later costs more than now, you paid for time.', bg: 8}, cap: null, num: null},
  {at: 118.80, card: {type: 'verdict', text: 'TIME IS NOT THEIRS TO SELL', bg: 8}, cap: null, num: null},

  // ── where scholars differ ──────────────────────────────────────────────────
  {at: 121.00, card: {type: 'balance', head: 'Scholars genuinely differ here.',
   left: ['Same price as cash', 'No late fee', 'No interest'],
   right: ['A penalty', 'A higher price for waiting'], lit: 'left', verdict: 'MANY PERMIT IT', bg: 12}, cap: null, num: null},
  {at: 126.45, card: {type: 'balance', head: 'Scholars genuinely differ here.', left: ['Same price as cash', 'No late fee', 'No interest'],
   right: ['A penalty', 'A higher price for waiting'], lit: 'right', verdict: 'THE DISAGREEMENT ENDS', bg: 12}, cap: null, num: null},

  // ── the fix ────────────────────────────────────────────────────────────────
  {at: 132.40, card: {type: 'statement', text: 'But here is the part\nnobody says.', bg: 13}, cap: null, num: null},
  {at: 134.90, card: {type: 'statement', text: 'Buy now, pay later\nis not the problem.', accent: 'not', bg: 13}, cap: null, num: null},
  {at: 137.10, card: {type: 'era', text: 'Islam has had it for', years: '1,400 years', bg: 13}, cap: null, num: null},

  {at: 139.00, still: 13, move: {dx: 30}, cap: "It's called murabaha.", num: null},
  {at: 141.50, card: {type: 'steps', items: ['The seller buys it', 'Actually owns it', 'Then sells it to you'], bg: 13},
   cap: null, num: null},
  {at: 146.20, still: 12, move: {}, cap: 'One disclosed price,\nfixed at signing.',
   num: {kind: 'sum', text: 'COST £75  +  MARKUP £15  =  £90 FIXED'}, figureY: 1330},
  {at: 150.80, card: {type: 'statement', text: 'Paid over time.', sub: 'Late? You owe the same. Not a penny more.', bg: 12}, cap: null, num: null},
  {at: 158.10, still: 12, move: {}, cap: 'One price.\nOne owner.\nNo penalty.',
   num: {kind: 'locked', text: '£90.00', sub: 'LOCKED'}, figureY: 1330},

  // ── the close ──────────────────────────────────────────────────────────────
  {at: 161.60, still: 14, move: {push: 0.12}, cap: '"Pay later" was never\nthe problem.',
   num: {kind: 'cracked', text: '£90.00'}, figureY: 1545},
  {at: 164.60, still: 14, move: {push: 0.06}, cap: 'The problem is who\nearns on the "later".', num: null},
  {at: 168.00, still: 15, move: {push: 0.04}, cap: 'Three questions.',
   num: {kind: 'chip', text: '0% is never zero'}, figureY: 800},
  {at: 170.60, still: 16, move: {push: 0.03}, cap: 'Ask them before\nyou click.', num: null},
];

/** Shot boundaries are implicit: each runs until the next one, last until TOTAL. */
export const durations = () =>
  SHOTS.map((s, i) => (i + 1 < SHOTS.length ? SHOTS[i + 1].at : TOTAL) - s.at);
