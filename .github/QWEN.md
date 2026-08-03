# Qwen for images and video

Alibaba's media models, wired into this repo: **Qwen-Image** for stills (b-roll plates,
thumbnail plates) and **Wan** for short clips. The prompt docs in this repo were already
written for a generator — this turns them into files without anyone pasting prompts by hand.

| Piece | What it is |
|---|---|
| [`automation/qwen-media.json`](../automation/qwen-media.json) | The job list — every prompt, plus the house style, negative prompt, models and sizes |
| [`automation/qwen_media.py`](../automation/qwen_media.py) | Submits the batch to Model Studio, polls, downloads into `media/qwen/` |
| [`workflows/qwen-media.yml`](workflows/qwen-media.yml) | Runs it from the Actions tab and commits the results |

Seeded with the 12 Episode 2 b-roll stills from [`broll-prompts.md`](../broll-prompts.md),
the 3 Part 14 thumbnail plates from
[`inflation-thumbnail-prompts.md`](../inflation-thumbnail-prompts.md), and one Wan clip to
test whether motion under the type beats a still.

## Setup (one secret)

1. Get an API key from [Alibaba Cloud Model Studio](https://modelstudio.console.alibabacloud.com/)
   (the international console — the config points at the `dashscope-intl` endpoint).
2. Repo → **Settings → Secrets and variables → Actions → New repository secret**:

   | Secret | Value |
   |---|---|
   | `DASHSCOPE_API_KEY` | the key from step 1 |

3. The workflow must sit on the default branch to be dispatchable — same rule as every other
   workflow here (see `CLAUDE.md`).

It is a paid API, billed per image and per second of video. Generate a batch, don't leave it
on a schedule.

## Running it

**From the Actions tab** — *Generate media with Qwen* → *Run workflow*:

| Input | Effect |
|---|---|
| `jobs` | `part14-thumb-A,part14-thumb-B` — blank runs every job |
| `kind` | `image` or `video` to run only one kind |
| `commit` | on by default: the files land in `media/qwen/` on the branch |

Results are also uploaded as a run artifact, so a failed commit never loses them.

**Locally**, with the key exported:

```bash
python automation/qwen_media.py --list                    # what's defined
python automation/qwen_media.py --dry-run                 # request bodies, no API calls
python automation/qwen_media.py --only part14-thumb-A     # one job
python automation/qwen_media.py --kind image --out media/thumbs
```

Stdlib only — no `pip install`.

## Adding a job

Append to `jobs` in `automation/qwen-media.json`:

```json
{ "name": "part16-thumb-A", "kind": "image", "prompt": "…", "parameters": { "size": "928*1664" } }
```

- The house style and negative prompt are appended automatically. `"no_style": true` opts out,
  for prompts that are already self-contained (the thumbnail plates are).
- `"style"` and `"negative_prompt"` override per job; `"parameters"` merges over the defaults
  for that kind; `"model"` overrides the model.
- Sizes are `width*height` with an asterisk. `1664*928` is the 16:9 default, `928*1664` is 9:16
  for anything going in the Shorts grid.

## Known sharp edges

- **The batch is submitted before it is polled**, so twelve stills cost one task's wall-clock
  rather than twelve. A run is green only if *every* selected job produced a file; a partial
  batch exits 1 rather than reporting success.
- **Model names drift between Model Studio releases.** If a run comes back
  `InvalidParameter`, check the current names in the Model Studio model list and edit
  `qwen-media.json` — the script hardcodes none of them. The error body from DashScope is
  printed in full, which is where the real reason lives.
- **Check the coins.** `inflation-thumbnail-prompts.md` records a generator returning Bitcoin
  symbols for a "gold and silver coin" prompt. Option C bans crypto explicitly, but look at the
  output before you publish it.
- **The models render text badly.** Every prompt here reserves a clean band and bans lettering;
  the type goes on afterwards in the editor.
