/**
 * Script → timeline.
 *
 * A script file is a flat list of beats. Each beat declares how long it runs
 * (in seconds) and what is on screen. Nothing here computes absolute frames by
 * hand — `buildTimeline` lays the beats end to end so a script can be re-timed
 * by editing one number without every downstream beat drifting.
 */

import { FPS, RUNTIME_FRAMES } from '../theme';

export type Annotation = {
  /** Percentages of frame, so annotations survive a resolution change. */
  x: number;
  y: number;
  kind: 'circle' | 'arrow' | 'scribble' | 'box';
  label?: string;
  /** Frames after the beat starts. Defaults to appearing immediately. */
  delay?: number;
};

export type BeatVisual =
  /** Host plate, full frame. `zoom` is the punch-in level: 1 = wide, 1.35 = tight. */
  | { type: 'host'; take: string; zoom?: number; jumpCuts?: number }
  /** Host shrunk into a corner while a cutaway owns the frame. */
  | { type: 'pip'; take: string; src: string; corner?: 'br' | 'bl' | 'tr' | 'tl'; zoom?: number }
  /** Full-frame image cutaway — a screenshot, an ad still, a stock photo. */
  | { type: 'cutaway'; src: string; kenBurns?: boolean; deepFried?: boolean }
  /** Chapter card. Hard cut in, hard cut out, whoosh underneath. */
  | { type: 'titleCard'; title: string; kicker?: string }
  /** Frozen host frame + sound sting. The reaction shot. */
  | { type: 'freeze'; take: string; frame: number; zoom?: number }
  /** Black frame. Silence. The joke is that nothing happens. */
  | { type: 'deadAir'; caption?: string }
  /** Number/receipt slate — the one place this channel gets to be sincere. */
  | { type: 'receipt'; lines: string[]; highlight?: number }
  /** Sponsor bumper, visually walled off from the video so it reads as a break. */
  | { type: 'sponsor'; brand: string; body: string }
  /** End card: subscribe, next episode, the Shorts series. */
  | { type: 'endCard'; next: string };

export type Beat = {
  id: string;
  /** Seconds. Decimals are fine — they get rounded to frames once, here. */
  dur: number;
  visual: BeatVisual;
  /** Word-for-word VO. Drives the burned-in captions. */
  vo?: string;
  /** Words inside `vo` that get a full-frame emphasis flash. */
  emphasize?: string[];
  /** Bottom-of-frame gag caption that contradicts or undercuts the VO. */
  undercut?: string;
  annotations?: Annotation[];
  /** Named file in public/sfx, minus extension. */
  sfx?: string;
  /** Music bed change. `null` cuts the music dead — used before a punchline. */
  music?: string | null;
};

export type Script = {
  id: string;
  title: string;
  /** YouTube-facing hook, kept next to the script so packaging can't drift from the cut. */
  packaging: { title: string; thumbText: string; description: string };
  beats: Beat[];
};

export type PlacedBeat = Beat & { from: number; frames: number };

export const buildTimeline = (script: Script): PlacedBeat[] => {
  let cursor = 0;
  return script.beats.map((beat) => {
    const frames = Math.max(1, Math.round(beat.dur * FPS));
    const placed: PlacedBeat = { ...beat, from: cursor, frames };
    cursor += frames;
    return placed;
  });
};

export const timelineLength = (script: Script): number =>
  buildTimeline(script).reduce((total, beat) => Math.max(total, beat.from + beat.frames), 0);

/**
 * Scripts are written to land on 7:00. Drifting past it silently is how a
 * "7 minute video" becomes 8:20, so this is loud about it rather than
 * quietly padding or truncating the render.
 */
export const assertRuntime = (script: Script, toleranceSeconds = 6) => {
  const actual = timelineLength(script);
  const drift = Math.abs(actual - RUNTIME_FRAMES) / FPS;
  if (drift > toleranceSeconds) {
    throw new Error(
      `Script "${script.id}" runs ${(actual / FPS).toFixed(1)}s, target is ${
        RUNTIME_FRAMES / FPS
      }s (drift ${drift.toFixed(1)}s > ${toleranceSeconds}s tolerance). Re-time the beats.`,
    );
  }
  return actual;
};

/** Splits VO into caption cards of 2–4 words, the density the channel already burns on Shorts. */
export const toCaptionCards = (vo: string, wordsPerCard = 3): string[][] => {
  const words = vo.trim().split(/\s+/).filter(Boolean);
  const cards: string[][] = [];
  for (let i = 0; i < words.length; i += wordsPerCard) {
    cards.push(words.slice(i, i + wordsPerCard));
  }
  return cards;
};
