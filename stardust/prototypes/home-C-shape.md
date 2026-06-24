<!-- stardust:provenance
  writtenBy:        stardust:prototype/shape
  writtenAt:        2026-06-24T00:00:00Z
  page:             home
  variant:          C
  pageUrl:          https://www.hirslanden.ch/
  againstDirection: stardust/direction.md (Active 2026-06-24T00:00:00Z)
  consumedBy:       impeccable:craft
  readArtifacts:
    - stardust/current/pages/home.json
    - stardust/current/_brand-extraction.json
    - DESIGN-C.md
    - DESIGN-C.json
    - PRODUCT.md
    - stardust/direction.md
  stardustVersion:  0.10.0
  _provenance:
    capturedSourceLineage:
      - section: header
        origin: "site-wide system-component (carried from _brand-extraction.json#systemComponents[kind=header] + pages/home.json#landmarks[header] nav/utility labels)"
      - section: editorial-hero
        origin: "consolidates pages/home.json#landmarks[hero] (heroHeadline 'Kompetenz, die Vertrauen schafft' + the captured hero photo _brand-extraction.json#voice.heroImage hero-onkologie) with the captured search field (pages/home.json#ctas[Suche] + #links.internal[Suche]). Hero photo PROMOTED to full editorial scale (direction.md Variant C / DESIGN-C iaPriorities photography-foregrounding)."
      - section: editorial-lead
        origin: "derived from _brand-extraction.json#voice.firstParagraph ('Die Hirslanden-Gruppe ist in der ganzen Schweiz zu Hause...') + the captured 16/300/3000 scale fact (pages/home.json#metaDescription + footer blurb), given editorial room as a magazine lead-in"
      - section: hingabe-feature
        origin: "derived from pages/home.json#landmarks[header].innerText 'Hingabe, die man spürt' block (captured banner-slider copy verbatim) + captured content photo pflege-hingabe; rendered as a full-bleed editorial image band"
      - section: care-moments
        origin: "consolidates pages/home.json#contentSections[teaser] (Babygalerie / Für alle Folgen des Lebens / Hirslanden Healthline — headings + bodies verbatim) as three image-led editorial cards"
      - section: whats-happening
        origin: "consolidates pages/home.json news.list (#headings level 4) + events.list + newsletter (Hirslanden Blog cta-band) — kept as one quiet activity band per direction.md Variant C (photography leads; activity is secondary)"
      - section: footer
        origin: "site-wide system-component (carried from _brand-extraction.json#systemComponents[kind=footer] + pages/home.json#landmarks[footer])"
    antiTemplatePass:
      - pattern: "hero composition (captured: full-bleed photo cropped behind a watermark headline + overlapping search card)"
        defaultReflex: "centered-stack hero with two-button CTA pair over a dimmed photo (the universal AI silhouette)"
        alternatives:
          - "centered stack + dual CTA over a dimmed/duotoned photo (rejected — the universal AI silhouette DESIGN-C bans; also dims the photography, which is the whole bet)"
          - "split editorial headline-left / search-card-right over full-bleed hero (rejected — this is variant A's hero; C must DIVERGE, and the split shrinks the photo)"
          - "edge-to-edge untreated hero photograph at full editorial scale, the reassurance line set quiet (weight 700, the one allowed 700 use) on a controlled bottom scrim panel, with a slim search bar seated just under the image (picked)"
        picked: "full-bleed untreated editorial photograph; quiet hero line on a controlled scrim panel; slim search bar directly beneath the image (first-viewport)"
        rationale: "This IS the amplified move (direction.md Variant C: photography re-foregrounding #2 + voice-register #5). The captured site genuinely owns excellent warm clinician-with-patient photography but crops it to thumbnail teasers; C runs it edge-to-edge at full scale (DESIGN-C The Photography-Leads Rule + The Image-Is-Flat Rule — no duotone/overlay, warmth is the image's own). The scrim is the AA mechanism for the white-on-photo hero line (audit requirement), not a darkening treatment of the whole image. Search stays first-viewport (IA invariant #2) as a slim bar under the image, not buried."
      - pattern: "the three captured teaser cards (Babygalerie / Folgen des Lebens / Healthline)"
        defaultReflex: "5-up or 3-up image-card grid as category nav with uniform thumbnail crops + marketing blurbs"
        alternatives:
          - "3-up thumbnail card grid (rejected — DESIGN-C Don't: crops strong photography back to teaser thumbnails; the exact failure mode C exists to reverse)"
          - "carousel of teasers (rejected — motion/auto-advance banned; and a carousel hides 2 of 3)"
          - "three generous image-led editorial moments stacked vertically, each photograph large with a quiet warm-ground caption panel (Title + one captured sentence + one 'Mehr erfahren' link), magazine rhythm (picked)"
        picked: "three large image-led editorial moments stacked vertically, each with a quiet warm-ground caption panel"
        rationale: "DESIGN-C Editorial Image Block is the page's signature pattern; the teasers are the natural content for it. Stacking them vertically at generous scale (rather than a 3-up thumbnail row) is the document-shape substitution — the page reads as an editorial sequence, not a card rack. Captions carry the reassurance voice as editorial copy (voice-register #5)."
      - pattern: "the 'Hingabe, die man spürt' brand-promise block (captured banner-slider copy)"
        defaultReflex: "a centered text band on a flat tint, or a blue CTA banner"
        alternatives:
          - "centered text band on flat tint (rejected — wastes the captured warm photography; type-only where an image could lead)"
          - "blue CTA banner (rejected — overuses blue; DESIGN-C keeps blue rare, imagery does the emotional work)"
          - "full-bleed editorial image band (pflege-hingabe photo) with the 'Hingabe, die man spürt' promise as a quiet overlaid/adjacent editorial lead-in (picked)"
        picked: "full-bleed editorial image band carrying the 'Hingabe' brand promise as a quiet lead-in"
        rationale: "Reinforces The Photography-Leads Rule mid-page with a second captured photograph (pflege-hingabe), keeping the warmth-not-sterile bet (DESIGN-C iaPriorities) continuous. Copy is captured-verbatim from the banner-slider block."
      - pattern: "three CMS list modules (News + Events + Blog as 3 co-equal sections)"
        defaultReflex: "render all three as full co-equal stacked modules (captured clutter)"
        alternatives:
          - "three co-equal modules (rejected — competes with the photography; C demotes activity)"
          - "drop them (rejected — loses captured content)"
          - "one quiet typographic activity band (News column + Veranstaltungen column) with the Hirslanden Blog as the closing strip — deliberately type-led and image-light so the photography sections stay the visual lead (picked)"
        picked: "one quiet two-column News/Veranstaltungen activity band + Blog closing strip, type-led"
        rationale: "direction.md Variant C: photography carries the page; the activity band is secondary and intentionally quiet (no images competing with the editorial photo bands). Every captured news/event item + the Hirslanden Blog cta preserved verbatim."
    surpriseTier_typeScaleYields: []
    substrateTransitions:
      default: "warm-ground page (#f7f6f5 / #f0efed alternating tints) with white (#ffffff) caption panels and content cards"
      exceptions:
        - substrate: "full-bleed photographic bands (editorial-hero, hingabe-feature)"
          purpose: "the editorial photography IS the page's lead substrate — full-bleed image bands are the document-shape's structural rhythm, not a decorative tint change (DESIGN-C The Photography-Leads / Image-Is-Flat Rules)"
        - substrate: "Hirslanden-blue (#0094d4) closing Blog strip"
          purpose: "the captured cta-band (Hirslanden Blog) is a brand-signature full-width blue strip; preserved verbatim as the page's one chromatic accent moment"
      note: "surprise: high with picked move = document-shape (poster-sequence / editorial-photo-sequence sub-kind). The photographic bands ARE the document-shape's per-section rhythm (friction carve-out #2): editorial-hero uses hero-onkologie (captured semantic hero position), hingabe-feature uses pflege-hingabe (captured 'Hingabe' content photo). Each photographic substrate carries a per-section captured-source citation. The one blue strip is the captured cta-band, also cited. Cap exception conditions met (high + document-shape substrate-keyed + per-section citations)."
    voiceClassification:
      - section: header
        classification: captured-verbatim
        source: "pages/home.json nav + utility labels; _brand-extraction.json#voice.navItems (Kliniken / Ärzte / Fachgebiete / Suche / Kontakt / Medien / DE FR EN)"
      - section: editorial-hero
        classification: captured-verbatim
        copy: "Kompetenz, die Vertrauen schafft (re-cased from captured all-caps H1); search field 'Suche' button + 'Stichwort...' placeholder"
        source: "pages/home.json#headings[1] (re-cased), ctas[Suche]; eyebrow 'Für Sie da' is a direction-authorized chrome label (quiet eyebrow) supporting the voice register"
      - section: editorial-lead
        classification: captured-verbatim
        copy: "Die Hirslanden-Gruppe ist in der ganzen Schweiz zu Hause. Sie finden eine unserer Kliniken vom Bodensee im Osten über Zürich, die Zentralschweiz, Basel und Bern bis ganz im Westen am Genfersee. + 16 Privatkliniken · über 300 Kompetenzzentren · über 3000 Ärztinnen und Ärzte"
        source: "_brand-extraction.json#voice.firstParagraph (verbatim) + pages/home.json#metaDescription/footer blurb (16/300/3000 captured fact). Section link 'Zu den Standorten' is captured ctaSample."
      - section: hingabe-feature
        classification: captured-verbatim
        copy: "Hingabe, die man spürt. Hirslanden steht für gelebte Hingabe – mit medizinischer Exzellenz, persönlicher Betreuung und einem Engagement, das über den Standard hinausgeht. + 'Mehr erfahren'"
        source: "pages/home.json#landmarks[header].innerText banner-slider 'Hingabe, die man spürt' block (verbatim); 'Mehr erfahren' captured ctaSample"
      - section: care-moments
        classification: captured-verbatim
        copy: "Babygalerie / Begrüssen Sie die Neugeborenen aus unseren Geburtskliniken in der Schweiz. — Für alle Folgen des Lebens / Alle unsere Entscheidungen im Leben haben Folgen – und bei allen Folgen des Lebens sind wir für Sie da. — Hirslanden Healthline / Ihre Mitgliedschaft für persönliche Begleitung und Orientierung – wann immer Sie Unterstützung benötigen. — each 'Mehr erfahren'"
        source: "pages/home.json#contentSections[teaser] headings + bodies (verbatim)"
      - section: whats-happening
        classification: captured-verbatim
        copy: "News & Mitteilungen items (Centre de Chirurgie Ambulatoire de Genève; Erstes Symposium der Hirslanden Research Foundation; LUCERNE TOOLBOX 3; Official Medical Partner von Corinne Suter) + Veranstaltungen items (Bewegte Schwangerschaft 25; Informationsabend Geburt 25/02; Öffentlicher Vortrag: Beinarterien 01) + Hirslanden Blog / Weiterlesen"
        source: "pages/home.json#headings (level 4 news/event titles + day numbers) + #links news/events/newsletter; rendered verbatim (same items as variants A/B)"
      - section: footer
        classification: captured-verbatim
        source: "_brand-extraction.json#systemComponents[kind=footer] + pages/home.json#landmarks[footer] (incl. Notfallnummer 144 in reserved red)"
    compositionDelta_vs_A:
      - "IA spine: A = faithful flat band stack (search hero -> proof -> locate/map -> quicklinks -> group-teasers -> news/events). C = photographic editorial sequence (full-bleed hero photo -> editorial lead -> full-bleed Hingabe band -> three stacked image-led moments -> quiet activity band)."
      - "hero layout strategy: A = split editorial headline-left / search-card-right over the hero photo. C = edge-to-edge untreated photograph at full scale with a slim search bar beneath; the photo is PROMOTED to the dominant element, not a split-screen partner."
      - "type register: A holds the brand 1.25 ratio + 700 headings. C goes quieter — 1.2 ratio, heading weight 500, body line-height 1.7 — so type recedes and photography leads (DESIGN-C The Quiet-Type Rule)."
      - "substrate strategy: A = single warm ground with elevated cards. C = document-shape poster-sequence of full-bleed photographic bands alternating with warm-ground editorial panels."
    compositionDelta_vs_B:
      - "IA spine: B = intent-routing layer (five equal-weight need-cards beside search lead the page). C = photography-led editorial front door (full-bleed imagery + lead-ins lead the page)."
      - "hero layout: B = need-card grid beside search, hero photo DEMOTED to a contained right-edge support panel. C = hero photo PROMOTED to a full-bleed edge-to-edge image; search is a slim bar beneath, not a routing affordance."
      - "type register: B uses Headline 700 routing question + Title 500 card titles at the brand 1.25 ratio. C goes quieter (1.2 ratio, weight 500, body 1.7) with magazine whitespace; type recedes."
      - "section presence/shape: B's signature is the five-card routing grid (functional tiles). C's signature is the stacked editorial-image sequence (three large image-led moments); no routing-card grid in C."
  -->
