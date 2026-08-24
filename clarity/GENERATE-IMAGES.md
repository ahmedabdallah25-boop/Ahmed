# Generate Clarity Images with Replicate

Your Replicate API token is securely stored as a GitHub secret. The workflow will use it to generate all images.

## Quick Start

### Generate All 90 Scenes (180 images)

1. Go to GitHub: [Actions → CLARITY IN THE QURAN - Generate Images](https://github.com/ahmedabdallah25-boop/Ahmed/actions/workflows/clarity-generate-images.yml)
2. Click **Run workflow** (green button)
3. Leave all inputs blank (defaults: all scenes, flux-pro model, not dry-run)
4. Click **Run workflow**
5. Wait for the job to complete (~30-60 min for 180 images depending on queue)
6. Images will be committed to `clarity/generated-images/`
7. Seed log will be saved to `clarity/seed-log.json`

### Test Generation (First 5 Scenes Only)

1. Go to the same Actions page
2. Click **Run workflow**
3. In **Scenes to generate**, enter: `S002,S003,S004,S006,S008`
4. Click **Run workflow**
5. This will generate 10 images (2 passes × 5 scenes) to test

### Dry-Run Preview (No Images Generated)

1. Click **Run workflow**
2. Check **Preview batch without generating**
3. Click **Run workflow**
4. Workflow will list all prompts without calling Replicate

## What Happens

### During the Workflow

1. **Expands** the tokenized `prompts-tokenized.json` to full Replicate prompts
2. **Submits** to Replicate API (using your secret token)
3. **Tracks seeds** — when generating line passes, it records the seed; wash passes use the same seed
4. **Downloads** generated images (1920×1080 PNG)
5. **Commits** to the branch with seed log

### Output Structure

```
clarity/
├── generated-images/
│   ├── S002-line.png
│   ├── S002-wash.png
│   ├── S003-line.png
│   ├── S003-wash.png
│   └── ... (180 total)
├── seed-log.json       ← Tracks which seed each scene used
├── prompts-tokenized.json
└── GENERATE-IMAGES.md  ← This file
```

### Seed Log Format

```json
{
  "S002": 12345678,
  "S003": 87654321,
  "S004": 11111111,
  ...
}
```

Each line pass generates a new seed; the wash pass for that scene uses the same seed so they composite correctly.

## Troubleshooting

### "REPLICATE_API_TOKEN not set"
Your secret is not configured in GitHub. Go to:
- Settings → Secrets and variables → Actions
- Add a new secret: `REPLICATE_API_TOKEN` = your Replicate API key

### "Rate limited by Replicate"
The workflow waits 1 second between requests. If you hit rate limits:
- Wait 15 minutes before retrying
- Or generate in batches (e.g., 20 scenes at a time)

### Images failed to download
Check the workflow logs for HTTP errors. Common causes:
- Network timeout — rerun the batch
- URL expired — Replicate URLs are temporary; rerun generation

### Want to regenerate one scene?
Run the workflow with `scenes: S002` (just that scene). The seed log will update if it's a new scene, or reuse if it already exists.

## Next Steps

After generation:
1. **Review** images in `clarity/generated-images/`
2. **Composite** line + wash passes in your edit software
3. **Update** video packaging with the final images
4. **Run** "CLARITY IN THE QURAN - 2. Fix packaging" to upload to YouTube

## Costs

Replicate bills per-second of generation. Flux Pro is ~2-3 USD per image at default quality/steps. 180 images ≈ $400-500 total. Check your Replicate account at https://replicate.com/account/billing for current usage.

## More Info

- **Tokenized prompts:** see `PROMPTS-USAGE.md`
- **Expand manually:** `python3 prompts-expand.py prompts-tokenized.json --output batch.json`
- **Workflow code:** `.github/workflows/clarity-generate-images.yml`
- **Generation script:** `clarity/generate-replicate.py`
