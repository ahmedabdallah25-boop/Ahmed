/**
 * The two reads. `make-vo.mjs` synthesises each one and measures it.
 *
 * `pad` is the silence appended AFTER each line, in seconds — the pauses from
 * vo-script.txt's delivery notes, not padding for its own sake. `beat` maps the line onto
 * a composition beat; `balance` takes two lines (the hook and its turn), the rest are one
 * to one, because the visuals for all seven beats exist in both cuts.
 */

/** The long-form read. Every mechanism stated in full. */
const full = {
  lead: 0.2,
  chainRows: 5,
  // A touch under 1.0 — the long-form hook lands flat and unhurried.
  speed: 0.96,
  lines: [
    {
      beat: 'balance',
      text: 'Right now your bank is holding about three cents of every dollar you think you own.',
      pad: 0.55,
    },
    {
      beat: 'balance',
      text: "Not three percent of the bank's money. Three cents of yours.",
      pad: 0.8, // "punch yours, then a full beat of silence"
    },
    {
      beat: 'vault',
      text: "The rest isn't in a vault. It isn't anywhere. It's a promise, typed into a screen.",
      pad: 0.5,
    },
    {
      beat: 'cascade',
      text: 'You deposited a hundred. The bank kept three and lent out ninety-seven. That ninety-seven got deposited somewhere else, and lent again.',
      pad: 0.45,
    },
    {
      beat: 'owners',
      text: 'One deposit. Thirty different people now believe they own it. And every one of them is right, as long as nobody asks.',
      pad: 0.65,
    },
    {
      beat: 'run',
      text: "That's why a healthy bank dies in a single afternoon. Nothing was stolen. Everyone just showed up on the same day.",
      pad: 0.5,
    },
    {
      beat: 'assets',
      text: 'The alternative already exists. Your deposit stays your deposit. Held, not lent. Money only multiplies when something real was actually built.',
      pad: 0.5,
    },
    {
      beat: 'kicker',
      text: 'Same money. One system needs you not to look. Tomorrow: where the ninety-seven actually goes. No jargon, just mechanisms.',
      pad: 1.1,
    },
  ],
};

/**
 * The Shorts read, ~45s.
 *
 * Cut against the channel's own outlier profile: its best-performing Short is 46s, and
 * the trait the outliers share is a tight read with the sting inside three seconds. So
 * the hook (lines 1-2) is untouched — it is the whole video — and every line after it
 * loses its second clause. The lending chain drops to two rows: "kept three, lent
 * ninety-seven, lent it again" is the mechanism; rows three to five were reinforcement.
 * Pauses tighten too, except the one after "yours", which is doing work.
 */
const short = {
  lead: 0.15,
  chainRows: 2,
  // Full speed rather than 0.96x. Shorts reads run a little quicker, and at 0.96 the
  // trimmed script still came in at 49s against the 46s target.
  speed: 1.0,
  lines: [
    {
      beat: 'balance',
      text: 'Right now your bank is holding about three cents of every dollar you think you own.',
      pad: 0.4,
    },
    {
      beat: 'balance',
      text: "Not three percent of the bank's money. Three cents of yours.",
      pad: 0.6,
    },
    {
      beat: 'vault',
      text: "The rest isn't in a vault. It isn't anywhere.",
      pad: 0.35,
    },
    {
      beat: 'cascade',
      text: 'You deposited a hundred. The bank kept three and lent ninety-seven. Then lent that again.',
      pad: 0.3,
    },
    {
      beat: 'owners',
      text: "One deposit. Thirty people believe they own it. And they're all right, until someone asks.",
      pad: 0.45,
    },
    {
      beat: 'run',
      text: "That's how a healthy bank dies in an afternoon. Everyone showed up on the same day.",
      pad: 0.3,
    },
    {
      beat: 'assets',
      text: 'Your deposit could stay yours. Held, not lent. Money multiplies when something real gets built.',
      pad: 0.35,
    },
    {
      beat: 'kicker',
      text: 'Same money. One system needs you not to look. Tomorrow: where the ninety-seven goes. No jargon, just mechanisms.',
      pad: 0.9,
    },
  ],
};

export const CUTS = { full, short };
