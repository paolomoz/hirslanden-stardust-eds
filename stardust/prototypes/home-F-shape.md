<!-- stardust:provenance
  writtenBy:        stardust:prototype/shape
  writtenAt:        2026-06-24T00:00:00Z
  page:             home
  variant:          F
  pageUrl:          https://www.hirslanden.ch/
  againstDirection: stardust/direction.md (Active 2026-06-24T00:00:00Z)
  consumedBy:       impeccable:craft
  mergeInstruction: "header+hero+proof from A, ds-feature from C, quicklinks from A, group-teasers from A, whats-happening from B, footer from A"
  readArtifacts:
    - stardust/prototypes/home-A-proposed.html
    - stardust/prototypes/home-B-proposed.html
    - stardust/prototypes/home-C-proposed.html
  stardustVersion:  0.10.0
  _provenance:
    capturedSourceLineage:
      - section: header
        origin: "home-A-proposed.html header (sticky white, utility bar, Metropolis 400/500, hamburger)"
      - section: hero-search
        origin: "home-A-proposed.html hero-search (split layout: headline+chips left, floating search-card right, over full-bleed hero photo with left-to-right scrim)"
      - section: proof-strip
        origin: "home-A-proposed.html proof-strip (3-cell horizontal: 16/300+/3000+ captured fact)"
      - section: hingabe-feature
        origin: "home-C-proposed.html ds-feature (full-bleed pflege-hingabe editorial band; white panel overlaid at bottom-left at desktop; pulled-up at mobile)"
      - section: quicklinks
        origin: "home-A-proposed.html quicklinks (compact 3-col blue-tint tile grid, 7 captured links)"
      - section: group-teasers
        origin: "home-A-proposed.html group-teasers (3-up teaser cards: Babygalerie, Folgen des Lebens, Healthline)"
      - section: whats-happening
        origin: "home-B-proposed.html whats-happening (improved CSS: accent-ink news tags, tabular-nums, min-width:0 event-text fix; same content as A)"
      - section: footer
        origin: "home-A-proposed.html footer (warm-ground mega footer, emergency 144 affordance)"
    substrateTransitions:
      default: "ground-warm (#f7f6f5) page ground with white (#ffffff) elevated cards"
      exceptions:
        - substrate: "hero photographic ground with controlled scrim"
          purpose: "full-bleed hero photo per A's hero treatment"
        - substrate: "full-bleed Hingabe photograph (ds-feature)"
          purpose: "editorial feature band from C, white panel floated over"
        - substrate: "Hirslanden-blue (#0094d4) closing Blog strip"
          purpose: "captured cta-band preserved verbatim"
      note: "3 transitions (hero photo / hingabe photo / blog blue). The hingabe photo is the C-sourced editorial move — adding depth without adding a substrate section."
    voiceClassification:
      - section: header
        classification: captured-verbatim
      - section: hero-search
        classification: captured-verbatim
      - section: proof-strip
        classification: captured-verbatim
      - section: hingabe-feature
        classification: captured-verbatim
        copy: "Hingabe, die man spürt / Gelebte Hingabe für Ihre Gesundheit / Hirslanden steht für gelebte Hingabe... / Mehr erfahren"
      - section: quicklinks
        classification: captured-verbatim
      - section: group-teasers
        classification: captured-verbatim
      - section: whats-happening
        classification: captured-verbatim
      - section: footer
        classification: captured-verbatim
-->
---
slug: home
variant: F
url: https://www.hirslanden.ch/
register: brand
surprise: low
dominantDimension: merge/best-of-A-B-C
---

# Page shape: home — Variant F (Merged: best of A + B + C)

User-directed merge: takes the strongest section from each approved prototype.
Design tokens and base system: DESIGN-A (brand-faithful, warm grounds, Metropolis, single blue accent).

## Sections (in render order)

1. **header** (from A) — sticky white, utility bar (Kontakt / Medien / DE FR EN), wordmark left
   (`assets/logo.png`), primary nav (Kliniken / Ärzte / Fachgebiete) + search icon right.
   Hamburger collapse < 640px.

