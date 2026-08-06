/**
 * Types for the Strapi `news` single type.
 *
 * Shape verified against the deep-populate query built in `./news.ts` and the
 * JSON schemas under `cms/src/components/news-page/`.
 *
 * Notes:
 * - Media fields are plain URL strings (Cloudinary), not Strapi media objects.
 * - Every media field has a sibling `<field>_alt_text`.
 * - Names mirror the JSON schemas exactly, which means two of them differ from
 *   the long-standing `lib/newsData` shape: an article's id is `articleId`, and
 *   a paragraph's kind is `blockType`. The mapping is done in
 *   `./news-defaults`, not by renaming here.
 */

/**
 * Fields present on every entry returned inside the dynamic zone.
 *
 * `id` is optional so the bundled fallback content in `./news-defaults` can
 * reuse these types without inventing ids the CMS owns.
 */
interface ComponentBase {
  id?: number;
}

/* ----------------------------------------------------- structured data */

export interface NewsStructuredDataSection extends ComponentBase {
  __component: 'news-page.structured-data-section';
  pageTitle: string;
  metaDescription: string;
  dcTitle: string;
  dcCreator: string;
  dcSubject: string;
  dcDescription: string;
  dcPublisher: string;
  dcLanguage: string;
  dcType: string;
  schemaName: string;
  schemaDescription: string;
  schemaUrl: string;
  parentOrganizationName: string;
}

/* ------------------------------------------------------------- hero */

export interface NewsHeroSection extends ComponentBase {
  __component: 'news-page.hero-section';
  subtitle: string;
  /** The `<h1>` is split so each fragment keeps its own styling. */
  headingPartOne: string;
  headingHighlight: string;
  bgImage: string;
  bgImage_alt_text: string;
  breadcrumbHomeLabel: string;
  breadcrumbCurrentPage: string;
  cardCtaLabel: string;
  prevAriaLabel: string;
  nextAriaLabel: string;
}

/* ---------------------------------------------------------- listing */

export interface NewsViewTabItem extends ComponentBase {
  /** Matches the `viewMode` state values: `grid` | `list`. */
  tabId: string;
  label: string;
}

export interface NewsCategoryItem extends ComponentBase {
  label: string;
}

export interface NewsListingSection extends ComponentBase {
  __component: 'news-page.listing-section';
  sectionSub: string;
  sectionTitle: string;
  viewTabs: NewsViewTabItem[];
  categories: NewsCategoryItem[];
}

/* --------------------------------------------------------- articles */

export interface NewsArticleThemeItem extends ComponentBase {
  label: string;
}

export interface NewsArticleParagraphItem extends ComponentBase {
  blockType: 'p' | 'h2' | 'blockquote' | 'image';
  text: string;
  caption?: string | null;
  url?: string | null;
  url_alt_text?: string | null;
}

export interface NewsArticleItem extends ComponentBase {
  /** The `/news/[id]` segment. Named `articleId` because `id` is Strapi's own. */
  articleId: string;
  tag: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
  author: string;
  authorAvatar: string;
  authorAvatar_alt_text: string;
  image: string;
  image_alt_text: string;
  keyContext: string;
  themes: NewsArticleThemeItem[];
  paragraphs: NewsArticleParagraphItem[];
}

export interface NewsArticlesSection extends ComponentBase {
  __component: 'news-page.articles-section';
  gridCtaLabel: string;
  articles: NewsArticleItem[];
}

/* --------------------------------------------------- article detail */

export interface NewsArticleDetailSection extends ComponentBase {
  __component: 'news-page.article-detail-section';
  loadingLabel: string;
  notFoundTitle: string;
  notFoundBody: string;
  notFoundCtaLabel: string;
  copyLinkAlert: string;
  titleSuffix: string;
  publisherName: string;
  publisherLogoUrl: string;
  dcPublisher: string;
  dcLanguage: string;
  dcType: string;
  breadcrumbParentLabel: string;
  breadcrumbPrefix: string;
  backLabel: string;
  postedByLabel: string;
  themesLabel: string;
  contextLabel: string;
  shareLabel: string;
  shareLinkedinAriaLabel: string;
  shareTwitterAriaLabel: string;
  shareFacebookAriaLabel: string;
  copyLinkAriaLabel: string;
  publishedInPrefix: string;
  previousArticleLabel: string;
  firstArticleLabel: string;
  nextArticleLabel: string;
  latestArticleLabel: string;
  relatedHeadingPartOne: string;
  relatedHeadingHighlight: string;
  relatedCtaLabel: string;
}

/* ------------------------------------------------------- next steps */

export interface NewsPortalLinkItem extends ComponentBase {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
}

export interface NewsNextStepsSection extends ComponentBase {
  __component: 'news-page.next-steps-section';
  eyebrow: string;
  headingPartOne: string;
  headingItalic: string;
  links: NewsPortalLinkItem[];
}

/* ------------------------------------------------------------- zone */

export type NewsPageSection =
  | NewsStructuredDataSection
  | NewsHeroSection
  | NewsListingSection
  | NewsArticlesSection
  | NewsArticleDetailSection
  | NewsNextStepsSection;
