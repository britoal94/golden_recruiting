import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { site } from '../../config/site';

export const prerender = false;

const ROLES = new Set(['Hiring for a role', 'Looking for a role', 'Something else']);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

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

  const apiKey = import.meta.env.RESEND_API_KEY;
  const to = import.meta.env.CONTACT_TO_EMAIL;
  const from = import.meta.env.CONTACT_FROM_EMAIL || `${site.name} <onboarding@resend.dev>`;

  if (!apiKey || !to) {
    console.error('Contact form: RESEND_API_KEY or CONTACT_TO_EMAIL is not configured.');
    return respond(request, 503, { ok: false, error: 'The contact form is not configured yet. Please email us directly.' });
  }

  const resend = new Resend(apiKey);
  const subject = `[${site.name}] ${role} — ${name}`;
  const text = `Name: ${name}\nEmail: ${email}\nI am: ${role}\n\n${message}`;
  const html = `
    <table style="font-family:sans-serif;font-size:15px;line-height:1.5">
      <tr><td style="color:#666;padding:4px 12px 4px 0">Name</td><td>${escapeHtml(name)}</td></tr>
      <tr><td style="color:#666;padding:4px 12px 4px 0">Email</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
      <tr><td style="color:#666;padding:4px 12px 4px 0">I am</td><td>${escapeHtml(role)}</td></tr>
    </table>
    <p style="font-family:sans-serif;font-size:15px;line-height:1.6;white-space:pre-wrap">${escapeHtml(message)}</p>`;

  const { error } = await resend.emails.send({ from, to, replyTo: email, subject, text, html });

  if (error) {
    console.error('Resend error:', error);
    return respond(request, 502, { ok: false, error: 'We could not send your message. Please email us directly.' });
  }

  return respond(request, 200, { ok: true });
};

// Anything but POST is a 405.
export const ALL: APIRoute = () => new Response(null, { status: 405, headers: { Allow: 'POST' } });
