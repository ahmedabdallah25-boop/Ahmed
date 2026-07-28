# Five 7-minute viral concepts — Kurtis Conner edit, Finance % Decoded voice

Full scripts live in `remotion/src/scripts/epNN.ts` and are the single source of
truth: every `vo:` field is the word-for-word narration, and the beat durations
are what the render actually uses. This file is the pitch layer — the concepts,
why each one should travel, and how the edit is built.

All five run **exactly 7:00.00** and are enforced at build time
(`assertRuntime` in `remotion/src/lib/timeline.ts` throws if a script drifts
more than 6 seconds off target).

---

## Why this format, for this channel

The channel's own data says the winners share three things (`channel-study.md`):
a universal money topic, a personal-stakes paradox in the first line, and the
Islamic-finance mechanism arriving as the *answer* rather than as the subject.
Parts 11 and 12 broke that — they led with the mechanism (Gharar, Takaful) and
velocity halved.

The commentary format fixes it structurally. A roast has to open on something
absurd and universal (a financed burrito, a dog in a bank ad), which forces the
hook to be universal. And the mechanism can only land in part four, after the
audience already agrees there is a problem. The format makes it hard to repeat
the Part 11 mistake.

Long-form also solves a different problem: the channel is 100% Shorts, which
means no watch time, no meaningful RPM, and an audience the algorithm can't
place. Each of these is designed to be clipped back down into 4–6 Shorts, so the
existing daily cadence keeps running off the same shoot.

---

## The edit — what's actually being copied

Reverse-engineered from *"Donald Trump's Christian Movie Is Terrible"*, which
is the reference you named. The moves, and where each one lives in code:

| Move | Why it works | Implementation |
|---|---|---|
| **Hard punch-ins, no easing** | A zoom that ramps reads as a camera. A zoom that lands in one frame reads as a *reaction*. | `zoom` on host beats, `Host.tsx` |
| **Jump cuts inside a held shot** | Removes breath, so the delivery feels faster than it was performed | `jumpCuts: n`, drops ~10 source frames each |
| **Freeze frame + bass hit** | The punctuation mark of the genre | `freeze` beats, `FreezeFrame` |
| **Dead air** | 1.2s of black silence after a joke. The emptiness *is* the joke | `deadAir` beats — resist putting anything in them |
| **The undercut** | Small type at the bottom contradicting the voice. Never spoken aloud | `undercut:` on any beat |
| **Emphasis flash** | One word, full frame, 9 frames, gone | `emphasize: []` |
| **Crude MS-Paint annotation** | Hand-wobbled, deliberately bad. A clean circle reads as a corporate infographic and kills the bit | `annotations`, `Cutaways.tsx` |
| **PiP over evidence** | Host in a corner circle while the thing being roasted owns the frame | `pip` beats |
| **Chapter cards, hard cut both ways** | No dissolves anywhere in this style | `titleCard` beats |
| **Visible sponsor wall** | Timer in the corner, hard border. Retention goes *up* when you stop pretending the ad isn't an ad | `sponsor` beats |
| **Moving grain over everything** | The one thing that makes mixed sources feel like one camera | `Grade.tsx` — re-seeds every frame |

The one thing added that isn't Kurtis: **the receipt slate**. Once per episode
the video drops the bit entirely and shows the arithmetic on a black card. It's
the permission structure — it's what lets a finance channel get away with a
comedy edit, and it's where every screenshot-able moment comes from.

---

## The five

### 1. "Buy Now, Pay Later Is Terrible" — the flagship
**Hook:** *"You can now finance a burrito. Not a car. Not a house. A burrito. Four easy payments of four dollars and twelve cents."*

Reads the fine print on a generic checkout out loud, then finds the two revenue
lines the friendly font hides: the 4–6% merchant fee (which raises the shelf
price for everyone, including people paying cash) and the late fee. Receipt
slate lands the punch: a $7 late fee on a $12.38 six-week loan is an **effective
~490% annual rate. On a burrito.**

Turn: the product isn't the burrito, it's *the gap between getting the thing and
paying for it*. Which is the one thing the 1,400-year-old rule set won't allow
you to charge for. Murabaha as the boring alternative.

**Why it travels:** BNPL is on everyone's checkout page and almost nobody has
seen the arithmetic. "You can finance a burrito" is a shareable sentence on its own.
**Thumbnail:** `4 PAYMENTS OF $4.12`

---

### 2. "Your Credit Score Is A Loyalty Card For Debt"
**Hook:** *"My credit score app sent me a notification this morning that said, and I want to be precise here, great news. I had gone further into debt. There was confetti."*

