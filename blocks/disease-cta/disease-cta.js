/**
 * disease-cta block
 * A split CTA band: a copy column (heading + paragraph) and an actions column
 * of buttons. The first action gets btn--primary; subsequent actions get
 * btn--onblue (outlined white button).
 *
 * Authoring (flattened cell or one-row): a heading, a paragraph, then the
 * action links as plain <a>.
 */

const isHeading = (el) => /^h[1-6]$/.test(el.tagName.toLowerCase());

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

const asAnchor = (el) => (el.tagName.toLowerCase() === 'a' ? el : el.querySelector('a'));

export default async function decorate(block) {
  const nodes = collectNodes(block);

  const heading = nodes.find((n) => isHeading(n));
  const actions = nodes.filter((n) => asAnchor(n));
  const paras = nodes.filter((n) => n !== heading && !asAnchor(n) && n.textContent.trim());

  const container = document.createElement('div');
  container.className = 'container';

  const copy = document.createElement('div');
  copy.className = 'disease-cta-copy';
  if (heading) {
    const h = document.createElement('h2');
    h.innerHTML = heading.innerHTML;
    copy.append(h);
  }
  paras.forEach((p) => {
    const para = document.createElement('p');
    para.innerHTML = p.innerHTML;
    copy.append(para);
  });

  const actionsWrap = document.createElement('div');
  actionsWrap.className = 'disease-cta-actions';
  actions.forEach((node, i) => {
    const a = asAnchor(node);
    const btn = document.createElement('a');
    btn.href = a.getAttribute('href') || '#';
    btn.innerHTML = a.innerHTML;
    btn.className = i === 0 ? 'btn btn--primary' : 'btn btn--onblue';
    actionsWrap.append(btn);
  });

  container.append(copy, actionsWrap);
  block.replaceChildren(container);
}
