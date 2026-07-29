import {staticFile} from 'remotion';

/**
 * "After Hours" — the Short's own identity: a dark market terminal at night.
 * Nothing here is inherited from the source clip; the only thing that carries
 * over from it is the audio track.
 */
export const C = {
  void: '#06080B',
  base: '#0C1016',
  surface: '#161D27',
  surfaceLift: '#212B37',
  hair: 'rgba(238, 243, 248, 0.09)',
  hairLit: 'rgba(238, 243, 248, 0.2)',

  text: '#EFF4F9',
  textDim: '#8A97A6',

  loss: '#FF4D4D',
  lossDeep: '#8E1F1F',
  gain: '#2BE08C',
  gainDeep: '#0E6B45',
  live: '#FFE14D',
  cool: '#4DA6FF',
} as const;

export const FONT = {
  /** wide heavy grotesque — captions and headline numbers */
  display: 'ArchivoDD',
  /** terminal mono — labels, readouts, figures */
  mono: 'MonoDD',
} as const;

const faces = `
@font-face {
  font-family: '${FONT.display}';
  src: url('${staticFile('fonts/ArchivoBlack.ttf')}') format('truetype');
  font-weight: 400;
  font-display: block;
}
@font-face {
  font-family: '${FONT.mono}';
  src: url('${staticFile('fonts/JetBrainsMono.ttf')}') format('truetype');
  font-weight: 100 800;
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

/** The band the motion graphics live in, between the HUD and the captions. */
export const STAGE = {
  top: 236,
  height: 862,
  width: 940,
  left: 70,
} as const;

/** Where the caption block sits. */
export const CAPTIONS = {
  top: 1136,
  height: 400,
} as const;

/** A neon glow for a given accent. */
export const glow = (color: string, strength = 1) =>
  `drop-shadow(0 0 ${10 * strength}px ${color}) drop-shadow(0 0 ${28 * strength}px ${color}66)`;
