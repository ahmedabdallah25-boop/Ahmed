#!/usr/bin/env python3
"""
Expand prompts-tokenized.json to full Replicate batch payload.
Usage: python3 prompts-expand.py [--scenes S002,S003,S006] [--output batch.json]
"""
import json
import argparse

def expand_prompts(json_file, scene_ids=None, output_file=None):
    """
    Load tokenized JSON and expand to full prompts for Replicate API.

    Args:
        json_file: path to prompts-tokenized.json
        scene_ids: list of scene IDs to expand (None = all)
        output_file: optional output file (else prints to stdout)
    """
    with open(json_file, 'r') as f:
        data = json.load(f)

    shared_style = data['meta']['shared_style']
    shared_negative = data['meta']['shared_negative']

    batch = {
        "meta": {
            "total_prompts": 0,
            "model": data['meta']['model']
        },
        "prompts": []
    }

    for scene in data['scenes']:
        # Filter by scene_ids if provided
        if scene_ids and scene['id'] not in scene_ids:
            continue

        for pass_info in scene['passes']:
            # Format: description + [optional prefix before STYLE] + shared_style
            if pass_info['prefix']:
                full_prompt = (
                    f"{scene['description']} {pass_info['prefix']}{shared_style}"
                ).strip()
            else:
                full_prompt = (
                    f"{scene['description']} {shared_style}"
                ).strip()

            prompt_obj = {
                "scene": scene['id'],
                "pass": pass_info['pass'],
                "seed_group": scene['seed_group'],
                "prompt": full_prompt,
                "negative_prompt": shared_negative,
                "image_size": "1920x1080",
                "num_outputs": 1,
                "filename": pass_info['filename']
            }

            batch['prompts'].append(prompt_obj)
            batch['meta']['total_prompts'] += 1

    if output_file:
        with open(output_file, 'w') as f:
            json.dump(batch, f, indent=2)
        print(f"Saved {batch['meta']['total_prompts']} prompts to {output_file}")
    else:
        print(json.dumps(batch, indent=2))

    return batch

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Expand tokenized prompts to full Replicate batch')
    parser.add_argument('json_file', help='Path to prompts-tokenized.json')
    parser.add_argument('--scenes', type=str, default=None,
                       help='Comma-separated scene IDs to expand (e.g., S002,S003,S006)')
    parser.add_argument('--output', type=str, default=None,
                       help='Output file (default: stdout)')
    args = parser.parse_args()

    scene_list = args.scenes.split(',') if args.scenes else None
    expand_prompts(args.json_file, scene_ids=scene_list, output_file=args.output)
