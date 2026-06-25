/**
 * location block
 * Two-column "how to find us": a map placeholder + a Google Maps link on the
 * left, and an address block (labelled items: address, transit, parking,
 * phone) on the right. A leading eyebrow + heading become the section head.
 *
 * Authoring:
 *   Row 1 (head, optional): a short eyebrow line + a heading ("So finden Sie uns").
 *   Row 2 (map):    a clinic name/heading and a Google Maps link (the map is a
 *                   neutral placeholder — drop a real embed/image later).
 *   Following rows (address items): each a [label, value] pair where the value
 *                   may contain a tel: link or <br>-separated lines.
 * Classification is content-based; the first short line of an item is its label.
 */

const ICONS = {
  pin: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  bus: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
  parking: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
  phone: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.19 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
};

const isHeading = (el) => /^h[1-6]$/.test(el.tagName.toLowerCase());
const anchorOf = (el) => (el.tagName.toLowerCase() === 'a' ? el : el.querySelector('a'));

function pickIcon(label) {
  const l = label.toLowerCase();
  if (/bus|tram|zug|bahn|anreise|öv|transit/.test(l)) return ICONS.bus;
  if (/park/.test(l)) return ICONS.parking;
  if (/telefon|phone|tel\b/.test(l)) return ICONS.phone;
  return ICONS.pin;
}

function readRows(block) {
  return [...block.querySelectorAll(':scope > div')].map((row) => {
    const parts = [];
    const cells = [...row.querySelectorAll(':scope > div')];
    (cells.length ? cells : [row]).forEach((cell) => {
      const kids = [...cell.children];
      // A cell with no block-level children (only text and/or inline <br>) is a
      // single text value — keep its innerHTML so <br> line breaks survive.
      const blockKids = kids.filter((el) => !/^(br|b|i|em|strong|span|sup|sub)$/
        .test(el.tagName.toLowerCase()));
      if (blockKids.length === 0) {
        const text = cell.textContent.trim();
        if (text) {
          const p = document.createElement('p');
          p.innerHTML = cell.innerHTML;
          parts.push(p);
        }
        return;
      }
      kids.forEach((el) => parts.push(el));
    });
    return parts;
  }).filter((p) => p.length);
}

export default async function decorate(block) {
  const rows = readRows(block);

  const container = document.createElement('div');
  container.className = 'container';

  let rest = rows;
  // Optional section head: a leading row with a heading and an eyebrow only.
  const first = rows[0] || [];
  const firstHeading = first.find(isHeading);
  const firstLink = first.some((p) => anchorOf(p));
  if (firstHeading && !firstLink && first.length <= 2) {
    const head = document.createElement('div');
    head.className = 'section-head';
    const eyebrow = first.find((p) => p !== firstHeading && p.textContent.trim());
    if (eyebrow) {
      const e = document.createElement('p');
      e.className = 'eyebrow';
      e.innerHTML = eyebrow.innerHTML;
      head.append(e);
    }
    const h2 = document.createElement('h2');
    h2.innerHTML = firstHeading.innerHTML;
    head.append(h2);
    container.append(head);
    rest = rows.slice(1);
  }

  const grid = document.createElement('div');
  grid.className = 'location-grid';

  // Map column: the first remaining row that carries a maps link / clinic name.
  const mapRow = rest.find((parts) => parts.some((p) => {
    const a = anchorOf(p);
    return a && /maps|map|openstreetmap/i.test(a.getAttribute('href') || '');
  })) || rest.find((parts) => parts.some((p) => anchorOf(p)) && parts.some(isHeading));

  const mapCol = document.createElement('div');
  mapCol.className = 'location-map';
  const ph = document.createElement('div');
  ph.className = 'placeholder-media placeholder-media--map';
  ph.setAttribute('aria-label', 'Karte');
  mapCol.append(ph);
  if (mapRow) {
    const link = mapRow.map(anchorOf).find(Boolean);
    if (link) {
      const p = document.createElement('p');
      p.className = 'location-map-link';
      const a = document.createElement('a');
      a.href = link.getAttribute('href') || '#';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = link.textContent.trim() || 'Auf Google Maps öffnen ›';
      p.append(a);
      mapCol.append(p);
    }
  }

  // Address column: clinic-name heading + labelled address items.
  const addrCol = document.createElement('div');
  addrCol.className = 'location-address';
  const addrBlock = document.createElement('div');
  addrBlock.className = 'address-block';

  const itemRows = rest.filter((parts) => parts !== mapRow);
  let nameHeading = null;
  itemRows.forEach((parts) => {
    const heading = parts.find(isHeading);
    if (heading && !nameHeading && parts.length === 1) {
      nameHeading = heading;
      return;
    }
    // [label, value] pair.
    const label = parts[0];
    const valueParts = parts.slice(1);
    if (!label) return;
    const item = document.createElement('div');
    item.className = 'address-item';
    const icon = document.createElement('div');
    icon.className = 'address-item-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.innerHTML = pickIcon(label.textContent.trim());
    item.append(icon);
    const content = document.createElement('div');
    content.className = 'address-item-content';
    const lbl = document.createElement('div');
    lbl.className = 'address-item-label';
    lbl.innerHTML = label.innerHTML;
    content.append(lbl);
    if (valueParts.length) {
      const val = document.createElement('div');
      val.className = 'address-item-value';
      // Preserve anchors (tel:/mailto:) via outerHTML; plain wrappers via innerHTML.
      val.innerHTML = valueParts.map((v) => {
        const tag = v.tagName.toLowerCase();
        return tag === 'a' ? v.outerHTML : v.innerHTML;
      }).join('<br>');
      content.append(val);
    }
    item.append(content);
    addrBlock.append(item);
  });

  if (nameHeading) {
    const h3 = document.createElement('h3');
    h3.innerHTML = nameHeading.innerHTML;
    addrCol.append(h3);
  }
  addrCol.append(addrBlock);

  grid.append(mapCol, addrCol);
  container.append(grid);
  block.replaceChildren(container);
}
