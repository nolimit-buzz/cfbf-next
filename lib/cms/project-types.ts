/**
 * Shape of one entry from Strapi's `api::project.project` collection type
 * (`cms/src/api/project/content-types/project/schema.json`) — one record per
 * case study at `/projects/[id]`.
 */
export interface ProjectGalleryItem {
  image: string;
  image_alt_text: string;
  caption: string;
}

export interface ProjectVideoItem {
  videoId: string;
  title: string;
  category: string;
  youtubeId: string;
}

export interface ProjectRecord {
  projectId: string;
  title: string;
  location: string;
  year: string;
  capital: string;
  capacity: string;
  category: string;
  connections: string;
  jobs: string;
  ghg: string;
  status: string;
  image: string;
  image_alt_text: string;
  desc: string;
  problem: string;
  solution: string;
  impact: string;
  financing: string;
  impact_desc: string;
  financingInstrument: string;
  introTitle: string;
  sdgs: string;
  states: string;
  /** The "Illustrative transaction structure" section's video. */
  structureVideoUrl: string;
  gallery: ProjectGalleryItem[];
  videos: ProjectVideoItem[];
}
