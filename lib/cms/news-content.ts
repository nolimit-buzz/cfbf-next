/**
 * Pure helpers for reusing News articles outside the `/news` route.
 *
 * Kept apart from `./news` because the consumers are client components and
 * `./news` imports `next/cache`, which is server-only — the same split as
 * `./content` vs `./home`.
 */
import type { NewsArticleItem } from './news-types';

/**
 * The subset of an article the navbar, the homepage ticker and the homepage
 * cards actually render.
 *
 * Flattening here rather than at each call site absorbs the two places the CMS
 * shape differs from the long-standing `lib/newsData` one — `articleId` vs
 * `id`, and themes as objects vs plain strings — so the existing search filters
 * and card markup keep working unchanged.
 */
export interface NewsSummary {
  /** The `/news/[id]` segment. */
  id: string;
  title: string;
  tag: string;
  date: string;
  image: string;
  imageAlt: string;
  author: string;
  themes: string[];
}

export function toNewsSummaries(articles: NewsArticleItem[]): NewsSummary[] {
  return articles.map((article) => ({
    id: article.articleId,
    title: article.title,
    tag: article.tag,
    date: article.date,
    image: article.image,
    imageAlt: article.image_alt_text || article.title,
    author: article.author,
    themes: article.themes.map((theme) => theme.label),
  }));
}
