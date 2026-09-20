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

## Scripts

```sh
npm run dev       # dev server
npm run build     # production build (dist/)
npm run preview   # serve the build locally
npm run assets    # regenerate OG image / icons
```
