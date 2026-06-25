/**
 * event-body block
 * Two-column event detail: a main column (intro heading, prose, an info list,
 * a notice box and transport notes) and a sticky sidebar card listing the next
 * dates plus a registration CTA.
 *
 * Authoring (flat content; sections are opened by headings, classified by text):
 *   Main column (default):
 *     - <h2>  → section opener (rendered as <h2>)
 *     - <h3>  → sub-heading
 *     - <p>   → prose
 *     - a <ul> whose items read "Label: value" → the meta info list
 *     - a <ul> under a heading containing "Hinweis" → the notice box
 *   Sidebar (a section whose heading matches "Termine"/"Anmeldung"/"Daten"):
 *     - a sub text under the heading → the card sub-line (e.g. "6 Termine")
 *     - each <p> shaped "DD Mon. — Title — Time — Location" → one date row
 *     - a link (e.g. "Anmelden") → the registration CTA button (btn--primary)
 */

const anchorOf = (el) => (el.tagName.toLowerCase() === 'a' ? el : el.querySelector('a'));
const SIDEBAR_RE = /(termine|anmeldung|daten|registrier)/i;
const NOTICE_RE = /(hinweis|wichtig|gut zu wissen)/i;
const ANFAHRT_RE = /(anfahrt|anreise)/i;
const MAP_RE = /^karte\b/i;
const DATE_PREFIX_RE = /^(\d{1,2})\.?\s*([A-Za-zÄÖÜäöü]{2,}\.?)/; // "25 Jun." / "06 Aug."

// Inline transport icons, lifted verbatim from the event-detail prototype.
const ICON_CAR = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>';
const ICON_TRAM = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16"/><path d="M8 3v4"/><path d="M16 3v4"/><path d="M8 15h.01"/><path d="M16 15h.01"/></svg>';
const AUTO_RE = /(auto|park)/i;

