// Server-only: `next/cache` cannot be imported from a client component. Pure
// helpers that client components need live in `./content` instead.
import { cacheLife, cacheTag } from 'next/cache';
import { buildZoneQuery, fetchPageSections } from './fetchPage';
import type { ImpactPageSection } from './impact-types';

export const IMPACT_CACHE_TAG = 'impact';

/**
 * Every component in the zone.
 *
 * All shallow: no Impact component nests a component inside a repeatable, so
 * one populate level reaches every field. They are still listed individually
 * because `on` is exhaustive — a component left out is omitted from the
 * response entirely.
 */
const SHALLOW_SECTIONS = [
  'impact-page.structured-data-section',
  'impact-page.hero-section',
  'impact-page.philosophy-section',
  'impact-page.impact-console-section',
  'impact-page.stories-tab-section',
  'impact-page.numbers-tab-section',
  'impact-page.investments-tab-section',
  'impact-page.assets-tab-section',
  'impact-page.next-steps-section',
  'impact-page.video-modal-section',
];

const IMPACT_QUERY = buildZoneQuery(SHALLOW_SECTIONS);

/**
 * Fetches the Impact page dynamic zone.
 *
 * Never throws — a CMS outage returns an empty section list so every section
 * falls back to its bundled defaults rather than rendering a blank page.
 */
export async function getImpactSections(): Promise<ImpactPageSection[]> {
  'use cache';
  cacheLife('hours');
  cacheTag(IMPACT_CACHE_TAG);

  return fetchPageSections<ImpactPageSection>('/api/impact', 'IMPACT PAGE', IMPACT_QUERY);
}
