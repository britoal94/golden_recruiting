# Golden Recruiting — agent notes

Marketing site for a Charlotte, NC financial-services recruiting firm. Single
page, Astro 7 + Tailwind CSS 4, deployed on Vercel from `main`. Read this
before changing anything; the README has the human-facing overview.

## Run it

```sh
nvm use                 # Node 26 from .nvmrc (see "Node & Temporal")
npm install
npm run dev -- --background   # then: npm run astro -- dev stop|status|logs
```

The dev server uses Astro's background mode (`--background`). Manage it with
`npm run astro -- dev stop`, `dev status`, `dev logs`. Always go through the
npm scripts, not `npx astro` directly — the scripts add `--harmony-temporal`.

Before finishing any change: `npm run check` (0 errors) and `npm run build`.

## Node & Temporal (the one sharp edge)

`src/components/Footer.astro` uses the native `Temporal` API at build time.
Temporal is unflagged in Node 26 and behind `--harmony-temporal` in Node 24
(Vercel's build image), so every npm script runs
`node --harmony-temporal ./node_modules/astro/bin/astro.mjs …`.
`astro dev --background` respawns node *without* that flag, which is why local
dev must be on Node 26. `astro.config.mjs` throws a clear error if Temporal is
missing. Do not add a Temporal polyfill.

## Where things live

| Path | What |
| --- | --- |
| `src/config/site.ts` | Single source of truth: name, description, founder, contact email, socials, nav. |
| `src/layouts/Base.astro` | HTML shell: fonts, `<SEO>`, `<Analytics>` (PostHog/GA), `<VercelAnalytics>`. |
| `src/components/SEO.astro` | Canonical, OG/Twitter, JSON-LD (Organization, WebSite + per-page). |
| `src/components/Analytics.astro` | PostHog + GA4, each injected only when its `PUBLIC_*` key is set. |
| `src/components/*.astro` | One component per section: Nav, Hero, About, Verticals, Services, Process, Why, Contact, Footer. |
| `src/pages/api/contact.ts` | Server route (`prerender = false`). Validates, honeypot, sends via Resend with an idempotency key. |
| `src/emails/ContactSubmission.tsx` | React Email template for the form notification. `npm run email` previews it. |
| `src/styles/global.css` | Tailwind v4 `@theme inline` brand tokens; dark default, light via `prefers-color-scheme`. |
| `public/` | Generated assets (`og.png`, `logo.png`, favicons) — regenerate with `npm run assets`, don't hand-edit. |
| `vercel.json` | Immutable caching for `/_astro/*` and security headers (the adapter's own cache rule is ordered after `handle: filesystem`, so it never fires). |

## Conventions

- Tailwind utility classes in markup; brand colors only via the tokens in
  `global.css` (`bg-bg`, `text-ink`, `text-gold`, …). No hex in components.
- Copy edits go in the component; identity/contact edits go in `site.ts`.
- Images: `<Image>` from `astro:assets` with explicit `width`/`height`,
  `widths`/`sizes`, descriptive `alt`. Never `<img>` for content images.
- Keep the page at Lighthouse 100 SEO/a11y — every section has an
  `aria-labelledby`, one `<h1>`, lists are `<ol>`/`<dl>`.
- Email template rules (from the react-email skill): `pixelBasedPreset`,
  `Row`/`Column` not flex, `border-solid` on borders, `box-border` on buttons,
  PNG images only, message newlines rendered as `<br />` (not `pre-wrap`).
- TypeScript stays on 6.x: `@astrojs/check` needs the TS compiler API, which
  TS 7 does not ship yet. Dependabot is configured accordingly.

## Environment

Local: `vercel env pull .env.local` (project is linked; `.env.local` is
git-ignored). On Vercel these are set on the project:

- `SITE_URL` — `https://goldenrecruiting.com`; drives canonical/OG/sitemap/robots.
- `PUBLIC_POSTHOG_KEY`, `PUBLIC_POSTHOG_HOST` — PostHog (US cloud).
- `PUBLIC_GA_ID` — GA4, not yet provided; tracker is skipped until set.
- `RESEND_API_KEY`, `RESEND_EMAIL_DOMAIN` — injected by the Vercel Resend
  Marketplace integration. Sending domain is `mail.goldenrecruiting.com`
  (a subdomain, so the root domain's mail is untouched).
- `CONTACT_TO_EMAIL` — inbox for form submissions (`Bri@goldenrecruiting.com`).
- `CONTACT_FROM_EMAIL` — optional; defaults to `Golden Recruiting <contact@$RESEND_EMAIL_DOMAIN>`.

Never commit `.env*` (only `.env.example`). `PUBLIC_*` vars are browser-visible by design.

## Deploy & infra

- Vercel project `golden-recruiting` (team `golden-recruting`, Pro), Git-connected
  to `britoal94/golden_recruiting` — every push to `main` deploys production.
  The repo is public; keep it that way or Vercel will block non-member commits.
- Domain `goldenrecruiting.com` (apex, canonical) + `www` (308 → apex). DNS is
  at NameBright: `A @ → 216.150.1.1, 216.150.16.1`, `CNAME www → *.vercel-dns-017.com`.
  Resend DKIM/SPF live under `mail.` / `send.mail.`. Don't touch the root-domain
  MX/SPF from here — they belong to whatever hosts Bri's mailbox.
- CI: `.github/workflows/ci.yml` (check + build). Dependabot weekly; minor/patch
  and devDependency majors auto-merge when green, production majors wait for a human.

## Testing

No unit tests — this is a static page plus one endpoint. Verify with:
`npm run check`, `npm run build`, a Playwright/Chrome pass at 375/768/1024/1280px,
and `curl` against `/api/contact` (405 on GET; 422 on bad input; honeypot → 200
silently; needs `Origin` header or Astro's CSRF check returns 403).

## Docs

Verify library APIs against current docs before using them (`/fresh-docs`,
context7, or the vendor's `llms.txt`), not memory — this repo has already been
bitten by stale assumptions (Vercel Node versions, PostHog snippet, TS 7).
Astro: https://docs.astro.build · Tailwind: https://tailwindcss.com/docs ·
Resend: https://resend.com/docs · React Email: https://react.email/docs
