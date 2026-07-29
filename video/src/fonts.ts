import {INTER_VAR} from './fonts-data';

// Inter (variable, wght 100–900) is inlined as a data URI — regenerate with
// scripts/inline-fonts.mjs. Two reasons it's inlined rather than served from
// public/: renders never depend on a network font fetch, and nothing blocks on
// loading. Serving the woff2 over Remotion's static-file server starved under
// parallel rendering (font requests queued behind the VO mp3), and gating frames
// behind a delayRender() timed out, because timers are frozen while a frame is
// held. A plain @font-face on a local data URI decodes during the first layout
// pass, so the type is simply there.
const style = document.createElement('style');
style.textContent = `@font-face{font-family:Inter;font-style:normal;font-weight:100 900;font-display:block;src:url(${INTER_VAR}) format('woff2');}`;
document.head.appendChild(style);
