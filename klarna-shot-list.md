# Klarna Short — shot list: still bank aligned to the scene pack

Maps the stills generated on 2026-08-04/05 onto the 47 scenes of
[`klarna-scene-pack.txt`](klarna-scene-pack.txt), for assembly in CapCut.

## Read this before using the table

**The art direction changed and the pack was never updated.** `klarna-scene-pack.txt` describes
a cast — AMIR in a terracotta t-shirt, THE MERCHANT, THE OLD MERCHANT — in low-poly 3D with a
terracotta/cream/navy palette. Nothing of that was generated. What exists is an **object-only
still life**: blank cream cards, worn *blank* banknotes, brass stamp, balance and counterweights
on dark walnut, cool neutral grade with a single warm amber accent, no characters and no text
anywhere in frame. The pack's VO script, captions, timecodes and upload metadata are unaffected
and still govern the cut — only its IMAGE PROMPT blocks are superseded by this file.

**Why no text in any frame.** Every prompt in the bank negatives out lettering, digits,
denomination numerals, currency symbols and brand marks. So `£90`, `£85`, `4 payments of
£22.50` and `3-6%` exist only in the burned-in captions, never in the picture. That is what
keeps the pack's brand-safety rule intact — but it means the numbers carry entirely on the
caption track, so do not drop a caption on scenes 10-17.

**Selection rule:** newest version of each shot, regardless of which pass produced it. The bank
holds 85 images — the same ~31 shots generated three times (`flux_2` 18:22-18:28, `seedream_v5_lite`
ultra 23:23-23:54, `seedream_v5_lite` high 00:10-00:13) plus three ultra re-rolls at 00:36-00:43.
Those three re-rolls — M, N, R below — are the money-mechanics shots and carry the video's payoff
and its turn.

## Two gaps

Scenes **10** (*"Four payments of £22.50"*) and **28** (*"Split a price into four…"*) both need a
**four-count** shot, and the bank has none — it holds a two-card, a three-card, but nothing in
fours. The shot was tested: a `seedance_2_0` video on 2026-08-03 (`27193a40`) had four cards
dropping in a row and then a lift revealing *a fifth shadow with no card above it*, which is the
whole hidden-cost idea in one move. Nothing still was ever generated from it. Options, cheapest first:

1. Pull a frame from that Aug-3 clip for both scenes.
2. Generate one four-card still (~1 credit) and reuse it at 10 and 28.
3. Hold on scene 9's jacket for 10, and on scene 27's paper leaves for 28. Costs nothing, but
   both beats then run 6-7s on one image.

## The cut

`reprise` means the same still returns — recut it (tighter crop, different push direction) rather
than repeating the identical move. The pack asks for a slow push-in or lateral drift on every
scene, hard cuts only, no dissolves.

