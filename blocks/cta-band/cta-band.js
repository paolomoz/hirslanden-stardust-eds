/**
 * CTA Band block — full-width coloured band with heading, copy, and button(s).
 *
 * Authoring: single row with one cell containing default content:
 *   - <p><em>eyebrow</em></p>   — optional
 *   - <h2>Heading</h2>
 *   - <p>Description text</p>   — optional
 *   - <p><strong><a>Primary CTA</a></strong></p>
 *   - <p><em><a>Secondary CTA</a></em></p>  — optional
 *
 * Variant classes:
 *   cta-band blue   — blue background (default)
 *   cta-band warm   — warm/alt background
 *
 * @param {Element} block
 */
export default function decorate(block) {
  // The block already contains the authored content — just restructure it
  const inner = document.createElement('div');
  inner.className = 'cta-band-inner';

  const copy = document.createElement('div');
  copy.className = 'cta-band-copy';

  const actions = document.createElement('div');
  actions.className = 'cta-band-actions';

  // Walk children of first cell and sort into copy vs actions
  const cell = block.querySelector(':scope > div > div');
  if (cell) {
    [...cell.childNodes].forEach((node) => {
      if (node.nodeType !== Node.ELEMENT_NODE) return;

      const strong = node.querySelector('strong > a, strong');
      const em = node.querySelector('em > a, em');

      if (strong) {
        const a = strong.querySelector('a') || strong;
        const btn = document.createElement('a');
        btn.className = 'btn btn--onblue';
        btn.href = a.href || '#';
        btn.textContent = a.textContent.trim();
        actions.append(btn);
      } else if (em && em.querySelector('a')) {
        const a = em.querySelector('a');
        const btn = document.createElement('a');
        btn.className = 'btn btn--onblue btn--secondary';
        btn.href = a.href;
        btn.textContent = a.textContent.trim();
        actions.append(btn);
      } else {
        copy.append(node.cloneNode(true));
      }
    });
  }

  inner.append(copy);
  if (actions.children.length) inner.append(actions);

  block.innerHTML = '';
  block.append(inner);
}
