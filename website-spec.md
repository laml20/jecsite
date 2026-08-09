# Website Spec — Mis XV Años, Jessica Anahí Mendoza

**Audience:** whoever (or whatever) writes the code. This document is the technical specification only.
**Companion document:** `checklist.md` covers everything the client does by hand — Canva exports, font downloads, the Google Sheet, DNS, music. Where this spec says "provided," it means that document covers sourcing it.

**Event:** Saturday, August 29, 2026. Mass 12:00 PM, reception 6:00 PM, Houston, TX.
**RSVP deadline:** August 15, 2026.

---

## 1. What this is

A mobile-first, bilingual (Spanish default / English toggle) digital invitation.

- **Screen 1:** wax-sealed envelope. Seal pulses, prompt text appears, tap to open.
- **Transition:** sparkle burst spirals outward, circular wipe reveals screen 2, sparkle SFX plays.
- **Screen 2:** music starts, language toggle, live countdown, event sections with scroll reveals, map links, RSVP modal.

### Architecture: one page, two screens — not two URLs

Build as **a single HTML document with two full-screen sections**, `#envelope-screen` and `#invitation-screen`.

This is not a preference. Browsers block audio not initiated by a user gesture, and the gesture does not survive a page navigation. If the envelope tap loads a new URL, the background music will be silently blocked on iOS. Same-document reveal also lets the sparkle transition span both screens and keeps all assets preloaded.

Screen 2 stays `visibility: hidden` until reveal. Push a `#invitacion` hash on open so the back button behaves.

---

## 2. Stack

| Concern | Choice | Why |
|---|---|---|
| Framework | **None — vanilla HTML/CSS/JS** | One page, ~800 lines. A framework is pure overhead here. |
| Build step | None | Client can edit and redeploy by pushing a file. |
| Hosting | **GitHub Pages** + custom domain | Static-only, which is all this needs. Free HTTPS. See §11. |
| RSVP backend | **Google Apps Script → Google Sheets** | Free, no server, no cap. See §9. |
| Animation | CSS transforms + `IntersectionObserver` | GPU-accelerated, no library. |
| Audio | Two `<audio>` elements | See §8. |

Do not add a JS animation library, a UI kit, or Tailwind.

### Files

```
/
├── index.html
├── styles.css
├── script.js
├── i18n.js                  ← all ES + EN copy
├── .nojekyll                ← required; see §11
├── CNAME                    ← created by GitHub Pages
├── robots.txt               ← Disallow: /
└── /assets
    ├── /img                 (envelope, seal, marble, icons, name images, countdown frame)
    ├── /audio               (music.mp3, sparkle.mp3)
    ├── /fonts               (6 × woff2, subset)
    └── /cal                 (misa.ics, recepcion.ics)
```

---

## 3. Assets

All source images are provided by the client as transparent PNGs (see `checklist.md`). This section covers only how the code consumes them.

### 3.1 Manifest

| Asset | Notes |
|---|---|
| Marble background | See §3.3. Clean plate, no text. |
| Envelope (sealed, front) | ~1600px wide. `loading="eager"`, `fetchpriority="high"`. |
| Wax seal | Separate PNG so it animates independently of the envelope. |
| Countdown frame | ~1100px wide. Thin gold lines — needs the resolution. See §7.3. |
| Ornamental flourish divider | Used twice on screen 2. |
| Name images (3) | Amoresa ×1, Stoic ×2. See §3.2. |
| Icons | church, reception building, place setting, waltz couple, champagne flutes, disco ball, dress + suit, gift box, envelope-with-bow, 4-point sparkle |
| Sparkle particle | Inline SVG preferred — scales without blur and can be recolored. |

Serve every raster asset as WebP with a PNG fallback via `<picture>`. `loading="lazy"` below the fold. Explicit `width`/`height` on every `<img>` to prevent layout shift. **Budget: under 1.5 MB excluding audio.**


### 3.2 Fonts

Six webfonts, two images. Nothing here needs a license purchase.

| Role | CSS var | Family name | File |
|---|---|---|---|
| Envelope name "Jessica Anahí Mendoza" | `--font-script` | `Tangerine` | `tangerine-400.woff2` |
| Section headings (Misa, Recepción, Regalos…) | `--font-heading` | `Great Vibes` | `great-vibes-400.woff2` |
| "MIS XV AÑOS", countdown, buttons | `--font-caps` | `Cinzel Decorative` | `cinzel-dec-400.woff2` |
| Landing prompt "Oprima el sobre…" | `--font-body-alt` | `Source Serif 4` | `source-serif-400.woff2` |
| Intro paragraph "Ha llegado un momento…" | `--font-display` | `Lancelot` | `lancelot-400.woff2` |
| All other body copy | `--font-body` | `Ovo` | `ovo-400.woff2` |

All six are Google Fonts, OFL, single weight (400). Self-hosted, subset. Files are provided in `/assets/fonts` — do not link Google's CDN (no shared cache benefit since 2020, and it's an extra connection).

⚠️ **Source Serif Pro is listed as `Source Serif 4` on Google Fonts now.** Searching for the old name returns nothing.

**Rendered as images, not text** (Amoresa and Stoic are paid Canva fonts; exporting a PNG from Canva is covered by your Canva license, serving the font file is not):

| Content | Font | Export |
|---|---|---|
| `Jessica Anahí Mendoza` (screen 2 header) | Amoresa | transparent PNG, ~840px wide (displays at 280px @3x) |
| `José Arturo y María de Jesús Mendoza` | Stoic | transparent PNG, ~900px wide |
| `Lizeth Alejandra y David Arturo Mendoza` | Stoic | transparent PNG, ~900px wide |

Each gets real `alt` text matching the string exactly, and `<img>` with explicit `width`/`height` attributes so the layout doesn't shift as they load. Also export a WebP of each.

### CSS

```css
@font-face { font-family: 'Tangerine';         src: url('/assets/fonts/tangerine-400.woff2')     format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: 'Great Vibes';       src: url('/assets/fonts/great-vibes-400.woff2')   format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: 'Cinzel Decorative'; src: url('/assets/fonts/cinzel-dec-400.woff2')    format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: 'Source Serif 4';    src: url('/assets/fonts/source-serif-400.woff2')  format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: 'Lancelot';          src: url('/assets/fonts/lancelot-400.woff2')      format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }
@font-face { font-family: 'Ovo';               src: url('/assets/fonts/ovo-400.woff2')           format('woff2'); font-weight: 400; font-style: normal; font-display: swap; }

:root {
  --font-script:   'Tangerine', cursive;
  --font-heading:  'Great Vibes', cursive;
  --font-caps:     'Cinzel Decorative', Georgia, serif;
  --font-display:  'Lancelot', Georgia, serif;
  --font-body:     'Ovo', Georgia, serif;
  --font-body-alt: 'Source Serif 4', Georgia, serif;
}
```

### Preload

Only the two faces visible on screen 1, in `<head>`:

```html
<link rel="preload" href="/assets/fonts/tangerine-400.woff2"  as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/cinzel-dec-400.woff2" as="font" type="font/woff2" crossorigin>
```

The `crossorigin` attribute is required even for same-origin fonts. Without it the browser fetches the file twice.

### Subsetting

Fonts arrive pre-subset. Expected combined size **under 60 KB**. Tangerine and Great Vibes are subset to their exact strings only, so **if a heading's text changes, the font must be re-subset** — see `checklist.md`. The other four cover Basic Latin + Latin-1 Supplement (all Spanish accents, ¡ and ¿).

### Gotchas

- **No `letter-spacing` on Tangerine or Great Vibes.** They're connected scripts; tracking breaks the letter joins. Tracking is correct on Cinzel Decorative and wrong on these two.
- **Great Vibes needs `line-height: 1.35` minimum** and `margin-bottom: 0.6em`. Its swashed descenders overflow the line box and will collide with the paragraph below. Test `Código de Vestimenta` at 320px — it's the longest heading and may wrap.
- **Great Vibes floor is 28px**, Tangerine's is 36px. Below that the thin upstrokes disappear on low-DPI Android screens.
- **Cinzel Decorative has no lowercase** — lowercase input renders as capitals. Only use it where you want caps.
- **Lancelot needs `font-size: 17px` and `line-height: 1.9`.** It's a heavy art-nouveau display face; at 15px with Spanish accents it turns muddy.
- **Verify accents before committing.** Render `Anahí — María de Jesús — Recepción — ¡Su presencia! — ¿Asistirás?` in all six. Ovo, Lancelot, and Tangerine are single-weight fonts from small releases and may be missing glyphs. A missing character gets substituted from a fallback mid-word and looks obviously broken. If Ovo fails, move body copy to `--font-body-alt` (Source Serif 4), which has full coverage.
- **Subset *after* confirming accents**, not before, or you'll be debugging your own subsetting instead of the font.

### 3.3 The marble background

Source available: **735 × 1300 px**. Two separate problems — width (resolution) and height (the page is ~6000 CSS px tall). They have different solutions.

#### Width: 735px is very nearly enough already

This is a mobile-first site, so the real target is phone width, not desktop:

| Device | CSS width | DPR | Device px needed |
|---|---|---|---|
| iPhone SE | 375 | 2 | 750 |
| iPhone 15 | 393 | 3 | 1179 |
| Pixel 8 | 412 | 3 | 1236 |

