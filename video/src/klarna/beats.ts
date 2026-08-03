// "Is Klarna Halal?" — scene timing.
//
// The VO (public/klarna-vo.mp3) is 55.353s = 1661 frames at 30fps. Scene
// durations below are weighted by each scene's spoken characters plus a fixed
// allowance per line break, because ElevenLabs v3 inserts a real pause at every
// paragraph. They sum to exactly 1661 — if you retime a scene, take the frames
// off a neighbour so the total still lands on the last word of the VO.

export const KLARNA_DURATION = 1661;

export type Scene = {
  id: string;
  dur: number;
  cap1: string;
  cap2: string;
  /** word indices in cap1 that get punched on the beat */
  hit?: number[];
};

export const SCENES: Scene[] = [
  {
    id: 'hook',
    dur: 142,
    cap1: 'Interest-free',
    cap2: 'the most expensive word in finance',
    hit: [0],
  },
  {
    id: 'structure',
    dur: 192,
    cap1: 'Four payments. Zero percent.',
    cap2: "so who's actually paying for it?",
    hit: [3],
  },
  {
    id: 'fee',
    dur: 123,
    cap1: 'The shop pays up to 6%',
    cap2: 'on every single sale — not just the Klarna ones',
    hit: [5],
  },
  {
    id: 'tag',
    dur: 104,
    cap1: 'No shop absorbs that',
    cap2: 'it goes straight on the price tag',
    hit: [3],
  },
  {
    id: 'everyone',
    dur: 175,
    cap1: 'The price went up for everyone',
    cap2: 'including the person paying cash',
    hit: [5],
  },
  {
    id: 'cash',
    dur: 175,
    cap1: 'They never used it',
    cap2: "they're still funding it — then comes the late fee",
    hit: [1],
  },
  {
    id: 'basket',
    dur: 196,
    cap1: 'Then the bigger basket',
    cap2: "that's the actual product",
    hit: [2],
  },
  {
    id: 'rule',
    dur: 131,
    cap1: 'One price',
    cap2: 'agreed once. it never moves again.',
    hit: [0],
  },
  {
    id: 'murabaha',
    dur: 144,
    cap1: "That's murabaha",
    cap2: 'one markup, fixed at the moment of sale. not a loan.',
    hit: [1],
  },
  {
    id: 'wrong',
    dur: 95,
    cap1: 'Same shape',
    cap2: 'built wrong',
    hit: [1],
  },
  {
    id: 'close',
    dur: 184,
    cap1: 'Someone always pays',
    cap2: 'Follow — the fix is next.',
    hit: [2],
  },
];
