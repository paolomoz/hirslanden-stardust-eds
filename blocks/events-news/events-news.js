/**
 * events-news block — DYNAMIC, index-driven.
 *
 * Dark-blue two-column activity band on a clinic home page:
 *   - Events column  ← the `events` index (/de/events-index.json), filtered to
 *     the CURRENT clinic (rows whose `path` starts with `/de/<clinic>/`), ~4
 *     items, dated events first (ascending) then dateless ones.
 *   - News column    ← the corporate news index
 *     (/de/corporate/medien-und-news/medienmitteilungen-und-news/query-index.json),
 *     newest first (publishDate desc, lastModified as a fallback), ~4 items.
 *     There is no per-clinic news folder, so corporate news is shared.
 *
 * The current clinic prefix is derived from window.location.pathname.
 * If both indexes are empty / fail, the originally authored rows are rendered
 * as a static fallback.
 *
 * Authoring (one row per item; classified by content, never by index):
 *   - Events column heading: a single text cell ("Kurse und Veranstaltungen")
 *   - Event item:   "DD Mon." · location · title · detail link
 *   - News column heading:   a single text cell ("Medienmitteilungen & News")
 *   - News item:    tag · date (dd.mm.yyyy) · title · detail link
 *   - See-all row:  one or two plain links (each becomes its column's col-more)
 */

const EVENTS_INDEX = '/de/events-index.json';
const NEWS_INDEX = '/de/corporate/medien-und-news/medienmitteilungen-und-news/query-index.json';
const FETCH_LIMIT = 500;
const COLUMN_SIZE = 4;

const MONTHS_DE = ['Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sep.', 'Okt.', 'Nov.', 'Dez.'];

const DATE_RE = /^\d{1,2}\.\d{1,2}\.\d{2,4}$/;
const DAY_MON_RE = /^\d{1,2}\.?\s*[A-Za-zÄÖÜäöü]{2,}\.?$/;
const anchorOf = (el) => (el.tagName.toLowerCase() === 'a' ? el : el.querySelector('a'));

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

/** `/de/klinik-linde/home` → `/de/klinik-linde/` (null if not a clinic path). */
function clinicPrefix() {
  const m = /^\/de\/([^/]+)\//.exec(window.location.pathname);
  return m ? `/de/${m[1]}/` : null;
}

/** YYYY-MM-DD → { day, mon } chip parts, or null. */
function eventChipParts(eventDate) {
  if (!eventDate) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(eventDate.trim());
  if (!m) return null;
  const monIdx = Number(m[2]) - 1;
  if (monIdx < 0 || monIdx > 11) return null;
  return { day: String(Number(m[3])), mon: MONTHS_DE[monIdx] };
}

/** YYYY-MM-DD → dd.mm.yyyy for display. */
function formatNewsDate(value) {
  if (!value) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim());
  if (!m) return value.trim();
  return `${m[3]}.${m[2]}.${m[1]}`;
}

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

function sortNewsDesc(rows) {
  const key = (r) => (r.publishDate || '').trim() || (r.lastModified ? String(r.lastModified) : '');
  return [...rows].sort((a, b) => key(b).localeCompare(key(a)));
}

function buildEventCard(row) {
  const li = document.createElement('li');
  li.className = 'event-row';

  const a = document.createElement('a');
  a.href = row.path || '#';

  const chip = document.createElement('span');
  chip.className = 'date-chip';
  const parts = eventChipParts(row.eventDate);
  const d = document.createElement('span');
  d.className = 'day';
  d.textContent = parts ? parts.day : '';
  const m = document.createElement('span');
  m.className = 'mon';
  m.textContent = parts ? parts.mon : '';
  chip.append(d, m);

  const wrap = document.createElement('span');
  wrap.className = 'event-text';
  const locText = [row.location, row.clinic].map((s) => (s || '').trim()).filter(Boolean).join(' · ');
  if (locText) {
    const l = document.createElement('span');
    l.className = 'loc';
    l.textContent = locText;
    wrap.append(l);
  }
  const h3 = document.createElement('h3');
  h3.textContent = row.title || '';
  wrap.append(h3);

  a.append(chip, wrap);
  li.append(a);
  return li;
}

function buildNewsCard(row) {
  const li = document.createElement('li');
  li.className = 'news-row';

  const a = document.createElement('a');
  a.href = row.path || '#';

  const meta = document.createElement('span');
  meta.className = 'news-meta';
  const tag = (row.category || '').trim();
  if (tag) {
    const t = document.createElement('span');
    t.className = 'news-tag';
    t.textContent = tag;
    meta.append(t);
  }
  const dateText = formatNewsDate(row.publishDate);
  if (dateText) {
    if (tag) {
      const sep = document.createElement('span');
      sep.setAttribute('aria-hidden', 'true');
      sep.textContent = '·';
      meta.append(sep);
    }
    const dt = document.createElement('span');
    dt.textContent = dateText;
    meta.append(dt);
  }
  if (meta.children.length) a.append(meta);

  const h3 = document.createElement('h3');
  h3.textContent = row.title || '';
  a.append(h3);

  li.append(a);
  return li;
}

/* ── static fallback (authored rows), used when both indexes are empty ── */

function readRow(row) {
  const cells = [...row.querySelectorAll(':scope > div')];
  return (cells.length ? cells : [row]).map((cell) => ({
    text: cell.textContent.trim(),
    html: cell.innerHTML,
    el: cell,
    link: cell.querySelector('a'),
  })).filter((c) => c.text || c.link);
}

