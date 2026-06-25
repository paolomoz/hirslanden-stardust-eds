/**
 * Image Gallery block — 4-column masonry-style grid
 * Authored row structure (one row per image):
 *   Row: [image] | [variant: square|portrait|landscape|wide]
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const grid = document.createElement('div');
  grid.className = 'image-gallery-grid';

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const imgEl = cells[0]?.querySelector('img, picture');
    const variant = cells[1]?.textContent?.trim().toLowerCase() || 'square';

    if (!imgEl) return;

    const item = document.createElement('div');
    item.className = `image-gallery-item image-gallery-item--${variant}`;

    const img = imgEl.cloneNode(true);
    item.append(img);
    grid.append(item);
  });

  block.innerHTML = '';
  block.append(grid);
}
