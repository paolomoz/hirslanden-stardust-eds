/**
 * Events Filter block — sticky filter bar for the events listing page.
 *
 * Authoring rows — each row defines one filter field:
 *   Col 1: field label
 *   Col 2: field type ("search" | "select")
 *   Col 3: field name (used as query param)
 *   Col 4+: option values (one per additional cell, or comma-separated in one cell)
 *
 * The last authored row may be a "submit" row (col 1 = "submit", col 2 = button label).
 *
 * Dispatches a CustomEvent "events-filter:change" on the block with
 * { detail: { filters: { [name]: value } } } so events-grid can react.
 *
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  block.innerHTML = '';

  const form = document.createElement('form');
  form.className = 'events-filter-form';
  form.setAttribute('role', 'search');
  form.setAttribute('aria-label', 'Veranstaltungen suchen und filtern');

  let submitLabel = 'Anwenden';

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    if (!cells.length) return;

    const label = cells[0]?.textContent.trim();
    const type = cells[1]?.textContent.trim().toLowerCase();
    const name = cells[2]?.textContent.trim();

    // Submit row
    if (label?.toLowerCase() === 'submit') {
      submitLabel = type || submitLabel;
      return;
    }

    const field = document.createElement('div');
    field.className = 'events-filter-field';

    const labelEl = document.createElement('label');
    const inputId = `ef-${name || label?.toLowerCase().replace(/\s+/g, '-')}`;
    labelEl.htmlFor = inputId;
    labelEl.textContent = label;
    field.append(labelEl);

    if (type === 'search') {
      const input = document.createElement('input');
      input.type = 'text';
      input.id = inputId;
      input.name = name || 'q';
      input.placeholder = label;
      input.autocomplete = 'off';
      field.append(input);
    } else {
      // select
      const select = document.createElement('select');
      select.id = inputId;
      select.name = name || label;
      select.setAttribute('aria-label', `Nach ${label} filtern`);

      const defaultOpt = document.createElement('option');
      defaultOpt.value = '';
      defaultOpt.textContent = label;
      select.append(defaultOpt);

      // Options from cells[3..n] or comma-split from cells[3]
      const optionCells = cells.slice(3);
      const options = optionCells.length === 1
        ? optionCells[0].textContent.split(',').map((s) => s.trim()).filter(Boolean)
        : optionCells.map((c) => c.textContent.trim()).filter(Boolean);

      options.forEach((val) => {
        const opt = document.createElement('option');
        opt.value = val;
        opt.textContent = val;
        select.append(opt);
      });

      field.append(select);
    }

    form.append(field);
  });

  // Submit button
  const submitWrap = document.createElement('div');
  submitWrap.className = 'events-filter-submit';
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'btn btn--primary';
  submitBtn.textContent = submitLabel;
  submitWrap.append(submitBtn);
  form.append(submitWrap);

  // Active filters area
  const activeFilters = document.createElement('div');
  activeFilters.className = 'events-filter-active';
  activeFilters.setAttribute('role', 'list');
  activeFilters.setAttribute('aria-label', 'Aktive Filter');

  block.append(form);
  block.append(activeFilters);

  // Collect and dispatch filter state, then re-render active chips
  const dispatchChange = () => {
    const data = new FormData(form);
    const filters = {};
    data.forEach((val, key) => {
      if (val) filters[key] = val;
    });
    block.dispatchEvent(new CustomEvent('events-filter:change', {
      bubbles: true,
      detail: { filters },
    }));

    // Render active filter chips
    activeFilters.innerHTML = '';
    Object.entries(filters).forEach(([key, val]) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'events-filter-chip';
      chip.setAttribute('role', 'listitem');
      chip.innerHTML = `${val} <span class="events-filter-chip-remove" aria-hidden="true">&times;</span>`;
      chip.addEventListener('click', () => {
        const el = form.elements[key];
        if (el) el.value = '';
        dispatchChange();
      });
      activeFilters.append(chip);
    });
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    dispatchChange();
  });

  // Live filtering on input change
  form.addEventListener('change', dispatchChange);
  form.addEventListener('input', dispatchChange);
}
