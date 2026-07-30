import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
// Shorts are delivered vertical H.264; CRF 18 keeps the gold gradients from banding.
Config.setCodec('h264');
Config.setCrf(18);

// Remotion normally downloads its own chrome-headless-shell on first render. That host
// (remotion.media) is blocked on some networks, and the full Chrome binary no longer
// supports the old --headless mode Remotion launches with, so point it at a
// headless-shell build. Override with REMOTION_BROWSER if yours lives elsewhere.
const shell =
  process.env.REMOTION_BROWSER ??
  '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
Config.setBrowserExecutable(shell);
