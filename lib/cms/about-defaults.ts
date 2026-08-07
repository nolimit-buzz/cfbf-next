/**
 * Bundled fallback copy for the About page.
 *
 * Every section merges CMS data over these with
 * `{ ...DEFAULTS, ...withoutEmpty(data) }`, so an unreachable CMS — or a single
 * field an editor blanked — degrades to the copy the page shipped with rather
 * than to nothing.
 *
 * The text matches `cms/src/seed/about-page-copy.ts`, which is what pre-fills
 * Strapi on a fresh boot. Media URLs deliberately do *not*: these are the URLs
 * the components used before the CMS existed, so the fallback render is the
 * page as it has always looked. The CMS serves Cloudinary copies of the same
 * assets.
 */

import type {
  AboutAudienceSection,
  AboutCapitalStackSection,
  AboutContent,
  AboutDownloadCtaSection,
  AboutEnergyMapSection,
  AboutFrameworkSection,
  AboutHeroSection,
  AboutMandateSection,
  AboutMarketSection,
  AboutMilestonesSection,
  AboutNextStepsSection,
  AboutPartnersSection,
  AboutStickyNavSection,
  AboutStructuredDataSection,
} from './about-types';

const META_DESCRIPTION =
  'Capitalised with USD 21.3M concessional funding by FCDO & BII to de-risk green investments and mobilise private capital in Nigeria.';

export const ABOUT_STRUCTURED_DATA_DEFAULTS: AboutContent<AboutStructuredDataSection> = {
  pageTitle: 'About the Climate Facility | CFBF',
  metaDescription: META_DESCRIPTION,
  dcTitle: 'About the Climate Facility | CFBF',
  dcCreator: 'NoLimitBuzz',
  dcSubject: 'Blended Finance, Climate Capital, Credit Enhancement, PFA Assets',
  dcDescription: META_DESCRIPTION,
  dcPublisher: 'Climate Finance Blending Facility',
  dcLanguage: 'en',
  dcType: 'About Profile Page',
  jsonLdType: 'WebPage',
  jsonLdName: 'About the Climate Facility | CFBF',
  jsonLdDescription: META_DESCRIPTION,
  jsonLdPublisherName: 'Climate Finance Blending Facility (CFBF)',
  loadingLabel: 'Loading about...',
};

export const ABOUT_HERO_DEFAULTS: AboutContent<AboutHeroSection> = {
  breadcrumbLabel: 'about',
  eyebrow: 'Who we are',
  headingPartOne: 'Mobilising ',
  headingHighlight: 'blended capital',
  headingPartTwo: " for Nigeria's ",
  headingItalic: 'green energy transition',
  bodyPartOne:
    'The Climate Finance Blending Facility (CFBF) is capitalised with seed funding by the UK Foreign, Commonwealth & Development Office (FCDO) and co-invested alongside British International Investment (BII).',
  bodyPartTwo:
    'Administered by InfraCredit, the facility deploys subordinated debt and AAA guarantees to elevate green assets to investment-grade profiles — unlocking domestic pension capital at institutional scale.',
  backgroundImage:
    'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=1600&auto=format&fit=crop',
  backgroundImage_alt_text: 'Hero banner',
  statImage:
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop',
  statImage_alt_text: 'Wind turbines',
  stats: [
    { cardNumber: '01', value: 'USD 21.3M', label: 'Concessional Capital', sub: 'FCDO & BII commitment' },
    { cardNumber: '02', value: 'USD 21.3M', label: 'Total Capital Committed', sub: 'to date' },
  ],
  sliderStats: [
    { value: '32', label: 'Active Pipeline States', sub: 'across all 6 geo-zones' },
    { value: '100%', label: 'Green Certified', sub: 'Climate Bonds Initiative' },
    { value: 'AAA', label: 'Credit Rating', sub: 'InfraCredit guarantee' },
  ],
};

export const ABOUT_STICKY_NAV_DEFAULTS: AboutContent<AboutStickyNavSection> = {
  links: [
    { sectionId: 'mandate', label: 'Mandate' },
    { sectionId: 'market', label: 'Market Thesis' },
    { sectionId: 'framework', label: 'Framework' },
    { sectionId: 'partners', label: 'Partners' },
    { sectionId: 'milestones', label: 'Milestones' },
    { sectionId: 'audience', label: 'Who We Serve' },
  ],
};

