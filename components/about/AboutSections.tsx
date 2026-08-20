"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import AboutHero from '@/components/about/AboutHero'; // Above fold — keep eager
import StickyAboutNav from '@/components/ui/StickyAboutNav';
import type {
  AboutAudienceSection,
  AboutCapitalStackSection,
  AboutDownloadCtaSection,
  AboutEnergyMapSection,
  AboutFrameworkSection,
  AboutHeroSection,
  AboutMandateSection,
  AboutMarketSection,
  AboutMilestonesSection,
  AboutNextStepsSection,
  AboutPartnersSection,
  AboutStickyNavSection,
} from '@/lib/cms/about-types';

// Below-fold — lazy loaded to prevent simultaneous hydration
const MandateSection = dynamic(() => import('@/components/about/MandateSection'), { ssr: false });
const MarketSection = dynamic(() => import('@/components/about/MarketSection'), { ssr: false });
const EnergyAccessMap = dynamic(() => import('@/components/about/EnergyAccessMap'), {
  ssr: false,
  loading: () => <div className="h-96 w-full bg-brand-dark/40 animate-pulse rounded-lg" />,
});
const FrameworkSection = dynamic(() => import('@/components/about/FrameworkSection'), { ssr: false });
const PartnerShowcase = dynamic(() => import('@/components/about-v3/PartnerShowcase'), { ssr: false });
const MilestonesTimelineV3 = dynamic(() => import('@/components/about-v3/MilestonesTimelineV3'), { ssr: false });
const AudienceConsole = dynamic(() => import('@/components/about-v3/AudienceConsole'), { ssr: false });
const NextStepsSection = dynamic(() => import('@/components/about/NextStepsSection'), { ssr: false });
const DownloadCta = dynamic(() => import('@/components/about/DownloadCta'), { ssr: false });

const MIN_PROJECT_SIZE = 5;
const MAX_PROJECT_SIZE = 30;

export interface AboutSectionsProps {
  hero?: AboutHeroSection;
  stickyNav?: AboutStickyNavSection;
  mandate?: AboutMandateSection;
  market?: AboutMarketSection;
  energyMap?: AboutEnergyMapSection;
  framework?: AboutFrameworkSection;
  capitalStack?: AboutCapitalStackSection;
  partners?: AboutPartnersSection;
  milestones?: AboutMilestonesSection;
  audience?: AboutAudienceSection;
  nextSteps?: AboutNextStepsSection;
  downloadCta?: AboutDownloadCtaSection;
  loadingLabel: string;
}

function AboutSectionsContent(props: AboutSectionsProps) {
  const {
    hero, stickyNav, mandate, market, energyMap, framework,
    capitalStack, partners, milestones, audience, nextSteps, downloadCta,
  } = props;

  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [projectSize, setProjectSize] = useState<number>(15);
  const [isSimulatorExpanded, setIsSimulatorExpanded] = useState(false);

  // Deep linking projectSize parameter. Read from `window.location.search` (not
  // `useSearchParams()`) so this component never needs a Suspense boundary —
  // wrapping the whole page in one caused it to be excluded from the static/SSR
  // shell, leaving only the loading fallback in the served HTML.
  useEffect(() => {
    const sizeParam = new URLSearchParams(window.location.search).get('projectSize');
    if (sizeParam) {
      const parsed = parseFloat(sizeParam);
      if (!isNaN(parsed) && parsed >= MIN_PROJECT_SIZE && parsed <= MAX_PROJECT_SIZE) {
        setProjectSize(parsed);
      }
    }
  }, []);

  // Opt-in diagnostic: shows whether each section rendered from the CMS or from
  // its bundled defaults. Off unless NEXT_PUBLIC_CMS_DEBUG=1, so visitors never
  // see it — but available in production, which a NODE_ENV check could not do.
  // The NEXT_PUBLIC_ prefix is required (this runs in the browser); note that it
  // is inlined at build time, so toggling it on a host needs a redeploy.
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_CMS_DEBUG !== '1') return;

    const sections = {
      hero, stickyNav, mandate, market, energyMap, framework,
      capitalStack, partners, milestones, audience, nextSteps, downloadCta,
    };
    const source = Object.fromEntries(
      Object.entries(sections).map(([name, value]) => [name, value ? 'cms' : 'default'])
    );

    console.log('[cms] about sections', source, sections);
  }, [hero, stickyNav, mandate, market, energyMap, framework, capitalStack, partners, milestones, audience, nextSteps, downloadCta]);

  return (
    <div className="bg-[#FAFDFB] text-brand-dark min-h-screen relative font-sans antialiased text-left selection:bg-brand-accent selection:text-brand-dark">
      {/* ── 1. HERO — WHO WE ARE ────── */}
      <AboutHero data={hero} />

      <StickyAboutNav data={stickyNav} />

      {/* ── 2. INSTITUTIONAL MANDATE ────── */}
      <MandateSection data={mandate} onPlayVideo={() => setIsVideoOpen(true)} />

      {/* ── 3. MARKET OPPORTUNITY ────── */}
      <MarketSection data={market} />

      {/* ── 4. NIGERIA MARKET FUNDING GAP (Shared EnergyAccessMap) ────── */}
      <div id="energy-map" data-rag-chunk="about-energy-gap-map" className="scroll-mt-24 relative z-10">
        <EnergyAccessMap data={energyMap} />
      </div>

      {/* ── 5. FACILITY FRAMEWORK ────── */}
      <FrameworkSection
        data={framework}
        capitalStack={capitalStack}
        projectSize={projectSize}
        onProjectSizeChange={setProjectSize}
        isSimulatorExpanded={isSimulatorExpanded}
        onToggleSimulator={setIsSimulatorExpanded}
      />

      {/* ── 6. UNIFIED PARTNER ECOSYSTEM GRID ────── */}
      <div id="partners" data-rag-chunk="about-partner-ecosystem" className="relative z-10">
        <PartnerShowcase data={partners} />
      </div>

      {/* ── 7. MILESTONES TIMELINE ────── */}
      <div id="milestones" data-rag-chunk="about-milestones" className="relative z-10 bg-white">
        <MilestonesTimelineV3 data={milestones} />
      </div>

      {/* ── 7B. IDENTIFY YOUR ROLE ────── */}
      <div id="audience" data-rag-chunk="about-audience-console" className="relative z-10 bg-white">
        <AudienceConsole data={audience} />
      </div>

      {/* ── 8. NEXT STEPS ────── */}
      <NextStepsSection data={nextSteps} />

      {/* ── 9. DOWNLOAD CTA (Factsheet & Prospectus visual banner) ────── */}
      <DownloadCta data={downloadCta} />
    </div>
  );
}

/**
 * Client boundary for the About page.
 *
 * `dynamic(..., { ssr: false })` can only be used from a client component, so
 * the lazy imports live here while the CMS fetch stays in the server page.
 * Every section prop is optional — components fall back to bundled defaults.
 */
export default function AboutSections(props: AboutSectionsProps) {
  return <AboutSectionsContent {...props} />;
}
