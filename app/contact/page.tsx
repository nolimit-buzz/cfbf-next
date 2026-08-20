import type { Metadata } from 'next';
import ContactSections from '@/components/contact/ContactSections';
import { getContactSections } from '@/lib/cms/contact';
import { CONTACT_STRUCTURED_DATA_DEFAULTS } from '@/lib/cms/contact-defaults';
import { pickSection, withoutEmpty } from '@/lib/cms/content';

/** Merges the CMS structured-data section over the bundled defaults. */
async function getSeo() {
  const sections = await getContactSections();

  return {
    ...CONTACT_STRUCTURED_DATA_DEFAULTS,
    ...withoutEmpty(pickSection(sections, 'contact-page.structured-data-section')),
  };
}

/**
 * `getContactSections` is `'use cache'`, so this second call costs nothing and —
 * per the Cache Components rules — keeps metadata on the prerenderable path
 * instead of deferring it to request time.
 *
 * This replaces the `<title>`/`<meta>` the page used to hoist from inside the
 * client component; now that the route is a server component, the real Metadata
 * API is available.
 */
export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeo();

  return {
    title: seo.pageTitle,
    description: seo.metaDescription,
    openGraph: { url: '/contact' },
  };
}

export default async function ContactPage() {
  const sections = await getContactSections();
  const seo = await getSeo();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': seo.jsonLdType,
    name: seo.jsonLdName,
    description: seo.jsonLdDescription,
    publisher: {
      '@type': 'Organization',
      name: seo.jsonLdPublisherName,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactSections
        hero={pickSection(sections, 'contact-page.hero-section')}
        facilityContacts={pickSection(sections, 'contact-page.facility-contacts-section')}
        eligibilityReminder={pickSection(sections, 'contact-page.eligibility-reminder-section')}
        funStats={pickSection(sections, 'contact-page.fun-stats-section')}
        enquiryForm={pickSection(sections, 'contact-page.enquiry-form-section')}
        submissionSuccess={pickSection(sections, 'contact-page.submission-success-section')}
        nextSteps={pickSection(sections, 'contact-page.next-steps-section')}
        downloadCta={pickSection(sections, 'contact-page.download-cta-section')}
      />
    </>
  );
}
