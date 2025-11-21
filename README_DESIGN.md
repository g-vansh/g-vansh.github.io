# Design Readme — Neo-Racing System Inspired by Lando Norris

This site deliberately mirrors the high-energy, telemetry-driven feel of Lando Norris’s official website: neon palettes, kinetic typography, depth layers, and motion-controlled storytelling. Use this document to understand the current expression, the files that power it, and research-backed opportunities to evolve the visual language.

## Design Pillars
- **Neo Racing Aesthetic:** Neon lime (`#9bff1f`), cyan, and amber accents over charcoal backgrounds to mimic pit-lane lighting (`_sass/_kinetic-theme.scss` + CSS custom properties in `assets/css/main.scss`).
- **Kinetic Narrative:** GSAP + ScrollTrigger choreograph hero typography, card lifts, and scroll reveals (`assets/js/motion-core.js`).
- **3D Atmosphere:** Three.js particle field provides depth (`assets/js/three-background.js`).
- **Data-Grade Visuals:** Leaflet maps, research statistics, and affiliation grids resemble telemetry dashboards.
- **Accessible Motion:** All motion honors `prefers-reduced-motion` and falls back to static states.

## Core Visual Systems
### Hero & Masthead
| Feature | Location | Notes |
| --- | --- | --- |
| Split hero (name + subtitle) | `_includes/page__hero.html`, `_sass/_kinetic-theme.scss` | Auto-splits characters, animates via GSAP hero timeline; fallback opacity rules documented in prior fixes now built-in. |
| Floating navigation ribbon | `_includes/masthead.html`, `_sass/_kinetic-theme.scss` | Slide-in animation (`mastheadSlideIn`), hover glow, underline growth, blur/backface performance tricks. |
| Three.js canvas | `assets/js/three-background.js` | Fixed, pointer-events:none, 800 particles desktop / 300 mobile, uses additive blending and cursor-responsive rotation. |

### Typography & Color
- **Fonts:** Minimal Mistakes system stack for body; racing flair achieved via uppercase hero treatment and letter-level spans.
- **CSS Variables (root):** `--neo-bg`, `--neo-accent`, `--neo-cyan`, `--neo-amber`, `--neo-text`, `--neo-transition` (see `QUICK_REFERENCE_GUIDE.md` content now embedded here).
- **Breakpoints:** 480, 600, 768, 1024, 1280px mirrored in `_sass/_mobile.scss` and reused across SCSS partials.

### Motion Library
- **Scroll-triggered reveals:** `.reveal-on-scroll` components fade/translate in once with reversible triggers.
- **Card interactions:** `.bento-card`, `.echelon-card`, `.archive__item`, `.affiliation-card` share GSAP-driven lift + neon glow.
- **Hero kinetics:** hero letters rotateX, blur, and float indefinitely to mimic race telemetry waves.
- **Parallax hooks:** `.kinetic-text` (horizontal) and `.parallax-image` (vertical) rely on `data-speed` attributes so designers can script movement without extra JS.

### Map & Dashboard Styling
- Research map clusters styled with neon glows (education = amber, coauthor = cyan, talks = magenta) inside `_sass/_affiliations.scss` and `assets/js/research-map.js`.
- Community map uses Folium-generated HTML + appended CSS (`scripts/generate_map.py`) for thicker borders, pulse animations, and mobile-friendly popups.

### Responsive + Mobile Enhancements
- `_sass/_mobile.scss` enforces mobile-first typography (base 16px mobile, heading sizes bumped one scale), landscape sidebar adjustments, touch targets ≥44px.
- Map-specific CSS enforces smaller legends, responsive heights, and improved zoom controls on mobile.
- Playwright script (`scripts/visual-check.mjs`) scrolls pages to reveal lazy animations during QA screenshots.

