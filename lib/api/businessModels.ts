// Server-only: `next/cache` cannot be imported from a client component.
import { cacheLife } from 'next/cache';

const BUSINESS_MODELS_API_URL =
  'https://icgcapionpremiseggstrms-infracredit.msappproxy.net/api/Summary/filterDealsV2?IndustryId=17&TransactionType=4';
const BUSINESS_MODELS_TIMEOUT_MS = 8_000;

interface DealBusinessModelAggregation {
  businessModel: string;
  totalDeals: number;
  totalDealSize: number;
  totalPipeline: number;
}

export interface RawBusinessModelTotals {
  dealBusinessModelAggregations: DealBusinessModelAggregation[];
  totalDeals: number;
  totalPipeline: number;
  totalDealPipeline: number;
}

interface BusinessModelsApiResponse {
  data: RawBusinessModelTotals;
  isSuccessful: boolean;
  message: string;
}

function reportFallback(reason: string, detail?: string) {
  console.error(
    [
      '',
      '!!! [business-models] BUSINESS MODELS TABLE FELL BACK TO CMS/BUNDLED ROWS !!!',
      `    reason: ${reason}`,
      `    url:    ${BUSINESS_MODELS_API_URL}`,
      ...(detail ? [`    detail: ${detail}`] : []),
      '',
    ].join('\n')
  );
}

/**
 * Fetches the live business-model aggregations behind the "Business Models"
 * stage's table (both the Total Pipeline and Mandated Deals tabs come from
 * one call — see `buildBusinessModelTables`).
 *
 * Never throws — a fetch failure, missing API key, or malformed/unsuccessful
 * response returns `null` so the caller keeps the CMS/bundled rows, which are
 * already a complete, coherent table on their own.
 */
export async function getBusinessModelTotals(): Promise<RawBusinessModelTotals | null> {
  'use cache';
  cacheLife('hours');

  const apiKey = process.env['X_API_KEY'];
  if (!apiKey) {
    reportFallback('X_API_KEY is not configured');
    return null;
  }

  try {
    const res = await fetch(BUSINESS_MODELS_API_URL, {
      headers: { 'X_API_KEY': apiKey },
      signal: AbortSignal.timeout(BUSINESS_MODELS_TIMEOUT_MS),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '<unreadable body>');
      reportFallback(
        `HTTP ${res.status} ${res.statusText}`,
        `${body.slice(0, 300).replace(/\s+/g, ' ').trim()}${body.length > 300 ? '…' : ''}`
      );
      return null;
    }

    const json = (await res.json()) as BusinessModelsApiResponse;

    if (!json.isSuccessful || !json.data) {
      reportFallback('API responded 200 but isSuccessful was false', json.message);
      return null;
    }

    return json.data;
  } catch (err) {
    const timedOut = err instanceof Error && err.name === 'TimeoutError';
    reportFallback(
      timedOut ? `no response within ${BUSINESS_MODELS_TIMEOUT_MS}ms` : 'request failed',
      err instanceof Error ? err.message : String(err)
    );
    return null;
  }
}

// ─── Table building ──────────────────────────────────────────────────────────
// Matches `PipelineConsole.tsx`'s local `TableRow` shape (`sector`,
// `projectsCount`, `valueNgn`, `percentage`) so the built rows can be passed
// straight into its existing `totalSectorPipeline`/`mandatedDeals` props.

export interface BusinessModelRow {
  sector: string;
  projectsCount: number;
  valueNgn: number;
  percentage: string;
}

export interface BusinessModelFooter {
  projects: string;
  totalPipeline: string;
  totalMandated: string;
}

export interface BusinessModelTables {
  totalPipelineRows: BusinessModelRow[];
  mandatedDealRows: BusinessModelRow[];
  footer: BusinessModelFooter;
}

function formatPercent(value: number, total: number): string {
  if (total === 0) return '0.00%';
  return `${((value / total) * 100).toFixed(2)}%`;
}

function formatPlainDecimal(n: number): string {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function buildBusinessModelTables(totals: RawBusinessModelTotals): BusinessModelTables {
  const totalPipelineRows: BusinessModelRow[] = [];
  const mandatedDealRows: BusinessModelRow[] = [];

  for (const row of totals.dealBusinessModelAggregations) {
    totalPipelineRows.push({
      sector: row.businessModel,
      projectsCount: row.totalDeals,
      valueNgn: row.totalPipeline,
      percentage: formatPercent(row.totalPipeline, totals.totalPipeline),
    });

    mandatedDealRows.push({
      sector: row.businessModel,
      projectsCount: row.totalDeals,
      valueNgn: row.totalDealSize,
      percentage: formatPercent(row.totalDealSize, totals.totalDealPipeline),
    });
  }

  return {
    totalPipelineRows,
    mandatedDealRows,
    footer: {
      projects: String(totals.totalDeals),
      totalPipeline: formatPlainDecimal(totals.totalPipeline),
      totalMandated: formatPlainDecimal(totals.totalDealPipeline),
    },
  };
}
