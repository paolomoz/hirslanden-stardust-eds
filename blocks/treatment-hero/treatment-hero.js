export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  const cells = [...rows[0].querySelectorAll(':scope > div')];
  const [eyebrowCell, headingCell, leadCell, trustCell, backCell] = cells;

  const container = document.createElement('div');
  container.className = 'container';

  const copy = document.createElement('div');
  copy.className = 'td-hero-copy';

  if (eyebrowCell) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 'eyebrow';
    eyebrow.textContent = eyebrowCell.textContent.trim();
    copy.append(eyebrow);
  }

  if (headingCell) {
    const h1 = headingCell.querySelector('h1') || document.createElement('h1');
    if (!headingCell.querySelector('h1')) h1.textContent = headingCell.textContent.trim();
    copy.append(h1);
  }

  if (leadCell) {
    const lead = document.createElement('p');
    lead.className = 'lead';
    lead.innerHTML = leadCell.innerHTML;
    copy.append(lead);
  }

  if (trustCell) {
    const img = trustCell.querySelector('img');
    const link = trustCell.querySelector('a');
    const nameText = link?.textContent.trim() || trustCell.textContent.trim();

    const trust = document.createElement('div');
    trust.className = 'td-trust';
    trust.setAttribute('aria-label', 'Medizinisch geprüft');

    if (img) {
      const imgWrap = document.createElement('div');
      imgWrap.className = 'td-trust-img';
      img.loading = 'eager';
      imgWrap.append(img);
      trust.append(imgWrap);
    }

    const meta = document.createElement('div');
    meta.className = 'td-trust-meta';

    const label = document.createElement('span');
    label.className = 'td-trust-label';
    label.textContent = 'Medizinisch geprüft';
    meta.append(label);

    if (link) {
      link.className = 'td-trust-name';
      meta.append(link);
    } else {
      const span = document.createElement('span');
      span.className = 'td-trust-name';
      span.textContent = nameText;
      meta.append(span);
    }

    trust.append(meta);
    copy.append(trust);
  }

  container.append(copy);

  if (backCell) {
    const link = backCell.querySelector('a') || document.createElement('a');
    if (!backCell.querySelector('a')) {
      link.href = '#';
      link.textContent = backCell.textContent.trim();
    }
    link.className = 'td-hero-back';
    link.insertAdjacentHTML('afterbegin', '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>');
    container.append(link);
  }

  block.innerHTML = '';
  block.append(container);
}
