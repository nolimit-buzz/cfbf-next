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

function reportFallback(stageLabel: string, url: string, reason: string, detail?: string) {
  console.error(
    [
      '',
      `!!! [pipeline-totals] ${stageLabel} STAGE FELL BACK TO CMS/BUNDLED NUMBERS !!!`,
      `    reason: ${reason}`,
      `    url:    ${url}`,
      ...(detail ? [`    detail: ${detail}`] : []),
      '',
    ].join('\n')
  );
}

/**
 * Fetches the live totals for one pipeline stage's metric cards and top
 * figure. Omit `dealStage` for the unscoped "Project Pipeline" totals, or
 * pass the deal-stage id the API expects (e.g. `3` for Credit Approved) to
 * scope it to another stage.
 *
 * Never throws — a fetch failure, missing API key, or malformed/unsuccessful
 * response returns `null` so the caller keeps the CMS/bundled stage numbers,
 * which are already a complete, coherent stage on their own.
 */
export async function getPipelineTotals(dealStage?: number): Promise<RawPipelineTotals | null> {
  'use cache';
  cacheLife('hours');

  const url = dealStage === undefined ? TOTALS_API_URL : `${TOTALS_API_URL}?DealStage=${dealStage}`;
  const stageLabel = dealStage === undefined ? 'PROJECT PIPELINE' : `DEAL STAGE ${dealStage}`;

  const apiKey = process.env['X_API_KEY'];
  if (!apiKey) {
    reportFallback(stageLabel, url, 'X_API_KEY is not configured');
    return null;
  }

  try {
    const res = await fetch(url, {
      headers: { 'X_API_KEY': apiKey },
      signal: AbortSignal.timeout(TOTALS_TIMEOUT_MS),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '<unreadable body>');
      reportFallback(
        stageLabel,
        url,
        `HTTP ${res.status} ${res.statusText}`,
        `${body.slice(0, 300).replace(/\s+/g, ' ').trim()}${body.length > 300 ? '…' : ''}`
      );
      return null;
    }

    const json = (await res.json()) as TotalsApiResponse;

    if (!json.isSuccessful || !json.data) {
      reportFallback(stageLabel, url, 'API responded 200 but isSuccessful was false', json.message);
      return null;
    }

    return json.data;
  } catch (err) {
    const timedOut = err instanceof Error && err.name === 'TimeoutError';
    reportFallback(
      stageLabel,
      url,
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
const formatCapacity = (t: RawPipelineTotals, unit: string) => `${formatFixedDecimal(t.totalProjectedCapacity, 2)} ${unit}`;
const formatCommunities = (t: RawPipelineTotals) => formatInt(t.totalCommunities);
const formatJobs = (t: RawPipelineTotals) => formatTrimmedDecimal(t.totalJobsCreated, 1);
const formatGhg = (t: RawPipelineTotals) => formatFixedDecimal(t.totalGHGEmissions, 2);
const formatCapitalNgn = (t: RawPipelineTotals) => `₦${formatFixedDecimal(t.totalPrivateCapitalMobilized, 2)}B`;
const formatCapitalUsdSub = (t: RawPipelineTotals) =>
  `USD ${formatTrimmedDecimal(t.totalPrivateCapitalMobilizedInDollar, 1)} Mln`;
const formatSizeUsd = (t: RawPipelineTotals) => formatTrimmedDecimal(t.totalSizeInDollar, 1);
const formatSizeNgn = (t: RawPipelineTotals) => `${formatFixedDecimal(t.totalSize, 2)}B NGN EQUIV`;

/**
 * Display-ready override for one pipeline stage — plain strings, shaped
 * exactly like a stage's `usdVal`/`ngnVal`/`metrics` fields, so it can be
 * spread straight over the CMS-resolved stage client-side.
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

/**
 * `capacityUnit` matters because the bundled stage data isn't consistent:
 * Project Pipeline and Closed Projects both show "MWp", but Credit Approved
 * Pipeline shows plain "MW" — see `projects-defaults.ts:581,601,621`.
 */
export function buildStageOverride(
  totals: RawPipelineTotals,
  opts: { capacityUnit: string }
): ProjectPipelineOverride {
  return {
    usdVal: formatSizeUsd(totals),
    ngnVal: formatSizeNgn(totals),
    metrics: {
      connections: formatConnections(totals),
      capacity: formatCapacity(totals, opts.capacityUnit),
      communities: formatCommunities(totals),
      jobs: formatJobs(totals),
      ghg: formatGhg(totals),
      capital: formatCapitalNgn(totals),
      capitalSub: formatCapitalUsdSub(totals),
    },
  };
}
