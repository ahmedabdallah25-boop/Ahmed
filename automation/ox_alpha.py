#!/usr/bin/env python3
"""Run a prompt against Ox Alpha, the stealth model on OpenRouter.

    python automation/ox_alpha.py --check
    python automation/ox_alpha.py --prompt "Summarise channel-reset.md in 5 lines"
    python automation/ox_alpha.py --prompt-file next-slate.md --max-tokens 2000
    cat script.txt | python automation/ox_alpha.py

Ox Alpha has no downloadable weights. It is served only through OpenRouter under
the id `stealth/ox-alpha` by a provider that has stayed anonymous for the preview,
so there is nothing to `ollama pull` — "running" it means calling the API.

Two things have to be true before this works:

  1. OPENROUTER_API_KEY is set. Nothing here ever prints it.
  2. openrouter.ai is reachable. A sandbox with an egress allowlist blocks it by
     default, and the failure looks like a hang or a 403 CONNECT rather than an
     HTTP error from OpenRouter.

--check tests both and says which one is missing, without spending a token.

Two cautions, because this repo is public. The preview provider retains prompts
and completions, and anything printed here lands in a world-readable Actions log.
Send it nothing you would not publish.

Exit 0 = the call succeeded (or --check found everything in place).
Exit 1 = something is missing or the API refused, with the fix printed.
Exit 2 = the model itself is gone; see MODEL_ID below.
"""
import argparse
import json
import os
import sys
import urllib.error
import urllib.request

# The free preview opened 2026-08-20 and was announced as one week, so this id is
# expected to stop resolving around 2026-08-27. --check reports that as exit 2
# rather than pretending the key is at fault.
MODEL_ID = "stealth/ox-alpha"
API = "https://openrouter.ai/api/v1"
CONTEXT_TOKENS = 1_048_576
MAX_COMPLETION_TOKENS = 131_072

OUT = []


def say(line=""):
    print(line)
    OUT.append(line)


def summarize():
    """Mirror everything printed into the Actions job summary, if we are in one."""
    path = os.environ.get("GITHUB_STEP_SUMMARY")
    if not path:
        return
    with open(path, "a") as f:
        f.write("```\n" + "\n".join(OUT) + "\n```\n")


def request(path, key=None, payload=None, timeout=600):
    """One OpenRouter call. Returns (status, parsed body or raw text).

    Network failures are raised as OSError so the caller can tell "the sandbox
    blocked the host" apart from "OpenRouter said no".
    """
    headers = {"Content-Type": "application/json"}
    if key:
        headers["Authorization"] = f"Bearer {key}"
        # Optional attribution headers. Only the repo name, never a secret.
        headers["X-Title"] = "Ahmed channel ops"
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(API + path, data=data, headers=headers,
                                 method="POST" if data else "GET")
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status, json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")
        try:
            return e.code, json.loads(body)
        except json.JSONDecodeError:
            return e.code, body


def api_error(status, body):
    """OpenRouter's error message, or a description of the status if it sent none."""
    if isinstance(body, dict):
        err = body.get("error")
        if isinstance(err, dict) and err.get("message"):
            return err["message"]
        if isinstance(err, str):
            return err
    return f"HTTP {status}"


def explain(status, body):
    """Turn a refusal into the specific thing to go and fix."""
    known = {
        401: "OPENROUTER_API_KEY is set but OpenRouter rejected it. Mint a fresh "
             "key at openrouter.ai/keys and update the secret.",
        402: "The account is out of credits. Ox Alpha is free during the preview, "
             "so this usually means the key is scoped to a paid model instead.",
        403: "OpenRouter refused the request. If the body is empty, suspect the "
             "sandbox's egress proxy rather than OpenRouter.",
        404: f"{MODEL_ID} did not resolve. The preview has most likely ended — "
             "check openrouter.ai/models for the successor id.",
        429: "Rate limited. The free preview is shared, so retry in a minute.",
    }
    say(f"  {api_error(status, body)}")
    if status in known:
        say(f"  {known[status]}")


