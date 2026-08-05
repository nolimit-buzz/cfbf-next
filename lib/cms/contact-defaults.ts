/**
 * Bundled fallback copy for the Contact page.
 *
 * Every section merges CMS data over these with
 * `{ ...DEFAULTS, ...withoutEmpty(data) }`, so an unreachable CMS — or a single
 * field an editor blanked — degrades to the copy the page shipped with rather
 * than to nothing.
 *
 * The text matches `cms/src/seed/contact-page-copy.ts`, which is what pre-fills
 * Strapi on a fresh boot. That file cannot be imported from here (separate
 * package), so the copy is duplicated; keep the two in step when editing.
 *
 * Icons and colours are deliberately absent. The lucide glyphs, the `StepTheme`
 * card surfaces, the readiness banner's green/blue palette and the carousel
 * timing live in the page's own maps and are never sourced from here or from the
 * CMS.
 *
 * `roleTabs[].value` and `technologyParamMap[].paramValue` are present because
 * the form's logic switches on them; they are internal ids, not copy.
 */

import type {
  ContactContent,
  ContactDownloadCtaSection,
  ContactEligibilityReminderSection,
  ContactEnquiryFormSection,
  ContactFacilityContactsSection,
  ContactFunStatsSection,
  ContactHeroSection,
  ContactNextStepsSection,
  ContactStructuredDataSection,
  ContactSubmissionSuccessSection,
} from './contact-types';

const META_DESCRIPTION =
  'Get in touch with the Climate Finance Blending Facility for developer intake, investor relations, or donor partnerships.';

/** Cloudinary media, mirroring the seed's `climate facility/contact-page/`. */
const CLOUDINARY = 'https://res.cloudinary.com/diqfojkri';
const FOLDER = 'climate%20facility/contact-page';

const HERO_IMAGE = `${CLOUDINARY}/image/upload/v1785845812/${FOLDER}/hero-background-image.jpg`;
const FUN_STATS_IMAGE = `${CLOUDINARY}/image/upload/v1785845784/${FOLDER}/fun-stats-background-image.jpg`;

/**
 * The brochure CTA points at the eligibility-page asset on purpose: it is the
 * same source image, resolved rather than uploaded twice.
 */
const BROCHURE_IMAGE = `${CLOUDINARY}/image/upload/v1785840357/climate%20facility/eligibility-page/final-cta-background-image.jpg`;

/** The custom TrendingUp glyph inside the fun-stats carousel card. */
const STAT_ICON_SVG =
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
  '  <path d="M3 17L9 11L13 15L21 7" stroke="#00A788" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>\n' +
  '  <path d="M15 7H21V13" stroke="#00A788" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>\n' +
  '</svg>';

export const CONTACT_STRUCTURED_DATA_DEFAULTS: ContactContent<ContactStructuredDataSection> = {
  pageTitle: 'Contact & partnerships | CFBF',
  metaDescription: META_DESCRIPTION,
  loadingLabel: 'Loading connection portal...',
  jsonLdType: 'ContactPage',
  jsonLdName: 'Contact and Enquiries | CFBF',
  jsonLdDescription: META_DESCRIPTION,
  jsonLdPublisherName: 'Climate Finance Blending Facility (CFBF)',
};

export const CONTACT_HERO_DEFAULTS: ContactContent<ContactHeroSection> = {
  breadcrumbLabel: 'home',
  eyebrow: 'Partnership portal',
  headingPartOne: 'Connect with ',
  headingHighlight: 'our team',
  description:
    'Whether you are a clean energy developer looking for blended financing, or an institutional investor/donor looking to co-finance green transitions, reach out to our team.',
  backgroundImage: HERO_IMAGE,
  backgroundImage_alt_text: 'Hero banner',
  cards: [
    {
      index: '01',
      title: 'Developer Intake',
      description: 'Submit off-grid mini-grid, telecom, or agri-processing project profiles.',
      theme: 'light',
    },
    {
      index: '02',
      title: 'Investor Relations',
      description: 'Co-finance green tranches and explore local currency credit enhancements.',
      theme: 'cyan',
    },
    {
      index: '03',
      title: 'Donor Partnership',
      description: 'Blend concessional funds to de-risk sustainable clean energy projects.',
      theme: 'green',
    },
  ],
};

export const CONTACT_FACILITY_CONTACTS_DEFAULTS: ContactContent<ContactFacilityContactsSection> = {
  heading: 'Facility Contacts',
  officeLocationLabel: 'Office Location',
  officeAddressLineOne: 'InfraCredit House,',
  officeAddressLineTwo: 'Lagos, Nigeria.',
  emailLabel: 'Email Enquiries',
  emailAddress: 'info@infracredit.ng',
  emailHref: 'mailto:info@infracredit.ng',
  phoneLabel: 'Phone Line',
  phoneNumber: '+234 (1) 234 5678',
  phoneHref: 'tel:+23412345678',
};

export const CONTACT_ELIGIBILITY_REMINDER_DEFAULTS: ContactContent<ContactEligibilityReminderSection> =
  {
    eyebrow: 'Before you connect',
    heading: 'Verify your eligibility',
    description:
      "Save time by completing our preliminary Readiness Assessment before submitting a request. This helps confirm your project matches the facility's initial funding requirements.",
    ctaLabel: 'Go to Eligibility Check',
    ctaHref: '/eligibility',
  };

