/**
 * locate block
 * Split media section: copy column (eyebrow, heading, paragraph, CTA) beside a
 * photo. Drives "find a clinic near you".
 *
 * Authoring shape (flattened single cell or one-row-per-element; both work):
 *   - a short eyebrow line (optional)        → .eyebrow
 *   - a heading (h2/h3)                       → section heading
 *   - one or more paragraphs                  → copy
 *   - a plain <a> link                        → primary CTA (block adds btn class)
 *   - a media element (picture/img)           → side photo
 */

/**
 * Collect element children of every cell, wrapping bare-text cells in <p>.
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

const isMedia = (el) => el.matches('picture, img') || el.querySelector('picture, img');

export default async function decorate(block) {
  const nodes = collectNodes(block);

  const media = nodes.find((n) => isMedia(n));
  const heading = nodes.find((n) => /^h[1-6]$/.test(n.tagName.toLowerCase()));

  const container = document.createElement('div');
  container.className = 'container';

  const grid = document.createElement('div');
  grid.className = 'locate-grid';

  const copy = document.createElement('div');
  copy.className = 'locate-copy';

  // First non-heading, non-link, short text line acts as the eyebrow.
  let eyebrowUsed = false;

  nodes.forEach((node) => {
    if (node === media) return;
    const tag = node.tagName.toLowerCase();
    const anchor = tag === 'a' ? node : node.querySelector('a');

    if (node === heading) {
      const h = document.createElement('h2');
      h.innerHTML = node.innerHTML;
      copy.append(h);
      return;
    }

    if (anchor) {
      const a = anchor.cloneNode(true);
      a.className = 'btn btn--primary';
      a.removeAttribute('style');
      copy.append(a);
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

  const mediaWrap = document.createElement('div');
  mediaWrap.className = 'locate-media';
  if (media) {
    const pic = media.matches('picture, img') ? media : media.querySelector('picture, img');
    mediaWrap.append(pic);
  } else {
    const ph = document.createElement('div');
    ph.className = 'placeholder-media';
    ph.setAttribute('aria-hidden', 'true');
    mediaWrap.append(ph);
  }

  grid.append(copy, mediaWrap);
  container.append(grid);
  block.replaceChildren(container);
}
