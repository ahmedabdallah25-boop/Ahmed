/**
 * An episode: the script laid end to end, one narration track underneath,
 * the grade over the top.
 */

import React from 'react';
import { AbsoluteFill, Audio, staticFile } from 'remotion';
import { buildTimeline, type Script } from './lib/timeline';
import { NARRATION } from './lib/assets';
import { BeatScene } from './components/Beat';
import { Grade } from './components/Grade';
import { COLORS } from './theme';

export const Episode: React.FC<{ script: Script }> = ({ script }) => {
  const beats = buildTimeline(script);
  const vo = NARRATION[script.id];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {beats.map((beat) => (
        <BeatScene key={beat.id} beat={beat} />
      ))}

      {/* One locked voice track for the whole episode. Picture is cut to this,
          and the avatar takes are generated from it — see clone/README.md. */}
      {vo ? <Audio src={staticFile(`vo/${vo}`)} /> : null}

      <Grade />
    </AbsoluteFill>
  );
};
