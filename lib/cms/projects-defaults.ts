/**
 * Bundled fallback copy for the Projects page.
 *
 * Every section merges CMS data over these with
 * `{ ...DEFAULTS, ...withoutEmpty(data) }`, so an unreachable CMS — or a single
 * field an editor blanked — degrades to the copy the page shipped with rather
 * than to nothing.
 *
 * The text matches `cms/src/seed/projects-page-copy.ts`, which is what pre-fills
 * Strapi on a fresh boot. That file cannot be imported from here (separate
 * package), so the copy is duplicated; keep the two in step when editing.
 *
 * Colours are deliberately absent. Map fills, legend swatches and SDG chip
 * colours all live in `lib/mapData.ts` and the page's `SDG_INFO`, and are never
 * sourced from here or from the CMS — the seed's legend hexes (`#48C0A3`…) and
 * the ones the map actually renders (`#c8e6c9`…) are different values, and
 * crossing them would silently recolour the key.
 */

import { SITE_URL } from '@/lib/site-config';
import type {
  ProjectsAnalysisTabSection,
  ProjectsContent,
  ProjectsEligibilityCtaSection,
  ProjectsFootprintMapCopy,
  ProjectsHeroSection,
  ProjectsLgaModalSection,
  ProjectsNextStepsSection,
  ProjectsPipelineConsoleSection,
  ProjectsPipelineTabSection,
  ProjectsPortfolioTabsSection,
  ProjectsStructuredDataSection,
} from './projects-types';

const META_DESCRIPTION =
  'Browse our catalog of local currency de-risked clean energy projects in Nigeria.';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=1200&auto=format&fit=crop';
const SOLAR_IMAGE =
  'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop';
const AGRO_IMAGE =
  'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop';
const TELECOM_IMAGE =
  'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=800&auto=format&fit=crop';
const ACOB_IMAGE =
  'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=800&auto=format&fit=crop';

/** PipelineConsole.tsx — decorative column backdrops under a colour wash. */
const CONSOLE_LEFT_IMAGE =
  'https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=1200&auto=format&fit=crop';
const CONSOLE_RIGHT_IMAGE =
  'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=1200&auto=format&fit=crop';

/** PipelineConsole.tsx SDG_METADATA bgImage, keyed by SDG number. */
const SDG_IMAGES: Record<number, string> = {
  7: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=400&auto=format&fit=crop',
  // Replaces photo-1521791136368, which Unsplash removed (HTTP 404).
  8: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=400&auto=format&fit=crop',
  9: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=400&auto=format&fit=crop',
  11: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=400&auto=format&fit=crop',
  13: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=400&auto=format&fit=crop',
  17: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=400&auto=format&fit=crop',
};

/** Hotspot Network telecom footprint — identical across its 22 states. */
const hotspotState = (stateMapId: string) => ({
  stateMapId,
  projectName: 'Hotspot Network',
  capacity: '15kW (Site Average)',
  funding: '₦43.4m (Site Share)',
  sdgs: '9, 13',
  category: 'Telecoms',
  status: 'Operational',
});

/* ----------------------------------------------------- structured data */

export const PROJECTS_STRUCTURED_DATA_DEFAULTS: ProjectsContent<ProjectsStructuredDataSection> = {
  pageTitle: 'Projects & portfolio footprint | CFBF',
  metaDescription: META_DESCRIPTION,
  dcTitle: 'Projects portfolio - climate finance blending facility',
  dcCreator: 'NoLimitBuzz',
  dcSubject: 'Solar Grid, Telecoms Solarization, Agro-Processing, Green Bonds',
  dcDescription: 'Directory of active clean energy infrastructure projects in Nigeria.',
  dcPublisher: 'Climate Finance Blending Facility',
  dcLanguage: 'en',
  dcCoverageSpatial: 'Nigeria',
  dcType: 'Collection of Case Studies',
  jsonLdType: 'CollectionPage',
  jsonLdName: 'Projects Portfolio | Climate Finance Blending Facility',
  jsonLdDescription:
    'Directory of active clean energy infrastructure projects de-risked and co-financed by the Climate Finance Blending Facility in Nigeria.',
  jsonLdUrl: `${SITE_URL}/projects`,
  jsonLdPublisherName: 'Climate Finance Blending Facility (CFBF)',
};

