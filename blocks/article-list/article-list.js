/**
 * article-list block
 * A chronological list of news / press-release rows. Each row links to an
 * article and shows a tag, a date, the title and a source line, closed by a
 * chevron. An optional trailing "load more" group renders the count + button.
 *
 * Authoring — one ROW per article (cells classified by content, never index):
 *   - a short tag line ("Medienmitteilung" / "News") → article-tag
 *   - a date line (dd.mm.yyyy) → article-date
 *   - a title link → the row title + href
 *   - a remaining text line → the source
 * A final row that is a single bare text line ("10 von 28 …") → load-more count.
 */

const DATE_RE = /^\d{1,2}\.\d{1,2}\.\d{2,4}$/;
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

function buildRow(parts) {
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

export default async function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const container = document.createElement('div');
  container.className = 'container';

  const list = document.createElement('ul');
  list.className = 'article-list';
  list.setAttribute('aria-label', 'Medienmitteilungen und News');

  let countLine = null;
  let moreBtn = null;

  rows.forEach((row) => {
    const parts = flatten(row);
    const hasLink = parts.some(anchorOf);
    const hasDate = parts.some((p) => DATE_RE.test(p.textContent.trim()));
    // A trailing meta row: a count text and/or a "Mehr anzeigen" button.
    if (!hasDate && parts.length <= 2 && !parts.some(isHeading)) {
      const link = parts.find(anchorOf);
      const textOnly = parts.find((p) => !anchorOf(p) && p.textContent.trim());
      if (textOnly && /\bvon\b|\d+\s*\/\s*\d+|beitr/i.test(textOnly.textContent)) {
        countLine = textOnly.textContent.trim();
      }
      if (link) moreBtn = anchorOf(link);
      if (countLine || moreBtn) return;
    }
    if (hasLink) list.append(buildRow(parts));
  });

  container.append(list);

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
