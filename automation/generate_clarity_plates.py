#!/usr/bin/env python3
"""Batch generate clarity in the quran image plates.

Uses Replicate API to generate all 180 images from manifest.json.
Tracks progress and resumes from where it left off.

Usage:
    python automation/generate_clarity_plates.py [--start N] [--limit N] [--dry-run]

Options:
    --start N       Start from image N (1-180), default is first missing
    --limit N       Generate only N images, default is all
    --dry-run       Preview what would be generated without generating
    --api-key KEY   Replicate API key (or set REPLICATE_API_KEY env var)
"""
import argparse
import json
import os
import sys
import time
from pathlib import Path
from typing import Optional

try:
    import requests
except ImportError:
    print("ERROR: requests library required. Install with: pip install requests")
    sys.exit(1)

ROOT = Path(__file__).resolve().parent.parent
MANIFEST_PATH = ROOT / "media" / "clarity" / "plates" / "manifest.json"

REPLICATE_API_URL = "https://api.replicate.com/v1/predictions"
MODEL = "black-forest-labs/flux-pro"  # High-quality image generation

def load_manifest() -> dict:
    """Load the manifest with all prompts."""
    with open(MANIFEST_PATH) as f:
        return json.load(f)

def get_generated_files() -> set:
    """Get set of already-generated image filenames."""
    generated = set()
    for entry in load_manifest()["entries"]:
        output_path = Path(ROOT) / entry["out"]
        if output_path.exists():
            generated.add(entry["id"])
    return generated

def generate_image(prompt: str, negative: str, api_key: str) -> Optional[str]:
    """Generate an image using Replicate API.

    Args:
        prompt: The positive prompt
        negative: The negative prompt
        api_key: Replicate API key

    Returns:
        URL to generated image, or None if failed
    """
    headers = {
        "Authorization": f"Token {api_key}",
        "Content-Type": "application/json",
    }

    payload = {
        "version": "6c83f78b5e42b7585ac6b0b743a4f5d78f4a2d0d",  # flux-pro
        "input": {
            "prompt": prompt,
            "negative_prompt": negative,
            "aspect_ratio": "16:9",
            "output_format": "png",
            "num_outputs": 1,
        },
    }

    try:
        print(f"  Requesting generation...", flush=True)
        response = requests.post(REPLICATE_API_URL, json=payload, headers=headers, timeout=30)
        response.raise_for_status()
        result = response.json()

        # Poll for completion
        prediction_id = result["id"]
        max_polls = 120  # 10 minutes max
        poll_count = 0

        while poll_count < max_polls:
            poll_count += 1
            time.sleep(5)

            status_response = requests.get(
                f"{REPLICATE_API_URL}/{prediction_id}",
                headers=headers,
                timeout=10
            )
            status_response.raise_for_status()
            status = status_response.json()

            if status["status"] == "succeeded":
                if status["output"]:
                    return status["output"][0]
                return None
            elif status["status"] == "failed":
                print(f"    ERROR: Generation failed: {status.get('error')}", flush=True)
                return None
            elif status["status"] == "canceled":
                print(f"    Generation was canceled", flush=True)
                return None

            elapsed = poll_count * 5
            if poll_count % 12 == 0:  # Every 60 seconds
                print(f"    Waiting... ({elapsed}s elapsed)", flush=True)

        print(f"    ERROR: Generation timed out after {max_polls * 5}s", flush=True)
        return None

    except requests.exceptions.RequestException as e:
        print(f"    ERROR: API request failed: {e}", flush=True)
        return None
    except (KeyError, json.JSONDecodeError) as e:
        print(f"    ERROR: Invalid response: {e}", flush=True)
        return None

def download_image(url: str, output_path: Path) -> bool:
    """Download generated image to local file."""
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()

        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, "wb") as f:
            f.write(response.content)

        file_size = output_path.stat().st_size / 1024 / 1024
        print(f"  Saved {output_path.name} ({file_size:.1f}MB)", flush=True)
        return True
    except Exception as e:
        print(f"    ERROR: Download failed: {e}", flush=True)
        if output_path.exists():
            output_path.unlink()
        return False

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--start", type=int, help="Start from image N (1-180)")
    parser.add_argument("--limit", type=int, help="Generate only N images")
    parser.add_argument("--dry-run", action="store_true", help="Preview without generating")
    parser.add_argument("--api-key", help="Replicate API key")
    args = parser.parse_args()

    # Get API key
    api_key = args.api_key or os.environ.get("REPLICATE_API_KEY")
    if not api_key and not args.dry_run:
        print("ERROR: REPLICATE_API_KEY env var not set and --api-key not provided")
        print("Get a key at https://replicate.com/account/api-tokens")
        sys.exit(1)

    manifest = load_manifest()
    entries = manifest["entries"]
    generated = get_generated_files()

    # Filter entries to generate
    pending = [e for e in entries if e["id"] not in generated]

    if args.start:
        # Start from specific index
        pending = pending[args.start - 1:]

    if args.limit:
        pending = pending[:args.limit]

    if not pending:
        print("All images already generated!")
        return 0

    print(f"\nClarity in the Quran — Plate Generation")
    print(f"=" * 60)
    print(f"Pending: {len(pending)} images")
    print(f"Already generated: {len(generated)} images")
    print(f"Total: {len(entries)} images")
    print()

    if args.dry_run:
        print("DRY RUN — showing first 5 images that would be generated:\n")
        for i, entry in enumerate(pending[:5], 1):
            print(f"[{i}] {entry['id']} — {entry['scene']}")
            print(f"    {entry['cue_at']} / {entry['vo_cue']}")
            print(f"    → {entry['out']}")
            print()
        if len(pending) > 5:
            print(f"... and {len(pending) - 5} more")
        return 0

    # Generate images
    success = 0
    failed = 0

    for idx, entry in enumerate(pending, 1):
        entry_id = entry["id"]
        output_path = Path(ROOT) / entry["out"]

        print(f"\n[{idx}/{len(pending)}] {entry_id} — {entry['pass']}")
        print(f"  Scene: {entry['scene']} | {entry['cue_at']}")
        print(f"  {entry['vo_cue']}")

        # Generate image
        image_url = generate_image(entry["prompt"], entry["negative"], api_key)
        if not image_url:
            print(f"  FAILED: Could not generate image")
            failed += 1
            continue

        # Download image
        if download_image(image_url, output_path):
            success += 1
        else:
            failed += 1

    print(f"\n" + "=" * 60)
    print(f"Completed: {success} succeeded, {failed} failed")
    if failed == 0:
        print(f"All {success} images generated successfully! ✓")

    return 0 if failed == 0 else 1

if __name__ == "__main__":
    sys.exit(main())
