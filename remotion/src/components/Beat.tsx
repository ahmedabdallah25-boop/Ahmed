/**
 * One beat of the script, rendered.
 *
 * This is the only place that knows how a `BeatVisual` becomes pixels, so a
 * script file stays readable as a script — durations and words — and never
 * turns into layout code.
 */

import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import type { PlacedBeat } from '../lib/timeline';
import { hasMeme, hasSfx, resolveTake } from '../lib/assets';
import { Host } from './Host';
import { Annotations, Cutaway, FreezeFrame, PictureInPicture } from './Cutaways';
import { Captions, CaptionScrim, EmphasisFlash, Undercut } from './Captions';
import { DeadAir, EndCard, Receipt, Sponsor, TitleCard } from './Cards';
import { COLORS } from '../theme';

/** Cards that are already full-frame graphics and must not get caption bars on top. */
const SILENT_VISUALS = new Set(['titleCard', 'deadAir', 'receipt', 'sponsor', 'endCard']);

const Visual: React.FC<{ beat: PlacedBeat }> = ({ beat }) => {
  const v = beat.visual;

  switch (v.type) {
    case 'host':
      return <Host take={resolveTake(v.take)} zoom={v.zoom} jumpCuts={v.jumpCuts} muted />;

    case 'pip':
      return (
        <AbsoluteFill>
          {hasMeme(v.src) ? (
            <Cutaway src={v.src} />
          ) : (
            <AbsoluteFill style={{ backgroundColor: COLORS.bgLift }} />
          )}
          <PictureInPicture take={resolveTake(v.take)} corner={v.corner} zoom={v.zoom} />
        </AbsoluteFill>
      );

    case 'cutaway':
      return hasMeme(v.src) ? (
        <Cutaway src={v.src} kenBurns={v.kenBurns} deepFried={v.deepFried} />
      ) : (
        // Evidence not dropped in yet: hold the host rather than cutting to black,
        // so a preview of an unfinished episode still plays as a video.
        <Host take={resolveTake('')} zoom={1.18} muted />
      );

    case 'freeze':
      return <FreezeFrame take={resolveTake(v.take)} frame={v.frame} zoom={v.zoom} />;

    case 'titleCard':
      return <TitleCard title={v.title} kicker={v.kicker} />;

    case 'deadAir':
      return <DeadAir caption={v.caption} />;

    case 'receipt':
      return <Receipt lines={v.lines} highlight={v.highlight} />;

    case 'sponsor':
      return <Sponsor brand={v.brand} body={v.body} />;

    case 'endCard':
      return <EndCard next={v.next} />;
  }
};

export const BeatScene: React.FC<{ beat: PlacedBeat }> = ({ beat }) => {
  const showCaptions = beat.vo && !SILENT_VISUALS.has(beat.visual.type);

  // Emphasis flashes are spread across the beat rather than pinned to a word
  // index, so re-timing a beat never leaves a flash stranded past its end.
  const flashes = (beat.emphasize ?? []).map((word, i, all) => ({
    word,
    at: Math.round(((i + 0.55) / all.length) * beat.frames) - 4,
  }));

  return (
    <Sequence from={beat.from} durationInFrames={beat.frames} name={beat.id} layout="none">
      <AbsoluteFill>
        <Visual beat={beat} />

        {beat.annotations?.length ? <Annotations items={beat.annotations} /> : null}
        {showCaptions || beat.undercut ? <CaptionScrim /> : null}
        {showCaptions ? <Captions vo={beat.vo as string} /> : null}
        {flashes.map((f, i) => (
          <EmphasisFlash key={i} word={f.word} at={Math.max(0, f.at)} />
        ))}
        {beat.undercut ? <Undercut text={beat.undercut} /> : null}

        {hasSfx(beat.sfx) ? <Audio src={staticFile(`sfx/${beat.sfx}.mp3`)} volume={0.55} /> : null}
      </AbsoluteFill>
    </Sequence>
  );
};
