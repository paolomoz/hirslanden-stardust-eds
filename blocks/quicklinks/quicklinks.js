/**
 * quicklinks block
 * A grid of quick-link buttons, each a labelled link with a trailing chevron.
 *
 * Authoring: an optional heading, then one plain link per quicklink. Links may
 * sit in a single flattened cell or one-per-row; both shapes are supported.
 */

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
        p.textContent = text;
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

  // Optional section head (heading).
  const heading = nodes.find((n) => /^h[1-6]$/.test(n.tagName.toLowerCase()));
  if (heading) {
    const head = document.createElement('div');
    head.className = 'section-head';
    const h = document.createElement('h2');
    h.innerHTML = heading.innerHTML;
    head.append(h);
    container.append(head);
  }

  const grid = document.createElement('div');
  grid.className = 'quicklink-grid';

  nodes.forEach((node) => {
    const anchor = node.tagName.toLowerCase() === 'a' ? node : node.querySelector('a');
    if (!anchor) return;

    const a = document.createElement('a');
    a.className = 'quicklink';
    a.href = anchor.getAttribute('href') || '#';

    const label = document.createElement('span');
    label.innerHTML = anchor.innerHTML;

    const chevron = document.createElement('span');
    chevron.className = 'chevron';
    chevron.setAttribute('aria-hidden', 'true');
    chevron.innerHTML = '&rsaquo;';

    a.append(label, chevron);
    grid.append(a);
  });

  container.append(grid);
  block.replaceChildren(container);
}
