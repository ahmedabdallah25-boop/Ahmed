import React from 'react';
import { Composition } from 'remotion';
import { LAYOUTS } from './layouts';
import { Part15 } from './Part15';
import { FPS, TOTAL_FRAMES } from './theme';

/**
 * Two deliverables from one component tree. Each composition renders at its own
 * dimensions, and every beat reads its geometry from the frame it is given (see
 * useLayout in theme.ts) — there is no orientation prop to thread.
 *
 * Both use the same voiceover, so the beat boundaries are identical; only the layouts
 * differ.
 */
export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Part15"
      component={Part15}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={LAYOUTS.landscape.w}
      height={LAYOUTS.landscape.h}
    />
    <Composition
      id="Part15Vertical"
      component={Part15}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={LAYOUTS.vertical.w}
      height={LAYOUTS.vertical.h}
    />
  </>
);
