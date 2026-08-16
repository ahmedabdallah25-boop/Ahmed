#!/usr/bin/env python3
"""Say whether a channel's credentials are in place and which channel they drive.

    python automation/check_channel_auth.py --channel heldbyfaith
    python automation/check_channel_auth.py --channel finance

Read-only. Never prints a secret value — only whether each one is set, and what
YouTube says the token owns. Safe to run on a public repo, where Actions logs are
world-readable.

Exit 0 = ready to run the channel's workflows. Exit 1 = something is missing or
pointing at the wrong channel, with the fix printed.

The failure this exists to catch: an OAuth client ID and secret identify the
*application*, not a channel. A refresh token is bound to whichever channel was
picked at Google's consent screen, so a completely valid trio can authenticate as
the other channel. That is exactly what happened on 2026-08-04 — two read-only
inventory runs both came back as Finance % Decoded — and it is invisible until
something writes to the wrong channel.
"""
import argparse
import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request

CHANNELS = {
    "finance": {
        "name": "Finance % Decoded",
        "handle": "@Financeundoubtlydecoded",
        "channel_id": "UCVOoFJkRiOdJsWnewt8HJkw",
        "secrets": ("new1", "new2", "new3"),
    },
    "heldbyfaith": {
        "name": "HELD BY FAITH",
        "handle": "@HeldByFaithJourney",
        "channel_id": "UCh0tKIGR5Ns3Wvoai__txdg",
        "secrets": ("HBF_CLIENT_ID", "HBF_CLIENT_SECRET", "HBF_REFRESH_TOKEN"),
    },
}
BY_ID = {c["channel_id"]: c for c in CHANNELS.values()}

OUT = []


def say(line=""):
    print(line)
    OUT.append(line)


def summarize():
    path = os.environ.get("GITHUB_STEP_SUMMARY")
    if not path:
        return
    with open(path, "a") as f:
        f.write("```\n" + "\n".join(OUT) + "\n```\n")


def access_token(client_id, client_secret, refresh_token):
    """Trade the refresh token for a short-lived access token.

    Errors are reported by Google's error code only. The request body carries all
    three secrets, so nothing from it is ever echoed.
    """
    body = urllib.parse.urlencode({
        "client_id": client_id,
        "client_secret": client_secret,
        "refresh_token": refresh_token,
        "grant_type": "refresh_token",
    }).encode()
    try:
        with urllib.request.urlopen("https://oauth2.googleapis.com/token",
                                    data=body, timeout=30) as r:
            return json.load(r)["access_token"], None
    except urllib.error.HTTPError as e:
        try:
            payload = json.loads(e.read().decode() or "{}")
        except ValueError:
            payload = {}
        return None, payload.get("error", f"HTTP {e.code}")
    except urllib.error.URLError as e:
        return None, f"network error: {e.reason}"


