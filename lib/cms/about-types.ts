/**
 * Types for the Strapi `about` single type.
 *
 * Shape verified against the deep-populate query built in `./about.ts`.
 *
 * Notes:
 * - Media fields are plain URL strings (Cloudinary), not Strapi media objects.
 * - Every media field has a sibling `<field>_alt_text`.
 * - Interfaces are prefixed `About…` because `./types` already exports
 *   `AboutSection` for the *homepage's* about block.
 * - Names here mirror the JSON schemas under `cms/src/components/about-page/`.
 *   Where a component's field name differs from the prop the React component
 *   has always used, the mapping is done at the call site, not renamed here.
 */

/**
 * Fields present on every entry returned inside the dynamic zone.
 *
 * `id` is optional so the bundled fallback content in `./about-defaults` can
 * reuse these types without inventing ids the CMS owns.
 */
interface ComponentBase {
  id?: number;
}

/* ----------------------------------------------------- structured data */

export interface AboutStructuredDataSection extends ComponentBase {
  __component: 'about-page.structured-data-section';
  pageTitle: string;
  metaDescription: string;
  dcTitle: string;
  dcCreator: string;
  dcSubject: string;
  dcDescription: string;
  dcPublisher: string;
  dcLanguage: string;
  dcType: string;
  jsonLdType: string;
  jsonLdName: string;
  jsonLdDescription: string;
  jsonLdPublisherName: string;
  loadingLabel: string;
}

/* ------------------------------------------------------------- hero */

export interface AboutHeroStat extends ComponentBase {
  cardNumber: string;
  value: string;
  label: string;
  sub: string;
}

export interface AboutHeroSliderStat extends ComponentBase {
  value: string;
  label: string;
  sub: string;
}

export interface AboutHeroSection extends ComponentBase {
  __component: 'about-page.hero-section';
  breadcrumbLabel: string;
  eyebrow: string;
  /** The `<h1>` is split so each fragment keeps its own styling. */
  headingPartOne: string;
  headingHighlight: string;
  headingPartTwo: string;
  headingItalic: string;
  bodyPartOne: string;
  bodyPartTwo: string;
  backgroundImage: string;
  backgroundImage_alt_text: string;
  /** The image tile that opens the stat row. */
  statImage: string;
  statImage_alt_text: string;
  stats: AboutHeroStat[];
  sliderStats: AboutHeroSliderStat[];
}

/* --------------------------------------------------------- sticky nav */

export interface AboutNavLink extends ComponentBase {
  sectionId: string;
  label: string;
}

export interface AboutStickyNavSection extends ComponentBase {
  __component: 'about-page.sticky-nav-section';
  links: AboutNavLink[];
}

/* ------------------------------------------------------------ mandate */

export interface AboutMandateParagraph extends ComponentBase {
  text: string;
}

export interface AboutMandateNumber extends ComponentBase {
  value: string;
  label: string;
}

export interface AboutBentoCaption extends ComponentBase {
  label: string;
  image: string;
  image_alt_text: string;
}

export interface AboutMandateSection extends ComponentBase {
  __component: 'about-page.mandate-section';
  eyebrow: string;
  heading: string;
  body: string;
  mandateHeading: string;
  numbersLabel: string;
  bentoVideo: string;
  paragraphs: AboutMandateParagraph[];
  numbers: AboutMandateNumber[];
  /**
   * Three bento tiles. The first is the video tile and uses `bentoVideo`, so
   * only its `label` is read; the other two use `image` too.
   */
  captions: AboutBentoCaption[];
}

/* ------------------------------------------------------------- market */

export interface AboutMarketCard extends ComponentBase {
  value: string;
  eyebrow: string;
  description: string;
  footer: string;
}

export interface AboutMarketSection extends ComponentBase {
  __component: 'about-page.market-section';
  eyebrow: string;
  headingPrimary: string;
  headingSecondary: string;
  bodyOne: string;
  bodyTwo: string;
  /** The photo tile sitting among the bento cards. */
  bentoImage: string;
  bentoImage_alt_text: string;
  cards: AboutMarketCard[];
}

/* --------------------------------------------------------- energy map */

export interface AboutMapTab extends ComponentBase {
  tabId: string;
  label: string;
}

export interface AboutMapState extends ComponentBase {
  /** Matches the `id` of a path in the `@svg-maps/nigeria` dataset. */
  mapId: string;
  name: string;
  connections: string;
  fundingGap: string;
  /** Numeric in Strapi (integer), so it arrives as a number, not a string. */
  unservedPct: number;
  /** Decimals — the per-technology share of this state's need. */
  grid: number;
  miniGrid: number;
  standalone: number;
}

export interface AboutEnergyMapSection extends ComponentBase {
  __component: 'about-page.energy-map-section';
  eyebrow: string;
  headingPrimary: string;
  headingSecondary: string;
  body: string;
  colHeaderRank: string;
  colHeaderState: string;
  colHeaderConnections: string;
  colHeaderGap: string;
  sourceNote: string;
  tooltipConnectionsLabel: string;
  tooltipFundingGapLabel: string;
  tooltipUnservedLabel: string;
  tooltipNeedIndexLabel: string;
  legendLabel: string;
  legendScaleLabel: string;
  /**
   * Unused. Map geometry comes from `@svg-maps/nigeria`, which keeps the
   * per-state hover and tooltip handlers attached to real elements instead of
   * an injected HTML string.
   */
  mapSvg: string;
  tabs: AboutMapTab[];
  states: AboutMapState[];
}

