export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const wrap = document.createElement('div');
  wrap.className = 'container';

  rows.forEach((row) => {
    const cell = row.querySelector(':scope > div');
    if (!cell) return;
    const a = cell.querySelector('a') || document.createElement('a');
    if (!cell.querySelector('a')) a.textContent = cell.textContent.trim();
    a.className = 'ql-tile';
    wrap.append(a);
  });

  block.innerHTML = '';
  block.append(wrap);
}
