/**
 * Article List block — paginated news/press-release row list.
 *
 * Authoring rows — each row is one article:
 *   Col 1: tag label (e.g. "Medienmitteilung" | "News")
 *   Col 2: date string "DD.MM.YYYY" (rendered in <time>)
 *   Col 3: article title (linked)
 *   Col 4: source label (e.g. "Hirslanden-Gruppe") — optional
 *
 * Config row (optional, col 1 = "config"):
 *   "config" | page-size | load-more-label | total-count
 *
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  block.innerHTML = '';

  let pageSize = 10;
  let loadMoreLabel = 'Mehr anzeigen';
  let totalOverride = 0;
  const dataRows = [];

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    if (cells[0]?.textContent.trim().toLowerCase() === 'config') {
      pageSize = parseInt(cells[1]?.textContent.trim(), 10) || pageSize;
      loadMoreLabel = cells[2]?.textContent.trim() || loadMoreLabel;
      totalOverride = parseInt(cells[3]?.textContent.trim(), 10) || 0;
    } else {
      dataRows.push(row);
    }
  });

  const total = totalOverride || dataRows.length;

  // Build article list
  const ul = document.createElement('ul');
  ul.className = 'article-list-items';
  ul.setAttribute('aria-label', 'Medienmitteilungen und News');

  dataRows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const [tagCell, dateCell, titleCell, sourceCell] = cells;

    const tag = tagCell?.textContent?.trim() || '';
    const dateRaw = dateCell?.textContent?.trim() || '';
    const link = titleCell?.querySelector('a');
    const title = titleCell?.textContent?.trim() || '';
    const source = sourceCell?.textContent?.trim() || '';

    // Convert DD.MM.YYYY to ISO datetime
    const isoDate = dateRaw.replace(/(\d{2})\.(\d{2})\.(\d{4})/, '$3-$2-$1');

    const li = document.createElement('li');
    li.className = 'article-row';

    const a = document.createElement('a');
    a.href = link?.href || '#';

    const badge = document.createElement('span');
    badge.className = 'article-badge';

    if (tag) {
      const tagEl = document.createElement('span');
      tagEl.className = 'article-tag';
      tagEl.textContent = tag;
      badge.append(tagEl);
    }

    if (dateRaw) {
      const time = document.createElement('time');
      time.className = 'article-date';
      time.setAttribute('datetime', isoDate);
      time.textContent = dateRaw;
      badge.append(time);
    }

    a.append(badge);

    const content = document.createElement('span');
    content.className = 'article-content';

    const titleEl = document.createElement('span');
    titleEl.className = 'article-title';
    titleEl.textContent = title;
    content.append(titleEl);

    if (source) {
      const sourceEl = document.createElement('span');
      sourceEl.className = 'article-source';
      sourceEl.textContent = source;
      content.append(sourceEl);
    }

    a.append(content);

    const arrow = document.createElement('span');
    arrow.className = 'article-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '›';
    a.append(arrow);

    li.append(a);
    ul.append(li);
  });

  block.append(ul);

  // Load-more controls
  if (total > dataRows.length || total > pageSize) {
    const shown = Math.min(dataRows.length, pageSize);

    const loadMore = document.createElement('div');
    loadMore.className = 'article-list-load-more';

    const countEl = document.createElement('p');
    countEl.className = 'article-list-count';
    countEl.textContent = `${shown} von ${total} Beiträgen angezeigt`;

    const progress = document.createElement('div');
    progress.className = 'article-list-progress';
    progress.setAttribute('role', 'progressbar');
    progress.setAttribute('aria-valuenow', String(shown));
    progress.setAttribute('aria-valuemin', '0');
    progress.setAttribute('aria-valuemax', String(total));
    progress.setAttribute('aria-label', `Fortschritt: ${shown} von ${total}`);

    const fill = document.createElement('div');
    fill.className = 'article-list-progress-fill';
    fill.style.transform = `scaleX(${shown / total})`;
    progress.append(fill);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn--primary';
    btn.setAttribute('aria-label', 'Weitere Medienmitteilungen laden');
    btn.textContent = loadMoreLabel;

    let currentShown = shown;

    btn.addEventListener('click', () => {
      currentShown = Math.min(currentShown + pageSize, total);
      countEl.textContent = `${currentShown} von ${total} Beiträgen angezeigt`;
      fill.style.transform = `scaleX(${currentShown / total})`;
      progress.setAttribute('aria-valuenow', String(currentShown));

      if (currentShown >= total) {
        btn.disabled = true;
        btn.textContent = 'Alle Beiträge angezeigt';
        btn.setAttribute('aria-disabled', 'true');
      }
    });

    loadMore.append(countEl, progress, btn);
    block.append(loadMore);
  }
}
