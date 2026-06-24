---
name: Hirslanden — Variant A (Faithful + improvements)
description: Brand-faithful uplift of the Hirslanden home — same IA, the obvious fixes applied. Static.
colors:
  hirslanden-blue: "#0094d4"
  blue-tint: "rgba(0,148,212,0.1)"
  ground-white: "#ffffff"
  ground-warm: "#f7f6f5"
  ground-warm-alt: "#f0efed"
  text-warm-dark: "#534c46"
  text-warm-soft: "#72665b"
  hairline: "#e2dfdb"
  emergency-red: "#f43a11"
typography:
  display:
    fontFamily: "Metropolis, sans-serif"
    fontSize: "clamp(2.25rem, 4vw, 2.75rem)"
    fontWeight: 700
    lineHeight: 1.18
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Metropolis, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.22
    letterSpacing: "normal"
  title:
    fontFamily: "Metropolis, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "Metropolis, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Metropolis, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.02em"
rounded:
  pill: "18px"
  card: "0px"
  control: "0px"
  dot: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section-mobile: "32px"
  section-tablet: "48px"
  section-desktop: "64px"
components:
  button-primary:
    backgroundColor: "{colors.hirslanden-blue}"
    textColor: "{colors.ground-white}"
    rounded: "{rounded.control}"
    padding: "12px 28px"
    typography: "{typography.label}"
  button-secondary:
    backgroundColor: "{colors.ground-warm}"
    textColor: "{colors.text-warm-dark}"
    rounded: "{rounded.pill}"
    padding: "8px 18px"
  card:
    backgroundColor: "{colors.ground-white}"
    textColor: "{colors.text-warm-dark}"
    rounded: "{rounded.card}"
    padding: "24px"
  input:
    backgroundColor: "{colors.ground-white}"
    textColor: "{colors.text-warm-dark}"
    rounded: "{rounded.control}"
    padding: "14px 16px"
  badge:
    backgroundColor: "{colors.blue-tint}"
    textColor: "{colors.hirslanden-blue}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
---

# Design System: Hirslanden — Variant A (Faithful + improvements)

## 1. Overview

**Creative North Star: "The Calm Front Door, Corrected"**

Variant A is the brand exactly as it is today, with the obvious fixes applied — the version a risk-averse stakeholder green-lights with "yes, that's us." It keeps the captured IA (search hero → locate → quicklinks → group → news/events) and the captured visual DNA (Hirslanden blue, warm neutral grounds, Metropolis, the 18px pill, the soft single card shadow). It changes only execution quality: the watermark hero headline becomes legible, the ad-hoc type scale becomes a real modular scale, spacing becomes tokenized, and the CTA vocabulary is consolidated.

This is a healthcare wayfinding hub, not a marketing funnel. It rejects the Generic-2026-SaaS silhouette (centered hero + dual-CTA + feature-card-triplet in primary blue), aggressive conversion patterns, and any cold clinical-tech aesthetic. Depth is one soft shadow over a warm ground; color is rationed to a single blue, with emergency red reserved for 144. The page is still and quiet — gentle hover/focus micro-interactions only, no scroll choreography.

**Key Characteristics:**
- Same IA and section sequence as the captured home.
- Legible, controlled-contrast hero headline (no taupe watermark).
- One modular type scale (ratio 1.25) on Metropolis 400/500/700.
- Tokenized 4pt spacing, balanced section rhythm (64px desktop).
- One canonical "see more" vocabulary; one accent; one family.

## 2. Colors

A warm, rationed palette: a single brand blue for action over warm-neutral grounds, with one reserved alarm color.

