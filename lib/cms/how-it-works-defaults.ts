/**
 * Bundled fallback copy for the How it works page.
 *
 * Every section merges CMS data over these with
 * `{ ...DEFAULTS, ...withoutEmpty(data) }`, so an unreachable CMS — or a single
 * field an editor blanked — degrades to the copy the page shipped with rather
 * than to nothing.
 *
 * The text matches `cms/src/seed/how-it-works-page-copy.ts`, which is what
 * pre-fills Strapi on a fresh boot. That file cannot be imported from here
 * (separate package), so the copy is duplicated; keep the two in step when
 * editing. Media URLs likewise mirror the seed's Cloudinary assets rather than
 * the wp-content originals the page used before the CMS existed.
 *
 * Colours, icons, the blur accents and the framer-motion variants are
 * deliberately absent — they live in `components/how-it-works/HowItWorksSections`
 * and are never sourced from here or from the CMS.
 */

import type {
  HowItWorksContent,
  HowItWorksFacilityStructureSection,
  HowItWorksFinancingStructureSection,
  HowItWorksHeroSection,
  HowItWorksNextStepsSection,
  HowItWorksProcessSection,
  HowItWorksStructuredDataSection,
} from './how-it-works-types';

const META_DESCRIPTION =
  'Understand the financing structure, facility architecture, and step-by-step process for accessing blended climate finance through CFBF and InfraCredit.';

const DIAGRAM_ALT =
  'CFBF facility financing structure diagram — showing capital flows from anchor funders through InfraCredit guarantee to developers and communities';

/**
 * Cloudinary media, mirroring the seed. Seven of the nine assets were uploaded
 * by another page first — the six partner logos by about-page, the hero photo by
 * eligibility-page — which is why their public ids don't read `how-it-works-page`.
 */
const CDN = 'https://res.cloudinary.com/diqfojkri/image/upload';

const HERO_IMAGE = `${CDN}/v1785840356/climate%20facility/eligibility-page/hero-background-image.jpg`;
const DIAGRAM_IMAGE = `${CDN}/v1785844207/climate%20facility/how-it-works-page/facility-structure-diagram-src.svg`;

const FCDO_LOGO = `${CDN}/v1785804895/climate%20facility/about-page/partners-group-1-partner-1-logo.png`;
const BII_LOGO = `${CDN}/v1785804896/climate%20facility/about-page/partners-group-1-partner-2-logo.png`;

const INFRACREDIT_LOGO_WHITE = `${CDN}/v1785804899/climate%20facility/about-page/partners-group-3-partner-1-logo.png`;
const INFRACREDIT_LOGO_COLOUR = `${CDN}/v1785804900/climate%20facility/about-page/partners-group-3-partner-1-logo-colour.svg`;

const FSD_AFRICA_LOGO = `${CDN}/v1785804897/climate%20facility/about-page/partners-group-2-partner-1-logo.png`;
const SHELL_FOUNDATION_LOGO = `${CDN}/v1785804898/climate%20facility/about-page/partners-group-2-partner-2-logo.png`;
const KFW_LOGO = `${CDN}/v1785844205/climate%20facility/how-it-works-page/ta-provider-3-src.png`;

export const HOW_IT_WORKS_STRUCTURED_DATA_DEFAULTS: HowItWorksContent<HowItWorksStructuredDataSection> =
  {
    schemaName: 'How it works | Climate Finance Blending Facility',
    schemaDescription: META_DESCRIPTION,
    publisherName: 'Climate Finance Blending Facility (CFBF)',
    pageTitle: 'How it works — financing structure & process | CFBF',
    metaDescription: META_DESCRIPTION,
    dcTitle: 'How it works — climate finance blending facility',
    dcCreator: 'NoLimitBuzz',
    dcSubject: 'Blended Finance, Concessional Capital, Infrastructure',
    dcDescription: 'Detailed guide on the blended finance capital flow model.',
    dcLanguage: 'en',
    dcType: 'Guidelines Document',
  };

