/**
 * Types for the Strapi `home` single type.
 *
 * Shape verified against
 * GET /api/home?populate[sections][populate]=*
 *
 * Notes:
 * - Media fields are plain URL strings (Cloudinary), not Strapi media objects.
 * - Every media field has a sibling `<field>_alt_text`.
 * - The dynamic zone nests exactly two levels: section -> repeatable component.
 */

/**
 * Fields present on every entry returned inside the dynamic zone.
 *
 * `id` is optional so the bundled fallback content in `defaults.ts` can reuse
 * these types without inventing ids the CMS owns.
 */
interface ComponentBase {
  id?: number;
}

/* ---------------------------------------------------------------- hero */

export interface HeroStat extends ComponentBase {
  value: string;
  label: string;
}

export interface HeroSection extends ComponentBase {
  __component: 'home-page.hero-section';
  headingPrimary: string;
  headingSecondary: string;
  subheadline: string;
  ctaLabel: string;
  ctaHref: string;
  newsCtaLabel: string;
  backgroundImage: string;
  backgroundImage_alt_text: string;
  backgroundVideo: string;
  certificationBadge: string;
  certificationBadge_alt_text: string;
  stats: HeroStat[];
}

/* --------------------------------------------------------------- about */

export interface AboutPartner extends ComponentBase {
  name: string;
}

export interface AboutSection extends ComponentBase {
  __component: 'home-page.about-section';
  eyebrow: string;
  headingPrimary: string;
  headingSecondary: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  partnersHeading: string;
  statValue: string;
  statDescription: string;
  image: string;
  image_alt_text: string;
  partners: AboutPartner[];
}

/* -------------------------------------------------------------- impact */

export interface ImpactTab extends ComponentBase {
  tabId: string;
  label: string;
  title: string;
  description: string;
}

export interface ImpactMetricCard extends ComponentBase {
  /** Arrives as a string; `CountUp` needs a number. */
  value: string;
  suffix: string | null;
  label: string;
  image: string | null;
  image_alt_text: string | null;
}

export interface ImpactStat extends ComponentBase {
  value: string;
  label: string;
}

export interface ImpactGallerySlide extends ComponentBase {
  image: string;
  description: string;
  image_alt_text: string | null;
}

export interface ImpactReport extends ComponentBase {
  reportId: string;
  tag: string;
  title: string;
  size: string;
}

export interface ImpactTheoryCard extends ComponentBase {
  cardId: string;
  cardType: 'image' | 'solid';
  subtitle: string;
  title: string;
  description: string;
  image: string | null;
  image_alt_text: string | null;
  link: string;
  linkLabel: string;
}

export interface ImpactSection extends ComponentBase {
  __component: 'home-page.impact-section';
  eyebrow: string;
  headingPrimary: string;
  headingSecondary: string;
  numbersCtaLabel: string;
  reportCtaLabel: string;
  reportFileName: string;
  reportFileHref: string;
  capacityCtaLabel: string;
  statsCardEyebrow: string;
  galleryCtaLabel: string;
  knowledgeHubTitle: string;
  knowledgeHubSubtitle: string;
  theoryEyebrow: string;
  theoryHeadingPrimary: string;
  theoryHeadingSecondary: string;
  theoryFooterLabel: string;
  tabs: ImpactTab[];
  metricCards: ImpactMetricCard[];
  capacityStats: ImpactStat[];
  gallerySlides: ImpactGallerySlide[];
  reports: ImpactReport[];
  theoryCards: ImpactTheoryCard[];
}

/* ------------------------------------------------------------ projects */

/** A tab in a view-mode switcher (`list` / `grid`, `card` / `list`). */
export interface ViewTab extends ComponentBase {
  tabId: string;
  label: string;
}

export interface CategoryOption extends ComponentBase {
  label: string;
}

export interface ProjectEntry extends ComponentBase {
  projectId: string;
  title: string;
  location: string;
  year: string;
  capital: string;
  capacity: string;
  category: string;
  image: string;
  imageOne: string | null;
  imageTwo: string | null;
  description: string;
  problem: string;
  solution: string;
  impact: string;
  image_alt_text: string | null;
  imageOne_alt_text: string | null;
  imageTwo_alt_text: string | null;
}

