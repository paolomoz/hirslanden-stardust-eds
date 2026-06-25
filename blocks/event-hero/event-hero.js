/**
 * Event Hero block
 * Full-bleed image banner with gradient scrim, category chip, h1, clinic name.
 *
 * Authored as a single row with up to 3 cells:
 *   Cell 1: background image (picture/img)
 *   Cell 2: category label text (becomes chip)
 *   Cell 3: h1 title + clinic name (p)
 *
 * Or single-cell with all content when image is separate default content above.
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  const cells = [...rows[0].querySelectorAll(':scope > div')];

  let imgCell; let
    metaCell;
  if (cells.length >= 2) {
    [imgCell, metaCell] = cells;
  } else {
    imgCell = null;
    [metaCell] = cells;
  }

  // ── Background media ──────────────────────────────────────────────
  const media = document.createElement('div');
  media.className = 'event-hero-media';
  media.setAttribute('aria-hidden', 'true');

  if (imgCell) {
    const img = imgCell.querySelector('img');
    if (img) {
      img.loading = 'eager';
      img.fetchPriority = 'high';
      media.append(img);
    }
  }

  // ── Scrim overlay ─────────────────────────────────────────────────
  const scrim = document.createElement('div');
  scrim.className = 'event-hero-scrim';
  scrim.setAttribute('aria-hidden', 'true');

  // ── Content ───────────────────────────────────────────────────────
  const inner = document.createElement('div');
  inner.className = 'event-hero-inner';

  if (metaCell) {
    const children = [...metaCell.children];
    children.forEach((el) => {
      const tag = el.tagName.toLowerCase();
      if (tag === 'p' && !el.querySelector('a, strong, em') && el.textContent.trim()) {
        const text = el.textContent.trim();
        const prev = el.previousElementSibling;
        // First non-heading paragraph before h1 → category chip
        if (!prev || (!prev.matches('h1, h2, h3'))) {
          const next = el.nextElementSibling;
          if (next && next.matches('h1, h2')) {
            const chip = document.createElement('span');
            chip.className = 'event-hero-category';
            chip.textContent = text;
            inner.append(chip);
            return;
          }
        }
        // paragraph after h1 → clinic name
        if (prev && prev.matches('h1, h2')) {
          const p = document.createElement('p');
          p.className = 'event-hero-clinic';
          p.textContent = text;
          inner.append(p);
          return;
        }
      }
      if (tag === 'h1' || tag === 'h2') {
        const h1 = document.createElement('h1');
        h1.textContent = el.textContent.trim();
        inner.append(h1);
        return;
      }
      inner.append(el);
    });
  }

  // ── Rebuild block ─────────────────────────────────────────────────
  block.innerHTML = '';
  block.append(media, scrim, inner);
}
