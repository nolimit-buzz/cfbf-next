/**
 * Types for the Strapi `eligibility` single type.
 *
 * Shape verified against the deep-populate query built in `./eligibility.ts` and
 * the JSON schemas under `cms/src/components/eligibility-page/`.
 *
 * Notes:
 * - Media fields are plain URL strings (Cloudinary), not Strapi media objects.
 * - Every media field has a sibling `<field>_alt_text`.
 * - Names mirror the JSON schemas exactly. Where a component's field name
 *   differs from the prop the React component has always used, the mapping is
 *   done at the call site, not renamed here.
 * - Icons and colours are deliberately absent: the sector icons, the bento card
 *   accents and the serpentine arrows stay in the page's own positional maps.
 *   The CMS supplies copy only.
 */

/**
 * Fields present on every entry returned inside the dynamic zone.
 *
 * `id` is optional so the bundled fallback content in `./eligibility-defaults`
 * can reuse these types without inventing ids the CMS owns.
 */
interface ComponentBase {
  id?: number;
}

/* ----------------------------------------------------- structured data */

export interface EligibilityStructuredDataSection extends ComponentBase {
  __component: 'eligibility-page.structured-data-section';
  pageTitle: string;
  metaDescription: string;
  dcTitle: string;
  dcCreator: string;
  dcSubject: string;
  dcDescription: string;
  dcPublisher: string;
  dcLanguage: string;
  dcType: string;
  /** JSON-LD `WebPage` fields. */
  schemaName: string;
  schemaDescription: string;
  schemaPublisherName: string;
}

/* ------------------------------------------------------------- hero */

export interface EligibilitySectorItem extends ComponentBase {
  title: string;
  description: string;
  sdgBadge: string;
}

export interface EligibilityHeroSection extends ComponentBase {
  __component: 'eligibility-page.hero-section';
  /**
   * `GlassHero` renders the root crumb itself, so this is carried for parity
   * with the other pages' schemas rather than consumed.
   */
  breadcrumbLabel: string;
  currentPageLabel: string;
  eyebrow: string;
  /** The `<h1>` is split so each fragment keeps its own styling. */
  headingPartOne: string;
  headingHighlight: string;
  descriptionPrimary: string;
  /** The second paragraph wraps an inline anchor, hence the four parts. */
  descriptionSecondaryPrefix: string;
  descriptionSecondaryLinkLabel: string;
  descriptionSecondaryLinkHref: string;
  descriptionSecondarySuffix: string;
  backgroundImage: string;
  backgroundImage_alt_text: string;
  sectorsLabel: string;
  sectors: EligibilitySectorItem[];
}

/* -------------------------------------------------- criteria pillars */

export interface EligibilityCriteriaListItem extends ComponentBase {
  text: string;
}

export interface EligibilityCriteriaStatItem extends ComponentBase {
  value: string;
  label: string;
}

/**
 * One bento card.
 *
 * The four cards have genuinely different bodies — prose, an ordered list, a
 * bulleted list, a stat grid — so `listItems` and `stats` are empty on the cards
 * that do not use them, and the page indexes cards by position.
 */
export interface EligibilityCriteriaCardItem extends ComponentBase {
  heading: string;
  body: string;
  subNote: string;
  footerTag: string;
  listItems: EligibilityCriteriaListItem[];
  stats: EligibilityCriteriaStatItem[];
}

export interface EligibilityCriteriaPillarsSection extends ComponentBase {
  __component: 'eligibility-page.criteria-pillars-section';
  eyebrow: string;
  headingPartOne: string;
  headingHighlight: string;
  cards: EligibilityCriteriaCardItem[];
}

/* -------------------------------------------------- timeline workflow */

export interface EligibilityTimelineStepItem extends ComponentBase {
  stepNumber: string;
  title: string;
  description: string;
}

export interface EligibilityTimelineWorkflowSection extends ComponentBase {
  __component: 'eligibility-page.timeline-workflow-section';
  eyebrow: string;
  headingPartOne: string;
  headingHighlight: string;
  /** Prefixes each card's number, e.g. "Step" in "Step 01". */
  stepLabelPrefix: string;
  steps: EligibilityTimelineStepItem[];
}

