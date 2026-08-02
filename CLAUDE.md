# Finance % Decoded — working notes

YouTube Shorts channel: **Finance % Decoded** (@Financeundoubtlydecoded, "Deen & Dinar").
Modern money explained through an Islamic finance lens. All content is Shorts, one continuous
series: *The Money Machine, Decoded*.

## Standing rules

### Always ask 3D or 2D before generating a scene prompt pack

The channel uses **both** render styles depending on the episode. Never assume, never default —
ask which one before writing scene prompts or B-roll prompts.

- **3D** — stylized low-poly characters with completely blank featureless heads, composited into
  near-photorealistic environments. Warm daylight, real cast shadows. This is the
  Nuzul Dzikri reference look.
- **2D** — flat vector illustration, soft gradients, 2.5D layered parallax.

Both are specified in [`visual-style-spec.md`](visual-style-spec.md). The style suffix, negative
prompt, and character bible differ between them — picking the wrong one invalidates the whole pack.

### Characters are always faceless

No eyes, nose, or mouth, in either render style. This is deliberate (aniconism), not a stylistic
shortcut. Put it in the positive prompt *and* the negative prompt every time.

### Captions are static

Two stacked lines on solid black boxes, white over gold italic, lower third. No karaoke, no
word-by-word pop, no colour highlighting. Emphasis via *italics* only. The restraint is the
differentiator — most finance Shorts do the opposite.

## Key files

| File | Contents |
|---|---|
| `visual-style-spec.md` | Visual template derived from the reference channel, with the 3D/2D split |
| `scene-pack-inflation.md` | Worked example: 32-scene prompt pack, 3D, inflation episode |
| `channel-study.md` | Channel performance study — what the winners share |
| `broll-prompts.md` | B-roll prompt library |
| `docs/network-allowlist.md` | Egress hosts needed for direct frame analysis of reference videos |
| `automation/extract-frames.sh` | Pulls frames from a reference Short for visual analysis |

## Content notes

- Universal money topics (inflation, mortgages, savings, passive income) outperform doctrinal
  topics (gharar, takaful) by roughly 2–3× on this channel.
- Target **55–70 seconds**. On the reference channel the 60s and 75s cuts beat the 86s one by
  2.4–6.7×.
- Hook must land a personal-stakes paradox within the first 3 seconds.
