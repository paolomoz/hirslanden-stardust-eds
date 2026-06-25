/**
 * Editorial Hero block — full-bleed image with white panel overlay (ds-feature pattern)
 * Authored row structure:
 *   Row 1: [image] | [eyebrow text]
 *   Row 2: [heading (h1 or h2)]
 *   Row 3: [body text]
 *   Row 4: [CTA link(s)]
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  let image = null;
  let eyebrow = '';
  let heading = null;
  let body = '';
  let ctas = [];

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    if (!cells.length) return;

    // Row with picture/img = image row; second cell = eyebrow
    const img = cells[0].querySelector('img, picture');
    if (img) {
      [image] = cells;
      eyebrow = cells[1]?.textContent?.trim() || '';
      return;
    }

    // h1 or h2 = heading row
    const h = cells[0].querySelector('h1, h2');
    if (h) {
      heading = h;
      return;
    }

    // Links = CTA row
    const links = cells[0].querySelectorAll('a');
    if (links.length) {
      ctas = [...links];
      return;
    }

    // Otherwise body text
    body = cells[0].innerHTML;
  });

  // Build structure
  const section = document.createElement('div');
  section.className = 'editorial-hero';

  const figure = document.createElement('figure');
  figure.className = 'editorial-hero-figure';
  if (image) {
    const imgEl = image.querySelector('img, picture');
    if (imgEl) {
      figure.append(imgEl.cloneNode(true));
    }
  }
  section.append(figure);

  const container = document.createElement('div');
  container.className = 'container';

  const panel = document.createElement('div');
  panel.className = 'editorial-hero-panel';

  if (eyebrow) {
    const p = document.createElement('p');
    p.className = 'eyebrow';
    p.textContent = eyebrow;
    panel.append(p);
  }

  if (heading) {
    panel.append(heading);
  }

  if (body) {
    const p = document.createElement('p');
    p.innerHTML = body;
    panel.append(p);
  }

  ctas.forEach((a) => {
    const isSecondary = a.closest('em') !== null;
    a.className = isSecondary ? 'readmore' : 'readmore';
    panel.append(a);
  });

  container.append(panel);
  section.append(container);

  block.innerHTML = '';
  block.append(section);
}
