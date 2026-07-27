import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setEntryPoint('./src/index.ts');
Config.setOverwriteOutput(true);

// Remotion needs chrome-headless-shell; plain Chrome/Chromium no longer has old
// headless mode. Point CHROME_HEADLESS_SHELL at an existing one (e.g. Playwright's)
// to skip Remotion's download.
if (process.env.CHROME_HEADLESS_SHELL) {
  Config.setBrowserExecutable(process.env.CHROME_HEADLESS_SHELL);
}
