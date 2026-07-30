import React from 'react';
import { Composition } from 'remotion';
import { LAYOUTS } from './layouts';
import { Part15 } from './Part15';
import { FPS } from './theme';
import { VO } from './vo-timing';

/**
 * Three deliverables from one component tree.
 *
 * Orientation comes from each composition's own dimensions (useLayout in theme.ts); the
 * read comes from the `cut` prop. Neither is a global — that is what lets the same beats
 * serve 16:9 long-form and a 46s vertical Short.
 */
export const RemotionRoot: React.FC = () => (
  <>
    {/* long-form, 16:9 */}
    <Composition
      id="Part15"
      component={Part15}
      defaultProps={{ cut: 'full' as const }}
      durationInFrames={VO.full.totalFrames}
      fps={FPS}
      width={LAYOUTS.landscape.w}
      height={LAYOUTS.landscape.h}
    />
    {/* the same long read, vertical */}
    <Composition
      id="Part15Vertical"
      component={Part15}
      defaultProps={{ cut: 'full' as const }}
      durationInFrames={VO.full.totalFrames}
      fps={FPS}
      width={LAYOUTS.vertical.w}
      height={LAYOUTS.vertical.h}
    />
    {/* the Shorts cut: tightened read, vertical */}
    <Composition
      id="Part15Short"
      component={Part15}
      defaultProps={{ cut: 'short' as const }}
      durationInFrames={VO.short.totalFrames}
      fps={FPS}
      width={LAYOUTS.vertical.w}
      height={LAYOUTS.vertical.h}
    />
  </>
);
