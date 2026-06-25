/**
 * editorial-hero block
 * Full-bleed photo with a white panel overlay carrying the page eyebrow, the
 * page <h1>, intro copy and an optional read-more link.
 *
 * Authoring (flattened single cell or one-row): an optional eyebrow line, the
 * heading, one or more paragraphs of copy, an optional plain <a> read-more.
 * The first image (absolute URL) becomes the full-bleed background figure.
 * If no image is authored, the figure renders as a neutral placeholder.
 */

const isMedia = (el) => el.matches('picture, img') || el.querySelector('picture, img');
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

export default async function decorate(block) {
  const nodes = collectNodes(block);

  const media = nodes.find((n) => isMedia(n));
  const heading = nodes.find((n) => isHeading(n));
  const link = nodes.find((n) => {
    const a = n.tagName.toLowerCase() === 'a' ? n : n.querySelector('a');
    return a && !isMedia(n);
  });
  const paras = nodes.filter((n) => n !== media && n !== heading && n !== link
    && !isMedia(n) && n.textContent.trim());

  // figure (full-bleed background)
  const figure = document.createElement('figure');
  figure.className = 'editorial-hero-figure';
  if (media) {
    const pic = media.matches('picture, img') ? media : media.querySelector('picture, img');
    const img = pic.tagName.toLowerCase() === 'img' ? pic : pic.querySelector('img');
    if (img && !img.getAttribute('alt')) img.setAttribute('alt', '');
    figure.append(pic);
  } else {
    const ph = document.createElement('div');
    ph.className = 'placeholder-media';
    figure.append(ph);
  }

  const container = document.createElement('div');
  container.className = 'container';

  const panel = document.createElement('div');
  panel.className = 'editorial-hero-panel';

  // The first non-heading paragraph that precedes the heading acts as eyebrow.
  let eyebrowDone = false;
  const headingIndex = nodes.indexOf(heading);

  paras.forEach((p) => {
    const original = nodes.indexOf(p);
    if (!eyebrowDone && heading && original < headingIndex) {
      const eb = document.createElement('p');
      eb.className = 'eyebrow';
      eb.innerHTML = p.innerHTML;
      panel.append(eb);
      eyebrowDone = true;
    }
  });

  if (heading) {
    const h1 = document.createElement('h1');
    h1.innerHTML = heading.innerHTML;
    panel.append(h1);
  }

  paras.forEach((p) => {
    const original = nodes.indexOf(p);
    if (heading && original < headingIndex) return; // eyebrow handled
    const para = document.createElement('p');
    para.innerHTML = p.innerHTML;
    panel.append(para);
  });

  if (link) {
    const a = link.tagName.toLowerCase() === 'a' ? link : link.querySelector('a');
    const rm = document.createElement('a');
    rm.className = 'readmore';
    rm.href = a.getAttribute('href') || '#';
    rm.innerHTML = a.innerHTML;
    panel.append(rm);
  }

  container.append(panel);
  block.replaceChildren(figure, container);
}
