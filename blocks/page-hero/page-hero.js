/**
 * Page Hero block — shared listing/category page header.
 *
 * Authoring rows (all optional, order matters):
 *
 *   Breadcrumb rows  — single cell with a plain <a>, before the back-link/heading.
 *                      Multiple rows = multiple crumbs.
 *   Back-link row    — single cell whose only content is a plain <a> immediately
 *                      before the h1 row. Rendered as a ‹ prefixed link.
 *   Eyebrow row      — single cell with <em>text</em> (no block-level children).
 *   Heading row      — single cell containing an <h1>.
 *   Lead row         — single cell with a plain <p> (no links, no em).
 *   Sibling nav rows — single cell with a plain <a> (or <strong><a> for active),
 *                      after the heading row.
 *
 * Variant classes (space-separated after block name):
 *   white  — white background (clinic listing / news style)
 *   warm   — warm background (default)
 *
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  block.innerHTML = '';

  const inner = document.createElement('div');
  inner.className = 'page-hero-inner';

  // ── Two-pass parse ───────────────────────────────────────────────
  // Pass 1: find the heading row index to split pre/post sections.
  let headingRowIdx = -1;
  rows.forEach((row, i) => {
    if (row.querySelector('h1')) headingRowIdx = i;
  });

  const preRows = headingRowIdx >= 0 ? rows.slice(0, headingRowIdx) : [];
  const headingRow = headingRowIdx >= 0 ? rows[headingRowIdx] : null;
  const postRows = headingRowIdx >= 0 ? rows.slice(headingRowIdx + 1) : rows;

  // ── Pre-heading rows: breadcrumbs, back-link, eyebrow ───────────
  const breadcrumbs = [];
  let backLink = null;
  let eyebrow = null;
  let lead = null;

  preRows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const first = cells[0];
    if (!first) return;

    const em = first.querySelector(':scope > em, :scope > p > em');
    const links = first.querySelectorAll('a');
    const strongLink = first.querySelector('strong > a');

    // Eyebrow: em element, no heading or plain links
    if (em && links.length === 0) {
      eyebrow = em.textContent.trim();
      return;
    }

    // Two-cell row = explicit back-link (label | href-cell)
    if (cells.length === 2) {
      const label = cells[0].textContent.trim();
      const href = cells[1].querySelector('a')?.href || cells[1].textContent.trim();
      backLink = { label, href };
      return;
    }

    // Single-cell row with one link — treat last pre-heading link as back-link,
    // earlier ones as breadcrumbs.
    if (links.length === 1 && !strongLink) {
      const a = links[0];
      // We'll decide back-link vs crumb after we've seen all pre rows.
      breadcrumbs.push({ href: a.href, text: a.textContent.trim() });
      return;
    }

    // Fallback: plain text paragraph = lead (rare in pre-heading position)
    if (first.textContent.trim()) {
      lead = first.innerHTML;
    }
  });

  // If breadcrumbs were collected and no explicit backLink, use the last one
  // as the back-link and the rest as breadcrumbs.
  if (breadcrumbs.length && !backLink) {
    const last = breadcrumbs.pop();
    backLink = last;
  }

  // ── Post-heading rows: lead, sibling nav ────────────────────────
  const siblingLinks = [];

  postRows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const first = cells[0];
    if (!first) return;

    const em = first.querySelector(':scope > em, :scope > p > em');
    const strongLink = first.querySelector('strong > a');
    const links = [...first.querySelectorAll('a')];

    // Eyebrow (can appear before or after heading in authoring)
    if (em && links.length === 0) {
      eyebrow = em.textContent.trim();
      return;
    }

    // Sibling nav: cell with a link (active wrapped in <strong>)
    if (links.length >= 1) {
      const isActive = !!strongLink;
      const a = strongLink || links[0];
      siblingLinks.push({ href: a.href, text: a.textContent.trim(), active: isActive });
      return;
    }

    // Lead paragraph
    if (first.textContent.trim()) {
      lead = first.innerHTML;
    }
  });

  // ── Render ───────────────────────────────────────────────────────

  // Breadcrumb nav
  if (breadcrumbs.length) {
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Breadcrumb');
    const ol = document.createElement('ol');
    ol.className = 'page-hero-breadcrumb';
    breadcrumbs.forEach(({ href, text }) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = href;
      a.textContent = text;
      li.append(a);
      ol.append(li);
    });
    nav.append(ol);
    inner.append(nav);
  }

  // Back-link
  if (backLink) {
    const bl = document.createElement('a');
    bl.className = 'page-hero-back';
    bl.href = backLink.href;
    bl.textContent = backLink.label;
    inner.append(bl);
  }

  // Eyebrow
  if (eyebrow) {
    const ew = document.createElement('p');
    ew.className = 'page-hero-eyebrow';
    ew.textContent = eyebrow;
    inner.append(ew);
  }

  // Heading
  if (headingRow) {
    const h1 = headingRow.querySelector('h1');
    if (h1) inner.append(h1);
  }

  // Lead
  if (lead) {
    const lp = document.createElement('p');
    lp.className = 'page-hero-lead';
    lp.innerHTML = lead;
    inner.append(lp);
  }

  // Sibling nav (pill row)
  if (siblingLinks.length) {
    const nav = document.createElement('nav');
    nav.className = 'page-hero-siblings';
    nav.setAttribute('aria-label', 'Abschnitte');
    siblingLinks.forEach(({ href, text, active }) => {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = text;
      if (active) link.setAttribute('aria-current', 'page');
      nav.append(link);
    });
    inner.append(nav);
  }

  block.append(inner);
}
