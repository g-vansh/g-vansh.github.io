# DESIGN.md — vansh-gupta.com redesign (2026)

> The single source of truth for every visual decision on this site.
> If a change can't be justified by the concept below, don't make it.

## 1. The concept: AN ATLAS OF IDEAS

Vansh's research question is *"where do ideas come from?"* — studied through four
lenses (incentives, place, genes, government). He is also, personally, a map
person: cartography, transit systems, urban design, the Nizam Map, two CRA
Innovation Awards for geospatial tooling, Brazil municipality research.

So the site is built as a **field atlas / survey document**: the territory being
surveyed is the origin of ideas. Every design element is cartographic or
working-paper marginalia — nothing decorative without a reason.

Concrete carriers of the concept:

- The research agenda on the home page is typeset as a **map legend**
  (symbol → lens → description).
- Metadata (dates, coauthors, venues, coordinates) is set in **monospace**,
  like plate annotations in an atlas margin.
- Section labels are mono index marks: `01 — RESEARCH`, `02 — SOFTWARE`.
- The footer carries real coordinates: `42.3608 N / 71.0843 W — CAMBRIDGE, MA`.
- Accent color is **survey-marker vermillion** — the red of benchmarks and
  triangulation marks on topo maps.
- Hero background: hand-drawn contour lines (inline SVG, low contrast,
  drifting almost imperceptibly).
- One easter egg: a low-opacity `LAST SURVEYED: <month year>` stamp.
  Reward attention; don't shout.

## 2. Design principles (distilled from research)

Extracted from landonorris.com, stella.earth, analoguegroup.org,
thinkinginpublic.net, resonantcomputing.org, socratic.salon:

1. **One loud typeface, one quiet one.** Never two personality fonts.
2. **Neutral field, one electric accent**, used for <5% of pixels.
3. **Huge statement, small everything else.** Lead with the research question,
   not "Welcome to my website."
4. **Text links, not cards.** Papers are a typeset list with hanging indents.
   Bento boxes + drop shadows are the #1 AI-slop tell.
5. **Asymmetry.** Corner-pinned hero text (Stella), off-center columns.
   Perfectly centered symmetric padding reads templated.
6. **Mono as a structural voice** for metadata only — never body text.
7. **One animation, done perfectly.** A single load fade + the contour drift.
   No scroll-jacking, no particles, no GSAP stagger-everything. (The old
   site's "epic hero" F1 cyberpunk system is exactly what we're deleting.)
8. **One tiny, cheap, charming imperfection** (the legend symbols are
   hand-drawn SVG, slightly irregular on purpose).
