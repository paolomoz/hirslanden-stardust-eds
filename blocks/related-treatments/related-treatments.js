/**
 * related-treatments block
 * Section-head + 3-up grid of related-treatment link cards (prototype
 * .td-related), followed by a centered "Alle Behandlungen A–Z" readmore link.
 *
 * Each card is a single <a class="td-related-card" href> wrapping a .rc-tag
 * span, an <h3>, and a .readmore "Mehr erfahren" span. The card's href comes
 * from the authored card link.
 *
 * Authoring (both DA-flattened single-cell and one-row-per-card shapes):
 *   - section-head: eyebrow + h2
 *   - one group per card: a tag text line + an <h3> + the card link
 *     (its href is the card href, its text is the readmore label)
 *   - a final standalone link → centered .readmore
 * Classification is content-based, never index-based.
 */

const isHeading = (el) => /^h[1-6]$/.test(el.tagName.toLowerCase());
const anchorOf = (node) => (node.tagName.toLowerCase() === 'a' ? node : node.querySelector('a'));

/**
 * Collect element children of a cell, wrapping bare text in <p>.
 * @param {Element} cell
 * @returns {Element[]}
 */
function cellParts(cell) {
  const parts = [];
  const kids = [...cell.children];
  if (kids.length === 0) {
    const text = cell.textContent.trim();
    if (text) {
      const p = document.createElement('p');
      p.innerHTML = cell.innerHTML;
      parts.push(p);
    }
    return parts;
  }
  kids.forEach((el) => parts.push(el));
  return parts;
}

/**
 * Flatten the block into an ordered parts list.
 * @param {Element} block
 * @returns {Element[]}
 */
function flatten(block) {
  const all = [];
  block.querySelectorAll(':scope > div').forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    (cells.length ? cells : [row]).forEach((cell) => {
      cellParts(cell).forEach((p) => all.push(p));
    });
  });
  return all;
}

export default async function decorate(block) {
  const all = flatten(block);

  const container = document.createElement('div');
  container.className = 'container';

  // Section head: first heading + a preceding eyebrow line.
  const headings = all.filter(isHeading);
  const sectionHeading = headings[0] || null;
  const sectionIdx = sectionHeading ? all.indexOf(sectionHeading) : -1;

  const head = document.createElement('div');
  head.className = 'section-head';
  let cardStart = 0;
  if (sectionHeading) {
    for (let i = 0; i < sectionIdx; i += 1) {
      const node = all[i];
      if (!isHeading(node) && !anchorOf(node) && node.textContent.trim()) {
        const p = document.createElement('p');
        p.className = 'eyebrow';
        p.innerHTML = node.innerHTML;
        head.append(p);
        break;
      }
    }
    const h2 = document.createElement('h2');
    h2.innerHTML = sectionHeading.innerHTML;
    head.append(h2);
    cardStart = sectionIdx + 1;
  }
  if (head.children.length) container.append(head);

  // Card region (everything after the section heading).
  const region = all.slice(cardStart);

  // Trailing standalone link → centered readmore (a lone link after the last
  // card link).
  let footLink = null;
  if (region.length) {
    const last = region[region.length - 1];
    const prev = region[region.length - 2];
    if (anchorOf(last) && !isHeading(last) && prev && anchorOf(prev)) {
      footLink = region.pop();
    }
  }

  // Segment cards: each card is a heading; the tag is the text line before it
  // and the link is the anchor after it.
  const grid = document.createElement('div');
  grid.className = 'td-related-grid';

  const headingIdxs = region
    .map((node, i) => (isHeading(node) ? i : -1))
    .filter((i) => i !== -1);

  headingIdxs.forEach((hIdx, n) => {
    const headingNode = region[hIdx];
    const segStart = n === 0 ? 0 : headingIdxs[n - 1] + 1;
    const segEnd = n + 1 < headingIdxs.length ? headingIdxs[n + 1] : region.length;

    const before = region.slice(segStart, hIdx);
    const after = region.slice(hIdx + 1, segEnd);

    const tagNode = before.find((p) => !anchorOf(p) && p.textContent.trim());
    const linkNode = after.find((p) => anchorOf(p)) || before.find((p) => anchorOf(p));
    const src = linkNode ? anchorOf(linkNode) : null;

    const a = document.createElement('a');
    a.className = 'td-related-card';
    a.href = src ? (src.getAttribute('href') || '#') : '#';

    if (tagNode) {
      const tag = document.createElement('span');
      tag.className = 'rc-tag';
      tag.innerHTML = tagNode.innerHTML;
      a.append(tag);
    }

    const h3 = document.createElement('h3');
    h3.innerHTML = headingNode.innerHTML;
    a.append(h3);

    const more = document.createElement('span');
    more.className = 'readmore';
    more.textContent = (src && src.textContent.trim()) || 'Mehr erfahren';
    a.append(more);

    grid.append(a);
  });

  container.append(grid);

  // Trailing centered readmore.
  if (footLink) {
    const src = anchorOf(footLink);
    const foot = document.createElement('div');
    foot.className = 'td-related-foot';
    const a = document.createElement('a');
    a.className = 'readmore';
    a.href = src.getAttribute('href') || '#';
    a.innerHTML = src.innerHTML;
    foot.append(a);
    container.append(foot);
  }

  block.replaceChildren(container);
}
