/**
 * Bundled fallback content for the homepage.
 *
 * This is the copy the site shipped with before the CMS existed. It is merged
 * under the Strapi response field-by-field (see `withoutEmpty` in `./home`), so
 * the page renders in full even if the CMS is unreachable or a field is blank.
 *
 * Purely presentational choices the CMS does not model — metric card icons and
 * colour variants, partner logo artwork, story accent colours, the hero video
 * seek window — live next to the components that use them, not here.
 */
import type {
  AboutContent,
  HeroContent,
  ImpactContent,
  MapContent,
  NetZeroContent,
  NewsContent,
  ProjectsContent,
  StoriesContent,
  StructuredDataContent,
} from './types';

export const HERO_DEFAULTS: HeroContent = {
  headingPrimary: 'Local Currency Blended',
  headingSecondary: 'Climate Finance',
  subheadline:
    'Mobilising blended finance for sustainable energy access. The first of its kind to receive certification under the Electrical Grids and Storage criteria by the Climate Bonds Standard.',
  ctaLabel: 'Explore Our Impact',
  ctaHref: '/impact',
  newsCtaLabel: 'Read Article',
  backgroundImage:
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2070&auto=format&fit=crop',
  backgroundImage_alt_text: 'Solar Panels',
  backgroundVideo: '/videos/hero-bg.mp4',
  certificationBadge:
    'https://infracredit.ng/climate-facility/wp-content/uploads/2023/01/climate-bond-standard-certfied.svg',
  certificationBadge_alt_text: 'Climate Bonds Certified',
  stats: [
    { value: '$21.3m', label: 'Total Funding' },
    { value: '35+', label: 'States' },
    { value: '2.4m', label: 'Lives Impacted' },
  ],
};

export const ABOUT_DEFAULTS: AboutContent = {
  eyebrow: 'Who We Are',
  headingPrimary: 'Mobilising blended finance for ',
  headingSecondary: 'sustainable energy access.',
  body:
    'The Climate Finance Blending Facility is a catalytic facility capitalised with USD21.3 million concessional funding by the UK Foreign, Commonwealth & Development Office ("FCDO") and the British International Investment ("BII") to mobilise additional funding from development partners to co-finance off-grid clean energy investments alongside InfraCredit\'s local currency guarantees in Nigeria.',
  ctaLabel: 'Read more about our mission',
  ctaHref: '/about',
  partnersHeading: 'Strategic Partners & Funders',
  statValue: '$21.3m',
  statDescription:
    'Concessional capital committed by FCDO and BII to de-risk green investments in Nigeria.',
  image:
    'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1200&auto=format&fit=crop',
  image_alt_text: 'Solar Panels Cloudy Sky',
  partners: [
    { name: 'UKaid' },
    { name: 'InfraCredit' },
    { name: 'AIICO' },
    { name: 'LINKAGE ASSURANCE' },
  ],
};