At DPR 2 you're at 98% of what you need. At DPR 3 you're at ~60% — which for a **soft watercolor texture** is genuinely fine. Upscaling only looks bad when there's sharp detail for the eye to reference: text edges, faces, fine lines. Pink marble has none of that. It's low-frequency organic blur sitting behind text at low contrast. A 2× Lanczos upscale of this will be indistinguishable from a native-resolution version at arm's length on a phone.

Two things make it fully invisible:
- **Add fine grain after upscaling.** 1–3% monochrome noise reads as paper texture rather than as softness, and it kills the "upscaled" tell completely. Can be done in the image, or free in CSS via an SVG `feTurbulence` overlay at low opacity — zero extra bytes.
- **Desktop needs more width than mobile.** §7.8 uses a ~920px column so the Misa and Recepción sections can go side-by-side, which at 2× needs ~1840px of marble. This makes the 1500 × 6000 re-export the recommended route rather than optional; §7.8 lists the fallbacks if it isn't available.

#### Height: mirror-tile vertically, not 2D-tile

If you can't get a taller export, this is the answer — and it sidesteps exactly the problem you spotted.

Take the 1300px-tall image, append a **vertically flipped copy** of itself → a 2600px tile. This is **seamless by construction**, with no blending or feathering needed:

- At the junction, the last row of the original meets the last row of the flipped copy — identical rows, so no seam.
- When the tile repeats, the first row meets the first row — also identical. No seam.

So it repeats perfectly, and it only repeats 2–3 times over the page instead of thirteen. Crucially, it's **one-axis** repetition rather than a grid, which is far less detectable — a 2D tile grid is what reads as wallpaper. The only artifact is a mirror symmetry, and in soft watercolour marble with no distinctive single vein, that's effectively invisible.

To hide it completely, add a very slight vertical hue/brightness drift across the full page height (a `linear-gradient` overlay from `transparent` to `rgba(239,199,190,0.12)`), so no two repeats look tonally identical.

#### Summary of the recommended stack

1. Try the 1500 × 6000 Canva re-export. If it works, use one tall no-repeat WebP and skip everything below.
2. Otherwise: 735 × 1300 → upscale 2× → mirror-tile vertically to 2600px → export WebP (~60–90 KB).
3. `background-repeat: repeat-y`, `background-size: 100% auto`, `background-color: var(--blush-200)` underneath.
4. SVG grain overlay at 3–5% opacity over the whole page.
5. Faint vertical gradient overlay to break tonal repetition.
6. Centered max-width column on desktop, solid blush outside it.

**Do not use `background-attachment: fixed`.** It's the obvious way to hold the marble still behind scrolling content, and it's unreliable on iOS Safari — repaint jank, and in some versions it silently fails and stretches the image. Use a `position: fixed` div at `z-index: -1` instead.

The marble plate is provided. If it arrives at 1500 × 6000, use approach 1 and skip the tiling entirely.

---

## 4. Design tokens

Derived from the mockup. Put these in `:root`.

```css
:root {
  --blush-100: #FDEEE9;   /* palest marble highlight */
  --blush-200: #F7DCD6;   /* base background pink */
  --blush-300: #EFC7BE;   /* marble veining, deeper areas */
  --gold-500:  #C9A227;   /* not used raw — see below */
  --gold-600:  #B08A5A;   /* primary text + icon gold (matches mockup) */
  --gold-700:  #8F6E45;   /* darker gold for small body text contrast */
  --ink-700:   #6B5540;   /* body copy — warm brown, never pure black */
  --paper:     #F4F1EC;   /* envelope cream */

  /* font vars are declared in §3.2 alongside the @font-face rules */

  --ease-soft: cubic-bezier(0.22, 0.61, 0.36, 1);
}
```

**Type scale (mobile, 375px base).** Font-specific constraints are in §3.2 Gotchas — check them before setting any of these.

| Role | Size | Face | Treatment |
|---|---|---|---|
| Envelope name "Jessica Anahí Mendoza" | 40px | Tangerine | `--gold-600`. Tangerine runs small — size up generously. |
| "MIS XV AÑOS" eyebrow | 12px | Cinzel Decorative | `letter-spacing: 0.28em` |
| Landing prompt | 15px | Source Serif 4 | italic, `--gold-700` |
| Name (screen 2 header) | — | **image** (Amoresa) | 280px display width, `alt="Jessica Anahí Mendoza"` |
| Section headings (Misa, Regalos…) | 28px | Great Vibes | `--gold-600`, `line-height: 1.35`, **no letter-spacing** |
| Intro paragraph | 17px / 1.9 | Lancelot | `--ink-700` |
| Parents' / siblings' names | — | **image** (Stoic) | 300px display width, one PNG per line |
| Body | 15px / 1.7 | Ovo | `--ink-700` |
| Countdown digits | 22px | Cinzel Decorative | `letter-spacing: 0.1em`, tabular alignment — set a fixed `min-width` per digit group so the layout doesn't jitter every second |
| Countdown labels | 8px | Cinzel Decorative | `letter-spacing: 0.2em` |
| Buttons | 13px | Cinzel Decorative | `letter-spacing: 0.18em` |

**Accessibility floor:** the mockup's body text is gold-on-pink, which is low contrast. Keep the *headings* gold for the look, but darken body copy to `--ink-700` or `--gold-700`. This is the one place to deviate from the mockup — guests reading in bright Houston sunlight will thank you. Minimum 4.5:1 for body text.

---

## 5. Screen 1 — The envelope

### Layout
Full viewport (`100dvh`, not `100vh` — `dvh` accounts for mobile browser chrome). Marble background, `background-size: cover`. Envelope centered, ~82% of viewport width, max 420px.

Text on the envelope, as in the mockup. Set these as **real HTML text overlaid on the envelope image**, not baked into the PNG — so they stay sharp at any size and can be translated.

**Position them as percentages of the envelope, not in pixels**, so they track the image as it scales across viewports:

```css
.envelope { position: relative; width: 82%; max-width: 420px; }
.envelope__name   { position: absolute; top: 22%;  left: 50%; transform: translateX(-50%); white-space: nowrap; }
.envelope__eyebrow{ position: absolute; top: 76%;  left: 50%; transform: translateX(-50%); }
```

- **Name at ~22% from the top**, centered on the upper flap, in Tangerine at `clamp(30px, 8.5vw, 44px)`. It must sit above the wax seal, not behind it — check the overlap at 320px, where the seal is proportionally largest.
- **"MIS XV AÑOS" at ~76%**, on the lower flap, Cinzel Decorative at `clamp(15px, 4vw, 20px)`, `letter-spacing: 0.22em`. Same trailing-tracking compensation as the hero (`text-indent: 0.22em`).
- **Both must fit on one line at 320px.** "Jessica Anahí Mendoza" is long; if it wraps onto the flap fold, reduce the `clamp` minimum rather than allowing two lines.
- The prompt text sits **outside and below** the envelope, ~32px beneath it — not overlaid.
- Verify the name's contrast against the cream envelope. Gold-on-cream is lower contrast than gold-on-marble, so `--gold-700` may read better here than `--gold-600`.

### Sequence on load

| t | Event |
|---|---|
| 0.0s | Background fades in (400ms) |
| 0.3s | Envelope fades + scales from 0.94 → 1 (900ms, `--ease-soft`) |
| 1.2s | Name and "MIS XV AÑOS" fade in (600ms) |
| **2.0s** | Wax seal begins a slow breathing pulse (`scale 1 → 1.04`, 2.4s, infinite, ease-in-out) to signal tappability |
| **3.6s** | Prompt text fades up from below the envelope: *"Oprima el sobre para ver la invitación"* |

**Order matters here:** the seal starts pulsing first and the text arrives after. The pulse is the invitation to tap; the text is the explanation for anyone who didn't take the hint. Leading with motion and following with words means a guest who understood the seal immediately never has to read anything, while the text still catches everyone else.

The 1.6s gap lets the seal complete a full pulse cycle (2.4s, starting at 2.0s) before the text competes for attention. Don't shorten it much below ~1.2s or the two register as one simultaneous event and the sequencing is lost.

The ~3.5s total is your "after a few seconds." I'd also add a **gentle nudge at 8s** if still untapped: the envelope tilts 2° and back, once. Cheap, and it rescues anyone who missed the text.

### Interaction
- Tap target = the entire envelope (`<button>` wrapping it, not a `<div>` — keyboard and screen-reader accessible for free).
- `aria-label="Open the invitation"` / `"Abrir la invitación"`.
- On tap: seal presses down (`scale 0.92`, 120ms), then the transition fires.
- Add `-webkit-tap-highlight-color: transparent` so iOS doesn't flash a grey box.
- Preload screen 2's images and both audio files during screen 1's idle time, so the reveal never stutters.

---

## 6. The sparkle reveal transition

Total duration ~1.6s. Three layers firing together:

**Layer 1 — Sparkle burst (spiral out).**
A fixed-position overlay containing ~40 sparkle elements, all absolutely positioned at the envelope's seal. Each gets randomized CSS custom properties:

