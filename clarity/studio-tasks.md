# Clarity: the fix as Studio tasks

Generated from `clarity/packaging-fix.json` on 2026-09-15. Every item here is already
committed as config and will apply itself the moment `CIQ_REFRESH_TOKEN` works again —
`clarity-autopilot.yml` checks daily. This file exists so none of it has to wait for that.

**Do these in order. The first one is the only one that is urgent.**

## 0. Re-mint the token (10 minutes, and everything else becomes automatic)

Open `automation/authorize.html` on a laptop. Paste the same client id and secret already
stored in `CIQ_CLIENT_ID` and `CIQ_CLIENT_SECRET` — a refresh token is bound to the client that
issued it, so a different app's values produce a token that fails the same way. Sign in with the
account that owns the channel and **pick Clarity in the Quran at Google's chooser**; the page
refuses a token for the wrong channel. Replace the `CIQ_REFRESH_TOKEN` repository secret with what
it gives you, then run *CLARITY IN THE QURAN - 1. Check setup* to confirm.

If it dies again inside a week, the OAuth consent screen is still in **Testing**, where Google
expires every refresh token after 7 days. Publishing the app to **Production** is the permanent
fix. Nothing below needs doing by hand once this works.

## 1. Retitles (13 videos)

Paste the new title over the old one in Studio. Descriptions are not touched by any of these.

**`StCW3ERkWwc`** — https://studio.youtube.com/video/StCW3ERkWwc/edit  
from: `🛑The Quran Verse That Actually Stops Anxiety`  
to:   `What the Quran Actually Says About Anxiety`  
why:  A word-for-word transposition of the reference channel's Bible title, down to the ALL-CAPS 'ACTUALLY' and a leading 🛑 emoji.

**`QOwWWwiRn_Q`** — https://studio.youtube.com/video/QOwWWwiRn_Q/edit  
from: `What the Quran ACTUALLY Says About Depression (it's Not a Faith Failure)`  
to:   `What the Quran Actually Says About Depression (It's Not a Faith Failure)`  
why:  Right frame already.

**`_KqQIpiuBsg`** — https://studio.youtube.com/video/_KqQIpiuBsg/edit  
from: `Kun Fa-Yakun Explained: Every Promise Allah Makes in the Quran`  
to:   `Kun Fa-Yakun Explained: What "Be, and It Is" Actually Means`  
why:  19 views.

**`sbFXFoL1-5A`** — https://studio.youtube.com/video/sbFXFoL1-5A/edit  
from: `Every Jinn Verse in the Quran Explained (And Why Ruqyah Healers Get It Wrong)`  
to:   `What the Quran Actually Says About Jinn (And What Ruqyah Healers Get Wrong)`  
why:  62 views.

**`PUPdFpvEA04`** — https://studio.youtube.com/video/PUPdFpvEA04/edit  
from: `Surah Al-Isra 23: Honoring Parents Is Decreed, Not Requested`  
to:   `Surah Al-Isra 23 Explained: Honoring Parents Is Decreed, Not Requested`  
why:  36 views on a 31:29 upload.

**`yHwtIuWMe_g`** — https://studio.youtube.com/video/yHwtIuWMe_g/edit  
from: `What the Quran Actually Says About Anger: The Two Words Explained`  
to:   `Ghadab vs Ghayz: The Two Arabic Words for Anger in the Quran`  
why:  Direct cannibalisation.

**`XMOKUXMdFIo`** — https://studio.youtube.com/video/XMOKUXMdFIo/edit  
from: `The Quran Word for Swallowing Anger That Cost a Prophet His Sight`  
to:   `Kazm Explained: The Quran's Word for Swallowing Anger`  
why:  44 views, and the third anger video.

**`do0upX074Is`** — https://studio.youtube.com/video/do0upX074Is/edit  
from: `Is Allah Late? What "Ajal" and "Waqt" Actually Mean in Arabic | Word Study 01`  
to:   `Ajal and Waqt Explained: Why the Quran Never Says Allah Is Late`  
why:  The ' | Word Study 01' suffix is internal bookkeeping in the most valuable characters on the page.