export const IMPACT_DEFAULTS: ImpactContent = {
  eyebrow: 'Our Impact',
  headingPrimary: 'How we drive ',
  headingSecondary: 'impact',
  numbersCtaLabel: 'Visit Capacity Building Page',
  reportCtaLabel: 'Download Impact & Sustainability Report',
  reportFileName: 'CFBF_Impact_Report_2025.pdf',
  reportFileHref: '/download.pdf',
  capacityCtaLabel: 'Visit Knowledge Hub',
  statsCardEyebrow: 'Impact Metrics',
  galleryCtaLabel: 'View Gallery',
  knowledgeHubTitle: 'Knowledge Hub',
  knowledgeHubSubtitle: 'Access our latest research and reports.',
  theoryEyebrow: 'THEORY OF CHANGE',
  theoryHeadingPrimary: 'Shaping a sustainable',
  theoryHeadingSecondary: 'future with energy',
  theoryFooterLabel: 'Start saving with reliable, sustainable energy today.',
  tabs: [
    {
      tabId: 'numbers',
      label: 'Impact Numbers',
      title: 'Measuring Real-World Change',
      description:
        'Our data-driven approach ensures every dollar invested translates into tangible environmental and social progress.',
    },
    {
      tabId: 'capacity',
      label: 'Capacity Building',
      title: 'Building Market Resilience',
      description:
        'Strengthening local financial institutions and developers to sustain long-term growth in the renewable energy sector.',
    },
    {
      tabId: 'theory',
      label: 'Theory of Change',
      title: 'The Logic of Change',
      description:
        'From mobilising capital to sustainable development: mapping our strategic pathway to impact.',
    },
  ],
  metricCards: [
    {
      value: '47.2',
      suffix: 'b',
      label: 'Total Project Investment Committed',
      image: null,
      image_alt_text: null,
    },
    {
      value: '1310',
      suffix: '',
      label: 'Communities Served',
      image:
        'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop',
      image_alt_text: 'Communities Served',
    },
    {
      value: '232',
      suffix: 'm',
      label: 'People with access to new infrastructure',
      image: null,
      image_alt_text: null,
    },
    {
      value: '32',
      suffix: ' MW',
      label: 'Capacity Installed',
      image:
        'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=800&auto=format&fit=crop',
      image_alt_text: 'Capacity Installed',
    },
    {
      value: '258',
      suffix: '',
      label: 'Projects Reached Financial Close',
      image: null,
      image_alt_text: null,
    },
    {
      value: '611',
      suffix: 'k',
      label: 'Tonnes CO2 Reduced',
      image: null,
      image_alt_text: null,
    },
  ],
  capacityStats: [
    { label: 'Trainees Certified', value: '500+' },
    { label: 'Workshops Hosted', value: '20+' },
    { label: 'States Covered', value: '15' },
    { label: 'Institutions Partnered', value: '8' },
  ],
  gallerySlides: [
    {
      image:
        'https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=800&auto=format&fit=crop',
      description: 'Cross section of participants representing various institutions.',
      image_alt_text: 'Gallery Event',
    },
    {
      image:
        'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop',
      description: 'Technical workshop session on solar mini-grid maintenance.',
      image_alt_text: 'Gallery Event',
    },
    {
      image:
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop',
      description: 'Site inspection and field training with local engineers.',
      image_alt_text: 'Gallery Event',
    },
  ],
  reports: [
    {
      reportId: 'climate24',
      tag: '#ClimateReport2024',
      title: 'Annual Sustainability Assessment',
      size: '2.4MB',
    },
    { reportId: 'clean', tag: '#CleanEnergy', title: 'Off-Grid Solar Market Analysis', size: '1.8MB' },
    { reportId: 'gender', tag: '#GenderGap', title: 'Women in Renewable Energy', size: '3.1MB' },
    {
      reportId: 'finance',
      tag: '#GreenFinance',
      title: 'Local Currency Bonds Framework',
      size: '4.2MB',
    },
  ],
  theoryCards: [
    {
      cardId: 'step1',
      cardType: 'image',
      subtitle: 'CLEAN ENERGY ACCESS',
      title: 'Clean Energy Access',
      description:
        'Unlock affordable financing for private sector enterprises providing off-grid energy solutions such as solar mini grids, solar home systems, solar lanterns, fridges, pumps, driers and clean cooking products.',
      image:
        'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop',
      image_alt_text: 'Clean Energy Access',
      link: '/impact',
      linkLabel: 'Learn More',
    },
    {
      cardId: 'step2',
      cardType: 'solid',
      subtitle: 'DOMESTIC INSTITUTIONAL INVESTORS',
      title: 'Domestic Institutional Investors',
      description:
        'Catalyse green investments in local currency from domestic private institutional investors such as insurance companies, local pension funds, and asset managers.',
      image: null,
      image_alt_text: null,
      link: '/impact',
      linkLabel: 'Learn More',
    },
    {
      cardId: 'step3',
      cardType: 'image',
      subtitle: 'DEVELOPMENT ASSISTANCE',
      title: 'Development Assistance',
      description:
        'Innovative blended finance approach for donors and concessional financiers, to make smart use of impact-seeking capital to de-risk and mobilise private sector financing.',
      image:
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop',
      image_alt_text: 'Development Assistance',
      link: '/impact',
      linkLabel: 'Learn More',
    },
    {
      cardId: 'step4',
      cardType: 'solid',
      subtitle: 'GREEN ECONOMY',
      title: 'Green Economy',
      description:
        'Promote green growth and climate resilient development by enhancing access to renewable energy for productive uses and boosting agricultural development.',
      image: null,
      image_alt_text: null,
      link: '/impact',
      linkLabel: 'Learn More',
    },
  ],
};

