import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { Beat1Balance } from './beats/Beat1Balance';
import { Beat3Vault } from './beats/Beat3Vault';
import { Beat4Cascade } from './beats/Beat4Cascade';
import { Beat5Owners } from './beats/Beat5Owners';
import { Beat6Run } from './beats/Beat6Run';
import { Beat7Assets } from './beats/Beat7Assets';
import { Beat8Kicker } from './beats/Beat8Kicker';
import { CutContext, type Cut } from './theme';
import { VO } from './vo-timing';

/**
 * Part 15 — "Your Bank Only Has 3 Cents of Every Dollar You Own"
 *
 * Hard cuts throughout, no dissolves: the outlier shorts on this channel cut on the beat
 * and never cross-fade.
 *
 * The `cut` prop selects the read — `full` (64.3s) or `short` (46.7s). Both use the same
 * seven beats and the same plates; only the boundaries and the voiceover differ, and both
 * were measured from the audio by scripts/make-vo.mjs.
 */
export const Part15: React.FC<{ cut: Cut }> = ({ cut }) => {
  const vo = VO[cut];

  return (
    <CutContext.Provider value={cut}>
      <AbsoluteFill style={{ backgroundColor: '#000' }}>
        <Audio src={staticFile(vo.audio)} />

        <Sequence {...vo.beats.balance}>
          <Beat1Balance />
        </Sequence>
        <Sequence {...vo.beats.vault}>
          <Beat3Vault />
        </Sequence>
        <Sequence {...vo.beats.cascade}>
          <Beat4Cascade />
        </Sequence>
        <Sequence {...vo.beats.owners}>
          <Beat5Owners />
        </Sequence>
        <Sequence {...vo.beats.run}>
          <Beat6Run />
        </Sequence>
        <Sequence {...vo.beats.assets}>
          <Beat7Assets />
        </Sequence>
        <Sequence {...vo.beats.kicker}>
          <Beat8Kicker />
        </Sequence>
      </AbsoluteFill>
    </CutContext.Provider>
  );
};
