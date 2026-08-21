import type { Metadata } from 'next';
import ImpactSections from '@/components/impact/ImpactSections';
import { getImpactSections } from '@/lib/cms/impact';
import { IMPACT_STRUCTURED_DATA_DEFAULTS } from '@/lib/cms/impact-defaults';
import { pickSection, withoutEmpty } from '@/lib/cms/content';

/** Merges the CMS structured-data section over the bundled defaults. */
async function getSeo() {
  const sections = await getImpactSections();

  return {
    ...IMPACT_STRUCTURED_DATA_DEFAULTS,
    ...withoutEmpty(pickSection(sections, 'impact-page.structured-data-section')),
  };
}

/**
 * `getImpactSections` is `'use cache'`, so this second call costs nothing and —
 * per the Cache Components rules — keeps metadata on the prerenderable path
 * instead of deferring it to request time.
 *
 * Unlike Projects, the Impact structured-data component carries no Dublin Core
 * and no JSON-LD fields, so there is nothing to render beyond title and
 * description.
 */
export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeo();

  return {
    title: seo.pageTitle,
    description: seo.metaDescription,
    openGraph: { url: '/impact' },
  };
}

export default async function ImpactPage() {
  const sections = await getImpactSections();
  const seo = await getSeo();

  return (
    <ImpactSections
      hero={pickSection(sections, 'impact-page.hero-section')}
      philosophy={pickSection(sections, 'impact-page.philosophy-section')}
      impactConsole={pickSection(sections, 'impact-page.impact-console-section')}
      storiesTab={pickSection(sections, 'impact-page.stories-tab-section')}
      numbersTab={pickSection(sections, 'impact-page.numbers-tab-section')}
      investmentsTab={pickSection(sections, 'impact-page.investments-tab-section')}
      assetsTab={pickSection(sections, 'impact-page.assets-tab-section')}
      nextSteps={pickSection(sections, 'impact-page.next-steps-section')}
    />
  );
}