Every published category in the score is a measurement of borrowing. Income: 0%.
Savings: 0%. There's a 10% category rewarding *variety* of debt. Pay everything
off and close the accounts and the number goes down, because you stopped being
useful. The industry term for someone who always clears the balance is
**"deadbeat"** — that's real, and it's the whole episode in one word.

Second half is the harder point: a number invented to price a loan now gates
flats, phone contracts, insurance premiums and some jobs, so refusing to borrow
costs roughly **£1,100/yr**. They found a way to charge you interest for
refusing to pay interest.

**Why it travels:** near-universal, and the confetti detail is instantly
recognisable to anyone with a credit app.
**Thumbnail:** `"GREAT NEWS!"`

---

### 3. "Your Savings Account Is Terrible"
**Hook:** *"This bank advert has a golden retriever in it. A couple laughing in a kitchen. A man successfully assembling furniture. What it does not have, anywhere in forty seconds, is a number."*

The most on-brand of the five — it's the channel's proven Part 10 hook
("your savings account is the safest place to slowly lose everything") given six
more minutes. Two acts: the ad is built to avoid the rate (and "deposit beta" is
a real job — someone is measured on how *slowly* your rate rises), and your
balance is filed under **liabilities** on the bank's books. You're the wholesale
supplier for a business nobody told you you'd joined.

Receipt: £10,000 in, +£40 interest, −£390 inflation. Screen says £10,040. Buys
£9,650.

**Why it travels:** the dog. The whole video is a joke about a dog standing in
for a number, and that's the comment section.
**Thumbnail:** `THE AD HAS A DOG IN IT`

---

### 4. "Every Passive Income Video Is The Same Video"
**Hook:** *"I watched forty two passive income videos this week. By video nine I realised I was watching the same one on a loop. So I made a bingo card. By video eleven I had won. …Twice."*

The genre teardown, and the one that reaches furthest outside a finance
audience. Four moves every video makes (the dashboard screenshot that shows
revenue not profit, the humility beat, the method described at exactly the
altitude that contains no instructions, and the "free" PDF that is a mailing
list). Then: "passive" is standing in for **"unpaid"** — and calling a job
passive is how you get someone to work 60 hours a week and feel like a failure
for being tired.

Receipt: $8,000 month one, minus ad spend, minus product cost, over 61 hrs/week
= **$2.75/hour**, with a Lamborghini in the thumbnail.

**Why it travels:** picks a fight with a genre rather than an institution, so
the comments do the distribution. Post this one when you want a spike.
**Thumbnail:** `I MADE A BINGO CARD`

---

### 5. "The Guy Who Says Your Coffee Is Why You're Poor"
**Hook:** *"A man standing in front of a car he is renting by the hour would like to talk to you about your coffee."*

The angriest one. Runs the latte maths honestly (£95k over 30 years — it's a
real number, not nothing), then runs the *same* 30 years on the mortgage the
same person is paying: **£208,000 in interest alone.** You buy the house twice.
One is a lifestyle choice you make 400 times a year; the other is one signature
at twenty-nine in a room where you're the least informed person present. There
are ~10,000 videos about the coffee.

The turn is the sincere one and it's longer than usual, because the episode
earns it by being mean first: the coffee video is popular precisely because it
costs the person giving it nothing and blames the person receiving it entirely.
Ends on *"So buy the coffee. Genuinely. Buy the coffee, and go and read your mortgage."*

**Why it travels:** everyone has been condescended to by this video.
**Thumbnail:** `IT IS NOT THE COFFEE`

---

## Publishing order

1 → 2 → 3 → 4 → 5, weekly. Each end card names the next, and the order is wired
into the scripts (`endCard.next`), so the series reads as a run rather than as
five one-offs. Episode 1 leads because BNPL has the widest surface area and the
lowest prior knowledge required.

Every episode plugs an existing Short in its `undercut` line at the mechanism
beat (Murabaha → Part 7, Sukuk → Part 9, Musharaka → Part 8), which finally
gives the 13-video Shorts back catalogue somewhere to send people.

---

## Producing one

```bash
# 1. references from the source clip (once)
./clone/extract_reference.sh media/clone-source.mp4

# 2. clone the voice, render the episode VO as one track from the `vo:` fields
#    → remotion/public/vo/ep01.mp3, register in remotion/src/lib/assets.ts

# 3. generate avatar takes driven by that VO, then conform them
./clone/build_takes.sh clone/raw remotion/public/host

# 4. evidence graphics (already baked; re-run after editing evidence.html)
node hyperframes/render.mjs

# 5. preview and render
cd remotion && npm run dev          # studio
npm run build                       # out/ep01.mp4
```

Full clone guidance, including the honest limits of a 10-second voice
reference, is in `clone/README.md`.
