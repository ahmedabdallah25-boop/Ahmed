#!/usr/bin/env python3
"""
Cinematic auto-captions for 9:16 vertical video — fully automated.

    python cinematic_captions.py input.mp4

Pipeline: Whisper (word-level timestamps) -> ASS subtitle track -> FFmpeg burn-in.

Style: 1-3 word groups, ALL-CAPS, bold heavy sans-serif, dead-center,
white (or pale-yellow) fill with thin black outline + drop shadow,
no background box, hard cuts synced exactly to Whisper word timings.

Requirements:
    pip install openai-whisper      (needs ffmpeg on PATH)

Options:
    -o OUT           output path            (default: <input>_captioned.mp4)
    --model NAME     whisper model          (default: small; tiny/base/small/medium/large)
    --color NAME     white | yellow         (default: white)
    --words N        max words per caption  (default: 3)
    --font NAME      font family            (default: Arial Black)
    --language XX    force language code    (default: auto-detect)
"""
import argparse
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

COLORS = {"white": "&H00FFFFFF", "yellow": "&H00E0FDFD"}  # ASS is &HAABBGGRR; FDFDE0 -> E0FDFD


def probe_size(video: Path) -> tuple[int, int]:
    out = subprocess.check_output([
        "ffprobe", "-v", "error", "-select_streams", "v:0",
        "-show_entries", "stream=width,height", "-of", "json", str(video),
    ])
    s = json.loads(out)["streams"][0]
    return s["width"], s["height"]


def transcribe(video: Path, model_name: str, language: str | None) -> list[dict]:
    """Return flat list of {word, start, end}."""
    import whisper
    model = whisper.load_model(model_name)
    result = model.transcribe(str(video), word_timestamps=True, language=language, verbose=False)
    words = []
    for seg in result["segments"]:
        for w in seg.get("words", []):
            text = w["word"].strip()
            if text:
                words.append({"word": text, "start": w["start"], "end": w["end"]})
    return words


def group_words(words: list[dict], max_words: int, max_gap: float = 0.6) -> list[dict]:
    """Chunk into 1..max_words groups; break early on pauses or sentence punctuation."""
    groups, cur = [], []
    for w in words:
        if cur and (w["start"] - cur[-1]["end"] > max_gap or len(cur) >= max_words):
            groups.append(cur)
            cur = []
        cur.append(w)
        if re.search(r"[.!?,;:]$", w["word"]):
            groups.append(cur)
            cur = []
    if cur:
        groups.append(cur)
    out = []
    for g in groups:
        out.append({
            "text": " ".join(w["word"] for w in g).upper(),
            "start": g[0]["start"],
            "end": g[-1]["end"],
        })
    # close tiny gaps between consecutive captions so text doesn't flicker off for 1-2 frames
    for a, b in zip(out, out[1:]):
        if 0 < b["start"] - a["end"] < 0.12:
            a["end"] = b["start"]
    return out


def ass_time(t: float) -> str:
    t = max(t, 0)
    h, rem = divmod(t, 3600)
    m, s = divmod(rem, 60)
    return f"{int(h)}:{int(m):02d}:{s:05.2f}"


def build_ass(groups: list[dict], w: int, h: int, font: str, color: str) -> str:
    size = max(48, round(h * 90 / 1920))          # ~90pt at 1080x1920, scales with resolution
    outline = max(2, round(size * 0.04))          # thin black outline
    shadow = max(2, round(size * 0.035))          # subtle drop shadow
    header = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {w}
PlayResY: {h}
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Cap,{font},{size},{color},&H000000FF,&H00000000,&H80000000,-1,0,0,0,100,100,1,0,1,{outline},{shadow},5,40,40,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    lines = [
        f"Dialogue: 0,{ass_time(g['start'])},{ass_time(g['end'])},Cap,,0,0,0,,{g['text']}"
        for g in groups
    ]
    return header + "\n".join(lines) + "\n"


def burn(video: Path, ass_file: Path, out: Path) -> None:
    ass_escaped = str(ass_file).replace("\\", "\\\\").replace(":", "\\:").replace("'", "\\'")
    subprocess.check_call([
        "ffmpeg", "-y", "-i", str(video),
        "-vf", f"ass='{ass_escaped}'",
        "-c:v", "libx264", "-crf", "18", "-preset", "medium",
        "-c:a", "copy", str(out),
    ])


def main() -> None:
    p = argparse.ArgumentParser(description="Burn cinematic captions onto a 9:16 vertical video.")
    p.add_argument("video", type=Path)
    p.add_argument("-o", "--output", type=Path)
    p.add_argument("--model", default="small")
    p.add_argument("--color", choices=COLORS, default="white")
    p.add_argument("--words", type=int, default=3)
    p.add_argument("--font", default="Arial Black")
    p.add_argument("--language", default=None)
    args = p.parse_args()

    if not args.video.exists():
        sys.exit(f"error: {args.video} not found")
    out = args.output or args.video.with_name(f"{args.video.stem}_captioned.mp4")

    w, h = probe_size(args.video)
    print(f"[1/3] Transcribing with Whisper ({args.model})...")
    words = transcribe(args.video, args.model, args.language)
    if not words:
        sys.exit("error: no speech detected")
    groups = group_words(words, max(1, args.words))
    print(f"[2/3] {len(words)} words -> {len(groups)} captions")

    with tempfile.TemporaryDirectory() as tmp:
        ass_file = Path(tmp) / "captions.ass"
        ass_file.write_text(build_ass(groups, w, h, args.font, COLORS[args.color]), encoding="utf-8")
        print("[3/3] Burning captions with FFmpeg...")
        burn(args.video, ass_file, out)
    print(f"Done: {out}")


if __name__ == "__main__":
    main()
