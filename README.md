# next-2027 — the 2027 portfolio landing page

Consolidated client-facing landing page for the NEXT.io + NEXTPredict 2027
commercial portfolio: an intro to both platforms, selling points, links to
every live brochure (summits, NEXTPredict, retreats, media pack, HR Connect,
marketingNEXT, External Projects) and aggregated brand walls of the
operators, partners and community members from 2026.

Built with Vite + React + Tailwind v4. Copy lives in content arrays at the
top of `src/App.jsx`; the logo manifest is generated into `src/logos.js`.

```
npm install
npm run dev      # local preview
npm run build    # verify it compiles
npm run deploy   # build + publish dist/ to gh-pages
```

Live at https://stuatnext.github.io/next-2027/ once GitHub Pages is enabled
(Settings → Pages → deploy from `gh-pages`).

Content rules — what this page may and may not say — are in `CLAUDE.md`.
