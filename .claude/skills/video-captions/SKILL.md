---
name: video-captions
description: >-
  Burn cinematic auto-captions onto a 9:16 vertical video (YouTube Shorts / Reels
  / TikTok). Use whenever the user wants to caption, subtitle, or "add cinematic
  text" to a short-form vertical clip, or asks to re-cut/prep a Short with
  burned-in word-synced captions. Pipeline: Whisper word-level timestamps -> ASS
  subtitle track -> FFmpeg burn-in, with face-aware placement. Triggers on:
  "caption this video", "add subtitles", "cinematic captions", "burn text",
  "prep the Short", "part13.mp4".
---

# Video Captions

Automated cinematic captions for vertical (9:16) short-form video. The full
pipeline lives in `automation/cinematic_captions.py` — this skill tells you how
to run it. **Do not rewrite the script; call it.**

## When to use

The user has a vertical `.mp4` and wants burned-in, word-synced, ALL-CAPS
cinematic captions (Bebas Neue style, face-aware placement). Typical input in
this repo: `media/part13.mp4`.

## Run it (token-cheap path)

Default, smart placement + face avoidance:

```bash
python automation/cinematic_captions.py media/part13.mp4
# -> media/part13_captioned.mp4
```

Common overrides:

| Flag | Purpose | Default |
|---|---|---|
| `-o OUT` | output path | `<input>_captioned.mp4` |
| `--model NAME` | Whisper model (`tiny`/`base`/`small`/`medium`) | `small` |
| `--words N` | max words per caption card | `3` |
| `--font NAME` | font family | `Bebas Neue` |
| `--face-model PATH` | YuNet ONNX for face avoidance | off |
| `--center` | disable smart placement, fix dead-center | off |
| `--language XX` | force language code | auto |

Smaller/faster: `--model base`. If OpenCV/NumPy are absent it silently falls
back to fixed center placement.

## Dependencies (install once)

```bash
pip install openai-whisper opencv-python-headless pillow numpy
# ffmpeg on PATH; Bebas Neue font (fc-list | grep -i bebas) or pass --font-file
```

## Guidance

- Only feed it 9:16 vertical clips; the placement bands assume portrait.
- Prefer `--model small` (the default) — good accuracy without burning time.
  Bump to `medium` only if a name/term is mis-transcribed.
- The script is self-contained and idempotent; re-running overwrites the output.
- Keep captions to 1–3 words per card (the default) — that is the cinematic look
  the channel's winners use.