export const HOW_IT_WORKS_HERO_DEFAULTS: HowItWorksContent<HowItWorksHeroSection> = {
  eyebrow: 'Financing structure',
  // Trailing space is deliberate: the highlight span follows immediately.
  headingPartOne: 'How it ',
  headingHighlight: 'works',
  backgroundImage: HERO_IMAGE,
  backgroundImage_alt_text: 'Hero banner',
  breadcrumbRootLabel: 'home',
  breadcrumbLabel: 'how-it-works',
  descriptionPrimary:
    "From eligibility to financial close, CFBF channels concessional first-loss capital through InfraCredit's local-currency guarantee — unlocking domestic institutional finance for off-grid energy developers.",
  descriptionSecondaryPrefix: 'The pathway below condenses our ',
  descriptionSecondaryLinkLabel: 'full nine-step process',
  descriptionSecondaryLinkHref: '#process',
  descriptionSecondarySuffix: ' into four clear phases.',
  stepCardAriaSuffix: '— jump to the full nine-step process',
  stepCardHref: '#process',
  steps: [
    {
      index: '01',
      range: 'Steps 1–2',
      title: 'Apply & Pre-qualify',
      desc: "Complete the readiness checklist, submit your Guarantee Request Letter, and pass InfraCredit's origination and eligibility screening.",
      theme: 'light',
    },
    {
      index: '02',
      range: 'Steps 3–4',
      title: 'Mandate & Credit Approval',
      desc: 'Clear KYC, execute the Mandate Letter, and secure Board Credit Committee approval after a detailed credit assessment.',
      theme: 'cyan',
    },
    {
      index: '03',
      range: 'Steps 5–7',
      title: 'Due Diligence & Structuring',
      desc: 'Undergo ESG, technical and legal due diligence, an Investment Committee No-Objection, and final Facility approval with co-financing terms.',
      theme: 'green',
    },
    {
      index: '04',
      range: 'Steps 8–9',
      title: 'Conditions & Financial Close',
      desc: 'Satisfy all Conditions Precedent, then execute the local-currency guarantee and disburse co-financing at financial close.',
      theme: 'dark',
    },
  ],
};

export const HOW_IT_WORKS_FINANCING_STRUCTURE_DEFAULTS: HowItWorksContent<HowItWorksFinancingStructureSection> =
  {
    eyebrow: 'Overview',
    headingPartOne: 'Financing ',
    headingHighlight: 'structure',
    bodyPrimary:
      'The Facility deploys impact-focused capital to offer blended first-loss and low-interest funding to qualified off-grid energy companies. These companies gain access to Nigerian Naira debt financing from domestic capital markets, backed by InfraCredit guarantees.',
    bodySecondary:
      'The initiative aims to catalyse at least 50% of funding from domestic institutional investors — including pension funds, insurance companies, and asset managers — to expand clean energy access across Nigeria.',
    bullets: [
      { text: 'Local currency (NGN) debt financing with InfraCredit guarantee' },
      { text: 'First-loss concessional capital reduces risk for private investors' },
      { text: 'Minimum 50% co-financing from domestic institutional sources' },
      { text: 'Technical assistance for developers through the facility lifecycle' },
    ],
    anchorFundersLabel: 'Anchor Funders',
    anchorFunders: [
      {
        src: FCDO_LOGO,
        src_alt_text: 'FCDO – UK Foreign, Commonwealth & Development Office',
        alt: 'FCDO – UK Foreign, Commonwealth & Development Office',
        href: 'https://www.gov.uk/government/organisations/foreign-commonwealth-development-office',
      },
      {
        src: BII_LOGO,
        src_alt_text: 'British International Investment',
        alt: 'British International Investment',
        href: 'https://www.bii.co.uk/',
      },
    ],
    coFinancingLabel: 'Co-Financing Partner',
    coFinancingPartner: {
      srcWhite: INFRACREDIT_LOGO_WHITE,
      srcWhite_alt_text: 'InfraCredit',
      srcColour: INFRACREDIT_LOGO_COLOUR,
      // Decorative hover swap of the logo above — renders alt="" aria-hidden="true".
      srcColour_alt_text: '',
      alt: 'InfraCredit',
      href: 'https://infracredit.ng/',
    },
    taProvidersLabel: 'Technical Assistance Providers',
    taProviders: [
      {
        src: FSD_AFRICA_LOGO,
        src_alt_text: 'FSD Africa',
        alt: 'FSD Africa',
        href: 'https://fsdafrica.org/',
      },
      {
        src: SHELL_FOUNDATION_LOGO,
        src_alt_text: 'Shell Foundation',
        alt: 'Shell Foundation',
        href: 'https://shellfoundation.org/',
      },
      {
        src: KFW_LOGO,
        src_alt_text: 'KfW',
        alt: 'KfW',
        href: 'https://www.kfw.de/',
      },
    ],
    taRotationMs: '2800',
  };

