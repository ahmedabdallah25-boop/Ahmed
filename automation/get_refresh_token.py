#!/usr/bin/env python3
"""One-time, run on YOUR OWN computer (it opens a browser for Google sign-in).

Prints the YT_REFRESH_TOKEN to add as a GitHub secret. See SETUP.md.

  pip install google-auth-oauthlib
  python get_refresh_token.py
"""
from google_auth_oauthlib.flow import InstalledAppFlow

SCOPES = ["https://www.googleapis.com/auth/youtube.force-ssl"]

client_id = input("Paste your OAuth client ID: ").strip()
client_secret = input("Paste your OAuth client secret: ").strip()

flow = InstalledAppFlow.from_client_config(
    {
        "installed": {
            "client_id": client_id,
            "client_secret": client_secret,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "redirect_uris": ["http://localhost"],
        }
    },
    SCOPES,
)
creds = flow.run_local_server(port=0, access_type="offline", prompt="consent")

print("\nAdd these three GitHub secrets (repo → Settings → Secrets and variables → Actions):")
print(f"  YT_CLIENT_ID     = {client_id}")
print(f"  YT_CLIENT_SECRET = {client_secret}")
print(f"  YT_REFRESH_TOKEN = {creds.refresh_token}")
