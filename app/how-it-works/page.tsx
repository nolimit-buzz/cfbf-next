import type { Metadata } from 'next';
import HowItWorksSections from '@/components/how-it-works/HowItWorksSections';
import { getHowItWorksSections } from '@/lib/cms/how-it-works';
import { HOW_IT_WORKS_STRUCTURED_DATA_DEFAULTS } from '@/lib/cms/how-it-works-defaults';
import { pickSection, withoutEmpty } from '@/lib/cms/content';

/** Merges the CMS structured-data section over the bundled defaults. */
async function getSeo() {
  const sections = await getHowItWorksSections();

  return {
    ...HOW_IT_WORKS_STRUCTURED_DATA_DEFAULTS,
    ...withoutEmpty(pickSection(sections, 'how-it-works-page.structured-data-section')),
  };
}

/**
 * `getHowItWorksSections` is `'use cache'`, so this second call costs nothing
 * and — per the Cache Components rules — keeps metadata on the prerenderable
 * path instead of deferring it to request time.
 *
 * The Dublin Core tags have no first-class Metadata field, so they go through
 * `other`, which renders them as plain `<meta name=… content=…>`. This page's
 * schema carries no `DC.publisher`, unlike the other pages'.
 */
export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeo();

  return {
    title: seo.pageTitle,
    description: seo.metaDescription,
    openGraph: { url: '/how-it-works' },
    other: {
      'DC.title': seo.dcTitle,
      'DC.creator': seo.dcCreator,
      'DC.subject': seo.dcSubject,
      'DC.description': seo.dcDescription,
      'DC.language': seo.dcLanguage,
      'DC.type': seo.dcType,
    },
  };
}

export default async function HowItWorksPage() {
  const sections = await getHowItWorksSections();
  const seo = await getSeo();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: seo.schemaName,
    description: seo.schemaDescription,
    publisher: {
      '@type': 'Organization',
      name: seo.publisherName,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HowItWorksSections
        hero={pickSection(sections, 'how-it-works-page.hero-section')}
        financingStructure={pickSection(sections, 'how-it-works-page.financing-structure-section')}
        facilityStructure={pickSection(sections, 'how-it-works-page.facility-structure-section')}
        process={pickSection(sections, 'how-it-works-page.process-section')}
        nextSteps={pickSection(sections, 'how-it-works-page.next-steps-section')}
      />
    </>
  );
}