```css
.sparkle {
  --angle: 137deg;   /* randomized per element in JS */
  --dist: 62vmax;    /* randomized 30–75vmax */
  --spin: 540deg;    /* randomized 360–720deg */
  --delay: 90ms;     /* randomized 0–400ms */
  animation: spiral-out 1400ms var(--delay) var(--ease-soft) forwards;
}
@keyframes spiral-out {
  0%   { transform: rotate(var(--angle)) translateX(0) rotate(0) scale(0); opacity: 0; }
  15%  { opacity: 1; scale: 1; }
  100% { transform: rotate(var(--angle)) translateX(var(--dist)) rotate(var(--spin)) scale(0.2); opacity: 0; }
}
```
The nested `rotate → translateX → rotate` is what produces the spiral rather than a straight radial burst. Generate the sparkles in JS and remove them from the DOM when done.

**Layer 2 — The wipe.** Screen 2 is revealed by an expanding circular `clip-path` centered on the seal: `circle(0% at 50% 45%)` → `circle(150% at 50% 45%)` over 1100ms. The sparkles appear to be carrying the reveal outward.

**Layer 3 — Envelope exit.** Envelope scales to 1.15 and fades to 0 over 500ms, so it dissolves *into* the sparkles instead of sitting under them.

**Sound:** `sparkle.mp3` plays at t=0 of the transition. Keep it under 1.5s and around −6 dB so it doesn't startle anyone.

**Reduced motion:** if `prefers-reduced-motion: reduce`, skip all of the above and cross-fade the two screens over 400ms. Still play the sound. Never skip this branch — some people get motion sickness, and it's four lines of CSS.

**Performance:** animate only `transform` and `opacity`. Put `will-change: transform, opacity` on the sparkles. Do not animate `width`, `top`, or `filter` — that will drop frames on mid-range Androids.

---

## 7. Screen 2 — The invitation

### 7.1 Fixed header controls

**Decided: language toggle top-left, music toggle top-right.** This inverts the mockup, which had "(play music)" on the left — build to this spec, not to the mockup image.

- **Language toggle:** a small pill reading `ES | EN` with the active side filled. Clearer than a globe icon, which doesn't tell anyone what it does. Tap target minimum 44×44px.
- **Music toggle:** speaker icon, filled when playing, with a slash when muted.
- Both `position: fixed`, high `z-index`, with a soft translucent backdrop (`backdrop-filter: blur(6px)`) so they stay legible over the marble as the page scrolls.

### 7.2 Section order

1. **Hero** — full viewport. Eyebrow, name, date vertically centered; countdown at the bottom. See §7.2a.
2. Invitation message + parents/siblings
3. Misa
4. Recepción
5. Itinerario del Evento
6. Código de Vestimenta
7. Regalos
8. RSVP
9. Closing / signature

### 7.2a Hero

The first thing revealed when the envelope opens. **Full viewport height, identical structure on mobile and desktop** — only the type scale changes.

```
┌─────────────────────────┐
│                         │
│                         │
│      MIS XV AÑOS        │  ← optically centered
│   Jessica Anahí Mendoza │     as a group
│    29 de agosto del     │
│         2026            │
│                         │
│                         │
│  ┌───────────────────┐  │
│  │ 000 : 00 : 00 : 00│  │  ← ~10% from bottom
│  └───────────────────┘  │
└─────────────────────────┘
```

**Layout:**

```css
.hero {
  min-height: 100dvh;              /* dvh, not vh — mobile browser chrome */
  display: grid;
  grid-template-rows: 1fr auto;
  padding-block-end: clamp(2rem, 10vh, 5rem);
}
.hero__titles { align-self: center; }   /* centered in the 1fr row */
.hero__countdown { justify-self: center; }
```

`grid-template-rows: 1fr auto` centres the titles in the remaining space *after* the countdown is placed, so the two never fight. Do not use `justify-content: space-between` — it pushes the titles to the very top on tall viewports.

**Optical centering:** the title block should sit fractionally **above** true center — roughly 46% — because the countdown weights the lower half. Geometric centering will look low.

**Internal spacing of the title block.** Three elements, two gaps, and they are not equal — the name is the focal point and needs air on both sides:

```css
.hero__titles     { display: grid; justify-items: center; padding-inline: 1.5rem; }
.hero__eyebrow    { margin-block-end: 1.75rem; }   /* MIS XV AÑOS → name */
.hero__name       { width: 280px; max-width: 78vw; height: auto; }
.hero__date       { margin-block-start: 1.5rem; }  /* name → date */
```

| Gap | Mobile | Desktop (≥900px) |
|---|---|---|
| Eyebrow → name | 28px | 34px |
| Name → date | 24px | 30px |
| Name image width | 280px (max 78vw) | 340px |
| Horizontal page padding | 24px | 24px (column is capped anyway) |

The eyebrow gap is deliberately larger than the date gap. The eyebrow is small letterspaced caps and the date is a full-size line, so equal gaps read as unequal — the lighter element needs more separation to sit apart from the name.

**Three traps specific to this block:**

1. **Letter-spacing breaks centering.** `letter-spacing: 0.28em` on "MIS XV AÑOS" appends tracking after the *final* letter too, so a centered line sits visibly left of true center. Compensate with `text-indent: 0.28em` on the eyebrow, or `margin-left: 0.28em`. This is small and unmistakable once seen.

2. **The name PNG's bounding box is not its visual extent.** Amoresa has tall ascenders and long swashed descenders, so an export includes transparent padding above and below the letterforms. If the gaps above are measured against the file's edges, the name will appear to float too far from both neighbours. **Crop the export tight to the visible ink**, then set the gaps. If the swash on the "J" or the tail on "Mendoza" must be preserved, note how much transparent margin the file carries and subtract it from the gap values with a negative margin.

3. **Set explicit `width` and `height` on the name image.** Without them the block reflows as the PNG loads — and it loads at exactly the moment the reveal animation is running, so the titles will visibly jump mid-fade.

**Vertical centering is of the ink, not the box.** After building it, screenshot the hero and check whether the *visible* title block looks centered. Trapped whitespace in the name image is the usual culprit if it looks low.

**Reveal sequence**, starting when the §6 wipe completes:

| t | Event |
|---|---|
| 0.0s | Wipe finishes. Hero visible, titles at `opacity: 0` |
| 0.2s | "MIS XV AÑOS" fades up (600ms) |
| 0.5s | Name image fades up (700ms) |
| 0.8s | Date fades up (600ms) |
| **1.6s** | Countdown fades up from below (800ms) and begins ticking |

The countdown arriving last and from the bottom edge is what makes it read as an arrival rather than as page furniture. It also doubles as a **scroll affordance** — content sitting at the bottom edge implies more below, which is exactly the cue a full-viewport hero otherwise lacks.

Start the ticking only when it becomes visible; a counter animating behind `opacity: 0` is wasted work and looks odd if the fade is interrupted.

**Short viewports.** Landscape phones and small laptops are roughly 380–500px tall, where a centered title block plus a bottom countdown will collide. Below `600px` height, drop `min-height` to `auto`, reduce the bottom padding, and let the hero size to its content and scroll normally:

```css
@media (max-height: 600px) { .hero { min-height: auto; padding-block: 3rem; } }
```

**Do not add a bouncing scroll arrow.** The countdown at the bottom edge already implies more content, and a second cue clutters the one screen that should feel composed.

**Desktop:** identical structure. Type scales up (~10%, per §7.8) and the countdown frame can widen slightly, but nothing moves.

### 7.3 Countdown

Live counter: **DÍAS · HORAS · MINUTOS · SEGUNDOS**, in the format `10 : 00 : 00 : 00`. Placement and reveal timing are in §7.2a — it sits at the bottom of the full-viewport hero, not as a separate section below it.

**Frame: transparent PNG, not a CSS border.** Export the decorative gold frame from Canva as a transparent PNG and use it as a `background-image` on the countdown container, with the live digits as real text layered on top. Requirements:

```css
.countdown {
  background-image: url('/assets/img/countdown-frame.webp');
  background-size: 100% 100%;   /* not `cover` — the frame must match the box exactly */
  background-repeat: no-repeat;
  padding: 1.4rem 1.1rem;        /* tune so digits sit inside the rule, not on it */
}
```

- Export at **3× display width** (~1100px for a ~360px slot). It's a thin gold line, and thin lines are the one thing that genuinely does show upscaling artifacts — unlike the marble in §3.3, this asset needs the resolution.
- **Never bake the digits into the image.** They change every second and must translate.
- `background-size: 100% 100%` intentionally stretches the frame to the container. If the frame has ornamental corners that would distort, use a **9-slice** approach instead (`border-image` with a `slice` value), which stretches only the straight edges and leaves corners intact.
- The frame's aspect ratio will change between languages — `SEGUNDOS` is wider than `SECONDS`. Set a fixed `min-height` and let width fill, so the frame stretches horizontally only.
- Provide a CSS fallback (`border: 1px solid var(--gold-600)`) for the moment before the image loads, so the countdown never appears unframed.

Implementation notes that actually matter:
- **Target: Mass, 12:00 PM CDT on August 29, 2026** — decided. Timezone-anchored, not local: `new Date('2026-08-29T12:00:00-05:00')` (Houston is UTC−5 in August). Building it from local date parts makes someone opening it from Mexico or California see the wrong number.
- Because the target is noon and the reception runs to late evening, the "day of" state matters more than usual — the counter hits zero while the event is still hours from over. See the post-event note below.
- Update with `setInterval(..., 1000)` but recompute from `Date.now()` each tick rather than decrementing a counter, so it stays accurate if the phone sleeps.
- Zero-pad to two digits. Days can be three digits.
- **Three states, not two.** With a noon target the counter zeroes out mid-event, so a simple before/after split gets it wrong for the rest of the day:
  1. **Before 12:00 PM Aug 29** — live digits.
  2. **12:00 PM – 11:59 PM Aug 29** — *"¡Hoy es el día!"* / *"Today's the day!"* Guests will be opening the page from the parking lot to check the reception address; it must not read as though the event is over.
  3. **From Aug 30** — *"Gracias por celebrar con nosotros"* / *"Thank you for celebrating with us"*.

  Compare against Houston local time for the state boundaries, not the viewer's timezone — otherwise a guest whose phone is set to another zone flips to state 3 early.
