import type { Metadata } from 'next';
import NewsSections from '@/components/news/NewsSections';
import { getNewsSections } from '@/lib/cms/news';
import { NEWS_STRUCTURED_DATA_DEFAULTS } from '@/lib/cms/news-defaults';
import { pickSection, withoutEmpty } from '@/lib/cms/content';

/** Merges the CMS structured-data section over the bundled defaults. */
async function getSeo() {
  const sections = await getNewsSections();

  return {
    ...NEWS_STRUCTURED_DATA_DEFAULTS,
    ...withoutEmpty(pickSection(sections, 'news-page.structured-data-section')),
  };
}

/**
 * `getNewsSections` is `'use cache'`, so this second call costs nothing and —
 * per the Cache Components rules — keeps metadata on the prerenderable path
 * instead of deferring it to request time.
 *
 * The Dublin Core tags have no first-class Metadata field, so they go through
 * `other`, which renders them as plain `<meta name=… content=…>`.
 */
export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeo();

  return {
    title: seo.pageTitle,
    description: seo.metaDescription,
    openGraph: { url: '/news' },
    other: {
      'DC.title': seo.dcTitle,
      'DC.creator': seo.dcCreator,
      'DC.subject': seo.dcSubject,
      'DC.description': seo.dcDescription,
      'DC.publisher': seo.dcPublisher,
      'DC.language': seo.dcLanguage,
      'DC.type': seo.dcType,
    },
  };
}

export default async function NewsArchivePage() {
  const sections = await getNewsSections();
  const seo = await getSeo();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsMediaOrganization',
    name: seo.schemaName,
    description: seo.schemaDescription,
    url: seo.schemaUrl,
    parentOrganization: {
      '@type': 'Organization',
      name: seo.parentOrganizationName,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NewsSections
        hero={pickSection(sections, 'news-page.hero-section')}
        listing={pickSection(sections, 'news-page.listing-section')}
        articles={pickSection(sections, 'news-page.articles-section')}
        nextSteps={pickSection(sections, 'news-page.next-steps-section')}
      />
    </>
  );
}
