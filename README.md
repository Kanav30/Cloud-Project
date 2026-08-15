# PSYDUCK — The Series

A birthday website combining:
- a Netflix-style cinematic frame (loader, chapter nav, scroll-scrubber, skip intro)
- Oatly-style scrappy editorial touches (handwritten asides, a hand-drawn doodle, tape marks)
- a drop-in media system for real photos/videos, no code editing required
- funny → emotional storytelling

## Run it

No build system is required.

1. Open the folder in VS Code (or any editor).
2. Use a local server so the media-checking script works properly — the
   easiest way is the "Live Server" VS Code extension, right-click
   `index.html` → "Open with Live Server."
   (Opening the file directly by double-clicking also mostly works, but
   some browsers block the photo/video existence checks over `file://`.)

## What's new in this pass

**The countdown gate**
- The whole site is locked behind a full-screen countdown until
  **September 5, 2026, 12:00 AM IST**. Nothing behind it is reachable —
  no scrolling, no clicking through — until the countdown hits zero, at
  which point it dissolves away on its own (no refresh needed, even if
  the tab was left open across midnight).
- To preview the real site before that date, open it with `?preview=1`
  added to the URL — e.g. `index.html?preview=1`. This bypasses the gate
  for you only; anyone opening the plain link still sees the countdown.
- To change the date/time, edit `GATE_TARGET` near the top of
  `script.js`. It's currently pinned to Indian Standard Time
  (`+05:30`) so it unlocks at the same real-world moment no matter what
  timezone the visiting device is set to. Drop the `+05:30` if you'd
  rather it just use each visitor's local clock instead.
- Heads up: this is a client-side check (it reads the visitor's device
  clock), since this is a static site with no server behind it. That's
  the normal way to do this for something like a gift site — just know
  it's not tamper-proof against someone deliberately changing their
  system clock.

**Netflix mechanics**
- A thin red scroll-progress bar at the top of the page, like a scrubber.
- A chapter rail on the right (desktop only) — six dots mapping the real
  sections of the page, highlighting where you are, click to jump.
- A "Skip Intro" button that appears a couple seconds into the hero.
- A top nav wordmark that stays legible over every section automatically
  (it uses a blend-mode trick rather than a background).

**Oatly touches**
- A couple of small handwritten asides in a Caveat script font — used
  sparingly, on purpose. Don't add more than a couple more if you edit
  copy; it stops working if it's everywhere.
- A hand-drawn circle doodle around "MY BEST FRIEND" in the emotional
  section — the one visual flourish of the whole site.
- Loose "tape" marks on the polaroid and the archive collage cards.

**Everything else**
- Contrast bumped on a few text colors that were too dim on the dark
  sections (the Lore captions, the emotional-section lines).
- Reduced-motion is respected — if someone has that OS setting on,
  animations are skipped rather than forced.

## Adding real photos and videos

This is now genuinely drag-and-drop. Read `assets/photos/README.txt` and
`assets/videos/README.txt` for the exact filenames each slot expects —
drop a matching file in, refresh the page, done. No HTML editing.

The six Archive-collage cards (`wall-1` through `wall-6`) each accept
either a photo or a video with the same number — video wins if both
exist. Videos autoplay muted and loop continuously by default, no
extra setup needed.

If you'd rather use different filenames or extensions, that's fine too —
just update the matching `data-photo="assets/photos/..."` or
`data-video="assets/videos/..."` attribute in `index.html`.

## Writing the actual content

Everything marked `[FILL IN — ...]` needs your real words. These
paragraphs have a dashed left border and italic styling so they're
obviously placeholder — once you replace the bracketed text with your
own writing, that styling removes itself automatically next time the
page loads.

Also replace, by hand (these aren't auto-styled since they're short
inline swaps, not full paragraphs):
- `[YOUR NAME]` (appears three times — hero, finale credits, signature)
- the four one-word descriptions in the "THIS IS PSYDUCK" section
- the origin story (short version + the full version in the modal)
- the project / fest / Garba / late-night-call memories
- the birthday message itself — this is the actual point of the whole
  site, so give it the most time. Write it like you're talking to her,
  not like you're writing a caption.

## Next steps

1. Fill in real photos and videos (see above).
2. Write the real copy.
3. Check it on your phone — most of this will be opened on a phone.
4. Deploy with GitHub Pages, Netlify, or Vercel so you can just send a link.
