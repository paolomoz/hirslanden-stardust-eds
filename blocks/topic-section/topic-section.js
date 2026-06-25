/**
 * topic-section block
 * A flexible, content-driven educational section. It always opens with a
 * `.section-head` (eyebrow + h2 + optional intro paragraph), then renders any
 * mix of:
 *   - an ACCORDION built from repeating (<h3> title + its body) groups,
 *   - trailing PROSE paragraphs + an optional primary-button CTA,
 *   - a PUBLICATIONS link-list (when sub-headings carry only links).
 *
 * Authoring contract (DA-flattened single cell OR one-row-per-part; both work):
 *   - leading short text → eyebrow
 *   - first heading → section h2
 *   - paragraph(s) right after the h2, before any <h3> → section-head intro
 *   - each accordion item = an <h3> title followed by its body
 *     (paragraphs / links / lists). First item opens by default.
 *   - if there are no <h3> items: render the head + prose + any button.
 *
 * Background variant: author writes `topic-section` (warm default), or adds
 * `alt` / `plain` as a variant class. Classification is content-based.
 */

const isHeading = (el) => /^h[1-6]$/.test(el.tagName.toLowerCase());
const isSubHeading = (el) => /^h[3-6]$/.test(el.tagName.toLowerCase());
const anchorOf = (el) => (el.tagName.toLowerCase() === 'a' ? el : el.querySelector('a'));
const isButton = (el) => {
  const a = anchorOf(el);
  if (!a) return false;
  const href = a.getAttribute('href') || '';
  return !href.startsWith('tel:') && !href.startsWith('mailto:');
};

let uid = 0;

/**
 * Collect element children across every cell of the block.
 * Bare text cells become <p>.
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

/**
 * Build a primary-button anchor from an authored link element.
 * @param {Element} node
 * @returns {HTMLAnchorElement}
 */
function buildButton(node) {
  const src = anchorOf(node);
  const a = document.createElement('a');
  a.className = 'btn btn--primary topic-cta';
  a.href = src.getAttribute('href') || '#';
  a.innerHTML = src.innerHTML;
  return a;
}

/**
 * Build one accordion item from a title and its body nodes.
 * @param {Element} title an <h3>-ish heading
 * @param {Element[]} body following content nodes
 * @param {boolean} open whether the item starts open
 */
function buildAccordionItem(title, body, open) {
  uid += 1;
  const id = uid;
  const item = document.createElement('div');
  item.className = 'accordion-item';
  item.setAttribute('role', 'listitem');

  const trigger = document.createElement('button');
  trigger.className = 'accordion-trigger';
  trigger.type = 'button';
  trigger.setAttribute('aria-expanded', String(open));
  trigger.setAttribute('aria-controls', `topic-panel-${id}`);
  trigger.id = `topic-trigger-${id}`;

  const label = document.createElement('span');
  label.innerHTML = title.innerHTML;
  const icon = document.createElement('span');
  icon.className = 'accordion-icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = '+';
  trigger.append(label, icon);

  const panel = document.createElement('div');
  panel.className = open ? 'accordion-panel is-open' : 'accordion-panel';
  panel.id = `topic-panel-${id}`;
  panel.setAttribute('role', 'region');
  panel.setAttribute('aria-labelledby', `topic-trigger-${id}`);
  body.forEach((n) => panel.append(n));

  item.append(trigger, panel);
  return item;
}

/**
 * Render a flat publications link-list: each sub-heading is a list item link.
 * @param {Array<{title:Element, body:Element[]}>} groups
 * @returns {Element}
 */
function buildPublications(groups) {
  const col = document.createElement('div');
  col.className = 'pub-col';
  const list = document.createElement('ul');
  list.className = 'pub-list';

  groups.forEach(({ title, body }) => {
    const li = document.createElement('li');
    const href = body.map(anchorOf).find(Boolean);
    if (href) {
      const a = document.createElement('a');
      a.href = href.getAttribute('href') || '#';
      a.innerHTML = title.innerHTML;
      li.append(a);
    } else {
      const span = document.createElement('span');
      span.innerHTML = title.innerHTML;
      li.append(span);
    }
    list.append(li);
  });

  col.append(list);
  return col;
}

export default async function decorate(block) {
  const nodes = collectNodes(block);

  const container = document.createElement('div');
  container.className = 'container';

  const head = document.createElement('div');
  head.className = 'section-head';

  let i = 0;

  // Leading short non-heading text → eyebrow.
  if (nodes[i] && !isHeading(nodes[i]) && !anchorOf(nodes[i])
    && nodes[i].textContent.trim() && nodes[i].textContent.trim().length <= 48) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 'eyebrow';
    eyebrow.innerHTML = nodes[i].innerHTML;
    head.append(eyebrow);
    i += 1;
  }

  // First heading (h1/h2) → section h2.
  if (nodes[i] && isHeading(nodes[i]) && !isSubHeading(nodes[i])) {
    const h2 = document.createElement('h2');
    h2.innerHTML = nodes[i].innerHTML;
    head.append(h2);
    i += 1;
  }

  // Intro paragraph(s) before any sub-structure → section-head intro.
  while (nodes[i] && !isSubHeading(nodes[i]) && !anchorOf(nodes[i])
    && nodes[i].textContent.trim()) {
    const p = document.createElement('p');
    p.innerHTML = nodes[i].innerHTML;
    head.append(p);
    i += 1;
  }

  container.append(head);

  // Partition the remaining nodes into (h3 title → body) groups and any
  // leading prose/buttons that precede the first sub-heading.
  const rest = nodes.slice(i);
  const leading = [];
  const groups = [];
  let current = null;
  rest.forEach((node) => {
    if (isSubHeading(node)) {
      current = { title: node, body: [] };
      groups.push(current);
    } else if (current) {
      current.body.push(node);
    } else {
      leading.push(node);
    }
  });

  // Trailing prose + CTA that precede any accordion (rehabilitation case).
  leading.forEach((node) => {
    if (isButton(node)) {
      container.append(buildButton(node));
      return;
    }
    if (!node.textContent.trim()) return;
    const p = document.createElement('p');
    p.className = 'topic-prose';
    p.innerHTML = node.innerHTML;
    container.append(p);
  });

  if (groups.length) {
    // Publications shape: every group is title + link only (no prose body).
    const isPublications = groups.every(({ body }) => body.length
      && body.every((n) => anchorOf(n) || !n.textContent.trim()));

    if (isPublications) {
      const col = buildPublications(groups);
      container.append(col);
    } else {
      const accordion = document.createElement('div');
      accordion.className = 'accordion';
      accordion.setAttribute('role', 'list');
      groups.forEach(({ title, body }, idx) => {
        accordion.append(buildAccordionItem(title, body, idx === 0));
      });
      container.append(accordion);

      // Wire toggling + Escape (first item open by default).
      const triggers = [...accordion.querySelectorAll('.accordion-trigger')];
      triggers.forEach((trigger) => {
        trigger.addEventListener('click', () => {
          const expanded = trigger.getAttribute('aria-expanded') === 'true';
          const panel = document.getElementById(trigger.getAttribute('aria-controls'));
          trigger.setAttribute('aria-expanded', String(!expanded));
          if (panel) panel.classList.toggle('is-open', !expanded);
        });
        trigger.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && trigger.getAttribute('aria-expanded') === 'true') {
            const panel = document.getElementById(trigger.getAttribute('aria-controls'));
            trigger.setAttribute('aria-expanded', 'false');
            if (panel) panel.classList.remove('is-open');
          }
        });
      });
    }
  }

  block.replaceChildren(container);
}
