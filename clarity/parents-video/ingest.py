#!/usr/bin/env python3
"""Copy uploaded stills into images/, named by the shot id found in the filename.

  python3 clarity/parents-video/ingest.py [source_dir]

Default source is this session's upload directory. A file is claimed when its
name contains a shot id (s12, S12, shot12, S012, scene-12 ... ). Anything else is
listed as unclaimed rather than guessed at — a still filed against the wrong shot
is worse than one left out.
"""
import os, re, shutil, sys, glob

HERE = os.path.dirname(os.path.abspath(__file__))
IMAGES = os.path.join(HERE, "images")
DEFAULT = "/root/.claude/uploads/247c8efb-3001-571f-b9cf-f2628d03ea22"
src = sys.argv[1] if len(sys.argv) > 1 else DEFAULT
EXT = (".png", ".jpg", ".jpeg", ".webp")

os.makedirs(IMAGES, exist_ok=True)
claimed, unclaimed = [], []
for path in sorted(glob.glob(os.path.join(src, "*"))):
    if not path.lower().endswith(EXT):
        continue
    name = os.path.basename(path)
    m = re.search(r"(?:^|[^0-9a-z])(?:s|shot|scene)[ _-]?0*(\d{1,3})(?:[^0-9]|$)", name, re.I)
    if not m or not 1 <= int(m.group(1)) <= 121:
        unclaimed.append(name)
        continue
    sid = f"S{int(m.group(1)):02d}"
    dest = os.path.join(IMAGES, sid + os.path.splitext(name)[1].lower())
    for old in glob.glob(os.path.join(IMAGES, sid + ".*")):
        os.remove(old)
    shutil.copy2(path, dest)
    claimed.append(f"{name} -> {os.path.basename(dest)}")

print(f"CLAIMED {len(claimed)}")
print("\n".join(claimed))
if unclaimed:
    print(f"\nUNCLAIMED {len(unclaimed)} — no shot id in the filename, not copied:")
    print("\n".join(unclaimed))
