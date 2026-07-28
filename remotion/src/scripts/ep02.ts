/**
 * EPISODE 02 — "Your Credit Score Is A Loyalty Card For Debt"
 *
 * Same beat skeleton as ep01 (see that file for the shape and why). Swapping
 * only the words keeps every episode landing on exactly 7:00 and keeps the cut
 * rhythm recognisable episode to episode, which is most of what "a channel with
 * an editing style" actually means.
 */

import type { Script } from '../lib/timeline';

export const ep02: Script = {
  id: 'ep02',
  title: 'Your Credit Score Is A Loyalty Card For Debt',

  packaging: {
    title: 'Your Credit Score Is A Loyalty Card For Debt',
    thumbText: '"GREAT NEWS!"',
    description:
      'My credit app congratulated me for going further into debt. This is what the score actually measures, who it was built for, and the one question that tells you whether a number is on your side.',
  },

  beats: [
    {
      id: 'hook-1',
      dur: 8.5,
      visual: { type: 'host', take: 'ep02-hook.mp4', zoom: 1.32 },
      vo: 'My credit score app sent me a notification this morning that said, and I want to be precise here, great news. I had gone further into debt.',
      emphasize: ['GREAT NEWS'],
      sfx: 'record-scratch',
    },
    {
      id: 'hook-2',
      dur: 8,
      visual: { type: 'host', take: 'ep02-hook.mp4', zoom: 1.12, jumpCuts: 1 },
      vo: 'There was a little green arrow. There was confetti. There was an actual animation of confetti.',
      undercut: 'for owing more money',
    },
    { id: 'hook-freeze', dur: 2, visual: { type: 'freeze', take: 'ep02-hook.mp4', frame: 170, zoom: 1.6 }, sfx: 'boom', music: null },
    {
      id: 'hook-3',
      dur: 3.5,
      visual: { type: 'host', take: 'ep02-hook.mp4', zoom: 1.45 },
      vo: 'Who exactly is this good news for?',
      emphasize: ['FOR WHO?'],
    },
    {
      id: 'title',
      dur: 4,
      visual: { type: 'titleCard', title: 'Your credit score\nis a loyalty card', kicker: 'the money machine, decoded' },
      sfx: 'whoosh',
      music: 'bed-a',
    },

    {
      id: 'thesis-1',
      dur: 15,
      visual: { type: 'host', take: 'ep02-a.mp4', jumpCuts: 2 },
      vo: 'Most people think the credit score is a report card for being good with money. Savings, income, whether you are sensible. It measures none of those things. Not one.',
      emphasize: ['NOT ONE'],
    },
    {
      id: 'thesis-2',
      dur: 15,
      visual: { type: 'host', take: 'ep02-a.mp4', zoom: 1.24, jumpCuts: 1 },
      vo: 'Your salary is not in it. Your savings are not in it. You could have four hundred thousand in cash, no debt ever, and score worse than someone with three cards and a car loan.',
      emphasize: ['SALARY: NO', 'SAVINGS: NO'],
    },
    {
      id: 'thesis-3',
      dur: 14,
      visual: { type: 'host', take: 'ep02-a.mp4', zoom: 1.08 },
      vo: 'Because it was never built to describe you. It was built to describe how profitable you are to lend to. Those are extremely different questions.',
    },

    { id: 'p1-card', dur: 3.5, visual: { type: 'titleCard', title: 'What it\nactually measures', kicker: 'part one' }, sfx: 'whoosh' },
    {
      id: 'p1-1',
      dur: 14,
      visual: { type: 'pip', take: 'ep02-a.mp4', src: 'score-breakdown.png', corner: 'br' },
      vo: 'Here is the published breakdown. Payment history, thirty five percent. Amount owed, thirty. Length of history, fifteen. New credit, ten. Types of credit, ten.',
      annotations: [{ x: 46, y: 52, kind: 'circle', label: 'all of it is borrowing', delay: 40 }],
    },
    {
      id: 'p1-2',
      dur: 13,
      visual: { type: 'host', take: 'ep02-b.mp4', zoom: 1.3, jumpCuts: 1 },
      vo: 'Every single category is a measurement of borrowing. There is no category for the money you have. There is a category for how many kinds of debt you have juggled.',
      emphasize: ['TYPES OF DEBT'],
    },
    {
      id: 'p1-3',
      dur: 13,
      visual: { type: 'host', take: 'ep02-b.mp4', zoom: 1.05 },
      vo: 'That is the ten percent called credit mix. You are rewarded for variety. Like a stamp card. Collect a card, a loan, a mortgage, get a free coffee.',
      undercut: 'there is no free coffee',
    },
    {
      id: 'p1-4',
      dur: 11,
      visual: { type: 'host', take: 'ep02-b.mp4', zoom: 1.38 },
      vo: 'Pay everything off and close the accounts, and the number goes down. Because you stopped being useful.',
      sfx: 'boom',
    },
    { id: 'p1-deadair', dur: 1.2, visual: { type: 'deadAir' }, music: null },
    {
      id: 'p1-5',
      dur: 12,
      visual: { type: 'host', take: 'ep02-b.mp4', zoom: 1.16, jumpCuts: 1 },
      vo: 'There is a name for a person who borrows and always clears the balance before any interest is charged. Inside the industry they are called deadbeats. That is the real term.',
      emphasize: ['DEADBEATS'],
    },

    { id: 'p2-card', dur: 3.5, visual: { type: 'titleCard', title: 'Who the\nnumber is for', kicker: 'part two' }, sfx: 'whoosh', music: 'bed-b' },
    {
      id: 'p2-1',
      dur: 14,
      visual: { type: 'host', take: 'ep02-c.mp4', zoom: 1.1, jumpCuts: 2 },
      vo: 'The score is sold to lenders as a prediction of one thing: the chance you miss a payment in the next two years. That is genuinely all it claims to do.',
    },
    {
      id: 'p2-2',
      dur: 13,
      visual: { type: 'host', take: 'ep02-c.mp4', zoom: 1.28 },
      vo: 'And the ideal customer, the most profitable person in the entire system, is not the one who never misses. It is the one who never misses but never finishes.',
      emphasize: ['NEVER FINISHES'],
    },
    {
      id: 'p2-3',
      dur: 13,
      visual: { type: 'pip', take: 'ep02-c.mp4', src: 'revolver-chart.png', corner: 'bl' },
      vo: 'Carries a balance forever. Pays the minimum. Reliable, permanent, and generating interest every single month for thirty years.',
      annotations: [{ x: 58, y: 45, kind: 'arrow', label: 'the good customer', delay: 45 }],
    },
    {
      id: 'p2-4',
      dur: 12,
      visual: { type: 'host', take: 'ep02-c.mp4', zoom: 1.34 },
      vo: 'Your score going up means you have become better at being that person. The confetti is not for you. The confetti is a receipt.',
      emphasize: ['A RECEIPT'],
    },
    {
      id: 'p2-5',
      dur: 13,
      visual: { type: 'host', take: 'ep02-d.mp4', zoom: 1.14, jumpCuts: 1 },
      vo: 'Which would be a fun little irony, except the number has quietly escaped the lending system entirely, and that part is not funny at all.',
    },

    {
      id: 'sponsor',
      dur: 26,
      visual: {
        type: 'sponsor',
        brand: 'Your sponsor here',
        body: 'Thirty seconds, walled off, timer running, then straight back. Nobody has ever unsubscribed over an ad they could see the end of.',
      },
      music: 'bed-sponsor',
    },

    { id: 'p3-card', dur: 3.5, visual: { type: 'titleCard', title: 'It escaped\nthe bank', kicker: 'part three' }, sfx: 'whoosh', music: 'bed-b' },
    {
      id: 'p3-1',
      dur: 14,
      visual: { type: 'host', take: 'ep02-d.mp4', zoom: 1.06, jumpCuts: 2 },
      vo: 'A number invented to price a loan now decides whether you get a flat, a phone contract, a car insurance premium, and in some places whether you get the job.',
      emphasize: ['THE JOB'],
    },
    {
      id: 'p3-2',
      dur: 13,
      visual: { type: 'host', take: 'ep02-d.mp4', zoom: 1.3 },
      vo: 'So the person who has never borrowed anything in their life — by choice, or on principle — gets treated as a stranger. Not a low risk. Unknown.',
      undercut: 'the term is "credit invisible"',
    },
    {
      id: 'p3-receipt',
      dur: 15,
      visual: {
        type: 'receipt',
        lines: [
          'Cash buyer, zero debt | "thin file"',
          'Deposit on a flat | 2 months extra',
          'Car insurance, same driver | +£280 / yr',
          'Phone contract | pay upfront',
          'Cost of never borrowing | ~£1,100 / yr',
        ],
        highlight: 4,
      },
      sfx: 'boom',
      music: null,
    },
    {
      id: 'p3-3',
      dur: 12,
      visual: { type: 'host', take: 'ep02-e.mp4', zoom: 1.4 },
      vo: 'Eleven hundred a year. That is the fee for not participating. They found a way to charge you interest for refusing to pay interest.',
      emphasize: ['A FEE FOR NOT'],
    },
    { id: 'p3-deadair', dur: 1.3, visual: { type: 'deadAir' }, music: null },
    {
      id: 'p3-4',
      dur: 13,
      visual: { type: 'host', take: 'ep02-e.mp4', zoom: 1.1, jumpCuts: 1 },
      vo: 'And I want to be fair here, because there is a real problem underneath this. A lender genuinely does need some way to tell strangers apart. That part is not a scam.',
      music: 'bed-c',
    },
    {
      id: 'p3-5',
      dur: 11.5,
      visual: { type: 'host', take: 'ep02-e.mp4', zoom: 1.32 },
      vo: 'The scam is that we let one number, owned by three private companies, become a moral score. It is not a measure of character. It never was.',
      emphasize: ['THREE COMPANIES'],
    },

    { id: 'p4-card', dur: 3.5, visual: { type: 'titleCard', title: 'What to\ndo about it', kicker: 'part four' }, sfx: 'whoosh' },
    {
      id: 'p4-1',
      dur: 14,
      visual: { type: 'host', take: 'ep02-f.mp4', zoom: 1.02 },
      vo: 'So, practically. You are allowed to play the game without believing in it. Keep one old account open, keep utilisation low, never carry a balance, and stop reading the app.',
    },
    {
      id: 'p4-2',
      dur: 14,
      visual: { type: 'host', take: 'ep02-f.mp4', zoom: 1.2, jumpCuts: 1 },
      vo: 'But the deeper fix is to stop needing the number. And the number exists for exactly one reason: because the thing you want costs more than you have, right now.',
      emphasize: ['RIGHT NOW'],
    },
    {
      id: 'p4-3',
      dur: 14,
      visual: { type: 'host', take: 'ep02-f.mp4', zoom: 1.16 },
      vo: 'Every alternative system I have looked at solves that the same dull way. Someone with the money buys the thing, sells it to you at a fixed price, and takes the risk of owning it in between.',
    },
    {
      id: 'p4-4',
      dur: 13,
      visual: { type: 'host', take: 'ep02-g.mp4', zoom: 1.26 },
      vo: 'No score needed, because there is no ongoing debt to price. There is a price. You agreed to it. It does not move.',
      undercut: 'murabaha. part 7 of the series.',
    },
    {
      id: 'p4-5',
      dur: 13,
      visual: { type: 'host', take: 'ep02-g.mp4', zoom: 1.05, jumpCuts: 1 },
      vo: 'So here is the question I would like you to ask the next time an app congratulates you. Did my life get better, or did my file get better?',
      emphasize: ['MY LIFE OR MY FILE'],
    },
    {
      id: 'p4-6',
      dur: 12,
      visual: { type: 'host', take: 'ep02-g.mp4', zoom: 1.34 },
      vo: 'Because they are not the same thing, and only one of them sends you confetti.',
      sfx: 'boom',
    },

    {
      id: 'outro',
      dur: 12,
      visual: { type: 'host', take: 'ep02-g.mp4', zoom: 1.12 },
      vo: 'Tell me your score in the comments. I am joking, do not do that. Tell me what your app has congratulated you for instead — and subscribe, next one is about a golden retriever.',
    },
    { id: 'endcard', dur: 9, visual: { type: 'endCard', next: 'Your savings account\nis terrible' }, music: 'bed-outro' },
  ],
};
