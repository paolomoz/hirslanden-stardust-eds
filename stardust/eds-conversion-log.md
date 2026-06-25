# EDS conversion log

## Shared block authoring contracts (v2)

These 5 blocks are reused across multiple pages. Each block's `decorate()` classifies
nodes by **content**, never by index, and supports both the DA-flattened single-cell
shape and a one-row-per-item shape. The snippets below show the canonical content-cell
HTML an author/content page must emit. Tokens, `.container`, `.section-head`, and the
`.btn--onblue` button system live in `styles/styles.css` and must NOT be redefined.

General rules that apply to all five:
- Headings render as `<h2>` (page-header title is also `<h2>` by default — the page's
  real `<h1>` belongs to the hero block). Sub-lines render as documented per block.
- CTAs are authored as plain `<a href>Label</a>`; the block applies button classes.
- Accent emphasis rides `<em>`/`<strong>` (DA strips `<span>`); blocks recreate any
  needed spans/icons in `decorate()`.

---

### contact-cta
Blue band: heading + copy, a phone number (with label), and CTA buttons. The block
applies `btn btn--onblue` to every non-`tel:` action link; the short text line directly
before the `tel:` link becomes the uppercase phone label.

Flattened single-cell shape (typical DA output):
```
<div class="contact-cta">
  <div><div>
    <h2>Haben Sie Fragen?</h2>
    <p>Unser Team steht Ihnen gerne zur Verfügung.</p>
    <p>Telefon</p>
    <p><a href="tel:+41323664111">+41 32 366 41 11</a></p>
    <p><a href="https://.../kontakt.html">Kontakt aufnehmen</a></p>
    <p><a href="https://.../termin.html">Termin vereinbaren</a></p>
  </div></div>
</div>
```

Equivalent one-row-per-group shape:
```
<div class="contact-cta">
  <div><div><h2>Haben Sie Fragen?</h2><p>Copy.</p></div></div>
  <div><div>Telefon</div><div><a href="tel:+41323664111">+41 32 366 41 11</a></div></div>
  <div><div><a href="https://.../kontakt.html">Kontakt aufnehmen</a> <a href="https://.../termin.html">Termin vereinbaren</a></div></div>
</div>
```
Notes: omit the phone group or the actions group freely. The phone label is optional —
without a short text line before the `tel:` link the number renders without a label.

---

### key-facts
Trust strip of N fact items. **One row per fact-item.** Within an item the first line is
classified by content: a purely numeric first line → `fact-num` + the second line as
`fact-label` (num+label pattern); a non-numeric first line → `fact-label` + the second
line as `fact-value` (label+value pattern). Any third+ line becomes `fact-sub`.
Handles both the clinic-detail mix and the treatment-detail label+value chips generically.

```
<div class="key-facts">
  <div><div><p>7</p><p>Fachgebiete</p></div></div>
  <div><div><p>6</p><p>Spezialzentren</p></div></div>
  <div><div><p>Adresse</p><p>Blumenrain 105<br>2503 Biel</p></div></div>
  <div><div>
    <p>Notfall</p>
    <p><a href="tel:+41323664112">+41 32 366 41 12</a></p>
    <p>Sieben Tage pro Woche, rund um die Uhr</p>
  </div></div>
</div>
```
treatment-detail variant (all items are label + value chips) — same shape, just no
numeric first lines:
```
<div class="key-facts">
  <div><div><p>Behandlung</p><p>Ambulant / 1–2 Nächte</p></div></div>
  <div><div><p>Methode</p><p>Offen oder laparoskopisch</p></div></div>
  <div><div><p>Erfolgsrate</p><p>Rezidiv 1–2 % (Netz)</p></div></div>
</div>
```
Notes: numeric detection matches digits plus `. , + % – -` only. Inline `style`
attributes on links inside fact values are stripped so block CSS governs them.

---

### quicklinks
Grid of labelled link buttons; the block appends a chevron to each. An optional leading
heading becomes a `.section-head > h2`. The block owns the `section--alt` background and
section padding.

```
<div class="quicklinks">
  <div><div>
    <h2>Schnellzugriff</h2>
    <p><a href="https://.../kliniken.html">Kliniksuche</a></p>
    <p><a href="https://.../aerztesuche.html">Ärztesuche</a></p>
    <p><a href="https://.../jobs.html">Jobs und Karriere</a></p>
  </div></div>
</div>
```
Notes: the heading is optional. Links may also be authored one-per-row; both shapes work.

---

### lead-text
Larger intro prose, constrained to ~76ch. One or more paragraphs.

```
<div class="lead-text">
  <div><div>
    <p>Ihre Gesundheit steht bei uns im Mittelpunkt. Dafür setzen wir uns täglich ein.</p>
  </div></div>
</div>
```
Notes: a leading heading (if authored) renders as `<h2>`; otherwise pure prose.

---

### page-header
Orienting header: a back-link (the block prepends a chevron-left SVG) plus a title.
Title renders as `<h2>` by default.

```
<div class="page-header">
  <div><div>
    <p><a href="https://.../home.html">Hirslanden-Gruppe</a></p>
    <h1>Unsere Kliniken auf einen Blick</h1>
  </div></div>
</div>
```
Notes: the back-link is optional. The authored heading level is normalised to `<h2>`
(both `h1` and `h2` are styled identically by the block CSS). If no heading element is
present, the first plain text line becomes the title.
