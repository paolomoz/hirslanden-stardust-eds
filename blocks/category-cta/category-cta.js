/**
 * category-cta block
 * A full-width accent band: a heading plus a row of white "on-blue" link buttons
 * that navigate to event categories.
 *
 * Authoring (flat content, classified by content not index):
 *   - a heading (or first text line) → the band heading (H2)
 *   - one or more plain <a href>Label</a> → buttons (the block adds btn--onblue)
 */

const isHeading = (el) => /^h[1-6]$/.test(el.tagName.toLowerCase());
const anchorOf = (el) => (el.tagName.toLowerCase() === 'a' ? el : el.querySelector('a'));

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

  let heading = null;
  const links = [];
  nodes.forEach((node) => {
    const a = anchorOf(node);
    if (a) {
      [...(node.tagName.toLowerCase() === 'a' ? [node] : node.querySelectorAll('a'))]
        .forEach((src) => links.push(src));
      return;
    }
    if (!heading && (isHeading(node) || node.textContent.trim())) heading = node;
  });

  if (heading) {
    const h2 = document.createElement('h2');
    h2.innerHTML = heading.innerHTML;
    container.append(h2);
  }

  if (links.length) {
    const wrap = document.createElement('div');
    wrap.className = 'band-links';
    links.forEach((src) => {
      const a = src.cloneNode(true);
      a.className = 'btn btn--onblue';
      wrap.append(a);
    });
    container.append(wrap);
  }

  block.replaceChildren(container);
}
