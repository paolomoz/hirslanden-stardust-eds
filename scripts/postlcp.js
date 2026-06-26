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

export default async function loadPostLCP() {
  await Promise.all([
    loadStaticFragment('header'),
    loadStaticFragment('footer'),
  ]);
}
