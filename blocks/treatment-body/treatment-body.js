/**
 * treatment-body block
 * Faithful rebuild of the treatment-detail prototype's `.td-body`: a two-column
 * layout (main + sticky sidebar). The main column carries four sub-sections
 * (Indikation, Ablauf/steps, Genesung/recovery, Risiken); the sidebar carries a
 * Behandlungszentren panel and a "Termin vereinbaren" CTA card.
 *
 * Authoring (flat content, both DA-flattened single-cell and one-row shapes):
 * a sequence of <h2>-opened sub-sections, classified by their heading text:
 *   - "Indikation …"        → indication panel. A leading eyebrow line (the text
 *                             before the h2) becomes .eyebrow; paragraphs become
 *                             prose; a trailing line of "·"-separated terms turns
 *                             into chips.
 *   - "Ablauf …"            → numbered steps. Each step is an <h3> title followed
 *                             by paragraph(s); the block auto-numbers them.
 *   - "Genesung …"          → recovery panel. Fact chips are authored as
 *                             paragraphs shaped "Label: Value"; remaining
 *                             paragraphs become prose.
 *   - "Risiken …"           → risks panel. A <ul> renders verbatim.
 *   - "Behandlungszentren"  → sidebar centres panel. City chips authored as a
 *                             "·"-separated paragraph; a count paragraph and a
 *                             trailing link (.readmore) follow.
 *   - "Termin …"            → sidebar CTA card. Paragraph copy + a single link
 *                             rendered as a btn--onblue button.
 * Classification is content-based; nothing is hard-indexed.
 */

const isHeading = (el) => /^h[1-6]$/.test(el.tagName.toLowerCase());
const text = (el) => (el ? el.textContent.trim() : '');

/**
 * Collect element children of every cell. Bare-text cells become <p>.
 * @param {Element} block
 * @returns {Element[]}
 */
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

/**
 * Group the flat node list into sections delimited by <h2>. Any nodes before the
 * first <h2> are attached to the first section as its lead-in (eyebrow).
 * @param {Element[]} nodes
 * @returns {{heading: Element|null, lead: Element[], body: Element[]}[]}
 */
function groupSections(nodes) {
  const sections = [];
  let current = null;
  let lead = [];
  nodes.forEach((node) => {
    if (node.tagName.toLowerCase() === 'h2') {
      // An eyebrow line authored right before an <h2> lands in the previous
      // section's body. Pull such a trailing single-line <p> into this h2's
      // lead so it renders as the new section's eyebrow.
      if (current && current.body.length) {
        const last = current.body[current.body.length - 1];
        const t = text(last);
        const looksLikeEyebrow = last.tagName.toLowerCase() === 'p'
          && !last.querySelector('a, ul, ol, strong')
          && t.length <= 40
          && !/[.!?]$/.test(t)
          && !t.includes(':');
        if (looksLikeEyebrow) lead.push(current.body.pop());
      }
      current = { heading: node, lead, body: [] };
      sections.push(current);
      lead = [];
    } else if (current) {
      current.body.push(node);
    } else {
      lead.push(node);
    }
  });
  return sections;
}

function makeEyebrow(node) {
  const p = document.createElement('p');
  p.className = 'eyebrow';
  p.innerHTML = node.innerHTML;
  return p;
}

function buildIndication(section) {
  const article = document.createElement('article');
  article.className = 'td-indication';
  const eyebrow = section.lead.find((n) => !isHeading(n) && text(n));
  if (eyebrow) article.append(makeEyebrow(eyebrow));
  const h2 = document.createElement('h2');
  h2.innerHTML = section.heading.innerHTML;
  article.append(h2);

  const chipSources = [];
  section.body.forEach((node) => {
    const t = text(node);
    if (!t) return;
    // A short paragraph of "·"-separated terms → chips.
    if (node.tagName.toLowerCase() === 'p' && t.includes('·')) {
      chipSources.push(...t.split('·').map((s) => s.trim()).filter(Boolean));
      return;
    }
    article.append(node);
  });

  if (chipSources.length) {
    const chips = document.createElement('div');
    chips.className = 'td-indication-types';
    chipSources.forEach((label) => {
      const span = document.createElement('span');
      span.className = 'chip';
      span.textContent = label;
      chips.append(span);
    });
    article.append(chips);
  }
  return article;
}

function buildSteps(section) {
  const wrap = document.createElement('section');
  wrap.className = 'td-steps';
  const head = document.createElement('div');
  head.className = 'td-steps-head';
  const eyebrow = section.lead.find((n) => !isHeading(n) && text(n));
  if (eyebrow) head.append(makeEyebrow(eyebrow));
  const h2 = document.createElement('h2');
  h2.innerHTML = section.heading.innerHTML;
  head.append(h2);
  wrap.append(head);

  const list = document.createElement('ol');
  list.className = 'td-steps-list';
  let current = null;
  let num = 0;
  section.body.forEach((node) => {
    if (isHeading(node)) {
      num += 1;
      const li = document.createElement('li');
      li.className = 'td-step';
      const badge = document.createElement('span');
      badge.className = 'td-step-num';
      badge.setAttribute('aria-hidden', 'true');
      badge.textContent = String(num);
      const body = document.createElement('div');
      body.className = 'td-step-body';
      const h3 = document.createElement('h3');
      h3.innerHTML = node.innerHTML;
      body.append(h3);
      li.append(badge, body);
      list.append(li);
      current = body;
    } else if (current && text(node)) {
      const p = document.createElement('p');
      p.innerHTML = node.innerHTML;
      current.append(p);
    }
  });
  if (list.children.length) wrap.append(list);
  return wrap;
}

