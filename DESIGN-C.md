---
name: Hirslanden — Variant C (Photography-led)
description: Amplifies warm clinician-with-patient photography at full editorial scale; reassurance voice given room. Static.
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
    fontSize: "clamp(2rem, 3.5vw, 2.5rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.005em"
  headline:
    fontFamily: "Metropolis, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "normal"
  title:
    fontFamily: "Metropolis, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: "normal"
  body:
    fontFamily: "Metropolis, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  label:
    fontFamily: "Metropolis, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.04em"
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
  xl: "40px"
  xxl: "56px"
  section-mobile: "40px"
  section-tablet: "56px"
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
    padding: "32px"
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

# Design System: Hirslanden — Variant C (Photography-led)

## 1. Overview

**Creative North Star: "The Warm Editorial Front Door"**

Variant C amplifies the captured trait the current site most wastes: its **photography**. The clinician-with-patient imagery (`hero-onkologie` at 2900×1419) is genuinely excellent and on-brand, yet today it is cropped to thumbnail teaser cards. C runs it at full editorial scale — edge-to-edge hero, generous image-led sections with quiet captions and lead-ins — and gives the reassurance voice ("Kompetenz, die Vertrauen schafft"; "bei allen Folgen des Lebens sind wir für Sie da") the room to read as editorial, not chrome.

The type goes *quieter* to let the photography lead: a smaller ratio (1.2), lighter heading weights (500 over 700), and a longer body line-height (1.7). Whitespace is generous and magazine-like within the multi-audience density floor (sections at 64px desktop — the floor ceiling — with wide gutters and large media doing the breathing). Search stays first-viewport (improvement #2 floor honored), but the page reads as a warm front door rather than a tool rack. Still — no motion; the imagery carries the warmth at rest.

**Key Characteristics:**
- Full-bleed / edge-to-edge editorial photography, captured images reused at scale.
- Quieter type: ratio 1.2, heading weight 500, body line-height 1.7.
- Generous magazine whitespace (64px sections at the floor ceiling; large media + wide gutters).
- Reassurance voice given editorial lead-ins and captions.
- Search stays first-viewport; warmth, not sterility, is the headline.

## 2. Colors

The same pinned palette, but the *photography* carries most of the page's warmth, so blue and text sit quietly around it.

### Primary
- **Hirslanden Blue** (#0094d4): action only — search, captions' "Mehr erfahren" links, a single CTA per section. Rarer here because the imagery does the emotional work.

### Neutral
- **Ground White** (#ffffff): caption panels and content cards beside imagery.
- **Warm Ground** (#f7f6f5) / **Warm Ground Alt** (#f0efed): editorial section grounds between image bands.
- **Text Warm Dark** (#534c46): lead-ins and body — warm, never black, so it sits with the photography.
- **Text Warm Soft** (#72665b): captions and credits.
- **Hairline** (#e2dfdb): thin dividers between editorial blocks.

### Reserved
- **Emergency Red** (#f43a11): the 144 number only, in the footer / chrome.

### Named Rules
**The Photography-Leads Rule.** On any image-led section, the photograph is the largest element; type and color are quiet partners, never competing for the eye.
**The Reserved-Red Rule.** `#f43a11` is the 144 number only — the editorial warmth never borrows it.

## 3. Typography

**Display Font:** Metropolis · **Body Font:** Metropolis · **Label Font:** Metropolis

**Character:** Deliberately quiet so the photography leads. Lighter heading weight (500), a gentle 1.2 ratio, and a long 1.7 body line-height give an unhurried, magazine reading rhythm.

### Hierarchy
- **Display** (700, clamp(2rem, 3.5vw, 2.5rem), 1.2): reserved for the hero reassurance line over imagery, on a controlled scrim/panel for AA.
- **Headline** (500, 1.5rem, 1.3): editorial section lead-ins — lighter weight, not a shout.
- **Title** (500, 1.25rem, 1.35): caption titles, card titles.
- **Body** (400, 1.0625rem, 1.7): editorial prose; 60–70ch measure, room to breathe.
- **Label** (500, 0.8125rem, +0.04em): eyebrow labels, photo credits.

### Named Rules
**The Quiet-Type Rule.** Headings prefer weight 500; weight 700 is reserved for the single hero line. Type never out-shouts the image.

## 4. Elevation

Mostly flat — photography provides the depth. Caption panels and content cards beside imagery carry the one soft shadow; full-bleed images sit flat against the page.

### Shadow Vocabulary
- **Card Lift** (`box-shadow: 0 2px 12px rgba(0,0,0,0.08)`): caption panels and content cards only.

### Named Rules
**The Image-Is-Flat Rule.** Editorial photography is never given a shadow or a frame — it sits edge-to-edge or full-bleed.

## 5. Components

### Buttons
- **Shape:** squared primary (0px); 18px pill secondary chips.
- **Primary:** Hirslanden Blue on white — one per editorial section.
- **Hover / Focus:** gentle darken / focus ring.

### Editorial Image Block (signature for C)
- **Role:** the page's lead pattern — a captured photograph at full-bleed or edge-to-edge with a quiet lead-in and caption.
- **Treatment:** image untreated (brand-faithful, no filters); optional warm-ground caption panel with Title + Body + one link.
- **Behavior:** static. No parallax, no Ken-Burns, no reveal.

### Caption Panel / Card
- Squared, white, Card Lift, 32px padding — generous interior to match the editorial scale.

### Inputs / Fields
- Search input as in A/B, first-viewport, inside the 18px search-box container.

### Navigation
- Same as A — wordmark, nav, utility bar, reachable 144.

## 6. Do's and Don'ts

### Do:
- **Do** run the captured photography at full editorial scale, reused at its captured semantic position (hero stays hero).
- **Do** keep type quiet (ratio 1.2, heading weight 500) so imagery leads.
- **Do** give the reassurance voice room as editorial lead-ins and captions.
- **Do** keep search first-viewport.
- **Do** keep images flat and untreated; warm-ground panels carry any lift.

### Don't:
- **Don't** crop the strong photography back to thumbnail teasers.
- **Don't** apply filters, duotone, or heavy overlays to brand photography (warm-faithful, untreated).
- **Don't** let type or blue out-shout the image.
- **Don't** use gradients, glassmorphism, neon, or stacked shadows.
- **Don't** add Ken-Burns, parallax, scroll choreography, or any cinematic motion register.