/* ------------------------------------------------------------- hero */

export const PROJECTS_HERO_DEFAULTS: ProjectsContent<ProjectsHeroSection> = {
  breadcrumbLabel: 'projects',
  eyebrow: 'Proven results',
  headingPartOne: 'Portfolio ',
  headingHighlight: 'performance',
  description:
    'The Climate Finance Blending Facility (CFBF) deploys strategic first-loss co-financing to de-risk private commercial capital, mobilizing local funding to power clean energy and create sustainable jobs.',
  backgroundImage: HERO_IMAGE,
  backgroundImage_alt_text: 'Hero banner',
  stats: [
    {
      label: 'Capacity installed',
      value: '4.02',
      unit: 'MW',
      description: 'installed green capacity de-risked by first-loss co-financing.',
      sdgBadge: 'SDG 7',
    },
    {
      label: 'Emissions avoided',
      value: '7,500+',
      unit: 'tCO₂e',
      description: 'tonnes of carbon emissions mitigated annually across our portfolio.',
      sdgBadge: 'SDG 13',
    },
    {
      label: 'Job creation',
      value: '5,780+',
      unit: '',
      description: 'sustainable jobs facilitated in local communities.',
      sdgBadge: 'SDG 8',
    },
    {
      label: 'Connections powered',
      value: '39,438',
      unit: '',
      description: 'projected household and SME connections powered across Nigeria.',
      sdgBadge: 'SDG 7',
    },
    {
      label: 'Capital deployed',
      value: '₦7.86B+',
      unit: '',
      description:
        'mobilized from institutional investors and pension funds into the real economy.',
      sdgBadge: 'SDG 9',
    },
  ],
};

/* --------------------------------------------------- portfolio tabs */

export const PROJECTS_PORTFOLIO_TABS_DEFAULTS: ProjectsContent<ProjectsPortfolioTabsSection> = {
  eyebrow: 'Portfolio',
  headingPartOne: 'Our footprint ',
  headingHighlight: 'in Nigeria',
  body: 'Collectively, renewable energy projects located in 36 states across the six geo-political zones in Nigeria have been approved for co-financing by the Facility.',
  tabs: [
    { label: 'Project Pipeline' },
    { label: 'Project Analysis' },
    { label: 'National Footprint' },
  ],
};

/* ---------------------------------------------------- analysis tab */

export const PROJECTS_ANALYSIS_TAB_DEFAULTS: ProjectsContent<ProjectsAnalysisTabSection> = {
  tableHeading: 'Portfolio Transactions Performance',
  downloadLabel: 'Download Impact Report',
  downloadHref: '/download.pdf',
  totalsRowLabel: 'Total Portfolio',
  totalsConnectionsSuffix: '+ 120 Sites',
  capacityUnit: 'kW',
  ghgUnit: 't/yr',
  statusOperationalLabel: 'Operational',
  statusUnderConstructionLabel: 'Under Construction',
  statBoxes: [
    {
      label: 'Capacity installed',
      value: '4.02',
      unit: 'MW',
      description: 'installed clean generating capacity co-financed.',
    },
    {
      label: 'Emissions avoided',
      value: '7,500+',
      unit: 'tCO₂e',
      description: 'tonnes of annual carbon emissions mitigated.',
    },
    {
      label: 'Jobs created',
      value: '5,780+',
      unit: '',
      description: 'sustainable employment opportunities facilitated.',
    },
    {
      label: 'Connections powered',
      value: '39,438',
      unit: '',
      description: 'projected household and SME connections powered.',
    },
  ],
  columnHeads: [
    { label: 'Project Name' },
    { label: 'Capacity' },
    { label: 'Capital Mobilised' },
    { label: 'Connections' },
    { label: 'Jobs Created' },
    { label: 'GHG Reduced' },
    { label: 'Status' },
  ],
};

/* ---------------------------------------------------- pipeline tab */

