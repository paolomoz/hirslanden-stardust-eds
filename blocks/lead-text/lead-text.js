/**
 * lead-text block
 * A constrained block of larger intro prose.
 *
 * Authoring: one or more paragraphs of copy in the content cell.
 */

/**
 * Collect element children across every cell of the block.
 * Bare text cells become <p>.
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
    if (/^h[1-6]$/.test(tag)) {
      const h = document.createElement('h2');
      h.innerHTML = node.innerHTML;
      container.append(h);
      return;
    }
    const p = document.createElement('p');
    p.innerHTML = node.innerHTML;
    if (p.textContent.trim()) container.append(p);
  });

  block.replaceChildren(container);
}
