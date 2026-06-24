<!-- stardust:uplift — resolved direction for https://www.hirslanden.ch/ (home).
     User override of the standard uplift contract: 5 STATIC variants (A–E), no cinematic
     layer, all Mode A (palette + typography + brand DNA pinned). Differentiation is by
     AXIS (fix / IA / photography / typography / color), not by motion intensity. -->

# Direction — Hirslanden uplift (5 static variants)

## Pinned brand DNA (Mode A — invariant across all 5 variants)

- **Palette**: primary Hirslanden blue `#0094d4`; warm grounds `#ffffff` / `#f7f6f5` /
  `#f0efed`; warm text `#534c46` / `#72665b`; emergency red `#f43a11` reserved for the 144
  number only. No invented colors, no gradients.
- **Type**: Metropolis only (400 / 500 / 700), the captured open-licence geometric sans.
- **Motifs available**: 18px pill, soft single shadow `0 2px 12px rgba(0,0,0,.08)`, warm
  human photography (clinician-with-patient), search-first wayfinding.
- **Voice**: formal Swiss-German `Sie`, reassurance-forward, scale stated as fact.
- **Hard invariants**: emergency 144 stays unmistakable; search/find-care affordance stays
  first-viewport; warm-not-sterile; one accent + one family restraint.

---

## Variant A — Faithful + improvements
Role: risk-averse green-light. "Yes, that's us, with the obvious fixes."
Composition: same IA as captured (search hero → locate → quicklinks → group → news/events).
Motion: static.
Improvements applied: legible high-contrast hero headline (drop the `#938880` watermark,
set the line in `#534c46` over a controlled scrim); real modular type scale + tightened
heading line-height; tokenized spacing rhythm; consolidated "see more" CTA vocabulary;
tightened section density.

