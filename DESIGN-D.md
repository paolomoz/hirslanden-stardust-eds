---
name: Hirslanden — Variant D (Confident display)
description: Amplifies Metropolis into a confident editorial display scale on a strict modular grid; 16/300/3000 as a typographic proof block. Static.
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
    fontSize: "clamp(3rem, 6vw, 4.21rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Metropolis, sans-serif"
    fontSize: "2.369rem"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Metropolis, sans-serif"
    fontSize: "1.777rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "normal"
  subtitle:
    fontFamily: "Metropolis, sans-serif"
    fontSize: "1.333rem"
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
  xl: "32px"
  grid-gutter: "24px"
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

# Design System: Hirslanden — Variant D (Confident display)

## 1. Overview

**Creative North Star: "The Institution, Set in Type"**

Variant D amplifies the captured trait the current site under-uses: **Metropolis itself**. Today the single geometric sans carries everything in a soft, ad-hoc stack (42/34/22, line-height ~1.4). D pushes it into a confident editorial display scale on a strict modular grid — large structured headings doing the heavy institutional lifting, photography supporting rather than leading. The 16/300/3000 scale story, today a footer sentence, becomes a **typographic proof block**: three enormous numerals set in Metropolis 700, captioned, on the modular grid near the top of the page.

The bet is that a hospital group's authority can be carried by confident typography on a disciplined grid — not by louder color or more imagery. The scale is a true modular ratio (1.333, perfect fourth), replacing the captured disagreeing ratios. Headings tighten to display line-heights (1.08–1.2). Everything sits on a visible 12-column grid with consistent gutters. Color and motif stay pinned and quiet; the type is the personality. Still — no motion; the scale and grid carry the confidence at rest.

**Key Characteristics:**
- Confident display scale on Metropolis 700 (ratio 1.333, perfect fourth).
- Strict 12-column modular grid with consistent 24px gutters.
- 16/300/3000 rendered as a large typographic proof block, not footer fine print.
- Tight display line-heights (1.08–1.2); photography supports, doesn't lead.
- Same pinned palette and motifs; type is the protagonist.

## 2. Colors

The pinned palette, used sparingly so the type carries the page. Blue marks action and the occasional emphasized numeral; warm neutrals ground the grid.

### Primary
- **Hirslanden Blue** (#0094d4): action (search, CTAs) and — sparingly — to emphasize one numeral or label in the proof block. Never the whole proof block.

### Neutral
- **Ground White** (#ffffff): cards and the proof-block ground.
- **Warm Ground** (#f7f6f5) / **Warm Ground Alt** (#f0efed): alternating grid bands.
- **Text Warm Dark** (#534c46): the display headings and proof numerals — warm, never black, even at large size.
- **Text Warm Soft** (#72665b): captions, grid labels, meta.
- **Hairline** (#e2dfdb): the visible grid rules and dividers.

### Reserved
- **Emergency Red** (#f43a11): the 144 number only.

### Named Rules
**The Type-Carries-It Rule.** Authority is built with display type on a grid, not with more color. Blue stays at action coverage (≤ 10%).
**The Reserved-Red Rule.** `#f43a11` is the 144 number only — never used to emphasize a proof numeral.

## 3. Typography

**Display Font:** Metropolis · **Body Font:** Metropolis · **Label Font:** Metropolis

**Character:** This is the variant where Metropolis is the protagonist. A confident perfect-fourth scale (1.333), tight display line-heights, and large 700-weight headings give institutional gravity without a second typeface or louder color.

### Hierarchy
- **Display** (700, clamp(3rem, 6vw, 4.21rem), 1.08): hero line and the proof-block numerals (16 / 300+ / 3000+).
- **Headline** (700, 2.369rem, 1.12): major section openers.
- **Title** (500, 1.777rem, 1.2): sub-section titles.
- **Subtitle** (500, 1.333rem, 1.3): standfirst / lead lines under headlines.
- **Body** (400, 1rem, 1.6): prose; 60–75ch.
- **Label** (500, 0.8125rem, +0.04em): eyebrows, grid labels, proof-numeral captions.

### Named Rules
**The Perfect-Fourth Rule.** All sizes derive from a single 1.333 ratio off a 1rem base. The captured ad-hoc 42/34/22 set is retired.
**The Proof-Block Rule.** 16 / 300+ / 3000+ are set as Display numerals with Label captions on the grid — the scale story is read as type, not buried as prose.

## 4. Elevation

Flat. The grid and type carry structure, so depth is minimal — one soft shadow on cards only; the proof block sits flat on its ground with grid rules, no shadow.

### Shadow Vocabulary
- **Card Lift** (`box-shadow: 0 2px 12px rgba(0,0,0,0.08)`): content cards only.

### Named Rules
**The Grid-Is-Structure Rule.** Hierarchy comes from grid position and type scale, not from shadows. The proof block uses hairline grid rules, never elevation.

## 5. Components

### Buttons
- **Shape:** squared primary (0px); 18px pill secondary chips.
- **Primary:** Hirslanden Blue on white, 12px 28px.
- **Hover / Focus:** gentle darken / focus ring.

### Proof Block (signature for D)
- **Role:** the institutional scale story (16 / 300+ / 3000+) as a typographic statement near the top.
- **Treatment:** three Display numerals in Metropolis 700 `#534c46`, each with a Label caption ("Privatkliniken" / "Kompetenzzentren" / "Ärztinnen und Ärzte"), aligned on the 12-column grid with hairline rules.
- **Behavior:** static. No count-up animation, no reveal.

### Cards / Containers
- Squared, white, Card Lift, 24px padding, snapped to grid columns.

### Inputs / Fields
- Search input as in A, first-viewport, inside the 18px search-box container, snapped to the grid.

### Navigation
- Same as A — wordmark, nav, utility bar, reachable 144; nav aligns to the grid.

## 6. Do's and Don'ts

### Do:
- **Do** set headings in a confident display scale (1.333 ratio) on Metropolis 700.
- **Do** render 16/300/3000 as a large typographic proof block on the grid.
- **Do** use a strict 12-column grid with consistent 24px gutters.
- **Do** keep tight display line-heights (1.08–1.2) at large sizes.
- **Do** keep color pinned and quiet — type carries the authority.

### Don't:
- **Don't** treat size-as-personality slop (no 120pt vanity display divorced from the grid).
- **Don't** introduce a second typeface to "support" the display — Metropolis carries everything.
- **Don't** spread blue or red across the proof numerals.
- **Don't** use gradients, glassmorphism, neon, or stacked shadows.
- **Don't** add count-up animation, scroll choreography, or any cinematic motion register.
