# Week 1 — Money Mechanics slate (v2)

Rewritten 2026-08-16 after auditing v1 against the data I'd already pulled. What changed
and why is in §1. Scripts are in §3.

---

## 1. Audit of v1 — what was wrong

### 1.1 The scripts were twice as long as the format that wins

This is the serious one, and my own dataset said so. Durations of the 47 faceless outlier
Shorts I pulled:

| Slice | Duration |
|---|---|
| Top 5 by views | 18s, 14s, 18s, 22s, 24s |
| **Median of top 10** | **26s** |
| Median of all 47 | 30s |
| Under 30s | 22 of 47 |

The 9.8M *Survivorship Bias* script I claimed to be modelling is **62 words, 18 seconds**.
I then wrote v1 scripts at **120–160 words, 40–45 seconds** — 2.5× the model. I derived the
right structure and then ignored the length it came in. Every script below is rebuilt to
**85–110 words, 28–36 seconds**.

### 1.2 I punted on verification I could have done

v1 shipped with a "verify before publish" list. I had WebSearch the whole time. Now done —
all four load-bearing claims check out, and one number is corrected:

| Claim | Status |
|---|---|
| Airline loyalty worth more than the airline | ✅ United MileagePlus valued **~$20B** in 2019 vs a **~$17B** market cap; United borrowed **$5B** against it in 2020. *(v1 said $22B — that figure circulates in headlines, but $20B vs $17B is the cleaner comparison.)* |
| Payday APR near 400% | ✅ CFPB: $15 per $100 over two weeks = **391% APR**. Median fee is $15/$100. |
| "Deadbeat" / "revolver" as industry terms | ✅ Both are genuine card-industry jargon, used exactly as described. |
| Deferred interest charges on the original balance | ✅ Confirmed — pay off 99%, miss the deadline, and interest applies to **100% of the original** amount. CFPB has flagged it as consumer-harm risk. |

### 1.3 No loop, so no rewatch

Shorts reward completion over 100% — the rewatch. Not one v1 script closed a loop. Every
script below now ends on a line that makes its own opening line land differently the second
time through. That's a free multiplier I left on the table.

### 1.4 The hooks were sentences, not stops

"A billionaire walks into a bank" reads as a joke setup — the viewer files it as fiction
and swipes. The first ~3 words carry the whole video. v2 opens on a number, a
contradiction, or an accusation, every time.

### 1.5 I buried the payoff I said was most important

I wrote that naming the concept is the highest-value beat, then dissolved it into a full
sentence at the end. It's now isolated on its own line, 2–4 words, hard stop.

### 1.6 Three of the seven were structurally identical

Days 2, 3 and 5 were all "the real business isn't what you think" rug-pulls. Anyone who
watched all three got the same trick three times. The openings are now differentiated
(accusation / number / paradox) and the posting order in §4 spaces them out.

### 1.7 I overstated the research basis

I reported Under Six Minutes Studio's 35% hit rate as though it established a rule. It's
**one channel, 20 videos**. It's the best signal in the sample and worth building on, but
it is n=1 and I should have said so plainly.

---

## 2. The revised template

Six beats, ~90 words, ~30 seconds:

| Beat | Job |
|---|---|
| 1. **Stop** | First 3 words. A number, a contradiction, or an accusation. Never a scene-setter. |
| 2. **Setup** | Concrete, fast, specific actor. |
| 3. **Turn** | "But…" — the assumption breaks. |
| 4. **Mechanism** | The actual machinery, stated plainly. |
| 5. **Name it** | Isolated line. 2–4 words. |
| 6. **Loop** | One line that re-frames beat 1 on rewatch. |

No greeting. No CTA. No outro. Cold open, hard close.

---

## 3. The seven scripts

### Day 1 — Why billionaires borrow money they already have

**~28s** · Stop: *"He has ten billion dollars."*

