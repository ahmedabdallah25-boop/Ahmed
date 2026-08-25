#!/usr/bin/env python3
"""Build the eleven_v3 tagged variant of a Clarity script from a placements file.

    python3 automation/clarity_tag.py clarity/vo-emotion-tags-appointed-time.json
    python3 automation/clarity_tag.py clarity/vo-emotion-tags-appointed-time.json --level core

The clean script is never touched. Audio tags are an eleven_v3 feature; handed to
eleven_multilingual_v2 they are read aloud as literal text or ignored, so the two
scripts sit side by side and the model choice stays a choice.

WHAT THIS DOES THAT HAND-EDITING DOES NOT

Four failure modes, all silent, all caught here as hard errors:

  * An anchor that matches ZERO times leaves a line untagged and nobody hears an
    absence. An anchor that matches TWICE tags whichever came first, which is
    rarely the one that was meant. Both abort.
  * A tag at position 0 of a generation is the model's most literal reading of
    it, fires exactly at the seam where the previous batch's audio ends, and
    marks nothing — there is no preceding prose to turn from. Aborts.
  * A recitation insert is a real reciter, never TTS. Emitting it inside a paste
    block means somebody pastes '[RECITATION INSERT · Al-A'raf 7:34 · 14s]' into
    ElevenLabs and it gets read aloud. Each batch is therefore SPLIT at every
    insert into separately labelled paste blocks.
  * The clean script hard-wraps at 100 characters, so most anchors span a line
    break and would never match the raw text. Every batch is reflowed first.

LEVELS

  strong (default)  every placement
  core              only those marked "weight": "core"

Strong is denser than a long read can usually carry unchanged. Audition first,
and if the batches stop sounding like one person, rebuild at core.
"""
import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SHORT = 400   # chars below which a generation is too short to settle into the voice
BATCH_RE = re.compile(r"^###\s+BATCH\s+(\d+)\s*·\s*([^\n·]*)·", re.M)
VERIFY_RE = re.compile(r"\[VERIFY:.*?\]", re.S)
RECITE_RE = re.compile(r"\[RECITATION INSERT([^\]]*)\]")


def reflow(quoted_lines):
    """Join a batch's blockquote lines into paragraphs, stripping markdown.

    Markdown emphasis has to go: a TTS engine reads `*order*` as a literal
    asterisk or mis-stresses the word around it. Bold is stripped here and
    re-expressed as CAPS only where the placements file asks for it.
    """
    text = "\n".join(quoted_lines)
    text = VERIFY_RE.sub(" ", text)
    text = text.replace("`", "").replace("**", "").replace("*", "")
    paras = []
    for block in re.split(r"\n\s*\n", text):
        joined = re.sub(r"\s+", " ", block).strip()
        if joined:
            paras.append(joined)
    return paras


