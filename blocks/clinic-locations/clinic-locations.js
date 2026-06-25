/**
 * clinic-locations block
 * A section-head (eyebrow + h2 + intro) followed by a grid of clinic cards,
 * then an optional Switzerland map image with a caption.
 *
 * Authoring shape (segmented like group-teasers; both shapes supported):
 *   - a leading section-head: short eyebrow, a heading, an intro paragraph.
 *   - one group per clinic: a short city line, a heading, an address line, a
 *     read-more link, plus an optional image. Cards without an image get a
 *     neutral placeholder tile labelled with the clinic name.
 *   - an OPTIONAL final image (the Switzerland map) followed by its caption
 *     paragraph, rendered below the grid in a bordered wrapper.
 *
 * Classification is content-based, never index-based.
 */

const isMedia = (el) => el.matches('picture, img') || el.querySelector('picture, img');
const isHeading = (el) => /^h[1-6]$/.test(el.tagName.toLowerCase());
const anchorOf = (el) => (el.tagName.toLowerCase() === 'a' ? el : el.querySelector('a'));
const pictureOf = (el) => (el.matches('picture, img') ? el : el.querySelector('picture, img'));

/**
 * Collect element children of every cell in the block. Each row may be a card
 * (multi-cell) or a flattened single cell. Returns the flat node list when a
 * single cell, else an array of per-row part lists.
 * @param {Element} block
 */
function readRows(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const flatten = (row) => {
    const parts = [];
    const cells = [...row.querySelectorAll(':scope > div')];
    (cells.length ? cells : [row]).forEach((cell) => {
      const kids = [...cell.children];
      if (kids.length === 0) {
        const text = cell.textContent.trim();
        if (text) {
          const p = document.createElement('p');
          p.innerHTML = cell.innerHTML;
          parts.push(p);
        }
        return;
      }
      kids.forEach((el) => parts.push(el));
    });
    return parts;
  };

  if (rows.length === 1) {
    return { flat: flatten(rows[0]), rowParts: null };
  }
  return { flat: null, rowParts: rows.map(flatten) };
}

/**
 * Split a flat node list into a head segment and one segment per clinic.
 * Each clinic starts at a heading; nodes before the first heading after the
 * section head form the section head. The trailing map image+caption is split
 * off separately.
 * @param {Element[]} flat
 */
function segmentFlat(flat) {
  // The section head = leading nodes up to and including the first heading and
  // its following intro paragraphs (before the next heading).
  const segments = [];
  let current = null;
  flat.forEach((node) => {
    if (isHeading(node)) {
      current = [node];
      segments.push(current);
    } else if (current) {
      current.push(node);
    } else {
      // pre-heading eyebrow → attach to the first (head) segment lazily
      current = [node];
      segments.push(current);
    }
  });
  return segments;
}

/**
 * Build a clinic card from its parts.
 * @param {Element[]} parts
 */
function buildCard(parts) {
  const card = document.createElement('div');
  card.className = 'clinic-card';

  const media = parts.find(isMedia);
  const heading = parts.find(isHeading);
  const linkNode = parts.find((p) => !isMedia(p) && anchorOf(p));
  const texts = parts.filter((p) => p !== media && p !== heading && p !== linkNode
    && p.textContent.trim());
  // City = the short text line; address = the remaining text line(s).
  const city = texts.find((p) => p.textContent.trim().length <= 28);
  const address = texts.filter((p) => p !== city);

  const mediaWrap = document.createElement('div');
  mediaWrap.className = 'media';
  if (media) {
    mediaWrap.append(pictureOf(media));
  } else {
    mediaWrap.classList.remove('media');
    const tile = document.createElement('div');
    tile.className = 'placeholder-media';
    tile.textContent = (heading || city || { textContent: '' }).textContent.trim();
    card.append(tile);
  }
  if (media) card.append(mediaWrap);

  const body = document.createElement('div');
  body.className = 'clinic-card-body';

  if (city) {
    const span = document.createElement('span');
    span.className = 'clinic-card-city';
    span.innerHTML = city.innerHTML;
    body.append(span);
  }
  if (heading) {
    const h3 = document.createElement('h3');
    h3.innerHTML = heading.innerHTML;
    body.append(h3);
  }
  address.forEach((p) => {
    const para = document.createElement('p');
    para.className = 'clinic-card-address';
    para.innerHTML = p.innerHTML;
    body.append(para);
  });
  if (linkNode) {
    const src = anchorOf(linkNode);
    const a = document.createElement('a');
    a.className = 'readmore';
    a.href = src.getAttribute('href') || '#';
    a.innerHTML = src.innerHTML;
    body.append(a);
  }

  card.append(body);
  return card;
}

