export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  const cells = [...rows[0].querySelectorAll(':scope > div')];
  const [copyCell, actionsCell] = cells;

  const wrap = document.createElement('div');
  wrap.className = 'container';

  const copy = document.createElement('div');
  copy.className = 'td-cta-copy';
  if (copyCell) copy.append(...copyCell.childNodes);
  wrap.append(copy);

  if (actionsCell) {
    const actions = document.createElement('div');
    actions.className = 'td-cta-actions';
    actions.append(...actionsCell.childNodes);
    wrap.append(actions);
  }

  block.innerHTML = '';
  block.append(wrap);
}
