/**
 * clinic-intro block
 * Two-column intro: lead prose (eyebrow, paragraphs, read-more) on the left and
 * a contact card (address, phone, email, emergency line, CTA) on the right.
 *
 * Authoring: TWO rows.
 *   Row 1 (lead):    an optional short eyebrow line, one or more paragraphs, and
 *                    an optional plain read-more link.
 *   Row 2 (contact): a heading (clinic name), then contact lines —
 *                    an address text line, a tel: link, a mailto: link, an
 *                    optional emergency tel: line, and a final CTA link.
 * If only one row is authored it is treated as the lead.
 */

const ICONS = {
  pin: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  phone: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.19 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  mail: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
};

function readRows(block) {
  return [...block.querySelectorAll(':scope > div')].map((row) => {
    const parts = [];
    const cells = [...row.querySelectorAll(':scope > div')];
    (cells.length ? cells : [row]).forEach((cell) => {
      const kids = [...cell.children];
      if (kids.length === 0) {
        const text = cell.textContent.trim();
        if (text) {
          const p = document.createElement('p');
          p.innerHTML = cell.innerHTML;
          parts.push(p);
        }
        return;
      }
      kids.forEach((el) => parts.push(el));
    });
    return parts;
  }).filter((p) => p.length);
}

const anchorOf = (el) => (el.tagName.toLowerCase() === 'a' ? el : el.querySelector('a'));

function buildLead(parts) {
  const lead = document.createElement('div');
  lead.className = 'clinic-intro-lead';
  let eyebrowUsed = false;
  parts.forEach((node, i) => {
    const tag = node.tagName.toLowerCase();
    const a = anchorOf(node);
    if (a) {
      const link = document.createElement('a');
      link.className = 'readmore';
      link.href = a.getAttribute('href') || '#';
      link.innerHTML = a.innerHTML;
      lead.append(link);
      return;
    }
    if (/^h[1-6]$/.test(tag)) {
      const h = document.createElement('h2');
      h.innerHTML = node.innerHTML;
      lead.append(h);
      return;
    }
    const text = node.textContent.trim();
    if (!text) return;
    if (i === 0 && !eyebrowUsed && text.length <= 28) {
      const p = document.createElement('p');
      p.className = 'eyebrow';
      p.innerHTML = node.innerHTML;
      lead.append(p);
      eyebrowUsed = true;
      return;
    }
    const p = document.createElement('p');
    p.innerHTML = node.innerHTML;
    lead.append(p);
  });
  return lead;
}

function buildContact(parts) {
  const card = document.createElement('aside');
  card.className = 'contact-card';
  card.setAttribute('aria-label', 'Kontaktinformationen');

  const heading = parts.find((p) => /^h[1-6]$/.test(p.tagName.toLowerCase()));
  if (heading) {
    const h3 = document.createElement('h3');
    h3.innerHTML = heading.innerHTML;
    card.append(h3);
  }

  let cta = null;
  parts.forEach((node) => {
    if (node === heading) return;
    const a = anchorOf(node);
    const tag = node.tagName.toLowerCase();

    if (a) {
      const href = a.getAttribute('href') || '';
      // Final non-tel/mailto link → primary CTA.
      if (!href.startsWith('tel:') && !href.startsWith('mailto:')) {
        const btn = document.createElement('a');
        btn.className = 'btn btn--primary';
        btn.href = href;
        btn.innerHTML = a.innerHTML;
        cta = btn;
        return;
      }
      const line = document.createElement('div');
      line.className = 'contact-line';
      line.innerHTML = href.startsWith('mailto:') ? ICONS.mail : ICONS.phone;
      const link = document.createElement('a');
      link.href = href;
      link.textContent = a.textContent.trim();
      line.append(link);
      card.append(line);
      return;
    }

    if (tag !== 'a' && node.textContent.trim()) {
      const line = document.createElement('div');
      line.className = 'contact-line';
      line.innerHTML = ICONS.pin;
      const span = document.createElement('span');
      span.innerHTML = node.innerHTML;
      line.append(span);
      card.append(line);
    }
  });

  if (cta) card.append(cta);
  return card;
}

export default async function decorate(block) {
  const rows = readRows(block);

  const container = document.createElement('div');
  container.className = 'container';

  const leadParts = rows[0] || [];
  container.append(buildLead(leadParts));
  if (rows[1]) container.append(buildContact(rows[1]));

  block.replaceChildren(container);
}
