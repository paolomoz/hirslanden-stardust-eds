/**
 * related-conditions block
 * A 3-up grid of related condition cards on an alt-ground band. An optional
 * leading eyebrow + heading becomes the section head. Each card is a single
 * link carrying a specialty label and the condition title, plus a chevron.
 *
 * Authoring shapes (both supported):
 *   - one ROW per card: cells hold a specialty label and a link (the title).
 *   - a flattened single cell with an optional eyebrow + <h2> head, then for
 *     each card a specialty text line followed by a link.
 */

const CHEVRON = '&rsaquo;';

function flatten(row) {
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
}

const asAnchor = (el) => (el.tagName.toLowerCase() === 'a' ? el : el.querySelector('a'));

export default async function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  let eyebrow = null;
  let heading = null;
  const cards = [];

  const hasH2 = (parts) => parts.some((p) => p.tagName.toLowerCase() === 'h2');

  if (rows.length === 1) {
    const parts = flatten(rows[0]);
    const headingPresent = hasH2(parts);
    let pendingLabel = null;
    let seenHead = false;
    parts.forEach((el) => {
      const tag = el.tagName.toLowerCase();
      if (tag === 'h2' && !heading) {
        heading = el;
        seenHead = true;
        return;
      }
      const anchor = asAnchor(el);
      if (anchor) {
        cards.push({ label: pendingLabel, link: anchor });
        pendingLabel = null;
        return;
      }
      if (el.textContent.trim()) {
        // a text line before the heading (when one exists) is the eyebrow
        if (headingPresent && !seenHead && !eyebrow) {
          eyebrow = el;
        } else {
          pendingLabel = el;
        }
      }
    });
  } else {
    rows.forEach((row) => {
      const parts = flatten(row);
      if (parts.length === 1 && parts[0].tagName.toLowerCase() === 'h2') {
        [heading] = parts;
        return;
      }
      const link = parts.map(asAnchor).find(Boolean);
      if (!link) return;
      const label = parts.find((p) => !asAnchor(p) && p.textContent.trim());
      cards.push({ label, link });
    });
  }

  const container = document.createElement('div');
  container.className = 'container';

  if (eyebrow || heading) {
    const head = document.createElement('div');
    head.className = 'section-head';
    if (eyebrow) {
      const eb = document.createElement('p');
      eb.className = 'eyebrow';
      eb.innerHTML = eyebrow.innerHTML;
      head.append(eb);
    }
    if (heading) {
      const h = document.createElement('h2');
      h.innerHTML = heading.innerHTML;
      head.append(h);
    }
    container.append(head);
  }

  const grid = document.createElement('div');
  grid.className = 'related-grid';

  cards.forEach(({ label, link }) => {
    const card = document.createElement('a');
    card.className = 'related-card';
    card.href = link.getAttribute('href') || '#';

    const body = document.createElement('div');
    body.className = 'related-card-body';
    if (label) {
      const span = document.createElement('span');
      span.className = 'related-specialty';
      span.innerHTML = label.innerHTML;
      body.append(span);
    }
    const h3 = document.createElement('h3');
    h3.textContent = link.textContent.trim();
    body.append(h3);

    const chev = document.createElement('span');
    chev.className = 'chevron';
    chev.setAttribute('aria-hidden', 'true');
    chev.innerHTML = CHEVRON;

    card.append(body, chev);
    grid.append(card);
  });

  container.append(grid);
  block.replaceChildren(container);
}
