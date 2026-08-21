// Server-only: `next/cache` cannot be imported from a client component.
import { cacheLife, cacheTag } from 'next/cache';
import { CMS_BASE_URL } from './config';
import { CMS_TIMEOUT_MS } from './fetchPage';
import { GLOBAL_DEFAULTS, type GlobalSettings, type SocialLinkItem } from './global-defaults';

export const GLOBAL_CACHE_TAG = 'global';

/**
 * `Global` is a single type with plain fields, not a `sections` dynamic zone,
 * so it cannot go through `fetchPageSections` — that helper reads
 * `json.data.sections` and would always come back empty here.
 */
const GLOBAL_QUERY = 'populate[socialLinks][populate]=*';

interface GlobalResponse {
  data: { socialLinks?: SocialLinkItem[] | null } | null;
}

function reportFallback(reason: string, url: string, detail?: string) {
  console.error(
    [
      '',
      '!!! [cms] GLOBAL SETTINGS FELL BACK TO BUNDLED DEFAULTS !!!',
      `    reason: ${reason}`,
      `    url:    ${url}`,
      ...(detail ? [`    detail: ${detail}`] : []),
      '',
    ].join('\n')
  );
}

/**
 * Fetches site-wide settings (currently the footer's social profiles).
 *
 * Never throws — a CMS outage returns the bundled defaults so the footer still
 * renders, minus the social icons.
 */
export async function getGlobalSettings(): Promise<GlobalSettings> {
  'use cache';
  cacheLife('hours');
  cacheTag(GLOBAL_CACHE_TAG);

  const url = `${CMS_BASE_URL}/api/global?${GLOBAL_QUERY}`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(CMS_TIMEOUT_MS) });

    // Strapi answers 404 for a single type that has no entry yet. Unlike the
    // page zones, `Global` is not seeded on boot, so "not created" is an
    // ordinary state an editor has simply not got to — the defaults already
    // cover it. Don't raise a broken-deploy banner for it.
    if (res.status === 404) return GLOBAL_DEFAULTS;

    if (!res.ok) {
      const body = await res.text().catch(() => '<unreadable body>');
      reportFallback(
        `HTTP ${res.status} ${res.statusText}`,
        url,
        `${body.slice(0, 300).replace(/\s+/g, ' ').trim()}${body.length > 300 ? '…' : ''}`
      );
      return GLOBAL_DEFAULTS;
    }

    const json = (await res.json()) as GlobalResponse;
    const socialLinks = json.data?.socialLinks ?? [];

    // An empty repeatable means the editor has not filled it in yet, which is
    // the same outcome as the defaults: no icons. Keep the defaults so the
    // shape is always the five known platforms.
    return socialLinks.length > 0 ? { socialLinks } : GLOBAL_DEFAULTS;
  } catch (err) {
    const timedOut = err instanceof Error && err.name === 'TimeoutError';
    reportFallback(
      timedOut ? `no response within ${CMS_TIMEOUT_MS}ms` : 'request failed',
      url,
      err instanceof Error ? err.message : String(err)
    );
    return GLOBAL_DEFAULTS;
  }
}
