// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// The footer uses the native Temporal API. It's unflagged in Node 26+ and
// behind --harmony-temporal in Node 24 (which the npm scripts pass). Fail
// early with a useful message if neither is in effect — e.g. `astro dev
// --background` on Node 24 respawns node without the flag.
if (typeof Temporal === 'undefined') {
  throw new Error(
    `Temporal is not available in this Node process (${process.version}).\n` +
      '  • Local dev: use Node 26 (`nvm use` reads .nvmrc), or run `npm run dev` in the foreground.\n' +
      '  • Node 24: the process must start with `node --harmony-temporal` (see package.json scripts).',
  );
}

// Canonical production URL. Override with SITE_URL in the environment
// (e.g. for a preview deployment) — used for canonical tags, OG URLs and the sitemap.
const site = process.env.SITE_URL ?? 'https://goldenrecruiting.com';

// https://astro.build/config
export default defineConfig({
  site,
  trailingSlash: 'never',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [sitemap()],
  adapter: vercel(),
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Newsreader',
      cssVariable: '--font-newsreader',
      weights: [400, 500, 600],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['Georgia', 'serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'IBM Plex Sans',
      cssVariable: '--font-plex',
      weights: [400, 500, 600],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
    },
  ],
});
