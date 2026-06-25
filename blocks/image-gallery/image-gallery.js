/**
 * image-gallery block
 * A masonry-style editorial gallery led by an optional section heading. Each
 * tile's shape (square / portrait / landscape / wide) is inferred from the
 * image's intrinsic width/height ratio.
 *
 * Authoring: an optional heading, then a flat list of images (absolute URLs).
 */

const isHeading = (el) => /^h[1-6]$/.test(el.tagName.toLowerCase());

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

function tileClass(media) {
  const img = media.tagName.toLowerCase() === 'img' ? media : media.querySelector('img');
  const w = Number(img?.getAttribute('width')) || 1;
  const h = Number(img?.getAttribute('height')) || 1;
  const r = w / h;
  if (r >= 2) return 'gallery-item--wide';
  if (r >= 1.4) return 'gallery-item--landscape';
  if (r <= 0.85) return 'gallery-item--portrait';
  return 'gallery-item--square';
}

export default async function decorate(block) {
  const nodes = collectNodes(block);
  const heading = nodes.find((n) => isHeading(n));
  const images = [];
  nodes.forEach((n) => {
    if (n.matches('picture, img')) {
      images.push(n);
      return;
    }
    n.querySelectorAll('picture, img').forEach((m) => {
      if (m.tagName.toLowerCase() === 'img' && m.closest('picture')) return;
      images.push(m);
    });
  });

  const container = document.createElement('div');
  container.className = 'container';

  if (heading) {
    const head = document.createElement('div');
    head.className = 'section-head';
    const h = document.createElement('h2');
    h.innerHTML = heading.innerHTML;
    head.append(h);
    container.append(head);
  }

  const grid = document.createElement('div');
  grid.className = 'gallery-grid';

  images.forEach((media) => {
    const item = document.createElement('div');
    item.className = `gallery-item ${tileClass(media)}`;
    item.append(media);
    grid.append(item);
  });

  container.append(grid);
  block.replaceChildren(container);
}