def apply_emphasis(text, rules, batch, used):
    for i, r in enumerate(rules):
        if r["batch"] != batch or r["phrase"] not in text:
            continue
        n = text.count(r["phrase"])
        if n != 1:
            raise SystemExit(
                f"emphasis {i}: phrase {r['phrase']!r} occurs {n}x in batch {batch}")
        raised = r["phrase"].replace(r["word"], r["word"].upper(), 1)
        if raised == r["phrase"]:
            raise SystemExit(
                f"emphasis {i}: word {r['word']!r} not found inside its phrase")
        text = text.replace(r["phrase"], raised, 1)
        used.add(i)
    return text


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("placements", type=Path)
    ap.add_argument("--level", choices=("strong", "core"), default="strong")
    args = ap.parse_args()

    placements_path = args.placements.resolve()
    spec = json.loads(placements_path.read_text(encoding="utf-8"))
    script = ROOT / spec["_script"]
    out = ROOT / spec["_output"]
    src = script.read_text(encoding="utf-8")

    allowed = set(spec["allowed_tags"])
    wanted = [p for p in spec["placements"]
              if args.level == "strong" or p["weight"] == "core"]
    for p in wanted:
        bad = [t for t in p["tags"] if t not in allowed]
        if bad:
            raise SystemExit(f"tag(s) {bad} not in allowed_tags — batch {p['batch']}")

    starts = [(m.group(1), m.group(2).strip(), m.start()) for m in BATCH_RE.finditer(src)]
    bounds = [(n, tc, s, (starts[i + 1][2] if i + 1 < len(starts) else len(src)))
              for i, (n, tc, s) in enumerate(starts)]

    lines, used_p, used_e = [], set(), set()
    total_blocks = 0
    sizes = []   # (batch, part, chars) for the short-block warning
    for name, timecode, start, end in bounds:
        # A blockquote paragraph break is a bare ">" with no trailing space.
        # Dropping it collapses the batch into one paragraph and the recitation
        # markers stop being isolatable — they then ride inside a paste block,
        # which is the one thing this script exists to prevent.
        quoted = []
        for ln in src[start:end].splitlines():
            if ln.startswith("> "):
                quoted.append(ln[2:])
            elif ln.rstrip() == ">":
                quoted.append("")
        paras = reflow(quoted)

        # Split the batch at every recitation insert into separate paste blocks.
        segments, current = [], []
        for para in paras:
            m = RECITE_RE.fullmatch(para.strip())
            if m:
                segments.append(("paste", current))
                segments.append(("recite", m.group(1).strip(" ·")))
                current = []
            else:
                current.append(para)
        segments.append(("paste", current))
        segments = [s for s in segments if s[0] == "recite" or s[1]]

        part, blocks = 0, [s for s in segments if s[0] == "paste"]
        lines.append(f"### BATCH {name} · {timecode}")
        for kind, payload in segments:
            if kind == "recite":
                lines += ["",
                          f"**RECITATION — do not synthesise. Real reciter: {payload}**",
                          ""]
                continue
            part += 1
            body = "\n\n".join(payload)
            for i, p in enumerate(spec["placements"]):
                if p["batch"] != name or p not in wanted:
                    continue
                n = body.count(p["anchor"])
                if n == 0:
                    continue          # anchor belongs to another block of this batch
                if n > 1:
                    raise SystemExit(
                        f"placement {i}: anchor {p['anchor']!r} occurs {n}x in batch {name}")
                at = body.index(p["anchor"])
                if at == 0:
                    raise SystemExit(
                        f"placement {i}: anchor {p['anchor']!r} opens batch {name} "
                        f"part {part} — see _placement_rule")
                tags = "".join(f"[{t}] " for t in p["tags"])
                body = body[:at] + tags + body[at:]
                used_p.add(i)
            body = apply_emphasis(body, spec["emphasis"], name, used_e)
            sizes.append((name, part, len(body)))
            label = f"paste block {part} of {len(blocks)}" if len(blocks) > 1 else "paste block"
            lines += ["", f"*{label} — {len(body):,} chars*", "", "```", body, "```"]
            total_blocks += 1
        lines.append("")

    missing = [i for i, p in enumerate(spec["placements"])
               if p in wanted and i not in used_p]
    if missing:
        raise SystemExit("anchors never matched: " + ", ".join(
            f"[{i}] {spec['placements'][i]['anchor']!r}" for i in missing))
    missing_e = [i for i in range(len(spec["emphasis"])) if i not in used_e]
    if missing_e:
        raise SystemExit("emphasis phrases never matched: " + ", ".join(
            f"[{i}] {spec['emphasis'][i]['phrase']!r}" for i in missing_e))

    tags_n = sum(len(p["tags"]) for p in wanted)
    header = [
        f"# SCRIPT (eleven_v3 TAGGED) — {script.stem}",
        "",
        "**GENERATED FILE — do not edit.** Rebuild with:",
        "",
        "```",
        f"python3 automation/clarity_tag.py {placements_path.relative_to(ROOT)}"
        + (f" --level {args.level}" if args.level != "strong" else ""),
        "```",
        "",
        f"Source of truth is [`{script.name}`]({script.name}); placements are in "
        f"[`{placements_path.name}`]({placements_path.name}). Edit those, not this.",
        "",
        f"**Level `{args.level}` — {len(wanted)} placements, {tags_n} tags across "
        f"{total_blocks} paste blocks.**",
        "",
        "**FOR eleven_v3 ONLY.** On eleven_multilingual_v2 every bracket below is "
        "either read aloud as literal text or ignored. If you are on v2, use the "
        "clean script instead.",
        "",
        "Paste one block at a time, in order. Same voice and identical settings on "
        "every block — a stability change halfway through is audible as a different "
        "person. The recitation lines between blocks are a real reciter and are "
        "never pasted anywhere.",
        "",
    ]
    short = [(b, p, n) for b, p, n in sizes if n < SHORT]
    if short:
        header += [
            f"**{len(short)} short blocks.** " + ", ".join(
                f"batch {b} part {p} ({n} chars)" for b, p, n in short)
            + f" — all under {SHORT}. A very short generation does not settle into "
              "the voice the way a full one does, and these sit next to blocks five "
              "to ten times their length, so the seam is where drift shows up first. "
              "They are short because a recitation insert cuts the batch there, not "
              "because the writing is thin, so they cannot simply be merged.",
            "",
            "Generate each of them with the PREVIOUS block's final paragraph pasted "
            "above it as lead-in, then cut that lead-in audio in the edit and keep "
            "only the tail. The engine gets enough preceding prose to settle, and "
            "you keep the take you need.",
            "",
        ]
    header += ["---", ""]
    out.write_text("\n".join(header + lines).rstrip() + "\n", encoding="utf-8")
    print(f"wrote {out.relative_to(ROOT)}")
    print(f"  level          {args.level}")
    print(f"  placements     {len(wanted)} of {len(spec['placements'])}")
    print(f"  tags inserted  {tags_n}")
    print(f"  emphases       {len(spec['emphasis'])}")
    print(f"  paste blocks   {total_blocks}")
    if short:
        print(f"  SHORT BLOCKS   {len(short)} under {SHORT} chars — "
              + ", ".join(f"batch {b} part {p} ({n})" for b, p, n in short))
        print("                 generate each with the previous block's last "
              "paragraph as lead-in, then cut it")


if __name__ == "__main__":
    sys.exit(main())
