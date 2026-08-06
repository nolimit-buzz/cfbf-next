// Server-only: `next/cache` cannot be imported from a client component. Pure
// helpers that client components need live in `./content` instead.
import { cacheLife, cacheTag } from 'next/cache';
import { buildZoneQuery, fetchPageSections } from './fetchPage';
import type { EligibilityPageSection } from './eligibility-types';

export const ELIGIBILITY_CACHE_TAG = 'eligibility';

/** Components whose fields are all scalars — one populate level is enough. */
const SHALLOW_SECTIONS = [
  'eligibility-page.structured-data-section',
  'eligibility-page.final-cta-section',
  'eligibility-page.assessment-chrome-section',
];

/**
 * Components with a component inside a repeatable.
 *
 * `cards` nests `listItems`/`stats` and `questions` nests `options`, which the
 * plain `populate[sections][populate]=*` cannot reach. Listing a component here
 * also means listing *all* of its component fields, since naming one field
 * replaces the implicit "everything".
 */
const DEEP_SECTIONS = {
  'eligibility-page.hero-section': ['sectors'],
  'eligibility-page.criteria-pillars-section': ['cards'],
  'eligibility-page.timeline-workflow-section': ['steps'],
  'eligibility-page.next-steps-section': ['links'],
  'eligibility-page.assessment-steps-section': ['steps', 'questions'],
  'eligibility-page.assessment-result-section': ['outcomes', 'logRows'],
};

const ELIGIBILITY_QUERY = buildZoneQuery(SHALLOW_SECTIONS, DEEP_SECTIONS);

/**
 * Fetches the Eligibility page dynamic zone.
 *
 * Serves both `/eligibility` and `/eligibility/assessment` — the wizard's copy
 * lives in the same single type, so the two routes share one cache entry and one
 * revalidation tag.
 *
 * Never throws — a CMS outage returns an empty section list so every section
 * falls back to its bundled defaults rather than rendering a blank page.
 */
export async function getEligibilitySections(): Promise<EligibilityPageSection[]> {
  'use cache';
  cacheLife('hours');
  cacheTag(ELIGIBILITY_CACHE_TAG);

  return fetchPageSections<EligibilityPageSection>(
    '/api/eligibility',
    'ELIGIBILITY PAGE',
    ELIGIBILITY_QUERY
  );
}
