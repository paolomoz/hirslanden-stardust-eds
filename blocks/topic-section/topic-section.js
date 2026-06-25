/**
 * Topic Section block — accordion-based content section for specialty pages
 * Authored row structure:
 *   Row 1: [eyebrow] | [section description]
 *   Row 2: [h2 heading]
 *   Rows 3+: [accordion item title] | [accordion item body]
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const sectionHead = document.createElement('div');
  sectionHead.className = 'topic-section-head';

  const accordion = document.createElement('div');
  accordion.className = 'accordion';
  accordion.setAttribute('role', 'list');

  let headDone = false;

  rows.forEach((row, i) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    if (!cells.length) return;

    const h2 = cells[0].querySelector('h2');
    if (h2 && !headDone) {
      sectionHead.append(h2.cloneNode(true));
      if (cells[1]) {
        const p = document.createElement('p');
        p.innerHTML = cells[1].innerHTML;
        sectionHead.append(p);
      }
      return;
    }

    const eyebrow = cells[0].querySelector('em, .eyebrow');
    if (eyebrow && !headDone && i < 2) {
      const p = document.createElement('p');
      p.className = 'eyebrow';
      p.textContent = cells[0].textContent.trim();
      sectionHead.prepend(p);
      return;
    }

    // Accordion item: title in cell 0, body in cell 1
    headDone = true;
    const itemId = `topic-panel-${i}`;
    const triggerId = `topic-trigger-${i}`;

    const item = document.createElement('div');
    item.className = 'accordion-item';
    item.setAttribute('role', 'listitem');

    const trigger = document.createElement('button');
    trigger.className = 'accordion-trigger';
    trigger.type = 'button';
    trigger.id = triggerId;
    trigger.setAttribute('aria-expanded', i === rows.indexOf(rows.find((r) => r === row)) && accordion.children.length === 0 ? 'true' : 'false');
    trigger.setAttribute('aria-controls', itemId);

    const titleSpan = document.createElement('span');
    titleSpan.textContent = cells[0].textContent.trim();
    const icon = document.createElement('span');
    icon.className = 'accordion-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = '+';
    trigger.append(titleSpan, icon);

    const panel = document.createElement('div');
    panel.className = 'accordion-panel';
    panel.id = itemId;
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-labelledby', triggerId);
    if (cells[1]) panel.innerHTML = cells[1].innerHTML;

    // First item open by default
    if (accordion.children.length === 0) {
      trigger.setAttribute('aria-expanded', 'true');
      panel.classList.add('is-open');
    }

    item.append(trigger, panel);
    accordion.append(item);
  });

  // Wire accordion interactivity
  accordion.querySelectorAll('.accordion-trigger').forEach((btn) => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const panelId = btn.getAttribute('aria-controls');
      const panel = accordion.querySelector(`#${panelId}`);
      if (!panel) return;
      btn.setAttribute('aria-expanded', String(!expanded));
      panel.classList.toggle('is-open', !expanded);
    });
  });

  block.innerHTML = '';
  if (sectionHead.children.length) block.append(sectionHead);
  block.append(accordion);
}