/* ---------------------------------------------------------- framework */

export interface AboutFrameworkCard extends ComponentBase {
  cardNumber: string;
  title: string;
  body: string;
  tag: string;
  bgImage: string;
  bgImage_alt_text: string;
}

export interface AboutFrameworkSection extends ComponentBase {
  __component: 'about-page.framework-section';
  eyebrow: string;
  headingPrimary: string;
  headingSecondary: string;
  intro: string;
  cards: AboutFrameworkCard[];
}

/* ------------------------------------------------------- capital stack */

export interface AboutStackSegment extends ComponentBase {
  title: string;
  description: string;
}

export interface AboutStackBar extends ComponentBase {
  percent: string;
  label: string;
}

export interface AboutCapitalStackSection extends ComponentBase {
  __component: 'about-page.capital-stack-section';
  eyebrow: string;
  headingPrimary: string;
  headingSecondary: string;
  collapsedBody: string;
  expandedBody: string;
  launchLabel: string;
  collapseLabel: string;
  sliderLabel: string;
  sliderUnitLabel: string;
  minLabel: string;
  maxLabel: string;
  wrapBadge: string;
  totalLabel: string;
  totalSuffix: string;
  segments: AboutStackSegment[];
  bars: AboutStackBar[];
}

/* ----------------------------------------------------------- partners */

export interface AboutPartner extends ComponentBase {
  name: string;
  role: string;
  logoText: string;
  logo: string;
  logo_alt_text: string;
  /** Optional colour variant shown on hover; falls back to `logo`. */
  logoColour: string | null;
  logoColour_alt_text: string | null;
}

export interface AboutPartnerGroup extends ComponentBase {
  category: string;
  description: string;
  partners: AboutPartner[];
}

export interface AboutPartnersSection extends ComponentBase {
  __component: 'about-page.partners-section';
  eyebrow: string;
  headingPrimary: string;
  headingSecondary: string;
  ctaLabel: string;
  ctaHref: string;
  ctaHoverLabel: string;
  groups: AboutPartnerGroup[];
}

/* --------------------------------------------------------- milestones */

export interface AboutMilestoneEvent extends ComponentBase {
  date: string;
  text: string;
}

export interface AboutMilestone extends ComponentBase {
  period: string;
  year: string;
  label: string;
  image: string;
  image_alt_text: string;
  events: AboutMilestoneEvent[];
}

export interface AboutRailYear extends ComponentBase {
  /** A year, but typed as text in Strapi — parse before doing arithmetic. */
  label: string;
}

export interface AboutMilestonesSection extends ComponentBase {
  __component: 'about-page.milestones-section';
  eyebrow: string;
  headingPrimary: string;
  headingSecondary: string;
  railYears: AboutRailYear[];
  milestones: AboutMilestone[];
}

/* ----------------------------------------------------------- audience */

export interface AboutPersonaQa extends ComponentBase {
  question: string;
  answer: string;
}

export interface AboutPersona extends ComponentBase {
  tabLabel: string;
  title: string;
  tagline: string;
  intro: string;
  ctaLabel: string;
  ctaHref: string;
  questions: AboutPersonaQa[];
}

export interface AboutAudienceSection extends ComponentBase {
  __component: 'about-page.audience-section';
  eyebrow: string;
  headingPrimary: string;
  headingSecondary: string;
  journeySuffix: string;
  questionsHeading: string;
  personas: AboutPersona[];
}

/* --------------------------------------------------------- next steps */

export interface AboutPortalLink extends ComponentBase {
  kicker: string;
  title: string;
  sub: string;
  href: string;
}

export interface AboutNextStepsSection extends ComponentBase {
  __component: 'about-page.next-steps-section';
  eyebrow: string;
  headingPrimary: string;
  headingSecondary: string;
  links: AboutPortalLink[];
}

/* ------------------------------------------------------- download CTA */

export interface AboutDownloadCtaSection extends ComponentBase {
  __component: 'about-page.download-cta-section';
  eyebrow: string;
  heading: string;
  body: string;
  backgroundImage: string;
  backgroundImage_alt_text: string;
  buttonLabel: string;
  buttonHref: string;
  downloadFileName: string;
}

/* ------------------------------------------------------------- union */

export type AboutPageSection =
  | AboutStructuredDataSection
  | AboutHeroSection
  | AboutStickyNavSection
  | AboutMandateSection
  | AboutMarketSection
  | AboutEnergyMapSection
  | AboutFrameworkSection
  | AboutCapitalStackSection
  | AboutPartnersSection
  | AboutMilestonesSection
  | AboutAudienceSection
  | AboutNextStepsSection
  | AboutDownloadCtaSection;

/** Maps each `__component` string to its section interface. */
export type AboutSectionByComponent = {
  [S in AboutPageSection as S['__component']]: S;
};

/** A section's editable fields — what `./about-defaults` supplies. */
export type AboutContent<S extends AboutPageSection> = Omit<S, 'id' | '__component'>;
