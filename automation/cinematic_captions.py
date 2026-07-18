#!/usr/bin/env python3
"""
Cinematic auto-captions for 9:16 vertical video — fully automated.

    python cinematic_captions.py input.mp4

Pipeline: Whisper (word-level timestamps) -> ASS subtitle track -> FFmpeg burn-in.

Style (modeled on cinematic-font Shorts):
- 1-3 word ALL-CAPS cards, hard cuts synced to word timings (no fades)
- Bebas Neue (heavy condensed sans), large, horizontally centered
- No outline, no box — crisp white text over a soft translucent drop shadow
- Subject-aware vertical placement: each scene's caption sits in the least busy
  of five bands (22/35/50/65/82% of height), never covering a detected face

Requirements:
    pip install openai-whisper opencv-python-headless pillow numpy
    ffmpeg on PATH; Bebas Neue installed (fc-list | grep -i bebas) or --font-file

Options:
    -o OUT             output path            (default: <input>_captioned.mp4)
    --model NAME       whisper model          (default: small)
    --words N          max words per caption  (default: 3)
    --font NAME        font family            (default: Bebas Neue)
    --font-file PATH   TTF used for width measurement (auto-found for Bebas)
    --face-model PATH  YuNet ONNX for face avoidance (optional but recommended)
    --language XX      force language code    (default: auto-detect)
    --center           disable smart placement, fix captions dead-center
"""
import argparse
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path


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


BANDS = [0.22, 0.35, 0.50, 0.65, 0.82]  # candidate caption centers, fraction of height


def smart_positions(video: Path, cards: list[dict], w: int, h: int,
                    text_width, base_size: int, face_model: str | None) -> list[int]:
    """Per-card y center: pick the least busy band per scene, never covering a face."""
    import cv2
    import numpy as np

    det = None
    if face_model and Path(face_model).exists():
        det = cv2.FaceDetectorYN.create(face_model, "", (w, h), 0.6)

    cap = cv2.VideoCapture(str(video))
    frames, prints = [], []
    for g in cards:
        cap.set(cv2.CAP_PROP_POS_MSEC, (g["start"] + g["end"]) * 500)
        ok, fr = cap.read()
        fr = fr if ok else (frames[-1] if frames else np.zeros((h, w, 3), np.uint8))
        frames.append(fr)
        prints.append(cv2.resize(cv2.cvtColor(fr, cv2.COLOR_BGR2GRAY), (16, 16)).astype(int))
    cap.release()

    scene_of, sid = [], 0
    for i in range(len(cards)):
        if i and np.abs(prints[i] - prints[i - 1]).mean() > 8:
            sid += 1
        scene_of.append(sid)

    def best_band(frame, tw, th):
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray, 60, 160)
        boxes = []
        if det is not None:
            det.setInputSize((w, h))
            _, faces = det.detect(frame)
            if faces is not None:
                for f in faces:
                    x, y, fw, fh = f[:4]
                    boxes.append((x - fw * 0.2, y - fh * 0.5, x + fw * 1.2, y + fh * 1.1))
        best, best_cost = 0.5, 1e9
        for b in BANDS:
            yc = b * h
            x0, x1 = int(w / 2 - tw / 2), int(w / 2 + tw / 2)
            y0, y1 = max(0, int(yc - th / 2)), min(h, int(yc + th / 2))
            cost = edges[y0:y1, x0:x1].mean() + 0.25 * gray[y0:y1, x0:x1].std()
            for (fx0, fy0, fx1, fy1) in boxes:
                ox = max(0, min(x1, fx1) - max(x0, fx0))
                oy = max(0, min(y1, fy1) - max(y0, fy0))
                cost += 800.0 * (ox * oy) / (tw * th)  # never cover a face
            cost += 6.0 * abs(b - 0.5)                 # mild center preference
            if cost < best_cost:
                best, best_cost = b, cost
        return round(best * h)

    scene_y = {}
    for s in set(scene_of):
        idxs = [i for i, x in enumerate(scene_of) if x == s]
        big = max(idxs, key=lambda i: len(cards[i]["text"]))
        scene_y[s] = best_band(frames[big], text_width(cards[big]["text"]), base_size * 1.25)
    return [scene_y[s] for s in scene_of]


