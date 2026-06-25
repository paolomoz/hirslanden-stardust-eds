/**
 * doctor-hero block
 * A split lead for a doctor profile: a portrait on the left; on the right the
 * "Arztprofil" label, the doctor's name (page <h1>), a specialty chip, a
 * key/value meta list and a row of action buttons.
 *
 * Authoring (flattened cell or one row per group). Classified by content:
 *   - the portrait image (absolute URL) → left column.
 *   - the first heading → the name (rendered <h1>).
 *   - links whose href is NOT tel:/mailto:/#... → specialty chips (the first)
 *     and meta values.
 *   - meta key/value pairs: author each as a short label line followed by its
 *     value line or value link (e.g. "Sprachen" then "Deutsch, …").
 *   - links whose href IS tel:/mailto: → action buttons (btn--primary); a
 *     "Termin vereinbaren" style #anchor link → a chip.
 * The title label "Arztprofil" is added by the block.
 */

const isMedia = (el) => el.matches('picture, img') || el.querySelector('picture, img');
const isHeading = (el) => /^h[1-6]$/.test(el.tagName.toLowerCase());
const asAnchor = (el) => (el.tagName.toLowerCase() === 'a' ? el : el.querySelector('a'));
const isAction = (a) => {
  const href = a.getAttribute('href') || '';
  return href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('#');
};

function collectNodes(block) {
  const nodes = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    const kids = [...cell.children];
    if (kids.length === 0) {
      const text = cell.textContent.trim();
      if (text) {
        const p = document.createElement('p');
        p.innerHTML = cell.innerHTML;
        nodes.push(p);
      }
      return;
    }
    kids.forEach((el) => nodes.push(el));
  });
  return nodes;
}

export default async function decorate(block) {
  const nodes = collectNodes(block);

  const media = nodes.find((n) => isMedia(n));
  const heading = nodes.find((n) => isHeading(n));

  const linkNodes = nodes.filter((n) => asAnchor(n) && !isMedia(n));
  const navLinks = linkNodes.filter((n) => !isAction(asAnchor(n)));
  const actionLinks = linkNodes.filter((n) => isAction(asAnchor(n)));

  // first nav link = specialty chip; the rest become meta values (clinic, etc.)
  const specialty = navLinks[0] || null;

  const plain = nodes.filter((n) => n !== media && n !== heading
    && !linkNodes.includes(n) && n.textContent.trim());

  const container = document.createElement('div');
  container.className = 'container';

  const grid = document.createElement('div');
  grid.className = 'doctor-hero-grid';

  // portrait
  const portrait = document.createElement('div');
  portrait.className = 'doctor-portrait';
  if (media) {
    const pic = media.matches('picture, img') ? media : media.querySelector('picture, img');
    portrait.append(pic);
  } else {
    const ph = document.createElement('div');
    ph.className = 'placeholder-media placeholder-media--portrait';
    portrait.append(ph);
  }
  grid.append(portrait);

  // info
  const info = document.createElement('div');
  info.className = 'doctor-info';

  const idWrap = document.createElement('div');
  const label = document.createElement('p');
  label.className = 'doctor-title-label';
  label.textContent = 'Arztprofil';
  idWrap.append(label);
  if (heading) {
    const h1 = document.createElement('h1');
    h1.innerHTML = heading.innerHTML;
    idWrap.append(h1);
  }
  info.append(idWrap);

  if (specialty) {
    const a = asAnchor(specialty);
    const row = document.createElement('div');
    row.className = 'doctor-specialty-row';
    const chip = document.createElement('a');
    chip.className = 'doctor-specialty-chip';
    chip.href = a.getAttribute('href') || '#';
    chip.textContent = a.textContent.trim();
    row.append(chip);
    info.append(row);
  }

  // meta: pair each plain label line with the value that follows it (the value
  // may be a nav link — clinic/website — or a plain text line).
  const metaValueLinks = navLinks.slice(1);
  const metaNodes = nodes.filter((n) => plain.includes(n) || metaValueLinks.includes(n));
  if (metaNodes.length) {
    const dl = document.createElement('dl');
    dl.className = 'doctor-meta-dl';

    let i = 0;
    while (i < metaNodes.length) {
      const node = metaNodes[i];
      const dt = document.createElement('dt');
      dt.className = 'doctor-meta-dt';
      const dd = document.createElement('dd');
      dd.className = 'doctor-meta-dd';

      if (plain.includes(node)) {
        // label, value is the next node
        dt.innerHTML = node.innerHTML;
        const value = metaNodes[i + 1];
        if (value && metaValueLinks.includes(value)) {
          const a = asAnchor(value);
          const link = document.createElement('a');
          link.href = a.getAttribute('href') || '#';
          link.textContent = a.textContent.trim();
          dd.append(link);
          i += 2;
        } else if (value && plain.includes(value)) {
          dd.innerHTML = value.innerHTML;
          i += 2;
        } else {
          i += 1;
        }
      } else {
        // a value link with no label
        const a = asAnchor(node);
        const link = document.createElement('a');
        link.href = a.getAttribute('href') || '#';
        link.textContent = a.textContent.trim();
        dd.append(link);
        i += 1;
      }

      const row = document.createElement('div');
      row.className = 'doctor-meta-row';
      row.append(dt, dd);
      dl.append(row);
    }
    if (dl.children.length) info.append(dl);
  }

  if (actionLinks.length) {
    const ctaRow = document.createElement('div');
    ctaRow.className = 'doctor-cta-row';
    actionLinks.forEach((node) => {
      const a = asAnchor(node);
      const href = a.getAttribute('href') || '#';
      const link = document.createElement('a');
      link.href = href;
      link.textContent = a.textContent.trim();
      link.className = href.startsWith('#') ? 'chip' : 'btn btn--primary';
      ctaRow.append(link);
    });
    info.append(ctaRow);
  }

  grid.append(info);
  container.append(grid);
  block.replaceChildren(container);
}
