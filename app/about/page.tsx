import type { Metadata } from 'next';
import AboutSections from '@/components/about/AboutSections';
import { getAboutSections } from '@/lib/cms/about';
import { ABOUT_STRUCTURED_DATA_DEFAULTS } from '@/lib/cms/about-defaults';
import { pickSection, withoutEmpty } from '@/lib/cms/content';

/** Merges the CMS structured-data section over the bundled defaults. */
async function getSeo() {
  const sections = await getAboutSections();

  return {
    ...ABOUT_STRUCTURED_DATA_DEFAULTS,
    ...withoutEmpty(pickSection(sections, 'about-page.structured-data-section')),
  };
}

/**
 * `getAboutSections` is `'use cache'`, so this second call costs nothing and —
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

export default async function AboutPage() {
  const sections = await getAboutSections();
  const seo = await getSeo();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': seo.jsonLdType,
    name: seo.jsonLdName,
    description: seo.jsonLdDescription,
    publisher: { '@type': 'Organization', name: seo.jsonLdPublisherName },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AboutSections
        hero={pickSection(sections, 'about-page.hero-section')}
        stickyNav={pickSection(sections, 'about-page.sticky-nav-section')}
        mandate={pickSection(sections, 'about-page.mandate-section')}
        market={pickSection(sections, 'about-page.market-section')}
        energyMap={pickSection(sections, 'about-page.energy-map-section')}
        framework={pickSection(sections, 'about-page.framework-section')}
        capitalStack={pickSection(sections, 'about-page.capital-stack-section')}
        partners={pickSection(sections, 'about-page.partners-section')}
        milestones={pickSection(sections, 'about-page.milestones-section')}
        audience={pickSection(sections, 'about-page.audience-section')}
        nextSteps={pickSection(sections, 'about-page.next-steps-section')}
        downloadCta={pickSection(sections, 'about-page.download-cta-section')}
        loadingLabel={seo.loadingLabel}
      />
    </>
  );
}
