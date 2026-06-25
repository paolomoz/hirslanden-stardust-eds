/**
 * Doctor Hero block
 * Expected authored content (single row, two cells):
 *   Cell 1: portrait image
 *   Cell 2: eyebrow label, h1, specialty links, meta dl rows (label | value), CTA links
 *
 * Meta rows are authored as paragraphs: "Label | value" or "Label | <a>value</a>"
 * Specialty chips: links in a paragraph marked with <em> wrap → chip style
 * Primary CTA buttons: <strong><a> → btn--primary
 * Secondary CTA: plain <a> → chip
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  const cells = [...rows[0].querySelectorAll(':scope > div')];
  const [portraitCell, infoCell] = cells;

  // ── Portrait ────────────────────────────────────────────────────────
  const portrait = document.createElement('div');
  portrait.className = 'doctor-portrait';
  if (portraitCell) {
    const img = portraitCell.querySelector('img');
    if (img) {
      img.loading = 'eager';
      img.fetchPriority = 'high';
      portrait.append(img);
    }
  }

  // ── Info ─────────────────────────────────────────────────────────────
  const info = document.createElement('div');
  info.className = 'doctor-info';

  if (infoCell) {
    const children = [...infoCell.children];

    // Title label (first <p> with no links, italic or plain small text)
    const titleEl = document.createElement('div');
    let h1Found = false;

    children.forEach((el) => {
      const tag = el.tagName.toLowerCase();

      if (!h1Found && (tag === 'p' || tag === 'h1' || tag === 'h2')) {
        if (tag === 'h1' || tag === 'h2') {
          const h1 = document.createElement('h1');
          h1.textContent = el.textContent.trim();
          titleEl.append(h1);
          h1Found = true;
          info.append(titleEl);
          return;
        }
        const p = document.createElement('p');
        p.className = 'doctor-title-label';
        p.textContent = el.textContent.trim();
        titleEl.append(p);
        return;
      }

      if (tag === 'p' && !h1Found) return;

      if (tag === 'p') {
        const links = [...el.querySelectorAll('a')];
        const hasOnlyLinks = links.length && el.textContent.trim() === links.map((a) => a.textContent.trim()).join('');
        if (hasOnlyLinks && links.every((a) => !a.closest('strong'))) {
          const row = document.createElement('div');
          row.className = 'doctor-specialty-row';
          links.forEach((a) => {
            a.className = 'doctor-specialty-chip';
            row.append(a);
          });
          info.append(row);
          return;
        }
      }

      if (tag === 'dl') {
        el.className = 'doctor-meta-dl';
        [...el.querySelectorAll('div')].forEach((r) => { r.className = 'doctor-meta-row'; });
        [...el.querySelectorAll('dt')].forEach((dt) => { dt.className = 'doctor-meta-dt'; });
        [...el.querySelectorAll('dd')].forEach((dd) => { dd.className = 'doctor-meta-dd'; });
        info.append(el);
        return;
      }

      if (tag === 'p') {
        const strongLinks = [...el.querySelectorAll('strong > a')];
        const emLinks = [...el.querySelectorAll('em > a')];
        const plainLinks = [...el.querySelectorAll(':scope > a')];
        const allLinks = [...new Set([...strongLinks, ...emLinks, ...plainLinks])];

        if (allLinks.length) {
          const ctaRow = document.createElement('div');
          ctaRow.className = 'doctor-cta-row';
          strongLinks.forEach((a) => { a.className = 'btn btn--primary'; ctaRow.append(a); });
          emLinks.forEach((a) => { a.className = 'chip'; ctaRow.append(a); });
          plainLinks.forEach((a) => { a.className = 'chip'; ctaRow.append(a); });
          info.append(ctaRow);
          return;
        }
      }

      info.append(el);
    });
  }

  // ── Rebuild block ─────────────────────────────────────────────────
  const grid = document.createElement('div');
  grid.className = 'doctor-hero-grid';
  grid.append(portrait, info);

  block.innerHTML = '';
  block.append(grid);
}
