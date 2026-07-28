import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
// The grade re-seeds grain every frame; a higher CRF would eat it alive.
Config.setCrf(17);
Config.setChromiumOpenGlRenderer('angle');

// Each host beat decodes the take twice — once for the plate, once for the
// blurred set extension — and the blur is a full-frame filter on top. On a
// small container that comfortably exceeds the 28s default and the render dies
// mid-way with a delayRender timeout that looks like a code bug but isn't.
Config.setDelayRenderTimeoutInMilliseconds(120000);
Config.setConcurrency(1);
