/**
 * Types for the Strapi `how-it-works` single type.
 *
 * Shape verified against the deep-populate query built in `./how-it-works.ts`
 * and the JSON schemas under `cms/src/components/how-it-works-page/`.
 *
 * Notes:
 * - Media fields are plain URL strings (Cloudinary), not Strapi media objects.
 * - Every media field has a sibling `<field>_alt_text`.
 * - Names mirror the JSON schemas exactly. Where a component's field name
 *   differs from the prop the React component has always used, the mapping is
 *   done at the call site, not renamed here.
 * - Colours, icons, the blur accents and the framer-motion variants are
 *   deliberately absent: they stay in the page's own constants. The CMS
 *   supplies copy only.
 */

/**
 * Fields present on every entry returned inside the dynamic zone.
 *
 * `id` is optional so the bundled fallback content in
 * `./how-it-works-defaults` can reuse these types without inventing ids the
 * CMS owns.
 */
interface ComponentBase {
  id?: number;
}

/* ----------------------------------------------------- structured data */

export interface HowItWorksStructuredDataSection extends ComponentBase {
  __component: 'how-it-works-page.structured-data-section';
  pageTitle: string;
  metaDescription: string;
  dcTitle: string;
  dcCreator: string;
  dcSubject: string;
  dcDescription: string;
  dcLanguage: string;
  dcType: string;
  /**
   * JSON-LD `WebPage` fields. Unlike the other pages' schemas this one has no
   * `dcPublisher`, and names the organisation `publisherName` rather than
   * `schemaPublisherName`.
   */
  schemaName: string;
  schemaDescription: string;
  publisherName: string;
}

/* ------------------------------------------------------------- hero */

export interface HowItWorksHeroStepItem extends ComponentBase {
  index: string;
  range: string;
  title: string;
  desc: string;
  /**
   * Free text in Strapi, narrowed to `StepTheme` at the call site — an editor's
   * typo must not be able to break `StepCard`'s typing.
   */
  theme: string;
}

export interface HowItWorksHeroSection extends ComponentBase {
  __component: 'how-it-works-page.hero-section';
  eyebrow: string;
  /** The `<h1>` is split so each fragment keeps its own styling. */
  headingPartOne: string;
  headingHighlight: string;
  backgroundImage: string;
  backgroundImage_alt_text: string;
  /**
   * `GlassHero` renders the root crumb itself, so this is carried for parity
   * with the other pages' schemas rather than consumed.
   */
  breadcrumbRootLabel: string;
  breadcrumbLabel: string;
  descriptionPrimary: string;
  /** The second paragraph wraps an inline anchor, hence the four parts. */
  descriptionSecondaryPrefix: string;
  descriptionSecondaryLinkLabel: string;
  descriptionSecondaryLinkHref: string;
  descriptionSecondarySuffix: string;
  /** Fixed tail of each card's `aria-label`; the card title is the head. */
  stepCardAriaSuffix: string;
  stepCardHref: string;
  steps: HowItWorksHeroStepItem[];
}

/* ---------------------------------------------- financing structure */

export interface HowItWorksBulletItem extends ComponentBase {
  text: string;
}

export interface HowItWorksPartnerLogoItem extends ComponentBase {
  src: string;
  src_alt_text: string;
  alt: string;
  href: string;
}

export interface HowItWorksCoFinancingPartner extends ComponentBase {
  srcWhite: string;
  srcWhite_alt_text: string;
  srcColour: string;
  /** Empty by design: the colour logo is a decorative hover swap of the white one. */
  srcColour_alt_text: string;
  alt: string;
  href: string;
}

export interface HowItWorksFinancingStructureSection extends ComponentBase {
  __component: 'how-it-works-page.financing-structure-section';
  eyebrow: string;
  headingPartOne: string;
  headingHighlight: string;
  bodyPrimary: string;
  bodySecondary: string;
  bullets: HowItWorksBulletItem[];
  anchorFundersLabel: string;
  anchorFunders: HowItWorksPartnerLogoItem[];
  coFinancingLabel: string;
  coFinancingPartner: HowItWorksCoFinancingPartner;
  taProvidersLabel: string;
  taProviders: HowItWorksPartnerLogoItem[];
  /** Milliseconds, held as a string by the schema — parsed at the call site. */
  taRotationMs: string;
}

/* ----------------------------------------------- facility structure */

export interface HowItWorksFacilityStructureSection extends ComponentBase {
  __component: 'how-it-works-page.facility-structure-section';
  eyebrow: string;
  headingPartOne: string;
  headingHighlight: string;
  body: string;
  diagramSrc: string;
  /** Sibling of `diagramSrc` by convention; `diagramAlt` is what renders. */
  diagramSrc_alt_text: string;
  diagramAlt: string;
}

/* ---------------------------------------------------------- process */

export interface HowItWorksProcessStepItem extends ComponentBase {
  step: string;
  title: string;
  desc: string;
}

export interface HowItWorksProcessSection extends ComponentBase {
  __component: 'how-it-works-page.process-section';
  eyebrow: string;
  headingPartOne: string;
  headingHighlight: string;
  intro: string;
  steps: HowItWorksProcessStepItem[];
}

/* ------------------------------------------------------- next steps */

export interface HowItWorksPortalLinkItem extends ComponentBase {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
}

export interface HowItWorksNextStepsSection extends ComponentBase {
  __component: 'how-it-works-page.next-steps-section';
  eyebrow: string;
  headingPartOne: string;
  /** This heading's tail is italic serif rather than the usual highlight span. */
  headingItalic: string;
  links: HowItWorksPortalLinkItem[];
}

/* ------------------------------------------------------------ zone */

/** Every component the `how-it-works` dynamic zone can hold, in page order. */
export type HowItWorksPageSection =
  | HowItWorksStructuredDataSection
  | HowItWorksHeroSection
  | HowItWorksFinancingStructureSection
  | HowItWorksFacilityStructureSection
  | HowItWorksProcessSection
  | HowItWorksNextStepsSection;

/** A section's editable fields — what `./how-it-works-defaults` supplies. */
export type HowItWorksContent<S extends HowItWorksPageSection> = Omit<S, 'id' | '__component'>;
