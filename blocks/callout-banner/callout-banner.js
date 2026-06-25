/**
 * callout-banner block
 * A full-bleed strip: a heading + paragraph on the left, a primary button
 * on the right.
 *
 * Authoring shape (DA usually flattens to one row/one cell; both shapes supported):
 *   - a heading, a paragraph, and a plain link.
 *
 * Classification is content-based, never index-based.
 */

const isHeading = (el) => /^h[1-6]$/.test(el.tagName.toLowerCase());
const anchorOf = (el) => (el.tagName.toLowerCase() === 'a' ? el : el.querySelector('a'));

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

  const text = document.createElement('div');
  text.className = 'callout-banner-text';

  const links = [];

  nodes.forEach((node) => {
    if (anchorOf(node) && !isHeading(node)) {
      links.push(node);
      return;
    }
    if (isHeading(node)) {
      const h2 = document.createElement('h2');
      h2.innerHTML = node.innerHTML;
      text.append(h2);
      return;
    }
    if (!node.textContent.trim()) return;
    const p = document.createElement('p');
    p.innerHTML = node.innerHTML;
    text.append(p);
  });

  container.append(text);

  links.forEach((node) => {
    const src = anchorOf(node);
    const a = document.createElement('a');
    a.className = 'btn btn--primary';
    a.href = src.getAttribute('href') || '#';
    a.innerHTML = src.innerHTML;
    container.append(a);
  });

  block.replaceChildren(container);
}
