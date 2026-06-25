/**
 * related-doctors block
 * A 3-up teaser grid of related doctors / clinics / specialties. An optional
 * leading eyebrow + heading + intro becomes the section head. Each teaser is a
 * card link with media (or a neutral placeholder), a specialty label, a title
 * and a "read more" link.
 *
 * Authoring shapes (both supported):
 *   - one ROW per teaser: cells hold an optional image, a specialty label, a
 *     title link and an optional clinic line.
 *   - a flattened single cell with an optional eyebrow + <h2> + intro head,
 *     then for each teaser: a specialty line, a title link, an optional clinic
 *     line. Cards with no authored image render a neutral placeholder tile
 *     labelled with the title (author drops images later).
 */

const isMedia = (el) => el.matches('picture, img') || el.querySelector('picture, img');
const isHeading = (el) => /^h[1-6]$/.test(el.tagName.toLowerCase());
const asAnchor = (el) => (el.tagName.toLowerCase() === 'a' ? el : el.querySelector('a'));

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

export default async function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  let eyebrow = null;
  let heading = null;
  let intro = null;
  const cards = [];

  if (rows.length === 1) {
    const parts = flatten(rows[0]);
    const headingPresent = parts.some((p) => p.tagName.toLowerCase() === 'h2');
    let seenHead = false;
    let current = null;
    parts.forEach((el) => {
      const tag = el.tagName.toLowerCase();
      if (tag === 'h2' && !heading) {
        heading = el;
        seenHead = true;
        return;
      }
      if (!seenHead && headingPresent && !asAnchor(el) && !isMedia(el)
        && el.textContent.trim() && !eyebrow) {
        eyebrow = el;
        return;
      }
      if (seenHead && !current && !asAnchor(el) && !isMedia(el)
        && el.textContent.trim() && !intro && !isHeading(el)) {
        // first text line after heading, before any card link = intro
        intro = el;
        return;
      }
      // card boundary: a title link starts a new card; media before a link
      // attaches to the new card.
      if (asAnchor(el)) {
        if (!current) { current = { parts: [] }; cards.push(current); }
        current.parts.push(el);
        // close card after its link so the next label starts fresh
        current = null;
        return;
      }
      if (!current) { current = { parts: [] }; cards.push(current); }
      current.parts.push(el);
    });
  } else {
    rows.forEach((row) => {
      const parts = flatten(row);
      if (parts.length === 1 && parts[0].tagName.toLowerCase() === 'h2') {
        [heading] = parts;
        return;
      }
      if (parts.some(asAnchor) || parts.some(isMedia)) {
        cards.push({ parts });
      }
    });
  }

  const container = document.createElement('div');
  container.className = 'container';

  if (eyebrow || heading || intro) {
    const head = document.createElement('div');
    head.className = 'section-head';
    if (eyebrow) {
      const eb = document.createElement('p');
      eb.className = 'eyebrow';
      eb.innerHTML = eyebrow.innerHTML;
      head.append(eb);
    }
    if (heading) {
      const h = document.createElement('h2');
      h.innerHTML = heading.innerHTML;
      head.append(h);
    }
    if (intro) {
      const p = document.createElement('p');
      p.innerHTML = intro.innerHTML;
      head.append(p);
    }
    container.append(head);
  }

  const grid = document.createElement('div');
  grid.className = 'doctor-teaser-grid';

  cards.forEach(({ parts }) => {
    const link = parts.map(asAnchor).find(Boolean);
    const media = parts.find((p) => isMedia(p));
    const texts = parts.filter((p) => !isMedia(p) && !asAnchor(p) && p.textContent.trim());
    const specialty = texts[0] || null;
    const clinic = texts[1] || null;

    const card = document.createElement('a');
    card.className = 'doctor-teaser';
    card.href = link ? (link.getAttribute('href') || '#') : '#';

    const mediaWrap = document.createElement('div');
    mediaWrap.className = 'doctor-teaser-media';
    if (media) {
      const pic = media.matches('picture, img') ? media : media.querySelector('picture, img');
      mediaWrap.append(pic);
    } else {
      const ph = document.createElement('div');
      ph.className = 'placeholder-media placeholder-media--portrait';
      ph.textContent = link ? link.textContent.trim() : 'Ärzteporträt';
      mediaWrap.append(ph);
    }
    card.append(mediaWrap);

    const body = document.createElement('div');
    body.className = 'doctor-teaser-body';
    if (specialty) {
      const s = document.createElement('span');
      s.className = 'doctor-teaser-specialty';
      s.innerHTML = specialty.innerHTML;
      body.append(s);
    }
    if (link) {
      const h3 = document.createElement('h3');
      h3.textContent = link.textContent.trim();
      body.append(h3);
    }
    if (clinic) {
      const c = document.createElement('p');
      c.className = 'doctor-teaser-clinic';
      c.innerHTML = clinic.innerHTML;
      body.append(c);
    }
    const rm = document.createElement('span');
    rm.className = 'readmore';
    rm.textContent = 'Mehr erfahren';
    body.append(rm);

    card.append(body);
    grid.append(card);
  });

  container.append(grid);
  block.replaceChildren(container);
}
