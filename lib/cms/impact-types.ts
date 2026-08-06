/**
 * Types for the Strapi `impact` single type.
 *
 * Shape verified against the populate query built in `./impact.ts` and the JSON
 * schemas under `cms/src/components/impact-page/`.
 *
 * Notes:
 * - Media fields are plain URL strings (Cloudinary), not Strapi media objects.
 * - Every media field has a sibling `<field>_alt_text`.
 * - Names mirror the JSON schemas exactly. Where a component's field name
 *   differs from the prop the React component has always used — the assets
 *   table's `assetId` against the old `id`, the hero stat's `category` against
 *   the old `label` — the mapping is done at the call site, not renamed here.
 * - Colours are deliberately absent: the SDG chip palette, the SDG card hexes,
 *   the story badge rotation, the net-zero wheel strokes and the asset status
 *   pills all stay in `components/impact/ImpactSections.tsx`.
 */

/**
 * Fields present on every entry returned inside the dynamic zone.
 *
 * `id` is optional so the bundled fallback content in `./impact-defaults` can
 * reuse these types without inventing ids the CMS owns.
 */
interface ComponentBase {
  id?: number;
}

/* ----------------------------------------------------- structured data */

export interface ImpactStructuredDataSection extends ComponentBase {
  __component: 'impact-page.structured-data-section';
  pageTitle: string;
  metaDescription: string;
  /** Shown by the Suspense boundary while the client tree hydrates. */
  loadingLabel: string;
}

/* ------------------------------------------------------------- hero */

export interface ImpactHeroStat extends ComponentBase {
  /** The small mono label above the value — not `label`, which sits unused. */
  category: string;
  value: string;
  label: string;
  description: string;
  sdgBadge: string;
}

export interface ImpactHeroSection extends ComponentBase {
  __component: 'impact-page.hero-section';
  breadcrumbLabel: string;
  eyebrow: string;
  /** The `<h1>` is split so each fragment keeps its own styling. */
  headingPartOne: string;
  headingHighlight: string;
  /** Two paragraphs, the second rendered muted. */
  descriptionPrimary: string;
  descriptionSecondary: string;
  backgroundImage: string;
  backgroundImage_alt_text: string;
  stats: ImpactHeroStat[];
}

/* ------------------------------------------------------- philosophy */

/** Shared by the philosophy section and the investments tab. */
export interface ImpactPillarItem extends ComponentBase {
  number: string;
  title: string;
  description: string;
}

export interface ImpactPhilosophySection extends ComponentBase {
  __component: 'impact-page.philosophy-section';
  eyebrow: string;
  headingPartOne: string;
  headingHighlight: string;
  bodyPartOne: string;
  bodyPartTwo: string;
  pillars: ImpactPillarItem[];
}

/* ---------------------------------------------------- impact console */

export interface ImpactTabItem extends ComponentBase {
  /** Keys the active-tab state; the icon is picked positionally in code. */
  tabId: string;
  label: string;
}

export interface ImpactConsoleSection extends ComponentBase {
  __component: 'impact-page.impact-console-section';
  eyebrow: string;
  headingPartOne: string;
  headingHighlight: string;
  tabs: ImpactTabItem[];
}

/* ------------------------------------------------------ stories tab */

export interface ImpactStoryItem extends ComponentBase {
  title: string;
  role: string;
  location: string;
  type: string;
  badge: string;
  excerpt: string;
  duration: string;
  image: string;
  image_alt_text: string;
  video: string;
}

export interface ImpactStoriesTabSection extends ComponentBase {
  __component: 'impact-page.stories-tab-section';
  /** "{countPrefix} 3 {countMiddle} 6 {countSuffix}". */
  countPrefix: string;
  countMiddle: string;
  countSuffix: string;
  viewMoreLabel: string;
  roleLabel: string;
  locationLabel: string;
  typeLabel: string;
  stories: ImpactStoryItem[];
}

/* ------------------------------------------------------ numbers tab */

export interface ImpactMetricItem extends ComponentBase {
  label: string;
  value: string;
  unit: string;
  description: string;
}

export interface ImpactTimelinePointItem extends ComponentBase {
  year: string;
  label: string;
}

export interface ImpactNumbersTabSection extends ComponentBase {
  __component: 'impact-page.numbers-tab-section';
  metrics: ImpactMetricItem[];
  wheelCenterYear: string;
  wheelCenterLabel: string;
  wheelProgressLabel: string;
  timelinePoints: ImpactTimelinePointItem[];
  etpLabel: string;
  etpBody: string;
  pensionLabel: string;
  pensionTargetValue: string;
  pensionCurrentLabel: string;
  pensionTargetLabel: string;
}

/* -------------------------------------------------- investments tab */

export interface ImpactSdgCardItem extends ComponentBase {
  number: string;
  title: string;
  badgeLabel: string;
  description: string;
  image: string;
  image_alt_text: string;
}

export interface ImpactInvestmentsTabSection extends ComponentBase {
  __component: 'impact-page.investments-tab-section';
  pillarsHeading: string;
  pillars: ImpactPillarItem[];
  sdgHeading: string;
  sdgCards: ImpactSdgCardItem[];
}

/* ------------------------------------------------------- assets tab */

export interface ImpactLabelItem extends ComponentBase {
  label: string;
}

export interface ImpactAssetItem extends ComponentBase {
  assetId: string;
  title: string;
  location: string;
  category: string;
  capacity: string;
  connections: string;
  jobs: string;
  ghg: string;
  capital: string;
  year: string;
  status: string;
}

export interface ImpactAssetsTabSection extends ComponentBase {
  __component: 'impact-page.assets-tab-section';
  columns: ImpactLabelItem[];
  assets: ImpactAssetItem[];
}

/* ------------------------------------------------------ next steps */

export interface ImpactPortalLinkItem extends ComponentBase {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
}

export interface ImpactNextStepsSection extends ComponentBase {
  __component: 'impact-page.next-steps-section';
  eyebrow: string;
  headingPartOne: string;
  headingItalic: string;
  links: ImpactPortalLinkItem[];
}

/* ------------------------------------------------------ video modal */

export interface ImpactVideoModalSection extends ComponentBase {
  __component: 'impact-page.video-modal-section';
  nowPlayingLabel: string;
}

/* ------------------------------------------------------------ zone */

/** Every component the `impact` dynamic zone can hold, in page order. */
export type ImpactPageSection =
  | ImpactStructuredDataSection
  | ImpactHeroSection
  | ImpactPhilosophySection
  | ImpactConsoleSection
  | ImpactStoriesTabSection
  | ImpactNumbersTabSection
  | ImpactInvestmentsTabSection
  | ImpactAssetsTabSection
  | ImpactNextStepsSection
  | ImpactVideoModalSection;

/** Maps each `__component` string to its section interface. */
export type ImpactSectionByComponent = {
  [S in ImpactPageSection as S['__component']]: S;
};

/** A section's editable fields — what `./impact-defaults` supplies. */
export type ImpactContent<S extends ImpactPageSection> = Omit<S, 'id' | '__component'>;
