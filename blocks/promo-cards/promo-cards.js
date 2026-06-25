/**
 * Promo Cards block — asymmetric bento grid (1 hero + 2×2)
 * Authored row structure (one row per card):
 *   Row: [image] | [tag] | [title] | [description] | [CTA link]
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const grid = document.createElement('div');
  grid.className = 'promo-cards-grid';

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const imageCell = cells[0];
    const tagCell = cells[1];
    const titleCell = cells[2];
    const descCell = cells[3];
    const ctaCell = cells[4];

    const link = ctaCell?.querySelector('a') || row.querySelector('a');
    const card = document.createElement('a');
    card.className = 'promo-card';
    card.href = link?.href || '#';

    const img = imageCell?.querySelector('img, picture');
    if (img) {
      const media = document.createElement('div');
      media.className = 'promo-card-media';
      media.append(img.cloneNode(true));
      card.append(media);
    }

    const body = document.createElement('div');
    body.className = 'promo-card-body';

    if (tagCell) {
      const tag = document.createElement('span');
      tag.className = 'promo-card-tag';
      tag.textContent = tagCell.textContent.trim();
      body.append(tag);
    }

    if (titleCell) {
      const h3 = document.createElement('h3');
      h3.className = 'promo-card-title';
      h3.textContent = titleCell.textContent.trim();
      body.append(h3);
    }

    if (descCell) {
      const p = document.createElement('p');
      p.className = 'promo-card-text';
      p.innerHTML = descCell.innerHTML;
      body.append(p);
    }

    if (link) {
      const cta = document.createElement('span');
      cta.className = 'promo-card-cta';
      cta.textContent = `${ctaCell?.textContent?.trim() || link.textContent.trim()} ›`;
      body.append(cta);
    }

    card.append(body);
    grid.append(card);
  });

  block.innerHTML = '';
  block.append(grid);
}
