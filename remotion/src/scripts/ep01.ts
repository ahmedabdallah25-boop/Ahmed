/**
 * EPISODE 01 — "Buy Now, Pay Later Is Terrible"
 *
 * The flagship. Word-for-word, timed to 7:00.
 *
 * Structure is lifted from the commentary-video shape that the reference cut
 * ("Donald Trump's Christian Movie Is Terrible") runs on:
 *   cold open joke → title slam → thesis → three escalating sections →
 *   sponsor wall → the receipt (the one sincere beat) → the turn → end card.
 *
 * The channel's own proven formula is welded into it: the hook is a
 * personal-stakes paradox, the topic is universal money, and the Islamic-finance
 * mechanism arrives as the answer at the end rather than as the subject.
 *
 * Delivery note for the voice clone: ~165 wpm, no dramatic pauses in the VO
 * itself. Every pause in this video is a cut, not a breath.
 */

import type { Script } from '../lib/timeline';

export const ep01: Script = {
  id: 'ep01',
  title: 'Buy Now, Pay Later Is Terrible',

  packaging: {
    title: 'Buy Now, Pay Later Is Terrible',
    thumbText: '4 PAYMENTS OF $4.12',
    description:
      'You can now finance a burrito. In this one we read the fine print out loud, do the arithmetic the checkout page hides, and find out who is actually paying for your zero percent. No jargon. Just mechanisms.',
  },

  beats: [
    // ---------------------------------------------------------------- COLD OPEN
    {
      id: 'hook-1',
      dur: 8.5,
      visual: { type: 'host', take: 'ep01-hook.mp4', zoom: 1.32 },
      vo: 'You can now finance a burrito. Not a car. Not a house. A burrito. Four easy payments of four dollars and twelve cents.',
      emphasize: ['A BURRITO'],
      sfx: 'record-scratch',
    },
    {
      id: 'hook-2',
      dur: 8,
      visual: { type: 'host', take: 'ep01-hook.mp4', zoom: 1.12, jumpCuts: 1 },
      vo: 'And the button that offers you this does not say loan. It says pay in four. In a really friendly font.',
      undercut: 'it is a loan',
    },
    {
      id: 'hook-freeze',
      dur: 2,
      visual: { type: 'freeze', take: 'ep01-hook.mp4', frame: 190, zoom: 1.6 },
      sfx: 'boom',
      music: null,
    },
    {
      id: 'hook-3',
      dur: 3.5,
      visual: { type: 'host', take: 'ep01-hook.mp4', zoom: 1.45 },
      vo: 'That font is the entire product.',
      emphasize: ['THE FONT'],
    },

    // ------------------------------------------------------------------- TITLE
    {
      id: 'title',
      dur: 4,
      visual: { type: 'titleCard', title: 'Buy Now,\nPay Later\nIs Terrible', kicker: 'the money machine, decoded' },
      sfx: 'whoosh',
      music: 'bed-a',
    },

    // ------------------------------------------------------------------ THESIS
    {
      id: 'thesis-1',
      dur: 15,
      visual: { type: 'host', take: 'ep01-a.mp4', zoom: 1, jumpCuts: 2 },
      vo: 'Buy now pay later moved about a hundred and eighty billion dollars of stuff last year. It is in your checkout page, your food delivery app, and — I checked this — your dentist.',
      emphasize: ['$180 BILLION'],
    },
    {
      id: 'thesis-2',
      dur: 15,
      visual: { type: 'host', take: 'ep01-a.mp4', zoom: 1.24, jumpCuts: 1 },
      vo: 'And almost nobody using it believes they are borrowing money. That is not an accident. That is a design decision somebody got promoted for.',
      emphasize: ['PROMOTED'],
      undercut: 'senior product manager, financial wellbeing',
    },
    {
      id: 'thesis-3',
      dur: 14,
      visual: { type: 'host', take: 'ep01-a.mp4', zoom: 1.08 },
      vo: 'So today: we read the fine print out loud, we do the arithmetic the checkout page really does not want on screen, and we find out who is actually paying for your zero percent.',
    },

    // ------------------------------------------------------- PART ONE: THE FONT
    {
      id: 'p1-card',
      dur: 3.5,
      visual: { type: 'titleCard', title: "It's a loan", kicker: 'part one' },
      sfx: 'whoosh',
    },
    {
      id: 'p1-1',
      dur: 14,
      visual: { type: 'pip', take: 'ep01-a.mp4', src: 'checkout-pay-in-4.png', corner: 'br' },
      vo: 'Here is a real checkout screen. Count the words on it. Pay in four. Interest free. No fees. Zero percent APR. Not one of them is the word debt.',
      annotations: [
        { x: 40, y: 46, kind: 'box', delay: 30 },
        { x: 40, y: 62, kind: 'arrow', label: 'a loan', delay: 60 },
      ],
    },
    {
      id: 'p1-2',
      dur: 13,
      visual: { type: 'host', take: 'ep01-b.mp4', zoom: 1.3, jumpCuts: 1 },
      vo: 'Compare that to a credit card application, which is legally required to open with a giant grey box full of numbers that make you sad.',
      undercut: 'the sad box is called a Schumer box. genuinely.',
    },
    {
      id: 'p1-3',
      dur: 13,
      visual: { type: 'host', take: 'ep01-b.mp4', zoom: 1.05 },
      vo: 'Same product. One is regulated like credit, and the other one gets to call itself a payment method, because it splits into four instead of twelve.',
      emphasize: ['FOUR', 'TWELVE'],
    },
    {
      id: 'p1-4',
      dur: 11,
      visual: { type: 'host', take: 'ep01-b.mp4', zoom: 1.38 },
      vo: 'That is it. That is the whole legal difference. Four is a payment plan. Twelve is a loan.',
      sfx: 'boom',
    },
    {
      id: 'p1-deadair',
      dur: 1.2,
      visual: { type: 'deadAir' },
      music: null,
    },
    {
      id: 'p1-5',
      dur: 12,
      visual: { type: 'host', take: 'ep01-b.mp4', zoom: 1.16, jumpCuts: 1 },
      vo: 'And it works. These companies advertise it to shops as a feature: baskets get thirty to forty five percent bigger when the split option is on the page.',
      emphasize: ['+45%'],
      undercut: 'that is the sales pitch. to the shop. in public.',
    },

    // -------------------------------------------------- PART TWO: THE REAL PAYER
    {
      id: 'p2-card',
      dur: 3.5,
      visual: { type: 'titleCard', title: 'Who pays\nfor free?', kicker: 'part two' },
      sfx: 'whoosh',
      music: 'bed-b',
    },
    {
      id: 'p2-1',
      dur: 14,
      visual: { type: 'host', take: 'ep01-c.mp4', zoom: 1.1, jumpCuts: 2 },
      vo: 'If you pay on time, you genuinely pay zero. So the obvious question, the one the ad hopes you never ask: where does the money come from?',
      emphasize: ['WHERE FROM?'],
    },
    {
      id: 'p2-2',
      dur: 13,
      visual: { type: 'host', take: 'ep01-c.mp4', zoom: 1.28 },
      vo: 'Two places. The shop pays a cut — around four to six percent, roughly double what a card costs them. And late fees.',
    },
    {
      id: 'p2-3',
      dur: 13,
      visual: { type: 'pip', take: 'ep01-c.mp4', src: 'merchant-fee-table.png', corner: 'bl' },
      vo: 'Now, a shop that is handing over six percent does not eat six percent. It raises the price. For everyone. Including people paying cash.',
      emphasize: ['EVERYONE'],
      annotations: [{ x: 62, y: 40, kind: 'circle', label: '6%', delay: 45 }],
    },
    {
      id: 'p2-4',
      dur: 12,
      visual: { type: 'host', take: 'ep01-c.mp4', zoom: 1.34 },
      vo: 'So the person who never once clicked pay in four is quietly subsidising the person who did. Congratulations to absolutely nobody.',
      undercut: 'you have been enrolled automatically',
    },
    {
      id: 'p2-5',
      dur: 13,
      visual: { type: 'host', take: 'ep01-d.mp4', zoom: 1.14, jumpCuts: 1 },
      vo: 'And then there is the second revenue line, which the friendly font is even quieter about, and which is the only reason this business works at all.',
    },

    // ----------------------------------------------------------------- SPONSOR
    {
      id: 'sponsor',
      dur: 26,
      visual: {
        type: 'sponsor',
        brand: 'Your sponsor here',
        body: 'Thirty seconds, clearly walled off, timer in the corner, and then straight back into the video. Nobody has ever unsubscribed over an ad they could see the end of.',
      },
      music: 'bed-sponsor',
    },

    // -------------------------------------------------- PART THREE: THE LATE FEE
    {
      id: 'p3-card',
      dur: 3.5,
      visual: { type: 'titleCard', title: 'The late fee\nis the business', kicker: 'part three' },
      sfx: 'whoosh',
      music: 'bed-b',
    },
    {
      id: 'p3-1',
      dur: 14,
      visual: { type: 'host', take: 'ep01-d.mp4', zoom: 1.06, jumpCuts: 2 },
      vo: 'Roughly one in three people who use these things has missed a payment. A third. That is not a fringe of irresponsible users, that is the customer base.',
      emphasize: ['1 IN 3'],
    },
    {
      id: 'p3-2',
      dur: 13,
      visual: { type: 'host', take: 'ep01-d.mp4', zoom: 1.3 },
      vo: 'And a seven dollar late fee on a thirty dollar instalment is not a small penalty. Run it out over the six weeks the plan lasts, and price it like a loan.',
    },
    {
      id: 'p3-receipt',
      dur: 15,
      visual: {
        type: 'receipt',
        lines: [
          'Burrito | $16.50',
          'Split into 4 | $4.12',
          'One missed payment | + $7.00',
          'You borrowed | $12.38 for 6 weeks',
          'Effective annual rate | ~490%',
        ],
        highlight: 4,
      },
      sfx: 'boom',
      music: null,
    },
    {
      id: 'p3-3',
      dur: 12,
      visual: { type: 'host', take: 'ep01-e.mp4', zoom: 1.4 },
      vo: 'Four hundred and ninety percent. On a burrito. Payday lenders get protested outside for less than that.',
      emphasize: ['490%'],
    },
    {
      id: 'p3-deadair',
      dur: 1.3,
      visual: { type: 'deadAir' },
      music: null,
    },
    {
      id: 'p3-4',
      dur: 13,
      visual: { type: 'host', take: 'ep01-e.mp4', zoom: 1.1, jumpCuts: 1 },
      vo: 'And the fee is not attached to the price of the thing. It is attached to you being three days late. Which means the poorer you are, the more the burrito costs.',
      emphasize: ['THE POORER YOU ARE'],
      music: 'bed-c',
    },
    {
      id: 'p3-5',
      dur: 11.5,
      visual: { type: 'host', take: 'ep01-e.mp4', zoom: 1.32 },
      vo: 'And for years the on time payments went unreported, while the defaults went straight onto your file. Heads they win, tails you have a credit problem.',
      emphasize: ['ONLY THE MISSES'],
    },

    // ------------------------------------------------------ PART FOUR: THE TURN
    {
      id: 'p4-card',
      dur: 3.5,
      visual: { type: 'titleCard', title: 'The part\nthat is actually\nthe point', kicker: 'part four' },
      sfx: 'whoosh',
    },
    {
      id: 'p4-1',
      dur: 14,
      visual: { type: 'host', take: 'ep01-f.mp4', zoom: 1.02 },
      vo: 'Here is the thing I actually want you to take away, and it is not that buy now pay later is evil. It is duller than that, and worse.',
    },
    {
      id: 'p4-2',
      dur: 14,
      visual: { type: 'host', take: 'ep01-f.mp4', zoom: 1.2, jumpCuts: 1 },
      vo: 'Every one of these products makes its money from the gap between when you get the thing and when you pay for it. That gap is the product. Not the burrito.',
      emphasize: ['THE GAP'],
    },
    {
      id: 'p4-3',
      dur: 14,
      visual: { type: 'host', take: 'ep01-f.mp4', zoom: 1.16 },
      vo: 'There is a fourteen hundred year old rule set that has exactly one line about this, and the line is: charge for the thing, or charge for the risk. Never charge for the waiting.',
      emphasize: ['NEVER FOR WAITING'],
    },
    {
      id: 'p4-4',
      dur: 13,
      visual: { type: 'host', take: 'ep01-g.mp4', zoom: 1.26 },
      vo: 'Which is why a murabaha — a fixed price sale, one price, agreed up front, that never grows if you are late — sounds boring right up until you have seen the alternative.',
      undercut: 'part 7 of the Shorts series. link below.',
    },
    {
      id: 'p4-5',
      dur: 13,
      visual: { type: 'host', take: 'ep01-g.mp4', zoom: 1.05, jumpCuts: 1 },
      vo: 'You do not need to believe anything to use that rule. You just need to ask one question at every checkout: if I am late, does this number get bigger?',
      emphasize: ['DOES IT GROW?'],
    },
    {
      id: 'p4-6',
      dur: 12,
      visual: { type: 'host', take: 'ep01-g.mp4', zoom: 1.34 },
      vo: 'If it grows, you are not buying a thing. You are renting money. And the friendly font is there so you never notice which one you agreed to.',
      sfx: 'boom',
    },

    // ---------------------------------------------------------------- END CARD
    {
      id: 'outro',
      dur: 12,
      visual: { type: 'host', take: 'ep01-g.mp4', zoom: 1.12 },
      vo: 'If this was new to you, say so in the comments — I read them. And subscribe, because next week we are doing the one that is genuinely worse.',
    },
    {
      id: 'endcard',
      dur: 9,
      visual: { type: 'endCard', next: 'Your credit score is\na loyalty card for debt' },
      music: 'bed-outro',
    },
  ],
};
