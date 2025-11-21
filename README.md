# Vansh Gupta Website — Master Readme

This repository hosts Vansh Gupta’s academic website: a Minimal Mistakes Jekyll build transformed into a Lando Norris–inspired, animation-rich experience powered by GSAP, Three.js, and Leaflet. The documentation is now split into **five AI-focused READMEs** so agents can specialize and keep knowledge current.

## How to Use the Documentation Set
| Manual | Purpose | When to Read |
| --- | --- | --- |
| [`README_AI_AGENT.md`](README_AI_AGENT.md) | Operating contract for AI agents (Cursor workflow, verification loops, documentation duties). | Before starting any task; whenever process expectations change. |
| [`README_DESIGN.md`](README_DESIGN.md) | Visual system, motion language, Lando Norris inspiration, future design research. | Styling, animation, branding, or UX changes. |
| [`README_FUNCTIONALITY.md`](README_FUNCTIONALITY.md) | Stack architecture, scripts, feature modules, testing routines. | Implementing or debugging functionality and automation. |
| [`README_CONTENT.md`](README_CONTENT.md) | Content workflows, front matter templates, map data governance. | Adding/updating posts, publications, maps, or data. |
| `README.md` (this file) | Big-picture orientation, quickstart commands, dependency graph, improvement loop. | First touch in a session; planning cross-cutting work. |

Always update the relevant manual **within the same PR** as your code change.

## Architecture Snapshot
- **Static Generator:** Jekyll + Minimal Mistakes with custom collections (`publications`, `talks`, `teaching`, `portfolio`, `affiliations`).
- **Styling:** Modular SCSS (`_sass/`), kinetic theme overrides, dedicated mobile stylesheet (`_sass/_mobile.scss`).
- **Motion Layer:** `assets/js/motion-core.js` (Lenis + GSAP) and `assets/js/three-background.js` (Three.js particle field).
- **Data Visuals:** Leaflet research map (`assets/js/research-map.js`), Folium-powered community map pipeline (`scripts/generate_map.py` → `assets/maps/community_map.html`).
- **Automation:** Markdown generator notebooks/scripts, Google Sheet sync (`scripts/sync_sheet_data.py`), QA utilities (Playwright visual check, wget link spider, image optimizer).
- **Deployment:** GitHub Pages (`github-pages` gem) with custom domain (`CNAME`) and analytics via Universal Analytics ID `471879646`.

## Quickstart Commands
```bash
# Install dependencies
bundle install
npm install
python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt

# Serve locally with dev overrides (analytics off, expanded CSS)
bundle exec jekyll serve --livereload --config _config.yml,_config.dev.yml

# Production build
JEKYLL_ENV=production bundle exec jekyll build

# JavaScript bundling & watch
npm run build:js
npm run watch:js

# Visual QA (requires server on :4000)
node scripts/visual-check.mjs
```

## Feature Inventory (High Level)
- **Hero & Navigation:** GSAP timelines split hero text into animated characters, masthead glides in with neon glow, and ScrollTrigger orchestrates reveals.
- **Three.js Atmosphere:** Particle system (800 desktop / 300 mobile) mirrors F1 telemetry lighting, responsive to pointer movement, disabled when `prefers-reduced-motion` is set.
- **Research Network Map:** Leaflet clusters stylized with neon rings, responsive heights, Carto dark/light tiles tied to OS theme preferences.
- **Community Map:** Folium + geopy pipeline randomizes alumnus coordinates for privacy, renders interactive HTML embedded in `_pages/community-map.md`.
- **Content Collections:** Publications, talks, teaching, portfolio, affiliations, and posts share consistent card layouts via `_includes/archive-single*.html`.
- **Automation Scripts:** Playwright screenshots (`scripts/visual-check.mjs`), link checker (`scripts/check-broken-links.sh`), image optimizer (`scripts/optimize-images.sh`), Markdown generators, Google Sheet sync.

See the specialty READMEs for deep dives and file-level instructions.

## Continuous Improvement Loop
1. **Plan:** Review open issues/user requests and consult the relevant README.
2. **Implement:** Work on a feature branch; keep `jekyll serve` or `watch:js` running for live feedback.
3. **Validate:** Run build/test commands from the Quickstart list plus any feature-specific checks (maps, screenshots, etc.).
4. **Document:** Update the READMEs touched by your change; cite sections inside commit messages when possible.
5. **Deploy:** Merge into main and let GitHub Pages rebuild; monitor analytics/telemetry for regressions.

Treat this repository like a high-availability system—changes must be traceable, tested, and documented for the next AI or human maintainer.
