# Phase C Learnings — Improvements for stardust:rollout / stardust:deploy

Captured during first Phase C delivery of `hirslanden-stardust-eds` (clinic-detail archetype,
`de/klinik-linde/home`). Each item is a concrete failure or surprise encountered in production,
with a proposed skill improvement.

---

## 1. DA Source API requires a full document wrapper (CRITICAL)

**What happened.**  
The DA Source API accepted the push (HTTP 201/200) even when the content payload was bare
`<div>` elements with no document frame. Silently, the pipeline discarded all content and served
`<div></div>` from the `plain.html` endpoint. No error, no warning — the page just rendered blank.

**Root cause.**  
DA's ingestion pipeline expects the HTML to have the full AEM document frame:

```html
<body>
  <header></header>
  <main>
    <div><!-- section 1 --></div>
    <div><!-- section 2 --></div>
  </main>
  <footer></footer>
</body>
```

Without this frame, the pipeline finds no `<main>` and emits an empty div.

**Evidence that this is the correct format.**  
All existing working DA documents (nav.html, footer.html, index.html in this project) use exactly
this structure. The `<header>` and `<footer>` elements are empty; the content lives entirely in
`<main>`.

**Proposed skill improvement.**  
In `stardust:deploy` § DA deploy protocol (and in `stardust:rollout` Phase C), add:

> **DA body fragment format.** Every content page pushed via the Source API MUST be wrapped in
> `<body><header></header><main>…</main><footer></footer></body>`. The `<header>` and `<footer>`
> elements are left empty; all block sections go inside `<main>`. A push without this frame is
> silently accepted (HTTP 2xx) but produces a blank page. Verify immediately after every push by
> fetching `<preview-url>/path.plain.html` — if the response is `<div></div>`, the wrapper is
> missing or malformed.

The current skill text says *"DA body fragment format: no DOCTYPE/html/head; just `<div>` sections"*
— this is misleading and must be corrected.

---

## 2. Verify content round-trip immediately after every DA push

**What happened.**  
After the first push (with the missing wrapper), the preview POST returned HTTP 200, giving false
confidence. The actual rendered content was not checked until Playwright screenshots revealed a
blank page.

**Proposed skill improvement.**  
Add a mandatory two-step verification to the DA push workflow:

```bash
# 1. Read back the DA source (confirms the push was received correctly)
curl -s "https://admin.da.live/source/<org>/<site>/<path>.html" \
  -H "Authorization: Bearer $DA_TOKEN" | head -5

# 2. Check plain.html after triggering preview (confirms the pipeline parsed it)
curl -s "https://<branch>--<repo>--<org>.aem.page/<path>.plain.html" | head -5
```

If step 1 returns the correct HTML but step 2 returns `<div></div>`, the document wrapper is
the likely cause. If step 1 also returns wrong/empty content, the multipart upload failed.

---

## 3. Block JS path detection must be tested with real authored content

**What happened.**  
`clinic-happening.js` used `firstRowCells?.length >= 2` to decide between the two-column authored
format and the multi-row data format. Event rows have 3 cells (date | location | title), which
satisfies `>= 2`. The block silently took the wrong path, found no `<li>` elements, and rendered
empty lists alongside the section headings. The symptoms were indistinguishable from a CSS
visibility bug — visible headings, no items.

**Fix applied.**  
Changed the guard to `=== 2 && rows[0]?.querySelector(':scope > div > h2, :scope > div > ul')` —
requiring both the exact cell count and the structural signature of the authored format.

**Proposed skill improvement.**  
In the block development section of `stardust:deploy`:

> **Path detection in block JS.** When a block supports multiple authored formats (e.g. a
> compact two-cell summary vs. a multi-row data feed), always guard with BOTH a structural check
> AND the exact cell count, never `>= N`. The structural check — presence of `h2`, `ul`, or other
> semantic landmarks — distinguishes authored content from raw data rows that happen to have
> multiple cells.

---

## 4. SVG construction anti-pattern: icon map values vs. `<path d="...">`

**What happened.**  
`location.js` stored full SVG element strings (e.g. `<path d="M21 10…"/><circle cx="12"…/>`) in
`ADDRESS_ICONS`, then wrapped them in `<path d="${ADDRESS_ICONS[key]}"/>`. The result was a `<path>`
element whose `d` attribute contained raw SVG markup — invalid SVG, silently discarded by browsers,
so all location icons rendered as nothing.

**Fix applied.**  
Changed the template to inject the icon strings directly as SVG children:
```js
return `<svg …>${ADDRESS_ICONS[key]}</svg>`;
```

**Proposed skill improvement.**  
Add to the block development guidance:

> **SVG icon maps.** When ADDRESS_ICONS (or equivalent) stores multi-element SVG content (`<path>`,
> `<rect>`, `<polygon>`, etc.), inject it as `${icon}` directly inside the `<svg>` element — never
> as the `d` attribute of a wrapper `<path>`. The `d` attribute accepts only path data, not child
> elements. A `<path d="<rect …>">` is silently invalid.

---

## 5. DA source format ≠ EDS block input format — the pipeline converts between them