export const PROJECTS_PIPELINE_TAB_DEFAULTS: ProjectsContent<ProjectsPipelineTabSection> = {
  filterBannerPrefix: 'Filtering by region:',
  stateSuffix: 'State',
  clearFilterLabel: 'Clear State Filter',
  projectIdPrefix: '/ ',
  challengeLabel: 'Challenge & solution',
  financialCloseLabel: 'Financial close:',
  privateCapitalLabel: 'Private capital:',
  sdgGoalsLabel: 'Aligned SDG goals',
  detailsLinkLabel: 'Explore Project Details',
  categories: [
    { label: 'All' },
    { label: 'Solar Grid' },
    { label: 'Telecoms' },
    { label: 'Agro-Processing' },
  ],
  projects: [
    {
      projectId: '01',
      title: 'First Electric Power and Automation Services',
      location: 'Gombe, Nasarawa & Ondo States',
      year: '2025',
      capital: '₦1.70b',
      capacity: '725KW',
      category: 'Solar Grid',
      connections: '5,156',
      jobs: '616',
      ghg: '762 Tonnes',
      status: 'Under Construction',
      image: SOLAR_IMAGE,
      image_alt_text: 'First Electric Nigeria Limited',
      desc: 'Mesh grid networks connecting rural households and SMEs across three states.',
      problem:
        'Lack of grid access in agricultural communities leading to low economic productivity.',
      solution:
        'Construction of 725kWp total capacity mesh grid electricity networks in 20 communities.',
      impact:
        'Connecting 5,156 households and creating over 616 local construction and operational jobs.',
      sdgs: '7, 13',
    },
    {
      projectId: '02',
      title: 'CEESOLAR Energy Limited',
      location: 'Cross River State',
      year: '2025',
      capital: '₦1.70b',
      capacity: '760KW',
      category: 'Solar Grid',
      connections: '3,597',
      jobs: '561',
      ghg: '737 Tonnes',
      status: 'Under Construction',
      image: SOLAR_IMAGE,
      image_alt_text: 'CEESOLAR Energy Limited',
      desc: 'Green Finance for Off-Grid Rural Electrification in four communities.',
      problem:
        'Lack of grid infrastructure in remote areas of Cross River, relying heavily on wood fuel and generators.',
      solution: 'Installation of 760kWp solar-hybrid mini-grids with high-capacity storage.',
      impact:
        'Powering households, small retailers, and agricultural processors; reducing GHG by 737 tonnes per year.',
      sdgs: '7, 13',
    },
    {
      projectId: '03',
      title: 'Prado Power Energy Limited',
      location: 'Akwa-Ibom & Benue States',
      year: '2024',
      capital: '₦1.95b',
      capacity: '850kW',
      category: 'Agro-Processing',
      connections: '15,801',
      jobs: '740',
      ghg: '893 Tonnes',
      status: 'Under Construction',
      image: AGRO_IMAGE,
      image_alt_text: 'Prado Power Energy Limited',
      desc: 'Solar hybrid mini-grids powering agricultural value chain hubs.',
      problem:
        'Post-harvest agricultural losses and lack of cold storage for rural farming cooperatives.',
      solution:
        '850kWp total capacity solar hybrid grids connecting farms, processing plants, and residential clusters.',
      impact:
        'De-risking local food supply chains, connecting 15,801 households, and creating 740 productive jobs.',
      sdgs: '7, 8, 9',
    },
    {
      projectId: '04',
      title: 'Hotspot Network Limited',
      location: '22 States in Nigeria',
      year: '2023',
      capital: '₦955m',
      capacity: '324kW',
      category: 'Telecoms',
      connections: '120 Sites',
      jobs: '720',
      ghg: '8.34 Tonnes',
      status: 'Operational',
      image: TELECOM_IMAGE,
      image_alt_text: 'Hotspot Network Limited',
      desc: 'Green Finance for Sustainable Rural Telephony networks.',
      problem:
        'Off-grid telecommunication towers in rural communities rely on diesel generators, releasing heavy CO2.',
      solution: 'Solarization of 120 base stations across 22 states using highly efficient panels.',
      impact:
        'Providing continuous rural connectivity, saving carbon emissions, and creating 720 telecom support jobs.',
      sdgs: '9, 13',
    },
    {
      projectId: '05',
      title: 'Darway Coast Limited',
      location: 'Rivers & Abia States',
      year: '2022',
      capital: '₦800m',
      capacity: '526kW',
      category: 'Solar Grid',
      connections: '7,711',
      jobs: '2,296',
      ghg: '4,856 Tonnes',
      status: 'Operational',
      image: SOLAR_IMAGE,
      image_alt_text: 'Darway Coast Limited',
      desc: 'Isolated solar mini-grids for underserved southern communities.',
      problem:
        'Lack of clean, reliable energy for coastal fish drying and local enterprise in southern Riverine zones.',
      solution: '526kWp solar grids using prepaid smart meters and remote monitoring systems.',
      impact:
        'Powering 7,711 connections, replacing diesel gensets, and boosting local riverine commerce.',
      sdgs: '7, 13',
    },
    {
      projectId: '06',
      title: 'ACOB Lighting Technology Limited',
      location: 'Edo & Ondo States',
      year: '2023',
      capital: '₦755m',
      capacity: '335kW',
      category: 'Solar Grid',
      connections: '3,597',
      jobs: '868',
      ghg: '352 Tonnes',
      status: 'Operational',
      image: ACOB_IMAGE,
      image_alt_text: 'ACOB Lighting Technology Limited',
      desc: 'Off-grid rural electrification for agricultural hubs.',
      problem: 'Energy poverty in rural cocoa-farming communities with zero electricity access.',
      solution: '335kWp solar-hybrid installations with local commercial distribution networks.',
      impact:
        'De-risked electricity access for 3,597 cocoa farmers, saving 352 tonnes of carbon annually.',
      sdgs: '7, 8, 13',
    },
  ],
  sdgDefinitions: [
    { number: '7', name: 'Affordable & Clean Energy', image: '', image_alt_text: '' },
    { number: '8', name: 'Decent Work & Growth', image: '', image_alt_text: '' },
    { number: '9', name: 'Industry, Innovation & Infrastructure', image: '', image_alt_text: '' },
    { number: '13', name: 'Climate Action', image: '', image_alt_text: '' },
  ],
  stateProjects: [
    {
      stateMapId: 'gombe',
      projectName: 'First Electric',
      capacity: '240kW (Regional Share)',
      funding: '₦560m',
      sdgs: '7, 13',
      category: 'Solar Grid',
      status: 'Under Construction',
    },
    {
      stateMapId: 'nasarawa',
      projectName: 'First Electric',
      capacity: '240kW (Regional Share)',
      funding: '₦560m',
      sdgs: '7, 13',
      category: 'Solar Grid',
      status: 'Under Construction',
    },
    {
      stateMapId: 'edo',
      projectName: 'ACOB Lighting',
      capacity: '165kW (Regional Share)',
      funding: '₦370m',
      sdgs: '7, 8, 13',
      category: 'Solar Grid',
      status: 'Operational',
    },
    {
      stateMapId: 'ondo',
      projectName: 'First Electric',
      capacity: '245kW (Regional Share)',
      funding: '₦580m',
      sdgs: '7, 13',
      category: 'Solar Grid',
      status: 'Under Construction',
    },
    {
      stateMapId: 'ondo',
      projectName: 'ACOB Lighting',
      capacity: '170kW (Regional Share)',
      funding: '₦385m',
      sdgs: '7, 8, 13',
      category: 'Solar Grid',
      status: 'Operational',
    },
    {
      stateMapId: 'cross-river',
      projectName: 'CEESOLAR Energy',
      capacity: '760kW',
      funding: '₦1.70b',
      sdgs: '7, 13',
      category: 'Solar Grid',
      status: 'Under Construction',
    },
    {
      stateMapId: 'akwa-ibom',
      projectName: 'Prado Power',
      capacity: '425kW (Regional Share)',
      funding: '₦975m',
      sdgs: '7, 8, 9',
      category: 'Agro-Processing',
      status: 'Under Construction',
    },
    {
      stateMapId: 'benue',
      projectName: 'Prado Power',
      capacity: '425kW (Regional Share)',
      funding: '₦975m',
      sdgs: '7, 8, 9',
      category: 'Agro-Processing',
      status: 'Under Construction',
    },
    {
      stateMapId: 'rivers',
      projectName: 'Darway Coast',
      capacity: '263kW (Regional Share)',
      funding: '₦400m',
      sdgs: '7, 13',
      category: 'Solar Grid',
      status: 'Operational',
    },
    {
      stateMapId: 'abia',
      projectName: 'Darway Coast',
      capacity: '263kW (Regional Share)',
      funding: '₦400m',
      sdgs: '7, 13',
      category: 'Solar Grid',
      status: 'Operational',
    },
    hotspotState('kaduna'),
    hotspotState('kano'),
    hotspotState('oyo'),
    hotspotState('bauchi'),
    hotspotState('katsina'),
    hotspotState('jigawa'),
    hotspotState('sokoto'),
    hotspotState('zamfara'),
    hotspotState('kebbi'),
    hotspotState('kogi'),
    hotspotState('kwara'),
    hotspotState('taraba'),
    hotspotState('adamawa'),
    hotspotState('borno'),
    hotspotState('yobe'),
    hotspotState('plateau'),
    hotspotState('niger'),
    hotspotState('ekiti'),
    hotspotState('osun'),
    hotspotState('ogun'),
    hotspotState('lagos'),
    hotspotState('fct'),
  ],
};

