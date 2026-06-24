<!-- stardust:provenance
  writtenBy:        stardust:prototype/shape
  writtenAt:        2026-06-24T00:00:00Z
  page:             home
  variant:          B
  pageUrl:          https://www.hirslanden.ch/
  againstDirection: stardust/direction.md (Active 2026-06-24T00:00:00Z)
  consumedBy:       impeccable:craft
  readArtifacts:
    - stardust/current/pages/home.json
    - stardust/current/_brand-extraction.json
    - DESIGN-B.md
    - DESIGN-B.json
    - PRODUCT.md
    - stardust/direction.md
  stardustVersion:  0.10.0
  _provenance:
    capturedSourceLineage:
      - section: header
        origin: "site-wide system-component (carried from _brand-extraction.json#systemComponents[kind=header] + pages/home.json#landmarks[header] nav/utility labels)"
      - section: hero-routing
        origin: "consolidates pages/home.json#landmarks[hero] (div.stage search affordance + heroHeadline) with the five intent cards composed from captured nav (Kliniken/Aerzte/Fachgebiete pages/home.json#links.internal), footer taxonomy (pages/home.json#landmarks[footer] Quick Links: Klinikaufenthalt, Internationale Patienten), and the captured Notfall 144 (pages/home.json#links.internal[Notfall] + footer Notfallnummer 144). Routing-card labels are direction-authorized rewrites per direction.md Variant B."
      - section: proof-strip
        origin: "derived from pages/home.json#metaDescription + footer blurb (16 Privatkliniken / 300 Kompetenzzentren / 3000 Aerztinnen und Aerzte)"
      - section: whats-happening
        origin: "consolidates pages/home.json news.list (#headings level 4) + events.list + newsletter (Hirslanden Blog) — the lighter News/Veranstaltungen + Blog band kept below the routing layer per direction.md Variant B"
      - section: footer
        origin: "site-wide system-component (carried from _brand-extraction.json#systemComponents[kind=footer] + pages/home.json#landmarks[footer])"
    antiTemplatePass:
      - pattern: "hero composition (captured: full-bleed photo + watermark headline + overlapping search card)"
        defaultReflex: "centered-stack hero with two-button CTA pair (Generic-2026-SaaS silhouette)"
        alternatives:
          - "centered stack + dual CTA over photo (rejected — the universal AI silhouette DESIGN-B bans; also buries the routing bet)"
          - "search-only hero, routing pushed below the fold (rejected — violates the IA bet; routing must LEAD, and search must stay first-viewport)"
          - "intent-routing layer AS the hero: a calm reassurance line + the captured search field on top, then five large equal-weight need-cards as the page's lead affordance, over a quiet warm ground with the captured hero photo as a contained right-edge support panel (picked)"
        picked: "routing-layer-as-hero — reassurance line + search field + five need-cards leading the first viewport; hero photo demoted to a contained support panel (not full-bleed)"
        rationale: "This IS the amplified move (direction.md Variant B: audience-routing reframe, candidate #7 + search-as-tool #3). The captured home buries parallel jobs-to-be-done in a flat equal-weight module stack; B promotes them to the page spine. Search stays first-viewport (IA invariant #2) as the tool inside the routing layer. The five labels are composed from captured nav + footer taxonomy + the captured 144, not invented destinations."
      - pattern: "five intent cards (the signature B component — risk: reads as a marketing feature-card triplet)"
        defaultReflex: "5-up image-card grid as category nav, or a 3-up SaaS feature-card row with icons + marketing blurbs"
        alternatives:
          - "5-up image-card grid (rejected — DESIGN-B Don't: image cards would turn wayfinding into a marketing teaser grid; the cards are utilities, not editorial teasers)"
          - "3-up SaaS feature triplet + 2 stragglers (rejected — DESIGN-B Don't explicitly: Generic-2026-SaaS silhouette; also breaks equal-weight)"
          - "five equal-weight squared white tiles on warm ground, single soft shadow, each = icon + Title + one captured-grounded sentence + arrow affordance; whole tile is one link target; Notfall 144 is the fifth, swapping blue affordance for reserved red number (picked)"
        picked: "five equal-weight squared white wayfinding tiles (icon + Title + one-sentence Body + arrow); Notfall 144 is the fifth in reserved red"
        rationale: "DESIGN-B The Single-Shadow Rule + The One Voice Rule: all five share one shadow/shape so the layer reads as one organized choice; blue marks the four wayfinding actions only, red is reserved for 144. Equal-weight squared tiles (no decorative imagery) keep them reading as functional routes, not a marketing card set. The fifth-card-is-emergency move makes 144 unmistakable (IA invariant #1) while keeping it calm (one card among five, not a banner)."
      - pattern: "captured quicklink-tile grid + map locator + 3 teaser cards (captured: three separate stacked modules)"
        defaultReflex: "preserve all three as separate stacked bands (the captured ia-clutter)"
        alternatives:
          - "keep all three separate (rejected — direction.md Variant B says collapse them into the one intent-organized layer; this is the ia-clutter the bet closes)"
          - "merge quicklinks+map into one band, keep teasers (rejected — partial; doesn't honor the full collapse the bet requires)"
          - "subsume all three into the five-card routing layer (Klinik finden subsumes Kliniksuche+map; Arzt finden subsumes Aerztesuche; Klinikaufenthalt planen subsumes the stay/teaser intents; Internationale Patienten subsumes the footer quicklink); the editorial group-teasers do not return as a band (picked)"
        picked: "routing cards subsume quicklink grid + map locator + teaser stack; no separate quicklink/map/teaser bands"
        rationale: "direction.md Variant B: 'Collapse the captured quicklink-tile grid + map locator + 3 teaser cards into this one intent-organized layer (the routing cards subsume them).' This is the structural delta vs A (A keeps quicklinks + locate + group-teasers as distinct bands). Every captured destination still has a home: it is reached through the routing card whose intent covers it."
      - pattern: "three CMS list modules (captured: News + Events + Blog as 3 co-equal sections)"
        defaultReflex: "render all three as full co-equal stacked modules (captured clutter)"
        alternatives:
          - "three co-equal modules (rejected — ia-clutter; B demotes them below the routing spine)"
          - "drop them entirely (rejected — would lose captured content; the bet keeps a LIGHTER band, not no band)"
          - "one lighter 'Was bei uns geschieht' band below the routing layer: News column + Veranstaltungen column, Blog as the closing blue CTA strip (picked)"
        picked: "one lighter consolidated News/Veranstaltungen band + Blog closing blue strip, kept below the routing layer"
        rationale: "direction.md Variant B: 'Keep a lighter News/Veranstaltungen + Blog band below.' The routing layer is the lead; the activity band is deliberately secondary. Every captured news/event item + the captured Hirslanden Blog cta-band preserved verbatim."
    substrateTransitions:
      default: "ground-warm (#f7f6f5) page ground with white (#ffffff) elevated cards (the five routing tiles + content cards share it)"
      exceptions:
        - substrate: "Hirslanden-blue (#0094d4) closing band"
          purpose: "the captured cta-band (Hirslanden Blog) is a brand-signature full-width blue strip; preserved verbatim as the page's one chromatic accent moment"
      note: "1 transition, within the <=2 cap. The hero photo support panel sits ON the warm ground (contained image, not a substrate change). Body sections alternate only ground-warm/ground-warm-alt (a tint shift, not a substrate change). The five-card routing layer is white-card-on-warm, NOT a substrate change."
    voiceClassification:
      - section: header
        classification: captured-verbatim
        source: "pages/home.json nav + utility labels; _brand-extraction.json#voice.navItems (Kliniken / Aerzte / Fachgebiete / Suche / Kontakt / Medien / DE FR EN)"
      - section: hero-routing
        classification: direction-authorized rewrite
        copy: "Was brauchen Sie heute? (routing question, Headline) + the five card labels: Klinik finden / Arzt oder Aerztin finden / Klinikaufenthalt planen / Internationale Patienten / Notfall 144"
        source: "routing question + card labels are direction-authorized rewrites composed from captured nav (Kliniken/Aerzte/Fachgebiete), footer taxonomy (Klinikaufenthalt, Internationale Patienten), and the captured Notfall 144 per direction.md Variant B. The reassurance line 'Kompetenz, die Vertrauen schafft' and the search field + 'Suche' button + 'Stichwort...' placeholder are captured-verbatim (pages/home.json#headings[1] re-cased, ctas[Suche])."
      - section: proof-strip
        classification: captured-verbatim
        copy: "16 Privatkliniken / ueber 300 Kompetenzzentren / ueber 3000 Aerztinnen und Aerzte"
        source: "pages/home.json#metaDescription + footer blurb; 16/300/3000 used as captured fact (allowed per task)"
      - section: whats-happening
        classification: captured-verbatim
        copy: "News & Mitteilungen + Veranstaltungen items + dates + locations; Hirslanden Blog / Weiterlesen"
        source: "pages/home.json#headings (level 4 news/event titles) + #links news/events/newsletter; rendered verbatim (same items as variant A)"
      - section: footer
        classification: captured-verbatim
        source: "_brand-extraction.json#systemComponents[kind=footer] + pages/home.json#landmarks[footer] (incl. Notfallnummer 144 in reserved red)"
    compositionDelta_vs_A:
      - "IA spine: A = faithful flat stack (search hero -> proof -> locate -> quicklinks -> group-teasers -> news/events). B = intent-routing layer leads the page (five need-cards beside search as the hero)."
      - "section presence: A keeps locate (map), quicklinks grid, and group-teasers as three distinct bands. B collapses all three into the single routing layer (those bands are absent in B)."
      - "hero layout strategy: A = split editorial headline-left / search-card-right over full-bleed hero photo. B = routing-layer-as-hero (reassurance line + search field + five equal-weight need-cards) with the hero photo demoted to a contained support panel."
    compositionDelta_vs_C:
      - "IA spine: B = intent-routing layer (five need-cards). C = photography-led editorial front door (full-bleed imagery + lead-ins)."
      - "hero layout: B = need-card grid beside search. C = edge-to-edge photography with editorial captions; photo PROMOTED, not demoted."
      - "type weight register: B uses Title-weight (500) card titles + Headline (700) routing question as structural support. C goes quieter (1.2/500) with more whitespace and magazine rhythm."