**What happened.**  
Initial confusion about what to PUT to the DA Source API. The block JS files expect
div-based rows (`<div class="blockname"><div><div>cell</div></div></div>`). This is the
**output** of the EDS content pipeline, not the input. The DA Source API accepts authoring-format
HTML (blocks as `<div class="blockname">` within `<main>`), which the pipeline then re-emits as
the same div structure in `plain.html`. In this project they happen to look similar, but:

- Images are **replaced** by `<picture>` with `srcset` pointing to optimised CDN copies
- External image URLs are mirrored and optimised (the scene7 URLs became `./media_…` hashes)
- Entity-encoded characters are preserved across the round-trip (hence sanitise.js is needed)

**Proposed skill improvement.**  
Add a "pipeline transform" note to the deploy workflow:

> **DA → plain.html transform.** After a DA push, the pipeline rewrites image URLs to optimised
> CDN copies (the `./media_<hash>.jpg` form), wraps images in `<picture>` with `webp`/`jpeg`
> `srcset` alternatives, and preserves HTML entities. Block JS receives the *transformed* output,
> not the authored source. If your block JS makes assumptions about image URL format or `<img>`
> vs `<picture>`, test against `plain.html`, not the DA source.

---

## 6. Hero chip tag: `<p class="chip">` in authored content is not automatically styled in the hero panel

**What happened.**  
The `clinic-hero.js` block extracts the `.chip` paragraph and creates a `<span class="clinic-hero-tag">`.
This span needs its own CSS rules in `clinic-hero.css` — the global `.chip` styles do not apply
because the DOM element is a `<span>`, not a `<p class="chip">`. The tag rendered as unstyled text
in the hero panel.

**Proposed skill improvement.**  
Document in the block development section:

> **Block-internal style promotion.** When a block JS converts authored elements to new DOM
> structures (e.g. a `<p class="chip">` becomes a `<span class="clinic-hero-tag">`), the new
> element does NOT inherit global utility-class styles. The block CSS must either (a) re-declare
> the styles on the new selector, or (b) keep the original element and class intact. Avoid silent
> style loss via DOM reconstruction.

---

## 7. `sanitise.js` must run on the WRAPPED file, not just the content

**What happened.**  
No bug here, but the workflow order matters: sanitise.js encodes non-ASCII characters, and the
wrapper (`<body><main>…</main></body>`) contains only ASCII. Running sanitise on the wrapped file
is correct and safe. Running it before adding the wrapper would also be correct.  
The risk: if the wrapper is added after sanitising and the wrapper itself contains non-ASCII (it
doesn't in this project, but a footer with a brand name could), those characters would reach DA
un-encoded.

**Proposed skill improvement.**  
Codify the order explicitly:

```
1. Build the full document (wrapper + content sections)
2. Run sanitise.js on the complete file
3. Push the sanitised file to DA
4. Trigger preview
5. Verify plain.html
```

---

## 8. Content format per block must be documented at the archetype level

**What happened.**  
Before writing the DA content page, all 10 block JS files had to be read individually to
understand the expected input format. This was essential but time-consuming, and required
careful reasoning about JS logic (not just reading comments or docs).

**Proposed skill improvement.**  
For each block delivered in Phase B, produce a brief **authored-format contract** alongside the
block JS:

```
## clinic-hero — authored format
Row 1, Cell 1: <picture> image
Row 1, Cell 2: optional breadcrumb links (NOT in <p>), then h1, then <p class="chip"> for location tag
```

Store these contracts either as JSDoc on the `decorate` function, or in a `BLOCKS.md` at the
repo root, or as a section in the rollout plan. They are also the input a content author needs
to correctly author the block in DA.

---

## 9. `eager` loading on hero images should be tested end-to-end

**What happened.**  
The hero image was authored with `loading="eager"` and `width`/`height` attributes. After the
pipeline transform, the image was wrapped in a `<picture>` element with `srcset` alternatives.
The block JS receives the `<picture>`, not a bare `<img>`. If the block's CSS or JS does not
handle `<picture>` correctly (e.g. applies `height: auto` only to `img`, not `picture > img`),
the eager image may cause CLS.

No bug was found here in this project, but it's worth verifying during the first Lighthouse run.

---

## Summary table

| # | Severity | Category | One-line description |
|---|---|---|---|
| 1 | Critical | DA deploy | Body wrapper `<body><main>…</main></body>` required — missing = silent blank page |
| 2 | High | DA deploy | Verify plain.html after every push before declaring success |
| 3 | High | Block JS | Path detection must use structural guard, not just cell count |
| 4 | Medium | Block JS | SVG icon maps: inject as children, not as `<path d="…">` |
| 5 | Medium | DA deploy | Document the DA→plain.html pipeline transform (image rewriting, entity encoding) |
| 6 | Medium | Block CSS | Block-internal DOM reconstruction loses global utility-class styles |
| 7 | Low | DA deploy | Sanitise the WRAPPED file; codify workflow order |
| 8 | Low | Authoring | Per-block authored-format contracts should be produced in Phase B |
| 9 | Low | Perf | `loading="eager"` + pipeline `<picture>` wrap — verify CLS after first Lighthouse run |
