#!/usr/bin/env python3
"""
Generate Clarity images using Replicate API.
Reads expanded batch.json, submits to Replicate, downloads results, tracks seeds.
"""
import json
import os
import sys
import time
import requests
from pathlib import Path

import replicate

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 generate-replicate.py <batch.json>")
        sys.exit(1)

    batch_file = sys.argv[1]

    # Load batch
    with open(batch_file) as f:
        batch = json.load(f)

    api_token = os.getenv('REPLICATE_API_TOKEN')
    if not api_token:
        print("ERROR: REPLICATE_API_TOKEN not set")
        sys.exit(1)

    # Setup paths
    output_dir = Path("clarity/generated-images")
    output_dir.mkdir(parents=True, exist_ok=True)

    seed_log_file = Path("clarity/seed-log.json")
    seed_log = {}
    if seed_log_file.exists():
        with open(seed_log_file) as f:
            seed_log = json.load(f)

    model = batch['meta']['model']
    total = batch['meta']['total_prompts']

    print(f"Generating {total} images using {model}")
    print(f"Output directory: {output_dir}")

    successful = 0
    failed = 0

    for idx, prompt_obj in enumerate(batch['prompts'], 1):
        scene = prompt_obj['scene']
        pass_type = prompt_obj['pass']
        seed_group = prompt_obj['seed_group']
        prompt_text = prompt_obj['prompt']
        negative_text = prompt_obj['negative_prompt']
        filename = prompt_obj['filename']

        output_path = output_dir / filename

        print(f"\n[{idx}/{total}] {filename}")

        try:
            # For first pass of a seed_group, generate new seed
            # For second pass, use the same seed
            if seed_group not in seed_log:
                # First pass - no seed specified, Replicate will generate one
                # Then we'll extract it from the output
                seed = None
                print(f"  Generating line pass (new seed)...")
            else:
                seed = seed_log[seed_group]
                print(f"  Generating wash pass (seed={seed})...")

            # Call Replicate
            output = replicate.run(
                model,
                input={
                    "prompt": prompt_text,
                    "negative_prompt": negative_text,
                    "width": 1920,
                    "height": 1080,
                    "num_outputs": 1,
                    "num_inference_steps": 50,
                    "guidance_scale": 7.5,
                    "seed": seed
                }
            )

            # Download image
            if isinstance(output, list) and len(output) > 0:
                image_url = output[0]

                # Extract seed from URL if present
                if '?seed=' in image_url:
                    returned_seed = image_url.split('?seed=')[1].split('&')[0]
                    if seed_group not in seed_log:
                        seed_log[seed_group] = int(returned_seed)
                        print(f"  Seed recorded: {seed_log[seed_group]}")

                # Download
                response = requests.get(image_url, timeout=30)
                if response.status_code == 200:
                    with open(output_path, 'wb') as f:
                        f.write(response.content)
                    print(f"  ✓ Saved: {output_path}")
                    successful += 1
                else:
                    print(f"  ✗ Failed to download (HTTP {response.status_code})")
                    failed += 1
            else:
                print(f"  ✗ No output from Replicate")
                failed += 1

        except Exception as e:
            print(f"  ✗ Error: {e}")
            failed += 1

        # Small delay between requests to avoid rate limits
        if idx < total:
            time.sleep(1)

    # Save seed log
    with open(seed_log_file, 'w') as f:
        json.dump(seed_log, f, indent=2)

    print(f"\n{'='*60}")
    print(f"Generated: {successful}/{total}")
    print(f"Failed: {failed}/{total}")
    print(f"Seed log saved: {seed_log_file}")
    print(f"{'='*60}")

    return 0 if failed == 0 else 1

if __name__ == '__main__':
    sys.exit(main())