export const ABOUT_MANDATE_DEFAULTS: AboutContent<AboutMandateSection> = {
  eyebrow: 'About us',
  heading: 'On a mission to de-risk and mobilise green capital',
  body: 'CFBF structures capital investments by providing subordinated debt products and guarantees that elevate green assets to investment-grade profiles. This directly meets the strict compliance and safety guidelines of local pension funds and insurance providers.',
  mandateHeading: 'Our mandate',
  numbersLabel: 'The numbers',
  bentoVideo: '/videos/solar-panels.mp4',
  paragraphs: [
    {
      text: 'We deploy specialized concessional capital to cover the first-loss layers of high-impact energy access projects, converting higher-risk clean infrastructure ventures into viable, institutional-grade opportunities.',
    },
    {
      text: 'Every transaction we facilitate is fully certified under the Climate Bonds Initiative (CBI) standards, guaranteeing transparent carbon reductions and verifiable ESG metrics across all geo-political zones in Nigeria.',
    },
  ],
  numbers: [
    { value: 'USD 21.3M', label: 'Concessional Capital' },
    { value: 'USD 21.3M', label: 'Total Deployed Capital' },
    { value: '32', label: 'Active Pipeline States' },
    { value: 'AAA', label: 'Credit Enhancement Rating' },
  ],
  captions: [
    // The first caption sits over `bentoVideo`, so it carries no image of its own.
    { label: 'Community Empowerment', image: '', image_alt_text: '' },
    {
      label: 'Solar Installation',
      image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop',
      image_alt_text: 'Solar panels installer',
    },
    {
      label: 'Local Clean Power',
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop',
      image_alt_text: 'Rural shop solar powered business',
    },
  ],
};

export const ABOUT_MARKET_DEFAULTS: AboutContent<AboutMarketSection> = {
  eyebrow: '— Market opportunity',
  headingPrimary: 'Broadening the market through ',
  headingSecondary: 'inclusive growth',
  bodyOne:
    'In Nigeria, MSMEs contribute 48% of national GDP, account for 96% of businesses and 84% of employment. Despite this significant contribution, access to traditional financing is limited, short-term and expensive — with persisting infrastructure challenges that hinder sector growth.',
  bodyTwo:
    'We believe sustainable and inclusive finance, local capital markets, and blended finance can join forces to play an especially important role in enabling stable access to innovative finance for climate-smart infrastructure — from clean energy and better storage, to faster connectivity.',
  // The image-only bento tile has no matching `cards[]` entry, so it lives on
  // the section instead.
  bentoImage:
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
  bentoImage_alt_text: 'Modern office building representing commercial growth',
  cards: [
    {
      value: '48%',
      eyebrow: '',
      description: "SMEs contribution to Nigeria's GDP in the last five years",
      footer:
        'In Nigeria, MSMEs account for 96% of businesses and 84% of employment — despite limited access to capital.',
    },
    { value: '96%', eyebrow: 'PwC Survey', description: 'SMEs account for 96% of businesses in Nigeria', footer: '' },
    { value: '84%', eyebrow: '', description: "SMEs employ 84% of Nigeria's workforce", footer: '' },
    {
      value: '<11%',
      eyebrow: 'As of July 2021',
      description: 'Pension penetration in Nigeria — vast untapped capital pool',
      footer: '',
    },
    {
      value: '17.4m',
      eyebrow: 'Estimated number of SMEs in Nigeria',
      description: 'SMEs account for c.50% of industrial jobs and c.90% of the manufacturing sector',
      footer: '',
    },
    {
      value: '30%',
      eyebrow: '',
      description:
        'The Pension Industry has a strategic objective of covering 30% of the working population under the Contributory Pension Scheme by 2024.',
      footer: '',
    },
  ],
};

