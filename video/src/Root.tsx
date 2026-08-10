import React from 'react';
import {Composition} from 'remotion';
import './fonts';
import {INFLATION_DURATION, Inflation} from './inflation/Inflation';
import {INFLATION_THUMBS, THUMB_H, THUMB_W} from './inflation/Thumbnail';
import {Longform} from './longform/Longform';
import {Pension} from './pension/Pension';
import {TOTAL_FRAMES as PENSION_FRAMES} from './pension/timeline';
import {VO_DURATION} from './longform/timing';
import {Short} from './Short';
import {SHORTS} from './ShortsCuts';
import {THUMBS, THUMB_SIZE} from './Thumbnails';
import {FPS, H, W} from './theme';

export const RemotionRoot: React.FC = () => (
  <>
    {/* Inflation — motion graphics and captions over the supplied 3D footage.
        24fps and 2400 frames because that is exactly what the source is; the
        footage is never resampled. */}
    <Composition
      id="Inflation-Short"
      component={Inflation}
      durationInFrames={INFLATION_DURATION}
      fps={24}
      width={1080}
      height={1920}
    />
    {/* Three thumbnail options for the Short, 9:16 for the Shorts grid. */}
    {INFLATION_THUMBS.map(({id, component}) => (
      <Composition
        key={id}
        id={id}
        component={component}
        durationInFrames={1}
        fps={FPS}
        width={THUMB_W}
        height={THUMB_H}
      />
    ))}
    {/* "Is your pension halal?" — 46 supplied stills cut to the recorded VO.
        The length is the voiceover's own: every scene boundary comes from
        forced alignment of the script against public/vo-pension.mp3, not from
        the scene pack's designed timings, which total 196s against a 135.4s
        read. See src/pension/timeline.ts. */}
    <Composition
      id="Pension-DefaultFund"
      component={Pension}
      durationInFrames={PENSION_FRAMES}
      fps={FPS}
      width={W}
      height={H}
    />
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
  </>
);
