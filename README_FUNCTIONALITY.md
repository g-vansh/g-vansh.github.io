# Functionality Readme — Systems & Implementation

This manual walks through the operational surface area of the site: build stack, dynamic features, data flows, automation scripts, and validation routines. Reference it whenever you plan to modify or extend functionality.

## Stack Overview
| Layer | Files | Notes |
| --- | --- | --- |
| **Static Site** | `Jekyll 3.8+`, `_config.yml`, `_layouts/`, `_includes/` | Minimal Mistakes base, custom collections (publications, talks, teaching, portfolio, affiliations). |
| **Styling** | `_sass/**/*.scss`, `assets/css/main.scss` | Modular SCSS, mobile overrides in `_sass/_mobile.scss`, kinetic theme in `_sass/_kinetic-theme.scss`. |
| **JavaScript** | `assets/js/*.js` | Custom motion engine (`motion-core.js`), Three.js background, Leaflet research map, research stats, bundle entry `_main.js` → `npm run build:js`. |
| **Data + Automation** | `markdown_generator/`, `scripts/*.py`, `scripts/*.sh` | Converts TSV → Markdown, generates Folium community map, syncs Google Sheet data, runs link/image checks. |
| **Testing & Diagnostics** | `scripts/visual-check.mjs`, `scripts/check-broken-links.sh` | Playwright screenshots + overflow diagnostics, wget-based link validation. |

## Build & Development Commands
```bash
# Install dependencies
bundle install
npm install
python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt

# Serve with dev overrides
bundle exec jekyll serve --livereload --config _config.yml,_config.dev.yml

# Build for production
JEKYLL_ENV=production bundle exec jekyll build

# JS pipeline
npm run build:js      # uglify vendor + custom JS
npm run watch:js      # rebuild on change

# Visual regression (requires server @ :4000)
node scripts/visual-check.mjs
```

## Feature Modules
### 1. Academic Collections
- **Posts (`_posts/`), Publications (`_publications/`), Talks (`_talks/`), Teaching (`_teaching/`), Portfolio (`_portfolio/`), Affiliations (`_affiliations/`).**
- Metadata handled through YAML front matter; defaults configured in `_config.yml` for layout, author profile, sharing, comments.
- Liquid templates like `_includes/archive-single.html`, `_includes/affiliations.html`, `_layouts/talk.html` format collection output.

### 2. Motion Engine (`assets/js/motion-core.js`)
- Initializes Lenis smooth scrolling and GSAP ScrollTrigger (checks availability + `prefers-reduced-motion`).
- Splits hero name into `.hero-char` spans, runs intro timeline, loops floating animation, and glows text shadow.
- Provides `.reveal-on-scroll`, `.kinetic-text`, `.parallax-image`, card hover lifts, button scale, sidebar/footer entrances.
- Exposes `window.academicKinetic` with `destroy()` for disabling motion during debugging or reduced-motion toggles.

### 3. Three.js Particle Background (`assets/js/three-background.js`)
- Creates fixed canvas inserted before `<body>` content.
- Spawns 800 (desktop) / 300 (mobile) additive particles with neon color distribution.
- Responds to mouse movement for parallax tilt; respects reduced-motion preference and hero-section gating.

### 4. Research Network Map (`assets/js/research-map.js`)
- Leaflet map with Carto dark/light tiles, theme toggling via `prefers-color-scheme` listeners.
- Responsive height via CSS custom property `--research-map-height` adjusted on resize/orientation.
- MarkerCluster groups for education/coauthors/talks with neon cluster icons and responsive sizes.
- Popups include YAML-driven metadata (degree, venue, projects) defined inline inside the JS file for now.

### 5. Community Map Pipeline (`scripts/generate_map.py`, `scripts/sync_sheet_data.py`, `assets/maps/community_map.html`)
- Uses Folium + geopy to geocode addresses, randomize coordinates within 1.5km, and render map HTML with responsive CSS/pulse animations.
- `scripts/sync_sheet_data.py` pulls Google Sheet JSON (`SHEET_URL` env var) and calls `generate_map()` when new entries detected.
- Produced map lives in `assets/maps/community_map.html` and is embedded via `_pages/community-map.md` using an iframe/snippet.

