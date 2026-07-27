import {loadFont} from '@remotion/fonts';
import {cancelRender, continueRender, delayRender, staticFile} from 'remotion';

/**
 * Bebas Neue is self-hosted from public/ rather than pulled off Google Fonts, so
 * renders don't depend on network access and always use the same cut the burned-in
 * captions use. public/BebasNeue.woff2 is the latin subset, SIL OFL 1.1.
 */
export const FONT_FAMILY = 'Bebas Neue';

const handle = delayRender('Loading Bebas Neue');

loadFont({
  family: FONT_FAMILY,
  url: staticFile('BebasNeue.woff2'),
  format: 'woff2',
  weight: '400',
})
  .then(() => continueRender(handle))
  .catch((err) => cancelRender(err));
