// Pulls the clips you generated in Google Flow down into this repo.
//
// Flow (labs.google/fx/tools/flow) has no public API and no bulk export — the
// only sanctioned way out is the per-clip download button, which is a lot of
// clicking for a 36-scene film like the Inflation short. This drives a real
// signed-in Chrome instead: it opens your Flow project, scrolls the whole grid
// so every clip mounts, reads the media URLs the page itself is playing, and
// fetches them with the session's own cookies.
//
// Two things this deliberately does NOT do:
//   * It does not log in for you. Google blocks scripted sign-in, so `--login`
//     opens a visible browser, you sign in by hand once, and the session is
//     kept in a local profile directory (gitignored) for every run after.
//   * It does not guess at Flow's markup unless you ask it to. The default
//     `net` mode only reads <video> sources and video/* responses, which are
//     the two things that cannot change without the site breaking. `--mode ui`
//     clicks the real download buttons — truer to what Flow serves, but it is
//     the part that will rot when the UI is redesigned, so the selectors are
//     flags rather than constants.
//
// Usage:
//   node scripts/flow-download.mjs --login
//   node scripts/flow-download.mjs <flow-project-url> [more urls...] [options]
//   node scripts/flow-download.mjs --from urls.txt
//
// Options:
//   --out DIR         where clips land            (default public/flow)
//   --prefix STR      filename prefix             (default none -> 01.mp4)
//   --pad N           digits in the number        (default 2)
//   --start N         first number to use         (default: after the manifest)
//   --limit N         stop after N new clips
//   --reverse         number oldest-first (Flow lists newest first)
//   --mode net|ui     how to find clips           (default net)
//   --from FILE       skip the browser, download URLs listed in FILE
//   --profile DIR     Chrome profile to reuse     (default .flow-profile)
//   --channel NAME    chrome | msedge | chromium  (default chrome, falls back)
//   --headless        run without a window (only works once signed in)
//   --scrolls N       max scroll rounds per project (default 40)
//   --timeout MS      page navigation timeout     (default 60000)
//   --force           re-download clips already in the manifest
//   --dry-run         list what would be fetched, write nothing
//   --verbose         log every URL considered
//   --ui-open SEL     [ui mode] the per-clip menu/download button
//   --ui-item TEXT    [ui mode] the menu entry to click (default Download)
//
// Downloads are recorded in <out>/flow-manifest.json, keyed by the clip's URL
// path, so re-running after generating more scenes only pulls the new ones.

import {existsSync, mkdirSync, readFileSync, statSync, unlinkSync, writeFileSync} from 'fs';
import {resolve, join} from 'path';
import {createInterface} from 'readline';
import {createHash} from 'crypto';

const VALUE_OPTS = new Set([
  '--out', '--prefix', '--pad', '--start', '--limit', '--mode', '--from',
  '--profile', '--channel', '--scrolls', '--timeout', '--ui-open', '--ui-item',
]);

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(name);
const opt = (name, fallback) => {
  const i = argv.indexOf(name);
  return i === -1 || i + 1 >= argv.length ? fallback : argv[i + 1];
};
const num = (name, fallback) => {
  const v = opt(name, null);
  if (v === null) return fallback;
  const n = Number(v);
  if (!Number.isFinite(n)) die(`${name} needs a number, got "${v}"`);
  return n;
};

// Everything that is neither a flag nor a flag's value is a project URL.
const projects = [];
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a.startsWith('--')) {
    if (VALUE_OPTS.has(a)) i++;
    continue;
  }
  projects.push(a);
}