**`PlshkqAOKfk`** — https://studio.youtube.com/video/PlshkqAOKfk/edit  
from: `Why the Quran Never Calls Sadness a Sin: Huzn Explained | Word Study 02`  
to:   `Huzn Explained: The Quran Never Calls Sadness a Sin`  
why:  25 views on the channel's longest upload (36:23).

**`Fwvpcy-6zL0`** — https://studio.youtube.com/video/Fwvpcy-6zL0/edit  
from: `What "Sabr" Actually Means in Arabic: A Grip, Not a Wait | Word Study 03.`  
to:   `Sabr Explained: It Means a Grip, Not a Wait`  
why:  Suffix removed along with its stray trailing period, sabr front-loaded, and the reversal kept — it is the best line in the set.

**`QAKZDwfGHUM`** — https://studio.youtube.com/video/QAKZDwfGHUM/edit  
from: `Surah Al-Qalam: The Garden Story Most People Read Wrong`  
to:   `Surah Al-Qalam Explained: The Brothers Who Lost a Garden Overnight`  
why:  23 views.

**`qRlxSJ99ZVw`** — https://studio.youtube.com/video/qRlxSJ99ZVw/edit  
from: `Every Word Shaytan Speaks in the Quran, Explained`  
to:   `What Shaytan Actually Says in the Quran (His Exact Words)`  
why:  48 views.

**`iH5ZzHOSQeo`** — https://studio.youtube.com/video/iH5ZzHOSQeo/edit  
from: `Every Woman in the Quran Explained: Why Only One Has a Name`  
to:   `Maryam Is the Only Woman the Quran Names by Name. Here Is Why.`  
why:  10 views, the channel's weakest upload.

## 2. Tags

Studio puts tags under Show more. The exact lists are in `clarity/packaging-fix.json` —
`set_packaging[].tags` for the videos above and `set_tags[].tags` for the rest. The two that have
never had any tags at all are **`cROgb0utEKs`** (97 views) and **`3vUgLKyo-0g`** (31), and the
channel's best video **`5Fb1iERyIhs`** (2,400 views) is also untagged — do that one first.

## 3. Playlists

Eight September uploads sit in no playlist. Create one new list and add the rest:

- **What the Quran Says About Your Emotions** — cjtKWsFZbcg, 5Fb1iERyIhs, StCW3ERkWwc, QOwWWwiRn_Q, IEgctgKEjEU
- **Stories of the Prophets in the Quran** — _stswAi-79k, r-9UaBtOy98, sbFXFoL1-5A, QAKZDwfGHUM, qRlxSJ99ZVw, iH5ZzHOSQeo
- **Money and Provision in the Quran** — GjztcxZGQTI, NOg4pWbPSCc
- **Questions Muslims Actually Ask** — cROgb0utEKs, QNlRJcyY4LU, 3vUgLKyo-0g, _KqQIpiuBsg, PUPdFpvEA04
- **One Arabic Word at a Time: Quran Word Studies** — yHwtIuWMe_g, do0upX074Is, Fwvpcy-6zL0, XMOKUXMdFIo, PlshkqAOKfk

Then add a section shelf for each on the channel home page, in the order in
`clarity/layout.json` (the word-study shelf goes second).

## 4. Channel description

It currently advertises "Verse-by-verse studies — Surah Al-Kahf, Al-Mulk, Ya-Sin, Ar-Ra'd,
Al-Fatihah". Four of those five have no upload behind them. The replacement text is in
`clarity/packaging-fix.json` under `channel.description` (951 characters, against YouTube's 1000
cap).

## 5. The thing none of the above will do

Retitling a settled catalogue is hygiene, not growth — a metadata edit does not itself
trigger re-promotion, measured at +0 views over 21.7 hours on channel 1, and these uploads run at
0.2–2.1 views/day. The growth lever is the anchored weekly series: search demand for
`surah al kahf` runs at 13.4x on Fridays, four Fridays out of four, with Thursday already at 1.9x.
Six Al-Kahf episodes, 17–22 minutes, published Thursdays. See `clarity/growth-playbook.md` and
`clarity/reference-benchmark.md`.
