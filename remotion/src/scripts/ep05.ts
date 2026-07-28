/**
 * EPISODE 05 — "The Guy Who Says Your Coffee Is Why You're Poor"
 *
 * The angriest one, and the one to publish when the channel wants a spike: it
 * picks a fight with a genre rather than an institution, so the comments do the
 * distribution. The sincere turn in part four is longer than usual on purpose —
 * this episode earns the right to be earnest by being mean first.
 *
 * Same 7:00 beat skeleton as ep01.
 */

import type { Script } from '../lib/timeline';

export const ep05: Script = {
  id: 'ep05',
  title: "The Guy Who Says Your Coffee Is Why You're Poor",

  packaging: {
    title: "The Guy Who Says Your Coffee Is Why You're Poor",
    thumbText: 'IT IS NOT THE COFFEE',
    description:
      'A man in a rented supercar would like to discuss your latte. So I did the arithmetic on every coffee he wants you to skip, against the one line on your bank statement he never mentions. It is not close.',
  },

  beats: [
    {
      id: 'hook-1',
      dur: 8.5,
      visual: { type: 'host', take: 'ep05-hook.mp4', zoom: 1.32 },
      vo: 'A man standing in front of a car he is renting by the hour would like to talk to you about your coffee.',
      emphasize: ['RENTING'],
      sfx: 'record-scratch',
    },
    {
      id: 'hook-2',
      dur: 8,
      visual: { type: 'host', take: 'ep05-hook.mp4', zoom: 1.12, jumpCuts: 1 },
      vo: 'Specifically, he would like you to know that if you had skipped it every day since two thousand and eleven you would own a house.',
      undercut: 'you would own 4% of a house',
    },
    { id: 'hook-freeze', dur: 2, visual: { type: 'freeze', take: 'ep05-hook.mp4', frame: 180, zoom: 1.6 }, sfx: 'boom', music: null },
    {
      id: 'hook-3',
      dur: 3.5,
      visual: { type: 'host', take: 'ep05-hook.mp4', zoom: 1.45 },
      vo: 'I did the maths. It is not close.',
      emphasize: ['NOT CLOSE'],
    },
    {
      id: 'title',
      dur: 4,
      visual: { type: 'titleCard', title: 'It was never\nthe coffee', kicker: 'the money machine, decoded' },
      sfx: 'whoosh',
      music: 'bed-a',
    },

    {
      id: 'thesis-1',
      dur: 15,
      visual: { type: 'host', take: 'ep05-a.mp4', jumpCuts: 2 },
      vo: 'The latte thing is about thirty years old at this point. It has survived three recessions, a pandemic, and the entire invention of the internet, and it is still the number one piece of money advice on this website.',
      emphasize: ['30 YEARS OLD'],
    },
    {
      id: 'thesis-2',
      dur: 15,
      visual: { type: 'host', take: 'ep05-a.mp4', zoom: 1.24, jumpCuts: 1 },
      vo: 'And I understand why it survives. It is the only piece of financial advice that costs the person giving it absolutely nothing, and blames the person receiving it entirely.',
      emphasize: ['BLAMES YOU'],
    },
    {
      id: 'thesis-3',
      dur: 14,
      visual: { type: 'host', take: 'ep05-a.mp4', zoom: 1.08 },
      vo: 'So today: the actual arithmetic on the coffee, the line on your statement that is forty times bigger, and why one of them gets a viral video and the other one does not.',
    },

    { id: 'p1-card', dur: 3.5, visual: { type: 'titleCard', title: 'Doing the\ncoffee maths', kicker: 'part one' }, sfx: 'whoosh' },
    {
      id: 'p1-1',
      dur: 14,
      visual: { type: 'host', take: 'ep05-a.mp4', zoom: 1.14 },
      vo: 'Right. Four pounds fifty, every working day. That is about a thousand a year. Not nothing. Genuinely not nothing — I am not going to pretend a grand is invisible.',
    },
    {
      id: 'p1-2',
      dur: 13,
      visual: { type: 'pip', take: 'ep05-b.mp4', src: 'latte-math.png', corner: 'br' },
      vo: 'Invest that instead, at seven percent, for thirty years, and you land somewhere around ninety five thousand. Which is the number the video always ends on.',
      annotations: [{ x: 62, y: 40, kind: 'circle', label: '£95k', delay: 40 }],
    },
    {
      id: 'p1-3',
      dur: 13,
      visual: { type: 'host', take: 'ep05-b.mp4', zoom: 1.28, jumpCuts: 1 },
      vo: 'Here is what the video never does. It never runs the same thirty years on the mortgage that person is also paying. So I did.',
      emphasize: ['NEVER THE MORTGAGE'],
    },
    {
      id: 'p1-4',
      dur: 11,
      visual: { type: 'host', take: 'ep05-b.mp4', zoom: 1.38 },
      vo: 'Two hundred thousand borrowed at five and a half percent, over thirty years. Interest alone: two hundred and eight thousand.',
      sfx: 'boom',
    },
    { id: 'p1-deadair', dur: 1.2, visual: { type: 'deadAir' }, music: null },
    {
      id: 'p1-5',
      dur: 12,
      visual: { type: 'host', take: 'ep05-b.mp4', zoom: 1.16, jumpCuts: 1 },
      vo: 'You buy the house twice. Once for the person selling it, and once for a bank that did not build it, did not own it, and never visited it.',
      emphasize: ['TWICE'],
    },

    { id: 'p2-card', dur: 3.5, visual: { type: 'titleCard', title: 'Scale\nchecking', kicker: 'part two' }, sfx: 'whoosh', music: 'bed-b' },
    {
      id: 'p2-1',
      dur: 14,
      visual: { type: 'host', take: 'ep05-c.mp4', zoom: 1.1, jumpCuts: 2 },
      vo: 'So put them side by side. Every coffee for thirty years: ninety five thousand of opportunity. The interest on one ordinary mortgage: two hundred and eight thousand, paid.',
    },
    {
      id: 'p2-2',
      dur: 13,
      visual: { type: 'host', take: 'ep05-c.mp4', zoom: 1.28 },
      vo: 'One of those is a lifestyle choice you make four hundred times a year. The other one is a single signature you make once, at twenty nine, in a room where you are the least informed person present.',
      emphasize: ['ONE SIGNATURE'],
    },
    {
      id: 'p2-3',
      dur: 13,
      visual: { type: 'pip', take: 'ep05-c.mp4', src: 'scale-compare.png', corner: 'bl' },
      vo: 'And there are roughly ten thousand videos about the coffee. There is nearly nothing about the signature.',
      annotations: [{ x: 30, y: 55, kind: 'box', delay: 40 }, { x: 72, y: 55, kind: 'arrow', label: 'no videos', delay: 70 }],
    },
    {
      id: 'p2-4',
      dur: 12,
      visual: { type: 'host', take: 'ep05-c.mp4', zoom: 1.34 },
      vo: 'Because the coffee video costs a bank nothing. It is, if anything, extremely convenient for the bank that you spend your one financial worry on a drink.',
      emphasize: ['ON A DRINK'],
    },
    {
      id: 'p2-5',
      dur: 13,
      visual: { type: 'host', take: 'ep05-d.mp4', zoom: 1.14, jumpCuts: 1 },
      vo: 'And there is a second thing the coffee guy does, which is subtler, and honestly worse than being wrong about the numbers.',
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

    { id: 'p3-card', dur: 3.5, visual: { type: 'titleCard', title: 'The blame\nis the point', kicker: 'part three' }, sfx: 'whoosh', music: 'bed-b' },
    {
      id: 'p3-1',
      dur: 14,
      visual: { type: 'host', take: 'ep05-d.mp4', zoom: 1.06, jumpCuts: 2 },
      vo: 'Every one of these videos runs on the same hidden assumption: that the reason you are not rich is a series of small decisions you personally got wrong. That is a very comfortable thing to believe.',
      emphasize: ['YOUR FAULT'],
    },
    {
      id: 'p3-2',
      dur: 13,
      visual: { type: 'host', take: 'ep05-d.mp4', zoom: 1.3 },
      vo: 'Comfortable for him, because it means his own money came from good decisions rather than timing. And comfortable for the system, because a person blaming themselves is not asking anyone else any questions.',
      undercut: 'this is the actual product',
    },
    {
      id: 'p3-receipt',
      dur: 15,
      visual: {
        type: 'receipt',
        lines: [
          'Coffee, 30 years | £95,000',
          'Mortgage interest, 30 years | £208,000',
          'Rent paid while saving a deposit | £151,000',
          'Inflation on cash savings | £38,000',
          'Share of the gap that is coffee | 15%',
        ],
        highlight: 4,
      },
      sfx: 'boom',
      music: null,
    },
    {
      id: 'p3-3',
      dur: 12,
      visual: { type: 'host', take: 'ep05-e.mp4', zoom: 1.4 },
      vo: 'Fifteen percent. So even if you never drink another coffee, for three decades, you have addressed about a seventh of the problem.',
      emphasize: ['15%'],
    },
    { id: 'p3-deadair', dur: 1.3, visual: { type: 'deadAir' }, music: null },
    {
      id: 'p3-4',
      dur: 13,
      visual: { type: 'host', take: 'ep05-e.mp4', zoom: 1.1, jumpCuts: 1 },
      vo: 'And look — I am not telling you to stop budgeting. Spending less than you earn is the entire foundation, there is no clever mechanism underneath it, and nothing in this video replaces it.',
      music: 'bed-c',
    },
    {
      id: 'p3-5',
      dur: 11.5,
      visual: { type: 'host', take: 'ep05-e.mp4', zoom: 1.32 },
      vo: 'I am telling you that budgeting is the small lever, and everyone is shouting about it so that nobody looks at the big one.',
      emphasize: ['THE SMALL LEVER'],
    },

    { id: 'p4-card', dur: 3.5, visual: { type: 'titleCard', title: 'The big\nlever', kicker: 'part four' }, sfx: 'whoosh' },
    {
      id: 'p4-1',
      dur: 14,
      visual: { type: 'host', take: 'ep05-f.mp4', zoom: 1.02 },
      vo: 'The big lever is the structure of the three or four large contracts you sign in your life. The mortgage. The car. The student loan. Whatever you financed because it was offered in instalments.',
    },
    {
      id: 'p4-2',
      dur: 14,
      visual: { type: 'host', take: 'ep05-f.mp4', zoom: 1.2, jumpCuts: 1 },
      vo: 'One afternoon spent on the structure of a mortgage is worth more than a decade of denying yourself things. That is not a motivational statement. That is the arithmetic we just did.',
      emphasize: ['ONE AFTERNOON'],
    },
    {
      id: 'p4-3',
      dur: 14,
      visual: { type: 'host', take: 'ep05-f.mp4', zoom: 1.16 },
      vo: 'And there is a whole parallel system built on exactly one rule about those contracts: that the price of a thing can be high, but it cannot grow just because time is passing.',
    },
    {
      id: 'p4-4',
      dur: 13,
      visual: { type: 'host', take: 'ep05-g.mp4', zoom: 1.26 },
      vo: 'A partnership where your share goes up as you pay, instead of a debt where the interest goes up as you wait. Same house. Completely different thirty years.',
      undercut: 'musharaka. part 8 of the series.',
    },
    {
      id: 'p4-5',
      dur: 13,
      visual: { type: 'host', take: 'ep05-g.mp4', zoom: 1.05, jumpCuts: 1 },
      vo: 'You do not have to adopt anybody’s religion to use the rule. You just have to notice that somebody wrote it down fourteen hundred years ago because this exact problem is not new.',
      emphasize: ['NOT A NEW PROBLEM'],
    },
    {
      id: 'p4-6',
      dur: 12,
      visual: { type: 'host', take: 'ep05-g.mp4', zoom: 1.34 },
      vo: 'So buy the coffee. Genuinely. Buy the coffee, and go and read your mortgage.',
      sfx: 'boom',
    },

    {
      id: 'outro',
      dur: 12,
      visual: { type: 'host', take: 'ep05-g.mp4', zoom: 1.12 },
      vo: 'If you know the interest number on your own mortgage — the total, not the rate — put it in the comments, because almost nobody does, and that is the whole point. Subscribe. No jargon, just mechanisms.',
    },
    { id: 'endcard', dur: 9, visual: { type: 'endCard', next: 'Buy now, pay later\nis terrible' }, music: 'bed-outro' },
  ],
};
