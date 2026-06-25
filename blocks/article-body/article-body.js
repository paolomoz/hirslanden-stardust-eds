/**
 * Article Body block
 * Renders date stamp + lead paragraph + two-column prose / sidebar layout.
 *
 * Authored as rows:
 *   Row 1: [date text] | [lead paragraph]
 *   Row 2: [article prose (h3, p, blockquote, links)] | [sidebar content]
 *
 * Sidebar cells may contain:
 *   - PDF download: strong > a with .pdf in href or "PDF" label
 *   - Figures: image + optional caption paragraph
 *   - Press contacts: h3 + paragraphs (name, email link, phone link)
 */

function buildProse(cell) {
  const article = document.createElement('article');
  article.className = 'article-prose';
  if (cell) article.append(...cell.childNodes);
  return article;
}

function buildDownload(el, link) {
  const widget = document.createElement('div');
  widget.className = 'sidebar-download';

  const h3 = document.createElement('h3');
  h3.textContent = 'Anhang';
  widget.append(h3);

  const item = document.createElement('a');
  item.className = 'download-item';
  item.href = link.href;
  item.target = '_blank';
  item.rel = 'noopener';

  const iconEl = document.createElement('span');
  iconEl.className = 'download-icon';
  iconEl.setAttribute('aria-hidden', 'true');
  iconEl.textContent = 'PDF';

  const meta = document.createElement('span');
  meta.className = 'download-meta';

  const title = document.createElement('h4');
  title.textContent = link.textContent.trim() || el.textContent.trim();
  meta.append(title);

  const fullText = el.textContent.trim();
  const linkText = link.textContent.trim();
  const remainder = fullText.replace(linkText, '').trim();
  if (remainder) {
    const size = document.createElement('span');
    size.className = 'filesize';
    size.textContent = remainder;
    meta.append(size);
  }

  item.append(iconEl, meta);
  widget.append(item);
  return widget;
}

function buildSidebar(cell) {
  const aside = document.createElement('aside');
  aside.className = 'article-sidebar';
  aside.setAttribute('aria-label', 'Anh&auml;nge und Kontakte');

  if (!cell) return aside;

  const children = [...cell.children];
  let i = 0;

  while (i < children.length) {
    const el = children[i];
    const tag = el.tagName.toLowerCase();
    const img = el.querySelector('img') || (tag === 'img' ? el : null);
    const pdfLink = tag === 'p' ? el.querySelector('a[href*=".pdf"], strong > a') : null;

    if (pdfLink) {
      aside.append(buildDownload(el, pdfLink));
      i += 1;
    } else if (img) {
      const fig = document.createElement('figure');
      fig.className = 'sidebar-figure';

      const nextEl = children[i + 1];
      const isCaption = nextEl
        && nextEl.tagName.toLowerCase() === 'p'
        && !nextEl.querySelector('a[href*=".pdf"], img');

      const parentLink = el.querySelector('a[href]');
      if (parentLink && !parentLink.href.includes('.pdf')) {
        const a = document.createElement('a');
        a.href = parentLink.href;
        a.target = '_blank';
        a.rel = 'noopener';
        a.setAttribute('aria-label', 'Bild in voller Aufl&ouml;sung &ouml;ffnen');
        img.loading = img.loading || 'lazy';
        a.append(img);
        fig.append(a);
      } else {
        fig.append(img);
      }

      if (isCaption) {
        const caption = document.createElement('figcaption');
        caption.textContent = nextEl.textContent.trim();
        fig.append(caption);
        i += 1;
      }

      aside.append(fig);
      i += 1;
    } else if (tag === 'h3') {
      const contact = document.createElement('div');
      contact.className = 'sidebar-contact';
      const h3 = document.createElement('h3');
      h3.textContent = el.textContent.trim();
      contact.append(h3);
      i += 1;

      while (i < children.length && children[i].tagName.toLowerCase() !== 'h3') {
        const p = document.createElement('p');
        p.append(...children[i].childNodes);
        if (!children[i].querySelector('a') && contact.querySelectorAll('p').length === 0) {
          p.className = 'contact-person';
        }
        contact.append(p);
        i += 1;
      }
      aside.append(contact);
    } else {
      aside.append(el.cloneNode(true));
      i += 1;
    }
  }

  return aside;
}

export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'article-body-inner';

  let datestamp = null;
  let lead = null;
  let proseEl = null;
  let sidebarEl = null;

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];

    if (cells.length === 2) {
      const [left, right] = cells;
      const leftChildren = [...left.children];
      const isDateRow = leftChildren.length <= 2
        && leftChildren.every((c) => c.tagName.toLowerCase() === 'p');

      if (isDateRow && !datestamp) {
        if (leftChildren[0]) {
          datestamp = document.createElement('p');
          datestamp.className = 'article-datestamp';
          datestamp.append(...leftChildren[0].childNodes);
        }
        if (leftChildren[1]) {
          lead = document.createElement('p');
          lead.className = 'article-lead';
          lead.append(...leftChildren[1].childNodes);
        }
        sidebarEl = buildSidebar(right);
      } else {
        proseEl = buildProse(left);
        if (!sidebarEl) {
          sidebarEl = buildSidebar(right);
        } else {
          const extra = buildSidebar(right);
          [...extra.children].forEach((c) => sidebarEl.append(c));
        }
      }
    } else if (cells.length === 1) {
      const [cell] = cells;
      const children = [...cell.children];
      const firstTag = children[0]?.tagName.toLowerCase();

      if (!datestamp && firstTag === 'p' && children.length <= 3) {
        if (children[0]) {
          datestamp = document.createElement('p');
          datestamp.className = 'article-datestamp';
          datestamp.append(...children[0].childNodes);
        }
        if (children[1]) {
          lead = document.createElement('p');
          lead.className = 'article-lead';
          lead.append(...children[1].childNodes);
        }
      } else {
        proseEl = buildProse(cell);
      }
    }
  });

  if (datestamp) wrapper.append(datestamp);
  if (lead) wrapper.append(lead);

  if (proseEl || sidebarEl) {
    const grid = document.createElement('div');
    grid.className = 'article-grid';
    if (proseEl) grid.append(proseEl);
    if (sidebarEl) grid.append(sidebarEl);
    wrapper.append(grid);
  }

  block.innerHTML = '';
  block.append(wrapper);
}
