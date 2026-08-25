// Server-only secrets. NEVER import this from a "use client" component or
// from a module that one imports (e.g. lib/cms/*-defaults.ts) — unlike
// site-config.ts, nothing here is meant to reach the browser bundle.

/**
 * InfraCredit Summary API key — see lib/api/pipelineTotals.ts, lib/api/businessModels.ts.
 * Env var is `XKEY` (per .env.local); the HTTP header the API itself expects
 * is `X-API-KEY` (hyphen) — the two names are independent, don't conflate
 * them when touching either file.
 */
export const XKEY = process.env.XKEY;
