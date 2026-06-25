/**
 * Proof block — trust statistics strip
 * Authored row structure (one row per stat):
 *   Row: [number/value] | [label]
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    row.className = 'proof-item';
    const numEl = document.createElement('span');
    numEl.className = 'proof-num';
    numEl.textContent = cells[0]?.textContent?.trim() || '';
    const labelEl = document.createElement('span');
    labelEl.className = 'proof-label';
    labelEl.textContent = cells[1]?.textContent?.trim() || '';
    row.innerHTML = '';
    row.append(numEl, labelEl);
  });
}
