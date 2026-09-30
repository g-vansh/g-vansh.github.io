# CONTENT.md — canonical content for the redesign

All facts verified against the old site, MIT Sloan profile, NBER, Scholar
(June 2026). He is a PhD *student* (started 2025), not faculty.

## Identity
- **Vansh Gupta** — PhD student, MIT Sloan (TIES: CV phrases it "Economics of
  Technological Innovation, Entrepreneurship & Strategic Management"). The CV
  no longer says "Behavioral & Policy Sciences" (dropped Sept 2026) — don't
  reintroduce it.
- CV fields line (Sept 2026): Innovation · Industrial Organization · Public
  Institutions · Incentives ("Urban" dropped).
- Research: innovation economics — *where do ideas come from?*
  Four lenses: **incentives (money), place (geography/proximity), brains
  (neural wiring, UK Biobank — and artificial minds: the AI-vs-human-scientists
  paper lives here), institutions (renamed from "government" Sept 2026: Brazil
  state capacity + the expert-service paper)**. CSS/JS selectors keep the old
  `gov` names (`.ln-gov`, `.lg-gov`); only the visible labels changed.
- Email: vansh@mit.edu · GitHub g-vansh · X @VanshG_ · LinkedIn vansh-g ·
  Scholar VLDgDyAAAAAJ · ORCID 0000-0002-6221-1247
- Domain: www.vansh-gupta.com (CNAME — do not touch)
- Cambridge, MA. Coordinates for footer: 42.3608 N / 71.0843 W.
- Affiliations to show: MIT Sloan (TIES), IGL Research Affiliate (Nesta/BSE),
  UK Biobank Approved Researcher. Do NOT list NBER as an affiliation
  (paper links to NBER WPs are fine).
- Fellowships: Kalim Family Fund (2025), MIT Sloan Doctoral Fellowship (2026–30).
- Grant (2026): "Unlocking Global Growth Through Indian Innovation & Patent
  Commercialization", funded by Analogue Group and The Good Science Project.
  CV page + llms.txt/JSON-LD only — not a research entry (author's call, Sept 2026).
- Talks (CV page §06): 2026 — East Coast Doctoral Conference; ESIF
  (Econometric Society Interdisciplinary Frontiers) Economics and AI+ML Meeting,
  Cornell, June 2026. Earlier — Columbia Business School Management Division;
  Cornell Dyson; Cornell Global Development; Charles River Associates.

## Timeline (CV page)
- 2025– MIT Sloan PhD (S.M. in Management Research exp. 2027)
- 2023–25 Charles River Associates — Associate & Data Scientist, Antitrust
  (healthcare mergers; Innovation Award 2024 AND 2025 for geospatial tooling)
- 2022 Dean's Summer Research Fellow, Columbia Business School (Jorge Guzman)
- 2020–23 Cornell — dual B.S.: Biometry & Statistics (3.95) + Applied Economics
  & Management (3.92), magna cum laude, research honors thesis w/ distinction
- 2021 AEA Data Reproducibility Researcher (Lars Vilhuber)
- 2019–23 Founder, Ascenta Management Consulting — pro-bono consulting in
  India only. Keep LOW-KEY: not on the CV page, small station on the map;
  never mention "started at seventeen" or CEOInsights.
- The Doon School: NOT on the CV page (map terminus only)

## Research (research.html) — order matters

### Under review (research.html §REV: R&R + submitted)
1. **Better Keep the Twenty Dollars: Incentivizing Innovation in Open Source**
   w/ Annamaria Conti (IE), Jorge Guzman (Columbia), Maria Roche (HBS).
   R&R at *Management Science*. NBER WP 31668.
   Hook: a $20 sponsorship can crowd out the intrinsic motivation that powers
   open source — paying contributors made them do *less* community work.
   Press: NBER Bulletin on Entrepreneurship; HBS Working Knowledge
   ("Intrinsic Joy Sparks Ideas Better than Cash").
   Links: https://www.nber.org/papers/w31668
1b. **Artificial intelligences and human scientists exhibit complementary
   strengths in theory building** (arXiv's sentence-case title) — w/ Ke Li
   (INSEAD) et al. (large-team study). Under review. arXiv 2609.32562.
   25 LLMs vs 13 senior researchers + 60 doctoral scholars; theories of gender
   & race inequality. AIs beat most humans individually, build more elaborate
   theories (rated higher by blind raters) — but the complexity is partly
   ornamental; humans get more predictive efficiency from simpler theories,
   are more diverse, gain more from aggregation, revise selectively.
   Anchor: research.html#brains (the Brains legend row links here).

### Work in progress
2. **Local Government State Capacity: Evidence from Brazil**
   w/ Michael Best (Columbia), Renata Lemos (World Bank), Daniela Scur (Cornell).
   16M+ paragraphs of municipal gazettes + LLM cascade → first daily measure of
   what Brazilian municipal governments actually *do*.
3. **Municipal Responses to Natural Disasters: Evidence from Brazilian
   Municipalities** — same team. How floods reshape what local states do.
4. **Persistence is Selection: How Serving Lowers the Supply of Experts** —
   solo, in progress (replaced "Welfare Economics of Incentives and
   Innovations in Public Goods" on the CV, Sept 2026). Three public lotteries
   into expert offices (IETF Nominating Committee; Italian national
   habilitation commissions; Italian university hiring commissions): the
   persistence of past servers is selection, hiding an effect of the opposite
   sign — serving lowers later supply of the same service.
   **Author's rule: no draft is public yet. Don't upload or link a PDF until
   the author releases one; describe question + design + direction only —
   no point estimates.**
   Anchor: research.html#persistence. Home "Selected work" slot 2.

### Earlier work
5. **Approaches and Resources for Improved Student Outcomes: Evidence from
   Brazil** — Cornell honors thesis, SSRN 4394638.
6. **Dropout Mitigation: A Logistic Modelling Approach** — independent field
   research in rural Indian schools, done as a high-school senior.

### Research assistance
- *Treatment Effects in Managerial Strategies* (Guzman) — built the STE R package.
- AEA reproducibility (Vilhuber) — built Upload-to-Zenodo, used by the team since.
- Twitter sentiment & markets event study (Moghimi, Cornell).

## Legacy URLs
- The CV PDF still links old Jekyll permalinks (`/publication/Diario-Municipal`,
  `/publication/NLP`, `/publication/STE`). Meta-refresh stubs under
  `publication/`, `talks/`, `affiliations/`, `portfolio/*/` forward them.
- `/STE/` is NOT this repo: it is the g-vansh/STE project's GitHub Pages
  (pkgdown docs) served under the custom domain. Never create an `STE/`
  folder here — it would shadow the package docs.

## Software (software.html)
- **STE** — R package: strategic treatment effects via ML (random forests,
  LASSO, Rubin causal model). github.com/g-vansh/STE
- **Upload-to-Zenodo** — Python; adopted by AEA Data Editor's replication team
  (40+ RAs). github.com/AEADataEditor/Upload-to-Zenodo
- LLM measurement pipeline for the Brazil project (16.4M paragraphs labelled,
  cascade + silver standard) — describe, link to paper when public.

## Coauthor homepages (verified June 2026 — link names to these everywhere)
- Ke Li — https://kelichloe.github.io/ (INSEAD, Decision Sciences)
- Annamaria Conti — https://sites.google.com/view/annamariaconti/home-page
- Jorge Guzman — https://www.jorgeguzman.co/
- Maria Roche — https://sites.google.com/view/mariaproche
- Michael Best — https://michaelcbest.github.io/
- Renata Lemos — https://renatalemos.com/
- Daniela Scur — https://danielascur.com/
- Lars Vilhuber — https://lars.vilhuber.com/
- Reza Moghimi — https://www.rmoghimi.com/

## Voice
First person, direct, curious, a little wry. No "passionate about leveraging".
Sample register: "I study where ideas come from. It is going better than it
sounds." Personal line for colophon: cities, transit systems, and learning to
bike hands-free.

## Assets carried over from old site
- `files/CV___Vansh_Gupta.pdf` (check files/ for newer)
- `images/profile.png`
- Affiliation logos in `images/affiliations/` (probably unused — legend
  replaces logo wall; logos are a template tell)