export const ABOUT_ENERGY_MAP_DEFAULTS: AboutContent<AboutEnergyMapSection> = {
  eyebrow: 'Nigeria Market Analysis',
  headingPrimary: 'The Nigeria Energy Access ',
  headingSecondary: 'Funding Gap',
  body: 'Mini-grids and stand-alone solar are the least-cost technology for 70M+ Nigerians. Select a technology category to see projected connections, funding needs, and state-level distribution.',
  colHeaderRank: '#',
  colHeaderState: 'State',
  colHeaderConnections: 'Connections',
  colHeaderGap: 'Gap',
  sourceNote: 'Source: Nigeria REA / SEforAll estimates, 2022. Top 15 states by technology need shown.',
  tooltipConnectionsLabel: 'Connections',
  tooltipFundingGapLabel: 'Funding Gap',
  tooltipUnservedLabel: '% Unserved',
  tooltipNeedIndexLabel: 'Need index',
  legendLabel: 'Need intensity',
  legendScaleLabel: 'Low → High',
  // Geometry comes from `@svg-maps/nigeria`; this field is never read.
  mapSvg: '',
  tabs: [
    { tabId: 'grid', label: 'Grid Extension' },
    { tabId: 'mini-grid', label: 'Mini-grid' },
    { tabId: 'standalone', label: 'Stand-alone Solar' },
  ],
  // Estimated from Nigeria REA / SEforAll 2022 reports.
  states: [
    { mapId: 'kano', name: 'Kano', connections: '142,000', fundingGap: '₦18.4B', unservedPct: 58, grid: 0.85, miniGrid: 0.45, standalone: 0.30 },
    { mapId: 'lagos', name: 'Lagos', connections: '210,000', fundingGap: '₦27.1B', unservedPct: 22, grid: 0.90, miniGrid: 0.20, standalone: 0.15 },
    { mapId: 'kaduna', name: 'Kaduna', connections: '98,000', fundingGap: '₦12.6B', unservedPct: 64, grid: 0.70, miniGrid: 0.55, standalone: 0.40 },
    { mapId: 'oyo', name: 'Oyo', connections: '76,000', fundingGap: '₦9.8B', unservedPct: 52, grid: 0.60, miniGrid: 0.50, standalone: 0.35 },
    { mapId: 'rivers', name: 'Rivers', connections: '54,000', fundingGap: '₦7.0B', unservedPct: 38, grid: 0.55, miniGrid: 0.35, standalone: 0.25 },
    { mapId: 'borno', name: 'Borno', connections: '112,000', fundingGap: '₦14.5B', unservedPct: 82, grid: 0.30, miniGrid: 0.85, standalone: 0.80 },
    { mapId: 'niger', name: 'Niger', connections: '88,000', fundingGap: '₦11.4B', unservedPct: 74, grid: 0.35, miniGrid: 0.80, standalone: 0.75 },
    { mapId: 'bauchi', name: 'Bauchi', connections: '95,000', fundingGap: '₦12.3B', unservedPct: 79, grid: 0.28, miniGrid: 0.88, standalone: 0.82 },
    { mapId: 'sokoto', name: 'Sokoto', connections: '84,000', fundingGap: '₦10.9B', unservedPct: 81, grid: 0.25, miniGrid: 0.78, standalone: 0.90 },
    { mapId: 'zamfara', name: 'Zamfara', connections: '72,000', fundingGap: '₦9.3B', unservedPct: 83, grid: 0.22, miniGrid: 0.72, standalone: 0.92 },
    { mapId: 'kebbi', name: 'Kebbi', connections: '66,000', fundingGap: '₦8.6B', unservedPct: 78, grid: 0.24, miniGrid: 0.74, standalone: 0.88 },
    { mapId: 'jigawa', name: 'Jigawa', connections: '78,000', fundingGap: '₦10.1B', unservedPct: 77, grid: 0.26, miniGrid: 0.76, standalone: 0.86 },
    { mapId: 'katsina', name: 'Katsina', connections: '91,000', fundingGap: '₦11.8B', unservedPct: 75, grid: 0.30, miniGrid: 0.82, standalone: 0.85 },
    { mapId: 'adamawa', name: 'Adamawa', connections: '67,000', fundingGap: '₦8.7B', unservedPct: 70, grid: 0.32, miniGrid: 0.70, standalone: 0.78 },
    { mapId: 'taraba', name: 'Taraba', connections: '58,000', fundingGap: '₦7.5B', unservedPct: 72, grid: 0.30, miniGrid: 0.72, standalone: 0.80 },
    { mapId: 'yobe', name: 'Yobe', connections: '62,000', fundingGap: '₦8.1B', unservedPct: 80, grid: 0.28, miniGrid: 0.80, standalone: 0.84 },
    { mapId: 'gombe', name: 'Gombe', connections: '48,000', fundingGap: '₦6.2B', unservedPct: 68, grid: 0.40, miniGrid: 0.68, standalone: 0.72 },
    { mapId: 'plateau', name: 'Plateau', connections: '55,000', fundingGap: '₦7.1B', unservedPct: 65, grid: 0.42, miniGrid: 0.65, standalone: 0.60 },
    { mapId: 'benue', name: 'Benue', connections: '64,000', fundingGap: '₦8.3B', unservedPct: 62, grid: 0.45, miniGrid: 0.62, standalone: 0.58 },
    { mapId: 'nasarawa', name: 'Nasarawa', connections: '42,000', fundingGap: '₦5.4B', unservedPct: 60, grid: 0.50, miniGrid: 0.58, standalone: 0.55 },
    { mapId: 'kogi', name: 'Kogi', connections: '51,000', fundingGap: '₦6.6B', unservedPct: 56, grid: 0.52, miniGrid: 0.54, standalone: 0.50 },
    { mapId: 'kwara', name: 'Kwara', connections: '44,000', fundingGap: '₦5.7B', unservedPct: 54, grid: 0.55, miniGrid: 0.50, standalone: 0.46 },
    { mapId: 'edo', name: 'Edo', connections: '38,000', fundingGap: '₦4.9B', unservedPct: 42, grid: 0.62, miniGrid: 0.40, standalone: 0.36 },
    { mapId: 'delta', name: 'Delta', connections: '46,000', fundingGap: '₦5.9B', unservedPct: 44, grid: 0.60, miniGrid: 0.42, standalone: 0.38 },
    { mapId: 'anambra', name: 'Anambra', connections: '32,000', fundingGap: '₦4.1B', unservedPct: 35, grid: 0.70, miniGrid: 0.30, standalone: 0.28 },
    { mapId: 'enugu', name: 'Enugu', connections: '36,000', fundingGap: '₦4.6B', unservedPct: 38, grid: 0.68, miniGrid: 0.35, standalone: 0.30 },
    { mapId: 'imo', name: 'Imo', connections: '34,000', fundingGap: '₦4.4B', unservedPct: 36, grid: 0.68, miniGrid: 0.32, standalone: 0.28 },
    { mapId: 'abia', name: 'Abia', connections: '28,000', fundingGap: '₦3.6B', unservedPct: 34, grid: 0.65, miniGrid: 0.30, standalone: 0.26 },
    { mapId: 'ebonyi', name: 'Ebonyi', connections: '30,000', fundingGap: '₦3.9B', unservedPct: 40, grid: 0.60, miniGrid: 0.38, standalone: 0.34 },
    { mapId: 'cross-river', name: 'Cross River', connections: '42,000', fundingGap: '₦5.4B', unservedPct: 48, grid: 0.55, miniGrid: 0.46, standalone: 0.42 },
    { mapId: 'akwa-ibom', name: 'Akwa Ibom', connections: '38,000', fundingGap: '₦4.9B', unservedPct: 40, grid: 0.60, miniGrid: 0.38, standalone: 0.34 },
    { mapId: 'bayelsa', name: 'Bayelsa', connections: '22,000', fundingGap: '₦2.8B', unservedPct: 44, grid: 0.50, miniGrid: 0.44, standalone: 0.48 },
    { mapId: 'ondo', name: 'Ondo', connections: '40,000', fundingGap: '₦5.1B', unservedPct: 45, grid: 0.60, miniGrid: 0.43, standalone: 0.38 },
    { mapId: 'ekiti', name: 'Ekiti', connections: '24,000', fundingGap: '₦3.1B', unservedPct: 38, grid: 0.65, miniGrid: 0.35, standalone: 0.30 },
    { mapId: 'osun', name: 'Osun', connections: '31,000', fundingGap: '₦4.0B', unservedPct: 36, grid: 0.68, miniGrid: 0.32, standalone: 0.28 },
    { mapId: 'ogun', name: 'Ogun', connections: '52,000', fundingGap: '₦6.7B', unservedPct: 30, grid: 0.72, miniGrid: 0.28, standalone: 0.22 },
    { mapId: 'fct', name: 'FCT Abuja', connections: '28,000', fundingGap: '₦3.6B', unservedPct: 20, grid: 0.80, miniGrid: 0.18, standalone: 0.14 },
  ],
};