> He has ten billion dollars. He's asking the bank for a loan.
>
> Sell the stock, and the tax takes a bite that never grows back. But borrowed money isn't
> income. Nobody is taxed on a loan.
>
> So he pledges shares he already owns, takes the cash, spends it — and never sells. The
> stock keeps compounding behind the debt. When he dies, his heirs inherit it at today's
> price and the gain is wiped clean.
>
> Bankers have a name for it.
>
> **Buy. Borrow. Die.**
>
> He isn't avoiding the tax. He's outliving it.

`ON-SCREEN` `SELL → taxed` · `BORROW → not taxed` · `BUY. BORROW. DIE.`
`VISUAL` Stock line climbing. A loan arrow drawn underneath it, never touching.

---

### Day 2 — Why your bank calls you a deadbeat for paying on time

**~30s** · Stop: *"Pay your card in full…"*

> Pay your credit card in full every month, and the industry has a word for you.
>
> Deadbeat.
>
> You borrowed their money for thirty days, paid zero interest, and kept the cashback. To
> them, you're a rounding error.
>
> The customer they want carries three thousand dollars at twenty-four percent, forever.
> The industry calls that one a revolver — and revolvers are the entire business.
>
> Your rewards were never a gift.
>
> **They're the recruiting budget.**
>
> Somebody is paying for your points. It isn't the bank.

`ON-SCREEN` `DEADBEAT = pays in full` · `REVOLVER = carries a balance` · `who's paying for your points?`
`VISUAL` Two customer cards side by side; the revolver lights up as profitable.
`NOTE` The closing line is deliberate comment bait — it invites people to work out who.

---

### Day 3 — Why an airline's best product never leaves the ground

**~30s** · Stop: *"United's frequent flyer programme was worth more than United."*

> United's frequent flyer programme was worth more than United.
>
> Around twenty billion dollars — for a company the market priced near seventeen.
>
> Because miles cost nothing to make. The airline invents them, sells them in bulk to
> banks, and the banks hand them to you as credit card rewards. Real cash in, for a
> currency they printed themselves.
>
> We only know the numbers because in 2020 United needed money and borrowed five billion
> against it.
>
> **The planes are the marketing.**
>
> The airline is a bank that happens to fly.

`ON-SCREEN` `MILES: printed free` · `SOLD TO BANKS: real cash` · `$20B programme / $17B airline`
`VISUAL` Plane greyed out; the mile-mint glowing.
`VERIFIED` MileagePlus ~$20B vs ~$17B market cap; $5B loan secured against it in 2020.

---

### Day 4 — Why "0% for 24 months" is the most expensive money in retail

**~33s** · Stop: *"You owe fifty dollars. The bill says six hundred."*

> You owe fifty dollars. The bill says six hundred.
>
> Zero percent for twenty-four months on a two-thousand-dollar sofa. You paid it down
> almost all the way. You missed the deadline by one payment.
>
> A normal loan charges interest as you go. This one was charging the whole time,
> invisibly — and only forgives it if you clear every cent before the buzzer. Miss by a
> dollar and two years of interest lands at once, calculated on the full two thousand.
> Not on the fifty you still owed.
>
> **It was never zero percent.**
>
> The offer wasn't the discount. The deadline was.

`ON-SCREEN` `$50 remaining` → `$600 charged` · `interest on $2,000, not $50` · `DEFERRED INTEREST`
`VISUAL` A shadow balance accruing invisibly behind the visible one, then dropping on it.
`VERIFIED` Deferred interest applies to 100% of the original balance. CFPB-flagged.

---

### Day 5 — Why your insurer is happy to lose money on you

**~30s** · Stop: *"Your insurer wants to lose money on your policy."*

