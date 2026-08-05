// Server-only: `next/cache` cannot be imported from a client component. Pure
// helpers that client components need live in `./content` instead.
import { cacheLife, cacheTag } from 'next/cache';
import type { HomeResponse, HomeSection } from './types';

/**
 * Base URL of the Strapi instance.
 *
 * Prefer the server-only `STRAPI_URL`: this fetch never runs in the browser, so
 * the value has no business being inlined into the client bundle. `NEXT_PUBLIC_`
 * vars are substituted at build time, which also means they cannot be corrected
 * without a full rebuild. `NEXT_PUBLIC_STRAPI_URL` stays as a fallback so
 * existing deployments keep working until their env is migrated.
 *
 * `||` rather than `??` on purpose: a key created in a hosting dashboard with a
 * blank value arrives as `""`, which would otherwise shadow a perfectly good
 * legacy value instead of falling through to it.
 */
const CMS_URL = (process.env.STRAPI_URL?.trim() || process.env.NEXT_PUBLIC_STRAPI_URL?.trim())
  ?.replace(/\/+$/, '');

/**
 * Strapi rejects deeper populate syntax on this instance (`pLevel` is not
 * installed, and `populate[sections][populate][x][populate]` 400s), but the
 * dynamic zone only nests two levels so this returns the complete tree.
 */
const HOME_QUERY = 'populate[sections][populate]=*';

export const HOME_CACHE_TAG = 'home';

/**
 * The homepage silently renders bundled defaults when the CMS is unreachable,
 * which means a broken deploy looks fine. Make the reason impossible to miss in
 * a build log, and include enough detail to tell the causes apart: a Cloudflare
 * or proxy block returns an HTML challenge page, whereas a genuine Strapi error
 * returns `{"data":null,"error":{…}}`.
 */
function reportFallback(reason: string, detail?: string) {
  console.error(
    [
      '',
      '!!! [cms] HOMEPAGE FELL BACK TO BUNDLED DEFAULTS !!!',
      `    reason: ${reason}`,
      `    url:    ${CMS_URL ?? '(unset)'}/api/home?${HOME_QUERY}`,
      ...(detail ? [`    detail: ${detail}`] : []),
      '',
    ].join('\n')
  );
}

/**
 * Fetches the homepage dynamic zone.
 *
 * Never throws — a CMS outage returns an empty section list so every component
 * falls back to its bundled defaults rather than rendering a blank page.
 */
export async function getHomeSections(): Promise<HomeSection[]> {
  'use cache';
  cacheLife('hours');
  cacheTag(HOME_CACHE_TAG);

  if (!CMS_URL) {
    reportFallback('neither STRAPI_URL nor NEXT_PUBLIC_STRAPI_URL is set');
    return [];
  }

  try {
    const res = await fetch(`${CMS_URL}/api/home?${HOME_QUERY}`);

    if (!res.ok) {
      // The body is the diagnosis, so surface a slice of it rather than the
      // status alone. Reading it can itself fail, hence the guard.
      const body = await res.text().catch(() => '<unreadable body>');
      reportFallback(
        `HTTP ${res.status} ${res.statusText}`,
        `${body.slice(0, 300).replace(/\s+/g, ' ').trim()}${body.length > 300 ? '…' : ''}`
      );
      return [];
    }

    const json = (await res.json()) as HomeResponse;
    const sections = json.data?.sections ?? [];

    if (sections.length === 0) {
      reportFallback('CMS responded 200 but returned no sections', 'is the `home` entry published?');
    }

    return sections;
  } catch (err) {
    reportFallback('request failed', err instanceof Error ? err.message : String(err));
    return [];
  }
}

