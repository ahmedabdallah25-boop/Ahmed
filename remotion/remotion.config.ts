import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setCodec('h264');
Config.setCrf(18);
Config.setChromiumOpenGlRenderer('swangle');
Config.setConcurrency(4);

/**
 * This container has no egress to remotion.media, so the usual
 * `remotion browser ensure` download fails. Chromium ships in the image, so
 * point the renderer at it. Override with REMOTION_BROWSER elsewhere.
 */
const bundled = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
Config.setBrowserExecutable(process.env.REMOTION_BROWSER ?? bundled);
