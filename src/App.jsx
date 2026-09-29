import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  ArrowRight, ArrowUpRight, ChevronRight, Globe, Mail, Menu, Presentation, X,
  Handshake, Crown, Target, BadgeCheck,
} from 'lucide-react'
import { OPERATORS, PARTNERS, MEMBERS, TOTAL_BRANDS } from './logos.js'
import { LOGO_METRICS } from './logo-metrics.js'
import { brandCase } from './brand.jsx'
import { PresentMode, usePresent, CopyLinkButton } from './PresentMode.jsx'
import { LAND, MAP, MAP_W, MAP_H, project } from './worldmap.js'

/* ────────────────────────────────────────────────────────────────────────────
   CONTENT — the page reads from these arrays. Edit here, not in the markup.
   Every claim is lifted from the live rate-card sites it links to. The
   Present deck reads the same arrays, so an edit here reaches both.
   ──────────────────────────────────────────────────────────────────────────── */

const CONTACT = 'sales@next.io'
const base = import.meta.env.BASE_URL
const MEDIA_PACK = 'https://nextdotio.github.io/next-media-pack-2027/'

// The business in six figures, events first (Stuart, 29 Sep 2026: stats that
// promote NEXT as a business, not one event's record). Each figure is lifted
// from a live sibling card, never typed fresh: the brand count is the walls
// below; 2,000 is New York's ABOUT_STATS; 83% C-level is the retreats'
// SENIORITY, which describes the editions before 2026 (the retreat card labels
// it "previous editions", so this label says previous retreats); +69 and 84% are Valletta's 2026 VERDICT (the benchmark as the
// survey platform reports it); 215k+ is the media pack's. If a card changes a
// figure, change it here too. New York's "five for five sold out" stays on the
// New York card: it is that event's record, not the business's.
const STATS = [
  [String(TOTAL_BRANDS), 'Brands in our rooms in 2026'],
  ['2,000', 'Senior executives, New York 2027'],
  ['83%', 'C-level delegates at previous retreats'],
  ['+69', 'Partner NPS, Valletta 2026 · benchmark +27'],
  ['84%', 'Valletta 2026 partners who will partner again'],
  ['215k+', 'Monthly pageviews, NEXT.io'],
]

// Events carry `dates`: one leg per event (a retreat card has two), each shown
// as a dated tile beside its venue - never as a run-on line. `days` is the day
// range; leave it out when only the month is fixed and the tile leads with the
// month instead. `extra` is the card's one supporting line. A group's `group`
// is its anchor (#events, #media, #communities: never rename it, links are out
// there); `title` and `note` are what the page shows. `wide` runs a card across
// the row (the fifth event, the one media card). Events lead: NEXT is known for
// its events first (Stuart, 29 Sep 2026).
const PORTFOLIO = [
  {
    group: 'Events',
    note: 'Summits, retreats and your own hosted event',
    items: [
      {
        name: 'NEXT Summit New York',
        logo: 'brand/next-logo.png', logoH: 'h-8', sub: 'Summit · New York',
        dates: [{ days: '13-14', month: 'Apr', year: '2027', place: 'Convene 30 Hudson Yards' }],
        extra: 'Focus days 12 & 15 April: NEXT Focus Emerging Verticals and NEXTPredict Focus',
        line: '2,000 senior executives across a four-day New York week. Sixth edition, five-for-five sold out.',
        href: 'https://nextdotio.github.io/next-summit-new-york/',
        cta: 'View the rate card',
      },
      {
        name: 'NEXT Summit Valletta',
        logo: 'brand/summit-valletta.png', logoH: 'h-12',
        dates: [{ days: '26-27', month: 'May', year: '2027', place: 'Mediterranean Conference Centre, Malta' }],
        extra: 'iGaming IDOL gala, rooftop receptions and four focus events in the same week',
        line: 'The Mediterranean flagship, in the industry’s home town. The week the whole market attends.',
        href: 'https://nextdotio.github.io/next-summit-valletta/',
        cta: 'View the rate card',
      },
      {
        name: 'NEXTPredict Summit',
        logo: 'brand/nextpredict-logo.png', logoH: 'h-7', sub: 'Summit · October 2027',
        dates: [{ month: 'Oct', year: '2027', place: 'New York City' }],
        extra: 'Dates and venue announced shortly',
        line: 'Where the prediction markets category meets, returning after a 2026 debut that sold out its Leadership Stage partnership.',
        href: 'https://nextdotio.github.io/next-predict-2027/',
        cta: 'View the rate card',
      },
      {
        name: 'NEXT Retreats',
        logo: 'brand/next-retreat.png', logoH: 'h-12',
        dates: [
          { days: '11-13', month: 'Oct', year: '2027', region: 'Europe', place: 'Cyprus' },
          { days: '15-17', month: 'Nov', year: '2027', region: 'LatAm', place: 'Cancún' },
        ],
        extra: 'Invitation-only · 100 delegates per retreat · 50 operators, 50 suppliers',
        line: 'Three days and two nights of unhurried time with the decision-makers. Chatham House Rule.',
        href: 'https://nextdotio.github.io/next-retreat-2027/',
        cta: 'View the partner brochure',
      },
      {
        name: 'External Projects',
        when: 'Your own event · your calendar',
        extra: 'A hosted Drinks Reception at a major industry event',
        line: 'Your own event, built by the team behind the summits: venue, production, guest list and delivery, for the buyers you want in the room.',
        href: 'https://nextdotio.github.io/next-external-projects-2027/',
        cta: 'View the brochure',
        wide: true,
      },
    ],
  },
  {
    group: 'Media',
    title: 'Media & advertising',
    note: 'Digital packages on NEXT.io and NEXTPredict',
    items: [
      {
        name: 'Media & Advertising',
        // [file, alt, card height in px]: the NEXTPredict lockup is sized by letter height, not file height
        logos: [['brand/next-logo.png', 'NEXT.io', 28], ['brand/nextpredict-logo.png', 'NEXTPredict', 23]],
        when: 'All year, on both platforms',
        extra: 'Display, category sponsorship, newsletters, podcasts and Spotlight',
        line: 'Your brand in front of your buyers every day between the events, on both platforms, with 2026 delivery data on the rate card.',
        facts: [
          '215k+ monthly pageviews on NEXT.io',
          '~16k newsletter subscribers · 35-40% open rates',
          'NEXTPredict launch podcast episode: 21k+ views in 13 days',
          'NEXTPredict founding rates run to 30 June 2027',
        ],
        href: MEDIA_PACK,
        cta: 'View the media rate card',
        wide: true,
      },
    ],
  },
  {
    group: 'Communities',
    note: 'Annual memberships',
    items: [
      {
        name: 'HR Connect',
        logo: 'brand/hrconnect.svg', logoH: 'h-9',
        when: 'Malta · annual membership',
        extra: 'Supported by GamingMalta',
        line: 'The HR community for iGaming: benchmarking, mentors, workshops and dinners. From €2,500 a year.',
        href: 'https://nextdotio.github.io/hr-connect-2027/',
        cta: 'View membership',
      },
      {
        name: 'marketingNEXT',
        logo: 'brand/marketingnext.svg', logoH: 'h-11',
        when: 'Virtual · monthly surgery',
        extra: 'Invitation-only, two seats per company',
        line: 'The peer-led marketing surgery for senior iGaming marketers. €4,000 a year, by application.',
        href: 'https://nextdotio.github.io/next-community-2027/',
        cta: 'View membership',
      },
    ],
  },
]

