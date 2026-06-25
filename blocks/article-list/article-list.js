/**
 * article-list block — DYNAMIC, index-driven.
 *
 * A chronological list of news / press-release rows fetched from the news
 * query-index (/de/corporate/medien-und-news/medienmitteilungen-und-news/
 * query-index.json). Rows are sorted by publishDate DESC (newest first; rows
 * with no publishDate sort last). Each row links to the article and shows a
 * category tag, the date (dd.mm.yyyy), the title and an optional source line,
 * closed by a chevron. The first 10 rows render; a working "Mehr anzeigen"
 * button reveals the next 10 client-side from the already-fetched index.
 *
 * Fallback: if the index is empty or the fetch fails, the originally authored
 * rows are rendered instead (parsed before the DOM is replaced).
 *
 * Authoring (fallback only) — one ROW per article (cells classified by
 * content, never index):
 *   - a short tag line ("Medienmitteilung" / "News") → article-tag
 *   - a date line (dd.mm.yyyy) → article-date
 *   - a title link → the row title + href
 *   - a remaining text line → the source
 * A final row that is a single bare text line ("10 von 28 …") → load-more count.
 */

const INDEX_DEFAULT = '/de/corporate/medien-und-news/medienmitteilungen-und-news/query-index.json';
const PAGE_SIZE = 10;
const FETCH_LIMIT = 500;

const DATE_RE = /^\d{1,2}\.\d{1,2}\.\d{2,4}$/;
const isHeading = (el) => /^h[1-6]$/.test(el.tagName.toLowerCase());
const anchorOf = (el) => (el.tagName.toLowerCase() === 'a' ? el : el.querySelector('a'));

/** ISO YYYY-MM-DD → dd.mm.yyyy (returns '' if not a valid ISO date). */
function formatDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec((iso || '').trim());
  if (!m) return '';
  return `${m[3]}.${m[2]}.${m[1]}`;
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

/** Build a row from index data { path, title, category, publishDate, description }. */
function buildIndexRow(item) {
  const li = document.createElement('li');
  li.className = 'article-row';
  const a = document.createElement('a');
  a.href = item.path || '#';

  const badge = document.createElement('span');
  badge.className = 'article-badge';
  if (item.category) {
    const t = document.createElement('span');
    t.className = 'article-tag';
    t.textContent = item.category;
    badge.append(t);
  }
  const dateText = formatDate(item.publishDate);
  if (dateText) {
    const d = document.createElement('time');
    d.className = 'article-date';
    d.dateTime = (item.publishDate || '').trim();
    d.textContent = dateText;
    badge.append(d);
  }
  a.append(badge);

  const content = document.createElement('span');
  content.className = 'article-content';
  const title = document.createElement('span');
  title.className = 'article-title';
  title.textContent = item.title || '';
  content.append(title);
  if (item.description) {
    const s = document.createElement('span');
    s.className = 'article-source';
    s.textContent = item.description;
    content.append(s);
  }
  a.append(content);

  const arrow = document.createElement('span');
  arrow.className = 'article-arrow';
  arrow.setAttribute('aria-hidden', 'true');
  arrow.innerHTML = '&#8250;';
  a.append(arrow);

  li.append(a);
  return li;
}

/* ---- authored-row fallback parsing (unchanged behaviour) ---- */

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

function buildAuthoredRow(parts) {
  const li = document.createElement('li');
  li.className = 'article-row';
  const a = document.createElement('a');

  let tag = null;
  let date = null;
  let titleEl = null;
  let href = '#';
  let source = null;

  parts.forEach((el) => {
    const text = el.textContent.trim();
    const link = anchorOf(el);
    if (link && !titleEl) { titleEl = el; href = link.getAttribute('href') || '#'; return; }
    if (isHeading(el) && !titleEl) { titleEl = el; return; }
    if (!date && DATE_RE.test(text)) { date = text; return; }
    if (!tag && text && text.length <= 28) { tag = text; return; }
    if (text) source = text;
  });

  a.href = href;

  const badge = document.createElement('span');
  badge.className = 'article-badge';
  if (tag) {
    const t = document.createElement('span');
    t.className = 'article-tag';
    t.textContent = tag;
    badge.append(t);
  }
  if (date) {
    const d = document.createElement('time');
    d.className = 'article-date';
    d.textContent = date;
    badge.append(d);
  }
  a.append(badge);

  const content = document.createElement('span');
  content.className = 'article-content';
  const title = document.createElement('span');
  title.className = 'article-title';
  title.textContent = titleEl ? titleEl.textContent.trim() : '';
  content.append(title);
  if (source) {
    const s = document.createElement('span');
    s.className = 'article-source';
    s.textContent = source;
    content.append(s);
  }
  a.append(content);

  const arrow = document.createElement('span');
  arrow.className = 'article-arrow';
  arrow.setAttribute('aria-hidden', 'true');
  arrow.innerHTML = '&#8250;';
  a.append(arrow);

  li.append(a);
  return li;
}