## Variant B — What if the home routed by patient intent?
Role: design-team motivator (IA bet). 
What if: "What do you need today?" replaces the flat module stack.
Captured trait amplified: Audience-routing reframe (candidate #7) + search-as-tool (#3).
Composition: hero pairs the search affordance with a calm set of large need-routing entry
cards — Find a clinic / Find a doctor / Plan your stay / International patients / Emergency
144 — collapsing the quicklink-grid + map + teaser stack into one intent-organized layer.
Motion: static.

## Variant C — What if the photography led?
Role: editorial / warmth bet.
What if: the warm clinician-with-patient photography runs at full editorial scale.
Captured trait amplified: Photography re-foregrounding (candidate #2) + voice-register (#5).
Composition: generous edge-to-edge imagery with editorial lead-ins and captions; reassurance
voice given room; quieter type, more whitespace, magazine-like rhythm. Search stays
first-viewport but the page reads as a warm editorial front door.
Motion: static.

## Variant D — What if type carried the institution?
Role: confident-display bet.
What if: Metropolis pushed into a confident editorial display scale on a strict grid.
Captured trait amplified: Display-typography amplification (candidate #1).
Composition: large structured display headings, visible modular grid, type doing the heavy
lifting with photography supporting; the 16/300/3000 scale story rendered as a confident
typographic proof block rather than a footer sentence.
Motion: static.

## Variant E — What if the page were calmer and more neutral-forward?
Role: calm / atmosphere bet.
What if: the warm-neutral ground carries the page; blue is rarer but more deliberate.
Captured trait amplified: Color-ladder re-weighting (candidate #6) + signature-pill
extension (candidate #4).
Composition: maximal calm and air; blue reserved for true wayfinding actions; the 18px pill
extended into a consistent shape system across chips/cards/tags; the most "spa-like
reassurance" reading while staying professional and institutional.
Motion: static.

---

## Differentiation (axis per variant)
A = baseline fix · B = information architecture · C = photography + voice ·
D = typography + grid · E = color weighting + motif. Each pair differs by ≥2 structural
changes (every variant moves a different primary axis).

---

<!-- stardust:direct provenance — appended below the uplift-authored variant declarations above.
     Does NOT overwrite the uplift's resolution; this section records the Phase 3–5 spec authoring
     (target PRODUCT.md + 5 per-variant DESIGN files + state update) performed by stardust:direct. -->

# stardust:direct — spec authoring (2026-06-24)

## Phrase (verbatim)

> 5 different directions, all very professional, modern, pin colors typography and brand dna, do not play with cinematic for now

## Mode

Brand-faithful (Mode A). Captured signal: **signal-strong** (palette ≥ 3 distinct
colors after clustering; named type family Metropolis). Palette and typography pinned
to the captured brand surface; no rebrand, no divergence-seed roll on type/palette.

## Movements

- **register** — `brand` (inherited from current/PRODUCT.md)
- **expressive axis** — `restrained` → `committed` (per-variant amplification; A stays restrained)
- **distinctiveness** — `familiar` (Mode A pins keep all variants recognisably Hirslanden)
- **density** — `balanced` (64px desktop; multi-audience hard floor active, capped ≤64px / ≥40px)
- **ia-fidelity** — `reimagined` (user-pinned; variants may demote/promote/re-shape IA, B leads on it)
- **motion-energy** — `still / gentle micro-interactions` (user override: STATIC ONLY, no cinematic)
- **audience** — unchanged (prospective + current patients in CH; multi-track JTBD)
- **constraints** — Mode A pins (palette + Metropolis); static-only; IA invariants preserved

## Variant fork (reimagined, role-differentiated)

5 variants A–E. A = faithful + improvements; B–E each amplify a distinct **captured**
trait (no invented moves). Per-variant DESIGN files written at project root.

## IA invariants (in every variant's DESIGN.json extensions.iaPriorities, mutability=movable)

1. emergency 144 unmistakable · 2. search / find-care first-viewport ·
3. warm-not-sterile (warm ground + human photography) · 4. one-accent / one-family restraint.
Plus the per-variant amplified signal (B audience-routing, C photography-foregrounding,
D institutional-proof, E color-weighting + signature-motif).

## Variant differentiation matrix (each pair ≥ 2 substantive changes)

| Pair | Change 1 | Change 2 | (Change 3) |
|---|---|---|---|
| A↔B | IA: flat stack → intent-routing layer | layout strategy of hero (search-only → search + 5 need-cards) | section presence (quicklink/map/teaser collapsed in B) |
| A↔C | layout strategy (thumbnail teasers → full-bleed editorial image blocks) | type (1.25/700 → 1.2/500 quiet) | IA priority (photography promoted to lead) |
| A↔D | type-scale ratio (1.25 → 1.333 + display sizes) | section presence (proof block added upper-page) + visible grid | IA priority (institutional-proof promoted) |
| A↔E | color weighting (white-ground → warm-ground-dominant, blue rationed) | motif (squared cards → unified 18px shape system) | type (1.25/700 → 1.2/500) |
| B↔C | IA spine (intent-routing vs photography-led) | layout strategy (need-cards vs editorial image blocks) | type weight (700 vs 500) |
| B↔D | IA spine (intent-routing vs proof-block/grid) | type-scale (1.25 vs 1.333) | layout (need-cards vs 12-col grid) |
| B↔E | IA spine (intent-routing vs calm/color) | motif (squared vs 18px shape system) | color weighting (white vs warm-ground) |
| C↔D | hero strategy (photo-led vs type-led) | type (1.2/500 vs 1.333/700) | what's amplified (photography vs grid/proof) |
| C↔E | type (700 hero vs 500 hero) — both quiet but: motif (squared vs 18px system) | color (white panels vs warm-ground-dominant) | photography scale (full-bleed vs framed) |
| D↔E | type-scale (1.333/700 vs 1.2/500) | motif (visible grid + squared vs 18px shape system) | color weighting (quiet-pinned vs warm-dominant + blue rationed) |

All 10 pairs clear the ≥ 2 substantive-changes bar. C↔E (both "quiet") was the closest
pair and is differentiated by ≥ 2 axes (motif system + color weighting + photography scale).

## Density hard-floor note

Captured inventory is multi-audience (>2 audience tracks) and >5 sections → multi-audience
hard floor fires: `sectionPadding.desktop` bounded at ≤64px / ≥40px on every variant.
C and E read "generous/calm" via large media, wide gutters, and long line-height (1.7),
NOT via >64px padding. Floor respected across all 5 variants.

## Files written

- `PRODUCT.md` (shared target strategy, Mode A — inherited from current/PRODUCT.md)
- `stardust/prototypes/home-improvements.md` (load-bearing brief for variant A)
- `DESIGN-A.md`/`.json` … `DESIGN-E.md`/`.json` (5 per-variant specs, all static)

## User confirmation

> Direction pre-resolved by the uplift orchestrator; spec authoring proceeded per the
> resolved 5-variant static contract above. No re-resolution.
