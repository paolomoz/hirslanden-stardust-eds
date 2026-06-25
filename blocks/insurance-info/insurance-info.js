/**
 * Insurance Info block — intro copy + 3-card class grid
 * Authored row structure:
 *   Row 1: [eyebrow] | [heading]
 *   Row 2: [intro paragraph(s)] | [readmore link]
 *   Rows 3+: [class title] | [class description]  (one per insurance class)
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const wrap = document.createElement('div');
  wrap.className = 'insurance-info-inner';

  // Copy section
  const copy = document.createElement('div');
  copy.className = 'insurance-info-copy';

  // Classes grid
  const classesGrid = document.createElement('div');
  classesGrid.className = 'insurance-classes';

  let copyDone = false;

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    if (!cells.length) return;

    // If first cell has h2 — heading row
    const h2 = cells[0].querySelector('h2');
    if (h2 && !copyDone) {
      const eyebrowText = cells[1]?.textContent?.trim() || '';
      if (eyebrowText) {
        const ey = document.createElement('p');
        ey.className = 'eyebrow';
        ey.textContent = eyebrowText;
        copy.prepend(ey);
      }
      copy.append(h2.cloneNode(true));
      return;
    }

    // If first cell has h3 — insurance class card
    const h3 = cells[0].querySelector('h3');
    if (h3) {
      copyDone = true;
      const card = document.createElement('div');
      card.className = 'insurance-class-item';
      card.append(h3.cloneNode(true));
      if (cells[1]) {
        const p = document.createElement('p');
        p.innerHTML = cells[1].innerHTML;
        card.append(p);
      }
      classesGrid.append(card);
      return;
    }

    // Paragraph / readmore rows go into copy
    if (!copyDone) {
      const link = cells[0].querySelector('a');
      if (link) {
        link.className = 'readmore';
        copy.append(link.cloneNode(true));
      } else {
        const p = document.createElement('p');
        p.innerHTML = cells[0].innerHTML;
        copy.append(p);
      }
    }
  });

  wrap.append(copy, classesGrid);
  block.innerHTML = '';
  block.append(wrap);
}
