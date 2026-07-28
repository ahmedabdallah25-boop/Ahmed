import React from 'react';
import { Composition } from 'remotion';
import { FPS, HEIGHT, WIDTH } from './theme';
import { Episode } from './Episode';
import { assertRuntime, timelineLength } from './lib/timeline';
import { ep01 } from './scripts/ep01';
import { ep02 } from './scripts/ep02';
import { ep03 } from './scripts/ep03';
import { ep04 } from './scripts/ep04';
import { ep05 } from './scripts/ep05';

const EPISODES = [ep01, ep02, ep03, ep04, ep05];

// Fails loudly at studio-load time if a script has drifted off the 7:00 target,
// rather than after a 40-minute render.
EPISODES.forEach((script) => assertRuntime(script));

export const RemotionRoot: React.FC = () => (
  <>
    {EPISODES.map((script) => (
      <Composition
        key={script.id}
        id={script.id.replace(/^ep/, 'Ep')}
        component={Episode}
        durationInFrames={timelineLength(script)}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{ script }}
      />
    ))}
  </>
);
