import React from 'react';
import {Composition} from 'remotion';
import './fonts';
import {Longform} from './longform/Longform';
import {VO_DURATION} from './longform/timing';
import {Short} from './Short';
import {Thumbnail} from './Thumbnail';
import {FPS, H, W} from './theme';

export const RemotionRoot: React.FC = () => (
  <>
    {/* Episode 2 — long-form, cut to the recorded VO. */}
    <Composition
      id="Ep2-HalalMortgage"
      component={Longform}
      durationInFrames={Math.round(VO_DURATION * FPS)}
      fps={FPS}
      width={1920}
      height={1080}
    />
    {/* Thumbnail still for Episode 2. */}
    <Composition
      id="Ep2-Thumbnail"
      component={Thumbnail}
      durationInFrames={1}
      fps={FPS}
      width={1280}
      height={720}
    />
    {/* Vertical Short, kept for the Shorts lane. */}
    <Composition
      id="Part14-RaiseTrap"
      component={Short}
      durationInFrames={1080} // 36s
      fps={FPS}
      width={W}
      height={H}
    />
  </>
);
