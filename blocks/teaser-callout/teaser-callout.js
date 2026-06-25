/**
 * teaser-callout block
 * A related-content band: a copy column (eyebrow + heading + paragraph +
 * primary CTA) beside a media column.
 *
 * Authoring (flattened cell or one-row): an optional eyebrow line, a heading,
 * a paragraph, a plain <a> CTA, and an image (absolute URL). The CTA gets the
 * btn btn--primary class. If no image is authored, a neutral placeholder
 * renders (author drops the image later).
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

function asAnchor(el) {
  return el.tagName.toLowerCase() === 'a' ? el : el.querySelector('a');
}

export default async function decorate(block) {
  const nodes = collectNodes(block);

  const media = nodes.find((n) => isMedia(n));
  const heading = nodes.find((n) => isHeading(n));
  const ctaNode = nodes.find((n) => asAnchor(n) && !isMedia(n));
  const headingIndex = nodes.indexOf(heading);
  const paras = nodes.filter((n) => n !== media && n !== heading && n !== ctaNode
    && !isMedia(n) && n.textContent.trim());

  const container = document.createElement('div');
  container.className = 'container';

  const inner = document.createElement('div');
  inner.className = 'teaser-callout-inner';

  const copy = document.createElement('div');
  copy.className = 'teaser-callout-copy';

  // eyebrow = a text line before the heading
  const eyebrow = paras.find((p) => heading && nodes.indexOf(p) < headingIndex);
  if (eyebrow) {
    const eb = document.createElement('p');
    eb.className = 'eyebrow';
    eb.innerHTML = eyebrow.innerHTML;
    copy.append(eb);
  }

  if (heading) {
    const h = document.createElement('h2');
    h.innerHTML = heading.innerHTML;
    copy.append(h);
  }

  paras.forEach((p) => {
    if (p === eyebrow) return;
    const para = document.createElement('p');
    para.innerHTML = p.innerHTML;
    copy.append(para);
  });

  if (ctaNode) {
    const a = asAnchor(ctaNode);
    const btn = document.createElement('a');
    btn.className = 'btn btn--primary';
    btn.href = a.getAttribute('href') || '#';
    btn.innerHTML = a.innerHTML;
    copy.append(btn);
  }

  const mediaWrap = document.createElement('div');
  mediaWrap.className = 'teaser-callout-media';
  if (media) {
    const pic = media.matches('picture, img') ? media : media.querySelector('picture, img');
    mediaWrap.append(pic);
  } else {
    const ph = document.createElement('div');
    ph.className = 'placeholder-media';
    mediaWrap.append(ph);
  }

  inner.append(copy, mediaWrap);
  container.append(inner);
  block.replaceChildren(container);
}
