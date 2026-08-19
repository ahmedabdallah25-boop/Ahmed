import {AMIRI_ARABIC} from './amiri-data';

// Registered the same way Inter is: a plain @font-face on a local data URI,
// which decodes during the first layout pass. Nothing here fetches.
const style = document.createElement('style');
style.textContent =
  `@font-face{font-family:Amiri;font-style:normal;font-weight:400;font-display:block;` +
  `src:url(${AMIRI_ARABIC}) format('woff2');}`;
document.head.appendChild(style);
