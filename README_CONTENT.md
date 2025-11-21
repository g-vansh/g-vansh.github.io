# Content Readme — Authoring & Data Governance

This manual explains how to add or update website content (posts, publications, maps, data, media) and which files control each surface. Follow it whenever you edit text, metadata, or assets.

## Content Taxonomy & Locations
| Content Type | Directory | Notes |
| --- | --- | --- |
| Blog posts | `_posts/YYYY-MM-DD-title.md` | Standard Jekyll posts with `layout: single`. |
| Pages | `_pages/*.md` | Standalone sections (about, CV, archive, maps). |
| Publications | `_publications/*.md` | Each file describes a paper/dataset. |
| Talks | `_talks/*.md` | Presentation records referencing venues and dates. |
| Teaching | `_teaching/*.md` | Courses, workshops, syllabi (front matter includes semester metadata). |
| Portfolio | `_portfolio/*.md` | Project highlights with `collection: portfolio`. |
| Affiliations | `_affiliations/*.md` | Organizations + metadata used by `affiliations.html` component. |
| Data tables | `_data/*.yml` | Navigation, UI text, affiliations list, authors, comments. |
| Assets | `images/`, `assets/`, `files/` | Media, compiled CSS/JS, PDFs. |
| Maps | `assets/maps/community_map.html`, `assets/data/community_map_data.json` | Generated via Python scripts. |

## Front Matter Templates
### Publication (`_publications/*.md`)
```yaml
---
title: "Incentivizing Innovation in Open Source"
collection: publications
permalink: /publication/sponsoring-innovation
date: 2024-02-01
venue: "NBER Working Paper"
paperurl: "https://doi.org/..."
citation: "Gupta et al. (2024)"
authors: "Vansh Gupta, Jorge Guzman, ..."
tags: [innovation, open-source]
excerpt: "GitHub Sponsors quasi-experiment..."
---
Body content in Markdown.
```

### Talk (`_talks/*.md`)
```yaml
---
title: "Strategy & Innovation"
collection: talks
type: "Talk"
permalink: /talks/strategy-innovation
date: 2023-07-15
location: "Columbia University"
venue: "Strategy & Innovation Seminar"
links:
  - label: Slides
    url: /files/strategy-innovation.pdf
---
```

### Teaching (`_teaching/*.md`)
Include `type`, `institution`, `semester`, `url` or downloads.

### Portfolio (`_portfolio/*.md`)
Add `excerpt`, `links`, `image` references (store images in `images/` and optimize first).

## Editing Workflow
1. **Create file** in the appropriate collection with correct naming convention.
2. **Add front matter** using templates above; keep `permalink` stable for existing pages.
3. **Write Markdown body** with headings, lists, etc. Use relative asset paths (`/images/...`).
4. **Preview locally** using `bundle exec jekyll serve --config _config.yml,_config.dev.yml`.
5. **Validate** that hero/sidebar metadata renders, navigation updates (if relevant), and dynamic components (maps, cards) still function.
6. **Document** any workflow changes here.

## Navigation & UI Text
- `_data/navigation.yml`: Controls main nav + footer menus. Each item accepts `title`, `url`, `description`, nested `children`.
- `_data/ui-text.yml`: Houses strings like button labels, disclaimers, map tooltips.
- `_data/authors.yml`: Defines co-author metadata for posts.
- `_data/affiliations.yml`: Bulk data for affiliation cards; coordinate with `_affiliations/*.md` entries.

### Editing Flow
1. Update YAML entries.
2. Run `bundle exec jekyll serve` to preview.
3. If you add new navigation sections, confirm responsive behavior under 768px via Playwright script.

## Media Management
1. **Optimization:** Run `bash scripts/optimize-images.sh` to create `images/optimized/` variants and WebP copies.
2. **Placement:** Store hero/profile images in `images/`, research figures in `images/research/`, large PDFs under `files/`.
3. **Referencing:** Use responsive `<picture>` tags or Minimal Mistakes includes where possible. Inline Markdown should reference optimized assets: `![caption](/images/optimized/filename-1200.jpg)`.
4. **Icons:** Font Awesome is already loaded; prefer using classes instead of embedding raw SVGs unless animation requires it.

## Community Map Content
- Data stored in `assets/data/community_map_data.json` (obfuscated coordinates + metadata).
- To add entries manually, append dicts with fields `name`, `number`, `house`, `batch`, `address`, `email`, `phone`. Run `python scripts/generate_map.py` to regenerate HTML.
- For Google Sheet ingestion, set `SHEET_URL` env var and run `python scripts/sync_sheet_data.py`. Script deduplicates by `name + number + batch` and records `original_lat/lng`.
- Map page `_pages/community-map.md` loads the generated HTML; ensure timestamp overlay updates after regeneration.

## Research Map Content
- Research map data currently embedded in `assets/js/research-map.js`. To add new education/coauthor/talk locations, append to the arrays `educationLocations`, `coauthorLocations`, `talksLocations`.
- Keep descriptions concise; multi-line strings should use template literals if needed.
- After editing, test locally and confirm cluster colors still align with type.

## Content Automation Tools
### Markdown Generator (TSV → Markdown)
1. Place TSV data in `markdown_generator/data/*.tsv`.
2. Update notebook or script parameters inside `markdown_generator/*.ipynb` / `.py`.
3. Run `jupyter notebook` or `python markdown_generator/generate.py` to output Markdown files into the right collection.
4. Review generated files, commit, and document process changes here.

### Talk Map
- `talkmap.py` geocodes `_talks/*.md` locations and writes Leaflet cluster maps into `talkmap/` directory. Run from repo root: `python talkmap.py` (ensuring dependencies like `getorg` and `geopy` are installed).

## Content QA Checklist
- **Link integrity:** `bash scripts/check-broken-links.sh http://localhost:4000` (adjust URL for staging/prod).
- **Images:** Confirm retina assets exist where needed; ensure `alt` text is descriptive.
- **Metadata:** Validate `_config.yml` author info, social links, analytics IDs after updates.
- **Maps:** Whenever `assets/data/community_map_data.json` changes, open `assets/maps/community_map.html` in browser to verify.
- **Feeds:** Confirm `/feed.xml` builds without errors (run `bundle exec jekyll build`).

## Publishing Workflow
1. Use feature branches; keep PRs scoped to a content theme (e.g., “Add Fall 2025 talks”).
2. Update relevant sections in this README (and others) if processes change.
3. Squash or rebase commits to keep history clean.
4. After merge, trigger GitHub Pages rebuild (automatic on main). If custom deployment required, document steps here.

Keep this document synchronized with real workflows so AI and human collaborators can confidently ship content updates.
