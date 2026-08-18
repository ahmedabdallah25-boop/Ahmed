#!/usr/bin/env python3
"""Build and audit the shot timeline for the parents video.

Reads scene-pack.txt (the timeline authority: shots + Arabic cards) and
prompts-ready.txt (the prompt text for each generated still), emits
timeline.csv + pending.txt, and runs the audit mechanically.

  python3 clarity/parents-video/build_timeline.py [--track A|B]

Exit code is non-zero if any audit check fails, so it can gate a generation run.
Drop delivered images into clarity/parents-video/images/ named S01.png, S02.jpg,
... (any extension); the STATUS column picks them up on the next run.

If a VO file (vo.srt) is dropped alongside, its final cue-out is compared with
the timeline's total runtime and any drift is reported.
"""
import csv, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PACK = os.path.join(HERE, "scene-pack.txt")
PROMPTS = os.path.join(HERE, "prompts-ready.txt")
IMAGES = os.path.join(HERE, "images")
VO = os.path.join(HERE, "vo.srt")

track = "A"
if "--track" in sys.argv:
    track = sys.argv[sys.argv.index("--track") + 1].upper()

def secs(t):
    m, s = t.split(":")
    return int(m) * 60 + int(s)

def tc(n):
    return f"{n // 60}:{n % 60:02d}"

DOT = "·"
SHOT = re.compile(r"^S(\d+)\s*" + DOT + r"\s*(\d+:\d+)–(\d+:\d+)\s*" + DOT + r"\s*(\d+)s\s*" + DOT + r"\s*(.*)$")
CARD = re.compile(r"^\s*(C\d)\s*" + DOT + r"\s*(\d+:\d+)–(\d+:\d+)\s*" + DOT + r"\s*Arabic card\s*(.*)$")
CHAP = re.compile(r"^CH\.(\d+)\s*" + DOT + r"\s*(\d+:\d+)–(\d+:\d+)\s*" + DOT + r"\s*(.*)$")

# ---------------------------------------------------------------- parse pack
lines = open(PACK, encoding="utf-8").read().splitlines()
events, chapters, chapter = [], [], None
i = 0
while i < len(lines):
    line = lines[i]
    m = CHAP.match(line)
    if m:
        chapter = f"CH.{m.group(1)}"
        chapters.append((chapter, secs(m.group(2)), secs(m.group(3)), m.group(4).strip()))
        i += 1
        continue
    m = CARD.match(line)
    if m:
        events.append(dict(id=m.group(1), kind="card", chapter=chapter,
                           tin=secs(m.group(2)), tout=secs(m.group(3)),
                           stated=secs(m.group(3)) - secs(m.group(2)),
                           flags="", rf="", prompt=m.group(4).strip(), alt=""))
        i += 1
        continue
    m = SHOT.match(line)
    if m:
        flags = m.group(5)
        body, alt = [], []
        i += 1
        while i < len(lines) and lines[i].strip() and not SHOT.match(lines[i]) and not CARD.match(lines[i]):
            s = lines[i].strip()
            (alt if (s.startswith("[B-ALT]") or alt) else body).append(re.sub(r"^\[B-ALT\]\s*", "", s))
            i += 1
        rf = ""
        r = re.search(r"\[RF of (S\d+)", flags)
        if r:
            rf = r.group(1)
        events.append(dict(id=f"S{int(m.group(1)):02d}", kind="reframe" if rf else "still",
                           chapter=chapter, tin=secs(m.group(2)), tout=secs(m.group(3)),
                           stated=int(m.group(4)), flags=flags.strip(), rf=rf,
                           prompt=" ".join(body).strip(), alt=" ".join(alt).strip()))
        continue
    i += 1

# ------------------------------------------------------- parse prompt pack
prompts, cur = {}, None
for line in open(PROMPTS, encoding="utf-8"):
    m = SHOT.match(line.strip())
    if m:
        cur = f"S{int(m.group(1)):02d}"
        prompts.setdefault(cur, {"prompt": "", "negative": "", "alt": "", "alt_negative": ""})
        continue
    if cur and "TRACK B ALTERNATE" in line:
        # The marker is indented and bulleted, so match on content, not prefix.
        # Everything after it belongs to the alternate until the next shot header.
        prompts[cur]["_alt"] = True
    elif cur and line.startswith("PROMPT"):
        prompts[cur]["_field"] = "alt" if prompts[cur].get("_alt") else "prompt"
    elif cur and line.startswith("NEGATIVE"):
        prompts[cur]["_field"] = "alt_negative" if prompts[cur].get("_alt") else "negative"
    elif cur and line.strip() and prompts[cur].get("_field"):
        f = prompts[cur]["_field"]
        prompts[cur][f] = (prompts[cur].get(f, "") + " " + line.strip()).strip()

