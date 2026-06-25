/**
 * image-grid block
 * A 3-column editorial image series. Images are distributed across three
 * columns and given alternating portrait/landscape aspect ratios for an
 * editorial rhythm. Aspect ratio is inferred from each image's intrinsic
 * width/height (taller-than-wide → portrait, otherwise landscape).
 *
 * Authoring: a flat list of images (absolute URLs), in reading order. They are
 * laid out column-major across three columns.
 */

const COLS = 3;

function collectImages(block) {
  const imgs = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    cell.querySelectorAll('picture, img').forEach((m) => {
      // avoid double-counting an <img> inside a counted <picture>
      if (m.tagName.toLowerCase() === 'img' && m.closest('picture')) return;
      imgs.push(m);
    });
  });
  return imgs;
}

function orientation(media) {
  const img = media.tagName.toLowerCase() === 'img' ? media : media.querySelector('img');
  const w = Number(img?.getAttribute('width')) || 0;
  const h = Number(img?.getAttribute('height')) || 0;
  return h > w ? 'portrait' : 'landscape';
}

export default async function decorate(block) {
  const images = collectImages(block);

  const container = document.createElement('div');
  container.className = 'container';

  const cols = document.createElement('div');
  cols.className = 'image-grid-cols';

  const columns = Array.from({ length: COLS }, () => {
    const col = document.createElement('div');
    col.className = 'image-grid-col';
    return col;
  });

  images.forEach((media, i) => {
    const wrap = document.createElement('div');
    wrap.className = `img-wrap img-wrap--${orientation(media)}`;
    wrap.append(media);
    columns[i % COLS].append(wrap);
  });

  columns.forEach((col) => cols.append(col));
  container.append(cols);
  block.replaceChildren(container);
}
