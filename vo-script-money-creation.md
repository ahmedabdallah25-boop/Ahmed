# Voiceover Script — Money Creation / Riba (ElevenLabs v3)

*The Money Machine, Decoded* — the money-creation episode (the Part 2 theme: "money created
as debt"). Same words as the original cut; only the performance direction changed, so it can be
re-generated in ElevenLabs without rewriting the copy.

## The problem with the old tags

The old pass leaned on `[whispers]` four times with flat filler in between — no dynamic range —
and several of its tags aren't real v3 audio tags, so the model either ignores them or reads them
out loud:

| Old tag | Issue | Replaced with |
|---|---|---|
| `[building]` | a production term, not a v3 tag | rising delivery: `[slowly]` → CAPS → short fragments |
| `[emphatic]` / `[emphasis]` | not v3 tags; v3 emphasizes with CAPS | CAPS on the power word (`TYPED`, `ELSE`, `MACHINE`) |
| `[normal]` | there is no "reset" tag | `[matter-of-fact]` — a concrete, chilling-calm direction |
| `[slow]` | wrong token | `[slowly]` |

v3 reads **CAPS as emphasis** and **ellipses `...` as breath/pacing**, so those handle the
fine-grained work the brackets shouldn't.

## The script (paste into ElevenLabs v3)

```
[whispers] So here's something... they will never tell you.

[serious] The money for your loan... [pause] it didn't exist one second before you signed.

[calm] When the bank approves you, it doesn't reach into a vault.
It just... [pause] types a number into your account.

[curious] Money that was never there before.

[slowly] Your signature creates the asset. The bank creates the deposit.

Over NINETY percent of all the money in the world... was born exactly like this —
[scoffs] not printed by governments... [serious] TYPED. By banks.

[ominous] And here's the trap.

[serious] The loan creates the money you borrow... [pause] but never the interest.
So to pay that interest... someone ELSE has to borrow too.

[slowly] Which means the system needs endless debt... just to survive.

[whispers] And when you finally repay?

[matter-of-fact] That money doesn't go back into a vault. It just... [exhales] vanishes.

[whispers] Deleted.

[serious] This is why riba was never just a fee.

[ominous] It's a MACHINE... built on permanent debt.

[whispers] And once you see it... [pause] you can't unsee it.
```

## Why this delivers better

The engagement comes from **contrast**, not from whispering the whole thing. The arc now moves:

1. **Hook — `[whispers]`** — intimate, conspiratorial ("something they'll never tell you").
2. **Reveal — `[serious]`** — the flat, deliberate truth drop.
3. **Mechanism — `[calm]`** — matter-of-fact, so the absurdity ("types a number") speaks for itself.
4. **Wonder — `[curious]`** — leans the listener in.
5. **Scale — `[slowly]` + CAPS `NINETY` + `[scoffs]`** — the "whoa" beat; the scoff dismisses the
   government-printing myth, then `TYPED. By banks.` lands hard.
6. **Turn — `[ominous]`** — "here's the trap" flips the mood.
7. **Consequence — `[slowly]`** — the weight of "endless debt... just to survive."
8. **Eerie deflation — `[whispers]` → `[matter-of-fact]` + `[exhales]`** — "vanishes... Deleted."
9. **Verdict — `[serious]` → `[ominous]`** — "riba was never just a fee... it's a MACHINE."
10. **Close — `[whispers]`** — bookends the open; "you can't unsee it" lands as a shared secret.

`[whispers]` now appears only where intimacy earns it — the open, the two eerie beats, and the
close — instead of as the default setting.

## ElevenLabs settings that make the tags actually fire

- **Model: Eleven v3.** Audio tags are a v3 feature; v2 / Turbo will read `[serious]` aloud.
- **Stability: Creative or Natural.** "Robust" suppresses tag expressiveness. Creative is the most
  reactive to tags (best for this dramatic read); Natural is the safer middle if Creative drifts.
- **One emotion per breath.** Don't stack (e.g. `[sad][angry]`) — v3 blends them unpredictably.
- **Voice choice matters.** Pick a deep, measured narrator; `[whispers]` and `[ominous]` only sound
  right on a voice whose range covers them — a bright, upbeat voice won't go dark.
- **Regenerate flat takes.** v3 is non-deterministic; tag response varies per generation, so run a
  couple of takes and keep the best.

## Tag legend

| Tag | What it does |
|---|---|
| `[whispers]` | intimate, breathy, low volume |
| `[serious]` | flat, deliberate, weighted |
| `[calm]` | even, unhurried |
| `[curious]` | lifted, leaning-in |
| `[slowly]` | stretches pacing for weight |
| `[ominous]` | dark, foreboding color |
| `[matter-of-fact]` | plain, chilling-calm — no drama |
| `[scoffs]` | short dismissive exhale (non-verbal) |
| `[exhales]` | audible breath out (non-verbal) |
| `[pause]` | a beat of silence |
| `CAPS` | emphasis on that word |
| `...` | natural breath / micro-pause |
