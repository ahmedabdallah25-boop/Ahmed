# Part 15 — "You've Paid For Five Years. You Owe More Than You Borrowed."

20-second vertical Short, kinetic typography, no VO required (silent-safe: every
word is on screen). Rendered from `video/src/Part15.tsx` →
`media/part15-student-loans.mp4` (1080×1920 · 30fps · 600 frames).

## Why this topic

The channel study's proven lane is *universal money mechanics with the halal fix
as the reveal*. Student loans are recommendation #3 in `channel-study.md`, and
Part 14 already teases them on screen. The topic is high-emotion, applies to
every viewer in the feed regardless of faith, and the Islamic mechanism
(qard hasan) arrives as the **answer**, not the subject.

## Script

| Beat | Frames | On screen |
|---|---|---|
| Hook | 0–100 (0.0–3.3s) | "YOU'VE PAID **FOR FIVE YEARS.** / **YOU OWE MORE THAN YOU BORROWED.**" |
| The receipt | 100–245 (3.3–8.2s) | Borrowed $30,000 · Paid $9,000 · Still owe $31,790 → "THE DEBT GREW WHILE YOU PAID IT." |
| The mechanism | 245–390 (8.2–13.0s) | "YOU DIDN'T BORROW A THING. YOU RENTED MONEY." Interest billed $175/mo vs $150/mo paid → "THE $25 GAP IS ADDED TO WHAT YOU OWE." |
| The fix | 390–510 (13.0–17.0s) | "MONEY IS NOT A THING YOU RENT." Qard hasan (borrow 30,000, repay 30,000) · Income share (a share of what you earn, nothing if you earn nothing) → "THE LENDER TAKES RISK, OR TAKES NOTHING." |
| CTA | 510–600 (17.0–20.0s) | Part 15 · The Money Machine, Decoded · "No jargon, just mechanisms." · Follow — Part 16: Buy Now, Pay Later |

Formula checks against the five winners:

- **Line 1 is a personal-stakes paradox**, second person, landed by 3s — the
  sting is in the hook, not at 0:09 (Part 12's mistake).
- **The topic is the viewer's own money**; the Arabic term (qard hasan) shows up
  at 13s, once the problem is already felt.
- **The CTA points forward** to Part 16, never back at a weak video.

## The arithmetic on screen

$30,000 at 7% APR against a $150/month income-driven payment:

| Figure | Value |
|---|---|
| Interest billed, month 1 | $175.00 |
| Paid over 60 months | $9,000 |
| Balance after 60 months | $31,789.82 → shown as $31,790 |
| Monthly shortfall capitalised | $25.00 |

Reproduce with `node video/scripts/part15-math.mjs`. This is negative
amortisation — the honest version of the hook, not a rhetorical one.

## Publishing

`automation/part15.json` holds the title, description, tags, publish slot and
pinned comment for `automation/upload_video.py`. Before uploading, fill the
Part 13 and Part 14 links into the series list if those episodes are live by
then.
