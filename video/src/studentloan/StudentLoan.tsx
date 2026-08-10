import React from 'react';
import {ScenePack} from '../pension/Pension';
import {SCENES} from './timeline';

// Deliberately not a copy of the pension component. Part 17 holds caption
// treatment, palette and cut behaviour constant against Part 16 — the pack is
// explicit that caption treatment is a held variable, not a free one — so the
// two Shorts run the same component and differ only in what is bound to it:
// their own scene list, their own voiceover, their own stills directory.
//
// Copying it would have let the two drift silently, which is exactly the
// failure this upload is designed to avoid measuring.
export const StudentLoan: React.FC<{audit?: boolean}> = ({audit = false}) => (
  <ScenePack
    scenes={SCENES}
    vo="vo-student-loan.mp3"
    scenesDir="studentloan"
    audit={audit}
  />
);
