#!/usr/bin/env python3
"""Replicate image generation integration."""
import os
import replicate

def generate_image(
    prompt: str,
    model: str = "black-forest-labs/flux-1-schnell",
    width: int = 1024,
    height: int = 1024,
    **kwargs
) -> str:
    """
    Generate an image using Replicate.

    Args:
        prompt: Image description
        model: Model ID (default: FLUX.1 Schnell - fastest/cheapest)
        width: Image width in pixels
        height: Image height in pixels
        **kwargs: Additional model parameters (num_outputs, guidance_scale, etc.)

    Returns:
        URL to generated image
    """
    api_token = os.getenv("REPLICATE_API_TOKEN")
    if not api_token:
        raise ValueError("REPLICATE_API_TOKEN environment variable not set")

    client = replicate.Client(api_token=api_token)

    input_params = {
        "prompt": prompt,
        "width": width,
        "height": height,
        **kwargs
    }

    output = client.run(model, input=input_params)

    # Output is typically a list of URLs
    if isinstance(output, list) and len(output) > 0:
        return output[0]
    return output


def generate_batch(prompts: list[str], model: str = "black-forest-labs/flux-1-schnell") -> list[str]:
    """Generate multiple images."""
    return [generate_image(prompt, model) for prompt in prompts]


if __name__ == "__main__":
    # Test
    url = generate_image("a serene mountain landscape at sunset")
    print(f"Generated image: {url}")
