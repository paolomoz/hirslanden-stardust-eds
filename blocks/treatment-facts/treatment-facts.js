export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const wrap = document.createElement('div');
  wrap.className = 'container';

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const [labelCell, valueCell] = cells;

    const chip = document.createElement('div');
    chip.className = 'td-fact-chip';

    const labelEl = document.createElement('span');
    labelEl.className = 'fc-label';
    labelEl.textContent = labelCell?.textContent.trim() || '';
    chip.append(labelEl);

    const valueEl = document.createElement('span');
    valueEl.className = 'fc-value';
    valueEl.textContent = valueCell?.textContent.trim() || '';
    chip.append(valueEl);

    wrap.append(chip);
  });

  block.innerHTML = '';
  block.append(wrap);
}
