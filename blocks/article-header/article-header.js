/**
 * Article Header block
 * Renders breadcrumb + optional back link + H1.
 *
 * Authored as a single row, single cell containing:
 *   - Breadcrumb links (authored as a paragraph of pipe-separated links,
 *     or as a series of links separated by plain-text separators)
 *   - Back link: <em><a href="...">Back text</a></em>
 *   - H1 or H2 title
 *
 * Alternatively, two rows:
 *   Row 1: breadcrumb links (one link per paragraph, or comma-separated)
 *   Row 2: back link + h1
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'article-header-inner';

  // Collect all child elements from all cells
  const allCells = rows.flatMap((r) => [...r.querySelectorAll(':scope > div')]);
  const allChildren = allCells.flatMap((c) => [...c.children]);

  const breadcrumbLinks = [];
  let backLink = null;
  let heading = null;

  allChildren.forEach((el) => {
    const tag = el.tagName.toLowerCase();

    // Heading → article H1
    if (tag === 'h1' || tag === 'h2') {
      heading = document.createElement('h1');
      heading.textContent = el.textContent.trim();
      return;
    }

    // <em><a> → back link
    const emLink = el.querySelector('em > a, em a');
    if (emLink) {
      backLink = document.createElement('a');
      backLink.className = 'backlink';
      backLink.href = emLink.href;
      backLink.textContent = emLink.textContent.trim();
      return;
    }

    // Paragraph with links → breadcrumb items
    const links = [...el.querySelectorAll('a')];
    if (links.length) {
      links.forEach((a) => breadcrumbLinks.push({ text: a.textContent.trim(), href: a.href }));
      // Also capture trailing plain text as current page
      const text = el.textContent.trim();
      const linkedText = links.map((a) => a.textContent.trim()).join('');
      const remainder = text.replace(linkedText, '').replace(/[/›»|]/g, '').trim();
      if (remainder) {
        breadcrumbLinks.push({ text: remainder, href: null });
      }
      return;
    }

    // Plain paragraph as current breadcrumb item
    const plain = el.textContent.trim();
    if (plain && tag === 'p') {
      breadcrumbLinks.push({ text: plain, href: null });
    }
  });

  // ── Build breadcrumb nav ──────────────────────────────────────────
  if (breadcrumbLinks.length) {
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Breadcrumb');
    const ol = document.createElement('ol');
    ol.className = 'breadcrumb';

    breadcrumbLinks.forEach(({ text, href }, i) => {
      const li = document.createElement('li');
      if (href && i < breadcrumbLinks.length - 1) {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = text;
        li.append(a);
      } else if (i === breadcrumbLinks.length - 1) {
        const span = document.createElement('span');
        span.setAttribute('aria-current', 'page');
        span.textContent = text;
        li.append(span);
      } else {
        const a = document.createElement('a');
        a.href = href || '#';
        a.textContent = text;
        li.append(a);
      }
      ol.append(li);
    });

    nav.append(ol);
    wrapper.append(nav);
  }

  // ── Back link ─────────────────────────────────────────────────────
  if (backLink) {
    wrapper.append(backLink);
  }

  // ── H1 ────────────────────────────────────────────────────────────
  if (heading) {
    wrapper.append(heading);
  }

  block.innerHTML = '';
  block.append(wrapper);
}
