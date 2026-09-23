# NEXT 2027 (next-2027) — portfolio landing page

Single-page React (Vite + Tailwind v4) app: the consolidated landing page for
the whole 2027 commercial portfolio. It introduces NEXT.io + NEXTPredict,
links every live brochure, and carries the aggregated brand walls. All copy
lives in arrays at the top of `src/App.jsx` (`STATS`, `PLATFORMS`,
`PORTFOLIO`, `WHY`, `WALLS`) plus the `CONTACT` constant (sales@next.io, the
address every rate card uses).

## Deploying to gh-pages — ALWAYS

After any change that affects the site, **redeploy to gh-pages** so the live
site stays current. Do this without being asked, as part of finishing the work:

```
npm run deploy   # = vite build && npx gh-pages -d dist
```

Confirm it prints `Published` before reporting done. Publishes to
`https://nextdotio.github.io/next-2027/` once Pages is enabled for this repo.

## Workflow

- Develop on `main`. It became the source of truth on 22 Sep 2026, when the
  working branch `claude/2027-ticket-pricing-brochure-p79mqg` was merged in
  (PR #1). That branch is retired; do not develop on it or deploy from it.
- Run `npm run build` to verify changes compile.
- Redeploy gh-pages (see above).
- Commit with a clear message and push `main`. No PR is needed unless
  someone asks for a review first.

## Content rules

- **Prediction markets are never in the same sentence as gambling or iGaming**
  (Stuart, 22 Sep 2026). This hub covers NEXT.io and NEXTPredict together, so
  portfolio-wide copy (hero, footer, meta description, section leads) never
  labels the audience as iGaming, and does not fall back on "the industry"
  either (Stuart: "what industry?"). It sells the value instead: media and
  events that help businesses launch and grow, read by "your buyers".
  Product-specific lines may still say iGaming when they describe an
  iGaming-only product (the NEXT.io platform card, HR Connect, marketingNEXT,
  the Valletta gala and home-town lines).
- **This page carries no prices and no availability** beyond the entry-level
  figures already public on the linked cards (HR from €2,500, marketingNEXT
  €4,000). The rate cards are the source of truth - this page only links.
- **Every claim is lifted from a live sibling site** (215k+ pageviews, ~40k
  LinkedIn, ~16k subscribers, 5/5 sold-out, +69 partner NPS from the Valletta
  card, 2,000 executives, dates and venues). If a sibling card changes a
  claim, change it here too - never let the hub run ahead of the cards.
- Internal material (targets, sell-through, comp policy, deal terms) never
  appears here. Neither does `pragmatic.html` or any client-specific page.

## The brand walls

- The walls are built from `logo-src/{operators,partners,members}/`: a
  **merged, deduped set of untouched (pristine) copies** of logo sets already
  public on the sibling sites: Valletta operators + NY operators + retreat
  attendees (→ operators), Valletta + retreat partners (→ partners), HR
  Connect members (→ members). The retreat repo's own wall PNGs are already
  baked, so its pristine files come from before its bake commit
  (`ea7c4e4^` in next-retreat-2027). One file per brand per wall.
  `public/logos/{operators,partners,members}/`, `src/logos.js` and
  `src/logo-metrics.js` are build output - never edit them or copy files
  into them by hand.
- `python3 scripts/build_logos.py` (numpy + Pillow) builds all of it. It
  bakes each PNG to a structure-preserving white mark: luminance maps to
  opacity, so a white-on-colour logo keeps its letterforms as cut-outs
  instead of flattening to a block (the failure a plain CSS whiteout
  causes). It copies SVGs through, deletes wall files that have no source,
  writes `src/logos.js`, then runs `scripts/logo_metrics.py`, which trims
  each PNG to its content box and writes `src/logo-metrics.js` - the optical
  sizes `wallSize()` in App.jsx reads (safe to run on its own too). The
  build only ever reads `logo-src`, so it is idempotent: a rerun rewrites
  nothing and can never re-bake an already baked mark. To add a logo, drop
  the untouched source into `logo-src/<wall>/` and rerun.
- Where the automatic polarity drops part of a mark, the script's
  `TREATMENT` map sets it per file: `shape` for multi-colour marks that
  lose their wordmark or emblem (BetMGM, highbet, Golden Whale...), `plate`
  for logos printed on a solid plate (Finnplay, VallettaPay, The Playa,
  Casino Guru Awards, maxbet), `dark` for logos flattened onto a white
  canvas. Check a contact sheet after adding logos. The handful of flat SVG
  wordmarks still use the `.logo-sil` CSS whiteout. A few genuinely solid
  marks (flutter, island-luck) render as solid shapes; that is their real
  silhouette.
- `TOTAL_BRANDS` (the "N brands, from 2026 alone" headline) counts unique
  brands across the three walls, not files: filenames are normalised (case
  and punctuation dropped, so `l-l-europe` = `ll-europe`) and `ALIASES` in
  the script folds the remaining spellings of one brand together (`l-l` =
  L&L Europe, `glitnor-group` = `glitnor`, `pressenter-group` =
  `pressenter`), so a brand shown on two walls counts once. The build stops
  with an error if one wall holds the same brand twice.
- NEXT.io / NEXTPredict brand logos live in `public/logos/brand/`, alongside
  the property lockups (summit-valletta, next-retreat, hrconnect,
  marketingnext) copied from the sibling repos. Portfolio cards render the
  lockup instead of a text title wherever one exists (`logo`/`logoH`/`sub`
  on the item); New York and the NEXTPredict Summit compose the platform
  logo with a tracked sub-line because no dedicated lockup exists. Media &
  Advertising and External Projects have no mark and stay as text.