export interface ProjectsSection extends ComponentBase {
  __component: 'home-page.projects-section';
  eyebrow: string;
  heading: string;
  capitalLabel: string;
  capacityLabel: string;
  challengeLabel: string;
  solutionLabel: string;
  impactLabel: string;
  detailCtaLabel: string;
  ctaLabel: string;
  ctaHref: string;
  viewTabs: ViewTab[];
  categories: CategoryOption[];
  projects: ProjectEntry[];
}

/* ----------------------------------------------------------------- map */

export interface MapMarker extends ComponentBase {
  name: string;
  /** Coordinates arrive as strings in the 744x600 viewBox space. */
  x: string;
  y: string;
}

export interface MapActiveState extends ComponentBase {
  stateId: string;
}

export interface MapSectionData extends ComponentBase {
  __component: 'home-page.map-section';
  eyebrow: string;
  headingPrimary: string;
  headingSecondary: string;
  statValue: string;
  statLabel: string;
  body: string;
  ctaLabel: string;
  fsdAfricaLogoSvg: string | null;
  categories: CategoryOption[];
  markers: MapMarker[];
  activeStates: MapActiveState[];
}

/* ------------------------------------------------------------- stories */

export interface StoryEntry extends ComponentBase {
  title: string;
  role: string;
  location: string;
  storyType: string;
  badge: string;
  image: string;
  image_alt_text: string | null;
  excerpt: string;
  duration: string;
}

export interface StoriesSection extends ComponentBase {
  __component: 'home-page.stories-section';
  eyebrow: string;
  heading: string;
  roleLabel: string;
  locationLabel: string;
  typeLabel: string;
  viewTabs: ViewTab[];
  stories: StoryEntry[];
}

/* ---------------------------------------------------------------- news */

export interface NewsArticleEntry extends ComponentBase {
  articleId: string;
  tag: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
  author: string;
  authorAvatar: string | null;
  authorAvatar_alt_text: string | null;
  image: string;
  image_alt_text: string | null;
  keyContext: string | null;
}

export interface NewsSection extends ComponentBase {
  __component: 'home-page.news-section';
  eyebrow: string;
  heading: string;
  readArticleLabel: string;
  ctaLabel: string;
  ctaHref: string;
  viewTabs: ViewTab[];
  articles: NewsArticleEntry[];
}

/* ------------------------------------------------------------ net zero */

export interface NetZeroFeature extends ComponentBase {
  title: string;
  description: string;
}

export interface NetZeroSectionData extends ComponentBase {
  __component: 'home-page.net-zero-section';
  cardTitle: string;
  cardSubtitle: string;
  cardBody: string;
  eyebrow: string;
  heading: string;
  body: string;
  image: string;
  image_alt_text: string;
  features: NetZeroFeature[];
}

/* ----------------------------------------------------- structured data */

export interface StructuredDataSponsor extends ComponentBase {
  name: string;
}

export interface StructuredDataSection extends ComponentBase {
  __component: 'home-page.structured-data-section';
  organizationName: string;
  url: string;
  logoUrl: string;
  logoUrl_alt_text: string;
  description: string;
  siteName: string;
  sponsors: StructuredDataSponsor[];
}

/* --------------------------------------------------------------- union */

export type HomeSection =
  | HeroSection
  | AboutSection
  | ImpactSection
  | ProjectsSection
  | MapSectionData
  | StoriesSection
  | NewsSection
  | NetZeroSectionData
  | StructuredDataSection;

/** Maps a `__component` string to its section type, for `pickSection`. */
export type SectionByComponent = {
  [S in HomeSection as S['__component']]: S;
};

/**
 * The content a section component actually renders: every CMS field minus the
 * Strapi bookkeeping. Components take the section as an optional prop and merge
 * it over a default of this shape, so the result is always fully populated.
 */
type Content<S extends HomeSection> = Omit<S, 'id' | '__component'>;

export type HeroContent = Content<HeroSection>;
export type AboutContent = Content<AboutSection>;
export type ImpactContent = Content<ImpactSection>;
export type ProjectsContent = Content<ProjectsSection>;
export type MapContent = Content<MapSectionData>;
export type StoriesContent = Content<StoriesSection>;
export type NewsContent = Content<NewsSection>;
export type NetZeroContent = Content<NetZeroSectionData>;
export type StructuredDataContent = Content<StructuredDataSection>;

export interface HomeResponse {
  data: {
    id: number;
    documentId: string;
    sections: HomeSection[];
  } | null;
}
