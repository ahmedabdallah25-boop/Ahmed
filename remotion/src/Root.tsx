import React from 'react';
import {Composition} from 'remotion';
import {Short} from './Short';
import {DURATION, FPS, H, W} from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Short"
    component={Short}
    durationInFrames={DURATION}
    fps={FPS}
    width={W}
    height={H}
  />
);
