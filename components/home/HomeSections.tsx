"use client";

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Hero from "@/components/home/Hero"; // Above fold — keep eager
import type { NewsSummary } from '@/lib/cms/news-content';
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

// Below-fold — still split into their own chunks, but server-rendered.
//
// These previously carried `{ ssr: false }`, which kept every section but the
// hero out of the HTML entirely: the CMS copy only appeared after hydration had
// downloaded seven chunks, so the page looked empty for as long as that took and
// search engines saw a hero and nothing else. Lazy loading alone gives the chunk
// splitting without costing the server render.
const AboutSectionView  = dynamic(() => import('@/components/home/About'));
const HowWeDriveImpact  = dynamic(() => import('@/components/home/Impact'));
const Projects          = dynamic(() => import('@/components/home/Projects'));
const MapSection        = dynamic(() => import('@/components/home/Map'));
const FeaturedStories   = dynamic(() => import('@/components/home/Stories'));
const LatestNews        = dynamic(() => import('@/components/home/News'));
const NetZeroSection    = dynamic(() => import('@/components/home/NetZero'));

/**
 * Client boundary for the homepage.
 *
 * Every section below is itself a client component, so the tree crosses to the
 * client here while the CMS fetch stays in the server page.
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
  newsArticles = [],
}: {
  hero?: HeroSection;
  about?: AboutSection;
  impact?: ImpactSection;
  projects?: ProjectsSection;
  map?: MapSectionData;
  stories?: StoriesSection;
  news?: NewsSection;
  netZero?: NetZeroSectionData;
  /** News page articles, shared by the hero ticker and the news cards. */
  newsArticles?: NewsSummary[];
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
      <Hero data={hero} articles={newsArticles} />
      <AboutSectionView data={about} />
      <HowWeDriveImpact data={impact} />
      <Projects data={projects} />
      <MapSection data={map} />
      <FeaturedStories data={stories} />
      <LatestNews data={news} articles={newsArticles} />
      <NetZeroSection data={netZero} />
    </>
  );
}
