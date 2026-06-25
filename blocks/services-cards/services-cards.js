/**
 * services-cards block
 * A grid of link cards preceded by a section heading. Each card is a single
 * <a class="service-card"> wrapping a media tile, a title (<h3>), a description
 * and a read-more label.
 *
 * Authoring shapes (both supported):
 *   - one ROW per group: the first row holds the section head (an eyebrow text
 *     line + a heading); each following row holds one card (image, title, copy
 *     and a link whose href is the card destination and whose text is the
 *     read-more label).
 *   - a flattened single cell with a leading eyebrow + heading (section head),
 *     then repeating card groups segmented by each card's media/heading.
 *
 * Parts are classified by content, never by index. A card with no image gets a
 * neutral placeholder media tile.
 */

const isMedia = (el) => el.matches('picture, img') || !!el.querySelector('picture, img');
const isHeading = (el) => /^h[1-6]$/.test(el.tagName.toLowerCase());
const getAnchor = (el) => (el.tagName.toLowerCase() === 'a' ? el : el.querySelector('a'));
const isLink = (el) => !isMedia(el) && !!getAnchor(el);

/**
 * Flatten a row into a flat list of element parts. Bare text in a cell is
 * wrapped in a <p>.
 * @param {Element} row
 * @returns {Element[]}
 */
function flatten(row) {
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
}

/**
 * Collect the block into a flat ordered list of parts, handling both the
 * single-flattened-cell shape and the one-row-per-group shape.
 * @param {Element} block
 * @returns {Element[]}
 */
function collectNodes(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const parts = [];
  rows.forEach((row) => parts.push(...flatten(row)));
  return parts;
}

export default async function decorate(block) {
  const parts = collectNodes(block);

  const container = document.createElement('div');
  container.className = 'container';

  // Section head: leading eyebrow (short text before first heading) + heading.
  const head = document.createElement('div');
  head.className = 'section-head';
  let i = 0;
  let sawHeading = false;
  while (i < parts.length) {
    const el = parts[i];
    if (isHeading(el)) {
      const h2 = document.createElement('h2');
      h2.innerHTML = el.innerHTML;
      head.append(h2);
      i += 1;
      sawHeading = true;
      break;
    }
    if (el.textContent.trim()) {
      const eyebrow = document.createElement('p');
      eyebrow.className = 'eyebrow';
      eyebrow.innerHTML = el.innerHTML;
      head.append(eyebrow);
    }
    i += 1;
  }
  if (sawHeading) container.append(head);

  // Remaining parts → cards. A new card starts at a media or a heading that
  // follows a completed card.
  const cards = [];
  let current = null;
  for (; i < parts.length; i += 1) {
    const el = parts[i];
    if (isMedia(el)) {
      current = {
        media: el, title: null, copy: [], link: null,
      };
      cards.push(current);
    } else if (isHeading(el)) {
      if (!current || current.title) {
        current = {
          media: null, title: el, copy: [], link: null,
        };
        cards.push(current);
      } else {
        current.title = el;
      }
    } else if (isLink(el)) {
      if (!current) {
        current = {
          media: null, title: null, copy: [], link: el,
        };
        cards.push(current);
      } else {
        current.link = el;
      }
    } else if (current && el.textContent.trim()) {
      current.copy.push(el);
    }
  }

  const grid = document.createElement('div');
  grid.className = 'services-grid';

  cards.forEach((card) => {
    const anchor = card.link ? getAnchor(card.link) : null;
    const link = document.createElement('a');
    link.className = 'service-card';
    link.href = anchor ? anchor.getAttribute('href') || '#' : '#';

    const media = document.createElement('div');
    media.className = 'service-card-media';
    if (card.media) {
      const pic = card.media.matches('picture, img')
        ? card.media
        : card.media.querySelector('picture, img');
      media.append(pic);
    }
    link.append(media);

    const body = document.createElement('div');
    body.className = 'service-card-body';

    if (card.title) {
      const h3 = document.createElement('h3');
      h3.className = 'service-card-title';
      h3.innerHTML = card.title.innerHTML;
      body.append(h3);
    }

    card.copy.forEach((c) => {
      const p = document.createElement('p');
      p.className = 'service-card-text';
      p.innerHTML = c.innerHTML;
      body.append(p);
    });

    if (anchor) {
      const readmore = document.createElement('span');
      readmore.className = 'readmore';
      readmore.innerHTML = anchor.innerHTML;
      body.append(readmore);
    }

    link.append(body);
    grid.append(link);
  });

  container.append(grid);
  block.replaceChildren(container);
}
