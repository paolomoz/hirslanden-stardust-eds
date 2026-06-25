/**
 * hero-search block
 * Split hero: editorial photo scrim on the left with the page H1 + lead copy,
 * and a floating white search card on the right with a search form + chips.
 *
 * Authoring shape (DA usually flattens to one row/one cell; both supported):
 *   - a media element (picture/img) → background hero photo (optional; when a
 *     LOCAL relative image was used in the prototype the cell is left empty and
 *     CSS renders a neutral ground — author drops the image later)
 *   - an <h1> → hero headline (the page's single H1)
 *   - a lead paragraph → intro copy
 *   - one or more plain <a> links → search chips (quick searches)
 *
 * The search form (label "Wonach suchen Sie?" + input + Suche button) is a
 * fixed UI scaffold recreated by the block; chips author the quick links.
 */

// On-site doctor directory (Ärztesuche). The GET form appends ?q=… which the
// doctor-search block reads on load. (Was a dead link to the legacy site.)
const SEARCH_ACTION = '/de/corporate/aerzte-und-pflege/aerztesuche';

/**
 * Collect element children of every cell, wrapping bare-text cells in <p>.
 * @param {Element} block
 * @returns {Element[]}
 */
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

const isMedia = (el) => el.matches('picture, img') || el.querySelector('picture, img');

export default async function decorate(block) {
  const nodes = collectNodes(block);

  const media = nodes.find((n) => isMedia(n));
  const heading = nodes.find((n) => /^h[1-6]$/.test(n.tagName.toLowerCase()));
  const chips = [];
  const copyParas = [];
  nodes.forEach((n) => {
    if (n === media || n === heading) return;
    const anchor = n.tagName.toLowerCase() === 'a' ? n : n.querySelector('a');
    if (anchor) {
      const wrapped = n.tagName.toLowerCase() === 'a' ? [n] : [...n.querySelectorAll('a')];
      wrapped.forEach((a) => chips.push(a));
      return;
    }
    if (n.textContent.trim()) copyParas.push(n);
  });

  // Media layer (background hero photo). Empty → CSS neutral ground.
  const mediaWrap = document.createElement('div');
  mediaWrap.className = 'hero-media';
  mediaWrap.setAttribute('aria-hidden', 'true');
  if (media) {
    const pic = media.matches('picture, img') ? media : media.querySelector('picture, img');
    mediaWrap.append(pic);
  }

  const scrim = document.createElement('div');
  scrim.className = 'hero-scrim';
  scrim.setAttribute('aria-hidden', 'true');

  const container = document.createElement('div');
  container.className = 'container';

  const grid = document.createElement('div');
  grid.className = 'hero-grid';

  const copy = document.createElement('div');
  copy.className = 'hero-copy';
  if (heading) {
    const h1 = document.createElement('h1');
    h1.innerHTML = heading.innerHTML;
    copy.append(h1);
  }
  copyParas.forEach((p) => {
    const para = document.createElement('p');
    para.innerHTML = p.innerHTML;
    copy.append(para);
  });

  // Search card scaffold.
  const card = document.createElement('div');
  card.className = 'search-card';
  card.innerHTML = `
    <h2>Wonach suchen Sie?</h2>
    <form class="search-row" role="search" action="${SEARCH_ACTION}">
      <label for="site-search" class="visually-hidden">Suchbegriff</label>
      <input id="site-search" type="search" name="q" placeholder="Stichwort...">
      <button class="btn btn--primary" type="submit">Suche</button>
    </form>`;
  if (chips.length) {
    const chipWrap = document.createElement('div');
    chipWrap.className = 'search-chips';
    chips.forEach((src) => {
      const a = src.cloneNode(true);
      a.className = 'chip';
      a.removeAttribute('style');
      chipWrap.append(a);
    });
    card.append(chipWrap);
  }

  grid.append(copy, card);
  container.append(grid);
  block.replaceChildren(mediaWrap, scrim, container);
}
