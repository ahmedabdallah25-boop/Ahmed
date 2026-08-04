# One-time setup (~10 minutes)

Everything in this pipeline runs itself **except one thing**: Google only allows edits to your
videos with credentials you personally authorize. This page mints that key once; after that,
every fix and every monitor run is automatic.

## Step 1 — Google Cloud project (3 min)

1. Go to https://console.cloud.google.com → create a project (any name, e.g. `finance-decoded`).
2. **APIs & Services → Library** → search **YouTube Data API v3** → Enable.

## Step 2 — API key, for monitoring (1 min)

1. **APIs & Services → Credentials → Create credentials → API key.**
2. Copy it — this becomes the `YT_API_KEY` secret. (Public read-only data; low risk.)

## Step 3 — OAuth client, for editing your videos (3 min)

1. **APIs & Services → OAuth consent screen** → External → fill the two required fields →
   add your own Google account under **Test users**. (No verification needed — only you use it.)
2. **Credentials → Create credentials → OAuth client ID → Desktop app.** Copy the client ID
   and client secret.

## Step 4 — Mint your refresh token (2 min, on your own computer)

**This step cannot be done from a Claude Code session** — it needs a browser, and the OAuth
redirect goes to `localhost` on whatever machine runs the script. Run it on your own computer.

```bash
pip install google-auth-oauthlib
python automation/get_refresh_token.py
```

A browser opens → sign in → approve. **If Google shows a channel chooser, pick the channel you
actually mean.** The token is bound to that choice and cannot be repointed afterwards.

If the machine you are on has no browser (SSH, a server), use the manual flow instead — it prints
a URL you can open anywhere, and you paste back the address bar you land on:

```bash
python automation/get_refresh_token.py --manual
```

The script then asks YouTube which channel you just authorised, prints it, and only then prints
the secrets — naming the right ones for that channel. If it does not recognise the channel it
refuses to print the token.

## Step 5 — Add the GitHub secrets (1 min)

Repo → **Settings → Secrets and variables → Actions → New repository secret**.

`YT_API_KEY` (Step 2) is shared. The OAuth credentials are **per channel** and must not collide —
overwriting one channel's set silently repoints every workflow that channel owns:

| Channel | Client ID | Client secret | Refresh token |
|---|---|---|---|
| Finance % Decoded | `new1` | `new2` | `new3` |
| HELD BY FAITH | `HBF_CLIENT_ID` | `HBF_CLIENT_SECRET` | `HBF_REFRESH_TOKEN` |

The `new1`/`new2`/`new3` names are historical and deliberately left alone — every workflow in
`.github/workflows/` already reads them, and Part 15 and the daily upload path depend on them.
`get_refresh_token.py` prints whichever set matches the channel you authorised.

> **A refresh token is bound to two things**: the channel picked at consent, *and* the OAuth
> client that issued it. A new client ID paired with an old refresh token fails with
> `invalid_grant`. One Google account owning both channels still needs two separate tokens.

## Step 6 — Fire it

1. (Recommended) Paste your real series-playlist URL into `playlist_url` in
   `automation/config.json` — grab it from your channel's Playlists tab. The current link on
   your videos (`...list=PLKLKzR1QgFHE`) looks truncated/broken.
2. Repo → **Actions → "Apply video fix pack" → Run workflow** (tick *fix_playlists* if you did #1).
   This updates the title, description, and tags on Part 12, posts the engagement comment,
   and optionally repairs the playlist link on all 12 videos.
3. **Actions → "Monitor Part 12 performance"** runs every 6 hours automatically and prints a
   WAIT / PASS / GRAY / DEAD verdict per the 72-hour rule.

## The two clicks the API cannot do

- **Pin the comment**: YouTube's API has no pin endpoint. Studio → Comments → ⋮ → Pin. One click.
- **Channel About playlist link**: channel-level setting. Studio → Customization. One paste.

## Safety notes

- Secrets live only in GitHub Actions secrets — never commit them to the repo.
- The refresh token grants edit access to your channel. Revoke it any time at
  https://myaccount.google.com/permissions.
