// Server-only: `next/cache` cannot be imported from a client component. Pure
// helpers that client components need live in `./content` instead.
import { cacheLife, cacheTag } from 'next/cache';
import { pickSection } from './content';
import { buildZoneQuery, fetchPageSections } from './fetchPage';
import { NEWS_ARTICLE_DEFAULTS } from './news-defaults';
import type { NewsArticleItem, NewsPageSection } from './news-types';

export const NEWS_CACHE_TAG = 'news';

/** Components with no nested repeatables — one populate level is enough. */
const SHALLOW_SECTIONS = [
  'news-page.structured-data-section',
  'news-page.hero-section',
  'news-page.article-detail-section',
];

/**
 * Components with a component inside a repeatable.
 *
 * `articles` is the reason this page cannot use the plain
 * `populate[sections][populate]=*`: that stops at two levels, so every article
 * would arrive without its `themes` and `paragraphs`. Listing a component here
 * also means listing *all* of its component fields, since naming one field
 * replaces the implicit "everything" — hence `viewTabs` alongside `categories`.
 */
const DEEP_SECTIONS = {
  'news-page.articles-section': ['articles'],
  'news-page.listing-section': ['viewTabs', 'categories'],
  'news-page.next-steps-section': ['links'],
};

const NEWS_QUERY = buildZoneQuery(SHALLOW_SECTIONS, DEEP_SECTIONS);

/**
 * Fetches the News page dynamic zone.
 *
 * Never throws — a CMS outage returns an empty section list so every section
 * falls back to its bundled defaults rather than rendering a blank page.
 */
export async function getNewsSections(): Promise<NewsPageSection[]> {
  'use cache';
  cacheLife('hours');
  cacheTag(NEWS_CACHE_TAG);

  return fetchPageSections<NewsPageSection>('/api/news', 'NEWS PAGE', NEWS_QUERY);
}

/**
 * The one list of articles every surface reads.
 *
 * The News page owns the articles, but the navbar mega menu, the homepage
 * ticker, the homepage cards and the LLM feed all show the same items — reading
 * them from here rather than from `lib/newsData` is what stops a CMS-only
 * article from being invisible outside `/news`.
 *
 * No fetch of its own: it reuses `getNewsSections`, so it shares that cache
 * entry and `POST /api/revalidate-news` already invalidates it.
 */
export async function getNewsArticles(): Promise<NewsArticleItem[]> {
  const sections = await getNewsSections();
  const articles = pickSection(sections, 'news-page.articles-section')?.articles ?? [];

  return articles.length > 0 ? articles : NEWS_ARTICLE_DEFAULTS;
}
