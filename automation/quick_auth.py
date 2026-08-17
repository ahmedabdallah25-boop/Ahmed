#!/usr/bin/env python3
"""Mint a refresh token when you cannot open a file on your own machine.

`authorize.html` is the normal route and needs no terminal. This one exists for
the case where the channel owner is on a phone with no checkout — an assistant
session (or any shell with outbound HTTPS) runs the flow, and the owner only
taps Approve.

Two modes. Try device first; it is the one that needs no copy-paste back.

  # 1. Device flow — owner opens a short link, types an 8-char code, approves.
  export YT_CLIENT_ID=... YT_CLIENT_SECRET=...
  python automation/quick_auth.py --mode device

  # 2. Fallback, works with ANY OAuth client type. Print a consent link:
  python automation/quick_auth.py --mode url
  # owner approves, lands on a localhost page that fails to load, sends back
  # the address bar; then:
  python automation/quick_auth.py --mode exchange --redirect-url "http://localhost:8765/?code=..."

Device flow only works for clients Google classes as limited-input ("TVs and
Limited Input devices", and in practice Desktop app clients). A Web application
client is rejected outright — that is what --mode url is for.

Whichever mode ran, the token is checked against the channel it actually owns
before it is shown, and refuses to print for a channel this repo does not
manage. A refresh token is bound to the channel picked at the consent screen,
so a valid token pointing at the wrong channel is the failure mode that costs
hours.

Writes nothing into the repo. Set TOKEN_OUT to a path OUTSIDE the working tree
if you want it on disk; this repo is public and a committed token is a
published one.
"""
import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

DEVICE_URL = "https://oauth2.googleapis.com/device/code"
TOKEN_URL = "https://oauth2.googleapis.com/token"
AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
REDIRECT = "http://localhost:8765/"
SCOPE = "https://www.googleapis.com/auth/youtube.force-ssl"

CHANNELS = {
    "UCVOoFJkRiOdJsWnewt8HJkw": ("Finance % Decoded (@Financeundoubtlydecoded)",
                                 ("new1", "new2", "new3")),
    "UCh0tKIGR5Ns3Wvoai__txdg": ("HELD BY FAITH (@HeldByFaithJourney)",
                                 ("HBF_CLIENT_ID", "HBF_CLIENT_SECRET", "HBF_REFRESH_TOKEN")),
}