| # | Time | VO | Shot | Image |
|---|---|---|---|---|
| **01** | 0:00-0:04 | [serious] Four payments. Zero interest. Nothing extra to pay. | **E** · Single card upright dead centre in one tight pool of hard light | [`c9a76e71`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001222_c9a76e71-b755-4299-a4aa-7aec41c37ed7.png) |
| **02** | 0:04-0:07 | [whispers] So who is paying for it? | **A** · Phone face DOWN, cold light leaking out from under it | [`3c36abcf`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001035_3c36abcf-991a-47aa-b525-53abaa1e6f99.png) |
| **03** | 0:07-0:10 | Because somebody is. | **B** · Two hands, terracotta cuffs, open and empty, palms up | [`4242ba34`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001035_4242ba34-d119-406f-ac43-f58f4341846f.png) |
| **04** | 0:10-0:13 | [serious] And it might be you. Just not where you're looking. | **C** · Counter edge low and close, one card wedged in the seam | [`94ae1719`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001035_94ae1719-fb85-465f-a8dd-ec265fde6876.png) |
| **05** | 0:13-0:16 | Klarna does not lend you money. | **F** · Single card upright on its long edge, entirely alone, balanced | [`9400b6e2`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001035_9400b6e2-e70b-42f9-9c5c-b9f3f2a3145d.png) |
| **06** | 0:16-0:19 | It pays the shop. Today. In full. | **AD** · Closed cash drawer, one card resting flat on it | [`50f92533`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001035_50f92533-54ae-4db9-a1d7-0116ebbf7ba3.png) |
| **07** | 0:19-0:22 | Then you owe Klarna. | **T** · Stack in the middle distance, a single card standing behind and above it | [`254f6248`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001222_254f6248-6d7c-4a97-9884-c6e93d0846fc.png) |
| **08** | 0:22-0:25 | [emphatic] Hold onto that. It decides everything. | **T** · Stack in the middle distance, a single card standing behind and above it *(reprise — push in)* | [`254f6248`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001222_254f6248-6d7c-4a97-9884-c6e93d0846fc.png) |
| **09** | 0:25-0:28 | A ninety pound jacket. | **J** · Folded wool jacket and a card side by side on a plinth, equally lit | [`b7372ff3`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001329_b7372ff3-f29a-4393-9179-0a62c8820426.png) |
| **10** | 0:28-0:31 | Four payments of twenty-two fifty. | **— GAP —** four-count shot | see *Two gaps* |
| **11** | 0:31-0:34 | But the shop does not receive ninety. | **K** · Navy-cuff hands holding the jacket clear of the plinth, plinth empty | [`294c47e1`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001329_294c47e1-d2ef-4803-b7b1-a5bb357c66ec.png) |
| **12** | 0:34-0:37 | It receives about eighty-five. | **N** · Stack with a thin top slice lifted clear and set down, two piles | [`4bb2755e`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_003645_4bb2755e-7cf2-4c67-a642-0340e1a24ac6.png) |
| **13** | 0:37-0:40 | Klarna keeps the rest. | **O** · A single thin slice of banknotes alone on charcoal, small in frame | [`4422b5d5`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001035_4422b5d5-e6a6-40b9-a327-f341a8ea5822.png) |
| **14** | 0:40-0:44 | Often three to six percent. Sometimes more. | **V** · Museum staging: brass bar left, stack of banknotes right | [`66ba9195`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001222_66ba9195-8426-44bf-835f-8babcd37003d.png) |
| **15** | 0:44-0:48 | [serious] So where did that five pounds come from? | **P** · Two stacks: left whole, right with a slice lifted. The difference is the subject | [`cb368b5e`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001222_cb368b5e-9aa7-4294-a36b-7d2ea9807dd8.png) |
| **16** | 0:48-0:51 | You paid ninety. The shop kept eighty-five. | **S** · Dark counter split across the middle by one hard edge of light, stack on the lit side | [`93e8a9a5`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001222_93e8a9a5-bb74-43f5-bb92-3048a06d9a54.png) |
| **17** | 0:51-0:55 | [emphatic] It was already inside the price. | **M** · Card resting flat across the top of the banknote stack, like a lid | [`eefe4d73`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_004314_eefe4d73-527a-465c-9938-68e93b6497b5.png) |
| **18** | 0:55-0:58 | And a shop does not absorb that fee. | **U** · A heavy brass bar resting directly on top of the folded stack | [`41c9703f`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001222_41c9703f-4631-48ee-aace-3d843d8a40bf.png) |
| **19** | 0:58-1:01 | It builds it into the sticker. | **L** · Blank price tag half-buried in the folds of the wool jacket | [`56019f39`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001035_56019f39-32aa-4ff8-83fe-99293d8ba03c.png) |
| **20** | 1:01-1:05 | The price goes up. For everyone. | **Q** · Two neat piles side by side, one noticeably taller | [`717cfa40`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001035_717cfa40-ebea-4fa1-96da-fda702ed1b4a.png) |
| **21** | 1:05-1:08 | [serious] Including the man paying cash. | **R** · Small folded bundle of banknotes alone in a narrow shaft of hard light | [`7f0c9140`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_003933_7f0c9140-71a2-46b8-8cfc-322a7c8fb43b.png) |
| **22** | 1:08-1:11 | He has never used Klarna. | **D** · Shop interior after closing, one warm lamp still burning | [`fdb5e4bb`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001328_fdb5e4bb-b63f-4717-8191-fbd70ddbc48b.png) |
| **23** | 1:11-1:15 | He is paying for it anyway. | **R** · Small folded bundle of banknotes alone in a narrow shaft of hard light *(reprise — tighter crop)* | [`7f0c9140`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_003933_7f0c9140-71a2-46b8-8cfc-322a7c8fb43b.png) |
| **24** | 1:15-1:18 | Then there is being late. | **AE** · Heavy brass sand timer, sand caught mid-fall | [`6637f49c`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001222_6637f49c-892e-4511-bb92-9017d874e1c7.png) |
| **25** | 1:18-1:22 | Where late fees apply... that is revenue. | **W** · Heavy brass counterweight resting squarely on top | [`81162a00`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001035_81162a00-48bd-47e0-8a6a-cdc5edfc53be.png) |
| **26** | 1:22-1:26 | A penalty that becomes their profit. | **AC** · A single empty brass scale pan hanging, chains slack, nothing in it | [`644a2bd7`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001035_644a2bd7-ab71-4cb6-9c38-33121a5c6da2.png) |
| **27** | 1:26-1:30 | [serious] That is the oldest objection there is. | **AA** · Short stack of aged loose paper leaves, blank, raking light | [`b2b634c2`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001222_b2b634c2-ff9b-46d0-a71d-89c359676039.png) |
| **28** | 1:30-1:33 | And split a price into four... | **— GAP —** four-count shot | see *Two gaps* |
| **29** | 1:33-1:36 | ...and people spend more. | **Q** · Two neat piles side by side, one noticeably taller *(reprise)* | [`717cfa40`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001035_717cfa40-ebea-4fa1-96da-fda702ed1b4a.png) |
| **30** | 1:36-1:40 | [emphatic] That is not a side effect. That is the product. | **E** · Single card upright dead centre in one tight pool of hard light *(reprise — hard push)* | [`c9a76e71`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001222_c9a76e71-b755-4299-a4aa-7aec41c37ed7.png) |
| **31** | 1:40-1:43 | So is it halal? | **F** · Single card upright on its long edge, entirely alone, balanced *(reprise)* | [`9400b6e2`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001035_9400b6e2-e70b-42f9-9c5c-b9f3f2a3145d.png) |
| **32** | 1:43-1:47 | [calm] Don't ask about the brand. Ask three questions. | **I** · Exactly three identical cards upright in an evenly spaced row | [`5b1e3a16`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001328_5b1e3a16-2b21-47b0-8173-490c298be7ad.png) |
| **33** | 1:47-1:51 | One. Is this a sale, or a loan? | **X** · Brass stamp face down beside a card still completely unmarked | [`0be6626a`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001222_0be6626a-5197-44ab-973e-9c270dfe9f0d.png) |
| **34** | 1:51-1:55 | Klarna paid the shop. You owe Klarna. | **Y** · Brass stamp pressed down onto the card, the impression happening | [`f740ca17`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001329_f740ca17-aca1-4bb4-b99d-500daa709fa0.png) |
| **35** | 1:55-1:58 | [serious] That is a loan. | **Z** · Stamp lifted away: the stamped card alone beside the banknotes, settled | [`3cfb40cd`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001329_3cfb40cd-b5ee-448d-8f0f-03a1e7dadc48.png) |
| **36** | 1:58-2:02 | Two. Does anybody profit from that loan? | **P** · Two stacks: left whole, right with a slice lifted. The difference is the subject *(reprise)* | [`cb368b5e`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001222_cb368b5e-9aa7-4294-a36b-7d2ea9807dd8.png) |
| **37** | 2:02-2:06 | Not from you. From the merchant's fee. | **O** · A single thin slice of banknotes alone on charcoal, small in frame *(reprise)* | [`4422b5d5`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001035_4422b5d5-e6a6-40b9-a327-f341a8ea5822.png) |
| **38** | 2:06-2:10 | [serious] A loan that brings a benefit to the lender. | **AA** · Short stack of aged loose paper leaves, blank, raking light *(reprise)* | [`b2b634c2`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001222_b2b634c2-ff9b-46d0-a71d-89c359676039.png) |
| **39** | 2:10-2:13 | That is the exact phrase the scholars argue over. | **AB** · Old brass merchant's balance and a worn wooden scoop on sand cloth | [`19f82fdd`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001328_19f82fdd-6e9a-4bd6-a6aa-1b1209c1aab4.png) |
| **40** | 2:13-2:17 | Three. Would cash have been cheaper? | **R** · Small folded bundle of banknotes alone in a narrow shaft of hard light *(reprise)* | [`7f0c9140`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_003933_7f0c9140-71a2-46b8-8cfc-322a7c8fb43b.png) |
| **41** | 2:17-2:21 | If later costs more than now, you paid for time. | **AE** · Heavy brass sand timer, sand caught mid-fall *(reprise)* | [`6637f49c`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001222_6637f49c-892e-4511-bb92-9017d874e1c7.png) |
| **42** | 2:21-2:25 | [serious] Time is not a thing anyone can sell you. | **AC** · A single empty brass scale pan hanging, chains slack, nothing in it *(reprise)* | [`644a2bd7`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001035_644a2bd7-ab71-4cb6-9c38-33121a5c6da2.png) |
| **43** | 2:25-2:32 | [calm] And scholars genuinely differ here. Same price as cas… | **G** · Two identical cards flat side by side, perfectly level, absolute symmetry | [`05587477`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001222_05587477-6508-4845-85fd-5268ebd25a76.png) |
| **44** | 2:32-2:37 | Add a penalty, or a higher price for waiting... [serious] ..… | **H** · Two cards, one propped on a brass weight, uneven, shadows unequal | [`842e9683`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001328_842e9683-4ccc-4aed-a950-6f7164251a73.png) |
| **45** | 2:37-2:47 | But here is the part nobody says. Buy now, pay later is not… | **AB** · Old brass merchant's balance and a worn wooden scoop on sand cloth *(reprise)* | [`19f82fdd`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001328_19f82fdd-6e9a-4bd6-a6aa-1b1209c1aab4.png) |
| **46** | 2:47-2:57 | The seller buys the thing. Actually owns it. Then sells it t… | **Z** · Stamp lifted away: the stamped card alone beside the banknotes, settled *(reprise)* | [`3cfb40cd`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001329_3cfb40cd-b5ee-448d-8f0f-03a1e7dadc48.png) |
| **47** | 2:57-3:02 | "Pay later" was never the problem. [serious] The problem is… | **I** · Exactly three identical cards upright in an evenly spaced row *(reprise)* | [`5b1e3a16`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001328_5b1e3a16-2b21-47b0-8173-490c298be7ad.png) |