- Labels must translate.

### 7.4 Scroll animations

One `IntersectionObserver` (`threshold: 0.15`, `rootMargin: '0px 0px -10% 0px'`) adds `.is-visible` to any `.reveal` element.

```css
.reveal { opacity: 0; transform: translateY(18px); transition: opacity 700ms var(--ease-soft), transform 700ms var(--ease-soft); }
.reveal.is-visible { opacity: 1; transform: translateY(0); }
```

Elements start 18px **below** their resting position and rise into place as they enter the viewport. This is the standard pattern, and it's the right call: the element moves against the scroll direction, so it reads as content settling into view rather than racing past. Slide-down fights the scroll and can feel like the page is dropping.

The `rootMargin: '0px 0px -10% 0px'` matters more with slide-up — it holds the trigger until the element is ~10% into the viewport, so the animation isn't already finished by the time the element is comfortably on screen.

Within a section, stagger children with `transition-delay: calc(var(--i) * 90ms)` so the icon, heading, and text arrive in sequence rather than as a block. Cap the delay — a 6-item stagger at 90ms is 540ms, which is the ceiling before it feels slow.

**Once-only:** don't re-hide elements when they scroll back out. Unobserve after firing.

### 7.5 Itinerary sparkles (scroll-linked scale)

The 4-point sparkles between itinerary items grow and shrink as they pass through the viewport.

Preferred: **CSS scroll-driven animations**, which run off the main thread:
```css
@supports (animation-timeline: view()) {
  .itinerary-sparkle {
    animation: sparkle-pulse linear both;
    animation-timeline: view();
    animation-range: entry 10% exit 90%;
  }
}
@keyframes sparkle-pulse {
  0%, 100% { transform: scale(0.5) rotate(-15deg); opacity: 0.4; }
  50%      { transform: scale(1.15) rotate(15deg); opacity: 1; }
}
```
Fallback for browsers without `animation-timeline` (still a meaningful share of iOS devices): a `requestAnimationFrame`-throttled scroll handler that maps each sparkle's viewport position to a scale value. Never bind heavy work directly to `scroll`.

### 7.6 Misa / Recepción map buttons

Each gets a location pin button (as in the mockup) that opens directions.

Use a plain link with the universal Google Maps URL, which hands off correctly on both platforms:
```html
<a href="https://www.google.com/maps/dir/?api=1&destination=4213+Mangum+Rd,+Houston,+TX+77092"
   target="_blank" rel="noopener">Ver ubicación</a>
```
Optionally sniff iOS and offer Apple Maps (`https://maps.apple.com/?daddr=...`), but the Google URL alone is fine and less code to break.

**Add to calendar:** yes, but put it in the **RSVP success state** rather than here — see §9.3. Someone who has just confirmed they're coming is far likelier to save the date than someone still reading the venue details. Same two `.ics` files either way, so you can also drop a small secondary link in these sections if you want both.

---

### 7.7 Return to envelope (pull-down at top)

Optional, and worth doing — but **not** on scroll position alone.

**The trap:** scrolling to the top is not a deliberate gesture. Guests scroll up constantly to re-read the countdown or check the Mass address. Firing a full-screen transition every time they reach the top would make the page feel possessed. On iOS it's worse — tapping the status bar jumps to the top instantly, so the transition would fire from a gesture the guest doesn't associate with navigation at all.

**Design it as a deliberate over-pull instead**, the same interaction grammar as pull-to-refresh, which every guest already knows:

1. At `scrollTop === 0`, further downward dragging is tracked. Below the threshold, nothing navigates.
2. As the pull grows, the envelope fades and scales in above the content — from `scale(0.9), opacity 0` to `scale(1), opacity 1` — mapped directly to pull distance. **The guest sees what will happen before committing**, and can abandon it by letting go early.
3. Apply a resistance curve (`translateY = pull * 0.4`) so it feels elastic rather than loose.
4. **Threshold ~110px.** Release past it → the transition runs. Release short of it → springs back, nothing happens.

**Blocking pull-to-refresh is mandatory, not optional.** Without it, Chrome and Safari on Android will reload the page mid-gesture and the guest loses their place, the music, and any half-filled RSVP:

```css
body { overscroll-behavior-y: contain; }
```

**The return transition is not the opening one played backwards:**
- **No sparkle sound.** It was a reveal flourish; replaying it on every pull turns a moment into a tic.
- **Music must not stop or restart.** It continues uninterrupted across both screens. This is the whole reason for the single-document architecture in §1 — do not undo it here.
- Sparkles may play at reduced count (~15 vs ~40) and lower opacity, spiralling *inward* to the seal rather than outward. Circular `clip-path` runs in reverse, 1100ms → `circle(0% at 50% 45%)`.
- The envelope arrives in its **already-opened state**: no 3.6s intro sequence, no seal pulse, prompt text visible immediately. Re-running the first-visit choreography implies the guest lost progress.

**Going forward again** should be quick — the guest has seen the reveal. Tap the envelope, run a shortened version (~800ms, fewer sparkles, no sound), and restore the **previous scroll position** rather than dumping them at the top.

`prefers-reduced-motion`: cross-fade both directions, 400ms.

Desktop equivalent: the same over-pull via wheel/trackpad at `scrollTop === 0`, with the same threshold logic. Trackpad momentum makes accidental triggering likelier, so require ~1.5× the threshold on wheel input.

**Priority: build this last.** It's the most delightful thing on the list and the least necessary. If time runs short, ship without it.

---

### 7.8 Desktop layout

The site is mobile-first and most guests will open it from a text message, but a meaningful minority will open it on a laptop — and it should not look like a phone screenshot stretched across 1920px.

**Approach: a widened centered column, with five sections going side-by-side.**

At `min-width: 900px`, the content column widens to **~920px** and five sections switch to a two-column layout with alternating sides. Everything else stays single-column and centered.

```css
@media (min-width: 900px) {
  .invitation { max-width: 920px; margin-inline: auto; }
}
```

**Alternating sections.** Five sections alternate, in document order:

| # | Section | Desktop layout |
|---|---|---|
| 1 | Misa | **icon left**, text right |
| 2 | Recepción | **icon right**, text left |
| 3 | Código de Vestimenta | **icon left**, text right |
| 4 | Regalos | **icon right**, text left |
| 5 | RSVP | **icon left**, text right |

Unchanged and centered: hero, intro + parents/siblings, closing, and **Itinerario** — it already has its own zigzag timeline, and a second alternating rhythm layered on top would fight it.

Note the RSVP section lands on icon-left, which continues the alternation cleanly across the Itinerario break. The eye reads the zigzag as continuous even though the centered Itinerario sits in the middle of it.

```css
.section--split { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; }
.section--split.is-reversed .section__figure { order: 2; }
```

Use `order`, not `direction: rtl`, and keep the icon **first in the DOM** in every case. Reading order stays consistent for screen readers regardless of which side the icon renders on.

Below 900px all five revert to stacked single-column, icon above text — the mobile layout, unchanged.

**The RSVP section keeps its button full-width within its text column**, and the modal it opens stays single-column and centered at every width. Splitting the section is fine; splitting the form is not.

**Watch the vertical rhythm.** Five alternating sections in a row can start to feel mechanical. Two cheap correctives: keep the ornamental flourish dividers between them so each alternation reads as a deliberate beat rather than a template, and let the icon column breathe — the icons are delicate line art, so give them generous whitespace rather than scaling them up to fill half the width. Cap icon width around 220px and center it in its column.

**Text alignment in split sections:** center the text within its own column rather than left-aligning it. The mockup's typography is centered throughout, and a single left-aligned block would read as a different design language.

**⚠️ This widening changes the marble requirement.** The earlier framed-card plan confined marble to a 480px column, which a 735px plate covers comfortably. A 920px column on a 2× desktop display needs roughly 1840px. That makes the **1500 × 6000 Canva re-export in `checklist.md` §3 the recommended path rather than a nice-to-have.** If the re-export isn't possible:

- Keep the marble as a **full-bleed page background** and give the content column a semi-opaque wash (`rgba(253, 238, 233, 0.55)`) instead of its own texture. A large soft background tolerates upscaling far better than one sitting directly behind text.
- Or hold the split sections at 820px, which needs ~1640px at 2× — a 2.2× upscale, acceptable for soft watercolour with grain applied.

**Desktop-specific details that are easy to miss:**

