#!/usr/bin/env python3
"""Export the things a producer actually works from.

    python automation/clarity_export.py

  media/clarity/export/clarity-image-prompts.csv          180 plate prompts, spreadsheet
  media/clarity/export/clarity-image-prompts.txt          the same 180, copy-paste blocks
  media/clarity/export/clarity-voiceover-script.txt       28 TTS batches, clean
  media/clarity/export/vo/batch-NN.txt                    one file per batch
  media/clarity/export/clarity-voiceover-script-v3-tagged.txt   the same script, audio tags
  media/clarity/export/vo-v3/batch-NN.txt                 one tagged file per batch

The repo already holds the sources — plates/manifest.json and
script-revelation-order.md — but neither is a working format. The manifest is a
200KB JSON for programmatic use; the script is a documented markdown file with
blockquote markers, timecodes and [VERIFY] tags threaded through the prose. This
strips both down to what gets pasted into a generator.

WHAT IS DELIBERATELY REMOVED FROM THE VO TEXT

[VERIFY] tags. They are editorial markers and were never spoken — the script is
built so each sentence survives its own tag being deleted. But removing them
silently would be the whole point of the convention lost, so every one is listed
in the header of the exported script, against the batch it came from. Nothing
that needs checking disappears just because it left the recording text.

TWO VO FILES, NOT ONE

Audio tags ([thoughtful], [quietly]) are an eleven_v3 feature. Handed to
eleven_multilingual_v2 they are read aloud as literal text or ignored, so a
tagged script sent to the wrong model is worse than no tags at all. The clean
file is therefore never overwritten — the tagged one sits beside it and the
model choice stays a choice. Placements live in clarity/vo-emotion-tags.json.

Every anchor in that file must appear EXACTLY ONCE in its batch. Zero matches
means a silently untagged line; two means the tag lands in whichever place the
string happened to occur first. Both are wrong in a way nobody would catch by
listening, so both abort the export.
"""
import csv
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MANIFEST = ROOT / "media" / "clarity" / "plates" / "manifest.json"
SCRIPT = ROOT / "clarity" / "script-revelation-order.md"
TAGS = ROOT / "clarity" / "vo-emotion-tags.json"
OUT = ROOT / "media" / "clarity" / "export"

VERIFY = re.compile(r"`\[VERIFY:?\s*([^\]]*)\]`")

# Markdown emphasis is invisible in the rendered document and audible in a TTS
# render: an engine reads *order* as a literal asterisk, or mis-stresses the
# word around it. The script uses italics for stress, which is right in the
# document and must never reach the engine.
MD = [(re.compile(r"\*\*([^*\n]+)\*\*"), r"\1"),
      (re.compile(r"\*([^*\n]+)\*"), r"\1"),
      (re.compile(r"`([^`\n]+)`"), r"\1"),
      (re.compile(r"(?<!\w)_([^_\n]+)_(?!\w)"), r"\1")]

CAP = 2400


def export_prompts_csv(data):
    dest = OUT / "clarity-image-prompts.csv"
    with dest.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["id", "scene", "seed_group", "pass", "act", "cue_at",
                    "vo_cue", "prompt", "negative_prompt", "aspect_ratio", "save_as"])
        for e in data["entries"]:
            w.writerow([e["id"], e["scene"], e["seed_group"], e["pass"], e["act"],
                        e["cue_at"], e["vo_cue"], e["prompt"], e["negative"],
                        e["aspect_ratio"], Path(e["out"]).name])
    return dest