---
slug: home
variant: C
url: https://www.hirslanden.ch/
register: brand
surprise: high
dominantDimension: composition/editorial-photo-sequence
---

# Page shape: home — Variant C (Photography-led)

**Creative north star: "The Warm Editorial Front Door."** Variant C keeps the
pinned Hirslanden DNA exactly (blue `#0094d4` for large fills/headlines; derived
`#0070a0` for small/interactive blue per Mode-A-faithful contrast; white CTA-on-blue
on a darker `#006894` fill for AA; warm grounds `#ffffff`/`#f7f6f5`/`#f0efed`; warm
text `#534c46`/`#72665b`; emergency red `#f43a11` reserved for footer 144; Metropolis
400/500/700 via @font-face relative path; 18px pill vs squared controls; single soft
shadow `0 2px 12px rgba(0,0,0,.08)`; no gradients) and amplifies the one captured
trait the current site most wastes: its **warm clinician-with-patient photography**.
The captured hero (`hero-onkologie`, 2900×1419) and content imagery, today cropped to
thumbnail teasers, run at **full editorial scale** — edge-to-edge full-bleed bands —
and the reassurance voice gets editorial room as lead-ins and captions. Type goes
**quieter** (ratio 1.2, heading weight 500, body line-height 1.7) so the photography
leads. Search stays first-viewport (a slim bar directly under the hero image).
No motion — the imagery carries the warmth at rest.

