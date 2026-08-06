// Server-only: `next/cache` cannot be imported from a client component. Pure
// helpers that client components need live in `./content` instead.
import { cacheLife, cacheTag } from 'next/cache';
import { buildZoneQuery, fetchPageSections } from './fetchPage';
import type { HowItWorksPageSection } from './how-it-works-types';

export const HOW_IT_WORKS_CACHE_TAG = 'how-it-works';

/** Components whose fields are all scalars — one populate level is enough. */
const SHALLOW_SECTIONS = [
  'how-it-works-page.structured-data-section',
  'how-it-works-page.facility-structure-section',
];

/**
 * Components with a component inside them.
 *
 * The plain `populate[sections][populate]=*` cannot reach these, which is why
 * a bare `?populate=*` response shows scalars only. Listing a component here
 * also means listing *all* of its component fields, since naming one field
 * replaces the implicit "everything".
 */
const DEEP_SECTIONS = {
  'how-it-works-page.hero-section': ['steps'],
  'how-it-works-page.financing-structure-section': [
    'bullets',
    'anchorFunders',
    'coFinancingPartner',
    'taProviders',
  ],
  'how-it-works-page.process-section': ['steps'],
  'how-it-works-page.next-steps-section': ['links'],
};

const HOW_IT_WORKS_QUERY = buildZoneQuery(SHALLOW_SECTIONS, DEEP_SECTIONS);

/**
 * Fetches the How it works page dynamic zone.
 *
 * Never throws — a CMS outage returns an empty section list so every section
 * falls back to its bundled defaults rather than rendering a blank page.
 */
export async function getHowItWorksSections(): Promise<HowItWorksPageSection[]> {
  'use cache';
  cacheLife('hours');
  cacheTag(HOW_IT_WORKS_CACHE_TAG);

  return fetchPageSections<HowItWorksPageSection>(
    '/api/how-it-works',
    'HOW-IT-WORKS PAGE',
    HOW_IT_WORKS_QUERY
  );
}