export const CONTACT_FUN_STATS_DEFAULTS: ContactContent<ContactFunStatsSection> = {
  eyebrow: 'Fun Stats & Impact',
  backgroundImage: FUN_STATS_IMAGE,
  // Decorative CSS background behind the carousel card — no alt on the source.
  backgroundImage_alt_text: '',
  statIconSvg: STAT_ICON_SVG,
  stats: [
    {
      value: '₦7.86B+',
      label: 'Active Pipeline',
      description:
        'Mobilised from domestic institutional investors and pension funds into the real economy.',
    },
    {
      value: '7,500+ tCO₂e',
      label: 'Mitigated',
      description:
        'Tonnes of annual carbon emissions avoided across active clean energy installations.',
    },
    {
      value: '100% Green',
      label: 'Certified',
      description:
        'Project transactions fully certified under Climate Bonds Initiative (CBI) standards.',
    },
    {
      value: '39,438',
      label: 'Connections',
      description: 'Projected household and SME clean energy connections powered across Nigeria.',
    },
  ],
};

export const CONTACT_ENQUIRY_FORM_DEFAULTS: ContactContent<ContactEnquiryFormSection> = {
  heading: 'Send an Enquiry',
  readinessAlertLabelPrefix: 'Readiness Verified:',
  readinessAlertLabelSuffix: '%',
  qualifiedAlertBody:
    'Form pre-filled for priority guarantee review. Complete and submit the enquiry details below.',
  technicalAssistanceAlertBody:
    'Form pre-filled for Technical Assistance application. Complete and submit the enquiry details below.',
  roleTabs: [
    { value: 'developer', label: 'Developer' },
    { value: 'investor', label: 'Investor' },
    { value: 'donor', label: 'Donor / Partner' },
  ],
  fullNameLabel: 'Full Name',
  organizationLabel: 'Organization',
  emailAddressLabel: 'Email Address',
  technologyTypeLabel: 'Technology Type',
  capacityLabel: 'Project Capacity (KW)',
  institutionTypeLabel: 'Institution Type',
  investmentTrancheLabel: 'Target Investment Tranche',
  messageLabel: 'Message / Enquiry Details',
  technologyOptions: [
    { label: 'Solar Mini-Grid' },
    { label: 'Telecom Solar Hubs' },
    { label: 'Agro-Processing Solar' },
    { label: 'Clean Cooking' },
    { label: 'Low-Carbon Public Transport' },
    { label: 'Other Green Tech' },
  ],
  institutionOptions: [
    { label: 'Pension Fund Administrator (PFA)' },
    { label: 'Insurance Company' },
    { label: 'Asset Management Fund' },
    { label: 'Development Partner / DFI' },
    { label: 'Other Corporate Investor' },
  ],
  // Single-quoted on purpose: `${score}` is a placeholder the form substitutes,
  // not a template literal.
  prefillIntroTemplate:
    'Hello CFBF Team,\n\nWe have completed the Project Readiness Assessment on your website. Our project achieved a readiness score of ${score}%.\n\n',
  prefillQualifiedBody:
    'Our project is classified as "Highly Qualified for Guarantees." We satisfy all core operational, financial, and ESG criteria, and would like to initiate the pre-qualification check and mandate letter process.',
  prefillTechnicalAssistanceBody:
    'Our project is classified as "Eligible for Technical Assistance." We meet core requirements but need project preparation support (e.g. expanding paying customer base, operational tracking) to achieve guarantee-readiness.',
  technologyParamMap: [
    { paramValue: 'solar-grid', label: 'Solar Mini-Grid' },
    { paramValue: 'cold-storage', label: 'Agro-Processing Solar' },
    { paramValue: 'clean-cooking', label: 'Clean Cooking' },
    { paramValue: 'low-carbon-transport', label: 'Low-Carbon Public Transport' },
  ],
  defaultTechnologyLabel: 'Other Green Tech',
  submitLabel: 'Send Enquiry Message',
};

export const CONTACT_SUBMISSION_SUCCESS_DEFAULTS: ContactContent<ContactSubmissionSuccessSection> = {
  heading: 'Enquiry Submitted!',
  description:
    'Thank you for reaching out to the Climate Finance Blending Facility. An investment analyst or partnership officer will contact you within 3 business days.',
  primaryCtaLabel: 'Return Home',
  primaryCtaHref: '/',
  secondaryCtaLabel: 'Send another message',
};

export const CONTACT_NEXT_STEPS_DEFAULTS: ContactContent<ContactNextStepsSection> = {
  eyebrow: 'Next steps',
  headingPartOne: 'Explore the ',
  headingItalic: 'facility portal',
  links: [
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
    {
      eyebrow: 'Impact',
      title: 'View our impact',
      description: 'Explore carbon targets and video stories',
      href: '/impact',
    },
  ],
};

export const CONTACT_DOWNLOAD_CTA_DEFAULTS: ContactContent<ContactDownloadCtaSection> = {
  eyebrow: 'Brochure & prospectus',
  heading: 'Get the technical specifications of the facility',
  description:
    'Download our comprehensive brochure outlining fund structure, eligibility guidelines, co-financing terms, and regional deployment targets.',
  ctaLabel: 'Download Brochure PDF',
  fileHref: '/download.pdf',
  downloadFileName: 'CFBF_Brochure.pdf',
  backgroundImage: BROCHURE_IMAGE,
  backgroundImage_alt_text: 'CFBF Brochure Background',
};
