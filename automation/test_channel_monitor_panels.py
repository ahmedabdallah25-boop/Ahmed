#!/usr/bin/env python3
"""Exercise channel_monitor's comparative panels against a recorded channel.

    python automation/test_channel_monitor_panels.py

The fixture is HELD BY FAITH as it actually stood at 2026-09-12 04:49 UTC, taken
from monitor run 34674010065. It is here because that run is the one the old
report got wrong: it printed "Vertical is still outperforming landscape 543x.
Publish vertical." and nothing else, on a channel whose per-Short reach had
halved in a week and whose 24,364 views had produced 61 subscribers.

Stdlib only, no network: channel_monitor.get is replaced with a function that
serves the fixture, so this runs anywhere the monitor does.
"""
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import channel_monitor as cm  # noqa: E402

NOW = datetime(2026, 9, 12, 4, 49, 0, tzinfo=timezone.utc)

# (id, title, hours old, seconds, views, likes)
FIXTURE = [
    ("mCv54v1dG2o", "My non Muslim nurse learned to say Bismillah for me #shorts", 5, 76, 497, 16),
    ("vOpUFt2OmNY", "1,400 strangers have made dua for me #shorts", 12, 70, 630, 3),
    ("sheCYtjL1mY", "The 9 days between the scan and the result #shorts", 55, 66, 140, 7),
    ("h5o2IGSr7bA", "I told my boss I had cancer. He closed the folder #shorts", 58, 79, 622, 5),
    ("jgRQ30kkTsE", "41 people messaged me. By month 4 there were 3 #shorts", 61, 71, 597, 9),
    ("s1rnsCXQ2KY", "The hardest line in my will was not about money #shorts", 64, 72, 590, 5),
    ("WvtBbK2hT4s", "It takes me an hour to eat a plate of rice #shorts", 67, 79, 819, 16),
    ("gw321COXZLc", "Somebody paid my rent and never told me who #shorts", 70, 84, 809, 13),
    ("FkGpHaa9BSg", "I did not fast a single day of Ramadan #shorts", 73, 81, 697, 18),
    ("WyllBA5ITk0", "Nobody warns you about the paperwork #shorts", 80, 83, 907, 3),
    ("MUCKHnkzO2w", "I asked 5 cancer patients what they would do #shorts", 86, 76, 917, 6),
    ("Zb4yT2_NEQE", "The first drive after surgery #shorts", 91, 81, 966, 13),
    ("VfwyMPoHUNE", "22 chairs, and nobody asks what you've got #shorts", 96, 73, 987, 15),
    ("R5tAjjCyZOo", "Sabr does not mean what I thought it meant #shorts", 101, 92, 927, 20),
    ("T4K2m2ymx9E", "Things I overheard in a cancer ward #shorts", 106, 71, 977, 14),
    ("ByURn4TF-6c", "A letter to myself on the second night #shorts", 111, 67, 826, 17),
    ("OYoZDKfRlrs", "I said I'm fine for a year and people believed me #shorts", 116, 68, 1137, 15),
    ("5dotgfdske4", "The things I googled the week I was diagnosed #shorts", 121, 69, 1026, 16),
    ("eX8ODb5N-_w", "What cancer took, and what it gave back #shorts", 126, 80, 1250, 21),
    ("ghNRXaA3emA", "I asked Allah for a long life and got cancer 4 days later #shorts", 136, 80, 343, 6),
    ("rEPpk3qSbDE", "My mum answered my cancer news with 7 words #shorts", 141, 86, 750, 16),
    ("lRL2JbPP91M", "The morning I stood up to pray again #shorts", 146, 82, 1146, 17),
    ("jnX_MNilJx8", "The wristband in my drawer fixes my worst days #shorts", 156, 84, 1715, 23),
    ("02FYgSmUXP4", "At 3am I asked Allah what the pain was for #shorts", 161, 80, 1203, 25),
    ("u0eABWSAMR8", "I couldn't stand up to pray for 6 weeks #shorts", 166, 73, 1164, 29),
    ("3vqTYClJCmY", "Please stop saying this to people who are sick #shorts", 171, 73, 1247, 27),
    ("X4z5Ij0SQgI", "I survived. He didn't. Nobody prepares you for that #shorts", 176, 74, 1235, 35),
    ("GbBwlPGlYos", "They said the cancer was gone #shorts", 181, 56, 1359, 20),
    ("14mGEhEieZY", "Part 3: The Phone Call Where They Told Me I Had Cancer", 1440, 172, 1, 0),
    ("1TGtRIpgwt4", "Part 2: Waiting 7 Days for Cancer Results", 1560, 96, 13, 2),
    ("9CQZ-uS3nuY", "Part 5: How I Told My Family I Had Cancer", 1584, 133, 13, 1),
    ("9hR1vXH5PVE", "Part 4: Why I Felt Nothing When The Doctor Said Cancer", 1632, 107, 9, 1),
    ("xmCDlKXU694", "Part 6: 10 Hours of Whipple Surgery", 1704, 285, 0, 0),
    ("GFKRpV_mhWg", "Part 1: I Made Dua at the Kaaba", 1728, 118, 4, 0),
]


