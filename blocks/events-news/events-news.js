/**
 * events-news block
 * Dark-blue two-column activity band: a Kurse und Veranstaltungen (events) list
 * beside a Medienmitteilungen & News list, each closed by a read-more.
 *
 * Authoring (one row per item; classified by content, never by index):
 *   - Events column heading: a single text cell ("Kurse und Veranstaltungen")
 *   - Event item:   "DD Mon." · location · title · detail link
 *   - News column heading:   a single text cell ("Medienmitteilungen & News")
 *   - News item:    tag · date (dd.mm.yyyy) · title · detail link
 *   - See-all row:  one or two plain links (each becomes its column's col-more)
 */

const DATE_RE = /^\d{1,2}\.\d{1,2}\.\d{2,4}$/;
const DAY_MON_RE = /^\d{1,2}\.?\s*[A-Za-zÄÖÜäöü]{2,}\.?$/;
const anchorOf = (el) => (el.tagName.toLowerCase() === 'a' ? el : el.querySelector('a'));

function readRow(row) {
  const cells = [...row.querySelectorAll(':scope > div')];
  return (cells.length ? cells : [row]).map((cell) => ({
    text: cell.textContent.trim(),
    html: cell.innerHTML,
    el: cell,
    link: cell.querySelector('a'),
  })).filter((c) => c.text || c.link);
}

function buildEventRow(cells) {
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

function buildNewsRow(cells) {
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
  const rows = [...block.querySelectorAll(':scope > div')].map(readRow).filter((r) => r.length);

  const eventCol = document.createElement('div');
  eventCol.className = 'happening-col';
  const eventList = document.createElement('ul');
  eventList.className = 'event-list';

  const newsCol = document.createElement('div');
  newsCol.className = 'happening-col';
  const newsList = document.createElement('ul');
  newsList.className = 'news-list';

  let eventHeading = 'Kurse und Veranstaltungen';
  let newsHeading = 'Medienmitteilungen &amp; News';
  const seeAll = [];

  rows.forEach((cells) => {
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
    if (isEvent) eventList.append(buildEventRow(cells));
    else newsList.append(buildNewsRow(cells));
  });

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
