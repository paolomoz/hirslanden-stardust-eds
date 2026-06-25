/**
 * Related Cards block
 * Shared 3-up card grid used by doctor-profile (doctor teasers),
 * event-detail (related events with date chips), and news-article (article cards).
 *
 * Auto-detects card variant from content:
 *   - "event" variant: card has day/month chip in head + category/time meta
 *   - "doctor" variant: card has portrait image + specialty label
 *   - "article" variant: card has 16:9 image + date meta tag
 *
 * Each card authored as one row with cells:
 *   For event cards:   day | month | category | time | title | location | link-url
 *   For doctor cards:  image | specialty | name | clinic | link-url
 *   For article cards: image | tag | date | title | excerpt | link-url
 *
 * The section head (eyebrow + h2) is placed as default content outside the block
 * in the same section div and re-absorbed here.
 */

function detectVariant(cells) {
  if (!cells.length) return 'article';
  if (cells.length >= 2 && /^\d{1,2}$/.test(cells[0]?.textContent.trim())) return 'event';
  const img = cells[0]?.querySelector('img');
  if (img) return cells.length >= 3 ? 'doctor' : 'article';
  if (cells.length === 3 && !img) return 'link';
  return 'article';
}

function buildLinkCard(cells) {
  const [tagCell, titleCell, urlCell] = cells;

  const tag = tagCell?.textContent.trim() || '';
  const title = titleCell?.textContent.trim() || '';
  const href = urlCell?.querySelector('a')?.href || urlCell?.textContent.trim() || '#';

  const card = document.createElement('a');
  card.className = 'related-card related-card--link';
  card.href = href;

  const body = document.createElement('div');
  body.className = 'related-card-body';

  if (tag) {
    const tagEl = document.createElement('span');
    tagEl.className = 'related-card-specialty';
    tagEl.textContent = tag;
    body.append(tagEl);
  }

  const h3 = document.createElement('h3');
  h3.className = 'related-card-title';
  h3.textContent = title;
  body.append(h3);

  const chevron = document.createElement('span');
  chevron.className = 'related-card-more';
  chevron.setAttribute('aria-hidden', 'true');
  chevron.textContent = '›';

  card.append(body, chevron);
  return card;
}

function buildEventCard(cells) {
  const [dayCell, monCell, catCell, timeCell, titleCell, locCell, hrefCell] = cells;

  const href = hrefCell?.querySelector('a')?.href
    || titleCell?.querySelector('a')?.href
    || '#';

  const card = document.createElement('a');
  card.className = 'related-card related-card--event';
  card.href = href;

  const head = document.createElement('div');
  head.className = 'related-card-head';

  const chip = document.createElement('div');
  chip.className = 'related-date-chip';
  chip.setAttribute('aria-hidden', 'true');

  const daySpan = document.createElement('span');
  daySpan.className = 'day';
  daySpan.textContent = dayCell?.textContent.trim() || '';

  const monSpan = document.createElement('span');
  monSpan.className = 'mon';
  monSpan.textContent = monCell?.textContent.trim() || '';

  chip.append(daySpan, monSpan);

  const dateMeta = document.createElement('div');
  dateMeta.className = 'related-card-date-info';

  if (catCell) {
    const cat = document.createElement('p');
    cat.className = 'related-card-cat';
    cat.textContent = catCell.textContent.trim();
    dateMeta.append(cat);
  }
  if (timeCell) {
    const time = document.createElement('p');
    time.className = 'related-card-time';
    time.textContent = timeCell.textContent.trim();
    dateMeta.append(time);
  }

  head.append(chip, dateMeta);

  const body = document.createElement('div');
  body.className = 'related-card-body';

  if (titleCell) {
    const h3 = document.createElement('h3');
    h3.className = 'related-card-title';
    h3.textContent = titleCell.textContent.trim();
    body.append(h3);
  }

  if (locCell) {
    const loc = document.createElement('p');
    loc.className = 'related-card-loc';
    loc.textContent = locCell.textContent.trim();
    body.append(loc);
  }

  card.append(head, body);
  return card;
}

