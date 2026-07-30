import { useVideoConfig } from 'remotion';
import { LAYOUTS, type Layout, type Orientation } from './layouts';
import { VO } from './vo-timing';

/** Series constants. Palette matches scripts/make-plates.mjs — change both together. */
export const FPS = 30;

/**
 * Which orientation this composition is. Derived from the frame the component is
 * actually rendering into, so one component tree serves both <Composition>s and there is
 * no prop to thread or forget.
 */
export const useOrientation = (): Orientation => {
  const { width, height } = useVideoConfig();
  return width >= height ? 'landscape' : 'vertical';
};

/**
 * Geometry for the current orientation, generated from scripts/layouts.mjs alongside the
 * plates. Beats call this instead of holding module-level constants — the numbers differ
 * per composition, so they cannot be resolved at import time.
 */
export const useLayout = (): Layout => LAYOUTS[useOrientation()];

export const GOLD = '#D4A24C';
export const TEAL = '#3E8E8C';
export const NAVY = '#0B1A2E';

export const SANS = '"Helvetica Neue", Helvetica, Arial, ui-sans-serif, system-ui, sans-serif';
export const MONO = 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace';

/**
 * Beat boundaries, MEASURED from the voiceover by scripts/make-vo.mjs.
 *
 * Do not hand-edit these — change a line or a pause in that script and re-run
 * `npm run vo`. Every beat component reads its length from here, so the whole timeline
 * follows the recording. The script's own estimate was 52s; the read is 64s.
 *
 * Note each component's internal frame numbers are Sequence-LOCAL (useCurrentFrame
 * restarts at 0 inside a Sequence), so a cue 30 frames into a beat starting at 1080 is
 * local frame 30, not 1110. VO.cues holds the two that must land on a word.
 */
export const BEATS = VO.beats;
export const CUES = VO.cues;

export const TOTAL_FRAMES = VO.totalFrames;

/** The reserve ratio the whole script hangs on. */
export const RESERVE = 0.03;

/**
 * public/vo.mp3 is committed, so this is on. If you delete the file, turn this off too —
 * Remotion throws on a missing staticFile, it does not warn.
 */
export const HAS_VO = true;