def export_prompts_txt(data):
    """The same 180 prompts, laid out to be copied one at a time.

    Each prompt and each negative is a single unwrapped line, so one triple-click
    selects the whole thing. Everything else on the block is context and is
    prefixed so it is obvious at a glance what must not be pasted.
    """
    entries = data["entries"]
    n = len(entries)
    rules = data["_hard_rules"]

    L = [
        "CLARITY IN THE QURAN — IMAGE PROMPTS",
        "Every Surah in the Order It Was Actually Revealed",
        "",
        f"{n} plates across {data['scenes']} scenes — two passes per scene.",
        "",
        "HOW TO USE THIS FILE",
        "",
        "  Each block below is one generation. The line after PROMPT is the whole",
        "  prompt on ONE line — triple-click it, copy, paste. Same for NEGATIVE.",
        "  Everything else on the block is context for you, not for the generator.",
        "",
        "  Two passes share a SEED GROUP. Generate the -line pass first, note the",
        "  seed, then generate the -wash pass on that SAME seed. Different seeds",
        "  and the two passes will not register when you composite them.",
        "",
        "  SAVE AS is the filename the edit expects. Keep it exactly.",
        "",
        "HARD RULES — these are in every prompt already, do not strip them",
        "",
    ]
    for r in rules:
        L.append(f"  - {r}")
    L += [
        "",
        "  The no-faces rule is not a style preference. It is the reason this",
        "  channel can carry a public 'AI BE AWARE' comment and still be trusted.",
        "",
        "=" * 78,
    ]

    act = None
    for i, e in enumerate(entries, 1):
        if e["act"] != act:
            act = e["act"]
            L += ["", "-" * 78, act, "-" * 78]
        L += [
            "",
            f"[ {i}/{n} ]  {e['id']}",
            f"  scene {e['scene']}  ·  {e['pass']} pass  ·  seed group {e['seed_group']}",
            f"  cue {e['cue_at']}  ·  VO: {e['vo_cue']}",
            f"  aspect {e['aspect_ratio']}  ·  SAVE AS {Path(e['out']).name}",
            "",
            "PROMPT",
            e["prompt"],
            "",
            "NEGATIVE",
            e["negative"],
            "",
            "." * 78,
        ]

    dest = OUT / "clarity-image-prompts.txt"
    dest.write_text("\n".join(L).rstrip() + "\n", encoding="utf-8")
    return dest


def batches():
    src = SCRIPT.read_text(encoding="utf-8")
    out, act = [], None
    parts = re.split(r"(^### BATCH .*$|^# ACT .*$)", src, flags=re.M)
    for i in range(1, len(parts), 2):
        head, body = parts[i], parts[i + 1]
        if head.startswith("# ACT"):
            act = head.lstrip("# ").strip()
            continue
        num, tc = re.search(r"BATCH (\d+) · ([\d:–]+)", head).groups()
        raw = body.split("\n---")[0].split("\n# ")[0]
        lines = [l.strip()[1:].strip() for l in raw.split("\n") if l.strip().startswith(">")]
        # blank quote lines are paragraph breaks in the source; keep them as such
        paras, cur = [], []
        for l in lines:
            if l:
                cur.append(l)
            elif cur:
                paras.append(" ".join(cur)); cur = []
        if cur:
            paras.append(" ".join(cur))
        text = "\n\n".join(paras)
        flags = VERIFY.findall(text)
        text = VERIFY.sub("", text)
        text = "\n\n".join(re.sub(r"[ \t]+", " ", p).strip() for p in text.split("\n\n"))
        text = re.sub(r"\s+([.,;:])", r"\1", text)
        for rx, rep in MD:
            text = rx.sub(rep, text)
        out.append({"n": num, "tc": tc, "act": act, "text": text, "verify": flags})
    return out


class TagError(Exception):
    pass


def apply_tags(bs):
    """Insert each audio tag immediately before its anchor. Audit as we go.

    Returns (tagged_text_by_batch, audit_rows). Raises TagError on anything that
    would put a tag somewhere other than exactly where the config says.
    """
    cfg = json.loads(TAGS.read_text(encoding="utf-8"))
    allowed = set(cfg["allowed_tags"])
    by_n = {b["n"]: b for b in bs}
    problems, rows = [], []
    tagged = {b["n"]: b["text"] for b in bs}

    for p in cfg["placements"]:
        n, tag, anchor = p["batch"], p["tag"], p["anchor"]
        if tag not in allowed:
            problems.append(f"batch {n}: [{tag}] is not in allowed_tags")
            continue
        if n not in by_n:
            problems.append(f"batch {n}: no such batch in the script")
            continue
        hits = by_n[n]["text"].count(anchor)
        if hits != 1:
            problems.append(
                f"batch {n}: anchor {anchor!r} appears {hits} times, needs exactly 1")
            continue
        # insert against the already-tagged text so two tags in one batch both land
        if tagged[n].count(anchor) != 1:
            problems.append(f"batch {n}: anchor {anchor!r} no longer unique after an "
                            "earlier insertion — the placements overlap")
            continue
        tagged[n] = tagged[n].replace(anchor, f"[{tag}] {anchor}", 1)
        rows.append((n, tag, anchor))

    if problems:
        raise TagError("\n".join("  " + p for p in problems))
    return cfg, tagged, rows


