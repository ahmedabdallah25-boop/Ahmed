# Finance % Decoded — working memory

YouTube channel **@Financeundoubtlydecoded** ("Deen & Dinar"). Faceless Shorts series
*The Money Machine, Decoded* + occasional long-form. This file is the process record so a
fresh session can pick up without re-deriving anything.

## Repo map

| Path | What it is |
|---|---|
| `channel-study.md` | Channel performance study (what wins, what slumps) |
| `last-video-fix.md`, `longform-fix.md` | Fix packs for underperforming uploads |
| `*-scene-pack.txt` | **The source of a short**: VO script, per-scene image prompts, caption spec, edit notes |
| `*-thumbnail-prompts.md` | 9:16 thumbnail prompt options (A/B/C) for one video |
| `traffic-pack*.md`, `broll-prompts.*` | Off-platform promo copy (TikTok/X) and b-roll prompts |
| `automation/*.json` | One upload config per video (title, description, tags, comment, decision rule) |
| `automation/upload_video.py` | Uploads + sets thumbnail + captions; `--comment <id>` posts the engagement comment |
| `automation/monitor*.py` | Applies the N-hour decision rule to a published video |
| `automation/promote_*.py` | Pushes reach via channel surfaces after publish |
| `.github/workflows/upload-*.yml` | `workflow_dispatch` runner per video: `mode: upload \| comment` |
| `video/` | Remotion project — captions + motion graphics burned over supplied footage |
| `media/` | Rendered masters, SRTs, thumbs |

## Pipeline for one short (repeat this)

1. **Pick the topic** from the previous short's closing promise, or a proven universal-money
   topic (savings, mortgage, inflation, passive income). Insurance/jargon arcs underperform.
2. **Write the scene pack** → `<topic>-scene-pack.txt`. Contains, in this order:
   how-to-use, one shared NEGATIVE PROMPT, consistency workflow (generate the cleanest AMIR
   shot first, lock the seed, feed it back as image reference for every AMIR scene),
   full VO script as one copyable block with ElevenLabs v3 tags, then every scene as
   `VO / CAPTION 1 / CAPTION 2 / IMAGE PROMPT`, then the caption burn-in spec and edit notes.
3. **Author generates** images + VO externally, edits the master, drops it in `media/`.
4. **Captions/graphics** via Remotion (`video/src/<topic>/`): `npm run captions:<topic>`
   then `npm run render:<topic>`.
5. **Thumbnail** from `<topic>-thumbnail-prompts.md` → `media/thumbs/<topic>-final.jpg`.
6. **Upload config** `automation/part<N>.json`, **workflow** `.github/workflows/upload-part<N>.yml`
   (copy the previous one, change `UPLOAD_CONFIG`). Run it with `mode: upload`, then `mode: comment`.
7. **Record** `video_id`, `published_at`, `url` back into the config and commit.
8. **Promote** — traffic pack + `promote_*.py`; **monitor** — the decision rule.

## Locked creative conventions

- **Format**: 9:16 1080x1920, ~65–90s, hard cuts only, slow push-in/drift on every scene,
  film grain over the master.
- **AMIR** (the everyman): stylized low-poly 3D, **completely blank featureless head**,
  terracotta `#E85F42` tee, cream `#E8DCC8` trousers, white sneakers, cream beanie.
- **The banker**: same blank head, deep navy `#1E3A5F` suit, no tie, navy bucket hat.
- **Palette**: terracotta `#E85F42`, cream `#E8DCC8`, navy `#1E3A5F`, gold `#F2B01E`,
  sky `#4BA3D3`. Near-photorealistic environments, matte clay characters.
- **Captions**: line 1 white Inter/Montserrat Bold on solid black box; line 2 soft gold
  `#F5D76E` italic on its own black box, offset ~20px left. Static per phrase — no karaoke,
  no bouncing. Lower third, clear of the bottom 250px.
- **Hook**: personal-stakes paradox in the first 3 seconds — name a cost the viewer is already
  paying, deliver it flat and certain. Two scenes, ~6s.
- **Recap** (when the short continues a previous part): straight after the hook, 15–20s of the
  previous episode's mechanism, cut ~15% faster than the rest, re-staging that episode's actual
  shots rather than lookalikes. Terracotta chip top-left ("PART N, IN X SECONDS") plus a thin
  progress bar across the top for the span — a finite recap is what stops the swipe. End it on a
  pivot scene with a beat of silence: "That was the problem. This is the fix."
- **Close**: a promise that sets up the next part, plus "follow".
- **Titles**: "How to X Without Y" / "How Banks X Your Y" + parenthetical topic + 2 hashtags.
- **Description**: hook paragraph → mechanism → next-video promise → part number →
  full series link list → playlist `PLKLKzR1QgFHE` (legacy 13-char id, valid — do not "fix" it)
  → long-form link → X link → "financial education, not financial advice" → hashtags.
- Enable a multi-language audio track on upload (free "Auto-dubbed" reach).

## Decision rule (per config)

`decision_hours: 72`, `pass_views: 150`, `dead_views: 50`. Never delete a hours-old upload —
fix packaging first, re-cut the hook only if still dead after the window.

## Secrets / auth

GitHub Actions secrets: `new1` = `YT_CLIENT_ID`, `new2` = `YT_CLIENT_SECRET`,
`new3` = `YT_REFRESH_TOKEN`. Setup steps in `automation/SETUP.md`.

## Series state

Parts 1–14 published. Part 14 (Inflation, `OHVnm5R0o5E`, published 2026-08-02) closes on
"the fix — sound money, and how to actually hold it — is the next video".

**Part 15 = that fix**: `sound-money-scene-pack.txt`, `sound-money-thumbnail-prompts.md`,
`automation/part15.json`, `.github/workflows/upload-part15.yml`. Awaiting generated footage,
VO, edit → `media/sound-money-edited.mp4`, and thumbnail → `media/thumbs/sound-money-final.jpg`.

Known issue shipped knowingly in Part 14: the "gold and silver" shot at 77.1–80.1s renders as
Bitcoin coins. Part 15 leads with real gold/silver — regenerate carefully.
