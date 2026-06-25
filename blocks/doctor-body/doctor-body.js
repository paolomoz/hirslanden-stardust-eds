/**
 * doctor-body block
 * Two-column doctor profile body: a main column of "section boxes"
 * (Kernkompetenzen, Werdegang, Ausbildung, …) and a sidebar. Each section is
 * opened by an <h2>; its following content (paragraphs, lists) renders inside
 * a card. A section whose heading reads "Kontakt" or "Praktiziert bei" is
 * moved to the sidebar.
 *
 * Authoring (flat content): repeating <h2> + body groups. Lists author as
 * normal <ul>; career/education rows author as list items or paragraphs.
 */

const isHeading = (el) => /^h[1-6]$/.test(el.tagName.toLowerCase());
const SIDEBAR_RE = /^(kontakt|praktiziert bei|contact)/i;
const PUB_RE = /^(publikationen|publications)/i;

const PLAY_ICON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
const DOC_ICON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>';

/**
 * Build a "Publikationen & Videos" section box. Each publication is authored as
 * an <h3> (containing a link) immediately followed by a <p> of meta tokens
 * separated by "·" (author · date · type). The last token names the media type
 * and is rendered as a badge; "Video" picks the play icon, otherwise a document
 * icon is used.
 * @param {{heading: Element, body: Element[]}} section
 * @returns {Element}
 */
function buildPubBox(section) {
  const box = document.createElement('div');
  box.className = 'section-box';
  if (section.heading) {
    const h = document.createElement('h2');
    h.innerHTML = section.heading.innerHTML;
    box.append(h);
  }
  const list = document.createElement('ul');
  list.className = 'pub-list';

  let current = null;
  section.body.forEach((node) => {
    if (isHeading(node)) {
      current = document.createElement('li');
      current.className = 'pub-item';

      const content = document.createElement('div');
      content.className = 'pub-content';
      const title = document.createElement('h4');
      title.innerHTML = node.innerHTML;
      content.append(title);

      const icon = document.createElement('div');
      icon.className = 'pub-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.innerHTML = PLAY_ICON;

      current.append(icon, content);
      list.append(current);
    } else if (current) {
      const text = node.textContent.trim();
      if (!text) return;
      const parts = text.split('·').map((p) => p.trim()).filter(Boolean);
      const meta = document.createElement('div');
      meta.className = 'pub-meta';
      const last = parts[parts.length - 1] || '';
      const isVideo = /video/i.test(last);
      parts.forEach((part, idx) => {
        const isBadge = idx === parts.length - 1 && parts.length > 1;
        const span = document.createElement('span');
        if (isBadge) span.className = 'pub-badge';
        span.textContent = part;
        meta.append(span);
        if (idx < parts.length - 1) {
          const sep = document.createElement('span');
          sep.setAttribute('aria-hidden', 'true');
          sep.textContent = '·';
          meta.append(sep);
        }
      });
      current.querySelector('.pub-content').append(meta);
      if (!isVideo) {
        current.querySelector('.pub-icon').innerHTML = DOC_ICON;
      }
    }
  });

  if (list.children.length) box.append(list);
  return box;
}

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

  // Group into sections by heading boundaries.
  const sections = [];
  let current = null;
  nodes.forEach((node) => {
    if (isHeading(node)) {
      current = { heading: node, body: [] };
      sections.push(current);
      return;
    }
    if (!current) {
      current = { heading: null, body: [] };
      sections.push(current);
    }
    current.body.push(node);
  });

  const container = document.createElement('div');
  container.className = 'container';

  const grid = document.createElement('div');
  grid.className = 'doctor-body-grid';

  const main = document.createElement('div');
  main.className = 'doctor-main';
  const sidebar = document.createElement('div');
  sidebar.className = 'doctor-sidebar';

  const buildBox = (section, sidebarBox) => {
    const box = document.createElement('div');
    box.className = sidebarBox ? 'contact-card' : 'section-box';
    if (section.heading) {
      const h = document.createElement('h2');
      h.innerHTML = section.heading.innerHTML;
      box.append(h);
    }
    section.body.forEach((node) => box.append(node));
    return box;
  };

  sections.forEach((section) => {
    const title = section.heading ? section.heading.textContent.trim() : '';
    if (SIDEBAR_RE.test(title)) {
      sidebar.append(buildBox(section, true));
    } else if (PUB_RE.test(title)) {
      main.append(buildPubBox(section));
    } else {
      main.append(buildBox(section, false));
    }
  });

  grid.append(main);
  if (sidebar.children.length) grid.append(sidebar);
  container.append(grid);
  block.replaceChildren(container);
}
