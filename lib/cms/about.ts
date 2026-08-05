// Server-only: `next/cache` cannot be imported from a client component. Pure
// helpers that client components need live in `./content` instead.
import { cacheLife, cacheTag } from 'next/cache';
import { buildZoneQuery, fetchPageSections } from './fetchPage';
import type { AboutPageSection } from './about-types';

export const ABOUT_CACHE_TAG = 'about';

/** Components whose repeatables hold only scalars — one populate level is enough. */
const SHALLOW_SECTIONS = [
  'about-page.structured-data-section',
  'about-page.hero-section',
  'about-page.sticky-nav-section',
  'about-page.mandate-section',
  'about-page.market-section',
  'about-page.energy-map-section',
  'about-page.framework-section',
  'about-page.capital-stack-section',
  'about-page.next-steps-section',
  'about-page.download-cta-section',
];

/**
 * Components with a repeatable inside a repeatable.
 *
 * These are the reason the About page cannot use the plain
 * `populate[sections][populate]=*` the homepage uses: that stops at two levels,
 * so `groups` would arrive without its `partners` and `milestones` without its
 * `events`. Listing a component here also means listing *all* of its component
 * fields, since naming one field replaces the implicit "everything".
 */
const DEEP_SECTIONS = {
  'about-page.partners-section': ['groups'],
  'about-page.milestones-section': ['railYears', 'milestones'],
  'about-page.audience-section': ['personas'],
};

const ABOUT_QUERY = buildZoneQuery(SHALLOW_SECTIONS, DEEP_SECTIONS);

/**
 * Fetches the About page dynamic zone.
 *
 * Never throws — a CMS outage returns an empty section list so every section
 * falls back to its bundled defaults rather than rendering a blank page.
 */
export async function getAboutSections(): Promise<AboutPageSection[]> {
  'use cache';
  cacheLife('hours');
  cacheTag(ABOUT_CACHE_TAG);

  return fetchPageSections<AboutPageSection>('/api/about', 'ABOUT PAGE', ABOUT_QUERY);
}