-->
---
slug: home
variant: B
url: https://www.hirslanden.ch/
register: brand
surprise: medium
dominantDimension: ia/intent-routing-spine
---

# Page shape: home — Variant B (Care-routing first)

**Creative north star: "Was brauchen Sie heute?"** Variant B keeps the pinned
Hirslanden DNA exactly (blue `#0094d4` for large fills/headlines; derived `#0070a0`
for small/interactive blue per Mode-A-faithful contrast; warm grounds; Metropolis
400/500/700; 18px pill vs squared CTA; single soft shadow; warm photography; no
gradients) and moves only the **information architecture**. The flat equal-weight
module stack the captured home leads with is replaced by an explicit patient-intent
routing layer: the captured search field paired with five large equal-weight
need-routing cards as the page's lead affordance. Search stays first-viewport. The
quicklink grid + map locator + three teaser cards are subsumed into this one layer;
a lighter News/Veranstaltungen + Blog band sits below.

Surprise budget: **medium** — one captured cliché (the flat equal-weight module
stack as the page lead) is replaced by one move from the non-template bank
(IA-reorganization: promote the buried jobs-to-be-done to the page spine as an
intent-routing layer). The surface (palette, type, motifs) does not move; the IA does.

## Sections (in render order)

1. **header** (system-component role: `header`) — full-width white, Hirslanden
   wordmark left (`../current/assets/media/hirslanden-logo-93694b3d.png`), primary
   nav (Kliniken / Ärzte / Fachgebiete) + search icon + utility bar (Kontakt / Medien
   / DE·FR·EN) right. Warm-dark text, `#0070a0` hover/active. Emergency 144 reachable
   in the chrome (IA invariant #1; also surfaced as routing card #5). Collapses to a
   hamburger below 640px.

2. **hero-routing** (the signature B layer) — the page lead, on the warm ground.
   Left/top: a calm reassurance eyebrow + Headline routing question
   **"Was brauchen Sie heute?"** with the captured reassurance line
   **"Kompetenz, die Vertrauen schafft"** (sentence-cased) as the supporting
   one-liner, and directly beneath it the captured **search field** (white input,
   1px `#e2dfdb` border, `Stichwort...` placeholder, squared blue **Suche** button,
   inside the 18px-radius search-box container) — search is first-viewport.
   Then the five-card routing grid: five **equal-weight squared white tiles**
   (`box-shadow: 0 2px 12px rgba(0,0,0,.08)`, share it exactly), each = icon + Title
   + one-sentence Body + arrow affordance, whole tile is one link target:
   - **Klinik finden** → captured `kliniken-und-zentren.html` (subsumes Kliniksuche +
     the map locator). Body: "16 Privatkliniken in der ganzen Schweiz — finden Sie
     eine Klinik in Ihrer Nähe."
   - **Arzt oder Ärztin finden** → captured `aerztesuche.html`. Body: "Über 3000
     Ärztinnen und Ärzte — suchen Sie nach Fachgebiet oder Name."
   - **Klinikaufenthalt planen** → captured `klinikaufenthalt.html`. Body:
     "Besucher-Informationen, Versicherungsfragen und alles für Ihren Aufenthalt."
   - **Internationale Patienten** → captured footer `Internationale Patienten` target.
     Body: "Persönliche Betreuung und Koordination für Patientinnen und Patienten aus
     dem Ausland."
   - **Notfall 144** → captured `notfall.html`. Reserved red `#f43a11` on the **144**
     number + label affordance; calm card body: "Im medizinischen Notfall wählen Sie
     144." Reads unmistakable but not alarmist (one card among five, same shape/shadow).
   Right edge / below on mobile: the captured hero photo
   (`../current/assets/media/hero-onkologie-133e374f.webp`) as a **contained** warm
   support panel (NOT full-bleed — full-bleed is variant C's bet). It is the LCP
   image: `loading="eager" fetchpriority="high"`, descriptive alt.

3. **proof-strip** — a quiet 3-cell horizontal proof row on the warm ground:
   **16** Privatkliniken · **300+** Kompetenzzentren · **3000+** Ärztinnen und Ärzte.
   Captured fact (metaDescription + footer blurb), title/display scale, no card chrome
   — a restrained institutional reassurance line that backs the routing layer.

4. **whats-happening** — ONE lighter consolidated band below the routing spine.
   Two columns: **News & Mitteilungen** (4 captured article rows: eyebrow tag + date
   + clinic attribution, section link "Alle News und Mitteilungen") and
   **Veranstaltungen** (4 captured event rows with the large day-number date chip +
   location, section link "Alle Veranstaltungen"). The captured **Hirslanden Blog**
   blue CTA-band (white headline + **Weiterlesen**) closes the section as the
   full-width blue strip.

5. **footer** (system-component role: `footer`) — full mega footer: HIRSLANDEN-GRUPPE
   blurb (16/300/3000), FOLGEN SIE UNS, three link columns (Quick Links /
   Leistungsangebot / Über uns), the red **Notfallnummer 144** affordance (`#f43a11`,
   reserved — IA invariant #1), copyright © Hirslanden-Gruppe 2026, legal links.

## Layout strategy

- Density: balanced. 64px desktop section padding (DESIGN-B `section-desktop`),
  48px tablet, 32px mobile. Tokenized 4pt scale. Five cards breathe at 64px.
- Type: one 1.25 modular scale on Metropolis 400/500/700; routing question at
  Headline (700, 1.75rem); card titles at Title (500, 1.375rem); sentence-case.
- Container max-width 1200px; 12-col feel via CSS grid.
- Hero-routing desktop: search + reassurance occupy a left rail (or full-width top
  strip) and the photo support panel sits to the right; the five cards lay out as a
  3+2 grid (or 5-across at 1440+) on the warm ground. The cards **reflow to a single
  stacked column on mobile**; the photo panel drops below the routing question on
  mobile, the search field stays directly under the question (first-viewport).
- News/Events two-column → stacked < 900px.

## Key states

- Default — described above.
- No JS — fully static; the only script is the ≤10-line mobile-nav a11y sync.

## Interaction model

- Header search icon, nav links, footer links → captured hrefs.
- Hero **Suche** button → search action (captured form target).
- Each of the five routing cards → its captured destination href (whole card is the
  link target; gentle hover lift via shadow/background only — no motion choreography).
- News/event rows, blog band → captured hrefs.
- Hover/focus only: gentle `#0070a0` hover on links/CTAs, gentle card lift on the
  five tiles, visible focus ring. No scroll choreography, no parallax (DESIGN-B Don'ts).

## Data attributes

- `header[data-section="header"][data-intent="navigate"][data-layout="full-bleed"][data-nav-collapse="hamburger"]`
- `section[data-section="hero-routing"][data-intent="route by patient intent"][data-layout="split-media"][data-media="image"][data-interactive="form"][data-items="5"]`
  - each card carries its own `data-intent` (e.g. `data-intent="find clinic"`, `"find doctor"`, `"plan stay"`, `"international patients"`, `"emergency"`)
- `section[data-section="proof-strip"][data-intent="build trust"][data-layout="stack"][data-items="3"]`
- `section[data-section="whats-happening"][data-intent="show activity"][data-layout="grid"][data-items="8"]`
- `footer[data-section="footer"][data-intent="navigate"][data-layout="grid"]`

## Unsourced content (placeholder list)

(none) — every literal traces to `current/pages/home.json` or `_brand-extraction.json`
voice samples, or to the direction-authorized routing-card label rewrites
(classified `direction-authorized rewrite`, composed from captured nav + footer
taxonomy + the captured Notfall 144, per direction.md Variant B). The 16/300/3000
scale numbers are captured fact (metaDescription + footer blurb), used verbatim.
No stats, addresses, quotes, names, phone numbers, or dates are fabricated. The card
Body sentences are direction-authorized rewrites that re-state captured facts
(16 Privatkliniken, 3000 Ärzte, the captured footer quicklink intents, the captured
144 emergency instruction) — not invented claims.

## Open questions for craft

- Routing-layer desktop composition: search + reassurance as a left rail with the
  five cards in the right ~8 columns, or a full-width reassurance+search top strip
  with the five cards in a 5-across band beneath? Resolved: full-width top strip
  (reassurance + search) so search reads as first-viewport and unambiguous, then the
  five cards in a 3+2 grid (5-across at ≥1440) beneath, with the contained hero photo
  occupying the band's right edge at desktop. This keeps the cards equal-weight.
- Card icon treatment: line glyph vs filled. Resolved: simple line glyph in
  `#0070a0` (blue marks action), monochrome, no decorative imagery — keeps the tiles
  reading as utilities, not marketing teasers. The Notfall card's affordance is the
  red 144 number, not a blue glyph.
