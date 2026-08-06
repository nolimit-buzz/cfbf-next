/**
 * Types for the Strapi `contact` single type.
 *
 * Shape verified against the deep-populate query built in `./contact.ts` and the
 * JSON schemas under `cms/src/components/contact-page/`.
 *
 * Notes:
 * - Media fields are plain URL strings (Cloudinary), not Strapi media objects.
 * - Every media field has a sibling `<field>_alt_text`.
 * - Names mirror the JSON schemas exactly. Where a component's field name
 *   differs from the prop the React component has always used (`description` vs
 *   `StepCard`'s `desc`), the mapping is done at the call site, not renamed here.
 * - Icons and colours are deliberately absent: the lucide glyphs, the `StepTheme`
 *   surfaces and the readiness banner's green/blue palette stay in the page's own
 *   positional maps. The CMS supplies copy only.
 * - `roleTabs[].value` and `technologyParamMap[].paramValue` are internal ids the
 *   form's logic switches on, not copy, and must not be edited in Strapi.
 */

/**
 * Fields present on every entry returned inside the dynamic zone.
 *
 * `id` is optional so the bundled fallback content in `./contact-defaults` can
 * reuse these types without inventing ids the CMS owns.
 */
interface ComponentBase {
  id?: number;
}

/* ----------------------------------------------------- structured data */

export interface ContactStructuredDataSection extends ComponentBase {
  __component: 'contact-page.structured-data-section';
  pageTitle: string;
  metaDescription: string;
  /** Suspense fallback shown while the search-param-reading form mounts. */
  loadingLabel: string;
  /** JSON-LD fields — `jsonLdType` is the schema.org `@type`. */
  jsonLdType: string;
  jsonLdName: string;
  jsonLdDescription: string;
  jsonLdPublisherName: string;
}

/* ------------------------------------------------------------- hero */

/** One of the three `StepCard`s in the hero panel. */
export interface ContactHeroCardItem extends ComponentBase {
  index: string;
  title: string;
  description: string;
  /** Matches `StepTheme` in `components/ui/StepCard` — 'light' | 'cyan' | 'green'. */
  theme: string;
}

export interface ContactHeroSection extends ComponentBase {
  __component: 'contact-page.hero-section';
  /**
   * `GlassHero` renders the root crumb itself, so this is carried for parity
   * with the other pages' schemas rather than consumed.
   */
  breadcrumbLabel: string;
  eyebrow: string;
  /** The `<h1>` is split so each fragment keeps its own styling. */
  headingPartOne: string;
  headingHighlight: string;
  description: string;
  backgroundImage: string;
  backgroundImage_alt_text: string;
  cards: ContactHeroCardItem[];
}

/* ------------------------------------------------- facility contacts */

export interface ContactFacilityContactsSection extends ComponentBase {
  __component: 'contact-page.facility-contacts-section';
  heading: string;
  officeLocationLabel: string;
  /** The address renders on two lines, so it is stored as two. */
  officeAddressLineOne: string;
  officeAddressLineTwo: string;
  emailLabel: string;
  emailAddress: string;
  emailHref: string;
  phoneLabel: string;
  phoneNumber: string;
  phoneHref: string;
}

/* ---------------------------------------------- eligibility reminder */

export interface ContactEligibilityReminderSection extends ComponentBase {
  __component: 'contact-page.eligibility-reminder-section';
  eyebrow: string;
  heading: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}

/* -------------------------------------------------------- fun stats */

export interface ContactFunStatItem extends ComponentBase {
  value: string;
  label: string;
  description: string;
}

export interface ContactFunStatsSection extends ComponentBase {
  __component: 'contact-page.fun-stats-section';
  eyebrow: string;
  backgroundImage: string;
  backgroundImage_alt_text: string;
  /** Inline markup for the carousel card's TrendingUp glyph. */
  statIconSvg: string;
  stats: ContactFunStatItem[];
}

/* ----------------------------------------------------- enquiry form */

/** A role tab. `value` is an internal id, not copy — see the file header. */
export interface ContactRoleTabItem extends ComponentBase {
  value: string;
  label: string;
}

/** One `<option>`; the label doubles as the submitted value. */
export interface ContactSelectOptionItem extends ComponentBase {
  label: string;
}

/** Maps the `?tech=` query param onto a technology option label. */
export interface ContactTechMappingItem extends ComponentBase {
  paramValue: string;
  label: string;
}

export interface ContactEnquiryFormSection extends ComponentBase {
  __component: 'contact-page.enquiry-form-section';
  heading: string;
  /** Banner reads `{prefix} {score}{suffix}`. */
  readinessAlertLabelPrefix: string;
  readinessAlertLabelSuffix: string;
  qualifiedAlertBody: string;
  technicalAssistanceAlertBody: string;
  roleTabs: ContactRoleTabItem[];
  fullNameLabel: string;
  organizationLabel: string;
  emailAddressLabel: string;
  technologyTypeLabel: string;
  capacityLabel: string;
  institutionTypeLabel: string;
  investmentTrancheLabel: string;
  messageLabel: string;
  technologyOptions: ContactSelectOptionItem[];
  institutionOptions: ContactSelectOptionItem[];
  /** Keeps a literal `${score}` placeholder the form substitutes at runtime. */
  prefillIntroTemplate: string;
  prefillQualifiedBody: string;
  prefillTechnicalAssistanceBody: string;
  technologyParamMap: ContactTechMappingItem[];
  /** Used when `?tech=` matches nothing in `technologyParamMap`. */
  defaultTechnologyLabel: string;
  submitLabel: string;
}

/* ------------------------------------------------ submission success */

export interface ContactSubmissionSuccessSection extends ComponentBase {
  __component: 'contact-page.submission-success-section';
  heading: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  /** Resets the form in place, so there is no href. */
  secondaryCtaLabel: string;
}

/* -------------------------------------------------------- next steps */

export interface ContactPortalLinkItem extends ComponentBase {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
}

export interface ContactNextStepsSection extends ComponentBase {
  __component: 'contact-page.next-steps-section';
  eyebrow: string;
  headingPartOne: string;
  headingItalic: string;
  links: ContactPortalLinkItem[];
}

/* ------------------------------------------------------ download cta */

export interface ContactDownloadCtaSection extends ComponentBase {
  __component: 'contact-page.download-cta-section';
  eyebrow: string;
  heading: string;
  description: string;
  ctaLabel: string;
  fileHref: string;
  downloadFileName: string;
  backgroundImage: string;
  backgroundImage_alt_text: string;
}

/* ------------------------------------------------------------- union */

export type ContactPageSection =
  | ContactStructuredDataSection
  | ContactHeroSection
  | ContactFacilityContactsSection
  | ContactEligibilityReminderSection
  | ContactFunStatsSection
  | ContactEnquiryFormSection
  | ContactSubmissionSuccessSection
  | ContactNextStepsSection
  | ContactDownloadCtaSection;

/** A section's content without the dynamic-zone bookkeeping fields. */
export type ContactContent<S extends ContactPageSection> = Omit<S, 'id' | '__component'>;
