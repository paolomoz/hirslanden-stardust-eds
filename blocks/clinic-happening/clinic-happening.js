function buildEventItem(row) {
  const cells = [...row.querySelectorAll(':scope > div')];
  // Expected: [date string "DD Mon."] | [location] | [title] | [link href]
  const [dateCell, locCell, titleCell] = cells;
  const link = row.querySelector('a');

  const li = document.createElement('li');
  li.className = 'event-row';

  const a = document.createElement('a');
  a.href = link?.href || '#';

  const dateText = dateCell?.textContent?.trim() || '';
  const parts = dateText.match(/^(\d+)\s+(.+)$/) || [];
  if (parts.length) {
    const chip = document.createElement('span');
    chip.className = 'date-chip';
    chip.innerHTML = `<span class="day">${parts[1]}</span><span class="mon">${parts[2]}</span>`;
    a.append(chip);
  }

  const text = document.createElement('span');
  text.className = 'event-text';

  const loc = document.createElement('span');
  loc.className = 'loc';
  loc.textContent = locCell?.textContent?.trim() || '';
  text.append(loc);

  const title = document.createElement('h3');
  title.className = 'event-title';
  title.textContent = titleCell?.textContent?.trim() || link?.textContent?.trim() || '';
  text.append(title);

  a.append(text);
  li.append(a);
  return li;
}

function buildNewsItem(row) {
  const cells = [...row.querySelectorAll(':scope > div')];
  // Expected: [tag] | [date] | [title] | [link href]
  const [tagCell, dateCell, titleCell] = cells;
  const link = row.querySelector('a');

  const li = document.createElement('li');
  li.className = 'news-row';

  const a = document.createElement('a');
  a.href = link?.href || '#';

  const meta = document.createElement('span');
  meta.className = 'news-meta';

  const tag = document.createElement('span');
  tag.className = 'news-tag';
  tag.textContent = tagCell?.textContent?.trim() || '';
  meta.append(tag);

  const sep = document.createElement('span');
  sep.setAttribute('aria-hidden', 'true');
  sep.textContent = '·';
  meta.append(sep);

  const date = document.createElement('span');
  date.textContent = dateCell?.textContent?.trim() || '';
  meta.append(date);

  const title = document.createElement('h3');
  title.className = 'news-title';
  title.textContent = titleCell?.textContent?.trim() || link?.textContent?.trim() || '';

  a.append(meta, title);
  li.append(a);
  return li;
}

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // Two-column layout: first row = events column, second row = news column
  // Or: single row with two cells (events | news)
  let eventsRows = [];
  let newsRows = [];
  let eventsTitle = 'Kurse und Veranstaltungen';
  let newsTitle = 'Medienmitteilungen & News';
  let eventsMoreLink = null;
  let newsMoreLink = null;

  const firstRowCells = rows[0]?.querySelectorAll(':scope > div');
  if (firstRowCells?.length >= 2) {
    // Single row, two cells: events column | news column
    const [evCol, newsCol] = firstRowCells;
    eventsTitle = evCol?.querySelector('h2')?.textContent || eventsTitle;
    newsTitle = newsCol?.querySelector('h2')?.textContent || newsTitle;

    eventsMoreLink = evCol?.querySelector('.col-more a, a.readmore');
    newsMoreLink = newsCol?.querySelector('.col-more a, a.readmore');

    // Items are rows within each column's list
    eventsRows = [...(evCol?.querySelectorAll('li') || [])];
    newsRows = [...(newsCol?.querySelectorAll('li') || [])];
  } else {
    // Multi-row format: alternating events/news rows, or a split marker
    const half = Math.ceil(rows.length / 2);
    eventsRows = rows.slice(0, half);
    newsRows = rows.slice(half);
  }

  const wrap = document.createElement('div');
  wrap.className = 'container';
  const grid = document.createElement('div');
  grid.className = 'clinic-happening-grid';

  [
    {
      title: eventsTitle, items: eventsRows, type: 'events', moreLink: eventsMoreLink, moreText: 'Alle Kurse und Veranstaltungen',
    },
    {
      title: newsTitle, items: newsRows, type: 'news', moreLink: newsMoreLink, moreText: 'Alle Medienmitteilungen und News',
    },
  ].forEach(({
    title, items, type, moreLink, moreText,
  }) => {
    const col = document.createElement('div');
    col.className = 'clinic-happening-col';

    const h2 = document.createElement('h2');
    h2.textContent = title;
    col.append(h2);

    const list = document.createElement('ul');
    list.className = type === 'events' ? 'event-list' : 'news-list';

    items.forEach((item) => {
      if (item.tagName === 'LI') {
        list.append(item.cloneNode(true));
      } else {
        list.append(type === 'events' ? buildEventItem(item) : buildNewsItem(item));
      }
    });

    col.append(list);

    if (moreLink) {
      const more = document.createElement('div');
      more.className = 'col-more';
      more.append(moreLink.cloneNode(true));
      col.append(more);
    } else {
      const more = document.createElement('div');
      more.className = 'col-more';
      const a = document.createElement('a');
      a.textContent = moreText;
      a.href = '#';
      more.append(a);
      col.append(more);
    }

    grid.append(col);
  });

  wrap.append(grid);
  block.innerHTML = '';
  block.append(wrap);
}
