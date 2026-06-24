---
name: Hirslanden (current state)
description: Calm, warm-institutional wayfinding hub for Switzerland's largest private-hospital group.
colors:
  brand-blue: "#0094d4"
  brand-blue-tint: "#e6f4fb"
  warm-white: "#f7f6f5"
  warm-grey-100: "#f0efed"
  text-taupe: "#534c46"
  text-taupe-soft: "#72665b"
  text-taupe-light: "#938880"
  border-warm: "#e2dfdb"
  emergency-red: "#f43a11"
  pure-white: "#ffffff"
typography:
  display:
    fontFamily: "\"Metropolis\", sans-serif"
    fontSize: "42px"
    fontWeight: 700
    lineHeight: 1.43
    letterSpacing: "normal"
  headline:
    fontFamily: "\"Metropolis\", sans-serif"
    fontSize: "34px"
    fontWeight: 700
    lineHeight: 1.41
    letterSpacing: "normal"
  title:
    fontFamily: "\"Metropolis\", sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.36
    letterSpacing: "normal"
  body:
    fontFamily: "\"Metropolis\", sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.63
    letterSpacing: "normal"
  label:
    fontFamily: "\"Metropolis\", sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
rounded:
  pill: "18px"
  square: "0px"
  circle: "50%"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.brand-blue}"
    textColor: "{colors.pure-white}"
    rounded: "{rounded.square}"
    padding: "12px 28px"
  chip-secondary:
    backgroundColor: "{colors.warm-white}"
    textColor: "{colors.text-taupe}"
    rounded: "{rounded.pill}"
    padding: "8px 18px"
  card:
    backgroundColor: "{colors.pure-white}"
    textColor: "{colors.text-taupe}"
    rounded: "{rounded.square}"
    padding: "24px"
  input-search:
    backgroundColor: "{colors.pure-white}"
    textColor: "{colors.text-taupe}"
    rounded: "{rounded.square}"
    padding: "14px 16px"
---

# Design System: Hirslanden (current state)

## 1. Overview

**Creative North Star: "The Calm Swiss Clinic"**

