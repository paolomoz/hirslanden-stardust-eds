/**
 * doctor-search block (Ärztesuche) — DYNAMIC, index-driven.
 *
 * Renders the full doctor directory from the `doctors` query-index
 * (/de/corporate/aerzte/query-index.json) with live filtering by name, specialty
 * and clinic, plus "load more" pagination (the index can hold thousands of rows).
 * It is the on-site search target for the hero-search form (reads ?q= / ?specialty=
 * / ?clinic= from the URL on load).
 *
 * Authoring: an EMPTY block — `<div class="doctor-search"></div>`. All content is
 * fetched; nothing is authored. An optional first cell may override the index path.
 */

const INDEX_DEFAULT = '/de/corporate/aerzte/query-index.json';
const PAGE_SIZE = 24;
const FETCH_LIMIT = 500;

const norm = (s) => (s || '').toLowerCase()
  .replace(/[äöü]/g, (c) => ({ ä: 'a', ö: 'o', ü: 'u' }[c]))
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

const thumb = (url) => {
  if (!url) return null;
  try {
    const u = new URL(url, window.location.origin);
    u.searchParams.set('width', '600');
    u.searchParams.set('format', 'webply');
    u.searchParams.set('optimize', 'medium');
    return u.toString();
  } catch {
    return url;
  }
};

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

function distinct(rows, key) {
  return [...new Set(rows.map((r) => (r[key] || '').trim()).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, 'de'));
}

function buildCard(doc) {
  const li = document.createElement('li');
  li.className = 'doctor-card';

  const a = document.createElement('a');
  a.className = 'doctor-card-link';
  a.href = doc.path;

  const media = document.createElement('div');
  media.className = 'doctor-card-media';
  const src = thumb(doc.image);
  if (src) {
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.src = src;
    img.alt = doc.title || '';
    img.width = 300;
    img.height = 300;
    media.append(img);
  } else {
    media.classList.add('placeholder-media');
  }
  a.append(media);

  const body = document.createElement('div');
  body.className = 'doctor-card-body';
  const h3 = document.createElement('h3');
  h3.className = 'doctor-card-name';
  h3.textContent = doc.title || '';
  body.append(h3);
  if (doc.specialty) {
    const sp = document.createElement('p');
    sp.className = 'doctor-card-specialty';
    sp.textContent = doc.specialty;
    body.append(sp);
  }
  if (doc.clinic) {
    const cl = document.createElement('p');
    cl.className = 'doctor-card-clinic';
    cl.textContent = doc.clinic;
    body.append(cl);
  }
  a.append(body);
  li.append(a);
  return li;
}

export default async function decorate(block) {
  const override = block.querySelector(':scope > div > div')?.textContent.trim();
  const indexPath = override && override.startsWith('/') ? override : INDEX_DEFAULT;

  const container = document.createElement('div');
  container.className = 'container';

  const filter = document.createElement('div');
  filter.className = 'filter-bar doctor-filters';
  filter.setAttribute('role', 'search');
  filter.setAttribute('aria-label', 'Ärztinnen und Ärzte filtern');
  filter.innerHTML = `
    <div class="filter-group">
      <label for="ds-keyword">Name</label>
      <input type="search" id="ds-keyword" name="q" placeholder="Name suchen" autocomplete="off">
    </div>
    <div class="filter-group">
      <label for="ds-specialty">Fachgebiet</label>
      <select id="ds-specialty"><option value="">Alle Fachgebiete</option></select>
    </div>
    <div class="filter-group">
      <label for="ds-clinic">Klinik</label>
      <select id="ds-clinic"><option value="">Alle Kliniken</option></select>
    </div>
    <div class="filter-count" aria-live="polite"><strong>0</strong> Ärztinnen und Ärzte</div>`;
  container.append(filter);

  const grid = document.createElement('ul');
  grid.className = 'doctor-grid';
  grid.setAttribute('role', 'list');
  container.append(grid);

  const more = document.createElement('div');
  more.className = 'doctor-search-more';
  const moreBtn = document.createElement('button');
  moreBtn.type = 'button';
  moreBtn.className = 'btn btn--secondary';
  moreBtn.textContent = 'Mehr anzeigen';
  more.append(moreBtn);
  container.append(more);

  const status = document.createElement('p');
  status.className = 'doctor-search-status';
  status.textContent = 'Ärztinnen und Ärzte werden geladen …';
  container.append(status);

  block.replaceChildren(container);

  const rows = await fetchIndex(indexPath);
  if (!rows.length) {
    status.textContent = 'Derzeit sind keine Einträge verfügbar.';
    more.hidden = true;
    return;
  }
  status.remove();

  const kwInput = filter.querySelector('#ds-keyword');
  const spSel = filter.querySelector('#ds-specialty');
  const clSel = filter.querySelector('#ds-clinic');
  const countEl = filter.querySelector('.filter-count strong');

  distinct(rows, 'specialty').forEach((v) => {
    const o = document.createElement('option');
    o.value = v; o.textContent = v; spSel.append(o);
  });
  distinct(rows, 'clinic').forEach((v) => {
    const o = document.createElement('option');
    o.value = v; o.textContent = v; clSel.append(o);
  });

  // seed from URL params (hero-search hand-off)
  const params = new URLSearchParams(window.location.search);
  if (params.get('q')) kwInput.value = params.get('q');
  if (params.get('specialty')) spSel.value = params.get('specialty');
  if (params.get('clinic')) clSel.value = params.get('clinic');

  let shown = 0;
  let filtered = rows;

  function render(reset) {
    if (reset) { grid.replaceChildren(); shown = 0; }
    const next = filtered.slice(shown, shown + PAGE_SIZE);
    next.forEach((doc) => grid.append(buildCard(doc)));
    shown += next.length;
    more.hidden = shown >= filtered.length;
    countEl.textContent = filtered.length;
  }

  function applyFilters() {
    const kw = norm(kwInput.value);
    const sp = spSel.value;
    const cl = clSel.value;
    filtered = rows.filter((r) => {
      if (sp && (r.specialty || '') !== sp) return false;
      if (cl && (r.clinic || '') !== cl) return false;
      if (kw && !norm(r.title).includes(kw)) return false;
      return true;
    });
    render(true);
  }

  kwInput.addEventListener('input', applyFilters);
  spSel.addEventListener('change', applyFilters);
  clSel.addEventListener('change', applyFilters);
  moreBtn.addEventListener('click', () => render(false));

  applyFilters();
}
