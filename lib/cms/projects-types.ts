/**
 * Types for the Strapi `projects` single type.
 *
 * Shape verified against the deep-populate query built in `./projects.ts` and
 * the JSON schemas under `cms/src/components/projects-page/`.
 *
 * Notes:
 * - Media fields are plain URL strings (Cloudinary), not Strapi media objects.
 * - Every media field has a sibling `<field>_alt_text`.
 * - Names mirror the JSON schemas exactly. Where a component's field name
 *   differs from the prop the React component has always used, the mapping is
 *   done at the call site, not renamed here.
 * - Colours are deliberately absent from the props the page consumes: the map
 *   fills and legend swatches stay in `lib/mapData.ts`. `MapLegendItem.color`
 *   exists because the schema has it, but nothing may read it — see the note on
 *   `FootprintMapSection` below.
 */

/**
 * Fields present on every entry returned inside the dynamic zone.
 *
 * `id` is optional so the bundled fallback content in `./projects-defaults` can
 * reuse these types without inventing ids the CMS owns.
 */
interface ComponentBase {
  id?: number;
}

/* ----------------------------------------------------- structured data */

export interface ProjectsStructuredDataSection extends ComponentBase {
  __component: 'projects-page.structured-data-section';
  pageTitle: string;
  metaDescription: string;
  dcTitle: string;
  dcCreator: string;
  dcSubject: string;
  dcDescription: string;
  dcPublisher: string;
  dcLanguage: string;
  dcCoverageSpatial: string;
  dcType: string;
  jsonLdType: string;
  jsonLdName: string;
  jsonLdDescription: string;
  jsonLdUrl: string;
  jsonLdPublisherName: string;
}

/* ------------------------------------------------------------- hero */

export interface ProjectsHeroStat extends ComponentBase {
  label: string;
  value: string;
  unit: string;
  description: string;
  sdgBadge: string;
}

export interface ProjectsHeroSection extends ComponentBase {
  __component: 'projects-page.hero-section';
  breadcrumbLabel: string;
  eyebrow: string;
  /** The `<h1>` is split so each fragment keeps its own styling. */
  headingPartOne: string;
  headingHighlight: string;
  description: string;
  backgroundImage: string;
  backgroundImage_alt_text: string;
  stats: ProjectsHeroStat[];
}

/* --------------------------------------------------- portfolio tabs */

export interface ProjectsTabItem extends ComponentBase {
  label: string;
}

export interface ProjectsPortfolioTabsSection extends ComponentBase {
  __component: 'projects-page.portfolio-tabs-section';
  eyebrow: string;
  headingPartOne: string;
  headingHighlight: string;
  body: string;
  tabs: ProjectsTabItem[];
}

/* ---------------------------------------------------- analysis tab */

/** Shared by `analysis-tab-section.columnHeads` and `lga-modal-section`. */
export interface ProjectsLabelItem extends ComponentBase {
  label: string;
}

export interface ProjectsStatBoxItem extends ComponentBase {
  label: string;
  value: string;
  unit: string;
  description: string;
}

export interface ProjectsAnalysisTabSection extends ComponentBase {
  __component: 'projects-page.analysis-tab-section';
  tableHeading: string;
  downloadLabel: string;
  downloadHref: string;
  totalsRowLabel: string;
  totalsConnectionsSuffix: string;
  capacityUnit: string;
  ghgUnit: string;
  statusOperationalLabel: string;
  statusUnderConstructionLabel: string;
  statBoxes: ProjectsStatBoxItem[];
  columnHeads: ProjectsLabelItem[];
}

/* ---------------------------------------------------- pipeline tab */

export interface ProjectsProjectItem extends ComponentBase {
  projectId: string;
  title: string;
  location: string;
  year: string;
  capital: string;
  capacity: string;
  category: string;
  connections: string;
  jobs: string;
  ghg: string;
  status: string;
  image: string;
  image_alt_text: string;
  desc: string;
  problem: string;
  solution: string;
  impact: string;
  /**
   * A delimited list, not an array — the schema stores this as a single string
   * (e.g. `'7, 13'`). Parse with `parseSdgs` in `./projects-content` rather than
   * the `getProjectSDGs` switch the page used to carry.
   */
  sdgs: string;
}

