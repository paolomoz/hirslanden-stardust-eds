/**
 * body-text block
 * Constrained prose article body. One or more paragraphs (with optional inline
 * <strong>), optionally led by a heading.
 *
 * Authoring: paragraphs of copy in the content cell.
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

  const prose = document.createElement('div');
  prose.className = 'prose';

  nodes.forEach((node) => {
    const tag = node.tagName.toLowerCase();
    if (/^h[1-6]$/.test(tag)) {
      const h = document.createElement('h2');
      h.innerHTML = node.innerHTML;
      prose.append(h);
      return;
    }
    const p = document.createElement('p');
    p.innerHTML = node.innerHTML;
    if (p.textContent.trim()) prose.append(p);
  });

  container.append(prose);
  block.replaceChildren(container);
}
