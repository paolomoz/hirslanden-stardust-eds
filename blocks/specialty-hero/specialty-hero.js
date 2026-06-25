/**
 * Specialty Hero block — full-bleed image with white panel overlay (specialty-topic pattern)
 * Authored row structure:
 *   Row 1: [image] | [eyebrow]
 *   Row 2: [h1 heading]
 *   Row 3: [body text]
 *   Row 4: [readmore link]
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  let image = null;
  let eyebrow = '';
  let heading = null;
  let bodyText = '';
  let cta = null;

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    if (!cells.length) return;

    const img = cells[0].querySelector('img, picture');
    if (img && !heading) {
      image = img.cloneNode(true);
      eyebrow = cells[1]?.textContent?.trim() || '';
      return;
    }

    const h1 = cells[0].querySelector('h1');
    if (h1) { heading = h1.cloneNode(true); return; }

    const link = cells[0].querySelector('a');
    if (link && !cells[0].querySelector('h1, h2')) {
      if (!bodyText) { bodyText = cells[0].innerHTML; return; }
      cta = link.cloneNode(true);
      cta.className = 'readmore';
      return;
    }

    if (!bodyText) bodyText = cells[0].innerHTML;
  });

  const figure = document.createElement('figure');
  figure.className = 'specialty-hero-figure';
  if (image) figure.append(image);

  const container = document.createElement('div');
  container.className = 'container';

  const panel = document.createElement('div');
  panel.className = 'specialty-hero-panel';

  if (eyebrow) {
    const p = document.createElement('p');
    p.className = 'eyebrow';
    p.textContent = eyebrow;
    panel.append(p);
  }
  if (heading) panel.append(heading);
  if (bodyText) {
    const p = document.createElement('p');
    p.innerHTML = bodyText;
    panel.append(p);
  }
  if (cta) panel.append(cta);

  container.append(panel);
  block.innerHTML = '';
  block.append(figure, container);
}
