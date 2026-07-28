/**
 * Transcript of the Episode 1 Short, recovered from the source cut and
 * timed to the audio track at 30fps (frame numbers, not seconds).
 *
 * hi marks the word the gold highlight lands on when it is spoken.
 */
export type ActId = 'act1' | 'act2' | 'act3' | 'act4' | 'act5' | 'act6';

export type PhraseStyle = 'chip' | 'slab' | 'alarm' | 'number';

export type Word = {t: string; s: number; hi: boolean};

export type Phrase = {
  /** first frame of the phrase */
  s: number;
  /** last frame of the phrase */
  e: number;
  act: ActId;
  style: PhraseStyle;
  words: Word[];
};

export const SCRIPT: Phrase[] = [
  {
    s: 3,
    e: 41,
    act: 'act1',
    style: 'chip',
    words: [
      {t: 'And', s: 6, hi: false},
      {t: 'in', s: 13, hi: false},
      {t: 'year', s: 17, hi: true},
      {t: 'two', s: 23, hi: false},
    ],
  },
  {
    s: 48,
    e: 116,
    act: 'act1',
    style: 'alarm',
    words: [
      {t: 'the', s: 51, hi: false},
      {t: 'market', s: 56, hi: false},
      {t: 'fell', s: 65, hi: true},
      {t: '35%.', s: 75, hi: true},
    ],
  },
  {
    s: 132,
    e: 172,
    act: 'act1',
    style: 'chip',
    words: [
      {t: "Sammy's", s: 135, hi: true},
      {t: 'total:', s: 151, hi: false},
    ],
  },
  {
    s: 183,
    e: 262,
    act: 'act1',
    style: 'number',
    words: [
      {t: 'fourteen', s: 185, hi: false},
      {t: 'thousand', s: 198, hi: false},
      {t: 'six', s: 211, hi: false},
      {t: 'hundred', s: 224, hi: false},
      {t: 'dollars.', s: 243, hi: false},
    ],
  },
  {
    s: 276,
    e: 370,
    act: 'act1',
    style: 'chip',
    words: [
      {t: 'He', s: 279, hi: false},
      {t: 'has', s: 282, hi: false},
      {t: '5,300', s: 288, hi: true},
      {t: 'dollars', s: 327, hi: false},
      {t: 'behind', s: 340, hi: false},
      {t: 'Adam.', s: 347, hi: true},
    ],
  },
  {
    s: 411,
    e: 455,
    act: 'act2',
    style: 'slab',
    words: [
      {t: 'This', s: 411, hi: false},
      {t: 'is', s: 416, hi: false},
      {t: 'the', s: 421, hi: false},
      {t: 'part', s: 426, hi: false},
      {t: 'that', s: 429, hi: false},
      {t: 'matters.', s: 433, hi: true},
    ],
  },
  {
    s: 468,
    e: 540,
    act: 'act2',
    style: 'chip',
    words: [
      {t: 'He', s: 468, hi: false},
      {t: 'is', s: 475, hi: false},
      {t: '$4,600', s: 482, hi: true},
    ],
  },
  {s: 549, e: 572, act: 'act2', style: 'chip', words: [{t: 'below', s: 549, hi: true}]},
  {
    s: 585,
    e: 624,
    act: 'act2',
    style: 'chip',
    words: [
      {t: 'he', s: 585, hi: false},
      {t: 'actually', s: 591, hi: true},
      {t: 'put', s: 602, hi: false},
      {t: 'in.', s: 613, hi: false},
    ],
  },
  {
    s: 652,
    e: 696,
    act: 'act2',
    style: 'slab',
    words: [
      {t: 'Three', s: 654, hi: true},
      {t: 'years', s: 663, hi: false},
      {t: 'of', s: 667, hi: false},
      {t: 'discipline.', s: 671, hi: true},
    ],
  },
  {
    s: 700,
    e: 736,
    act: 'act2',
    style: 'chip',
    words: [
      {t: 'And', s: 703, hi: false},
      {t: 'he', s: 708, hi: false},
      {t: 'has', s: 714, hi: false},
      {t: 'less', s: 719, hi: true},
      {t: 'than', s: 725, hi: false},
      {t: 'he', s: 730, hi: false},
    ],
  },
  {s: 738, e: 768, act: 'act2', style: 'alarm', words: [{t: 'deposited.', s: 741, hi: true}]},
  {
    s: 781,
    e: 820,
    act: 'act3',
    style: 'slab',
    words: [
      {t: 'This', s: 783, hi: false},
      {t: 'is', s: 785, hi: false},
      {t: 'the', s: 786, hi: false},
      {t: 'moment', s: 788, hi: true},
      {t: 'the', s: 801, hi: false},
      {t: 'entire', s: 814, hi: false},
    ],
  },
  {
    s: 828,
    e: 872,
    act: 'act3',
    style: 'slab',
    words: [
      {t: 'outcome', s: 831, hi: true},
      {t: 'is', s: 844, hi: false},
      {t: 'decided.', s: 849, hi: true},
    ],
  },
  {
    s: 888,
    e: 916,
    act: 'act3',
    style: 'chip',
    words: [
      {t: 'And', s: 890, hi: false},
      {t: 'it', s: 891, hi: false},
      {t: 'has', s: 892, hi: false},
      {t: 'nothing', s: 899, hi: true},
      {t: 'to', s: 905, hi: false},
      {t: 'do', s: 910, hi: false},
    ],
  },
  {
    s: 918,
    e: 950,
    act: 'act3',
    style: 'alarm',
    words: [
      {t: 'with', s: 918, hi: false},
      {t: 'arithmetic.', s: 924, hi: true},
    ],
  },
  {
    s: 966,
    e: 1038,
    act: 'act4',
    style: 'chip',
    words: [
      {t: "Sammy's", s: 968, hi: false},
      {t: 'friends', s: 985, hi: true},
      {t: 'have', s: 994, hi: false},
      {t: 'opinions', s: 1002, hi: true},
      {t: 'now.', s: 1020, hi: false},
    ],
  },
  {
    s: 1056,
    e: 1103,
    act: 'act4',
    style: 'chip',
    words: [
      {t: 'His', s: 1061, hi: false},
      {t: 'brother-in-law', s: 1062, hi: true},
      {t: 'tells', s: 1063, hi: false},
      {t: 'him', s: 1064, hi: false},
      {t: "he's", s: 1066, hi: false},
      {t: 'been', s: 1070, hi: false},
    ],
  },
  {
    s: 1104,
    e: 1145,
    act: 'act4',
    style: 'alarm',
    words: [
      {t: 'sold', s: 1107, hi: true},
      {t: 'a', s: 1110, hi: false},
      {t: 'story.', s: 1112, hi: true},
    ],
  },
  {
    s: 1158,
    e: 1237,
    act: 'act4',
    style: 'chip',
    words: [
      {t: 'His', s: 1161, hi: false},
      {t: 'father', s: 1167, hi: true},
      {t: 'asks,', s: 1178, hi: false},
      {t: 'kindly,', s: 1194, hi: true},
      {t: 'whether', s: 1227, hi: false},
      {t: "he's", s: 1232, hi: false},
    ],
  },
  {
    s: 1239,
    e: 1277,
    act: 'act4',
    style: 'chip',
    words: [
      {t: 'thought', s: 1240, hi: true},
      {t: 'about', s: 1243, hi: false},
      {t: 'just', s: 1245, hi: false},
      {t: 'putting', s: 1248, hi: false},
      {t: 'it', s: 1260, hi: false},
      {t: 'somewhere', s: 1272, hi: false},
    ],
  },
  {s: 1279, e: 1300, act: 'act4', style: 'slab', words: [{t: 'safe.', s: 1283, hi: true}]},
  {
    s: 1324,
    e: 1356,
    act: 'act5',
    style: 'chip',
    words: [
      {t: 'and', s: 1324, hi: false},
      {t: 'every', s: 1325, hi: true},
      {t: 'one', s: 1330, hi: false},
      {t: 'of', s: 1337, hi: false},
      {t: 'them', s: 1343, hi: false},
      {t: 'can', s: 1350, hi: false},
    ],
  },
  {
    s: 1357,
    e: 1396,
    act: 'act5',
    style: 'chip',
    words: [
      {t: 'point', s: 1357, hi: false},
      {t: 'at', s: 1358, hi: false},
      {t: 'Adam,', s: 1359, hi: true},
    ],
  },
  {
    s: 1410,
    e: 1460,
    act: 'act5',
    style: 'chip',
    words: [
      {t: 'who', s: 1410, hi: false},
      {t: 'has', s: 1411, hi: false},
      {t: 'never', s: 1412, hi: true},
      {t: 'lost', s: 1413, hi: false},
      {t: 'a', s: 1414, hi: false},
      {t: 'dollar,', s: 1415, hi: true},
    ],
  },
  {
    s: 1473,
    e: 1529,
    act: 'act5',
    style: 'chip',
    words: [
      {t: 'and', s: 1477, hi: false},
      {t: 'who', s: 1480, hi: false},
      {t: 'is', s: 1484, hi: false},
      {t: 'currently', s: 1488, hi: false},
      {t: 'five', s: 1489, hi: true},
      {t: 'thousand', s: 1490, hi: true},
    ],
  },
  {s: 1530, e: 1557, act: 'act5', style: 'slab', words: [{t: 'ahead.', s: 1530, hi: true}]},
  {
    s: 1575,
    e: 1620,
    act: 'act6',
    style: 'alarm',
    words: [
      {t: 'Most', s: 1575, hi: false},
      {t: 'people', s: 1576, hi: false},
      {t: 'sell', s: 1590, hi: true},
      {t: 'here.', s: 1605, hi: false},
    ],
  },
  {
    s: 1627,
    e: 1667,
    act: 'act6',
    style: 'chip',
    words: [
      {t: 'Not', s: 1627, hi: false},
      {t: 'because', s: 1628, hi: false},
      {t: "they're", s: 1640, hi: false},
      {t: 'stupid.', s: 1654, hi: true},
    ],
  },
  {
    s: 1690,
    e: 1719,
    act: 'act6',
    style: 'chip',
    words: [
      {t: 'The', s: 1690, hi: false},
      {t: 'evidence', s: 1691, hi: true},
      {t: 'in', s: 1696, hi: false},
      {t: 'front', s: 1702, hi: false},
      {t: 'of', s: 1707, hi: false},
      {t: 'them', s: 1713, hi: false},
    ],
  },
  {
    s: 1722,
    e: 1758,
    act: 'act6',
    style: 'slab',
    words: [
      {t: 'says', s: 1722, hi: false},
      {t: 'they', s: 1723, hi: false},
      {t: 'were', s: 1724, hi: false},
      {t: 'wrong.', s: 1725, hi: true},
    ],
  },
  {
    s: 1772,
    e: 1800,
    act: 'act6',
    style: 'alarm',
    words: [
      {t: 'Pain', s: 1773, hi: true},
      {t: 'is', s: 1782, hi: false},
      {t: 'real.', s: 1791, hi: true},
    ],
  },
];
