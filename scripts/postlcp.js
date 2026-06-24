import { getConfig } from './ak.js';

async function loadStaticFragment(name) {
  const el = document.querySelector(name);
  if (!el) return;
  const { codeBase } = getConfig();
  const resp = await fetch(`${codeBase}/fragments/${name}.html`);
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
