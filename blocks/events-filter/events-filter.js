/**
 * events-filter block
 * A sticky filter bar above the events-grid. Renders a keyword field plus a set
 * of select dropdowns, then wires client-side filtering: on submit / change it
 * matches each `.events-grid li` card by the data-category / data-location /
 * text content the events-grid block stamped on it, and toggles visibility.
 *
 * DYNAMIC OPTIONS: the select OPTION LISTS are derived from the distinct values
 * in the `events` query-index (/de/events-index.json) — Ort (location), Klinik
 * (clinic), Fachgebiet and Thema — so the options always match the actual cards.
 * If the index can't be read, the authored option lists are kept verbatim.
 *
 * Authoring (flat content, classified by content not index):
 *   - a plain text line "Label: value, value, value" → one select named after
 *     the label, with one <option> per value. The first label is treated as the
 *     keyword field if it reads like "Stichwort"/"Suche", otherwise it is a
 *     select. A standalone link/Button label "Anwenden" is the submit button.
 * If no fields are authored the bar renders nothing.
 */

const INDEX_DEFAULT = '/de/events-index.json';
const FETCH_LIMIT = 500;

const SELECT_RE = /^([^:]{2,40}):\s*(.+)$/;
const KEYWORD_RE = /(stichwort|suche|keyword|name)/i;

// Maps an authored filter label to the index field whose distinct values
// should populate that select.
const LABEL_TO_FIELD = [
  { re: /(ort|location|stadt|standort)/i, field: 'location' },
  { re: /(klinik|clinic)/i, field: 'clinic' },
  { re: /(fachgebiet|fachbereich)/i, field: 'fachgebiet' },
  { re: /(thema|themen|topic)/i, field: 'thema' },
];

function fieldForLabel(label) {
  const match = LABEL_TO_FIELD.find((m) => m.re.test(label));
  return match ? match.field : null;
}

async function fetchIndex(path) {
  const rows = [];
  let offset = 0;
  let total = Infinity;
  while (offset < total) {
    // eslint-disable-next-line no-await-in-loop
    const resp = await fetch(`${path}?limit=${FETCH_LIMIT}&offset=${offset}`);
    if (!resp.ok) break;
    // eslint-disable-next-line no-await-in-loop
    const json = await resp.json();
    rows.push(...(json.data || []));
    total = json.total ?? rows.length;
    offset += FETCH_LIMIT;
    if (!json.data || json.data.length === 0) break;
  }
  return rows;
}

function distinct(rows, key) {
  return [...new Set(rows.map((r) => (r[key] || '').trim()).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, 'de'));
}

function collectLines(block) {
  const lines = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    const kids = [...cell.children];
    if (kids.length === 0) {
      const text = cell.textContent.trim();
      if (text) lines.push({ text, el: cell });
      return;
    }
    kids.forEach((el) => {
      const text = el.textContent.trim();
      if (text || el.querySelector('a')) lines.push({ text, el });
    });
  });
  return lines;
}

function normalise(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
}

