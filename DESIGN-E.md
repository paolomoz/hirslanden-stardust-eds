---
name: Hirslanden — Variant E (Calm / neutral-forward)
description: Amplifies the warm-neutral ground and extends the 18px pill into a consistent shape system; blue rarer but deliberate. Static.
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
    fontWeight: 500
    lineHeight: 1.22
    letterSpacing: "normal"
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
    letterSpacing: "0.02em"
rounded:
  pill: "18px"
  chip: "18px"
  card: "18px"
  control: "18px"
  tag: "18px"
  dot: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
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
    padding: "28px"
  input:
    backgroundColor: "{colors.ground-white}"
    textColor: "{colors.text-warm-dark}"
    rounded: "{rounded.control}"
    padding: "14px 16px"
  badge:
    backgroundColor: "{colors.blue-tint}"
    textColor: "{colors.hirslanden-blue}"
    rounded: "{rounded.tag}"
    padding: "4px 12px"
---

# Design System: Hirslanden — Variant E (Calm / neutral-forward)

## 1. Overview

**Creative North Star: "Maximal Calm"**

Variant E amplifies two quiet captured traits together: the **warm-neutral color ladder** and the **18px signature pill**. Today blue (#0094d4) is already rationed and the warm grounds (#f7f6f5 / #f0efed) already do a lot — E pushes that further. The warm-neutral ground *carries* the page; blue becomes rarer but more deliberate, reserved for true wayfinding actions only. And the 18px pill, today used on chips while cards/buttons stay squared, is extended into a single consistent shape language: chips, cards, tags, inputs, and buttons all share the 18px radius. The deliberate pill-vs-squared contrast the current site uses is resolved *toward* the pill.

The result is the most spa-like, reassurance-forward reading in the family while staying professional and institutional. Type is quiet (ratio 1.2, weight 500, long line-height). The page is airy within the multi-audience density floor (64px sections + generous interior padding). Still — no motion; the calm is structural, in the soft shapes and the rationed color.

**Key Characteristics:**
- Warm-neutral ground carries the page; blue is rare and deliberate.
- The 18px pill extended into one consistent shape system (chips, cards, tags, inputs, buttons).
- Quiet type: ratio 1.2, heading weight 500, body line-height 1.7.
- Maximal calm / air within the density floor.
- Search and emergency 144 still unmistakable, just inside a softer shape language.

## 2. Colors

The pinned palette, re-weighted toward the warm neutrals. This is the defining move of the variant.

### Primary
- **Hirslanden Blue** (#0094d4): reserved for *true wayfinding actions only* — the search button, the primary "find care" CTA, the active state. Rarer than in any other variant. Its scarcity is the point.

### Neutral (carries the page)
- **Warm Ground** (#f7f6f5): the dominant surface — most sections sit on it.
- **Warm Ground Alt** (#f0efed): the secondary ground for nested panels and chips.
- **Ground White** (#ffffff): used sparingly, for the few elements that need to lift above the warm ground.
- **Text Warm Dark** (#534c46): headings and body — warm, soft, never black.
- **Text Warm Soft** (#72665b): meta, captions, secondary labels.
- **Hairline** (#e2dfdb): the gentlest dividers.

### Reserved
- **Emergency Red** (#f43a11): the 144 number only — and because blue is rarer here, red reads as even more clearly the single alarm color.

### Named Rules
**The Blue-Is-Rare Rule.** `#0094d4` appears only on true wayfinding actions. If a blue element isn't a navigation action, it should be warm-neutral instead.
**The Ground-Carries-It Rule.** The default surface is warm `#f7f6f5`, not white. White is the exception, used only to lift.

## 3. Typography

**Display Font:** Metropolis · **Body Font:** Metropolis · **Label Font:** Metropolis

**Character:** Quiet and unhurried to match the calm. Lighter heading weight (500), a gentle 1.2 ratio, long line-heights. Type recedes so the soft shapes and warm ground set the mood.

### Hierarchy
- **Display** (500, clamp(2rem, 3.5vw, 2.5rem), 1.22): hero line, set in #534c46 on the warm ground — softer weight than the rest of the family.
- **Headline** (500, 1.5rem, 1.3): section openers.
- **Title** (500, 1.25rem, 1.35): card and panel titles.
- **Body** (400, 1.0625rem, 1.7): prose with generous line-height; 60–70ch.
- **Label** (500, 0.8125rem, +0.02em): eyebrows, tags, meta.

### Named Rules
**The Soft-Weight Rule.** Even the hero prefers weight 500; 700 is avoided so nothing on the page shouts.

## 4. Elevation

Almost entirely flat over the warm ground; calm comes from soft shapes and warm color, not from depth. The soft single shadow appears only on the few white elements that lift; most cards sit flat on the warm ground, separated by their rounded shape and a hairline.

### Shadow Vocabulary
- **Card Lift** (`box-shadow: 0 2px 12px rgba(0,0,0,0.08)`): the rare white lifted elements only (e.g. the search box).

### Named Rules
**The Flat-Calm Rule.** Most surfaces are flat warm-ground panels distinguished by their 18px shape, not by shadow. Shadow is the exception, reserved for the one or two elements that must lift.

## 5. Components

### Buttons
- **Shape:** 18px radius — primary buttons now share the pill radius (the shape system extension; the squared-CTA contrast is resolved toward the pill).
- **Primary:** Hirslanden Blue on white — used sparingly, for wayfinding only.
- **Hover / Focus:** gentle darken / focus ring.
- **Secondary:** warm-ground 18px chip.

### Shape System (signature for E)
- **Rule:** every container shape — chips, cards, tags, inputs, buttons — uses the 18px radius. One consistent soft shape language across the page.
- **Cards:** 18px radius, mostly warm-ground (#f7f6f5 / #f0efed), 28px interior padding, flat by default.
- **Tags / Badges:** 18px radius, warm-ground or blue-tint.

### Inputs / Fields
- 18px radius, white field (one of the rare lifts), 1px #e2dfdb border, blue search button (a true wayfinding action).

### Navigation
- Same structure as A — wordmark, nav, utility bar, reachable 144; nav chrome on warm ground, blue reserved for the active state.

## 6. Do's and Don'ts

### Do:
- **Do** let warm `#f7f6f5` carry the page as the default surface.
- **Do** reserve blue for true wayfinding actions only — its scarcity is the point.
- **Do** extend the 18px pill into one consistent shape system (chips, cards, tags, inputs, buttons).
- **Do** keep type quiet (ratio 1.2, weight 500) and the page airy.
- **Do** keep search and emergency 144 unmistakable inside the softer shape language.

### Don't:
- **Don't** default surfaces to white — white is the exception here, used only to lift.
- **Don't** spread blue across non-action elements; if it isn't a wayfinding action, it's warm-neutral.
- **Don't** mix squared and pill shapes — E resolves the contrast toward the pill.
- **Don't** use gradients, glassmorphism, neon, or stacked shadows.
- **Don't** add scroll choreography, parallax, or any cinematic motion register.
