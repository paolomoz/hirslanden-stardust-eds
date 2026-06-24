---
_provenance:
  writtenBy: stardust:uplift
  writtenAt: 2026-06-24T00:00:00Z
  againstInput: https://www.hirslanden.ch/
  readArtifacts:
    - stardust/current/_brand-extraction.json
    - stardust/current/pages/home.json
    - stardust/current/brand-review.html
    - stardust/current/PRODUCT.md
---

# Improvements — https://www.hirslanden.ch/

1. **[dated-pattern]** Low-contrast watermark hero headline over a full-bleed photo —
   "Kompetenz, die Vertrauen schafft" renders in light taupe `#938880` painted across the
   image, barely legible, with an overlapping white search card. Reads as a legacy AEM
   hero circa 2014; the brand's strongest line is the hardest thing to read on the page.

2. **[ia-clutter]** The home page is a long stack of equal-weight sections — search hero,
   map locator, quicklink tile grid, 3 teaser cards, news list, events list, blog CTA band
   — with no hierarchy of patient intent. The "search-first" promise is immediately
   undercut by six competing modules below it. A worried visitor has no obvious "I need X"
   path.

3. **[contrast-or-density]** Type scale is ad-hoc (42→34→22px; ratios 1.235 then 1.545
   disagree) and heading line-heights are loose (~1.4), so the page reads soft and
   unstructured. Spacing is component-driven with no tokenized rhythm (`:root` exposes only
   `--brandColor`), so vertical rhythm is inconsistent section to section.

4. **[cliché]** News + Events + Blog as three separate corporate-CMS list modules is
   "show we're active" filler that competes with the core wayfinding job. Three different
   "see more" labels ("Mehr erfahren" ×3, "Weiterlesen", "Alle News und Mitteilungen")
   fragment the CTA vocabulary.

5. **[missed-opportunity]** The warm human photography (clinician-with-patient, genuinely
   excellent and on-brand) is cropped to thumbnail teaser cards, and the national footprint
   is a small map graphic. The institutional proof story — 16 clinics, 300+ centres, 3000+
   doctors — is buried as a footer sentence rather than presented as confident, ownable
   reassurance.
