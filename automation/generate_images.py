#!/usr/bin/env python3
"""Batch-generate episode images.

Providers:
    openai       — OpenAI Images API (needs OPENAI_API_KEY)
    gemini       — Google Gemini API image generation, free tier (needs GEMINI_API_KEY
                   from https://aistudio.google.com/apikey; no billing required)
    pollinations — free, keyless Flux generation via pollinations.ai

If no --provider is given, picks the first one with a usable key: openai, gemini,
then pollinations.

Usage:
    python automation/generate_images.py longform/episode-01-prompts.json [--provider gemini]

Reads a prompts JSON (style anchor + character tokens + shot list), expands each
prompt, and writes PNGs to the output directory. Already-existing files are
skipped, so a partially failed run can simply be re-run to resume.
"""

import base64
import json
import os
import random
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

API_URL = "https://api.openai.com/v1/images/generations"
POLLINATIONS_URL = "https://image.pollinations.ai/prompt/"
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


GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
GEMINI_MODELS = ["gemini-2.5-flash-image", "gemini-2.0-flash-preview-image-generation"]


def generate_gemini(api_key, prompt, with_aspect=True):
    body = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"responseModalities": ["IMAGE"]},
    }
    if with_aspect:
        body["generationConfig"]["imageConfig"] = {"aspectRatio": "16:9"}
    last_err = None
    for model in GEMINI_MODELS:
        req = urllib.request.Request(
            GEMINI_URL.format(model=model),
            data=json.dumps(body).encode(),
            headers={"x-goog-api-key": api_key, "Content-Type": "application/json"},
        )
        try:
            with urllib.request.urlopen(req, timeout=300) as resp:
                data = json.load(resp)
            for part in data["candidates"][0]["content"]["parts"]:
                if "inlineData" in part:
                    return base64.b64decode(part["inlineData"]["data"])
            raise RuntimeError("no image in response")
        except urllib.error.HTTPError as e:
            last_err = e
            if e.code == 400 and with_aspect:  # older models reject imageConfig
                return generate_gemini(api_key, prompt, with_aspect=False)
            if e.code == 404:  # model not available on this key — try next
                continue
            raise
    raise last_err


def generate_pollinations(prompt, size, seed):
    w, h = size.split("x")
    url = (
        POLLINATIONS_URL
        + urllib.parse.quote(prompt)
        + f"?width={w}&height={h}&model=flux&nologo=true&seed={seed}"
    )
    req = urllib.request.Request(url, headers={"User-Agent": "episode-image-batch/1.0"})
    with urllib.request.urlopen(req, timeout=300) as resp:
        return resp.read()


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if len(args) != 1:
        sys.exit(__doc__)
    api_key = os.environ.get("OPENAI_API_KEY")
    gemini_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if "--provider" in sys.argv:
        provider = sys.argv[sys.argv.index("--provider") + 1]
    elif api_key:
        provider = "openai"
    elif gemini_key:
        provider = "gemini"
    else:
        provider = "pollinations"
    if provider == "gemini" and not gemini_key:
        sys.exit("GEMINI_API_KEY is not set (free key: https://aistudio.google.com/apikey)")
    if provider == "openai" and not api_key:
        sys.exit("OPENAI_API_KEY is not set")
    print(f"provider: {provider}")

    spec = json.load(open(args[0]))
    model = spec.get("model", "gpt-image-1")
    size = spec.get("size", "1536x1024") if provider == "openai" else "1536x864"
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
        seed = spec.get("seed", 1207) + i  # stable per-shot seeds for reproducibility
        for attempt in range(RETRIES + 1):
            try:
                if provider == "pollinations":
                    png = generate_pollinations(prompt, size, seed)
                elif provider == "gemini":
                    png = generate_gemini(gemini_key, prompt)
                    time.sleep(6)  # stay under the free tier's ~10 requests/min
                else:
                    png = generate(api_key, model, prompt, size, quality)
                with open(path, "wb") as f:
                    f.write(png)
                print(f"[{i}/{len(shots)}] {shot['file']} ok")
                done += 1
                break
            except urllib.error.HTTPError as e:
                detail = e.read().decode(errors="replace")[:300]
                # gpt-image-1 needs a verified org; fall back to dall-e-3 once
                if e.code in (403, 404) and provider == "openai" and model == "gpt-image-1":
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
