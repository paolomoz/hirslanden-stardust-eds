#!/usr/bin/env node
/*
 * Build /translations.json — a cross-language equivalence map for the header
 * language switcher.
 *
 * Paths are fully localized across DE/FR/EN (section names AND slugs differ), so
 * there is no deterministic path rewrite. The reliable cross-language link is the
 * source site's hreflang group. We harvest those groups from the source pages of
 * every migrated FR/EN page, then resolve each group member against the set of
 * pages we actually migrated (an existing local file = a published page).
 *
 * Output: { "<extensionless delivery path>": { de, fr, en } } where each value is
 * the migrated equivalent's delivery path, or null when not migrated. The map is
 * keyed by EVERY migrated member of a group, so a DE page whose FR/EN equivalent
 * was migrated also becomes a key (the switcher finds it from the FR/EN side).
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const CONTENT = join(ROOT, 'content');
const SRC_HOST = 'https://www.hirslanden.ch';

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(full));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

// content/de/x/y.html -> /de/x/y ; content/index.html -> /
function toDeliveryPath(file) {
  let p = `/${relative(CONTENT, file)}`.replace(/\.html$/, '');
  if (p === '/index') return '/';
  return p;
}

// source URL -> candidate extensionless delivery path (host stripped, .html dropped)
function srcToDelivery(url) {
  const u = url.replace(SRC_HOST, '').replace(/\.html$/, '').replace(/\/$/, '');
  return u || '/';
}

// Home/landing stubs — always routed by the switcher's LANG_HOME fallback, never
// keyed in the map (their source hreflang is inconsistent: it points at redirect
// stubs and the DE home lives at `/`, so a partial map entry is worse than the
// clean per-language home fallback).
const HOMES = new Set(['/', '/fr/corporate/home', '/en/corporate/home', '/fr/corporate', '/en/corporate']);

function langOf(deliveryPath) {
  const seg = deliveryPath.split('/')[1];
  return (seg === 'fr' || seg === 'en') ? seg : 'de';
}

async function main() {
  const files = await walk(CONTENT);
  const delivered = new Set(files.map(toDeliveryPath)); // every migrated/published page
  const frEn = files.map(toDeliveryPath).filter((p) => p.startsWith('/fr/') || p.startsWith('/en/'));

  const map = {};
  let groups = 0; let fetched = 0; let failed = 0;

  for (const path of frEn) {
    const srcUrl = `${SRC_HOST}${path}.html`;
    let html;
    try {
      const resp = await fetch(srcUrl);
      if (!resp.ok) { failed += 1; continue; }
      html = await resp.text();
      fetched += 1;
    } catch { failed += 1; continue; }

    const group = { de: null, fr: null, en: null };
    const re = /<link[^>]+rel="alternate"[^>]*>/gi;
    for (const tag of html.match(re) || []) {
      const href = (tag.match(/href="([^"]+)"/i) || [])[1];
      const hl = (tag.match(/hreflang="([^"]+)"/i) || [])[1] || '';
      if (!href || hl.startsWith('x-default')) continue;
      const lang = hl.slice(0, 2);
      if (!['de', 'fr', 'en'].includes(lang)) continue;
      const cand = srcToDelivery(href);
      // a group member counts only if we actually migrated/published it and it
      // isn't a home/landing stub (those use the LANG_HOME fallback)
      if (delivered.has(cand) && !HOMES.has(cand)) group[lang] = cand;
    }
    if (HOMES.has(path)) continue; // don't key home pages
    // make sure the page itself is recorded as its own language member
    group[langOf(path)] = path;

    const members = Object.values(group).filter(Boolean);
    if (members.length < 2) continue; // no cross-language target -> switcher uses home fallback
    groups += 1;
    for (const m of members) map[m] = group;
  }

  // Second pass — doctors. Doctor pages share their slug across languages (names
  // aren't translated); only the section differs (DE `aerzte`, FR/EN `doctors`).
  // The source URL 404s for these, but the equivalents are migrated locally, so
  // resolve them deterministically by section swap + existence check.
  let docGroups = 0;
  const docTail = /^\/(?:fr|en)\/corporate\/doctors\/(.+)$/;
  for (const path of frEn) {
    if (map[path]) continue;
    const m = path.match(docTail);
    if (!m) continue;
    const tail = m[1];
    const cand = {
      de: `/de/corporate/aerzte/${tail}`,
      fr: `/fr/corporate/doctors/${tail}`,
      en: `/en/corporate/doctors/${tail}`,
    };
    const group = { de: null, fr: null, en: null };
    for (const [lang, c] of Object.entries(cand)) if (delivered.has(c)) group[lang] = c;
    const members = Object.values(group).filter(Boolean);
    if (members.length < 2) continue;
    docGroups += 1;
    for (const mem of members) if (!map[mem]) map[mem] = group;
  }
  console.log(`doctor groups recovered: ${docGroups}`);

  const sorted = Object.fromEntries(Object.keys(map).sort().map((k) => [k, map[k]]));
  await writeFile(join(ROOT, 'translations.json'), `${JSON.stringify(sorted, null, 0)}\n`);
  console.log(`fetched=${fetched} failed=${failed} groups=${groups} keys=${Object.keys(map).length}`);
}

main();
