/**
 * appointment-cta block
 * Blue appointment band (prototype .td-cta-band): a copy column (h2 + p) and an
 * actions group of "on-blue" CTA buttons. Structurally a sibling of the shared
 * contact-cta blue band, with its own .td-* classes.
 *
 * Authoring shape (DA usually flattens to one row/one cell; both supported):
 *   - heading → <h2>
 *   - copy paragraph(s) → <p>
 *   - one or more non-tel action links → btn btn--onblue inside .td-cta-actions
 * Classification is content-based, never index-based.
 */

/**
 * Collect element children of every cell in the block.
 * Wraps bare text nodes in <p>. Returns a flat list of elements.
 * @param {Element} block
 * @returns {Element[]}
 */
function collectNodes(block) {
  const nodes = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    const elementChildren = [...cell.children];
    if (elementChildren.length === 0) {
      const text = cell.textContent.trim();
      if (text) {
        const p = document.createElement('p');
        p.textContent = text;
        nodes.push(p);
      }
      return;
    }
    elementChildren.forEach((el) => nodes.push(el));
  });
  return nodes;
}

export default async function decorate(block) {
  const nodes = collectNodes(block);

  const container = document.createElement('div');
  container.className = 'container';

  const copy = document.createElement('div');
  copy.className = 'td-cta-copy';

  const actions = document.createElement('div');
  actions.className = 'td-cta-actions';

  const telOf = (node) => {
    const a = node.tagName.toLowerCase() === 'a' ? node : node.querySelector('a');
    return a && (a.getAttribute('href') || '').startsWith('tel:') ? a : null;
  };

  nodes.forEach((node) => {
    const tag = node.tagName.toLowerCase();
    const anchor = tag === 'a' ? node : node.querySelector('a');

    // tel: links keep their semantics — append to copy untouched.
    if (telOf(node)) {
      const p = document.createElement('p');
      p.innerHTML = node.innerHTML || node.textContent;
      copy.append(p);
      return;
    }

    // other link(s) → on-blue action button(s).
    if (anchor) {
      const wrapped = tag === 'a' ? [node] : [...node.querySelectorAll('a')];
      wrapped.forEach((src) => {
        const a = src.cloneNode(true);
        a.className = 'btn btn--onblue';
        a.removeAttribute('style');
        actions.append(a);
      });
      return;
    }

    // heading
    if (/^h[1-6]$/.test(tag)) {
      const h = document.createElement('h2');
      h.innerHTML = node.innerHTML;
      copy.append(h);
      return;
    }

    // plain text → copy paragraph
    const text = node.textContent.trim();
    if (!text) return;
    const p = document.createElement('p');
    p.innerHTML = node.innerHTML || text;
    copy.append(p);
  });

  container.append(copy);
  if (actions.children.length) container.append(actions);

  block.replaceChildren(container);
}
