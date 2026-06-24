# Design System — Hirslanden

**North Star: "The Calm Front Door, Corrected"**

This is the canonical design system for the Hirslanden EDS project, based on Variant A (brand-faithful) and refined through the F prototype iteration. It is a healthcare wayfinding hub, not a marketing funnel. The page is still and quiet — gentle hover/focus micro-interactions only, no scroll choreography.

---

## Register: brand

- **Mode:** Brand-faithful (Mode A). Palette, typeface, and corner conventions are inherited from the captured Hirslanden surface.
- **Decade:** 2025-now
- **Motion register:** Static — gentle hover/focus micro-interactions only; no motion register.
- **Voice:** Formal Swiss-German Sie; reassurance-forward; scale stated as fact.

**Key brand-faithful inversions** (rules that deliberately override generic "modern web" defaults):
- `#ffffff` retained as elevated card ground — the "no pure white" impulse is inverted per brand decision.
- Sharp 0px corners retained on cards, inputs, and primary buttons — deliberate counterpoint to the 18px pill.
- Saturated `#0094d4` retained as the primary brand color (`--brandColor`).
- `#f43a11` is a reserved color for the emergency-144 affordance only — never spread as a decoration.

---

## Color Tokens

All tokens are defined as CSS custom properties in the `:root` block.

| Token | Value | Role |
|---|---|---|
| `--color-bg` | `#ffffff` | Elevated card surfaces, search card |
| `--color-ground-warm` | `#f7f6f5` | Page ground; keeps the page from reading sterile |
| `--color-ground-alt` | `#f0efed` | Callout / alternating section ground |
| `--color-fg` | `#534c46` | Body and heading text — warm taupe-grey, never pure black |
| `--color-text-soft` | `#72665b` | Meta text (clinic names, dates, captions) |
| `--color-hairline` | `#e2dfdb` | Input borders and dividers |
| `--color-accent` | `#0094d4` | Decorative only: border-top, focus rings, button backgrounds |
| `--color-accent-ink` | `#0070a0` | ALL interactive text, CTA links, eyebrows, tags (AA-safe 5.5:1 on white) |
| `--color-accent-tint` | `rgba(0,148,212,0.1)` | Quicklink tile backgrounds |
| `--color-accent-hover` | `#006894` | Hover state for accent-ink elements |
| `--color-emergency` | `#f43a11` | 144 Notfallnummer ONLY — never repurposed |

### Color usage discipline

- `--color-accent` (`#0094d4`): decorative only — border-top, focus rings, button backgrounds. Appears on ≤ 10% of any viewport.
- `--color-accent-ink` (`#0070a0`): ALL interactive text, CTA links, eyebrows, tags (AA-safe 5.5:1 on white).
- `--color-emergency` (`#f43a11`): 144 Notfallnummer ONLY — never repurposed as a hover, badge, or decoration.

### Named Rules

**The One Voice Rule.** A single brand blue carries every action; it appears on ≤ 10% of any viewport. Its rarity is what makes a CTA read as a CTA.

**The Reserved-Red Rule.** `#f43a11` is permitted on the 144 emergency affordance and nowhere else.

---

## Typography

**Font family:** Metropolis (open-licence geometric sans), `system-ui, sans-serif` fallback. One family carries headings, body, labels, and UI chrome.

**Type scale:** Strict 1.25 modular ratio from a 1rem base.

| Token | Value | Purpose |
|---|---|---|
| `--heading-xxl` | `clamp(2.441rem, 4vw, 2.75rem)` | Hero display (1.25⁴) |
| `--heading-xl` | `1.953rem` | Section openers (1.25³) |
| `--heading-lg` | `1.563rem` | Sub-openers (1.25²) |
| `--heading-md` | `1.25rem` | Card and list titles (1.25¹) |
| `--body` | `1rem` | Body prose |
| `--body-sm` | `0.8rem` | Meta, labels, eyebrows (1rem ÷ 1.25) |
| `--line-height-heading` | `1.2` | All headings |
| `--line-height-body` | `1.6` | Body prose |

