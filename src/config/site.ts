/**
 * Single source of truth for site metadata.
 * Fill in phone/email/socials as they become available — every component,
 * the SEO tags and the JSON-LD read from here.
 */
export const site = {
  name: 'Golden Recruiting',
  legalName: 'Golden Recruiting',
  tagline: 'Founder-Led Recruiting',
  description:
    "Founder-led recruiting firm in Charlotte, NC. We find and vet the hard-to-hire builders, advisors, and leaders your team needs, nationwide.",
  locale: 'en_US',
  location: {
    city: 'Charlotte',
    region: 'NC',
    country: 'US',
  },
  founder: {
    name: 'Briana Toal',
    shortName: 'Bri',
    title: 'Founder, Golden Recruiting',
  },
  contact: {
    // Leave empty until confirmed; the UI hides empty rows.
    phone: '',
    email: 'bri@goldenrecruiting.com',
  } as { phone: string; email: string },
  social: {
    linkedin: '',
  } as { linkedin: string },
  foundingYear: 2026,
  /** Keywords are informational only — search engines ignore the meta tag, but they inform copy. */
  keywords: ['founder-led recruiting', 'executive search', 'recruitment process outsourcing', 'Charlotte recruiter'],
} as const;

export const nav = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/team', label: 'Team' },
  { href: '/mission', label: 'Mission' },
  { href: '/apply', label: 'Apply' },
] as const;
