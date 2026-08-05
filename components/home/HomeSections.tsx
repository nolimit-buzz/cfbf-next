"use client";

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Hero from "@/components/home/Hero"; // Above fold — keep eager
import type {
  AboutSection,
  HeroSection,
  ImpactSection,
  MapSectionData,
  NetZeroSectionData,
  NewsSection,
  ProjectsSection,
  StoriesSection,
} from '@/lib/cms/types';

// Below-fold — lazy loaded to prevent simultaneous hydration
const AboutSectionView  = dynamic(() => import('@/components/home/About'),   { ssr: false });
const HowWeDriveImpact  = dynamic(() => import('@/components/home/Impact'),  { ssr: false });
const Projects          = dynamic(() => import('@/components/home/Projects'), { ssr: false });
const MapSection        = dynamic(() => import('@/components/home/Map'),     { ssr: false });
const FeaturedStories   = dynamic(() => import('@/components/home/Stories'), { ssr: false });
const LatestNews        = dynamic(() => import('@/components/home/News'),    { ssr: false });
const NetZeroSection    = dynamic(() => import('@/components/home/NetZero'), { ssr: false });

/**
 * Client boundary for the homepage.
 *
 * `dynamic(..., { ssr: false })` can only be used from a client component, so
 * the lazy imports live here while the CMS fetch stays in the server page.
 * Every section prop is optional — components fall back to bundled defaults.
 */
export default function HomeSections({
  hero,
  about,
  impact,
  projects,
  map,
  stories,
  news,
  netZero,
}: {
  hero?: HeroSection;
  about?: AboutSection;
  impact?: ImpactSection;
  projects?: ProjectsSection;
  map?: MapSectionData;
  stories?: StoriesSection;
  news?: NewsSection;
  netZero?: NetZeroSectionData;
}) {
  // Opt-in diagnostic: shows whether each section rendered from the CMS or from
  // its bundled defaults. Off unless NEXT_PUBLIC_CMS_DEBUG=1, so visitors never
  // see it — but available in production, which a NODE_ENV check could not do.
  // The NEXT_PUBLIC_ prefix is required (this runs in the browser); note that it
  // is inlined at build time, so toggling it on a host needs a redeploy.
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_CMS_DEBUG !== '1') return;

    const sections = { hero, about, impact, projects, map, stories, news, netZero };
    const source = Object.fromEntries(
      Object.entries(sections).map(([name, value]) => [name, value ? 'cms' : 'default'])
    );

    console.log('[cms] home sections', source, sections);
  }, [hero, about, impact, projects, map, stories, news, netZero]);

  return (
    <>
      <Hero data={hero} />
      <AboutSectionView data={about} />
      <HowWeDriveImpact data={impact} />
      <Projects data={projects} />
      <MapSection data={map} />
      <FeaturedStories data={stories} />
      <LatestNews data={news} />
      <NetZeroSection data={netZero} />
    </>
  );
}
