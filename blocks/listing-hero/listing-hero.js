/**
 * listing-hero block
 * Page header for the news listing: an optional back-link (the block prepends a
 * chevron-left), the page H1, and an optional row of "sibling" section pills.
 *
 * Authoring (flat content, classified by content not index):
 *   - the FIRST plain link (before the heading) → the back-link
 *   - a heading → H1 (the page's single H1)
 *   - any links AFTER the heading → sibling nav pills; a pill emphasised with
 *     <strong>/<em> (or matching the current page) gets aria-current="page".
 */

const isHeading = (el) => /^h[1-6]$/.test(el.tagName.toLowerCase());
const anchorOf = (el) => (el.tagName.toLowerCase() === 'a' ? el : el.querySelector('a'));

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

  const container = document.createElement('div');
  container.className = 'container';

  let backLink = null;
  let heading = null;
  const siblings = [];

  nodes.forEach((node) => {
    const a = anchorOf(node);
    if (isHeading(node)) { if (!heading) heading = node; return; }
    if (a) {
      if (!heading && !backLink) backLink = a;
      else siblings.push(a);
    }
  });

  if (backLink) {
    const a = document.createElement('a');
    a.className = 'back-link';
    a.href = backLink.getAttribute('href') || '#';
    a.textContent = backLink.textContent.trim();
    container.append(a);
  }

  if (heading) {
    const h1 = document.createElement('h1');
    h1.innerHTML = heading.innerHTML;
    container.append(h1);
  }

  if (siblings.length) {
    const nav = document.createElement('nav');
    nav.className = 'section-siblings';
    nav.setAttribute('aria-label', 'Abschnitte');
    siblings.forEach((src) => {
      const a = document.createElement('a');
      a.href = src.getAttribute('href') || '#';
      a.textContent = src.textContent.trim();
      if (src.querySelector('strong, em')) a.setAttribute('aria-current', 'page');
      nav.append(a);
    });
    container.append(nav);
  }

  block.replaceChildren(container);
}
