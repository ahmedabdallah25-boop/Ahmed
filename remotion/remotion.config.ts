import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
// Shorts are re-encoded by YouTube anyway; CRF 18 keeps text edges crisp.
Config.setCrf(18);
Config.setEntryPoint('./src/index.ts');
