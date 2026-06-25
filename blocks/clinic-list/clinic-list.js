/**
 * Clinic List block — filterable grid of clinic cards.
 *
 * Authoring rows — each row is one clinic card:
 *   Col 1: image (picture/img)
 *   Col 2: name (linked heading)
 *   Col 3: address
 *   Col 4: phone (optional)
 *   Col 5: CTA link (optional — defaults to the name link)
 *
 * Config row (optional, prepend with "config" text in first cell):
 *   "config" | filter-label-keyword | filter-label-canton | filter-label-city
 *
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // Separate config row from data rows
  let kwLabel = 'Stichwort/Name';
  let cantonLabel = 'Kanton';
  let cityLabel = 'Stadt';
  const dataRows = [];

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    if (cells[0]?.textContent.trim().toLowerCase() === 'config') {
      kwLabel = cells[1]?.textContent.trim() || kwLabel;
      cantonLabel = cells[2]?.textContent.trim() || cantonLabel;
      cityLabel = cells[3]?.textContent.trim() || cityLabel;
    } else {
      dataRows.push(row);
    }
  });

  block.innerHTML = '';

  // Build filter bar
  const filterBar = document.createElement('div');
  filterBar.className = 'clinic-list-filter';
  filterBar.setAttribute('role', 'search');
  filterBar.setAttribute('aria-label', 'Kliniken filtern');

  filterBar.innerHTML = `
    <div class="clinic-list-filter-group">
      <label for="cl-kw">${kwLabel}</label>
      <input type="search" id="cl-kw" name="q" placeholder="${kwLabel}" autocomplete="off">
    </div>
    <div class="clinic-list-filter-group">
      <label for="cl-canton">${cantonLabel}</label>
      <div class="clinic-list-select-wrap">
        <select id="cl-canton" name="canton" aria-label="Nach ${cantonLabel} filtern">
          <option value="">${cantonLabel}</option>
          <option value="aargau">Aargau</option>
          <option value="basel-land">Basel-Land</option>
          <option value="bern">Bern</option>
          <option value="geneva">Geneva</option>
          <option value="luzern">Luzern</option>
          <option value="st-gallen">St. Gallen</option>
          <option value="vaud">Vaud</option>
          <option value="zug">Zug</option>
          <option value="zuerich">Z&uuml;rich</option>
        </select>
      </div>
    </div>
    <div class="clinic-list-filter-group">
      <label for="cl-city">${cityLabel}</label>
      <div class="clinic-list-select-wrap">
        <select id="cl-city" name="city" aria-label="Nach ${cityLabel} filtern">
          <option value="">Stadt</option>
          <option value="aarau">Aarau</option>
          <option value="bern">Bern</option>
          <option value="biel">Biel</option>
          <option value="cham">Cham</option>
          <option value="chene-bougeries">Chene-Bougeries</option>
          <option value="geneva">Geneva</option>
          <option value="lausanne">Lausanne</option>
          <option value="luzern">Luzern</option>
          <option value="muenchenstein">M&uuml;nchenstein</option>
          <option value="st-gallen">St. Gallen</option>
          <option value="meggen">Meggen</option>
          <option value="zuerich">Z&uuml;rich</option>
        </select>
      </div>
    </div>
    <div class="clinic-list-count" aria-live="polite">
      <strong>${dataRows.length}</strong> Kliniken
    </div>
  `;

  block.append(filterBar);

  // Results heading
  const resultsHead = document.createElement('h2');
  resultsHead.className = 'clinic-list-results-heading';
  resultsHead.innerHTML = `Kliniken<span class="clinic-list-count-num" aria-label="${dataRows.length} Ergebnisse">${dataRows.length}</span>`;
  block.append(resultsHead);

  // Build clinic grid
  const grid = document.createElement('ul');
  grid.className = 'clinic-list-grid';
  grid.setAttribute('role', 'list');
  grid.setAttribute('aria-label', 'Kliniken-&Uuml;bersicht');

  dataRows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const [imgCell, nameCell, addrCell, phoneCell, ctaCell] = cells;

    const li = document.createElement('li');
    li.className = 'clinic-card';

    // Media
    const img = imgCell?.querySelector('img, picture');
    if (img) {
      const media = document.createElement('div');
      media.className = 'clinic-card-media';
      const wrapper = img.closest('picture') || img;
      media.append(wrapper.cloneNode(true));
      // Ensure lazy loading except first card
      const imgEl = media.querySelector('img');
      if (imgEl && !imgEl.getAttribute('loading')) imgEl.setAttribute('loading', 'lazy');
      li.append(media);
    }

    // Body
    const body = document.createElement('div');
    body.className = 'clinic-card-body';

    // Name
    const nameLink = nameCell?.querySelector('a');
    const nameH3 = document.createElement('h3');
    nameH3.className = 'clinic-card-name';
    if (nameLink) {
      const a = document.createElement('a');
      a.href = nameLink.href;
      a.textContent = nameLink.textContent.trim();
      nameH3.append(a);
    } else {
      nameH3.textContent = nameCell?.textContent?.trim() || '';
    }
    body.append(nameH3);

    // Address
    if (addrCell?.textContent?.trim()) {
      const addr = document.createElement('p');
      addr.className = 'clinic-card-address';
      addr.textContent = addrCell.textContent.trim();
      body.append(addr);
    }

    // Phone
    const phoneLink = phoneCell?.querySelector('a');
    if (phoneLink) {
      const ph = document.createElement('p');
      ph.className = 'clinic-card-phone';
      const pa = document.createElement('a');
      pa.href = phoneLink.href;
      pa.textContent = phoneLink.textContent.trim();
      ph.append(pa);
      body.append(ph);
    }

    // CTA button
    const ctaLink = ctaCell?.querySelector('a') || nameLink;
    if (ctaLink) {
      const ctaDiv = document.createElement('div');
      ctaDiv.className = 'clinic-card-cta';
      const btn = document.createElement('a');
      btn.className = 'btn btn--primary';
      btn.href = ctaLink.href;
      btn.textContent = ctaCell?.querySelector('a')?.textContent?.trim() || 'Zur Website';
      ctaDiv.append(btn);
      body.append(ctaDiv);
    }

    li.append(body);
    grid.append(li);
  });

  block.append(grid);

  // Filter logic
  const kwInput = block.querySelector('#cl-kw');
  const cantonSel = block.querySelector('#cl-canton');
  const citySel = block.querySelector('#cl-city');
  const countStrong = block.querySelector('.clinic-list-filter .clinic-list-count strong');
  const countNum = block.querySelector('.clinic-list-count-num');
  const cards = [...grid.querySelectorAll('.clinic-card')];

  const normalize = (s) => (s || '').toLowerCase().replace(/[äöü]/g, (c) => ({ ä: 'a', ö: 'o', ü: 'u' }[c] || c));

  const cantonMap = {
    aargau: ['aarau'],
    'basel-land': ['münchenstein', 'munchenstein'],
    bern: ['bern', 'biel'],
    geneva: ['geneva', 'genf', 'chene-bougeries', 'chene bougeries'],
    luzern: ['luzern', 'meggen'],
    'st-gallen': ['st.gallen', 'st. gallen'],
    vaud: ['lausanne'],
    zug: ['cham', 'zug'],
    zuerich: ['zürich', 'zurich'],
  };

  const cityMap = {
    aarau: 'aarau',
    bern: 'bern',
    biel: 'biel',
    cham: 'cham',
    'chene-bougeries': 'chene',
    geneva: 'geneva',
    lausanne: 'lausanne',
    luzern: 'luzern',
    muenchenstein: 'munchenstein',
    'st-gallen': 'gallen',
    meggen: 'meggen',
    zuerich: 'zurich',
  };

  const applyFilters = () => {
    const kw = normalize(kwInput.value.trim());
    const canton = cantonSel.value;
    const city = citySel.value;
    let visible = 0;

    cards.forEach((card) => {
      const name = normalize(card.querySelector('.clinic-card-name')?.textContent);
      const addr = normalize(card.querySelector('.clinic-card-address')?.textContent || '');
      const matchKw = !kw || name.includes(kw) || addr.includes(kw);
      const cantonCities = cantonMap[canton] || [];
      const matchCanton = !canton || cantonCities.some((t) => addr.includes(normalize(t)));
      const matchCity = !city || (cityMap[city] && addr.includes(cityMap[city]));
      const show = matchKw && matchCanton && matchCity;
      card.style.display = show ? '' : 'none';
      if (show) visible += 1;
    });

    if (countStrong) countStrong.textContent = String(visible);
    if (countNum) {
      countNum.textContent = String(visible);
      countNum.setAttribute('aria-label', `${visible} Ergebnisse`);
    }
  };

  if (kwInput) kwInput.addEventListener('input', applyFilters);
  if (cantonSel) cantonSel.addEventListener('change', applyFilters);
  if (citySel) citySel.addEventListener('change', applyFilters);
}