export const ABOUT_FRAMEWORK_DEFAULTS: AboutContent<AboutFrameworkSection> = {
  eyebrow: 'Facility framework',
  headingPrimary: 'The foundation of our ',
  headingSecondary: 'financing approach',
  intro:
    'CFBF deploys three complementary financial instruments, each addressing a distinct barrier in the green infrastructure financing chain — from first-loss risk absorption to local currency structuring and full blended capital stack assembly.',
  cards: [
    {
      cardNumber: '01',
      title: 'Risk sharing',
      body: 'First-loss absorption for developer default risk via structural co-financing, reducing the risk premium demanded by commercial lenders and making green infrastructure financeable for the first time.',
      tag: 'First-loss facility',
      bgImage: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=600&auto=format&fit=crop',
      bgImage_alt_text: 'Risk sharing',
    },
    {
      cardNumber: '02',
      title: 'Local currency funding',
      body: 'InfraCredit guarantees elevate green assets to AAA credit ratings, unlocking domestic pension fund capital held in PFAs and insurance companies — the largest untapped pool of patient capital in Nigeria.',
      tag: 'AAA credit enhancement',
      bgImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=600&auto=format&fit=crop',
      bgImage_alt_text: 'Local currency funding',
    },
    {
      cardNumber: '03',
      title: 'Blended finance',
      body: "Concessional and commercial capital layered at project level to achieve investment-grade profiles — the only sustainable path to closing Nigeria's green infrastructure financing gap at scale.",
      tag: 'CBI-certified',
      bgImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=600&auto=format&fit=crop',
      bgImage_alt_text: 'Blended finance',
    },
  ],
};

