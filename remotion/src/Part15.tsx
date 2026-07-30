import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { Beat1Balance } from './beats/Beat1Balance';
import { Beat3Vault } from './beats/Beat3Vault';
import { Beat4Cascade } from './beats/Beat4Cascade';
import { Beat5Owners } from './beats/Beat5Owners';
import { Beat6Run } from './beats/Beat6Run';
import { Beat7Assets } from './beats/Beat7Assets';
import { Beat8Kicker } from './beats/Beat8Kicker';
import { BEATS, HAS_VO } from './theme';

/**
 * Part 15 — "Your Bank Only Has 3 Cents of Every Dollar You Own"
 *
 * Hard cuts throughout, no dissolves: the outlier shorts on this channel cut on the
 * beat and never cross-fade. Beat boundaries live in theme.ts so re-cutting to the
 * recorded VO is a single-file change.
 */
export const Part15: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#000' }}>
    {HAS_VO ? <Audio src={staticFile('vo.mp3')} /> : null}

    <Sequence {...BEATS.balance}>
      <Beat1Balance />
    </Sequence>
    <Sequence {...BEATS.vault}>
      <Beat3Vault />
    </Sequence>
    <Sequence {...BEATS.cascade}>
      <Beat4Cascade />
    </Sequence>
    <Sequence {...BEATS.owners}>
      <Beat5Owners />
    </Sequence>
    <Sequence {...BEATS.run}>
      <Beat6Run />
    </Sequence>
    <Sequence {...BEATS.assets}>
      <Beat7Assets />
    </Sequence>
    <Sequence {...BEATS.kicker}>
      <Beat8Kicker />
    </Sequence>
  </AbsoluteFill>
);
