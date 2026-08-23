#!/usr/bin/env python3
"""Probe Nano Banana on the Gemini API with one Clarity plate.

    export GEMINI_API_KEY=...        # never hardcode; this repo is public
    python3 automation/gemini_nano_banana_test.py

Step 1 lists the image models the key can actually reach, so the model id is
read off the account rather than guessed. Step 2 generates a single plate and
reports usage metadata, which is what settles whether Nano Banana is cheap
enough to carry all 180.
"""
import base64, json, os, sys, urllib.request

KEY = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
if not KEY:
    sys.exit("no GEMINI_API_KEY / GOOGLE_API_KEY in env")

BASE = "https://generativelanguage.googleapis.com/v1beta"
OUT = "media/clarity/plates/revelation-order/S002-wash-nanobanana.png"

# the exact prompt the flux-2-pro pilot used, so the comparison is like-for-like
PROMPT = (
    "A dark cave mouth in a bare rock face seen from inside, looking out at a blinding pale sky. "
    "The opening is a hard-edged shape of light. No figure. STYLE: ink and watercolour on aged "
    "parchment. Loose confident pen line, wet bleeding washes with visible grain and hard edges "
    "where the water dried. Palette: raw sienna, burnt umber, ochre, warm grey, with sparing "
    "indigo and a single warm gold accent. Muted, aged, hand-made. Generous empty parchment. "
    "Cinematic 16:9, 1920x1080. The scene is completely unpeopled and unlettered: bare landscape, "
    "architecture and objects only, every surface blank. The painting is anonymous and unsigned, "
    "its margins and all four corners left as clean bare parchment, free of any signature, "
    "monogram, initials, maker's mark, caption or calligraphy."
)


def call(url, payload=None):
    req = urllib.request.Request(url, headers={"x-goog-api-key": KEY,
                                               "Content-Type": "application/json"})
    data = json.dumps(payload).encode() if payload is not None else None
    try:
        with urllib.request.urlopen(req, data, timeout=180) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode()[:900]
        # a quota rejection here is the actual answer, not a crash
        sys.exit(f"HTTP {e.code}\n{body}")


print("== image-capable models this key can reach ==")
models = call(f"{BASE}/models")
img = [m for m in models.get("models", [])
       if "image" in m.get("name", "").lower()
       or "IMAGE" in str(m.get("supportedGenerationMethods", ""))]
for m in img:
    print(" ", m["name"].split("/")[-1], "|", m.get("displayName", ""))
if not img:
    print("  (none advertised; trying the documented id anyway)")

model = next((m["name"].split("/")[-1] for m in img if "flash-image" in m["name"]),
             "gemini-2.5-flash-image")
print(f"\n== generating one plate on {model} ==")

res = call(f"{BASE}/models/{model}:generateContent", {
    "contents": [{"parts": [{"text": PROMPT}]}],
    "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"aspectRatio": "16:9"}},
})

parts = res.get("candidates", [{}])[0].get("content", {}).get("parts", [])
blob = next((p["inlineData"]["data"] for p in parts if "inlineData" in p), None)
if not blob:
    sys.exit("no image returned:\n" + json.dumps(res)[:900])

os.makedirs(os.path.dirname(OUT), exist_ok=True)
raw = base64.b64decode(blob)
open(OUT, "wb").write(raw)
print(f"wrote {OUT}  ({len(raw)//1024} KB)")
print("usage:", json.dumps(res.get("usageMetadata", {})))