export const ABOUT_CAPITAL_STACK_DEFAULTS: AboutContent<AboutCapitalStackSection> = {
  eyebrow: 'Blended Finance in Action',
  headingPrimary: 'Model our de-risking stack in ',
  headingSecondary: 'real-time',
  collapsedBody:
    'Adjust variables and simulate how our credit wrap absorbs risk to unlock local currency pension funding.',
  expandedBody:
    'Adjust the slider to scale a sample green infrastructure project. See how the facility uses FCDO concessional seed capital to absorb risk, wrapping the capital structure to unlock local currency pension funding.',
  launchLabel: 'Launch Simulator',
  collapseLabel: 'Collapse Simulator',
  sliderLabel: 'Project Size (NGN)',
  sliderUnitLabel: ' Billion',
  minLabel: 'Min: ₦5.0B',
  maxLabel: 'Max: ₦30.0B',
  wrapBadge: 'InfraCredit AAA Guarantee Wrap',
  totalLabel: 'Total de-risked stack',
  totalSuffix: 'B NGN',
  segments: [
    {
      title: 'Senior PFA debt (60%)',
      description:
        'Secured, long-term debt funded by domestic Pension Fund Administrators (PFAs). Wrapped under the InfraCredit AAA guarantee to meet statutory safety regulations.',
    },
    {
      title: 'CFBF blended layer (20%)',
      description:
        'Subordinated, first-loss concessional debt funded via FCDO seed capital. Absorbs developer risk and lowers the overall financing cost to attract private commercial participants.',
    },
    {
      title: 'Developer equity (20%)',
      description:
        'Sponsor/developer commitment layer. Demonstrates alignment of interests and operational responsibility for active green asset sites.',
    },
  ],
  bars: [
    { percent: '60%', label: 'Senior' },
    { percent: '20%', label: 'Blended' },
    { percent: '20%', label: 'Equity' },
  ],
};

/** Logo host used by the pre-CMS partner defaults. */
const PARTNER_LOGO_BASE = 'https://infracredit.ng/climate-facility/wp-content/uploads';

