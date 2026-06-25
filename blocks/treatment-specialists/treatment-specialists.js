/**
 * treatment-specialists block
 * Section-head + 3-up grid of specialist cards (prototype .td-specialists),
 * followed by a centered "Alle Spezialisten anzeigen" primary button.
 *
 * Each card: portrait media (or a square placeholder), a .td-spec-card-spec
 * specialty line, an <h3> name, a .td-spec-card-loc location line with a
 * generated map-pin SVG, and a .readmore profile link.
 *
 * Authoring (both DA-flattened single-cell and one-row-per-card shapes):
 *   - section-head: eyebrow + h2 + intro paragraph
 *   - one group per specialist: image OR placeholder, a specialty text line
 *     (BEFORE the h3), an <h3> name, a location text line (AFTER the h3),
 *     a profile link → .readmore
 *   - a final standalone link → centered .btn--primary
 * Classification is content-based, never index-based.
 */

const isMedia = (el) => el.matches('picture, img') || el.querySelector('picture, img');
const isHeading = (el) => /^h[1-6]$/.test(el.tagName.toLowerCase());
const anchorOf = (node) => (node.tagName.toLowerCase() === 'a' ? node : node.querySelector('a'));

/**
 * Collect element children of a cell, wrapping bare text in <p>.
 * @param {Element} cell
 * @returns {Element[]}
 */
function cellParts(cell) {
  const parts = [];
  const kids = [...cell.children];
  if (kids.length === 0) {
    const text = cell.textContent.trim();
    if (text) {
      const p = document.createElement('p');
      p.innerHTML = cell.innerHTML;
      parts.push(p);
    }
    return parts;
  }
  kids.forEach((el) => parts.push(el));
  return parts;
}

/**
 * Read the block into { headParts, cards, footLink }.
 * Supports a single flattened cell (split by media boundaries / heading) and
 * one-row-per-group shapes.
 * @param {Element} block
 */
function readBlock(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // Flatten everything to a single ordered parts list.
  const all = [];
  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    (cells.length ? cells : [row]).forEach((cell) => {
      cellParts(cell).forEach((p) => all.push(p));
    });
  });

  // Head: leading eyebrow + first heading + intro paragraph, all before the
  // first media OR before the first card-level grouping. We take everything up
  // to (but not including) the first media element.
  const firstMediaIdx = all.findIndex((p) => isMedia(p));
  const headEnd = firstMediaIdx === -1 ? 0 : firstMediaIdx;
  const headParts = all.slice(0, headEnd);

  // Remaining parts: cards (segmented by media) + a trailing standalone link.
  const rest = all.slice(headEnd);

  // Trailing standalone link (last element is a lone link not part of a card).
  let footLink = null;
  if (rest.length) {
    const last = rest[rest.length - 1];
    if (anchorOf(last) && !isMedia(last) && !isHeading(last)) {
      // It's a card readmore only if a heading sits between it and the prior
      // media. The foot link follows the final card's readmore, so the part
      // before it is also a link (the card's profile link). Heuristic: the
      // foot link is the SECOND consecutive trailing link.
      const prev = rest[rest.length - 2];
      if (prev && anchorOf(prev) && !isMedia(prev)) {
        footLink = rest.pop();
      }
    }
  }

  // Segment cards. A new card starts at a media element, or — when cards have
  // no media — at an <h3> once the current card already holds a heading. In the
  // latter case the immediately preceding text line (the specialty label) is
  // moved into the new card, since it precedes the next card's name.
  const cards = [];
  let current = null;
  const hasHeading = (card) => card.some((p) => isHeading(p));
  rest.forEach((p) => {
    if (isMedia(p)) {
      current = [p];
      cards.push(current);
      return;
    }
    if (isHeading(p) && current && hasHeading(current)) {
      const carry = [];
      const last = current[current.length - 1];
      if (last && !isMedia(last) && !isHeading(last) && !anchorOf(last)) {
        carry.push(current.pop());
      }
      current = [...carry, p];
      cards.push(current);
      return;
    }
    if (!current) {
      current = [];
      cards.push(current);
    }
    current.push(p);
  });

  return { headParts, cards, footLink };
}