def fake_get(path, **params):
    if path == "channels":
        return {"items": [{
            "id": "UCh0tKIGR5Ns3Wvoai__txdg",
            "snippet": {"title": "HELD BY FAITH"},
            "statistics": {"subscriberCount": "61", "videoCount": "34",
                           "viewCount": "24364"},
            "contentDetails": {"relatedPlaylists": {"uploads": "UUh0tKIGR5Ns3Wvoai__txdg"}},
        }]}
    if path == "playlistItems":
        return {"items": [{"contentDetails": {"videoId": v[0]}} for v in FIXTURE]}
    if path == "videos":
        want = set(params["id"].split(","))
        return {"items": [{
            "id": vid,
            "snippet": {"title": title,
                        "publishedAt": (NOW - timedelta(hours=hrs))
                        .strftime("%Y-%m-%dT%H:%M:%SZ")},
            "statistics": {"viewCount": str(views), "likeCount": str(likes)},
            "contentDetails": {"duration": f"PT{secs // 60}M{secs % 60}S"},
        } for vid, title, hrs, secs, views, likes in FIXTURE if vid in want]}
    raise AssertionError(f"unexpected API path: {path}")


def run():
    cm.get = fake_get
    cm.OUT.clear()
    sys.argv = ["channel_monitor.py", "--channel", "heldbyfaith"]
    cm.main()
    return "\n".join(cm.OUT)


# A second channel, because clarity-monitor.yml runs this same script daily and
# the new panels must not crash it. Clarity is the opposite shape to HELD BY
# FAITH in every way that matters here: long-form, weekly, no landscape_video_ids
# in channels.json, and too few settled Shorts to form two halves.
CLARITY = [
    ("ciq0000000a", "What Surah Al-Kahf Actually Says About Time", 30, 1420, 900, 40),
    ("ciq0000000b", "The Verse Everyone Quotes Out of Context", 200, 1180, 640, 28),
    ("ciq0000000c", "Why Musa Struck the Rock Twice", 400, 1660, 410, 19),
    ("ciq0000000d", "A Short One #shorts", 700, 55, 120, 4),
]


def fake_get_clarity(path, **params):
    if path == "channels":
        return {"items": [{
            "id": "UC0eBu0ZXcF20pTAG3lUnPXA",
            "snippet": {"title": "Clarity in the Quran"},
            "statistics": {"subscriberCount": "41", "videoCount": "4",
                           "viewCount": "2561"},
            "contentDetails": {"relatedPlaylists": {"uploads": "UU0eBu0ZXcF20pTAG3lUnPXA"}},
        }]}
    if path == "playlistItems":
        return {"items": [{"contentDetails": {"videoId": v[0]}} for v in CLARITY]}
    if path == "videos":
        want = set(params["id"].split(","))
        return {"items": [{
            "id": vid,
            "snippet": {"title": title,
                        "publishedAt": (NOW - timedelta(hours=hrs))
                        .strftime("%Y-%m-%dT%H:%M:%SZ")},
            "statistics": {"viewCount": str(views), "likeCount": str(likes)},
            "contentDetails": {"duration": f"PT{secs // 60}M{secs % 60}S"},
        } for vid, title, hrs, secs, views, likes in CLARITY if vid in want]}
    raise AssertionError(f"unexpected API path: {path}")


