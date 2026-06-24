<!-- stardust:provenance
  writtenBy:        stardust:prototype/shape
  writtenAt:        2026-06-24T00:00:00Z
  page:             home
  variant:          A
  pageUrl:          https://www.hirslanden.ch/
  againstDirection: stardust/direction.md (Active 2026-06-24T00:00:00Z)
  consumedBy:       impeccable:craft
  readArtifacts:
    - stardust/current/pages/home.json
    - stardust/current/_brand-extraction.json
    - DESIGN-A.md
    - DESIGN-A.json
    - PRODUCT.md
    - stardust/prototypes/home-improvements.md
    - stardust/direction.md
  stardustVersion:  0.10.0
  _provenance:
    capturedSourceLineage:
      - section: header
        origin: "site-wide system-component (carried from _brand-extraction.json#systemComponents[kind=header])"
      - section: hero-search
        origin: "derived from pages/home.json#landmarks[hero] (div.stage + search affordance) + voice.heroHeadline; watermark headline corrected per home-improvements #1"
      - section: proof-strip
        origin: "derived from footer blurb pages/home.json#landmarks[footer].footer_pre (16 Kliniken / 300 Zentren / 3000 Aerzte) + metaDescription; surfaced near top per home-improvements #5"
      - section: locate
        origin: "derived from pages/home.json banner-slider STANDORTE slide ('Hirslanden in Ihrer Naehe' + firstParagraph + 'Zu den Standorten' CTA)"
      - section: quicklinks
        origin: "derived from pages/home.json#links quicklink tiles (Kliniksuche, Jobs und Karriere, Leistungsuebersicht, Krankheitsbilder A-Z, Behandlungen A-Z, BMI berechnen)"
      - section: group-teasers
        origin: "derived from pages/home.json#contentSections[teaser] under H2 'Hirslanden-Gruppe' (Babygalerie, Fuer alle Folgen des Lebens, Hirslanden Healthline)"
      - section: whats-happening
        origin: "consolidates pages/home.json news.list + events.list + newsletter (Hirslanden Blog) per home-improvements #2 + #4"
      - section: footer
        origin: "site-wide system-component (carried from _brand-extraction.json#systemComponents[kind=footer])"
    antiTemplatePass:
      - pattern: "hero composition (captured: full-bleed photo + watermark headline + overlapping search card)"
        defaultReflex: "centered-stack hero with two-button CTA pair (Generic-2026-SaaS)"
        alternatives:
          - "centered stack + dual CTA (rejected — the silhouette DESIGN-A explicitly bans)"
          - "split: editorial headline + photo left, floating white search card right over controlled scrim (picked)"
          - "type-led hero, photo demoted (rejected — that is variant D's bet, not A's faithful role)"
        picked: "split headline-left / search-card-right over the captured hero photo with a controlled left-to-right scrim"
        rationale: "Faithful to the captured search-first-hero + hero-with-image patterns; corrects only the watermark legibility (#534c46 headline on a controlled scrim) per home-improvements #1. Keeps search first-viewport (IA invariant #2)."
      - pattern: "quicklink tile grid (captured: icon tiles on primary-tint ground)"
        defaultReflex: "5-up image-card grid as category nav"
        alternatives:
          - "5-up image-card grid (rejected — image cards belong to the group-teasers, not the utility quicklinks)"
          - "compact 3-col text-tile grid on primary-tint, squared, label + arrow (picked)"
          - "horizontal pill-chip row (rejected — chips are reserved for the hero search affordances; would dilute the pill motif)"
        picked: "3-col squared text tiles on blue-tint ground, label + chevron, no decorative imagery"
        rationale: "Preserves the captured quicklink-tile-grid (the brand's utility shortcut shape, confirmed by --brandColorOpacity tile background) while tightening density per home-improvements #2/#3. Tiles stay non-image so they read as utilities, distinct from the editorial group teasers."
      - pattern: "three CMS list modules (captured: News + Events + Blog as 3 co-equal sections)"
        defaultReflex: "render all three as full co-equal stacked modules (the captured clutter)"
        alternatives:
          - "three co-equal stacked modules (rejected — this is exactly the ia-clutter home-improvements #2/#4 names)"
          - "one secondary 'Was bei uns geschieht' band: news column + events column side-by-side, blog as the closing CTA strip (picked)"
          - "tabbed single module (rejected — adds JS state; DESIGN-A keeps motion to hover/focus only)"
        picked: "one consolidated secondary band (news + events two-column) + blog as the closing blue CTA strip"
        rationale: "Consolidates the three redundant modules into one demoted 'what's happening' layer per home-improvements #2 + #4, while preserving every captured news/event item and the captured cta-band (Hirslanden Blog) verbatim."
      - pattern: "see-more CTA vocabulary (captured: 'Mehr erfahren' x3, 'Weiterlesen', 'Alle News und Mitteilungen', 'Zu den Standorten')"
        defaultReflex: "leave the five disagreeing labels as captured"
        alternatives:
          - "leave as captured (rejected — fragmented vocabulary, home-improvements #4)"
          - "consolidate to two verbs: navigation primary = 'Zu den Standorten'-style action labels (kept verbatim where they name a destination); content read-more = single 'Mehr erfahren' (picked)"
          - "invent a new unified verb (rejected — would fabricate copy; not direction-authorized)"
        picked: "two-verb system from captured labels only — destination CTAs keep their captured action label; all content read-more links normalize to the captured 'Mehr erfahren'"
        rationale: "home-improvements #4 asks for one canonical 'see more' vocabulary; achieved by selecting among the captured labels (no invented copy). 'Alle News und Mitteilungen' / 'Alle Veranstaltungen' kept as the section-level 'see all' links (captured verbatim)."
    substrateTransitions:
      default: "ground-warm (#f7f6f5) page ground with white (#ffffff) elevated cards"
      exceptions:
        - substrate: "hero photographic ground with controlled scrim"
          purpose: "the captured full-bleed hero photo is the page's emotional front door; legibility corrected with a scrim per home-improvements #1"
        - substrate: "Hirslanden-blue (#0094d4) closing band"
          purpose: "the captured cta-band (Hirslanden Blog) is a brand-signature full-width blue strip; preserved verbatim"
      note: "2 transitions, within the <=2 cap. Body sections alternate only ground-warm/ground-warm-alt (a tint shift, not a substrate change)."
    voiceClassification:
      - section: header
        classification: captured-verbatim
        source: "pages/home.json nav + utility labels; _brand-extraction.json#voice.navItems"
      - section: hero-search
        classification: captured-verbatim
        copy: "Kompetenz, die Vertrauen schafft / Suche / Stichwort..."
        source: "pages/home.json#headings[1] (re-cased to sentence case per DESIGN-A Mixed-Case Rule) + ctas[Suche] + search placeholder"
      - section: proof-strip
        classification: captured-verbatim
        copy: "16 Kliniken / ueber 300 Kompetenzzentren / ueber 3000 Aerztinnen und Aerzte"
        source: "pages/home.json#metaDescription + footer blurb; numbers used as fact (allowed per task — captured 16/300/3000 scale)"
      - section: locate
        classification: captured-verbatim
        copy: "Hirslanden in Ihrer Naehe / Die Hirslanden-Gruppe ist in der ganzen Schweiz zu Hause... / Zu den Standorten"
        source: "pages/home.json banner-slider STANDORTE slide + voice.firstParagraph"
      - section: quicklinks
        classification: captured-verbatim
        source: "pages/home.json#links quicklink labels + hrefs"
      - section: group-teasers
        classification: captured-verbatim
        copy: "Hirslanden-Gruppe / Babygalerie / Fuer alle Folgen des Lebens / Hirslanden Healthline + blurbs"
        source: "pages/home.json#contentSections[teaser]"
      - section: whats-happening
        classification: captured-verbatim
        copy: "News & Mitteilungen + Veranstaltungen items + dates + clinic attributions; Hirslanden Blog / Weiterlesen"
        source: "pages/home.json#headings + #links news/events/newsletter"
      - section: footer
        classification: captured-verbatim
        source: "_brand-extraction.json#systemComponents[kind=footer] + pages/home.json#landmarks[footer]"
