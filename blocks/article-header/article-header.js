/**
 * article-header block
 * Orienting header for a news article: an optional back-link (the block prepends
 * a left-arrow) and the article H1 (the page's single H1).
 *
 * Authoring (flat content, classified by content not index):
 *   - the FIRST plain link (before the heading) → the back-link
 *   - a heading → H1
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

  nodes.forEach((node) => {
    const a = anchorOf(node);
    if (isHeading(node)) { if (!heading) heading = node; return; }
    if (a && !backLink && !heading) backLink = a;
  });

  if (backLink) {
    const a = document.createElement('a');
    a.className = 'backlink';
    a.href = backLink.getAttribute('href') || '#';
    a.textContent = backLink.textContent.trim();
    container.append(a);
  }

  if (heading) {
    const h1 = document.createElement('h1');
    h1.innerHTML = heading.innerHTML;
    container.append(h1);
  }

  block.replaceChildren(container);
}
