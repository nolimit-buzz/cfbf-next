// Server-only: `next/cache` cannot be imported from a client component. Pure
// helpers that client components need live in `./content` instead.
import { cacheLife, cacheTag } from 'next/cache';
import { buildZoneQuery, fetchPageSections } from './fetchPage';
import type { ProjectsPageSection } from './projects-types';

export const PROJECTS_CACHE_TAG = 'projects';

/** Components whose repeatables hold only scalars — one populate level is enough. */
const SHALLOW_SECTIONS = [
  'projects-page.structured-data-section',
  'projects-page.hero-section',
  'projects-page.portfolio-tabs-section',
  'projects-page.analysis-tab-section',
  'projects-page.pipeline-tab-section',
  'projects-page.eligibility-cta-section',
  'projects-page.lga-modal-section',
  'projects-page.next-steps-section',
];

/**
 * Components with a component inside a repeatable.
 *
 * These are the reason the Projects page cannot use the plain
 * `populate[sections][populate]=*` the homepage uses: that stops at two levels,
 * so `stages` would arrive without its `metrics` and `states` without its
 * `lgas`. Listing a component here also means listing *all* of its component
 * fields, since naming one field replaces the implicit "everything".
 */
const DEEP_SECTIONS = {
  'projects-page.pipeline-console-section': [
    'metricLabels',
    'stages',
    'sdgFrameworks',
    'totalPipelineRows',
    'mandatedDealRows',
  ],
  'projects-page.footprint-map-section': ['legend', 'states', 'lgaProjects'],
};

const PROJECTS_QUERY = buildZoneQuery(SHALLOW_SECTIONS, DEEP_SECTIONS);

/**
 * Fetches the Projects page dynamic zone.
 *
 * Never throws — a CMS outage returns an empty section list so every section
 * falls back to its bundled defaults rather than rendering a blank page.
 */
export async function getProjectsSections(): Promise<ProjectsPageSection[]> {
  'use cache';
  cacheLife('hours');
  cacheTag(PROJECTS_CACHE_TAG);

  return fetchPageSections<ProjectsPageSection>('/api/projects', 'PROJECTS PAGE', PROJECTS_QUERY);
}
