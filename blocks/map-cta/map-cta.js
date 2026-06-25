/**
 * map-cta block
 * Dark-blue full-width band inviting users to the interactive locations map:
 * an eyebrow + heading + copy on the left and a white "onblue" CTA on the right.
 *
 * Authoring (flattened single cell or one-row-per-element):
 *   - a short eyebrow line (optional)  → .eyebrow
 *   - a heading                        → h2
 *   - a paragraph of copy              → copy
 *   - a plain <a> link                 → CTA (block adds btn btn--onblue)
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

  const copy = document.createElement('div');
  copy.className = 'map-cta-copy';

  let cta = null;
  let eyebrowUsed = false;

  nodes.forEach((node) => {
    const tag = node.tagName.toLowerCase();
    const anchor = tag === 'a' ? node : node.querySelector('a');

    if (anchor) {
      const a = anchor.cloneNode(true);
      a.className = 'btn btn--onblue';
      a.removeAttribute('style');
      cta = a;
      return;
    }

    if (/^h[1-6]$/.test(tag)) {
      const h = document.createElement('h2');
      h.innerHTML = node.innerHTML;
      copy.append(h);
      return;
    }

    const text = node.textContent.trim();
    if (!text) return;

    if (!eyebrowUsed && !copy.querySelector('h2') && text.length <= 28) {
      const p = document.createElement('p');
      p.className = 'eyebrow';
      p.innerHTML = node.innerHTML;
      copy.append(p);
      eyebrowUsed = true;
      return;
    }

    const p = document.createElement('p');
    p.innerHTML = node.innerHTML;
    copy.append(p);
  });

  container.append(copy);
  if (cta) container.append(cta);
  block.replaceChildren(container);
}
