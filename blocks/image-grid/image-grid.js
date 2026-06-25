/**
 * Image Grid block — 3-column editorial grid with alternating portrait/landscape images
 * Authored row structure (one row per image):
 *   Row: [image] | [orientation: portrait|landscape]
 * Images are distributed across 3 columns automatically.
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const cols = [
    document.createElement('div'),
    document.createElement('div'),
    document.createElement('div'),
  ];
  cols.forEach((col) => { col.className = 'image-grid-col'; });

  rows.forEach((row, i) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const imgEl = cells[0]?.querySelector('img, picture');
    const orientation = cells[1]?.textContent?.trim().toLowerCase() || 'portrait';

    if (!imgEl) return;

    const wrap = document.createElement('div');
    wrap.className = `img-wrap img-wrap--${orientation === 'landscape' ? 'landscape' : 'portrait'}`;
    wrap.append(imgEl.cloneNode(true));

    cols[i % 3].append(wrap);
  });

  const grid = document.createElement('div');
  grid.className = 'image-grid-cols';
  cols.forEach((col) => grid.append(col));

  block.innerHTML = '';
  block.append(grid);
}
