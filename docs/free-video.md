# Making video for this channel without paying

Everything below was measured in this repo on 2026-08-03, not taken from marketing pages.
Three working samples are in [`media/samples/`](../media/samples/).

## The short version

**Free *generative* AI video barely exists, and where it does it is rationed.** Your
Higgsfield account has 10 credits and no unlimited allowance, which buys **two 4-second
clips and then stops.** The things that are genuinely unlimited and free are the two local
renderers — and those are what already produced the Shorts on this channel that hit 1.2K.

So the honest split is: **local renderers for anything with words, numbers or a chart in it**
(which is most of what this channel publishes), and **rationed generative clips for b-roll
you cannot fake** — a scale settling, dust in a light beam.

## What was actually tested

| Path | Free? | Evidence |
|---|---|---|
| **Remotion** (`video/`) | **Unlimited.** No account, no watermark | Rendered 150 frames → `remotion-5s.mp4`, 5.00s, 1080×1920 |
| **HTML + GSAP + Chromium** (`video/hyperframes/`) | **Unlimited.** No npm deps beyond what's here | Rendered 150 frames → `gsap-5s.mp4`, 5.00s, 1080×1920 |
| Higgsfield `veo3_1_lite` | **Free-tier credits only** — 4 credits per 4s clip | Job completed on the free plan, 768×1344 |
| Higgsfield `kling3_0_turbo` | **No** — `403 job_minimum_basic_plan_required` | Blocked before spending anything |
| Higgsfield `wan2_6` | **No** — 13 credits for 5s, more than the balance | Preflighted with `get_cost` |
| Adobe connector | **No generative video.** Animates existing designs only | Its own routing doc: "Most generative AI capabilities are not available" |
| HeyGen HyperFrames | **Not from here** — `render_video` is disabled for CLI clients | MCP server instructions |
| Qwen-Image / Wan on DashScope | **No** — paid per image and per second | See [`.github/QWEN.md`](../.github/QWEN.md) |

### Credit costs, preflighted at 9:16

| Model | Duration | Credits |
|---|---|---|
| `veo3_1_lite` (no audio) | 4s | **4** |
| `seedance_2_0_mini` (480p) | 5s | 5 |
| `kling3_0_turbo` (720p) | 5s | 7.5 — plan-gated anyway |
| `wan2_6` | 5s | 13 |

Use `get_cost: true` before any generation. It returns the price without submitting a job,
so a model you cannot afford costs nothing to discover.

## The three samples

| File | Path | What it shows |
|---|---|---|
| `remotion-5s.mp4` | Remotion | Counting numbers, punch-on-beat, the channel's gold/red system |
| `gsap-5s.mp4` | HTML + GSAP | The same beat structure with no React and no build step |
| Higgsfield clip | `veo3_1_lite` | Live-action b-roll no renderer can fake |

The Higgsfield clip is not in this repo — its CDN host is blocked by this environment's
network policy, so it has to be downloaded from the Higgsfield UI.

## Running them

**Remotion** — full React compositions, best when the motion is complex or data-driven:

```bash
cd video && npm install
npx remotion render src/index.ts Sample-Free5s ../media/samples/remotion-5s.mp4 \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
```

The `--browser-executable` flag matters in this container. Remotion needs old-headless Chrome,
which the plain `chromium` binary dropped; `headless_shell` is the standalone build that still
has it. Without the flag Remotion tries to download its own browser.

**HTML + GSAP** — best when the animation is simple and you want to see it in a browser
while you build it:

```bash
cd video && node scripts/capture-html.mjs hyperframes/sample-5s.html ../media/samples/gsap-5s.mp4
```

The page reads `?f=<frame>` and seeks its GSAP timeline to exactly that time, so the script
screenshots 150 deterministic stills and encodes them. It is not a screen recording — no
dropped frames, no wall-clock drift. Both binaries it needs (Chromium, ffmpeg) already ship
in this container; there is no system `ffmpeg`, so it borrows Remotion's.

**Higgsfield** — through the MCP tools, cheapest model first, always preflighting cost.

## Where to spend the rationed clips

Not on anything with type in it — the renderers do type better and for free. Spend them on
the four or five seconds of texture that make a Short feel shot rather than assembled: the
scale settling, the key on the letter, dust in a light beam. `broll-prompts.md` is already
a list of exactly those shots.