- **Envelope screen:** envelope max-width 520px (larger than mobile's 420px), still centered on full-bleed marble. This screen *should* fill the viewport — it's a single focal image, so it scales up gracefully where the invitation body would not.
- **Hover states exist on desktop and not on mobile.** Add them: map buttons, RSVP button, language and music toggles, calendar links. Subtle — a slight lift or a gold-deepening on the border. Without any hover feedback a desktop page feels dead.
- `cursor: pointer` on the envelope, and a visible `:focus-visible` ring on every control (keyboard users are overwhelmingly on desktop).
- **Bump type ~10%** at `≥768px`: body 15px → 16px, section headings 28px → 32px. Reading distance is greater.
- **RSVP modal:** cap at 440px and center it. A full-width modal on a wide screen puts the phone field and the submit button absurdly far apart. The modal stays single-column at every width — do not split it.
- **Fixed header controls** should align to the content column's edges, not the viewport's, or they'll float alone in the far corners of a wide screen.
- **Scroll reveals in split sections:** stagger the two columns slightly (icon at 0ms, text at 120ms) so the pairing reads as one gesture rather than two things arriving at once. Keep this order in both orientations — always icon then text, never leading from whichever side is on the left. The consistency is what stops five alternating reveals from feeling erratic.
- The sparkle transition's `circle(150%)` still covers a wide viewport — no change needed, but verify at 2560px.
- **Test at 1280px and 1920px.** Also check ~880px and ~920px, which straddle the split-layout breakpoint, and a half-width window (~700px), which should be fully stacked.

## 8. Audio

Two elements, both `preload="auto"`, loaded during screen 1:

```html
<audio id="sfx" src="/assets/audio/sparkle.mp3" preload="auto"></audio>
<audio id="music" src="/assets/audio/music.mp3" loop preload="auto"></audio>
```

**The rule you cannot violate:** call `.play()` **synchronously inside the tap handler**. Not in a `setTimeout`, not after an `await`. iOS Safari treats the user-gesture "permission" as expiring the moment the handler yields, so this fails:

```js
// ❌ music will be blocked on iOS
envelope.addEventListener('click', async () => {
  await runTransition();
  music.play();
});
```

And this works:

```js
// ✅
envelope.addEventListener('click', () => {
  sfx.play();
  music.volume = 0;
  music.play().catch(() => showUnmuteButton());
  fadeIn(music, 0.35, 2000);   // ramp volume with rAF, not with .play()
  runTransition();
});
```

Other requirements:
- Start music at **volume 0.35**, not 1.0. Someone will open this at 2am with headphones in.
- Fade in over ~2s so the music emerges under the sparkle sound rather than colliding with it.
- Always handle the rejected `play()` promise by revealing a prominent "tap to play music" button. Some devices and low-power modes will block it regardless of gesture.
- Persist the mute choice in `localStorage` so it survives a refresh.
- Keep `music.mp3` under ~3 MB (a 2–3 minute loop at 128kbps mono is plenty). Load it *after* the images.
- **Licensing:** don't use a commercial track. Use royalty-free instrumental music (Pixabay Music, Free Music Archive, or an Epidemic Sound / Artlist subscription). A copyright-flagged file won't break the site, but it's worth doing right.

---

## 9. RSVP

### 9.1 Backend: Google Apps Script + Google Sheets

**Decided — build against this. No alternatives to evaluate.**

A Google Sheet with an Apps Script web app attached. It stores structured records, exposes an HTTP endpoint, and can read as well as write, which §9.2 requires. Free, no billing, no schema migrations, and the family administers it as a spreadsheet.

Apps Script quotas on a consumer Google account run to thousands of executions per day. A quinceañera guest list will not approach them.

**Setup is the client's**, per `checklist.md` §6 — they create the Sheet, the two tabs, and populate the guest list. The build needs from them: the **deployed web app URL**, and confirmation that the tabs are named exactly `Invitados` and `Respuestas`.

**Apps Script deployment settings** (worth checking if the endpoint misbehaves): *Execute as: Me*, *Who has access: Anyone*. Anything else returns a login redirect instead of JSON, which surfaces as an opaque CORS error rather than an auth error — a misleading failure mode that has eaten many hours.

**Redeploy after every script edit.** Apps Script serves the last *deployed* version, not the last saved one. Use Deploy → Manage deployments → edit → New version, which keeps the URL stable. Creating a fresh deployment issues a *new* URL and silently orphans the one in the site.

### 9.2 The allotment model

The requirement "how many guests they get" means seats are **allocated per family in advance**, not chosen freely by the guest. That makes this a lookup-then-confirm flow, not a blank form — which is both better UX and the thing that stops a family of four RSVPing eight.

**Sheet 1 — `Invitados`** (client fills this in before launch):

| Nombre | Teléfono | Invitados | Idioma |
|---|---|---|---|
| Familia Ramírez | 2815550134 | 5 | es |
| Tía Carmen | 7135550199 | 1 | en |

`Invitados` is a **single total allotment**, not a split. The guest chooses their own adults/kids mix at RSVP time; the code enforces `adultos + niños ≤ Invitados`. This is deliberately simpler than separate caps — the client shouldn't have to guess whether the Ramírez family is bringing 2+3 or 3+2, and a guest hitting a "no kid seats left" error when adult seats remain is a support call.

**Sheet 2 — `Respuestas`** (script appends; never edited by hand):

| Marca de tiempo | Teléfono | Nombre | Asistirá | Adultos | Niños | Lugares solicitados | Motivo | Teléfono alt | Mensaje | Idioma |
|---|---|---|---|---|---|---|---|---|---|---|

`Adultos` and `Niños` are always the **confirmed** counts within the allotment. `Lugares solicitados` is any extra seats requested but not granted (§9.4) — keep them in separate columns so summing the first two gives a true headcount.

**Two `Idioma` columns, on purpose.** `Invitados.Idioma` is the language the client *expects* that household reads — it drives reminder texts and is the more reliable of the two. `Respuestas.Idioma` is the language the site was actually in when they submitted. They will sometimes disagree (a bilingual guest opens it in Spanish, a teenager RSVPs on a parent's behalf in English), and that disagreement is useful signal rather than an error. Store both; don't reconcile them.

Accept `es`, `en`, and blank. Treat blank and anything unrecognized as `es`.

Two tabs, not one — so re-sending reminders means filtering `Invitados` against `Respuestas`, and a guest who RSVPs twice creates two rows rather than overwriting evidence.

### 9.3 Endpoint

One Apps Script web app, deployed *execute as me / access anyone*, handling both verbs.

**`GET ?phone=2815550134`** → normalize to digits only, strip a leading `1`, match against `Invitados` column B. Ignore blank rows and trim whitespace — hand-entered lists always have both.

Note that `allotment` is returned to the client but **deliberately not displayed** until the guest reaches it (§9.4 Step 3). It is readable in the network response by anyone who looks, which is fine — the goal is avoiding anchoring, not secrecy.

```json
{ "found": true, "name": "Familia Ramírez", "allotment": 5, "lang": "es" }
{ "found": false }
```

**`POST`** → append a row to `Respuestas`, return `{ "ok": true }`.

**CORS:** Apps Script does not return CORS headers, so a JSON `POST` will fail preflight. Send `FormData` (no preflight) and read `e.parameter` server-side. For the GET, use a normal `fetch` — same-origin rules don't apply to simple GETs, but if it fights back, JSONP is the escape hatch.

**This must be tested against the deployed endpoint from the deployed site.** It works differently from localhost and this is where the surprises are.

**One privacy tradeoff to be aware of.**

The lookup endpoint answers a simple question: *"is this phone number on the guest list, and if so, whose is it?"* It has to, or the feature doesn't work. But it will answer that question for **anyone who has the URL**, not just invited guests — and it'll answer it as many times as it's asked.

So in principle, someone could point a script at it, run through millions of phone numbers, and build a list of number→name pairs for everyone invited. That's called *enumeration*: not breaking in, just asking a legitimate question over and over until you've mapped the whole dataset.

**How much this matters here: very little.** The endpoint URL is a long random Google string that appears nowhere public, the site is `noindex`, and the payoff is a guest list for a quinceañera. Nobody is doing this. It's noted because it's the kind of thing that should be a decision rather than an oversight.

If the client wants it closed off anyway, in increasing order of hassle:

- **Add a second factor.** Require the last four digits of the phone *plus* the first few letters of a surname. Guessing both together stops bulk scripting cold, at the cost of one extra field.
- **Return less.** Have the endpoint reply with just the allotment number and no name. Removes the name→number linkage entirely, but loses the *"Familia Ramírez — tenemos 5 lugares"* greeting, which is a meaningful part of why the flow feels personal.
- **Switch to per-family codes.** Each household gets its own random-token link, keyed on the token rather than a phone number. Considered and declined: it requires a different link per household, which means a mail merge and a wrong-family RSVP whenever one is mis-pasted. If it is ever revisited, the token must be **random** — never the guest's phone number, which would land their number in every forwarded link, screenshot, and browser history.

**Default: phone lookup as specified, with §9.4's fallback for numbers that aren't found.** Revisit only if the client asks.

### 9.4 Modal flow

Everything happens in a modal over the invitation. Music keeps playing. Focus trapped, closes on backdrop tap and Escape.

> **Two different phone prompts exist in this spec — don't conflate them.**
>
> | | Bare-domain lookup (§11) | RSVP Step 1 (below) |
> |---|---|---|
> | Where | `misquincejessica.com` | Inside the RSVP modal |
> | Purpose | Get *access* to the invitation | Identify *which household* is replying |
> | Who sees it | Only guests without the link | **Everyone who RSVPs** |
>
> **Step 1 runs regardless of how the guest arrived.** The random path is shared by all guests, so it carries no identity — a guest who taps the texted link is anonymous to the site until they identify themselves. Arriving via `/a7f3k9/` skips the *gate*, not the RSVP lookup.

**Step 1 — Phone.**
`<input type="tel" inputmode="numeric" autocomplete="tel">`, formatted as they type (`(281) 555-0134`). One button: *Continuar*.

**Skip this step when the number is already known:**
- **Came through the bare-domain lookup.** They just typed a number that matched. Carry it through in memory, jump straight to Step 2a, and don't ask twice.
- **Returning visitor.** Store the matched number in `localStorage` on a successful lookup and pre-fill from it on later visits, with the field editable in case a different household member is replying from a shared device.

Everyone else gets Step 1 as their first screen.

- Label: *"Ingresa tu número de teléfono"* / *"Enter your phone number"*
- **Helper text below the field, always visible:** *"Usa el número donde recibiste la invitación."* / *"Use the number where you received your invitation."*

That one line does most of the work. The lookup can only match numbers on the guest list, and the guest is the only person who knows which of their numbers that is. Saying so up front converts the majority of would-be misses into first-try matches — far more effective than any recovery flow bolted on afterward.

**Step 2a — Found.**
> **Familia Ramírez**
> ¡Qué gusto verte por aquí!

**Show the name, not the number.** The allotment is held in memory and never displayed until it becomes a constraint (Step 3). Telling a household up front that they have five seats *anchors* them to five — a family of three reads it as an entitlement and finds two more people to bring. The number only matters if they reach it, so it stays out of sight until then.

(`Nombre` is displayed verbatim from the Sheet — it may be a family name or a single person, so don't prepend "Familia" in code.)

**Do not auto-switch the page language on lookup**, even when `lang` disagrees with the current setting. The guest is mid-form; swapping every string around them is disorienting, and it silently overrides a toggle they may have set deliberately. Instead: if `lang` differs from the active language *and* the guest has never touched the toggle this session, show one dismissible line at the bottom of the modal — *"View in English?"* / *"¿Ver en español?"* — as a link they choose. If they've already used the toggle, respect it and show nothing.

Then: *¿Nos acompañarán?* — two large buttons, **Sí, asistiremos** / **No podremos asistir**.

**Step 2b — Not found.** Two stages: one nudge, then let them through. Never a dead end.

**First miss — prompt a retry.** Most misses are a typo or the wrong one of their numbers, and both are fixed by trying again:
> No encontramos ese número. ¿Es el mismo donde recibiste la invitación? Revísalo e inténtalo de nuevo.

Keep what they typed in the field (don't clear it — they need to see the typo), focus it, and show *Intentar de nuevo* as the primary button.

Below that, a quieter secondary link, present from the very first miss: *Continuar de todos modos*. **Do not force a second failed attempt before offering it.** Someone RSVPing from a work phone, or on behalf of a parent, will never succeed at the lookup no matter how many times they retry — making them fail twice to prove it is just friction applied to the people already having the worst time.

**Second miss, or the secondary link** — open form: steppers uncapped, `Nombre` as free text, everything else identical. The row lands in `Respuestas` with `Teléfono` set to whatever they entered; the blank `Nombre` match is what flags it for manual reconciliation.

**A guest who cannot RSVP will simply not RSVP.** The retry nudge exists to improve match rates, not to gate submission.

**Step 3 — Counts** (only if attending).

Two stepper rows, **Adultos** and **Niños**. 48px circular +/− buttons, number between them. Do not use `<select>` or `<input type="number">` — steppers with large targets are the whole reason a non-technical guest can complete this.

**Defaults: Adultos = 1, Niños = 0.** Neutral, not the allotment. The person filling this in is at least one adult, so the form starts from a true minimum and the guest counts *up* to their real number.

**No running total, no "3 de 5" indicator, no maximum shown anywhere.** Every one of those leaks the allotment and re-anchors the guest to it.

The cap is still enforced on the sum (`adultos + niños ≤ allotment`) — it's simply invisible until reached.

**At the cap.** When the sum equals the allotment, both `+` buttons take their inactive appearance but **remain clickable** (`aria-disabled="true"`, not the `disabled` attribute — genuinely disabled buttons fire no events and the guest gets silence). On the next `+` tap, reveal:

> Tenemos 5 lugares apartados para ustedes. ¿Necesitas un lugar más?
> *We've reserved 5 places for you. Need an extra seat?*

**Reveal on the attempt to exceed, not on reaching the cap.** A household of exactly five who legitimately fills all five seats should never see a limit message at all — reaching your number isn't an error, and greeting a correct answer with a wall reads as a rebuke. Only someone reaching for a sixth needs to be told there are five.

**Extra-seat request.** Beneath that message, a `− 0 +` stepper labelled *lugares adicionales* (max 2) and an optional one-line reason. The main counters stay capped; this records a request and does not grant a seat.

Everything about this is conditional. A guest who never reaches their allotment never learns what it was, never sees a limit, and never sees a request control.

**Confirmation copy must not imply approval:**

> ✅ *Recibimos tu solicitud y te confirmaremos pronto.* / *We've received your request and will confirm soon.*
> ❌ Anything reading as *"¡Listo!"*, a checkmark alone, or a success state indistinguishable from a normal RSVP.

A guest who reads it as a yes will bring the extra person regardless of the answer. `Respuestas` records the **confirmed** counts in `Adultos`/`Niños` and the requested extras in `Lugares solicitados`, so summing the first two always gives a true headcount.

**Sheet change:** `Lugares solicitados` and `Motivo` in `Respuestas`. The client filters that column, decides case by case, and replies by text. No approval mechanism in the site — it's a judgment call about seating and budget, not a form.

**Other stepper rules:** clamp both at 0, and don't let Adultos reach 0 unless Niños is above 0. Never a hard error or a popup. Uncapped entirely when the phone lookup found nothing.

**Server-side revalidation is unchanged and non-negotiable** (§11). The client-side cap is a UI courtesy; the script must re-check `adultos + niños` against `Invitados` before writing the row.

**If the client would rather not accept requests at all**, drop the stepper and reason field and end the message at *"Tenemos 5 lugares apartados para ustedes. Si necesitas más, escríbenos."* The cap-reveal behavior stays exactly the same.

**Step 4 — Optional fields.**
- *Otro número de teléfono* — collapsed behind a `+ Agregar otro número` link. Worth including (useful when a couple coordinates separately), but not worth a visible field that makes the form look longer.
- *Mensaje para Jessica* — 2-row textarea. People want to send a note.

**Step 5 — Submit.**
Disable the button, label → *Enviando…*. On success, a success panel inside the modal:
- Sparkle animation, *"¡Gracias! Tu confirmación fue recibida."*
- Echo back what was recorded: *"5 personas — 2 adultos, 3 niños."* Guests need to see it landed.
- **Add to calendar** (see §9.5).
- Write a `localStorage` flag. The RSVP button afterward reads *"Ya confirmaste — ¿cambiar?"* and reopens pre-filled. Without this, people submit three times.

**On failure**, keep their input on screen and offer the SMS fallback inline:
> No pudimos enviar tu confirmación. Puedes enviarnos un mensaje aquí.

…as `sms:+1XXXXXXXXXX?&body=` pre-filled with their answers. This turns the worst case into a working RSVP rather than a lost one.

Validation is inline and in the active language. No `alert()`.

### 9.5 Add to calendar

On the success panel, **only when attending**. Offering it to someone who just declined reads badly.

**Decided: two separate buttons**, *Misa (12:00PM)* and *Recepción (6:00PM)*. Not one combined entry — the six-hour gap means many guests attend one and not the other, and a single block spanning noon to late evening would be wrong on both counts.

- Static `.ics` files in `/assets/cal/`. No generation.
- `DTSTART;TZID=America/Chicago:20260829T120000`. A floating or UTC time lands wrong for anyone travelling.
- Include `LOCATION` with the full street address — most calendar apps make it a tappable map link.
- **Android Chrome handles `.ics` inconsistently** (often just drops it in Downloads). Offer a Google Calendar template URL alongside, which works everywhere: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=...&dates=20260829T170000Z/20260829T190000Z&location=...`
- Note the timezone trap: `.ics` wants `America/Chicago`, the Google URL wants **UTC** — noon CDT is `170000Z`.
- Label in words, not an icon alone: *Agregar a mi calendario* / *Add to my calendar*.

### 9.6 Deadline

Display *"Confirma antes del 15 de agosto de 2026."* Keep accepting submissions after that date — a late RSVP is more useful than none.

---

## 10. Bilingual implementation

Single `i18n.js` with one object, and `data-i18n` attributes in the HTML:

```js
const t = {
  es: { promptOpen: 'Oprima el sobre para ver la invitación', misa: 'Misa', /* … */ },
  en: { promptOpen: 'tap the envelope to open your invitation', misa: 'Mass', /* … */ }
};
```

- On toggle, walk `[data-i18n]` and swap `textContent`; handle `[data-i18n-aria]` for labels and `[data-i18n-placeholder]` for inputs.
- Update `document.documentElement.lang` — this changes hyphenation and tells screen readers which voice to use.
- Persist choice in `localStorage`.
- **Default language: Spanish**, with the option to auto-detect via `navigator.language.startsWith('es')`. Auto-detect is a nice touch but do keep the manual toggle prominent — phone language often doesn't match reading preference.
- **Don't translate:** proper nouns (*St. Ambrose Catholic Church*, *Champions Ballroom*), street addresses, or names. Do translate dates (`29 de agosto del 2026` → `August 29, 2026`) and times (`12:00PM` is fine in both).
- Layout must survive length changes: *"Bendición de los alimentos"* is far longer than *"Blessing of the Meal"*, and *"Código de Vestimenta"* vs *"Dress Code"* is nearly double. Test both languages at 320px width.

### Copy deck

Spanish transcribed from your mockup; English drafted — please review, since the tone should sound like your family.

| Key | Español | English |
|---|---|---|
| eyebrow | MIS XV AÑOS | MY QUINCEAÑERA |
| date | 29 de agosto del 2026 | August 29, 2026 |
| countdown labels | DÍAS / HORAS / MINUTOS / SEGUNDOS | DAYS / HOURS / MINUTES / SECONDS |
| intro | Ha llegado un momento muy especial en mi vida, un día en el que he soñado con alegría y emoción… | A very special moment in my life has arrived — a day I have dreamed of with joy and excitement… |
| blessing | Con la bendición de mis padres, | With my parents' blessing, |
| parents | José Arturo y María de Jesús Mendoza | *(unchanged)* |
| — | **Names carry accents in both languages.** `José`, `María`, `Jesús`, `Anahí` are spelled identically in the English version — a name isn't translated or stripped. This applies to the `alt` text on the three name images too. | |
| siblings label | y mis hermanos, | and my siblings, |
| siblings | Lizeth Alejandra y David Arturo Mendoza | *(unchanged)* |
| invite line | nos complace invitarle a ser parte de este día tan especial | we are delighted to invite you to be part of this very special day |
| misa | Misa | Mass |
| recepcion | Recepción | Reception |
| map button | Ver ubicación | Get directions |
| itinerary heading | Itinerario del Evento | Event Itinerary |
| dinner | Cena | Dinner |
| blessing of meal | Bendición de los alimentos | Blessing of the Meal |
| — | **The 7:00 PM blessing inside the 6:00–8:00 PM dinner window is deliberate**, not a typo. Guests arrive gradually after the 6:00 PM reception start, so the blessing is held at seven once most people are seated. Render the itinerary exactly as given and do not reorder it. | |
| presentation | Presentación + Vals | Presentation + Waltz |
| dancing | Baile + Celebración | Dancing + Celebration |
| dress code heading | Código de Vestimenta | Dress Code |
| dress code body | Amablemente solicitamos a nuestros invitados que se abstengan de vestir los colores rosa y dorado, ya que están reservados exclusivamente para la quinceañera | We kindly ask our guests to avoid wearing pink and gold, as these colors are reserved exclusively for the quinceañera |
| gifts heading | Regalos | Gifts |
| gifts body | ¡Su presencia es el regalo más significativo para nosotros! Sin embargo, si desea tener un detalle con la quinceañera, se agradece profundamente 💵✉️ | Your presence is the most meaningful gift of all! If you would like to give something to the quinceañera, it is deeply appreciated 💵✉️ |
| rsvp body | ¡Su presencia es muy importante para nosotros! Les solicitamos amablemente confirmar su asistencia antes del 15 de agosto de 2026 | Your presence means so much to us! Please kindly confirm your attendance by August 15, 2026 |
| rsvp button | CONFIRMAR ASISTENCIA | RSVP |
| closing | Gracias por acompañarnos y por ser parte de este momento tan importante de mi vida | Thank you for joining us and for being part of this important moment in my life |
| signoff | Con mucho cariño, | With much love, |

**Copy is approved and final.** Both languages have been reviewed and signed off by the client — implement the deck verbatim, including the accents on names in the English column. Any wording change goes back to the client first.

**No padrinos / madrinas / court of honor section.** The client has confirmed there is no court. Build the section order in §7.2 exactly as listed — nothing to add.

---

## 11. Privacy and deployment

### Privacy

The page publishes a 15-year-old's full name, her parents' and siblings' names, her church, the venues, and an exact date and time, on a public URL.

- `robots.txt` with `Disallow: /`, plus `<meta name="robots" content="noindex, nofollow">`.
- **No Open Graph image containing her photo.** The preview renders in every group chat the link is forwarded to. Use the envelope graphic.
- The RSVP Sheet holds guests' phone numbers. It must not be "anyone with the link."
#### URL strategy: what actually protects the page

Three measures get proposed. They are not equally effective.

**1. `noindex` + `robots.txt` — do it. Highest value per effort.**
Search engines are how a stranger would realistically stumble onto this. Removing that removes essentially all passive discovery. It does nothing against someone who already has the URL, but nobody has the URL unless it was shared with them.

**2. A random path (`misquincejessica.com/a7f3k9`) — worth doing, with caveats.**
This is obscurity, not access control, but obscurity is a reasonable fit here: the threat isn't a determined attacker, it's casual discovery. A 6+ character random path is not going to be guessed.

Two things to understand before relying on it:

- **The bare domain is public no matter what.** Every HTTPS certificate issued is published to Certificate Transparency logs, which are open, permanent, and searchable by anyone at crt.sh. `misquincejessica.com` will appear there the moment the certificate is issued. So the *domain* is discoverable; the random path is what stays private. That's fine — but it means the root cannot be treated as secret, and a "cute domain name" is itself a small disclosure (it announces that a girl named Jessica is having a quinceañera).
- **A public repo exposes the path** in its file tree. The client has weighed this and isn't concerned, which is reasonable: finding the repo requires already knowing the GitHub username, and nobody browsing GitHub is looking for a quinceañera. Noted so it stays a decision rather than a surprise.

Also expect some leakage through normal use: link previews in WhatsApp and iMessage fetch the URL server-side, browser history syncs across devices, and anyone who forwards the link forwards the path. None of that is alarming, but the path will circulate more widely than the guest list.

**3. Phone lookup on the bare domain — this works, with an important correction.**

An earlier draft of this spec said a phone gate was security theater. That objection was about a *different* design: one page containing the invitation, with JavaScript hiding it until a phone number is entered. That version genuinely doesn't work — the names, venues, and times are in the HTML the moment the page loads, and View Source or disabling JS reveals everything.

**The two-URL version is different and is sound:**

- `misquincejessica.com/a7f3k9` — the invitation. This is the link guests receive.
- `misquincejessica.com` — a separate, nearly empty page. Her name in script, "Mis XV Años," and a phone field. **It contains no venues, no times, no family names, no addresses.** There is nothing on it to hide, so there is nothing JavaScript can fail to hide.

Entering a phone number calls the existing Apps Script lookup (§9.3). On a match, redirect to the real path. On a miss, a polite line asking them to use the number their invitation was sent to.

Why this holds up where the single-page version didn't: the secret being protected is the **path**, and the path never reaches the browser until the server has matched the number. Nothing is hidden client-side, because nothing sensitive was ever sent.

**What it actually buys, honestly.** Very few strangers will ever hit the bare domain — it's reachable mainly through CT logs or someone guessing the domain name outright. The security value is real but small. **The bigger win is link recovery:** a guest who deleted the text, got a new phone, or is searching their messages six weeks later can retrieve the invitation themselves instead of texting the client. Build it for that reason and treat the friction-for-strangers as a bonus.

**Friction accounting**, which is the actual design goal:

| Who | Experience |
|---|---|
| Invited guest, has the text | Taps the link. Sees the invitation. **Zero friction — never encounters the phone field at all.** |
| Invited guest, lost the link | Types the domain, enters their number, arrives. Self-service, no text to the host. |
| Stranger who guessed the domain | A name and "Mis XV Años." No date, no venue, no addresses. Nothing to act on. |

That is exactly the asymmetry being asked for, and it's achievable because the two audiences arrive by different routes.

**Implementation notes:**
- The bare-domain page needs its own `noindex` too.
- Reuse the §9.3 `GET` endpoint — no new backend.
- Never return the path on a miss, and don't reveal *why* a lookup failed.
- Add a short delay (~400ms) on failed lookups. Won't stop a determined script, but it makes idle guessing tedious.
- Keep it visually consistent with the invitation — same marble, same fonts — so guests who land there know they're in the right place.
- **Don't put the path in a client-side redirect table.** The response must come from the server per lookup.

**4. A URL shortener (bit.ly, TinyURL) in front of the random path — no. It undoes the random path.**

The appeal is understandable: a short link is tidier than `misquincejessica.com/a7f3k9`. But it moves the secret from a path the client controls to a token a third party controls, and those tokens are short enough to be scanned exhaustively.

<cite index="18-1">Cornell Tech researchers demonstrated that the 5-, 6-, and 7-character tokens used by bit.ly and goo.gl are small enough a space to be swept by brute force</cite>. <cite index="13-1">Their scan of shortened OneDrive links found roughly 1.1 million publicly reachable documents, and a scan of shortened Google Maps links surfaced nearly 24 million live URLs, a tenth of which were driving directions to sensitive places</cite>. Providers have since hardened *new* links, but the underlying point stands and generalizes: a random path on your own domain sits in a search space of billions; a bit.ly token sits in one that has been publicly demonstrated to be scannable end to end. **Shortening an unguessable URL makes it guessable.**

Four more reasons, any one of which would be sufficient here:

- **It doesn't hide the destination.** A shortener redirects. The real URL lands in the address bar, browser history, and any link-expander site. Nothing is concealed — the short token is simply a second, weaker key to the same door.
- **It hands a third party your guest log.** Bit.ly records every click: timestamp, IP, referrer, device. That's a marketing analytics company holding a log of who opened a 15-year-old's invitation and when. Strictly worse than the status quo, where nobody but the host has that.
- **Shortened links in bulk SMS get filtered as spam.** This is the practical killer given the distribution plan in the checklist. Carriers treat shortened links in unsolicited-looking texts as a strong spam signal, and messages get silently dropped. A recognizable personal domain is far likelier to be delivered *and* to be trusted — a text from an unfamiliar number containing a bit.ly link looks exactly like phishing, which is precisely the instinct guests should have.
- **It adds a dependency that can outlive its usefulness.** Free-tier terms change, accounts lapse, links get disabled. If the shortener breaks, every invitation already sent breaks with it. The client owns the domain; they don't own the short link.

**If a memorable link is genuinely wanted**, the right tool is a QR code pointing at the long URL — ideal for anything printed, and it doesn't matter how ugly the destination is because nobody types it. And nobody types the texted link either: they tap it. The path's ugliness costs nothing.

**Recommended stack:** random path on the client's own domain → phone lookup on the bare domain → `noindex` + `robots.txt` on both → no OG image with her photo → no URL shortener → don't post the link publicly on social media.

**Ranked by how much each actually contributes.** The threat model here is specific, and the client has confirmed it: they found other families' quinceañera sites by **typing plausible quinceañera-related domain names into a browser**, not through search. Domain guessing, not indexing, is the vector to design against.

That reordering matters, because `misquincejessica.com` is exactly the kind of name that gets guessed — an obvious pattern plus a common first name. **Assume the bare domain is reachable by strangers. Do not treat it as obscure.**

1. **Phone lookup on the bare domain.** Answers the actual threat directly. Someone who guesses the domain gets a name and a phone field — no date, no venues, no addresses. Load-bearing.
2. **Random path.** Ensures guessing the domain doesn't also yield the invitation. These two work as a pair: the path makes the content unreachable, the bare page makes the guess unrewarding.
3. **Don't post the link publicly.** Free, and defeats everything above if ignored.
4. **`noindex` + `robots.txt`.** Still do it — closes the search path and stops an SEO footprint accumulating — but it does nothing against domain guessing, so it isn't the primary defense here.
5. **No OG image with her photo.** Keeps her face out of forwarded link previews.
6. **Private repo.** Client has weighed this and isn't concerned; reasonable, since finding the repo requires already knowing the GitHub username.

#### Routing: how the two pages coexist

Pure file placement on GitHub Pages. No server config, no redirect rules:

```
/index.html              ← bare domain. Name, "Mis XV Años", phone field. Nothing else.
/a7f3k9/index.html       ← the invitation. This is the texted link.
/assets/…                ← shared by both
```

`misquincejessica.com` serves the root `index.html`. `misquincejessica.com/a7f3k9/` serves the invitation — Pages resolves a directory to its `index.html` automatically and redirects `/a7f3k9` to `/a7f3k9/` on its own.

- On a successful lookup: `window.location.replace('/a7f3k9/')`. Use `replace`, not `href`, so the gate page doesn't sit in history and trap the back button.
- Both pages need their own `noindex` meta tag. `robots.txt` at the root covers the domain.
- The gate page shares the marble background and fonts, so a guest landing there knows they're in the right place.
- Keep it light — for some guests this is the first thing they load, possibly on a bad connection.
- **Choose a path that isn't a dictionary word** and isn't derived from her name or the date. `a7f3k9` is fine; `jessica15` defeats the purpose.

- **GitHub Pages on the free plan only publishes from a public repo**, which makes the source and full commit history browsable. Either the client upgrades to Pro (~$4/mo, cancel after), moves to Cloudflare Pages (free, private repos), or accepts it.

**On the Apps Script endpoint URL — correcting an assumption worth stating plainly:** keeping it out of a public repo achieves almost nothing. The site is static and calls the endpoint from client-side JavaScript, so the URL is in `script.js` on the live site regardless. Any guest can open dev tools and read it in five seconds. **Treat the endpoint as public and secure it on the server side**, rather than pretending the URL is a secret.

What someone with the URL can actually do:

| Can they? | Outcome |
|---|---|
| Submit fake RSVPs | **Yes.** Junk rows in `Respuestas`. The realistic worst case, and it's a spreadsheet — sort by timestamp and delete. |
| Look up whether a phone number is on the guest list | **Yes.** This is §9.2's enumeration point. |
| Read the Sheet directly | **No.** The Sheet's own sharing stays restricted. The script is the only door, and it only does what `doGet`/`doPost` are written to do. |
| Delete or edit existing rows | **No**, provided `doPost` only appends. Do not write an update or delete path. |
| Reach the owner's other Google data | **No.** *Execute as me* grants the script the owner's permissions, but only along the code paths that exist. |
| Exhaust the daily Apps Script quota | **In theory.** Sustained flooding would break the form until the quota resets. No motive exists here. |

Because the endpoint is effectively public, the script must not trust anything the client sends:

- **Append only.** `doPost` writes one row to `Respuestas` and nothing else. No update, no delete, no dynamic sheet or range names.
- **Re-check the allotment server-side.** The client caps `adultos + niños` at the allotment; the script must verify it again against `Invitados`. Client-side limits are a UI convenience, never enforcement.
- **Whitelist fields.** Read only the expected parameters and ignore extras. Never write a supplied value into a cell reference or formula position.
- **Clamp lengths.** Cap the message field (say 500 chars) and reject non-numeric counts, so nobody can bloat the Sheet.
- **Add a honeypot** — a hidden field real guests never fill. If it's populated, return `{ok: true}` and discard. Stops naive bots at near-zero cost.
- **Sheets keeps version history**, so accidental or malicious mass entry is recoverable via File → Version history.

None of this is exotic — it's roughly ten extra lines in the script, and it means the public repo question becomes a preference about source visibility rather than a security decision.

### Deploy

1. Repo root holds `index.html` (the phone-lookup page) and `/a7f3k9/index.html` (the invitation) — see Routing above. Add an empty **`.nojekyll`** — without it Pages runs Jekyll, which silently ignores files beginning with `_`.
2. Settings → Pages → Deploy from branch → `main` / root.
3. Custom domain: apex needs four `A` records (`185.199.108.153`, `.109.153`, `.110.153`, `.111.153` — verify against GitHub's current docs at deploy time); `www` needs one `CNAME` to `username.github.io`. Point both, redirect one.
4. Enter the domain in Settings → Pages. GitHub commits a `CNAME` file — leave it.
5. **Wait for DNS to propagate before ticking Enforce HTTPS.** The certificate can take 24 hours and the checkbox stays greyed out until issued.
6. Verify the domain under account settings (TXT record) so nobody else can claim it.

Limits: 1 GB site, 100 GB/month soft bandwidth, 10 builds/hour. Nowhere close.

### Test matrix

| Test | Why |
|---|---|
| **iPhone Safari, real device** | Audio autoplay, `100dvh`, `clip-path`. **This is the one that breaks.** |
| Android Chrome, real device | Sparkle frame rate on mid-range hardware; `.ics` download behavior. |
| Slow 3G throttle | Envelope must appear within ~3s. |
| iOS silent / low-power mode | Music blocked — confirm the fallback button appears. |
| Landscape | Envelope must not overflow. Hero must fall back to auto height (§7.2a) rather than overlapping. |
| Short viewport (~500px tall) | Hero titles and countdown must not collide. |
| Desktop 1280px and 1920px | Card centered, marble not stretched, hover states present. |
| Half-width window (~700px) | Lands on the 768px breakpoint — check both sides of it. |
| **Pull-down at top, Android Chrome** | Must trigger the return transition, **not** a page refresh. `overscroll-behavior-y: contain` is the fix. |
| iOS status-bar tap | Jumps to top. Must *not* fire the return transition. |
| 320px width (iPhone SE) | Both languages, no horizontal scroll. `Código de Vestimenta` is the stress case. |
| `prefers-reduced-motion: reduce` | Cross-fade path works. |
| Keyboard only | Envelope, toggles, modal all reachable and closable. |
| **RSVP round trip on the live URL** | Known phone → allotment shown → submit → row lands. Then unknown phone → fallback path. Then break the endpoint → SMS fallback appears with input preserved. |

---

## 12. Build order

Each step is independently testable and unblocked by the others.

1. Scaffold, tokens, fonts, backgrounds. Get type and color right first.
2. Screen 1 static, then its load sequence.
3. Screen 2 static, all sections, both languages, correct at 320px. **No animation yet.**
4. `i18n.js` + language toggle.
5. Countdown, including the post-event state.
6. Scroll reveals + itinerary sparkles.
7. Sparkle transition + audio. **Test on a real iPhone before continuing.**
8. RSVP modal UI against a mocked endpoint.
9. Wire the real Apps Script endpoint; test on the deployed URL.
10. Desktop layout (§7.8) — a media query pass, not a redesign.
11. Image optimization, `noindex`, full test matrix, deploy.
12. **Last:** return-to-envelope pull gesture (§7.7). Pure delight, zero necessity. Cut it if the calendar tightens.

**Timeline:** the event is ~5 weeks out and RSVPs are due in ~3. Steps 1–5 plus a plain SMS-link RSVP is a complete, sendable invitation. If time compresses, ship that and add the transition later — same URL, so guests who already have the link get the update.