export const HOW_IT_WORKS_FACILITY_STRUCTURE_DEFAULTS: HowItWorksContent<HowItWorksFacilityStructureSection> =
  {
    eyebrow: 'Architecture',
    headingPartOne: 'Facility ',
    headingHighlight: 'structure',
    body: "Capital flows from anchor funders through the Facility and InfraCredit's guarantee mechanism into domestic capital markets, reaching developers and ultimately the communities they serve.",
    diagramSrc: DIAGRAM_IMAGE,
    diagramSrc_alt_text: DIAGRAM_ALT,
    diagramAlt: DIAGRAM_ALT,
  };

export const HOW_IT_WORKS_PROCESS_DEFAULTS: HowItWorksContent<HowItWorksProcessSection> = {
  eyebrow: 'Timeline workflow',
  headingPartOne: 'Process for accessing ',
  headingHighlight: 'funding',
  intro:
    'A structured nine-step pathway from initial checklist to financial close, administered by InfraCredit with Facility oversight at key milestones.',
  steps: [
    {
      step: '01',
      title: 'Checklist & request',
      desc: 'Developer completes the preliminary readiness checklist and submits a formal Guarantee Request Letter to InfraCredit.',
    },
    {
      step: '02',
      title: 'Origination check',
      desc: 'InfraCredit conducts a preliminary assessment, confirms eligibility for facility support, and obtains internal New Business Committee (NBC) approval.',
    },
    {
      step: '03',
      title: 'Mandate signing',
      desc: 'InfraCredit completes Know Your Customer (KYC) verification and the Company executes the formal Mandate Letter.',
    },
    {
      step: '04',
      title: 'Credit Committee approval',
      desc: 'InfraCredit conducts a detailed credit assessment and obtains Board Credit Committee approval.',
    },
    {
      step: '05',
      title: 'Due diligence',
      desc: 'InfraCredit conducts comprehensive Environmental & Social (ESG), technical, and legal due diligence on the project.',
    },
    {
      step: '06',
      title: 'Investment review',
      desc: "The Facility's Investment Committee/Adviser reviews project details and issues a formal No-Objection.",
    },
    {
      step: '07',
      title: 'Facility approval',
      desc: 'InfraCredit obtains final Facility Investment Approval and negotiates the co-financing agreements with the developer.',
    },
    {
      step: '08',
      title: 'CP satisfaction',
      desc: 'The Company satisfies all required Conditions Precedent (CPs) to closing.',
    },
    {
      step: '09',
      title: 'Financial close',
      desc: 'Execution of the local currency guarantee and successful co-financing disbursement.',
    },
  ],
};

export const HOW_IT_WORKS_NEXT_STEPS_DEFAULTS: HowItWorksContent<HowItWorksNextStepsSection> = {
  eyebrow: 'Next steps',
  headingPartOne: 'Explore the ',
  headingItalic: 'facility portal',
  links: [
    {
      eyebrow: 'About us',
      title: 'Who we are',
      description: 'Learn about our seed capital & mandates',
      href: '/about',
    },
    {
      eyebrow: 'Eligibility',
      title: 'Check if you qualify',
      description: 'Review criteria & pre-qualification standards',
      href: '/eligibility',
    },
    {
      eyebrow: 'Impact',
      title: 'View our impact',
      description: 'Explore carbon targets & video stories',
      href: '/impact',
    },
  ],
};
