import { sendEmail, escapeHtml } from '@/lib/email/brevo';

/**
 * Receives the contact page enquiry form and delivers it over Brevo.
 *
 * Two emails per submission: the enquiry itself to CONTACT_TO_EMAIL (reply-to
 * set to the enquirer, so a reply goes straight back), and a short
 * acknowledgement to the enquirer. The acknowledgement is best-effort — see the
 * send block below.
 */

const ROLES = ['developer', 'investor', 'donor'] as const;
type Role = (typeof ROLES)[number];

const MAX_FIELD = 200;
const MAX_MESSAGE = 5000;

/** Field labels for the internal email, in the order they should be listed. */
const SHARED_LABELS: Array<[string, string]> = [
  ['fullName', 'Full name'],
  ['organization', 'Organization'],
  ['emailAddress', 'Email'],
];

const ROLE_LABELS: Record<Role, Array<[string, string]>> = {
  developer: [
    ['techType', 'Technology type'],
    ['capacity', 'Capacity'],
  ],
  investor: [
    ['institutionType', 'Institution type'],
    ['investmentTranche', 'Investment tranche'],
  ],
  donor: [],
};

/**
 * Trims and length-caps a submitted value. Returns null when it is missing,
 * empty, or not a string — the `required` attributes on the form are a UX
 * affordance, not a guarantee, since anything can POST here.
 */
function field(value: unknown, max = MAX_FIELD) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, max);
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function row(label: string, value: string) {
  return `<tr>
    <td style="padding:6px 12px 6px 0;vertical-align:top;color:#6b7280;font-size:13px;white-space:nowrap;">${escapeHtml(label)}</td>
    <td style="padding:6px 0;vertical-align:top;color:#051F1A;font-size:14px;">${escapeHtml(value)}</td>
  </tr>`;
}

export async function POST(request: Request) {
  if (!process.env.BREVO_API_KEY || !process.env.BREVO_FROM_EMAIL) {
    return Response.json(
      { error: 'BREVO_API_KEY and BREVO_FROM_EMAIL are not configured' },
      { status: 500 }
    );
  }

  const recipient = process.env.CONTACT_TO_EMAIL;
  if (!recipient) {
    return Response.json({ error: 'CONTACT_TO_EMAIL is not configured' }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Expected a JSON body' }, { status: 400 });
  }

  const role = ROLES.includes(body.role as Role) ? (body.role as Role) : null;
  if (!role) {
    return Response.json({ error: 'A valid role is required' }, { status: 400 });
  }

  const values: Record<string, string> = {};

  for (const [key, label] of [...SHARED_LABELS, ...ROLE_LABELS[role]]) {
    const value = field(body[key]);
    if (!value) {
      return Response.json({ error: `${label} is required` }, { status: 400 });
    }
    values[key] = value;
  }

  if (!isEmail(values.emailAddress)) {
    return Response.json({ error: 'A valid email address is required' }, { status: 400 });
  }

  if (role === 'developer' && !(Number(values.capacity) >= 0)) {
    return Response.json({ error: 'Capacity must be a valid number' }, { status: 400 });
  }

  const message = field(body.message, MAX_MESSAGE);
  if (!message) {
    return Response.json({ error: 'Message is required' }, { status: 400 });
  }

  // Eligibility context, present when the visitor arrived from the assessment
  // via /contact?readiness=…&score=…&tech=…. Optional by design.
  const readiness = field(body.readiness);
  const score = field(body.score);
  const tech = field(body.tech);

  const rows = [
    ...SHARED_LABELS.map(([key, label]) => row(label, values[key])),
    ...ROLE_LABELS[role].map(([key, label]) => row(label, values[key])),
    ...(readiness ? [row('Assessment outcome', readiness)] : []),
    ...(score ? [row('Readiness score', score)] : []),
    ...(tech ? [row('Assessment technology', tech)] : []),
  ].join('');

  const internalHtml = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:640px;">
      <p style="font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#6b7280;margin:0 0 4px;">
        Climate Facility &middot; ${escapeHtml(role)} enquiry
      </p>
      <h2 style="margin:0 0 20px;color:#051F1A;font-size:20px;">${escapeHtml(values.fullName)}</h2>
      <table style="border-collapse:collapse;margin-bottom:20px;">${rows}</table>
      <div style="border-top:1px solid #e5e7eb;padding-top:16px;">
        <p style="font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#6b7280;margin:0 0 8px;">Message</p>
        <p style="white-space:pre-wrap;color:#051F1A;font-size:14px;line-height:1.6;margin:0;">${escapeHtml(message)}</p>
      </div>
    </div>`;

  try {
    await sendEmail({
      to: recipient,
      subject: `New ${role} enquiry — ${values.fullName}`,
      htmlContent: internalHtml,
      replyTo: values.emailAddress,
    });
  } catch (error) {
    console.error('[contact] enquiry send failed', error);
    return Response.json({ error: 'Could not send your enquiry. Please try again.' }, { status: 502 });
  }

  // Best-effort: the enquiry is already delivered, so a bounced acknowledgement
  // (typo'd address, Brevo rate limit) must not read to the visitor as a failed
  // submission.
  try {
    await sendEmail({
      to: values.emailAddress,
      subject: 'We received your enquiry — Climate Facility',
      htmlContent: `
        <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;max-width:640px;color:#051F1A;">
          <p style="font-size:14px;line-height:1.6;">Hi ${escapeHtml(values.fullName)},</p>
          <p style="font-size:14px;line-height:1.6;">
            Thank you for contacting the Climate Facility. We have received your enquiry
            and a member of our team will be in touch shortly.
          </p>
          <div style="border-left:3px solid #e5e7eb;padding-left:16px;margin:20px 0;">
            <p style="white-space:pre-wrap;font-size:14px;line-height:1.6;color:#4b5563;margin:0;">${escapeHtml(message)}</p>
          </div>
          <p style="font-size:13px;color:#6b7280;line-height:1.6;">
            This is an automated confirmation — there is no need to reply.
          </p>
        </div>`,
    });
  } catch (error) {
    console.error('[contact] acknowledgement send failed', error);
  }

  return Response.json({ sent: true });
}
