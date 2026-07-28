import React from 'react';
import {Composition} from 'remotion';
import {Ep01Short} from './Ep01Short';
import {VIDEO} from './theme';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Ep01Short"
      component={Ep01Short}
      durationInFrames={1800}
      fps={VIDEO.fps}
      width={VIDEO.width}
      height={VIDEO.height}
    />
  );
};
