export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  const [imgCell, copyCell] = rows[0].querySelectorAll(':scope > div');

  const bg = document.createElement('div');
  bg.className = 'clinic-hero-bg';
  if (imgCell) bg.append(...imgCell.childNodes);

  const panel = document.createElement('div');
  panel.className = 'clinic-hero-panel';

  if (copyCell) {
    const links = [...copyCell.querySelectorAll('a')];
    const h1 = copyCell.querySelector('h1, h2');
    if (h1 && h1.tagName !== 'H1') {
      const real = document.createElement('h1');
      real.innerHTML = h1.innerHTML;
      h1.replaceWith(real);
    }

    // Breadcrumb — all anchors except the last (city tag)
    const cityLink = links.find((a) => a.closest('p')?.querySelector('a') === a
      && !a.parentElement.querySelector('h1, h2'));
    const breadcrumbLinks = links.filter((a) => a !== cityLink);

    if (breadcrumbLinks.length) {
      const nav = document.createElement('nav');
      nav.className = 'clinic-hero-breadcrumb';
      nav.setAttribute('aria-label', 'Breadcrumb');
      breadcrumbLinks.forEach((a, i) => {
        nav.append(a.cloneNode(true));
        if (i < breadcrumbLinks.length - 1) {
          const sep = document.createElement('span');
          sep.setAttribute('aria-hidden', 'true');
          sep.textContent = '›';
          nav.append(sep);
        }
      });
      panel.append(nav);
    }

    const titleEl = copyCell.querySelector('h1') || copyCell.querySelector('h2');
    if (titleEl) panel.append(titleEl);

    // City/location tag — first standalone paragraph with a chip-like link
    const tagPara = [...copyCell.querySelectorAll('p')].find((p) => p.querySelector('.chip'));
    if (tagPara) {
      const tag = document.createElement('span');
      tag.className = 'clinic-hero-tag';
      tag.textContent = tagPara.textContent.trim();
      panel.append(tag);
    } else {
      const remaining = [...copyCell.children];
      remaining.forEach((el) => panel.append(el));
    }
  }

  block.innerHTML = '';
  block.append(bg, panel);
}