/* ------------------------------------------------ pipeline console */

export const PROJECTS_PIPELINE_CONSOLE_DEFAULTS: ProjectsContent<ProjectsPipelineConsoleSection> = {
  eyebrow: 'Consolidated Dealflow',
  headingPartOne: 'Facility Pipeline ',
  headingHighlight: 'Status',
  body: 'Browse live consolidated aggregates of our clean energy pipelines, mandated capital transactions, and forecasted developmental impact numbers de-risked by our concessional guarantee structures.',
  selectStageLabel: 'Select Pipeline Stage',
  usdUnitLabel: 'm USD',
  sdgFrameworksLabel: 'Aligned UN SDG Frameworks',
  toggleTotalLabel: 'Total Pipeline',
  toggleMandatedLabel: 'Mandated Deals',
  metricsHeader: '/ EXPECTED IMPACT METRICS',
  businessModelsHeader: '/ BUSINESS MODELS DISTRIBUTION',
  metricsSubcopy:
    'Forecasted socio-economic and environmental outputs expected from the active pipeline deals de-risked by our concessional guarantee structures.',
  businessModelsSubcopy:
    'Distribution of blended finance transactions categorized by developer business models mandated by the facility.',
  tableHeadSector: 'DRE Business Model',
  tableHeadProjects: 'Projects',
  tableHeadPipelineNgn: "Pipeline (NGN'B)",
  tableHeadMandatedNgn: "Mandated (NGN'B)",
  tableHeadDealSize: 'Deal Size (%)',
  footerLabel: 'Total Portfolio',
  footerProjects: '71',
  footerTotalPipeline: '948.20',
  footerTotalMandated: '294.28',
  footerPercent: '100%',
  businessModelsMandatedUsd: '213.2',
  businessModelsMandatedNgn: '294.28B NGN EQUIV',
  leftBackgroundImage: CONSOLE_LEFT_IMAGE,
  leftBackgroundImage_alt_text: '',
  rightBackgroundImage: CONSOLE_RIGHT_IMAGE,
  rightBackgroundImage_alt_text: '',
  metricLabels: [
    {
      label: 'Projected Connections',
      unit: '',
      description: 'projected household and SME connections powered.',
    },
    {
      label: 'Projected Capacity',
      unit: '',
      description: 'installed clean generating capacity co-financed.',
    },
    { label: 'Communities', unit: '', description: 'underserved administrative areas connected.' },
    {
      label: 'Jobs to be Created',
      unit: '',
      description: 'sustainable employment opportunities facilitated.',
    },
    {
      label: 'GHG Emissions Reduced',
      unit: 'tCO₂e/yr',
      description: 'tonnes of annual carbon emissions mitigated.',
    },
    {
      label: 'Private Capital Mobilised',
      unit: '',
      description: 'local private currency co-investment mobilized.',
    },
  ],
  stages: [
    {
      stageId: 'business-models',
      label: 'Business Models',
      title: 'BUSINESS MODELS',
      usdVal: '687.3',
      ngnVal: '948.20B NGN EQUIV',
      desc: 'Blended finance pipeline sector distribution categorized by clean energy off-grid developer business models de-risked and mandated by the Facility.',
      sdgs: '7, 8, 9, 11, 13, 17',
      metrics: {
        connections: '',
        connectionsLabel: '',
        capacity: '',
        communities: '',
        communitiesLabel: '',
        jobs: '',
        ghg: '',
        capital: '',
        capitalSub: '',
      },
    },
    {
      stageId: 'project-pipeline',
      label: 'Project Pipeline',
      title: 'PROJECT PIPELINE',
      usdVal: '687.3',
      ngnVal: '948.20B NGN EQUIV',
      desc: 'The 72 Projects Pipeline reports on expected energy access connections, clean generating capacity, employment opportunities, and carbon mitigation aligned to UN Sustainable Development Goals (SDGs).',
      sdgs: '7, 8, 9, 11, 13, 17',
      metrics: {
        connections: '731,083',
        connectionsLabel: '',
        capacity: '166.09 MWp',
        communities: '5,287',
        communitiesLabel: '',
        jobs: '162,600.5',
        ghg: '314,681.09',
        capital: '₦46.46B',
        capitalSub: 'USD 33.7 Mln',
      },
    },
    {
      stageId: 'credit-approved',
      label: 'Credit Approved Pipeline',
      title: 'CREDIT APPROVED PIPELINE',
      usdVal: '38.8',
      ngnVal: '53.55B NGN EQUIV',
      desc: 'The 14 Credit Approved Pipeline Projects have passed final facility guarantees and credit criteria, gearing up for commercial close and local capital drawdown.',
      sdgs: '7, 8, 9, 11, 13, 17',
      metrics: {
        connections: '79,786',
        connectionsLabel: '',
        capacity: '22.50 MW',
        communities: '62',
        communitiesLabel: '',
        jobs: '20,035',
        ghg: '81,366.00',
        capital: '₦9.6B',
        capitalSub: 'USD 7.0 Mln',
      },
    },
    {
      stageId: 'closed',
      label: 'Closed Projects',
      title: 'CLOSED PROJECTS',
      usdVal: '17.7',
      ngnVal: '24.36B NGN EQUIV',
      desc: 'The 4 Closed Projects have successfully achieved financial close, fully drawn local pension-backed funds, and are active in construction or operations.',
      sdgs: '7, 8, 9, 11, 13, 17',
      metrics: {
        connections: '51,131',
        connectionsLabel: '',
        capacity: '7.49 MWp',
        communities: '169',
        communitiesLabel: '',
        jobs: '18,699',
        ghg: '12,510.90',
        capital: '₦11.4B',
        capitalSub: 'USD 8.3 Mln',
      },
    },
    {
      stageId: 'urban-pipeline',
      label: 'Urban Pipeline Projects',
      title: 'URBAN PIPELINE PROJECTS',
      usdVal: '54.6',
      ngnVal: '84.40B NGN EQUIV',
      desc: 'The 7 Urban Pipeline Projects address energy reliability in municipalities, focusing on commercial utility scaling and private capital integration.',
      sdgs: '7, 8, 9, 11, 13, 17',
      metrics: {
        connections: '3,350',
        connectionsLabel: '',
        capacity: '27.68 MW',
        communities: '0',
        communitiesLabel: 'Communities Impacted',
        jobs: '1,820',
        ghg: '251.89',
        capital: '₦0.0B',
        capitalSub: 'USD 0.0 Mln',
      },
    },
    {
      stageId: 'urban-credit-approved',
      label: 'Urban Credit Approved Pipeline',
      title: 'URBAN CREDIT APPROVED',
      usdVal: '5.95',
      ngnVal: '3.80B NGN EQUIV',
      desc: 'The 2 Urban Credit Approved Projects focus on commercial microgrid integrations within dense population hubs and local government area clusters.',
      sdgs: '7, 8, 9, 11, 13, 17',
      metrics: {
        connections: '1,213',
        connectionsLabel: 'Households & Businesses',
        capacity: '9.90 MW',
        communities: '12',
        communitiesLabel: 'Local Gov Areas',
        jobs: '1,115',
        ghg: '90.09',
        capital: '₦0.0B',
        capitalSub: 'USD 0.0 Mln',
      },
    },
  ],
  sdgFrameworks: [
    {
      number: '7',
      name: 'Affordable & Clean Energy',
      image: SDG_IMAGES[7],
      image_alt_text: 'Affordable & Clean Energy',
    },
    {
      number: '8',
      name: 'Decent Work & Growth',
      image: SDG_IMAGES[8],
      image_alt_text: 'Decent Work & Growth',
    },
    {
      number: '9',
      name: 'Industry & Infrastructure',
      image: SDG_IMAGES[9],
      image_alt_text: 'Industry & Infrastructure',
    },
    {
      number: '11',
      name: 'Sustainable Cities',
      image: SDG_IMAGES[11],
      image_alt_text: 'Sustainable Cities',
    },
    { number: '13', name: 'Climate Action', image: SDG_IMAGES[13], image_alt_text: 'Climate Action' },
    {
      number: '17',
      name: 'Partnerships for Goals',
      image: SDG_IMAGES[17],
      image_alt_text: 'Partnerships for Goals',
    },
  ],
  totalPipelineRows: [
    { sector: 'Isolated Mini-Grid', projectsCount: 37, valueNgn: 381.16, percentage: '40.20%' },
    { sector: 'Interconnected Mini-Grid', projectsCount: 5, valueNgn: 32.77, percentage: '3.46%' },
    { sector: 'Mesh Grid', projectsCount: 3, valueNgn: 59.27, percentage: '6.25%' },
    {
      sector: 'Commercial & Industrial (C & I)',
      projectsCount: 13,
      valueNgn: 298.85,
      percentage: '31.52%',
    },
    { sector: 'SaaS for Home and Business', projectsCount: 2, valueNgn: 28.6, percentage: '3.02%' },
    { sector: 'Productive Use EaaS', projectsCount: 1, valueNgn: 1.36, percentage: '0.14%' },
    { sector: 'Battery as a Service', projectsCount: 0, valueNgn: 0, percentage: '0.00%' },
    { sector: 'Stand Alone Systems (SAS)', projectsCount: 0, valueNgn: 0, percentage: '0.00%' },
    { sector: 'SaaS for Telecom Towers', projectsCount: 4, valueNgn: 85.04, percentage: '8.97%' },
    { sector: 'E-mobility (2W & 3W)', projectsCount: 6, valueNgn: 61.15, percentage: '6.45%' },
  ],
  mandatedDealRows: [
    { sector: 'Isolated Mini-Grid', projectsCount: 37, valueNgn: 91.39, percentage: '31.06%' },
    { sector: 'Interconnected Mini-Grid', projectsCount: 5, valueNgn: 28.21, percentage: '9.59%' },
    { sector: 'Mesh Grid', projectsCount: 3, valueNgn: 16.27, percentage: '5.53%' },
    {
      sector: 'Commercial & Industrial (C & I)',
      projectsCount: 13,
      valueNgn: 107.95,
      percentage: '36.68%',
    },
    { sector: 'SaaS for Home and Business', projectsCount: 2, valueNgn: 1.0, percentage: '0.34%' },
    { sector: 'Productive Use EaaS', projectsCount: 1, valueNgn: 1.36, percentage: '0.46%' },
    { sector: 'Battery as a Service', projectsCount: 0, valueNgn: 0, percentage: '0.00%' },
    { sector: 'Stand Alone Systems (SAS)', projectsCount: 0, valueNgn: 0, percentage: '0.00%' },
    { sector: 'E-mobility (2W & 3W)', projectsCount: 6, valueNgn: 13.06, percentage: '4.44%' },
  ],
};

