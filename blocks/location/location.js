const ADDRESS_ICONS = {
  adresse: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  bus: '<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
  park: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  telefon: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.19 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>',
  default: '<circle cx="12" cy="12" r="10"/>',
};

function iconFor(label) {
  const lower = label.toLowerCase();
  const key = Object.keys(ADDRESS_ICONS).find((k) => lower.includes(k)) || 'default';
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">${ADDRESS_ICONS[key]}</svg>`;
}

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  let headingRow = null;
  let dataRows = rows;
  if (rows.length && rows[0].querySelectorAll(':scope > div').length === 1) {
    const first = rows[0].querySelector(':scope > div');
    if (first?.querySelector('h2')) {
      [headingRow] = rows;
      dataRows = rows.slice(1);
    }
  }

  const wrap = document.createElement('div');
  wrap.className = 'container';

  if (headingRow) {
    const head = document.createElement('div');
    head.className = 'section-head';
    head.append(...headingRow.querySelector(':scope > div').childNodes);
    wrap.append(head);
  }

  const grid = document.createElement('div');
  grid.className = 'location-grid';

  // Map column (first cell of first data row)
  const firstRowCells = dataRows[0]?.querySelectorAll(':scope > div') || [];
  const [mapCell, addressCell] = firstRowCells;

  const mapCol = document.createElement('div');
  mapCol.className = 'location-map';
  if (mapCell) {
    const img = mapCell.querySelector('img');
    const link = mapCell.querySelector('a');
    if (img) {
      mapCol.append(img);
    } else {
      const placeholder = document.createElement('div');
      placeholder.className = 'map-placeholder';
      placeholder.textContent = mapCell.textContent.trim() || 'Karte';
      mapCol.append(placeholder);
    }
    if (link && !img) {
      const linkWrap = document.createElement('p');
      linkWrap.className = 'map-link';
      linkWrap.append(link.cloneNode(true));
      mapCol.append(linkWrap);
    } else if (link) {
      const linkWrap = document.createElement('p');
      linkWrap.className = 'map-link';
      const a = document.createElement('a');
      a.href = link.href;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = 'Auf Google Maps öffnen ›';
      linkWrap.append(a);
      mapCol.append(linkWrap);
    }
  }

  // Address column
  const addrCol = document.createElement('div');
  addrCol.className = 'location-address';
  if (addressCell) {
    const heading = addressCell.querySelector('h2, h3');
    if (heading) {
      const h3 = document.createElement('h3');
      h3.textContent = heading.textContent.trim();
      addrCol.append(h3);
    }

    const addressBlock = document.createElement('div');
    addressBlock.className = 'address-block';

    if (dataRows.length > 1) {
      dataRows.slice(1).forEach((row) => {
        const cells = [...row.querySelectorAll(':scope > div')];
        const [labelCell, valueCell] = cells;
        if (!labelCell) return;

        const item = document.createElement('div');
        item.className = 'address-item';

        const iconWrap = document.createElement('div');
        iconWrap.className = 'address-item-icon';
        iconWrap.setAttribute('aria-hidden', 'true');
        iconWrap.innerHTML = iconFor(labelCell.textContent.trim());
        item.append(iconWrap);

        const content = document.createElement('div');
        content.className = 'address-item-content';

        const label = document.createElement('div');
        label.className = 'address-item-label';
        label.textContent = labelCell.textContent.trim();
        content.append(label);

        const value = document.createElement('div');
        value.className = 'address-item-value';
        value.innerHTML = valueCell?.innerHTML || '';
        content.append(value);

        item.append(content);
        addressBlock.append(item);
      });
    } else {
      // Fallback: render raw address cell content
      addrCol.append(...addressCell.childNodes);
    }

    if (addressBlock.children.length) addrCol.append(addressBlock);
  }

  grid.append(mapCol, addrCol);
  wrap.append(grid);
  block.innerHTML = '';
  block.append(wrap);
}
