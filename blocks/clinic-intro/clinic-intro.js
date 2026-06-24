export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  const cells = [...rows[0].querySelectorAll(':scope > div')];
  const [leadCell, cardCell] = cells;

  const lead = document.createElement('div');
  lead.className = 'clinic-intro-lead';
  if (leadCell) lead.append(...leadCell.childNodes);

  const card = document.createElement('div');
  card.className = 'contact-card';
  if (cardCell) {
    // Promote btn-primary links
    cardCell.querySelectorAll('a').forEach((a) => {
      if (!a.className) a.className = 'btn btn-primary';
    });
    card.append(...cardCell.childNodes);
  }

  const wrap = document.createElement('div');
  wrap.className = 'container';
  wrap.append(lead, card);

  block.innerHTML = '';
  block.append(wrap);
}
