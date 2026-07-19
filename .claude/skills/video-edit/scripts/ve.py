#!/usr/bin/env python3
"""ve — deterministic agentic video editor.

All quality-critical decisions (cut points, layout, mixing, loudness) are made
here, not by the LLM. The LLM only supplies edit.json. Stdlib + ffmpeg only;
whisper is optional (silence-gap fallback keeps every guarantee except captions).
"""
import argparse, difflib, json, math, os, re, shutil, subprocess, sys
from pathlib import Path

FILLERS = {"um", "uh", "uhm", "erm", "hmm", "mhm", "like", "so", "okay", "ok"}
GAP_MIN = 0.08          # smallest silence a cut may live in (s)
LINE_GAP = 0.6          # pause that ends a line (s)
JOIN_GAP = 0.25         # keep source pause between merged lines up to this (s)
CAPTION_BAND = 0.74     # captions live below this fraction of frame height


def die(msg):
    print(f"ERROR: {msg}", file=sys.stderr)
    sys.exit(1)


def sh(args, cwd=None, ok_fail=False):
    r = subprocess.run([str(a) for a in args], cwd=cwd, capture_output=True, text=True)
    if r.returncode != 0 and not ok_fail:
        die(f"{args[0]} failed:\n{r.stderr[-1200:]}")
    return r


def need_ffmpeg():
    for t in ("ffmpeg", "ffprobe"):
        if not shutil.which(t):
            die(f"{t} not found. Install: brew install ffmpeg | apt-get install ffmpeg")


_MISSING = object()


def jload(p, default=_MISSING):
    p = Path(p)
    if not p.exists():
        if default is not _MISSING:
            return default
        die(f"missing {p} — run the earlier pipeline step first")
    return json.loads(p.read_text())


def jsave(p, obj):
    Path(p).write_text(json.dumps(obj, indent=1))


def esc_dt(s):  # drawtext escaping
    return s.replace("\\", "\\\\").replace(":", "\\:").replace("'", "’").replace("%", "\\%")


# ---------------------------------------------------------------- project
def find_project(args):
    p = Path(args.project) if args.project else Path.cwd()
    if not (p / "project.json").exists():
        die(f"{p} is not a ve project (no project.json). Use -p <dir> or ve init RAW.mp4")
    return p


def cmd_init(args):
    need_ffmpeg()
    src = Path(args.video).resolve()
    if not src.exists():
        die(f"{src} not found")
    proj = Path(args.project) if args.project else src.parent / f"{src.stem}_edit"
    for d in ("versions", "assets/music", "assets/sfx", "assets/img"):
        (proj / d).mkdir(parents=True, exist_ok=True)
    jsave(proj / "project.json", {"src": str(src)})
    cfg = proj / "config.json"
    if not cfg.exists():
        jsave(cfg, {"accent": "#FFD24A", "font_file": "", "caption_words": 3})
    t = proj / "taste.md"
    if not t.exists():
        t.write_text("# Taste\n\n## Rules\n\n## Inbox\n")
    probe(proj)
    m = jload(proj / "media.json")
    print(f"project: {proj}")
    print(f"src: {src.name}  {m['w']}x{m['h']} {m['fps']:.3g}fps {m['dur']:.1f}s "
          f"{'vertical' if m['vertical'] else 'horizontal'}")


def probe(proj):
    src = jload(proj / "project.json")["src"]
    r = sh(["ffprobe", "-v", "error", "-print_format", "json", "-show_streams",
            "-show_format", src])
    j = json.loads(r.stdout)
    v = next(s for s in j["streams"] if s["codec_type"] == "video")
    num, den = v["r_frame_rate"].split("/")
    m = {"src": src, "w": int(v["width"]), "h": int(v["height"]),
         "fps": int(num) / max(1, int(den)), "dur": float(j["format"]["duration"])}
    m["vertical"] = m["h"] > m["w"]
    jsave(proj / "media.json", m)
    return m


