# Deen & Dinar — Rebrand Kit

Everything paste-ready to rebrand [@Deen-Heart](https://www.youtube.com/channel/UCX2twfYAoA_oKcChwfH9zBQ) into **Deen & Dinar**.
The copy lives in [`automation/rebrand.json`](automation/rebrand.json) (single source of truth — edit there, the automation reads it).

## 1. What's automated vs. manual

| Step | How |
|---|---|
| Channel name, about/description, keywords, country=US, language=en | ✅ Automated — `automation/rebrand_channel.py` |
| Banner (2560×1440) | ✅ Generated (`media/branding/banner.png`) + uploaded by the script |
| Brand assets (banner, avatar, thumbnail template) | ✅ Generated — `automation/generate_branding.py` |
| Channel trailer | ✅ Automated once the video exists — `--trailer VIDEO_ID` |
| Profile picture | ❌ API can't — Studio → Customization → upload `media/branding/avatar.png` (~30s) |
| Handle → `@DeenAndDinar` | ❌ API can't — Studio → Customization → Handle (~30s) |
| Links panel (F%D channel, X, email) | ❌ Studio → Customization → Links (~1 min) |

### Run it

One-time: mint a refresh token **for the Deen @ Heart channel** — `python automation/get_refresh_token.py`, and on the Google consent screen **select Deen @ Heart, not Finance % Decoded**. Save it as GitHub secret `DEEN_HEART_REFRESH_TOKEN` (client id/secret reuse the existing `new1`/`new2` secrets).

Then: **Actions → "Rebrand channel (Deen & Dinar)" → Run workflow.** Or locally:

```bash
pip install -r automation/requirements.txt
python automation/generate_branding.py
YT_CLIENT_ID=… YT_CLIENT_SECRET=… YT_REFRESH_TOKEN=…(deen token) \
  python automation/rebrand_channel.py --banner media/branding/banner.png
```

The script **refuses to run** if the token belongs to any channel other than Deen @ Heart, so it can never accidentally rebrand Finance % Decoded. Re-run any time after editing `rebrand.json` — it's idempotent.

## 2. Identity (already in rebrand.json)

- **Name:** Deen & Dinar · **Handle:** @DeenAndDinar
- **Tagline:** How money really works — without interest.
- **About & keywords:** see `automation/rebrand.json`

## 3. Channel trailer — 60-second script (record when ready, then `--trailer VIDEO_ID`)

> **[0–3s | hook, black screen → coin drop sfx]** Last night, while you slept, your bank made money off your money.
> **[3–12s]** And this morning it charged you for the privilege. Overdraft fees, card interest, a mortgage that quietly costs you a second house. Nobody taught you this game — but you're playing it every day.
> **[12–30s | fast cuts of upcoming topics]** This channel breaks down how money actually works. How banks create it from nothing. What really happens when you invest $500 a month. Why your credit score is designed to keep you borrowing.
> **[30–45s | gold accent visuals]** And here's what no other finance channel shows you: the interest-free route. For every trap, there's a 1,400-year-old exit — buying, investing, insuring, building wealth without ever touching the debt treadmill. Whatever your religion, opting out of interest is a superpower.
> **[45–60s | logo]** No jargon. No guru hype. Just mechanisms — and the way out. New videos every week. Subscribe, and stop playing money on hard mode.

## 4. AI image prompts (optional upgrades to the generated assets)

**Banner (Ideogram/Midjourney, 16:9, then crop to 2560×1440):**
> Minimalist YouTube banner for a finance channel, deep navy background #0D1B2A, large elegant thin gold circular line-art rings resembling coins on left and right thirds, center text "DEEN & DINAR" in bold white geometric sans-serif with a gold ampersand, subtitle "How money really works — without interest." in light gray, small gold crescent accent, flat vector style, premium fintech aesthetic, lots of negative space, no photos, no gradients louder than 5%

**Avatar/logo (1:1, 800×800):**
> Flat vector logo, navy circle background #0D1B2A, thin gold ring border, gold crescent moon above bold monogram "D&D" in white with gold ampersand, premium minimalist fintech badge, centered, no text other than D&D, crisp edges

**Per-video thumbnail (template — fill the brackets):**
> YouTube thumbnail, 1280×720, deep navy background #0D1B2A with one thin gold ring arc on the right, left side: bold white condensed sans-serif text "[4-WORD HOOK]" with one key word in gold #D4AF37, right side: [single subject: e.g. cracked credit card / house split in two / burning dollar / vault door], flat modern vector illustration, high contrast, no clutter, max 3 visual elements, gold bottom edge bar

Thumbnail rules (from the playbook): ≤4 words, one number where possible, same navy/gold system every video so the channel is recognizable in the feed.

## 5. Master script-writing prompt (paste into Claude with a topic)

> You are the head writer for **Deen & Dinar**, a faceless YouTube finance channel. Voice: calm, sharp, slightly conspiratorial about how the system works — never preachy, never salesy. Audience: 20–40yo in US/UK/CA who feel the money system is rigged; many are Muslim, most videos are watched by non-Muslims too.
>
> **Hard rules:**
> 1. Title and thumbnail: universal money problem only — NEVER Arabic/fiqh terms (Riba, Gharar, Takaful, Murabaha stay INSIDE the video, introduced in one plain-English sentence each).
> 2. Hook (first 15s): a personal-stakes paradox — what this is silently costing the viewer — plus a reason to stay ("by minute 6 you'll know…").
> 3. Structure: hook → the mechanism with real numbers → who profits from it → **the interest-free exit** (the differentiator; concrete steps, name real structures) → single CTA: subscribe "for the only finance channel that shows the no-interest route."
> 4. 2,000–2,400 words (≈10–12 min VO at 175 wpm). Every 15–25 seconds insert a `[VISUAL: …]` cue an editor can execute with charts, stock, and motion graphics.
> 5. Numbers must be real and current — flag any figure needing verification with `[CHECK]`.
> 6. End-of-video disclaimer line: "This is financial education, not financial advice."
>
> **Deliverables:** (a) 5 title options ≤60 chars, (b) thumbnail text ≤4 words + image concept, (c) 3 hook variants, (d) full script with visual cues, (e) 150-word description with 3 hashtags, (f) 15 tags, (g) pinned engagement question.
>
> **Topic:** {topic from the playbook's 50} · **Format:** {F1 listicle / F2 projection / F3 exposé / F4 protocol / F5 levels}

## 6. Video description template

```
{HOOK LINE — one sentence, the paradox}

{2–3 sentences: the mechanism and the interest-free exit viewers will learn}

CHAPTERS
00:00 {hook}
…

▶ Subscribe: https://www.youtube.com/@DeenAndDinar?sub_confirmation=1
▶ Shorts channel: https://www.youtube.com/@Financeundoubtlydecoded
▶ Daily money takes on X: https://x.com/financedecode

No jargon. Just mechanisms.
This is financial education, not financial advice.

#PersonalFinance #Money {+1 video-specific hashtag}
```

## 7. Voiceover prompt (ElevenLabs or similar)

> Male voice, late 20s–30s, neutral American accent, documentary-calm with quiet intensity — think "explaining a heist that's happening to you right now." Medium-slow pace (~170 wpm), confident lower register, subtle emphasis on numbers, no radio-DJ energy. Settings: stability ~55, similarity ~80, style ~15. Same voice every video — the voice IS the brand.

## 8. Cross-promo copy (seed the new channel from F%D's 172 subs)

**Pinned comment on every F%D Short (and future Shorts descriptions):**
> This 60-second version barely scratches it. The full 10-minute breakdown — with the numbers and the interest-free exit — is on our main channel: youtube.com/@DeenAndDinar 🔑

**F%D community post + first Deen & Dinar community post:**
> Big news: the Money Machine series was the prototype. The real thing just launched — Deen & Dinar, full-length breakdowns of how money actually works and how to win without interest. First video: "{launch video title}". If these Shorts ever made you see money differently, you'll want to be early: youtube.com/@DeenAndDinar

**End-screen VO line for every F%D Short:** "Full breakdown on Deen & Dinar — link in the description."