export interface ProjectsSdgItem extends ComponentBase {
  number: string;
  name: string;
  image: string;
  image_alt_text: string;
}

export interface ProjectsStateProjectItem extends ComponentBase {
  stateMapId: string;
  projectName: string;
  capacity: string;
  funding: string;
  sdgs: string;
  category: string;
  status: string;
}

export interface ProjectsPipelineTabSection extends ComponentBase {
  __component: 'projects-page.pipeline-tab-section';
  filterBannerPrefix: string;
  stateSuffix: string;
  clearFilterLabel: string;
  projectIdPrefix: string;
  challengeLabel: string;
  financialCloseLabel: string;
  privateCapitalLabel: string;
  sdgGoalsLabel: string;
  detailsLinkLabel: string;
  categories: ProjectsLabelItem[];
  projects: ProjectsProjectItem[];
  sdgDefinitions: ProjectsSdgItem[];
  stateProjects: ProjectsStateProjectItem[];
}

/* ------------------------------------------------ pipeline console */

export interface ProjectsMetricCardItem extends ComponentBase {
  label: string;
  unit: string;
  description: string;
}

export interface ProjectsPipelineStageMetrics extends ComponentBase {
  connections: string;
  connectionsLabel: string;
  capacity: string;
  communities: string;
  communitiesLabel: string;
  jobs: string;
  ghg: string;
  capital: string;
  capitalSub: string;
}

export interface ProjectsPipelineStageItem extends ComponentBase {
  stageId: string;
  label: string;
  title: string;
  usdVal: string;
  ngnVal: string;
  desc: string;
  sdgs: string;
  /** Non-repeatable component, so a single object rather than an array. */
  metrics: ProjectsPipelineStageMetrics;
}

export interface ProjectsSectorRowItem extends ComponentBase {
  sector: string;
  /** `integer` in the schema, so a number rather than a string. */
  projectsCount: number;
  /** `decimal` in the schema. */
  valueNgn: number;
  percentage: string;
}

export interface ProjectsPipelineConsoleSection extends ComponentBase {
  __component: 'projects-page.pipeline-console-section';
  eyebrow: string;
  headingPartOne: string;
  headingHighlight: string;
  body: string;
  selectStageLabel: string;
  usdUnitLabel: string;
  sdgFrameworksLabel: string;
  toggleTotalLabel: string;
  toggleMandatedLabel: string;
  metricsHeader: string;
  businessModelsHeader: string;
  metricsSubcopy: string;
  businessModelsSubcopy: string;
  tableHeadSector: string;
  tableHeadProjects: string;
  tableHeadPipelineNgn: string;
  tableHeadMandatedNgn: string;
  tableHeadDealSize: string;
  footerLabel: string;
  footerProjects: string;
  footerTotalPipeline: string;
  footerTotalMandated: string;
  footerPercent: string;
  businessModelsMandatedUsd: string;
  businessModelsMandatedNgn: string;
  leftBackgroundImage: string;
  leftBackgroundImage_alt_text: string;
  rightBackgroundImage: string;
  rightBackgroundImage_alt_text: string;
  metricLabels: ProjectsMetricCardItem[];
  stages: ProjectsPipelineStageItem[];
  sdgFrameworks: ProjectsSdgItem[];
  totalPipelineRows: ProjectsSectorRowItem[];
  mandatedDealRows: ProjectsSectorRowItem[];
}

/* ---------------------------------------------------- eligibility */

export interface ProjectsEligibilityCtaSection extends ComponentBase {
  __component: 'projects-page.eligibility-cta-section';
  eyebrow: string;
  headingPartOne: string;
  headingHighlight: string;
  headingPartTwo: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  backgroundImage: string;
  backgroundImage_alt_text: string;
}

/* -------------------------------------------------- footprint map */

/**
 * `color` is present because the schema carries it, but the page must not read
 * it: legend swatches come from `PROJECT_TYPE_LEGEND` and state fills from
 * `getProjectTypeColor`, both in `lib/mapData.ts`, and those two sets hold
 * deliberately different values. See `cms/seed-manifests/projects-page/
 * legend-colors-backup.json` for the last time they drifted.
 */
export interface ProjectsMapLegendItem extends ComponentBase {
  label: string;
  color: string;
  type: string;
}

