/**
 * Bundled fallback copy for the Impact page.
 *
 * Every section merges CMS data over these with
 * `{ ...DEFAULTS, ...withoutEmpty(data) }`, so an unreachable CMS — or a single
 * field an editor blanked — degrades to the copy the page shipped with rather
 * than to nothing.
 *
 * The text matches `cms/src/seed/impact-page-copy.ts`, which is what pre-fills
 * Strapi on a fresh boot. That file cannot be imported from here (separate
 * package), so the copy is duplicated; keep the two in step when editing.
 *
 * Colours are deliberately absent. The SDG chip palette, the UN SDG card hexes,
 * the story badge rotation, the net-zero wheel strokes and the asset status
 * pills all live in `components/impact/ImpactSections.tsx` and are never
 * sourced from here or from the CMS — note in particular that the hero chip
 * palette and the SDG card hexes are *different* values for the same goals, and
 * crossing them would silently recolour the page.
 */

import type {
  ImpactAssetsTabSection,
  ImpactConsoleSection,
  ImpactContent,
  ImpactHeroSection,
  ImpactInvestmentsTabSection,
  ImpactNextStepsSection,
  ImpactNumbersTabSection,
  ImpactPhilosophySection,
  ImpactPillarItem,
  ImpactStoriesTabSection,
  ImpactStructuredDataSection,
  ImpactVideoModalSection,
} from './impact-types';

const META_DESCRIPTION =
  "Tracking our contribution to Nigeria's Net Zero targets, SDG goals, and local clean energy community projects.";

/** Media, served from Cloudinary under `climate facility/impact-page/`. */
const CLOUDINARY = 'https://res.cloudinary.com/diqfojkri';
const FOLDER = 'climate%20facility/impact-page';

const HERO_IMAGE = `${CLOUDINARY}/image/upload/v1785838099/${FOLDER}/hero-background-image.jpg`;

const FELICIA_IMAGE = `${CLOUDINARY}/image/upload/v1785838100/${FOLDER}/stories-story-1-image.jpg`;
const ACOB_IMAGE = `${CLOUDINARY}/image/upload/v1785838101/${FOLDER}/stories-story-2-image.jpg`;
const PRADO_IMAGE = `${CLOUDINARY}/image/upload/v1785838102/${FOLDER}/stories-story-3-image.jpg`;
const FIRST_ELECTRIC_IMAGE = `${CLOUDINARY}/image/upload/v1785838103/${FOLDER}/stories-story-4-image.jpg`;
const CEESOLAR_IMAGE = `${CLOUDINARY}/image/upload/v1785838103/${FOLDER}/stories-story-5-image.jpg`;
const HOTSPOT_IMAGE = `${CLOUDINARY}/image/upload/v1785838104/${FOLDER}/stories-story-6-image.jpg`;

const SDG7_IMAGE = `${CLOUDINARY}/image/upload/v1785838126/${FOLDER}/investments-sdg-1-image.jpg`;
const SDG8_IMAGE = `${CLOUDINARY}/image/upload/v1785838126/${FOLDER}/investments-sdg-2-image.jpg`;
const SDG9_IMAGE = `${CLOUDINARY}/image/upload/v1785838127/${FOLDER}/investments-sdg-3-image.jpg`;
const SDG13_IMAGE = `${CLOUDINARY}/image/upload/v1785838128/${FOLDER}/investments-sdg-4-image.jpg`;

/**
 * The four strategic pillars, rendered both in the philosophy section and under
 * the "What we invest in" tab. Seeded twice so an editor can change them
 * independently — hence a shared constant here, but two separate CMS fields.
 */
const PILLARS: ImpactPillarItem[] = [
  {
    number: '01',
    title: 'Capital Mobilization',
    description:
      'De-risking private institutional pension fund assets and matching them to clean energy developers under local-currency wrappers.',
  },
  {
    number: '02',
    title: 'Climate Mitigation',
    description:
      'Mitigating greenhouse gas emissions through replacement of off-grid diesel generation with localized solar hybrid solutions.',
  },
  {
    number: '03',
    title: 'Community Empowerment',
    description:
      'Providing micro-enterprises, farming hubs, and households with stable, clean electricity to increase productivity and incomes.',
  },
  {
    number: '04',
    title: 'Local Capacity Building',
    description:
      'Supporting developer project preparation and operations to build local capacity in green infrastructure development.',
  },
];

export const IMPACT_STRUCTURED_DATA_DEFAULTS: ImpactContent<ImpactStructuredDataSection> = {
  pageTitle: 'Our Impact & Transition Strategy | CFBF',
  metaDescription: META_DESCRIPTION,
  loadingLabel: 'Loading impact...',
};