## The still bank

| Key | Shot | Model · quality | Seed | Scenes | File |
|---|---|---|---|---|---|
| **A** | Phone face DOWN, cold light leaking out from under it | seedream_v5_lite · high | `421341` | 2 | [`3c36abcf`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001035_3c36abcf-991a-47aa-b525-53abaa1e6f99.png) |
| **B** | Two hands, terracotta cuffs, open and empty, palms up | seedream_v5_lite · high | `889716` | 3 | [`4242ba34`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001035_4242ba34-d119-406f-ac43-f58f4341846f.png) |
| **C** | Counter edge low and close, one card wedged in the seam | seedream_v5_lite · high | `334399` | 4 | [`94ae1719`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001035_94ae1719-fb85-465f-a8dd-ec265fde6876.png) |
| **D** | Shop interior after closing, one warm lamp still burning | seedream_v5_lite · high | `953829` | 22 | [`fdb5e4bb`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001328_fdb5e4bb-b63f-4717-8191-fbd70ddbc48b.png) |
| **E** | Single card upright dead centre in one tight pool of hard light | seedream_v5_lite · high | `19088` | 1, 30 | [`c9a76e71`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001222_c9a76e71-b755-4299-a4aa-7aec41c37ed7.png) |
| **F** | Single card upright on its long edge, entirely alone, balanced | seedream_v5_lite · high | `683700` | 5, 31 | [`9400b6e2`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001035_9400b6e2-e70b-42f9-9c5c-b9f3f2a3145d.png) |
| **G** | Two identical cards flat side by side, perfectly level, absolute symmetry | seedream_v5_lite · high | `5720` | 43 | [`05587477`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001222_05587477-6508-4845-85fd-5268ebd25a76.png) |
| **H** | Two cards, one propped on a brass weight, uneven, shadows unequal | seedream_v5_lite · high | `423216` | 44 | [`842e9683`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001328_842e9683-4ccc-4aed-a950-6f7164251a73.png) |
| **I** | Exactly three identical cards upright in an evenly spaced row | seedream_v5_lite · high | `195075` | 32, 47 | [`5b1e3a16`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001328_5b1e3a16-2b21-47b0-8173-490c298be7ad.png) |
| **J** | Folded wool jacket and a card side by side on a plinth, equally lit | seedream_v5_lite · high | `330215` | 9 | [`b7372ff3`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001329_b7372ff3-f29a-4393-9179-0a62c8820426.png) |
| **K** | Navy-cuff hands holding the jacket clear of the plinth, plinth empty | seedream_v5_lite · high | `863197` | 11 | [`294c47e1`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001329_294c47e1-d2ef-4803-b7b1-a5bb357c66ec.png) |
| **L** | Blank price tag half-buried in the folds of the wool jacket | seedream_v5_lite · high | `97668` | 19 | [`56019f39`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001035_56019f39-32aa-4ff8-83fe-99293d8ba03c.png) |
| **M** | Card resting flat across the top of the banknote stack, like a lid | seedream_v5_lite · ultra | `11069` | 17 | [`eefe4d73`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_004314_eefe4d73-527a-465c-9938-68e93b6497b5.png) |
| **N** | Stack with a thin top slice lifted clear and set down, two piles | seedream_v5_lite · ultra | `242362` | 12 | [`4bb2755e`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_003645_4bb2755e-7cf2-4c67-a642-0340e1a24ac6.png) |
| **O** | A single thin slice of banknotes alone on charcoal, small in frame | seedream_v5_lite · high | `653822` | 13, 37 | [`4422b5d5`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001035_4422b5d5-e6a6-40b9-a327-f341a8ea5822.png) |
| **P** | Two stacks: left whole, right with a slice lifted. The difference is the subject | seedream_v5_lite · high | `593642` | 15, 36 | [`cb368b5e`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001222_cb368b5e-9aa7-4294-a36b-7d2ea9807dd8.png) |
| **Q** | Two neat piles side by side, one noticeably taller | seedream_v5_lite · high | `291377` | 20, 29 | [`717cfa40`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001035_717cfa40-ebea-4fa1-96da-fda702ed1b4a.png) |
| **R** | Small folded bundle of banknotes alone in a narrow shaft of hard light | seedream_v5_lite · ultra | `381163` | 21, 23, 40 | [`7f0c9140`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_003933_7f0c9140-71a2-46b8-8cfc-322a7c8fb43b.png) |
| **S** | Dark counter split across the middle by one hard edge of light, stack on the lit side | seedream_v5_lite · high | `976481` | 16 | [`93e8a9a5`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001222_93e8a9a5-bb74-43f5-bb92-3048a06d9a54.png) |
| **T** | Stack in the middle distance, a single card standing behind and above it | seedream_v5_lite · high | `314572` | 7, 8 | [`254f6248`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001222_254f6248-6d7c-4a97-9884-c6e93d0846fc.png) |
| **U** | A heavy brass bar resting directly on top of the folded stack | seedream_v5_lite · high | `965126` | 18 | [`41c9703f`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001222_41c9703f-4631-48ee-aace-3d843d8a40bf.png) |
| **V** | Museum staging: brass bar left, stack of banknotes right | seedream_v5_lite · high | `491043` | 14 | [`66ba9195`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001222_66ba9195-8426-44bf-835f-8babcd37003d.png) |
| **W** | Heavy brass counterweight resting squarely on top | seedream_v5_lite · high | `431584` | 25 | [`81162a00`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001035_81162a00-48bd-47e0-8a6a-cdc5edfc53be.png) |
| **X** | Brass stamp face down beside a card still completely unmarked | seedream_v5_lite · high | `113756` | 33 | [`0be6626a`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001222_0be6626a-5197-44ab-973e-9c270dfe9f0d.png) |
| **Y** | Brass stamp pressed down onto the card, the impression happening | seedream_v5_lite · high | `719653` | 34 | [`f740ca17`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001329_f740ca17-aca1-4bb4-b99d-500daa709fa0.png) |
| **Z** | Stamp lifted away: the stamped card alone beside the banknotes, settled | seedream_v5_lite · high | `340168` | 35, 46 | [`3cfb40cd`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001329_3cfb40cd-b5ee-448d-8f0f-03a1e7dadc48.png) |
| **AA** | Short stack of aged loose paper leaves, blank, raking light | seedream_v5_lite · high | `917560` | 27, 38 | [`b2b634c2`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001222_b2b634c2-ff9b-46d0-a71d-89c359676039.png) |
| **AB** | Old brass merchant's balance and a worn wooden scoop on sand cloth | seedream_v5_lite · high | `174749` | 39, 45 | [`19f82fdd`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001328_19f82fdd-6e9a-4bd6-a6aa-1b1209c1aab4.png) |
| **AC** | A single empty brass scale pan hanging, chains slack, nothing in it | seedream_v5_lite · high | `744459` | 26, 42 | [`644a2bd7`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001035_644a2bd7-ab71-4cb6-9c38-33121a5c6da2.png) |
| **AD** | Closed cash drawer, one card resting flat on it | seedream_v5_lite · high | `937236` | 6 | [`50f92533`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001035_50f92533-54ae-4db9-a1d7-0116ebbf7ba3.png) |
| **AE** | Heavy brass sand timer, sand caught mid-fall | seedream_v5_lite · high | `790026` | 24, 41 | [`6637f49c`](https://d8j0ntlcm91z4.cloudfront.net/user_3DIdxOyZbIza4RXcOmzEG5FQVOT/hf_20260805_001222_6637f49c-892e-4511-bb92-9017d874e1c7.png) |

Every URL above is a Higgsfield CDN link, not a file in this repo. They are the only copy —
pull them down before the links age out.

## What is still open

- **The two four-count gaps**, above.
- **No voiceover exists.** The pack's VO script is written and tagged for ElevenLabs v3, but
  nothing has been recorded or uploaded — the Higgsfield audio library is empty. The pack's own
  edit order is *record the VO first, then cut to the delivery*, so these timecodes are a guide
  and will shift.
- **Publish target was 2026-08-06, 03:00 PT** — that is tomorrow.
- **Upload metadata is ready** (title, description, tags at the foot of the scene pack) and has
  not been written into `automation/reset.json`.
