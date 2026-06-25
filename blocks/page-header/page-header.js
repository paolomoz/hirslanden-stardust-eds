/**
 * page-header block
 * An orienting header: an optional back-link with a chevron-left icon, plus a
 * title. Rendered as <h2> by default (the page's true <h1> belongs to the hero
 * block); pass a block variant or author an <h1> only when this is the lead.
 *
 * Authoring: a back-link (plain link) followed by a heading.
 */

const BACK_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>';

/**
 * Collect element children across every cell of the block.
 * @param {Element} block
 * @returns {Element[]}
 */
function collectNodes(block) {
  const nodes = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    const kids = [...cell.children];
    if (kids.length === 0) {
      const text = cell.textContent.trim();
      if (text) {
        const p = document.createElement('p');
        p.innerHTML = cell.innerHTML;
        nodes.push(p);
      }
      return;
    }
    kids.forEach((el) => nodes.push(el));
  });
  return nodes;
}

export default async function decorate(block) {
  const nodes = collectNodes(block);

  const container = document.createElement('div');
  container.className = 'container';

  nodes.forEach((node) => {
    const tag = node.tagName.toLowerCase();
    const anchor = tag === 'a' ? node : node.querySelector('a');

    // back-link
    if (anchor) {
      const a = document.createElement('a');
      a.className = 'backlink';
      a.href = anchor.getAttribute('href') || '#';
      a.innerHTML = `${BACK_ICON}<span>${anchor.textContent.trim()}</span>`;
      container.append(a);
      return;
    }

    // heading → h2
    if (/^h[1-6]$/.test(tag)) {
      const h = document.createElement('h2');
      h.innerHTML = node.innerHTML;
      container.append(h);
      return;
    }

    // any other text becomes a heading fallback if no heading present yet
    const text = node.textContent.trim();
    if (text && !container.querySelector('h2')) {
      const h = document.createElement('h2');
      h.innerHTML = node.innerHTML;
      container.append(h);
    }
  });

  block.replaceChildren(container);
}
