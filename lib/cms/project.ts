// Server-only: `next/cache` cannot be imported from a client component.
import { cacheLife, cacheTag } from 'next/cache';
import { CMS_BASE_URL } from './config';
import { CMS_TIMEOUT_MS } from './fetchPage';
import { projects as staticProjects } from '@/lib/projectsData';
import type { ProjectRecord } from './project-types';

export const PROJECTS_COLLECTION_CACHE_TAG = 'project-records';

/** Ported from the id-keyed lookups that used to live inline in ProjectDetailClient.tsx. */
const SDGS_BY_ID: Record<string, string> = {
  '01': '7, 13',
  '02': '7, 13',
  '03': '7, 8, 9',
  '04': '9, 13',
  '05': '7, 13',
  '06': '7, 8, 13',
};

const STATES_BY_ID: Record<string, string> = {
  '01': 'gombe, nasarawa, ondo',
  '02': 'cross-river',
  '03': 'akwa-ibom, benue',
  '04': 'kano, fct, lagos, rivers, bauchi, kaduna, cross-river, ondo, gombe, nasarawa, edo, akwa-ibom, benue, abia, katsina, jigawa, sokoto, zamfara, kebbi, kogi, kwara, taraba, adamawa, borno, yobe, plateau, niger, ekiti, osun, ogun',
  '05': 'rivers, abia',
  '06': 'edo, ondo',
};

/**
 * Same video used across every project pre-CMS-migration — see
 * `cms/src/seed/projects-collection.ts`'s `STRUCTURE_VIDEO_URL` comment.
 * Used only as the bundled-fallback value; the CMS now owns the live one.
 */
export const STRUCTURE_VIDEO_URL =
  'https://res.cloudinary.com/diqfojkri/video/upload/v1787668726/climate%20facility/projects/structure-diagram.mp4';

function financingInstrumentFor(id: string, category: string): string {
  if (category === 'Telecoms') return 'Infrastructure Bond';
  if (id === '03') return 'Sukuk Lease Sukuk';
  return 'Co-financing / Bond';
}

/**
 * The bundled fallback — `lib/projectsData.ts`'s static records, converted to
 * the CMS shape. Same "CMS-with-bundled-default" contract as every other page:
 * used only when `getProjects()` returns empty (CMS unreachable/unpublished).
 */
const STATIC_FALLBACK: ProjectRecord[] = Object.values(staticProjects).map((p) => ({
  projectId: p.id,
  title: p.title,
  location: p.location,
  year: p.year,
  capital: p.capital,
  capacity: p.capacity,
  category: p.category,
  connections: p.connections,
  jobs: p.jobs,
  ghg: p.ghg,
  status: p.status,
  image: p.image,
  image_alt_text: p.title,
  desc: p.desc,
  problem: p.problem,
  solution: p.solution,
  impact: p.impact,
  financing: p.financing,
  impact_desc: p.impact_desc,
  financingInstrument: financingInstrumentFor(p.id, p.category),
  introTitle: p.intro.title,
  sdgs: SDGS_BY_ID[p.id] ?? '7',
  states: STATES_BY_ID[p.id] ?? '',
  structureVideoUrl: STRUCTURE_VIDEO_URL,
  gallery: p.gallery.map((g) => ({ image: g.image, image_alt_text: g.caption, caption: g.caption })),
  videos: (p.videos ?? []).map((v) => ({ videoId: v.id, title: v.title, category: v.category, youtubeId: v.youtubeId })),
}));

function reportFallback(reason: string, detail?: string) {
  console.error(
    [
      '',
      '!!! [cms] PROJECT RECORDS FELL BACK TO BUNDLED DEFAULTS !!!',
      `    reason: ${reason}`,
      `    url:    ${CMS_BASE_URL}/api/project-records`,
      ...(detail ? [`    detail: ${detail}`] : []),
      '',
    ].join('\n')
  );
}

/**
 * Fetches every `project` collection record from Strapi.
 *
 * Never throws — a CMS outage or empty collection returns `[]` so callers
 * fall back to `STATIC_FALLBACK` rather than rendering a blank page.
 */
export async function getProjects(): Promise<ProjectRecord[]> {
  'use cache';
  cacheLife('hours');
  cacheTag(PROJECTS_COLLECTION_CACHE_TAG);

  const query =
    'populate[gallery][populate]=*&populate[videos][populate]=*&pagination[pageSize]=100';
  const url = `${CMS_BASE_URL}/api/project-records?${query}`;

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(CMS_TIMEOUT_MS) });

    if (!res.ok) {
      const body = await res.text().catch(() => '<unreadable body>');
      reportFallback(
        `HTTP ${res.status} ${res.statusText}`,
        `${body.slice(0, 300).replace(/\s+/g, ' ').trim()}${body.length > 300 ? '…' : ''}`
      );
      return [];
    }

    const json = (await res.json()) as { data: ProjectRecord[] | null };
    const records = json.data ?? [];

    if (records.length === 0) {
      reportFallback('CMS responded 200 but returned no records', 'are the entries published?');
    }

    return records;
  } catch (err) {
    const timedOut = err instanceof Error && err.name === 'TimeoutError';
    reportFallback(
      timedOut ? `no response within ${CMS_TIMEOUT_MS}ms` : 'request failed',
      err instanceof Error ? err.message : String(err)
    );
    return [];
  }
}

/** `getProjects()` with the bundled fallback applied — the one every caller should use. */
export async function getAllProjects(): Promise<ProjectRecord[]> {
  const records = await getProjects();
  return records.length > 0 ? records : STATIC_FALLBACK;
}

export async function getProjectById(id: string): Promise<ProjectRecord | null> {
  const all = await getAllProjects();
  return all.find((p) => p.projectId === id) ?? null;
}