def post(url: str, data: dict) -> dict:
    body = urllib.parse.urlencode(data).encode()
    req = urllib.request.Request(url, data=body, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.load(resp)
    except urllib.error.HTTPError as e:
        return json.loads(e.read().decode() or "{}")


def creds():
    cid = os.environ.get("YT_CLIENT_ID")
    sec = os.environ.get("YT_CLIENT_SECRET")
    if not (cid and sec):
        sys.exit("Set YT_CLIENT_ID and YT_CLIENT_SECRET first (SETUP.md step 3).")
    return cid, sec


def whoami(access_token):
    req = urllib.request.Request(
        "https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true",
        headers={"Authorization": f"Bearer {access_token}"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            items = json.load(r).get("items", [])
    except urllib.error.HTTPError as e:
        sys.exit(f"Authorized, but the channel check failed: HTTP {e.code}")
    if not items:
        sys.exit("Authorized, but this Google account owns no YouTube channel.")
    return items[0]["id"], items[0]["snippet"].get("title", "?")


def deliver(tok, client_id, expect=None):
    """Verify which channel this token owns, then report it."""
    refresh = tok.get("refresh_token")
    if not refresh:
        sys.exit("No refresh token returned. Google issues one only on first consent — "
                 "revoke at https://myaccount.google.com/permissions and retry.")
    channel_id, title = whoami(tok["access_token"])

    print("\n" + "=" * 66)
    print(f"  Authorized as: {title}")
    print(f"  Channel ID:    {channel_id}")
    print("=" * 66)

    known = CHANNELS.get(channel_id)
    if not known:
        print("\n  ! Not a channel this repo manages. Expected one of:")
        for cid, (name, _) in CHANNELS.items():
            print(f"      {cid}  {name}")
        print("\n  ! Not printing the token. Rerun and pick the right channel.")
        return 1
    if expect and channel_id != expect:
        print(f"\n  ! WRONG CHANNEL: expected {expect}.")
        print("  ! Not printing the token. Rerun and pick the right channel at")
        print("  ! Google's chooser, signing out of the other account first.")
        return 1

    name, (id_key, secret_key, token_key) = known
    print(f"\n  This token controls: {name}")
    print(f"\n  Set these three repository secrets, using EXACTLY these names:\n")
    print(f"    {id_key}")
    print(f"    {secret_key}")
    print(f"    {token_key}")

    out = os.environ.get("TOKEN_OUT")
    if out:
        with open(out, "w") as f:
            f.write(refresh + "\n")
        os.chmod(out, 0o600)
        print(f"\n  Refresh token written to {out} (not echoed here).")
        print("  Treat it as a password: it grants edit access to the channel.")
    else:
        print(f"\n  {token_key}={refresh}")
        print("\n  Treat this as a password. Do not commit it — this repo is public.")
    print("  Revoke any time at https://myaccount.google.com/permissions")
    return 0


def device(client_id, client_secret, expect):
    dev = post(DEVICE_URL, {"client_id": client_id, "scope": SCOPE})
    if "device_code" not in dev:
        err = dev.get("error", "unknown")
        print(f"Device flow unavailable for this client ({err}).")
        print("That usually means it is a Web application client. Use --mode url instead.")
        return 2

    print("\n=== ACTION FOR THE CHANNEL OWNER "
          f"(expires in {dev.get('expires_in', 1800) // 60} min) ===")
    print(f"  1. Open:       {dev.get('verification_url', 'https://www.google.com/device')}")
    print(f"  2. Enter code: {dev['user_code']}")
    print("  3. Sign in with the account that owns the channel, and if Google shows")
    print("     a channel chooser, PICK THE RIGHT ONE. Then approve.\n")
    sys.stdout.flush()

    interval = int(dev.get("interval", 5))
    deadline = time.time() + int(dev.get("expires_in", 1800))
    while time.time() < deadline:
        time.sleep(interval)
        tok = post(TOKEN_URL, {
            "client_id": client_id, "client_secret": client_secret,
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
        return deliver(tok, client_id, expect)
    sys.exit("Code expired before approval — run again.")


def consent_url(client_id):
    q = urllib.parse.urlencode({
        "client_id": client_id, "redirect_uri": REDIRECT, "response_type": "code",
        "scope": SCOPE, "access_type": "offline", "prompt": "consent",
    })
    print("\nOpen this link, sign in with the account that owns the channel, and approve.")
    print("If Google shows a channel chooser, PICK THE RIGHT CHANNEL.\n")
    print(f"  {AUTH_URL}?{q}\n")
    print("You will land on a localhost page that FAILS TO LOAD. That is expected —")
    print("the one-time code is in the address bar. Send back the whole address.")
    return 0


def exchange(client_id, client_secret, redirect_url, expect):
    try:
        code = urllib.parse.parse_qs(
            urllib.parse.urlparse(redirect_url).query).get("code", [None])[0]
    except ValueError:
        code = None
    if not code:
        code = redirect_url if redirect_url.startswith("4/") else None
    if not code:
        sys.exit("No authorization code found. Paste the whole localhost address, "
                 "e.g. http://localhost:8765/?code=4/0Ab...&scope=...")
    tok = post(TOKEN_URL, {
        "code": code, "client_id": client_id, "client_secret": client_secret,
        "redirect_uri": REDIRECT, "grant_type": "authorization_code",
    })
    if tok.get("error"):
        hint = {
            "invalid_grant": "Codes are single-use and expire in minutes — get a fresh one.",
            "redirect_uri_mismatch": "Add http://localhost:8765/ to the client's authorized "
                                     "redirect URIs, or use a Desktop app client.",
            "invalid_client": "Client ID and secret do not match.",
        }.get(tok["error"], tok.get("error_description", ""))
        sys.exit(f"Exchange failed: {tok['error']} — {hint}")
    return deliver(tok, client_id, expect)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--mode", choices=("device", "url", "exchange"), default="device")
    ap.add_argument("--redirect-url", help="the localhost address, for --mode exchange")
    ap.add_argument("--expect-channel", help="abort unless the token owns this channel id")
    args = ap.parse_args()

    client_id, client_secret = creds()
    if args.mode == "url":
        return consent_url(client_id)
    if args.mode == "exchange":
        if not args.redirect_url:
            sys.exit("--mode exchange needs --redirect-url")
        return exchange(client_id, client_secret, args.redirect_url, args.expect_channel)
    return device(client_id, client_secret, args.expect_channel)


if __name__ == "__main__":
    sys.exit(main())