export const IMPACT_HERO_DEFAULTS: ImpactContent<ImpactHeroSection> = {
  breadcrumbLabel: 'impact',
  eyebrow: 'Stories & strategy',
  headingPartOne: 'Our strategy & ',
  headingHighlight: 'impact',
  descriptionPrimary:
    'CFBF is built to bridge the green infrastructure gap, moving local pension assets into clean energy and sustainable developments that empower local communities.',
  descriptionSecondary:
    'Discover our localized case study video stories and our long-term Net Zero transition strategy below.',
  backgroundImage: HERO_IMAGE,
  backgroundImage_alt_text: 'Hero banner',
  stats: [
    {
      category: 'Investment',
      value: '₦7.86B+',
      label: 'Capital Deployed',
      description:
        'mobilized from institutional investors and pension funds into the real economy.',
      sdgBadge: 'SDG 9',
    },
    {
      category: 'Mitigation',
      value: '7,500+ tCO₂e',
      label: 'Emissions Avoided',
      description: 'tonnes of annual carbon emissions mitigated across active installations.',
      sdgBadge: 'SDG 13',
    },
    {
      category: 'Employment',
      value: '5,780+',
      label: 'Job Creation',
      description: 'sustainable jobs facilitated in local clean energy construction & ops.',
      sdgBadge: 'SDG 8',
    },
    {
      category: 'Generation',
      value: '4.02 MW',
      label: 'Capacity Installed',
      description: 'installed green capacity de-risked by first-loss co-financing.',
      sdgBadge: 'SDG 7',
    },
    {
      category: 'Energy Access',
      value: '39,438',
      label: 'Connections Powered',
      description:
        'projected household and SME clean energy connections powered across Nigeria.',
      sdgBadge: 'SDG 7',
    },
    {
      category: 'Reach',
      value: '35 States',
      label: 'Active Pipeline',
      description: 'subnational clean energy deal flow coverage across Nigeria.',
      sdgBadge: 'SDG 17',
    },
  ],
};

export const IMPACT_PHILOSOPHY_DEFAULTS: ImpactContent<ImpactPhilosophySection> = {
  eyebrow: '— Our Philosophy',
  headingPartOne: 'Mobilizing capital to power ',
  headingHighlight: 'sustainable transitions',
  bodyPartOne:
    "The Climate Finance Blending Facility is strategically structured to address the barriers preventing long-term private investment from entering Nigeria's green infrastructure market.",
  bodyPartTwo:
    'By blending concessional first-loss capital with local currency guarantees, we establish robust, investment-grade opportunities that deliver double-bottom-line returns: financial security for pension savers and clean energy access for rural and underserved communities.',
  pillars: PILLARS,
};

export const IMPACT_CONSOLE_DEFAULTS: ImpactContent<ImpactConsoleSection> = {
  eyebrow: '— Impact Console',
  headingPartOne: 'Stakeholder testimonials & ',
  headingHighlight: 'proof',
  tabs: [
    { tabId: 'stories', label: 'Stories from our communities' },
    { tabId: 'numbers', label: 'Our impact in numbers' },
    { tabId: 'investments', label: 'What we invest in' },
    { tabId: 'assets', label: 'Our assets' },
  ],
};

