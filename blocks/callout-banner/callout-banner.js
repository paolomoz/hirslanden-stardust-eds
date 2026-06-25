/**
 * Callout Banner block — horizontal strip with text + CTA button
 * Authored row structure:
 *   Row 1: [heading] | [body text]
 *   Row 2: [CTA link]
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const textDiv = document.createElement('div');
  textDiv.className = 'callout-banner-text';

  let ctaLink = null;

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    if (!cells.length) return;

    const h2 = cells[0].querySelector('h2');
    if (h2) {
      textDiv.append(h2.cloneNode(true));
      if (cells[1]) {
        const p = document.createElement('p');
        p.innerHTML = cells[1].innerHTML;
        textDiv.append(p);
      }
      return;
    }

    const link = cells[0].querySelector('a');
    if (link) {
      ctaLink = link.cloneNode(true);
      ctaLink.className = 'btn btn--primary';
    }
  });

  block.innerHTML = '';
  block.append(textDiv);
  if (ctaLink) block.append(ctaLink);
}
