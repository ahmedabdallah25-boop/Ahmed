# Clarity in the Quran — Image Prompts (Tokenized)

## Overview

The original `d473ceaf-clarityimageprompts.txt` (190 KB, 54K tokens) has been tokenized into a **compact JSON format** that reduces size by **77.5%** while preserving all generation data.

- **Original**: 190,463 characters, 54,000+ tokens
- **Tokenized**: 42,919 characters, ~13,000 tokens
- **Savings**: 147,544 characters, ~41,000 tokens

## Files

### `prompts-tokenized.json`
Compact parametric storage of all 90 scenes and 180 prompts.

**Structure:**
```json
{
  "meta": {
    "total_scenes": 90,
    "total_prompts": 180,
    "model": "black-forest-labs/flux-pro",
    "shared_style": "STYLE: ink and watercolour on aged parchment...",
    "shared_negative": "no text, no letters, no writing..."
  },
  "scenes": [
    {
      "id": "S002",
      "order": 1,
      "seed_group": "S002",
      "cue": "0:02",
      "vo": "Hira. A cave on a mountain outside Mecca",
      "description": "A dark cave mouth...",
      "aspect_ratio": "16:9",
      "passes": [
        {"pass": "line", "prefix": "Line art only, no colour, no wash. ", "filename": "S002-line.png"},
        {"pass": "wash", "prefix": "", "filename": "S002-wash.png"}
      ]
    },
    ...
  ]
}
```

### `prompts-expand.py`
Helper script to expand the JSON back to full prompts for Replicate API.

**Usage:**
```bash
# Expand all 180 prompts to batch.json
python3 prompts-expand.py prompts-tokenized.json --output batch.json

# Expand only specific scenes
python3 prompts-expand.py prompts-tokenized.json --scenes S002,S003,S006 --output test-batch.json

# Print to stdout
python3 prompts-expand.py prompts-tokenized.json
```

**Output format for Replicate:**
```json
{
  "meta": {
    "total_prompts": 180,
    "model": "black-forest-labs/flux-pro"
  },
  "prompts": [
    {
      "scene": "S002",
      "pass": "line",
      "seed_group": "S002",
      "prompt": "A dark cave mouth... [full prompt with STYLE]",
      "negative_prompt": "no text, no letters...",
      "image_size": "1920x1080",
      "num_outputs": 1,
      "filename": "S002-line.png"
    },
    ...
  ]
}
```

### `verify-prompts.py`
Verification script that spot-checks 9 scenes (first 5, middle, last 5) to confirm expanded prompts match the original text file exactly. Run after any edits to JSON.

```bash
python3 verify-prompts.py
```

## How to Use

### 1. **For Manual Generation** (Midjourney, Leonardo, etc.)

Use `prompts-expand.py` to expand specific scenes, then copy/paste individual prompts:

```bash
python3 prompts-expand.py prompts-tokenized.json --output batch.json
# Open batch.json, find your scene, copy the "prompt" field
```

### 2. **For Replicate API** (GitHub Actions)

Expand full batch, then pass to your workflow:

```bash
python3 prompts-expand.py prompts-tokenized.json --output replicate-batch.json
# Use replicate-batch.json in GitHub Actions workflow
```

Example GitHub Actions step:
```yaml
- name: Generate images with Replicate
  run: |
    python3 clarity/prompts-expand.py clarity/prompts-tokenized.json --output batch.json
    # Pass batch.json to replicate dispatch or API call
```

### 3. **Programmatic Expansion** (Custom Tools)

Load and expand in Python:

```python
import json

with open('prompts-tokenized.json') as f:
    data = json.load(f)

shared_style = data['meta']['shared_style']
shared_negative = data['meta']['shared_negative']

for scene in data['scenes']:
    for pass_info in scene['passes']:
        full_prompt = f"{scene['description']} {pass_info['prefix']}{shared_style}".strip()
        full_negative = shared_negative
        # Use full_prompt and full_negative for generation
        print(f"{pass_info['filename']}: {full_prompt[:80]}...")
```

## Hard Rules (Baked Into All Prompts)

These rules appear in every prompt and should never be stripped:

- ✓ No faces, no prophets, no Companions, in any form.
- ✓ No photoreal anything — ink and watercolour only.
- ✓ No generated text inside a generated image; every glyph is typeset in the edit.
- ✓ Same seed across a seed_group, or the line/wash pair will not register.

## Seed Group Management

Each of the 90 scenes has a **seed_group** (e.g., `S002`, `S003`). When generating:

1. Generate **line pass** first → note the seed
2. Generate **wash pass** on the **same seed** with the same `seed_group`
3. This ensures the line and wash can composite correctly in post

The `prompts-expand.py` output includes `seed_group` in each prompt object for this workflow.

## Verification

To verify integrity after any changes:

```bash
python3 verify-prompts.py
```

This compares spot-checked expanded prompts against the original text file and confirms:
- ✓ First 5 scenes (S002–S010)
- ✓ Middle scene
- ✓ Last 5 scenes
- ✓ All PROMPT and NEGATIVE fields

## Token Economy

| Format | Size | Tokens |
|--------|------|--------|
| Original `.txt` | 190 KB | 54,000+ |
| Tokenized `.json` | 42 KB | ~13,000 |
| Savings | 148 KB | ~41,000 |
| Reduction | 77.5% | 76% |

The tokenized format is ideal for:
- **Long-context LLM workflows** (fitting more context in a request)
- **API payloads** (smaller JSON = faster transmission)
- **Version control** (easier diffs, smaller file size)

## Maintenance

When you need to edit prompts:

1. **Edit descriptions in the JSON** (update the `description` field in the relevant scene)
2. **Edit shared STYLE or NEGATIVE** (update `meta.shared_style` or `meta.shared_negative`)
3. **Re-verify** with `python3 verify-prompts.py`
4. **Re-expand** with `python3 prompts-expand.py prompts-tokenized.json --output batch.json`

The original text file (`d473ceaf-clarityimageprompts.txt`) can be archived or kept as a read-only reference.
