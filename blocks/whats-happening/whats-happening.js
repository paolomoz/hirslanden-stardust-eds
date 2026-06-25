/**
 * whats-happening block — DYNAMIC, index-driven (with authored fallback).
 *
 * Two-column "what's happening" band — a News & Mitteilungen list beside a
 * Veranstaltungen (events) list — closed by a full-width blue Blog band.
 *
 * News column is fetched from the news query-index
 * (/de/corporate/medien-und-news/medienmitteilungen-und-news/query-index.json),
 * sorted by publishDate DESC, first ~4 rows.
 * Events column is fetched from the events index (/de/events-index.json),
 * preferring rows WITH an eventDate (ascending), then any remaining rows, ~4 total.
 * The Blog band stays authored.
 *
 * Fallback: if BOTH indexes are empty/fail, the originally authored news and
 * event rows are rendered instead (parsed before the DOM is replaced).
 *
 * Authoring — one row per item; classified by content, never by index:
 *   - News column heading:   a single text cell ("News & Mitteilungen")
 *   - News item:    4 cells → tag · date (dd.mm.yyyy) · title · detail link
 *   - Events column heading: a single text cell ("Veranstaltungen")
 *   - Event item:   4 cells → "DD Mon." · location · title · detail link
 *   - See-all row:  one or two plain links (each becomes its column's col-more)
 *   - Blog band:    a heading + a single link
 */

const NEWS_INDEX = '/de/corporate/medien-und-news/medienmitteilungen-und-news/query-index.json';
const EVENTS_INDEX = '/de/events-index.json';
const NEWS_COUNT = 4;
const EVENTS_COUNT = 4;
const FETCH_LIMIT = 500;

const MONTHS_DE = ['Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sep.', 'Okt.', 'Nov.', 'Dez.'];

const DATE_RE = /^\d{1,2}\.\d{1,2}\.\d{2,4}$/; // 28.05.2026
const DAY_MON_RE = /^\d{1,2}\.?\s*[A-Za-zÄÖÜäöü]{2,}\.?$/; // "25 Jun." / "01 Jul."
const anchorOf = (el) => (el.tagName.toLowerCase() === 'a' ? el : el.querySelector('a'));

/** ISO YYYY-MM-DD → dd.mm.yyyy (returns '' if not a valid ISO date). */
function formatDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec((iso || '').trim());
  if (!m) return '';
  return `${m[3]}.${m[2]}.${m[1]}`;
}

