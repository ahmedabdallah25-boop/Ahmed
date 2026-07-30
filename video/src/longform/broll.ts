// B-roll stills, timed against the VO. Prompts and placement rationale live in
// ../../../broll-prompts.txt — keep the two in step.
//
// `at`/`dur` are seconds. `opacity` is the peak; each still fades in and out and
// pushes in slightly, so it never sits dead behind the type. Nothing is placed
// between 138.8s and 190.9s — the amortisation chart owns that scene.
export type BRollShot = {
  file: string;
  at: number;
  dur: number;
  opacity: number;
  /** 'under' keeps it behind the type; 'full' lets it carry the frame. */
  mode?: 'under' | 'full';
  note: string;
};

export const SHOTS: BRollShot[] = [
  {file: '01.jpg', at: 5.4, dur: 4.2, opacity: 0.38, note: 'key on the mortgage offer letter — behind the premise question'},
  {file: '02.jpg', at: 86.5, dur: 3.2, opacity: 0.34, note: 'cheque book, pen, keys — loan, not sale'},
  {file: '03.jpg', at: 100, dur: 3.2, opacity: 0.3, note: 'sealed title register — a charge, not ownership'},
  {file: '04.jpg', at: 115, dur: 3.4, opacity: 0.28, note: 'water-stained ceiling — the risk stays with you'},
  {file: '05.jpg', at: 192.5, dur: 3.6, opacity: 0.32, note: 'balance scale — trade permitted, riba forbidden'},
];