def run_clarity():
    cm.get = fake_get_clarity
    cm.OUT.clear()
    sys.argv = ["channel_monitor.py", "--channel", "clarity"]
    cm.main()
    return "\n".join(cm.OUT)


def main():
    out = run()
    failures = []

    def want(substr, why):
        if substr not in out:
            failures.append(f"missing {substr!r} — {why}")

    # Cadence. 25 of the 28 Shorts fall inside the trailing week; the other three
    # are 171-181h old and correctly excluded.
    want("Cadence: 25 uploads in the last 7 days (3.6/day)",
         "the upload rate is the thing the old report could not see")
    want("tightest gap 3h · widest 43h",
         "a 43h hole inside a 3h-cadence run is worth seeing")
    want("! Above 2.0/day",
         "3.6/day into one niche audience has to be called out")

    # Reach trend. Two exclusions carry the result, and both are the point of the
    # panel. The sub-72h Shorts are still climbing, so the apparent collapse in the
    # last three days is not judgeable. And the three July verticals sitting at
    # 9-13 views are outside the 14-day window, so a dormant back catalogue cannot
    # pose as the "older" half — with them in, this printed +14% instead of -18%.
    want("Reach trend (settled Shorts, last 14d): newer 10 average 937 views "
         "· older 10 average 1141 views (-18%)",
         "an 18% week-on-week decline is the real number")
    if "! Per-Short reach is down" in out:
        failures.append("saturation warning fired on an 18% drop; the bar is 25% "
                        "and 18% is not yet a trend")
    want("Inside normal week-to-week variation",
         "18% has to be reported as inconclusive, not as a finding")

    # Cohort outliers. One video failed against its own age peers by 3x.
    want("- ghNRXaA3emA   343 views vs 1142 median (30%)",
         "343 against an 1142 same-age median is a real miss, invisible in a "
         "lifetime-views ranking where it sits mid-table")
    # sheCYtjL1mY is worse on the face of it (140 views) but is 55h old, so it is
    # deliberately NOT flagged. Judging it would break the 72-hour rule.
    if "- sheCYtjL1mY" in out:
        failures.append("sheCYtjL1mY flagged at 55h old; nothing under 72h may be "
                        "judged, however bad it looks")

    # And the winners must NOT be flagged.
    for good in ("jnX_MNilJx8", "GbBwlPGlYos", "X4z5Ij0SQgI"):
        if f"     - {good}" in out:
            failures.append(f"{good} flagged as underperforming; it is a top performer")

    # Conversion, the headline the channel is actually failing on.
    want("Conversion: 24364 lifetime views -> 61 subscribers (0.25%, one per 399 views)",
         "24K views buying 61 subscribers is the real constraint")
    want("! Under 0.5%", "the conversion floor has to trip here")

    # Like rate must not round a 1.3% down to a bare 1%.
    want("(1.3% like rate)", "0dp rounding hid every rate between 0.5% and 1.5%")

    # The old panels must survive.
    want("Format split:", "the landscape/vertical split is still true and still useful")
    want("[WAIT]", "the 72-hour rule is not optional")

    # Second channel: the panels must degrade quietly, not crash or invent a trend.
    other = run_clarity()
    if "Traceback" in other:
        failures.append("clarity fixture crashed the monitor")
    if "Reach trend" in other:
        failures.append("reach trend printed on 1 settled Short; it needs 8")
    if "Underperforming against" in other:
        failures.append("cohort outliers printed with fewer than 4 age peers")
    if "Format split" in other:
        failures.append("format split printed for a channel with no "
                        "landscape_video_ids declared")
    if "Conversion: 2561 lifetime views -> 41 subscribers (1.60%" not in other:
        failures.append("conversion should still report, and 1.6% is above the floor")
    if "! Under 0.5%" in other:
        failures.append("conversion floor tripped at 1.6%")

    print(out)
    print()
    print("--- second channel (clarity), panels must stay quiet ---")
    print(other)
    print()
    if failures:
        for f in failures:
            print(f"FAIL: {f}")
        sys.exit(1)
    print(f"OK — {len(FIXTURE)} videos, all panel assertions passed.")


if __name__ == "__main__":
    main()
