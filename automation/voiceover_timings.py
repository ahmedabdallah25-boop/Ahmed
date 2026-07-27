#!/usr/bin/env python3
"""
Turn a voiceover audio file into Remotion caption timings.

    python voiceover_timings.py voice.mp3

Writes <name>.timings.json next to the audio inside remotion/public/, which the
`Voiceover` composition picks up automatically, and copies the audio there too.

Same Whisper pass and 1-3 word grouping as cinematic_captions.py — this just
emits JSON for Remotion instead of an ASS track for FFmpeg, so the burned-in
Shorts and the rendered ones stay in the same caption rhythm.

Requirements:
    pip install openai-whisper

Options:
    --model NAME    whisper model            (default: small)
    --words N       max words per caption    (default: 3)
    --language XX   force language code      (default: auto-detect)
    --band F        caption height, 0-1      (default: 0.5)
    --public DIR    Remotion public dir      (default: ../remotion/public)
    --no-copy       leave the audio where it is
"""
import argparse
import json
import shutil
from pathlib import Path

from cinematic_captions import group_words, transcribe


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("audio", type=Path)
    ap.add_argument("--model", default="small")
    ap.add_argument("--words", type=int, default=3)
    ap.add_argument("--language")
    ap.add_argument("--band", type=float, default=0.5)
    ap.add_argument("--public", type=Path,
                    default=Path(__file__).resolve().parent.parent / "remotion" / "public")
    ap.add_argument("--no-copy", action="store_true")
    args = ap.parse_args()

    if not args.audio.exists():
        raise SystemExit(f"no such file: {args.audio}")

    args.public.mkdir(parents=True, exist_ok=True)

    print(f"transcribing {args.audio.name} with whisper '{args.model}' ...")
    words = transcribe(args.audio, args.model, args.language)
    if not words:
        raise SystemExit("whisper found no speech in that file")
    groups = group_words(words, args.words)

    cards = [
        {"text": g["text"], "from": round(g["start"], 3), "to": round(g["end"], 3),
         "band": args.band}
        for g in groups
    ]

    if not args.no_copy and args.audio.parent.resolve() != args.public.resolve():
        shutil.copy2(args.audio, args.public / args.audio.name)

    out = args.public / f"{args.audio.stem}.timings.json"
    out.write_text(json.dumps({"audio": args.audio.name, "cards": cards}, indent=2) + "\n")

    spoken = groups[-1]["end"]
    print(f"{len(cards)} cards over {spoken:.1f}s -> {out}")
    print("\nrender it with:\n"
          f'  cd remotion && npx remotion render Voiceover out/{args.audio.stem}.mp4 \\\n'
          f'    --props=\'{{"audio":"{args.audio.name}"}}\'')


if __name__ == "__main__":
    main()