function buildRecovery(section) {
  const article = document.createElement('article');
  article.className = 'td-recovery';
  const eyebrow = section.lead.find((n) => !isHeading(n) && text(n));
  if (eyebrow) article.append(makeEyebrow(eyebrow));
  const h2 = document.createElement('h2');
  h2.innerHTML = section.heading.innerHTML;
  article.append(h2);

  const chips = document.createElement('div');
  chips.className = 'td-recovery-chips';
  const prose = [];
  section.body.forEach((node) => {
    const t = text(node);
    if (!t) return;
    const colon = t.indexOf(':');
    const isChip = node.tagName.toLowerCase() === 'p' && colon > 0;
    const value = isChip ? t.slice(colon + 1).trim() : '';
    if (isChip && value) {
      const chip = document.createElement('div');
      chip.className = 'td-fact-chip';
      const label = document.createElement('span');
      label.className = 'fc-label';
      label.textContent = t.slice(0, colon).trim();
      const val = document.createElement('span');
      val.className = 'fc-value';
      val.textContent = value;
      chip.append(label, val);
      chips.append(chip);
    } else {
      prose.push(node);
    }
  });
  if (chips.children.length) article.append(chips);
  prose.forEach((node) => article.append(node));
  return article;
}

function buildRisks(section) {
  const article = document.createElement('article');
  article.className = 'td-risks';
  const h2 = document.createElement('h2');
  h2.innerHTML = section.heading.innerHTML;
  article.append(h2);
  section.body.forEach((node) => {
    if (text(node)) article.append(node);
  });
  return article;
}

function buildCentres(section) {
  const panel = document.createElement('div');
  panel.className = 'td-centres-panel';
  panel.setAttribute('aria-label', 'Behandlungszentren');
  const h3 = document.createElement('h3');
  h3.innerHTML = section.heading.innerHTML;
  panel.append(h3);

  section.body.forEach((node) => {
    const t = text(node);
    if (!t) return;
    const isLink = node.matches('a') || node.querySelector('a');
    if (node.tagName.toLowerCase() === 'p' && t.includes('·') && !isLink) {
      const chips = document.createElement('div');
      chips.className = 'td-city-chips';
      chips.setAttribute('role', 'group');
      t.split('·').map((s) => s.trim()).filter(Boolean).forEach((city) => {
        const span = document.createElement('span');
        span.className = 'td-city-chip';
        span.setAttribute('tabindex', '0');
        span.innerHTML = city.replace(/ /g, '&nbsp;');
        chips.append(span);
      });
      panel.append(chips);
    } else if (isLink) {
      const a = node.querySelector('a') || node;
      a.classList.add('readmore');
      panel.append(a);
    } else {
      const p = document.createElement('p');
      p.className = 'td-centres-count';
      p.innerHTML = node.innerHTML;
      panel.append(p);
    }
  });
  return panel;
}

function buildCta(section) {
  const card = document.createElement('div');
  card.className = 'td-sidebar-cta';
  card.setAttribute('role', 'complementary');
  card.setAttribute('aria-label', 'Termin vereinbaren');
  const h3 = document.createElement('h3');
  h3.innerHTML = section.heading.innerHTML;
  card.append(h3);
  section.body.forEach((node) => {
    const t = text(node);
    if (!t) return;
    const link = node.matches('a') ? node : node.querySelector('a');
    if (link) {
      link.classList.add('btn', 'btn--onblue');
      card.append(link);
    } else {
      card.append(node);
    }
  });
  return card;
}

export default async function decorate(block) {
  const nodes = collectNodes(block);
  const sections = groupSections(nodes);

  const container = document.createElement('div');
  container.className = 'container';
  const main = document.createElement('div');
  main.className = 'td-main';
  const sidebar = document.createElement('aside');
  sidebar.className = 'td-sidebar';
  sidebar.setAttribute('aria-label', 'Zusatzinformationen');
  const sticky = document.createElement('div');
  sticky.className = 'td-sidebar-sticky';

  sections.forEach((section) => {
    const title = text(section.heading).toLowerCase();
    if (/indikation|krankheitsbild/.test(title)) {
      main.append(buildIndication(section));
    } else if (/genesung|nachsorge|erholung/.test(title)) {
      main.append(buildRecovery(section));
    } else if (/ablauf|hernienoperation|behandlung ab/.test(title)) {
      main.append(buildSteps(section));
    } else if (/risiken|komplikation/.test(title)) {
      main.append(buildRisks(section));
    } else if (/zentren|zentrum/.test(title)) {
      sticky.append(buildCentres(section));
    } else if (/termin|vereinbaren|kontakt/.test(title)) {
      sticky.append(buildCta(section));
    } else {
      // Unknown section: keep as plain prose in the main column.
      const article = document.createElement('article');
      article.className = 'td-risks';
      const h2 = document.createElement('h2');
      h2.innerHTML = section.heading.innerHTML;
      article.append(h2);
      section.body.forEach((node) => article.append(node));
      main.append(article);
    }
  });

  if (sticky.children.length) sidebar.append(sticky);
  container.append(main);
  if (sidebar.children.length) container.append(sidebar);
  block.replaceChildren(container);
}
