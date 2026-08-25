// Server-only: `next/cache` cannot be imported from a client component.
import { cacheLife } from 'next/cache';
import { XKEY } from '@/lib/server-config';

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

export interface BusinessModelTotalsResult {
  data: RawBusinessModelTotals | null;
  /** Why it fell back, when `data` is null — same text as the terminal `reportFallback` log. */
  reason?: string;
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
export async function getBusinessModelTotals(): Promise<BusinessModelTotalsResult> {
  'use cache';
  cacheLife('hours');

  console.log(`[business-models] fetching from ${BUSINESS_MODELS_API_URL}`);

  if (!XKEY) {
    const reason = 'XKEY is not configured';
    reportFallback(reason);
    return { data: null, reason };
  }

  try {
    const res = await fetch(BUSINESS_MODELS_API_URL, {
      headers: { 'X-API-KEY': XKEY },
      signal: AbortSignal.timeout(BUSINESS_MODELS_TIMEOUT_MS),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '<unreadable body>');
      const reason = `HTTP ${res.status} ${res.statusText}`;
      reportFallback(
        reason,
        `${body.slice(0, 300).replace(/\s+/g, ' ').trim()}${body.length > 300 ? '…' : ''}`
      );
      return { data: null, reason };
    }

    const json = (await res.json()) as BusinessModelsApiResponse;

    if (!json.isSuccessful || !json.data) {
      const reason = 'API responded 200 but isSuccessful was false';
      reportFallback(reason, json.message);
      return { data: null, reason };
    }

    console.log('[business-models] loaded live data');
    return { data: json.data };
  } catch (err) {
    const timedOut = err instanceof Error && err.name === 'TimeoutError';
    const reason = timedOut ? `no response within ${BUSINESS_MODELS_TIMEOUT_MS}ms` : 'request failed';
    reportFallback(reason, err instanceof Error ? err.message : String(err));
    return { data: null, reason };
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
