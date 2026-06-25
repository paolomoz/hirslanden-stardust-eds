/**
 * clinic-hero block
 * Full-bleed editorial clinic hero: a wide background photo with a white
 * editorial panel (breadcrumb, H1 clinic name, and meta "city tags"). The H1
 * is the page's single heading.
 *
 * Authoring (one row per element or a flattened cell):
 *   - a media element (picture/img)   → full-bleed background photo
 *   - an <h1> (clinic name)           → panel headline (page H1)
 *   - one or more short text lines     → meta city/feature tags (".../· ...")
 *
 * Breadcrumb is optional; if a leading link is authored it becomes the
 * breadcrumb's parent link.
 */

const isMedia = (el) => el.matches('picture, img') || el.querySelector('picture, img');

const PIN_ICON = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';

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
  const heading = nodes.find((n) => /^h[1-6]$/.test(n.tagName.toLowerCase()));
  const tags = nodes.filter((n) => n !== media && n !== heading
    && !(n.tagName.toLowerCase() === 'a' || n.querySelector('a'))
    && n.textContent.trim());
  const backlink = nodes.find((n) => {
    const a = n.tagName.toLowerCase() === 'a' ? n : n.querySelector('a');
    return a && !isMedia(n);
  });

  const figure = document.createElement('figure');
  figure.className = 'clinic-hero-figure';
  if (media) {
    const pic = media.matches('picture, img') ? media : media.querySelector('picture, img');
    figure.append(pic);
  }

  const container = document.createElement('div');
  container.className = 'container';

  const panel = document.createElement('div');
  panel.className = 'clinic-hero-panel';

  if (backlink) {
    const a = backlink.tagName.toLowerCase() === 'a' ? backlink : backlink.querySelector('a');
    const nav = document.createElement('nav');
    nav.className = 'breadcrumb';
    nav.setAttribute('aria-label', 'Breadcrumb');
    const link = document.createElement('a');
    link.href = a.getAttribute('href') || '#';
    link.textContent = a.textContent.trim();
    const sep = document.createElement('span');
    sep.className = 'sep';
    sep.setAttribute('aria-hidden', 'true');
    sep.textContent = '/';
    const current = document.createElement('span');
    current.setAttribute('aria-current', 'page');
    current.textContent = heading ? heading.textContent.trim() : '';
    nav.append(link, sep, current);
    panel.append(nav);
  }

  if (heading) {
    const h1 = document.createElement('h1');
    h1.innerHTML = heading.innerHTML;
    panel.append(h1);
  }

  if (tags.length) {
    const meta = document.createElement('div');
    meta.className = 'clinic-hero-meta';
    // A single tag line may carry multiple tags separated by "·" or "|".
    const tagTexts = [];
    tags.forEach((t) => {
      t.textContent.split(/\s*[·|]\s*/).forEach((piece) => {
        const v = piece.trim();
        if (v) tagTexts.push(v);
      });
    });
    tagTexts.forEach((text) => {
      const tag = document.createElement('span');
      tag.className = 'city-tag';
      tag.innerHTML = `${PIN_ICON}<span>${text}</span>`;
      meta.append(tag);
    });
    panel.append(meta);
  }

  container.append(panel);
  block.replaceChildren(figure, container);
}
