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

## Present mode and seller tools (26 Sep 2026)

Stuart asked for every brochure to be easy for a seller to walk a buyer
through on a screen share. This page now has a full-screen deck and a
shareable link on every portfolio card.

- **The deck.** `src/PresentMode.jsx` is the shared reference component:
  its behaviour (URL, keys, swipe, focus, scroll lock, reduced motion, the
  slide list) is identical across the NEXT.io brochures, and only its classes
  are this page's tokens. Do not fork the behaviour here; change the
  reference and every brochure together.
- **Where the slides come from.** `SLIDES` in `src/App.jsx` is built from
  the content arrays, so a new portfolio item, stat, platform or reason
  appears in the deck on the next build with no deck edit. Section headings
  and leads live once in `COPY` and are read by the page and the deck alike.
  The composition is 17 slides: cover (both logos, the hero title and lede,
  "In this presentation" from `CONTENTS` with counts, and the only hint,
  "Use the arrow keys, or swipe") · the numbers (`STATS`) · the platforms
  (`PLATFORMS` and the media pack link) · for each `PORTFOLIO` group, a group
  slide (its items as buttons with their dates or `when` line) and then one
  slide per item, in page order (Events 4, Media 2, Communities 2) · why
  NEXT (`WHY`) · who's in the room (`TOTAL_BRANDS` and one marquee strip per
  wall, from the existing `WALLS` data) · next steps (`CONTACT` mailto and
  every rate card link).
- **Item slides** show the card's own lockup (`Lockup`), line, dates and
  venue (`Schedule`) or `when` and `extra` (`ItemMeta`), through the same
  components the card uses. Actions: "Open the rate card" (the sibling site,
  new tab), Copy link, and "Show on the page" (closes the deck, lands and
  marks the card). There is no price element: this page carries no prices
  beyond the two entry figures already inside the HR Connect and
  marketingNEXT lines.
- **URL parameters.** `?present` opens the cover; `?present=<slide id>`
  opens that slide. Slide ids: `cover`, `numbers`, `platforms`, `events`,
  `media`, `communities`, `why`, `room`, `next-steps`, and `p-<slug>` for an
  item, which is also its card's anchor (`#p-next-summit-new-york`,
  `#p-hr-connect`...). Groups are anchors too (`#events`, `#media`,
  `#communities`). The slug comes from `name`, so renaming an item changes
  its anchor and slide id, and links already sent stop landing on it.
- **Keys.** → Space PageDown next, ← PageUp back, Home and End, G the slide
  list, Esc closes the list first and then the deck (the address bar loses
  `present`). Swipe left or right on touch. Back to an address without
  `present` closes the deck.
- **Entry points.** The nav Present button (labelled at md and from xl; an
  icon button with `aria-label="Present"` between lg and xl, where the full
  nav fills the bar, which is also why the "2027 portfolio" pill now shows
  from sm to lg only), Present in the phone menu, "Present the portfolio" in
  the portfolio head (opens on the Events slide), and a quiet Present on
  every card (opens on that item). Closing returns focus to whatever opened
  the deck, or to the visible Present control when it was opened from the
  address bar or the phone menu.
- **Copy link** (`CopyLinkButton`) sits on every card and item slide and
  copies this page plus `#p-<slug>`, never `present`. First-load deep links
  are landed by `useLandOnHash` after render and again while Inter settles,
  and a landed card is marked for a moment.
- **Cards** are an `<article>` whose CTA link stretches over the whole card
  (`.card-link`); Present and Copy link sit above that link. Never nest a
  control inside an anchor.
- **Anchors land by measurement.** App measures the header bar into `--nav-h`
  (ResizeObserver); `section[id]`, `.jump-card` and `.jump-group` use it as
  `scroll-margin-top`. Never hardcode a nav offset.
- **No goal chips and no plan link here.** No portfolio item carries goal
  tags, and the page has no plan builder to share.

Rules every future edit must keep:

- Slides read the arrays, `COPY` and the card components. Never re-type a
  figure, a date or a claim onto a slide, and never add one the page does
  not already carry. Every portfolio item appears in the deck exactly once.
- Portfolio-wide deck copy (cover, group slides, labels, hints) follows the
  page's own rule: no "iGaming", no "the industry", and prediction markets
  never share a sentence with gambling or iGaming. Item slides show the
  card's own words, so they say iGaming only where the card does.
- Buyer-facing words only: the button is "Present"; the page never says
  seller, sales desk, talk track, pitch, objection or close (in the sales
  sense; the deck's and menu's Close buttons are fine). No em dashes in new
  copy.
- Inside any uppercase element (the deck's top bar and slide-list headings
  included) brand names go through `brandCase` in `src/brand.jsx`, so they
  read NEXT.io and NEXTPredict, never in capitals.
- Minimum 44px touch targets, visible focus (the yellow `:focus-visible`
  ring in `index.css`), and no horizontal scroll at 390px, on the page and
  on every slide. QA: walk `?present` with ArrowRight at 390 and 1440 and
  expect 17 slides.