def write_batches(bs, textof, subdir):
    d = OUT / subdir
    d.mkdir(parents=True, exist_ok=True)
    for b in bs:
        (d / f"batch-{b['n']}.txt").write_text(textof(b) + "\n", encoding="utf-8")
    return d


def script_header(bs, textof, title_note, extra):
    flagged = [(b["n"], v) for b in bs for v in b["verify"]]
    longest = max(len(textof(b)) for b in bs)
    words = sum(len(textof(b).split()) for b in bs)
    head = [
        "CLARITY IN THE QURAN — VOICEOVER SCRIPT",
        "Every Surah in the Order It Was Actually Revealed",
        title_note,
        "",
        f"{len(bs)} batches · {words:,} words · longest batch {longest} characters",
        "",
        "HOW TO GENERATE",
        "",
        "  Paste ONE batch at a time. Every batch is under 2,400 characters, which",
        "  clears the smallest common TTS cap without re-splitting.",
        "",
        "  1. Same voice and identical settings on every batch. Write them down",
        "     before batch 01 and do not tune mid-way — a stability change at",
        "     batch 09 is audible as a different person.",
        "  2. If a batch needs a fix, regenerate it AND the one before it, then",
        "     listen to the seam. Never regenerate one in isolation.",
        "  3. Leave about 350ms of silence at each join, not zero.",
        "  4. Numbers are written as words on purpose. Do not convert them to",
        "     digits — engines read bare digits inconsistently between batches.",
        "  5. Arabic is transliterated on purpose, for the same reason. The Arabic",
        "     the viewer SEES is typeset in the edit, not spoken by the engine.",
        "",
        "  Seven recitation inserts are NOT in this file and must not be",
        "  synthesised. They are a real reciter: Al-Alaq 96:1-5, the oath-openings",
        "  montage, Al-Kawthar 108, Al-Isra 17:23-24, Al-Hujurat 49:13,",
        "  Al-Maida 5:3, An-Nasr 110. See the scene pack for placement.",
        "",
    ]
    head += extra
    head += [
        "CHECK BEFORE YOU RECORD",
        "",
        f"  The script carries {len(flagged)} claims marked for verification. They are",
        "  NOT in the text below — they were editorial markers, never spoken — but",
        "  the claims themselves are still in the sentences. Clear each against a",
        "  printed source first. Each sentence is written to survive deletion, so",
        "  anything you cannot source can be cut rather than softened.",
        "",
    ]
    for n, v in flagged:
        head.append(f"  batch {n} — {v}")
    head += ["", "=" * 78, ""]
    return head, words, longest, len(flagged)


def script_body(bs, textof):
    body, seen = [], None
    for b in bs:
        if b["act"] != seen:
            seen = b["act"]
            body += ["", "-" * 78, seen, "-" * 78, ""]
        body += [f"[ BATCH {b['n']} · {b['tc']} · {len(textof(b))} chars ]", "",
                 textof(b), ""]
    return body


def export_vo(bs):
    textof = lambda b: b["text"]
    write_batches(bs, textof, "vo")
    head, words, longest, flags = script_header(
        bs, textof,
        "Clean text — no audio tags. Safe on any engine.",
        ["  This is the CLEAN file. A tagged variant for eleven_v3 is beside it as",
         "  clarity-voiceover-script-v3-tagged.txt. Do not paste that one into v2.",
         ""])
    dest = OUT / "clarity-voiceover-script.txt"
    dest.write_text("\n".join(head + script_body(bs, textof)).rstrip() + "\n",
                    encoding="utf-8")
    return dest, words, longest, flags


def export_vo_tagged(bs, cfg, tagged, rows):
    textof = lambda b: tagged[b["n"]]
    write_batches(bs, textof, "vo-v3")
    extra = [
        "READ THIS BEFORE YOU USE THIS FILE",
        "",
        "  Audio tags are an eleven_v3 feature. On eleven_multilingual_v2 a",
        "  bracketed tag is spoken aloud as literal text or ignored. If you are",
        "  not on v3, close this file and use clarity-voiceover-script.txt.",
        "",
        "  v3 is more expressive and LESS deterministic than v2, and this script's",
        "  largest production risk is 28 separately-generated batches failing to",
        "  sound like one person. Audition batches 01, 14 and 28 back to back",
        "  before committing to v3 for all of it. If they do not sound like the",
        "  same reading, take the clean script on v2 — a steady reading beats an",
        "  expressive one that drifts.",
        "",
        f"  {len(rows)} tags across {len(bs)} batches, about one per 190 words. Sparing on",
        "  purpose: over-tagging swings the performance line to line, and on this",
        "  subject a swinging performance reads as insincere. Punctuation and",
        "  sentence length already carry the pacing; the tags only mark the places",
        "  where the register genuinely turns.",
        "",
        "  Tags are requests, not switches — v3 reads them in context, so the same",
        "  tag can land differently in different sentences. Audition each one. Any",
        "  tag that draws attention to itself is doing harm; delete it and keep",
        "  the rest.",
        "",
    ]
    head, words, longest, flags = script_header(
        bs, textof, "eleven_v3 variant — carries audio tags.", extra)
    dest = OUT / "clarity-voiceover-script-v3-tagged.txt"
    dest.write_text("\n".join(head + script_body(bs, textof)).rstrip() + "\n",
                    encoding="utf-8")
    return dest, words, longest