export default async function decorate(block) {
  const lines = collectLines(block);

  // Pull distinct facet values from the events index up front; if it fails we
  // fall back to the authored option lists.
  let indexRows = [];
  try {
    indexRows = await fetchIndex(INDEX_DEFAULT);
  } catch {
    indexRows = [];
  }
  const facetCache = {};
  const facetValues = (field) => {
    if (!indexRows.length) return null;
    if (!facetCache[field]) facetCache[field] = distinct(indexRows, field);
    return facetCache[field].length ? facetCache[field] : null;
  };

  const container = document.createElement('div');
  container.className = 'container';

  const form = document.createElement('form');
  form.className = 'filter-form events-filters';
  form.setAttribute('role', 'search');
  form.setAttribute('aria-label', 'Veranstaltungen suchen und filtern');

  const selects = [];
  let keywordInput = null;
  let submitLabel = 'Anwenden';

  lines.forEach((line, i) => {
    const m = line.text.match(SELECT_RE);
    if (m) {
      const label = m[1].trim();
      const authoredValues = m[2].split(',').map((v) => v.trim()).filter(Boolean);
      const field = document.createElement('div');
      field.className = 'filter-field';
      const id = `event-filter-${i}`;
      const lab = document.createElement('label');
      lab.setAttribute('for', id);
      lab.textContent = label;
      field.append(lab);

      if (KEYWORD_RE.test(label)) {
        const input = document.createElement('input');
        input.type = 'text';
        input.id = id;
        input.placeholder = authoredValues[0] || label;
        input.autocomplete = 'off';
        field.append(input);
        keywordInput = input;
      } else {
        const sel = document.createElement('select');
        sel.id = id;
        sel.setAttribute('aria-label', `Nach ${label} filtern`);
        const opt0 = document.createElement('option');
        opt0.value = '';
        opt0.textContent = label;
        sel.append(opt0);
        // index-derived values when available, else the authored list
        const indexValues = facetValues(fieldForLabel(label));
        (indexValues || authoredValues).forEach((v) => {
          const o = document.createElement('option');
          o.value = v;
          o.textContent = v;
          sel.append(o);
        });
        field.append(sel);
        selects.push(sel);
      }
      form.append(field);
      return;
    }
    // a "submit"-like label
    if (line.text && /anwenden|filter|suche/i.test(line.text) && !SELECT_RE.test(line.text)) {
      submitLabel = line.text;
    }
  });

  const submitWrap = document.createElement('div');
  submitWrap.className = 'filter-submit';
  const submit = document.createElement('button');
  submit.className = 'btn btn--primary';
  submit.type = 'submit';
  submit.textContent = submitLabel;
  submitWrap.append(submit);
  form.append(submitWrap);

  container.append(form);

  const active = document.createElement('div');
  active.className = 'active-filters';
  active.setAttribute('role', 'list');
  active.setAttribute('aria-label', 'Aktive Filter');
  container.append(active);

  block.replaceChildren(container);

  // ── client-side filtering against the events-grid block ──
  const applyFilters = () => {
    const grid = document.querySelector('.events-grid');
    if (!grid) return;
    const cards = [...grid.querySelectorAll('li')];
    const kw = normalise(keywordInput ? keywordInput.value : '');
    const chosen = selects
      .map((s) => s.value)
      .filter(Boolean)
      .map(normalise);

    let visible = 0;
    cards.forEach((card) => {
      const haystack = normalise(
        `${card.textContent} ${card.dataset.category || ''} ${card.dataset.location || ''}`,
      );
      const matchKw = !kw || haystack.includes(kw);
      const matchSel = chosen.every((c) => haystack.includes(c));
      const show = matchKw && matchSel;
      card.hidden = !show;
      if (show) visible += 1;
    });

    // render active filter chips
    active.replaceChildren();
    const chips = [];
    if (keywordInput && keywordInput.value.trim()) chips.push(keywordInput.value.trim());
    selects.forEach((s) => { if (s.value) chips.push(s.value); });
    chips.forEach((label, idx) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'active-filter-chip';
      chip.innerHTML = `${label}<span class="remove-icon" aria-hidden="true">×</span>`;
      chip.setAttribute('aria-label', `Filter entfernen: ${label}`);
      chip.addEventListener('click', () => {
        if (idx === 0 && keywordInput && keywordInput.value.trim()) {
          keywordInput.value = '';
        } else {
          const sel = selects.find((s) => s.value === label);
          if (sel) sel.value = '';
        }
        applyFilters();
      });
      active.append(chip);
    });

    const header = document.querySelector('.events-grid-header .filtered-results-number');
    if (header) header.textContent = String(visible);
  };

  form.addEventListener('submit', (e) => { e.preventDefault(); applyFilters(); });
  selects.forEach((s) => s.addEventListener('change', applyFilters));
  if (keywordInput) keywordInput.addEventListener('input', applyFilters);
}
