# NEXT 2027 (next-2027) — portfolio landing page

Single-page React (Vite + Tailwind v4) app: the consolidated landing page for
the whole 2027 commercial portfolio. It introduces NEXT.io + NEXTPredict,
links every live brochure, and carries the aggregated brand walls. All copy
lives in arrays at the top of `src/App.jsx` (`STATS`, `PORTFOLIO`, `WHY`,
`WALLS`) plus the `CONTACT` constant (sales@next.io, the
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

- Develop on branch `claude/new-session-h6ajdg`: the live hub has been built
  from it since 26 Sep 2026 (Present mode, card links, the pitch lines, the
  NEXTPredict Focus rename). `main` was the source of truth from 22 Sep (PR #1,
  which retired `claude/2027-ticket-pricing-brochure-p79mqg`) and now trails
  it; never deploy from `main` until a PR brings it level. More than one
  session works on this branch, so pull before every deploy.
- Run `npm run build` to verify changes compile.
- Redeploy gh-pages (see above).
- Commit with a clear message and push the branch. Open a PR into `main` only
  when asked.

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
- **Every claim is lifted from a live sibling site** (the hero figures: the
  200 brands on the walls, New York's 2,000 senior executives, the retreats'
  83% C-level at previous editions (the retreat card's own label since 29 Sep
  2026), Valletta's +69 partner NPS against the survey platform's +27
  benchmark and 84% who will partner again, the media pack's 215k+ pageviews;
  in Why NEXT, New York's 92% partner satisfaction and +62 partner NPS; the
  media card's ~16k subscribers, 35-40% opens, 21k+ launch-episode views and
  30 June founding rates; dates and venues). If a sibling card changes a
  claim, change it here too - never let the hub run ahead of the cards.
- **A single event's record is never the business's.** "Five for five sold
  out" is New York's (its ABOUT_STATS), so it lives on the New York card only
  (Stuart, 29 Sep 2026: "that is specifically referring to New York. We have
  done more than that").
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
  The composition is 15 slides: cover (both logos, the hero title and lede,
  "In this presentation" from `CONTENTS` with counts, and the only hint,
  "Use the arrow keys, or swipe") · the numbers (`STATS`) · for each
  `PORTFOLIO` group, a group slide (its items as buttons with their dates or
  `when` line) and then one slide per item, in page order (Events 5, Media 1,
  Communities 2); a group with one card has no group slide, and
  `SLIDE_ALIAS` sends its id (`?present=media`) to the card's slide · why
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
  opens that slide. Slide ids: `cover`, `numbers`, `events`, `communities`,
  `why`, `room`, `next-steps`, `media` (an alias of `p-media-advertising`),
  and `p-<slug>` for an item, which is also its card's anchor (`#p-next-summit-new-york`,
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
- iGaming always renders with a lowercase i, including inside uppercase elements (Stuart, 29 Sep 2026).
  `brandCase` keeps it cased there too.
- Minimum 44px touch targets, visible focus (the yellow `:focus-visible`
  ring in `index.css`), and no horizontal scroll at 390px, on the page and
  on every slide. QA: walk `?present` with ArrowRight at 390 and 1440 and
  expect 15 slides.

## The hero: the 2027 map (27 Sep 2026)

Stuart: "Make the hero designs more beautiful as well ... Etcetrra". The hub's
first screen had an empty right half; it now carries the year on a map.

- **`PortfolioMap`** (App.jsx) draws the North Atlantic and the Mediterranean
  as a dot grid (`src/worldmap.js`: Natural Earth 1:50m land, public domain,
  baked once into an 88 x 36 bitmap, so there is no map library) with a pin
  per city and a dashed route between them. From lg it sits beside the
  heading (the title steps down to 5xl at lg and 6xl from xl so it keeps two
  lines); below lg it follows the buttons.
- **It reads the cards, never its own copy.** `MAP_STOPS` walks every
  `PORTFOLIO` item's `dates`, maps each `place` to a city through
  `PLACE_CITY`, and labels the city with the months it hosts (New York: Apr
  and Oct). The route joins the cities in the order of their first month:
  it is the year, not an itinerary. A dated place missing from `PLACE_CITY`
  is left off the map, so when a venue is announced or changes, add its city
  (name, latitude, longitude, label side) there. No prices, no availability,
  no city the cards do not name.
- The pins pulse and the route's dashes flow; both hold still under reduced
  motion. The map is `aria-hidden`: every city and month is on the cards.


## Events first, clearer signposts (29 Sep 2026)

Stuart: "we are known more for our events", the platforms section "feels
redundant" beside the portfolio, the media signpost "needs to be very clear
that it's media and advertising, so the digital packages", "I want both the
NEXT.io and NEXTPredict logos to be visible", and stats that promote NEXT as a
business. Partners choose NEXT because "the room is senior", "we are
relationships driven", "value driven", "we want to connect people and make
sure that they get the right business opportunities", "we work very closely
with clients. We really do care", and quality.

- **Page order:** hero → the 2027 portfolio (Events, then Media & advertising,
  then Communities) → Why NEXT → who's in the room → the call to action. The
  platforms section ("Two newsrooms. One audience that matters.") is gone, and
  so are `PLATFORMS`, `PlatformCard` and its slide: the one media card carries
  both platforms.
- **The hero** leads with both logos side by side (letter heights matched:
  NEXT.io 28/36px, NEXTPredict 23/29px, 24/20px below 360px so the pair keeps
  one line at 320), then one button per family of brochures (`PORTFOLIO`
  order, Events filled) and "Talk to the team". The lede leads with the events
  and no longer says "every rate card one click away": that is the portfolio's
  title, once.
- **Groups:** `group` is the anchor and never changes (#events, #media,
  #communities); `title` and `note` are what shows ("Media & advertising",
  "Digital packages on NEXT.io and NEXTPredict"). External Projects moved from
  Media to Events, as the fifth card, `wide` across the row. The media card is
  `wide` too: both logos are its title (`logos`, so it never repeats the group
  name), its facts sit beside it, and its button says "View the media rate
  card".
- **Card buttons** are real pills (yellow outline, filled on hover over the
  card), still the card's stretched link.
- **The nav** names the families: Events, Media & advertising, Communities,
  Why NEXT, and Who's in the room from xl (at lg it squeezed the logo; the
  logo is `shrink-0` now).
- **Why NEXT** is Stuart's four reasons: the room is senior, relationships
  first, the right opportunities, quality you can measure. No figure there
  repeats one in `STATS`.
