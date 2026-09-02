import { useEffect, useState } from 'react'
import {
  ArrowRight, ArrowUpRight, CalendarDays, Globe, Mail, MapPin, Menu, X,
  Newspaper, TrendingUp, Users, Handshake, Layers, Crown,
} from 'lucide-react'
import { OPERATORS, PARTNERS, MEMBERS, TOTAL_BRANDS } from './logos.js'

/* ────────────────────────────────────────────────────────────────────────────
   CONTENT — the page reads from these arrays. Edit here, not in the markup.
   Every claim is lifted from the live rate-card sites it links to.
   ──────────────────────────────────────────────────────────────────────────── */

const CONTACT = 'sales@next.io'
const base = import.meta.env.BASE_URL

const STATS = [
  ['215k+', 'Monthly pageviews, NEXT.io'],
  ['~40k', 'LinkedIn followers'],
  ['~16k', 'Newsletter subscribers'],
  ['5/5', 'Sold-out NEXT Summits'],
  ['6', 'Network sites in 2027'],
]

const PLATFORMS = [
  {
    logo: 'next-logo.png',
    name: 'NEXT.io',
    line: 'The industry site: news, features, data and research read by iGaming’s decision-makers every day - with the display, category, newsletter and podcast inventory to put your brand inside that habit.',
    facts: ['215k+ monthly pageviews', '~16k subscribers · 35-40% open rates', 'The NEXT.io Podcast'],
  },
  {
    logo: 'nextpredict-logo.png',
    name: 'NEXTPredict',
    line: 'The prediction markets platform - the category covered properly, daily, plus The NEXTPredict Podcast and an October 2027 summit in New York. Founding partner rates run to 30 June 2027.',
    facts: ['The category’s dedicated news site', 'Launch podcast episode: 21k+ views in 13 days', 'NEXTPredict Summit · October 2027'],
  },
]

const PORTFOLIO = [
  {
    group: 'Events',
    items: [
      {
        name: 'NEXT Summit New York',
        when: '13-14 April 2027 · Convene 30 Hudson Yards',
        extra: 'Focus days 12 & 15 April: NEXT Focus Emerging Verticals and NEXTPredict',
        line: '2,000 senior executives across a four-day New York week. Sixth edition, five-for-five sold out.',
        href: 'https://stuatnext.github.io/next-summit-new-york/',
        cta: 'View the rate card',
      },
      {
        name: 'NEXT Summit Valletta',
        when: '26-27 May 2027 · Mediterranean Conference Centre, Malta',
        extra: 'iGaming IDOL gala, rooftop receptions and four focus events in the same week',
        line: 'The Mediterranean flagship, in the industry’s home town. The week the whole market attends.',
        href: 'https://stuatnext.github.io/next-summit-valletta/',
        cta: 'View the rate card',
      },
      {
        name: 'NEXTPredict Summit',
        when: 'October 2027 · New York City',
        extra: 'Dates and venue announced shortly',
        line: 'The prediction markets event, from the platform that covers the category every day.',
        href: 'https://stuatnext.github.io/next-predict-2027/',
        cta: 'View the rate card',
      },
      {
        name: 'NEXT Retreats',
        when: 'Europe · Cyprus, 11-13 Oct — LatAm · Cancún, 15-17 Nov',
        extra: 'Invitation-only · 100 delegates per retreat · 50 operators, 50 suppliers',
        line: 'Three days and two nights of unhurried time with the decision-makers. Chatham House Rule.',
        href: 'https://stuatnext.github.io/next-retreat-2027/',
        cta: 'View the partner brochure',
      },
    ],
  },
  {
    group: 'Media',
    items: [
      {
        name: 'Media & Advertising',
        when: 'NEXT.io + NEXTPredict · always-on',
        extra: 'Display, category ownership, newsletters, podcasts and Spotlight',
        line: 'The 2027 rate card for both platforms, with a plan builder and every format’s delivery data.',
        href: 'https://stuatnext.github.io/next-media-pack-2027/',
        cta: 'Open the media pack',
      },
      {
        name: 'External Projects',
        when: 'Private builds · your calendar',
        extra: 'Brief-led, priced on the room you want',
        line: 'Your own event, built by the team behind the summits: venue, production, guest list, delivery.',
        href: 'https://stuatnext.github.io/next-external-projects-2027/',
        cta: 'See the formats',
      },
    ],
  },
  {
    group: 'Communities',
    items: [
      {
        name: 'HR Connect',
        when: 'Malta · annual membership',
        extra: 'Supported by GamingMalta',
        line: 'The HR community for iGaming: benchmarking, mentors, workshops and dinners. From €2,500 a year.',
        href: 'https://stuatnext.github.io/hr-connect-2027/',
        cta: 'View membership',
      },
      {
        name: 'marketingNEXT',
        when: 'Virtual · monthly surgery',
        extra: 'Invitation-only, two seats per company',
        line: 'The peer-led marketing surgery for senior iGaming marketers. €4,000 a year, by application.',
        href: 'https://stuatnext.github.io/next-community-2027/',
        cta: 'View membership',
      },
    ],
  },
]

