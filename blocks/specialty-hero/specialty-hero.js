/**
 * specialty-hero block
 * A full-bleed background image with an overlay panel. The panel holds an
 * eyebrow line, the page's single <h1>, a paragraph and a read-more link.
 *
 * Authoring shape (DA usually flattens to one row/one cell; both shapes supported):
 *   - an image (the full-bleed background)
 *   - an eyebrow line (short text), a heading, a paragraph, and a plain link.
 *
 * Classification is content-based, never index-based.
 */

const isMedia = (el) => el.matches('picture, img') || el.querySelector('picture, img');
const isHeading = (el) => /^h[1-6]$/.test(el.tagName.toLowerCase());

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

const anchorOf = (el) => (el.tagName.toLowerCase() === 'a' ? el : el.querySelector('a'));

export default async function decorate(block) {
  const nodes = collectNodes(block);

  const media = nodes.find((n) => isMedia(n));
  const heading = nodes.find((n) => isHeading(n));
  const link = nodes.find((n) => !isMedia(n) && anchorOf(n));
  const eyebrowNode = nodes.find((n) => n !== media && n !== heading && n !== link
    && !isHeading(n) && n.textContent.trim()
    && n.textContent.trim().length <= 60);
  const copy = nodes.filter((n) => n !== media && n !== heading && n !== link
    && n !== eyebrowNode && n.textContent.trim());

  const container = document.createElement('div');
  container.className = 'container';

  // Full-bleed background figure sits outside .container, behind the panel.
  let figure = null;
  if (media) {
    figure = document.createElement('figure');
    figure.className = 'specialty-hero-figure';
    const pic = media.matches('picture, img') ? media : media.querySelector('picture, img');
    figure.append(pic);
  }

  const panel = document.createElement('div');
  panel.className = 'specialty-hero-panel';

  if (eyebrowNode) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 'eyebrow';
    eyebrow.innerHTML = eyebrowNode.innerHTML;
    panel.append(eyebrow);
  }

  if (heading) {
    const h1 = document.createElement('h1');
    h1.innerHTML = heading.innerHTML;
    panel.append(h1);
  }

  copy.forEach((c) => {
    const p = document.createElement('p');
    p.innerHTML = c.innerHTML;
    panel.append(p);
  });

  if (link) {
    const src = anchorOf(link);
    const a = document.createElement('a');
    a.className = 'readmore';
    a.href = src.getAttribute('href') || '#';
    a.innerHTML = src.innerHTML;
    panel.append(a);
  }

  container.append(panel);

  block.replaceChildren(...(figure ? [figure] : []), container);
}