def audit(bs, cfg, tagged, rows):
    """Print the tag audit. Everything here is checkable against the two files."""
    from collections import Counter
    print()
    print("AUDIO-TAG AUDIT")
    words = sum(len(b["text"].split()) for b in bs)
    per = Counter(n for n, _, _ in rows)
    kinds = Counter(t for _, t, _ in rows)

    print(f"  placements          {len(rows)}")
    print(f"  anchors resolved    {len(rows)}/{len(cfg['placements'])} "
          f"— each found exactly once in its batch")
    print(f"  vocabulary          {len(kinds)} of {len(cfg['allowed_tags'])} allowed tags used: "
          + ", ".join(f"{t}×{c}" for t, c in sorted(kinds.items())))
    unused = sorted(set(cfg["allowed_tags"]) - set(kinds))
    if unused:
        print(f"                      unused: {', '.join(unused)}")
    print(f"  density             1 tag per {words // max(len(rows), 1)} words")
    print(f"  batches tagged      {len(per)}/{len(bs)}"
          + (f"  ({', '.join(sorted(set(b['n'] for b in bs) - set(per)))} untagged)"
             if len(per) < len(bs) else ""))
    hot = [f"{n}×{c}" for n, c in sorted(per.items()) if c > 1]
    print(f"  most in one batch   {max(per.values())}"
          + (f"  ({', '.join(hot)})" if hot else ""))

    banned = ["laugh", "shout", "sarcas", "excited", "sings", "whisper"]
    used = " ".join(t for _, t, _ in rows).lower()
    bad = [b for b in banned if b in used]
    print(f"  subject check       {'FAIL: ' + ', '.join(bad) if bad else 'clean — nothing performative'}")

    # a tag at the very start of a batch is the one placement that can be wrong
    # without sounding wrong in isolation: the join from the previous batch is
    # where the register jump happens, and you cannot hear it in one file.
    seams = [n for n, t, a in rows if tagged[n].startswith(f"[{t}]")]
    print(f"  batch-opening tags  {len(seams)}"
          + (f" ({', '.join(seams)}) — audition each against the batch before it"
             if seams else ""))
    print()


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    data = json.loads(MANIFEST.read_text(encoding="utf-8"))

    c = export_prompts_csv(data)
    t = export_prompts_txt(data)
    print(f"{c.relative_to(ROOT)}  —  {len(data['entries'])} plates across {data['scenes']} scenes")
    print(f"{t.relative_to(ROOT)}  —  the same {len(data['entries'])}, copy-paste blocks")

    bs = batches()
    v, words, longest, flags = export_vo(bs)
    print(f"{v.relative_to(ROOT)}  —  {len(bs)} batches, {words:,} words, "
          f"longest {longest} chars, {flags} verify notes")
    print(f"{(OUT / 'vo').relative_to(ROOT)}/batch-NN.txt  —  {len(bs)} single-batch files")

    try:
        cfg, tagged, rows = apply_tags(bs)
    except TagError as e:
        print("\nAUDIO TAGS REJECTED — nothing tagged was written:\n" + str(e))
        return 1

    vt, twords, tlongest = export_vo_tagged(bs, cfg, tagged, rows)
    print(f"{vt.relative_to(ROOT)}  —  {len(rows)} tags, longest {tlongest} chars")
    print(f"{(OUT / 'vo-v3').relative_to(ROOT)}/batch-NN.txt  —  {len(bs)} tagged single-batch files")

    audit(bs, cfg, tagged, rows)

    if max(longest, tlongest) > CAP:
        print(f"WARNING: a batch exceeds the {CAP:,}-character working cap")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
