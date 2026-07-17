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

```bash
pip install google-auth-oauthlib
python automation/get_refresh_token.py
```

A browser opens → sign in with the Google account that owns **Finance % Decoded** → approve.
The script prints your `YT_REFRESH_TOKEN`.

## Step 5 — Add the four GitHub secrets (1 min)

Repo → **Settings → Secrets and variables → Actions → New repository secret**, four times:

| Secret | From |
|---|---|
| `YT_API_KEY` | Step 2 |
| `YT_CLIENT_ID` | Step 3 |
| `YT_CLIENT_SECRET` | Step 3 |
| `YT_REFRESH_TOKEN` | Step 4 |

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
