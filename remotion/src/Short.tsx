import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, gateWeave} from './theme';
import {Stage} from './Stage';
import {Captions} from './Captions';
import {FilmTreatment} from './FilmTreatment';
import {HookCard, EndCard} from './Cards';
import {BrandChip, ChapterChip, ProgressRail, StatStrip, TitleBlock} from './Chrome';
import {HOOK} from './beats';
import {Fonts} from './fonts';

export const Short: React.FC = () => {
  const frame = useCurrentFrame();
  const w = gateWeave(frame);

  return (
    <AbsoluteFill style={{background: C.ink, overflow: 'hidden'}}>
      <Fonts />
      {/* Everything rides the gate weave, so the frame never sits perfectly still. */}
      <AbsoluteFill
        style={{
          transform: `translate(${w.x}px, ${w.y}px) rotate(${w.r}deg) scale(1.012)`,
        }}
      >
        <Stage />
        <ProgressRail />
        <ChapterChip />
        <TitleBlock from={HOOK.until} />
        <StatStrip />
        <Captions />
        <BrandChip />
        <EndCard />
        <HookCard />
      </AbsoluteFill>

      <FilmTreatment />
    </AbsoluteFill>
  );
};
