import { CMS_BASE_URL } from '@/lib/cms/config';

/**
 * Archives an email in the CMS `email-log` collection.
 *
 * Deliberately best-effort: a CMS that is down, misconfigured, or missing the
 * Public `create` permission must never turn a successfully delivered email into
 * a failed submission for the visitor. Every error is swallowed and only logged
 * to the server console — so a broken archive is invisible to the site, which is
 * exactly why the console line matters.
 *
 * The Public role needs `create` on Email-log in every environment
 * (Settings → Users & Permissions → Roles → Public). It is not part of the
 * content seed, so a fresh database 403s every write until someone ticks it.
 */
export type EmailLogEntry = {
  /** Which email this was: `contact` (internal enquiry) or `contact-ack`. */
  type: string;
  /** Every recipient, joined — the log should reflect what was actually sent. */
  to: string;
  from: string;
  replyTo: string | null;
  subject: string;
  /** The plain-text rendering of the email, `Label: value` lines then the message. */
  body: string;
  payload: Record<string, unknown> | null;
  status: 'sent' | 'failed';
  error: string | null;
  messageId?: string | null;
  /** The provider's raw acknowledgement — the receipt, if a client ever disputes a send. */
  smtpResponse?: string | null;
};

export async function logEmail(entry: EmailLogEntry) {
  try {
    const response = await fetch(`${CMS_BASE_URL}/api/email-logs`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({ data: { ...entry, sentAt: new Date().toISOString() } }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      console.error('[mail] failed to log email in Strapi', response.status, detail);
    }
  } catch (error) {
    console.error('[mail] failed to log email in Strapi', error);
  }
}
