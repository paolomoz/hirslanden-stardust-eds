/**
 * event-hero block
 * Full-bleed event banner: a background image with a scrim, a category chip,
 * the event H1 (the page's single H1) and a clinic/location line.
 *
 * Authoring (flat content, classified by content not index):
 *   - a picture/img → the background media (absolute URL authored inline; if no
 *     image is authored the block leaves a neutral ground-alt backdrop)
 *   - a short first text line (no link) before the heading → the category chip
 *   - a heading → H1
 *   - a text line after the heading → the clinic/location sub-line
 */

const isHeading = (el) => /^h[1-6]$/.test(el.tagName.toLowerCase());
const isMedia = (el) => el.matches('picture, img') || el.querySelector('picture, img');

function collectNodes(block) {
  const nodes = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    const kids = [...cell.children];
    if (kids.length === 0) {
      const text = cell.textContent.trim();
      if (text) {
        const p = document.createElement('p');
        p.textContent = text;
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

  let media = null;
  let category = null;
  let heading = null;
  let clinic = null;

  nodes.forEach((node) => {
    if (isMedia(node)) { media = node; return; }
    if (isHeading(node)) { if (!heading) heading = node; return; }
    const text = node.textContent.trim();
    if (!text) return;
    if (!heading && !category && text.length <= 40) { category = node; return; }
    if (heading && !clinic) { clinic = node; return; }
    if (!category) category = node;
  });

  const mediaWrap = document.createElement('div');
  mediaWrap.className = 'event-hero-media';
  if (media) {
    const pic = media.matches('picture, img') ? media : media.querySelector('picture, img');
    mediaWrap.append(pic);
  } else {
    mediaWrap.setAttribute('role', 'img');
    if (heading) mediaWrap.setAttribute('aria-label', heading.textContent.trim());
  }

  const scrim = document.createElement('div');
  scrim.className = 'event-hero-scrim';
  scrim.setAttribute('aria-hidden', 'true');

  const container = document.createElement('div');
  container.className = 'container';

  if (category) {
    const chip = document.createElement('span');
    chip.className = 'event-hero-category';
    chip.innerHTML = category.innerHTML || category.textContent.trim();
    container.append(chip);
  }
  if (heading) {
    const h1 = document.createElement('h1');
    h1.innerHTML = heading.innerHTML;
    container.append(h1);
  }
  if (clinic) {
    const p = document.createElement('p');
    p.className = 'event-hero-clinic';
    p.innerHTML = clinic.innerHTML || clinic.textContent.trim();
    container.append(p);
  }

  block.replaceChildren(mediaWrap, scrim, container);
}
