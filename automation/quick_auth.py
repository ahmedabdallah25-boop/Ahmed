#!/usr/bin/env python3
"""Device-flow authorization bridge — the fastest legitimate path to letting
Claude (or any automation) edit the channel.

Flow: run this script with YT_CLIENT_ID / YT_CLIENT_SECRET set → it prints a
google.com/device link and a short code → the channel owner opens the link on
their phone, signs in, approves → the script receives and prints the refresh
token. Total owner effort: one link, one code, one tap. Stdlib only.

    export YT_CLIENT_ID=...  YT_CLIENT_SECRET=...
    python automation/quick_auth.py
"""
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

DEVICE_URL = "https://oauth2.googleapis.com/device/code"
TOKEN_URL = "https://oauth2.googleapis.com/token"
# force-ssl covers videos.update + commentThreads.insert; plain youtube scope is
# the fallback (covers videos.update only) if device flow rejects force-ssl.
SCOPE_SETS = [
    "https://www.googleapis.com/auth/youtube.force-ssl",
    "https://www.googleapis.com/auth/youtube",
]


def post(url: str, data: dict) -> dict:
    body = urllib.parse.urlencode(data).encode()
    req = urllib.request.Request(url, data=body, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.load(resp)
    except urllib.error.HTTPError as e:
        return json.loads(e.read().decode() or "{}")


def main():
    client_id = os.environ.get("YT_CLIENT_ID")
    client_secret = os.environ.get("YT_CLIENT_SECRET")
    if not (client_id and client_secret):
        sys.exit("Set YT_CLIENT_ID and YT_CLIENT_SECRET first (SETUP.md step 3).")

    dev = {}
    scope_used = None
    for scope in SCOPE_SETS:
        dev = post(DEVICE_URL, {"client_id": client_id, "scope": scope})
        if "device_code" in dev:
            scope_used = scope
            break
        print(f"scope rejected ({dev.get('error', 'unknown')}): {scope}")
    if not scope_used:
        sys.exit("Device flow unavailable for this client — use get_refresh_token.py "
                 "on a machine with a browser instead.")

    print("\n=== ACTION FOR THE CHANNEL OWNER (expires in "
          f"{dev.get('expires_in', 1800) // 60} min) ===")
    print(f"1. Open:  {dev.get('verification_url', 'https://www.google.com/device')}")
    print(f"2. Enter code:  {dev['user_code']}")
    print("3. Sign in with the account that owns Finance % Decoded and approve.\n")

    interval = int(dev.get("interval", 5))
    deadline = time.time() + int(dev.get("expires_in", 1800))
    while time.time() < deadline:
        time.sleep(interval)
        tok = post(TOKEN_URL, {
            "client_id": client_id,
            "client_secret": client_secret,
            "device_code": dev["device_code"],
            "grant_type": "urn:ietf:params:oauth:grant-type:device_code",
        })
        err = tok.get("error")
        if err == "authorization_pending":
            continue
        if err == "slow_down":
            interval += 5
            continue
        if err:
            sys.exit(f"Authorization failed: {err} — {tok.get('error_description', '')}")
        refresh = tok.get("refresh_token")
        if not refresh:
            sys.exit(f"No refresh token in response: {tok}")
        print("Authorized ✔")
        print(f"YT_REFRESH_TOKEN={refresh}")
        out = os.environ.get("TOKEN_OUT")
        if out:
            with open(out, "w") as f:
                f.write(refresh + "\n")
            print(f"(also written to {out})")
        return
    sys.exit("Code expired before approval — run again.")


if __name__ == "__main__":
    main()
