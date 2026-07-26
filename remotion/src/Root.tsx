import React from 'react';
import {Composition} from 'remotion';
import {Short, defaultShortProps, durationInFrames} from './Short';

const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Short"
        component={Short}
        // 9:16 vertical, the format every video on the channel uses.
        width={1080}
        height={1920}
        fps={FPS}
        durationInFrames={durationInFrames(defaultShortProps.cards, FPS)}
        defaultProps={defaultShortProps}
        calculateMetadata={({props}) => ({
          durationInFrames: durationInFrames(props.cards, FPS),
        })}
      />
    </>
  );
};
