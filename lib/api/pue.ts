// Server-only: `next/cache` cannot be imported from a client component.
import { cacheLife } from 'next/cache';
import { STATE_LGAS, LGA_PROJECTS_BY_STATE, resolveStateId, LGAProjectEntry } from '@/lib/mapData';
import { CMS_BASE_URL } from '@/lib/cms/config';

/**
 * Proxied through Strapi's `pue-proxy` route rather than fetched directly from
 * InfraCredit: InfraCredit's WordPress firewall blocks requests from Vercel's
 * shared/dynamic IP range (confirmed via HTTP 403), but not from the Strapi
 * VPS's fixed IP. See `cms/src/api/pue-proxy/controllers/pue-proxy.ts`, which
 * does the actual InfraCredit fetch and forwards the JSON verbatim.
 */
const PUE_API_URL = `${CMS_BASE_URL}/api/pue-proxy`;
const PUE_TIMEOUT_MS = 8_000;

interface PueApiEntry {
  serial_no: string;
  Communities: string;
  States: string;
  LGA: string;
  project_type: string;
  Company: string;
  pue_potential: string;
  enumerator_no: string;
}

type PueApiState = Record<string, PueApiEntry[] | string>;
type PueApiResponse = Record<string, PueApiState>;

export interface FootprintData {
  /** LGA display names per state, keyed by `@svg-maps/nigeria` id. */
  stateLgas: Record<string, string[]>;
  /** Project rows keyed by `${mapId}::${lgaName}` — composite to avoid LGA-name collisions across states. */
  lgaProjects: Record<string, LGAProjectEntry[]>;
  /** Whether this came from the live API or the bundled fallback — for the page's apiDebug log. */
  source: 'live' | 'fallback';
  /** Why it fell back, when `source === 'fallback'` — same text as the terminal `reportFallback` log. */
  reason?: string;
}

function fallbackData(reason?: string): FootprintData {
  return { stateLgas: STATE_LGAS, lgaProjects: LGA_PROJECTS_BY_STATE, source: 'fallback', reason };
}

function reportFallback(reason: string, detail?: string) {
  console.error(
    [
      '',
      '!!! [pue-api] GEOGRAPHICAL DISTRIBUTION FELL BACK TO BUNDLED DEFAULTS !!!',
      `    reason: ${reason}`,
      `    url:    ${PUE_API_URL}`,
      ...(detail ? [`    detail: ${detail}`] : []),
      '',
    ].join('\n')
  );
}

function isEntryArray(value: PueApiEntry[] | string): value is PueApiEntry[] {
  return Array.isArray(value);
}

function normalize(raw: PueApiResponse): Omit<FootprintData, 'source'> {
  const stateLgas: Record<string, string[]> = {};
  const lgaProjects: Record<string, LGAProjectEntry[]> = {};

  for (const [apiStateName, stateData] of Object.entries(raw)) {
    const mapId = resolveStateId(apiStateName);
    if (!mapId) continue;

    // Seeded with whatever a prior raw-key variant of this same state (e.g.
    // "Kogi"/"KOGI"/"kogi") already contributed — the API repeats states
    // under multiple castings, so this must accumulate, not overwrite.
    const lgaNames: string[] = stateLgas[mapId] ?? [];

    for (const [lgaKey, value] of Object.entries(stateData)) {
      if (lgaKey === '' || lgaKey === 'enumerator_no' || !isEntryArray(value)) continue;

      const lgaName = lgaKey.trim();
      if (!lgaName) continue;

      const entries: LGAProjectEntry[] = value
        .filter(row => (row.Communities ?? '').trim() !== '' || (row.Company ?? '').trim() !== '')
        .map(row => ({
          developer: (row.Company ?? '').trim(),
          community: (row.Communities ?? '').trim(),
          state: (row.States ?? '').trim(),
          lga: (row.LGA ?? '').trim() || lgaName,
          projectType: (row.project_type ?? '').trim(),
          puePotential: Number(row.pue_potential) || 0,
          enumerators: Number(row.enumerator_no) || 0,
        }));

      if (!lgaNames.includes(lgaName)) lgaNames.push(lgaName);

      const key = `${mapId}::${lgaName}`;
      lgaProjects[key] = [...(lgaProjects[key] ?? []), ...entries];
    }

    if (lgaNames.length > 0) {
      stateLgas[mapId] = lgaNames;
    }
  }

  return { stateLgas, lgaProjects };
}

/**
 * Fetches and normalizes the InfraCredit PUE geographical-distribution data.
 *
 * Never throws — a fetch failure or malformed payload falls back to the
 * bundled static data (`STATE_LGAS`/`LGA_PROJECTS_BY_STATE`) so the page still
 * renders.
 */
export async function getFootprintData(): Promise<FootprintData> {
  'use cache';
  cacheLife('hours');

  console.log(`[pue-api] fetching from ${PUE_API_URL}`);

  try {
    // A bare fetch() with no User-Agent/Referer is a common trigger for
    // WordPress WAF/bot-protection plugins to block the request — this can
    // silently succeed from a local dev machine's IP while failing from a
    // cloud provider's shared serverless IP ranges (confirmed here: prod
    // returns HTTP 403). A browser-like Referer costs nothing if that's not
    // the actual cause.
    const res = await fetch(PUE_API_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'application/json',
        Referer: 'https://infracredit.ng/',
      },
      signal: AbortSignal.timeout(PUE_TIMEOUT_MS),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '<unreadable body>');
      const reason = `HTTP ${res.status} ${res.statusText}`;
      reportFallback(
        reason,
        `${body.slice(0, 300).replace(/\s+/g, ' ').trim()}${body.length > 300 ? '…' : ''}`
      );
      return fallbackData(reason);
    }

    const json = (await res.json()) as PueApiResponse;
    const normalized = normalize(json);

    if (Object.keys(normalized.stateLgas).length === 0) {
      const reason = 'API responded 200 but no state data could be resolved';
      reportFallback(reason);
      return fallbackData(reason);
    }

    console.log('[pue-api] loaded live data');
    return { ...normalized, source: 'live' };
  } catch (err) {
    const timedOut = err instanceof Error && err.name === 'TimeoutError';
    const reason = timedOut ? `no response within ${PUE_TIMEOUT_MS}ms` : 'request failed';
    reportFallback(reason, err instanceof Error ? err.message : String(err));
    return fallbackData(reason);
  }
}
