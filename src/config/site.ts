/**
 * Single source of truth for site metadata.
 * Fill in phone/email/socials as they become available — every component,
 * the SEO tags and the JSON-LD read from here.
 */
export const site = {
  name: 'Golden Recruiting',
  legalName: 'Golden Recruiting',
  tagline: 'Strategic recruiting for the financial services industry.',
  description:
    'Golden Recruiting is a Charlotte, NC recruiting and practice consulting firm specializing in experienced financial advisors with portable books, advisor support roles, sales and executive search — running every search end to end.',
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
  keywords: [
    'financial advisor recruiting',
    'financial services recruiting',
    'wealth management recruiter',
    'advisor recruiting Charlotte NC',
    'executive search financial services',
    'RPO financial services',
  ],
} as const;

export const nav = [
  { href: '#about', label: 'About' },
  { href: '#verticals', label: 'Verticals' },
  { href: '#services', label: 'Services' },
  { href: '#process', label: 'Process' },
  { href: '#why', label: 'Why Golden' },
  { href: '#contact', label: 'Contact' },
] as const;