# ------------------------------------------------------------------- audit
fails, notes = [], []
def check(ok, msg):
    (notes if ok else fails).append(("PASS" if ok else "FAIL") + "  " + msg)

shots = [e for e in events if e["kind"] != "card"]
cards = [e for e in events if e["kind"] == "card"]
ids = [int(e["id"][1:]) for e in shots]
check(ids == list(range(1, 122)), f"shot ids sequential S01-S121 (found {len(ids)}, max S{max(ids)})")
check(len(cards) == 9, f"nine Arabic cards present (found {len(cards)})")

ordered = sorted(events, key=lambda e: e["tin"])
gaps = [(a["id"], b["id"], a["tout"], b["tin"]) for a, b in zip(ordered, ordered[1:]) if a["tout"] != b["tin"]]
check(not gaps, f"timeline continuous across {len(ordered)} events" + ("" if not gaps else f" — breaks: {gaps[:5]}"))
check(ordered[0]["tin"] == 0, "timeline starts at 0:00")
check(ordered[-1]["tout"] == secs("29:45"), f"timeline ends at 29:45 (got {tc(ordered[-1]['tout'])})")

bad_dur = [e["id"] for e in shots if e["stated"] != e["tout"] - e["tin"]]
check(not bad_dur, f"stated durations match in/out" + ("" if not bad_dur else f" — {bad_dur}"))

rfs = [e for e in shots if e["kind"] == "reframe"]
byid = {e["id"]: e for e in shots}
orphan = [e["id"] for e in rfs if e["rf"] not in byid or byid[e["rf"]]["tin"] > e["tin"]]
check(not orphan, f"{len(rfs)} re-frames resolve to an earlier parent still" + ("" if not orphan else f" — {orphan}"))
check(len(rfs) == 20, f"re-frame count is 20 (found {len(rfs)})")

gen = [e for e in shots if e["kind"] == "still"]
check(len(gen) == 101, f"stills to generate is 101 (found {len(gen)})")
alts = [e for e in shots if "[B-ALT]" in e["flags"]]
check(len(alts) == 18, f"Track B alternates is 18 (found {len(alts)})")
missing_alt = [e["id"] for e in alts if not e["alt"]]
check(not missing_alt, "every [B-ALT] shot carries an alternate prompt" + ("" if not missing_alt else f" — {missing_alt}"))

no_prompt = [e["id"] for e in gen if not prompts.get(e["id"], {}).get("prompt")]
check(not no_prompt, "every still has a ready-to-paste prompt" + ("" if not no_prompt else f" — {no_prompt}"))
mismatch = [e["id"] for e in gen if prompts.get(e["id"], {}).get("prompt", "")[:40] and
            e["prompt"][:40].lower() != prompts[e["id"]]["prompt"][:40].lower()]
check(not mismatch, "prompt pack agrees with scene pack, opening" + ("" if not mismatch else f" — {mismatch}"))

# A prompt that swallowed its own Track B alternate would carry the style tail
# twice. Catching that is the whole reason this check counts rather than compares.
TAIL = "no calligraphy in the image."
doubled = [e["id"] for e in gen if prompts.get(e["id"], {}).get("prompt", "").lower().count(TAIL) > 1]
check(not doubled, "no prompt contains a second block glued onto it" + ("" if not doubled else f" — {doubled}"))
short = [e["id"] for e in gen if 0 < len(prompts.get(e["id"], {}).get("prompt", "")) < 300]
check(not short, "every prompt carries the resolved style suffix" + ("" if not short else f" — {short}"))

FACE = re.compile(r"\b(face|faces|eyes|eye|mouth|nose|portrait|likeness|smiling|expression)\b", re.I)
# "face" also names surfaces (the door's face, the stone's lit face) and appears
# inside prohibitions ("no head, face or limb visible"). Both are legal; only a
# clause that *asks for* a face is a violation. Split into clauses, drop the
# negated and surface ones, then scan what is left.
NEGATION = re.compile(r"\b(no|not|never|nobody|none|without|unmarked|nothing)\b", re.I)
SURFACE = re.compile(r"\b(face|faces)\s+(of|in)\b|\b(near|lit|far|door's|stone's|naskh)\s+face\b", re.I)

