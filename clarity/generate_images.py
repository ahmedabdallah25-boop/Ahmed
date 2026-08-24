#!/usr/bin/env python3
"""
Clarity in the Quran - Automated Image Generator
Generates all 180 images using Hugging Face free tier with automatic retry logic
"""

import os
import sys
import re
import json
import time
import requests
from pathlib import Path
from datetime import datetime
from typing import Optional, List, Dict, Tuple

# Configuration
OUTPUT_DIR = Path("clarity_images")
PROMPTS_FILE = Path("clarityimageprompts.txt")
PROGRESS_FILE = Path(".generation_progress.json")

# Free tier HF model
MODEL_ID = "black-forest-labs/FLUX.1-schnell"

NEGATIVE_PROMPT = "no text, no letters, no writing, no numerals, no calligraphy, no signature, no watermark, no human face, no facial features, no portrait, no photoreal skin, no 3D render, no digital gloss, no lens flare, no modern objects, no crosses, no church architecture, no menorah, no Star of David."


def get_hf_token() -> str:
    """Get HF token from environment or stdin"""

    # Check environment
    token = os.getenv("HF_API_TOKEN")
    if token:
        return token

    # Check for .env file
    env_file = Path(".env")
    if env_file.exists():
        with open(env_file) as f:
            for line in f:
                if line.startswith("HF_API_TOKEN="):
                    token = line.split("=", 1)[1].strip().strip('"').strip("'")
                    if token:
                        return token

    # Interactive prompt
    print("\n⚠️  HF_API_TOKEN not set")
    print("Get your token from: https://huggingface.co/settings/tokens")
    print("\nOptions:")
    print("1. Set environment: export HF_API_TOKEN='hf_...'")
    print("2. Create .env file with: HF_API_TOKEN=hf_...")
    print("3. Enter token now: ", end="", flush=True)

    token = input().strip()
    if not token:
        sys.exit("❌ No token provided. Cannot continue.")

    return token


def parse_prompts_file(filepath: Path) -> List[Dict]:
    """Parse clarity image prompts file"""

    if not filepath.exists():
        raise FileNotFoundError(f"Prompts file not found: {filepath}")

    with open(filepath, 'r') as f:
        content = f.read()

    scenes = {}

    # Split by image blocks
    blocks = re.split(r'\[\s*\d+/180\s*\]', content)[1:]

    for block in blocks:
        lines = block.strip().split('\n')

        # Parse metadata line
        meta_line = lines[0] if lines else ""

        # Extract scene and pass
        match = re.search(r'(\S+)-(line|wash)', meta_line)
        if not match:
            continue

        scene_id = match.group(1)
        pass_type = match.group(2)

        # Extract seed
        seed_match = re.search(r'seed group (\S+)', meta_line)
        seed = int(seed_match.group(1)) if seed_match else int(scene_id[1:]) * 1000 + int(scene_id[1:])

        # Find prompt
        prompt_idx = None
        for i, line in enumerate(lines):
            if line.strip() == "PROMPT":
                prompt_idx = i + 1
                break

        if prompt_idx is None:
            continue

        prompt = ""
        for i in range(prompt_idx, len(lines)):
            if lines[i].strip() and not lines[i].strip().startswith("NEGATIVE"):
                prompt = lines[i].strip()
                break

        if not prompt:
            continue

        # Store scene
        if scene_id not in scenes:
            scenes[scene_id] = {
                "scene": scene_id,
                "seed": seed,
                "passes": {}
            }

        scenes[scene_id]["passes"][pass_type] = {"prompt": prompt}

    return list(scenes.values())


def load_progress() -> Dict:
    """Load generation progress"""
    if PROGRESS_FILE.exists():
        with open(PROGRESS_FILE) as f:
            return json.load(f)
    return {"generated": {}, "failed": {}, "started": datetime.now().isoformat()}


def save_progress(progress: Dict) -> None:
    """Save generation progress"""
    with open(PROGRESS_FILE, 'w') as f:
        json.dump(progress, f, indent=2)


