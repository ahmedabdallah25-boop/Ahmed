import React from 'react';
import {Composition} from 'remotion';
import {Short, shortSchema} from './Short';

const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Short"
      component={Short}
      schema={shortSchema}
      durationInFrames={FPS * 45}
      fps={FPS}
      width={1080}
      height={1920}
      defaultProps={{
        source: '',
        cards: [
          {text: 'Your bank', from: 0, to: 0.8, band: 0.35},
          {text: 'is not', from: 0.8, to: 1.4, band: 0.35},
          {text: 'your friend', from: 1.4, to: 2.4, band: 0.35},
        ],
      }}
    />
  );
};
