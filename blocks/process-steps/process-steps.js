/**
 * process-steps block
 * A grid of numbered process steps preceded by a section heading.
 *
 * Each step renders an auto-generated number badge (1, 2, 3 … in document
 * order — the author does NOT write numbers), a title (<h3>) and a description.
 *
 * Authoring shapes (both supported):
 *   - one ROW per group: the first row holds the section head (an eyebrow text
 *     line + a heading); each following row holds one step (a heading + copy).
 *   - a flattened single cell with a leading eyebrow + heading (section head),
 *     then repeating groups segmented by each step's heading.
 *
 * The leading short text before the first heading becomes the eyebrow; the
 * first heading becomes the section <h2>. Subsequent headings start steps.
 */

const isHeading = (el) => /^h[1-6]$/.test(el.tagName.toLowerCase());

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

  // Section head: leading eyebrow (short text before first heading) + heading.
  const head = document.createElement('div');
  head.className = 'section-head';
  let i = 0;
  let sawHeading = false;
  while (i < parts.length) {
    const el = parts[i];
    if (isHeading(el)) {
      const h2 = document.createElement('h2');
      h2.innerHTML = el.innerHTML;
      head.append(h2);
      i += 1;
      sawHeading = true;
      break;
    }
    // Pre-heading text → eyebrow.
    if (el.textContent.trim()) {
      const eyebrow = document.createElement('p');
      eyebrow.className = 'eyebrow';
      eyebrow.innerHTML = el.innerHTML;
      head.append(eyebrow);
    }
    i += 1;
  }
  if (sawHeading) container.append(head);

  // Remaining parts → steps, segmented by heading boundaries.
  const steps = [];
  let current = null;
  for (; i < parts.length; i += 1) {
    const el = parts[i];
    if (isHeading(el)) {
      current = { title: el, copy: [] };
      steps.push(current);
    } else if (current && el.textContent.trim()) {
      current.copy.push(el);
    }
  }

  const grid = document.createElement('div');
  grid.className = 'steps-grid';

  steps.forEach((step, index) => {
    const item = document.createElement('div');
    item.className = 'step-item';

    const number = document.createElement('span');
    number.className = 'step-number';
    number.setAttribute('aria-hidden', 'true');
    number.textContent = index + 1;
    item.append(number);

    const h3 = document.createElement('h3');
    h3.innerHTML = step.title.innerHTML;
    item.append(h3);

    step.copy.forEach((c) => {
      const p = document.createElement('p');
      p.innerHTML = c.innerHTML;
      item.append(p);
    });

    grid.append(item);
  });

  container.append(grid);
  block.replaceChildren(container);
}