-->
---
slug: home
variant: A
url: https://www.hirslanden.ch/
register: brand
surprise: low
dominantDimension: fidelity/faithful-plus-improvements
---

# Page shape: home — Variant A (Faithful + improvements)

Variant A is the brand exactly as captured, with the five `home-improvements.md`
fixes applied and nothing more. Same IA, same section sequence, same brand DNA
(Hirslanden blue, warm grounds, Metropolis, 18px pill vs squared CTA, single soft
shadow). The only changes are execution-quality: legible hero headline, a real 1.25
modular type scale, tokenized 64px section rhythm, consolidated CTA vocabulary,
tighter section density, and the 16/300/3000 proof story surfaced near the top.

## Sections (in render order)

1. **header** (system-component role: `header`) — full-width white, Hirslanden
   wordmark left (`assets/logo.png`), primary nav (Kliniken / Ärzte / Fachgebiete)
   + search icon + utility bar (Kontakt / Medien / DE·FR·EN) right. Warm-dark text,
   blue hover/active. Emergency 144 reachable in the chrome (IA invariant #1).
   Collapses to a hamburger below 640px.

2. **hero-search** — split composition over the captured hero photo
   (`assets/media/hero-onkologie-133e374f.webp`). A controlled left-to-right scrim
   (warm-dark, ~0.45 at the headline edge fading to clear) makes the headline
   **"Kompetenz, die Vertrauen schafft"** legible in `#534c46`-on-scrim or white —
   the watermark `#938880` is dropped (improvement #1). Headline + one-line sub set
   left; a floating white search card (18px-radius container, squared white input
   with `Stichwort...` placeholder, squared blue **Suche** button) sits right/below.
   Search is first-viewport (IA invariant #2). Quick search-link pill chips
   (Jobs / Ärztesuche / Baby-Galerie / Sponsoring-Anfragen) under the field.

3. **proof-strip** — a quiet 3-cell horizontal proof row on the warm ground, set
   directly under the hero (improvement #5): **16** Privatkliniken · **300+**
   Kompetenzzentren · **3000+** Ärztinnen und Ärzte. Numbers are captured fact (from
   metaDescription + footer blurb), set at title/display scale, no card chrome — a
   restrained institutional reassurance line, not a SaaS metric grid.

4. **locate** — "Hirslanden in Ihrer Nähe" + the captured paragraph (Bodensee →
   Genfersee) + **Zu den Standorten** primary CTA. Photographic/region support image
   (`assets/media/pflege-hingabe-6e8ca022.jpg` or a calm region treatment). Split
   text/media, contained.

5. **quicklinks** — compact 3-col squared text-tile grid on blue-tint ground
   (`rgba(0,148,212,0.1)`): Kliniksuche, Ärztesuche, Jobs und Karriere,
   Leistungsübersicht pro Versicherungsklasse, Krankheitsbilder von A–Z, Behandlungen
   von A–Z, BMI berechnen. Label + chevron, captured hrefs. Tightened density
   (improvement #2/#3).

6. **group-teasers** — H2 **"Hirslanden-Gruppe"** + 3-up image teaser cards (squared,
   white, single soft shadow): Babygalerie, Für alle Folgen des Lebens, Hirslanden
   Healthline — each with its captured blurb and a normalized **Mehr erfahren** link.

7. **whats-happening** — ONE consolidated secondary band (improvement #2/#4),
   replacing the three co-equal CMS modules. Two columns: **News & Mitteilungen**
   (4 captured article rows with eyebrow tag + date + clinic attribution, section
   link "Alle News und Mitteilungen") and **Veranstaltungen** (4 captured event rows
   with the large day-number date chip, section link "Alle Veranstaltungen"). The
   captured **Hirslanden Blog** blue CTA-band (white headline + **Weiterlesen**)
   closes the section as the full-width blue strip.

8. **footer** (system-component role: `footer`) — full mega footer: HIRSLANDEN-GRUPPE
   blurb (16/300/3000), FOLGEN SIE UNS, three link columns (Quick Links /
   Leistungsangebot / Über uns), the red **Notfallnummer 144** affordance
   (`#f43a11`, reserved — IA invariant #1), copyright © Hirslanden-Gruppe 2026, legal
   links.

## Layout strategy

- Density: balanced. 64px desktop section padding (DESIGN-A `section-desktop`),
  48px tablet, 32px mobile. Tokenized 4pt scale.
- Type: one 1.25 modular scale on Metropolis 400/500/700; headings sentence case,
  tightened line-height (1.18–1.3).
- Container max-width 1200px; 12-col feel via CSS grid, single column < 640px.
- Hero split inverts to stacked < 900px (search card drops below headline,
  full-width). News/Events two-column → stacked < 900px.

## Key states

- Default — described above.
- No JS — fully static; the only script is the ≤10-line mobile-nav a11y sync.

## Interaction model

- Header search icon, nav links, footer links → captured hrefs.
- Hero Suche button → search action (captured form target).
- Quicklink tiles, teaser cards, news/event rows → captured hrefs.
- Hover/focus only: gentle blue hover on links/CTAs, visible focus ring. No scroll
  choreography, no parallax (DESIGN-A Don'ts).

## Data attributes

- `header[data-section="header"][data-intent="navigate"][data-layout="full-bleed"][data-nav-collapse="hamburger"]`
- `section[data-section="hero-search"][data-intent="find care"][data-layout="split-media"][data-media="image"][data-interactive="form"]`
- `section[data-section="proof-strip"][data-intent="build trust"][data-layout="stack"][data-items="3"]`
- `section[data-section="locate"][data-intent="drive action"][data-layout="split-media"][data-media="image"]`
- `section[data-section="quicklinks"][data-intent="navigate"][data-layout="grid"][data-items="7"]`
- `section[data-section="group-teasers"][data-intent="value proposition"][data-layout="grid"][data-items="3"][data-media="image"]`
- `section[data-section="whats-happening"][data-intent="show activity"][data-layout="grid"][data-items="8"]`
- `footer[data-section="footer"][data-intent="navigate"][data-layout="grid"]`

## Unsourced content (placeholder list)

(none) — every literal traces to `current/pages/home.json` or
`_brand-extraction.json` voice samples. The 16/300/3000 scale numbers are captured
fact (metaDescription + footer blurb) and used verbatim, not invented. No stats,
addresses, quotes, or names are fabricated.

## Open questions for craft

- Proof-strip placement: directly under the hero as its own thin band, or folded
  into the hero's lower edge? Resolved: own thin band on the warm ground so it reads
  as deliberate reassurance, not hero chrome.
- Region image for `locate`: use the captured `pflege-hingabe` warm photo, or a
  flat region treatment? Resolved: warm photo, framed (no full-bleed — that is
  variant C's bet).
