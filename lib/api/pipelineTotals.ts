// Server-only: `next/cache` cannot be imported from a client component.
import { cacheLife } from 'next/cache';

const TOTALS_API_URL = 'https://icgcapionpremiseggstrms-infracredit.msappproxy.net/api/Summary/get-totals';
const TOTALS_TIMEOUT_MS = 8_000;

export interface RawPipelineTotals {
  totalConnections: number;
  totalProjectedCapacity: number;
  totalCommunities: number;
  totalJobsCreated: number;
  totalGHGEmissions: number;
  totalPrivateCapitalMobilized: number;
  totalPrivateCapitalMobilizedInDollar: number;
  totalSize: number;
  totalSizeInDollar: number;
  totalProjects: number;
}

interface TotalsApiResponse {
  data: RawPipelineTotals;
  isSuccessful: boolean;
  message: string;
}

function reportFallback(reason: string, detail?: string) {
  console.error(
    [
      '',
      '!!! [pipeline-totals] PROJECT PIPELINE STAGE FELL BACK TO CMS/BUNDLED NUMBERS !!!',
      `    reason: ${reason}`,
      `    url:    ${TOTALS_API_URL}`,
      ...(detail ? [`    detail: ${detail}`] : []),
      '',
    ].join('\n')
  );
}

/**
 * Fetches the live pipeline totals used by the "Project Pipeline" stage's
 * metric cards and top figure.
 *
 * Never throws — a fetch failure, missing API key, or malformed/unsuccessful
 * response returns `null` so the caller keeps the CMS/bundled stage numbers,
 * which are already a complete, coherent stage on their own.
 */
export async function getPipelineTotals(): Promise<RawPipelineTotals | null> {
  'use cache';
  cacheLife('hours');

  const apiKey = process.env['X-API-KEY'];
  if (!apiKey) {
    reportFallback('X-API-KEY is not configured');
    return null;
  }

  try {
    const res = await fetch(TOTALS_API_URL, {
      headers: { 'X-API-KEY': apiKey },
      signal: AbortSignal.timeout(TOTALS_TIMEOUT_MS),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '<unreadable body>');
      reportFallback(
        `HTTP ${res.status} ${res.statusText}`,
        `${body.slice(0, 300).replace(/\s+/g, ' ').trim()}${body.length > 300 ? '…' : ''}`
      );
      return null;
    }

    const json = (await res.json()) as TotalsApiResponse;

    if (!json.isSuccessful || !json.data) {
      reportFallback('API responded 200 but isSuccessful was false', json.message);
      return null;
    }

    return json.data;
  } catch (err) {
    const timedOut = err instanceof Error && err.name === 'TimeoutError';
    reportFallback(
      timedOut ? `no response within ${TOTALS_TIMEOUT_MS}ms` : 'request failed',
      err instanceof Error ? err.message : String(err)
    );
    return null;
  }
}

// ─── Formatting ──────────────────────────────────────────────────────────────
// Matches the display-string conventions already baked into
// `PROJECTS_PIPELINE_CONSOLE_DEFAULTS.stages` (see projects-defaults.ts) so
// swapping in live numbers doesn't change the look of the cards.

function formatInt(n: number): string {
  return Math.round(n).toLocaleString('en-US');
}

/** Comma-grouped, trailing ".0" trimmed to match the bundled "162,600.5" style. */
function formatTrimmedDecimal(n: number, maxDecimals = 1): string {
  return n.toLocaleString('en-US', { maximumFractionDigits: maxDecimals, minimumFractionDigits: 0 });
}

function formatFixedDecimal(n: number, decimals: number): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const formatConnections = (t: RawPipelineTotals) => formatInt(t.totalConnections);
const formatCapacity = (t: RawPipelineTotals) => `${formatFixedDecimal(t.totalProjectedCapacity, 2)} MWp`;
const formatCommunities = (t: RawPipelineTotals) => formatInt(t.totalCommunities);
const formatJobs = (t: RawPipelineTotals) => formatTrimmedDecimal(t.totalJobsCreated, 1);
const formatGhg = (t: RawPipelineTotals) => formatFixedDecimal(t.totalGHGEmissions, 2);
const formatCapitalNgn = (t: RawPipelineTotals) => `₦${formatFixedDecimal(t.totalPrivateCapitalMobilized, 2)}B`;
const formatCapitalUsdSub = (t: RawPipelineTotals) =>
  `USD ${formatTrimmedDecimal(t.totalPrivateCapitalMobilizedInDollar, 1)} Mln`;
const formatSizeUsd = (t: RawPipelineTotals) => formatTrimmedDecimal(t.totalSizeInDollar, 1);
const formatSizeNgn = (t: RawPipelineTotals) => `${formatFixedDecimal(t.totalSize, 2)}B NGN EQUIV`;

/**
 * Display-ready override for the "Project Pipeline" stage — plain strings,
 * shaped exactly like that stage's `usdVal`/`ngnVal`/`metrics` fields, so it
 * can be spread straight over the CMS-resolved stage client-side.
 */
export interface ProjectPipelineOverride {
  usdVal: string;
  ngnVal: string;
  metrics: {
    connections: string;
    capacity: string;
    communities: string;
    jobs: string;
    ghg: string;
    capital: string;
    capitalSub: string;
  };
}

export function buildProjectPipelineOverride(totals: RawPipelineTotals): ProjectPipelineOverride {
  return {
    usdVal: formatSizeUsd(totals),
    ngnVal: formatSizeNgn(totals),
    metrics: {
      connections: formatConnections(totals),
      capacity: formatCapacity(totals),
      communities: formatCommunities(totals),
      jobs: formatJobs(totals),
      ghg: formatGhg(totals),
      capital: formatCapitalNgn(totals),
      capitalSub: formatCapitalUsdSub(totals),
    },
  };
}
