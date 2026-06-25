/**
 * Teaser Callout block — split copy + image band
 * Authored row structure:
 *   Row 1: [eyebrow] | [image]
 *   Row 2: [heading]
 *   Row 3: [body text]
 *   Row 4: [CTA link]
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const inner = document.createElement('div');
  inner.className = 'teaser-callout-inner';

  const copy = document.createElement('div');
  copy.className = 'teaser-callout-copy';

  const media = document.createElement('div');
  media.className = 'teaser-callout-media';

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    if (!cells.length) return;

    // Row with image in second cell
    const img = cells[1]?.querySelector('img, picture') || cells[0]?.querySelector('img, picture');
    if (img) {
      media.append(img.cloneNode(true));
      // eyebrow in first cell
      const eyebrowText = cells[0]?.textContent?.trim();
      if (eyebrowText && !cells[0].querySelector('img')) {
        const p = document.createElement('p');
        p.className = 'eyebrow';
        p.textContent = eyebrowText;
        copy.append(p);
      }
      return;
    }

    const h2 = cells[0].querySelector('h2');
    if (h2) {
      copy.append(h2.cloneNode(true));
      return;
    }

    const link = cells[0].querySelector('a');
    if (link && cells[0].children.length <= 2) {
      link.className = 'btn btn--primary';
      copy.append(link.cloneNode(true));
      return;
    }

    const p = document.createElement('p');
    p.innerHTML = cells[0].innerHTML;
    copy.append(p);
  });

  inner.append(copy, media);
  block.innerHTML = '';
  block.append(inner);
}
