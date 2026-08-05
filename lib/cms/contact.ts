// Server-only: `next/cache` cannot be imported from a client component. Pure
// helpers that client components need live in `./content` instead.
import { cacheLife, cacheTag } from 'next/cache';
import { buildZoneQuery, fetchPageSections } from './fetchPage';
import type { ContactPageSection } from './contact-types';

export const CONTACT_CACHE_TAG = 'contact';

/** Components whose fields are all scalars — one populate level is enough. */
const SHALLOW_SECTIONS = [
  'contact-page.structured-data-section',
  'contact-page.facility-contacts-section',
  'contact-page.eligibility-reminder-section',
  'contact-page.submission-success-section',
  'contact-page.download-cta-section',
];

/**
 * Components with a component inside them.
 *
 * The plain `populate[sections][populate]=*` returns these sections' scalars but
 * drops the repeatables entirely. Listing a component here also means listing
 * *all* of its component fields, since naming one field replaces the implicit
 * "everything" — the enquiry form has four.
 */
const DEEP_SECTIONS = {
  'contact-page.hero-section': ['cards'],
  'contact-page.fun-stats-section': ['stats'],
  'contact-page.next-steps-section': ['links'],
  'contact-page.enquiry-form-section': [
    'roleTabs',
    'technologyOptions',
    'institutionOptions',
    'technologyParamMap',
  ],
};

const CONTACT_QUERY = buildZoneQuery(SHALLOW_SECTIONS, DEEP_SECTIONS);

/**
 * Fetches the Contact page dynamic zone.
 *
 * Never throws — a CMS outage returns an empty section list so every section
 * falls back to its bundled defaults rather than rendering a blank page.
 */
export async function getContactSections(): Promise<ContactPageSection[]> {
  'use cache';
  cacheLife('hours');
  cacheTag(CONTACT_CACHE_TAG);

  return fetchPageSections<ContactPageSection>('/api/contact', 'CONTACT PAGE', CONTACT_QUERY);
}
