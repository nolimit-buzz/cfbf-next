/**
 * Bundled fallback copy for the News page.
 *
 * Every section merges as `{ ...DEFAULTS, ...withoutEmpty(cmsSection) }`, so
 * these values render when the CMS is unreachable, unpublished, or when an
 * editor leaves a field blank.
 */
import { newsArticles } from '@/lib/newsData';
import { SITE_URL } from '@/lib/site-config';
import type {
  NewsArticleDetailSection,
  NewsArticleItem,
  NewsArticlesSection,
  NewsHeroSection,
  NewsListingSection,
  NewsNextStepsSection,
  NewsStructuredDataSection,
} from './news-types';

export const NEWS_STRUCTURED_DATA_DEFAULTS: Omit<NewsStructuredDataSection, '__component'> = {
  pageTitle: 'News, insights & press releases | CFBF',
  metaDescription:
    'Stay updated on the green transition, market insights, and announcements from the Climate Finance Blending Facility.',
  dcTitle: 'News & media center - climate finance blending facility',
  dcCreator: 'NoLimitBuzz',
  dcSubject: 'Climate Finance, Green Bonds, Renewable Energy, Market Insights',
  dcDescription: 'Insights and press releases from the Climate Finance Blending Facility.',
  dcPublisher: 'Climate Finance Blending Facility',
  dcLanguage: 'en',
  dcType: 'News Archive',
  schemaName: 'News & Media | Climate Finance Blending Facility',
  schemaDescription:
    'Stay updated on the green transition, market insights, fund updates, and impact reports from the Climate Finance Blending Facility.',
  schemaUrl: `${SITE_URL}/news`,
  parentOrganizationName: 'Climate Finance Blending Facility (CFBF)',
};

export const NEWS_HERO_DEFAULTS: Omit<NewsHeroSection, '__component'> = {
  subtitle: 'Stay updated on the green transition',
  headingPartOne: 'News &',
  headingHighlight: 'media center',
  bgImage:
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1200&auto=format&fit=crop',
  bgImage_alt_text: 'Hero banner',
  breadcrumbHomeLabel: 'home',
  breadcrumbCurrentPage: 'news',
  cardCtaLabel: 'Read Article',
  prevAriaLabel: 'Previous articles',
  nextAriaLabel: 'Next articles',
};

export const NEWS_LISTING_DEFAULTS: Omit<NewsListingSection, '__component'> = {
  sectionSub: 'Latest Updates',
  sectionTitle: 'Insights, announcements and press statements',
  // The tab icons are positional and live in `NewsSections`, so the order here
  // is what pairs a label with its icon.
  viewTabs: [
    { tabId: 'grid', label: 'Grid View' },
    { tabId: 'list', label: 'List View' },
  ],
  categories: [
    { label: 'All' },
    { label: 'Market Insights' },
    { label: 'Fund Updates' },
    { label: 'Impact Report' },
    { label: 'Industry News' },
  ],
};

/**
 * `lib/newsData` mapped into the CMS component shape.
 *
 * Derived rather than re-typed so the bundled article bodies cannot drift from
 * the ones the Navbar mega menu and the homepage ticker still read directly.
 * The two schemas differ only in naming (`articleId`, `blockType`, themes as
 * objects) and in the alt-text fields, which `newsData` never had — those fall
 * back to the title and author name.
 */
export const NEWS_ARTICLE_DEFAULTS: NewsArticleItem[] = newsArticles.map((article) => ({
  articleId: article.id,
  tag: article.tag,
  date: article.date,
  readTime: article.readTime,
  title: article.title,
  excerpt: article.excerpt,
  author: article.author,
  authorAvatar: article.authorAvatar,
  authorAvatar_alt_text: article.author,
  image: article.image,
  image_alt_text: article.title,
  keyContext: article.keyContext,
  themes: article.themes.map((label) => ({ label })),
  paragraphs: article.paragraphs.map((p) => ({
    blockType: p.type,
    text: p.text,
    caption: p.caption ?? null,
    url: p.url ?? null,
    url_alt_text: p.text,
  })),
}));

export const NEWS_ARTICLES_DEFAULTS: Omit<NewsArticlesSection, '__component'> = {
  gridCtaLabel: 'Read Article',
  articles: NEWS_ARTICLE_DEFAULTS,
};

export const NEWS_ARTICLE_DETAIL_DEFAULTS: Omit<NewsArticleDetailSection, '__component'> = {
  loadingLabel: 'Loading article...',
  notFoundTitle: 'Article Not Found',
  notFoundBody: 'The news article you are looking for does not exist or has been moved.',
  notFoundCtaLabel: 'Back to News Hub',
  copyLinkAlert: 'Article link copied to clipboard!',
  titleSuffix: ' | News & Insights',
  publisherName: 'Climate Finance Blending Facility (CFBF)',
  publisherLogoUrl: `${SITE_URL}/logo.png`,
  dcPublisher: 'Climate Finance Blending Facility',
  dcLanguage: 'en',
  dcType: 'News Article',
  breadcrumbParentLabel: 'news',
  breadcrumbPrefix: '/ news / ',
  backLabel: 'Back to News Hub',
  postedByLabel: 'Posted by',
  themesLabel: 'Themes',
  contextLabel: 'Context',
  shareLabel: 'Share',
  shareLinkedinAriaLabel: 'Share on LinkedIn',
  shareTwitterAriaLabel: 'Share on Twitter',
  shareFacebookAriaLabel: 'Share on Facebook',
  copyLinkAriaLabel: 'Copy Link',
  publishedInPrefix: 'Published in ',
  previousArticleLabel: 'Previous Article',
  firstArticleLabel: 'First article',
  nextArticleLabel: 'Next Article',
  latestArticleLabel: 'Latest article',
  relatedHeadingPartOne: 'Related',
  relatedHeadingHighlight: 'updates',
  relatedCtaLabel: 'Read Article',
};

export const NEWS_NEXT_STEPS_DEFAULTS: Omit<NewsNextStepsSection, '__component'> = {
  eyebrow: 'Next steps',
  headingPartOne: 'Explore the',
  headingItalic: 'facility portal',
  // No self-linking: the News page never appears in its own next-steps bar.
  links: [
    {
      eyebrow: 'Portfolio',
      title: 'Browse portfolio',
      description: 'Discover how our credit wraps support developers',
      href: '/projects',
    },
    {
      eyebrow: 'Architecture',
      title: 'Learn how it works',
      description: 'Understand our blending process & structures',
      href: '/how-it-works',
    },
    {
      eyebrow: 'Impact',
      title: 'View our impact',
      description: 'Explore carbon targets and video stories',
      href: '/impact',
    },
  ],
};
