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

- Page load: single 1.2s fade-rise on hero text (staggered ~80ms across 3 elements max).
- Contour SVG: 120s linear drift loop (translate, not parallax). Paused under
  reduced-motion.
- Hover: links get vermillion underline thickening; paper-list items indent
  2px with a benchmark mark `⊙` appearing in the margin. 150ms ease.
- Nothing else. No scroll triggers.

## 7. Tech rules

- **Zero frameworks, zero build step.** Hand-written HTML + one CSS file +
  ~60 lines of vanilla JS (mobile nav, footnote year). Jekyll removed.
- Self-hosted fonts in `/assets/fonts/`.
- Every page works with JS disabled.
- Lighthouse targets: 95+ across the board.
- `.nojekyll` so GitHub Pages serves raw files.

## 8. Page map

| Page | Purpose |
|---|---|
| `index.html` | Hero question → who I am (3 short paragraphs, human voice) → THE LEGEND (4 lenses) → selected work (3 items) → colophon |
| `research.html` | Full typeset paper list: R&R / working papers / earlier & assistance work. Scholar link. |
| `software.html` | STE R package, Upload-to-Zenodo, Nizam Map, the builder-researcher story |
| `cv.html` | Timeline (HTML) + PDF download |
| `map.html` | Nizam community map (existing Folium embed) + form link |
| `404.html` | "Uncharted territory" |