def check(key, model, timeout):
    """Say whether a prompt would get through, without spending a token."""
    say("Ox Alpha setup check")
    say()

    say(f"  OPENROUTER_API_KEY   {'SET' if key else 'MISSING'}")
    if not key:
        say("    Set it as a repo secret named OPENROUTER_API_KEY, or export it "
            "locally. Get one at openrouter.ai/keys.")

    try:
        status, body = request("/models", timeout=timeout)
    except OSError as e:
        say(f"  openrouter.ai        UNREACHABLE ({e})")
        say("    The host is blocked by this environment's egress policy. Add "
            "openrouter.ai to the environment's network allowlist, or run this "
            "through the GitHub Actions workflow instead, where egress is open.")
        summarize()
        return 1

    if status != 200:
        say(f"  openrouter.ai        HTTP {status}")
        explain(status, body)
        summarize()
        return 1
    say("  openrouter.ai        reachable")

    ids = {m.get("id") for m in body.get("data", [])}
    if model in ids:
        say(f"  {model}     listed")
    else:
        say(f"  {model}     NOT LISTED")
        say("    The one-week free preview has ended or the id moved. Pick the "
            "current id from openrouter.ai/models and pass it with --model.")
        summarize()
        return 2

    say()
    if key:
        say("Ready. Run a prompt with --prompt or --prompt-file.")
        summarize()
        return 0
    say("Everything but the key is in place.")
    summarize()
    return 1


def run(key, prompt, args):
    payload = {
        "model": args.model,
        "messages": ([{"role": "system", "content": args.system}] if args.system else [])
                    + [{"role": "user", "content": prompt}],
        "max_tokens": args.max_tokens,
        "temperature": args.temperature,
    }

    try:
        status, body = request("/chat/completions", key=key, payload=payload,
                               timeout=args.timeout)
    except OSError as e:
        say(f"Could not reach openrouter.ai: {e}")
        say("Run --check for which of the two blockers this is.")
        summarize()
        return 1

    if status != 200:
        say(f"OpenRouter returned HTTP {status}.")
        explain(status, body)
        summarize()
        return 2 if status == 404 else 1

    if args.json:
        say(json.dumps(body, indent=2))
        summarize()
        return 0

    choice = (body.get("choices") or [{}])[0]
    message = choice.get("message") or {}

    if args.show_reasoning and message.get("reasoning"):
        say("--- reasoning ---")
        say(message["reasoning"])
        say("--- answer ---")

    say(message.get("content") or "(the model returned an empty completion)")

    usage = body.get("usage") or {}
    if usage:
        say()
        say(f"[{args.model} | {usage.get('prompt_tokens', '?')} in, "
            f"{usage.get('completion_tokens', '?')} out | "
            f"finish: {choice.get('finish_reason', '?')}]")
    summarize()
    return 0


def main():
    p = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    p.add_argument("--check", action="store_true",
                   help="test the key and the model listing, then exit")
    p.add_argument("--prompt", help="the prompt text")
    p.add_argument("--prompt-file", help="read the prompt from this file")
    p.add_argument("--system", help="optional system prompt")
    p.add_argument("--model", default=MODEL_ID,
                   help=f"OpenRouter model id (default {MODEL_ID})")
    p.add_argument("--max-tokens", type=int, default=4096,
                   help=f"completion cap (model allows up to {MAX_COMPLETION_TOKENS})")
    p.add_argument("--temperature", type=float, default=0.2)
    p.add_argument("--timeout", type=int, default=600,
                   help="seconds to wait; it is a reasoning model, so allow plenty")
    p.add_argument("--show-reasoning", action="store_true")
    p.add_argument("--json", action="store_true", help="print the raw response")
    args = p.parse_args()

    key = os.environ.get("OPENROUTER_API_KEY", "").strip()

    if args.check:
        return check(key, args.model, args.timeout)

    if args.prompt_file:
        prompt = open(args.prompt_file).read()
    elif args.prompt:
        prompt = args.prompt
    elif not sys.stdin.isatty():
        prompt = sys.stdin.read()
    else:
        p.error("give a prompt with --prompt, --prompt-file, or on stdin "
                "(or use --check)")

    if not prompt.strip():
        say("The prompt is empty; nothing to send.")
        summarize()
        return 1

    if not key:
        say("OPENROUTER_API_KEY is not set, so there is nothing to authenticate with.")
        say("Set it as a repo secret named OPENROUTER_API_KEY, or export it locally.")
        summarize()
        return 1

    if args.max_tokens > MAX_COMPLETION_TOKENS:
        say(f"--max-tokens capped at the model's limit of {MAX_COMPLETION_TOKENS}.")
        args.max_tokens = MAX_COMPLETION_TOKENS

    return run(key, prompt, args)


if __name__ == "__main__":
    sys.exit(main())
