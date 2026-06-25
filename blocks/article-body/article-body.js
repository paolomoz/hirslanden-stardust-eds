/**
 * article-body block
 * The body of a news article: a date stamp and a lead paragraph above a
 * two-column grid — a main prose column (paragraphs, sub-headings, pull quotes)
 * and a sidebar (downloads, image figures, press contacts).
 *
 * Authoring (flat content, classified by content not index):
 *   - the FIRST short line that reads like a date stamp
 *     ("Medienmitteilung vom 28.05.2026") → the date stamp
 *   - the NEXT paragraph → the lead (accent-topped intro)
 *   - <h3> + <p>/<ul> → prose sub-sections in the main column
 *   - a paragraph that is only a <cite>-style attribution after a quoted
 *     paragraph (text wrapped in «…» or in <em>) → renders as a blockquote
 *   - a picture/img (with the caption text that follows) → a sidebar figure
 *   - an <h3> whose text matches "Anhang"/"Kontakt"/"Download" opens a SIDEBAR
 *     card; its following paragraphs/links render inside that card. A link whose
 *     label/href ends in .pdf becomes the download widget.
 */

const isHeading = (el) => /^h[1-6]$/.test(el.tagName.toLowerCase());
const isMedia = (el) => el.matches('picture, img') || el.querySelector('picture, img');
const anchorOf = (el) => (el.tagName.toLowerCase() === 'a' ? el : el.querySelector('a'));
const DATESTAMP_RE = /\b\d{1,2}\.\d{1,2}\.\d{2,4}\b/;
const SIDEBAR_RE = /(anhang|kontakt|download|contact)/i;
const QUOTE_RE = /^[«"„].+[»"“]$/s;

function collectNodes(block) {
  const nodes = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    const kids = [...cell.children];
    if (kids.length === 0) {
      const text = cell.textContent.trim();
      if (text) {
        const p = document.createElement('p');
        p.innerHTML = cell.innerHTML;
        nodes.push(p);
      }
      return;
    }
    kids.forEach((el) => nodes.push(el));
  });
  return nodes;
}

export default async function decorate(block) {
  const nodes = collectNodes(block);

  const container = document.createElement('div');
  container.className = 'container';

  // 1. date stamp + lead (consumed off the front)
  let datestamp = null;
  let lead = null;
  let i = 0;
  while (i < nodes.length) {
    const node = nodes[i];
    const text = node.textContent.trim();
    const isP = node.tagName.toLowerCase() === 'p';
    if (!text && !isMedia(node)) {
      i += 1;
    } else if (!datestamp && isP && DATESTAMP_RE.test(text) && text.length <= 60) {
      datestamp = node;
      i += 1;
    } else if (!lead && isP) {
      lead = node;
      i += 1;
      break;
    } else {
      break;
    }
  }

  if (datestamp) {
    const p = document.createElement('p');
    p.className = 'article-datestamp';
    p.innerHTML = `<time>${datestamp.textContent.trim()}</time>`;
    container.append(p);
  }
  if (lead) {
    const p = document.createElement('p');
    p.className = 'article-lead';
    p.innerHTML = lead.innerHTML;
    container.append(p);
  }

  const rest = nodes.slice(i);

  // 2. split remaining into main-prose vs sidebar by heading routing.
  const grid = document.createElement('div');
  grid.className = 'article-grid';
  const prose = document.createElement('article');
  prose.className = 'article-prose';
  const sidebar = document.createElement('aside');
  sidebar.className = 'article-sidebar';
  sidebar.setAttribute('aria-label', 'Anhänge und Kontakte');

  let target = 'prose';
  let sidebarCard = null;
  let pendingFigureCaption = false;
  let lastFigure = null;

  const startSidebarCard = (heading) => {
    sidebarCard = document.createElement('div');
    sidebarCard.className = 'sidebar-contact';
    const h3 = document.createElement('h3');
    h3.innerHTML = heading.innerHTML;
    sidebarCard.append(h3);
    sidebar.append(sidebarCard);
  };

  rest.forEach((node) => {
    const tag = node.tagName.toLowerCase();
    const text = node.textContent.trim();
    const link = anchorOf(node);

    // images always go to the sidebar as figures
    if (isMedia(node)) {
      const fig = document.createElement('figure');
      fig.className = 'sidebar-figure';
      const pic = node.matches('picture, img') ? node : node.querySelector('picture, img');
      fig.append(pic);
      sidebar.append(fig);
      lastFigure = fig;
      pendingFigureCaption = true;
      target = 'prose';
      sidebarCard = null;
      return;
    }

    if (isHeading(node)) {
      pendingFigureCaption = false;
      if (SIDEBAR_RE.test(text)) {
        target = 'sidebar';
        // a download card if it reads "Anhang"/"Download"
        if (/anhang|download/i.test(text)) {
          sidebarCard = document.createElement('div');
          sidebarCard.className = 'sidebar-download';
          const h3 = document.createElement('h3');
          h3.innerHTML = node.innerHTML;
          sidebarCard.append(h3);
          sidebar.append(sidebarCard);
        } else {
          startSidebarCard(node);
        }
        return;
      }
      target = 'prose';
      sidebarCard = null;
      const h3 = document.createElement('h3');
      h3.innerHTML = node.innerHTML;
      prose.append(h3);
      return;
    }

    // a caption paragraph right after a figure
    if (pendingFigureCaption && lastFigure && tag === 'p' && !link) {
      const cap = document.createElement('figcaption');
      cap.textContent = text;
      lastFigure.append(cap);
      pendingFigureCaption = false;
      return;
    }
    pendingFigureCaption = false;

    if (target === 'sidebar' && sidebarCard) {
      if (link && /\.pdf(\?|$)/i.test(link.getAttribute('href') || '')
        && sidebarCard.classList.contains('sidebar-download')) {
        const a = document.createElement('a');
        a.className = 'download-item';
        a.href = link.getAttribute('href');
        a.target = '_blank';
        a.rel = 'noopener';
        a.innerHTML = '<span class="download-icon" aria-hidden="true">PDF</span>'
          + `<span class="download-meta"><h4>${link.textContent.trim()}</h4></span>`;
        sidebarCard.append(a);
        return;
      }
      const p = document.createElement('p');
      // mark a person/name line (no link) emphasised in authoring
      if (!link && node.querySelector('strong, em')) p.className = 'contact-person';
      p.innerHTML = node.innerHTML;
      sidebarCard.append(p);
      return;
    }

    // prose paragraph or quote
    if (tag === 'p') {
      const isQuote = QUOTE_RE.test(text) || node.querySelector('em, i');
      if (isQuote) {
        const bq = document.createElement('blockquote');
        const qp = document.createElement('p');
        qp.innerHTML = node.innerHTML;
        bq.append(qp);
        prose.append(bq);
        return;
      }
      // a short attribution line right after a quote → fold into that quote
      const prev = prose.lastElementChild;
      if (prev && prev.tagName.toLowerCase() === 'blockquote'
        && !prev.querySelector('cite') && text.length <= 120 && !link) {
        const cite = document.createElement('cite');
        cite.textContent = text;
        prev.append(cite);
        return;
      }
      const p = document.createElement('p');
      p.innerHTML = node.innerHTML;
      prose.append(p);
      return;
    }

    // anything else (lists etc.) → prose
    if (target === 'prose') prose.append(node);
  });

  grid.append(prose);
  if (sidebar.children.length) grid.append(sidebar);
  container.append(grid);
  block.replaceChildren(container);
}
