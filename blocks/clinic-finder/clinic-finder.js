/**
 * Clinic Finder block — map placeholder + clinic list with CTA
 * Authored row structure:
 *   Row 1: [map image or placeholder text]
 *   Rows 2+: [clinic name] | [clinic URL]   (one per clinic)
 *   Last row: [primary CTA link] | [secondary CTA link]
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const layout = document.createElement('div');
  layout.className = 'clinic-finder-layout';

  // Map side
  const mapDiv = document.createElement('div');
  mapDiv.className = 'clinic-finder-map';

  // List side
  const listSide = document.createElement('div');
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Unsere Kliniken');
  const ul = document.createElement('ul');
  ul.className = 'clinic-list clinic-list-grid';

  let moreDiv = null;

  rows.forEach((row, i) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    if (!cells.length) return;

    // First row: map
    if (i === 0) {
      const img = cells[0].querySelector('img, picture');
      if (img) {
        mapDiv.append(img.cloneNode(true));
      } else {
        const ph = document.createElement('div');
        ph.className = 'clinic-finder-map-placeholder';
        ph.textContent = cells[0].textContent.trim() || 'Standorte der Hirslanden-Gruppe';
        mapDiv.append(ph);
      }
      return;
    }

    // Rows with two links = CTA row (last)
    const links = [...cells[0].querySelectorAll('a'), ...(cells[1] ? cells[1].querySelectorAll('a') : [])];
    if (links.length >= 1 && !cells[0].querySelector('h3, strong')) {
      // Check if this looks like a CTA row (text only, no clinic pattern)
      const allText = cells.map((c) => c.textContent.trim()).join('');
      if (allText && links.length >= 1 && i === rows.length - 1) {
        moreDiv = document.createElement('div');
        moreDiv.className = 'clinic-finder-more';
        links.forEach((a, li) => {
          if (li === 0) {
            a.className = 'btn btn--primary';
          } else {
            a.className = 'readmore';
          }
          moreDiv.append(a.cloneNode(true));
        });
        return;
      }
    }

    // Regular clinic row
    const clinicLink = cells[0].querySelector('a') || (cells[1] && cells[1].querySelector('a'));
    const clinicName = cells[0].textContent.trim();
    const clinicHref = clinicLink?.href || '#';

    const li = document.createElement('li');
    const a = document.createElement('a');
    a.className = 'clinic-list-item';
    a.href = clinicHref;

    const nameSpan = document.createElement('span');
    nameSpan.className = 'clinic-name';
    nameSpan.textContent = clinicName;

    const chevron = document.createElement('span');
    chevron.className = 'clinic-chevron';
    chevron.setAttribute('aria-hidden', 'true');
    chevron.textContent = '›';

    a.append(nameSpan, chevron);
    li.append(a);
    ul.append(li);
  });

  nav.append(ul);
  listSide.append(nav);
  if (moreDiv) listSide.append(moreDiv);

  layout.append(mapDiv, listSide);
  block.innerHTML = '';
  block.append(layout);
}
