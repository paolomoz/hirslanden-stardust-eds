/**
 * archive-cta block
 * Closes the news listing with an "archive" quicklink (icon + label + chevron)
 * and a full-width newsletter band (heading + copy + on-blue CTA button).
 *
 * Authoring (flat content, classified by content not index):
 *   - the FIRST plain link (no heading before it) → the archive quicklink
 *   - a heading → the newsletter band heading (H2)
 *   - text after the heading → the newsletter copy
 *   - a link after the heading → the newsletter CTA (btn--onblue)
 */

const isHeading = (el) => /^h[1-6]$/.test(el.tagName.toLowerCase());
const anchorOf = (el) => (el.tagName.toLowerCase() === 'a' ? el : el.querySelector('a'));
const ARCHIVE_ICON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>';

function collectNodes(block) {
  const nodes = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    const kids = [...cell.children];
    if (kids.length === 0) {
      const text = cell.textContent.trim();
      if (text) {
        const p = document.createElement('p');
        p.textContent = text;
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

  let archive = null;
  let heading = null;
  const copy = [];
  let cta = null;

  nodes.forEach((node) => {
    const a = anchorOf(node);
    if (isHeading(node)) { if (!heading) heading = node; return; }
    if (a) {
      if (!heading && !archive) archive = a;
      else if (!cta) cta = a;
      return;
    }
    if (heading) copy.push(node);
  });

  const fragment = document.createDocumentFragment();

  if (archive) {
    const container = document.createElement('div');
    container.className = 'container';
    const inner = document.createElement('div');
    inner.className = 'archive-cta-inner';
    const link = document.createElement('a');
    link.className = 'archive-quicklink';
    link.href = archive.getAttribute('href') || '#';
    link.innerHTML = `<span class="archive-icon" aria-hidden="true">${ARCHIVE_ICON}</span>`
      + `<span class="archive-label">${archive.textContent.trim()}</span>`
      + '<span class="chevron" aria-hidden="true">&#8250;</span>';
    inner.append(link);
    container.append(inner);
    fragment.append(container);
  }

  if (heading || cta) {
    const band = document.createElement('div');
    band.className = 'newsletter-band';
    const c = document.createElement('div');
    c.className = 'container';
    const copyWrap = document.createElement('div');
    copyWrap.className = 'newsletter-band-copy';
    if (heading) {
      const h2 = document.createElement('h2');
      h2.innerHTML = heading.innerHTML;
      copyWrap.append(h2);
    }
    copy.forEach((node) => {
      const p = document.createElement('p');
      p.innerHTML = node.innerHTML || node.textContent.trim();
      copyWrap.append(p);
    });
    c.append(copyWrap);
    if (cta) {
      const a = cta.cloneNode(true);
      a.className = 'btn btn--onblue';
      c.append(a);
    }
    band.append(c);
    fragment.append(band);
  }

  block.replaceChildren(fragment);
}