/* -------------------------------------------------------- next steps */

export interface EligibilityPortalLinkItem extends ComponentBase {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
}

export interface EligibilityNextStepsSection extends ComponentBase {
  __component: 'eligibility-page.next-steps-section';
  eyebrow: string;
  headingPartOne: string;
  headingItalic: string;
  links: EligibilityPortalLinkItem[];
}

/* --------------------------------------------------------- final CTA */

export interface EligibilityFinalCtaSection extends ComponentBase {
  __component: 'eligibility-page.final-cta-section';
  backgroundImage: string;
  backgroundImage_alt_text: string;
  eyebrow: string;
  headingPartOne: string;
  headingHighlight: string;
  body: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  downloadCtaLabel: string;
  downloadCtaHref: string;
  downloadFileName: string;
}

/* -------------------------------------------------- assessment chrome */

export interface EligibilityAssessmentChromeSection extends ComponentBase {
  __component: 'eligibility-page.assessment-chrome-section';
  backLabel: string;
  /** The footer's back button reads "Cancel" on step 1 and "Back" afterwards. */
  cancelLabel: string;
  nextLabel: string;
  /** "Step {n} of 4" is assembled from these three. */
  stepCounterPrefix: string;
  stepCounterMiddle: string;
  stepCounterTotal: string;
  summaryBadge: string;
}

/* --------------------------------------------------- assessment steps */

export interface EligibilityAssessmentOptionItem extends ComponentBase {
  label: string;
  /**
   * The internal id the wizard stores in state — `'true'`/`'false'` for the
   * boolean questions, otherwise the literal the scoring logic switches on
   * (`'solar-grid'`, `'<2'`, `'debt'`…). Editors change `label`, never this.
   */
  value: string;
}

export interface EligibilityAssessmentQuestionItem extends ComponentBase {
  stepNumber: string;
  label: string;
  requiredMarker: string;
  helperText: string;
  options: EligibilityAssessmentOptionItem[];
}

export interface EligibilityAssessmentStepItem extends ComponentBase {
  stepNumber: string;
  title: string;
  description: string;
}

export interface EligibilityAssessmentStepsSection extends ComponentBase {
  __component: 'eligibility-page.assessment-steps-section';
  steps: EligibilityAssessmentStepItem[];
  /** All 14 questions in wizard order; the page reads them by index. */
  questions: EligibilityAssessmentQuestionItem[];
}

/* -------------------------------------------------- assessment result */

/** The three outcomes `calculateResult()` can return, looked up by `status`. */
export type EligibilityOutcomeStatus = 'qualified' | 'technical-assistance' | 'excluded';

export interface EligibilityAssessmentOutcomeItem extends ComponentBase {
  status: EligibilityOutcomeStatus;
  title: string;
  description: string;
  ctaLabel: string;
}

export interface EligibilityAssessmentLogRowItem extends ComponentBase {
  label: string;
  passLabel: string;
  failLabel: string;
}

export interface EligibilityAssessmentResultSection extends ComponentBase {
  __component: 'eligibility-page.assessment-result-section';
  readinessLabel: string;
  logHeading: string;
  outcomes: EligibilityAssessmentOutcomeItem[];
  /** Five rows, positionally matching the five checks the summary renders. */
  logRows: EligibilityAssessmentLogRowItem[];
  excludedCtaLabel: string;
  restartLabel: string;
}

/* ------------------------------------------------------------ zone */

/** Every component the `eligibility` dynamic zone can hold, in page order. */
export type EligibilityPageSection =
  | EligibilityStructuredDataSection
  | EligibilityHeroSection
  | EligibilityCriteriaPillarsSection
  | EligibilityTimelineWorkflowSection
  | EligibilityNextStepsSection
  | EligibilityFinalCtaSection
  | EligibilityAssessmentChromeSection
  | EligibilityAssessmentStepsSection
  | EligibilityAssessmentResultSection;

/** A section's editable fields — what `./eligibility-defaults` supplies. */
export type EligibilityContent<S extends EligibilityPageSection> = Omit<S, 'id' | '__component'>;
