#!/usr/bin/env python3
"""
Verify that expanded prompts from tokenized JSON match original text file.
Spot-check first 5, last 5, and middle scenes.
"""
import json
import re

original_file = "/root/.claude/uploads/cc55cd87-6c0c-57e1-8a6a-a6dbfa6637e0/d473ceaf-clarityimageprompts.txt"
tokenized_file = "/home/user/Ahmed/clarity/prompts-tokenized.json"

# Load original text
with open(original_file, 'r') as f:
    original_text = f.read()

# Load tokenized JSON
with open(tokenized_file, 'r') as f:
    data = json.load(f)

shared_style = data['meta']['shared_style']
shared_negative = data['meta']['shared_negative']

# Extract all original prompts using regex
pattern = r'\[\s*(\d+)/180\s*\]\s+(\S+)\n\s+scene\s+(\S+)\s+·\s+(line|wash)\s+pass.*?cue\s+([\d:]+).*?VO:\s+([^\n]+)\n.*?SAVE AS\s+([^\n]+)\n\nPROMPT\n(.*?)\n\nNEGATIVE\n(.*?)(?=\n\.\.|$)'

matches = re.findall(pattern, original_text, re.DOTALL)

# Build dict of original prompts by filename
original_prompts = {}
for match in matches:
    idx, full_id, scene_id, pass_type, cue_time, vo, filename, prompt_text, negative_text = match
    filename = filename.strip()
    prompt_text = prompt_text.strip()
    negative_text = negative_text.strip()
    original_prompts[filename] = (prompt_text, negative_text)

print(f"Loaded {len(original_prompts)} original prompts")
print(f"Loaded {len(data['scenes'])} scenes from tokenized JSON")

# Test spot checks: scenes 0, 1, 4 (first 5), then middle, then last 5
test_indices = [0, 1, 4, len(data['scenes'])//2 - 1, len(data['scenes'])-5, len(data['scenes'])-4, len(data['scenes'])-3, len(data['scenes'])-2, len(data['scenes'])-1]
test_indices = sorted(set(i for i in test_indices if 0 <= i < len(data['scenes'])))

all_pass = True

for idx in test_indices:
    scene = data['scenes'][idx]

    for pass_info in scene['passes']:
        # Reconstruct full prompt
        if pass_info['prefix']:
            expanded_prompt = (
                f"{scene['description']} {pass_info['prefix']}{shared_style}"
            ).strip()
        else:
            expanded_prompt = (
                f"{scene['description']} {shared_style}"
            ).strip()
        expanded_negative = shared_negative

        # Look up in original
        filename = pass_info['filename']
        if filename in original_prompts:
            orig_prompt, orig_negative = original_prompts[filename]

            # Normalize for comparison (strip extra whitespace)
            norm_expanded = ' '.join(expanded_prompt.split())
            norm_orig = ' '.join(orig_prompt.split())

            if norm_expanded == norm_orig:
                print(f"✓ {filename}: PROMPT matches")
            else:
                print(f"✗ {filename}: PROMPT MISMATCH")
                print(f"  Expanded length: {len(norm_expanded)}, Original length: {len(norm_orig)}")
                # Show first difference
                for i, (e, o) in enumerate(zip(norm_expanded, norm_orig)):
                    if e != o:
                        print(f"  First diff at char {i}: '{e}' vs '{o}'")
                        print(f"  Context: ...{norm_expanded[max(0,i-30):i+30]}...")
                        break
                all_pass = False

            # Negative should always match
            norm_exp_neg = ' '.join(expanded_negative.split())
            norm_orig_neg = ' '.join(orig_negative.split())

            if norm_exp_neg == norm_orig_neg:
                print(f"✓ {filename}: NEGATIVE matches")
            else:
                print(f"✗ {filename}: NEGATIVE MISMATCH")
                all_pass = False
        else:
            print(f"✗ {filename}: NOT FOUND in original prompts")
            all_pass = False

print("\n" + "="*60)
if all_pass:
    print("✓ ALL SPOT CHECKS PASSED")
else:
    print("✗ SOME SPOT CHECKS FAILED")
print("="*60)