function mapPin() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '14');
  svg.setAttribute('height', '14');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7z');
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', '12');
  circle.setAttribute('cy', '9');
  circle.setAttribute('r', '2');
  svg.append(path, circle);
  return svg;
}

export default async function decorate(block) {
  const { headParts, cards, footLink } = readBlock(block);

  const container = document.createElement('div');
  container.className = 'container';

  // Section head.
  if (headParts.length) {
    const head = document.createElement('div');
    head.className = 'section-head';
    let usedEyebrow = false;
    headParts.forEach((node) => {
      if (isHeading(node)) {
        const h2 = document.createElement('h2');
        h2.innerHTML = node.innerHTML;
        head.append(h2);
        return;
      }
      const text = node.textContent.trim();
      if (!text) return;
      const p = document.createElement('p');
      if (!usedEyebrow && (node.classList.contains('eyebrow') || !head.querySelector('h2'))) {
        p.className = 'eyebrow';
        usedEyebrow = true;
      }
      p.innerHTML = node.innerHTML;
      head.append(p);
    });
    container.append(head);
  }

  // Cards grid.
  const grid = document.createElement('div');
  grid.className = 'td-spec-grid';

  cards.forEach((parts) => {
    const card = document.createElement('article');
    card.className = 'td-spec-card';

    const media = parts.find((p) => isMedia(p));
    const title = parts.find((p) => isHeading(p));
    const link = parts.find((p) => anchorOf(p) && !isMedia(p));
    const titleIdx = title ? parts.indexOf(title) : -1;
    const texts = parts.filter((p) => p !== media && p !== title && p !== link
      && !anchorOf(p) && p.textContent.trim());
    // Specialty line is BEFORE the title; location line is AFTER.
    const specNode = texts.find((p) => parts.indexOf(p) < titleIdx);
    const locNode = texts.find((p) => parts.indexOf(p) > titleIdx);

    const mediaWrap = document.createElement('div');
    mediaWrap.className = 'td-spec-card-media';
    if (media) {
      const pic = media.matches('picture, img') ? media : media.querySelector('picture, img');
      pic.removeAttribute('style');
      mediaWrap.append(pic);
    } else {
      const ph = document.createElement('div');
      ph.className = 'placeholder-media placeholder-media--square';
      ph.setAttribute('aria-label', 'Arztporträt Placeholder');
      ph.textContent = 'Arztporträt';
      mediaWrap.append(ph);
    }
    card.append(mediaWrap);

    const body = document.createElement('div');
    body.className = 'td-spec-card-body';

    if (specNode) {
      const spec = document.createElement('span');
      spec.className = 'td-spec-card-spec';
      spec.innerHTML = specNode.innerHTML;
      body.append(spec);
    }
    if (title) {
      const h3 = document.createElement('h3');
      h3.innerHTML = title.innerHTML;
      body.append(h3);
    }
    if (locNode) {
      const loc = document.createElement('span');
      loc.className = 'td-spec-card-loc';
      loc.append(mapPin());
      loc.append(document.createTextNode(` ${locNode.textContent.trim()}`));
      body.append(loc);
    }
    if (link) {
      const src = anchorOf(link);
      const a = document.createElement('a');
      a.className = 'readmore';
      a.href = src.getAttribute('href') || '#';
      a.innerHTML = src.innerHTML;
      body.append(a);
    }

    card.append(body);
    grid.append(card);
  });

  container.append(grid);

  // Trailing centered primary button.
  if (footLink) {
    const src = anchorOf(footLink);
    const foot = document.createElement('div');
    foot.className = 'td-spec-foot';
    const a = document.createElement('a');
    a.className = 'btn btn--primary';
    a.href = src.getAttribute('href') || '#';
    a.innerHTML = src.innerHTML;
    foot.append(a);
    container.append(foot);
  }

  block.replaceChildren(container);
}