class ImageGenerator:
    """Generate images via Hugging Face Inference API"""

    def __init__(self, api_token: str, output_dir: Path):
        self.token = api_token
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.api_url = f"https://api-inference.huggingface.co/models/{MODEL_ID}"
        self.headers = {"Authorization": f"Bearer {self.token}"}
        self.stats = {"generated": 0, "failed": 0, "skipped": 0}

    def generate(self, prompt: str, negative: str, seed: int, max_retries: int = 5) -> Optional[bytes]:
        """Generate single image with exponential backoff retry"""

        payload = {
            "inputs": prompt,
            "parameters": {
                "negative_prompt": negative,
                "seed": seed,
                "height": 1080,
                "width": 1920,
            }
        }

        for attempt in range(max_retries):
            try:
                response = requests.post(
                    self.api_url,
                    headers=self.headers,
                    json=payload,
                    timeout=150
                )

                if response.status_code == 200:
                    return response.content

                elif response.status_code == 503:
                    wait = min(10 * (2 ** attempt), 60)
                    print(f"  ⏳ Loading (wait {wait}s)...", end="\r")
                    time.sleep(wait)
                    continue

                else:
                    print(f"  ⚠️  Error {response.status_code}")
                    return None

            except requests.exceptions.RequestException as e:
                if attempt < max_retries - 1:
                    time.sleep(2)

        return None

    def save(self, data: bytes, filename: str) -> bool:
        """Save image file"""
        try:
            filepath = self.output_dir / filename
            filepath.write_bytes(data)
            return True
        except Exception as e:
            print(f"  ❌ Save error: {e}")
            return False

    def generate_all(self, scenes: List[Dict], resume: bool = True) -> None:
        """Generate all images with progress tracking"""

        progress = load_progress() if resume else {"generated": {}, "failed": {}, "started": datetime.now().isoformat()}
        total_images = len(scenes) * 2

        print(f"\n{'='*70}")
        print(f"🎬 Clarity in the Quran - Image Generation")
        print(f"📊 Total: {len(scenes)} scenes × 2 passes = {total_images} images")
        print(f"💾 Output: {self.output_dir.absolute()}")
        print(f"{'='*70}\n")

        start_time = time.time()

        for idx, scene in enumerate(scenes, 1):
            scene_id = scene["scene"]
            seed = scene["seed"]

            print(f"[{idx:3d}/{len(scenes)}] {scene_id} (seed {seed})")

            for pass_type in ["line", "wash"]:
                if pass_type not in scene["passes"]:
                    continue

                filename = f"{scene_id}-{pass_type}.png"

                # Skip if already generated
                if filename in progress["generated"]:
                    print(f"  ✓ {pass_type:4s} (cached)")
                    self.stats["skipped"] += 1
                    continue

                prompt = scene["passes"][pass_type]["prompt"]

                # Generate
                print(f"  ⏳ {pass_type:4s}...", end=" ")
                sys.stdout.flush()

                image_data = self.generate(prompt, NEGATIVE_PROMPT, seed)

                if image_data and self.save(image_data, filename):
                    print("✓")
                    progress["generated"][filename] = datetime.now().isoformat()
                    self.stats["generated"] += 1
                else:
                    print("✗")
                    progress["failed"][filename] = datetime.now().isoformat()
                    self.stats["failed"] += 1

                save_progress(progress)
                time.sleep(0.3)  # Rate limit

        # Print summary
        elapsed = time.time() - start_time
        hours = elapsed / 3600

        print(f"\n{'='*70}")
        print(f"✅ Generation Complete!")
        print(f"  ✓ Generated: {self.stats['generated']}")
        print(f"  ⏭️  Skipped:  {self.stats['skipped']}")
        print(f"  ✗ Failed:   {self.stats['failed']}")
        print(f"  ⏱️  Time:     {hours:.1f} hours")
        print(f"  📁 Output:   {self.output_dir.absolute()}")
        print(f"{'='*70}\n")


def main():
    """Main entry point"""

    # Get token
    print("🔐 Authenticating with Hugging Face...")
    token = get_hf_token()

    if not token.startswith("hf_"):
        sys.exit("❌ Invalid token format (should start with 'hf_')")

    # Parse prompts
    print("📖 Parsing prompts...")
    try:
        scenes = parse_prompts_file(PROMPTS_FILE)
        print(f"✓ Parsed {len(scenes)} scenes")
    except Exception as e:
        sys.exit(f"❌ Failed to parse prompts: {e}")

    # Generate images
    print("🚀 Starting image generation...")
    generator = ImageGenerator(token, OUTPUT_DIR)
    generator.generate_all(scenes, resume=True)

    print("✨ Done! Check the 'clarity_images' directory for your images.")


if __name__ == "__main__":
    main()
