<!-- stardust:direct — TARGET strategy for the Hirslanden home-page presales redesign.
     Mode A (brand-faithful): strategy is INHERITED verbatim from
     stardust/current/PRODUCT.md — a faithful uplift does not move audience,
     register, or purpose, only execution quality. Shared across all 5
     variants (A–E); per-variant treatment lives in DESIGN-{A..E}.{md,json}.
     _provenance:
       writtenBy: stardust:direct
       writtenAt: 2026-06-24T00:00:00Z
       readArtifacts:
         - stardust/current/PRODUCT.md
         - stardust/current/_brand-extraction.json
         - stardust/current/pages/home.json
         - stardust/direction.md
       stardustVersion: 0.10.0
-->

# Product

## Register

brand

<!-- _provenance: inherited from current/PRODUCT.md. The home page is the public corporate front door of a private-hospital group — a marketing hero, a search-first entry point, teaser cards, news/events, and a CTA band, all unauthenticated. It is wayfinding and reassurance, not an authenticated patient tool. A brand-faithful uplift does not change the register. -->

## Users

_provenance: inherited from current/PRODUCT.md — basis: nav labels, footer link taxonomy, and home-page copy.

Prospective and current patients in Switzerland (German-language default; FR and EN variants linked) looking for a private clinic, a doctor, a specialty, or practical stay information. The home page serves several distinct jobs-to-be-done in parallel:

- **Find care**: locate a clinic ("Kliniken", "Hirslanden in Ihrer Nähe" map), a doctor ("Ärztesuche"), or a specialty ("Fachgebiete").
- **Prepare for a stay**: insurance ("Versicherung"), stay logistics ("Ihr Klinikaufenthalt", "Hotellerie & Services"), international-patient information.
- **Reassure and inform**: health knowledge, news, events/courses ("Veranstaltungen"), the Hirslanden Blog, the Babygalerie.
- **Reach the group**: jobs/careers, media, contact, and — prominently — the emergency number (144).

A secondary audience is referrers and partners (sponsoring requests, careers, media). Because the page carries multiple parallel audience tracks, the redesign honors a multi-audience IA hard floor: no single track is allowed to crowd out emergency wayfinding or the find-care affordance.

## Product Purpose

Hirslanden is Switzerland's largest private-hospital group. The site's stated scope is recited verbatim in the hero subline and footer: *"16 Privatkliniken, über 300 Kompetenzzentren sowie über 3000 Ärztinnen und Ärzte — Ihre Gesundheit steht bei uns im Mittelpunkt!"* The home page's purpose is to be a calm, authoritative wayfinding hub: get a worried or planning visitor to the right clinic, doctor, specialty, or stay-information page as directly as possible, while signalling institutional competence and scale. Success is the visitor leaving with a next step (a search performed, a clinic located, a stay-info page reached), reassured rather than alarmed.

The uplift's scope is execution, not strategy: close the gap between the current legacy-AEM execution (low-contrast watermark hero, flat equal-weight module stack, ad-hoc type scale, untokenized spacing) and a competent 2026 execution of the *same* brand. See `stardust/prototypes/home-improvements.md` for the load-bearing weakness list.

## Brand Personality

_provenance: inherited from current/PRODUCT.md — basis: home-page copy, tone metrics, and visual surface.

- **Three-word personality**: trustworthy, competent, warm-institutional.
- **Voice/tone**: formal Swiss-German `Sie`-address; reassurance-forward ("Kompetenz, die Vertrauen schafft" / "competence that builds trust"; "bei allen Folgen des Lebens sind wir für Sie da"); scale claims stated plainly as proof, not boast. Professional-warm, never playful or edgy.
- **Emotional goal**: lower a patient's anxiety. The visual system reinforces this — a warm off-white ground (#f7f6f5), soft warm-grey text (#534c46) instead of hard black, a single calm blue (#0094d4) for action, and human photography of clinicians-with-patients rather than equipment or buildings.
- **Restraint**: one accent color, one type family, no decoration. Saturation is rationed — the only loud color on the page is the emergency red (#f43a11) reserved for the 144 number.

## Anti-references

_provenance: inherited from current/PRODUCT.md + anti-toolbox guardrails relevant to a "modernise" uplift.

- **Cold, clinical "hospital tech" aesthetics** — pure-black text, sterile pure-white, equipment photography, blue-on-blue corporate-medical cliché. Hirslanden deliberately warms everything (taupe-grey text, off-white grounds, human photography).
- **Aggressive marketing-funnel landing pages** — no countdown banners, no high-pressure single CTA, no growth-hacked popups. The hero leads with a *search box*, not a "Jetzt buchen" shout.
- **Decorative / trendy effects** — no gradients, no glassmorphism, no neon, no heavy drop shadows. Depth is a single soft card shadow over a warm ground.
- **Vocabulary sprawl / loud type** — the site does not SHOUT in all-caps body copy or mix display fonts; one geometric sans (Metropolis) carries everything.
- **The Generic-2026-SaaS silhouette** (anti-toolbox guardrail) — a "modernise" uplift's default failure mode is a centered hero + dual-CTA + three feature cards + logo wall in primary-blue. Explicitly guardrailed: this is a wayfinding hub for a hospital group, not a SaaS landing page. Prototype and polish must reject it by name.
- **Cinematic / scroll-choreography reach** (presales scope guardrail) — this engagement is static-only. No scroll-driven reveals, parallax, or kinetic display. Motion is limited to gentle micro-interactions (hover, focus). A variant that introduces a motion register fails review.

## Design Principles

_provenance: inherited from current/PRODUCT.md — strategic principles, mapped here to the uplift axis each variant moves.

1. **Reassurance over persuasion.** Every surface lowers anxiety first; the design's job is calm competence, not conversion pressure. (All variants; amplified in C and E.)
2. **Search-first wayfinding.** A visitor's primary need is to find a clinic/doctor/specialty fast; the find-care affordance stays in the first viewport. (All variants; reframed as intent-routing in B.)
3. **Warm, not sterile.** Healthcare warmth is expressed through neutral temperature (warm greys and off-whites) and human photography — never the clinical cold-blue default. (All variants; amplified in C and E.)
4. **One quiet voice, one accent.** A single type family (Metropolis) and a single brand blue; color is rationed so the one true alarm color (emergency red) is unmistakable. (All variants; the type proof leads in D, the color re-weighting leads in E.)
5. **Institutional proof, plainly stated.** Scale (16/300/3000) is presented as factual reassurance, not as a hero boast. (All variants; rendered as a typographic proof block in D.)

## Accessibility & Inclusion

_provenance: inherited from current/PRODUCT.md — observed, and tightened by the improvements list.

- Target WCAG 2.1 AA. The uplift makes this load-bearing: the watermark hero headline (low-contrast taupe `#938880`) is replaced with a controlled-contrast treatment in every variant.
- Skip links present ("Zur Navigation springen", "Zum Inhalt springen") — preserved.
- Multilingual: German default with FR and EN locale switches.
- Contrast discipline: warm-grey body text (#534c46) on warm off-white (#f7f6f5) is comfortable and retained; blue `#0094d4` is reserved for action affordances on white/near-white grounds where it passes AA.
- Emergency wayfinding must stay unmistakable — the 144 number in red (#f43a11) survives every variant in the first-viewport reach or the global chrome. This is a non-negotiable IA priority (see DESIGN-*.json `extensions.iaPriorities`).
