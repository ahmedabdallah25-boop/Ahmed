/**
 * The storyboard, recovered from the original render.
 *
 * Frame ranges come from `tools/build_beats.py`, which reads the source's own
 * burned-in caption track (see WORKFLOW.md). Line text is hand-corrected from
 * that OCR pass — at 24px the reader drops the odd word, and a garbled caption
 * at this size would be worse than no caption at all.
 *
 * Everything is in frames at 30fps against the untouched original audio.
 */

export const TITLE = 'The Moment Most People Quit';

// ---------------------------------------------------------------------------
// Narration
// ---------------------------------------------------------------------------

type Line = [from: number, to: number, text: string];

/**
 * Word timings are spread across each line weighted by word length, which
 * tracks speech closely enough that the amber highlight lands on the syllable.
 * Line boundaries are the part that has to be exact, and those are measured.
 */
const LINES: Line[] = [
  [60, 132, 'The market fell 35%.'],
  [135, 190, "Sammy's total."],
  [192, 268, 'Fourteen thousand six hundred dollars.'],
  [276, 400, 'He has 5,300 dollars behind Adam.'],
  [423, 468, 'This is the part that matters.'],
  [474, 640, 'He is $4,600 below what he actually put in.'],
  [651, 696, 'Three years of discipline.'],
  [699, 776, 'And he has less than he deposited.'],
  [780, 834, 'This is the moment the entire'],
  [837, 880, 'outcome is decided.'],
  [888, 914, 'And it has nothing to do'],
  [918, 960, 'with arithmetic.'],
  [969, 1050, "Sammy's friends have opinions now."],
  [1056, 1118, "His brother-in-law tells him he's been"],
  [1122, 1152, 'sold a story.'],
  [1158, 1246, "His father asks, kindly, whether he's"],
  [1251, 1320, 'thought about just putting it somewhere'],
  [1326, 1352, 'and every one of them can'],
  [1356, 1404, 'point at Adam.'],
  [1410, 1464, 'who has never lost a dollar.',],
  [1470, 1528, 'and who is currently five thousand'],
  [1533, 1568, 'ahead.'],
  [1575, 1644, 'Most people sell here.'],
  [1650, 1690, "Not because they're stupid."],
  [1695, 1726, 'The evidence in front of them'],
  [1728, 1766, 'says they were wrong.'],
  [1773, 1800, 'Pain is real.'],
];

export type Caption = {
  from: number;
  to: number;
  words: {text: string; from: number; to: number}[];
};

/** Cards hold at most this many words, so nothing ever wraps past two lines. */
const MAX_WORDS = 4;

export const CAPTIONS: Caption[] = LINES.flatMap(([from, to, text]) => {
  const words = text.split(' ');
  const weights = words.map((w) =>
    Math.max(2, w.replace(/[^A-Za-z0-9$%,.']/g, '').length),
  );
  const total = weights.reduce((a, b) => a + b, 0);
  const span = to - from;

  let acc = 0;
  const timed = words.map((w, i) => {
    const start = from + Math.round((acc / total) * span);
    acc += weights[i];
    const end = from + Math.round((acc / total) * span);
    return {text: w, from: start, to: Math.max(start + 2, end)};
  });

  // Prefer breaking after punctuation; otherwise split evenly so a 5-word line
  // becomes 3+2 rather than 4+1.
  const cards: (typeof timed)[] = [];
  let cur: typeof timed = [];
  const chunks = Math.ceil(words.length / MAX_WORDS);
  const target = Math.ceil(words.length / chunks);
  for (const w of timed) {
    cur.push(w);
    const punctuated = /[.,;:]$/.test(w.text);
    if (cur.length >= target || (punctuated && cur.length >= target - 1)) {
      cards.push(cur);
      cur = [];
    }
  }
  if (cur.length) {
    if (cur.length === 1 && cards.length) cards[cards.length - 1].push(cur[0]);
    else cards.push(cur);
  }

  return cards.map((c, i) => ({
    from: c[0].from,
    to: i === cards.length - 1 ? to : c[c.length - 1].to,
    words: c,
  }));
});

// ---------------------------------------------------------------------------
// Scenes — one per story beat, alternating push direction so consecutive cuts
// never read as the same move twice.
// ---------------------------------------------------------------------------

export type Scene = {
  index: number;
  from: number;
  duration: number;
  chip: string;
  zoomFrom: number;
  zoomTo: number;
  originX: number;
  originY: number;
  panX: number;
  panY: number;
};

const RAW_SCENES: [from: number, chip: string, Partial<Scene>][] = [
  [0, 'Year 2 · The Drop', {zoomFrom: 1.01, zoomTo: 1.06, originX: 30, originY: 60, panX: -8}],
  [270, 'The Gap', {zoomFrom: 1.0, zoomTo: 1.05, originX: 68, originY: 50, panX: 7}],
  [465, 'Underwater', {zoomFrom: 1.03, zoomTo: 1.0, originX: 45, originY: 66, panY: 6}],
  [780, 'The Decision', {zoomFrom: 1.0, zoomTo: 1.07, originX: 50, originY: 44, panX: -5}],
  [960, 'The Noise', {zoomFrom: 1.02, zoomTo: 1.05, originX: 62, originY: 58, panX: 9}],
  [1260, 'They Point At Adam', {zoomFrom: 1.0, zoomTo: 1.04, originX: 38, originY: 52, panX: -7}],
  [1560, 'Most People Sell Here', {zoomFrom: 1.01, zoomTo: 1.08, originX: 50, originY: 56, panY: -6}],
];

export const SCENES: Scene[] = RAW_SCENES.map(([from, chip, over], i) => ({
  index: i,
  from,
  duration: (RAW_SCENES[i + 1]?.[0] ?? 1800) - from,
  chip,
  zoomFrom: 1,
  zoomTo: 1.05,
  originX: 50,
  originY: 50,
  panX: 0,
  panY: 0,
  ...over,
}));

// ---------------------------------------------------------------------------
// The number under the panel
// ---------------------------------------------------------------------------

export type Stat = {
  from: number;
  to: number;
  value?: string;
  countTo?: number;
  prefix?: string;
  label: string;
  tone?: 'up' | 'down';
};

export const STATS: Stat[] = [
  {from: 66, to: 190, value: '−35%', label: 'The market', tone: 'down'},
  {from: 196, to: 272, countTo: 14600, prefix: '$', label: "Sammy's total"},
  {from: 280, to: 415, value: '−$5,300', label: 'Behind Adam', tone: 'down'},
  {from: 480, to: 645, value: '−$4,600', label: 'Below what he put in', tone: 'down'},
  {from: 655, to: 775, value: '3 years', label: 'Of discipline'},
  {from: 1474, to: 1570, value: '+$5,000', label: 'Adam is ahead'},
];

// ---------------------------------------------------------------------------
// Open and close
// ---------------------------------------------------------------------------

/**
 * The original opened on a static page for three full seconds. This lands a
 * statement instead, then wipes to the panel. It runs over the first spoken
 * fragment ("And in year two.") on purpose — that line is not worth the hook.
 */
export const HOOK = {
  until: 54,
  lines: [
    {text: '3 years in.', big: false, accent: false},
    {text: 'Down $4,600.', big: true, accent: true},
  ],
  kicker: 'Most people sell right here',
};

/**
 * Parked in the title zone rather than over the frame, so the closing lines
 * ("says they were wrong" / "Pain is real") still play out underneath.
 */
export const END_CARD = {
  from: 1600,
  question: 'Would you still be holding?',
  cta: 'Episode 1',
  sub: 'Deen & Dinar — full story',
};
