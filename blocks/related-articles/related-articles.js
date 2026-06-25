/**
 * related-articles block
 * A 3-up grid of related news cards followed by a full-width accent CTA band.
 * An optional leading eyebrow + heading opens the section. Each card has media
 * (or a neutral placeholder), a meta line (tag · date), a title, an excerpt and
 * a "read more" link.
 *
 * Authoring — one ROW per card (cells classified by content, never index):
 *   - a picture/img → card media (absolute URL inline; missing → placeholder)
 *   - a short tag line ("News"/"Medienmitteilung") → meta tag
 *   - a date line (dd.mm.yyyy) → meta date
 *   - a title link → the card title + href
 *   - a longer text line → the excerpt
 * Section head: a leading row with only a heading (+ optional eyebrow).
 * CTA band: a trailing row with a heading + copy + a single link → blue band.
 */

const DATE_RE = /^\d{1,2}\.\d{1,2}\.\d{2,4}$/;
const isMedia = (el) => el.matches('picture, img') || el.querySelector('picture, img');
const isHeading = (el) => /^h[1-6]$/.test(el.tagName.toLowerCase());
const anchorOf = (el) => (el.tagName.toLowerCase() === 'a' ? el : el.querySelector('a'));

function flatten(row) {
  const parts = [];
  const cells = [...row.querySelectorAll(':scope > div')];
  (cells.length ? cells : [row]).forEach((cell) => {
    const kids = [...cell.children];
    if (kids.length === 0) {
      const text = cell.textContent.trim();
      if (text) {
        const p = document.createElement('p');
        p.textContent = text;
        parts.push(p);
      }
      return;
    }
    kids.forEach((el) => parts.push(el));
  });
  return parts;
}

function buildCard(parts) {
  const card = document.createElement('a');
  card.className = 'related-card';

  let media = null;
  let tag = null;
  let date = null;
  let titleEl = null;
  let href = '#';
  let excerpt = null;

  parts.forEach((el) => {
    const text = el.textContent.trim();
    const link = anchorOf(el);
    if (isMedia(el)) { media = el; return; }
    if (link && !titleEl) { titleEl = el; href = link.getAttribute('href') || '#'; return; }
    if (isHeading(el) && !titleEl) { titleEl = el; return; }
    if (!date && DATE_RE.test(text)) { date = text; return; }
    if (!tag && text && text.length <= 24) { tag = text; return; }
    if (text) excerpt = text;
  });

  card.href = href;

  const mediaWrap = document.createElement('div');
  mediaWrap.className = 'card-media';
  if (media) {
    const pic = media.matches('picture, img') ? media : media.querySelector('picture, img');
    mediaWrap.append(pic);
  } else {
    const ph = document.createElement('div');
    ph.className = 'placeholder-media';
    ph.textContent = 'Bild folgt';
    if (titleEl) ph.setAttribute('aria-label', titleEl.textContent.trim());
    mediaWrap.append(ph);
  }
  card.append(mediaWrap);

  const body = document.createElement('div');
  body.className = 'card-body';
  if (tag || date) {
    const meta = document.createElement('span');
    meta.className = 'card-meta';
    if (tag) {
      const t = document.createElement('span');
      t.className = 'card-tag';
      t.textContent = tag;
      meta.append(t);
    }
    if (tag && date) {
      const sep = document.createElement('span');
      sep.setAttribute('aria-hidden', 'true');
      sep.textContent = '·';
      meta.append(sep);
    }
    if (date) {
      const d = document.createElement('span');
      d.textContent = date;
      meta.append(d);
    }
    body.append(meta);
  }
  const h3 = document.createElement('h3');
  h3.textContent = titleEl ? titleEl.textContent.trim() : '';
  body.append(h3);
  if (excerpt) {
    const p = document.createElement('p');
    p.textContent = excerpt;
    body.append(p);
  }
  const more = document.createElement('span');
  more.className = 'card-more';
  more.textContent = 'Mehr erfahren ›';
  body.append(more);
  card.append(body);
  return card;
}

export default async function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const container = document.createElement('div');
  container.className = 'container';

  let head = null;
  let ctaBand = null;
  const cardRows = [];

  rows.forEach((row) => {
    const parts = flatten(row);
    const hasMedia = parts.some(isMedia);
    const hasHeading = parts.some(isHeading);
    const links = parts.filter(anchorOf);
    const hasDate = parts.some((p) => DATE_RE.test(p.textContent.trim()));
    if (!head && hasHeading && !hasMedia && !hasDate && links.length === 0) {
      head = parts;
      return;
    }
    if (hasHeading && links.length === 1 && !hasMedia && !hasDate) {
      ctaBand = parts;
      return;
    }
    cardRows.push(parts);
  });

  if (head) {
    const sh = document.createElement('div');
    sh.className = 'section-head';
    const eyebrow = head.find((p) => !isHeading(p) && p.textContent.trim());
    const heading = head.find(isHeading);
    if (eyebrow) {
      const p = document.createElement('p');
      p.className = 'eyebrow';
      p.textContent = eyebrow.textContent.trim();
      sh.append(p);
    }
    if (heading) {
      const h2 = document.createElement('h2');
      h2.innerHTML = heading.innerHTML;
      sh.append(h2);
    }
    container.append(sh);
  }

  const grid = document.createElement('div');
  grid.className = 'related-grid';
  cardRows.forEach((parts) => grid.append(buildCard(parts)));
  container.append(grid);

  block.replaceChildren(container);

  if (ctaBand) {
    const band = document.createElement('div');
    band.className = 'news-cta-band';
    const c = document.createElement('div');
    c.className = 'container';
    const copy = document.createElement('div');
    const heading = ctaBand.find(isHeading);
    if (heading) {
      const h2 = document.createElement('h2');
      h2.innerHTML = heading.innerHTML;
      copy.append(h2);
    }
    ctaBand.filter((p) => !isHeading(p) && !anchorOf(p) && p.textContent.trim())
      .forEach((p) => {
        const para = document.createElement('p');
        para.textContent = p.textContent.trim();
        copy.append(para);
      });
    c.append(copy);
    const link = anchorOf(ctaBand.find(anchorOf));
    if (link) {
      const a = link.cloneNode(true);
      a.className = 'btn btn--onblue';
      c.append(a);
    }
    band.append(c);
    block.append(band);
  }
}
