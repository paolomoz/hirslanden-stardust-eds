/**
 * proof-strip block
 * A horizontal trust strip of N "number + label" proof points.
 *
 * Authoring: one row per proof item; each row's cell holds a number line and a
 * label line (e.g. "16" / "Privatkliniken"). Also supports a single flattened
 * cell where number and label lines alternate.
 */

/**
 * Group block rows into per-item line lists.
 * @param {Element} block
 * @returns {Element[][]}
 */
function groupItems(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const items = rows.map((row) => {
    const lines = [];
    const cells = [...row.querySelectorAll(':scope > div')];
    (cells.length ? cells : [row]).forEach((cell) => {
      const kids = [...cell.children];
      if (kids.length === 0) {
        const text = cell.textContent.trim();
        if (text) {
          const p = document.createElement('p');
          p.innerHTML = cell.innerHTML;
          lines.push(p);
        }
        return;
      }
      kids.forEach((el) => lines.push(el));
    });
    return lines;
  }).filter((lines) => lines.length > 0);
  return items;
}

export default async function decorate(block) {
  const items = groupItems(block);

  const container = document.createElement('div');
  container.className = 'container';

  items.forEach((lines) => {
    const item = document.createElement('div');
    item.className = 'proof-item';

    const num = document.createElement('span');
    num.className = 'proof-num';
    num.innerHTML = lines[0].innerHTML;
    item.append(num);

    if (lines[1]) {
      const label = document.createElement('span');
      label.className = 'proof-label';
      label.innerHTML = lines[1].innerHTML;
      item.append(label);
    }

    container.append(item);
  });

  block.replaceChildren(container);
}
