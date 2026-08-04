import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setCodec('h264');
Config.setChromiumOpenGlRenderer('angle');

// This box cannot reach remotion.media to fetch Chrome Headless Shell (egress
// policy, 403), but it ships Playwright's Chromium. Use the headless_shell build
// rather than the full chrome binary: Remotion launches with the old --headless
// flag, which current full Chrome has removed, and headless_shell is exactly the
// standalone implementation of that mode.
const SHELL = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
if (require('fs').existsSync(SHELL)) {
  Config.setBrowserExecutable(SHELL);
}
Config.setDelayRenderTimeoutInMilliseconds(60000);