## How to Change Visual Elements
1. **Color Palette:** Update SCSS variables in `_sass/_variables.scss` and CSS custom properties. Rebuild via `bundle exec jekyll build` to propagate.
2. **Hero Animation:** Edit timelines inside `assets/js/motion-core.js`. Keep animation durations ≤1.2s for intro, maintain float loop for subtle motion.
3. **Nav/Masthead:** Modify `_sass/_kinetic-theme.scss` for glow radius, drop-shadows, border gradients.
4. **GSAP Hooks:** Add classes (e.g., `.reveal-on-scroll`, `.kinetic-text`) to Markdown/Liquid templates for new sections; no JS change needed.
5. **Three.js Scene:** Adjust particle count or color ramp in `assets/js/three-background.js`. Respect reduced-motion gate and clean up listeners.
6. **Map Styling:** Update `.custom-cluster`, `.legend-container`, etc., within `_sass/_affiliations.scss` or Folium CSS strings.

## Deep Research: Lando Norris & Contemporary Racing Web Trends
- **Hero Telemetry Bars:** LandoNorris.com layers animated telemetry bars behind hero copy. Recreate using SVG `<pattern>` masks driven by GSAP timelines (consider `GSAP MotionPath` for curved strokes).
- **Split-Flap Schedules:** Race calendars flip numbers; implement with `GSAP Flip` or CSS `step-end` animations for schedule/talk timelines.
- **3D Vehicle Spotlights:** Embed GLTF car or helmet models using Three.js/GSAP combo (OrbitControls + ScrollTrigger scrub). Keep fallback hero image for low-power devices.
- **Track Outline Scroll:** Use SVG outlines of circuits as progress indicators tied to scroll using `ScrollTrigger` to color-stroke sections.
- **Noise/Grain Overlays:** CSS `mix-blend-mode: screen` with animated noise texture replicates carbon-fiber grit seen in motorsport branding. Host textures in `assets/images/noise/` and toggle via body class.
- **Micro-interactions:** Adopt `Rive` or `Lottie` for button hover glyphs (gear shift icons, throttle indicators) to mimic pitwall UI.
- **GSAP ScrollSmoother upgrades:** Evaluate ScrollSmoother/Flip for section-to-section transitions once perf budget confirmed.
- **WebGPU/Shader Possibilities:** Investigate animated driver number ("#4") extrusions or neon tube shaders via Three.js custom ShaderMaterial for hero backgrounds.

## Design QA Checklist
- Run `node scripts/visual-check.mjs` after modifying layout/animation to capture desktop/tablet/mobile screenshots.
- Confirm `prefers-reduced-motion` state by toggling DevTools > Rendering > Emulate reduced motion.
- Test breakpoints: 390×844, 768×1024, 1280×800, 1440×900.
- Validate color contrast (WCAG AA) after palette tweaks using browser devtools.
- Ensure hero text remains legible with fallback `.hero-name { opacity: 1 !important; }` guard from `_sass/_kinetic-theme.scss` when JS disabled.

## Future Design Opportunities
| Idea | Rationale | Implementation Sketch |
| --- | --- | --- |
| **Scroll-driven stats ribbon** | mimic Lando’s live race ticks; show KPIs (papers, citations, sponsors) | Build Liquid include that loops through `_data/ui-text` metrics, animate with GSAP `ScrollTrigger` horizontal loop |
| **Interactive race calendar** | align academic timeline with GP schedule vibes | Use `framer-motion`-style cards built with CSS Grid + GSAP Flip transitions |
| **Depth fog shader** | add atmosphere behind hero like garage smoke | Three.js `FogExp2`, noise texture with additive blending, degrade on mobile |
| **Track-style navigation** | nav underline follows pointer like racing line | CSS `--mouse-x` custom property + GSAP quickSetter for performance |
| **Driver radio audio cues** | short audio stings on CTA hover (respect reduced-motion) | Web Audio API triggered on focus within `.btn` components, muted by default |

Log new experiments in this file under a dedicated subsection so future designers can evaluate, iterate, or retire them.
