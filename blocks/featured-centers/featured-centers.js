export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  let dataRows = rows;

  // Prefer default-content reabsorption; fall back to first heading row (back-compat)
  let sectionHead = null;
  const prev = block.closest('.block-content')?.previousElementSibling;
  if (prev && (prev.classList.contains('default-content') || prev.classList.contains('default-content-wrapper'))) {
    sectionHead = document.createElement('div');
    sectionHead.className = 'section-head';
    sectionHead.append(...prev.childNodes);
    prev.remove();
  } else if (rows.length && rows[0].querySelectorAll(':scope > div').length === 1) {
    const first = rows[0].querySelector(':scope > div');
    if (first?.querySelector('h2, h3')) {
      sectionHead = document.createElement('div');
      sectionHead.className = 'section-head';
      sectionHead.append(...first.childNodes);
      dataRows = rows.slice(1);
    }
  }

  const wrap = document.createElement('div');
  wrap.className = 'container';

  if (sectionHead) wrap.append(sectionHead);

  const layout = document.createElement('div');
  layout.className = 'fc-layout';

  dataRows.forEach((row, i) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const [mediaCell, bodyCell] = cells;
    const featured = i === 0;

    const link = bodyCell?.querySelector('a') || mediaCell?.querySelector('a');
    const card = document.createElement(link ? 'a' : 'div');
    card.className = featured ? 'fc-card-featured' : 'fc-card-compact';
    if (link) card.href = link.href;

    const media = document.createElement('div');
    media.className = 'fc-card-media';
    const img = mediaCell?.querySelector('img');
    if (img) media.append(img);
    card.append(media);

    const body = document.createElement('div');
    body.className = 'fc-card-body';

    if (bodyCell) {
      const paras = [...bodyCell.querySelectorAll('p')];
      const categoryPara = paras.find((p) => !p.querySelector('a') && p.textContent.length < 50);
      if (categoryPara) {
        const cat = document.createElement('span');
        cat.className = 'fc-card-category';
        cat.textContent = categoryPara.textContent.trim();
        body.append(cat);
      }

      const heading = bodyCell.querySelector('h2, h3, h4');
      const title = document.createElement('h3');
      title.className = 'fc-card-title';
      title.textContent = heading?.textContent?.trim() || link?.textContent?.trim() || '';
      body.append(title);

      const descPara = paras.find((p) => p !== categoryPara && !p.querySelector('a'));
      if (descPara && featured) {
        const p = document.createElement('p');
        p.textContent = descPara.textContent.trim();
        body.append(p);
      }

      if (link) {
        const rm = document.createElement('a');
        rm.className = 'readmore';
        rm.href = link.href;
        rm.textContent = 'Mehr erfahren';
        body.append(rm);
      }
    }

    card.append(body);
    layout.append(card);
  });

  wrap.append(layout);
  block.innerHTML = '';
  block.append(wrap);
}