/** ISO YYYY-MM-DD → { day: 'DD', mon: 'Mon.' } or null. */
function splitDayMon(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec((iso || '').trim());
  if (!m) return null;
  return { day: m[3], mon: MONTHS_DE[Number(m[2]) - 1] || '' };
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

/** Build a news row from index data { path, title, category, publishDate }. */
function buildIndexNewsRow(item) {
  const li = document.createElement('li');
  li.className = 'news-row';
  const a = document.createElement('a');
  a.href = item.path || '#';

  const meta = document.createElement('span');
  meta.className = 'news-meta';
  if (item.category) {
    const t = document.createElement('span');
    t.className = 'news-tag';
    t.textContent = item.category;
    meta.append(t);
  }
  const dateText = formatDate(item.publishDate);
  if (dateText) {
    const sep = document.createElement('span');
    sep.setAttribute('aria-hidden', 'true');
    sep.textContent = '·';
    const d = document.createElement('span');
    d.textContent = dateText;
    meta.append(sep, d);
  }
  a.append(meta);

  const h3 = document.createElement('h3');
  h3.textContent = item.title || '';
  a.append(h3);

  li.append(a);
  return li;
}

/** Build an event row from index data { path, title, eventDate, location, clinic }. */
function buildIndexEventRow(item) {
  const li = document.createElement('li');
  li.className = 'event-row';
  const a = document.createElement('a');
  a.href = item.path || '#';

  const chip = document.createElement('span');
  chip.className = 'date-chip';
  const dm = splitDayMon(item.eventDate);
  const dayEl = document.createElement('span');
  dayEl.className = 'day';
  dayEl.textContent = dm ? dm.day : '';
  const monEl = document.createElement('span');
  monEl.className = 'mon';
  monEl.textContent = dm ? dm.mon : '';
  chip.append(dayEl, monEl);

  const textWrap = document.createElement('span');
  textWrap.className = 'event-text';
  const locText = item.location || item.clinic;
  if (locText) {
    const l = document.createElement('span');
    l.className = 'loc';
    l.textContent = locText;
    textWrap.append(l);
  }
  const h3 = document.createElement('h3');
  h3.textContent = item.title || '';
  textWrap.append(h3);

  a.append(chip, textWrap);
  li.append(a);
  return li;
}

/* ---- authored-row fallback parsing (unchanged behaviour) ---- */

function readRow(row) {
  const cells = [...row.querySelectorAll(':scope > div')];
  return (cells.length ? cells : [row]).map((cell) => ({
    text: cell.textContent.trim(),
    html: cell.innerHTML,
    el: cell,
    link: cell.querySelector('a'),
  })).filter((c) => c.text || c.link);
}

function buildAuthoredNewsRow(cells) {
  const li = document.createElement('li');
  li.className = 'news-row';
  const link = cells.find((c) => c.link);
  const date = cells.find((c) => DATE_RE.test(c.text));
  const tag = cells.find((c) => c !== date && !c.link && c.text.length <= 24
    && c !== cells.find((x) => x.text.length > 24));
  const title = cells.find((c) => c !== date && c !== tag && !c.link);

  const a = document.createElement('a');
  a.href = link ? anchorOf(link.el).getAttribute('href') : '#';

  const meta = document.createElement('span');
  meta.className = 'news-meta';
  if (tag) {
    const t = document.createElement('span');
    t.className = 'news-tag';
    t.textContent = tag.text;
    meta.append(t);
  }
  if (date) {
    const sep = document.createElement('span');
    sep.setAttribute('aria-hidden', 'true');
    sep.textContent = '·';
    const d = document.createElement('span');
    d.textContent = date.text;
    meta.append(sep, d);
  }
  a.append(meta);

  const h3 = document.createElement('h3');
  h3.textContent = (title || {}).text || '';
  a.append(h3);

  li.append(a);
  return li;
}

function buildAuthoredEventRow(cells) {
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
  const [day, ...monParts] = (dayMon ? dayMon.text : '').split(/\s+/);
  const dayEl = document.createElement('span');
  dayEl.className = 'day';
  dayEl.textContent = day || '';
  const monEl = document.createElement('span');
  monEl.className = 'mon';
  monEl.textContent = monParts.join(' ');
  chip.append(dayEl, monEl);

  const textWrap = document.createElement('span');
  textWrap.className = 'event-text';
  if (loc && loc !== title) {
    const l = document.createElement('span');
    l.className = 'loc';
    l.textContent = loc.text;
    textWrap.append(l);
  }
  const h3 = document.createElement('h3');
  h3.textContent = (title || {}).text || '';
  textWrap.append(h3);

  a.append(chip, textWrap);
  li.append(a);
  return li;
}

export default async function decorate(block) {
  // Read authored rows BEFORE touching the DOM (used for headings, see-all,
  // the blog band, and as the news/event fallback).
  const authored = [...block.querySelectorAll(':scope > div')].map(readRow).filter((r) => r.length);

  let newsHeading = 'News &amp; Mitteilungen';
  let eventHeading = 'Veranstaltungen';
  const seeAll = [];
  let blogRow = null;
  const authoredNews = [];
  const authoredEvents = [];

  authored.forEach((cells) => {
    const hasHeadingEl = cells.some((c) => c.el.querySelector('h1,h2,h3,h4,h5,h6'));
    const links = cells.filter((c) => c.link);
    const allLinks = links.length === cells.length && cells.length > 0;

    if (hasHeadingEl && links.length) { blogRow = cells; return; }
    if (cells.length === 1 && !cells[0].link) {
      if (/veranstalt|kurse|event/i.test(cells[0].text)) eventHeading = cells[0].html;
      else newsHeading = cells[0].html;
      return;
    }
    if (allLinks) { links.forEach((c) => seeAll.push(c)); return; }

    const isEvent = cells.some((c) => DAY_MON_RE.test(c.text) && !DATE_RE.test(c.text));
    if (isEvent) authoredEvents.push(cells);
    else authoredNews.push(cells);
  });

  // Fetch both indexes (independent, in parallel).
  const [newsItems, eventItems] = await Promise.all([
    fetchIndex(NEWS_INDEX).catch(() => []),
    fetchIndex(EVENTS_INDEX).catch(() => []),
  ]);

  // Build the news list.
  const newsList = document.createElement('ul');
  newsList.className = 'news-list';
  if (newsItems.length) {
    newsItems.sort((a, b) => {
      const da = (a.publishDate || '').trim();
      const db = (b.publishDate || '').trim();
      if (da && db) return db.localeCompare(da);
      if (da) return -1;
      if (db) return 1;
      return 0;
    });
    newsItems.slice(0, NEWS_COUNT).forEach((it) => newsList.append(buildIndexNewsRow(it)));
  } else {
    authoredNews.forEach((cells) => newsList.append(buildAuthoredNewsRow(cells)));
  }

  // Build the event list — prefer rows WITH an eventDate (ascending), then rest.
  const eventList = document.createElement('ul');
  eventList.className = 'event-list';
  if (eventItems.length) {
    const dated = eventItems.filter((e) => (e.eventDate || '').trim())
      .sort((a, b) => a.eventDate.localeCompare(b.eventDate));
    const undated = eventItems.filter((e) => !(e.eventDate || '').trim());
    [...dated, ...undated].slice(0, EVENTS_COUNT)
      .forEach((it) => eventList.append(buildIndexEventRow(it)));
  } else {
    authoredEvents.forEach((cells) => eventList.append(buildAuthoredEventRow(cells)));
  }

  // Assemble columns.
  const newsCol = document.createElement('div');
  newsCol.className = 'happening-col';
  const h2n = document.createElement('h2');
  h2n.innerHTML = newsHeading;
  newsCol.append(h2n, newsList);

  const eventCol = document.createElement('div');
  eventCol.className = 'happening-col';
  const h2e = document.createElement('h2');
  h2e.innerHTML = eventHeading;
  eventCol.append(h2e, eventList);

  // Distribute see-all links: events vs news by URL/text hint, else news.
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
  grid.className = 'happening-grid';
  grid.append(newsCol, eventCol);

  const container = document.createElement('div');
  container.className = 'container';
  container.append(grid);

  const children = [container];

  // Static authored blog band.
  if (blogRow) {
    const headingCell = blogRow.find((c) => c.el.querySelector('h1,h2,h3,h4,h5,h6'));
    const linkCell = blogRow.find((c) => c.link);
    const band = document.createElement('div');
    band.className = 'blog-band';
    const bandContainer = document.createElement('div');
    bandContainer.className = 'container';
    const h2 = document.createElement('h2');
    h2.innerHTML = headingCell.el.querySelector('h1,h2,h3,h4,h5,h6').innerHTML;
    bandContainer.append(h2);
    if (linkCell) {
      const a = anchorOf(linkCell.el);
      const btn = a.cloneNode(true);
      btn.className = 'btn btn--onblue';
      btn.removeAttribute('style');
      bandContainer.append(btn);
    }
    band.append(bandContainer);
    children.push(band);
  }

  block.replaceChildren(...children);
}
