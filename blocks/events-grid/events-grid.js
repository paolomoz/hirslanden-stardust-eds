/**
 * events-grid block
 * A 4-up grid of event cards. An optional leading heading + count row opens the
 * section. Each card carries a date chip (day + month), a location/clinic line,
 * an optional "weitere Termine" line, a title, an image and a "read more" link.
 * Cards are stamped with data-location / data-category so the sibling
 * events-filter block can filter them client-side.
 *
 * Authoring — one ROW per card (cells classified by content, never index):
 *   - a short "DD Mon." line (e.g. "25 Jun.") → the date chip
 *   - a location line "City · Clinic" → location (the city/clinic before the · )
 *   - an optional line that begins "Weitere" → multi-dates note
 *   - a heading (h3) or a title link → the card title + its href
 *   - a picture/img → the card image (absolute scene7 URL authored inline)
 *   - an optional "Mehr erfahren" text → the read-more label
 * A flattened single cell of repeating groups is also supported: each new
 * "DD Mon." date line opens a new card.
 */

const DAY_MON_RE = /^\d{1,2}\.?\s*[A-Za-zÄÖÜäöü]{2,}\.?$/; // "25 Jun." / "01 Jul."
const isMedia = (el) => el.matches('picture, img') || el.querySelector('picture, img');
const isHeading = (el) => /^h[1-6]$/.test(el.tagName.toLowerCase());
const anchorOf = (el) => (el.tagName.toLowerCase() === 'a' ? el : el.querySelector('a'));

function flatten(row) {
  const parts = [];
  const cells = [...row.querySelectorAll(':scope > div')];
  (cells.length ? cells : [row]).forEach((cell) => {
    const kids = [...cell.children];
    if (kids.length === 0) {
      const text = cell.textContent.trim();
      if (text) {
        const p = document.createElement('p');
        p.textContent = text;
        parts.push(p);
      }
      return;
    }
    kids.forEach((el) => parts.push(el));
  });
  return parts;
}

function buildCard(parts) {
  const li = document.createElement('li');
  const card = document.createElement('a');
  card.className = 'event-card';

  let dateLine = null;
  let media = null;
  let titleEl = null;
  let titleHref = '#';
  let readmore = 'Mehr erfahren';
  const locationLines = [];

  parts.forEach((el) => {
    const text = el.textContent.trim();
    const a = anchorOf(el);
    if (isMedia(el)) { media = el; return; }
    if (!dateLine && DAY_MON_RE.test(text)) { dateLine = text; return; }
    if (a && (isHeading(el) || !titleEl)) {
      titleEl = el;
      titleHref = a.getAttribute('href') || '#';
      return;
    }
    if (isHeading(el)) { titleEl = el; return; }
    if (/^(mehr erfahren|mehr|weiterlesen)/i.test(text)) { readmore = text; return; }
    if (text) locationLines.push(text);
  });

  card.href = titleHref;
  const title = titleEl ? titleEl.textContent.trim() : (locationLines.pop() || '');
  card.setAttribute('aria-label', title);

  // date chip + location meta
  const badge = document.createElement('div');
  badge.className = 'event-card-date-badge';
  if (dateLine) {
    const [day, ...mon] = dateLine.replace(/\.$/, '').split(/\s+/);
    const chip = document.createElement('div');
    chip.className = 'event-card-date-chip';
    chip.innerHTML = `<span class="day">${day}</span><span class="mon">${mon.join(' ')}</span>`;
    badge.append(chip);
  }
  if (locationLines.length) {
    const meta = document.createElement('div');
    meta.className = 'event-card-meta';
    const loc = document.createElement('div');
    loc.className = 'event-card-location';
    const primary = locationLines.find((l) => !/^weitere/i.test(l)) || locationLines[0];
    const multi = locationLines.find((l) => /^weitere/i.test(l));
    if (primary) {
      const s = document.createElement('span');
      s.className = 'city-clinic';
      s.textContent = primary;
      loc.append(s);
      card.dataset.location = primary;
    }
    if (multi) {
      const s = document.createElement('span');
      s.className = 'multi-dates';
      s.textContent = multi;
      loc.append(s);
    }
    meta.append(loc);
    badge.append(meta);
  }
  if (badge.children.length) card.append(badge);

  const body = document.createElement('div');
  body.className = 'event-card-body';
  const h3 = document.createElement('h3');
  h3.className = 'event-card-title';
  h3.textContent = title;
  body.append(h3);
  card.append(body);

  if (media) {
    const wrap = document.createElement('div');
    wrap.className = 'event-card-image';
    const pic = media.matches('picture, img') ? media : media.querySelector('picture, img');
    wrap.append(pic);
    card.append(wrap);
  }

  const cta = document.createElement('div');
  cta.className = 'event-card-cta';
  cta.innerHTML = `<span class="readmore">${readmore}</span>`;
  card.append(cta);

  li.append(card);
  return li;
}

export default async function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const container = document.createElement('div');
  container.className = 'container';

  // Detect a leading heading row (no date line) → section header.
  let headerRow = null;
  const cardRows = [];
  rows.forEach((row) => {
    const parts = flatten(row);
    const hasDate = parts.some((p) => DAY_MON_RE.test(p.textContent.trim()));
    const hasMedia = parts.some(isMedia);
    const hasHeading = parts.some(isHeading);
    if (!headerRow && hasHeading && !hasDate && !hasMedia) {
      headerRow = { row, parts };
    } else {
      cardRows.push(parts);
    }
  });

  // If the whole block is one flat cell, re-segment by date lines.
  let groups = cardRows;
  if (cardRows.length === 1) {
    const flat = cardRows[0];
    const segmented = [];
    let current = null;
    flat.forEach((el) => {
      const text = el.textContent.trim();
      if (DAY_MON_RE.test(text) || (isHeading(el) && current && current.length)) {
        // new card boundary on each date line
        if (DAY_MON_RE.test(text)) {
          current = [];
          segmented.push(current);
        }
      }
      if (!current) { current = []; segmented.push(current); }
      current.push(el);
    });
    if (segmented.length > 1) groups = segmented;
  }

  if (headerRow) {
    const head = document.createElement('div');
    head.className = 'events-grid-header';
    const heading = headerRow.parts.find(isHeading);
    if (heading) {
      const h2 = document.createElement('h2');
      h2.innerHTML = heading.innerHTML;
      // wrap a trailing count in a styled span if present as a separate line
      head.append(h2);
    }
    const info = headerRow.parts.find((p) => !isHeading(p) && p.textContent.trim());
    if (info) {
      const span = document.createElement('span');
      span.className = 'pagination-info';
      span.textContent = info.textContent.trim();
      head.append(span);
    }
    container.append(head);
  }

  const grid = document.createElement('ul');
  grid.className = 'event-card-grid';
  grid.setAttribute('aria-label', 'Veranstaltungen');
  groups.forEach((parts) => {
    if (parts.some((p) => p.textContent.trim() || isMedia(p))) {
      grid.append(buildCard(parts));
    }
  });
  container.append(grid);

  block.replaceChildren(container);
}