export const ABOUT_PARTNERS_DEFAULTS: AboutContent<AboutPartnersSection> = {
  eyebrow: 'Ecosystem Partners',
  headingPrimary: 'Ecosystem and ',
  headingSecondary: 'capital mobilization network',
  ctaLabel: 'Partner with CFBF',
  ctaHref: '/contact',
  ctaHoverLabel: 'Join PFA co-financiers',
  groups: [
    {
      category: 'Anchor Funders',
      description: 'Capital commitment seed and de-risking funding partners.',
      partners: [
        {
          name: 'Foreign, Commonwealth & Development Office',
          role: 'UK FCDO — Anchor Funder (USD 21.3M)',
          logoText: '',
          logo: `${PARTNER_LOGO_BASE}/2022/10/UK-DEVELOPMENT-WHITE.png`,
          logo_alt_text: 'UK International Development',
          logoColour: null,
          logoColour_alt_text: null,
        },
        {
          name: 'British International Investment',
          role: 'BII — Co-Investment Partner',
          logoText: '',
          logo: `${PARTNER_LOGO_BASE}/2022/10/BII_Logo_All_white_RGB.png`,
          logo_alt_text: 'British International Investment',
          logoColour: null,
          logoColour_alt_text: null,
        },
      ],
    },
    {
      category: 'Technical Assistance Providers',
      description: 'Transactional capacity building and ESG project preparation.',
      partners: [
        {
          name: 'FSD Africa',
          role: 'Technical Assistance Partner',
          logoText: '',
          logo: `${PARTNER_LOGO_BASE}/2022/10/FSD-Africa-logo-1.png`,
          logo_alt_text: 'FSD Africa',
          logoColour: null,
          logoColour_alt_text: null,
        },
        {
          name: 'Shell Foundation',
          role: 'Capacity Support & Advisory',
          logoText: '',
          logo: `${PARTNER_LOGO_BASE}/2022/10/Shell-foundation-1.png`,
          logo_alt_text: 'Shell Foundation',
          logoColour: null,
          logoColour_alt_text: null,
        },
      ],
    },
    {
      category: 'Cofinancing Partner',
      description: 'Guarantee deployment and credit risk administration.',
      partners: [
        {
          name: 'InfraCredit',
          role: 'Facility Administrator & AAA Guarantor',
          logoText: '',
          // White PNG by default, coloured SVG swapped in on hover.
          logo: `${PARTNER_LOGO_BASE}/2022/09/ICAsset-6@4x-8-002-1024x326-1.png`,
          logo_alt_text: 'InfraCredit',
          logoColour: `${PARTNER_LOGO_BASE}/2022/09/InfraCredit-1.svg`,
          logoColour_alt_text: 'InfraCredit',
        },
      ],
    },
    {
      category: 'Domestic Institutional Investors',
      description: 'Local currency institutions and pension fund managers.',
      partners: [
        { name: 'AIICO Insurance PLC', role: 'Domestic PFA Co-financier', logoText: 'AIICO', logo: '', logo_alt_text: '', logoColour: null, logoColour_alt_text: null },
        { name: 'NEM Insurance PLC', role: 'Domestic PFA Co-financier', logoText: 'NEM', logo: '', logo_alt_text: '', logoColour: null, logoColour_alt_text: null },
        { name: 'Linkage Insurance PLC', role: 'Domestic PFA Co-financier', logoText: 'LINKAGE', logo: '', logo_alt_text: '', logoColour: null, logoColour_alt_text: null },
        { name: 'Leadway Insurance', role: 'Domestic PFA Co-financier', logoText: 'LEADWAY', logo: '', logo_alt_text: '', logoColour: null, logoColour_alt_text: null },
        { name: 'Tangerine Life', role: 'Domestic PFA Co-financier', logoText: 'TANGERINE', logo: '', logo_alt_text: '', logoColour: null, logoColour_alt_text: null },
        { name: 'Clean Energy Local Currency Fund', role: 'Domestic PFA Co-financier', logoText: 'CELCF', logo: '', logo_alt_text: '', logoColour: null, logoColour_alt_text: null },
        { name: 'First Pension Custodian', role: 'Pension Asset Custodian', logoText: 'FPC', logo: '', logo_alt_text: '', logoColour: null, logoColour_alt_text: null },
      ],
    },
  ],
};