export const PROJECTS_DEFAULTS: ProjectsContent = {
  eyebrow: 'Project Showcase',
  heading: 'Leading with innovation in solar projects worldwide',
  capitalLabel: 'Private Capital',
  capacityLabel: 'Capacity',
  challengeLabel: 'Challenge Analysis',
  solutionLabel: 'Solution',
  impactLabel: 'Impact',
  detailCtaLabel: 'Learn More',
  ctaLabel: 'View All Projects',
  ctaHref: '/projects',
  viewTabs: [
    { tabId: 'list', label: 'List View' },
    { tabId: 'grid', label: 'Grid View' },
  ],
  categories: [
    { label: 'All' },
    { label: 'Solar Grid' },
    { label: 'Telecoms' },
    { label: 'Agro-Processing' },
  ],
  projects: [
    {
      // Ids must match the keys in lib/projectsData.ts, which the detail route
      // looks up directly — Darway Coast is '05' there, not '01'.
      projectId: '05',
      title: 'Darway Coast, Nigeria',
      location: 'Rivers State',
      year: '2022',
      capital: '₦800m',
      capacity: '526KW',
      category: 'Solar Grid',
      image:
        'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=1200&auto=format&fit=crop',
      imageOne:
        'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop',
      imageTwo:
        'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=800&auto=format&fit=crop',
      description:
        'Providing clean energy to over 2,000 households and businesses in coastal communities.',
      problem:
        'Coastal communities in Rivers State lacked reliable grid connection, relying on expensive and polluting diesel generators for basic needs.',
      solution:
        'Deployment of a 526KW Solar Hybrid Mini-Grid with battery storage to provide 24/7 reliable power to the community.',
      impact:
        'Replaced 200+ diesel generators, reducing CO2 emissions by 400 tonnes annually and powering 150 SMEs.',
      image_alt_text: 'Darway Coast, Nigeria',
      imageOne_alt_text: 'Project detail',
      imageTwo_alt_text: 'Project detail',
    },
    {
      projectId: '04',
      title: 'Hotspot Network',
      location: 'Kano State',
      year: '2023',
      capital: '₦955m',
      capacity: '324KW',
      category: 'Telecoms',
      image:
        'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=800&auto=format&fit=crop',
      imageOne:
        'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=800&auto=format&fit=crop',
      imageTwo:
        'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=800&auto=format&fit=crop',
      description:
        'Expanding rural telephony and energy access through innovative solar-powered base stations.',
      problem:
        'Remote rural areas suffer from lack of connectivity and energy access, hindering economic development and social inclusion.',
      solution:
        'Installation of solar-powered telecommunication base stations that serve as community energy hubs.',
      impact:
        'Connected 50,000 people to mobile networks and provided charging services to 5,000 households.',
      image_alt_text: 'Hotspot Network',
      imageOne_alt_text: 'Project detail',
      imageTwo_alt_text: 'Project detail',
    },
    {
      projectId: '03',
      title: 'Prado Power Energy',
      location: 'Jigawa State',
      year: '2024',
      capital: '₦1.95bn',
      capacity: '850kW',
      category: 'Agro-Processing',
      image:
        'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop',
      imageOne:
        'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop',
      imageTwo:
        'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop',
      description:
        'Agro-processing solar hybrid solution powering industrial growth in the northern region.',
      problem: 'Post-harvest loss exceeding 40% due to lack of local power for processing and cold storage.',
      solution: 'Industrial-scale solar hybrid solution tailored for agro-processing hubs.',
      impact:
        'Processed 5,000 tonnes of produce, creating 300 direct jobs and significantly reducing food waste.',
      image_alt_text: 'Prado Power Energy',
      imageOne_alt_text: 'Project detail',
      imageTwo_alt_text: 'Project detail',
    },
  ],
};

export const MAP_DEFAULTS: MapContent = {
  eyebrow: 'National Footprint',
  headingPrimary: 'Geographical ',
  headingSecondary: 'Distribution',
  statValue: '35',
  statLabel: 'States',
  body:
    'Collectively, renewable energy projects located in 35 states across the six geo-political zones in Nigeria have been approved for co-financing by the Facility.',
  ctaLabel: 'View Locations',
  fsdAfricaLogoSvg: null,
  categories: [
    { label: 'All' },
    { label: 'Solar Grid' },
    { label: 'Hydro' },
    { label: 'Biofuel' },
    { label: 'Telecoms' },
  ],
  // Coordinates match the 744x600 viewBox of @svg-maps/nigeria.
  markers: [
    { name: 'Lagos', x: '85', y: '490' },
    { name: 'Abuja', x: '320', y: '290' },
    { name: 'Rivers', x: '290', y: '520' },
    { name: 'Kano', x: '370', y: '110' },
    { name: 'Gombe', x: '530', y: '200' },
    { name: 'Ondo', x: '190', y: '430' },
    { name: 'Cross River', x: '420', y: '480' },
    { name: 'Edo', x: '230', y: '450' },
    { name: 'Kaduna', x: '310', y: '200' },
  ],
  activeStates: [
    'gombe', 'nasarawa', 'edo', 'ondo', 'cross-river', 'akwa-ibom', 'benue', 'rivers', 'abia',
    'kaduna', 'kano', 'oyo', 'bauchi', 'katsina', 'jigawa', 'sokoto', 'zamfara', 'kebbi',
    'kogi', 'kwara', 'taraba', 'adamawa', 'borno', 'yobe', 'plateau', 'niger', 'ekiti',
    'osun', 'ogun', 'lagos', 'fct',
  ].map((stateId) => ({ stateId })),
};