function buildDoctorCard(cells) {
  const [imgCell, specCell, nameCell, clinicCell, hrefCell] = cells;

  const href = hrefCell?.querySelector('a')?.href
    || nameCell?.querySelector('a')?.href
    || imgCell?.querySelector('a')?.href
    || '#';

  const card = document.createElement('a');
  card.className = 'related-card related-card--doctor';
  card.href = href;

  const media = document.createElement('div');
  media.className = 'related-card-media';
  const img = imgCell?.querySelector('img');
  if (img) media.append(img);

  const body = document.createElement('div');
  body.className = 'related-card-body';

  if (specCell) {
    const spec = document.createElement('span');
    spec.className = 'related-card-specialty';
    spec.textContent = specCell.textContent.trim();
    body.append(spec);
  }

  if (nameCell) {
    const h3 = document.createElement('h3');
    h3.className = 'related-card-title';
    h3.textContent = nameCell.textContent.trim();
    body.append(h3);
  }

  if (clinicCell) {
    const clinic = document.createElement('p');
    clinic.className = 'related-card-clinic';
    clinic.textContent = clinicCell.textContent.trim();
    body.append(clinic);
  }

  const more = document.createElement('span');
  more.className = 'readmore';
  more.textContent = 'Mehr erfahren';
  body.append(more);

  card.append(media, body);
  return card;
}

function buildArticleCard(cells) {
  const [imgCell, tagCell, dateCell, titleCell, excerptCell, hrefCell] = cells;

  const href = hrefCell?.querySelector('a')?.href
    || titleCell?.querySelector('a')?.href
    || imgCell?.querySelector('a')?.href
    || '#';

  const card = document.createElement('a');
  card.className = 'related-card related-card--article';
  card.href = href;

  const media = document.createElement('div');
  media.className = 'related-card-media';
  const img = imgCell?.querySelector('img');
  if (img) media.append(img);

  const body = document.createElement('div');
  body.className = 'related-card-body';

  const metaRow = document.createElement('span');
  metaRow.className = 'related-card-meta';

  if (tagCell) {
    const tag = document.createElement('span');
    tag.className = 'related-card-tag';
    tag.textContent = tagCell.textContent.trim();
    metaRow.append(tag);
  }
  if (dateCell) {
    const sep = document.createElement('span');
    sep.setAttribute('aria-hidden', 'true');
    sep.textContent = ' · ';
    const date = document.createElement('span');
    date.textContent = dateCell.textContent.trim();
    metaRow.append(sep, date);
  }
  if (metaRow.children.length) body.append(metaRow);

  if (titleCell) {
    const h3 = document.createElement('h3');
    h3.textContent = titleCell.textContent.trim();
    body.append(h3);
  }

  if (excerptCell) {
    const p = document.createElement('p');
    p.textContent = excerptCell.textContent.trim();
    body.append(p);
  }

  const more = document.createElement('span');
  more.className = 'related-card-more';
  more.textContent = 'Mehr erfahren ›';
  body.append(more);

  card.append(media, body);
  return card;
}

function buildCard(cells, variant) {
  if (variant === 'event') return buildEventCard(cells);
  if (variant === 'doctor') return buildDoctorCard(cells);
  if (variant === 'link') return buildLinkCard(cells);
  return buildArticleCard(cells);
}

export default function decorate(block) {
  const prev = block.closest('.block-content')?.previousElementSibling;
  if (prev && (prev.classList.contains('default-content') || prev.classList.contains('default-content-wrapper'))) {
    const sectionHead = document.createElement('div');
    sectionHead.className = 'section-head';
    sectionHead.append(...prev.childNodes);
    prev.remove();
    block.before(sectionHead);
  }

  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  const firstCells = [...rows[0].querySelectorAll(':scope > div')];
  const variant = detectVariant(firstCells);

  const grid = document.createElement('div');
  grid.className = 'related-cards-grid';

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const card = buildCard(cells, variant);
    if (card) grid.append(card);
  });

  const lastRow = rows[rows.length - 1];
  const lastCells = [...lastRow.querySelectorAll(':scope > div')];
  if (lastCells.length === 1) {
    const link = lastCells[0].querySelector('a');
    const text = lastCells[0].textContent.trim();
    if (link && text === link.textContent.trim() && rows.length > 1) {
      const lastCard = grid.lastElementChild;
      grid.removeChild(lastCard);
      const footer = document.createElement('div');
      footer.className = 'related-cards-footer';
      link.className = 'readmore';
      footer.append(link);
      block.after(footer);
    }
  }

  block.innerHTML = '';
  block.append(grid);
}