# ---------------------------------------------------------------- transcribe
def transcribe_words(src):
    try:
        from faster_whisper import WhisperModel
    except ImportError:
        pass
    else:
        try:
            model = WhisperModel("small", compute_type="int8")
            segs, _ = model.transcribe(src, word_timestamps=True)
            return [{"w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3)}
                    for s in segs for w in s.words]
        except Exception as ex:  # model not cached + offline/blocked host, etc.
            print(f"note: whisper model unavailable ({type(ex).__name__}) — "
                  "using silence-based tighten instead", file=sys.stderr)
    try:
        import whisper
    except ImportError:
        return None
    try:
        r = whisper.load_model("small").transcribe(src, word_timestamps=True)
        return [{"w": w["word"].strip(), "s": round(w["start"], 3), "e": round(w["end"], 3)}
                for s in r["segments"] for w in s.get("words", [])]
    except Exception:
        return None


def detect_silences(src, noise="-35dB", dmin=0.25):
    r = sh(["ffmpeg", "-i", src, "-af", f"silencedetect=n={noise}:d={dmin}",
            "-f", "null", "-"], ok_fail=True)
    starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", r.stderr)]
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", r.stderr)]
    return [[s, e] for s, e in zip(starts, ends)]


def build_lines(words):
    lines, cur = [], []
    for i, w in enumerate(words):
        cur.append(w)
        gap = (words[i + 1]["s"] - w["e"]) if i + 1 < len(words) else 99
        if w["w"].rstrip('"').endswith((".", "!", "?")) or gap > LINE_GAP or len(cur) >= 14:
            lines.append({"id": len(lines) + 1, "s": cur[0]["s"], "e": cur[-1]["e"],
                          "text": " ".join(x["w"] for x in cur)})
            cur = []
    if cur:
        lines.append({"id": len(lines) + 1, "s": cur[0]["s"], "e": cur[-1]["e"],
                      "text": " ".join(x["w"] for x in cur)})
    norm = lambda t: re.sub(r"[^a-z0-9 ]", "", t.lower())
    for i, a in enumerate(lines):          # mark EARLIER near-duplicates as retakes
        for b in lines[i + 1:]:
            if len(norm(a["text"])) > 8 and \
               difflib.SequenceMatcher(None, norm(a["text"]), norm(b["text"])).ratio() > 0.72:
                a["retake_of"] = b["id"]   # superseded by the later take
                break
    return lines


def cmd_words(args):
    need_ffmpeg()
    proj = find_project(args)
    m = jload(proj / "media.json")
    words = transcribe_words(m["src"])
    sil = detect_silences(m["src"])
    jsave(proj / "words.json", {"words": words or [], "silences": sil})
    if words is None:
        print("no whisper installed (pip install faster-whisper) — captions off, "
              f"cuts will snap to {len(sil)} detected silences")
        return
    lines = build_lines(words)
    jsave(proj / "lines.json", lines)
    print(f"{len(words)} words, {len(lines)} lines, "
          f"{sum(1 for l in lines if 'retake_of' in l)} retakes detected:")
    for l in lines:
        tag = f" [RETAKE→{l['retake_of']}]" if "retake_of" in l else ""
        txt = l["text"][:64] + ("…" if len(l["text"]) > 64 else "")
        print(f"  {l['id']:>3} {l['s']:7.2f}-{l['e']:7.2f}{tag} {txt}")


# ---------------------------------------------------------------- plan
def filler_only(text):
    ws = re.findall(r"[a-z']+", text.lower())
    return bool(ws) and all(w in FILLERS for w in ws)


def cmd_plan(args):
    proj = find_project(args)
    lines = jload(proj / "lines.json", default=[])
    if lines:
        keep = [l["id"] for l in lines
                if "retake_of" not in l and not filler_only(l["text"])]
        edit = {"keep_lines": keep, "zoom": "auto", "captions": True,
                "music": "auto", "sfx": "auto", "gfx": []}
    else:  # no transcript: offline dead-air-tighten mode (word-safe, no captions)
        keep = "all"
        edit = {"keep_lines": keep, "tighten": True, "zoom": [], "captions": False,
                "music": "auto", "sfx": "auto", "gfx": []}
    jsave(proj / "edit.json", edit)
    if not lines:
        print("no transcript — offline TIGHTEN mode: dead air removed (word-safe), "
              "loudness normalized. Captions/gfx need Whisper. Then: ve cut && ve render")
        return
    drop = [l["id"] for l in lines if l["id"] not in keep]
    print(f"edit.json written — keeping {len(keep)} lines"
          + (f", dropped {drop}" if drop else "") + ". Add gfx, then: ve cut && ve render")


# ---------------------------------------------------------------- cut
def legal_gaps(proj, m):
    wj = jload(proj / "words.json")
    words = wj["words"]
    gaps = []
    if words:
        gaps.append((0.0, words[0]["s"]))
        for a, b in zip(words, words[1:]):
            if b["s"] - a["e"] >= GAP_MIN:
                gaps.append((a["e"], b["s"]))
        gaps.append((words[-1]["e"], m["dur"]))
    else:
        gaps = [(0.0, 0.05)] + [tuple(s) for s in wj["silences"]] + \
               [(m["dur"] - 0.05, m["dur"])]
    return gaps


def snap(t, gaps, kind):
    """Place boundary t inside a legal silence gap. kind: 'start'|'end'."""
    inside = next((g for g in gaps if g[0] - 1e-3 <= t <= g[1] + 1e-3), None)
    g = inside or min(gaps, key=lambda g: min(abs(t - g[0]), abs(t - g[1])))
    lo, hi = g[0] + 0.02, max(g[0] + 0.02, g[1] - 0.02)
    # start: cut late in the gap (tight lead-in); end: keep a small tail
    want = hi - 0.03 if kind == "start" else lo + min(0.12, hi - lo)
    return round(min(hi, max(lo, want)), 3)


def build_tighten_ranges(proj, m, pad=0.18, min_sil=0.45):
    """Transcript-free dead-air removal. Cuts fall INSIDE silence, so words are
    never clipped; short natural pauses (< min_sil) are kept intact."""
    wj = jload(proj / "words.json", default=None)
    sils = sorted(wj["silences"] if wj else detect_silences(m["src"]))
    kept, cur = [], 0.0
    for s, e in sils:
        if e - s < max(min_sil, 2 * pad):
            continue
        end = round(s + pad, 3)
        if end > cur + 0.15:
            kept.append([cur, end])
        cur = round(e - pad, 3)
    if m["dur"] > cur + 0.15:
        kept.append([cur, round(m["dur"], 3)])
    return kept


def resolve_ranges(proj, m, edit):
    lines = jload(proj / "lines.json", default=[])
    if edit["keep_lines"] == "all" or not lines:
        if edit.get("tighten", True):
            return build_tighten_ranges(proj, m) or [[0.0, m["dur"]]]
        return [[0.0, m["dur"]]]
    by_id = {l["id"]: l for l in lines}
    ids = sorted(set(edit["keep_lines"]))
    bad = [i for i in ids if i not in by_id]
    if bad:
        die(f"edit.json keep_lines has unknown ids {bad}")
    ranges = []
    for i in ids:
        l = by_id[i]
        if ranges and l["s"] - ranges[-1][1] <= JOIN_GAP:
            ranges[-1][1] = l["e"]
        else:
            ranges.append([l["s"], l["e"]])
    gaps = legal_gaps(proj, m)
    return [[snap(s, gaps, "start"), snap(e, gaps, "end")] for s, e in ranges]


def cmd_cut(args):
    need_ffmpeg()
    proj = find_project(args)
    m = jload(proj / "media.json")
    edit = jload(proj / "edit.json")
    ranges = resolve_ranges(proj, m, edit)
    zooms = edit.get("zoom", "auto")
    segs, off = [], 0.0
    for i, (s, e) in enumerate(ranges):
        z = 1.06 if (zooms == "auto" and i % 2) else \
            (zooms[i] if isinstance(zooms, list) and i < len(zooms) else 1.0)
        segs.append({"src": [s, e], "dst": round(off, 3), "zoom": z})
        off += e - s
    seg_sig = json.dumps(segs)
    old = jload(proj / "segmap.json", default=None)
    if old and json.dumps(old["segs"]) == seg_sig and (proj / "cut.mp4").exists():
        print(f"cut.mp4 up to date ({len(segs)} segments, {off:.1f}s) — cached")
        return
    fc, maps = [], []
    for i, g in enumerate(segs):
        s, e = g["src"]
        d = e - s
        zf = (f",scale=trunc(iw*{g['zoom']}/2)*2:trunc(ih*{g['zoom']}/2)*2,"
              f"crop={m['w']}:{m['h']}") if g["zoom"] > 1.001 else ""
        fc.append(f"[0:v]trim=start={s}:end={e},setpts=PTS-STARTPTS{zf}[v{i}]")
        fc.append(f"[0:a]atrim=start={s}:end={e},asetpts=PTS-STARTPTS,"
                  f"afade=t=in:d=0.012,afade=t=out:st={max(0, d - 0.012):.3f}:d=0.012[a{i}]")
        maps += [f"[v{i}]", f"[a{i}]"]
    fc.append("".join(maps) + f"concat=n={len(segs)}:v=1:a=1[v][a]")
    sh(["ffmpeg", "-y", "-i", m["src"], "-filter_complex", ";".join(fc),
        "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-preset", "veryfast",
        "-crf", "16", "-c:a", "aac", "-b:a", "256k", proj / "cut.mp4"])
    jsave(proj / "segmap.json", {"segs": segs, "dur": round(off, 3)})
    print(f"cut.mp4: {len(segs)} segments, {off:.1f}s (from {m['dur']:.1f}s raw)")


def src2dst(t, segs):
    for g in segs:
        if g["src"][0] - 0.05 <= t <= g["src"][1]:
            return g["dst"] + max(0.0, t - g["src"][0])
    return None  # moment was cut out


# ---------------------------------------------------------------- captions
def build_ass(proj, m, segs, cfg):
    words = jload(proj / "words.json")["words"]
    if not words:
        return None
    n = int(cfg.get("caption_words", 3))
    fs = int(m["h"] * (0.045 if m["vertical"] else 0.05))
    mv = int(m["h"] * (1 - CAPTION_BAND - 0.04))
    font = Path(cfg.get("font_file", "")).stem or "Arial"
    ev = []
    kept = [w for w in words if src2dst((w["s"] + w["e"]) / 2, segs) is not None]
    for i in range(0, len(kept), n):
        grp = kept[i:i + n]
        s = src2dst((grp[0]["s"] + grp[0]["e"]) / 2, segs)
        e = src2dst((grp[-1]["s"] + grp[-1]["e"]) / 2, segs)
        if s is None or e is None:
            continue
        e = max(e + 0.15, s + 0.3)
        txt = " ".join(w["w"] for w in grp).upper().replace("{", "").replace("}", "")
        fmt = lambda t: f"{int(t // 3600)}:{int(t % 3600 // 60):02}:{t % 60:05.2f}"
        ev.append(f"Dialogue: 0,{fmt(s)},{fmt(e)},Cap,,0,0,0,,{txt}")
    ass = (proj / "cap.ass")
    ass.write_text(
        "[Script Info]\nScriptType: v4.00+\n"
        f"PlayResX: {m['w']}\nPlayResY: {m['h']}\n\n[V4+ Styles]\n"
        "Format: Name, Fontname, Fontsize, PrimaryColour, OutlineColour, BackColour,"
        " Bold, Outline, Shadow, Alignment, MarginL, MarginR, MarginV\n"
        f"Style: Cap,{font},{fs},&H00FFFFFF,&H00000000,&H80000000,-1,3,0,2,60,60,{mv}\n\n"
        "[Events]\nFormat: Layer, Start, End, Style, MarginL, MarginR, MarginV, Effect, Text\n"
        + "\n".join(ev) + "\n")
    return "cap.ass"


# ---------------------------------------------------------------- gfx + render
def gfx_time(g, proj, segs):
    if "t" in g:
        return src2dst(float(g["t"]), segs)
    if "line" in g:
        lines = jload(proj / "lines.json", default=[])
        l = next((x for x in lines if x["id"] == g["line"]), None)
        return src2dst(l["s"] + 0.05, segs) if l else None
    return None


def drawtext(text, fs, x, y, color, st, en, cfg, boxa=0.55):
    ff = cfg.get("font_file", "")
    ffp = f"fontfile='{ff}':" if ff and Path(ff).exists() else ""
    a = (f"if(lt(t,{st}+0.25),(t-{st})/0.25,"
         f"if(gt(t,{en}-0.25),({en}-t)/0.25,1))")
    return (f"drawtext={ffp}text='{esc_dt(text)}':fontsize={fs}:fontcolor={color}:"
            f"x={x}:y={y}:box=1:boxcolor=black@{boxa}:boxborderw={fs // 4}:"
            f"alpha='{a}':enable='between(t,{st},{en})'")


def build_gfx(edit, proj, m, segs, cfg, extra_inputs):
    vf, accent = [], cfg.get("accent", "#FFD24A")
    W, H, vert = m["w"], m["h"], m["vertical"]
    ypos = {"top": int(H * 0.16), "center": f"(h-text_h)/2", "lower": int(H * 0.60)}
    dropped = []
    for g in edit.get("gfx", []):
        st = gfx_time(g, proj, segs)
        if st is None:
            dropped.append(g.get("text", g.get("file", "?")))
            continue
        en = round(st + float(g.get("d", 2.2)), 3)
        st = round(st, 3)
        typ, pos = g.get("type", "keyword"), g.get("pos", "center")
        y = ypos.get(pos, ypos["center"])
        if typ == "impact":
            vf.append(drawtext(g["text"].upper(), int(H * (0.07 if vert else 0.08)),
                               "(w-text_w)/2", y, "white", st, en, cfg))
        elif typ == "keyword":
            vf.append(drawtext(g["text"], int(H * 0.05), "(w-text_w)/2", y,
                               accent, st, en, cfg))
        elif typ == "stat":
            yy = int(H * 0.30) if pos == "top" else int(H * 0.42)
            vf.append(drawtext(g["text"], int(H * 0.10), "(w-text_w)/2", yy,
                               accent, st, en, cfg))
            if g.get("label"):
                vf.append(drawtext(g["label"].upper(), int(H * 0.035), "(w-text_w)/2",
                                   yy + int(H * 0.115), "white", st, en, cfg))
        elif typ == "lower_third":
            vf.append(drawtext(g["text"], int(H * 0.032), int(W * 0.06),
                               int(H * (0.60 if edit.get("captions", True) else 0.86)),
                               "white", st, en, cfg, boxa=0.65))
        elif typ in ("image", "broll"):
            f = proj / g["file"] if not Path(g["file"]).is_absolute() else Path(g["file"])
            if not f.exists():
                dropped.append(g["file"])
                continue
            k = len(extra_inputs) + 1
            extra_inputs.append(str(f))
            if typ == "broll":
                pre = (f"[{k}:v]scale={W}:{H}:force_original_aspect_ratio=increase,"
                       f"crop={W}:{H},format=yuva420p,"
                       f"fade=t=in:st=0:d=0.25:alpha=1,"
                       f"fade=t=out:st={en - st - 0.25:.3f}:d=0.25:alpha=1,"
                       f"setpts=PTS+{st}/TB[g{k}]")
                ov = f"overlay=0:0:enable='between(t,{st},{en})'"
            else:
                sc = 0.62 if vert else 0.42
                pre = f"[{k}:v]scale={int(W * sc)}:-2[g{k}]"
                yv = {"top": int(H * 0.12), "lower": int(H * 0.55)}.get(pos, "(H-h)/2")
                ov = f"overlay=(W-w)/2:{yv}:enable='between(t,{st},{en})'"
            vf.append(("OVERLAY", pre, f"[g{k}]", ov))
        else:
            dropped.append(f"unknown type {typ}")
    return vf, dropped


def pick_asset(proj, sub, name=None):
    d = proj / "assets" / sub
    files = sorted([f for f in d.glob("*") if f.suffix.lower()
                    in (".mp3", ".wav", ".m4a", ".aac", ".ogg", ".flac")])
    if name:
        files = [f for f in files if name.lower() in f.name.lower()] or []
    return files[0] if files else None


def cmd_render(args):
    need_ffmpeg()
    proj = find_project(args)
    m = jload(proj / "media.json")
    edit = jload(proj / "edit.json")
    seg = jload(proj / "segmap.json")
    segs, dur = seg["segs"], seg["dur"]
    cfg = jload(proj / "config.json", default={})
    extra = []
    gfx, dropped = build_gfx(edit, proj, m, segs, cfg, extra)

    vchain, pres, ovs = [], [], []
    for it in gfx:
        if isinstance(it, tuple):
            pres.append(it[1]); ovs.append((it[2], it[3]))
        else:
            vchain.append(it)
    ass = build_ass(proj, m, segs, cfg) if edit.get("captions", True) else None

    fc, cur = list(pres), "[0:v]"
    for i, (lbl, ov) in enumerate(ovs):
        fc.append(f"{cur}{lbl}{ov}[ov{i}]"); cur = f"[ov{i}]"
    tail = ",".join(vchain + ([f"subtitles={ass}"] if ass else []))
    fc.append(f"{cur}{tail or 'null'}[vout]")

    # ---- audio
    music = edit.get("music", "auto")
    mfile = None
    gain = -15
    if music == "auto":
        mfile = pick_asset(proj, "music")
    elif isinstance(music, dict):
        mf = proj / music.get("file", "")
        mfile = mf if mf.exists() else None
        gain = music.get("gain_db", -15)
    sfx_spec = edit.get("sfx", "auto")
    sfx = []
    if sfx_spec == "auto":
        w = pick_asset(proj, "sfx", "whoosh") or pick_asset(proj, "sfx")
        if w:
            for g in edit.get("gfx", []):
                if g.get("type") in ("impact", "stat"):
                    t = gfx_time(g, proj, segs)
                    if t is not None:
                        sfx.append((t, w))
    elif isinstance(sfx_spec, list):
        for s in sfx_spec:
            f = pick_asset(proj, "sfx", s.get("name"))
            t = gfx_time(s, proj, segs)
            if f and t is not None:
                sfx.append((t, f))

    cmd = ["ffmpeg", "-y", "-i", "cut.mp4"]
    for f in extra:
        cmd += ["-loop", "1", "-t", str(dur), "-i", f] if Path(f).suffix.lower() in \
               (".png", ".jpg", ".jpeg", ".webp") else ["-i", f]
    ai, k = [], 1 + len(extra)
    amix = ["[vc]"]
    if mfile:
        cmd += ["-stream_loop", "-1", "-i", str(mfile)]
        ai.append(f"[{k}:a]atrim=0:{dur},volume={gain}dB[mraw]")
        ai.append("[mraw][vsc]sidechaincompress=threshold=0.015:ratio=12:attack=8:"
                  f"release=350[mduck]")
        ai.append(f"[mduck]afade=t=out:st={max(0, dur - 1.5):.2f}:d=1.5[mus]")
        amix.append("[mus]"); k += 1
    for i, (t, f) in enumerate(sfx):
        cmd += ["-i", str(f)]
        ai.append(f"[{k}:a]adelay={int(t * 1000)}|{int(t * 1000)},volume=-8dB[sx{i}]")
        amix.append(f"[sx{i}]"); k += 1
    fc.append("[0:a]asplit=2[vc][vsc]" if mfile else "[0:a]anull[vc]")
    fc += ai
    fc.append("".join(amix) + f"amix=inputs={len(amix)}:duration=first:"
              "dropout_transition=0[am]" if len(amix) > 1 else "[vc]anull[am]")
    fc.append("[am]loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[aout]")

    n = 1 + max([int(p.stem[1:]) for p in (proj / "versions").glob("v*.mp4")
                 if p.stem[1:].isdigit()] or [0])
    out = f"versions/v{n}.mp4"
    sh(["ffmpeg", "-y"] + cmd[2:] + ["-filter_complex", ";".join(fc), "-map", "[vout]",
        "-map", "[aout]", "-c:v", "libx264", "-preset", "medium", "-crf", "18",
        "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "256k", out], cwd=proj)
    for d in dropped:
        print(f"  note: gfx dropped (moment cut out or file missing): {d}")
    print(f"rendered {out}  ({dur:.1f}s, captions={'on' if ass else 'off'}, "
          f"music={'on' if mfile else 'none'}, sfx={len(sfx)}, gfx={len(edit.get('gfx', []))})")
    run_check(proj, proj / out)


# ---------------------------------------------------------------- check
def run_check(proj, out):
    m = jload(proj / "media.json")
    seg = jload(proj / "segmap.json")
    issues = []
    r = sh(["ffprobe", "-v", "error", "-print_format", "json", "-show_format", out])
    d = float(json.loads(r.stdout)["format"]["duration"])
    if abs(d - seg["dur"]) > 0.6:
        issues.append(f"duration {d:.1f}s != planned {seg['dur']:.1f}s")
    r = sh(["ffmpeg", "-i", out, "-af", "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json",
            "-f", "null", "-"], ok_fail=True)
    mjson = re.search(r"\{[^{}]*\"input_i\"[^{}]*\}", r.stderr, re.S)
    if mjson:
        li = json.loads(mjson.group(0))
        I, tp = float(li["input_i"]), float(li["input_tp"])
        if not -16.5 <= I <= -12.0:
            issues.append(f"loudness {I:.1f} LUFS out of range")
        if tp > -0.8:
            issues.append(f"true peak {tp:.1f} dBTP too hot")
    r = sh(["ffmpeg", "-i", out, "-af", "silencedetect=n=-45dB:d=1.5", "-f", "null", "-"],
           ok_fail=True)
    holes = re.findall(r"silence_start: ([\d.]+)", r.stderr)
    holes = [h for h in map(float, holes) if 1.0 < h < d - 2.0]
    if holes:
        issues.append(f"dead air >1.5s at {[round(h,1) for h in holes[:5]]}")
    words = jload(proj / "words.json", default={"words": []})["words"]
    for g in seg["segs"]:
        for b in g["src"]:
            for w in words:
                if w["s"] + 0.02 < b < w["e"] - 0.02:
                    issues.append(f"cut at {b:.2f}s clips word '{w['w']}'")
    if issues:
        print("QC: FAIL"); [print(f"  - {i}") for i in issues]; sys.exit(2)
    print("QC: PASS")


def cmd_check(args):
    proj = find_project(args)
    vs = sorted((proj / "versions").glob("v*.mp4"),
                key=lambda p: int(p.stem[1:]) if p.stem[1:].isdigit() else 0)
    if not vs:
        die("no versions rendered yet")
    run_check(proj, vs[-1])


# ---------------------------------------------------------------- review room
REVIEW_HTML = """<!doctype html><meta charset=utf8><title>Review Room</title><style>
body{margin:0;display:flex;height:100vh;font:14px system-ui;background:#111;color:#eee}
#l{flex:1;display:flex;align-items:center;justify-content:center;background:#000}
video{max-width:100%;max-height:100vh}#r{width:340px;padding:14px;overflow:auto;
background:#1a1a1a}textarea{width:100%;height:70px;background:#222;color:#eee;
border:1px solid #444;border-radius:6px;padding:8px;box-sizing:border-box}
button{margin-top:6px;padding:8px 14px;border:0;border-radius:6px;background:#e8833a;
color:#fff;cursor:pointer}.n{border-left:3px solid #e8833a;padding:6px 10px;margin:8px 0;
background:#222;border-radius:4px}.t{color:#e8833a;cursor:pointer}</style>
<div id=l><video id=v src="VIDEO" controls></video></div><div id=r>
<h3>Notes — VERSION</h3><textarea id=x placeholder="Pause where it bugs you, type the note, Add."></textarea>
<button onclick=add()>Add note @ current time</button>
<button onclick=done() style=background:#3a7>Done — save for Claude</button><div id=ns></div></div>
<script>let N=[];const v=document.getElementById('v');
function add(){const t=+v.currentTime.toFixed(1),x=document.getElementById('x');
if(!x.value.trim())return;N.push({t,text:x.value.trim()});x.value='';draw();
fetch('/note',{method:'POST',body:JSON.stringify(N)})}
function draw(){document.getElementById('ns').innerHTML=N.map((n,i)=>`<div class=n>
<span class=t onclick=v.currentTime=${n.t}>${n.t}s</span> ${n.text}</div>`).join('')}
function done(){fetch('/note',{method:'POST',body:JSON.stringify(N)}).then(()=>
alert(N.length+' notes saved. Tell Claude: feedback done.'))}</script>"""


def cmd_review(args):
    import http.server
    proj = find_project(args)
    vs = sorted((proj / "versions").glob("v*.mp4"),
                key=lambda p: int(p.stem[1:]) if p.stem[1:].isdigit() else 0)
    if not vs:
        die("no versions rendered yet")
    latest = vs[-1]
    (proj / "review.html").write_text(
        REVIEW_HTML.replace("VIDEO", f"versions/{latest.name}")
                   .replace("VERSION", latest.stem))

    class H(http.server.SimpleHTTPRequestHandler):
        def __init__(self, *a, **kw):
            super().__init__(*a, directory=str(proj), **kw)

        def do_POST(self):
            body = self.rfile.read(int(self.headers["Content-Length"]))
            notes = json.loads(body)
            jsave(proj / "notes.json", {"version": latest.stem, "notes": notes})
            self.send_response(200); self.end_headers()

        def do_GET(self):  # HTTP Range support (Safari won't play video without it)
            path = Path(self.translate_path(self.path))
            rng = self.headers.get("Range")
            if rng and path.is_file():
                size = path.stat().st_size
                mr = re.match(r"bytes=(\d*)-(\d*)", rng)
                a = int(mr.group(1) or 0)
                b = min(int(mr.group(2) or size - 1), size - 1)
                self.send_response(206)
                self.send_header("Content-Type", self.guess_type(str(path)))
                self.send_header("Accept-Ranges", "bytes")
                self.send_header("Content-Range", f"bytes {a}-{b}/{size}")
                self.send_header("Content-Length", str(b - a + 1))
                self.end_headers()
                try:
                    with open(path, "rb") as f:
                        f.seek(a)
                        left = b - a + 1
                        while left > 0:
                            chunk = f.read(min(1 << 20, left))
                            if not chunk:
                                break
                            self.wfile.write(chunk)
                            left -= len(chunk)
                except (BrokenPipeError, ConnectionResetError):
                    pass
            else:
                super().do_GET()

        def log_message(self, *a):
            pass

    port = args.port
    print(f"review room: http://localhost:{port}/review.html  ({latest.stem}) — Ctrl-C to stop")
    http.server.ThreadingHTTPServer(("127.0.0.1", port), H).serve_forever()


def cmd_taste(args):
    proj = find_project(args)
    nj = proj / "notes.json"
    data = jload(nj, default=None)
    if not data or not data.get("notes"):
        print("no new notes")
        return
    t = proj / "taste.md"
    txt = t.read_text() if t.exists() else "# Taste\n\n## Rules\n\n## Inbox\n"
    block = f"\n### {data['version']} feedback\n" + \
            "".join(f"- t={n['t']}s: {n['text']}\n" for n in data["notes"])
    t.write_text(txt + block)
    nj.rename(proj / f"notes.{data['version']}.json")
    print(f"{len(data['notes'])} notes → taste.md Inbox:")
    for n in data["notes"]:
        print(f"  - t={n['t']}s: {n['text']}")
    print("Apply each note, then distill into permanent rules under '## Rules'.")


# ---------------------------------------------------------------- doctor/selftest
def cmd_doctor(args):
    for t in ("ffmpeg", "ffprobe"):
        print(f"{t}: {'OK' if shutil.which(t) else 'MISSING — brew/apt install ffmpeg'}")
    try:
        import faster_whisper  # noqa
        print("whisper: OK (faster-whisper)")
    except ImportError:
        try:
            import whisper  # noqa
            print("whisper: OK (openai-whisper)")
        except ImportError:
            print("whisper: MISSING — pip install faster-whisper (needed for captions "
                  "+ word-safe cuts; silence fallback otherwise)")


def cmd_selftest(args):
    words = [{"w": w, "s": i * 0.5, "e": i * 0.5 + 0.3} for i, w in enumerate(
        "be honest you clicked because you dont think ai could edit this . "
        "um uh . be honest you clicked because you dont think ai could cut this .".split())]
    lines = build_lines(words)
    assert len(lines) == 3, lines
    assert lines[0].get("retake_of") == 3, lines  # first take superseded by third line
    assert filler_only("um uh")
    gaps = [(w["e"], words[i + 1]["s"]) for i, w in enumerate(words[:-1])]
    b = snap(lines[2]["s"] - 0.05, gaps, "start")
    assert not any(w["s"] + 0.02 < b < w["e"] - 0.02 for w in words), b
    segs = [{"src": [0.0, 5.0], "dst": 0.0, "zoom": 1}, {"src": [8.0, 10.0], "dst": 5.0, "zoom": 1.06}]
    assert src2dst(9.0, segs) == 6.0 and src2dst(6.5, segs) is None
    assert jload("/no/such/file", default=None) is None  # sentinel != None default
    assert jload("/no/such/file", default=[]) == []
    print("selftest: PASS")


# ---------------------------------------------------------------- cli
def main():
    p = argparse.ArgumentParser(prog="ve")
    p.add_argument("-p", "--project", default=None)
    sub = p.add_subparsers(dest="cmd", required=True)
    i = sub.add_parser("init"); i.add_argument("video")
    for c in ("words", "plan", "cut", "render", "check", "taste", "doctor", "selftest"):
        sp = sub.add_parser(c)
        if c == "plan":
            sp.add_argument("--auto", action="store_true")
    r = sub.add_parser("review"); r.add_argument("--port", type=int, default=8765)
    a = p.parse_args()
    {"init": cmd_init, "words": cmd_words, "plan": cmd_plan, "cut": cmd_cut,
     "render": cmd_render, "check": cmd_check, "review": cmd_review,
     "taste": cmd_taste, "doctor": cmd_doctor, "selftest": cmd_selftest}[a.cmd](a)


if __name__ == "__main__":
    main()
