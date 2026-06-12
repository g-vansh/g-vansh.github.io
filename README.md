# vansh-gupta.com — An Atlas of Ideas

Personal site of Vansh Gupta (MIT Sloan). Hand-built static HTML + one CSS
file. No framework, no build step, no template.

## The idea

The research question is *where do ideas come from?* — so the site is designed
as a **field atlas**: survey-marker vermillion on cold paper, hand-drawn
contour lines, the research agenda typeset as a map legend, monospace
marginalia for dates and coordinates. Full rationale in
[docs/DESIGN.md](docs/DESIGN.md); canonical content in
[docs/CONTENT.md](docs/CONTENT.md).

## Structure

```
index.html          home: hero question → the surveyor → the legend → selected work
research.html       full typeset paper list
software.html       open-source instruments
cv.html             timeline + PDF
map.html            THE NETWORK: the career as a hand-drawn transit diagram
404.html            uncharted territory
assets/css/site.css the entire design system (~700 lines)
assets/js/atlas.js  field instruments: survey line, surfacing, cursor readout
assets/js/terrain.js the hero relief: 2D contour sheet rises into 3D (three.js)
assets/js/network.js the map sheet: seeded plate variation, station rail, cloud descent (three.js)
assets/vendor/      self-hosted three.js ES modules (the only dependency)
assets/fonts/       self-hosted Fraunces, Source Serif 4, IBM Plex Mono (woff2)
assets/favicon.svg  benchmark mark ⊕
files/              CV PDF
images/             profile photo
publications/ cv/ teaching/ community-map/ portfolio/
                    meta-refresh stubs for old Jekyll-era URLs
.nojekyll           GitHub Pages serves raw files
```

## Working on it

```sh
python3 -m http.server 8741        # then open http://localhost:8741
```

Rules of the house (see docs/DESIGN.md before changing anything):

- One display face (Fraunces), one text face (Source Serif 4), one mono
  (IBM Plex Mono). No new fonts.
- Vermillion `#d8260f` is the only accent and stays under ~5% of pixels.
- No cards, no shadows, no gradients. Motion is instrument-like: damped,
  scroll-paced or hover-triggered, always behind `prefers-reduced-motion`.
- JavaScript (`atlas.js`, `terrain.js`, `network.js`) is progressive
  enhancement only — every page must remain fully functional with JS
  disabled; the hero falls back to the hand-drawn SVG contours and the map
  sheet simply appears without the descent when WebGL is unavailable.
- Update the colophon stamp ("Last surveyed · …") when making real changes.

## Updating content

- **New paper** → copy a `.paper` article block in `research.html` (and
  `index.html` if it belongs in selected work).
- **CV** → replace `files/CV___Vansh_Gupta.pdf` and touch the timeline in
  `cv.html`.

The Nizam community map (Folium embed) was removed 2026-06; it lives in git
history if ever needed again. `map.html` is now the transit-map plate.

## History

The previous site (Jekyll / academicpages, with the F1 hero animation) lives
in git history on `master` prior to the `redesign-2026` branch merge. The
Jekyll sources still in this repo are inert (`.nojekyll`) and can be deleted
once the redesign has been live for a while.
