/**
 * clinic-grid block — DYNAMIC, index-driven.
 *
 * Renders a filterable grid of clinic cards from the `clinics` query-index
 * (/de/clinics-index.json). Each card: photo (or neutral tile), name (h3, linked
 * to the clinic page), address, phone (tel: link) and a "Zur Website" CTA. A
 * filter bar (keyword + canton) and a live result count sit above the grid.
 * Clinics are sorted A–Z by title.
 *
 * Index row fields: { path, title, image, canton, city, address, phone,
 * description }. `image` is an absolute og:image URL — rendered through thumb().
 *
 * Authoring: typically an EMPTY block. If authored rows exist they are used as a
 * FALLBACK when the index fetch fails or returns empty, so the page still works.
 * Each fallback row's cells hold (classified by content):
 *   - a media element (picture/img)  → card photo (optional → neutral tile)
 *   - a link whose label is the name → clinic name + website CTA
 *   - an address text line           → address
 *   - a tel: link                    → phone
 */

const INDEX_DEFAULT = '/de/clinics-index.json';
const FETCH_LIMIT = 500;

const isMedia = (el) => el.matches('picture, img') || el.querySelector('picture, img');
const telOf = (a) => (a.getAttribute('href') || '').startsWith('tel:');

const norm = (s) => (s || '').toLowerCase()
  .replace(/[äöü]/g, (c) => ({ ä: 'a', ö: 'o', ü: 'u' }[c]));

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

/* ---- authored-fallback parsing (the former static behaviour) ---- */

function readAuthoredRows(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  return rows.map((row) => {
    const parts = [];
    const cells = [...row.querySelectorAll(':scope > div')];
    (cells.length ? cells : [row]).forEach((cell) => {
      const kids = [...cell.children];
      if (kids.length === 0) {
        const text = cell.textContent.trim();
        if (text) {
          const p = document.createElement('p');
          p.innerHTML = cell.innerHTML;
          parts.push(p);
        }
        return;
      }
      kids.forEach((el) => parts.push(el));
    });
    return parts;
  }).filter((parts) => parts.length);
}

function buildAuthoredCard(parts, eager) {
  const links = parts.filter((p) => (p.tagName.toLowerCase() === 'a' || p.querySelector('a')) && !isMedia(p));
  const anchors = links.map((p) => (p.tagName.toLowerCase() === 'a' ? p : p.querySelector('a')));
  const tel = anchors.find((a) => telOf(a));
  const nameLink = anchors.find((a) => !telOf(a));
  const media = parts.find((p) => isMedia(p));
  const texts = parts.filter((p) => p !== media && !links.includes(p) && p.textContent.trim());
  const address = texts[0];

  const clinic = {
    title: nameLink ? nameLink.textContent.trim() : '',
    path: nameLink ? (nameLink.getAttribute('href') || '#') : '#',
    address: address ? address.innerHTML : '',
    phone: tel ? tel.textContent.trim() : '',
    phoneHref: tel ? tel.getAttribute('href') : '',
  };

  let pic = null;
  if (media) {
    pic = media.matches('picture, img') ? media : media.querySelector('picture, img');
  }
  // eslint-disable-next-line no-use-before-define
  return buildCard(clinic, eager, pic);
}

/* ---- card builder (shared by index + authored paths) ---- */

function buildCard(clinic, eager, authoredPic) {
  const li = document.createElement('li');
  li.className = 'clinic-card';

  const mediaWrap = document.createElement('div');
  mediaWrap.className = 'clinic-card-media';
  if (authoredPic) {
    const img = authoredPic.tagName.toLowerCase() === 'img' ? authoredPic : authoredPic.querySelector('img');
    if (img && eager) {
      img.setAttribute('loading', 'eager');
      img.setAttribute('fetchpriority', 'high');
    }
    mediaWrap.append(authoredPic);
  } else {
    const src = thumb(clinic.image);
    if (src) {
      const img = document.createElement('img');
      img.loading = eager ? 'eager' : 'lazy';
      if (eager) img.setAttribute('fetchpriority', 'high');
      img.src = src;
      img.alt = clinic.title || '';
      img.width = 600;
      img.height = 450;
      mediaWrap.append(img);
    } else {
      mediaWrap.classList.add('placeholder-media');
    }
  }
  li.append(mediaWrap);

  const body = document.createElement('div');
  body.className = 'clinic-card-body';

  const h3 = document.createElement('h3');
  h3.className = 'clinic-card-name';
  if (clinic.title) {
    const a = document.createElement('a');
    a.href = clinic.path || '#';
    a.textContent = clinic.title;
    h3.append(a);
  }
  body.append(h3);

  if (clinic.address) {
    const p = document.createElement('p');
    p.className = 'clinic-card-address';
    p.innerHTML = clinic.address;
    body.append(p);
  }

  if (clinic.phone) {
    const p = document.createElement('p');
    p.className = 'clinic-card-phone';
    const a = document.createElement('a');
    a.href = clinic.phoneHref || `tel:${clinic.phone.replace(/\s+/g, '')}`;
    a.textContent = clinic.phone;
    p.append(a);
    body.append(p);
  }

  if (clinic.title) {
    const cta = document.createElement('div');
    cta.className = 'clinic-card-cta';
    const a = document.createElement('a');
    a.className = 'btn btn--primary';
    a.href = clinic.path || '#';
    a.textContent = 'Zur Website';
    cta.append(a);
    body.append(cta);
  }

  li.append(body);
  return li;
}

