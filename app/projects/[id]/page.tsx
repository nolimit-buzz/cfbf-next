import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import ProjectDetailPageClient, { type ClientProject } from '@/components/projects/ProjectDetailClient';
import { getProjectById, getAllProjects, STRUCTURE_VIDEO_URL } from '@/lib/cms/project';
import type { ProjectRecord } from '@/lib/cms/project-types';

export const unstable_instant = {
  prefetch: 'static',
  samples: [
    { params: { id: '01' } }
  ]
};

const PROJECT_IDS = ['01', '02', '03', '04', '05', '06'];

/**
 * Maps a CMS `ProjectRecord` onto the shape `ProjectDetailClient` renders —
 * `sdgs`/`states` used to be id-keyed lookups inline in that component
 * (`getProjectSDGs`/`PROJECT_STATES`); now they're genuine CMS fields, parsed
 * here into the same array shapes the component already expects.
 */
function toClientProject(p: ProjectRecord): ClientProject {
  return {
    id: p.projectId,
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
    problem: p.problem,
    solution: p.solution,
    impact: p.impact,
    desc: p.desc,
    financing: p.financing,
    impact_desc: p.impact_desc,
    financingInstrument: p.financingInstrument,
    intro: { title: p.introTitle },
    sdgs: p.sdgs.split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n)),
    states: p.states.split(',').map((s) => s.trim()).filter(Boolean),
    // Defensive: falls back to the shared Cloudinary copy if a live CMS record
    // is missing this field (e.g. the Strapi API hasn't been redeployed yet
    // with the new schema field, even though the DB value is already set).
    structureVideoUrl: p.structureVideoUrl || STRUCTURE_VIDEO_URL,
    gallery: p.gallery.map((g) => ({ image: g.image, caption: g.caption })),
    videos: p.videos.map((v) => ({ id: v.videoId, title: v.title, category: v.category, youtubeId: v.youtubeId })),
  };
}

interface PageProps {
  params: Promise<{ id: string }>;
}

async function ProjectDetail({ params }: PageProps) {
  const { id } = await params;

  const [project, allProjects] = await Promise.all([getProjectById(id), getAllProjects()]);

  if (!project) {
    notFound();
  }

  const currentIndex = PROJECT_IDS.indexOf(id);
  const prevId = PROJECT_IDS[(currentIndex - 1 + PROJECT_IDS.length) % PROJECT_IDS.length];
  const nextId = PROJECT_IDS[(currentIndex + 1) % PROJECT_IDS.length];

  const prevRecord = allProjects.find((p) => p.projectId === prevId);
  const nextRecord = allProjects.find((p) => p.projectId === nextId);
  const relatedProjects = allProjects
    .filter((p) => p.projectId !== project.projectId)
    .map(toClientProject);

  return (
    <ProjectDetailPageClient
      project={toClientProject(project)}
      prevProject={{ id: prevId, title: prevRecord?.title ?? '' }}
      nextProject={{ id: nextId, title: nextRecord?.title ?? '' }}
      relatedProjects={relatedProjects}
    />
  );
}

export default function ProjectDetailPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="bg-[#051F1A] min-h-screen text-white flex items-center justify-center font-mono text-xs uppercase tracking-widest">Loading case study...</div>}>
      <ProjectDetail params={params} />
    </Suspense>
  );
}
