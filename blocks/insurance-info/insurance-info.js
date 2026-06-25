/**
 * insurance-info block
 * A copy column (eyebrow, heading, paragraphs and a read-more link) followed by
 * a grid of insurance-class cards (each a heading + paragraph).
 *
 * Authoring shapes (both supported):
 *   - one ROW per group: the first row holds the copy block; each following row
 *     holds one class item (a heading + copy).
 *   - a flattened single cell with the copy block first, then repeating class
 *     items segmented by each item's heading.
 *
 * Classification by content, never index: leading short text before the first
 * heading → eyebrow; first heading → copy <h2>; paragraphs that follow → copy
 * paragraphs; a non-tel link in the copy region → read-more. Every subsequent
 * heading starts a class item with its following paragraph(s).
 */

const isHeading = (el) => /^h[1-6]$/.test(el.tagName.toLowerCase());
const getAnchor = (el) => (el.tagName.toLowerCase() === 'a' ? el : el.querySelector('a'));
const isTel = (a) => (a.getAttribute('href') || '').startsWith('tel:');
const isReadmoreLink = (el) => {
  const a = getAnchor(el);
  return a && !isTel(a);
};

/**
 * Flatten a row into a flat list of element parts. Bare text in a cell is
 * wrapped in a <p>.
 * @param {Element} row
 * @returns {Element[]}
 */
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

/**
 * Collect the block into a flat ordered list of parts, handling both the
 * single-flattened-cell shape and the one-row-per-group shape.
 * @param {Element} block
 * @returns {Element[]}
 */
function collectNodes(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const parts = [];
  rows.forEach((row) => parts.push(...flatten(row)));
  return parts;
}

export default async function decorate(block) {
  const parts = collectNodes(block);

  const container = document.createElement('div');
  container.className = 'container';

  const grid = document.createElement('div');
  grid.className = 'insurance-grid';

  const copy = document.createElement('div');
  copy.className = 'insurance-copy';

  let i = 0;

  // Eyebrow: leading text before the first heading.
  while (i < parts.length && !isHeading(parts[i])) {
    const el = parts[i];
    if (isReadmoreLink(el)) break;
    if (el.textContent.trim()) {
      const eyebrow = document.createElement('p');
      eyebrow.className = 'eyebrow';
      eyebrow.innerHTML = el.innerHTML;
      copy.append(eyebrow);
    }
    i += 1;
  }

  // First heading → copy <h2>.
  if (i < parts.length && isHeading(parts[i])) {
    const h2 = document.createElement('h2');
    h2.innerHTML = parts[i].innerHTML;
    copy.append(h2);
    i += 1;
  }

  // Copy paragraphs + the read-more link, up to the next heading.
  for (; i < parts.length && !isHeading(parts[i]); i += 1) {
    const el = parts[i];
    if (isReadmoreLink(el)) {
      const anchor = getAnchor(el);
      const a = document.createElement('a');
      a.className = 'readmore';
      a.href = anchor.getAttribute('href') || '#';
      a.innerHTML = anchor.innerHTML;
      copy.append(a);
    } else if (el.textContent.trim()) {
      const p = document.createElement('p');
      p.innerHTML = el.innerHTML;
      copy.append(p);
    }
  }

  grid.append(copy);

  // Remaining headings → class items, segmented by heading boundaries.
  const items = [];
  let current = null;
  for (; i < parts.length; i += 1) {
    const el = parts[i];
    if (isHeading(el)) {
      current = { title: el, copy: [] };
      items.push(current);
    } else if (current && el.textContent.trim()) {
      current.copy.push(el);
    }
  }

  if (items.length) {
    const classes = document.createElement('div');
    classes.className = 'insurance-classes';

    items.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'insurance-class-item';

      const h3 = document.createElement('h3');
      h3.innerHTML = item.title.innerHTML;
      card.append(h3);

      item.copy.forEach((c) => {
        const p = document.createElement('p');
        p.innerHTML = c.innerHTML;
        card.append(p);
      });

      classes.append(card);
    });

    grid.append(classes);
  }

  container.append(grid);
  block.replaceChildren(container);
}