export default async function decorate(block) {
  // Read authored rows BEFORE replacing the DOM, so we can fall back to them.
  const authoredRows = readAuthoredRows(block);

  const container = document.createElement('div');
  container.className = 'container';

  const filter = document.createElement('div');
  filter.className = 'filter-bar clinic-filters';
  filter.setAttribute('role', 'search');
  filter.setAttribute('aria-label', 'Kliniken filtern');
  filter.innerHTML = `
    <div class="filter-group">
      <label for="clinic-filter-keyword">Stichwort/Name</label>
      <input type="search" id="clinic-filter-keyword" name="q" placeholder="Stichwort/Name" autocomplete="off">
    </div>
    <div class="filter-group">
      <label for="clinic-filter-canton">Kanton</label>
      <select id="clinic-filter-canton"><option value="">Alle Kantone</option></select>
    </div>
    <div class="filter-count" aria-live="polite"><strong>0</strong> Kliniken</div>`;
  container.append(filter);

  const heading = document.createElement('h2');
  heading.className = 'results-heading';
  heading.innerHTML = 'Kliniken<span class="count" aria-label="0 Ergebnisse">0</span>';
  container.append(heading);

  const grid = document.createElement('ul');
  grid.className = 'clinic-grid';
  grid.setAttribute('role', 'list');
  grid.setAttribute('aria-label', 'Kliniken-Übersicht');
  container.append(grid);

  const status = document.createElement('p');
  status.className = 'clinic-grid-status';
  status.textContent = 'Kliniken werden geladen …';
  container.append(status);

  block.replaceChildren(container);

  const input = filter.querySelector('#clinic-filter-keyword');
  const cantonSel = filter.querySelector('#clinic-filter-canton');
  const cantonGroup = cantonSel.closest('.filter-group');
  const countEl = filter.querySelector('.filter-count strong');
  const headCount = heading.querySelector('.count');

  const setCounts = (n) => {
    countEl.textContent = n;
    headCount.textContent = n;
    headCount.setAttribute('aria-label', `${n} Ergebnisse`);
  };

  const rows = await fetchIndex(INDEX_DEFAULT);

  // --------- FALLBACK: render authored rows (former static behaviour) ---------
  if (!rows.length) {
    status.remove();
    if (cantonGroup) cantonGroup.hidden = true;
    authoredRows.forEach((parts, i) => grid.append(buildAuthoredCard(parts, i === 0)));
    const cards = [...grid.querySelectorAll('.clinic-card')];
    setCounts(cards.length);

    input.addEventListener('input', () => {
      const kw = norm(input.value.trim());
      let visible = 0;
      cards.forEach((card) => {
        const name = norm(card.querySelector('.clinic-card-name')?.textContent);
        const addr = norm(card.querySelector('.clinic-card-address')?.textContent);
        const show = !kw || name.includes(kw) || addr.includes(kw);
        card.style.display = show ? '' : 'none';
        if (show) visible += 1;
      });
      setCounts(visible);
    });
    return;
  }

  // --------- DYNAMIC: render from the index ----------
  status.remove();

  const clinics = rows
    .map((r) => ({
      title: (r.title || '').trim(),
      path: r.path,
      image: r.image,
      canton: (r.canton || '').trim(),
      city: (r.city || '').trim(),
      address: (r.address || '').trim(),
      phone: (r.phone || '').trim(),
    }))
    .sort((a, b) => a.title.localeCompare(b.title, 'de'));

  const cantons = distinct(clinics, 'canton');
  if (cantons.length) {
    cantons.forEach((v) => {
      const o = document.createElement('option');
      o.value = v;
      o.textContent = v;
      cantonSel.append(o);
    });
  } else if (cantonGroup) {
    cantonGroup.hidden = true;
  }

  let filtered = clinics;

  function render() {
    grid.replaceChildren();
    filtered.forEach((clinic, i) => grid.append(buildCard(clinic, i === 0)));
    setCounts(filtered.length);
  }

  function applyFilters() {
    const kw = norm(input.value.trim());
    const canton = cantonSel.value;
    filtered = clinics.filter((c) => {
      if (canton && c.canton !== canton) return false;
      if (kw) {
        const hay = `${norm(c.title)} ${norm(c.address)} ${norm(c.city)}`;
        if (!hay.includes(kw)) return false;
      }
      return true;
    });
    render();
  }

  input.addEventListener('input', applyFilters);
  cantonSel.addEventListener('change', applyFilters);

  applyFilters();
}
