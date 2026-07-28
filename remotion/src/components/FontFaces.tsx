/**
 * Declares the self-hosted faces and holds the render open until they are
 * actually available.
 *
 * See src/lib/fonts.ts for why this is a component and not a module-scope
 * `loadFont()` call.
 */

import React from 'react';
import { continueRender, delayRender, staticFile } from 'remotion';
import { FONT_FACES } from '../lib/fonts';

const css = FONT_FACES.map(
  ({ family, file, weight }) => `@font-face{
  font-family:'${family}';
  src:url('${staticFile(file)}') format('woff2');
  font-weight:${weight};
  font-style:normal;
  font-display:block;
}`,
).join('\n');

export const FontFaces: React.FC = () => {
  const [handle] = React.useState(() => delayRender('loading self-hosted fonts'));

  React.useEffect(() => {
    let cancelled = false;

    // `document.fonts.load` needs a size and a sample string to actually pull
    // the file; asking for `fonts.ready` alone can resolve before a face that
    // nothing has painted yet has been fetched.
    Promise.all(
      FONT_FACES.map(({ family, weight }) =>
        document.fonts.load(`${weight.split(' ')[0]} 100px '${family}'`, 'ABC abc 0123'),
      ),
    )
      .catch(() => undefined)
      .then(() => {
        if (!cancelled) continueRender(handle);
      });

    return () => {
      cancelled = true;
      // Clearing on unmount as well: a handle that outlives its page is exactly
      // the failure mode this component exists to avoid.
      continueRender(handle);
    };
  }, [handle]);

  return <style>{css}</style>;
};