export const ABOUT_MILESTONES_DEFAULTS: AboutContent<AboutMilestonesSection> = {
  eyebrow: 'Progress indicator',
  headingPrimary: 'Facility milestones ',
  headingSecondary: '& growth timeline',
  railYears: [{ label: '2022' }, { label: '2023' }, { label: '2024' }, { label: '2025' }],
  milestones: [
    {
      period: 'Q4 2022',
      year: '2022',
      label: 'Fund seeded & framework certified',
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=900&auto=format&fit=crop',
      image_alt_text: 'Fund seeded & framework certified',
      events: [
        { date: '10.22', text: 'Clean Energy Transition Strategy & Framework formally issued' },
        { date: '11.22', text: 'USD21.3M concessional capital committed by UK FCDO & BII to the Facility' },
        { date: '12.22', text: 'Guarantees framework certified under Climate Bonds Initiative criteria' },
        { date: '12.22', text: 'InfraCredit appointed as Facility administrator' },
      ],
    },
    {
      period: 'Q4 2023',
      year: '2023',
      label: 'Deployment phase — first portfolio closed',
      image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=900&auto=format&fit=crop',
      image_alt_text: 'Deployment phase — first portfolio closed',
      events: [
        { date: '03.23', text: 'Initial portfolios closed; first local currency guarantee issued' },
        { date: '06.23', text: '120 telecom base stations solarised across 24 states' },
        { date: '09.23', text: 'Dedicated financial products developed for mini-grid developers' },
        { date: '12.23', text: 'USD 21.3M total concessional capital deployed to active pipeline' },
      ],
    },
    {
      period: 'Q4 2024',
      year: '2024',
      label: 'Portfolio consolidation — institutional co-financing expanded',
      image: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?q=80&w=900&auto=format&fit=crop',
      image_alt_text: 'Portfolio consolidation — institutional co-financing expanded',
      events: [
        { date: 'Q1.24', text: 'BII second tranche of co-investment committed to active pipeline' },
        { date: 'Q2.24', text: 'Two additional insurance companies onboarded as co-financiers' },
        { date: 'Q3.24', text: 'Green bond issuance framework aligned to ICMA Green Bond Principles' },
        { date: 'Q4.24', text: 'Pipeline at ₦5.2B; 5% renewable investment target achieved ahead of schedule' },
      ],
    },
    {
      period: 'Q4 2025',
      year: '2025',
      label: 'Scale-out — ₦7.86B+ pipeline mobilised',
      image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=900&auto=format&fit=crop',
      image_alt_text: 'Scale-out — ₦7.86B+ pipeline mobilised',
      events: [
        { date: 'Q1.25', text: '5% renewable/cleaner energy investments target achieved in portfolio' },
        { date: 'Q2.25', text: 'Pipeline expanded to ₦7.86B+ across 32 states' },
        { date: 'Q3.25', text: 'Additional capital mobilised from PFAs and international DFIs' },
        { date: 'Q4.25', text: 'Full national footprint across all six geo-political zones' },
      ],
    },
  ],
};

