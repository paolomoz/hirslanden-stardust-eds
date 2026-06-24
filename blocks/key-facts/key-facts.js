export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const wrap = document.createElement('div');
  wrap.className = 'container';

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const item = document.createElement('div');
    item.className = 'fact-item';

    // Expected cell layout: [label] | [value/number] | [sub-text?]
    const [labelCell, valueCell, subCell] = cells;

    if (labelCell) {
      const label = document.createElement('span');
      label.className = 'fact-label';
      label.textContent = labelCell.textContent.trim();
      item.append(label);
    }

    if (valueCell) {
      const link = valueCell.querySelector('a');
      const text = valueCell.textContent.trim();
      const isNumeric = /^\d/.test(text);

      if (link) {
        link.className = 'fact-link';
        item.append(link);
      } else if (isNumeric) {
        const num = document.createElement('span');
        num.className = 'fact-num';
        num.textContent = text;
        item.append(num);
      } else {
        const val = document.createElement('span');
        val.className = 'fact-value';
        val.innerHTML = valueCell.innerHTML;
        item.append(val);
      }
    }

    if (subCell) {
      const sub = document.createElement('span');
      sub.className = 'fact-sub';
      sub.innerHTML = subCell.innerHTML;
      item.append(sub);
    }

    wrap.append(item);
  });

  block.innerHTML = '';
  block.append(wrap);
}
