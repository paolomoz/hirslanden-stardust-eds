/**
 * disease-body block
 * Faithful rebuild of the disease-detail prototype's two-column `content-body`:
 * a main editorial column and a sidebar of widgets.
 *
 * MAIN column, by <h2>-opened sub-section (classified by heading text):
 *   - "Entstehung …"  → prose + an inline image (rich-text-with-image) + a
 *                       trailing <ul> rendered as a bulleted causes-list.
 *   - "Symptome"      → intro prose + a <ul> rendered as an icon GRID + an
 *                       optional trailing readmore link.
 *   - "… Diagnose"    → intro prose + <h3>-delimited NUMBERED steps (icon-num).
 *   - "Behandlung …"  → intro prose + <h3>-delimited treatment CARDS. Each card
 *                       is: a tag line (<p> before the <h3>), the <h3> title,
 *                       body <p>(s), and an optional readmore link.
 * An anchor-nav linking to the main sub-sections is generated automatically.
 *
 * SIDEBAR column, by widget (routed by heading/keyword):
 *   - image card  (heading + image + copy + link), incl. a video card when the
 *     copy/heading mentions a video → adds a play affordance over the thumb.
 *   - a standalone image widget (infographic) when an image has no heading.
 *   - a download item ("… PDF" link styled as a file row).
 *   - a Publikationen list (heading "Publikationen …" + <h3>/meta rows).
 *
 * Images authored with absolute URLs render as real <img>; the prototype's
 * sidebar/inline images are all absolute mediclinic URLs, so no placeholders are
 * needed here. Classification is content-based; nothing is hard-indexed.
 */

const isHeading = (el) => /^h[1-6]$/.test(el.tagName.toLowerCase());
const text = (el) => (el ? el.textContent.trim() : '');
const hasMedia = (el) => el && (el.matches('picture, img') || el.querySelector('picture, img'));
const getImg = (el) => (el.matches('img') ? el : el.querySelector('img'));
function getLink(el) {
  if (!el) return null;
  return el.matches('a') ? el : el.querySelector('a');
}

const SIDEBAR_RE = /(pflegetipps|pflege|abtasten|infografik|infografi|publikationen|publications)/i;

const DOT_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="6"/></svg>';
const PLAY_TRI = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>';
const DOC_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>';
const PLAY_BIG = '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="12" fill="rgba(0,0,0,0.55)"/><polygon points="10,8 17,12 10,16" fill="white"/></svg>';

