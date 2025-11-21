# AI Agent Operating Manual

This document is written **for AI coding agents running inside Cursor or similar environments**. Follow it as a checklist every time you touch the repo. Deviating without justification is considered a regression.

## Mission Context
- The site is a Lando-Norris-inspired, animation-heavy academic portfolio built on Jekyll + Minimal Mistakes with bespoke GSAP/Three.js layers.
- Your highest-leverage work is to **expand capability without breaking motion, accessibility, or academic credibility**.
- These READMEs are the system of record. **Whenever code or process changes, update the appropriate README _in the same PR_.**

## Golden Rules
1. **Stay Oriented:** First read `README.md`, skim git status, and note the active branch (`cursor/consolidate-and-enhance-repository-readmes-for-ai-2c04`).
2. **Preserve Motion Contracts:** Never ship changes that disable Lenis, GSAP ScrollTrigger, or Three.js unless the feature flag explicitly calls for it.
3. **Traceability:** Reference file paths, commands, and decisions inside commits/PRs; link back to the relevant README section when possible.
4. **Documentation Debt = Bug:** Refuse to merge functionality that is undocumented. Update the READMEs before declaring a task done.
5. **Respect Accessibility:** All motion features must respect `prefers-reduced-motion`; test in reduced-motion mode when editing animation code.

## Operating Sequence per Task
1. `git status` → confirm clean worktree or understand outstanding edits.
2. Read the section of `README_FUNCTIONALITY.md` or `README_DESIGN.md` that matches the change you plan.
3. Implement changes in small, reviewable commits. Keep `bundle exec jekyll serve` or `npm run watch:js` running for feedback.
4. Run verification scripts:
   - `bundle exec jekyll build` (production parity)
   - `npm run build:js` (if any JS changed)
   - `python scripts/generate_map.py` (if data viz touched)
   - `node scripts/visual-check.mjs` (before animation-heavy merges)
5. Update READMEs and cite the exact sections you touched inside commit messages when possible.
6. Re-run targeted tests, capture screenshots/logs in `tmp/` if helpful, then push.

## Toolchain Reference
| Layer | Location | Key Commands |
| --- | --- | --- |
| Ruby/Jekyll | `Gemfile`, `_config*.yml` | `bundle install`, `bundle exec jekyll serve --config _config.yml,_config.dev.yml` |
| Node build/visual diff | `package.json`, `scripts/visual-check.mjs` | `npm install`, `npm run build:js`, `node scripts/visual-check.mjs` |
| Python data utilities | `requirements.txt`, `scripts/*.py`, `markdown_generator/` | `pip install -r requirements.txt`, `python scripts/generate_map.py`, `python scripts/sync_sheet_data.py` |

### Local Environment Bootstrapping
```bash
# Ruby + Node + Python dependencies
bundle install
npm install
python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt
```

### Serving Locally with Motion Enabled
```bash
JEKYLL_ENV=development bundle exec jekyll serve --livereload --config _config.yml,_config.dev.yml
```
Leave this running so GSAP/Three.js assets are available at `http://localhost:4000` for `scripts/visual-check.mjs`.

## Collaboration & Handoff Protocol
- **Change Log Discipline:** Update `CHANGELOG.md` when your work is user-facing. Even in AI-to-AI handoffs, create narrative entries referencing PR numbers.
- **Screenshot Evidence:** Drop responsive screenshots into `tmp/screens/` using the Playwright visual check when modifying layout or animation cadence.
- **Telemetry Awareness:** Google Analytics (UA) is wired in `_config.yml`. When adding new interactions, emit events via `assets/js/_main.js` hooks instead of ad-hoc inline snippets.
- **Map Data Safeguards:** Community map coordinates are obfuscated. Any data import must preserve `original_lat`/`original_lng` keys and re-randomize via `randomize_location` in `scripts/generate_map.py`.

## Documentation Stewardship
- `README_DESIGN.md` → update when you change motion, branding, layout, theming, or add visual tech.
- `README_FUNCTIONALITY.md` → update for new features, pipelines, scripts, or infrastructure.
- `README_CONTENT.md` → update for changes to authoring workflows, data schemas, or content governance.
- `README_AI_AGENT.md` (this file) + `README.md` → update whenever process expectations change.
- **Never leave a README stale.** If you lack time, create a TODO in this repo and reference it in the PR description.

## Decision Records & Research
- When the user requests "deep research," summarize insights inline (cite public knowledge or reasoning) and note unknowns as open questions.
- Record risky design experiments (e.g., new GSAP plugins, shader experiments) under a `## Experiments` heading inside the relevant README until stabilized.

## Common Recovery Playbooks
- **Broken animations:** Check console for Lenis/GSAP availability; compare against `assets/js/motion-core.js` expectations.
- **Layout shift or overflow:** Run `node scripts/visual-check.mjs` and inspect `tmp/screens/diagnostics.json` for offending selectors.
- **Map regressions:** Re-run `python scripts/generate_map.py` and open `assets/maps/community_map.html` locally before committing.

Stay methodical, keep READMEs current, and treat this repo as a high-availability system. EOF
