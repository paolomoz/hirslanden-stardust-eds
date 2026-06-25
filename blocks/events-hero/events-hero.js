/**
 * events-hero block
 * Page header for the events listing: an eyebrow, the page H1, a lead paragraph
 * and an optional row of category pills (plain links, the block styles them).
 *
 * Authoring (DA usually flattens to one cell; classified by content, never index):
 *   - first short text line (no link) → eyebrow
 *   - heading → H1 (the page's single H1)
 *   - longer text line(s) → lead prose
 *   - links → category pills; a pill whose text/href matches the current page,
 *     or one marked with <strong>/<em>, becomes the active ("Alle …") pill.
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

  let eyebrow = null;
  let heading = null;
  const leads = [];
  const pills = [];

  nodes.forEach((node) => {
    const anchor = anchorOf(node);
    if (anchor) {
      pills.push(node);
      return;
    }
    if (isHeading(node)) {
      if (!heading) heading = node;
      return;
    }
    const text = node.textContent.trim();
    if (!text) return;
    if (!eyebrow && !heading && text.length <= 32) {
      eyebrow = node;
      return;
    }
    leads.push(node);
  });

  if (eyebrow) {
    const p = document.createElement('p');
    p.className = 'eyebrow';
    p.textContent = eyebrow.textContent.trim();
    container.append(p);
  }

  if (heading) {
    const h1 = document.createElement('h1');
    h1.innerHTML = heading.innerHTML;
    container.append(h1);
  }

  leads.forEach((node) => {
    const p = document.createElement('p');
    p.className = 'lead';
    p.innerHTML = node.innerHTML || node.textContent.trim();
    container.append(p);
  });

  if (pills.length) {
    const wrap = document.createElement('div');
    wrap.className = 'category-pills';
    wrap.setAttribute('role', 'list');
    pills.forEach((node) => {
      const src = anchorOf(node);
      const a = document.createElement('a');
      a.className = 'cat-pill';
      a.href = src.getAttribute('href') || '#';
      a.setAttribute('role', 'listitem');
      a.textContent = src.textContent.trim();
      // active pill: emphasised in authoring, or first pill as fallback
      if (src.querySelector('strong, em') || node.querySelector('strong, em')) {
        a.setAttribute('aria-current', 'true');
      }
      wrap.append(a);
    });
    if (!wrap.querySelector('[aria-current="true"]') && wrap.firstChild) {
      wrap.firstChild.setAttribute('aria-current', 'true');
    }
    container.append(wrap);
  }

  block.replaceChildren(container);
}