function buildStaticEventRow(cells) {
  const li = document.createElement('li');
  li.className = 'event-row';
  const link = cells.find((c) => c.link);
  const dayMon = cells.find((c) => DAY_MON_RE.test(c.text));
  const rest = cells.filter((c) => c !== dayMon && !c.link);
  const loc = rest[0];
  const title = rest[1] || rest[0];

  const a = document.createElement('a');
  a.href = link ? anchorOf(link.el).getAttribute('href') : '#';

  const chip = document.createElement('span');
  chip.className = 'date-chip';
  const [day, ...mon] = (dayMon ? dayMon.text : '').split(/\s+/);
  const d = document.createElement('span');
  d.className = 'day';
  d.textContent = day || '';
  const m = document.createElement('span');
  m.className = 'mon';
  m.textContent = mon.join(' ');
  chip.append(d, m);

  const wrap = document.createElement('span');
  wrap.className = 'event-text';
  if (loc && loc !== title) {
    const l = document.createElement('span');
    l.className = 'loc';
    l.textContent = loc.text;
    wrap.append(l);
  }
  const h3 = document.createElement('h3');
  h3.textContent = (title || {}).text || '';
  wrap.append(h3);

  a.append(chip, wrap);
  li.append(a);
  return li;
}

function buildStaticNewsRow(cells) {
  const li = document.createElement('li');
  li.className = 'news-row';
  const link = cells.find((c) => c.link);
  const date = cells.find((c) => DATE_RE.test(c.text));
  const nonLink = cells.filter((c) => !c.link && c !== date);
  const tag = nonLink.find((c) => c.text.length <= 24);
  const title = nonLink.find((c) => c !== tag) || tag;

  const a = document.createElement('a');
  a.href = link ? anchorOf(link.el).getAttribute('href') : '#';

  const meta = document.createElement('span');
  meta.className = 'news-meta';
  if (tag && tag !== title) {
    const t = document.createElement('span');
    t.className = 'news-tag';
    t.textContent = tag.text;
    meta.append(t);
  }
  if (date) {
    const sep = document.createElement('span');
    sep.setAttribute('aria-hidden', 'true');
    sep.textContent = '·';
    const dt = document.createElement('span');
    dt.textContent = date.text;
    meta.append(sep, dt);
  }
  a.append(meta);

  const h3 = document.createElement('h3');
  h3.textContent = (title || {}).text || '';
  a.append(h3);

  li.append(a);
  return li;
}

export default async function decorate(block) {
  // Read authored content up front (headings, see-all links, fallback rows).
  const authoredRows = [...block.querySelectorAll(':scope > div')].map(readRow).filter((r) => r.length);

  let eventHeading = 'Kurse und Veranstaltungen';
  let newsHeading = 'Medienmitteilungen &amp; News';
  const seeAll = [];
  const staticEvents = [];
  const staticNews = [];

  authoredRows.forEach((cells) => {
    const links = cells.filter((c) => c.link);
    const allLinks = links.length === cells.length && cells.length > 0;
    if (cells.length === 1 && !cells[0].link) {
      if (/veranstalt|kurse|event/i.test(cells[0].text)) eventHeading = cells[0].html;
      else newsHeading = cells[0].html;
      return;
    }
    if (allLinks) {
      links.forEach((c) => seeAll.push(c));
      return;
    }
    const isEvent = cells.some((c) => DAY_MON_RE.test(c.text) && !DATE_RE.test(c.text));
    if (isEvent) staticEvents.push(cells);
    else staticNews.push(cells);
  });

  const eventCol = document.createElement('div');
  eventCol.className = 'happening-col';
  const eventList = document.createElement('ul');
  eventList.className = 'event-list';

  const newsCol = document.createElement('div');
  newsCol.className = 'happening-col';
  const newsList = document.createElement('ul');
  newsList.className = 'news-list';

  // Fetch both indexes (independent).
  const prefix = clinicPrefix();
  let eventRows = [];
  let newsRows = [];
  try {
    [eventRows, newsRows] = await Promise.all([
      fetchIndex(EVENTS_INDEX).catch(() => []),
      fetchIndex(NEWS_INDEX).catch(() => []),
    ]);
  } catch {
    eventRows = [];
    newsRows = [];
  }

  // Events column — scope to the current clinic by path prefix.
  const scopedEvents = prefix
    ? eventRows.filter((r) => (r.path || '').startsWith(prefix))
    : eventRows;
  if (scopedEvents.length) {
    sortEvents(scopedEvents).slice(0, COLUMN_SIZE)
      .forEach((r) => eventList.append(buildEventCard(r)));
  } else {
    staticEvents.forEach((cells) => eventList.append(buildStaticEventRow(cells)));
  }

  // News column — newest first.
  if (newsRows.length) {
    sortNewsDesc(newsRows).slice(0, COLUMN_SIZE).forEach((r) => newsList.append(buildNewsCard(r)));
  } else {
    staticNews.forEach((cells) => newsList.append(buildStaticNewsRow(cells)));
  }

  const h2e = document.createElement('h2');
  h2e.innerHTML = eventHeading;
  eventCol.append(h2e, eventList);

  const h2n = document.createElement('h2');
  h2n.innerHTML = newsHeading;
  newsCol.append(h2n, newsList);

  seeAll.forEach((c) => {
    const a = anchorOf(c.el);
    const href = a.getAttribute('href') || '';
    const more = document.createElement('div');
    more.className = 'col-more';
    const link = document.createElement('a');
    link.className = 'readmore';
    link.href = href;
    link.innerHTML = a.innerHTML;
    more.append(link);
    if (/veranstalt|kurse|event/i.test(href + c.text)) eventCol.append(more);
    else newsCol.append(more);
  });

  const grid = document.createElement('div');
  grid.className = 'clinic-happening-grid';
  grid.append(eventCol, newsCol);

  const container = document.createElement('div');
  container.className = 'container';
  container.append(grid);

  block.replaceChildren(container);
}
