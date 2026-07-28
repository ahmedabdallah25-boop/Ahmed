/**
 * EPISODE 04 — "Every Passive Income Video Is The Same Video"
 *
 * The pure-format episode: a genre teardown with a bingo card as the running
 * visual gag. This is the one that travels furthest outside the finance
 * audience, so the mechanism is held back longer than usual and the first four
 * minutes are almost entirely jokes.
 *
 * Same 7:00 beat skeleton as ep01.
 */

import type { Script } from '../lib/timeline';

export const ep04: Script = {
  id: 'ep04',
  title: 'Every Passive Income Video Is The Same Video',

  packaging: {
    title: 'Every Passive Income Video Is The Same Video',
    thumbText: 'I MADE A BINGO CARD',
    description:
      'I watched 42 passive income videos in one week. They are the same video. I made a bingo card to prove it — and then worked out what the genre is actually selling, because it is not passive income.',
  },

  beats: [
    {
      id: 'hook-1',
      dur: 8.5,
      visual: { type: 'host', take: 'ep04-hook.mp4', zoom: 1.32 },
      vo: 'I watched forty two passive income videos this week. Not clips. Full videos. And by video nine I realised I was watching the same one on a loop.',
      emphasize: ['42 VIDEOS'],
      sfx: 'record-scratch',
    },
    {
      id: 'hook-2',
      dur: 8,
      visual: { type: 'pip', take: 'ep04-hook.mp4', src: 'bingo-card.png', corner: 'br' },
      vo: 'So I made a bingo card. And by video eleven I had won.',
      undercut: 'i did not feel like a winner',
    },
    { id: 'hook-freeze', dur: 2, visual: { type: 'freeze', take: 'ep04-hook.mp4', frame: 175, zoom: 1.6 }, sfx: 'boom', music: null },
    {
      id: 'hook-3',
      dur: 3.5,
      visual: { type: 'host', take: 'ep04-hook.mp4', zoom: 1.45 },
      vo: 'Twice.',
      emphasize: ['TWICE'],
    },
    {
      id: 'title',
      dur: 4,
      visual: { type: 'titleCard', title: 'Every passive\nincome video\nis the same video', kicker: 'the money machine, decoded' },
      sfx: 'whoosh',
      music: 'bed-a',
    },

    {
      id: 'thesis-1',
      dur: 15,
      visual: { type: 'host', take: 'ep04-a.mp4', jumpCuts: 2 },
      vo: 'Here is the card. Rented car in the first eight seconds. The words while you sleep. A whiteboard. A number with the word K after it. And a moment where he says he almost did not make this video.',
      emphasize: ['WHILE YOU SLEEP'],
    },
    {
      id: 'thesis-2',
      dur: 15,
      visual: { type: 'host', take: 'ep04-a.mp4', zoom: 1.24, jumpCuts: 1 },
      vo: 'He always almost did not make the video. Forty two men, all on the brink of not doing it, all pulling through at the last second, for us.',
      undercut: 'thank you for your service',
    },
    {
      id: 'thesis-3',
      dur: 14,
      visual: { type: 'host', take: 'ep04-a.mp4', zoom: 1.08 },
      vo: 'But underneath the format there is an actual structure, and once you see it you cannot unsee it, and you also cannot be sold anything by it again. So let us ruin it.',
    },

    { id: 'p1-card', dur: 3.5, visual: { type: 'titleCard', title: 'The four\nmoves', kicker: 'part one' }, sfx: 'whoosh' },
    {
      id: 'p1-1',
      dur: 14,
      visual: { type: 'pip', take: 'ep04-a.mp4', src: 'guru-thumbnails.png', corner: 'br' },
      vo: 'Move one: the proof. A screenshot of a dashboard. Always a dashboard, never a bank statement, because a dashboard is a picture of revenue and a statement is a picture of reality.',
      annotations: [{ x: 44, y: 44, kind: 'circle', label: 'gross, not net', delay: 40 }],
    },
    {
      id: 'p1-2',
      dur: 13,
      visual: { type: 'host', take: 'ep04-b.mp4', zoom: 1.3, jumpCuts: 1 },
      vo: 'Move two: the humility. I was broke, I was sleeping in a car, I had nine dollars. This is load bearing. You cannot sell a ladder to someone who thinks you were born at the top of it.',
      emphasize: ['THE HUMILITY'],
    },
    {
      id: 'p1-3',
      dur: 13,
      visual: { type: 'host', take: 'ep04-b.mp4', zoom: 1.05 },
      vo: 'Move three: the method, which is always described at exactly the altitude where it sounds specific and contains no instructions. Find a winning product. Build a system. Scale it.',
      undercut: 'step 2: draw the rest of the owl',
    },
    {
      id: 'p1-4',
      dur: 11,
      visual: { type: 'host', take: 'ep04-b.mp4', zoom: 1.38 },
      vo: 'Move four: the free thing. Which is a form. Which is your email. Which is the product.',
      sfx: 'boom',
    },
    { id: 'p1-deadair', dur: 1.2, visual: { type: 'deadAir' }, music: null },
    {
      id: 'p1-5',
      dur: 12,
      visual: { type: 'host', take: 'ep04-b.mp4', zoom: 1.16, jumpCuts: 1 },
      vo: 'You have just watched a twenty two minute advert for a mailing list, and you gave it a like, because it was a good advert.',
      emphasize: ['A GOOD ADVERT'],
    },

    { id: 'p2-card', dur: 3.5, visual: { type: 'titleCard', title: 'The word\ndoing all\nthe work', kicker: 'part two' }, sfx: 'whoosh', music: 'bed-b' },
    {
      id: 'p2-1',
      dur: 14,
      visual: { type: 'host', take: 'ep04-c.mp4', zoom: 1.1, jumpCuts: 2 },
      vo: 'The word is passive. And in every single one of these videos it is doing something dishonest, which is standing in for the word unpaid.',
      emphasize: ['UNPAID'],
    },
    {
      id: 'p2-2',
      dur: 13,
      visual: { type: 'host', take: 'ep04-c.mp4', zoom: 1.28 },
      vo: 'Dropshipping is a shop. Print on demand is a shop. A faceless channel is a production company where you are every single department.',
    },
    {
      id: 'p2-3',
      dur: 13,
      visual: { type: 'pip', take: 'ep04-c.mp4', src: 'hours-chart.png', corner: 'bl' },
      vo: 'These are jobs. They are fine jobs. Some of them are good jobs. What they are not, at any point, is passive.',
      annotations: [{ x: 55, y: 42, kind: 'arrow', label: '"passive"', delay: 45 }],
    },
    {
      id: 'p2-4',
      dur: 12,
      visual: { type: 'host', take: 'ep04-c.mp4', zoom: 1.34 },
      vo: 'And calling a job passive is how you get someone to work sixty hours a week and feel like a failure for being tired.',
      emphasize: ['FEEL LIKE A FAILURE'],
    },
    {
      id: 'p2-5',
      dur: 13,
      visual: { type: 'host', take: 'ep04-d.mp4', zoom: 1.14, jumpCuts: 1 },
      vo: 'Now — real passive income does exist. It is just deeply, aggressively unwatchable, which is the entire reason nobody makes videos about it.',
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

    { id: 'p3-card', dur: 3.5, visual: { type: 'titleCard', title: 'The boring\nversion', kicker: 'part three' }, sfx: 'whoosh', music: 'bed-b' },
    {
      id: 'p3-1',
      dur: 14,
      visual: { type: 'host', take: 'ep04-d.mp4', zoom: 1.06, jumpCuts: 2 },
      vo: 'There are exactly two ways money arrives without you working. You own a thing somebody rents. Or you lend money and charge for the waiting.',
      emphasize: ['OWN, OR LEND'],
    },
    {
      id: 'p3-2',
      dur: 13,
      visual: { type: 'host', take: 'ep04-d.mp4', zoom: 1.3 },
      vo: 'That is the whole list. Property, equipment, a business you are not running, a share of something that produces. Or interest, which is the entire rest of the financial system.',
      undercut: 'guess which one is easier to sell',
    },
    {
      id: 'p3-receipt',
      dur: 15,
      visual: {
        type: 'receipt',
        lines: [
          'Guru claim, month 1 | $8,000',
          'Ad spend | − $5,200',
          'Product cost | − $2,100',
          'Hours worked | 61 / week',
          'Actual hourly | $2.75',
        ],
        highlight: 4,
      },
      sfx: 'boom',
      music: null,
    },
    {
      id: 'p3-3',
      dur: 12,
      visual: { type: 'host', take: 'ep04-e.mp4', zoom: 1.4 },
      vo: 'Two dollars seventy five an hour, and a Lamborghini in the thumbnail. Those two facts live in the same video and nobody blinks.',
      emphasize: ['$2.75/HR'],
    },
    { id: 'p3-deadair', dur: 1.3, visual: { type: 'deadAir' }, music: null },
    {
      id: 'p3-4',
      dur: 13,
      visual: { type: 'host', take: 'ep04-e.mp4', zoom: 1.1, jumpCuts: 1 },
      vo: 'And I want to be careful, because the honest version of the first option — owning things that produce — is genuinely how it works, and it is not a scam. It is just slow.',
      music: 'bed-c',
    },
    {
      id: 'p3-5',
      dur: 11.5,
      visual: { type: 'host', take: 'ep04-e.mp4', zoom: 1.32 },
      vo: 'Nobody can sell you slow. There is no thumbnail for compound. There is no dashboard screenshot of patience.',
      emphasize: ['NO THUMBNAIL FOR SLOW'],
    },

    { id: 'p4-card', dur: 3.5, visual: { type: 'titleCard', title: 'Rent, not\ninterest', kicker: 'part four' }, sfx: 'whoosh' },
    {
      id: 'p4-1',
      dur: 14,
      visual: { type: 'host', take: 'ep04-f.mp4', zoom: 1.02 },
      vo: 'The half of the list I would actually push you toward is the first half. Own the thing. Take the risk that the thing breaks. Get paid because it produces something.',
    },
    {
      id: 'p4-2',
      dur: 14,
      visual: { type: 'host', take: 'ep04-f.mp4', zoom: 1.2, jumpCuts: 1 },
      vo: 'That is a completely different relationship to the second half, where you own nothing, risk nothing, and get paid purely because time passed.',
      emphasize: ['BECAUSE TIME PASSED'],
    },
    {
      id: 'p4-3',
      dur: 14,
      visual: { type: 'host', take: 'ep04-f.mp4', zoom: 1.16 },
      vo: 'The old rule sets draw the line in exactly that place. Rent is fine. Profit share is fine. Charging for the waiting is the thing they will not have.',
    },
    {
      id: 'p4-4',
      dur: 13,
      visual: { type: 'host', take: 'ep04-g.mp4', zoom: 1.26 },
      vo: 'Which sounds like a religious technicality until you notice it is also just the difference between an investor and a landlord of money.',
      undercut: 'sukuk. part 9 of the series.',
    },
    {
      id: 'p4-5',
      dur: 13,
      visual: { type: 'host', take: 'ep04-g.mp4', zoom: 1.05, jumpCuts: 1 },
      vo: 'So the test for any passive income pitch is one question, and it is not how much. It is: what do I own at the end of this?',
      emphasize: ['WHAT DO I OWN?'],
    },
    {
      id: 'p4-6',
      dur: 12,
      visual: { type: 'host', take: 'ep04-g.mp4', zoom: 1.34 },
      vo: 'If the answer is a course, a mailing list, and a slightly worse opinion of yourself, you were the passive income.',
      sfx: 'boom',
    },

    {
      id: 'outro',
      dur: 12,
      visual: { type: 'host', take: 'ep04-g.mp4', zoom: 1.12 },
      vo: 'Put a square from the bingo card in the comments — I will pin the best one. And subscribe, because next week a man in a rented supercar has some thoughts about my coffee.',
    },
    { id: 'endcard', dur: 9, visual: { type: 'endCard', next: 'The guy who says your coffee\nis why you are poor' }, music: 'bed-outro' },
  ],
};