This is the visual system of a private-hospital group that wants a worried visitor to exhale. It is restrained, warm, and institutional — the opposite of cold clinical-tech. Everything rests on a *warm* neutral foundation: off-white grounds (#f7f6f5) and warm taupe-grey text (#534c46), never pure black on sterile white. A single calm blue (#0094d4, declared as the CSS variable `--brandColor`) is the only chromatic voice, used for action and emphasis. Typography is a single geometric sans (Metropolis) doing every job. Photography is human — clinicians in conversation with patients in bright, lake-and-mountain Swiss interiors — not equipment or façades.

The system explicitly rejects the marketing-funnel landing page: the hero's primary affordance is a **search box plus quick-link pills**, not a high-pressure CTA. It rejects decoration: no gradients, no glassmorphism, no neon, no heavy shadows — depth is a single soft card shadow floating white content over the warm ground. Color is rationed so hard that the one truly loud value on the entire page — the emergency red (#f43a11) on "Notfallnummer 144" — reads as an unmissable alarm precisely because nothing else competes with it.

**Key Characteristics:**
- Warm-neutral foundation (warm-white grounds, taupe-grey text), never cold black-on-white.
- One accent (Hirslanden blue) for all action; one type family (Metropolis) for everything.
- Search-first, wayfinding hero — find a clinic / doctor / specialty fast.
- Soft single-elevation cards over a warm ground; no decorative effects.
- Rationed saturation: emergency red is the only competing color, reserved for the 144 number.

## 2. Colors

A warm-neutral palette anchored by one calm institutional blue, with a single high-alarm red held in reserve.

### Primary
- **Hirslanden Blue** (#0094d4): The only action color. Search button, "Zu den Standorten" / "Weiterlesen" CTAs, the full-width Hirslanden Blog band, carousel active dot, and eyebrow badges. Declared as `--brandColor` and tinted to `--brandColorOpacity rgba(0,148,212,0.1)` for quick-link tile backgrounds.

### Neutral
- **Warm White** (#f7f6f5): The page ground beneath the floating white cards. The system's default temperature.
- **Warm Grey 100** (#f0efed): A second, slightly deeper warm neutral for callout/alternating bands.
- **Pure White** (#ffffff): Card and search-box surfaces, elevated over the warm ground. Kept verbatim.
- **Text Taupe** (#534c46): Body and most heading text — a warm dark taupe-grey deliberately used instead of black.
- **Text Taupe Soft** (#72665b): Secondary meta — clinic names, event locations.
- **Text Taupe Light** (#938880): The decorative low-contrast hero watermark headline.
- **Warm Border** (#e2dfdb): Hairline dividers (footer nav, input strokes).

### Tertiary (alarm)
- **Emergency Red** (#f43a11): One use only — the footer "Notfallnummer 144" label. The single saturated warm accent in an otherwise blue/neutral system.

### Named Rules
**The One Blue Rule.** There is exactly one accent: Hirslanden Blue. It carries all action and emphasis; nothing else is allowed to read as "clickable-important" except the emergency number.

**The Warm Neutral Rule.** Never pure black on pure white for content. Text is warm taupe-grey (#534c46); grounds are warm off-white (#f7f6f5). The warmth is the brand.

## 3. Typography

**Display Font:** Metropolis (with sans-serif fallback)
**Body Font:** Metropolis (the same family)
**Label/Mono Font:** Metropolis (same family); a separate icon font ("Icons", woff) supplies glyphs.

**Character:** A single, friendly geometric sans does every job — headings, body, buttons, labels. Metropolis's even, circular forms read as approachable and modern without being trendy; one family keeps the system quiet and coherent.

### Hierarchy
- **Display** (700, 42px, line-height 1.43): The hero headline, rendered uppercase as a faint watermark over the photo in the light taupe (#938880). "KOMPETENZ, DIE VERTRAUEN SCHAFFT".
- **Headline** (700, 34px, line-height 1.41): Section headings — "Hirslanden-Gruppe", "News & Mitteilungen", "Veranstaltungen".
- **Title** (700, 22px, line-height 1.36): Card and teaser headings — "Babygalerie", "Hirslanden Healthline".
- **Body** (400, 16px, line-height 1.63): Prose. Generous line-height for calm reading; 65–75ch on long copy.
- **Label** (500, 13px, line-height 1.4): Dense meta — clinic names, dates, eyebrow tags.

### Named Rules
**The One Family Rule.** Metropolis carries every register. No display/body pairing, no second typeface. Distinction comes from weight (400/500/700) and size, not from mixing families.

## 4. Elevation

The system is nearly flat. Depth is conveyed by a single soft card shadow that floats white content surfaces (the search card, teaser/news/event cards) above the warm off-white ground. No gradients, no layered stacks, no glow. The off-white-vs-white contrast does most of the elevation work; the shadow only confirms it.

### Shadow Vocabulary
- **Card float** (`box-shadow: 0 2px 12px rgba(0,0,0,0.08)`): The one shadow. White cards over the warm ground. (Value approximate — measured off the floating search card and content cards.)

### Named Rules
**The Single-Shadow Rule.** There is one elevation. Surfaces are flat or floated-on-the-card-shadow; there is no second, deeper shadow tier.

## 5. Components

### Buttons
- **Shape:** Two deliberately contrasting shapes co-exist — primary actions are **squared** (0px), secondary chips are **pill** (18px).
- **Primary:** Hirslanden Blue (#0094d4) fill, white text, square corners, ~12px 28px padding. Search "Suche", "Zu den Standorten", "Weiterlesen".
- **Hover / Focus:** Darken on hover (motion disabled during capture; not precisely measured).
- **Secondary (chips):** Warm-white (#f7f7f6) fill, taupe text, 18px pill radius, ~8px 18px padding. The quick-link row under the search box (Jobs, Ärztesuche, Baby-Galerie, Sponsoring-Anfragen).

### Chips
- **Style:** Warm-white pill (18px radius), taupe text, no border. Used as quick-link affordances, not as filters.

### Cards / Containers
- **Corner Style:** Square / near-square (0px) on content cards.
- **Background:** Pure white over the warm-white ground.
- **Shadow Strategy:** The single "Card float" shadow (see Elevation).
- **Border:** None on cards; hairline warm border (#e2dfdb) on inputs and footer dividers.
- **Internal Padding:** ~24px.

### Inputs / Fields
- **Style:** White field, hairline warm border (#e2dfdb), square corners, paired with the blue search button inside an 18px-radius white search-box container.
- **Focus:** Not measured (reducedMotion capture).

### Navigation
- **Header:** Wordmark left; primary nav (Kliniken, Ärzte, Fachgebiete) center-left; search + menu toggle right; utility bar (Kontakt, Medien, FR/EN) above. Taupe text, blue on active/hover.
- **Footer:** Multi-column mega-menu (Quick Links / Leistungsangebot / Über uns), group blurb, social row, copyright, and a red emergency number (144).

### Signature Components
- **Search-first hero:** Full-bleed photo + uppercase watermark headline + an overlapping white search card with quick-link pills.
- **Map locator:** "Hirslanden in Ihrer Nähe" — a Switzerland map with location pins, copy, and a blue CTA.
- **Quick-link tile grid:** Icon tiles on a primary-tint (blue-10%) background.
- **Date-chip event rows:** "Veranstaltungen" rows fronted by a large day-number chip (25, 01, 02).
- **CTA band:** Full-width Hirslanden-blue "Hirslanden Blog" band with white headline + "Weiterlesen".

## 6. Do's and Don'ts

### Do:
- **Do** keep the warm neutral foundation: warm-white grounds (#f7f6f5), warm taupe-grey text (#534c46). The warmth is the brand.
- **Do** use exactly one accent — Hirslanden Blue (#0094d4) — for all action and emphasis (The One Blue Rule).
- **Do** set everything in Metropolis; vary weight (400/500/700) and size, not family (The One Family Rule).
- **Do** lead the hero with a search affordance and quick-link pills — wayfinding, not a high-pressure CTA.
- **Do** reserve emergency red (#f43a11) for the 144 emergency number and nothing else; its rarity is what makes it work.
- **Do** float white cards over the warm ground with the single soft shadow (`0 2px 12px rgba(0,0,0,0.08)`).
- **Do** use human, in-conversation clinician-and-patient photography in bright Swiss interiors.

### Don't:
- **Don't** use pure black on sterile pure white for content — that is the cold clinical-tech look this brand rejects.
- **Don't** add gradients, glassmorphism, neon, or heavy/layered drop shadows. One soft elevation only (The Single-Shadow Rule).
- **Don't** introduce a second typeface or display font for flavour.
- **Don't** turn the hero into an aggressive marketing funnel (countdowns, popups, single shouty CTA).
- **Don't** spend the accent blue on decoration; if everything is blue, nothing is the action.
- **Don't** let the emergency-red leak onto non-emergency elements.