**Font weights:** 400 (regular body), 500 (labels, UI, semi-bold titles), 700 (display, section headings).

### Named Rules

**The Modular-Scale Rule.** Heading sizes follow a single 1.25 ratio. The captured ad-hoc 42/34/22 set is replaced; ratios may not disagree.

**The Mixed-Case Rule.** Headings are sentence case. Uppercase is reserved for short eyebrow labels (6–10 characters max). The brand voice survives mixed-case and reads more current.

---

## Spacing

Tokenized 4pt scale.

| Token | Value |
|---|---|
| `--spacing-xs` | `4px` |
| `--spacing-sm` | `8px` |
| `--spacing-md` | `16px` |
| `--spacing-lg` | `24px` |
| `--spacing-xl` | `32px` |
| `--spacing-2xl` | `48px` |
| `--section-padding` | `64px` desktop / `48px` tablet / `32px` mobile |
| `--max-width` | `1200px` |

**Breakpoints:** mobile-first; `min-width` queries at `600px` (tablet), `900px` (desktop), `1200px` (wide).

**Elevation:** One soft, low, diffuse shadow on elevated white cards — `--shadow-card: 0 2px 12px rgba(0,0,0,0.08)`. No stacked shadows, no glow, no inset.

**Shape vocabulary:**
- `--radius: 0px` — primary buttons, cards, inputs (deliberate counterpoint to the pill)
- `--radius-pill: 18px` — quick-link chips, secondary actions, badges

---

## Component Patterns

### Full-bleed editorial band (ds-feature)

The `ds-feature` section presents a full-bleed photograph with an editorially-positioned white content panel. The figure absolutely fills the section using the same stacking pattern as the hero.

**CSS implementation — verbatim F-iteration patterns:**

```css
/* Section: position: relative creates the stacking context */
.ds-feature { position: relative; overflow: hidden; }

/* Figure absolutely fills the section — same pattern as hero */
.ds-feature-figure { position: absolute; inset: 0; margin: 0; }
.ds-feature-figure img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Container in flow at mobile; absolutely positioned at desktop */
.ds-feature .container { position: relative; z-index: 1; }

/* Desktop: explicit height; container absolutely positioned, aligned to bottom */
@media (min-width: 900px) {
  .ds-feature { height: clamp(380px, 55vh, 640px); }
  .ds-feature .container {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: flex-end;   /* panel sits at bottom of the image */
    padding-bottom: var(--spacing-2xl);
  }
}
```

**Panel:**
- `border-top: 3px solid var(--color-accent)` — blue stripe grounds the panel as a brand surface
- `box-shadow: 0 4px 24px rgba(0,0,0,0.11)`
- Eyebrow: `color: var(--color-accent-ink)` — NOT `--color-text-soft`
- h2 at feature scale: `var(--heading-xl)` with `text-wrap: balance`

---

### Editorial panel

A white content panel that surfaces editorial or promotional content on top of a warm ground or photographic background.

- `background: var(--color-bg)` (white)
- `border-top: 3px solid var(--color-accent)` — blue stripe grounds the panel as a brand surface
- `box-shadow: 0 4px 24px rgba(0,0,0,0.11)`
- `max-width: 500px` at desktop; `max-width: none` at mobile (full width)
- Eyebrow: `color: var(--color-accent-ink)` — NOT `--color-text-soft`
- Heading at h2: `font-size: var(--heading-xl); text-wrap: balance`
- Body text: `color: var(--color-text-soft)` — one step softer than the heading

---

### Bento editorial grid

A 5-item promotional content grid. The first card is a featured hero that spans two rows at desktop, creating the bento asymmetry.

**CSS implementation — verbatim F-iteration patterns:**

```css
/* Mobile: single column */
.promo-cards-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-md);
}

/* Tablet (600px): card 1 spans full width as a banner, 2+2 below */
@media (min-width: 600px) {
  .promo-cards-grid { grid-template-columns: 1fr 1fr; }
  .promo-card:first-child { grid-column: span 2; }
}

/* Desktop bento: tall hero left (1.2fr), 2×2 right (0.9fr each) */
@media (min-width: 900px) {
  .promo-cards-grid { grid-template-columns: 1.2fr 0.9fr 0.9fr; }
  .promo-card:first-child { grid-column: 1; grid-row: span 2; }
}
```

