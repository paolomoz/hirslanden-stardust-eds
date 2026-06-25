/**
 * treatment-hero block
 * Treatment-detail page hero (prototype .td-hero). Holds the page's only <h1>.
 *
 * Layout: a copy column (eyebrow, H1, lead paragraph, and an optional
 * "Medizinisch geprüft" trust row of a small portrait + label + doctor link)
 * and a right-column back link with a prepended chevron-left SVG.
 *
 * Authoring (both DA-flattened single-cell and one-row-per-part shapes):
 *   - an eyebrow line, a heading (→ h1), a lead paragraph
 *   - a "back" link whose text is a section name (e.g. "Behandlungen")
 *   - optionally: a small image + a short "Medizinisch geprüft" label + a
 *     doctor link → the trust row
 * Classification is content-based, never index-based.
 */

const isMedia = (el) => el.matches('picture, img') || el.querySelector('picture, img');
const isHeading = (el) => /^h[1-6]$/.test(el.tagName.toLowerCase());

/**
 * Collect element children of every cell in the block.
 * Wraps bare text nodes in <p>. Returns a flat list of elements.
 * @param {Element} block
 * @returns {Element[]}
 */
function collectNodes(block) {
  const nodes = [];
  const cells = block.querySelectorAll(':scope > div > div');
  const list = cells.length ? [...cells] : [...block.querySelectorAll(':scope > div')];
  list.forEach((cell) => {
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

const anchorOf = (node) => (node.tagName.toLowerCase() === 'a' ? node : node.querySelector('a'));

function chevronLeft() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '16');
  svg.setAttribute('height', '16');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('aria-hidden', 'true');
  const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  poly.setAttribute('points', '15 18 9 12 15 6');
  svg.append(poly);
  return svg;
}

export default async function decorate(block) {
  const nodes = collectNodes(block);

  const container = document.createElement('div');
  container.className = 'container';

  const copy = document.createElement('div');
  copy.className = 'td-hero-copy';

  const trustImg = nodes.find((n) => isMedia(n));
  const links = nodes.filter((n) => anchorOf(n) && !isMedia(n));
  // The back link's text is a short section name; the doctor (trust) link is
  // the link adjacent to the trust image/label. Distinguish: the back link is
  // the last link when there is trust data, else the only link.
  let backLinkNode = null;
  let doctorLinkNode = null;
  if (trustImg && links.length >= 2) {
    backLinkNode = links[links.length - 1];
    [doctorLinkNode] = links;
  } else if (links.length) {
    [backLinkNode] = links;
  }

  // The trust label is a short text line near the trust image (not eyebrow,
  // not heading, not lead). We pick the shortest non-heading text line that is
  // not the lead — but only when trust data exists.
  let eyebrow = null;
  let heading = null;
  const paragraphs = [];
  nodes.forEach((node) => {
    if (node === trustImg || node === backLinkNode || node === doctorLinkNode) return;
    if (isHeading(node)) {
      heading = node;
      return;
    }
    if (anchorOf(node)) return;
    const text = node.textContent.trim();
    if (!text) return;
    if (!eyebrow && node.classList.contains('eyebrow')) {
      eyebrow = node;
      return;
    }
    paragraphs.push(node);
  });
  // If no explicit eyebrow class, the first short line before the heading is it.
  if (!eyebrow && paragraphs.length) {
    const first = paragraphs[0];
    if (first.textContent.trim().length <= 48) {
      eyebrow = paragraphs.shift();
    }
  }

  // Trust label: when trust data exists, the shortest remaining paragraph.
  let trustLabel = null;
  if (trustImg && doctorLinkNode && paragraphs.length > 1) {
    const sorted = [...paragraphs].sort(
      (a, b) => a.textContent.trim().length - b.textContent.trim().length,
    );
    [trustLabel] = sorted;
  }

  if (eyebrow) {
    const p = document.createElement('p');
    p.className = 'eyebrow';
    p.innerHTML = eyebrow.innerHTML;
    copy.append(p);
  }

  if (heading) {
    const h1 = document.createElement('h1');
    h1.innerHTML = heading.innerHTML;
    copy.append(h1);
  }

  paragraphs.forEach((node) => {
    if (node === trustLabel) return;
    const p = document.createElement('p');
    p.className = 'lead';
    p.innerHTML = node.innerHTML;
    copy.append(p);
  });

  // Trust row.
  if (trustImg && doctorLinkNode) {
    const trust = document.createElement('div');
    trust.className = 'td-trust';
    trust.setAttribute('aria-label', 'Medizinisch geprüft');

    const imgWrap = document.createElement('div');
    imgWrap.className = 'td-trust-img';
    const pic = isMedia(trustImg) && trustImg.matches('picture, img')
      ? trustImg : trustImg.querySelector('picture, img');
    imgWrap.append(pic);
    trust.append(imgWrap);

    const meta = document.createElement('div');
    meta.className = 'td-trust-meta';
    const label = document.createElement('span');
    label.className = 'td-trust-label';
    label.textContent = trustLabel ? trustLabel.textContent.trim() : 'Medizinisch geprüft';
    meta.append(label);

    const docAnchor = anchorOf(doctorLinkNode);
    const name = document.createElement('a');
    name.className = 'td-trust-name';
    name.href = docAnchor.getAttribute('href') || '#';
    name.innerHTML = docAnchor.innerHTML;
    meta.append(name);
    trust.append(meta);
    copy.append(trust);
  }

  container.append(copy);

  // Back link.
  if (backLinkNode) {
    const src = anchorOf(backLinkNode);
    const back = document.createElement('a');
    back.className = 'td-hero-back';
    back.href = src.getAttribute('href') || '#';
    back.append(chevronLeft());
    back.append(document.createTextNode(` ${src.textContent.trim()}`));
    container.append(back);
  }

  block.replaceChildren(container);
}
