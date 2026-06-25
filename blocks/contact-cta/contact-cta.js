/**
 * contact-cta block
 * Blue band: heading + copy, phone number, and CTA buttons.
 *
 * Authoring shape (DA usually flattens to one row/one cell; both shapes supported):
 *   row 1: heading + copy paragraph(s)
 *   row 2: phone label text + a tel: link
 *   row 3: one or more plain action links
 *
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
  copy.className = 'contact-cta-copy';

  const phone = document.createElement('div');
  phone.className = 'contact-cta-phone';

  const actions = document.createElement('div');
  actions.className = 'contact-cta-actions';

  const telOf = (node) => {
    const a = node.tagName.toLowerCase() === 'a' ? node : node.querySelector('a');
    return a && (a.getAttribute('href') || '').startsWith('tel:') ? a : null;
  };

  nodes.forEach((node, i) => {
    const tag = node.tagName.toLowerCase();
    const anchor = tag === 'a' ? node : node.querySelector('a');
    const tel = telOf(node);

    // tel: link → phone number. A short text line immediately before it is its label.
    if (tel) {
      const prev = nodes[i - 1];
      if (prev && !telOf(prev) && !prev.querySelector('a')
        && !/^h[1-6]$/.test(prev.tagName.toLowerCase())
        && prev.textContent.trim() && prev.textContent.trim().length <= 24) {
        // The previous text line was already appended to copy; move it out.
        const label = document.createElement('span');
        label.className = 'phone-label';
        label.textContent = prev.textContent.trim();
        const stray = copy.querySelector('p:last-of-type');
        if (stray && stray.textContent.trim() === prev.textContent.trim()) stray.remove();
        phone.append(label);
      }
      const a = tel.cloneNode(true);
      a.className = 'phone-num';
      phone.append(a);
      return;
    }

    // other link(s) → action button(s). A wrapper (e.g. <p>) may hold several.
    if (anchor) {
      const wrappedAnchors = tag === 'a' ? [node] : [...node.querySelectorAll('a')];
      wrappedAnchors.forEach((src) => {
        const a = src.cloneNode(true);
        a.className = 'btn btn--onblue';
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
  if (phone.children.length) container.append(phone);
  if (actions.children.length) container.append(actions);

  block.replaceChildren(container);
}