Cards carry:
- `promo-card-tag`: `color: var(--color-accent-ink)` — category label (uppercase, 0.06em letter-spacing)
- `promo-card-title`: `font-size: var(--heading-md); text-wrap: balance`
- Subtle image zoom on hover: `transform: scale(1.04)` at `260ms cubic-bezier(0.22, 1, 0.36, 1)`

---

### Quicklinks grid

A 3-column grid of blue-tint navigation tiles. Each tile has a label left and a chevron right.

- Background: `var(--color-accent-tint)` — `rgba(0,148,212,0.1)`
- Hover: `rgba(0,148,212,0.18)`
- Chevron: `color: var(--color-accent-ink)`
- Corner: `var(--radius)` (0px — squared)
- Padding: `20px 24px`
- Columns: 3 at desktop → 2 at tablet → 1 at mobile

---

### Teaser cards

Three-up editorial cards surfacing group-level content (Babygalerie, Für alle Folgen des Lebens, Healthline).

- White card (`var(--color-bg)`) over warm ground, squared corners, `var(--shadow-card)`
- Media: `aspect-ratio: 16/10; object-fit: cover`
- Title: `var(--heading-md); font-weight: 500`
- Body text: `var(--color-text-soft); var(--body-sm)`
- CTA link: `.readmore` — `color: var(--color-accent-ink); font-weight: 500` with `›` suffix
- Columns: 3 at desktop → 1 (stacked, `max-width: 460px` centered) at ≤ 900px

---

## Motion

Motion register is **static**. Only two micro-interactions are permitted:

1. **Hover state changes** — `transition-duration: 140–160ms ease` on `color`, `background-color`, `border-color`. No translate, no scale (except the bento card image subtle zoom).
2. **Focus ring** — `outline: 3px solid var(--color-accent); outline-offset: 2px` on `:focus-visible`.

**Reduced motion:** `@media (prefers-reduced-motion: reduce) { * { transition-duration: 0.01ms !important; } }`

No scroll choreography, no parallax, no entrance animations, no cinematic motion register.

---

## Accessibility

- WCAG 2.1 AA minimum. Target AA on all text and interactive elements.
- `--color-accent-ink` (`#0070a0`) achieves 5.5:1 contrast ratio on white — use this for all interactive text, not the raw `--color-accent` (`#0094d4`).
- Hero background image: `alt=""` (intentional — decorative scrim; the H1 carries the meaning).
- Mobile nav: `aria-expanded` synced on toggle; `Escape` key closes the panel and returns focus to the trigger.
- Emergency 144: marked up as `<a href="tel:144">` with visible label and number; color `--color-emergency` is `#f43a11` which achieves 4.5:1 on white (AA Large pass; acceptable for the number display at `1.563rem 700`).
- Skip link: `<a class="skip-link chip" href="#main">Zum Inhalt springen</a>` — visually hidden until focused.
- Heading hierarchy: h1 → h2 (section openers) → h3 (card titles). No heading levels skipped.

---

## Anti-references

The following patterns are explicitly rejected for this project:

- **Generic-2026-SaaS silhouette** — centered hero + dual-CTA + three feature cards in primary blue.
- **Cold clinical-tech aesthetic** — pure-black text, sterile pure-white-only ground, equipment photography.
- **Gradients, glassmorphism, neon, heavy or stacked shadows.**
- **Uppercase body copy** — uppercase is reserved for short eyebrow labels only.
- **Second typeface** — Metropolis is the only family.
- **Scroll choreography, parallax, entrance animations** — any cinematic motion register.
- **High-pressure conversion vocabulary** — no "Jetzt buchen", no fragmented CTA labels across five disagreeing verbs.
- **Repurposed emergency red** — `#f43a11` appears on the 144 number and nowhere else.
