/**
 * centers block
 * A grid of clinic / competence-centre cards. An optional leading eyebrow +
 * heading becomes the section head. Each card carries a name (heading), a
 * location line and a tel: phone link.
 *
 * Authoring shapes (both supported):
 *   - one ROW per card: cells hold the name, a location line and a tel: link.
 *   - a flattened single cell with an optional eyebrow + <h2> head, then
 *     repeating groups segmented by each card's name heading (<h3>).
 */

const isHeading = (el) => /^h[1-6]$/.test(el.tagName.toLowerCase());
const PIN = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';

function flatten(row) {
  const parts = [];
  const cells = [...row.querySelectorAll(':scope > div')];
  (cells.length ? cells : [row]).forEach((cell) => {
    const kids = [...cell.children];
    if (kids.length === 0) {
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
}

function asTel(el) {
  const a = el.tagName.toLowerCase() === 'a' ? el : el.querySelector('a');
  return a && (a.getAttribute('href') || '').startsWith('tel:') ? a : null;
}

export default async function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  let eyebrow = null;
  let heading = null;
  const cards = [];

  if (rows.length === 1) {
    const parts = flatten(rows[0]);
    let current = null;
    parts.forEach((el) => {
      const tag = el.tagName.toLowerCase();
      // section head: an h2 (and an eyebrow text line right before it)
      if (tag === 'h2' && !heading && cards.length === 0) {
        heading = el;
        return;
      }
      // card name heading starts a new card
      if (isHeading(el)) {
        current = { name: el, parts: [] };
        cards.push(current);
        return;
      }
      if (!current) {
        // a text line before the first card heading and before h2 = eyebrow
        if (!eyebrow && !heading && el.textContent.trim()) eyebrow = el;
        return;
      }
      current.parts.push(el);
    });
  } else {
    rows.forEach((row) => {
      const parts = flatten(row);
      if (parts.length === 1 && parts[0].tagName.toLowerCase() === 'h2') {
        [heading] = parts;
        return;
      }
      const name = parts.find((p) => isHeading(p));
      if (!name) return;
      cards.push({ name, parts: parts.filter((p) => p !== name) });
    });
  }

  const container = document.createElement('div');
  container.className = 'container';

  if (eyebrow || heading) {
    const head = document.createElement('div');
    head.className = 'section-head';
    if (eyebrow) {
      const eb = document.createElement('p');
      eb.className = 'eyebrow';
      eb.innerHTML = eyebrow.innerHTML;
      head.append(eb);
    }
    if (heading) {
      const h = document.createElement('h2');
      h.innerHTML = heading.innerHTML;
      head.append(h);
    }
    container.append(head);
  }

  const grid = document.createElement('div');
  grid.className = 'centers-grid';

  cards.forEach(({ name, parts }) => {
    const card = document.createElement('div');
    card.className = 'center-card';

    const h3 = document.createElement('h3');
    h3.innerHTML = name.innerHTML;
    card.append(h3);

    const tel = parts.map(asTel).find(Boolean);
    const locations = parts.filter((p) => p !== tel && !asTel(p) && p.textContent.trim());

    locations.forEach((loc) => {
      const p = document.createElement('p');
      p.className = 'center-location';
      p.innerHTML = `${PIN}<span>${loc.textContent.trim()}</span>`;
      card.append(p);
    });

    if (tel) {
      const a = document.createElement('a');
      a.className = 'center-phone';
      a.href = tel.getAttribute('href');
      a.textContent = tel.textContent.trim();
      card.append(a);
    }

    grid.append(card);
  });

  container.append(grid);
  block.replaceChildren(container);
}
