/**
 * Whats Happening block — news + events two-column layout with blog band
 * Authored row structure:
 *   Row 1, cell 1: news section heading
 *   Rows 2–N (news): [tag] | [date] | [title] | [link]
 *   Separator row: single cell with "---" or empty
 *   Row after separator, cell 1: events section heading
 *   Rows (events): [date "DD Mon."] | [location] | [title] | [link]
 *   Last row: [news more link] | [events more link]
 *   Optional: blog band row with [blog heading] | [blog link]
 *
 * Simpler detection: rows with a date-chip pattern (number + month) = events
 * rows with tag + date string = news
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const newsItems = [];
  const eventItems = [];
  let newsHeading = 'News &amp; Mitteilungen';
  let eventsHeading = 'Veranstaltungen';
  let newsMoreHref = '#';
  let newsMoreText = 'Alle News und Mitteilungen';
  let eventsMoreHref = '#';
  let eventsMoreText = 'Alle Veranstaltungen';
  let blogHeading = '';
  let blogHref = '';
  let blogLinkText = '';

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    if (!cells.length) return;

    const text0 = cells[0]?.textContent?.trim() || '';
    const text1 = cells[1]?.textContent?.trim() || '';

    // Section headings row (h2 in first cell, no second cell or second is h2)
    const h2 = cells[0].querySelector('h2');
    if (h2 && cells.length === 1) {
      if (!newsItems.length && !eventItems.length) {
        newsHeading = h2.innerHTML;
      } else {
        eventsHeading = h2.innerHTML;
      }
      return;
    }

    // "More" links row — both cells have links, no images
    const links0 = cells[0]?.querySelectorAll('a');
    const links1 = cells[1]?.querySelectorAll('a');
    if (links0?.length && links1?.length && !cells[0].querySelector('img')) {
      newsMoreHref = links0[0].href;
      newsMoreText = links0[0].textContent.trim();
      eventsMoreHref = links1[0].href;
      eventsMoreText = links1[0].textContent.trim();
      return;
    }

    // Blog band row — heading + link, single wide row
    if (cells.length === 2 && cells[0].querySelector('h2') && cells[1].querySelector('a')) {
      blogHeading = cells[0].querySelector('h2').textContent.trim();
      const blogA = cells[1].querySelector('a');
      blogHref = blogA.href;
      blogLinkText = blogA.textContent.trim();
      return;
    }

    // Detect event row: first cell looks like "DD Mon." pattern
    const dateMatch = text0.match(/^(\d{1,2})\s+(\S+)$/);
    if (dateMatch) {
      eventItems.push({
        day: dateMatch[1], mon: dateMatch[2], loc: text1, title: cells[2]?.textContent?.trim() || '', href: cells[3]?.querySelector('a')?.href || cells[0].querySelector('a')?.href || '#',
      });
      return;
    }

    // News row: [tag] | [date] | [title] | [link]
    if (cells.length >= 3) {
      const href = cells[3]?.querySelector('a')?.href || cells[0].querySelector('a')?.href || '#';
      newsItems.push({
        tag: text0, date: text1, title: cells[2]?.textContent?.trim() || '', href,
      });
    }
  });

  // Build DOM
  const grid = document.createElement('div');
  grid.className = 'whats-happening-grid';

  // News column
  const newsCol = document.createElement('div');
  newsCol.className = 'whats-happening-col';
  const newsH2 = document.createElement('h2');
  newsH2.innerHTML = newsHeading;
  newsCol.append(newsH2);

  const newsList = document.createElement('ul');
  newsList.className = 'news-list';
  newsItems.forEach(({
    tag, date, title, href,
  }) => {
    const li = document.createElement('li');
    li.className = 'news-row';
    li.innerHTML = `<a href="${href}"><span class="news-meta"><span class="news-tag">${tag}</span><span aria-hidden="true">&middot;</span><span>${date}</span></span><h3>${title}</h3></a>`;
    newsList.append(li);
  });
  newsCol.append(newsList);

  const newsMore = document.createElement('div');
  newsMore.className = 'col-more';
  newsMore.innerHTML = `<a class="readmore" href="${newsMoreHref}">${newsMoreText}</a>`;
  newsCol.append(newsMore);

  // Events column
  const eventsCol = document.createElement('div');
  eventsCol.className = 'whats-happening-col';
  const eventsH2 = document.createElement('h2');
  eventsH2.innerHTML = eventsHeading;
  eventsCol.append(eventsH2);

  const eventsList = document.createElement('ul');
  eventsList.className = 'event-list';
  eventItems.forEach(({
    day, mon, loc, title, href,
  }) => {
    const li = document.createElement('li');
    li.className = 'event-row';
    li.innerHTML = `<a href="${href}"><span class="date-chip"><span class="day">${day}</span><span class="mon">${mon}</span></span><span class="event-text"><span class="loc">${loc}</span><h3>${title}</h3></span></a>`;
    eventsList.append(li);
  });
  eventsCol.append(eventsList);

  const eventsMore = document.createElement('div');
  eventsMore.className = 'col-more';
  eventsMore.innerHTML = `<a class="readmore" href="${eventsMoreHref}">${eventsMoreText}</a>`;
  eventsCol.append(eventsMore);

  grid.append(newsCol, eventsCol);
  block.innerHTML = '';

  const container = document.createElement('div');
  container.className = 'container';
  container.append(grid);
  block.append(container);

  if (blogHeading) {
    const blogBand = document.createElement('div');
    blogBand.className = 'blog-band';
    blogBand.innerHTML = `<div class="container"><h2>${blogHeading}</h2><a class="btn btn--onblue" href="${blogHref}">${blogLinkText}</a></div>`;
    block.append(blogBand);
  }
}
