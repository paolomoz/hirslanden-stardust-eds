export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  // Expected layout: one row, up to 3 cells: [copy (h2+p)] | [phone] | [action links]
  // Or a single cell with all content.
  const cells = [...rows[0].querySelectorAll(':scope > div')];

  const wrap = document.createElement('div');
  wrap.className = 'container';

  if (cells.length >= 2) {
    const [copyCell, phoneCell, actionsCell] = cells;

    const copy = document.createElement('div');
    copy.className = 'contact-cta-copy';
    if (copyCell) copy.append(...copyCell.childNodes);
    wrap.append(copy);

    if (phoneCell) {
      const phoneLink = phoneCell.querySelector('a[href^="tel"]');
      const phone = document.createElement('div');
      phone.className = 'contact-cta-phone';

      const label = document.createElement('span');
      label.className = 'phone-label';
      label.textContent = 'Telefon';
      phone.append(label);

      if (phoneLink) {
        phoneLink.className = 'phone-num';
        phone.append(phoneLink);
      } else {
        const span = document.createElement('span');
        span.className = 'phone-num';
        span.textContent = phoneCell.textContent.trim();
        phone.append(span);
      }
      wrap.append(phone);
    }

    if (actionsCell) {
      const actions = document.createElement('div');
      actions.className = 'contact-cta-actions';
      [...actionsCell.childNodes].forEach((n) => actions.append(n.cloneNode(true)));
      if (actions.children.length) wrap.append(actions);
    }
  } else {
    // Single-cell fallback: promote all links as action buttons
    const [cell] = cells;
    const copy = document.createElement('div');
    copy.className = 'contact-cta-copy';
    const heading = cell?.querySelector('h2, h3');
    const para = cell?.querySelector('p:not(:has(a))');
    if (heading) copy.append(heading);
    if (para) copy.append(para);
    wrap.append(copy);

    const links = cell?.querySelectorAll('a') || [];
    if (links.length) {
      const actions = document.createElement('div');
      actions.className = 'contact-cta-actions';
      links.forEach((a) => { a.className = ''; actions.append(a); });
      wrap.append(actions);
    }
  }

  block.innerHTML = '';
  block.append(wrap);
}