export const IMPACT_STORIES_TAB_DEFAULTS: ImpactContent<ImpactStoriesTabSection> = {
  countPrefix: 'Showing',
  countMiddle: 'of',
  countSuffix: 'community case studies',
  viewMoreLabel: 'View more testimonials',
  roleLabel: 'ROLE',
  locationLabel: 'LOCATION',
  typeLabel: 'TYPE',
  stories: [
    {
      title: 'Meet Felicia Adindu-End User, Darway Coast',
      role: 'Community Voice',
      location: 'Rivers State',
      type: 'Video Testimonial',
      badge: 'Case Study',
      excerpt:
        'In Akpoku, Rivers State, Felicia Adindu once struggled with unreliable energy. Now, clean solar power has transformed her daily life and business.',
      duration: '4:32 mins',
      image: FELICIA_IMAGE,
      image_alt_text: 'Meet Felicia Adindu-End User, Darway Coast',
      youtubeUrl: 'https://youtu.be/kBGxtT3dd0s',
    },
    {
      title: 'ACOB Lighting Solar Powered Rural Electrification Project',
      role: 'Developer',
      location: 'Akwa-Ibom & Benue States',
      type: 'Video Testimonial',
      badge: 'Tech Showcase',
      excerpt:
        'Investing in clean energy means investing in communities. How ACOB Lighting is powering local development in northern regions.',
      duration: '3:15 mins',
      image: ACOB_IMAGE,
      image_alt_text: 'ACOB Lighting Solar Powered Rural Electrification Project',
      youtubeUrl: 'https://youtu.be/E2Dfe3QuZds',
    },
    {
      title: 'Prado Power Solar Powered Rural Electrification Project',
      role: 'Developer',
      location: 'Cross River State',
      type: 'Video Testimonial',
      badge: 'Milestone Focus',
      excerpt:
        'The project will construct solar-hybrid mini-grid installations to power households and small businesses in off-grid rural areas.',
      duration: '5:40 mins',
      image: PRADO_IMAGE,
      image_alt_text: 'Prado Power Solar Powered Rural Electrification Project',
      youtubeUrl: 'https://youtu.be/81ULxF30F4A',
    },
    // TODO: re-enable once real testimonial video is sourced (no video exists
    // yet on the reference site or YouTube for these three).
    // {
    //   title: 'Mesh Grid Networks Powering Agriculture - First Electric',
    //   role: 'Developer',
    //   location: 'Gombe & Nasarawa States',
    //   type: 'Video Case Study',
    //   badge: 'Infrastructure',
    //   excerpt:
    //     'Mesh grid networks connect rural households and small agricultural processors in Gombe State, facilitating cold storage and local commerce.',
    //   duration: '3:45 mins',
    //   image: FIRST_ELECTRIC_IMAGE,
    //   image_alt_text: 'Mesh Grid Networks Powering Agriculture - First Electric',
    //   youtubeUrl: null,
    // },
    // {
    //   title: 'Unlocking Local Capital for Off-Grid Power - CEESOLAR',
    //   role: 'Project Lead',
    //   location: 'Cross River State',
    //   type: 'Project Update',
    //   badge: 'Clean Finance',
    //   excerpt:
    //     'CEESOLAR Energy utilizes concessional funding to build high-capacity solar-hybrid grids, powering rural communities in the Niger Delta region.',
    //   duration: '4:15 mins',
    //   image: CEESOLAR_IMAGE,
    //   image_alt_text: 'Unlocking Local Capital for Off-Grid Power - CEESOLAR',
    //   youtubeUrl: null,
    // },
    // {
    //   title: 'Solarizing Rural Telecom Infrastructure - Hotspot Network',
    //   role: 'Community Partner',
    //   location: 'Kano & Kaduna States',
    //   type: 'Field Documentary',
    //   badge: 'Digital Impact',
    //   excerpt:
    //     'Replacing diesel generators with high-efficiency solar hybrid arrays across 120 base stations, bringing continuous clean connectivity to rural Nigeria.',
    //   duration: '5:10 mins',
    //   image: HOTSPOT_IMAGE,
    //   image_alt_text: 'Solarizing Rural Telecom Infrastructure - Hotspot Network',
    //   youtubeUrl: null,
    // },
  ],
};

export const IMPACT_NUMBERS_TAB_DEFAULTS: ImpactContent<ImpactNumbersTabSection> = {
  metrics: [
    {
      label: 'Capacity Installed',
      value: '4.02',
      unit: 'MW',
      description: 'installed clean generating capacity co-financed.',
    },
    {
      label: 'Emissions Avoided',
      value: '7,500+',
      unit: 'tCO₂e',
      description: 'tonnes of annual carbon emissions mitigated.',
    },
    {
      label: 'Job Creation',
      value: '5,780+',
      unit: 'Jobs',
      description: 'sustainable employment opportunities facilitated.',
    },
    {
      label: 'Connections Powered',
      value: '39,438',
      unit: '',
      description: 'projected household and SME connections powered.',
    },
  ],
  wheelCenterYear: '2060',
  wheelCenterLabel: 'Nigeria NZE Target',
  wheelProgressLabel: '~16% progress',
  timelinePoints: [
    { year: '2022', label: 'Current' },
    { year: '2030', label: 'Interim target' },
    { year: '2060', label: 'NZE goal' },
  ],
  etpLabel: 'Nigeria Energy Transition Plan',
  etpBody:
    "Nigeria's ETP sets an ambitious path to net zero by 2060. CFBF is purpose-built to accelerate this transition by mobilising private capital at scale for off-grid and distributed renewables.",
  pensionLabel: 'Pension fund penetration',
  pensionTargetValue: '30% target',
  pensionCurrentLabel: 'Current ~2%',
  pensionTargetLabel: 'Target 30% by 2024',
};

