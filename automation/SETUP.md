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

## Step 4 — Mint your refresh token (2 min, in your browser)

**No install, no terminal.** Open **[`automation/authorize.html`](authorize.html)** in any browser
— double-click the file, or open it from the repo on your machine — and follow the three steps on
the page. Paste in the client ID and secret from Step 3, click through Google's sign-in, paste
back the address you land on, and it hands you the finished secrets with copy buttons.

**If Google shows a channel chooser, pick the channel you actually mean.** The token is bound to
that choice and cannot be repointed afterwards.

The page asks YouTube which channel you just authorised and shows it before anything else. If it
does not recognise the channel it refuses to display the token at all.

> **Why this is not a button in GitHub Actions.** It is the one step that cannot be automated:
> Google issues a refresh token only after a human signs in through a browser. And this repo is
> **public**, which makes Actions logs world-readable — a workflow that printed a refresh token
> would publish channel edit access to anyone who looked. So the token is minted on your machine
> and pasted straight into a secret; it never passes through CI.

Everything runs locally and nothing is transmitted anywhere except Google. Close the tab when
you are done — the page saves nothing.

<details>
<summary>Terminal fallback, if your browser blocks the cross-origin call</summary>

```bash
pip install google-auth-oauthlib
python automation/get_refresh_token.py            # opens a browser on this machine
python automation/get_refresh_token.py --manual   # no browser here: prints a URL, paste back
```

Identical behaviour, including the channel check and the refusal to print an unrecognised
channel's token.
</details>

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
`authorize.html` shows whichever set matches the channel you authorised.

> **A refresh token is bound to two things**: the channel picked at consent, *and* the OAuth
> client that issued it. A new client ID paired with an old refresh token fails with
> `invalid_grant`. One Google account owning both channels still needs two separate tokens.

## Channel 2 — HELD BY FAITH

Same three steps, one extra convenience: **Actions → "HELD BY FAITH - 1. Check setup" → Run
workflow** tells you exactly where you stand. It reports whether each secret is set (never a
value), and if all three are, which channel they actually own. Green means channel 2 is live.

The order that involves the least work:

1. **Actions → "HELD BY FAITH - 1. Check setup"** — one click. It names what is missing.
2. If it asks for `HBF_REFRESH_TOKEN`, open `automation/authorize.html`, authorise, and paste the
   value into the secret of that name.
3. Run the check again. It should now print `READY` and the channel title.
4. **Actions → "HELD BY FAITH - 2. Fix packaging"** with *dry run* ticked (the default) to preview
   every change, then again with it unticked to apply.

"HELD BY FAITH - monitor" needs none of that. It reads public data only, and takes the first
credential it finds: `YT_API_KEY`, then channel 2's trio, then channel 1's — so it works today,
before channel 2 has any secrets of its own.

> **Checked 2026-08-16 by running step 1:** `HBF_CLIENT_ID`, `HBF_CLIENT_SECRET` and
> `HBF_REFRESH_TOKEN` all read as empty in Actions, and so does `YT_API_KEY`. If you added the
> client ID and secret under different names, a workflow cannot see them — it can only read the
> exact names above. Re-add them under these names, and make sure they are **repository**
> secrets, not Environment or Dependabot secrets.

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
