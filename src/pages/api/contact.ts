import type { APIRoute } from 'astro';
import { createHash } from 'node:crypto';
import { createElement } from 'react';
import { Resend } from 'resend';
import { ContactSubmission } from '../../emails/ContactSubmission';
import { site } from '../../config/site';

export const prerender = false;

const ROLES = new Set(['Hiring for a role', 'Looking for a role', 'Something else']);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function respond(request: Request, status: number, body: { ok: boolean; error?: string }) {
  const wantsJson = request.headers.get('accept')?.includes('application/json');
  if (wantsJson) {
    return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });
  }
  // Plain HTML form post (no JS): bounce back to the contact section with a flag.
  const flag = body.ok ? 'sent=1' : 'error=1';
  return new Response(null, { status: 303, headers: { Location: `/?${flag}#contact` } });
}

export const POST: APIRoute = async ({ request }) => {
  let data: FormData;
  try {
    data = await request.formData();
  } catch {
    return respond(request, 400, { ok: false, error: 'Invalid form submission.' });
  }

  // Honeypot filled → silently accept so bots don't learn anything.
  if (String(data.get('company') ?? '').trim()) {
    return respond(request, 200, { ok: true });
  }

  const name = String(data.get('name') ?? '').trim().slice(0, 120);
  const email = String(data.get('email') ?? '').trim().slice(0, 200);
  const roleRaw = String(data.get('role') ?? '').trim();
  const role = ROLES.has(roleRaw) ? roleRaw : 'Something else';
  const message = String(data.get('message') ?? '').trim().slice(0, 5000);

  if (!name || !EMAIL_RE.test(email) || !message) {
    return respond(request, 422, { ok: false, error: 'Please fill in your name, a valid email, and a message.' });
  }

  // RESEND_API_KEY and RESEND_EMAIL_DOMAIN are injected by the Vercel Resend
  // integration; the sending domain is the verified subdomain, so a default
  // from-address built from it can never hit a domain-mismatch 403.
  const apiKey = import.meta.env.RESEND_API_KEY;
  const to = import.meta.env.CONTACT_TO_EMAIL;
  const sendingDomain = import.meta.env.RESEND_EMAIL_DOMAIN;
  const from =
    import.meta.env.CONTACT_FROM_EMAIL || (sendingDomain ? `${site.name} <contact@${sendingDomain}>` : '');

  if (!apiKey || !to || !from) {
    console.error('Contact form: RESEND_API_KEY, CONTACT_TO_EMAIL or a from-address is not configured.');
    return respond(request, 503, { ok: false, error: 'The contact form is not configured yet. Please email us directly.' });
  }

  const resend = new Resend(apiKey);
  const subject = `[${site.name}] ${role} — ${name}`;
  const text = `Name: ${name}\nEmail: ${email}\nI am: ${role}\n\n${message}`;
  // Same submission retried (e.g. flaky network) within 24h is delivered once.
  const idempotencyKey = `contact-form/${createHash('sha256').update(`${email}\n${message}`).digest('hex').slice(0, 32)}`;

  const react = createElement(ContactSubmission, {
    name,
    email,
    role,
    message,
    receivedAt: new Date().toISOString(),
  });

  const { error } = await resend.emails.send({ from, to, replyTo: email, subject, text, react }, { idempotencyKey });

  if (error) {
    console.error('Resend error:', error);
    return respond(request, 502, { ok: false, error: 'We could not send your message. Please email us directly.' });
  }

  return respond(request, 200, { ok: true });
};

// Anything but POST is a 405.
export const ALL: APIRoute = () => new Response(null, { status: 405, headers: { Allow: 'POST' } });
