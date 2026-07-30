import React from 'react';
import {Composition} from 'remotion';
import './fonts';
import {Longform} from './longform/Longform';
import {VO_DURATION} from './longform/timing';
import {PART15_FRAMES, Part15} from './Part15';
import {Short} from './Short';
import {SHORTS} from './ShortsCuts';
import {THUMBS, THUMB_SIZE} from './Thumbnails';
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
    {/* Five thumbnail options for Episode 2. */}
    {Object.entries(THUMBS).map(([id, component]) => (
      <Composition
        key={id}
        id={id}
        component={component}
        durationInFrames={1}
        fps={FPS}
        {...THUMB_SIZE}
      />
    ))}
    {/* Vertical cuts of Episode 2 for the Shorts feed. */}
    {Object.entries(SHORTS).map(([id, {c, sec}]) => (
      <Composition
        key={id}
        id={id}
        component={c}
        durationInFrames={Math.round(sec * FPS)}
        fps={FPS}
        width={W}
        height={H}
      />
    ))}
    {/* Vertical Short, kept for the Shorts lane. */}
    <Composition
      id="Part14-RaiseTrap"
      component={Short}
      durationInFrames={1080} // 36s
      fps={FPS}
      width={W}
      height={H}
    />
    {/* Part 15 — student loans → Qard Hasan. 20s. */}
    <Composition
      id="Part15-StudentLoans"
      component={Part15}
      durationInFrames={PART15_FRAMES} // 600 = 20s
      fps={FPS}
      width={W}
      height={H}
    />
  </>
);
