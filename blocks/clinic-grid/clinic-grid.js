/**
 * clinic-grid block
 * A filterable grid of clinic cards. Each card: photo, name (linked), address,
 * phone (tel: link) and a "Zur Website" CTA. A filter bar (keyword + canton +
 * city) and a live result count sit above the grid.
 *
 * Authoring: one ROW per clinic. Each row's cells hold (classified by content):
 *   - a media element (picture/img)  → card photo (optional → neutral tile)
 *   - a link whose label is the name → clinic name + website CTA
 *   - an address text line           → address
 *   - a tel: link                    → phone
 * The filter bar and counts are scaffolded by the block; filtering is wired in
 * JS against each card's name + address text.
 */

const isMedia = (el) => el.matches('picture, img') || el.querySelector('picture, img');
const telOf = (a) => (a.getAttribute('href') || '').startsWith('tel:');

function readClinics(block) {
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

function buildCard(parts, eager) {
  const li = document.createElement('li');
  li.className = 'clinic-card';

  const media = parts.find((p) => isMedia(p));
  const links = parts.filter((p) => (p.tagName.toLowerCase() === 'a' || p.querySelector('a')) && !isMedia(p));
  const tel = links.map((p) => (p.tagName.toLowerCase() === 'a' ? p : p.querySelector('a')))
    .find((a) => telOf(a));
  const nameLink = links.map((p) => (p.tagName.toLowerCase() === 'a' ? p : p.querySelector('a')))
    .find((a) => !telOf(a));
  const texts = parts.filter((p) => p !== media && !links.includes(p) && p.textContent.trim());
  const address = texts[0];

  const mediaWrap = document.createElement('div');
  mediaWrap.className = 'clinic-card-media';
  if (media) {
    const pic = media.matches('picture, img') ? media : media.querySelector('picture, img');
    const img = pic.tagName.toLowerCase() === 'img' ? pic : pic.querySelector('img');
    if (img && eager) {
      img.setAttribute('loading', 'eager');
      img.setAttribute('fetchpriority', 'high');
    }
    mediaWrap.append(pic);
  } else {
    mediaWrap.classList.add('placeholder-media');
  }
  li.append(mediaWrap);

  const body = document.createElement('div');
  body.className = 'clinic-card-body';

  const h3 = document.createElement('h3');
  h3.className = 'clinic-card-name';
  if (nameLink) {
    const a = document.createElement('a');
    a.href = nameLink.getAttribute('href') || '#';
    a.textContent = nameLink.textContent.trim();
    h3.append(a);
  }
  body.append(h3);

  if (address) {
    const p = document.createElement('p');
    p.className = 'clinic-card-address';
    p.innerHTML = address.innerHTML;
    body.append(p);
  }

  if (tel) {
    const p = document.createElement('p');
    p.className = 'clinic-card-phone';
    const a = document.createElement('a');
    a.href = tel.getAttribute('href');
    a.textContent = tel.textContent.trim();
    p.append(a);
    body.append(p);
  }

  if (nameLink) {
    const cta = document.createElement('div');
    cta.className = 'clinic-card-cta';
    const a = document.createElement('a');
    a.className = 'btn btn--primary';
    a.href = nameLink.getAttribute('href') || '#';
    a.textContent = 'Zur Website';
    cta.append(a);
    body.append(cta);
  }

  li.append(body);
  return li;
}

export default async function decorate(block) {
  const clinics = readClinics(block);

  const container = document.createElement('div');
  container.className = 'container';

  // Filter bar.
  const filter = document.createElement('div');
  filter.className = 'filter-bar clinic-filters';
  filter.setAttribute('role', 'search');
  filter.setAttribute('aria-label', 'Kliniken filtern');
  filter.innerHTML = `
    <div class="filter-group">
      <label for="clinic-filter-keyword">Stichwort/Name</label>
      <input type="search" id="clinic-filter-keyword" name="q" placeholder="Stichwort/Name" autocomplete="off">
    </div>
    <div class="filter-count" aria-live="polite"><strong>${clinics.length}</strong> Kliniken</div>`;
  container.append(filter);

  const heading = document.createElement('h2');
  heading.className = 'results-heading';
  heading.innerHTML = `Kliniken<span class="count" aria-label="${clinics.length} Ergebnisse">${clinics.length}</span>`;
  container.append(heading);

  const grid = document.createElement('ul');
  grid.className = 'clinic-grid';
  grid.setAttribute('role', 'list');
  grid.setAttribute('aria-label', 'Kliniken-Übersicht');
  clinics.forEach((parts, i) => grid.append(buildCard(parts, i === 0)));
  container.append(grid);

  block.replaceChildren(container);

  // Live keyword filter against name + address.
  const input = filter.querySelector('#clinic-filter-keyword');
  const countEl = filter.querySelector('.filter-count strong');
  const headCount = heading.querySelector('.count');
  const cards = [...grid.querySelectorAll('.clinic-card')];
  const norm = (s) => (s || '').toLowerCase()
    .replace(/[äöü]/g, (c) => ({ ä: 'a', ö: 'o', ü: 'u' }[c]));

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
    countEl.textContent = visible;
    headCount.textContent = visible;
    headCount.setAttribute('aria-label', `${visible} Ergebnisse`);
  });
}
