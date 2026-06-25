/**
 * patient-hero block
 * Split-media hero: copy column (eyebrow, H1, lead, body note, CTA) + media column.
 *
 * The hero headline is the page's single <h1>.
 *
 * Authoring shape (DA usually flattens to one row/one cell; both supported):
 *   - an eyebrow line (short, before the heading) → .eyebrow
 *   - the H1 headline
 *   - a lead paragraph (the first paragraph after the heading) → .lead
 *   - one or more further paragraphs → .body-note
 *   - a plain action link → btn btn--primary
 *   - an image (absolute URL) for the media column; if no image, a placeholder
 *     tile renders instead.
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

export default async function decorate(block) {
  const nodes = collectNodes(block);

  const container = document.createElement('div');
  container.className = 'container';

  const copy = document.createElement('div');
  copy.className = 'patient-hero-copy';

  const media = document.createElement('div');
  media.className = 'patient-hero-media';

  const mediaNode = nodes.find((n) => isMedia(n));
  const headingNode = nodes.find((n) => isHeading(n));
  const headingIndex = nodes.indexOf(headingNode);

  // The short text line immediately before the heading is the eyebrow.
  let eyebrowNode = null;
  if (headingIndex > 0) {
    const candidate = nodes[headingIndex - 1];
    if (candidate && !isMedia(candidate) && !candidate.querySelector('a')
      && candidate.textContent.trim().length <= 40) {
      eyebrowNode = candidate;
    }
  }

  const textNodes = nodes.filter((n) => n !== mediaNode && !isHeading(n));

  if (eyebrowNode) {
    const p = document.createElement('p');
    p.className = 'eyebrow';
    p.innerHTML = eyebrowNode.innerHTML;
    copy.append(p);
  }

  if (headingNode) {
    const h = document.createElement('h1');
    h.innerHTML = headingNode.innerHTML;
    copy.append(h);
  }

  // Remaining text nodes after the heading: first → lead, link line → CTA, rest → body-note.
  const afterText = textNodes.filter((n) => n !== eyebrowNode);
  let leadAssigned = false;
  afterText.forEach((node) => {
    const anchor = node.tagName.toLowerCase() === 'a' ? node : node.querySelector('a');
    const href = anchor ? (anchor.getAttribute('href') || '') : '';
    const isAction = anchor && !href.startsWith('tel:') && !href.startsWith('mailto:');
    // A standalone action link (the whole node is just the link) → button.
    if (isAction && node.textContent.trim() === anchor.textContent.trim()) {
      const a = anchor.cloneNode(true);
      a.className = 'btn btn--primary';
      a.removeAttribute('style');
      copy.append(a);
      return;
    }
    const p = document.createElement('p');
    p.innerHTML = node.innerHTML;
    if (!leadAssigned) {
      p.className = 'lead';
      leadAssigned = true;
    } else {
      p.className = 'body-note';
    }
    copy.append(p);
  });

  if (mediaNode) {
    const pic = mediaNode.matches('picture, img') ? mediaNode : mediaNode.querySelector('picture, img');
    media.append(pic);
  } else {
    const placeholder = document.createElement('div');
    placeholder.className = 'placeholder-media';
    placeholder.textContent = 'Bild';
    media.append(placeholder);
  }

  container.append(copy, media);
  block.replaceChildren(container);
}
