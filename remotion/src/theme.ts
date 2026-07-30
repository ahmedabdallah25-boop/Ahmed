import { createContext, useContext } from 'react';
import { useVideoConfig } from 'remotion';
import { LAYOUTS, type Layout, type Orientation } from './layouts';
import { VO, type Cut } from './vo-timing';

export type { Cut };

/**
 * Which read this composition uses. Set once per <Composition> and provided by Part15;
 * every timing hook below reads it, so a beat component never has to know.
 */
export const CutContext = createContext<Cut>('full');
export const useCut = () => useContext(CutContext);
export const useVO = () => VO[useCut()];

/** Measured beat boundaries for the current cut. */
export const useBeats = () => useVO().beats;
/** In-beat cues that must land on a word, measured for the current cut. */
export const useCues = () => useVO().cues;

/**
 * Frames at a fraction of a beat.
 *
 * Cues that are NOT locked to a word go through this rather than a literal frame number.
 * The short read compresses every beat, and a hardcoded "fires at frame 240" silently
 * stops firing when the beat is only 209 frames long — which is how three separate moves
 * broke the first time the timeline was retimed.
 */
export const at = (fraction: number, length: number) => Math.round(fraction * length);

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

/** The reserve ratio the whole script hangs on. */
export const RESERVE = 0.03;
