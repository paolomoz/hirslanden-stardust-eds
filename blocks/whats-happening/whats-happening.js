/**
 * whats-happening block
 * Two-column "what's happening" band — a News & Mitteilungen list beside a
 * Veranstaltungen (events) list — closed by a full-width blue Blog band.
 *
 * Authoring (one row per item; classified by content, never by index):
 *   - News column heading:   a single text cell ("News & Mitteilungen")
 *   - News item:    4 cells → tag · date (dd.mm.yyyy) · title · detail link
 *   - Events column heading: a single text cell ("Veranstaltungen")
 *   - Event item:   4 cells → "DD Mon." · location · title · detail link
 *   - See-all row:  one or two plain links (each becomes its column's col-more)
 *   - Blog band:    a heading + a single link
 *
 * Heuristics decide news-vs-event from the date cell shape, so the two columns
 * can be authored in any interleaving.
 */

const DATE_RE = /^\d{1,2}\.\d{1,2}\.\d{2,4}$/; // 28.05.2026
const DAY_MON_RE = /^\d{1,2}\.?\s*[A-Za-zÄÖÜäöü]{2,}\.?$/; // "25 Jun." / "01 Jul."
const anchorOf = (el) => (el.tagName.toLowerCase() === 'a' ? el : el.querySelector('a'));

/**
 * Flatten one block row into a list of {text, html, el, link} cell descriptors.
 * @param {Element} row
 */
function readRow(row) {
  const cells = [...row.querySelectorAll(':scope > div')];
  return (cells.length ? cells : [row]).map((cell) => ({
    text: cell.textContent.trim(),
    html: cell.innerHTML,
    el: cell,
    link: cell.querySelector('a'),
  })).filter((c) => c.text || c.link);
}

function buildNewsRow(cells) {
  // cells: [tag, date, title, link]
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

function buildEventRow(cells) {
  // cells: ["DD Mon.", location, title, link]
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
  const rows = [...block.querySelectorAll(':scope > div')].map(readRow).filter((r) => r.length);

  const newsCol = document.createElement('div');
  newsCol.className = 'happening-col';
  const newsList = document.createElement('ul');
  newsList.className = 'news-list';

  const eventCol = document.createElement('div');
  eventCol.className = 'happening-col';
  const eventList = document.createElement('ul');
  eventList.className = 'event-list';

  let newsHeading = 'News &amp; Mitteilungen';
  let eventHeading = 'Veranstaltungen';
  const seeAll = [];
  let blogRow = null;

  rows.forEach((cells) => {
    const hasHeadingEl = cells.some((c) => c.el.querySelector('h1,h2,h3,h4,h5,h6'));
    const links = cells.filter((c) => c.link);
    const allLinks = links.length === cells.length && cells.length > 0;

    // Blog band: a heading element plus a link.
    if (hasHeadingEl && links.length) {
      blogRow = cells;
      return;
    }

    // Single text cell, no link → a column heading.
    if (cells.length === 1 && !cells[0].link) {
      if (/veranstalt|kurse|event/i.test(cells[0].text)) eventHeading = cells[0].html;
      else newsHeading = cells[0].html;
      return;
    }

    // Row of only link(s) → see-all link(s).
    if (allLinks) {
      links.forEach((c) => seeAll.push(c));
      return;
    }

    // Event vs news by date-cell shape.
    const isEvent = cells.some((c) => DAY_MON_RE.test(c.text) && !DATE_RE.test(c.text));
    if (isEvent) eventList.append(buildEventRow(cells));
    else newsList.append(buildNewsRow(cells));
  });

  // Assemble columns.
  const h2n = document.createElement('h2');
  h2n.innerHTML = newsHeading;
  newsCol.append(h2n, newsList);

  const h2e = document.createElement('h2');
  h2e.innerHTML = eventHeading;
  eventCol.append(h2e, eventList);

  // Distribute see-all links: first → news, second → events (by URL hint if possible).
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