/* ---------------------------------------------------- eligibility */

export const PROJECTS_ELIGIBILITY_CTA_DEFAULTS: ProjectsContent<ProjectsEligibilityCtaSection> = {
  eyebrow: 'Funding intake',
  headingPartOne: 'Do you have a ',
  headingHighlight: 'clean energy project',
  headingPartTwo: '?',
  body: "Verify your project's compliance against our eligibility checklist, estimate your qualifying scores, and start the blended finance pre-qualification application.",
  ctaLabel: 'Check project eligibility',
  ctaHref: '/eligibility',
  backgroundImage:
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1200&auto=format&fit=crop',
  backgroundImage_alt_text: 'Clean energy installation background',
};

/* -------------------------------------------------- footprint map */

/**
 * Labels only.
 *
 * `mapSvg`, `legend`, `states` and `lgaProjects` are deliberately absent from
 * `ProjectsFootprintMapCopy`: the map's geometry, its state/LGA data and every
 * colour it paints come from `lib/mapData.ts` and `@svg-maps/nigeria`, so the
 * rendered map is identical to the pre-CMS one.
 */
export const PROJECTS_FOOTPRINT_MAP_DEFAULTS: Omit<ProjectsFootprintMapCopy, 'id'> = {
  eyebrow: 'National Footprint',
  headingPartOne: 'Geographical ',
  headingHighlight: 'Distribution',
  body: 'Off-grid renewable energy and rural telephony projects located across the six geo-political zones in Nigeria, approved for co-financing by the Facility.',
  statesStatLabel: 'States',
  communitiesStatLabel: 'Communities',
  statesColumnLabel: 'States',
  searchPlaceholder: 'Search states…',
  mapLabel: 'Interactive Map',
  mapHint: 'Click a state',
  lgaPanelSuffix: "State (LGA's)",
  lgaEmptyMessage: 'No LGA data found for this state.',
  clearSelectionLabel: 'Clear Selection',
  placeholderTitle: 'Select a State',
  placeholderBody:
    'Click a state from the list or on the map to view its Local Government Areas.',
};