/** Parse the authored block into { rows: HTMLLIElement[], count, moreBtn }. */
function parseAuthored(blockRows) {
  const list = [];
  let countLine = null;
  let moreBtn = null;

  blockRows.forEach((row) => {
    const parts = flatten(row);
    const hasLink = parts.some(anchorOf);
    const hasDate = parts.some((p) => DATE_RE.test(p.textContent.trim()));
    if (!hasDate && parts.length <= 2 && !parts.some(isHeading)) {
      const link = parts.find(anchorOf);
      const textOnly = parts.find((p) => !anchorOf(p) && p.textContent.trim());
      if (textOnly && /\bvon\b|\d+\s*\/\s*\d+|beitr/i.test(textOnly.textContent)) {
        countLine = textOnly.textContent.trim();
      }
      if (link) moreBtn = anchorOf(link);
      if (countLine || moreBtn) return;
    }
    if (hasLink) list.push(buildAuthoredRow(parts));
  });

  return { rows: list, countLine, moreBtn };
}

export default async function decorate(block) {
  // Optional first cell may override the index path.
  const override = block.querySelector(':scope > div > div')?.textContent.trim();
  const indexPath = override && override.startsWith('/') ? override : INDEX_DEFAULT;

  // Read authored rows BEFORE we touch the DOM (used as fallback).
  const authoredRows = [...block.querySelectorAll(':scope > div')];

  const container = document.createElement('div');
  container.className = 'container';

  const list = document.createElement('ul');
  list.className = 'article-list';
  list.setAttribute('aria-label', 'Medienmitteilungen und News');
  container.append(list);

  let items = [];
  try {
    items = await fetchIndex(indexPath);
  } catch {
    items = [];
  }

  if (items.length) {
    // Dynamic path: sort by publishDate DESC, rows with no date last.
    items.sort((a, b) => {
      const da = (a.publishDate || '').trim();
      const db = (b.publishDate || '').trim();
      if (da && db) return db.localeCompare(da);
      if (da) return -1;
      if (db) return 1;
      return 0;
    });

    let shown = 0;
    const render = () => {
      items.slice(shown, shown + PAGE_SIZE).forEach((it) => list.append(buildIndexRow(it)));
      shown = Math.min(shown + PAGE_SIZE, items.length);
    };
    render();

    const bar = document.createElement('div');
    bar.className = 'load-more-bar';
    const count = document.createElement('p');
    count.className = 'load-more-count';
    count.setAttribute('aria-live', 'polite');
    const updateCount = () => {
      count.textContent = `${shown} von ${items.length}`;
    };
    updateCount();
    bar.append(count);

    const moreBtn = document.createElement('button');
    moreBtn.type = 'button';
    moreBtn.className = 'btn btn--primary';
    moreBtn.textContent = 'Mehr anzeigen';
    moreBtn.addEventListener('click', () => {
      render();
      updateCount();
      if (shown >= items.length) moreBtn.hidden = true;
    });
    if (shown >= items.length) moreBtn.hidden = true;
    bar.append(moreBtn);
    container.append(bar);

    block.replaceChildren(container);
    return;
  }

  // Fallback path: render the originally authored rows.
  const { rows, countLine, moreBtn } = parseAuthored(authoredRows);
  rows.forEach((li) => list.append(li));

  if (countLine || moreBtn) {
    const bar = document.createElement('div');
    bar.className = 'load-more-bar';
    if (countLine) {
      const p = document.createElement('p');
      p.className = 'load-more-count';
      p.textContent = countLine;
      bar.append(p);
    }
    if (moreBtn) {
      const a = moreBtn.cloneNode(true);
      a.className = 'btn btn--primary';
      bar.append(a);
    }
    container.append(bar);
  }

  block.replaceChildren(container);
}
