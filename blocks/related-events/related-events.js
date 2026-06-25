/**
 * related-events block
 * A 3-up grid of related event cards. An optional leading eyebrow + heading
 * opens the section. Each card has a date chip, a category label, a time line,
 * a title and a location line, all wrapped in one link. An optional trailing
 * "see all" link renders below the grid as a read-more.
 *
 * Authoring — one ROW per card (cells classified by content, never index):
 *   - a "DD Mon." line → date chip
 *   - a title link → card title + href
 *   - a short text line (no digits) → category label
 *   - a line with a time ("18:30 – 20:00 Uhr") → time line
 *   - a remaining text line → location
 * A leading row with only a heading (and optional eyebrow) is the section head.
 * A final row with a single bare link → the "see all" read-more.
 */

const DAY_MON_RE = /^\d{1,2}\.?\s*[A-Za-zÄÖÜäöü]{2,}\.?$/;
const TIME_RE = /\d{1,2}[:.]\d{2}/;
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
  const card = document.createElement('a');
  card.className = 'related-card';

  let dateLine = null;
  let titleEl = null;
  let href = '#';
  let category = null;
  let time = null;
  let location = null;

  parts.forEach((el) => {
    const text = el.textContent.trim();
    const a = anchorOf(el);
    if (a && !titleEl) { titleEl = el; href = a.getAttribute('href') || '#'; return; }
    if (!dateLine && DAY_MON_RE.test(text)) { dateLine = text; return; }
    if (isHeading(el) && !titleEl) { titleEl = el; return; }
    if (!time && TIME_RE.test(text)) { time = text; return; }
    if (!category && text && text.length <= 24) { category = text; return; }
    if (text) location = text;
  });

  card.href = href;

  const head = document.createElement('div');
  head.className = 'related-card-head';
  if (dateLine) {
    const [day, ...mon] = dateLine.replace(/\.$/, '').split(/\s+/);
    const chip = document.createElement('div');
    chip.className = 'related-date-chip';
    chip.innerHTML = `<span class="day">${day}</span><span class="mon">${mon.join(' ')}</span>`;
    head.append(chip);
  }
  const dateInfo = document.createElement('div');
  dateInfo.className = 'related-card-date-info';
  if (category) {
    const c = document.createElement('p');
    c.className = 'related-card-cat';
    c.textContent = category;
    dateInfo.append(c);
  }
  if (time) {
    const t = document.createElement('p');
    t.className = 'related-card-time';
    t.textContent = time;
    dateInfo.append(t);
  }
  if (dateInfo.children.length) head.append(dateInfo);
  if (head.children.length) card.append(head);

  const body = document.createElement('div');
  body.className = 'related-card-body';
  const h3 = document.createElement('h3');
  h3.className = 'related-card-title';
  h3.textContent = titleEl ? titleEl.textContent.trim() : '';
  body.append(h3);
  if (location) {
    const loc = document.createElement('p');
    loc.className = 'related-card-loc';
    loc.textContent = location;
    body.append(loc);
  }
  card.append(body);
  return card;
}

export default async function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const container = document.createElement('div');
  container.className = 'container';

  let head = null;
  let seeAll = null;
  const cardRows = [];

  rows.forEach((row) => {
    const parts = flatten(row);
    const hasDate = parts.some((p) => DAY_MON_RE.test(p.textContent.trim()));
    const hasHeading = parts.some(isHeading);
    const links = parts.filter(anchorOf);
    if (!head && hasHeading && !hasDate) { head = parts; return; }
    if (!hasDate && links.length === 1 && parts.length <= 2
      && !parts.some(isHeading)) { seeAll = anchorOf(parts.find(anchorOf)); return; }
    cardRows.push(parts);
  });

  if (head) {
    const sh = document.createElement('div');
    sh.className = 'section-head';
    const eyebrow = head.find((p) => !isHeading(p) && p.textContent.trim());
    const heading = head.find(isHeading);
    if (eyebrow) {
      const p = document.createElement('p');
      p.className = 'eyebrow';
      p.textContent = eyebrow.textContent.trim();
      sh.append(p);
    }
    if (heading) {
      const h2 = document.createElement('h2');
      h2.innerHTML = heading.innerHTML;
      sh.append(h2);
    }
    container.append(sh);
  }

  const grid = document.createElement('div');
  grid.className = 'related-grid';
  cardRows.forEach((parts) => grid.append(buildCard(parts)));
  container.append(grid);

  if (seeAll) {
    const wrap = document.createElement('div');
    wrap.className = 'related-events-more';
    const a = seeAll.cloneNode(true);
    a.className = 'readmore';
    wrap.append(a);
    container.append(wrap);
  }

  block.replaceChildren(container);
}