### Primary
- **Hirslanden Blue** (#0094d4): the one action color — search button, primary CTAs ("Zu den Standorten"), eyebrow badges, the Hirslanden Blog band. Confirmed by `--brandColor`. Used on white / near-white grounds where it passes AA.

### Neutral
- **Ground White** (#ffffff): elevated card surfaces and the search card, floated over the warm ground.
- **Warm Ground** (#f7f6f5): the page ground beneath the cards; the warm off-white that keeps the page from reading sterile.
- **Warm Ground Alt** (#f0efed): callout / alternating section ground.
- **Text Warm Dark** (#534c46): body and heading text — a deliberate warm taupe-grey, never pure black.
- **Text Warm Soft** (#72665b): meta text (clinic names, dates, captions).
- **Hairline** (#e2dfdb): input borders and dividers.

### Reserved
- **Emergency Red** (#f43a11): the emergency number 144 only.

### Named Rules
**The One Voice Rule.** A single brand blue carries every action; it appears on ≤ 10% of any viewport. Its rarity is what makes a CTA read as a CTA.
**The Reserved-Red Rule.** `#f43a11` is permitted on the 144 emergency affordance and nowhere else. It is never a hover, a badge, or a decoration.

## 3. Typography

**Display Font:** Metropolis (with sans-serif fallback)
**Body Font:** Metropolis
**Label Font:** Metropolis

**Character:** A single open-licence geometric sans carries headings, body, labels, and UI chrome. The personality is calm and institutional — geometric warmth, never loud. Variant A's contribution is structure: a real modular scale replaces the captured ad-hoc 42/34/22 sizing.

### Hierarchy
- **Display** (700, clamp(2.25rem, 4vw, 2.75rem), 1.18): hero headline only — now legible, set in `#534c46` or `#ffffff` on a controlled scrim.
- **Headline** (700, 1.75rem, 1.22): section openers.
- **Title** (500, 1.375rem, 1.3): card and list titles.
- **Body** (400, 1rem, 1.6): prose; 60–75ch max measure.
- **Label** (500, 0.8125rem, +0.02em): eyebrows, meta, button text.

### Named Rules
**The Modular-Scale Rule.** Heading sizes follow a single 1.25 ratio. The captured 42/34/22 ad-hoc set is replaced; ratios may not disagree.
**The Mixed-Case Rule.** Headings are sentence case. Uppercase is reserved for short eyebrow labels — the brand voice survives mixed-case and reads more current.

## 4. Elevation

Flat by default over a warm ground. The only depth is one soft, low, diffuse shadow on elevated white cards — never heavy, never a drop shadow.

### Shadow Vocabulary
- **Card Lift** (`box-shadow: 0 2px 12px rgba(0,0,0,0.08)`): white content cards and the floating search card over the warm-grey ground.

### Named Rules
**The Single-Shadow Rule.** One shadow value site-wide. No stacked shadows, no glow, no inset.

## 5. Components

### Buttons
- **Shape:** primary actions are squared (0px), in deliberate contrast to the 18px pill chips.
- **Primary:** Hirslanden Blue (#0094d4) on white text, 12px 28px, label type.
- **Hover / Focus:** gentle darken on hover; visible focus ring. No motion beyond the state change.
- **Secondary:** warm-ground pill chip (#f7f6f5, 18px radius, #534c46 text) — the quick-link chips.

### Chips
- **Style:** 18px pill, warm-ground background, warm-dark text. The signature radius.

### Cards / Containers
- **Corner Style:** squared (0px) — matches the captured card treatment.
- **Background:** white over the warm ground.
- **Shadow Strategy:** Card Lift only (see Elevation).
- **Internal Padding:** 24px.

### Inputs / Fields
- **Style:** white field, 1px #e2dfdb border, squared corners, inside an 18px-radius search-box container.
- **Focus:** visible blue focus ring.

### Navigation
- Wordmark left, primary nav (Kliniken / Ärzte / Fachgebiete) + search + utility bar (Kontakt / Medien / FR/EN). Warm-dark text, blue active/hover. The emergency 144 stays reachable in the chrome.

## 6. Do's and Don'ts

### Do:
- **Do** keep the captured IA and section sequence intact — this is the faithful variant.
- **Do** set the hero headline in legible `#534c46` or white over a controlled scrim; the strongest line must be the easiest to read.
- **Do** use one modular type scale (1.25 ratio) and tokenized 4pt spacing.
- **Do** reserve `#0094d4` for action on white/near-white grounds, and `#f43a11` for 144 only.
- **Do** keep motion to gentle hover/focus micro-interactions.

### Don't:
- **Don't** build the Generic-2026-SaaS silhouette (centered hero + dual-CTA + three feature cards in blue).
- **Don't** use cold clinical-tech aesthetics — no pure-black text, no sterile pure-white-only ground, no equipment photography.
- **Don't** use gradients, glassmorphism, neon, or heavy/stacked shadows.
- **Don't** SHOUT in all-caps body copy or introduce a second type family.
- **Don't** add scroll choreography, parallax, or any cinematic motion register.
