import React from 'react';
import { Composition } from 'remotion';
import { Part15 } from './Part15';
import { FPS, H, TOTAL_FRAMES, W } from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Part15"
    component={Part15}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={W}
    height={H}
  />
);
