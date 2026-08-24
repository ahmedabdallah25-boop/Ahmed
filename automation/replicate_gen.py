#!/usr/bin/env python3
"""Replicate image generation helper for simple one-off requests.

Usage:
    from automation.replicate_gen import generate_image
    url = generate_image("a beautiful watercolor painting")
"""
import os
import time
import requests

REPLICATE_API_URL = "https://api.replicate.com/v1/predictions"

def generate_image(
    prompt: str,
    negative: str = "",
    model: str = "black-forest-labs/flux-pro",
    aspect_ratio: str = "16:9",
    api_key: str = None,
) -> str:
    """Generate a single image via Replicate API.

    Args:
        prompt: The positive prompt for image generation
        negative: Negative prompt (what to avoid)
        model: Model to use (default: flux-pro)
        aspect_ratio: Output aspect ratio (default: 16:9)
        api_key: Replicate API key (defaults to REPLICATE_API_KEY env var)

    Returns:
        URL to the generated image

    Raises:
        RuntimeError: If generation fails or API key not found
        requests.RequestException: If API request fails
    """
    api_key = api_key or os.environ.get("REPLICATE_API_KEY")
    if not api_key:
        raise RuntimeError(
            "REPLICATE_API_KEY not set. "
            "Get a key at https://replicate.com/account/api-tokens"
        )

    headers = {
        "Authorization": f"Token {api_key}",
        "Content-Type": "application/json",
    }

    payload = {
        "version": "6c83f78b5e42b7585ac6b0b743a4f5d78f4a2d0d",  # flux-pro latest
        "input": {
            "prompt": prompt,
            "negative_prompt": negative,
            "aspect_ratio": aspect_ratio,
            "output_format": "png",
            "num_outputs": 1,
        },
    }

    print(f"Requesting generation... ", end="", flush=True)
    response = requests.post(REPLICATE_API_URL, json=payload, headers=headers, timeout=30)
    response.raise_for_status()
    result = response.json()
    prediction_id = result["id"]
    print(f"(ID: {prediction_id[:8]}...)")

    # Poll for completion
    max_polls = 120
    for poll_count in range(max_polls):
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
                url = status["output"][0]
                print(f"✓ Generated: {url}")
                return url
            raise RuntimeError("Generation succeeded but no output URL returned")

        elif status["status"] == "failed":
            raise RuntimeError(f"Generation failed: {status.get('error')}")

        elif status["status"] == "canceled":
            raise RuntimeError("Generation was canceled")

        if (poll_count + 1) % 12 == 0:
            elapsed = (poll_count + 1) * 5
            print(f"  Still processing... ({elapsed}s elapsed)")

    raise RuntimeError(f"Generation timed out after {max_polls * 5} seconds")

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python replicate_gen.py 'your prompt here'")
        sys.exit(1)

    prompt = " ".join(sys.argv[1:])
    url = generate_image(prompt)
    print(url)
