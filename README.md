# Golden Recruiting

Marketing site for Golden Recruiting — Astro 7 + Tailwind CSS 4, deployed on Vercel.

**Live:** https://goldenrecruiting.com · Vercel project `golden-recruiting` · every push to `main` deploys.

## Develop

```sh
nvm use                          # Node 26 (.nvmrc) — Temporal is native there
npm install
npx vercel link && npx vercel env pull .env.local   # or copy .env.example → .env
npm run dev
```

On Node 24, `npm run dev` still works in the foreground (the script passes
`--harmony-temporal`), but `astro dev --background` respawns node without the
flag and fails with a clear error — use Node 26 for background mode.

## Configuration

| Variable | Purpose |
| --- | --- |
| `SITE_URL` | Canonical origin (no trailing slash). Drives canonical/OG URLs, sitemap and robots.txt. |
| `PUBLIC_POSTHOG_KEY` / `PUBLIC_POSTHOG_HOST` | PostHog project key + host. Tracker is only injected when the key is set. |
| `PUBLIC_GA_ID` | Google Analytics 4 measurement ID (`G-XXXX`). Only injected when set. |
| `RESEND_API_KEY` / `RESEND_EMAIL_DOMAIN` | Injected by the Vercel Resend Marketplace integration. Sending domain: `mail.goldenrecruiting.com`. |
| `CONTACT_TO_EMAIL` | Inbox that receives contact-form submissions (`Bri@goldenrecruiting.com`). |
| `CONTACT_FROM_EMAIL` | Optional sender override. Defaults to `Golden Recruiting <contact@$RESEND_EMAIL_DOMAIN>`. |

Vercel Web Analytics is on via `@vercel/analytics/astro` (no key needed).

Copy, phone/email, socials and founder details live in `src/config/site.ts`.

## Structure

- `src/layouts/Base.astro` — HTML shell, fonts, `<SEO>`, PostHog/GA `<Analytics>` and Vercel `<VercelAnalytics>`.
- `src/components/SEO.astro` — title/description, canonical, Open Graph, Twitter, JSON-LD (Organization, WebSite).
- `src/pages/api/contact.ts` — server-rendered Resend endpoint with honeypot, validation and an idempotency key.
- `src/emails/ContactSubmission.tsx` — React Email template for the notification (`npm run email` previews it at :3001).
- `src/pages/robots.txt.ts` — generated robots.txt pointing at the sitemap.
- `scripts/gen-assets.mjs` — regenerates `public/og.png`, `logo.png` and favicons from the seal mark.
- `vercel.json` — immutable caching for `/_astro/*` plus security headers.

## Domain & email

- `goldenrecruiting.com` is canonical; `www` 308-redirects to it. DNS at NameBright
  (A records to Vercel, `www` CNAME to Vercel).
- The contact form sends from `contact@mail.goldenrecruiting.com` (Resend, DKIM/SPF
  verified on the `mail.` subdomain) to `CONTACT_TO_EMAIL`, with reply-to set to the
  submitter. The root domain's MX/SPF are for Bri's mailbox and are managed separately.

## Node & Temporal

The footer year is computed at build time with the native `Temporal` API
(`Temporal.Now.plainDateISO('America/New_York')`). Temporal is unflagged in
Node 26 (see `.nvmrc`) and behind `--harmony-temporal` in Node 24, which is
what Vercel builds with — so every npm script runs the Astro CLI through
`node --harmony-temporal`. No polyfill is shipped.

## Maintenance automation

- `.github/dependabot.yml` — weekly (Mon 07:00 ET) npm + GitHub Actions updates.
  Minor/patch bumps are grouped into a single PR after a 5-day cooldown;
  majors get separate PRs after 14 days.
- `.github/workflows/dependabot-auto-merge.yml` — runs `astro check` + build on
  each Dependabot PR, then squash-merges minor/patch bumps and devDependency
  majors when green. Production majors get a comment and wait for a human.
  A PR that fails (e.g. TypeScript 7 until `@astrojs/check` supports it) stays
  open with one explanatory comment and is re-tested on every weekly rebase.
- `.github/workflows/ci.yml` — check + build on every push and PR.

## Scripts

```sh
npm run dev       # dev server
npm run build     # production build (dist/)
npm run preview   # serve the build locally
npm run check     # astro type/diagnostic check
npm run assets    # regenerate OG image / icons
npm run email     # React Email preview server for src/emails
```
