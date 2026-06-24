<!-- stardust:provenance
  writtenBy:        stardust:prototype/shape
  writtenAt:        2026-06-24T00:00:00Z
  page:             home
  variant:          D
  pageUrl:          https://www.hirslanden.ch/
  againstDirection: stardust/direction.md (Active 2026-06-24T00:00:00Z)
  consumedBy:       impeccable:craft
  readArtifacts:
    - stardust/current/pages/home.json
    - stardust/current/_brand-extraction.json
    - DESIGN-D.md
    - DESIGN-D.json
    - PRODUCT.md
    - stardust/direction.md
  stardustVersion:  0.10.0
  _provenance:
    capturedSourceLineage:
      - section: header
        origin: "site-wide system-component (carried from _brand-extraction.json#systemComponents[kind=header] + pages/home.json#landmarks[header] nav/utility labels)"
      - section: hero
        origin: "consolidates pages/home.json#landmarks[hero] (heroHeadline 'Kompetenz, die Vertrauen schafft') + captured search field (pages/home.json#ctas[Suche] + #links.internal[Suche]) + captured hero photo (_brand-extraction.json#voice.heroImage hero-onkologie). Hero re-cast as a TYPE-LED grid hero: display headline carries the institution, photo runs as a supporting grid-cell image (direction.md Variant D / DESIGN-D iaPriorities institutional-proof + photography-supporting)."
      - section: proof-block
        origin: "derived from pages/home.json#metaDescription + #landmarks[footer] blurb ('16 Privatkliniken, über 300 Kompetenzzentren sowie über 3000 Ärztinnen und Ärzte') — captured FACT, PROMOTED from footer prose to an upper-page typographic proof block (DESIGN-D Proof-Block Rule; direction.md Variant D)."
      - section: locate
        origin: "derived from pages/home.json#landmarks[header].innerText 'STANDORTE / Hirslanden in Ihrer Nähe' block (captured banner-slider copy verbatim) + _brand-extraction.json#voice.firstParagraph; rendered as a grid-aligned locate row with the captured 'Zu den Standorten' CTA"
      - section: care-teasers
        origin: "consolidates pages/home.json#contentSections[teaser] (Babygalerie / Für alle Folgen des Lebens / Hirslanden Healthline — headings + bodies verbatim) as a 3-up grid of squared cards snapped to the 12-col grid"
      - section: whats-happening
        origin: "consolidates pages/home.json news.list (#headings level 4) + events.list (#headings level 3 day-chips + level 4 titles) + newsletter (Hirslanden Blog cta-band) — News column + Veranstaltungen column + closing Blog strip, all grid-aligned"
      - section: footer
        origin: "site-wide system-component (carried from _brand-extraction.json#systemComponents[kind=footer] + pages/home.json#landmarks[footer])"
    antiTemplatePass:
      - pattern: "hero composition (captured: full-bleed photo cropped behind a low-contrast watermark headline + overlapping search card)"
        defaultReflex: "centered-stack hero with two-button CTA pair over a dimmed photo (the universal AI silhouette)"
        alternatives:
          - "centered stack + dual CTA over a dimmed photo (rejected — the universal AI silhouette PRODUCT.md anti-references ban by name; also makes photography lead, which is C's bet, not D's)"
          - "full-bleed editorial photograph at full scale (rejected — that is variant C's photography-led hero; D must DIVERGE: photography SUPPORTS, type LEADS)"
          - "a strict 12-column grid hero: the display headline 'Kompetenz, die Vertrauen schafft' set LARGE (Display clamp up to 4.21rem, 700, line-height 1.08) spanning the left 7 columns over warm-ground; the captured hero photo seated as a SUPPORTING image in the right 5 columns (contained grid cell, not full-bleed); the search field seated on the grid directly below the headline, first-viewport (picked)"
        picked: "12-column grid hero; large display headline leads (left 7 cols), captured hero photo supports (right 5 cols, contained), search field grid-snapped below the headline first-viewport"
        rationale: "This IS the amplified move (direction.md Variant D: display-typography amplification #1). The captured site under-uses its single geometric sans by rendering the H1 as a low-contrast taupe watermark (#938880, fails AA); D promotes the headline to a confident display scale (DESIGN-D Perfect-Fourth Rule, ratio 1.333) in warm #534c46 (The warm-faithful inversion — warm even at large size). The photo is kept (warmth-not-sterile IA invariant #3) but demoted to a supporting grid cell so TYPE carries the institution (The Type-Carries-It Rule). Search stays first-viewport (IA invariant #2), grid-snapped under the headline."
      - pattern: "the institutional scale story (captured: '16 Privatkliniken, über 300 Kompetenzzentren, über 3000 Ärztinnen und Ärzte' buried as footer prose / meta description)"
        defaultReflex: "leave it as a one-line footer sentence, OR render as three small icon-topped 'stat cards' with blue numerals (the SaaS metric-row cliché)"
        alternatives:
          - "footer prose sentence (rejected — wastes the strongest institutional-proof signal the brand owns; PRODUCT.md Design Principle 5 wants it stated plainly as reassurance)"
          - "three blue icon-stat cards in a metric row (rejected — SaaS metric-row cliché; DESIGN-D Don't: spreads blue across the proof numerals; recolors the proof block)"
          - "a typographic proof block high on the page: three ENORMOUS Display numerals (16 / über 300 / über 3000) in Metropolis 700 warm #534c46, each with a Label caption (Privatkliniken / Kompetenzzentren / Ärztinnen und Ärzte), aligned on the 12-col grid (4 cols each) with hairline #e2dfdb grid rules, flat, no shadow, no color, no animation (picked)"
        picked: "upper-page typographic proof block — three Display numerals on the 12-col grid with Label captions and hairline rules, flat and static"
        rationale: "This is the DESIGN-D signature pattern (Proof-Block Rule; direction.md Variant D). The scale story is read as TYPE, not buried as prose nor decorated as stat-cards. Numerals stay warm #534c46 (warm-faithful inversion), captions warm-soft #72665b; the proof block uses hairline grid rules NOT elevation (Grid-Is-Structure Rule). No count-up (DESIGN-D Don't: no cinematic motion). Numbers are captured FACT (16/300/3000), used verbatim."
      - pattern: "the three captured teaser cards (Babygalerie / Folgen des Lebens / Healthline)"
        defaultReflex: "5-up image-card grid as category nav (curated reflex to escape)"
        alternatives:
          - "5-up image-card grid (rejected — only 3 captured teasers; padding to 5 would fabricate; curated default-pattern-to-escape)"
          - "carousel (rejected — motion/auto-advance banned; hides 2 of 3)"
          - "a 3-up grid of squared white cards snapped to the 12-col grid (4 cols each), each = Title (1.777rem, 500) + one captured Body sentence + 'Mehr erfahren' link, single soft shadow, sharp 0px corners; the GRID alignment and confident card titles (not the imagery) carry these (picked)"
        picked: "3-up grid of squared cards (4 cols each) on the 12-col grid; confident Title-led cards, type carries them, photography supporting"
        rationale: "Variant D's bet is grid + type, so the teasers deploy AS grid cells with confident typographic titles (Title 1.777rem from the 1.333 scale) rather than image-led editorial moments (that is C). Squared 0px corners (captured-faithful card motif; sharp-corners inversion). 3-up not 5-up because only 3 teasers are captured — never pad. Copy captured-verbatim."
      - pattern: "three CMS list modules (News + Events + Blog)"
        defaultReflex: "render all three as full co-equal stacked modules (captured clutter)"
        alternatives:
          - "three co-equal modules (rejected — captured clutter; reads as legacy module stack)"
          - "drop them (rejected — loses captured content)"
          - "a grid-aligned two-column band — News & Mitteilungen (article rows: eyebrow tag + Title + clinic attribution) beside Veranstaltungen (rows with the captured large day-number date chip + title + location) — with the captured Hirslanden Blog blue cta-band closing the section, everything snapped to grid columns and ruled with hairlines (picked)"
        picked: "grid-aligned News column + Veranstaltungen column + closing Hirslanden Blog blue strip, hairline-ruled"
        rationale: "Keeps every captured news/event/blog item verbatim but disciplines them onto the 12-col grid with hairline rules so they read as ordered institutional record (DESIGN-D Grid-Is-Structure). The day-number date chip is a captured motif (h3 day numbers 25/01/02) preserved. Blue Blog band is the captured cta-band, preserved as the page's one chromatic accent moment."
    surpriseTier_typeScaleYields:
      - rule: "DESIGN.md captured type scale is ad-hoc 42/34/22px (scaleAudit ratios 1.235/1.545, disagreeing) at loose line-height ~1.4"
        variantDominantDimension: "typography/display-grid"
        capturedTraitAmplified: "display-typography amplification (Metropolis pushed into a confident perfect-fourth display scale)"
        yieldedTo: "a strict single modular ratio 1.333 (perfect fourth) off a 1rem base, with tight display line-heights 1.08–1.2 (DESIGN-D Perfect-Fourth Rule). The captured ad-hoc 42/34/22 set and ~1.4 line-heights are retired per-page."
        rationale: "The display-typography bet (direction.md Variant D) IS the amplification of the captured single-family trait; it cannot be carried while preserving the captured disagreeing ad-hoc ratios. The per-page yield replaces the captured scale with one disciplined modular scale. Palette + font FAMILY stay pinned (Mode A); only the SCALE/line-height yields. C-cliff cleared: 1.333 is a disciplined modular ratio anchored to a captured trait, NOT a 120pt vanity slider; sectionPadding held at 64px floor (DESIGN-D cCliffCheck)."
    substrateTransitions:
      default: "warm-ground page — white (#ffffff) hero/proof-block/card ground with #f7f6f5 / #f0efed warm-ground bands alternating between sections"
      exceptions:
        - substrate: "Hirslanden-blue (#0094d4) closing Hirslanden Blog cta strip"
          purpose: "the captured cta-band (Hirslanden Blog) is the brand's signature full-width blue strip; preserved verbatim as the page's one chromatic accent moment (DESIGN-D keeps blue at action coverage; this is the single large fill)"
      note: "1 substrate exception (≤2 cap respected). The page is otherwise a single warm-ground/white substrate; the grid + display type carry structure, not substrate changes (DESIGN-D Grid-Is-Structure Rule). surprise: high is carried by the type-scale yield + proof-block document-shape + grid, NOT by substrate churn."
    voiceClassification:
      - section: header
        classification: captured-verbatim
        source: "pages/home.json nav + utility labels; _brand-extraction.json#voice.navItems (Kliniken / Ärzte / Fachgebiete / Suche / Kontakt / Medien / DE FR EN)"
      - section: hero
        classification: captured-verbatim
        copy: "Kompetenz, die Vertrauen schafft (re-cased from captured all-caps H1 watermark); search field 'Suche' button + 'Stichwort…' placeholder"
        source: "pages/home.json#headings[1] (re-cased to sentence case), ctas[Suche], links.internal[Suche]"
      - section: proof-block
        classification: captured-verbatim
        copy: "16 / über 300 / über 3000 with captions Privatkliniken / Kompetenzzentren / Ärztinnen und Ärzte"
        source: "pages/home.json#metaDescription + #landmarks[footer] blurb '16 Privatkliniken, über 300 Kompetenzzentren sowie über 3000 Ärztinnen und Ärzte' (captured fact, verbatim)"
      - section: locate
        classification: captured-verbatim
        copy: "Hirslanden in Ihrer Nähe + 'Die Hirslanden-Gruppe ist in der ganzen Schweiz zu Hause. Sie finden eine unserer Kliniken vom Bodensee im Osten über Zürich, die Zentralschweiz, Basel und Bern bis ganz im Westen am Genfersee.' + 'Zu den Standorten'"
        source: "pages/home.json#landmarks[header].innerText 'STANDORTE' block + _brand-extraction.json#voice.firstParagraph (verbatim); 'Zu den Standorten' captured ctaSample"
      - section: care-teasers
        classification: captured-verbatim
        copy: "Babygalerie / Begrüssen Sie die Neugeborenen aus unseren Geburtskliniken in der Schweiz. — Für alle Folgen des Lebens / Alle unsere Entscheidungen im Leben haben Folgen – und bei allen Folgen des Lebens sind wir für Sie da. — Hirslanden Healthline / Ihre Mitgliedschaft für persönliche Begleitung und Orientierung – wann immer Sie Unterstützung benötigen. — each 'Mehr erfahren'"
        source: "pages/home.json#contentSections[teaser] headings + bodies (verbatim)"
      - section: whats-happening
        classification: captured-verbatim
        copy: "News & Mitteilungen items (Centre de Chirurgie Ambulatoire de Genève; Erstes Symposium der Hirslanden Research Foundation; LUCERNE TOOLBOX 3 - Ein digitaler Kompass bei Brustkrebs; Official Medical Partner von Corinne Suter) + Veranstaltungen items (Bewegte Schwangerschaft 25; Informationsabend Geburt 25; Öffentlicher Vortrag: Beinarterien - wann Untersuchung und Behandlung 01; Informationsabend Geburt 02) + Hirslanden Blog / Weiterlesen"
        source: "pages/home.json#headings (level 4 news/event titles + level 3 day numbers) + #links news/events/newsletter; rendered verbatim (same items as variants A/B/C)"
      - section: footer
        classification: captured-verbatim
        source: "_brand-extraction.json#systemComponents[kind=footer] + pages/home.json#landmarks[footer] (incl. Notfallnummer 144 in reserved red)"
    compositionDelta_vs_A:
      - "type-scale ratio: A holds the brand 1.25 ratio with 700 headings at captured-ish sizes. D yields to a 1.333 perfect-fourth modular scale with a confident Display up to clamp 4.21rem and tight display line-heights 1.08–1.2 (the type-scale yield)."
      - "section presence + layout: D ADDS an upper-page typographic proof block (16/300/3000 as Display numerals on the grid) that A does not have; A keeps the scale story as footer prose. D also makes the 12-column grid VISIBLE with hairline rules; A uses a conventional contained layout."
      - "IA priority: D promotes institutional-proof to a lead signal (proof block high on the page); A's IA priority is the faithful search-hero-then-stack."
      - "hero strategy: A = split editorial headline-left / search-card-right over the hero photo. D = type-led 12-col grid hero, headline LARGE in the left 7 cols, photo demoted to a supporting right-5-col contained cell."
    compositionDelta_vs_B:
      - "IA spine: B = intent-routing layer (five equal-weight need-cards beside search lead the page). D = institutional-proof + grid spine (large display headline + typographic proof block lead the page)."
      - "signature section: B's signature is the five-card routing grid (functional tiles). D's signature is the typographic proof block (three Display numerals on the grid); no routing-card grid in D."
      - "type-scale: B uses the brand 1.25 ratio (Headline 700 routing question + Title 500). D uses the 1.333 perfect-fourth display scale with Display up to 4.21rem."
      - "hero layout: B = need-card grid beside search, hero photo demoted to a contained support panel. D = display-headline-led grid hero, photo a supporting right-column grid cell, proof block follows immediately."
    compositionDelta_vs_C:
      - "what's amplified: C amplifies photography (full-bleed editorial image bands lead). D amplifies typography + grid (large display type + visible 12-col grid lead; photography SUPPORTS in grid cells, never full-bleed)."
      - "type register: C goes QUIETER (ratio 1.2, heading weight 500, body 1.7, the photo leads). D goes LOUDER in type (ratio 1.333, Display 700 up to 4.21rem, tight 1.08 line-height, type leads)."
      - "hero strategy: C = edge-to-edge untreated full-bleed photograph with a slim search bar beneath. D = type-led 12-col grid hero, photo a contained supporting right-column cell, search grid-snapped under the headline."
      - "section presence: C's signature is the stacked editorial-photo sequence; D's signature is the typographic proof block + visible grid. D has no full-bleed image bands; C has no upper-page proof block."
  -->
