import AssessmentClient from '@/components/eligibility/AssessmentClient';
import { getEligibilitySections } from '@/lib/cms/eligibility';
import { pickSection } from '@/lib/cms/content';

/**
 * The wizard's copy lives in the same `eligibility` single type as the page that
 * links to it, so this route shares the cached fetch and its revalidation tag.
 *
 * No metadata here on purpose: the structured-data section describes
 * `/eligibility`, and this sub-route has never carried its own.
 */
export default async function AssessmentPage() {
  const sections = await getEligibilitySections();

  return (
    <AssessmentClient
      chrome={pickSection(sections, 'eligibility-page.assessment-chrome-section')}
      steps={pickSection(sections, 'eligibility-page.assessment-steps-section')}
      result={pickSection(sections, 'eligibility-page.assessment-result-section')}
    />
  );
}