// Why partners choose NEXT, in Stuart's words (29 Sep 2026): the room is
// senior, we are relationship- and value-driven, we connect people to the right
// business opportunities, we work closely with clients and care, and quality.
// No figure here repeats one in STATS; the New York verdict is its own card's
// (VERDICT in next-summit-new-york).
const WHY = [
  {
    icon: Crown,
    t: 'The room is senior',
    b: 'Curated guest lists, operator-weighted rooms and C-level density are the product. We cap, invite and verify. We do not pack floors.',
  },
  {
    icon: Handshake,
    t: 'Relationships first',
    b: 'We work closely with every partner, from the first brief to the follow-up, and we care whether it worked. Partners come back because the relationship is real.',
  },
  {
    icon: Target,
    t: 'The right opportunities',
    b: 'We connect people with the right business opportunities, not the most people. Introductions are made on purpose, so time in the room goes to conversations that lead to business.',
  },
  {
    icon: BadgeCheck,
    t: 'Quality you can measure',
    b: 'Our events are run for people whose time is valuable. In New York, 92% of 2026 partners were satisfied, and they gave us a partner NPS of +62 against a benchmark of +27.',
  },
]

const WALLS = [
  { label: 'Operators & attendees in our rooms', dir: 'operators', files: OPERATORS },
  { label: 'Partners & sponsors behind the events', dir: 'partners', files: PARTNERS },
  { label: 'Members of our communities', dir: 'members', files: MEMBERS },
]

// The bar signposts the three families of brochures by name, then the proof.
// A third entry holds a link back until that width (the room joins at xl: at
// lg the five links, Present and Contact sales would squeeze the logo).
const NAV = [
  ['events', 'Events'],
  ['media', 'Media & advertising'],
  ['communities', 'Communities'],
  ['why', 'Why NEXT'],
  ['room', 'Who’s in the room', 'xl'],
]

// Section copy, read by the page and by the Present deck alike, so a slide
// never drifts from the section it stands for. Portfolio-wide copy never says
// "iGaming" or "the industry" (the content rules in the repo notes).
const COPY = {
  hero: {
    eyebrow: 'The 2027 commercial portfolio',
    title: <>Where businesses<br />launch and grow.</>,
    lede: 'Three flagship summits and two invitation-only retreats. Two media platforms your buyers read every day. The communities in between. One team behind all of it, and one plan for your year.',
  },
  portfolio: {
    eyebrow: 'The 2027 portfolio',
    title: <>Every rate card, <span className="text-brand-yellow">one click away.</span></>,
    lead: 'Eight live brochures across events, media and communities, each with its own prices, dates and deliverables.',
  },
  why: {
    eyebrow: 'Why partners choose NEXT',
    title: <>Built for the brands<br />that <span className="text-brand-yellow">do the buying.</span></>,
  },
  room: {
    eyebrow: 'Who’s in the room',
    title: <>{TOTAL_BRANDS} brands, <span className="text-brand-yellow">from 2026 alone.</span></>,
    lead: 'The operators and attendees in our rooms, the partners behind the events and the members of our communities - drawn from the 2026 summits, retreats and community rosters.',
  },
  cta: {
    title: <>One conversation covers <span className="text-brand-yellow">the whole year.</span></>,
    lead: 'Tell us the markets you want and the buyers you need in front of you. We will bring back one plan across media, events and communities.',
    mailto: `mailto:${CONTACT}?subject=${encodeURIComponent('2027 partnership conversation')}`,
  },
}

/* ────────────────────────────────────────────────────────────────────────────
   Anchors and the Present deck
   ──────────────────────────────────────────────────────────────────────────── */