function collectNodes(block) {
  const nodes = [];
  const cells = block.querySelectorAll(':scope > div > div');
  const list = cells.length ? [...cells] : [...block.querySelectorAll(':scope > div')];
  list.forEach((cell) => {
    const kids = [...cell.children];
    if (kids.length === 0) {
      if (text(cell)) {
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

/** Group flat nodes into sections delimited by <h2>; nodes before the first
 *  <h2> become the lead. */
function groupSections(nodes) {
  const sections = [];
  const lead = [];
  let current = null;
  nodes.forEach((node) => {
    if (node.tagName.toLowerCase() === 'h2') {
      current = { heading: node, body: [] };
      sections.push(current);
    } else if (current) {
      current.body.push(node);
    } else {
      lead.push(node);
    }
  });
  return { lead, sections };
}

function slugify(s) {
  return s.toLowerCase()
    .replace(/&[a-z]+;/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

/* ── MAIN sub-section builders ───────────────────────────────── */

function buildCauses(section, id) {
  const article = document.createElement('article');
  article.className = 'content-section';
  article.id = id;
  const h2 = document.createElement('h2');
  h2.innerHTML = section.heading.innerHTML;
  article.append(h2);

  const wrap = document.createElement('div');
  wrap.className = 'rich-text-with-image';
  const bodyCol = document.createElement('div');
  bodyCol.className = 'rich-text-body';
  let imageEl = null;

  section.body.forEach((node) => {
    if (hasMedia(node)) {
      imageEl = getImg(node);
      return;
    }
    if (node.tagName.toLowerCase() === 'ul') {
      node.classList.add('causes-list');
      node.setAttribute('aria-label', 'Risikofaktoren');
      bodyCol.append(node);
      return;
    }
    if (text(node)) bodyCol.append(node);
  });

  wrap.append(bodyCol);
  if (imageEl) {
    const imgCol = document.createElement('div');
    imgCol.className = 'rich-image';
    imgCol.append(imageEl);
    wrap.append(imgCol);
  }
  article.append(wrap);
  return article;
}

function buildSymptoms(section, id) {
  const article = document.createElement('article');
  article.className = 'content-section';
  article.id = id;
  const h2 = document.createElement('h2');
  h2.innerHTML = section.heading.innerHTML;
  article.append(h2);

  section.body.forEach((node) => {
    if (node.tagName.toLowerCase() === 'ul') {
      const grid = document.createElement('div');
      grid.className = 'symptom-grid';
      grid.setAttribute('role', 'list');
      grid.setAttribute('aria-label', 'Typische Symptome');
      [...node.children].forEach((li) => {
        const item = document.createElement('div');
        item.className = 'symptom-item';
        item.setAttribute('role', 'listitem');
        const icon = document.createElement('div');
        icon.className = 'symptom-icon';
        icon.setAttribute('aria-hidden', 'true');
        icon.innerHTML = DOT_ICON;
        const p = document.createElement('p');
        p.innerHTML = li.innerHTML;
        item.append(icon, p);
        grid.append(item);
      });
      article.append(grid);
      return;
    }
    const link = getLink(node);
    if (link && !isHeading(node)) {
      link.classList.add('readmore');
      const p = document.createElement('p');
      p.append(link);
      article.append(p);
      return;
    }
    if (text(node)) article.append(node);
  });
  return article;
}

function buildDiagnosis(section, id) {
  const article = document.createElement('article');
  article.className = 'content-section';
  article.id = id;
  const h2 = document.createElement('h2');
  h2.innerHTML = section.heading.innerHTML;
  article.append(h2);

  const steps = document.createElement('div');
  steps.className = 'diagnosis-steps';
  let current = null;
  let num = 0;
  section.body.forEach((node) => {
    if (isHeading(node)) {
      num += 1;
      const step = document.createElement('div');
      step.className = 'diagnosis-step';
      const badge = document.createElement('div');
      badge.className = 'step-num';
      badge.setAttribute('aria-hidden', 'true');
      badge.textContent = String(num);
      const body = document.createElement('div');
      body.className = 'step-body';
      const h3 = document.createElement('h3');
      h3.innerHTML = node.innerHTML;
      body.append(h3);
      step.append(badge, body);
      steps.append(step);
      current = body;
    } else if (current && text(node)) {
      const p = document.createElement('p');
      p.innerHTML = node.innerHTML;
      current.append(p);
    } else if (text(node)) {
      article.append(node);
    }
  });
  if (steps.children.length) article.append(steps);
  return article;
}

function buildTreatment(section, id) {
  const article = document.createElement('article');
  article.className = 'content-section';
  article.id = id;
  const h2 = document.createElement('h2');
  h2.innerHTML = section.heading.innerHTML;
  article.append(h2);

  const body = section.body.filter((n) => text(n) || hasMedia(n));
  const firstH3 = body.findIndex((n) => isHeading(n));

  // Intro prose: everything before the first card's tag. Each card is authored
  // as: <p>tag</p>, <h3>title</h3>, <p>body</p>…, optional <a>readmore</a>.
  // So the tag is the paragraph immediately preceding each <h3>.
  const tagIndices = new Set();
  body.forEach((n, i) => {
    if (isHeading(n) && i > 0 && !isHeading(body[i - 1])) tagIndices.add(i - 1);
  });

  let introEnd = body.length;
  if (firstH3 !== -1) introEnd = tagIndices.has(firstH3 - 1) ? firstH3 - 1 : firstH3;
  for (let i = 0; i < introEnd; i += 1) {
    if (!tagIndices.has(i)) article.append(body[i]);
  }

  const grid = document.createElement('div');
  grid.className = 'treatment-grid';
  let card = null;
  for (let i = introEnd; i < body.length; i += 1) {
    const node = body[i];
    if (tagIndices.has(i)) {
      // tag line, consumed by the following <h3>
    } else if (isHeading(node)) {
      card = document.createElement('div');
      card.className = 'treatment-card';
      if (tagIndices.has(i - 1)) {
        const tag = document.createElement('span');
        tag.className = 'treatment-tag';
        tag.innerHTML = body[i - 1].innerHTML;
        card.append(tag);
      }
      const h3 = document.createElement('h3');
      h3.innerHTML = node.innerHTML;
      card.append(h3);
      grid.append(card);
    } else if (card) {
      const link = getLink(node);
      if (link) {
        link.classList.add('readmore');
        card.append(link);
      } else {
        card.append(node);
      }
    }
  }
  if (grid.children.length) article.append(grid);
  return article;
}

/* ── SIDEBAR widget builders ─────────────────────────────────── */

function buildSidebarImageCard(section) {
  const widget = document.createElement('div');
  widget.className = 'sidebar-widget';
  const headingText = text(section.heading);
  const isVideo = /abtasten|video/i.test(headingText)
    || section.body.some((n) => /video/i.test(text(n)));

  let img = null;
  let link = null;
  const copy = [];
  section.body.forEach((node) => {
    if (hasMedia(node)) { img = getImg(node); return; }
    const a = getLink(node);
    if (a) { link = a; return; }
    if (text(node)) copy.push(node);
  });

  if (img) {
    const thumb = document.createElement(link && isVideo ? 'a' : 'div');
    if (link && isVideo) {
      thumb.className = 'video-thumb';
      thumb.href = link.getAttribute('href');
      thumb.target = '_blank';
      thumb.rel = 'noopener';
    }
    thumb.append(img);
    if (isVideo) {
      const play = document.createElement('div');
      play.className = 'play-btn';
      play.setAttribute('aria-hidden', 'true');
      play.innerHTML = PLAY_BIG;
      thumb.append(play);
    }
    widget.append(thumb);
  }

  const body = document.createElement('div');
  body.className = 'sidebar-widget-body';
  const h3 = document.createElement('h3');
  h3.innerHTML = section.heading.innerHTML;
  body.append(h3);
  copy.forEach((p) => body.append(p));
  if (link) {
    link.classList.add('readmore');
    body.append(link);
  }
  widget.append(body);
  return widget;
}

function buildPublications(section) {
  const widget = document.createElement('div');
  widget.className = 'sidebar-widget';
  const head = document.createElement('div');
  head.className = 'sidebar-widget-body';
  const h3 = document.createElement('h3');
  h3.innerHTML = section.heading.innerHTML;
  head.append(h3);
  widget.append(head);

  const list = document.createElement('ul');
  list.className = 'publications-list';
  let row = null;
  let trailing = null;
  section.body.forEach((node) => {
    if (isHeading(node)) {
      row = document.createElement('li');
      row.className = 'publication-row';
      const a = document.createElement('a');
      const link = getLink(node);
      a.href = link ? link.getAttribute('href') : '#';
      const icon = document.createElement('div');
      icon.className = 'pub-icon';
      icon.setAttribute('aria-hidden', 'true');
      const body = document.createElement('div');
      body.className = 'pub-body';
      const title = document.createElement('h3');
      title.innerHTML = link ? link.innerHTML : node.innerHTML;
      body.append(title);
      a.append(icon, body);
      row.append(a);
      list.append(row);
      return;
    }
    const t = text(node);
    if (!t) return;
    if (row) {
      const meta = document.createElement('p');
      meta.className = 'pub-meta';
      meta.innerHTML = node.innerHTML;
      row.querySelector('.pub-body').append(meta);
      row.querySelector('.pub-icon').innerHTML = /video/i.test(t) ? PLAY_TRI : DOC_ICON;
      row = null;
    } else {
      trailing = node;
    }
  });
  if (list.children.length) widget.append(list);
  if (trailing) {
    const wrap = document.createElement('div');
    wrap.className = 'pub-foot';
    const link = getLink(trailing);
    if (link) {
      link.classList.add('readmore');
      wrap.append(link);
    } else {
      wrap.append(trailing);
    }
    widget.append(wrap);
  }
  return widget;
}

export default async function decorate(block) {
  const nodes = collectNodes(block);
  const { lead, sections } = groupSections(nodes);

  const container = document.createElement('div');
  container.className = 'container';
  const layout = document.createElement('div');
  layout.className = 'disease-layout';
  const main = document.createElement('div');
  main.className = 'disease-main';
  const sidebar = document.createElement('aside');
  sidebar.className = 'disease-sidebar';
  sidebar.setAttribute('aria-label', 'Weiterführende Informationen');

  // Partition sections into main vs sidebar.
  const mainSections = [];
  const sideSections = [];
  sections.forEach((s) => {
    if (SIDEBAR_RE.test(text(s.heading))) sideSections.push(s);
    else mainSections.push(s);
  });

  // Anchor nav from main sections.
  if (mainSections.length) {
    const nav = document.createElement('nav');
    nav.className = 'anchor-nav';
    nav.setAttribute('aria-label', 'Seitenabschnitte');
    const navHead = document.createElement('h2');
    navHead.textContent = 'Auf dieser Seite';
    const ul = document.createElement('ul');
    mainSections.forEach((s) => {
      const id = slugify(text(s.heading));
      s.anchorId = id;
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${id}`;
      a.innerHTML = s.heading.innerHTML;
      li.append(a);
      ul.append(li);
    });
    nav.append(navHead, ul);
    main.append(nav);
  }

  // Lead text.
  const leadText = lead.filter((n) => text(n));
  if (leadText.length) {
    const leadEl = document.createElement('p');
    leadEl.className = 'lead-text';
    leadEl.innerHTML = leadText.map((n) => n.innerHTML).join(' ');
    main.append(leadEl);
  }

  mainSections.forEach((s) => {
    const t = text(s.heading).toLowerCase();
    const id = s.anchorId || slugify(text(s.heading));
    if (/entstehung|ursachen/.test(t)) main.append(buildCauses(s, id));
    else if (/diagnose/.test(t)) main.append(buildDiagnosis(s, id));
    else if (/symptome/.test(t)) main.append(buildSymptoms(s, id));
    else if (/behandlung|therapie/.test(t)) main.append(buildTreatment(s, id));
    else {
      const article = document.createElement('article');
      article.className = 'content-section';
      article.id = id;
      const h2 = document.createElement('h2');
      h2.innerHTML = s.heading.innerHTML;
      article.append(h2);
      s.body.forEach((n) => { if (text(n) || hasMedia(n)) article.append(n); });
      main.append(article);
    }
  });

  sideSections.forEach((s) => {
    const t = text(s.heading).toLowerCase();
    if (/publikationen|publications/.test(t)) sidebar.append(buildPublications(s));
    else sidebar.append(buildSidebarImageCard(s));
  });

  layout.append(main);
  if (sidebar.children.length) layout.append(sidebar);
  container.append(layout);
  block.replaceChildren(container);
}