export const STORIES_DEFAULTS: StoriesContent = {
  eyebrow: 'Stories',
  heading: 'Featured Stories',
  roleLabel: 'ROLE',
  locationLabel: 'LOCATION',
  typeLabel: 'TYPE',
  viewTabs: [
    { tabId: 'card', label: 'Card View' },
    { tabId: 'list', label: 'List View' },
  ],
  stories: [
    {
      title: 'Meet Felicia Adindu-End User, Darway Coast',
      role: 'Community Voice',
      location: 'Rivers State',
      storyType: 'Video Testimonial',
      badge: 'Case Study',
      image:
        'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop',
      image_alt_text: 'Meet Felicia Adindu-End User, Darway Coast',
      excerpt:
        'In Akpoku, Rivers State, Felicia Adindu once struggled with unreliable energy. Now, clean solar power has transformed her daily life and business.',
      duration: '4:32 mins',
    },
    {
      title: 'ACOB Lighting Solar Powered Rural Electrification Project',
      role: 'Developer',
      location: 'Akwa-Ibom & Benue States',
      storyType: 'Video Testimonial',
      badge: 'Tech Showcase',
      image:
        'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop',
      image_alt_text: 'ACOB Lighting Solar Powered Rural Electrification Project',
      excerpt:
        'Investing in clean energy means investing in communities. How ACOB Lighting is powering local development in northern regions.',
      duration: '3:15 mins',
    },
    {
      title: 'Prado Power Solar Powered Rural Electrification Project',
      role: 'Developer',
      location: 'Cross River State',
      storyType: 'Video Testimonial',
      badge: 'Milestone Focus',
      image:
        'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?q=80&w=800&auto=format&fit=crop',
      image_alt_text: 'Prado Power Solar Powered Rural Electrification Project',
      excerpt:
        'The project will construct solar-hybrid mini-grid installations to power households and small businesses in off-grid rural areas.',
      duration: '5:40 mins',
    },
  ],
};

export const NEWS_DEFAULTS: NewsContent = {
  eyebrow: 'Media Center',
  heading: 'Latest News & Updates',
  readArticleLabel: 'Read Article',
  ctaLabel: 'View All News',
  ctaHref: '/news',
  viewTabs: [
    { tabId: 'card', label: 'Card View' },
    { tabId: 'list', label: 'List View' },
  ],
  // Unused: the homepage cards now read the News page's article list via
  // `getNewsArticles`, so this section supplies labels only. Kept because the
  // Strapi component still declares the field.
  articles: [],
};

export const NET_ZERO_DEFAULTS: NetZeroContent = {
  cardTitle: 'NET ZERO',
  cardSubtitle: 'Strategy Report 2025',
  cardBody:
    'Our commitment to a sustainable future through strategic decarbonization and green investment.',
  eyebrow: 'Our Goal',
  heading: 'Aiming For Net Zero',
  body:
    'The Facility will use its impact seeking capital to blend the cost of Eligible Green Projects aimed at fulfilling two main environmental objectives: climate change mitigation and energy transition to a low-carbon economy.',
  image:
    'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?q=80&w=2070&auto=format&fit=crop',
  image_alt_text: 'Nature and Energy',
  features: [
    {
      title: 'Energy Efficiency',
      description:
        'Investing in technologies that maximize output while minimizing consumption across industrial and residential sectors.',
    },
    {
      title: 'GHG Reduction',
      description:
        'Quantifiable reduction of greenhouse gas emissions through verified renewable energy project implementation.',
    },
  ],
};

export const STRUCTURED_DATA_DEFAULTS: StructuredDataContent = {
  organizationName: 'Climate Finance Blending Facility (CFBF)',
  url: 'https://climatesupportfacility.org',
  logoUrl: 'https://climatesupportfacility.org/logo.png',
  logoUrl_alt_text: 'Climate Finance Blending Facility (CFBF)',
  description:
    'A catalytic facility managed by InfraCredit and capitalized with UK FCDO concessional capital and British International Investment (BII) funding to de-risk green investments in local currency.',
  siteName: 'Climate Finance Blending Facility | CFBF',
  sponsors: [
    { name: 'UK Foreign, Commonwealth & Development Office (FCDO)' },
    { name: 'British International Investment (BII)' },
  ],
};
