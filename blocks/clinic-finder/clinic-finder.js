/**
 * clinic-finder block — DYNAMIC clinic list, authored frame.
 *
 * A split layout: a section head (heading + intro), a static map placeholder on
 * the left, and a two-column list of clinic links on the right with a primary
 * CTA and a read-more link below.
 *
 * The clinic LIST is fetched from the `clinics` query-index
 * (/de/clinics-index.json) and rendered as name links (sorted A–Z), each linking
 * to the clinic page `path`. The authored TRAILING CTAs (the final one or two
 * links — primary CTA + optional read-more) are PRESERVED from the authored
 * content. If the index fetch fails or returns empty, the authored clinic links
 * are used as a FALLBACK so the block still works.
 *
 * Authoring (flattened cell): an optional heading + intro paragraph, then a list
 * of clinic links (each a plain <a>), then the action links — the first styled
 * .btn--primary CTA and any trailing read-more link. Author the CTAs AFTER the
 * clinic list so they are detected as the final one or two links.
 */

const INDEX_DEFAULT = '/de/clinics-index.json';
const FETCH_LIMIT = 500;

const isHeading = (el) => /^h[1-6]$/.test(el.tagName.toLowerCase());
const CHEVRON = '&rsaquo;';

async function fetchIndex(path) {
  const rows = [];
  let offset = 0;
  let total = Infinity;
  while (offset < total) {
    // eslint-disable-next-line no-await-in-loop
    const resp = await fetch(`${path}?limit=${FETCH_LIMIT}&offset=${offset}`);
    if (!resp.ok) break;
    // eslint-disable-next-line no-await-in-loop
    const json = await resp.json();
    rows.push(...(json.data || []));
    total = json.total ?? rows.length;
    offset += FETCH_LIMIT;
    if (!json.data || json.data.length === 0) break;
  }
  return rows;
}

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

function clinicListItem(title, href) {
  const li = document.createElement('li');
  const item = document.createElement('a');
  item.className = 'clinic-list-item';
  item.href = href || '#';
  item.innerHTML = `<span class="clinic-name">${title}</span><span class="clinic-chevron" aria-hidden="true">${CHEVRON}</span>`;
  li.append(item);
  return li;
}

export default async function decorate(block) {
  const nodes = collectNodes(block);

  const heading = nodes.find((n) => isHeading(n));
  const linkNodes = nodes.filter((n) => asAnchor(n));
  const intro = nodes.find((n) => n !== heading && !asAnchor(n) && n.textContent.trim());

  // The last 1–2 links are the actions (CTA + optional read-more); keep authored.
  const actionCount = Math.min(2, linkNodes.length);
  const actions = linkNodes.slice(linkNodes.length - actionCount);
  const authoredClinicLinks = linkNodes.slice(0, linkNodes.length - actionCount);

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

  // Populate the clinic list dynamically; fall back to authored links.
  const rows = await fetchIndex(INDEX_DEFAULT);
  if (rows.length) {
    rows
      .map((r) => ({ title: (r.title || '').trim(), path: r.path }))
      .filter((c) => c.title && c.path)
      .sort((a, b) => a.title.localeCompare(b.title, 'de'))
      .forEach((c) => ul.append(clinicListItem(c.title, c.path)));
  }

  // Fallback: no index rows rendered → use the authored clinic links.
  if (!ul.children.length) {
    authoredClinicLinks.forEach((node) => {
      const a = asAnchor(node);
      ul.append(clinicListItem(a.textContent.trim(), a.getAttribute('href')));
    });
  }
}
