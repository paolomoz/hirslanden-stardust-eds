---
name: Hirslanden — Variant B (Care-routing first)
description: Amplifies audience-routing — the home opens with "What do you need today?" intent cards beside search. Static.
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
  intent-card: "0px"
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
  intent-card:
    backgroundColor: "{colors.ground-white}"
    textColor: "{colors.text-warm-dark}"
    rounded: "{rounded.intent-card}"
    padding: "24px 24px 28px"
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

# Design System: Hirslanden — Variant B (Care-routing first)

## 1. Overview

**Creative North Star: "What do you need today?"**

Variant B amplifies one captured trait the current site underplays: **audience-routing**. PRODUCT.md lists parallel jobs-to-be-done (find a clinic, find a doctor, plan a stay, international patients, emergency) but the captured home buries them in a flat equal-weight module stack. B reframes the first viewport around explicit patient intent: the search affordance is paired with a calm set of large need-routing entry cards — **Find a clinic / Find a doctor / Plan your stay / International patients / Emergency 144** — and the quicklink-grid + map + teaser stack collapse into one intent-organized layer.

This is the IA bet: same brand DNA, same Hirslanden blue and Metropolis and warm grounds, but the *spine* of the page becomes "I need X → here is the path." It directly closes improvement #2 (ia-clutter). Search stays first-viewport (improvement honored as a floor); it is now the tool *inside* the routing layer rather than a lone hero. Still and quiet — gentle hover/focus on the intent cards only, no scroll choreography.

**Key Characteristics:**
- Intent-routing layer leads the page (5 need-cards beside search).
- The flat quicklink + map + teaser stack collapses into one organized layer.
- Emergency 144 is one of the five routing entries — unmistakable, in red.
- Same pinned brand DNA; the IA moves, not the surface.
- Balanced density (64px) so five cards breathe without sprawl.

## 2. Colors

Identical pinned palette to the rest of the family. The intent cards use white over the warm ground with the soft card shadow; the Emergency 144 card carries the reserved red on its label.

### Primary
- **Hirslanden Blue** (#0094d4): action color on the four wayfinding intent cards (icon + link affordance), search button, CTAs.

### Neutral
- **Ground White** (#ffffff): intent cards and content cards.
- **Warm Ground** (#f7f6f5) / **Warm Ground Alt** (#f0efed): page ground; alternating bands.
- **Text Warm Dark** (#534c46): card titles and body.
- **Text Warm Soft** (#72665b): card descriptions and meta.
- **Hairline** (#e2dfdb): dividers, input borders.

### Reserved
- **Emergency Red** (#f43a11): the Emergency 144 intent card's label and number only.

### Named Rules
**The One Voice Rule.** Blue marks the four wayfinding actions; it does not also decorate the cards' grounds.
**The Reserved-Red Rule.** The fifth intent card (Emergency 144) is the only place `#f43a11` appears — and it must read as distinct from the four blue cards, not louder for its own sake.

## 3. Typography

**Display Font:** Metropolis · **Body Font:** Metropolis · **Label Font:** Metropolis

**Character:** Same modular scale as variant A (ratio 1.25) — type is a structural support here, not the protagonist. The intent-card titles use Title weight; the routing question ("Was brauchen Sie heute?") uses Headline.

### Hierarchy
- **Display** (700, clamp(2.25rem, 4vw, 2.75rem), 1.18): the reassurance line, if retained above the routing layer.
- **Headline** (700, 1.75rem, 1.22): the routing question and section openers.
- **Title** (500, 1.375rem, 1.3): intent-card titles ("Klinik finden").
- **Body** (400, 1rem, 1.6): card descriptions; one tight sentence each.
- **Label** (500, 0.8125rem, +0.02em): eyebrows, meta, buttons.

### Named Rules
**The Modular-Scale Rule.** Single 1.25 ratio, shared with the whole family.

## 4. Elevation

Flat over warm ground; one soft shadow lifts the intent cards and content cards. The routing layer reads as a set of equal-weight liftable tiles — no card is heavier than another except the emergency card's red label.

### Shadow Vocabulary
- **Card Lift** (`box-shadow: 0 2px 12px rgba(0,0,0,0.08)`): intent cards and content cards.

### Named Rules
**The Single-Shadow Rule.** One shadow value; the five intent cards share it exactly so the layer reads as one organized choice.

## 5. Components

### Buttons
- **Shape:** squared primary (0px); 18px pill secondary chips.
- **Primary:** Hirslanden Blue on white, 12px 28px.
- **Hover / Focus:** gentle darken / visible focus ring.

### Intent Card (signature component for B)
- **Role:** the page's lead affordance — one of five patient-intent routes.
- **Shape:** squared (0px), white over warm ground, Card Lift shadow.
- **Content:** icon + Title + one-sentence Body + arrow affordance. The Emergency 144 card swaps the blue affordance for the reserved red number.
- **Behavior:** whole card is a link target; gentle hover lift via shadow/background only. No motion choreography.

### Cards / Containers
- Squared, white, Card Lift, 24px padding — for the collapsed "what's happening" secondary band.

### Inputs / Fields
- Search input inside the routing layer: white field, 1px #e2dfdb border, blue search button, inside the 18px search-box container.

### Navigation
- Same as A — wordmark, primary nav, utility bar, reachable 144.

## 6. Do's and Don'ts

### Do:
- **Do** lead the page with the intent-routing layer (5 need-cards + search).
- **Do** keep search first-viewport as the tool inside the routing layer.
- **Do** make Emergency 144 one of the five routes, in reserved red.
- **Do** collapse the captured quicklink/map/teaser stack into the one organized layer.
- **Do** keep the five intent cards equal-weight (same shadow, same shape).

### Don't:
- **Don't** turn the routing cards into a marketing feature-card triplet (Generic-2026-SaaS silhouette).
- **Don't** spread blue across the card grounds — it marks action, not decoration.
- **Don't** make the emergency card louder than functional, or use red anywhere else.
- **Don't** use gradients, glassmorphism, neon, or stacked shadows.
- **Don't** add scroll choreography, parallax, or any cinematic motion register.
