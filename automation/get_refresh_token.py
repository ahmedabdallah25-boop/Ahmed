#!/usr/bin/env python3
"""One-time, run on YOUR OWN computer (Google sign-in needs your browser).

Mints a refresh token and tells you WHICH CHANNEL it belongs to.

  pip install google-auth-oauthlib
  python get_refresh_token.py            # opens a browser on this machine
  python get_refresh_token.py --manual   # no browser here: print a URL, paste back

This repo runs two channels, and a refresh token is bound to whichever channel is
picked at Google's chooser. Pick the wrong one and you get a token that is
perfectly valid and writes to the wrong channel — which is exactly how a pass on
2026-08-04 spent three rounds discovering the credentials pointed at Finance %
Decoded. So this script authorises, immediately asks YouTube "who am I?", and
prints the channel before you copy anything. If it does not recognise the
channel it refuses to print the token at all.

It also names the correct GitHub secret per channel, because the two sets must
not collide: overwriting one channel's secrets silently repoints every workflow
that channel owns.
"""
import json
import sys
import urllib.error
import urllib.request

from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ["https://www.googleapis.com/auth/youtube.force-ssl"]

# channel id -> (human name, (client_id_secret, client_secret_secret, refresh_secret))
# Keeping these distinct is what `expect_channel_id` in reset.json then enforces
# at write time. See heldbyfaith/channel-diagnosis.md.
CHANNELS = {
    "UCVOoFJkRiOdJsWnewt8HJkw": (
        "Finance % Decoded (@Financeundoubtlydecoded)",
        ("new1", "new2", "new3"),
    ),
    "UCh0tKIGR5Ns3Wvoai__txdg": (
        "HELD BY FAITH (@HeldByFaithJourney)",
        ("HBF_CLIENT_ID", "HBF_CLIENT_SECRET", "HBF_REFRESH_TOKEN"),
    ),
}


def whoami(access_token):
    """Ask YouTube which channel this token actually authorised.

    Raw HTTPS on purpose: minting a token needs one pip package, and it should
    stay that way. google-api-python-client is not required here.
    """
    req = urllib.request.Request(
        "https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true",
        headers={"Authorization": f"Bearer {access_token}"},
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            items = json.load(r).get("items", [])
    except urllib.error.HTTPError as e:
        body = e.read().decode(errors="replace")[:400]
        sys.exit(f"\nAuthorised, but the channel check failed: {e}\n{body}")
    if not items:
        sys.exit("\nAuthorised, but this Google account owns no YouTube channel.")
    return items[0]["id"], items[0]["snippet"].get("title", "?")


def main():
    manual = "--manual" in sys.argv

    client_id = input("Paste your OAuth client ID: ").strip()
    client_secret = input("Paste your OAuth client secret: ").strip()

    cfg = {
        "installed": {
            "client_id": client_id,
            "client_secret": client_secret,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "redirect_uris": ["http://localhost"],
        }
    }

    print("\nSign in with the Google account that owns the channel you want.")
    print("If Google shows a channel chooser, PICK THE RIGHT CHANNEL — that")
    print("choice is what the token is bound to and it cannot be changed later.\n")

    if manual:
        # Loopback with nothing listening: Google redirects to a localhost URL
        # that fails to load, leaving the code in the address bar. Lets the
        # browser live on a completely different machine.
        flow = InstalledAppFlow.from_client_config(
            cfg, SCOPES, redirect_uri="http://localhost:8765/")
        auth_url, _ = flow.authorization_url(access_type="offline", prompt="consent")
        print("Open this URL in any browser:\n")
        print(f"  {auth_url}\n")
        print("After you approve, the browser lands on a localhost page that")
        print("FAILS TO LOAD. That is expected — the code is in the address bar.")
        print("Copy the whole address and paste it below.\n")
        redirected = input("Paste the full localhost URL: ").strip()
        flow.fetch_token(authorization_response=redirected)
        creds = flow.credentials
    else:
        flow = InstalledAppFlow.from_client_config(cfg, SCOPES)
        creds = flow.run_local_server(port=0, access_type="offline", prompt="consent")

    if not creds.refresh_token:
        sys.exit("\nNo refresh token was returned. Google issues one only on first "
                 "consent — revoke the app at https://myaccount.google.com/permissions "
                 "and run this again.")

    channel_id, title = whoami(creds.token)

    print("\n" + "=" * 70)
    print(f"  Authorised as: {title}")
    print(f"  Channel ID:    {channel_id}")
    print("=" * 70)

    known = CHANNELS.get(channel_id)
    if not known:
        print("\n  ! This is not a channel this repo manages. Expected one of:")
        for cid, (name, _) in CHANNELS.items():
            print(f"      {cid}  {name}")
        print("\n  ! Not printing the token — sort the channel out first.")
        print("  ! Rerun and pick the right channel at the chooser.")
        return 1

    name, (id_key, secret_key, token_key) = known
    print(f"\n  This token controls: {name}")
    print("\n  Add these three GitHub secrets (repo → Settings → Secrets and")
    print("  variables → Actions). Use EXACTLY these names — the other channel")
    print("  uses different ones, and overwriting them repoints its automation:\n")
    print(f"    {id_key:<18} = {client_id}")
    print(f"    {secret_key:<18} = {client_secret}")
    print(f"    {token_key:<18} = {creds.refresh_token}")
    print("\n  Treat all three as passwords. Do not paste them into chat, issues or")
    print("  commits — the refresh token grants edit access to the channel.")
    print("  Revoke any time at https://myaccount.google.com/permissions")
    return 0


if __name__ == "__main__":
    sys.exit(main())
