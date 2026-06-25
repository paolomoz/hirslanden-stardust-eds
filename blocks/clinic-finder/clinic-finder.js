/**
 * clinic-finder block
 * A split layout: a section head (heading + intro), a static map placeholder
 * on the left, and a two-column list of clinic links on the right with a
 * primary CTA and a read-more link below.
 *
 * Authoring (flattened cell): an optional heading + intro paragraph, then a
 * list of clinic links (each a plain <a>), then the action links — the first
 * styled .btn--primary CTA and any trailing read-more link. A clinic link is
 * any link whose text is a clinic name; the CTAs are detected as the final
 * one or two links. To disambiguate, author the CTAs after the clinic list.
 * The map renders as a neutral placeholder (author drops an image/map later).
 */

const isHeading = (el) => /^h[1-6]$/.test(el.tagName.toLowerCase());
const CHEVRON = '&rsaquo;';

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

function asAnchor(el) {
  return el.tagName.toLowerCase() === 'a' ? el : el.querySelector('a');
}

export default async function decorate(block) {
  const nodes = collectNodes(block);

  const heading = nodes.find((n) => isHeading(n));
  const linkNodes = nodes.filter((n) => asAnchor(n));
  const intro = nodes.find((n) => n !== heading && !asAnchor(n) && n.textContent.trim());

  // The last 1–2 links are the actions (CTA + optional read-more).
  const actionCount = Math.min(2, linkNodes.length);
  const actions = linkNodes.slice(linkNodes.length - actionCount);
  const clinicLinks = linkNodes.slice(0, linkNodes.length - actionCount);

  const container = document.createElement('div');
  container.className = 'container';

  if (heading || intro) {
    const head = document.createElement('div');
    head.className = 'section-head';
    if (heading) {
      const h = document.createElement('h2');
      h.innerHTML = heading.innerHTML;
      head.append(h);
    }
    if (intro) {
      const p = document.createElement('p');
      p.innerHTML = intro.innerHTML;
      head.append(p);
    }
    container.append(head);
  }

  const layout = document.createElement('div');
  layout.className = 'clinic-finder-layout';

  // map placeholder
  const map = document.createElement('div');
  map.className = 'clinic-finder-map';
  const ph = document.createElement('div');
  ph.className = 'placeholder-media placeholder-media--map';
  ph.textContent = 'Standorte der Hirslanden-Gruppe';
  map.append(ph);
  layout.append(map);

  // clinic list + actions
  const side = document.createElement('div');

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Unsere Kliniken');
  const ul = document.createElement('ul');
  ul.className = 'clinic-list clinic-list-grid';

  clinicLinks.forEach((node) => {
    const a = asAnchor(node);
    const li = document.createElement('li');
    const item = document.createElement('a');
    item.className = 'clinic-list-item';
    item.href = a.getAttribute('href') || '#';
    item.innerHTML = `<span class="clinic-name">${a.textContent.trim()}</span><span class="clinic-chevron" aria-hidden="true">${CHEVRON}</span>`;
    li.append(item);
    ul.append(li);
  });
  nav.append(ul);
  side.append(nav);

  if (actions.length) {
    const more = document.createElement('div');
    more.className = 'clinic-finder-more';
    actions.forEach((node, i) => {
      const a = asAnchor(node);
      const link = document.createElement('a');
      link.href = a.getAttribute('href') || '#';
      link.innerHTML = a.innerHTML;
      link.className = i === 0 ? 'btn btn--primary' : 'readmore';
      more.append(link);
    });
    side.append(more);
  }

  layout.append(side);
  container.append(layout);
  block.replaceChildren(container);
}