def whoami(token):
    req = urllib.request.Request(
        "https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true",
        headers={"Authorization": f"Bearer {token}"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            items = json.load(r).get("items", [])
    except urllib.error.HTTPError as e:
        return None, None, f"HTTP {e.code}"
    if not items:
        return None, None, "this Google account owns no YouTube channel"
    return items[0]["id"], items[0]["snippet"].get("title", "?"), None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--channel", choices=sorted(CHANNELS), default="heldbyfaith")
    args = ap.parse_args()

    ch = CHANNELS[args.channel]
    id_key, secret_key, token_key = ch["secrets"]
    say(f"== {ch['name']} ({ch['handle']}) ==")
    say(f"   expected channel: {ch['channel_id']}")
    say()

    values = {k: os.environ.get(k, "") for k in ch["secrets"]}
    for k in ch["secrets"]:
        say(f"   [{'x' if values[k] else ' '}] {k:<18} {'set' if values[k] else 'MISSING'}")
    say(f"   [{'x' if os.environ.get('YT_API_KEY') else ' '}] {'YT_API_KEY':<18} "
        f"{'set' if os.environ.get('YT_API_KEY') else 'not set (optional — the monitor falls back to OAuth)'}")
    say()

    missing = [k for k in ch["secrets"] if not values[k]]
    if missing:
        say(f"   NOT READY — {len(missing)} secret(s) missing: {', '.join(missing)}")
        say()
        if len(missing) == 3:
            # The likeliest cause, given an OAuth client was created for this channel
            # on 2026-08-04: the values exist in Google Cloud but were never stored as
            # repository secrets, or were stored under names of someone's own choosing.
            # A workflow can only read the exact names below, so a secret called
            # anything else is invisible to it.
            say("   Nothing is set under these names. Two things this usually means:")
            say()
            say("     a) The client ID and secret exist in Google Cloud Console but were")
            say("        never added to GitHub. Repo -> Settings -> Secrets and variables")
            say("        -> Actions -> New repository secret.")
            say()
            say("     b) They WERE added, under different names. Check the list on that")
            say(f"        page. A workflow only sees the exact names {id_key},")
            say(f"        {secret_key} and {token_key} — anything else is")
            say("        invisible to it. Re-add them under these names (you cannot read")
            say("        an existing secret's value back, so copy it from Google Cloud).")
            say()
            say("   Make sure they are REPOSITORY secrets, not Environment or")
            say("   Dependabot secrets — those are not exposed to these workflows.")
            summarize()
            return 1
        if missing == [token_key]:
            say("   The client ID and secret are in place, so only the refresh token is left.")
            say("   That one needs a human browser sign-in — Google will not issue it any")
            say("   other way, and this repo is public, so a workflow must never print one.")
            say()
            say("   Open automation/authorize.html in your browser and follow the three steps.")
            say("   It runs entirely on your machine and hands you the value to paste in as")
            say(f"   the {token_key} secret.")
        else:
            say("   See automation/SETUP.md — steps 3 and 4 mint all three.")
        summarize()
        return 1

    say("   All three secrets are set. Asking YouTube which channel they own...")
    token, err = access_token(values[id_key], values[secret_key], values[token_key])
    if err:
        say(f"   NOT READY — Google rejected the refresh token: {err}")
        if err == "invalid_grant":
            say()
            say("   invalid_grant means one of three things:")
            say("     - the token was revoked at myaccount.google.com/permissions")
            say("     - it was minted with a DIFFERENT OAuth client than the one in")
            say(f"       {id_key}/{secret_key} (a token is bound to its issuing client)")
            say("     - the consent screen is in Testing mode and the 7-day token expiry hit")
            say()
            say("   Re-mint with automation/authorize.html using the same client ID and secret.")
        summarize()
        return 1

    got, title, err = whoami(token)
    if err:
        say(f"   NOT READY — channel lookup failed: {err}")
        summarize()
        return 1

    say(f"   authenticated as: {title} ({got})")
    say()
    if got == ch["channel_id"]:
        say(f"   READY — this trio drives {ch['name']} and nothing else.")
        say("   Next: run \"HELD BY FAITH - 2. Fix packaging\" with dry run left ticked to "
            "preview every change."
            if args.channel == "heldbyfaith" else "   The channel's workflows are good to go.")
        summarize()
        return 0

    other = BY_ID.get(got)
    say(f"   NOT READY — WRONG CHANNEL.")
    say(f"   {token_key} authenticates as {title} ({got}),")
    say(f"   but this channel is {ch['channel_id']}.")
    if other:
        say()
        say(f"   That is {other['name']}, whose own secrets are "
            f"{', '.join(other['secrets'])}.")
        say("   Nothing here will write until this is corrected — every write path")
        say("   checks the authenticated channel first and aborts on a mismatch.")
    say()
    say("   Fix: re-run automation/authorize.html and, at Google's channel chooser,")
    say(f"   pick {ch['name']}. Sign out of the other Google account first if the")
    say("   chooser does not appear.")
    summarize()
    return 1


if __name__ == "__main__":
    sys.exit(main())
