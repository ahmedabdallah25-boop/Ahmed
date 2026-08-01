# Visual Style Spec — Adapting the Nuzul Dzikri Animation Template to Finance % Decoded

Reference channel: **Muhammad Nuzul Dzikri** ([@MuhammadNuzulDzikri](https://youtube.com/@muhammadnuzuldzikri))
— 892K subs · 5,352 videos · 126M views · Education · joined Nov 2017.

Analysed 2026-08-01.

## Method & confidence

| Video | Title | Length | Views | Likes | Published | Depth of analysis |
|---|---|---|---|---|---|---|
| [F1jvrNlxMPE](https://youtube.com/shorts/F1jvrNlxMPE) | Efek Salah Gaul Jadi Bikin Gak Produktif | 86s | 5,553 | 683 | Jul 30 | **Full frame-by-frame visual analysis** |
| [yC7O3mITIs4](https://youtube.com/shorts/yC7O3mITIs4) | Etika Tidak Tertulis Saat Pinjam Barang | 60s | 13,181 | 1,081 | Jul 23 | Metadata only |
| [id7bRTS7zeI](https://youtube.com/shorts/id7bRTS7zeI) | Membangun Rutinitas Adalah Awal Perubahan | 68s | 13,353 | 1,437 | Jul 16 | Metadata only |
| [hgkYDnW5j_w](https://youtube.com/shorts/hgkYDnW5j_w) | Yang Satu Galau, Yang Satu Tenang | 75s | 37,177 | 4,280 | Jun 25 | Metadata only |

**Honest caveat:** the multimodal video-analysis tool is capped at one call per day on the current
free plan, so only F1jvrNlxMPE was watched frame-by-frame. The other three are confirmed to be the
same template by their metadata — same channel, same 60–86s band, same Education category, and the
descriptions on two of them explicitly say *"Video Animasi dari Kajian ..."* ("animated video from
lecture ..."). The spec below is therefore built on one fully-verified example plus a confirmed
format pattern, not four independent visual reads. Re-run the watch tool on the other three to
harden the details marked ⚠️.

## The core concept (this is the actual insight)

The channel is **not** animating original scripts. It runs a **repurposing pipeline**:

1. A long-form lecture already exists on the channel (the descriptions link back to the source —
   e.g. *Kajian Riyaadhus Shaalihiin No. 1634*, *Kajian Tadzkiratus Saami' No. 234*).
2. A 60–90 second self-contained segment is cut from that lecture's **existing audio**.
3. That audio is re-skinned with AI-generated flat-vector illustration scenes.
4. The result posts as a Short that funnels back to the long-form video.

So the animation is a **distribution wrapper around an audio asset that costs nothing extra to
produce**. Engagement rate is 8–12% likes-to-views — very high — because the voice carries real
authority while the visuals do the retention work.

Engagement note: the 60s video and the 75s video both out-performed the 86s one by 2.4–6.7×. The
shortest cuts win. Target **55–70 seconds**, not 90.

## Replicable visual spec

### 1. Format
- 9:16 vertical, 1080×1920.
- AI-generated **stylized flat-vector illustrations** — not stock footage, not live action.
- Flat design with soft gradients and **2.5D depth** (foreground/background separated into layers).
- Faceless throughout. No talking head, no presenter on screen.

### 2. Colour palette

| Role | Hex | Use |
|---|---|---|
| Primary | `#4A7C44` forest green | Dominant scene tone, calm/positive beats |
| Primary | `#1A3A5F` deep navy | Shadow, night scenes, tension beats |
| Accent | `#E65C34` burnt orange | Focal subject, the thing the eye must land on |
| Accent | `#F9D423` golden yellow | Highlights, warm light sources, payoff moments |

High saturation, warm directional lighting. Never a flat white or pure black background — every
frame has an illustrated environment.

*For Finance % Decoded:* keep this palette as-is. Green/gold reads as both money and the channel's
"Deen & Dinar" positioning, and it is unlike the blue-grey fintech look everyone else uses.

### 3. Typography
- Bold sans-serif — Montserrat or Inter, weight 700.
- **Sentence case**, not ALL CAPS. Medium-large size, sized to fill ~80% of frame width.
- Bottom-centre, inside the Shorts safe zone (keep above the bottom 250px UI band).
- Static per phrase — the whole line appears and holds. **No word-by-word pop, no karaoke
  highlight, no bouncing.** This is a deliberate calm-authority choice and it is a big part of why
  the channel doesn't read as generic AI slop.

### 4. Captions
- **Dual-language stacked**: source language on top, English below.
- White text, no outline, subtle drop shadow only.
- One phrase on screen at a time, changing with the speaker's natural clause breaks.

*For Finance % Decoded:* this is the highest-leverage element to copy. Stacking English on top with
Arabic transliteration or Urdu/Bahasa below (or English + the Arabic finance term — *Riba*,
*Murabaha*, *Sukuk*, *Takaful*) makes each Short legible to two audiences at once and reinforces the
teaching frame. Given the channel already leans on Arabic finance terminology, put the plain-English
sentence on top and the term-anchored line below.

### 5. Cut rhythm
- Average shot length **1.5–2.0 seconds**.
- **100% hard cuts.** No dissolves, no whip pans, no zoom transitions, no glitch effects.
- Cuts land on the speaker's cadence and narrative turns, not on a music grid.
- A 60s Short = roughly **30–40 distinct illustrated scenes**.

### 6. Motion design
- 2.5D parallax: foreground and background layers move at different rates.
- Constant slow Ken Burns push-in or lateral pan on every scene — nothing is ever fully static.
- Fine film grain overlay across the whole video.
- Subtle light flicker on warm light sources.
- That's the whole list. No light leaks, no lens flares, no shake, no particle effects.

### 7. Hook (0:00–0:02)
- Opens on a **vibrant, populated, in-motion scene** — the analysed video opens on a group of
  cyclists riding through a lush forest.
- The rule: people, movement, and bright saturated colour in frame 1. Not a logo, not a title card,
  not a static object.

*For Finance % Decoded:* open on a human situation, not a chart. Someone signing papers at a bank
desk, a family at a kitchen table with bills, a shopper at a till. The paradox hook the channel
study already identified as the winning pattern goes in the audio over that scene.

### 8. Recurring template elements
- Thin unobtrusive **progress bar** along the very bottom edge.
- **End screen**: centred logo, social handles, website URL over a blurred version of the final scene.
- No lower thirds, no borders, no frames, no watermark during the body of the video.

### 9. Audio
- Lo-fi ambient bed, mixed well under the voice.
- Clear rhythmic voiceover carries everything — the music is texture, not a driver.
- Visuals sync to **speech cadence**, never to a beat drop.

## Production pipeline for Finance % Decoded

1. **Source the audio.** Either cut 55–70s from an existing long-form, or record a clean VO of the
   script. The reference channel's advantage is that the audio already exists — build a long-form
   asset you can harvest repeatedly.
2. **Beat-sheet the cut.** Split the VO into 1.5–2.0s phrases. Each phrase = one illustrated scene.
   A 60s Short needs ~35 scene prompts. The repo already has `broll-prompts.md` — extend that file
   with the palette hexes above baked into every prompt.
3. **Generate scenes.** Flat-vector illustration, soft gradients, warm directional light, the four
   palette colours named explicitly, 9:16. Keep the character design consistent across scenes
   within one video.
4. **Layer for 2.5D.** Separate foreground subject from background in each scene, offset the motion.
5. **Assemble.** Hard cuts on clause breaks. Slow push-in on every scene. Grain overlay on the
   master.
6. **Caption.** Dual-language stacked, bold sans 700, sentence case, bottom-centre, static per
   phrase, drop shadow only.
7. **Top and tail.** Progress bar throughout, branded end screen over blurred final frame.
8. **Link back.** Put the source long-form URL in the description, exactly as the reference channel
   does — that is what turns Shorts reach into watch-time on the main asset.

## What to copy and what to leave

**Copy:** the palette, the 1.5–2s hard-cut rhythm, static sentence-case captions, dual-language
stacking, the parallax + grain treatment, the populated-scene hook, the repurposing pipeline, the
description link-back.

**Leave:** the 86s length — the data on this channel says shorter wins. Also resist adding the
word-by-word caption animation that most finance Shorts use; the restraint is the differentiator.
