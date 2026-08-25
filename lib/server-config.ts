// Server-only secrets. NEVER import this from a "use client" component or
// from a module that one imports (e.g. lib/cms/*-defaults.ts) — unlike
// site-config.ts, nothing here is meant to reach the browser bundle.

/**
 * InfraCredit Summary API key — see lib/api/pipelineTotals.ts, lib/api/businessModels.ts.
 * Hardcoded (not read from `process.env`): the production deployment has no
 * way to configure platform env vars, so an env-var lookup here is silently
 * dead there regardless of what it's named. The HTTP header the API itself
 * expects is `X-API-KEY` (hyphen) — an unrelated name, don't conflate it with
 * this constant when touching either this file or the files above.
 */
export const XKEY = '3ae3911c-87da-451f-9b25-21d01c60ec1b';
