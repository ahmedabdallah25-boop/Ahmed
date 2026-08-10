// Palette lifted from the scene pack's own hex codes, so the type and the
// graphics sit in the same world as the stills rather than next to them.
// (theme.ts is the older dark "Deen & Dinar" stage and does not apply here —
// this video is the flat-vector cast on warm cream.)
export const P = {
  cream: '#F7EFDD',
  ink: '#3D2B23',
  espresso: '#4A342A',
  sand: '#D9C08D',
  camel: '#B8823C',
  rust: '#B5603F',
  teal: '#2F6B72',
  sage: '#7C8A5F',
  grey: '#8A8A8A',
  charcoal: '#5A5A5A',
} as const;

export const FONT = 'Inter, "Liberation Sans", Arial, sans-serif';

// Every picture prompt in the pack puts its subject in the lower two-thirds
// with "clean headroom above", so type owns the top band on all 45 picture
// scenes. This is a property of the art, not a guess.
export const CAPTION_TOP = 168;
export const SAFE_X = 76;

// The voice's emotional tag decides the accent. Sparse by design: the pack's
// own note is that tags are strongest at emotional turns.
export const accentFor = (tag: string): string => {
  switch (tag) {
    case 'emphatic':
      return P.rust;
    case 'warmly':
    case 'calm':
      return P.teal;
    case 'whispers':
      return P.grey;
    default:
      return P.ink;
  }
};