> Your insurer is fine losing money on your policy. Many do it on purpose, year after
> year — paying out more in claims than they collect in premiums.
>
> Because premiums were never the product.
>
> You pay today. The claim arrives in ten years, or never. In between, they are sitting on
> a mountain of your money, investing it. They'll owe most of it back eventually. Every
> dollar it earns until then is theirs.
>
> Buffett built Berkshire Hathaway on this. He didn't call it insurance.
>
> **He called it the float.**
>
> You're not the customer. You're the funding.

`ON-SCREEN` `premiums in < claims out` · `the gap = invested` · `THE FLOAT`
`VISUAL` Money pool feeding a long delay pipe; returns siphoned off mid-pipe.

---

### Day 6 — Why the same $500 repair costs her $1,800

**~33s** · Stop: *"Same car. Same repair. Two prices."*

> Same car. Same five-hundred-dollar repair. Two completely different prices.
>
> He pays from savings. Five hundred dollars. Done.
>
> She has none. Payday loan — fifteen dollars per hundred, two weeks. That is an annual
> rate of nearly four hundred percent. Rent comes first, so she rolls it twice. Covering
> the gap she misses a card payment, and her rate resets higher. Permanently.
>
> Same repair. Around eighteen hundred dollars.
>
> She didn't choose worse. She was charged more for the identical thing.
>
> **Economists call it the poverty premium.**
>
> Being broke is the most expensive thing she owns.

`ON-SCREEN` `$500` vs `$1,800` · `same repair` · `THE POVERTY PREMIUM`
`VISUAL` Split screen, two identical invoices, two wildly different totals.
`VERIFIED` CFPB: $15 per $100 over two weeks = 391% APR.
`NOTE` Strongest comment-driver of the seven. Expect argument — that's the point.

---

### Day 7 — Why paying off your mortgage early can make you poorer

**~36s** · Stop: *"Paying your house off early…"*

> Paying your house off early can be the most expensive safe thing you ever do.
>
> That mortgage is the cheapest money you will ever be lent — a rate locked for decades
> while inflation quietly shrinks what you owe.
>
> Every extra dollar you throw at it earns you exactly that rate. Then it's gone. Not
> invested. Not reachable.
>
> Because equity is not money. You can't eat a paid-down house. Lose your income and
> you'll be asking that same bank to lend it back — worse rate, worst possible moment.
>
> **You're not buying freedom.**
>
> You're buying a feeling. Just check the price first.

`ON-SCREEN` `cheap · fixed · shrinking` · `but LOCKED` · `equity ≠ money`
`VISUAL` House filling with equity while the liquid cash bar drains to empty.
`NOTE` Ends on a sharpened take rather than v1's concession. Still honest — it concedes the
feeling is worth something — but it picks a side, which is what makes it shareable.

---

## 4. Posting order

Not 1→7. Spacing matters, because Days 2, 3 and 5 share a reveal shape:

| Day | Script | Why here |
|---|---|---|
| Mon | **1 — Buy Borrow Die** | Widest hook, strongest concept name. Lead with it. |
| Tue | **6 — Poverty premium** | Engagement spike early, while the week is being sampled. |
| Wed | **3 — Airline miles** | Hard number in the first 3 words. |
| Thu | **7 — Mortgage** | The debate. Mid-week, when comments compound. |
| Fri | **2 — Deadbeat** | Personal — everyone watching has a card. |
| Sat | **4 — Deferred interest** | Weekend retail mindset. |
| Sun | **5 — The float** | Quietest concept; lowest-traffic slot. |

## 5. Standing notes

- **Don't judge any of these before 72 hours** (`CLAUDE.md`). The channel listing returns
  date-only publish dates that run a day off — convert to views/day with the age attached.
- **All seven are 28–36s**, so none are near the 180s Shorts cap and none trigger the 16:9
  thumbnail requirement.
- **Every factual claim above is now verified.** Sources are in the research doc.
- **The format is a topic engine, not seven ideas** — every "why does [specific actor] do
  [specific thing that sounds wrong]" is another video. That's the answer to the
  topic-exhaustion diagnosis in `channel-reset.md`.
