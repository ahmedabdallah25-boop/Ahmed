#!/usr/bin/env python3
"""Prove heldbyfaith_packaging.fix_channel_meta cannot damage the channel.

    python automation/test_heldbyfaith_channel_meta.py

This exists because the write it performs is a fetch-then-mutate on
brandingSettings for a channel that carries someone's account of their cancer
diagnosis, and heldbyfaith/channel-diagnosis.md has refused to ship untested
write code against it since August. No network: call() is replaced with a stub
that records what would have been sent.

Five things are pinned:

  1. The description write moves exactly ONE line — the "start here" URL — and
     every other byte of the owner's prose survives.
  2. A description edited in Studio is written back byte-identical and the run
     fails, so the edit survives and the drift is visible. The unrelated keyword
     repair still applies, which is how the retitle path already treats drift.
  3. Multi-word keywords go out quoted, which is the live bug being repaired.
  4. --dry-run sends no PUT at all.
  5. The PUT carries the whole brandingSettings object back, so fields this
     script does not manage are not dropped by the update.
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import heldbyfaith_packaging as hp  # noqa: E402

CFG = hp.CFG
LIVE_DESC = CFG["channel"]["current_description"]
WANT_DESC = CFG["channel"]["description"]

# brandingSettings as YouTube returns it, including a key this script does not
# manage — it must survive the round trip.
def branding(desc, keywords="muslim cancer story pancreatic", country="AE"):
    return {
        "channel": {
            "title": "HELD BY FAITH",
            "description": desc,
            "keywords": keywords,
            "country": country,
            "unsubscribedTrailer": "GbBwlPGlYos",
        },
        "image": {"bannerExternalUrl": "https://example.invalid/banner"},
    }


class Stub:
    def __init__(self, live_desc):
        self.live = branding(live_desc)
        self.puts = []

    def __call__(self, token, method, path, params=None, body=None):
        if method == "GET" and path == "channels":
            return {"items": [{"id": CFG["expect_channel_id"],
                               "brandingSettings": json.loads(json.dumps(self.live))}]}
        if method == "PUT" and path == "channels":
            self.puts.append(body)
            return body
        raise AssertionError(f"unexpected call: {method} {path}")


def run(live_desc, dry_run=False):
    stub = Stub(live_desc)
    hp.call = stub
    hp.OUT.clear()
    hp.ERRORS.clear()
    written = hp.fix_channel_meta("fake-token", dry_run)
    return stub, written, "\n".join(hp.OUT)


def main():
    failures = []

    def check(cond, why):
        if not cond:
            failures.append(why)

    # 1. The happy path: one line moves, the prose does not.
    stub, written, out = run(LIVE_DESC)
    check(written == 1, "the write should report one change")
    check(len(stub.puts) == 1, "exactly one PUT expected")
    sent = stub.puts[0]["brandingSettings"]["channel"]["description"]
    check(sent == WANT_DESC, "the description sent is not the config's target")

    live_lines, sent_lines = LIVE_DESC.splitlines(), sent.splitlines()
    check(len(live_lines) == len(sent_lines), "line count changed")
    differing = [(a, b) for a, b in zip(live_lines, sent_lines) if a != b]
    check(len(differing) == 1,
          f"expected exactly 1 changed line, got {len(differing)}: {differing}")
    if len(differing) == 1:
        was, now = differing[0]
        check("GFKRpV_mhWg" in was, f"the removed line should hold the dead link: {was!r}")
        check("X4z5Ij0SQgI" in now, f"the new line should hold the live link: {now!r}")
    for sentence in ("I stood in front of the Kaaba",
                     "I am not filming this to relive the pain",
                     "does not have to sit in it alone",
                     "heldbyfaithjourney@gmail.com"):
        check(sentence in sent, f"the owner's own words were altered: {sentence!r} is gone")

    # 3. Keywords: phrases must go out quoted, single words bare.
    kw = stub.puts[0]["brandingSettings"]["channel"]["keywords"]
    check('"muslim cancer story"' in kw, "multi-word keywords must be quoted")
    check('"held by faith"' in kw,
          "the channel's own name must survive as one phrase, not three keywords")
    check(" sabr" in f" {kw}" and '"sabr"' not in kw,
          "single words must go out unquoted")
    check(kw.count('"') == sum(1 for k in CFG["channel"]["keywords"] if " " in k) * 2,
          "every phrase and only a phrase should be quoted")

    # 5. Unmanaged fields survive the fetch-then-mutate.
    ch = stub.puts[0]["brandingSettings"]["channel"]
    check(ch.get("unsubscribedTrailer") == "GbBwlPGlYos",
          "unsubscribedTrailer was dropped by the update")
    check(stub.puts[0]["brandingSettings"].get("image", {}).get("bannerExternalUrl"),
          "the banner was dropped by the update")

    # 2. Drift. The point of the guard is that the owner's Studio edit survives —
    # not that the whole run stops. channels.update replaces the resource, so the
    # PUT necessarily carries a description; it must be the LIVE one, untouched.
    # The keyword repair is unrelated and still applies, matching how retitle()
    # already handles a drifted title: skip that one thing, fail the run, write
    # the rest.
    edited = LIVE_DESC.replace("Subscribe and walk it with me.",
                               "Subscribe and walk it with me. Chemo round 3 starts Monday.")
    stub2, written2, out2 = run(edited)
    check(any("drifted" in e for e in hp.ERRORS),
          "a drifted description must fail the run, not pass quietly")
    check("SKIP channel description" in out2, "the skip must be visible in the log")
    check(len(stub2.puts) == 1, "the unrelated keyword repair should still go out")
    sent2 = stub2.puts[0]["brandingSettings"]["channel"]["description"]
    check(sent2 == edited,
          "the drifted description must go back byte-identical; the owner's edit "
          "is not ours to lose")
    check(sent2 != WANT_DESC,
          "the config's target overwrote a description it was told not to touch")
    check("Chemo round 3 starts Monday." in sent2,
          "the Studio edit did not survive the round trip")
    check('"held by faith"' in stub2.puts[0]["brandingSettings"]["channel"]["keywords"],
          "the keyword repair should not be blocked by an unrelated drift")

    # 4. Dry run writes nothing.
    stub3, written3, out3 = run(LIVE_DESC, dry_run=True)
    check(written3 == 0, "dry run must report no writes")
    check(not stub3.puts, "dry run must send no PUT")
    check("[dry-run] not written" in out3, "dry run must say so")
    check("X4z5Ij0SQgI" in out3, "dry run must still show what it would change")

    # Idempotence: running against an already-fixed channel is a no-op.
    stub4, written4, out4 = run(WANT_DESC)
    check("X4z5Ij0SQgI" not in out4.replace(WANT_DESC, ""),
          "an already-correct description should not be re-proposed")

    print(out)
    print()
    if failures:
        for f in failures:
            print(f"FAIL: {f}")
        sys.exit(1)
    print("OK — description repoints one line, drift is refused, phrases stay quoted,")
    print("     dry run writes nothing, unmanaged branding fields survive.")


if __name__ == "__main__":
    main()
