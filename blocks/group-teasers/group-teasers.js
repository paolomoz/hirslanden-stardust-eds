/**
 * Group Teasers block — 3-up card grid for group/subsidiary promos
 * Authored row structure (one row per card):
 *   Row: [image] | [title] | [description] | [readmore link]
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const grid = document.createElement('div');
  grid.className = 'group-teasers-grid';

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const imageCell = cells[0];
    const titleCell = cells[1];
    const descCell = cells[2];
    const linkCell = cells[3];

    const article = document.createElement('article');
    article.className = 'group-teaser-card';

    const img = imageCell?.querySelector('img, picture');
    if (img) {
      const media = document.createElement('div');
      media.className = 'group-teaser-media';
      media.append(img.cloneNode(true));
      article.append(media);
    }

    const body = document.createElement('div');
    body.className = 'group-teaser-body';

    if (titleCell) {
      const h3 = document.createElement('h3');
      h3.textContent = titleCell.textContent.trim();
      body.append(h3);
    }

    if (descCell) {
      const p = document.createElement('p');
      p.innerHTML = descCell.innerHTML;
      body.append(p);
    }

    const link = linkCell?.querySelector('a') || row.querySelector('a');
    if (link) {
      const a = link.cloneNode(true);
      a.className = 'readmore';
      body.append(a);
    }

    article.append(body);
    grid.append(article);
  });

  block.innerHTML = '';
  block.append(grid);
}
