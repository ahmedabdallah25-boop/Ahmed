import {staticFile} from 'remotion';

/**
 * Palette lifted from the Episode 1 source frames so the Short reads as the
 * same publication: warm paper stock, near-black ink, rust for danger,
 * gold for the word being spoken, olive/teal for the data.
 */
export const C = {
  paper: '#F4ECD9',
  paperDeep: '#E7DBC0',
  paperLift: '#FBF6EA',
  ink: '#17150F',
  inkSoft: '#57503F',
  inkFaint: 'rgba(23, 21, 15, 0.085)',
  rust: '#C0442E',
  rustDeep: '#8E2F1F',
  gold: '#D9A441',
  goldSoft: '#F0CE84',
  olive: '#8A9A5B',
  teal: '#2E6F6A',
} as const;

export const FONT = {
  display: 'AntonDD',
  ui: 'InterDD',
} as const;

const faces = `
@font-face {
  font-family: '${FONT.display}';
  src: url('${staticFile('fonts/Anton-Regular.ttf')}') format('truetype');
  font-weight: 400;
  font-display: block;
}
@font-face {
  font-family: '${FONT.ui}';
  src: url('${staticFile('fonts/Inter-Variable.ttf')}') format('truetype');
  font-weight: 100 900;
  font-display: block;
}
`;

let injected = false;

/** Registers the two local font files once per bundle. */
export const loadFonts = () => {
  if (injected || typeof document === 'undefined') {
    return;
  }
  const el = document.createElement('style');
  el.textContent = faces;
  document.head.appendChild(el);
  injected = true;
};

loadFonts();

export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
} as const;

/** The band the motion graphics live in, between the headline and the captions. */
export const STAGE = {
  top: 384,
  height: 692,
  width: 940,
} as const;
