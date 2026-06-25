/**
 * Event Body block
 * Two-column layout: main description column + sticky sidebar with date list + CTA.
 *
 * Authored rows:
 *   Row 1: [main content] | [sidebar content]
 *
 * Main content may include:
 *   - h2, h3 headings, paragraphs
 *   - ul.event-info-list (authored as table: label | value pairs)
 *   - notice box (authored as blockquote or div with "Wichtige Hinweise" h3)
 *   - transport section (authored as 2-col table: car | public transport)
 *
 * Sidebar content:
 *   - h2 (dates heading) + subtitle p
 *   - list of date items (authored as table rows: day | month | title | time | location)
 *   - CTA button (strong > a)
 *
 * Info list items: authored as table rows with 2 cells (label | value)
 * Date items: authored as table rows with cells: day-num | month-abbr | title | time | location
 * Transport: authored as 2-cell table row: [car text] | [transit text]
 */

function buildInfoListItem(cells, container) {
  let infoList = container.querySelector('.event-info-list:last-of-type');
  if (!infoList) {
    infoList = document.createElement('ul');
    infoList.className = 'event-info-list';
    container.append(infoList);
  }
  const li = document.createElement('li');
  const label = document.createElement('span');
  label.className = 'info-label';
  label.textContent = cells[0].textContent.trim();
  const value = document.createElement('span');
  value.append(...cells[1].childNodes);
  li.append(label, value);
  infoList.append(li);
}

function buildInfoRow(cells, container) {
  buildInfoListItem(cells, container);
}

function buildTransport(table, container) {
  const section = document.createElement('div');
  section.className = 'transport-section';

  const h3 = document.createElement('h3');
  h3.textContent = 'Anfahrt';
  section.append(h3);

  const grid = document.createElement('div');
  grid.className = 'transport-grid';

  [...table.querySelectorAll('tr')].forEach((tr) => {
    const tds = [...tr.querySelectorAll('td, th')];
    tds.forEach((td) => {
      const item = document.createElement('div');
      item.className = 'transport-item';
      item.append(...td.childNodes);
      grid.append(item);
    });
  });

  section.append(grid);
  container.append(section);
}

function buildMainContent(cell, container) {
  if (!cell) return;
  [...cell.children].forEach((el) => {
    const tag = el.tagName.toLowerCase();

    if (tag === 'div') {
      const subCells = [...el.querySelectorAll(':scope > div')];
      if (subCells.length === 2 && subCells[0].textContent.trim().length < 30) {
        buildInfoListItem(subCells, container);
        return;
      }
    }

    if (tag === 'table') {
      buildTransport(el, container);
      return;
    }

    if (tag === 'blockquote' || (tag === 'div' && el.querySelector('h3'))) {
      const notice = document.createElement('div');
      notice.className = 'event-notice';
      notice.append(...el.childNodes);
      container.append(notice);
      return;
    }

    container.append(el);
  });
}

function buildDateItem(tds) {
  const li = document.createElement('li');
  li.className = 'event-date-item';

  const [dayCell, monCell, titleCell, timeCell, locCell] = tds;

  const chip = document.createElement('div');
  chip.className = 'event-date-chip';
  chip.setAttribute('aria-hidden', 'true');

  const daySpan = document.createElement('span');
  daySpan.className = 'day';
  daySpan.textContent = dayCell?.textContent.trim() || '';

  const monSpan = document.createElement('span');
  monSpan.className = 'mon';
  monSpan.textContent = monCell?.textContent.trim() || '';

  chip.append(daySpan, monSpan);

  const info = document.createElement('div');
  info.className = 'event-date-info';

  if (titleCell) {
    const title = document.createElement('p');
    title.className = 'event-date-title';
    title.textContent = titleCell.textContent.trim();
    info.append(title);
  }

  const meta = document.createElement('div');
  meta.className = 'event-date-meta';

  if (timeCell) {
    const timeSpan = document.createElement('span');
    timeSpan.textContent = timeCell.textContent.trim();
    meta.append(timeSpan);
  }
  if (locCell) {
    const locSpan = document.createElement('span');
    locSpan.textContent = locCell.textContent.trim();
    meta.append(locSpan);
  }

  if (meta.children.length) info.append(meta);
  li.append(chip, info);
  return li;
}

function buildSidebar(cell, container) {
  if (!cell) return;

  const card = document.createElement('div');
  card.className = 'event-sidebar-card';

  const head = document.createElement('div');
  head.className = 'event-sidebar-head';

  const dateList = document.createElement('ul');
  dateList.className = 'event-dates';

  const ctaDiv = document.createElement('div');
  ctaDiv.className = 'event-sidebar-cta';

  let ctaLink = null;

  [...cell.children].forEach((el) => {
    const tag = el.tagName.toLowerCase();

    if (tag === 'h2' || tag === 'h3') {
      const h2 = document.createElement('h2');
      h2.textContent = el.textContent.trim();
      head.append(h2);
      return;
    }

    if (tag === 'p' && !el.querySelector('a[href]')) {
      const p = document.createElement('p');
      p.textContent = el.textContent.trim();
      head.append(p);
      return;
    }

    if (tag === 'p' && el.querySelector('strong > a')) {
      const a = el.querySelector('strong > a');
      a.className = 'btn btn--primary';
      ctaLink = a;
      return;
    }

    if (tag === 'table') {
      [...el.querySelectorAll('tr')].forEach((tr) => {
        const tds = [...tr.querySelectorAll('td')];
        if (tds.length >= 2) {
          const item = buildDateItem(tds);
          if (item) dateList.append(item);
        }
      });
      return;
    }

    head.append(el);
  });

  if (ctaLink) ctaDiv.append(ctaLink);

  card.append(head);
  if (dateList.children.length) card.append(dateList);
  if (ctaLink) card.append(ctaDiv);

  container.append(card);
}

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  const mainCol = document.createElement('div');
  mainCol.className = 'event-main';

  const sidebarCol = document.createElement('aside');
  sidebarCol.className = 'event-sidebar';
  sidebarCol.setAttribute('aria-label', 'Termin&uuml;bersicht und Anmeldung');

  let sidebarBuilt = false;

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];

    if (cells.length === 2 && !sidebarBuilt) {
      buildMainContent(cells[0], mainCol);
      buildSidebar(cells[1], sidebarCol);
      sidebarBuilt = true;
    } else if (cells.length === 2 && sidebarBuilt) {
      buildInfoRow(cells, mainCol);
    } else {
      buildMainContent(cells[0], mainCol);
    }
  });

  const grid = document.createElement('div');
  grid.className = 'event-body-grid';
  grid.append(mainCol, sidebarCol);

  block.innerHTML = '';
  block.append(grid);
}