Surprise budget: **high** — two captured clichés are replaced (the thumbnail-cropped
photography → full editorial scale; the all-700 shout-headline register → quiet 500
type) plus one document-shape substitution (the flat band stack → a poster-sequence
of full-bleed photographic bands alternating with warm-ground editorial panels). The
palette, font family, and motifs stay pinned; the composition and type register move.

## Sections (in render order)

1. **header** (system-component role: `header`) — full-width white, Hirslanden
   wordmark left (`../current/assets/media/hirslanden-logo-93694b3d.png`, alt
   "Hirslanden"), primary nav (Kliniken / Ärzte / Fachgebiete) + search icon +
   utility bar (Kontakt / Medien / DE·FR·EN) right. Warm-dark text `#534c46`,
   `#0070a0` hover/active. Emergency 144 reachable in the chrome (IA invariant #1;
   also in footer). Collapses to a hamburger below 640px.

2. **editorial-hero** (the signature C pattern) — the page lead. The captured
   **hero photograph** (`../current/assets/media/hero-onkologie-133e374f.webp`) runs
   **edge-to-edge / full-bleed** at full editorial scale, **untreated** (no duotone,
   no overlay, warmth is the image's own — DESIGN-C The Image-Is-Flat Rule). It is the
   **LCP image**: `loading="eager" fetchpriority="high"`, descriptive alt "Ärztin im
   Gespräch mit einer Patientin in einem hellen Raum mit Seesicht". The reassurance
   line **"Kompetenz, die Vertrauen schafft"** (Display 700 — the ONE allowed 700 use
   per The Quiet-Type Rule) sits on a controlled **scrim panel** at the image's lower
   edge (semi-opaque warm-dark gradient-free panel, e.g. `rgba(43,38,33,.62)` solid-ish
   wash limited to the text band) so white text clears WCAG AA over the photo — the
   scrim is the AA mechanism, NOT a darkening of the whole image. A quiet eyebrow
   **"Für Sie da"** (Label 500) sits above the line. Directly **beneath the image** a
   **slim search bar** (white input, 1px `#e2dfdb` border, `Stichwort…` placeholder,
   squared **Suche** button on the darker `#006894` blue fill for white-text AA) keeps
   search first-viewport (IA invariant #2) without burying it.

3. **editorial-lead** — a generous warm-ground (`#f7f6f5`) editorial lead-in, magazine
   whitespace. Quiet Headline (500, 1.5rem) lead **"Die Hirslanden-Gruppe ist in der
   ganzen Schweiz zu Hause."** + the captured body sentence at Body (400, 1.0625rem,
   line-height 1.7), 60–70ch measure: "Sie finden eine unserer Kliniken vom Bodensee
   im Osten über Zürich, die Zentralschweiz, Basel und Bern bis ganz im Westen am
   Genfersee." Beneath it, a quiet inline proof line — **16 Privatkliniken · über 300
   Kompetenzzentren · über 3000 Ärztinnen und Ärzte** (captured fact, no card chrome,
   Title scale) — and one **"Zu den Standorten"** link (`#0070a0`).

4. **hingabe-feature** — a second **full-bleed editorial image band** using the captured
   `../current/assets/media/pflege-hingabe-6e8ca022.jpg` (alt "Pflegefachperson bei der
   persönlichen Betreuung einer Patientin"), untreated. Carries the captured brand
   promise as a quiet lead-in on a warm-ground caption panel beside/over the image
   (scrim if text sits on the photo): eyebrow **"Hingabe, die man spürt"** + Body "Hirslanden
   steht für gelebte Hingabe – mit medizinischer Exzellenz, persönlicher Betreuung und
   einem Engagement, das über den Standard hinausgeht." + one **"Mehr erfahren"** link.

5. **care-moments** — three large **image-led editorial moments** stacked vertically
   (NOT a 3-up thumbnail row), each = a generous photograph or warm-ground panel +
   white caption panel (32px padding, single soft shadow) with Title (500) + one
   captured Body sentence (1.7) + one **"Mehr erfahren"** link, alternating image side
   for magazine rhythm:
   - **Babygalerie** — "Begrüssen Sie die Neugeborenen aus unseren Geburtskliniken in
     der Schweiz." Image: `../current/assets/media/nr-dsc07282-b9625f14.jpg` (captured
     content photo, alt "Neugeborenes in einer Hirslanden-Geburtsklinik"). → captured
     `babygalerie.html`.
   - **Für alle Folgen des Lebens** — "Alle unsere Entscheidungen im Leben haben Folgen
     – und bei allen Folgen des Lebens sind wir für Sie da." Image: **`[data-placeholder]`
     editorial image block** (no captured image for this teaser) → see Unsourced content.
     → captured `fuer-alle-folgen-des-lebens` target.
   - **Hirslanden Healthline** — "Ihre Mitgliedschaft für persönliche Begleitung und
     Orientierung – wann immer Sie Unterstützung benötigen." Image: **`[data-placeholder]`
     editorial image block** (no captured image) → see Unsourced content.

6. **whats-happening** — ONE quiet, deliberately type-led activity band (image-light so
   it doesn't compete with the editorial photo bands). Two columns: **News & Mitteilungen**
   (4 captured article rows: eyebrow tag + title + clinic attribution, section link
   "Alle News und Mitteilungen") and **Veranstaltungen** (4 captured event rows with the
   large day-number date chip + title + location, section link "Alle Veranstaltungen").
   The captured **Hirslanden Blog** blue (`#0094d4`) CTA strip (white headline +
   **Weiterlesen** on `#006894` for AA) closes the section — the page's one chromatic
   accent moment.

7. **footer** (system-component role: `footer`) — full mega footer: HIRSLANDEN-GRUPPE
   blurb (16 Kliniken, über 300 Zentren, über 3000 Ärztinnen und Ärzte), FOLGEN SIE UNS,
   three link columns (Quick Links / Leistungsangebot / Über uns), the red
   **Notfallnummer 144** affordance (`#f43a11`, reserved — IA invariant #1; on a white
   chip so the red clears AA), copyright © Hirslanden-Gruppe 2026, legal links.

## Layout strategy

- Density: generous magazine whitespace achieved via **large media, wide gutters, and
  long line-height (1.7)** — NOT via >64px padding. Section padding held at the
  multi-audience floor ceiling: 64px desktop / 56px tablet / 40px mobile (DESIGN-C
  spacing). Floor respected (DESIGN-C densityNote).
- Type: one **1.2** modular scale on Metropolis 400/500/700; **heading weight 500**
  (Headline 1.5rem, Title 1.25rem); the ONLY 700 is the hero Display line. Body 1.0625rem
  at line-height **1.7**, 60–70ch measure. Sentence-case; eyebrows uppercase Label.
- Full-bleed image bands span 100vw (edge-to-edge), images `width:100%; height:auto`
  (or `object-fit:cover` with a capped max-height so they scale without overflow at
  any viewport). Warm-ground editorial panels are contained at max-width 1100–1200px.
- care-moments: editorial moments stack vertically; on desktop image/caption alternate
  left/right (≈55/45); **collapse to single stacked column < 900px**, caption below
  image.
- whats-happening two-column → stacked < 900px.

## Key states

- Default — described above.
- No JS — fully static; the only script is the ≤10-line mobile-nav a11y sync.

## Interaction model

- Header search icon, nav links, footer links → captured hrefs.
- Hero **Suche** button → search action (captured form target).
- Editorial caption links + care-moment "Mehr erfahren" → captured destination hrefs.
- News/event rows, blog band → captured hrefs.
- Hover/focus only: gentle `#0070a0` hover on links/CTAs, gentle lift on caption panels
  (shadow/background only), visible focus ring. **No scroll choreography, no parallax,
  no Ken-Burns** (DESIGN-C Don'ts; static variant).

## Data attributes

- `header[data-section="header"][data-intent="navigate"][data-layout="full-bleed"][data-nav-collapse="hamburger"]`
- `section[data-section="editorial-hero"][data-intent="emotional hook"][data-layout="full-bleed"][data-media="image"][data-interactive="form"]`
- `section[data-section="editorial-lead"][data-intent="build trust"][data-layout="contained"]`
- `section[data-section="hingabe-feature"][data-intent="emotional hook"][data-layout="full-bleed"][data-media="image"]`
- `section[data-section="care-moments"][data-intent="reassure"][data-layout="stack"][data-media="image"][data-items="3"]`
- `section[data-section="whats-happening"][data-intent="show activity"][data-layout="grid"][data-items="8"]`
- `footer[data-section="footer"][data-intent="navigate"][data-layout="grid"]`

## Unsourced content (placeholder list)

Two `[data-placeholder]` editorial image blocks — the redesign's full-editorial-image
treatment demands a photograph for each care-moment, but only the hero
(`hero-onkologie`), `pflege-hingabe`, and `nr-dsc07282` images were captured. The two
remaining care-moments (Für alle Folgen des Lebens; Hirslanden Healthline) have no
captured image, so each renders as an editorial **image** placeholder with the mandatory
visual signature (2px dashed accent outline, monospace `PLACEHOLDER · other` eyebrow,
warm tint, illustrative shape hint). **No text/stat/quote is placeholdered** — all copy
is captured-verbatim.

- `section[data-section="care-moments"] .care-moment:nth-child(2) [data-placeholder]`
  — type `other` (editorial image): no captured photo for the "Für alle Folgen des
  Lebens" teaser; design demands a full-scale editorial image.
- `section[data-section="care-moments"] .care-moment:nth-child(3) [data-placeholder]`
  — type `other` (editorial image): no captured photo for the "Hirslanden Healthline"
  teaser; design demands a full-scale editorial image.

The 16/300/3000 scale numbers and all news/event/blog copy are captured fact, used
verbatim. No stats, addresses, quotes, names, phone numbers, or dates are fabricated.

## Open questions for craft

- Hero text placement: scrim panel anchored bottom-left vs full-width bottom band.
  Resolved: a contained bottom-left scrim panel (not full-width) so the photograph
  reads edge-to-edge with the warm interior visible; text band scrim limited to the
  panel footprint for AA without dimming the whole image.
- care-moments caption side: strict alternation vs all-same. Resolved: alternate
  left/right at desktop for magazine rhythm; stack caption-below-image on mobile.
