/**
 * Minimal Brevo transactional-email client.
 *
 * Brevo's send endpoint is a plain JSON POST, so this is `fetch` rather than the
 * `@getbrevo/brevo` SDK — the SDK would be a dependency for one request shape.
 *
 * Server-only: `BREVO_API_KEY` has no NEXT_PUBLIC_ prefix and must never reach
 * the browser bundle. Import this from route handlers only.
 */

const BREVO_ENDPOINT = 'https://api.brevo.com/v3/smtp/email';

type SendEmailOptions = {
  to: string;
  subject: string;
  htmlContent: string;
  /** Address a reply should go to, when it differs from the sender. */
  replyTo?: string;
};

export async function sendEmail({ to, subject, htmlContent, replyTo }: SendEmailOptions) {
  // Read at call time, not module scope: a missing key then surfaces as a failed
  // request the route can report, rather than throwing during the build.
  const apiKey = process.env.BREVO_API_KEY;
  const fromEmail = process.env.BREVO_FROM_EMAIL;
  const fromName = process.env.BREVO_FROM_NAME?.trim() || 'Climate Facility';

  if (!apiKey || !fromEmail) {
    throw new Error('BREVO_API_KEY and BREVO_FROM_EMAIL must be configured');
  }

  const response = await fetch(BREVO_ENDPOINT, {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { email: fromEmail, name: fromName },
      to: [{ email: to }],
      subject,
      htmlContent,
      ...(replyTo ? { replyTo: { email: replyTo } } : {}),
    }),
  });

  if (!response.ok) {
    // Brevo returns `{ code, message }` on error; include it so a bad key or an
    // unverified sender is diagnosable from the server log alone.
    const detail = await response.text().catch(() => '');
    throw new Error(`Brevo send failed (${response.status}): ${detail}`);
  }

  return response.json().catch(() => ({}));
}

/** Escapes a user-supplied value for interpolation into an HTML email body. */
export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