---
slug: home
variant: D
url: https://www.hirslanden.ch/
register: brand
surprise: high
dominantDimension: typography/display-grid
---

# Page shape: home — Variant D (Confident display)

**Creative north star: "The Institution, Set in Type."** Variant D keeps the
pinned Hirslanden DNA exactly (blue `#0094d4` for LARGE fills/headlines only;
derived `#0070a0` for small/interactive blue per Mode-A-faithful contrast; white
CTA-on-blue on a darker `#006894` fill for AA; warm grounds `#ffffff`/`#f7f6f5`/
`#f0efed`; warm text `#534c46`/`#72665b`; emergency red `#f43a11` reserved for
footer 144; Metropolis 400/500/700 via @font-face relative path; 18px pill
secondary chips vs squared 0px primary buttons/cards/inputs; single soft shadow
`0 2px 12px rgba(0,0,0,.08)`; no gradients) and amplifies the one captured trait
the current site most under-uses: **Metropolis itself**. Today the single geometric
sans carries everything in a soft, ad-hoc stack (42/34/22px at loose ~1.4
line-height, the H1 a low-contrast taupe watermark). D pushes it into a confident
editorial **display scale** on a strict **12-column modular grid**: a true
perfect-fourth ratio (1.333), Display up to clamp ~4.21rem, tight display
line-heights (1.08–1.2), type doing the heavy institutional lifting with photography
**supporting** (not leading). The captured scale story — **16 Privatkliniken / über
300 Kompetenzzentren / über 3000 Ärztinnen und Ärzte** — is promoted from footer
prose to an upper-page **typographic proof block**: three enormous numerals in
Metropolis 700 with Label captions, aligned on the grid with hairline rules. Search
stays first-viewport, grid-snapped under the headline. No motion — the scale and
grid carry the confidence at rest.

