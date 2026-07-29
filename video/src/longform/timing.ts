// Scene cuts for Episode 2, in seconds, measured against public/vo-ep2.mp3.
//
// How these were derived: an ASR pass was unavailable on this machine (the
// whisper model download is blocked), so cuts are allocated by each scene's VO
// word count in storyboard-ep2-halal-mortgage.md, mapped onto the VO's *speech*
// time (silences excluded, measured with ffmpeg silencedetect), then snapped to
// the nearest real pause within 6s so no cut lands mid-sentence.
//
// To re-time by ear: change a number here and re-render. Every scene's internal
// beats are expressed as fractions of its own length, so they follow along.
export const VO_DURATION = 617.12;

export const CUTS = [
  0, // 1  Cold open
  20.03, // 2  The stake
  51.21, // 3  The promise
  86.04, // 4  What a mortgage actually is
  138.81, // 5  Why the early years are brutal
  190.92, // 6  The principle
  242.16, // 7  Murabaha
  293.91, // 8  Ijara wa Iqtina
  377.59, // 9  Diminishing Musharaka
  444.27, // 10 Side by side
  472.31, // 11 The four questions
  563.35, // 12 Recap
  600.66, // 13 Close & next
  VO_DURATION,
];

export const CHAPTERS = [
  'Cold open',
  'The stake',
  'The promise',
  'What a mortgage actually is',
  'Why the early years are brutal',
  'The principle',
  'Structure 1 — Murabaha',
  'Structure 2 — Ijara wa Iqtina',
  'Structure 3 — Diminishing Musharaka',
  'Side by side',
  'The four questions',
  'Recap',
  'Close',
];
