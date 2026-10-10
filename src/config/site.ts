/**
 * Single source of truth for site metadata.
 * Fill in phone/email/socials as they become available — every component,
 * the SEO tags and the JSON-LD read from here.
 */
export const site = {
  name: 'Golden Recruiting',
  legalName: 'Golden Recruiting',
  tagline: 'Great hires start with great connections.',
  description:
    'Golden Recruiting connects employers and talent through real conversations, trusted relationships, and a genuinely personal approach to finding the right fit.',
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
    email: 'hello@goldenrecruiting.com',
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
  { href: '#values', label: 'Values' },
  { href: '#process', label: 'Process' },
  { href: '#connections', label: 'Connections' },
  { href: '#contact', label: 'Contact' },
] as const;