export interface ProjectsLgaItem extends ComponentBase {
  name: string;
}

export interface ProjectsMapStateItem extends ComponentBase {
  mapId: string;
  name: string;
  hasProjects: boolean;
  projectType: string;
  lgas: ProjectsLgaItem[];
}

export interface ProjectsLgaProjectItem extends ComponentBase {
  developer: string;
  community: string;
  state: string;
  lga: string;
  projectType: string;
  puePotential: number;
  enumerators: number;
}

/**
 * Only the label fields are consumed today.
 *
 * `mapSvg`, `states` and `lgaProjects` are populated by the query and typed here
 * for completeness, but the map's geometry and data stay in `lib/mapData.ts` and
 * `@svg-maps/nigeria` so the rendered map is byte-identical to the pre-CMS one.
 */
export interface ProjectsFootprintMapSection extends ComponentBase {
  __component: 'projects-page.footprint-map-section';
  eyebrow: string;
  headingPartOne: string;
  headingHighlight: string;
  body: string;
  statesStatLabel: string;
  communitiesStatLabel: string;
  statesColumnLabel: string;
  searchPlaceholder: string;
  mapLabel: string;
  mapHint: string;
  lgaPanelSuffix: string;
  lgaEmptyMessage: string;
  clearSelectionLabel: string;
  placeholderTitle: string;
  placeholderBody: string;
  mapSvg: string;
  legend: ProjectsMapLegendItem[];
  states: ProjectsMapStateItem[];
  lgaProjects: ProjectsLgaProjectItem[];
}

/**
 * The subset of the footprint map section the page actually renders.
 *
 * Load-bearing: `mapSvg` alone is tens of kilobytes, and every byte of it would
 * otherwise be serialised into the client payload to be thrown away. Narrowing
 * on the server keeps it out of the bundle *and* makes reading a CMS colour a
 * type error rather than a silent recolour.
 */
export type ProjectsFootprintMapCopy = Omit<
  ProjectsFootprintMapSection,
  '__component' | 'mapSvg' | 'legend' | 'states' | 'lgaProjects'
>;

/* ------------------------------------------------------- LGA modal */

export interface ProjectsProjectTypeIconItem extends ComponentBase {
  projectType: string;
  icon: string;
}

export interface ProjectsLgaHeroImageItem extends ComponentBase {
  projectType: string;
  image: string;
  image_alt_text: string;
}

export interface ProjectsLgaModalSection extends ComponentBase {
  __component: 'projects-page.lga-modal-section';
  subtitlePrefix: string;
  subtitleStateSuffix: string;
  statLabelDevelopers: string;
  statLabelCommunities: string;
  statLabelPuePotential: string;
  emptyTitle: string;
  emptyBody: string;
  sourceLabel: string;
  closeLabel: string;
  fallbackIcon: string;
  columnHeads: ProjectsLabelItem[];
  projectTypeIcons: ProjectsProjectTypeIconItem[];
  heroImages: ProjectsLgaHeroImageItem[];
}

/* ------------------------------------------------------ next steps */

export interface ProjectsPortalLinkItem extends ComponentBase {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
}

export interface ProjectsNextStepsSection extends ComponentBase {
  __component: 'projects-page.next-steps-section';
  eyebrow: string;
  headingPartOne: string;
  headingItalic: string;
  links: ProjectsPortalLinkItem[];
}

/* ------------------------------------------------------------ zone */

/** Every component the `projects` dynamic zone can hold, in page order. */
export type ProjectsPageSection =
  | ProjectsStructuredDataSection
  | ProjectsHeroSection
  | ProjectsPortfolioTabsSection
  | ProjectsAnalysisTabSection
  | ProjectsPipelineTabSection
  | ProjectsPipelineConsoleSection
  | ProjectsEligibilityCtaSection
  | ProjectsFootprintMapSection
  | ProjectsLgaModalSection
  | ProjectsNextStepsSection;

/** Maps each `__component` string to its section interface. */
export type ProjectsSectionByComponent = {
  [S in ProjectsPageSection as S['__component']]: S;
};

/** A section's editable fields — what `./projects-defaults` supplies. */
export type ProjectsContent<S extends ProjectsPageSection> = Omit<S, 'id' | '__component'>;
