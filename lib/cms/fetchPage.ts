// Server-only: `next/cache` cannot be imported from a client component. Pure
// helpers that client components need live in `./content` instead.
import { CMS_BASE_URL } from './config';

/**
 * Reads every component in the zone, two levels deep.
 *
 * Enough for a zone whose components only nest one level of repeatables. A
 * component nesting a third level (a milestone's events, a partner group's
 * partners) needs the per-component `on` form instead — see
 * `buildZoneQuery`, which the About page uses.
 */
export const SECTIONS_QUERY = 'populate[sections][populate]=*';

/**
 * How long to wait on Strapi before giving up and using bundled defaults.
 *
 * Without this, `fetch` inherits undici's default header timeout — minutes —
 * during which the page renders nothing at all. A CMS that has not answered in
 * eight seconds is not going to save the render, and the fallback path already
 * produces a complete page, so failing fast is strictly better than waiting.
 */
export const CMS_TIMEOUT_MS = 8_000;

/**
 * Builds a `populate[sections][on][…]` query for a dynamic zone.
 *
 * Strapi's `on` form is the only way to populate past two levels: it takes one
 * populate spec per component, which is what lets a partners section ask for
 * `groups.partners` while a hero section just asks for everything.
 *
 * Note the trade-off — `on` is exhaustive, not additive. A component left out
 * of the map is omitted from the response entirely, so every component in the
 * zone must appear here.
 *
 * @param shallow Components whose repeatables are only one level deep.
 * @param deep    Component -> the fields on it that themselves nest components.
 */
export function buildZoneQuery(shallow: string[], deep: Record<string, string[]> = {}): string {
  const parts = shallow.map((component) => `populate[sections][on][${component}][populate]=*`);

  for (const [component, fields] of Object.entries(deep)) {
    for (const field of fields) {
      parts.push(`populate[sections][on][${component}][populate][${field}][populate]=*`);
    }
  }

  // Strapi's parser wants the brackets literal, so only the two halves around
  // the `=` are escaped — not the separators themselves.
  return parts.map((part) => part.split('=').map(encodeURIComponent).join('=')).join('&');
}

/** Shape shared by every page single type: one dynamic zone named `sections`. */
interface PageResponse<S> {
  data: { id: number; documentId: string; sections: S[] } | null;
}

/**
 * A page dropping to bundled defaults renders fine, which means a broken deploy
 * looks healthy. Make the reason impossible to miss in a build log, and include
 * enough detail to tell the causes apart: a Cloudflare or proxy block returns an
 * HTML challenge page, whereas a genuine Strapi error returns
 * `{"data":null,"error":{…}}`.
 */
function reportFallback(label: string, url: string, reason: string, detail?: string) {
  console.error(
    [
      '',
      `!!! [cms] ${label} FELL BACK TO BUNDLED DEFAULTS !!!`,
      `    reason: ${reason}`,
      `    url:    ${url}`,
      ...(detail ? [`    detail: ${detail}`] : []),
      '',
    ].join('\n')
  );
}

/**
 * Fetches one page's dynamic zone from Strapi.
 *
 * Never throws — a CMS outage returns an empty section list so every component
 * falls back to its bundled defaults rather than rendering a blank page.
 *
 * Callers wrap this in their own `'use cache'` function so each page gets its
 * own cache entry and its own `revalidateTag` target.
 *
 * @param path  API path of the single type, e.g. `/api/about`.
 * @param label Name used in the fallback banner, e.g. `ABOUT PAGE`.
 * @param query Populate query — `SECTIONS_QUERY`, or one from `buildZoneQuery`.
 */
export async function fetchPageSections<S>(
  path: string,
  label: string,
  query: string = SECTIONS_QUERY
): Promise<S[]> {
  const url = `${CMS_BASE_URL}${path}?${query}`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(CMS_TIMEOUT_MS) });

    if (!res.ok) {
      // The body is the diagnosis, so surface a slice of it rather than the
      // status alone. Reading it can itself fail, hence the guard.
      const body = await res.text().catch(() => '<unreadable body>');
      reportFallback(
        label,
        url,
        `HTTP ${res.status} ${res.statusText}`,
        `${body.slice(0, 300).replace(/\s+/g, ' ').trim()}${body.length > 300 ? '…' : ''}`
      );
      return [];
    }

    const json = (await res.json()) as PageResponse<S>;
    const sections = json.data?.sections ?? [];

    if (sections.length === 0) {
      reportFallback(label, url, 'CMS responded 200 but returned no sections', 'is the entry published?');
    }

    return sections;
  } catch (err) {
    // A timeout aborts with `TimeoutError`; name it rather than lumping it in
    // with connection failures, since the two point at different problems.
    const timedOut = err instanceof Error && err.name === 'TimeoutError';
    reportFallback(
      label,
      url,
      timedOut ? `no response within ${CMS_TIMEOUT_MS}ms` : 'request failed',
      err instanceof Error ? err.message : String(err)
    );
    return [];
  }
}