9. **Materiality**: faint paper grain on the light sections, printed-atlas
   ink (blue-black, not pure #000).
10. **Respect `prefers-reduced-motion`** — the drift stops, the fade stays.

### Banned (AI-slop tells)
Inter / Roboto / Poppins / Open Sans / Lora / Playfair. Terracotta, cream,
beige, sage. Purple gradients. Glassmorphism. Cards with `border-radius: 12px`
+ shadow. Emoji as icons. "Welcome to my corner of the internet."

## 3. Type system

| Role | Face | Notes |
|---|---|---|
| Display | **Fraunces** (variable) | `opsz` high, `WONK 1` on the hero only — the wonky alternates are the human fingerprint. Italics for emphasis. |
| Body | **Source Serif 4** | Working-paper warmth, real text face, 17–18px, line-height 1.6. |
| Meta/UI | **IBM Plex Mono** | 11–13px, letterspaced caps for labels. Dates, coauthors, nav, coordinates. |

Self-hosted woff2 (no Google Fonts request — privacy + speed + no FOUT flash).
Scale: hero clamp(3rem → 7.5rem). Section heads clamp(2 → 3.5rem). Meta 0.72–0.8rem.

## 4. Color system

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#191C24` | Blue-black printed-atlas ink. Dark sections' field, light sections' text. |
| `--paper` | `#F4F3EF` | Cold stone paper. NOT cream (no yellow cast). |
| `--paper-deep` | `#E9E8E2` | Secondary panels, hairline fills. |
| `--vermillion` | `#D8260F` | THE accent. Survey-marker red. Links-hover, legend symbols, active nav, selection. <5% of pixels. |
| `--graphite` | `#5B5E66` | Muted text, captions. |
| `--hairline` | `#D6D5CE` / `#2C303A` | Rules on paper / on ink. |
| `--contour` | `#262B36` | Contour lines on dark hero (barely visible). |

Dark hero + light body alternation = Lando energy without sporty cosplay.

## 5. Layout

- Max text measure ~68ch; the page grid is a 12-col with content set
  **off-center left** (cols 2–9 on desktop), mono marginalia floating in the
  right margin (col 10–12) like atlas plate notes.
- Hero: full viewport, ink field, name + coordinates pinned **top-left** in
  mono, the giant question bottom-left. Nav top-right.
- Sections numbered (`01`, `02`, …) with a hairline rule across.
- Footer = colophon: coordinates, "set in Fraunces, Source Serif & Plex Mono",
  the survey stamp, hands-free-biking line.

## 6. Motion

The site moves like a survey instrument: precise, damped, never decorative.
Every effect is gated behind `prefers-reduced-motion: no-preference`, uses
transform/opacity only, and degrades to a fully static page.

- Page load: single 1.1s fade-rise on hero text (staggered, 3 elements max);
  the masthead coordinates scramble-decode once (~0.4s, mono glyphs only).
- **The relief (index hero):** the flat contour sheet rises into a 3D
  topographic survey — Three.js plane, custom contour shader (iso-lines via
  fwidth with Golus grazing-angle clamping, 1:5 index-line convention,
  depth haze, vermillion benchmark pulsing on the NE summit). The terrain
  is erosion-weighted fBm with ridged, domain-warped crests, computed on
  the CPU at load (cooperatively yielded) and baked into one heightfield
  texture that drives displacement, contours, and an Imhof-style NW
  hillshade with ray-marched soft cast shadows — relief shading under the
  linework, fading in with the morph so the flat sheet stays unshaded.
  Sequenced reveal ~2.6s: relief rises first, camera tilts to ≈56°
  overlapping from 30%. Cursor steers the camera (lerp 0.06); scroll adds
  pitch. Pauses off-screen and on hidden tabs. Falls back to the
  hand-drawn SVG when WebGL/modules/motion are unavailable.
- Contour SVG (fallback only): 140s drift loop + cursor deflection — inner
  rings drift up to 6px, lerp-damped (fine pointers only).
- Cursor readout (site-wide): a small mono `⊕ lat/long` label follows the
  cursor on every page, ticking plausible coordinates around the Cambridge
  benchmark — longitude tracks the cursor, latitude drifts south as you
  scroll down the sheet. Exclusion-blended so it reads on ink and paper.
- The survey line: 2px vermillion route line across the top of the viewport,
  drawn by scroll progress (`animation-timeline: scroll(root)`; rAF fallback).
- Surfacing: `.section-rule`, `.paper`, `.tl-row`, `.legend-row` rise 14px as
  they enter the viewport — scroll-scrubbed natively (`view()` timeline),
  IntersectionObserver fallback elsewhere.
- The legend lives: on hover each symbol behaves like what it depicts —
  benchmark pings, triangulation station re-draws (stroke-dashoffset),
  river flows (dash march), built-up grid surveys itself in. Pure CSS.
- Crossing between sheets: cross-document view transitions
  (`@view-transition { navigation: auto }`), ~200ms crossfade; the ink
  masthead holds still via `view-transition-name`.
- Hover: links get vermillion underline thickening; paper-list benchmark
  dots fill vermillion. 150ms ease.
- **The descent (map sheet):** arriving at `/map.html` drops you through
  a deck of paper-coloured billboard clouds onto a contour terrain before
  the transit diagram fades in — Three.js again, ~3.4s, seeded bearing so
  the approach differs per visit, once per session (`sessionStorage`),
  skippable (Esc / wheel / touch), and skipped entirely under
  reduced-motion, hidden tabs, or missing WebGL. The country below uses
  the same baked-relief pipeline as the hero (erosion fBm + ridged
  crests; one grid feeds the GPU mesh and the JS benchmark height), with
  a darkening-only Lambert hillshade wash — no shadow march, because at
  map scale no slope outpaces a 45° sun. The landing plain is kept calm
  so the final approach reads as a settled valley.
- Seeded sheet variation: the map plate's rotation/offset, impression
  number, north-arrow bearing and label jitter re-roll on every load
  (mulberry32; presentation only — the network layout never moves).
- Nothing else. No smooth-scroll libraries, no scroll-jacking, nothing
  longer than ~700ms except the relief reveal, the map descent, and the
  user-paced scroll-bound effects. WebGL exists in exactly two places:
  the index hero and the map-sheet descent.

## 7. Tech rules

- **Zero UI frameworks, zero build step.** Hand-written HTML + one CSS file +
  three vanilla JS files (`assets/js/atlas.js`: scroll-line and surfacing
  fallbacks, coordinate decode, cursor readout; `assets/js/terrain.js`:
  the hero relief; `assets/js/network.js`: the map sheet — seeded plate
  variation, station rail panel, rolling stock (small trains running the
  lines, reduced-motion gated, paused off-screen and on hidden tabs),
  cloud descent with a mono altitude/bearing HUD). Jekyll removed.
- **Analytics**: one GTM container (`GTM-MW8X3NXK`) in the `<head>` of all
  six pages + noscript iframe after `<body>`. Nothing else. Ported from
  master, where GA4 lives inside the container.
- **SEO/GEO**: JSON-LD on every page — index carries an `@graph` of
  `WebSite` (`/#website`) + `Person` (`/#person`); the other sheets
  reference those nodes by `@id` (research = `CollectionPage` of
  `ScholarlyArticle`, software = `CollectionPage` of `SoftwareSourceCode`,
  cv = `ProfilePage`, map = `WebPage`). Plus `sitemap.xml`, `robots.txt`
  (AI crawlers explicitly welcomed; CSS/JS left crawlable) and `llms.txt`
  (plain-markdown site guide for language models).
- **One rendering dependency**: three.js, self-hosted as ES modules in
  `/assets/vendor/` (~180KB gz), loaded only by `terrain.js` (index hero)
  and `network.js` (map descent). No other libraries, ever.
- JS is progressive enhancement **only** — every page works with JS disabled
  and with `atlas.js` deleted.
- Self-hosted fonts in `/assets/fonts/`.
- Lighthouse targets: 95+ across the board.
- `.nojekyll` so GitHub Pages serves raw files.

## 8. Page map

| Page | Purpose |
|---|---|
| `index.html` | Hero question → who I am (3 short paragraphs, human voice) → THE LEGEND (4 lenses) → selected work (3 items) → colophon |
| `research.html` | Full typeset paper list: R&R / working papers / earlier & assistance work. Scholar link. Each project carries a hand-sketched SVG "field figure" (fig. 01–06): a stylized sketch of the headline finding, one vermillion mark each, `aria-hidden` (it restates the adjacent prose). |
| `software.html` | STE R package, Upload-to-Zenodo, the gazette-reading machine, the builder-researcher story |
| `cv.html` | Timeline (HTML) + PDF download |
| `map.html` | THE NETWORK — the career drawn as a Beck-style transit diagram (octolinear SVG, five lines, monochrome stroke grammar, one vermillion capsule at MIT). Entry via the cloud descent. |
| `404.html` | "Uncharted territory" |

The Nizam community map page was removed (2026-06); the transit-map plate
above replaced it (a map of Vansh's own).
