/**
 * specialties block
 * A 3-column grid of department/specialty cards. Each card: a decorative icon,
 * a title, body copy and a "Mehr erfahren" read-more link. A leading
 * eyebrow + heading become the section head.
 *
 * Authoring (one ROW per card, classified by content):
 *   - a heading (h3) → card title
 *   - a paragraph    → card copy
 *   - a plain link   → read-more
 * A lone leading row of [eyebrow text, heading] (or a single heading) becomes
 * the section head.
 */

const DEPT_ICON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';

const isHeading = (el) => /^h[1-6]$/.test(el.tagName.toLowerCase());
const anchorOf = (el) => (el.tagName.toLowerCase() === 'a' ? el : el.querySelector('a'));

function readRows(block) {
  return [...block.querySelectorAll(':scope > div')].map((row) => {
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
  }).filter((p) => p.length);
}

export default async function decorate(block) {
  const rows = readRows(block);

  const container = document.createElement('div');
  container.className = 'container';

  // First row that has a heading but no link/paragraph-with-readmore can be the
  // section head when it's clearly a section opener (eyebrow + heading only).
  let cards = rows;
  const first = rows[0] || [];
  const firstHasLink = first.some((p) => anchorOf(p));
  const firstHeading = first.find(isHeading);
  if (firstHeading && !firstHasLink && first.length <= 2) {
    const head = document.createElement('div');
    head.className = 'section-head';
    const eyebrow = first.find((p) => p !== firstHeading && p.textContent.trim());
    if (eyebrow) {
      const e = document.createElement('p');
      e.className = 'eyebrow';
      e.innerHTML = eyebrow.innerHTML;
      head.append(e);
    }
    const h2 = document.createElement('h2');
    h2.innerHTML = firstHeading.innerHTML;
    head.append(h2);
    container.append(head);
    cards = rows.slice(1);
  }

  const grid = document.createElement('div');
  grid.className = 'dept-grid';

  cards.forEach((parts) => {
    const card = document.createElement('article');
    card.className = 'dept-card';

    const icon = document.createElement('div');
    icon.className = 'dept-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.innerHTML = DEPT_ICON;
    card.append(icon);

    const title = parts.find(isHeading);
    if (title) {
      const h3 = document.createElement('h3');
      h3.innerHTML = title.innerHTML;
      card.append(h3);
    }

    const link = parts.find((p) => anchorOf(p));
    const copy = parts.filter((p) => p !== title && p !== link && p.textContent.trim());
    copy.forEach((c) => {
      const p = document.createElement('p');
      p.innerHTML = c.innerHTML;
      card.append(p);
    });

    if (link) {
      const a = anchorOf(link);
      const more = document.createElement('a');
      more.className = 'readmore';
      more.href = a.getAttribute('href') || '#';
      more.innerHTML = a.innerHTML;
      card.append(more);
    }

    grid.append(card);
  });

  container.append(grid);
  block.replaceChildren(container);
}
