/**
 * events-grid block — DYNAMIC, index-driven.
 *
 * Renders a 4-up grid of event cards from the `events` query-index
 * (/de/events-index.json). Each card carries an optional date chip (DD. Mon.),
 * a location/clinic line, a title (link to the event page) and an image.
 * Cards are stamped with data-location / data-category so the sibling
 * events-filter block can filter them client-side.
 *
 * DATA REALITY: most events have NO eventDate (closed/recurring). Dateless
 * events are NOT hidden — events WITH a date sort first (ascending), dateless
 * events follow. Cards without a date simply omit the date chip.
 *
 * Authoring: the block may be EMPTY (all content fetched). An optional first
 * cell may override the index path. If the index is empty or the fetch fails,
 * the originally authored rows are rendered as a static fallback.
 */

const INDEX_DEFAULT = '/de/events-index.json';
const FETCH_LIMIT = 500;

const MONTHS_DE = ['Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sep.', 'Okt.', 'Nov.', 'Dez.'];

const DAY_MON_RE = /^\d{1,2}\.?\s*[A-Za-zÄÖÜäöü]{2,}\.?$/; // "25 Jun." / "01 Jul."
const isMedia = (el) => el.matches('picture, img') || el.querySelector('picture, img');
const isHeading = (el) => /^h[1-6]$/.test(el.tagName.toLowerCase());
const anchorOf = (el) => (el.tagName.toLowerCase() === 'a' ? el : el.querySelector('a'));

const thumb = (url) => {
  if (!url) return null;
  try {
    const u = new URL(url, window.location.origin);
    u.searchParams.set('width', '750');
    u.searchParams.set('format', 'webply');
    u.searchParams.set('optimize', 'medium');
    return u.toString();
  } catch {
    return url;
  }
};

/** Parse a YYYY-MM-DD eventDate into { day, mon } chip parts, or null. */
function dateChipParts(eventDate) {
  if (!eventDate) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(eventDate.trim());
  if (!m) return null;
  const monIdx = Number(m[2]) - 1;
  if (monIdx < 0 || monIdx > 11) return null;
  return { day: String(Number(m[3])), mon: MONTHS_DE[monIdx] };
}

async function fetchIndex(path) {
  const rows = [];
  let offset = 0;
  let total = Infinity;
  while (offset < total) {
    // eslint-disable-next-line no-await-in-loop
    const resp = await fetch(`${path}?limit=${FETCH_LIMIT}&offset=${offset}`);
    if (!resp.ok) break;
    // eslint-disable-next-line no-await-in-loop
    const json = await resp.json();
    rows.push(...(json.data || []));
    total = json.total ?? rows.length;
    offset += FETCH_LIMIT;
    if (!json.data || json.data.length === 0) break;
  }
  return rows;
}

/** Dated events first (ascending), then dateless events. */
function sortEvents(rows) {
  return [...rows].sort((a, b) => {
    const da = (a.eventDate || '').trim();
    const db = (b.eventDate || '').trim();
    if (da && db) return da.localeCompare(db);
    if (da) return -1;
    if (db) return 1;
    return 0;
  });
}

function buildCard(row) {
  const li = document.createElement('li');
  const card = document.createElement('a');
  card.className = 'event-card';
  card.href = row.path || '#';
  card.setAttribute('aria-label', row.title || '');

  // events-filter reads data-location / data-category off each card
  if (row.location) card.dataset.location = row.location;
  const category = row.fachgebiet || row.thema || '';
  if (category) card.dataset.category = category;

  // date chip + location meta
  const badge = document.createElement('div');
  badge.className = 'event-card-date-badge';
  const chipParts = dateChipParts(row.eventDate);
  if (chipParts) {
    const chip = document.createElement('div');
    chip.className = 'event-card-date-chip';
    chip.innerHTML = `<span class="day">${chipParts.day}</span><span class="mon">${chipParts.mon}</span>`;
    badge.append(chip);
  }

  const locParts = [row.location, row.clinic].map((s) => (s || '').trim()).filter(Boolean);
  if (locParts.length) {
    const meta = document.createElement('div');
    meta.className = 'event-card-meta';
    const loc = document.createElement('div');
    loc.className = 'event-card-location';
    const primary = document.createElement('span');
    primary.className = 'city-clinic';
    primary.textContent = locParts.join(' · ');
    loc.append(primary);
    meta.append(loc);
    badge.append(meta);
  }
  if (badge.children.length) card.append(badge);

  const body = document.createElement('div');
  body.className = 'event-card-body';
  const h3 = document.createElement('h3');
  h3.className = 'event-card-title';
  h3.textContent = row.title || '';
  body.append(h3);
  card.append(body);

  const src = thumb(row.image);
  if (src) {
    const wrap = document.createElement('div');
    wrap.className = 'event-card-image';
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.src = src;
    img.alt = row.title || '';
    img.width = 480;
    img.height = 300;
    wrap.append(img);
    card.append(wrap);
  }

  const cta = document.createElement('div');
  cta.className = 'event-card-cta';
  cta.innerHTML = '<span class="readmore">Mehr erfahren</span>';
  card.append(cta);

  li.append(card);
  return li;
}