export const IMPACT_INVESTMENTS_TAB_DEFAULTS: ImpactContent<ImpactInvestmentsTabSection> = {
  pillarsHeading: '/ Strategic Investment Pillars',
  pillars: PILLARS,
  sdgHeading: '/ SDG Framework Alignments',
  sdgCards: [
    {
      number: '07',
      title: 'Affordable & Clean Energy',
      badgeLabel: 'SDG 7',
      description:
        'Channelling long-term local currency financing to expand distributed renewable energy, building mini-grids and solar systems across underserved communities.',
      image: SDG7_IMAGE,
      image_alt_text: 'Affordable & Clean Energy background',
    },
    {
      number: '08',
      title: 'Decent Work & Growth',
      badgeLabel: 'SDG 8',
      description:
        'Promoting sustained economic growth by creating high-paying local jobs across clean energy construction, operation, maintenance, and supply chains.',
      image: SDG8_IMAGE,
      image_alt_text: 'Decent Work & Growth background',
    },
    {
      number: '09',
      title: 'Industry & Infrastructure',
      badgeLabel: 'SDG 9',
      description:
        'Building resilient clean energy utilities, agro-processing hubs, and green industrial parks powered by sustainable, localized off-grid networks.',
      image: SDG9_IMAGE,
      image_alt_text: 'Industry & Infrastructure background',
    },
    {
      number: '13',
      title: 'Climate Action',
      badgeLabel: 'SDG 13',
      description:
        "Confronting climate change head-on by accelerating private capital into climate-smart technologies to accelerate Nigeria's energy transition.",
      image: SDG13_IMAGE,
      image_alt_text: 'Climate action background',
    },
  ],
};

export const IMPACT_ASSETS_TAB_DEFAULTS: ImpactContent<ImpactAssetsTabSection> = {
  columns: [
    { label: 'Asset Name' },
    { label: 'Location' },
    { label: 'Asset Class' },
    { label: 'Capacity' },
    { label: 'Connections' },
    { label: 'Jobs' },
    { label: 'Status' },
  ],
  assets: [
    {
      assetId: '01',
      title: 'First Electric Power and Automation Services',
      location: 'Gombe, Nasarawa & Ondo States',
      category: 'Solar Grid',
      capacity: '725KW',
      connections: '5,156',
      jobs: '616',
      ghg: '762 Tonnes',
      capital: '₦1.70b',
      year: '2025',
      status: 'Under Construction',
    },
    {
      assetId: '02',
      title: 'CEESOLAR Energy Limited',
      location: 'Cross River State',
      category: 'Solar Grid',
      capacity: '760KW',
      connections: '3,597',
      jobs: '561',
      ghg: '737 Tonnes',
      capital: '₦1.70b',
      year: '2025',
      status: 'Under Construction',
    },
    {
      assetId: '03',
      title: 'Prado Power Energy Limited',
      location: 'Akwa-Ibom & Benue States',
      category: 'Agro-Processing',
      capacity: '850kW',
      connections: '15,801',
      jobs: '740',
      ghg: '893 Tonnes',
      capital: '₦1.95b',
      year: '2024',
      status: 'Under Construction',
    },
    {
      assetId: '04',
      title: 'Hotspot Network Limited',
      location: '22 States in Nigeria',
      category: 'Telecoms',
      capacity: '324kW',
      connections: '120 Sites',
      jobs: '720',
      ghg: '8.34 Tonnes',
      capital: '₦955m',
      year: '2023',
      status: 'Operational',
    },
    {
      assetId: '05',
      title: 'Darway Coast Limited',
      location: 'Rivers & Abia States',
      category: 'Solar Grid',
      capacity: '526kW',
      connections: '7,711',
      jobs: '2,296',
      ghg: '4,856 Tonnes',
      capital: '₦800m',
      year: '2022',
      status: 'Operational',
    },
    {
      assetId: '06',
      title: 'ACOB Lightning Technology Limited',
      location: 'Edo & Ondo States',
      category: 'Solar Grid',
      capacity: '335kW',
      connections: '3,597',
      jobs: '868',
      ghg: '352 Tonnes',
      capital: '₦755m',
      year: '2023',
      status: 'Operational',
    },
  ],
};

export const IMPACT_NEXT_STEPS_DEFAULTS: ImpactContent<ImpactNextStepsSection> = {
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
      eyebrow: 'Portfolio',
      title: 'Browse portfolio',
      description: 'Discover how our credit wraps support developers',
      href: '/projects',
    },
    {
      eyebrow: 'Architecture',
      title: 'Learn how it works',
      description: 'Understand our blending process & structures',
      href: '/how-it-works',
    },
  ],
};

export const IMPACT_VIDEO_MODAL_DEFAULTS: ImpactContent<ImpactVideoModalSection> = {
  nowPlayingLabel: 'Now Playing',
};