// Build the Anfahrt sub-section (transport columns + map placeholder) from the
// nodes following an "Anfahrt" h3. Returns the section element and the index of
// the last consumed node so the caller can skip those nodes.
function buildAnfahrt(heading, body, startIdx) {
  const section = document.createElement('div');
  section.className = 'transport-section';
  const h3 = document.createElement('h3');
  h3.innerHTML = heading.innerHTML;
  section.append(h3);

  const grid = document.createElement('div');
  grid.className = 'transport-grid';
  let mapText = null;
  let lastIdx = startIdx;

  for (let i = startIdx; i < body.length; i += 1) {
    const node = body[i];
    const tag = node.tagName.toLowerCase();
    if (tag === 'h2' || (tag === 'h3' && !ANFAHRT_RE.test(node.textContent))) break;
    if (tag === 'h4') {
      const item = document.createElement('div');
      item.className = 'transport-item';
      const h4 = document.createElement('h4');
      const label = node.textContent.trim();
      h4.innerHTML = `${AUTO_RE.test(label) ? ICON_CAR : ICON_TRAM}<span>${node.innerHTML}</span>`;
      item.append(h4);
      const next = body[i + 1];
      if (next && next.tagName.toLowerCase() === 'p' && !MAP_RE.test(next.textContent.trim())) {
        const p = document.createElement('p');
        p.innerHTML = next.innerHTML;
        item.append(p);
        i += 1;
      }
      grid.append(item);
      lastIdx = i;
    } else if (tag === 'p' && MAP_RE.test(node.textContent.trim())) {
      mapText = node.textContent.trim();
      lastIdx = i;
    } else {
      break;
    }
  }

  if (grid.children.length) section.append(grid);
  if (mapText) {
    const mapArea = document.createElement('div');
    mapArea.className = 'map-area';
    mapArea.setAttribute('aria-label', 'Standort auf der Karte');
    const media = document.createElement('div');
    media.className = 'placeholder-media placeholder-media--map';
    media.setAttribute('role', 'img');
    media.setAttribute('aria-label', mapText);
    media.textContent = mapText;
    mapArea.append(media);
    section.append(mapArea);
  }

  return { section, lastIdx };
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

function buildInfoList(ul) {
  const list = document.createElement('ul');
  list.className = 'event-info-list';
  [...ul.querySelectorAll(':scope > li')].forEach((li) => {
    const item = document.createElement('li');
    const raw = li.textContent.trim();
    const m = raw.match(/^([^:–—]{2,24})[:–—]\s*(.+)$/);
    if (m) {
      const label = document.createElement('span');
      label.className = 'info-label';
      label.textContent = m[1].trim();
      const val = document.createElement('span');
      val.textContent = m[2].trim();
      item.append(label, val);
    } else {
      const val = document.createElement('span');
      val.innerHTML = li.innerHTML;
      item.append(val);
    }
    list.append(item);
  });
  return list;
}

function buildDateRow(text) {
  const parts = text.split(/\s*[–—|]\s*/).map((s) => s.trim()).filter(Boolean);
  const m = (parts[0] || text).match(DATE_PREFIX_RE);
  const li = document.createElement('li');
  li.className = 'event-date-item';

  const chip = document.createElement('div');
  chip.className = 'event-date-chip';
  chip.setAttribute('aria-hidden', 'true');
  if (m) {
    chip.innerHTML = `<span class="day">${m[1]}</span><span class="mon">${m[2].replace(/\.$/, '')}.</span>`;
  }
  li.append(chip);

  const info = document.createElement('div');
  info.className = 'event-date-info';
  const title = document.createElement('p');
  title.className = 'event-date-title';
  title.textContent = parts[1] || parts[0] || text;
  info.append(title);

  const meta = document.createElement('div');
  meta.className = 'event-date-meta';
  parts.slice(2).forEach((p) => {
    const span = document.createElement('span');
    span.textContent = p;
    meta.append(span);
  });
  if (meta.children.length) info.append(meta);
  li.append(info);
  return li;
}

export default async function decorate(block) {
  const nodes = collectNodes(block);

  // group by headings
  const sections = [];
  let current = { heading: null, body: [] };
  sections.push(current);
  nodes.forEach((node) => {
    if (node.tagName.toLowerCase() === 'h2') {
      current = { heading: node, body: [] };
      sections.push(current);
      return;
    }
    current.body.push(node);
  });

  const container = document.createElement('div');
  container.className = 'container';
  const grid = document.createElement('div');
  grid.className = 'event-body-grid';
  const main = document.createElement('div');
  main.className = 'event-main';
  const sidebar = document.createElement('aside');
  sidebar.className = 'event-sidebar';
  sidebar.setAttribute('aria-label', 'Terminübersicht und Anmeldung');

  sections.forEach((section) => {
    const title = section.heading ? section.heading.textContent.trim() : '';
    if (SIDEBAR_RE.test(title)) {
      const card = document.createElement('div');
      card.className = 'event-sidebar-card';
      const head = document.createElement('div');
      head.className = 'event-sidebar-head';
      const h2 = document.createElement('h2');
      h2.innerHTML = section.heading.innerHTML;
      head.append(h2);
      // first non-date paragraph = sub-line
      const sub = section.body.find((n) => n.tagName.toLowerCase() === 'p'
        && !DATE_PREFIX_RE.test(n.textContent.trim()) && !anchorOf(n));
      if (sub) {
        const p = document.createElement('p');
        p.textContent = sub.textContent.trim();
        head.append(p);
      }
      card.append(head);

      const dates = document.createElement('ul');
      dates.className = 'event-dates';
      section.body.forEach((n) => {
        const text = n.textContent.trim();
        if (n.tagName.toLowerCase() === 'p' && DATE_PREFIX_RE.test(text)) {
          dates.append(buildDateRow(text));
        }
      });
      if (dates.children.length) card.append(dates);

      const ctaLink = section.body.map(anchorOf).find(Boolean);
      if (ctaLink) {
        const cta = document.createElement('div');
        cta.className = 'event-sidebar-cta';
        const a = ctaLink.cloneNode(true);
        a.className = 'btn btn--primary';
        cta.append(a);
        card.append(cta);
      }
      sidebar.append(card);
      return;
    }

    // main column
    if (section.heading) {
      const h2 = document.createElement('h2');
      h2.innerHTML = section.heading.innerHTML;
      main.append(h2);
    }
    const noticeHeading = section.body.find((n) => n.tagName.toLowerCase() === 'h3'
      && NOTICE_RE.test(n.textContent));
    section.body.forEach((node, idx) => {
      if (node.dataset && node.dataset.consumed) return;
      const tag = node.tagName.toLowerCase();
      if (tag === 'h3' && ANFAHRT_RE.test(node.textContent)) {
        const { section: anfahrt, lastIdx } = buildAnfahrt(node, section.body, idx + 1);
        main.append(anfahrt);
        for (let i = idx + 1; i <= lastIdx; i += 1) {
          if (section.body[i].dataset) section.body[i].dataset.consumed = '1';
        }
        return;
      }
      if (tag === 'ul') {
        const items = [...node.querySelectorAll(':scope > li')];
        const looksMeta = items.length
          && items.every((li) => /^[^:–—]{2,24}[:–—]/.test(li.textContent.trim()));
        if (looksMeta) {
          main.append(buildInfoList(node));
        } else if (noticeHeading) {
          // notice list wrapped after its heading
          main.append(node);
        } else {
          main.append(node);
        }
        return;
      }
      if (tag === 'h3' && NOTICE_RE.test(node.textContent)) {
        // build a notice box: heading + following ul
        const box = document.createElement('div');
        box.className = 'event-notice';
        const h3 = document.createElement('h3');
        h3.innerHTML = node.innerHTML;
        box.append(h3);
        const nextUl = section.body.slice(idx + 1)
          .find((n) => n.tagName.toLowerCase() === 'ul');
        if (nextUl) { box.append(nextUl); nextUl.dataset.consumed = '1'; }
        main.append(box);
        return;
      }
      if (node.dataset && node.dataset.consumed) return;
      main.append(node);
    });
  });

  grid.append(main);
  if (sidebar.children.length) grid.append(sidebar);
  container.append(grid);
  block.replaceChildren(container);
}
