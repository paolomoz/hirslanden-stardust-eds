/**
 * featured-centers block
 * Mixed two-column layout highlighting specialty centers: one large primary
 * card (left, tall) beside two stacked horizontal teasers (right). A leading
 * eyebrow + heading become the section head.
 *
 * Authoring (one ROW per center; the FIRST center renders as the large primary
 * card, the rest as horizontal teasers — classified by content):
 *   - a media element (picture/img) → card photo
 *   - the card's link               → wraps the card
 *   - an optional eyebrow/kicker line → small label above the title
 *   - a heading (h3)                → title
 *   - a paragraph                   → copy
 * A lone leading [eyebrow, heading] row becomes the section head.
 */

const isMedia = (el) => el.matches('picture, img') || el.querySelector('picture, img');
const isHeading = (el) => /^h[1-6]$/.test(el.tagName.toLowerCase());
const anchorOf = (el) => (el.tagName.toLowerCase() === 'a' ? el : el.querySelector('a'));

function readRows(block) {
  return [...block.querySelectorAll(':scope > div')].map((row) => {
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
  }).filter((p) => p.length);
}

function buildCard(parts, variant) {
  const media = parts.find(isMedia);
  const title = parts.find(isHeading);
  const link = parts.map(anchorOf).find(Boolean);
  const texts = parts.filter((p) => p !== media && p !== title
    && !anchorOf(p) && p.textContent.trim());
  // Shortest leading text line is the kicker label; the rest is copy.
  const kicker = texts[0] && texts[0].textContent.trim().length <= 28 ? texts[0] : null;
  const copy = texts.filter((t) => t !== kicker);

  const card = document.createElement('a');
  card.className = `service-card center-card center-card--${variant}`;
  card.href = link ? link.getAttribute('href') : '#';

  const mediaWrap = document.createElement('div');
  mediaWrap.className = 'service-card-media';
  if (media) {
    const pic = media.matches('picture, img') ? media : media.querySelector('picture, img');
    mediaWrap.append(pic);
  } else {
    mediaWrap.classList.add('placeholder-media');
  }
  card.append(mediaWrap);

  const body = document.createElement('div');
  body.className = 'service-card-body';
  if (kicker) {
    const k = document.createElement('p');
    k.className = 'center-kicker';
    k.innerHTML = kicker.innerHTML;
    body.append(k);
  }
  if (title) {
    const h3 = document.createElement('h3');
    h3.className = 'service-card-title';
    h3.innerHTML = title.innerHTML;
    body.append(h3);
  }
  copy.forEach((c) => {
    const p = document.createElement('p');
    p.innerHTML = c.innerHTML;
    body.append(p);
  });
  const more = document.createElement('span');
  more.className = 'readmore';
  more.textContent = 'Mehr erfahren';
  body.append(more);

  card.append(body);
  return card;
}

export default async function decorate(block) {
  const rows = readRows(block);

  const container = document.createElement('div');
  container.className = 'container';

  let cards = rows;
  const first = rows[0] || [];
  const firstHeading = first.find(isHeading);
  const firstMedia = first.find(isMedia);
  if (firstHeading && !firstMedia && first.length <= 2 && !first.some((p) => anchorOf(p))) {
    const head = document.createElement('div');
    head.className = 'section-head';
    const eyebrow = first.find((p) => p !== firstHeading && p.textContent.trim());
    if (eyebrow) {
      const e = document.createElement('p');
      e.className = 'eyebrow';
      e.innerHTML = eyebrow.innerHTML;
      head.append(e);
    }
    const h2 = document.createElement('h2');
    h2.innerHTML = firstHeading.innerHTML;
    head.append(h2);
    container.append(head);
    cards = rows.slice(1);
  }

  const grid = document.createElement('div');
  grid.className = 'center-grid';
  cards.forEach((parts, i) => {
    grid.append(buildCard(parts, i === 0 ? 'primary' : 'horizontal'));
  });

  container.append(grid);
  block.replaceChildren(container);
}
