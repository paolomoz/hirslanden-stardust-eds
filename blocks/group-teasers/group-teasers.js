/**
 * group-teasers block
 * A grid of teaser cards. Each card: media (or a neutral flat placeholder when
 * the prototype used a label-only tile), a title, body copy and a "Mehr
 * erfahren" read-more link.
 *
 * Authoring shapes (both supported):
 *   - one ROW per card: each row's cells hold media, title, copy and a link
 *     (in any order — classified by content).
 *   - a flattened single cell with a leading optional <h2> section title, then
 *     repeating groups segmented by each card's media/title.
 *
 * An optional leading <h2> (authored as default content before the block or as
 * the first cell) becomes the section heading.
 */

const isMedia = (el) => el.matches('picture, img') || el.querySelector('picture, img');
const isHeading = (el) => /^h[1-6]$/.test(el.tagName.toLowerCase());

/**
 * Build the list of card "parts" rows. Returns { heading, cards } where each
 * card is a flat list of its element parts.
 * @param {Element} block
 */
function readCards(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  let heading = null;
  const cards = [];

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

  // A single flattened cell: split into cards by media boundaries.
  if (rows.length === 1) {
    const parts = flatten(rows[0]);
    let current = null;
    parts.forEach((el) => {
      if (isHeading(el) && !current && cards.length === 0 && !heading) {
        heading = el;
        return;
      }
      if (isMedia(el)) {
        current = [el];
        cards.push(current);
        return;
      }
      if (!current) {
        // copy/title before any media → start an image-less card
        current = [];
        cards.push(current);
      }
      current.push(el);
    });
    return { heading, cards };
  }

  // One row per card (a lone heading row is the section title).
  rows.forEach((row) => {
    const parts = flatten(row);
    if (parts.length === 1 && isHeading(parts[0])) {
      [heading] = parts;
      return;
    }
    if (parts.length) cards.push(parts);
  });
  return { heading, cards };
}

export default async function decorate(block) {
  const { heading, cards } = readCards(block);

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
  grid.className = 'teaser-grid';

  cards.forEach((parts) => {
    const card = document.createElement('article');
    card.className = 'teaser-card';

    const media = parts.find((p) => isMedia(p));
    const title = parts.find((p) => isHeading(p));
    const links = parts.filter((p) => {
      const a = p.tagName.toLowerCase() === 'a' ? p : p.querySelector('a');
      return a && !isMedia(p);
    });
    const copy = parts.filter((p) => p !== media && p !== title && !links.includes(p)
      && p.textContent.trim());

    // Media or flat placeholder. The flat tile shows the title as its label.
    if (media) {
      const wrap = document.createElement('div');
      wrap.className = 'media';
      const pic = media.matches('picture, img') ? media : media.querySelector('picture, img');
      wrap.append(pic);
      card.append(wrap);
    } else {
      const flat = document.createElement('div');
      flat.className = 'media--flat';
      const span = document.createElement('span');
      span.textContent = (title || copy[0] || { textContent: '' }).textContent.trim();
      flat.append(span);
      card.append(flat);
    }

    const body = document.createElement('div');
    body.className = 'teaser-body';

    if (title) {
      const h3 = document.createElement('h3');
      h3.innerHTML = title.innerHTML;
      body.append(h3);
    }

    copy.forEach((c) => {
      const p = document.createElement('p');
      p.innerHTML = c.innerHTML;
      body.append(p);
    });

    links.forEach((l) => {
      const anchor = l.tagName.toLowerCase() === 'a' ? l : l.querySelector('a');
      const a = document.createElement('a');
      a.className = 'readmore';
      a.href = anchor.getAttribute('href') || '#';
      a.innerHTML = anchor.innerHTML;
      body.append(a);
    });

    card.append(body);
    grid.append(card);
  });

  container.append(grid);
  block.replaceChildren(container);
}
