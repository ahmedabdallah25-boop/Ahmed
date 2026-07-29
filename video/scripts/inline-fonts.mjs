// Regenerates src/fonts-data.ts from public/fonts/inter-var.woff2.
import {readFileSync, writeFileSync} from 'fs';

const b64 = readFileSync('public/fonts/inter-var.woff2').toString('base64');

writeFileSync(
  'src/fonts-data.ts',
  [
    '// Generated from public/fonts/inter-var.woff2 — inlined so the render never',
    '// makes an HTTP request for type. Regenerate with: node scripts/inline-fonts.mjs',
    `export const INTER_VAR = 'data:font/woff2;base64,${b64}';`,
    '',
  ].join('\n'),
);