/* ------------------------------------------------------- LGA modal */

export const PROJECTS_LGA_MODAL_DEFAULTS: ProjectsContent<ProjectsLgaModalSection> = {
  subtitlePrefix: 'Project Data',
  subtitleStateSuffix: 'State',
  statLabelDevelopers: 'Developers',
  statLabelCommunities: 'Communities',
  statLabelPuePotential: 'PUE Potential',
  emptyTitle: 'No project data available for this LGA yet.',
  emptyBody: 'Data will populate once connected to the CFBF data API.',
  sourceLabel: 'Source: CFBF Geographical Distribution Data',
  closeLabel: 'Close',
  fallbackIcon: '🔌',
  columnHeads: [
    { label: 'Developer' },
    { label: 'Community' },
    { label: 'State' },
    { label: 'LGA' },
    { label: 'Project Type' },
    { label: 'PUE Potential' },
    { label: 'Enumerators' },
  ],
  projectTypeIcons: [
    { projectType: 'Solar Hybrid Mini-Grid', icon: '⚡' },
    { projectType: 'Isolated Minigrids', icon: '🔋' },
    { projectType: 'Solar as a Service for Telecom Towers', icon: '📡' },
    { projectType: 'Agro-Processing Solar Hub', icon: '🌾' },
    { projectType: 'Mini Grids - Markets', icon: '🏪' },
  ],
  heroImages: [
    {
      projectType: 'Solar as a Service for Telecom Towers',
      image:
        'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=1200&auto=format&fit=crop',
      image_alt_text: '',
    },
    {
      projectType: 'Agro-Processing Solar Hub',
      image:
        'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1200&auto=format&fit=crop',
      image_alt_text: '',
    },
    {
      projectType: 'default',
      image:
        'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1200&auto=format&fit=crop',
      image_alt_text: '',
    },
  ],
};

/* ------------------------------------------------------ next steps */

export const PROJECTS_NEXT_STEPS_DEFAULTS: ProjectsContent<ProjectsNextStepsSection> = {
  eyebrow: 'Next steps',
  headingPartOne: 'Explore the ',
  headingItalic: 'facility portal',
  links: [
    {
      eyebrow: 'About us',
      title: 'Who we are',
      description: 'Learn about our seed capital and mandates',
      href: '/about',
    },
    {
      eyebrow: 'Architecture',
      title: 'Learn how it works',
      description: 'Understand our blending process & structures',
      href: '/how-it-works',
    },
    {
      eyebrow: 'Impact',
      title: 'View our impact',
      description: 'Explore carbon targets and video stories',
      href: '/impact',
    },
  ],
};
