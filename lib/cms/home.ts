// Server-only: `next/cache` cannot be imported from a client component. Pure
// helpers that client components need live in `./content` instead.
import { cacheLife, cacheTag } from 'next/cache';
import { fetchPageSections } from './fetchPage';
import type { HomeSection } from './types';

export const HOME_CACHE_TAG = 'home';

/**
 * Fetches the homepage dynamic zone.
 *
 * Never throws — a CMS outage returns an empty section list so every component
 * falls back to its bundled defaults rather than rendering a blank page. The
 * fetch, the diagnostics and the fallback contract all live in `./fetchPage`;
 * what belongs here is the cache identity, because the tag is this page's
 * `revalidateTag` target.
 */
export async function getHomeSections(): Promise<HomeSection[]> {
  'use cache';
  cacheLife('hours');
  cacheTag(HOME_CACHE_TAG);

  return fetchPageSections<HomeSection>('/api/home', 'HOMEPAGE');
}