export default async function decorate(block) {
  const { flat, rowParts } = readRows(block);

  const container = document.createElement('div');
  container.className = 'container';

  let head = null;
  let cardPartsList = [];
  let mapImg = null;
  let mapCaption = null;

  if (flat) {
    const segments = segmentFlat(flat);
    // First segment with a heading is the section head; preceding eyebrow-only
    // segment is merged into it.
    let headSeg = null;
    const clinicSegs = [];
    segments.forEach((seg) => {
      if (!headSeg && seg.some(isHeading)) {
        headSeg = seg;
      } else if (!headSeg) {
        headSeg = seg; // leading eyebrow before first heading
      } else {
        clinicSegs.push(seg);
      }
    });
    head = headSeg;

    // The trailing segment that is image + caption (no heading, has media) is
    // the Switzerland map.
    const last = clinicSegs[clinicSegs.length - 1];
    if (last && !last.some(isHeading) && last.some(isMedia)) {
      mapImg = last.find(isMedia);
      mapCaption = last.find((n) => !isMedia(n) && n.textContent.trim());
      clinicSegs.pop();
    }
    cardPartsList = clinicSegs;
  } else {
    // One row per part. The first heading-bearing row(s) before card rows form
    // the head; a trailing image-only row is the map.
    const headParts = [];
    rowParts.forEach((parts) => {
      const hasHeading = parts.some(isHeading);
      const hasMedia = parts.some(isMedia);
      if (parts.some((p) => anchorOf(p) && !isMedia(p))) {
        cardPartsList.push(parts);
      } else if (hasMedia && !hasHeading && cardPartsList.length) {
        mapImg = parts.find(isMedia);
        mapCaption = parts.find((n) => !isMedia(n) && n.textContent.trim());
      } else {
        headParts.push(...parts);
      }
    });
    head = headParts;
  }

  // Render the section head.
  if (head && head.length) {
    const headEl = document.createElement('div');
    headEl.className = 'section-head';
    let seenHeading = false;
    head.forEach((node) => {
      if (isHeading(node)) {
        const h2 = document.createElement('h2');
        h2.innerHTML = node.innerHTML;
        headEl.append(h2);
        seenHeading = true;
      } else if (!seenHeading && node.textContent.trim()
        && node.textContent.trim().length <= 48 && !anchorOf(node)) {
        const eyebrow = document.createElement('p');
        eyebrow.className = 'eyebrow';
        eyebrow.innerHTML = node.innerHTML;
        headEl.append(eyebrow);
      } else if (node.textContent.trim()) {
        const p = document.createElement('p');
        p.innerHTML = node.innerHTML;
        headEl.append(p);
      }
    });
    container.append(headEl);
  }

  // Render the clinic grid.
  const grid = document.createElement('div');
  grid.className = 'clinic-grid';
  cardPartsList.forEach((parts) => grid.append(buildCard(parts)));
  if (cardPartsList.length) container.append(grid);

  // Render the optional Switzerland map.
  if (mapImg) {
    const map = document.createElement('div');
    map.className = 'clinic-map';
    map.append(pictureOf(mapImg));
    if (mapCaption) {
      const cap = document.createElement('p');
      cap.innerHTML = mapCaption.innerHTML;
      map.append(cap);
    }
    container.append(map);
  }

  block.replaceChildren(container);
}
