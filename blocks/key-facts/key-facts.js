/**
 * key-facts block
 * Horizontal strip of fact items. Each item is one of:
 *   - num + label        (e.g. "7" / "Fachgebiete")
 *   - label + value      (e.g. "Methode" / "Offen oder laparoskopisch")
 *   - label + value + sub (e.g. "Notfall" / tel link / "rund um die Uhr")
 *
 * The block handles N items generically and classifies parts by content,
 * never by index.
 *
 * Authoring: one row per fact-item. Each row's cell holds the item's lines
 * (heading/number first, then label/value/sub lines). A purely numeric first
 * line is treated as fact-num; otherwise the first line is the fact-label.
 */

/**
 * Group block children into per-item line lists.
 * Each top-level row → one item; its lines are the element children of the
 * inner cell(s) (bare text wrapped in <p>).
 * @param {Element} block
 * @returns {Element[][]}
 */
function groupItems(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  return rows.map((row) => {
    const lines = [];
    const cells = row.querySelectorAll(':scope > div');
    const cellList = cells.length ? [...cells] : [row];
    cellList.forEach((cell) => {
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
}

const isNumeric = (text) => /^[\d.,\s+%–-]+$/.test(text) && /\d/.test(text);

export default async function decorate(block) {
  const items = groupItems(block);

  const container = document.createElement('div');
  container.className = 'container';

  items.forEach((lines) => {
    const item = document.createElement('div');
    item.className = 'fact-item';

    const firstText = lines[0].textContent.trim();
    const firstIsNumber = isNumeric(firstText);

    lines.forEach((line, i) => {
      const text = line.textContent.trim();
      let el;

      if (i === 0 && firstIsNumber) {
        // num + label pattern
        el = document.createElement('span');
        el.className = 'fact-num';
        el.innerHTML = line.innerHTML;
      } else if (i === 0) {
        // label-first pattern
        el = document.createElement('div');
        el.className = 'fact-label';
        el.innerHTML = line.innerHTML;
      } else if (i === 1 && firstIsNumber) {
        // label following a number
        el = document.createElement('span');
        el.className = 'fact-label';
        el.innerHTML = line.innerHTML;
      } else if (i === 1) {
        // value following a label
        el = document.createElement('div');
        el.className = 'fact-value';
        el.innerHTML = line.innerHTML;
      } else {
        // any further line is a sub note
        el = document.createElement('div');
        el.className = 'fact-sub';
        el.innerHTML = line.innerHTML;
      }

      // Strip inline color/style hacks on links so block CSS governs them.
      el.querySelectorAll('a[style]').forEach((a) => a.removeAttribute('style'));
      if (text) item.append(el);
    });

    if (item.children.length) container.append(item);
  });

  block.replaceChildren(container);
}
