import type { Metadata } from 'next';
import ProjectsSections from '@/components/projects/ProjectsSections';
import { getProjectsSections } from '@/lib/cms/projects';
import { getFootprintData } from '@/lib/api/pue';
import { getPipelineTotals, buildStageOverride } from '@/lib/api/pipelineTotals';
import type { ProjectPipelineOverride } from '@/lib/api/pipelineTotals';
import { getBusinessModelTotals, buildBusinessModelTables } from '@/lib/api/businessModels';
import {
  PROJECTS_PIPELINE_TAB_DEFAULTS,
  PROJECTS_STRUCTURED_DATA_DEFAULTS,
} from '@/lib/cms/projects-defaults';
import { pickSection, withoutEmpty } from '@/lib/cms/content';
import { pickFootprintMapCopy } from '@/lib/cms/projects-content';

/** Merges the CMS structured-data section over the bundled defaults. */
async function getSeo() {
  const sections = await getProjectsSections();

  return {
    ...PROJECTS_STRUCTURED_DATA_DEFAULTS,
    ...withoutEmpty(pickSection(sections, 'projects-page.structured-data-section')),
  };
}

/**
 * `getProjectsSections` is `'use cache'`, so this second call costs nothing and —
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
    openGraph: { url: '/projects' },
    other: {
      'DC.title': seo.dcTitle,
      'DC.creator': seo.dcCreator,
      'DC.subject': seo.dcSubject,
      'DC.description': seo.dcDescription,
      'DC.publisher': seo.dcPublisher,
      'DC.language': seo.dcLanguage,
      'DC.coverage.spatial': seo.dcCoverageSpatial,
      'DC.type': seo.dcType,
    },
  };
}

export default async function ProjectsPage() {
  const sections = await getProjectsSections();
  const seo = await getSeo();
  const footprintData = await getFootprintData();

  // Project Pipeline is the unscoped totals call; Credit Approved Pipeline and
  // Closed Projects scope the same endpoint via `?DealStage=3`/`?DealStage=4`.
  // Each stage's capacity unit must match its bundled default ("MWp" vs plain
  // "MW") — see `buildStageOverride`'s doc comment.
  const [projectPipeline, creditApproved, closed, businessModels] = await Promise.all([
    getPipelineTotals(),
    getPipelineTotals(3),
    getPipelineTotals(4),
    getBusinessModelTotals(),
  ]);

  const stageOverrides: Record<string, ProjectPipelineOverride> = {};
  if (projectPipeline.data) {
    stageOverrides['project-pipeline'] = buildStageOverride(projectPipeline.data, { capacityUnit: 'MWp' });
  }
  if (creditApproved.data) {
    stageOverrides['credit-approved'] = buildStageOverride(creditApproved.data, { capacityUnit: 'MW' });
  }
  if (closed.data) {
    stageOverrides['closed'] = buildStageOverride(closed.data, { capacityUnit: 'MWp' });
  }

  // Feeds the "Business Models" stage's table — both the Total Pipeline and
  // Mandated Deals tabs come from this one call.
  const businessModelTables = businessModels.data ? buildBusinessModelTables(businessModels.data) : null;

  // Live-vs-fallback status (with reason, when it fell back) for the browser
  // console — see ProjectsSections' apiDebug log.
  const apiDebug: Record<string, { status: 'live' | 'fallback'; reason?: string }> = {
    footprint: footprintData.source === 'live' ? { status: 'live' } : { status: 'fallback', reason: footprintData.reason },
    projectPipeline: projectPipeline.data ? { status: 'live' } : { status: 'fallback', reason: projectPipeline.reason },
    creditApproved: creditApproved.data ? { status: 'live' } : { status: 'fallback', reason: creditApproved.reason },
    closed: closed.data ? { status: 'live' } : { status: 'fallback', reason: closed.reason },
    businessModels: businessModels.data ? { status: 'live' } : { status: 'fallback', reason: businessModels.reason },
  };

  const pipelineTab = pickSection(sections, 'projects-page.pipeline-tab-section');

  // The ItemList is built from whichever project set actually renders, so the
  // structured data never describes projects the page is not showing.
  const projects = pipelineTab?.projects?.length
    ? pipelineTab.projects
    : PROJECTS_PIPELINE_TAB_DEFAULTS.projects;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': seo.jsonLdType,
    name: seo.jsonLdName,
    description: seo.jsonLdDescription,
    url: seo.jsonLdUrl,
    about: {
      '@type': 'Organization',
      name: seo.jsonLdPublisherName,
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: projects.map((p, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        item: {
          '@type': 'Project',
          name: p.title,
          description: p.desc,
          location: p.location,
          category: p.category,
          status: p.status,
        },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProjectsSections
        hero={pickSection(sections, 'projects-page.hero-section')}
        portfolioTabs={pickSection(sections, 'projects-page.portfolio-tabs-section')}
        analysisTab={pickSection(sections, 'projects-page.analysis-tab-section')}
        pipelineTab={pipelineTab}
        pipelineConsole={pickSection(sections, 'projects-page.pipeline-console-section')}
        eligibilityCta={pickSection(sections, 'projects-page.eligibility-cta-section')}
        footprintMap={pickFootprintMapCopy(
          pickSection(sections, 'projects-page.footprint-map-section')
        )}
        lgaModal={pickSection(sections, 'projects-page.lga-modal-section')}
        nextSteps={pickSection(sections, 'projects-page.next-steps-section')}
        footprintData={footprintData}
        stageOverrides={stageOverrides}
        totalSectorPipeline={businessModelTables?.totalPipelineRows}
        mandatedDeals={businessModelTables?.mandatedDealRows}
        businessModelFooter={businessModelTables?.footer}
        apiDebug={apiDebug}
      />
    </>
  );
}