2. **hero-search** (from A) — full-bleed hero photo with left-to-right warm scrim.
   Split: H1 **"Kompetenz, die Vertrauen schafft"** + sub-copy left; floating white search card
   (18px-radius container, search input, **Suche** button, quick-link chips) right.
   LCP image: `eager` + `fetchpriority=high`.

3. **proof-strip** (from A) — thin 3-cell horizontal proof row on warm ground:
   **16** Privatkliniken · **über 300** Kompetenzzentren · **über 3000** Ärztinnen und Ärzte.

4. **hingabe-feature** (from C — `ds-feature`) — full-bleed editorial photograph
   (`pflege-hingabe-6e8ca022.jpg`). White panel with single soft shadow, floated at
   bottom-left at desktop (position: absolute over image); pulled up over image bottom
   on mobile. Copy: eyebrow **"Hingabe, die man spürt"**, H2 "Gelebte Hingabe für Ihre
   Gesundheit", body + **"Mehr erfahren"** link. No scrim/treatment on the photo — C's
   Image-Is-Flat rule respected.

5. **quicklinks** (from A) — compact 3-col blue-tint (`rgba(0,148,212,0.1)`) tile grid:
   Kliniksuche, Ärztesuche, Jobs und Karriere, Leistungsübersicht, Krankheitsbilder A–Z,
   Behandlungen A–Z, BMI berechnen. Label + chevron, no imagery.

6. **group-teasers** (from A) — H2 **"Hirslanden-Gruppe"** + 3-up image teaser cards
   (squared, white, single shadow): Babygalerie (captured photo), Für alle Folgen des
   Lebens (flat placeholder), Hirslanden Healthline (flat placeholder). Each with
   **"Mehr erfahren"** link.

7. **whats-happening** (from B — improved CSS) — two-column band:
   **News & Mitteilungen** (4 captured article rows; B improvement: tags in `--color-accent-ink`
   blue instead of soft gray; `font-variant-numeric: tabular-nums` on meta) +
   **Veranstaltungen** (4 captured event rows; B improvement: `min-width:0` on event-text
   for responsive fix). Closing **Hirslanden Blog** full-width blue CTA strip.

8. **footer** (from A) — warm-ground mega footer: HIRSLANDEN-GRUPPE blurb, FOLGEN SIE UNS
   (social links), three link columns (Quick Links / Leistungsangebot / Über uns),
   red **Notfallnummer 144** affordance, copyright + legal links.

## Layout strategy

- Density: balanced (64px desktop / 48px tablet / 32px mobile), tokenized 4pt scale.
- Type: one 1.25 modular scale on Metropolis 400/500/700; headings sentence case.
- Container max-width 1200px; 12-col feel via CSS grid; single column < 640px.
- Hero split → stacked < 1024px. Feature panel overlay → pull-up < 900px.
- News/Events 2-col → 1-col < 900px. Quicklinks 3→2→1 col.

## Key states

- Default — described above.
- No JS — fully static; ≤10-line mobile-nav a11y sync only.

## Data attributes

- `header[data-section="header"][data-intent="navigate"][data-layout="full-bleed"][data-nav-collapse="hamburger"]`
- `section[data-section="hero-search"][data-intent="find care"][data-layout="split-media"][data-media="image"][data-interactive="form"]`
- `section[data-section="proof-strip"][data-intent="build trust"][data-layout="stack"][data-items="3"]`
- `section[data-section="hingabe-feature"][data-intent="emotional hook"][data-layout="full-bleed"][data-media="image"]`
- `section[data-section="quicklinks"][data-intent="navigate"][data-layout="grid"][data-items="7"]`
- `section[data-section="group-teasers"][data-intent="value proposition"][data-layout="grid"][data-items="3"][data-media="image"]`
- `section[data-section="whats-happening"][data-intent="show activity"][data-layout="grid"][data-items="8"]`
- `footer[data-section="footer"][data-intent="navigate"][data-layout="grid"]`
