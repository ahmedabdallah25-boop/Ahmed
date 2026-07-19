#!/usr/bin/env python3
"""Batch-generate episode images with the OpenAI Images API.

Usage:
    OPENAI_API_KEY=... python automation/generate_images.py longform/episode-01-prompts.json

Reads a prompts JSON (style anchor + character tokens + shot list), expands each
prompt, and writes PNGs to the output directory. Already-existing files are
skipped, so a partially failed run can simply be re-run to resume.
"""

import base64
import json
import os
import sys
import time
import urllib.error
import urllib.request

API_URL = "https://api.openai.com/v1/images/generations"
RETRIES = 4  # exponential backoff: 2s, 4s, 8s, 16s


def expand(spec, shot):
    prompt = shot["prompt"]
    for name, desc in spec.get("characters", {}).items():
        prompt = prompt.replace("{" + name + "}", desc)
    return spec["style_anchor"] + ", " + prompt


def generate(api_key, model, prompt, size, quality):
    body = {"model": model, "prompt": prompt, "size": size, "n": 1}
    if model == "gpt-image-1":
        body["quality"] = quality
    else:  # dall-e-3 uses a different quality vocabulary and returns b64 on request
        body["quality"] = "hd" if quality == "high" else "standard"
        body["response_format"] = "b64_json"
    req = urllib.request.Request(
        API_URL,
        data=json.dumps(body).encode(),
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
    )
    with urllib.request.urlopen(req, timeout=300) as resp:
        data = json.load(resp)
    return base64.b64decode(data["data"][0]["b64_json"])


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        sys.exit("OPENAI_API_KEY is not set")

    spec = json.load(open(sys.argv[1]))
    model = spec.get("model", "gpt-image-1")
    size = spec.get("size", "1536x1024")
    quality = spec.get("quality", "high")
    out_dir = spec.get("output_dir", "media")
    os.makedirs(out_dir, exist_ok=True)

    shots = spec["images"]
    done = failed = 0
    for i, shot in enumerate(shots, 1):
        path = os.path.join(out_dir, shot["file"])
        if os.path.exists(path):
            print(f"[{i}/{len(shots)}] {shot['file']} exists — skipped")
            continue
        prompt = expand(spec, shot)
        for attempt in range(RETRIES + 1):
            try:
                png = generate(api_key, model, prompt, size, quality)
                with open(path, "wb") as f:
                    f.write(png)
                print(f"[{i}/{len(shots)}] {shot['file']} ok")
                done += 1
                break
            except urllib.error.HTTPError as e:
                detail = e.read().decode(errors="replace")[:300]
                # gpt-image-1 needs a verified org; fall back to dall-e-3 once
                if e.code in (403, 404) and model == "gpt-image-1":
                    print(f"  {model} unavailable ({e.code}), falling back to dall-e-3")
                    model, size = "dall-e-3", "1792x1024"
                    continue
                if attempt == RETRIES:
                    print(f"[{i}/{len(shots)}] {shot['file']} FAILED: {e.code} {detail}")
                    failed += 1
                else:
                    time.sleep(2 ** (attempt + 1))
            except Exception as e:  # network hiccups: retry with backoff
                if attempt == RETRIES:
                    print(f"[{i}/{len(shots)}] {shot['file']} FAILED: {e}")
                    failed += 1
                else:
                    time.sleep(2 ** (attempt + 1))

    print(f"\ngenerated {done}, failed {failed}, output: {out_dir}/")
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
