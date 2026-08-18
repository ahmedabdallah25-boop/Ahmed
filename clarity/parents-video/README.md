# Parents video — "The one sound the Quran forbids you to make"

Clarity in the Quran · 29:45 · 16:9 · stills format, camera moves added in the edit.

## Files

| File | What it is |
|---|---|
| `scene-pack.txt` | The authority. Shot list, timings, house style, face rule, Arabic cards. |
| `prompts-ready.txt` | Same shots with +STYLE resolved — one clean paste per shot. |
| `build_timeline.py` | Parses both, emits `timeline.csv` + `pending.txt`, runs the audit. |
| `timeline.csv` | Every one of the 130 timeline events in order, with status and prompt. |
| `pending.txt` | Shot IDs with no image yet — the generation queue. |
| `generations.csv` | What has been generated on Higgsfield: job id, model, seed, URL. |
| `images/` | Delivered stills. Name them `S01.png`, `S48.jpg` — any extension. |

## Workflow

    python3 build_timeline.py            # Track A
    python3 build_timeline.py --track B  # figure-free cut

Exit code is non-zero on any audit failure, so it gates a generation run. Statuses:
`HAVE` (file in `images/`), `GENERATED` (exists on Higgsfield, not downloaded here),
`PENDING` (needs generating), `REFRAME` (camera move on another still — never generate),
`TYPESET` (Arabic card — never generate, never give to an image model).

Drop a `vo.srt` in this folder and the audit also checks the VO's last cue against
the timeline's 29:45.

## Generation settings that are settled

- **Model `seedream_v4_5`, quality `basic`, aspect `16:9`** — 1 credit, renders
  2560×1440. FLUX.2 pro costs the same credit and returns 1280×720, so it loses on
  value; the 20 re-frames are pushes into a parent still and need the extra pixels.
- Higgsfield has **no negative-prompt field**, so the pack's negative list is folded
  into the prompt as an `Avoid entirely:` clause. Keep it — the face rule depends on it.
- Style lock is S01, S48, S69, S92 (interior lamp, wide landscape, architectural
  interior, close object). Seeds are in `generations.csv`; reuse them to hold style.

## Two decisions that must be made before spending

1. **Track A or Track B.** 18 shots have figure-free alternates. Decide once, up front.
2. **The nine Arabic cards need a human proof against a mushaf** before publish.
   They are typeset in the editor and never generated.