// Stable anchors. A portfolio card is p-<slug of its name>, and that is also
// its slide id in the deck, so the card's Copy link, its Present button and
// ?present=p-<slug> all point at the same item. A group is the slug of its
// name (#events, #media, #communities). Renaming an item changes its anchor,
// and links already sent stop landing on the card.
const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/&/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
const cardId = (it) => `p-${slug(it.name)}`
const groupId = (g) => slug(g.group)
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`

// The deck, built from the arrays above: a new portfolio item, stat, platform
// or reason appears in it on the next build. Every item appears exactly once,
// in the page's order, after its group's slide.
// A group with one card (Media) has no group slide: its card's slide stands
// for it, and SLIDE_ALIAS sends the group's id (?present=media) there.
const groupTitle = (g) => g.title || g.group
const SLIDES = [
  { id: 'cover', label: 'The 2027 portfolio', group: 'Start', kind: 'cover' },
  { id: 'numbers', label: 'The numbers', group: 'Start', kind: 'numbers' },
  ...PORTFOLIO.flatMap((g) => [
    ...(g.items.length > 1 ? [{ id: groupId(g), label: groupTitle(g), group: groupTitle(g), kind: 'group', g }] : []),
    ...g.items.map((it, n) => ({ id: cardId(it), label: it.name, group: groupTitle(g), kind: 'item', g, it, n })),
  ]),
  { id: 'why', label: 'Why NEXT', group: 'Why NEXT', kind: 'why' },
  { id: 'room', label: 'Who’s in the room', group: 'Who’s in the room', kind: 'room' },
  { id: 'next-steps', label: 'Next steps', group: 'Next steps', kind: 'next' },
]

const SLIDE_ALIAS = Object.fromEntries(PORTFOLIO.filter((g) => g.items.length === 1).map((g) => [groupId(g), cardId(g.items[0])]))
const groupSlideId = (g) => SLIDE_ALIAS[groupId(g)] || groupId(g)

// "In this presentation" on the cover: every section after it, with its count.
const CONTENTS = [
  ['numbers', 'The numbers', plural(STATS.length, 'figure')],
  ...PORTFOLIO.map((g) => [groupSlideId(g), groupTitle(g), plural(g.items.length, 'rate card')]),
  ['why', 'Why NEXT', plural(WHY.length, 'reason')],
  ['room', 'Who’s in the room', `${TOTAL_BRANDS} brands`],
  ['next-steps', 'Next steps', CONTACT],
]

/* ────────────────────────────────────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────────────────────────────────────── */

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.animate-on-scroll')
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

// The fixed bar's real height, measured, is every anchor's scroll margin
// (--nav-h in index.css). Never hardcode a nav offset.
function useNavHeight(ref) {
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const set = () => document.documentElement.style.setProperty('--nav-h', `${Math.round(el.getBoundingClientRect().height)}px`)
    set()
    if (typeof ResizeObserver === 'undefined') return undefined
    const ro = new ResizeObserver(set)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
}

// A portfolio card opened from a shared link, or from "Show on the page" in
// the deck, is marked for a moment so the buyer sees which card it meant.
let markTimer
function markCard(el) {
  if (!el || !el.classList.contains('jump-card')) return
  document.querySelectorAll('.is-landed').forEach((n) => n.classList.remove('is-landed'))
  void el.offsetWidth // restart the animation
  el.classList.add('is-landed')
  clearTimeout(markTimer)
  markTimer = setTimeout(() => el.classList.remove('is-landed'), 2600)
}

// Lands an anchor under the fixed bar (its scroll margin is --nav-h).
function landOn(id, { mark = false, focus = false } = {}) {
  const el = id ? document.getElementById(id) : null
  if (!el) return false
  el.scrollIntoView({ block: 'start', behavior: 'instant' })
  if (mark) markCard(el)
  if (focus) el.focus({ preventScroll: true })
  return true
}

// First-load deep links (…/#p-hr-connect): the browser looks for the anchor
// before React has rendered it, so it is landed here once the page exists,
// then again while Inter swaps in and images settle, until the reader
// scrolls, taps or types.
function useLandOnHash() {
  useEffect(() => {
    let id = ''
    try { id = decodeURIComponent(window.location.hash.slice(1)) } catch { /* malformed hash */ }
    if (!id || !document.getElementById(id)) return undefined
    let done = false
    const timers = []
    const evs = ['wheel', 'touchstart', 'keydown', 'mousedown']
    const off = () => { evs.forEach((e) => window.removeEventListener(e, stop)); timers.forEach(clearTimeout) }
    function stop() { done = true; off() }
    const land = (mark) => { if (!done) landOn(id, { mark }) }
    evs.forEach((e) => window.addEventListener(e, stop, { passive: true }))
    requestAnimationFrame(() => land(true))
    ;[250, 700, 1500].forEach((ms) => timers.push(setTimeout(() => land(false), ms)))
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => land(false))
    return stop
  }, [])
}

function SectionHead({ eyebrow, title, lead, action }) {
  return (
    <div className="animate-on-scroll border-t border-line pt-6 lg:flex lg:items-end lg:justify-between lg:gap-10">
      <div>
        <p className="text-[12px] font-black uppercase tracking-[0.24em] text-brand-yellow">{brandCase(eyebrow)}</p>
        <h2 className="mt-4 max-w-3xl text-4xl font-extrabold uppercase leading-[1.02] tracking-tight sm:text-5xl">{title}</h2>
        {lead && <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-brand-gray">{lead}</p>}
      </div>
      {action && <div className="mt-7 shrink-0 lg:mt-0">{action}</div>}
    </div>
  )
}

// One dated tile per event leg: the day range leads, month and year sit under
// it. With no day range yet the month leads and the year sits under it.
function DateTile({ days, month, year, big = false }) {
  return (
    <span className={`flex shrink-0 flex-col items-center rounded-xl border border-line bg-ink text-center ${big ? 'w-24 px-2 py-3.5' : 'w-[5.5rem] px-2 py-3'}`}>
      <span className={`font-extrabold leading-none tracking-tight tabular-nums text-brand-white ${big ? 'text-[26px]' : 'text-[22px]'}`}>
        {days ? days.replace('-', '–') : month}
      </span>{' '}
      <span className={`mt-2 font-bold uppercase leading-none tracking-[0.16em] text-brand-yellow tabular-nums ${big ? 'text-[11.5px]' : 'text-[10.5px]'}`}>
        {days ? `${month} ${year}` : year}
      </span>
    </span>
  )
}

// Every event card reads the same way: its dated legs (the retreats have two,
// side by side where the card is wide enough), then the supporting line. The
// deck's item slide uses it too (`big`, legs stacked).
function Schedule({ dates, extra, big = false }) {
  const cols = dates.length > 1 && !big ? 'sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2' : ''
  return (
    <div className={big ? 'mt-4' : 'mt-5'}>
      <ul className={`grid gap-3 ${cols}`}>
        {dates.map((d) => (
          <li key={d.place} className="flex items-center gap-4">
            <DateTile {...d} big={big} />{' '}
            <div className="min-w-0">
              {d.region && <p className="text-[11px] font-black uppercase tracking-[0.22em] text-brand-gray">{d.region}</p>}{' '}
              <p className={`font-semibold leading-snug text-brand-white ${big ? 'text-lg' : ''}`}>{d.place}</p>
            </div>
          </li>
        ))}
      </ul>
      {extra && <p className={`mt-3 leading-snug text-brand-gray ${big ? 'text-[15px] sm:text-base' : 'text-[13px]'}`}>{extra}</p>}
    </div>
  )
}

// The same legs, one line each, for places that only take phrasing content
// (the buttons on a group slide).
function ScheduleLine({ dates }) {
  return (
    <span className="flex flex-col gap-1">
      {dates.map((d) => (
        <span key={d.place} className="text-[15px] leading-snug">
          <span className="font-bold tabular-nums text-brand-white">{d.days ? `${d.days.replace('-', '–')} ${d.month} ${d.year}` : `${d.month} ${d.year}`}</span>
          <span className="text-brand-gray"> · {d.region ? `${d.region}, ` : ''}{d.place}</span>
        </span>
      ))}
    </span>
  )
}

// What a card shows under its title: the dated legs for an event, otherwise
// the `when` line and its supporting line.
function ItemMeta({ it, big = false }) {
  if (it.dates) return <Schedule dates={it.dates} extra={it.extra} big={big} />
  return (
    <div className={big ? 'mt-4' : 'mt-3'}>
      <p className={`font-semibold text-brand-yellow ${big ? 'text-lg' : 'text-[13.5px]'}`}>{it.when}</p>
      {it.extra && <p className={`mt-1 leading-snug text-brand-gray ${big ? 'text-[15px] sm:text-base' : 'text-[13px]'}`}>{it.extra}</p>}
    </div>
  )
}

// A portfolio item's title: its lockup wherever one exists (`logoH` sizes it
// on the card; a slide scales that up), with the tracked sub-line for the two
// that compose the platform logo; otherwise its name. Phrasing content only,
// so it can sit in a heading or a button.
function Lockup({ it, size = 'card' }) {
  if (it.logos) return <PlatformLogos it={it} size={size} />
  if (!it.logo) return brandCase(it.name)
  const h = it.logoH || 'h-9'
  const src = `${base}logos/${it.logo}`
  const img = size === 'card'
    ? <img src={src} alt={it.name} className={`${h} w-auto self-start object-contain`} />
    : (
      <img src={src} alt={it.name} style={{ '--lh': `${parseFloat(h.slice(2)) / 4}rem` }}
        className={`w-auto max-w-full self-start object-contain object-left ${size === 'slide' ? 'h-[calc(var(--lh)*1.3)] sm:h-[calc(var(--lh)*1.7)]' : 'h-[calc(var(--lh)*0.95)]'}`} />
    )
  return (
    <span className="flex flex-col gap-2">
      {img}
      {it.sub && <span className={`font-black uppercase tracking-[0.3em] text-brand-yellow ${size === 'slide' ? 'text-xs sm:text-[13px]' : 'text-[11px]'}`}>{brandCase(it.sub)}</span>}
    </span>
  )
}

// One card per rate card. The whole card opens the sibling site through the
// CTA's stretched link; Present and Copy link sit above that link, so they
// are real buttons, never controls nested inside an anchor.
// Both platform logos stand as the title of the one card that sells both
// (Media & advertising), so the card never repeats its group's name. `h` is
// the card height; a slide scales it up, as Lockup does for a single logo.
function PlatformLogos({ it, size = 'card' }) {
  const scale = size === 'slide' ? 1.45 : size === 'list' ? 0.95 : 1
  return (
    <span className="flex flex-wrap items-center gap-x-5 gap-y-3">
      {it.logos.map(([file, alt, px], k) => (
        <span key={file} className="flex items-center gap-5">
          {k > 0 && <span aria-hidden className="h-6 w-px bg-brand-white/25" />}
          <img src={`${base}logos/${file}`} alt={alt} className="w-auto" style={{ height: `${Math.round(px * scale)}px` }} />
        </span>
      ))}
    </span>
  )
}

function FactList({ facts, big = false, className = '' }) {
  return (
    <ul className={`space-y-2.5 ${className}`}>
      {facts.map((f) => (
        <li key={f} className={`flex items-start gap-2.5 text-brand-white/90 ${big ? 'text-[15px] leading-6 sm:text-base' : 'text-[15px] leading-6'}`}>
          <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-yellow" /><span>{f}</span>
        </li>
      ))}
    </ul>
  )
}

function PortfolioCard({ it, onPresent }) {
  const id = cardId(it)
  const body = (
    <>
      <div className="flex items-start justify-between gap-4">
        <h4 className={it.logo || it.logos ? 'min-h-14' : 'text-2xl font-extrabold uppercase tracking-tight'}><Lockup it={it} /></h4>
        <ArrowUpRight className="h-6 w-6 shrink-0 text-brand-gray transition group-hover:text-brand-yellow" aria-hidden />
      </div>
      <ItemMeta it={it} />
      <p className="mt-5 leading-relaxed text-brand-white/85">{it.line}</p>
    </>
  )
  return (
    <article id={id} tabIndex={-1}
      className={`jump-card animate-on-scroll group relative flex flex-col rounded-2xl border border-line bg-raise p-7 transition hover:border-brand-yellow/60 focus:outline-none ${it.wide ? 'md:col-span-2' : ''}`}>
      {it.facts ? (
        <div className="lg:grid lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">{body}</div>
          <FactList facts={it.facts} className="mt-6 lg:col-span-5 lg:mt-1" />
        </div>
      ) : body}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pt-6">
        <a href={it.href} target="_blank" rel="noopener noreferrer"
          className="card-link inline-flex min-h-11 items-center gap-2 rounded-full border border-brand-yellow/70 px-5 text-sm font-bold uppercase tracking-[0.13em] text-brand-yellow transition group-hover:bg-brand-yellow group-hover:text-brand-dark">
          {it.cta}<ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden />
          <span className="sr-only normal-case">: {it.name}, opens in a new tab</span>
        </a>
        <div className="relative z-10 -mx-3 flex items-center">
          <button type="button" onClick={() => onPresent(id)}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-xs font-bold text-brand-gray transition-colors hover:text-brand-yellow">
            <Presentation className="h-3.5 w-3.5" aria-hidden />Present
          </button>
          <CopyLinkButton id={id} className="text-brand-gray hover:text-brand-yellow" />
        </div>
      </div>
    </article>
  )
}

// ─── The 2027 map (hero) ────────────────────────────────────────────────────
// Where the portfolio meets in 2027, read from PORTFOLIO's own dates: each
// dated item's place maps to a city (PLACE_CITY), and each city shows the
// months it hosts, in calendar order. The route joins the cities in the order
// of their first month (it is the year, not an itinerary; New York's second
// month shows on its label). A dated place missing from PLACE_CITY is left
// off the map, so add its city when a new venue is announced. No prices, no
// availability: only what the cards already say.
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const CITIES = {
  nyc: { name: 'New York', lat: 40.71, lon: -74.01, label: 'right' },
  mt: { name: 'Valletta', lat: 35.9, lon: 14.51, label: 'top' },
  cy: { name: 'Cyprus', lat: 34.93, lon: 32.33, label: 'below-left' },
  mx: { name: 'Cancún', lat: 21.16, lon: -86.85, label: 'right' },
}
const PLACE_CITY = {
  'Convene 30 Hudson Yards': 'nyc', 'New York City': 'nyc',
  'Mediterranean Conference Centre, Malta': 'mt', Cyprus: 'cy', 'Cancún': 'mx',
}
const MAP_STOPS = (() => {
  const by = {}
  for (const g of PORTFOLIO) for (const it of g.items) for (const d of it.dates || []) {
    const city = PLACE_CITY[d.place]
    if (city) (by[city] ||= new Set()).add(d.month)
  }
  return Object.entries(by).map(([id, set]) => {
    const months = [...set].sort((a, b) => MONTHS.indexOf(a) - MONTHS.indexOf(b))
    const [x, y] = project(CITIES[id].lat, CITIES[id].lon)
    return { id, ...CITIES[id], months, first: MONTHS.indexOf(months[0]), x, y }
  }).sort((a, b) => a.first - b.first)
})()
// eastward legs bow north, westward legs south, so the route never crosses itself
const MAP_ROUTE = MAP_STOPS.slice(1).map((b, i) => {
  const a = MAP_STOPS[i]
  const dist = Math.hypot(b.x - a.x, b.y - a.y), bow = (b.x > a.x ? -1 : 1) * dist * 0.22
  return `M${a.x.toFixed(2)} ${a.y.toFixed(2)} Q${((a.x + b.x) / 2).toFixed(2)} ${((a.y + b.y) / 2 + bow).toFixed(2)} ${b.x.toFixed(2)} ${b.y.toFixed(2)}`
})
// every land dot as one path: a tiny circle per '1' in the bitmap
const MAP_DOTS = LAND.flatMap((row, r) => [...row].map((c, k) => c === '1'
  ? `M${(k * MAP.cell + MAP.cell / 2 - 0.34).toFixed(2)} ${(r * MAP.cell + MAP.cell / 2).toFixed(2)}a.34 .34 0 1 0 .68 0a.34 .34 0 1 0 -.68 0` : '')).join('')
const LABEL_AT = {
  right: 'left-3 top-1/2 -translate-y-1/2',
  top: 'bottom-3 left-1/2 -translate-x-1/2 text-center',
  'below-left': 'top-3 right-0 text-right',
}
function PortfolioMap({ className = '' }) {
  return (
    <div aria-hidden="true" className={`relative ${className}`} style={{ aspectRatio: `${MAP_W} / ${MAP_H}` }}>
      <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="absolute inset-0 h-full w-full overflow-visible">
        <path d={MAP_DOTS} fill="#ffffff" fillOpacity="0.17" />
        <g fill="none" stroke="#ffcf33" strokeOpacity="0.55" strokeWidth="0.3" strokeLinecap="round">
          {MAP_ROUTE.map((d) => <path key={d} d={d} strokeDasharray="1.1 0.9" className="map-route" />)}
        </g>
      </svg>
      {MAP_STOPS.map((st) => (
        <div key={st.id} className="absolute" style={{ left: `${(st.x / MAP_W) * 100}%`, top: `${(st.y / MAP_H) * 100}%` }}>
          <span className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-yellow/50 animate-ping motion-reduce:animate-none" />
          <span className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-yellow shadow-[0_0_14px_rgba(255,207,51,0.9)]" />
          <span className={`absolute whitespace-nowrap leading-tight ${LABEL_AT[st.label]}`}>
            <span className="block text-[12px] sm:text-[13px] font-extrabold text-brand-white">{st.name}</span>
            <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.16em] text-brand-yellow">{st.months.join(' · ')}</span>
          </span>
        </div>
      ))}
    </div>
  )
}

// dt stays first in the markup for screen readers; flex order puts the figure
// on top so every figure shares one line. `big` is the deck's numbers slide.
function StatList({ big = false, className = '' }) {
  return (
    <dl className={`grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line ${big ? 'lg:grid-cols-3' : 'sm:grid-cols-3 lg:grid-cols-6'} ${className}`}>
      {STATS.map(([v, l]) => (
        <div key={l} className={`flex flex-col bg-raise ${big ? 'px-5 py-6 sm:px-8 sm:py-8' : 'px-5 py-5'}`}>
          <dt className={`order-2 font-semibold uppercase leading-snug tracking-[0.14em] text-brand-gray ${big ? 'mt-3 text-[11.5px] sm:text-[13px]' : 'mt-2.5 text-[11.5px]'}`}>{brandCase(l)}</dt>
          <dd className={`order-1 font-extrabold leading-none tabular-nums text-brand-yellow ${big ? 'text-5xl sm:text-6xl' : 'text-3xl'}`}>{v}</dd>
        </div>
      ))}
    </dl>
  )
}

function WhyItem({ w, big = false, className = '' }) {
  return (
    <div className={`bg-raise ${big ? 'p-6' : 'p-8'} ${className}`}>
      <w.icon className={`${big ? 'h-7 w-7' : 'h-8 w-8'} text-brand-yellow`} strokeWidth={1.8} aria-hidden />
      <h3 className={`font-extrabold uppercase tracking-tight ${big ? 'mt-3 text-lg sm:text-xl' : 'mt-4 text-xl'}`}>{w.t}</h3>
      <p className={`leading-relaxed text-brand-gray ${big ? 'mt-2 text-[15px] sm:text-base' : 'mt-3'}`}>{w.b}</p>
    </div>
  )
}

/* Optical sizing for the brand walls: every mark gets about the same visual
   weight instead of the same max-height. Area is held near-constant, so a 12:1
   wordmark is not a sliver and a square badge is not a stamp; heavy solid marks
   give a little back and hairline marks get a little more; small raster sources
   are never blown up past 1.6x, where they would go soft. Sizes are desktop px,
   scaled down on phones by --wall-scale. Metrics come from
   scripts/logo_metrics.py; a file missing from them keeps the old fixed cap. */
const WALL = { area: 4600, maxH: 50, maxW: 172, ink: 0.28, upscale: 1.6 }
function wallSize(dir, file) {
  const m = LOGO_METRICS[`${dir}/${file}`]
  if (!m) return null
  const [w, h, ink] = m
  const ratio = w / h
  const weight = Math.min(1.4, Math.max(0.7, Math.sqrt(WALL.ink / ink)))
  let H = Math.min(Math.sqrt((WALL.area * weight) / ratio), WALL.maxH)
  let W = H * ratio
  if (W > WALL.maxW) { W = WALL.maxW; H = W / ratio }
  if (!file.endsWith('.svg')) { const s = Math.min(1, (w * WALL.upscale) / W); W *= s; H *= s }
  return [Math.round(W), Math.round(H)]
}

function WallLogo({ dir, file }) {
  const src = `${base}logos/${dir}/${file}`
  const tone = file.endsWith('.svg') ? 'logo-sil' : 'logo-baked'
  const size = wallSize(dir, file)
  if (!size) return <img src={src} alt="" loading="lazy" className={`${tone} max-h-9 w-auto max-w-36 object-contain sm:max-h-11`} />
  const [w, h] = size
  return <img src={src} alt="" loading="lazy" width={w} height={h} className={`${tone} wall-logo`} style={{ '--w': `${w}px`, '--h': `${h}px` }} />
}

function Marquee({ files, dir, reverse = false, dur = 70 }) {
  const row = files.map((f) => (
    <div key={f} className="flex h-16 shrink-0 items-center px-5 sm:h-20 sm:px-7">
      <WallLogo dir={dir} file={f} />
    </div>
  ))
  return (
    <div className="logo-wall edge-fade-x overflow-hidden">
      <div className={`marquee-track ${reverse ? 'reverse' : ''}`} style={{ '--marquee-dur': `${dur}s` }}>
        <div className="flex">{row}</div>
        <div className="flex" aria-hidden>{row}</div>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────────
   Present deck slides: each one reads the arrays and components above
   ──────────────────────────────────────────────────────────────────────────── */

function SlideEyebrow({ children }) {
  return <p className="text-[11px] font-black uppercase tracking-[0.24em] text-brand-yellow sm:text-xs">{children}</p>
}
function SlideTitle({ children }) {
  return <h2 className="mt-4 max-w-4xl text-4xl font-extrabold uppercase leading-[1.02] tracking-tight sm:text-5xl">{children}</h2>
}

function CoverSlide({ goId }) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-7">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <img src={`${base}logos/brand/next-logo.png`} alt="NEXT.io" className="h-8 w-auto sm:h-10" />
          <img src={`${base}logos/brand/nextpredict-logo.png`} alt="NEXTPredict" className="h-7 w-auto sm:h-9" />
        </div>
        <p className="mt-8 text-[11px] font-black uppercase tracking-[0.24em] text-brand-yellow sm:text-xs">The 2027 commercial portfolio</p>
        <h2 className="mt-4 text-5xl font-extrabold uppercase leading-[0.98] tracking-tight sm:text-6xl xl:text-7xl">{COPY.hero.title}</h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-brand-gray sm:text-xl">{COPY.hero.lede}</p>
      </div>
      <nav aria-label="In this presentation" className="lg:col-span-5">
        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-brand-gray sm:text-xs">In this presentation</p>
        <ol className="mt-3 divide-y divide-line border-y border-line">
          {CONTENTS.map(([id, label, note], n) => (
            <li key={id}>
              <button type="button" onClick={() => goId(id)} className="group flex min-h-12 w-full items-center gap-4 py-2 text-left">
                <span className="w-6 shrink-0 text-xs font-bold tabular-nums text-brand-gray">{String(n + 1).padStart(2, '0')}</span>
                <span className="min-w-0 flex-1 font-bold text-brand-white transition-colors group-hover:text-brand-yellow">{label}</span>
                <span className="shrink-0 text-right text-sm text-brand-gray">{note}</span>
              </button>
            </li>
          ))}
        </ol>
        <p className="mt-5 text-sm text-brand-gray">Use the arrow keys, or swipe</p>
      </nav>
    </div>
  )
}

function NumbersSlide() {
  return (
    <div>
      <SlideEyebrow>The numbers</SlideEyebrow>
      <SlideTitle>NEXT in numbers.</SlideTitle>
      <StatList big className="mt-8 sm:mt-10" />
    </div>
  )
}

function GroupSlide({ g, goId }) {
  return (
    <div>
      <SlideEyebrow>{COPY.portfolio.eyebrow}</SlideEyebrow>
      <div className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-2">
        <h2 className="text-5xl font-extrabold uppercase leading-none tracking-tight sm:text-6xl">{groupTitle(g)}</h2>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand-gray">{plural(g.items.length, 'rate card')}</p>
      </div>
      {g.note && <p className="mt-3 text-lg text-brand-gray">{g.note}</p>}
      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {g.items.map((it) => (
          <li key={it.name}>
            <button type="button" onClick={() => goId(cardId(it))}
              className="group flex h-full w-full flex-col justify-between gap-5 rounded-2xl border border-line bg-raise p-6 text-left transition-colors hover:border-brand-yellow/60">
              <span className="flex w-full items-start justify-between gap-4">
                <span className={it.logo || it.logos ? 'min-w-0' : 'min-w-0 text-2xl font-extrabold uppercase tracking-tight'}><Lockup it={it} size="list" /></span>
                <ChevronRight className="h-6 w-6 shrink-0 text-brand-gray transition group-hover:translate-x-0.5 group-hover:text-brand-yellow" aria-hidden />
              </span>
              {it.dates ? <ScheduleLine dates={it.dates} /> : <span className="text-[15px] font-semibold text-brand-yellow">{it.when}</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ItemSlide({ g, it, n, onShowOnPage }) {
  const id = cardId(it)
  return (
    <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-7">
        <SlideEyebrow>{g.items.length > 1 ? `${groupTitle(g)} · ${n + 1} of ${g.items.length}` : groupTitle(g)}</SlideEyebrow>
        <h2 className={`mt-5 ${it.logo || it.logos ? '' : 'text-4xl font-extrabold uppercase leading-[1.02] tracking-tight sm:text-6xl'}`}><Lockup it={it} size="slide" /></h2>
        <p className="mt-6 max-w-2xl text-xl leading-relaxed text-brand-white/90 sm:text-2xl">{it.line}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a href={it.href} target="_blank" rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-yellow px-6 text-sm font-bold uppercase tracking-[0.13em] text-brand-dark transition hover:brightness-110">
            Open the rate card <ArrowUpRight className="h-4 w-4" aria-hidden /><span className="sr-only">, opens in a new tab</span>
          </a>
          <CopyLinkButton id={id} className="border border-line px-4 text-brand-white/85 hover:border-brand-yellow/60 hover:text-brand-yellow" />
          <button type="button" onClick={() => onShowOnPage(id)}
            className="inline-flex min-h-11 items-center rounded-full px-3 text-xs font-bold text-brand-gray transition-colors hover:text-brand-yellow">
            Show on the page
          </button>
        </div>
      </div>
      <div className="lg:col-span-5">
        <div className="rounded-2xl border border-line bg-raise p-6 sm:p-7">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-brand-gray">Key facts</p>
          <ItemMeta it={it} big />
          {it.facts && <FactList facts={it.facts} big className="mt-5" />}
        </div>
      </div>
    </div>
  )
}

function WhySlide() {
  return (
    <div>
      <SlideEyebrow>{COPY.why.eyebrow}</SlideEyebrow>
      <SlideTitle>{COPY.why.title}</SlideTitle>
      <div className="mt-7 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
        {WHY.map((w) => <WhyItem key={w.t} w={w} big />)}
      </div>
    </div>
  )
}

function RoomSlide() {
  return (
    <div>
      <SlideEyebrow>{COPY.room.eyebrow}</SlideEyebrow>
      <SlideTitle>{COPY.room.title}</SlideTitle>
      <p className="mt-5 max-w-3xl text-base leading-relaxed text-brand-gray sm:text-lg">{COPY.room.lead}</p>
      <div className="mt-8 space-y-4">
        {WALLS.map((w) => (
          <div key={w.dir}>
            <p className="text-[11.5px] font-black uppercase tracking-[0.22em] text-brand-gray">{w.label}</p>
            <Marquee files={w.files} dir={w.dir} dur={w.files.length * 3} />
          </div>
        ))}
      </div>
    </div>
  )
}

function NextStepsSlide() {
  const items = PORTFOLIO.flatMap((g) => g.items)
  return (
    <div>
      <SlideEyebrow>Next steps</SlideEyebrow>
      <SlideTitle>{COPY.cta.title}</SlideTitle>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-brand-gray sm:text-xl">{COPY.cta.lead}</p>
      <a href={COPY.cta.mailto}
        className="mt-7 inline-flex min-h-12 items-center gap-2.5 rounded-full bg-brand-yellow px-6 text-base font-bold text-brand-dark transition hover:brightness-110">
        <Mail className="h-5 w-5" aria-hidden /> {CONTACT}
      </a>
      <div className="mt-10 border-t border-line pt-6">
        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-brand-gray">Every rate card, one click away</p>
        <ul className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <li key={it.name}>
              <a href={it.href} target="_blank" rel="noopener noreferrer"
                className="group flex min-h-12 items-center justify-between gap-3 rounded-xl border border-line bg-raise px-4 py-2 text-[15px] font-semibold text-brand-white transition-colors hover:border-brand-yellow/60 hover:text-brand-yellow">
                <span className="min-w-0">{it.name}</span>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-brand-gray transition-colors group-hover:text-brand-yellow" aria-hidden />
                <span className="sr-only">, opens in a new tab</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────────
   Page
   ──────────────────────────────────────────────────────────────────────────── */

export default function App() {
  useReveal()
  useLandOnHash()
  const [open, setOpen] = useState(false)
  const barRef = useRef(null)
  useNavHeight(barRef)
  const { present, open: openDeck, close: closeDeck } = usePresent()
  const opsHalf = Math.ceil(OPERATORS.length / 2)
  const partnersHalf = Math.ceil(PARTNERS.length / 2)

  // "Show on the page" on an item slide: close the deck, then land on the card.
  const landAfterClose = useRef(null)
  const showOnPage = useCallback((id) => { landAfterClose.current = id; closeDeck() }, [closeDeck])

  // After the deck closes. PresentMode has already handed focus back to what
  // opened it; this lands a "Show on the page" card, and when the deck was
  // opened from the address bar, or from the phone menu (which has closed
  // since), it puts focus on the visible Present control instead.
  const wasPresenting = useRef(present !== null)
  useEffect(() => {
    if (present !== null) { wasPresenting.current = true; return }
    if (!wasPresenting.current) return
    wasPresenting.current = false
    const id = landAfterClose.current
    landAfterClose.current = null
    if (id && landOn(id, { mark: true, focus: true })) {
      try {
        const url = new URL(window.location.href)
        url.hash = id
        window.history.replaceState(window.history.state, '', url)
      } catch { /* the landing stands without it */ }
      return
    }
    const a = document.activeElement
    if (!a || a === document.body || !a.isConnected) {
      const back = [...document.querySelectorAll('[data-present-return]')].find((n) => n.getClientRects().length > 0)
      if (back) back.focus({ preventScroll: true })
    }
  }, [present])

  const renderSlide = (s, { goId }) => {
    switch (s.kind) {
      case 'cover': return <CoverSlide goId={goId} />
      case 'numbers': return <NumbersSlide />
      case 'group': return <GroupSlide g={s.g} goId={goId} />
      case 'item': return <ItemSlide g={s.g} it={s.it} n={s.n} onShowOnPage={showOnPage} />
      case 'why': return <WhySlide />
      case 'room': return <RoomSlide />
      default: return <NextStepsSlide />
    }
  }

  return (
    <div className="grain min-h-screen bg-ink text-brand-white">

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink/90 backdrop-blur">
        <div ref={barRef} className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5">
          <a href="#top" className="flex shrink-0 items-center gap-3">
            <img src={`${base}logos/brand/next-logo.png`} alt="NEXT.io" className="h-7 w-auto shrink-0" />
            {/* the pill steps aside from lg up, where the full nav and the Present button need the room */}
            <span className="hidden whitespace-nowrap rounded-full border border-line px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-gray sm:inline lg:hidden">2027 portfolio</span>
          </a>
          <div className="flex items-center gap-3 lg:gap-5 xl:gap-7">
            <nav aria-label="Sections" className="hidden items-center gap-5 lg:flex xl:gap-7">
              {NAV.map(([id, label, from]) => (
                <a key={id} href={`#${id}`} className={`whitespace-nowrap text-[13px] font-semibold uppercase tracking-[0.13em] text-brand-gray transition hover:text-brand-yellow ${from === 'xl' ? 'hidden xl:inline' : ''}`}>
                  {label}
                </a>
              ))}
            </nav>
            {/* labelled where the bar has room (md, and xl up); icon only between lg and xl, where the full nav fills the bar */}
            <button type="button" data-present-return onClick={() => openDeck('')} aria-label="Present" title="Present the portfolio"
              className="hidden min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-line px-4 text-[13px] font-bold uppercase tracking-[0.13em] text-brand-white transition hover:border-brand-yellow/60 hover:text-brand-yellow md:inline-flex lg:px-0 xl:px-4">
              <Presentation className="h-4 w-4" aria-hidden /><span className="lg:hidden xl:inline">Present</span>
            </button>
            <a href={`mailto:${CONTACT}`} className="hidden items-center gap-2 whitespace-nowrap rounded-full bg-brand-yellow px-5 py-2.5 text-[13px] font-bold uppercase tracking-[0.13em] text-brand-dark transition hover:brightness-110 lg:inline-flex">
              Contact sales <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
            <button type="button" data-present-return onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="site-menu"
              aria-label={open ? 'Close the menu' : 'Open the menu'} className="-mr-2.5 inline-flex h-11 w-11 items-center justify-center rounded-full lg:hidden">
              {open ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
            </button>
          </div>
        </div>
        {open && (
          <nav id="site-menu" aria-label="Sections" className="border-t border-line bg-ink px-5 pb-5 pt-2 lg:hidden">
            {NAV.map(([id, label]) => (
              <a key={id} href={`#${id}`} onClick={() => setOpen(false)} className="block py-3 text-sm font-semibold uppercase tracking-[0.13em] text-brand-gray transition hover:text-brand-yellow">
                {label}
              </a>
            ))}
            <div className="mt-2 flex flex-wrap gap-3">
              <a href={`mailto:${CONTACT}`} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-yellow px-5 text-sm font-bold uppercase tracking-[0.13em] text-brand-dark">
                Contact sales <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
              <button type="button" onClick={() => { setOpen(false); openDeck('') }}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-5 text-sm font-bold uppercase tracking-[0.13em] text-brand-white md:hidden">
                <Presentation className="h-4 w-4" aria-hidden /> Present
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section id="top" className="relative overflow-hidden px-5 pb-16 pt-36 sm:pt-44">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-[520px] w-[520px] rounded-full bg-brand-yellow/[0.05] blur-3xl" />
        <div className="mx-auto max-w-7xl">
          {/* the words on the left, the 2027 map on the right from lg (under the buttons below it) */}
          <div className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="lg:col-span-7">
          {/* both platforms' logos lead the first screen (Stuart, 29 Sep 2026); letter heights matched, not file heights */}
          <div className="hero-rise hero-d1 flex items-center gap-x-4 sm:gap-x-5">
            <img src={`${base}logos/brand/next-logo.png`} alt="NEXT.io" className="h-6 w-auto min-[360px]:h-7 sm:h-9" />
            <span aria-hidden className="h-6 w-px bg-brand-white/25 sm:h-7" />
            <img src={`${base}logos/brand/nextpredict-logo.png`} alt="NEXTPredict" className="h-5 w-auto min-[360px]:h-[23px] sm:h-[29px]" />
          </div>
          <p className="hero-rise hero-d1 mt-7 text-[12px] font-black uppercase tracking-[0.26em] text-brand-yellow">{COPY.hero.eyebrow}</p>
          <h1 className="hero-rise hero-d2 mt-5 max-w-5xl text-5xl font-extrabold uppercase leading-[0.98] tracking-tight sm:text-7xl lg:text-5xl xl:text-6xl">
            {COPY.hero.title}
          </h1>
          <p className="hero-rise hero-d3 mt-7 max-w-2xl text-lg leading-relaxed text-brand-gray sm:text-xl">{COPY.hero.lede}</p>
          {/* one button per family of brochures, events first: the signpost on the first screen */}
          <nav aria-label="The portfolio" className="hero-rise hero-d4 mt-9 flex flex-wrap gap-3">
            {PORTFOLIO.map((g, k) => (
              <a key={g.group} href={`#${groupId(g)}`}
                className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold uppercase tracking-[0.13em] transition ${k === 0 ? 'bg-brand-yellow text-brand-dark hover:brightness-110' : 'border border-brand-white/30 text-brand-white hover:border-brand-yellow hover:text-brand-yellow'}`}>
                {groupTitle(g)} <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            ))}
          </nav>
          <a href={`mailto:${CONTACT}`} className="hero-rise hero-d4 mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold uppercase tracking-[0.13em] text-brand-gray transition hover:text-brand-yellow">
            <Mail className="h-4 w-4" aria-hidden /> Talk to the team
          </a>
          </div>
          <PortfolioMap className="hero-rise hero-d4 mt-12 mr-10 sm:mr-24 lg:mt-0 lg:mr-0 lg:col-span-5" />
          </div>
          <StatList className="hero-rise hero-d4 mt-14" />
        </div>
      </section>

      {/* ── PORTFOLIO ───────────────────────────────────────────────────── */}
      <section id="portfolio" className="px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHead
            {...COPY.portfolio}
            action={(
              <button type="button" onClick={() => openDeck(groupId(PORTFOLIO[0]))}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-brand-white/30 px-6 text-sm font-bold uppercase tracking-[0.13em] text-brand-white transition hover:border-brand-yellow hover:text-brand-yellow">
                <Presentation className="h-4 w-4" aria-hidden /> Present the portfolio
              </button>
            )}
          />
          {PORTFOLIO.map((g) => (
            <div key={g.group} id={groupId(g)} className="jump-group mt-14">
              <div className="animate-on-scroll mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b border-line pb-4">
                <div>
                  <h3 className="text-2xl font-extrabold uppercase tracking-tight sm:text-3xl">{groupTitle(g)}</h3>
                  {g.note && <p className="mt-1.5 text-brand-gray">{g.note}</p>}
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-gray">{plural(g.items.length, 'rate card')}</p>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {g.items.map((it) => <PortfolioCard key={it.name} it={it} onPresent={openDeck} />)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY ─────────────────────────────────────────────────────────── */}
      <section id="why" className="px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHead {...COPY.why} />
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
            {WHY.map((w) => <WhyItem key={w.t} w={w} className="animate-on-scroll" />)}
          </div>
        </div>
      </section>

      {/* ── WHO'S IN THE ROOM ───────────────────────────────────────────── */}
      <section id="room" className="px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHead {...COPY.room} />
        </div>
        <div className="mx-auto mt-12 max-w-[1600px] space-y-8">
          <div className="animate-on-scroll space-y-3">
            <p className="mx-auto max-w-7xl text-[11.5px] font-black uppercase tracking-[0.22em] text-brand-gray">{WALLS[0].label}</p>
            <Marquee files={WALLS[0].files.slice(0, opsHalf)} dir={WALLS[0].dir} dur={150} />
            <Marquee files={WALLS[0].files.slice(opsHalf)} dir={WALLS[0].dir} dur={165} reverse />
          </div>
          <div className="animate-on-scroll space-y-3">
            <p className="mx-auto max-w-7xl text-[11.5px] font-black uppercase tracking-[0.22em] text-brand-gray">{WALLS[1].label}</p>
            <Marquee files={WALLS[1].files.slice(0, partnersHalf)} dir={WALLS[1].dir} dur={140} />
            <Marquee files={WALLS[1].files.slice(partnersHalf)} dir={WALLS[1].dir} dur={155} reverse />
          </div>
          <div className="animate-on-scroll space-y-3">
            <p className="mx-auto max-w-7xl text-[11.5px] font-black uppercase tracking-[0.22em] text-brand-gray">{WALLS[2].label}</p>
            <Marquee files={WALLS[2].files} dir={WALLS[2].dir} dur={110} />
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="px-5 py-24">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-brand-yellow/30 bg-gradient-to-r from-brand-yellow/10 to-brand-white/5 px-5 py-10 text-center sm:p-16">
          <h2 className="animate-on-scroll mx-auto max-w-3xl text-4xl font-extrabold uppercase leading-[1.02] tracking-tight sm:text-5xl">
            {COPY.cta.title}
          </h2>
          <p className="animate-on-scroll mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-brand-gray">{COPY.cta.lead}</p>
          <div className="animate-on-scroll mx-auto mt-9 flex max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4">
            <a href={COPY.cta.mailto}
               className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-yellow px-5 py-4 text-sm font-bold uppercase tracking-[0.13em] text-brand-dark transition hover:brightness-110 sm:px-8">
              {/* an address reads in its own case, not in the button's capitals */}
              <Mail className="h-4 w-4" aria-hidden /> <span className="normal-case tracking-[0.02em]">{CONTACT}</span>
            </a>
            <a href="#portfolio" className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-white/30 px-5 py-4 text-sm font-bold uppercase tracking-[0.13em] transition hover:border-brand-yellow hover:text-brand-yellow sm:px-8">
              Back to the rate cards
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-line px-5 py-12">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
              <img src={`${base}logos/brand/next-logo.png`} alt="NEXT.io" className="h-7 w-auto" />
              <img src={`${base}logos/brand/nextpredict-logo.png`} alt="NEXTPredict" className="h-6 w-auto" />
            </div>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-brand-gray">
              Events, media and communities that help businesses launch and grow.
              Prices and availability live on each rate card.
            </p>
          </div>
          <div className="text-sm text-brand-gray">
            <a href={`mailto:${CONTACT}`} className="font-semibold text-brand-white transition hover:text-brand-yellow">{CONTACT}</a>
            <p className="mt-1 flex items-center gap-2"><Globe className="h-4 w-4" aria-hidden /> next.io · © {new Date().getFullYear()} NEXT.io</p>
          </div>
        </div>
      </footer>

      {present !== null && (
        <PresentMode
          slides={SLIDES}
          startId={SLIDE_ALIAS[present] || present}
          onClose={closeDeck}
          renderSlide={renderSlide}
          title="The 2027 portfolio"
          logo={<img src={`${base}logos/brand/next-logo.png`} alt="NEXT.io" className="h-5 w-auto shrink-0 sm:h-6" />}
        />
      )}
    </div>
  )
}