### 6. Markdown Generator (`markdown_generator/`)
- TSV + Jupyter notebooks convert spreadsheet-style data into Markdown for `_publications`, `_talks`, etc.
- Python scripts inside folder (e.g., `markdown_generator.py`) abstract repeated metadata creation. Run from repo root with `python markdown_generator/generate.py` (check notebooks for parameters).

### 7. Commenting + Analytics
- Staticman configuration baked into `_config.yml` for Git-based comment submissions.
- Google Analytics Universal tracking ID `471879646` configured. Additional events should be added via `assets/js/_main.js` to avoid inline script duplication.

### 8. Sitemap, SEO, and Schema
- `_includes/seo.html` + `jekyll-sitemap` plugin produce meta tags and XML sitemap.
- `_includes/publication-schema.html` injects JSON-LD for scholarly articles per page.

## Automation & Utilities
| Script | Purpose | Invocation |
| --- | --- | --- |
| `scripts/check-broken-links.sh [URL]` | Recursively spider site for broken links via `wget`; output stored under `tmp/broken-links-check/`. | `bash scripts/check-broken-links.sh https://www.vansh-gupta.com` |
| `scripts/optimize-images.sh` | Resizes, optimizes, and produces WebP/responsive variants using ImageMagick, optipng, jpegoptim. Outputs to `images/optimized/`. | `bash scripts/optimize-images.sh` |
| `scripts/visual-check.mjs` | Playwright crawler that scrolls through key routes at desktop/tablet/mobile breakpoints, saves screenshots and overflow diagnostics to `tmp/screens/`. | `node scripts/visual-check.mjs` |
| `scripts/generate_map.py` | Generates `assets/maps/community_map.html` and `assets/data/community_map_data.json`. | `python scripts/generate_map.py` |
| `scripts/sync_sheet_data.py` | Pulls Google Sheet JSON and updates community map data. Requires `SHEET_URL`. | `SHEET_URL=... python scripts/sync_sheet_data.py` |

## Testing & Quality Gates
1. **Build Check:** `JEKYLL_ENV=production bundle exec jekyll build` must pass before deployment.
2. **JS Bundling:** `npm run build:js` ensures minified `assets/js/main.min.js` matches new code.
3. **Maps:** Open `assets/maps/community_map.html` locally after regeneration to confirm styling + data accuracy.
4. **Visual QA:** Run Playwright script; inspect `tmp/screens/diagnostics.json` for overflow > 0.
5. **Accessibility:** Toggle DevTools reduced-motion emulation; confirm hero text and navigation remain legible without JS/motion.
6. **Link Health:** Run `scripts/check-broken-links.sh` at least before major releases.

## Deployment & Hosting Notes
- Hosted on GitHub Pages with `github-pages` gem; `JEKYLL_ENV=production` builds replicate server environment.
- Custom domain configured via `CNAME`. Ensure DNS updates propagate before toggling URLs.
- `_config.dev.yml` disables analytics + compresses CSS differently; always restart `jekyll serve` after editing config files.

## Extending Functionality Safely
- **New Collections:** Add to `_config.yml` under `collections`, create `_collection-name/`, add layout defaults, update navigation via `_data/navigation.yml`.
- **JS Additions:** Write modular scripts in `assets/js/`, import or reference inside `_includes/scripts.html`, and rebuild via `npm run build:js`.
- **Data Pipelines:** Keep Python dependencies pinned in `requirements.txt`. When new scripts are added, document them here plus add CLI usage examples.
- **Third-Party APIs:** Document authentication/secrets strategy (env vars, GitHub Actions) in this file and avoid hardcoding keys.

Track every new subsystem inside this README so future agents can reason about interactions quickly.
