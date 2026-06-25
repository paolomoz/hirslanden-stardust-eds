/**
 * Services Cards block — 2×2 card grid
 * Authored row structure (one row per card):
 *   Row: [image] | [title] | [description] | [link]
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const grid = document.createElement('div');
  grid.className = 'services-cards-grid';

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const imageCell = cells[0];
    const titleCell = cells[1];
    const descCell = cells[2];
    const linkCell = cells[3];

    const link = linkCell?.querySelector('a') || row.querySelector('a');
    const card = document.createElement('a');
    card.className = 'services-card';
    card.href = link?.href || '#';

    // media
    const img = imageCell?.querySelector('img, picture');
    if (img) {
      const media = document.createElement('div');
      media.className = 'services-card-media';
      media.append(img.cloneNode(true));
      card.append(media);
    }

    // body
    const body = document.createElement('div');
    body.className = 'services-card-body';

    const h3 = document.createElement('h3');
    h3.className = 'services-card-title';
    h3.textContent = titleCell?.textContent?.trim() || '';
    body.append(h3);

    if (descCell) {
      const p = document.createElement('p');
      p.className = 'services-card-text';
      p.innerHTML = descCell.innerHTML;
      body.append(p);
    }

    const readmore = document.createElement('span');
    readmore.className = 'readmore';
    readmore.textContent = link?.textContent?.trim() || 'Mehr erfahren';
    body.append(readmore);

    card.append(body);
    grid.append(card);
  });

  block.innerHTML = '';
  block.append(grid);
}
