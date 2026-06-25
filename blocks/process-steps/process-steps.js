/**
 * Process Steps block — numbered step cards
 * Authored row structure (one row per step):
 *   Row: [step title] | [step description]
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const grid = document.createElement('div');
  grid.className = 'process-steps-grid';

  rows.forEach((row, i) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const titleText = cells[0]?.textContent?.trim() || '';

    const item = document.createElement('div');
    item.className = 'process-step-item';

    const num = document.createElement('span');
    num.className = 'process-step-number';
    num.setAttribute('aria-hidden', 'true');
    num.textContent = String(i + 1);
    item.append(num);

    const h3 = document.createElement('h3');
    h3.textContent = titleText;
    item.append(h3);

    const p = document.createElement('p');
    p.innerHTML = cells[1] ? cells[1].innerHTML : '';
    if (!cells[1]) p.innerHTML = '';
    item.append(p);

    grid.append(item);
  });

  block.innerHTML = '';
  block.append(grid);
}
