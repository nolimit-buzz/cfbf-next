// Server-only: `next/cache` cannot be imported from a client component. Pure
// helpers that client components need live in `./content` instead.
import { cacheLife, cacheTag } from 'next/cache';
import type { HomeResponse, HomeSection } from './types';

const CMS_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

/**
 * Strapi rejects deeper populate syntax on this instance (`pLevel` is not
 * installed, and `populate[sections][populate][x][populate]` 400s), but the
 * dynamic zone only nests two levels so this returns the complete tree.
 */
const HOME_QUERY = 'populate[sections][populate]=*';

export const HOME_CACHE_TAG = 'home';

/**
 * Fetches the homepage dynamic zone.
 *
 * Never throws — a CMS outage returns an empty section list so every component
 * falls back to its bundled defaults rather than rendering a blank page.
 */
export async function getHomeSections(): Promise<HomeSection[]> {
  'use cache';
  cacheLife('hours');
  cacheTag(HOME_CACHE_TAG);

  if (!CMS_URL) {
    console.warn('[cms] NEXT_PUBLIC_STRAPI_URL is not set — using bundled homepage defaults');
    return [];
  }

  try {
    const res = await fetch(`${CMS_URL}/api/home?${HOME_QUERY}`);

    if (!res.ok) {
      console.warn(`[cms] GET /api/home failed with ${res.status} — using bundled homepage defaults`);
      return [];
    }

    const json = (await res.json()) as HomeResponse;
    return json.data?.sections ?? [];
  } catch (err) {
    console.warn('[cms] GET /api/home threw — using bundled homepage defaults', err);
    return [];
  }
}

