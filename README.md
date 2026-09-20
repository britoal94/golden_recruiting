# Golden Recruiting

Marketing site for Golden Recruiting — Astro 7 + Tailwind CSS 4, deployed on Vercel.

## Develop

```sh
npm install
cp .env.example .env   # fill in keys as they arrive
npm run dev
```

## Configuration

| Variable | Purpose |
| --- | --- |
| `SITE_URL` | Canonical origin (no trailing slash). Drives canonical/OG URLs, sitemap and robots.txt. |
| `PUBLIC_POSTHOG_KEY` / `PUBLIC_POSTHOG_HOST` | PostHog project key + host. Tracker is only injected when the key is set. |
| `PUBLIC_GA_ID` | Google Analytics 4 measurement ID (`G-XXXX`). Only injected when set. |
| `RESEND_API_KEY` | Resend API key for the contact form (`/api/contact`). |
| `CONTACT_TO_EMAIL` | Inbox that receives contact-form submissions. |
| `CONTACT_FROM_EMAIL` | Sender, must be on a verified Resend domain. Defaults to `onboarding@resend.dev` (test only). |

Copy, phone/email, socials and founder details live in `src/config/site.ts`.

## Structure

- `src/layouts/Base.astro` — HTML shell, fonts, `<SEO>` and `<Analytics>`.
- `src/components/SEO.astro` — title/description, canonical, Open Graph, Twitter, JSON-LD (Organization, WebSite).
- `src/pages/api/contact.ts` — server-rendered Resend endpoint with honeypot + validation.
- `src/pages/robots.txt.ts` — generated robots.txt pointing at the sitemap.
- `scripts/gen-assets.mjs` — regenerates `public/og.png`, `logo.png` and favicons from the seal mark.

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
```
