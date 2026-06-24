<!--
_provenance:
  writtenBy: stardust:direct
  writtenAt: 2026-06-24T00:00:00Z
  adaptedFrom: stardust/uplift-improvements.md
  readArtifacts:
    - stardust/current/_brand-extraction.json
    - stardust/current/pages/home.json
    - stardust/current/PRODUCT.md
    - stardust/direction.md
  stardustVersion: 0.10.0
  note: >
    Load-bearing brief for variant A (faithful + improvements). Variants B–E
    honor this list as a floor — they may go further but may not contradict it.
-->

# Improvements — home

1. **[dated-pattern]** Low-contrast watermark hero headline. "Kompetenz, die
   Vertrauen schafft" renders in light taupe `#938880` painted directly across
   a full-bleed photo (1440×868), barely legible, with an overlapping white
   search card. Reads as a legacy AEM hero circa 2014; the brand's strongest
   line is the hardest thing to read on the page.
   *Fix:* Drop the watermark. Set the line in warm dark `#534c46` (or `#ffffff`)
   over a controlled scrim / solid panel so it passes AA; keep the search card,
   anchor the headline above or beside it with real hierarchy.

2. **[ia-clutter]** Flat equal-weight module stack. The home page is a long
   stack of co-equal sections — search hero → map locator → quicklink tile grid
   → 3 teaser cards → news list → events list → blog CTA band — with no hierarchy
   of patient intent. The "search-first" promise is immediately undercut by six
   competing modules below it; a worried visitor has no obvious "I need X" path.
   *Fix:* Establish one clear intent layer directly under the hero (find a clinic
   / find a doctor / plan a stay / international / emergency), then demote
   news/events/blog to a single secondary "what's happening" band.

3. **[contrast-or-density]** Ad-hoc type scale + loose rhythm. Heading sizes are
   42 → 34 → 22px with disagreeing ratios (42/34 = 1.235, 34/22 = 1.545), and
   heading line-heights are loose (~1.4), so the page reads soft and
   unstructured. Spacing is component-driven with no tokenized rhythm (`:root`
   exposes only `--brandColor`), so vertical rhythm is inconsistent section to
   section.
   *Fix:* Introduce a real modular type scale (single ratio ≥ 1.25) on Metropolis
   400/500/700, tighten heading line-height to ~1.15–1.25, and tokenize a 4pt
   spacing scale with a consistent section rhythm.

4. **[cliché]** Three redundant CMS list modules + fragmented CTA vocabulary.
   News + Events + Blog as three separate corporate-CMS list modules is
   "show we're active" filler that competes with the core wayfinding job. CTA
   labels are fragmented: "Mehr erfahren" ×3, "Weiterlesen", "Alle News und
   Mitteilungen", "Zu den Standorten".
   *Fix:* Consolidate news/events/blog into one secondary band; pick a canonical
   "see more" vocabulary (one verb for primary navigation actions, one for
   "read more" content links) instead of five disagreeing labels.

5. **[missed-opportunity]** Strong photography reduced to thumbnails; proof story
   buried. The warm human photography (clinician-with-patient, genuinely
   excellent and on-brand — `hero-onkologie` is 2900×1419) is cropped to
   thumbnail teaser cards, and the national footprint is a small map graphic. The
   institutional proof story — 16 clinics, 300+ centres, 3000+ doctors — is
   buried as a footer sentence rather than presented as confident, ownable
   reassurance.
   *Fix:* Give the hero photography editorial scale; surface the 16/300/3000
   scale story as a deliberate proof element near the top of the page rather than
   footer fine print.
