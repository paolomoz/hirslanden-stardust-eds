export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  // Reabsorb preceding section head (eyebrow + h2 + optional p)
  let sectionHead = null;
  const prev = block.closest('.section')?.querySelector('.default-content-wrapper');
  if (prev) {
    sectionHead = document.createElement('div');
    sectionHead.className = 'section-head';
    sectionHead.append(...prev.childNodes);
    prev.remove();
  }

  const grid = document.createElement('div');
  grid.className = 'td-spec-grid';

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const [imgCell, specCell, nameCell, locCell, urlCell] = cells;

    const href = urlCell?.querySelector('a')?.href || urlCell?.textContent.trim() || '#';

    const card = document.createElement('article');
    card.className = 'td-spec-card';

    const mediaDiv = document.createElement('div');
    mediaDiv.className = 'td-spec-card-media';
    const img = imgCell?.querySelector('img');
    if (img) {
      img.loading = 'lazy';
      img.style.cssText = 'width:100%;height:auto;display:block;object-fit:cover;aspect-ratio:1/1;';
      mediaDiv.append(img);
    }
    card.append(mediaDiv);

    const body = document.createElement('div');
    body.className = 'td-spec-card-body';

    if (specCell) {
      const spec = document.createElement('span');
      spec.className = 'td-spec-card-spec';
      spec.textContent = specCell.textContent.trim();
      body.append(spec);
    }

    if (nameCell) {
      const h3 = document.createElement('h3');
      h3.textContent = nameCell.textContent.trim();
      body.append(h3);
    }

    if (locCell) {
      const loc = document.createElement('span');
      loc.className = 'td-spec-card-loc';
      loc.textContent = locCell.textContent.trim();
      body.append(loc);
    }

    const readmore = document.createElement('a');
    readmore.className = 'readmore';
    readmore.href = href;
    readmore.textContent = 'Profil ansehen';
    body.append(readmore);

    card.append(body);
    grid.append(card);
  });

  const cta = document.createElement('div');
  cta.className = 'specialists-cta';
  cta.innerHTML = '<a class="btn btn--primary" href="https://www.hirslanden.ch/de/corporate/aerzte-und-pflege/aerztesuche.html">Alle Spezialisten anzeigen</a>';

  block.innerHTML = '';
  if (sectionHead) block.append(sectionHead);
  block.append(grid, cta);
}
