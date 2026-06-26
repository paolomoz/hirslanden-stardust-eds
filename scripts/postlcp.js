import { getConfig } from './ak.js';

async function loadStaticFragment(name) {
  const el = document.querySelector(name);
  if (!el) return;
  const { codeBase } = getConfig();
  // Language-prefixed nav: /fr/… and /en/… pages load their own fragment;
  // everything else uses the default (DE). Fall back to default if absent.
  const seg = window.location.pathname.split('/')[1];
  const lang = (seg === 'fr' || seg === 'en') ? `${seg}/` : '';
  let resp = await fetch(`${codeBase}/fragments/${lang}${name}.html`);
  if (!resp.ok && lang) resp = await fetch(`${codeBase}/fragments/${name}.html`);
  if (!resp.ok) return;
  const html = await resp.text();
  el.className = name; // so header.header / footer.footer selectors match
  el.innerHTML = html;
}

// Per-language landing the switcher uses when no migrated equivalent of the
// current page exists in the target language.
const LANG_HOME = { de: '/', fr: '/fr/corporate/home', en: '/en/corporate/home' };

// Repoint the header language switcher so each language link goes to the SAME
// page in that language (when it has been migrated), falling back to that
// language's home otherwise. Paths are fully localized across DE/FR/EN, so the
// equivalence comes from /translations.json (built from source hreflang groups).
async function decorateLangSwitcher() {
  const links = document.querySelectorAll('header .lang a');
  if (!links.length) return;
  const { codeBase } = getConfig();

  let here = window.location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
  let group;
  try {
    const resp = await fetch(`${codeBase}/translations.json`);
    if (resp.ok) group = (await resp.json())[here];
  } catch { /* no map → every link uses its language home */ }

  links.forEach((a) => {
    const lang = a.textContent.trim().toLowerCase();
    if (!['de', 'fr', 'en'].includes(lang)) return;
    if (a.getAttribute('aria-current') === 'true') return; // current language: leave as-is
    const target = (group && group[lang]) || LANG_HOME[lang];
    if (target) a.href = target;
  });
}

export default async function loadPostLCP() {
  await Promise.all([
    loadStaticFragment('header'),
    loadStaticFragment('footer'),
  ]);
  await decorateLangSwitcher();
}