const WHY = [
  {
    icon: Crown,
    t: 'The room is senior',
    b: 'Curated guest lists, operator-weighted rooms and C-level density are the product. We cap, invite and verify - we do not pack floors.',
  },
  {
    icon: TrendingUp,
    t: 'Sold out, five for five',
    b: 'Every NEXT Summit to date has sold out, and partners rebook before the public sale. Inventory is real: slots, caps and exclusives are enforced, never oversold.',
  },
  {
    icon: Layers,
    t: 'Full-funnel by design',
    b: 'Daily media reach, event-week proximity and year-round community trust - one partner message travels the whole path instead of stopping at a stand.',
  },
  {
    icon: Handshake,
    t: 'One team, one plan',
    b: 'A single commercial team across media, events and communities. Portfolio deals compound: the same brand, sequenced across the year, at every altitude.',
  },
]

const WALLS = [
  { label: 'Operators & attendees in our rooms', dir: 'operators', files: OPERATORS },
  { label: 'Partners & sponsors behind the events', dir: 'partners', files: PARTNERS },
  { label: 'Members of our communities', dir: 'members', files: MEMBERS },
]

const NAV = [
  ['platforms', 'Platforms'],
  ['portfolio', 'The 2027 portfolio'],
  ['why', 'Why NEXT'],
  ['room', 'Who’s in the room'],
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

function SectionHead({ eyebrow, title, lead }) {
  return (
    <div className="animate-on-scroll border-t border-line pt-6">
      <p className="text-[12px] font-black uppercase tracking-[0.24em] text-brand-yellow">{eyebrow}</p>
      <h2 className="mt-4 max-w-3xl text-4xl font-extrabold uppercase leading-[1.02] tracking-tight sm:text-5xl">{title}</h2>
      {lead && <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-brand-gray">{lead}</p>}
    </div>
  )
}

function Marquee({ files, dir, reverse = false, dur = 70 }) {
  const row = files.map((f) => (
    <div key={f} className="flex h-16 w-40 shrink-0 items-center justify-center px-6 sm:h-20 sm:w-48">
      <img src={`${base}logos/${dir}/${f}`} alt="" loading="lazy" className="logo-sil max-h-9 max-w-full object-contain sm:max-h-11" />
    </div>
  ))
  return (
    <div className="edge-fade-x overflow-hidden">
      <div className={`marquee-track ${reverse ? 'reverse' : ''}`} style={{ '--marquee-dur': `${dur}s` }}>
        <div className="flex">{row}</div>
        <div className="flex" aria-hidden>{row}</div>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────────
   Page
   ──────────────────────────────────────────────────────────────────────────── */

export default function App() {
  useReveal()
  const [open, setOpen] = useState(false)
  const opsHalf = Math.ceil(OPERATORS.length / 2)
  const partnersHalf = Math.ceil(PARTNERS.length / 2)

  return (
    <div className="grain min-h-screen bg-ink text-brand-white">

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-ink/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <a href="#top" className="flex items-center gap-3">
            <img src={`${base}logos/brand/next-logo.png`} alt="NEXT.io" className="h-7 w-auto" />
            <span className="hidden rounded-full border border-line px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-gray sm:inline">2027 portfolio</span>
          </a>
          <nav className="hidden items-center gap-7 lg:flex">
            {NAV.map(([id, label]) => (
              <a key={id} href={`#${id}`} className="text-[13px] font-semibold uppercase tracking-[0.13em] text-brand-gray transition hover:text-brand-yellow">
                {label}
              </a>
            ))}
            <a href={`mailto:${CONTACT}`} className="inline-flex items-center gap-2 rounded-full bg-brand-yellow px-5 py-2.5 text-[13px] font-bold uppercase tracking-[0.13em] text-brand-dark transition hover:brightness-110">
              Contact sales <ArrowUpRight className="h-4 w-4" />
            </a>
          </nav>
          <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {open && (
          <nav className="border-t border-line bg-ink px-5 py-4 lg:hidden">
            {NAV.map(([id, label]) => (
              <a key={id} href={`#${id}`} onClick={() => setOpen(false)} className="block py-2.5 text-sm font-semibold uppercase tracking-[0.13em] text-brand-gray">
                {label}
              </a>
            ))}
            <a href={`mailto:${CONTACT}`} className="mt-2 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-5 py-2.5 text-sm font-bold uppercase tracking-[0.13em] text-brand-dark">
              Contact sales <ArrowUpRight className="h-4 w-4" />
            </a>
          </nav>
        )}
      </header>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section id="top" className="relative overflow-hidden px-5 pb-16 pt-36 sm:pt-44">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-[520px] w-[520px] rounded-full bg-brand-yellow/[0.05] blur-3xl" />
        <div className="mx-auto max-w-7xl">
          <p className="hero-rise hero-d1 text-[12px] font-black uppercase tracking-[0.26em] text-brand-yellow">
            NEXT.io · NEXTPredict · The 2027 commercial portfolio
          </p>
          <h1 className="hero-rise hero-d2 mt-6 max-w-5xl text-5xl font-extrabold uppercase leading-[0.98] tracking-tight sm:text-7xl">
            Where iGaming<br />does business.
          </h1>
          <p className="hero-rise hero-d3 mt-7 max-w-2xl text-lg leading-relaxed text-brand-gray sm:text-xl">
            Two media platforms read daily by the industry. Three flagship events and two
            invitation-only retreats. The communities in between. One commercial team,
            and every 2027 rate card one click away.
          </p>
          <div className="hero-rise hero-d4 mt-9 flex flex-wrap items-center gap-4">
            <a href="#portfolio" className="inline-flex items-center gap-2 rounded-full bg-brand-yellow px-7 py-3.5 text-sm font-bold uppercase tracking-[0.13em] text-brand-dark transition hover:brightness-110">
              Explore the portfolio <ArrowRight className="h-4 w-4" />
            </a>
            <a href={`mailto:${CONTACT}`} className="inline-flex items-center gap-2 rounded-full border border-brand-white/30 px-7 py-3.5 text-sm font-bold uppercase tracking-[0.13em] text-brand-white transition hover:border-brand-yellow hover:text-brand-yellow">
              Talk to the team
            </a>
          </div>
          <dl className="hero-rise hero-d4 mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-5">
            {STATS.map(([v, l]) => (
              <div key={l} className="bg-raise px-5 py-5">
                <dt className="order-2 mt-1 block text-[11.5px] font-semibold uppercase tracking-[0.14em] text-brand-gray">{l}</dt>
                <dd className="order-1 text-3xl font-extrabold text-brand-yellow">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── PLATFORMS ───────────────────────────────────────────────────── */}
      <section id="platforms" className="px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHead
            eyebrow="The platforms"
            title={<>Two newsrooms. <span className="text-brand-yellow">One audience that matters.</span></>}
            lead="Everything in the portfolio stands on the media: the sites, newsletters and shows the industry actually reads and watches. Partner brands live inside that habit all year."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {PLATFORMS.map((pl) => (
              <div key={pl.name} className="animate-on-scroll flex flex-col rounded-2xl border border-line bg-raise p-8">
                <img src={`${base}logos/brand/${pl.logo}`} alt={pl.name} className="h-9 w-auto self-start" />
                <p className="mt-5 leading-relaxed text-brand-gray">{pl.line}</p>
                <ul className="mt-5 space-y-2">
                  {pl.facts.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-brand-white/90">
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-yellow" />{f}
                    </li>
                  ))}
                </ul>
                <a href="https://stuatnext.github.io/next-media-pack-2027/" target="_blank" rel="noopener noreferrer"
                   className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.13em] text-brand-yellow hover:brightness-110">
                  Media & advertising rate card <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO ───────────────────────────────────────────────────── */}
      <section id="portfolio" className="px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHead
            eyebrow="The 2027 portfolio"
            title={<>Every rate card, <span className="text-brand-yellow">one click away.</span></>}
            lead="Eight live brochures across events, media and communities. Prices, availability and deliverables are maintained on the cards themselves - quote from the live pages only."
          />
          {PORTFOLIO.map(({ group, items }) => (
            <div key={group} className="mt-12">
              <div className="animate-on-scroll mb-6 flex items-center gap-5">
                <h3 className="shrink-0 text-sm font-black uppercase tracking-[0.24em] text-brand-gray">{group}</h3>
                <div className="h-px w-full bg-line" />
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {items.map((it) => (
                  <a key={it.name} href={it.href} target="_blank" rel="noopener noreferrer"
                     className="animate-on-scroll group flex flex-col rounded-2xl border border-line bg-raise p-7 transition hover:border-brand-yellow/60">
                    <div className="flex items-start justify-between gap-4">
                      <h4 className="text-2xl font-extrabold uppercase tracking-tight">{it.name}</h4>
                      <ArrowUpRight className="h-6 w-6 shrink-0 text-brand-gray transition group-hover:text-brand-yellow" />
                    </div>
                    <p className="mt-3 flex items-center gap-2 text-[13.5px] font-semibold text-brand-yellow">
                      <CalendarDays className="h-4 w-4 shrink-0" /> {it.when}
                    </p>
                    {it.extra && (
                      <p className="mt-1.5 flex items-center gap-2 text-[13px] text-brand-gray">
                        <MapPin className="h-4 w-4 shrink-0" /> {it.extra}
                      </p>
                    )}
                    <p className="mt-4 leading-relaxed text-brand-white/85">{it.line}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.13em] text-brand-yellow">
                      {it.cta} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY ─────────────────────────────────────────────────────────── */}
      <section id="why" className="px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHead
            eyebrow="Why partners choose NEXT"
            title={<>Built for the brands<br />that <span className="text-brand-yellow">do the buying.</span></>}
          />
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
            {WHY.map((w) => (
              <div key={w.t} className="animate-on-scroll bg-raise p-8">
                <w.icon className="h-8 w-8 text-brand-yellow" strokeWidth={1.8} />
                <h3 className="mt-4 text-xl font-extrabold uppercase tracking-tight">{w.t}</h3>
                <p className="mt-3 leading-relaxed text-brand-gray">{w.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO'S IN THE ROOM ───────────────────────────────────────────── */}
      <section id="room" className="px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHead
            eyebrow="Who's in the room"
            title={<>{TOTAL_BRANDS} brands, <span className="text-brand-yellow">from 2026 alone.</span></>}
            lead="The operators and attendees in our rooms, the partners behind the events and the members of our communities - drawn from the 2026 summits, retreats and community rosters."
          />
        </div>
        <div className="mx-auto mt-12 max-w-[1600px] space-y-8">
          <div className="animate-on-scroll space-y-3">
            <p className="mx-auto max-w-7xl px-1 text-[11.5px] font-black uppercase tracking-[0.22em] text-brand-gray">{WALLS[0].label}</p>
            <Marquee files={WALLS[0].files.slice(0, opsHalf)} dir={WALLS[0].dir} dur={150} />
            <Marquee files={WALLS[0].files.slice(opsHalf)} dir={WALLS[0].dir} dur={165} reverse />
          </div>
          <div className="animate-on-scroll space-y-3">
            <p className="mx-auto max-w-7xl px-1 text-[11.5px] font-black uppercase tracking-[0.22em] text-brand-gray">{WALLS[1].label}</p>
            <Marquee files={WALLS[1].files.slice(0, partnersHalf)} dir={WALLS[1].dir} dur={140} />
            <Marquee files={WALLS[1].files.slice(partnersHalf)} dir={WALLS[1].dir} dur={155} reverse />
          </div>
          <div className="animate-on-scroll space-y-3">
            <p className="mx-auto max-w-7xl px-1 text-[11.5px] font-black uppercase tracking-[0.22em] text-brand-gray">{WALLS[2].label}</p>
            <Marquee files={WALLS[2].files} dir={WALLS[2].dir} dur={110} />
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <section className="px-5 py-24">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-brand-yellow/30 bg-gradient-to-r from-brand-yellow/10 to-brand-white/5 p-10 text-center sm:p-16">
          <h2 className="animate-on-scroll mx-auto max-w-3xl text-4xl font-extrabold uppercase leading-[1.02] tracking-tight sm:text-5xl">
            One conversation covers <span className="text-brand-yellow">the whole year.</span>
          </h2>
          <p className="animate-on-scroll mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-brand-gray">
            Tell us the markets you want and the buyers you need in front of you.
            We will bring back one plan across media, events and communities.
          </p>
          <div className="animate-on-scroll mt-9 flex flex-wrap items-center justify-center gap-4">
            <a href={`mailto:${CONTACT}?subject=${encodeURIComponent('2027 partnership conversation')}`}
               className="inline-flex items-center gap-2 rounded-full bg-brand-yellow px-8 py-4 text-sm font-bold uppercase tracking-[0.13em] text-brand-dark transition hover:brightness-110">
              <Mail className="h-4 w-4" /> {CONTACT}
            </a>
            <a href="#portfolio" className="inline-flex items-center gap-2 rounded-full border border-brand-white/30 px-8 py-4 text-sm font-bold uppercase tracking-[0.13em] transition hover:border-brand-yellow hover:text-brand-yellow">
              Back to the rate cards
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-line px-5 py-12">
        <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-4">
              <img src={`${base}logos/brand/next-logo.png`} alt="NEXT.io" className="h-7 w-auto" />
              <img src={`${base}logos/brand/nextpredict-logo.png`} alt="NEXTPredict" className="h-6 w-auto" />
            </div>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-brand-gray">
              Media, events and communities for the iGaming industry.
              Prices and availability live on each rate card.
            </p>
          </div>
          <div className="text-sm text-brand-gray">
            <a href={`mailto:${CONTACT}`} className="font-semibold text-brand-white transition hover:text-brand-yellow">{CONTACT}</a>
            <p className="mt-1 flex items-center gap-2"><Globe className="h-4 w-4" /> next.io · © {new Date().getFullYear()} NEXT.io</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
