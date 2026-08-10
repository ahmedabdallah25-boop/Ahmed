import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setCodec('h264');
Config.setChromiumOpenGlRenderer('angle');
Config.setDelayRenderTimeoutInMilliseconds(60000);

// Chromium is supplied by the environment in CI/sandboxes where Remotion's own
// download host is unreachable. Kept as an env var so no machine-specific path
// is committed: REMOTION_BROWSER_EXECUTABLE=/path/to/chrome npm run render:pension
if (process.env.REMOTION_BROWSER_EXECUTABLE) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER_EXECUTABLE);
}
