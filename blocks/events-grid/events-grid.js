/**
 * Events Grid block — 4-column card grid for event listings.
 *
 * Authoring rows — each row is one event card:
 *   Col 1: date string "DD Mon." (e.g. "25 Jun.")
 *   Col 2: location "City · Clinic name"
 *   Col 3: title text
 *   Col 4: image (picture/img) — optional
 *   Col 5: detail page link — optional (falls back to any link in row)
 *   Col 6: "Weitere Termine verfügbar" flag — optional ("true" to show)
 *
 * A "results" config row (col 1 = "results") can set the total count label:
 *   "results" | total number | page info string
 *
 * Listens for "events-filter:change" CustomEvent to client-side filter cards.
 *
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  block.innerHTML = '';

  let totalCount = 0;
  let pageInfo = '';
  const dataRows = [];

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    if (cells[0]?.textContent.trim().toLowerCase() === 'results') {
      totalCount = parseInt(cells[1]?.textContent.trim(), 10) || 0;
      pageInfo = cells[2]?.textContent.trim() || '';
    } else {
      dataRows.push(row);
    }
  });

  if (!totalCount) totalCount = dataRows.length;

  // Grid header
  const header = document.createElement('div');
  header.className = 'events-grid-header';
  header.innerHTML = `
    <h2>Events <span class="events-grid-count">${totalCount}</span></h2>
    ${pageInfo ? `<span class="events-grid-page-info">${pageInfo}</span>` : ''}
  `;
  block.append(header);

  // Card grid
  const ul = document.createElement('ul');
  ul.className = 'events-grid-list';
  ul.setAttribute('aria-label', 'Veranstaltungen');

  dataRows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const [dateCell, locCell, titleCell, imgCell, linkCell, moreCell] = cells;

    const anyLink = row.querySelector('a');
    const href = linkCell?.querySelector('a')?.href || anyLink?.href || '#';

    const dateText = dateCell?.textContent?.trim() || '';
    const dateParts = dateText.match(/^(\d+)\s+(.+)$/) || [];
    const day = dateParts[1] || '';
    const mon = dateParts[2] || '';

    const location = locCell?.textContent?.trim() || '';
    const title = titleCell?.textContent?.trim() || '';
    const moreCellText = moreCell?.textContent?.trim() || '';
    const moreLabel = (moreCellText && moreCellText.toLowerCase() !== 'false')
      ? moreCell.textContent.trim()
      : '';

    const img = imgCell?.querySelector('img, picture');

    const li = document.createElement('li');

    const a = document.createElement('a');
    a.className = 'event-card';
    a.href = href;
    const locSuffix = location ? `, ${location}` : '';
    a.setAttribute('aria-label', `${title} – ${dateText}${locSuffix}`);

    // Date badge
    if (day || mon || location) {
      const badge = document.createElement('div');
      badge.className = 'event-card-date-badge';

      if (day || mon) {
        const chip = document.createElement('div');
        chip.className = 'event-card-date-chip';
        chip.setAttribute('aria-label', `Datum: ${dateText}`);
        chip.innerHTML = `<span class="day">${day}</span><span class="mon">${mon}</span>`;
        badge.append(chip);
      }

      if (location) {
        const meta = document.createElement('div');
        meta.className = 'event-card-meta';
        const loc = document.createElement('div');
        loc.className = 'event-card-location';
        loc.innerHTML = `<span class="city-clinic">${location}</span>`;
        if (moreLabel) {
          const more = document.createElement('span');
          more.className = 'multi-dates';
          more.textContent = moreLabel;
          loc.append(more);
        }
        meta.append(loc);
        badge.append(meta);
      }

      a.append(badge);
    }

    // Body
    if (title) {
      const body = document.createElement('div');
      body.className = 'event-card-body';
      const h3 = document.createElement('h3');
      h3.className = 'event-card-title';
      h3.textContent = title;
      body.append(h3);
      a.append(body);
    }

    // Image
    if (img) {
      const imgWrap = document.createElement('div');
      imgWrap.className = 'event-card-image';
      const node = img.closest('picture') || img;
      imgWrap.append(node.cloneNode(true));
      const imgEl = imgWrap.querySelector('img');
      if (imgEl && !imgEl.getAttribute('loading')) imgEl.setAttribute('loading', 'lazy');
      a.append(imgWrap);
    }

    // CTA
    const cta = document.createElement('div');
    cta.className = 'event-card-cta';
    cta.innerHTML = '<span class="readmore">Mehr erfahren</span>';
    a.append(cta);

    li.append(a);
    ul.append(li);
  });

  block.append(ul);

  // Load more / pagination area (static — can be enhanced by a sheet-driven API)
  const paginationNav = document.createElement('nav');
  paginationNav.className = 'events-grid-pagination';
  paginationNav.setAttribute('aria-label', 'Seiten-Navigation');

  const pageCount = document.createElement('span');
  pageCount.className = 'events-grid-page-count';
  pageCount.setAttribute('aria-live', 'polite');
  pageCount.textContent = `${dataRows.length} von ${totalCount} Veranstaltungen`;
  paginationNav.append(pageCount);

  if (totalCount > dataRows.length) {
    const loadMore = document.createElement('button');
    loadMore.className = 'btn btn--secondary events-grid-load-more';
    loadMore.type = 'button';
    loadMore.textContent = 'Weitere Veranstaltungen laden';
    paginationNav.append(loadMore);
  }

  block.append(paginationNav);

  // Listen for filter events from events-filter block
  document.addEventListener('events-filter:change', (e) => {
    const { filters } = e.detail || {};
    if (!filters) return;

    const cards = [...ul.querySelectorAll('li')];
    let visible = 0;

    cards.forEach((li) => {
      const cardText = li.textContent.toLowerCase();
      const matches = Object.values(filters)
        .every((val) => !val || cardText.includes(val.toLowerCase()));
      li.style.display = matches ? '' : 'none';
      if (matches) visible += 1;
    });

    const countEl = block.querySelector('.events-grid-count');
    if (countEl) countEl.textContent = String(visible);

    const pageCountEl = block.querySelector('.events-grid-page-count');
    if (pageCountEl) pageCountEl.textContent = `${visible} von ${totalCount} Veranstaltungen`;
  });
}
