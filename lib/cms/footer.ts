// Server-only: `next/cache` cannot be imported from a client component.
import { cacheLife, cacheTag } from 'next/cache';
import { CMS_TIMEOUT_MS } from './fetchPage';
import { FOOTER_DEFAULTS, type FooterSettings, type PartnerLogoItem } from './footer-defaults';

export const FOOTER_CACHE_TAG = 'footer';

/** Same resolution order and rationale as `fetchPage.ts` / `global.ts`. */
const CMS_URL = (process.env.STRAPI_URL?.trim() || process.env.NEXT_PUBLIC_STRAPI_URL?.trim())
  ?.replace(/\/+$/, '');

/**
 * `footer` is a single type with a flat `partnerLogos` component list, not a
 * `sections` dynamic zone, so it cannot go through `fetchPageSections` —
 * that helper reads `json.data.sections` and would always come back empty.
 */
const FOOTER_QUERY = 'populate[partnerLogos][populate]=*';

interface FooterResponse {
  data: { partnerLogos?: PartnerLogoItem[] | null } | null;
}

function reportFallback(reason: string, url: string, detail?: string) {
  console.error(
    [
      '',
      '!!! [cms] FOOTER SETTINGS FELL BACK TO BUNDLED DEFAULTS !!!',
      `    reason: ${reason}`,
      `    url:    ${url}`,
      ...(detail ? [`    detail: ${detail}`] : []),
      '',
    ].join('\n')
  );
}

/**
 * Fetches the footer's partner-logo marquee.
 *
 * Never throws — a CMS outage returns the bundled defaults so the footer
 * still renders real logos, not blank text.
 */
export async function getFooterSettings(): Promise<FooterSettings> {
  'use cache';
  cacheLife('hours');
  cacheTag(FOOTER_CACHE_TAG);

  const url = `${CMS_URL ?? '(unset)'}/api/footer?${FOOTER_QUERY}`;

  if (!CMS_URL) {
    reportFallback('neither STRAPI_URL nor NEXT_PUBLIC_STRAPI_URL is set', url);
    return FOOTER_DEFAULTS;
  }

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(CMS_TIMEOUT_MS) });

    // Strapi answers 404 for a single type that has no entry yet. A fresh
    // instance seeds this on boot (see cms/src/index.ts), but a CMS that
    // hasn't finished booting, or one running an older schema, is an
    // ordinary state the defaults already cover — no broken-deploy banner.
    if (res.status === 404) return FOOTER_DEFAULTS;

    if (!res.ok) {
      const body = await res.text().catch(() => '<unreadable body>');
      reportFallback(
        `HTTP ${res.status} ${res.statusText}`,
        url,
        `${body.slice(0, 300).replace(/\s+/g, ' ').trim()}${body.length > 300 ? '…' : ''}`
      );
      return FOOTER_DEFAULTS;
    }

    const json = (await res.json()) as FooterResponse;
    const partnerLogos = json.data?.partnerLogos ?? [];

    return partnerLogos.length > 0 ? { partnerLogos } : FOOTER_DEFAULTS;
  } catch (err) {
    const timedOut = err instanceof Error && err.name === 'TimeoutError';
    reportFallback(
      timedOut ? `no response within ${CMS_TIMEOUT_MS}ms` : 'request failed',
      url,
      err instanceof Error ? err.message : String(err)
    );
    return FOOTER_DEFAULTS;
  }
}