def scan(text, term, extra_ok=None):
    """Clauses of a sentence inherit an earlier negation in that same sentence,
    so "no head, face, or limb visible" reads as negated all the way through."""
    out = []
    for sentence in re.split(r"[.;—]", text or ""):
        negated = False
        for clause in sentence.split(","):
            if NEGATION.search(clause):
                negated = True
            if not term.search(clause) or negated:
                continue
            if extra_ok and extra_ok.search(clause):
                continue
            out.append(clause.strip()[:60])
    return out

def face_violations(text):
    return scan(text, FACE, SURFACE)

hits = []
for e in gen:
    for label, text in (("prompt", e["prompt"]), ("alt", e["alt"])):
        for v in face_violations(text):
            hits.append(f"{e['id']}/{label}: {v}")
check(not hits, "face-rule scan on all generated prompts" + ("" if not hits else f" — {hits}"))

# S111 must contain no person in any form. Negated mentions ("no people, no
# figures") are the point of the prompt, so scan only the non-negated clauses.
PERSON = re.compile(r"\b(figure|figures|person|people|hand|hands|shoulder|silhouette|shadow)\b", re.I)

def person_violations(text):
    return scan(text, PERSON)

s111 = byid["S111"]
s111_hits = person_violations(s111["prompt"])
check(not s111_hits, "S111 contains no person, figure, hand or shadow" + ("" if not s111_hits else f" — {s111_hits}"))

if os.path.exists(VO):
    cues = re.findall(r"(\d\d):(\d\d):(\d\d)[,.](\d\d\d)\s*-->", open(VO, encoding="utf-8").read())
    if cues:
        h, m, s, _ = cues[-1]
        last = int(h) * 3600 + int(m) * 60 + int(s)
        check(abs(last - ordered[-1]["tout"]) <= 5,
              f"VO last cue {tc(last)} within 5s of timeline end {tc(ordered[-1]['tout'])}")
else:
    notes.append("SKIP  no vo.srt present — timings taken from the scene pack alone")

# --------------------------------------------------------------- write out
os.makedirs(IMAGES, exist_ok=True)
have = {}
for f in sorted(os.listdir(IMAGES)):
    key = re.match(r"^(S\d+)", f, re.I)
    if key:
        have[f"S{int(key.group(1)[1:]):02d}"] = f

# A generation that exists on Higgsfield but has not been downloaded here yet
# still counts as done - do not pay to make it twice.
generated = {}
gpath = os.path.join(HERE, "generations.csv")
if os.path.exists(gpath):
    for row in csv.DictReader(open(gpath, encoding="utf-8")):
        if re.match(r"^S\d+$", row["id"]):
            generated[row["id"]] = row["url"]

rows, pending = [], []
for n, e in enumerate(ordered, 1):
    if e["kind"] == "card":
        status, asset, prompt = "TYPESET", "", e["prompt"]
    elif e["kind"] == "reframe":
        status, asset = "REFRAME", have.get(e["rf"], "")
        prompt = f"camera move on {e['rf']}: {e['prompt']}"
    else:
        use_alt = track == "B" and e["alt"]
        prompt = prompts.get(e["id"], {}).get("alt" if use_alt else "prompt") or (e["alt"] if use_alt else e["prompt"])
        asset = have.get(e["id"], "") or generated.get(e["id"], "")
        status = "HAVE" if e["id"] in have else ("GENERATED" if e["id"] in generated else "PENDING")
        if status == "PENDING":
            pending.append(e["id"])
    rows.append(dict(event=n, id=e["id"], chapter=e["chapter"], kind=e["kind"],
                     tin=tc(e["tin"]), tout=tc(e["tout"]), dur=e["tout"] - e["tin"],
                     track="B" if (track == "B" and e["alt"]) else "A",
                     rf_parent=e["rf"], status=status, asset=asset, prompt=prompt))

with open(os.path.join(HERE, "timeline.csv"), "w", newline="", encoding="utf-8") as fh:
    w = csv.DictWriter(fh, fieldnames=list(rows[0].keys()))
    w.writeheader()
    w.writerows(rows)

with open(os.path.join(HERE, "pending.txt"), "w", encoding="utf-8") as fh:
    fh.write("\n".join(pending) + ("\n" if pending else ""))

done = len({e["id"] for e in gen} & (set(have) | set(generated)))
print(f"TRACK {track} · {len(rows)} events · {len(gen)} stills · {done} done · {len(pending)} pending "
      f"· est {len(pending)} credits at 1/still")
print("\n".join(notes))
print("\n".join(fails))
print(f"\n{'AUDIT PASSED' if not fails else str(len(fails)) + ' AUDIT FAILURE(S)'}")
sys.exit(1 if fails else 0)
