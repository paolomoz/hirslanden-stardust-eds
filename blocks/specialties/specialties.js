// SVG icons keyed by department name fragment (lowercase match)
const ICONS = {
  chirurgie: '<path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM8 12h8M12 8v8"/>',
  orthopädie: '<path d="M4 12h4m8 0h4M12 2v4m0 12v4M6.34 6.34l2.83 2.83m5.66 5.66 2.83 2.83M6.34 17.66l2.83-2.83m5.66-5.66 2.83-2.83"/>',
  gynäkologie: '<circle cx="12" cy="8" r="4"/><path d="M12 12v8M9 17h6"/>',
  geburt: '<path d="M9 12c0 1.66 1.34 3 3 3s3-1.34 3-3"/><path d="M5 7c0-3.31 3.13-6 7-6s7 2.69 7 6v10H5z"/>',
  innere: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
  radiologie: '<circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>',
  default: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
};

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  let dataRows = rows;

  // Prefer default-content reabsorption; fall back to first heading row (back-compat)
  let sectionHead = null;
  const prev = block.closest('.block-content')?.previousElementSibling;
  if (prev && (prev.classList.contains('default-content') || prev.classList.contains('default-content-wrapper'))) {
    sectionHead = document.createElement('div');
    sectionHead.className = 'section-head';
    sectionHead.append(...prev.childNodes);
    prev.remove();
  } else if (rows.length && rows[0].querySelectorAll(':scope > div').length === 1) {
    const firstCell = rows[0].querySelector(':scope > div');
    if (firstCell?.querySelector('h2, h3')) {
      sectionHead = document.createElement('div');
      sectionHead.className = 'section-head';
      sectionHead.append(...firstCell.childNodes);
      dataRows = rows.slice(1);
    }
  }

  const wrap = document.createElement('div');
  wrap.className = 'container';

  if (sectionHead) wrap.append(sectionHead);

  const grid = document.createElement('div');
  grid.className = 'dept-grid';

  dataRows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const [nameCell, descCell] = cells;
    const name = nameCell?.querySelector('a, h3, p')?.textContent?.trim() || nameCell?.textContent?.trim() || '';
    const link = nameCell?.querySelector('a') || descCell?.querySelector('a');

    const card = document.createElement(link ? 'a' : 'div');
    card.className = 'dept-card';
    if (link) { card.href = link.href; }

    const icon = document.createElement('div');
    icon.className = 'dept-icon';
    icon.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">${ICONS[Object.keys(ICONS).find((k) => name.toLowerCase().includes(k)) || 'default']}</svg>`;
    card.append(icon);

    const title = document.createElement('h3');
    title.textContent = link ? link.textContent.trim() : name;
    card.append(title);

    if (descCell) {
      const p = document.createElement('p');
      // Strip the link we already used; keep descriptive text
      const clone = descCell.cloneNode(true);
      clone.querySelectorAll('a').forEach((a) => a.remove());
      p.textContent = clone.textContent.trim();
      if (p.textContent) card.append(p);
    }

    grid.append(card);
  });

  wrap.append(grid);
  block.innerHTML = '';
  block.append(wrap);
}