const OUT = resolve(opt('--out', 'public/flow'));
const PREFIX = opt('--prefix', '');
const PAD = num('--pad', 2);
const LIMIT = num('--limit', Infinity);
const MODE = opt('--mode', 'net');
const FROM = opt('--from', null);
const PROFILE = resolve(opt('--profile', '.flow-profile'));
const CHANNEL = opt('--channel', 'chrome');
const HEADLESS = flag('--headless');
const SCROLLS = num('--scrolls', 40);
const TIMEOUT = num('--timeout', 60000);
const FORCE = flag('--force');
const DRY = flag('--dry-run');
const VERBOSE = flag('--verbose');
const REVERSE = flag('--reverse');
const LOGIN = flag('--login');
const UI_OPEN = opt(
  '--ui-open',
  'button[aria-label*="download" i], button[aria-label*="more" i], button[aria-label*="option" i]',
);
const UI_ITEM = opt('--ui-item', 'Download');

const MANIFEST = join(OUT, 'flow-manifest.json');
const FLOW_HOME = 'https://labs.google/fx/tools/flow';

// Extensions we are willing to write. Anything else is almost certainly a
// poster image or a tracking pixel that slipped through the filter.
const EXT_BY_TYPE = {
  'video/mp4': 'mp4',
  'video/webm': 'webm',
  'video/quicktime': 'mov',
  'video/x-m4v': 'm4v',
  'audio/mpeg': 'mp3',
  'audio/mp4': 'm4a',
};
const VIDEO_EXT = /\.(mp4|webm|mov|m4v)(?:$|[?#])/i;

function die(msg) {
  console.error(`flow-download: ${msg}`);
  process.exit(1);
}

if (MODE !== 'net' && MODE !== 'ui') die(`--mode must be net or ui, got "${MODE}"`);
if (flag('--help') || flag('-h') || (!LOGIN && !FROM && projects.length === 0)) {
  console.error(readFileSync(new URL(import.meta.url)).toString().split('\n')
    .filter((l) => l.startsWith('//')).map((l) => l.replace(/^\/\/ ?/, '')).join('\n'));
  process.exit(1);
}

// ---------------------------------------------------------------- manifest

function loadManifest() {
  if (!existsSync(MANIFEST)) return {version: 1, items: []};
  try {
    const m = JSON.parse(readFileSync(MANIFEST, 'utf8'));
    if (!Array.isArray(m.items)) throw new Error('no items array');
    return m;
  } catch (e) {
    die(`${MANIFEST} is not readable as a manifest (${e.message}). Move it aside or pass --out elsewhere.`);
  }
}

function saveManifest(m) {
  writeFileSync(MANIFEST, `${JSON.stringify(m, null, 2)}\n`);
}

// A Flow media URL is signed: the query string carries an expiry and changes
// on every page load, so it cannot identify a clip. The path can.
function keyOf(url) {
  if (url.startsWith('blob:')) return url;
  try {
    const u = new URL(url);
    return `${u.origin}${u.pathname}`;
  } catch {
    return url;
  }
}

function nextIndex(manifest) {
  const explicit = opt('--start', null);
  if (explicit !== null) return Number(explicit);
  let max = 0;
  for (const it of manifest.items) {
    // Only the run of digits immediately before the extension is the index —
    // stripping every non-digit would fold the "4" of ".mp4" into the number.
    const m = /(\d+)\.[A-Za-z0-9]+$/.exec(String(it.file));
    if (m) max = Math.max(max, Number(m[1]));
  }
  return max + 1;
}

const nameFor = (n, ext) => `${PREFIX}${String(n).padStart(PAD, '0')}.${ext}`;

function extFor(url, contentType) {
  const t = (contentType || '').split(';')[0].trim().toLowerCase();
  if (EXT_BY_TYPE[t]) return EXT_BY_TYPE[t];
  const m = VIDEO_EXT.exec(url || '');
  if (m) return m[1].toLowerCase();
  return 'mp4';
}

const mb = (bytes) => `${(bytes / 1048576).toFixed(1)} MB`;

// ---------------------------------------------------------------- browser

async function playwright() {
  try {
    return await import('playwright');
  } catch {
    die('playwright is not installed. From video/: npm install (or npm i -D playwright && npx playwright install chromium)');
  }
}

// Prefer the user's real Chrome: Google serves its "this browser may not be
// secure" wall to Playwright's bundled Chromium during sign-in, and a profile
// that cannot sign in is useless. Fall back only if no Chrome is installed.
async function launch({chromium}) {
  mkdirSync(PROFILE, {recursive: true});
  const opts = {
    headless: HEADLESS,
    viewport: {width: 1440, height: 900},
    acceptDownloads: true,
    args: ['--disable-blink-features=AutomationControlled'],
  };
  const channels = CHANNEL === 'chromium' ? [undefined] : [CHANNEL, 'chromium', undefined];
  let last;
  for (const channel of channels) {
    try {
      return await chromium.launchPersistentContext(PROFILE, channel ? {...opts, channel} : opts);
    } catch (e) {
      last = e;
      if (channel) console.error(`  (no "${channel}" browser here — trying the next one)`);
    }
  }
  die(`could not start a browser: ${last?.message}`);
}

const waitForEnter = () => new Promise((res) => {
  const rl = createInterface({input: process.stdin, output: process.stdout});
  rl.question('', () => {
    rl.close();
    res();
  });
});

// Flow renders nothing useful when signed out — it bounces to the account
// chooser or shows a sign-in card. Catch that early with a clear instruction
// rather than reporting "0 clips found".
async function assertSignedIn(page) {
  const url = page.url();
  if (/accounts\.google\.com|\/signin/.test(url)) {
    die('that session is signed out. Run: node scripts/flow-download.mjs --login');
  }
  const wall = await page.locator('text=/^\\s*Sign in\\b/i').first()
    .isVisible({timeout: 1500}).catch(() => false);
  if (wall) die('Flow is showing a sign-in wall. Run: node scripts/flow-download.mjs --login');
}

// Flow's grid is virtualised and lazy: a clip's <video> has no src until it has
// been near the viewport. Scroll the page and its tallest scrollable pane
// together until the height stops growing and no new <video> appears.
async function autoScroll(page, rounds) {
  let stable = 0;
  let seen = 0;
  for (let i = 0; i < rounds; i++) {
    const state = await page.evaluate(() => {
      const scrollables = [document.scrollingElement, ...document.querySelectorAll('*')]
        .filter((el) => el && el.scrollHeight - el.clientHeight > 200);
      const pane = scrollables.sort((a, b) => b.scrollHeight - a.scrollHeight)[0];
      if (pane) pane.scrollBy(0, pane.clientHeight * 0.9);
      window.scrollBy(0, window.innerHeight * 0.9);
      for (const v of document.querySelectorAll('video')) {
        if (!v.src && !v.currentSrc) v.load?.();
      }
      return {
        height: pane ? pane.scrollHeight : document.body.scrollHeight,
        videos: document.querySelectorAll('video').length,
      };
    });
    await page.waitForTimeout(700);
    if (state.videos === seen) stable++;
    else stable = 0;
    seen = state.videos;
    if (VERBOSE) console.error(`  scroll ${i + 1}: ${seen} <video> elements`);
    if (stable >= 3) break;
  }
  return seen;
}

// ---------------------------------------------------------------- collect

async function collectFromProject(context, url) {
  const found = new Map();
  const add = (u, source, contentType) => {
    if (!u || u.startsWith('data:')) return;
    const key = keyOf(u);
    if (found.has(key)) return;
    found.set(key, {url: u, source, contentType, project: url});
    if (VERBOSE) console.error(`  + [${source}] ${u.slice(0, 120)}`);
  };

  const page = await context.newPage();
  page.setDefaultTimeout(TIMEOUT);

  // Responses are the belt to the DOM's braces: a clip that unmounts after
  // scrolling past is gone from the DOM but was still fetched.
  page.on('response', (res) => {
    const type = (res.headers()['content-type'] || '').toLowerCase();
    if (type.startsWith('video/') || VIDEO_EXT.test(res.url())) add(res.url(), 'network', type);
  });

  console.error(`\nOpening ${url}`);
  await page.goto(url, {waitUntil: 'domcontentloaded', timeout: TIMEOUT});
  await assertSignedIn(page);
  await page.waitForTimeout(2500);

  const count = await autoScroll(page, SCROLLS);
  console.error(`  ${count} clip element(s) on the page`);

  for (const src of await page.$$eval('video, video source',
    (els) => els.map((e) => e.currentSrc || e.src).filter(Boolean))) {
    add(src, 'dom');
  }

  // Some builds keep the URL in state and only attach it on play, so sweep the
  // serialised DOM too — restricted to real video extensions so this cannot
  // start pulling in fonts or JSON.
  const html = await page.content();
  for (const m of html.matchAll(/https?:\/\/[^"'\\\s<>]+\.(?:mp4|webm|mov|m4v)(?:\?[^"'\\\s<>]*)?/gi)) {
    add(m[0].replace(/&amp;/g, '&'), 'html');
  }

  if ([...found.values()].length === 0 && /\.m3u8/.test(html)) {
    console.error('  ! this project streams HLS rather than serving whole files — try --mode ui');
  }

  return {page, found};
}

// Read a blob: URL back out of the page. Flow occasionally hands <video> a blob
// from a MediaSource, which no HTTP client outside the tab can fetch.
async function readBlob(page, url) {
  return page.evaluate(async (u) => {
    const res = await fetch(u);
    const buf = new Uint8Array(await res.arrayBuffer());
    let s = '';
    for (let i = 0; i < buf.length; i += 0x8000) {
      s += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
    }
    return {base64: btoa(s), type: res.headers.get('content-type') || 'video/mp4'};
  }, url);
}

// ---------------------------------------------------------------- ui mode

// Clicks Flow's own download control on each clip and catches the file the
// browser saves. Truer to what Flow serves — and the first thing to break when
// the UI changes, which is why both selectors are flags.
async function collectViaUi(context, url, manifest, state, have, seen) {
  const page = await context.newPage();
  page.setDefaultTimeout(TIMEOUT);
  console.error(`\nOpening ${url} (ui mode)`);
  await page.goto(url, {waitUntil: 'domcontentloaded', timeout: TIMEOUT});
  await assertSignedIn(page);
  await page.waitForTimeout(2500);
  await autoScroll(page, SCROLLS);

  const clips = await page.$$('video');
  console.error(`  ${clips.length} clip(s) to click through`);
  const written = [];

  for (let i = 0; i < clips.length && state.n - state.start < LIMIT; i++) {
    const clip = clips[i];
    try {
      await clip.scrollIntoViewIfNeeded();
      await clip.hover();
      await page.waitForTimeout(400);

      const card = await clip.evaluateHandle((el) => el.closest('li, article, [role="listitem"]') || el.parentElement);
      const opener = (await card.asElement()?.$$(UI_OPEN)) || [];
      if (opener.length === 0) {
        console.error(`  clip ${i + 1}: no download control matched --ui-open, skipping`);
        continue;
      }
      const wait = page.waitForEvent('download', {timeout: 20000}).catch(() => null);
      await opener[0].click();
      await page.waitForTimeout(600);

      // A kebab menu needs its item clicked; a direct download button already
      // fired. Only chase the menu if nothing downloaded yet.
      const item = page.getByRole('menuitem', {name: new RegExp(UI_ITEM, 'i')})
        .or(page.getByText(new RegExp(`^\\s*${UI_ITEM}\\s*$`, 'i'))).first();
      if (await item.isVisible({timeout: 2000}).catch(() => false)) await item.click();

      const dl = await wait;
      if (!dl) {
        console.error(`  clip ${i + 1}: no file came back within 20s, skipping`);
        await page.keyboard.press('Escape').catch(() => {});
        continue;
      }
      const suggested = dl.suggestedFilename() || 'clip.mp4';
      const ext = (suggested.split('.').pop() || 'mp4').toLowerCase();
      const key = `ui:${suggested}`;

      // Flow names its downloads after the scene, so the filename is the only
      // stable handle a click gives us — enough to make a second run additive.
      if (!FORCE && have.has(key)) {
        await dl.cancel().catch(() => {});
        if (VERBOSE) console.error(`  clip ${i + 1}: ${suggested} already in the manifest`);
        await page.keyboard.press('Escape').catch(() => {});
        continue;
      }

      const file = nameFor(state.n, ext);
      const dest = join(OUT, file);
      if (DRY) {
        console.error(`  would save ${suggested} -> ${file}`);
        await dl.cancel().catch(() => {});
      } else {
        await dl.saveAs(dest);
        const sha1 = createHash('sha1').update(readFileSync(dest)).digest('hex');
        const twin = seen.get(sha1);
        if (twin) {
          unlinkSync(dest);
          console.error(`  clip ${i + 1}: same bytes as ${twin}, not kept`);
          await page.keyboard.press('Escape').catch(() => {});
          continue;
        }
        manifest.items.push({
          file, key, url: page.url(), source: 'ui', project: url, suggested,
          bytes: statSync(dest).size, sha1, fetchedAt: new Date().toISOString(),
        });
        seen.set(sha1, file);
        have.add(key);
        written.push(file);
        saveManifest(manifest);
        console.error(`  clip ${i + 1}: ${suggested} -> ${file}`);
      }
      state.n++;
      await page.keyboard.press('Escape').catch(() => {});
    } catch (e) {
      console.error(`  clip ${i + 1}: ${e.message.split('\n')[0]}`);
    }
  }
  await page.close();
  return written;
}

// ---------------------------------------------------------------- download

async function fetchToFile(context, item, state, manifest, page, seen) {
  let body;
  let contentType = item.contentType || '';

  if (item.url.startsWith('blob:')) {
    if (!page) throw new Error('blob URL, but the page it came from is closed');
    const blob = await readBlob(page, item.url);
    body = Buffer.from(blob.base64, 'base64');
    contentType = blob.type;
  } else {
    // context.request shares the browser's cookies, so signed Flow URLs that
    // 403 in curl succeed here. Referer keeps it looking like the page fetch.
    const res = await context.request.get(item.url, {
      headers: {referer: item.project || FLOW_HOME},
      timeout: 180000,
    });
    if (!res.ok()) {
      // 401/403/410 on a URL the page itself just played means the signature
      // aged out between collecting and fetching, not that the clip is gone.
      const stale = [401, 403, 410].includes(res.status());
      throw new Error(`HTTP ${res.status()} ${res.statusText()}`
        + (stale ? ' — that signed URL has expired, re-run to collect fresh ones' : ''));
    }
    contentType = res.headers()['content-type'] || contentType;
    body = await res.body();
  }

  if (body.length < 4096) throw new Error(`only ${body.length} bytes — not a clip`);

  // The same clip reaches us twice more often than you would think: a card's
  // preview and its full view can carry different signed URLs, and a blob:
  // source is fetched over the wire as well as read out of the tab. Hash the
  // bytes and let the first copy keep the number.
  const sha1 = createHash('sha1').update(body).digest('hex');
  const twin = seen.get(sha1);
  if (twin) return {duplicate: twin};

  const file = nameFor(state.n, extFor(item.url, contentType));
  writeFileSync(join(OUT, file), body);
  manifest.items.push({
    file,
    key: keyOf(item.url),
    url: item.url,
    source: item.source,
    project: item.project,
    bytes: body.length,
    sha1,
    fetchedAt: new Date().toISOString(),
  });
  seen.set(sha1, file);
  state.n++;
  return {file, bytes: body.length};
}

// ---------------------------------------------------------------- main

async function main() {
  const pw = await playwright();

  if (LOGIN) {
    const context = await launch(pw);
    const page = await context.newPage();
    await page.goto(FLOW_HOME, {waitUntil: 'domcontentloaded', timeout: TIMEOUT}).catch(() => {});
    console.error(`\nA browser window is open on ${FLOW_HOME}.`);
    console.error('Sign in with the Google account that owns your Flow projects, open a project');
    console.error(`so the session settles, then come back here and press Enter. The session is`);
    console.error(`kept in ${PROFILE} — do not commit it.\n`);
    await waitForEnter();
    await context.close();
    console.error('Saved. Now run: node scripts/flow-download.mjs <flow-project-url>');
    return;
  }

  if (!DRY) mkdirSync(OUT, {recursive: true});
  const manifest = loadManifest();
  const have = new Set(manifest.items.map((i) => i.key));
  const seen = new Map(manifest.items.filter((i) => i.sha1).map((i) => [i.sha1, i.file]));
  const state = {n: nextIndex(manifest), start: nextIndex(manifest)};

  // --from needs no browser for discovery, but still borrows the profile's
  // cookies to fetch, because Flow URLs are only valid for a signed-in session.
  let candidates = [];
  const pages = [];
  const context = await launch(pw);

  try {
    if (FROM) {
      const lines = readFileSync(resolve(FROM), 'utf8').split('\n')
        .map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
      candidates = lines.map((url) => ({url, source: 'file', project: FLOW_HOME}));
      console.error(`${candidates.length} URL(s) from ${FROM}`);
    } else if (MODE === 'ui') {
      const written = [];
      for (const url of projects) {
        written.push(...await collectViaUi(context, url, manifest, state, have, seen));
      }
      console.error(`\n${written.length} clip(s) saved to ${OUT}`);
      if (written.length) console.error(`Manifest: ${MANIFEST}`);
      return;
    } else {
      for (const url of projects) {
        const {page, found} = await collectFromProject(context, url);
        pages.push(page);
        candidates.push(...found.values());
      }
    }

    if (REVERSE) candidates.reverse();

    // A blob: URL names nothing you can come back to later, so if the same clip
    // is also reachable over HTTP, let the HTTP one claim the number and the
    // manifest entry. Ordering is enough — the hash check drops the loser.
    candidates.sort((a, b) => Number(a.url.startsWith('blob:')) - Number(b.url.startsWith('blob:')));

    const fresh = candidates.filter((c) => FORCE || !have.has(keyOf(c.url)));
    const skipped = candidates.length - fresh.length;
    console.error(`\n${candidates.length} clip(s) found, ${skipped} already in the manifest`);

    if (DRY) {
      for (const c of fresh.slice(0, LIMIT === Infinity ? undefined : LIMIT)) {
        console.log(`${c.source.padEnd(7)} ${c.url}`);
      }
      // "Candidates", not "clips": duplicates only reveal themselves once the
      // bytes are in hand, so a real run can write fewer files than this.
      console.error(`\n--dry-run: nothing written. ${Math.min(fresh.length, LIMIT)} candidate(s) for ${OUT}`);
      return;
    }

    let ok = 0;
    let failed = 0;
    let dupes = 0;
    for (const c of fresh) {
      if (ok >= LIMIT) break;
      const page = c.url.startsWith('blob:') ? pages.find((p) => !p.isClosed()) : null;
      try {
        const {file, bytes, duplicate} = await fetchToFile(context, c, state, manifest, page, seen);
        if (duplicate) {
          dupes++;
          if (VERBOSE) console.error(`  = same bytes as ${duplicate}, not written`);
          continue;
        }
        console.error(`  ${file}  ${mb(bytes)}`);
        saveManifest(manifest);
        ok++;
      } catch (e) {
        failed++;
        console.error(`  ! ${c.url.slice(0, 90)}\n    ${e.message.split('\n')[0]}`);
      }
    }

    console.error(`\n${ok} clip(s) saved to ${OUT}`
      + `${dupes ? `, ${dupes} duplicate(s) dropped` : ''}${failed ? `, ${failed} failed` : ''}`);
    if (ok) console.error(`Manifest: ${MANIFEST}`);
  } finally {
    await context.close().catch(() => {});
  }
}

main().catch((e) => {
  console.error(`flow-download: ${e.stack || e.message}`);
  process.exit(1);
});