Surprise budget: **high** — two captured clichés are replaced (the ad-hoc
disagreeing type scale + low-contrast watermark headline → a disciplined 1.333
display scale with a confident high-contrast warm display headline; the scale story
buried as footer prose → a large upper-page typographic proof block) plus one
document-shape substitution (the flat low-structure module stack → a strict visible
12-column modular grid with hairline rules expressing the institution's order). The
palette, font family, and motifs stay pinned; the type scale, grid, and proof-block
composition move. (See `_provenance.surpriseTier_typeScaleYields[]` — the captured
ad-hoc scale yields per-page to the modular display scale; this is the variant's
defining amplification.)

## Sections (in render order)

1. **header** (system-component role: `header`) — full-width white, Hirslanden
   wordmark left (`../current/assets/media/hirslanden-logo-93694b3d.png`, alt
   "Hirslanden"), primary nav (Kliniken / Ärzte / Fachgebiete) + search icon +
   utility bar (Kontakt / Medien / DE·FR·EN) right, **grid-aligned** to the 12-col
   container. Warm-dark text `#534c46`, `#0070a0` hover/active. Emergency 144
   reachable in the chrome (IA invariant #1; also in footer). Collapses to a
   hamburger below 640px.

2. **hero** (type-led grid hero) — the page lead, built on the visible 12-column
   grid. The reassurance line **"Kompetenz, die Vertrauen schafft"** is set as a
   **Display headline** (Metropolis 700, `clamp(3rem, 6vw, 4.21rem)`, line-height
   1.08, letter-spacing −0.02em, warm `#534c46` — high-contrast, NOT the captured
   taupe watermark; the warm-faithful inversion) spanning the **left 7 columns** over
   warm-ground. A quiet **Label** eyebrow ("Hirslanden-Gruppe") sits above. The
   captured **hero photograph** (`../current/assets/media/hero-onkologie-133e374f.webp`,
   alt "Ärztin im Gespräch mit einer Patientin in einem hellen Raum mit Seesicht")
   runs as a **supporting, contained image** in the **right 5 columns** — a grid
   cell, NOT full-bleed (photography supports, type leads). It is the **LCP image**:
   `loading="eager" fetchpriority="high"`. Directly below the headline, grid-snapped
   and first-viewport, a **search field** (white input, 1px `#e2dfdb` border, squared
   0px, `Stichwort…` placeholder, squared **Suche** button on the darker `#006894`
   blue fill for white-text AA) + the captured quick-link pill chips
   (Jobs / Ärztesuche / Baby-Galerie / Sponsoring-Anfragen — 18px pill secondary,
   captured hrefs).

3. **proof-block** (the signature D pattern) — immediately below the hero, high on
   the page. Three **Display numerals** on the 12-col grid (4 cols each), hairline
   `#e2dfdb` rule top and bottom, flat (no shadow, no fill):
   - **16** · caption **Privatkliniken**
   - **über 300** · caption **Kompetenzzentren**
   - **über 3000** · caption **Ärztinnen und Ärzte**
   Numerals Metropolis 700, `clamp(3rem, 6vw, 4.21rem)`, line-height 1.08, warm
   `#534c46` (never recolored blue/red — DESIGN-D Reserved-Red + Type-Carries-It
   Rules). Captions Label (500, 0.8125rem, +0.04em, uppercase) warm-soft `#72665b`.
   **No count-up, no reveal — static** (DESIGN-D Don't / direction.md static-only).

4. **locate** — a grid-aligned locate row on a warm-ground (`#f7f6f5`) band. Headline
   (2.369rem, 700) **"Hirslanden in Ihrer Nähe"** spanning left columns + the captured
   body "Die Hirslanden-Gruppe ist in der ganzen Schweiz zu Hause. Sie finden eine
   unserer Kliniken vom Bodensee im Osten über Zürich, die Zentralschweiz, Basel und
   Bern bis ganz im Westen am Genfersee." (Body 400, 1rem, line-height 1.6, 60–75ch)
   and one squared primary **"Zu den Standorten"** CTA (`#0094d4` fill, white text —
   AA: this is a large fill so primary blue is allowed; button label uses the darker
   `#006894`-equivalent contrast check — render white-on-`#0094d4` only if it clears
   AA at the rendered size, else fall to `#006894`).

5. **care-teasers** — a **3-up grid** of squared white cards (4 cols each on the
   12-col grid), single soft shadow, sharp 0px corners, type-led:
   - **Babygalerie** — "Begrüssen Sie die Neugeborenen aus unseren Geburtskliniken in
     der Schweiz." → captured `babygalerie.html`. Optional supporting image
     `../current/assets/media/nr-dsc07282-b9625f14.jpg` (alt "Neugeborenes in einer
     Hirslanden-Geburtsklinik") as a contained grid-cell image atop the card.
   - **Für alle Folgen des Lebens** — "Alle unsere Entscheidungen im Leben haben
     Folgen – und bei allen Folgen des Lebens sind wir für Sie da." → captured
     `fuer-alle-folgen-des-lebens` target. **Type-led card, no image** (only 1
     captured teaser photo; do NOT placeholder — the card stands on its confident
     Title + body, which is exactly Variant D's bet).
   - **Hirslanden Healthline** — "Ihre Mitgliedschaft für persönliche Begleitung und
     Orientierung – wann immer Sie Unterstützung benötigen." → captured Healthline
     target. **Type-led card, no image.**
   Each card: Title (1.777rem, 500) + one captured Body sentence + one **"Mehr
   erfahren"** link (`#0070a0`).

6. **whats-happening** — a grid-aligned two-column activity band, hairline-ruled.
   **News & Mitteilungen** column (4 captured article rows: eyebrow tag + Title +
   clinic attribution; section link "Alle News und Mitteilungen") and
   **Veranstaltungen** column (4 captured event rows with the captured large
   day-number date chip + title + location; section link "Alle Veranstaltungen").
   The captured **Hirslanden Blog** blue (`#0094d4`) cta strip (white headline +
   **Weiterlesen** on `#006894` for AA) closes the section — the page's one chromatic
   accent moment (the single substrate exception).

7. **footer** (system-component role: `footer`) — full mega footer: HIRSLANDEN-GRUPPE
   blurb (16 Kliniken, über 300 Zentren, über 3000 Ärztinnen und Ärzte), FOLGEN SIE
   UNS, three link columns (Quick Links / Leistungsangebot / Über uns), the red
   **Notfallnummer 144** affordance (`#f43a11`, reserved — IA invariant #1; on a white
   chip so the red clears AA), copyright © Hirslanden-Gruppe 2026, legal links.

## Layout strategy

- **Grid:** a strict **12-column CSS grid** with **24px gutters**, max-width
  ~1200px, made VISIBLE via hairline `#e2dfdb` rules at key section boundaries
  (proof block top/bottom; whats-happening column rule). Hero = 7/5 split; proof
  block = three 4-col cells; care-teasers = three 4-col cells; whats-happening = two
  6-col columns. The 12-col grid **reflows cleanly to fewer columns on mobile**:
  → 8-col at tablet (≥600px) collapsing 7/5 hero to stacked, proof to 3-up-or-stack;
  → single column < 600px (hero photo below headline, proof numerals stacked, cards
  stacked, columns stacked).
- **Type:** ONE **1.333 perfect-fourth** modular scale on Metropolis 400/500/700 off
  a 1rem base: Display `clamp(3rem, 6vw, 4.21rem)`/700/1.08; Headline 2.369rem/700/
  1.12; Title 1.777rem/500/1.2; Subtitle 1.333rem/500/1.3; Body 1rem/400/1.6; Label
  0.8125rem/500/+0.04em. Display + proof numerals use letter-spacing −0.02em.
  Display headings use `clamp()` so they **scale down without overflow** on small
  viewports; `text-wrap: balance` on display/headline.
- **Density:** section padding held at the multi-audience floor: 64px desktop / 48px
  tablet / 32px mobile (DESIGN-D spacing). Confidence comes from type scale + grid,
  NOT padding-as-personality (DESIGN-D cCliffCheck).
- **Color coverage:** blue at action coverage only (≤10%); the proof block and
  display headings are warm `#534c46`, never blue/red.

## Key states

- Default — described above.
- No JS — fully static; the only script is the ≤10-line mobile-nav a11y sync.

## Interaction model

- Header search icon, nav links, utility links, footer links → captured hrefs.
- Hero **Suche** button → search action (captured form target); quick-link pills →
  captured hrefs (Jobs / Ärztesuche / Baby-Galerie / Sponsoring-Anfragen).
- Proof numerals — **non-interactive, informational, static** (no count-up).
- locate "Zu den Standorten", care-teaser "Mehr erfahren", news/event rows, blog band
  → captured destination hrefs.
- Hover/focus only: gentle `#0070a0` hover on links/CTAs, gentle darken on primary
  buttons, gentle lift (shadow/background) on cards, visible focus ring. **No scroll
  choreography, no parallax, no count-up animation** (DESIGN-D Don'ts; static variant).

## Data attributes

- `header[data-section="header"][data-intent="navigate"][data-layout="contained"][data-nav-collapse="hamburger"]`
- `section[data-section="hero"][data-intent="emotional hook"][data-layout="grid"][data-media="image"][data-interactive="form"]`
- `section[data-section="proof-block"][data-intent="build trust"][data-layout="grid"][data-items="3"]`
- `section[data-section="locate"][data-intent="drive action"][data-layout="contained"]`
- `section[data-section="care-teasers"][data-intent="reassure"][data-layout="grid"][data-items="3"]`
- `section[data-section="whats-happening"][data-intent="show activity"][data-layout="grid"][data-items="8"]`
- `footer[data-section="footer"][data-intent="navigate"][data-layout="grid"]`

## Unsourced content (placeholder list)

**(none.)** Every literal value is captured-verbatim. The 16 / über 300 / über 3000
proof numerals are captured FACT (pages/home.json#metaDescription + footer blurb),
used verbatim. All hero/headline/teaser/news/event/blog copy is captured-verbatim.
No stats, addresses, quotes, names, phone numbers, or dates are fabricated. Variant D
deliberately runs the two image-less care-teaser cards as **type-led cards** (no
image placeholder) — the confident Title + body IS the design intent, so no
`[data-placeholder]` element is needed.

## Open questions for craft

- Hero grid split ratio: 7/5 vs 8/4. Resolved: **7/5** so the display headline has
  enough column width to sit at full Display scale without wrapping awkwardly, while
  the supporting photo still reads as a substantial grid cell.
- Proof-block rule treatment: full-bleed hairline vs grid-cell hairlines. Resolved:
  a top + bottom full-width hairline framing the block, plus thin column rules between
  the three numeral cells, so the 12-col grid is legible as the institution's order
  (Grid-Is-Structure Rule) without elevation.
