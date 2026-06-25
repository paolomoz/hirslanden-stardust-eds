/**
 * Hero block — corporate home hero with background image, headline, search form
 * Authored row structure:
 *   Row 1: [background image]
 *   Row 2: [h1 heading] | [subtext]
 *   Row 3: [search form label / search chips as links]
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  let bgImage = null;
  let heading = null;
  let subtext = '';
  let chips = [];

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    if (!cells.length) return;

    const img = cells[0].querySelector('img, picture');
    if (img && !heading) {
      bgImage = img.cloneNode(true);
      return;
    }

    const h1 = cells[0].querySelector('h1');
    if (h1) {
      heading = h1.cloneNode(true);
      subtext = cells[1]?.innerHTML || cells[0].querySelector('p')?.innerHTML || '';
      return;
    }

    // Chips / search shortcuts row — links without h1
    const links = [...cells[0].querySelectorAll('a')];
    if (links.length) {
      chips = links.map((a) => a.cloneNode(true));
    }
  });

  // Build hero DOM
  const hero = document.createElement('div');
  hero.className = 'hero-inner';

  // Background media
  if (bgImage) {
    const media = document.createElement('div');
    media.className = 'hero-media';
    media.setAttribute('aria-hidden', 'true');
    media.append(bgImage);
    hero.append(media);
  }

  const scrim = document.createElement('div');
  scrim.className = 'hero-scrim';
  scrim.setAttribute('aria-hidden', 'true');
  hero.append(scrim);

  const container = document.createElement('div');
  container.className = 'container';

  const grid = document.createElement('div');
  grid.className = 'hero-grid';

  // Copy
  const copy = document.createElement('div');
  copy.className = 'hero-copy';
  if (heading) copy.append(heading);
  if (subtext) {
    const p = document.createElement('p');
    p.innerHTML = subtext;
    copy.append(p);
  }
  grid.append(copy);

  // Search card
  const searchCard = document.createElement('div');
  searchCard.className = 'search-card';

  const searchLabel = document.createElement('h2');
  searchLabel.textContent = 'Wonach suchen Sie?';
  searchCard.append(searchLabel);

  const form = document.createElement('form');
  form.className = 'search-row';
  form.setAttribute('role', 'search');
  form.setAttribute('action', 'https://www.hirslanden.ch/de/corporate/search.html');

  const label = document.createElement('label');
  label.setAttribute('for', 'hero-search');
  label.style.cssText = 'position:absolute;left:-9999px;';
  label.textContent = 'Suchbegriff';

  const input = document.createElement('input');
  input.id = 'hero-search';
  input.type = 'search';
  input.name = 'q';
  input.placeholder = 'Stichwort...';

  const btn = document.createElement('button');
  btn.className = 'btn btn--primary';
  btn.type = 'submit';
  btn.textContent = 'Suche';

  form.append(label, input, btn);
  searchCard.append(form);

  if (chips.length) {
    const chipsDiv = document.createElement('div');
    chipsDiv.className = 'search-chips';
    chips.forEach((a) => {
      a.className = 'chip';
      chipsDiv.append(a);
    });
    searchCard.append(chipsDiv);
  }

  grid.append(searchCard);
  container.append(grid);
  hero.append(container);

  block.innerHTML = '';
  block.append(hero);
}
