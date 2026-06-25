# Dynamic content blocks — map, index design, metadata contract

Analysis of which blocks list content from *other* pages and must become
index-driven (EDS query-index) instead of static-authored. Done before importing
the full site (1000s of pages) so the content track emits the right metadata.

## The core constraint (drives everything)

An EDS **query-index** is a published JSON of pages, each row carrying properties
extracted from the *rendered page* by CSS selectors in `helix-query.yaml`. So a
block can filter/sort/list only on:

1. **Page-intrinsic DOM** — title (`h1`), image (`og:image`), and links already in
   the page (a doctor's specialty/clinic links). Extractable today, no content
   change. ✅
2. **Page metadata** — anything NOT visible/structured in the DOM (article date,
   event date/time, clinic canton, a center's catchment) must be emitted as
   `<meta name="…">` via the page's **metadata block**. Not present today. ⚠️
3. **Relationships** (center↔disease, clinic↔specialty) — many-to-many joins a flat
   index can't express without an explicit join field (`topics:`/`treats:`) in the
   metadata of one side. Not modeled today. ❌

→ **Metadata contract (below) is the deliverable that matters for the 1000s import.**

## Block map

### Tier 1 — dynamic now, fields are page-intrinsic (clean) ✅
| Block | Lists | Index | Sort/filter | Card fields (all in DOM) |
|---|---|---|---|---|
| **`doctor-search`** (NEW) | doctors | `doctors` | filter name/specialty/clinic, paginate | name(h1), specialty+path, clinic+path, image |
| `clinic-grid` | clinics A–Z | `clinics` | A–Z, keyword filter | name(h1), image, path (address/phone ⚠️ meta) |
| `clinic-finder` | clinics (compact) | `clinics` | A–Z | name, path |

### Tier 2 — dynamic, but need METADATA the migration must emit ⚠️
| Block | Lists | Needs metadata | Default without it |
|---|---|---|---|
| `article-list` | news | `publishDate`, `category` | sort by `lastModified` (≈recency on fresh import) |
| `whats-happening` | news+events (home) | `publishDate`, `eventDate` | lastModified for news; events need eventDate |
| `events-grid`+`events-filter` | events | `eventDate`, `clinic`, `location`, `fachgebiet`, `thema` | cannot filter "upcoming" without `eventDate` |
| `events-news` | per-clinic news+events | above + path-prefix scope | clinic scope works (path); date needs meta |

### Tier 3 — blocked on data modeling (relationships) ❌
| Block | Lists | Blocker |
|---|---|---|
| `centers` (21 disease pages) | competence centers for a disease | centers aren't pages (cards link only to `tel:`); center↔disease is an unmodeled many-to-many. Needs center pages + a `treats:` join field. |
| `clinic-locations` (4 specialty pages) | clinics offering a specialty | links are non-uniform per-clinic deep URLs; clinic↔specialty join not modeled. Needs `topics:` on the per-clinic specialty subpages. |
| `featured-centers` | a clinic's featured centers | single page, curated copy/order — keep editorial. |

### Keep static (editorial curation, not listings)
`hero-search` (rewire its form action → `doctor-search`), `quicklinks`,
`proof-strip`, `group-teasers`, `service-teasers`, `services-cards`,
`specialties`, `topic-section`, `locate`, `location`, `map-cta`, `archive-cta`,
`listing-hero`.

## Metadata contract — what the content track must emit per type

Authored in each page's **metadata block** (`<meta name="…">` after render). The
migration/`deploy` step should emit these so the indexes are rich at import time.

- **doctor** — *(none required; name/specialty/clinic/image all DOM-derived)*.
  Optional: `canton`, `location` for facets.
- **news** — `publishDate` (ISO `YYYY-MM-DD`), `category` (Medienmitteilung|News).
- **event** — `eventDate` (ISO), `eventEnd`?, `clinic`, `location` (city),
  `fachgebiet`, `thema`.
- **clinic** (`/de/<clinic>/home`) — `canton`, `city`, `address`, `phone`,
  `mapsUrl` (so `clinic-grid`/`clinic-finder`/`location` share one source).
- **disease / treatment** — `topics` (slugs) only if centers/relationship listing
  is wanted.
- **center pages** (don't exist yet) — would need creating with `clinic`,
  `address`, `phone`, `treats:` (disease/treatment slugs).

## Indexes (`helix-query.yaml`)

`doctors`, `clinics`, `news`, `events` defined. Page-intrinsic properties populate
now; metadata-backed properties (date/canton/etc.) populate once the contract is
emitted. `diseases`/`treatments`/`centers` deferred to Tier 3 modeling.

## Implementation order

1. `helix-query.yaml` + **doctor index + `doctor-search`** (flagship, fully clean) — DONE FIRST, verified end-to-end.
2. `clinic-grid` dynamic (clean DOM fields; address/phone pending `clinics` metadata).
3. `hero-search` form rewired to `doctor-search`.
4. `news`/`events` blocks: index-driven on `lastModified`/path now; full date-sort
   pending the metadata contract.
5. Tier 3: documented, not forced — pending content modeling.
