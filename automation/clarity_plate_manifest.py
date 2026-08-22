#!/usr/bin/env python3
"""Turn the scene pack's ILLUS entries into a render-ready plate manifest.

    python automation/clarity_plate_manifest.py

Writes media/clarity/plates/manifest.json — one entry per illustration, with the
fixed style block and the negative block already appended, so the prompts can be
fed to whichever image generator has credits without anyone re-assembling them by
hand and quietly dropping the negative block on plate 61.

WHY THIS IS A FILE AND NOT A LOOP THAT GENERATES

At the time of writing no connected generator can run this: ElevenLabs exposes no
image tool in this session, Higgsfield is at 0.1 credits, and vidIQ has 19. The
manifest is the part that can be built now and does not expire. When credits
exist, the prompts are already exact, already carry the guards, and already know
which pass they belong to.

TWO PASSES PER SCENE. The scene pack's line-to-wash reveal needs both states of
the same drawing, so every scene yields two entries sharing a seed slot:

    <id>-line   prompt + ", line art only, no colour, no wash"
    <id>-wash   prompt exactly as written

Same seed, same model, same settings. If the generator does not expose a seed,
generate the wash first and use it as an image reference for the line pass —
without one of those two mechanisms the pair will not register and the
cross-dissolve becomes a cut between two different drawings.
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PACK = ROOT / "clarity" / "scene-pack-revelation-order.txt"
OUT = ROOT / "media" / "clarity" / "plates" / "manifest.json"

HEAD = re.compile(r"^S(\d{3}) · (\d+:\d{2}) · (ILLUS|GRAPHIC|RECITATION) · (.*)$")


def blocks(text, marker, stop):
    """Pull a fenced prose block out of the pack by its header line."""
    i = text.index(marker)
    j = text.index(stop, i)
    body = text[i + len(marker):j]
    return "\n".join(l.strip() for l in body.strip().split("\n") if l.strip())


def main():
    txt = PACK.read_text(encoding="utf-8")

    style = blocks(txt, "THE FIXED STYLE BLOCK — append to EVERY illustration prompt, unchanged\n"
                        "--------------------------------------------------------------------------------\n",
                   "  (The last four exist")
    # split the one block into its STYLE: and NEGATIVE: halves
    s_i, n_i = style.index("STYLE:"), style.index("NEGATIVE:")
    style_txt = " ".join(style[s_i:n_i].split())
    neg_txt = " ".join(style[n_i:].split())

    act = None
    plates = []
    lines = txt.split("\n")
    for k, line in enumerate(lines):
        if line.startswith("ACT "):
            act = line.split("·")[0].strip()
            continue
        m = HEAD.match(line)
        if not m or m.group(3) != "ILLUS":
            continue
        sid, tc, _, cue = m.groups()
        # body = the indented lines that follow, to the next blank line
        body = []
        for nxt in lines[k + 1:]:
            if not nxt.strip():
                break
            body.append(nxt.strip())
        subject = " ".join(body)
        # strip the pack's directorial asides — they instruct a human, not a model
        subject = re.sub(r"\(No legible glyphs[^)]*\)", "", subject)
        subject = re.sub(r"Reuse the seed\.?", "", subject)
        subject = " ".join(subject.split())
        base = f"{subject} {style_txt}"
        for suffix, extra in (("line", ", line art only, no colour, no wash"),
                              ("wash", "")):
            plates.append({
                "id": f"S{sid}-{suffix}",
                "scene": f"S{sid}",
                "act": act,
                "cue_at": tc,
                "vo_cue": cue.strip('"'),
                "pass": suffix,
                "seed_group": f"S{sid}",
                "prompt": (subject + extra + " " + style_txt).strip(),
                "negative": neg_txt.replace("NEGATIVE:", "").strip(),
                "aspect_ratio": "16:9",
                "out": f"media/clarity/plates/S{sid}-{suffix}.png",
            })

    scenes = sorted({p["scene"] for p in plates})
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps({
        "_comment": "Render-ready plates for scene-pack-revelation-order.txt. Two passes per "
                    "scene sharing a seed_group; see automation/clarity_plate_manifest.py.",
        "_hard_rules": [
            "No faces, no prophets, no Companions, in any form.",
            "No photoreal anything — ink and watercolour only.",
            "No generated text inside a generated image; every glyph is typeset in the edit.",
            "Same seed across a seed_group, or the line/wash pair will not register.",
        ],
        "scenes": len(scenes),
        "plates": len(plates),
        "entries": plates,
    }, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"{len(scenes)} scenes -> {len(plates)} plates")
    print(f"wrote {OUT.relative_to(ROOT)}")
    short = [p["id"] for p in plates if len(p["prompt"]) < 260]
    if short:
        print(f"WARNING: {len(short)} prompt(s) look thin: {', '.join(short[:6])}")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
