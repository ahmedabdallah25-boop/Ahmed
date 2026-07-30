import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { Plate } from '../lib/Plate';
import { noise } from '../lib/rng';
import { MultiplierChain } from '../overlays/MultiplierChain';

/**
 * Beat 4, 0:14–0:22. "You deposited a hundred. The bank kept three and lent out
 * ninety-seven. That ninety-seven got deposited somewhere else — and lent again."
 *
 * Camera is locked off; all the motion is the coins. Counts thin out per tier so the
 * cascade visibly loses volume on the way down — that IS the argument of the beat.
 */

// Tier geometry mirrors scripts/make-plates.mjs: width 760-i*120, top 250+i*320.
const TIERS = [0, 1, 2, 3, 4].map((i) => ({
  width: 760 - i * 120,
  top: 250 + i * 320,
}));
const COUNTS = [24, 18, 13, 9, 6];
const COIN = 96; // coin.png is a tight 96x96 (48px coin + glow margin)

const N = noise(11, 200);

export const Beat4Cascade: React.FC = () => {
  const frame = useCurrentFrame();

  let k = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      <Plate name="lending-cascade" />

      {TIERS.map((tier, ti) => {
        // fall from just under this tier to the top of the next one
        const fallTop = tier.top + 34;
        const fallLen = 320 - 34;
        const left = (1080 - tier.width) / 2;

        return Array.from({ length: COUNTS[ti] }, (_, ci) => {
          const a = N[k % N.length];
          k += 1;
          const b = N[k % N.length];
          k += 1;

          const x = left + a * (tier.width - COIN);
          const speed = 3.2 + b * 2.4;
          // Position is a pure function of frame -> deterministic and seekable.
          const y = fallTop + ((frame * speed + ci * 37 + ti * 91) % fallLen);

          return (
            <Img
              key={`${ti}-${ci}`}
              src={staticFile('plates/coin.png')}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                width: COIN,
                height: COIN,
                opacity: 0.92,
              }}
            />
          );
        });
      })}

      <MultiplierChain />
    </AbsoluteFill>
  );
};