/* ── static fallback (authored rows → cards), used when the index is empty ── */

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

function buildStaticCard(parts) {
  const li = document.createElement('li');
  const card = document.createElement('a');
  card.className = 'event-card';

  let dateLine = null;
  let media = null;
  let titleEl = null;
  let titleHref = '#';
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
    if (/^(mehr erfahren|mehr|weiterlesen)/i.test(text)) return;
    if (text) locationLines.push(text);
  });

  card.href = titleHref;
  const title = titleEl ? titleEl.textContent.trim() : (locationLines.pop() || '');
  card.setAttribute('aria-label', title);

  const badge = document.createElement('div');
  badge.className = 'event-card-date-badge';
  if (dateLine) {
    const [day, ...mon] = dateLine.replace(/\.$/, '').split(/\s+/);
    const chip = document.createElement('div');
    chip.className = 'event-card-date-chip';
    chip.innerHTML = `<span class="day">${day}</span><span class="mon">${mon.join(' ')}</span>`;
    badge.append(chip);
  }
  const primary = locationLines.find((l) => !/^weitere/i.test(l)) || locationLines[0];
  if (primary) {
    const meta = document.createElement('div');
    meta.className = 'event-card-meta';
    const loc = document.createElement('div');
    loc.className = 'event-card-location';
    const s = document.createElement('span');
    s.className = 'city-clinic';
    s.textContent = primary;
    loc.append(s);
    meta.append(loc);
    badge.append(meta);
    card.dataset.location = primary;
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
  cta.innerHTML = '<span class="readmore">Mehr erfahren</span>';
  card.append(cta);

  li.append(card);
  return li;
}

function renderStaticFallback(authoredRows, container, grid, info) {
  const cardRows = [];
  authoredRows.forEach((row) => {
    const parts = flatten(row);
    const hasDate = parts.some((p) => DAY_MON_RE.test(p.textContent.trim()));
    const hasMedia = parts.some(isMedia);
    const hasHeading = parts.some(isHeading);
    // skip a leading heading-only row (the dynamic header already renders one)
    if (hasHeading && !hasDate && !hasMedia && cardRows.length === 0) return;
    cardRows.push(parts);
  });
  cardRows.forEach((parts) => {
    if (parts.some((p) => p.textContent.trim() || isMedia(p))) {
      grid.append(buildStaticCard(parts));
    }
  });
  const count = grid.children.length;
  info.textContent = `${count} ${count === 1 ? 'Veranstaltung' : 'Veranstaltungen'}`;
  return container;
}

export default async function decorate(block) {
  const override = block.querySelector(':scope > div > div')?.textContent.trim();
  const indexPath = override && override.startsWith('/') && override.endsWith('.json')
    ? override : INDEX_DEFAULT;

  // Preserve the authored DOM for the fallback path before we replace it.
  const authored = [...block.children];

  const container = document.createElement('div');
  container.className = 'container';

  const head = document.createElement('div');
  head.className = 'events-grid-header';
  const h2 = document.createElement('h2');
  h2.textContent = 'Veranstaltungen';
  const info = document.createElement('span');
  info.className = 'pagination-info';
  head.append(h2, info);
  container.append(head);

  const grid = document.createElement('ul');
  grid.className = 'event-card-grid';
  grid.setAttribute('aria-label', 'Veranstaltungen');
  container.append(grid);

  let rows = [];
  try {
    rows = await fetchIndex(indexPath);
  } catch {
    rows = [];
  }

  if (!rows.length) {
    // FALLBACK: index unavailable → render the authored rows as static cards.
    renderStaticFallback(authored, container, grid, info);
    block.replaceChildren(container);
    return;
  }

  const sorted = sortEvents(rows);
  sorted.forEach((row) => grid.append(buildCard(row)));

  const count = sorted.length;
  info.textContent = `${count} ${count === 1 ? 'Veranstaltung' : 'Veranstaltungen'}`;

  block.replaceChildren(container);
}