def build_ass(cards: list[dict], w: int, h: int, font: str, base_size: int,
              sizes: list[int], ys: list[int]) -> str:
    header = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {w}
PlayResY: {h}
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Cap,{font},{base_size},&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,1,0,1,0,0,5,40,40,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    lines = []
    for g, sz, y in zip(cards, sizes, ys):
        t0, t1 = ass_time(g["start"]), ass_time(g["end"])
        # layer 0: soft translucent shadow copy; layer 1: crisp text
        lines.append(f"Dialogue: 0,{t0},{t1},Cap,,0,0,0,,"
                     f"{{\\pos({w // 2 + 4},{y + 6})\\fs{sz}\\blur6\\1c&H000000&\\1a&H50&}}{g['text']}")
        lines.append(f"Dialogue: 1,{t0},{t1},Cap,,0,0,0,,{{\\pos({w // 2},{y})\\fs{sz}}}{g['text']}")
    return header + "\n".join(lines) + "\n"


def burn(video: Path, ass_file: Path, out: Path) -> None:
    ass_escaped = str(ass_file).replace("\\", "\\\\").replace(":", "\\:").replace("'", "\\'")
    subprocess.check_call([
        "ffmpeg", "-y", "-i", str(video),
        "-vf", f"ass='{ass_escaped}'",
        "-c:v", "libx264", "-crf", "18", "-preset", "medium",
        "-c:a", "copy", str(out),
    ])


def find_font_file(name: str) -> str | None:
    try:
        out = subprocess.check_output(["fc-match", "-f", "%{file}", name], text=True).strip()
        return out or None
    except Exception:
        return None


def main() -> None:
    p = argparse.ArgumentParser(description="Burn cinematic captions onto a 9:16 vertical video.")
    p.add_argument("video", type=Path)
    p.add_argument("-o", "--output", type=Path)
    p.add_argument("--model", default="small")
    p.add_argument("--words", type=int, default=3)
    p.add_argument("--font", default="Bebas Neue")
    p.add_argument("--font-file", default=None)
    p.add_argument("--face-model", default=None, help="YuNet ONNX (opencv_zoo face_detection_yunet)")
    p.add_argument("--language", default=None)
    p.add_argument("--center", action="store_true", help="fixed dead-center placement")
    args = p.parse_args()

    if not args.video.exists():
        sys.exit(f"error: {args.video} not found")
    out = args.output or args.video.with_name(f"{args.video.stem}_captioned.mp4")

    w, h = probe_size(args.video)
    base_size = max(60, round(h * 0.085))
    max_w = 0.84 * w

    print(f"[1/3] Transcribing with Whisper ({args.model})...")
    words = transcribe(args.video, args.model, args.language)
    if not words:
        sys.exit("error: no speech detected")
    cards = group_words(words, max(1, args.words))
    print(f"[2/3] {len(words)} words -> {len(cards)} captions")

    # width measurement with the real font; fall back to a Bebas-ish width estimate
    font_file = args.font_file or find_font_file(args.font)
    try:
        from PIL import ImageFont
        base_font = ImageFont.truetype(font_file, base_size)
        def text_width(t): return base_font.getlength(t)
    except Exception:
        def text_width(t): return len(t) * base_size * 0.45
    def fit(t):
        tw = text_width(t)
        return base_size if tw <= max_w else max(round(h * 0.05), int(base_size * max_w / tw))
    sizes = [fit(g["text"]) for g in cards]

    if args.center:
        ys = [h // 2] * len(cards)
    else:
        try:
            ys = smart_positions(args.video, cards, w, h, text_width, base_size, args.face_model)
        except ImportError:
            print("note: opencv/numpy missing, using fixed center (pip install opencv-python-headless numpy)")
            ys = [h // 2] * len(cards)

    with tempfile.TemporaryDirectory() as tmp:
        ass_file = Path(tmp) / "captions.ass"
        ass_file.write_text(build_ass(cards, w, h, args.font, base_size, sizes, ys), encoding="utf-8")
        print("[3/3] Burning captions with FFmpeg...")
        burn(args.video, ass_file, out)
    print(f"Done: {out}")


if __name__ == "__main__":
    main()
