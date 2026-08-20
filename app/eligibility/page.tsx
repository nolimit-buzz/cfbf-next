import type { Metadata } from 'next';
import EligibilitySections from '@/components/eligibility/EligibilitySections';
import { getEligibilitySections } from '@/lib/cms/eligibility';
import { ELIGIBILITY_STRUCTURED_DATA_DEFAULTS } from '@/lib/cms/eligibility-defaults';
import { pickSection, withoutEmpty } from '@/lib/cms/content';

/** Merges the CMS structured-data section over the bundled defaults. */
async function getSeo() {
  const sections = await getEligibilitySections();

  return {
    ...ELIGIBILITY_STRUCTURED_DATA_DEFAULTS,
    ...withoutEmpty(pickSection(sections, 'eligibility-page.structured-data-section')),
  };
}

/**
 * `getEligibilitySections` is `'use cache'`, so this second call costs nothing
 * and — per the Cache Components rules — keeps metadata on the prerenderable
 * path instead of deferring it to request time.
 *
 * The Dublin Core tags have no first-class Metadata field, so they go through
 * `other`, which renders them as plain `<meta name=… content=…>`.
 */
export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeo();

  return {
    title: seo.pageTitle,
    description: seo.metaDescription,
    openGraph: { url: '/eligibility' },
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

export default async function EligibilityPage() {
  const sections = await getEligibilitySections();
  const seo = await getSeo();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: seo.schemaName,
    description: seo.schemaDescription,
    publisher: {
      '@type': 'Organization',
      name: seo.schemaPublisherName,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <EligibilitySections
        hero={pickSection(sections, 'eligibility-page.hero-section')}
        criteriaPillars={pickSection(sections, 'eligibility-page.criteria-pillars-section')}
        timelineWorkflow={pickSection(sections, 'eligibility-page.timeline-workflow-section')}
        nextSteps={pickSection(sections, 'eligibility-page.next-steps-section')}
        finalCta={pickSection(sections, 'eligibility-page.final-cta-section')}
      />
    </>
  );
}