export const ABOUT_AUDIENCE_DEFAULTS: AboutContent<AboutAudienceSection> = {
  eyebrow: 'Identify your role',
  headingPrimary: 'Partner with ',
  headingSecondary: 'CFBF',
  journeySuffix: ' Journey',
  questionsHeading: 'Critical Questions & Answers',
  personas: [
    {
      tabLabel: 'Institutional Investor',
      title: 'Unlocking secure local currency assets for Nigerian PFAs',
      tagline: 'Regulatory-compliant, AAA-rated investments de-risked from first loss.',
      intro:
        'CFBF bridges the gap between infrastructure need and institutional safety. By blending concessional seed capital with AAA-credit wraps, we deliver institutional-grade green debt structures tailored for Pension Fund Administrators, Asset Managers, and Insurance providers.',
      ctaLabel: 'Download Prospectus & Factsheet',
      ctaHref: '/download.pdf',
      questions: [
        {
          question: 'Is the investment principal secured?',
          answer:
            'Yes, Senior debt blocks are wrapped in an unconditional, irrevocable AAA credit guarantee administered by InfraCredit.',
        },
        {
          question: 'What is the green asset governance standard?',
          answer:
            'Every transaction is pre-certified under the international Climate Bonds Initiative (CBI) standards.',
        },
        {
          question: 'How does it align with PENCOM guidelines?',
          answer:
            'Structures comply fully with PENCOM regulations, matching statutory asset quality and tenor requirements (up to 10 years).',
        },
        {
          question: 'Are payments denominated in foreign currency?',
          answer:
            'No, all transactions and payouts are denominated in Nigerian Naira (NGN) to eliminate foreign exchange risk.',
        },
      ],
    },
    {
      tabLabel: 'Project Developer',
      title: 'Accessing catalytic local currency funding for clean energy assets',
      tagline: 'Concessional subordinated debt and risk-sharing structures for developers.',
      intro:
        'We provide project developers with first-loss risk-sharing facilities, credit-guaranteed local currency loans, and structured debt co-financing. This de-risks clean energy projects, enabling them to raise patient capital from local markets.',
      ctaLabel: 'Start Eligibility Assessment',
      ctaHref: '/eligibility',
      questions: [
        {
          question: 'What technologies are eligible for facility support?',
          answer:
            'Solar hybrid mini-grids, green telecom infrastructure, productive agro-use solar hubs, clean cooking, and solar home systems.',
        },
        {
          question: 'What is the minimum scale or capacity required?',
          answer:
            'Projects require a minimum of 150 kW combined capacity, 1 active operational site, and 200+ registered paying customers.',
        },
        {
          question: 'Do you offer equity or seed grants?',
          answer:
            'CFBF operates through local currency debt instruments and guarantees, co-investing alongside project sponsors.',
        },
        {
          question: 'What ESG safeguards must my project satisfy?',
          answer:
            'Developers must comply strictly with IFC Environmental & Social Safeguards, and PENCOM rules.',
        },
      ],
    },
    {
      tabLabel: 'Development Partner',
      title: 'Scaling catalytic development impact in Sub-Saharan Africa',
      tagline: 'High-leverage mobilization of private finance to support climate goals.',
      intro:
        'Seeded by the UK FCDO and co-invested with BII, CFBF sets a repeatable blueprint for blended finance. We absorb early-stage risk, mobilizing domestic private pension capital at scale to achieve real-world energy access and emission reductions.',
      ctaLabel: 'View Impact Reports & SDGs',
      ctaHref: '/projects',
      questions: [
        {
          question: 'What is the capitalization of the facility?',
          answer:
            'Capitalisation of USD21.3M concessional funding from the UK Foreign, Commonwealth & Development Office (FCDO) and British International Investment (BII).',
        },
        {
          question: 'How is the capital mobilization leverage measured?',
          answer:
            'We target a high multiplier, leveraging institutional capital by layering concessional risk-absorption cushions.',
        },
        {
          question: 'Which UN Sustainable Development Goals (SDGs) are aligned?',
          answer:
            'Primary focus is SDG 7 (Affordable Clean Energy) and SDG 13 (Climate Action), with secondary impact on SDG 8 & 9 (Jobs and Infrastructure).',
        },
        {
          question: 'How does the facility align with national climate policies?',
          answer:
            "We directly support Nigeria's Energy Transition Plan (ETP) target of achieving Net Zero emissions by 2060.",
        },
      ],
    },
  ],
};

export const ABOUT_NEXT_STEPS_DEFAULTS: AboutContent<AboutNextStepsSection> = {
  eyebrow: 'Next steps',
  headingPrimary: 'Explore the ',
  headingSecondary: 'facility portal',
  links: [
    { kicker: 'Portfolio', title: 'Browse portfolio', sub: 'Discover how our credit wraps support developers', href: '/projects' },
    { kicker: 'Architecture', title: 'Learn how it works', sub: 'Understand our blending process & structures', href: '/how-it-works' },
    { kicker: 'Impact', title: 'View our impact', sub: 'Explore carbon targets and video stories', href: '/impact' },
  ],
};

export const ABOUT_DOWNLOAD_CTA_DEFAULTS: AboutContent<AboutDownloadCtaSection> = {
  eyebrow: 'Factsheet & prospectus',
  heading: 'Get the technical specifications of the facility',
  body: 'Download our comprehensive factsheet outlining fund structure, eligibility guidelines, co-financing terms, and regional deployment targets.',
  backgroundImage:
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1400&auto=format&fit=crop',
  backgroundImage_alt_text: 'CFBF Factsheet & Prospectus Background',
  buttonLabel: 'Download Factsheet',
  buttonHref: '/download.pdf',
  downloadFileName: 'CFBF_Factsheet.pdf',
};
