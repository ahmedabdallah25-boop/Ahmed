/**
 * EPISODE 03 — "Your Savings Account Is Terrible"
 *
 * The closest thing in this set to a straight commentary episode: a bank ad is
 * the on-screen antagonist for the first half, so this is the one to build the
 * PiP-heavy cutaway stack around.
 *
 * Same 7:00 beat skeleton as ep01.
 */

import type { Script } from '../lib/timeline';

export const ep03: Script = {
  id: 'ep03',
  title: 'Your Savings Account Is Terrible',

  packaging: {
    title: 'Your Savings Account Is Terrible',
    thumbText: 'THE AD HAS A DOG IN IT',
    description:
      'This bank ad has a golden retriever in it. It does not have an interest rate in it. Here is what the safest place for your money is actually doing to it, and the arithmetic the ad is built to keep off screen.',
  },

  beats: [
    {
      id: 'hook-1',
      dur: 8.5,
      visual: { type: 'host', take: 'ep03-hook.mp4', zoom: 1.32 },
      vo: 'This bank advert has a golden retriever in it. It has a couple laughing in a kitchen. It has a man successfully assembling furniture.',
      emphasize: ['A DOG'],
      sfx: 'record-scratch',
    },
    {
      id: 'hook-2',
      dur: 8,
      visual: { type: 'pip', take: 'ep03-hook.mp4', src: 'bank-ad-still.png', corner: 'br' },
      vo: 'What it does not have, anywhere in forty seconds, is a number.',
      undercut: 'the number is 0.4%',
      annotations: [{ x: 30, y: 70, kind: 'scribble', delay: 30 }],
    },
    { id: 'hook-freeze', dur: 2, visual: { type: 'freeze', take: 'ep03-hook.mp4', frame: 160, zoom: 1.6 }, sfx: 'boom', music: null },
    {
      id: 'hook-3',
      dur: 3.5,
      visual: { type: 'host', take: 'ep03-hook.mp4', zoom: 1.45 },
      vo: 'The dog is there instead of the number.',
      emphasize: ['INSTEAD OF'],
    },
    {
      id: 'title',
      dur: 4,
      visual: { type: 'titleCard', title: 'Your savings\naccount\nis terrible', kicker: 'the money machine, decoded' },
      sfx: 'whoosh',
      music: 'bed-a',
    },

    {
      id: 'thesis-1',
      dur: 15,
      visual: { type: 'host', take: 'ep03-a.mp4', jumpCuts: 2 },
      vo: 'Your savings account is the safest place to slowly lose everything. And I mean that literally — not as a figure of speech, as arithmetic that runs whether you look at it or not.',
      emphasize: ['SAFEST', 'SLOWEST'],
    },
    {
      id: 'thesis-2',
      dur: 15,
      visual: { type: 'host', take: 'ep03-a.mp4', zoom: 1.24, jumpCuts: 1 },
      vo: 'Because there are two numbers involved, and the ad is only allowed to be enthusiastic about one of them. The one it is quiet about is bigger.',
    },
    {
      id: 'thesis-3',
      dur: 14,
      visual: { type: 'host', take: 'ep03-a.mp4', zoom: 1.08 },
      vo: 'So today we are going to put both numbers on screen at once, which I promise is the most aggressive thing anyone has ever done to a bank.',
      undercut: 'they hate this one trick: subtraction',
    },

    { id: 'p1-card', dur: 3.5, visual: { type: 'titleCard', title: 'The dog\nis load-bearing', kicker: 'part one' }, sfx: 'whoosh' },
    {
      id: 'p1-1',
      dur: 14,
      visual: { type: 'pip', take: 'ep03-a.mp4', src: 'bank-ad-still-2.png', corner: 'br' },
      vo: 'Count the words this ad uses. Safe. Secure. Protected. Peace of mind. Your money, working for you. Every one of those is a feeling. None of them is a rate.',
      annotations: [{ x: 50, y: 40, kind: 'box', delay: 35 }],
    },
    {
      id: 'p1-2',
      dur: 13,
      visual: { type: 'host', take: 'ep03-b.mp4', zoom: 1.3, jumpCuts: 1 },
      vo: 'The rate is in six point grey type at the bottom, on screen for one and a half seconds, next to the words rate may vary.',
      emphasize: ['MAY VARY'],
    },
    {
      id: 'p1-3',
      dur: 13,
      visual: { type: 'host', take: 'ep03-b.mp4', zoom: 1.05 },
      vo: 'And it will vary. When the central bank raises rates, your mortgage moves the same afternoon. Your savings rate takes about eleven months to notice.',
      undercut: 'it moves down in a week, though',
    },
    {
      id: 'p1-4',
      dur: 11,
      visual: { type: 'host', take: 'ep03-b.mp4', zoom: 1.38 },
      vo: 'That gap has a name inside banks. It is called deposit beta. There is an entire job title for it.',
      sfx: 'boom',
    },
    { id: 'p1-deadair', dur: 1.2, visual: { type: 'deadAir' }, music: null },
    {
      id: 'p1-5',
      dur: 12,
      visual: { type: 'host', take: 'ep03-b.mp4', zoom: 1.16, jumpCuts: 1 },
      vo: 'Somebody is at a desk right now, being measured on how slowly they pass a rate rise on to you. And they are hitting their targets.',
      emphasize: ['HITTING TARGET'],
    },

    { id: 'p2-card', dur: 3.5, visual: { type: 'titleCard', title: 'Where your\nmoney went', kicker: 'part two' }, sfx: 'whoosh', music: 'bed-b' },
    {
      id: 'p2-1',
      dur: 14,
      visual: { type: 'host', take: 'ep03-c.mp4', zoom: 1.1, jumpCuts: 2 },
      vo: 'Here is what people think a savings account is. A locker. Your money sits in it. The bank guards it. Occasionally they thank you with a small amount of money.',
    },
    {
      id: 'p2-2',
      dur: 13,
      visual: { type: 'host', take: 'ep03-c.mp4', zoom: 1.28 },
      vo: 'That is not what happens. The moment it lands, it is not your money in a box. It is a loan. You are the lender. The bank is the borrower.',
      emphasize: ['YOU ARE THE LENDER'],
    },
    {
      id: 'p2-3',
      dur: 13,
      visual: { type: 'pip', take: 'ep03-c.mp4', src: 'balance-sheet.png', corner: 'bl' },
      vo: 'On their books your balance is literally filed under liabilities. It is a debt they owe you. And they are paying you nought point four percent for it.',
      annotations: [{ x: 60, y: 48, kind: 'circle', label: 'you', delay: 45 }],
    },
    {
      id: 'p2-4',
      dur: 12,
      visual: { type: 'host', take: 'ep03-c.mp4', zoom: 1.34 },
      vo: 'Then they lend it out at six. You are the wholesale supplier for a business that never told you that you had joined it.',
      emphasize: ['0.4 IN, 6 OUT'],
    },
    {
      id: 'p2-5',
      dur: 13,
      visual: { type: 'host', take: 'ep03-d.mp4', zoom: 1.14, jumpCuts: 1 },
      vo: 'Which, fine, that is a business. Banks are allowed to make money. The problem is the second number, and the second number is not the bank at all.',
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

    { id: 'p3-card', dur: 3.5, visual: { type: 'titleCard', title: 'The tax you\nnever voted for', kicker: 'part three' }, sfx: 'whoosh', music: 'bed-b' },
    {
      id: 'p3-1',
      dur: 14,
      visual: { type: 'host', take: 'ep03-d.mp4', zoom: 1.06, jumpCuts: 2 },
      vo: 'Inflation. Which everybody has heard of, and almost nobody applies to their own balance, because the balance never goes down. The number on the screen is stable. That is the trick.',
      emphasize: ['THE NUMBER IS STABLE'],
    },
    {
      id: 'p3-2',
      dur: 13,
      visual: { type: 'host', take: 'ep03-d.mp4', zoom: 1.3 },
      vo: 'Ten thousand pounds stays ten thousand pounds forever. It just quietly buys less every year. Nothing is deducted. There is no line on the statement.',
      undercut: 'no notification. no confetti.',
    },
    {
      id: 'p3-receipt',
      dur: 15,
      visual: {
        type: 'receipt',
        lines: [
          'You deposited | £10,000',
          'Interest at 0.4% | + £40',
          'Inflation at 3.9% | − £390',
          'Balance on screen | £10,040',
          'What it actually buys | £9,650',
        ],
        highlight: 4,
      },
      sfx: 'boom',
      music: null,
    },
    {
      id: 'p3-3',
      dur: 12,
      visual: { type: 'host', take: 'ep03-e.mp4', zoom: 1.4 },
      vo: 'You are down three hundred and fifty quid, in the safest product they sell, in a year where you did absolutely nothing wrong.',
      emphasize: ['−£350'],
    },
    { id: 'p3-deadair', dur: 1.3, visual: { type: 'deadAir' }, music: null },
    {
      id: 'p3-4',
      dur: 13,
      visual: { type: 'host', take: 'ep03-e.mp4', zoom: 1.1, jumpCuts: 1 },
      vo: 'And notice nobody took it. There is no thief. The money did not go anywhere. The unit it is measured in got smaller while you were holding it.',
      music: 'bed-c',
    },
    {
      id: 'p3-5',
      dur: 11.5,
      visual: { type: 'host', take: 'ep03-e.mp4', zoom: 1.32 },
      vo: 'That is why it is such a good tax. There is nobody to complain to. There is not even a form.',
      emphasize: ['NO FORM'],
    },

    { id: 'p4-card', dur: 3.5, visual: { type: 'titleCard', title: 'Money that\ncannot be\nprinted', kicker: 'part four' }, sfx: 'whoosh' },
    {
      id: 'p4-1',
      dur: 14,
      visual: { type: 'host', take: 'ep03-f.mp4', zoom: 1.02 },
      vo: 'So the actual question is not which bank pays the best rate. Chasing nought point six instead of nought point four is rearranging deckchairs. The question is what you are holding.',
    },
    {
      id: 'p4-2',
      dur: 14,
      visual: { type: 'host', take: 'ep03-f.mp4', zoom: 1.2, jumpCuts: 1 },
      vo: 'Because cash is the only asset with a guaranteed negative real return, and it is the one every institution recommends to beginners as the safe option.',
      emphasize: ['GUARANTEED NEGATIVE'],
    },
    {
      id: 'p4-3',
      dur: 14,
      visual: { type: 'host', take: 'ep03-f.mp4', zoom: 1.16 },
      vo: 'For most of history, money was a thing nobody could make more of. Weight of metal, mostly. Boring, heavy, and completely immune to a policy decision made in a meeting you were not in.',
    },
    {
      id: 'p4-4',
      dur: 13,
      visual: { type: 'host', take: 'ep03-g.mp4', zoom: 1.26 },
      vo: 'You do not need to go and bury metal in the garden. The point is the principle: hold things that have to be produced, not things that can be announced.',
      emphasize: ['PRODUCED, NOT ANNOUNCED'],
    },
    {
      id: 'p4-5',
      dur: 13,
      visual: { type: 'host', take: 'ep03-g.mp4', zoom: 1.05, jumpCuts: 1 },
      vo: 'Keep the emergency fund in cash — that is not what this is about, you need money that does not move. But cash is a waiting room. It was never supposed to be the destination.',
      undercut: 'three to six months. then stop.',
    },
    {
      id: 'p4-6',
      dur: 12,
      visual: { type: 'host', take: 'ep03-g.mp4', zoom: 1.34 },
      vo: 'The dog is in the ad so that you feel safe enough to stay in the waiting room forever.',
      sfx: 'boom',
    },

    {
      id: 'outro',
      dur: 12,
      visual: { type: 'host', take: 'ep03-g.mp4', zoom: 1.12 },
      vo: 'Go and look up the actual rate on your own savings account right now, and put it in the comments. I want to see how bad this gets. Subscribe — next one, everybody is lying about passive income.',
    },
    { id: 'endcard', dur: 9, visual: { type: 'endCard', next: 'Every passive income video\nis the same video' }, music: 'bed-outro' },
  ],
};
