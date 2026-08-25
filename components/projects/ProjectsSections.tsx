"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, BarChart3, LayoutGrid, Download, Plus, Minus, MapPin, Zap, Leaf, Users, Wifi, ShieldCheck, ArrowRight } from 'lucide-react';
import FootprintMap from '@/components/projects/FootprintMap';
import type { FootprintData } from '@/lib/api/pue';
import type { ProjectPipelineOverride } from '@/lib/api/pipelineTotals';
import type { BusinessModelRow, BusinessModelFooter } from '@/lib/api/businessModels';
import PipelineConsole from '@/components/projects/PipelineConsole';

import GlassHero, { heroRowVariants, heroCardVariants } from '@/components/GlassHero';
import CountUp from '@/components/ui/CountUp';
import { ALL_STATES } from '@/lib/mapData';
import { withoutEmpty } from '@/lib/cms/content';
import { groupStateProjects, parseSdgs } from '@/lib/cms/projects-content';
import { downloadFile } from '@/lib/downloadFile';
import {
  PROJECTS_ANALYSIS_TAB_DEFAULTS,
  PROJECTS_ELIGIBILITY_CTA_DEFAULTS,
  PROJECTS_HERO_DEFAULTS,
  PROJECTS_NEXT_STEPS_DEFAULTS,
  PROJECTS_PIPELINE_TAB_DEFAULTS,
  PROJECTS_PORTFOLIO_TABS_DEFAULTS,
} from '@/lib/cms/projects-defaults';
import type {
  ProjectsAnalysisTabSection,
  ProjectsEligibilityCtaSection,
  ProjectsFootprintMapCopy,
  ProjectsHeroSection,
  ProjectsLgaModalSection,
  ProjectsNextStepsSection,
  ProjectsPipelineConsoleSection,
  ProjectsPipelineTabSection,
  ProjectsPortfolioTabsSection,
} from '@/lib/cms/projects-types';

/**
 * SDG chip palette.
 *
 * Stays in code on purpose: these are brand colours, not copy. The CMS supplies
 * which goals a project is aligned to (`sdgs`), never what colour they render.
 */
const SDG_INFO: Record<number, { color: string; textClass: string }> = {
  7: { color: '#FDB713', textClass: 'text-[#FDB713] border-[#FDB713]/25 bg-[#FDB713]/5' },
  8: { color: '#8F1838', textClass: 'text-[#FF4A6B] border-[#FF4A6B]/25 bg-[#FF4A6B]/5' },
  9: { color: '#F36D25', textClass: 'text-[#F36D25] border-[#F36D25]/25 bg-[#F36D25]/5' },
  13: { color: '#3F7E44', textClass: 'text-[#56C36A] border-[#56C36A]/25 bg-[#56C36A]/5' },
};

/**
 * Per-position styling for the five hero cards — grid span, surface treatment
 * and SDG badge colours. Positional rather than keyed by label so an editor
 * renaming a card cannot drop its styling; the CMS fills in the text only.
 */
const HERO_CARD_STYLES = [
  {
    span: 'md:col-span-2',
    surface: 'bg-white/[0.03] backdrop-blur-md border border-white/10 hover:bg-white/[0.06] shadow-lg',
    labelClass: 'text-gray-300',
    badgeClass: 'border-[#FDB713]/30 bg-[#FDB713]/10 text-[#FDB713]',
    badgeDot: '#FDB713',
  },
  {
    span: 'md:col-span-2',
    surface: 'bg-white/[0.03] backdrop-blur-md border border-white/10 hover:bg-white/[0.06] shadow-lg',
    labelClass: 'text-gray-300',
    badgeClass: 'border-[#56C36A]/30 bg-[#56C36A]/10 text-[#56C36A]',
    badgeDot: '#3F7E44',
  },
  {
    span: 'md:col-span-2',
    surface: 'bg-white/[0.03] backdrop-blur-md border border-white/10 hover:bg-white/[0.06] shadow-lg',
    labelClass: 'text-gray-300',
    badgeClass: 'border-[#FF4A6B]/30 bg-[#FF4A6B]/10 text-[#FF4A6B]',
    badgeDot: '#8F1838',
  },
  {
    span: 'md:col-span-3',
    surface: 'bg-[#02100d] border border-white/15 hover:bg-[#02100d]/90 shadow-md',
    labelClass: 'text-[#81C34D]',
    badgeClass: 'border-[#FDB713]/30 bg-[#FDB713]/10 text-[#FDB713]',
    badgeDot: '#FDB713',
  },
  {
    span: 'md:col-span-3',
    surface: 'bg-[#02100d] border border-white/15 hover:bg-[#02100d]/90 shadow-md',
    labelClass: 'text-[#81C34D]',
    badgeClass: 'border-[#F36D25]/30 bg-[#F36D25]/10 text-[#F36D25]',
    badgeDot: '#F36D25',
  },
];

/** Icon and accent per analysis stat box, positional for the same reason. */
const STAT_BOX_STYLES = [
  { icon: <Zap />, iconColor: '#FDB713' },
  { icon: <Leaf />, iconColor: '#56C36A' },
  { icon: <Users />, iconColor: '#FF4A6B' },
  { icon: <Wifi />, iconColor: '#81C34D' },
];

/** Icon per portfolio tab, positional. */
const TAB_ICONS = [<LayoutGrid key="pipeline" size={16} />, <BarChart3 key="analysis" size={16} />, <MapPin key="footprint" size={16} />];

// Icon Stat Box Component
const IconStatBox: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  unit?: string;
  description: string;
  iconColor: string;
  delay?: number;
}> = ({ icon, label, value, unit, description, iconColor, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay }}
    whileHover={{ y: -4, scale: 1.01 }}
    className="relative flex flex-col justify-between p-5 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[6px] min-h-[180px] group cursor-default will-change-transform transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06] shadow-lg text-left"
  >
    <div className="flex justify-between items-start">
      <span className="text-gray-300 text-[9px] font-bold uppercase tracking-[0.2em] font-mono block truncate max-w-[80%]">
        {label}
      </span>
      <div style={{ color: iconColor }} className="opacity-60 group-hover:opacity-100 transition-opacity shrink-0 [&>svg]:w-5 [&>svg]:h-5">
        {icon}
      </div>
    </div>

    <div className="my-3 flex items-baseline flex-wrap">
      <span className="text-2xl md:text-3xl font-light text-white font-sans tracking-tight">
        {value}
      </span>
      {unit && (
        <span className="text-xs text-gray-400 ml-1 font-light font-sans">{unit}</span>
      )}
    </div>

    <p className="text-gray-300 text-[10px] leading-relaxed font-sans font-light mt-auto">
      {description}
    </p>
  </motion.div>
);

export interface ProjectsSectionsProps {
  hero?: ProjectsHeroSection;
  portfolioTabs?: ProjectsPortfolioTabsSection;
  analysisTab?: ProjectsAnalysisTabSection;
  pipelineTab?: ProjectsPipelineTabSection;
  pipelineConsole?: ProjectsPipelineConsoleSection;
  eligibilityCta?: ProjectsEligibilityCtaSection;
  /** Narrowed by `pickFootprintMapCopy` on the server — see that helper. */
  footprintMap?: ProjectsFootprintMapCopy;
  lgaModal?: ProjectsLgaModalSection;
  nextSteps?: ProjectsNextStepsSection;
  /** LGA/community project data from the live InfraCredit PUE API — see `lib/api/pue.ts`. */
  footprintData?: FootprintData;
  /** Live-totals overrides per pipeline stage, keyed by stage id — see `lib/api/pipelineTotals.ts`. */
  stageOverrides?: Record<string, ProjectPipelineOverride> | null;
  /** Live "Business Models" stage table rows/footer — see `lib/api/businessModels.ts`. */
  totalSectorPipeline?: BusinessModelRow[];
  mandatedDeals?: BusinessModelRow[];
  businessModelFooter?: BusinessModelFooter | null;
  /** Live-vs-fallback status per external API call, for the browser debug log below. */
  apiDebug?: Record<string, 'live' | 'fallback'>;
}

export default function ProjectsSections(props: ProjectsSectionsProps) {
  const {
    hero, portfolioTabs, analysisTab, pipelineTab,
    pipelineConsole, eligibilityCta, footprintMap, lgaModal, nextSteps, footprintData,
    stageOverrides, totalSectorPipeline, mandatedDeals, businessModelFooter, apiDebug,
  } = props;

  const heroCopy = { ...PROJECTS_HERO_DEFAULTS, ...withoutEmpty(hero) };
  const tabsCopy = { ...PROJECTS_PORTFOLIO_TABS_DEFAULTS, ...withoutEmpty(portfolioTabs) };
  const analysisCopy = { ...PROJECTS_ANALYSIS_TAB_DEFAULTS, ...withoutEmpty(analysisTab) };
  const pipelineCopy = { ...PROJECTS_PIPELINE_TAB_DEFAULTS, ...withoutEmpty(pipelineTab) };
  const ctaCopy = { ...PROJECTS_ELIGIBILITY_CTA_DEFAULTS, ...withoutEmpty(eligibilityCta) };
  const nextStepsCopy = { ...PROJECTS_NEXT_STEPS_DEFAULTS, ...withoutEmpty(nextSteps) };

  const [activeTab, setActiveTab] = useState<'analysis' | 'pipeline' | 'footprint'>('pipeline');
  const [filter, setFilter] = useState('All');
  const [expandedProject, setExpandedProject] = useState<string | null>("01");
  // selectedState is used by the pipeline tab filter (state-based project highlighting)
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const projectsSectionRef = useRef<HTMLDivElement>(null);

  const projects = pipelineCopy.projects;
  const categories = pipelineCopy.categories.map((c) => c.label);
  const stateProjects = groupStateProjects(pipelineCopy.stateProjects);

  // Opt-in diagnostic: shows whether each section rendered from the CMS or from
  // its bundled defaults. Off unless NEXT_PUBLIC_CMS_DEBUG=1, so visitors never
  // see it — but available in production, which a NODE_ENV check could not do.
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_CMS_DEBUG !== '1') return;

    const sections = {
      hero, portfolioTabs, analysisTab, pipelineTab,
      pipelineConsole, eligibilityCta, footprintMap, lgaModal, nextSteps,
    };
    const source = Object.fromEntries(
      Object.entries(sections).map(([name, value]) => [name, value ? 'cms' : 'default'])
    );

    console.log('[cms] projects sections', source, sections);
  }, [hero, portfolioTabs, analysisTab, pipelineTab, pipelineConsole, eligibilityCta, footprintMap, lgaModal, nextSteps]);

  // Live-vs-fallback status for the three external APIs (PUE map, pipeline
  // totals, business models) — logged unconditionally so it's visible in the
  // browser console without setting NEXT_PUBLIC_CMS_DEBUG.
  useEffect(() => {
    console.log('[projects-api-debug]', apiDebug);
  }, [apiDebug]);

  const handleStateSelect = (stateId: string | null) => {
    setSelectedState(stateId);
    if (stateId) {
      setActiveTab('pipeline');

      const stateProjs = stateProjects[stateId];
      if (stateProjs && stateProjs.length > 0) {
        const firstProjName = stateProjs[0].projectName;
        const matchingProj = projects.find(p =>
          p.title.toLowerCase().includes(firstProjName.toLowerCase())
        );
        if (matchingProj) {
          setExpandedProject(matchingProj.projectId);
        }
      }

      setTimeout(() => {
        projectsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  // Calculations for totals row
  const totalCapacity = projects.reduce((sum, p) => {
    const num = parseFloat(p.capacity.replace(/[^0-9.]/g, ''));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  const totalCapital = projects.reduce((sum, p) => {
    const isMillion = p.capital.toLowerCase().includes('m');
    const num = parseFloat(p.capital.replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return sum;
    return sum + (isMillion ? num / 1000 : num);
  }, 0);

  const totalJobs = projects.reduce((sum, p) => {
    const num = parseInt(p.jobs.replace(/[^0-9]/g, ''), 10);
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  const totalGHG = projects.reduce((sum, p) => {
    const num = parseFloat(p.ghg.replace(/[^0-9.]/g, ''));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  const isProjectInSelectedState = (project: (typeof projects)[number]) => {
    if (!selectedState) return true;
    const stateProjs = stateProjects[selectedState];
    if (!stateProjs || stateProjs.length === 0) return false;
    return stateProjs.some(sp =>
      project.title.toLowerCase().includes(sp.projectName.toLowerCase())
    );
  };

  const filteredProjects = projects.filter(p => {
    const matchesCategory = filter === 'All' ? true : p.category === filter;
    const matchesState = selectedState ? isProjectInSelectedState(p) : true;
    return matchesCategory && matchesState;
  });

  return (
    <div className="bg-[#051F1A] text-white min-h-screen relative overflow-hidden pb-0 font-sans">
      {/* Decorative radial glows */}
      <div className="absolute top-[80vh] right-0 w-1/3 h-1/3 bg-brand-accent/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-1/4 h-1/4 bg-brand-accent/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Hero Showcase Section (about-v2 standard) */}
      <GlassHero
        title={<>{heroCopy.headingPartOne}<span className="text-[#9BB7B1]">{heroCopy.headingHighlight}</span></>}
        subtitle={heroCopy.eyebrow}
        currentPage="projects"
        fade="dark"
        bgImage={heroCopy.backgroundImage}
        description={<p>{heroCopy.description}</p>}
      >
        {/* Portfolio impact metrics — staggered entrance */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-6 gap-6"
          variants={heroRowVariants}
          initial="hidden"
          animate="show"
        >
          {heroCopy.stats.map((stat, idx) => {
            const style = HERO_CARD_STYLES[idx] ?? HERO_CARD_STYLES[0];
            return (
              <motion.div
                key={stat.label || idx}
                variants={heroCardVariants}
                whileHover={{ y: -4, scale: 1.01 }}
                className={`${style.surface} rounded-[6px] p-6 min-h-[220px] md:min-h-[240px] flex flex-col justify-between transition-all duration-300 group cursor-default relative ${style.span} will-change-transform`}
              >
                <div className="flex justify-between items-start">
                  <span className={`${style.labelClass} text-[10px] font-bold uppercase tracking-[0.2em] font-mono block`}>
                    {stat.label}
                  </span>
                  <ArrowUpRight size={16} className="text-[#81C34D] opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="my-4 flex items-baseline">
                  <span className="text-4xl md:text-5xl lg:text-6xl font-light text-white font-sans tracking-tight"><CountUp value={stat.value} /></span>
                  {stat.unit && (
                    <span className="text-xl md:text-2xl text-gray-400 ml-1 font-light font-sans">{stat.unit}</span>
                  )}
                </div>

                <p className="text-gray-300 text-xs md:text-sm leading-relaxed font-sans font-light">
                  {stat.description}
                </p>

                {stat.sdgBadge && (
                  <div className={`mt-4 flex items-center gap-1.5 px-2.5 py-0.5 rounded border ${style.badgeClass} text-[9px] font-bold uppercase tracking-wider self-start font-sans`}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: style.badgeDot }} />
                    {stat.sdgBadge}
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </GlassHero>

      {/* Main Page Body */}
      <div ref={projectsSectionRef} data-rag-chunk="projects-portfolio-container" className="container mx-auto px-6 pt-20 pb-0 relative z-10 text-left">
        {/* Page Section Title & Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/10 pb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-brand-accent"></div>
              <span className="text-[#81C34D] text-xs font-semibold tracking-[0.2em] uppercase font-sans">{tabsCopy.eyebrow}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-sans leading-tight tracking-tight">
              {tabsCopy.headingPartOne}<span className="text-[#9BB7B1]">{tabsCopy.headingHighlight}</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mt-3 max-w-xl font-sans font-light">
              {tabsCopy.body}
            </p>
          </div>

          {/* Page Tabs */}
          <div className="flex gap-8 mt-6 md:mt-0 border-b border-white/10 md:border-b-0 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`text-sm tracking-wide transition-all duration-300 font-sans interactive relative pb-2 flex items-center gap-2 focus:outline-none whitespace-nowrap shrink-0 ${
                activeTab === 'pipeline' ? 'text-white font-semibold' : 'text-gray-400 hover:text-gray-300 font-normal'
              }`}
            >
              {TAB_ICONS[0]}
              {tabsCopy.tabs[0]?.label}
              {activeTab === 'pipeline' && (
                <motion.div layoutId="projectsPageTabLine" className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-accent" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`text-sm tracking-wide transition-all duration-300 font-sans interactive relative pb-2 flex items-center gap-2 focus:outline-none whitespace-nowrap shrink-0 ${
                activeTab === 'analysis' ? 'text-white font-semibold' : 'text-gray-400 hover:text-gray-300 font-normal'
              }`}
            >
              {TAB_ICONS[1]}
              {tabsCopy.tabs[1]?.label}
              {activeTab === 'analysis' && (
                <motion.div layoutId="projectsPageTabLine" className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-accent" />
              )}
            </button>
            <button
              onClick={() => {
                document.getElementById('national-footprint')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="text-sm tracking-wide transition-all duration-300 font-sans interactive relative pb-2 flex items-center gap-2 focus:outline-none text-gray-400 hover:text-gray-300 font-normal whitespace-nowrap shrink-0"
            >
              {TAB_ICONS[2]}
              {tabsCopy.tabs[2]?.label}
            </button>
          </div>
        </motion.div>

        {/* Tab Contents */}
        <AnimatePresence mode="wait">
          {activeTab === 'analysis' ? (
            <motion.div
              key="analysis-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-12"
            >
              {/* Icon Stat Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {analysisCopy.statBoxes.map((box, idx) => {
                  const style = STAT_BOX_STYLES[idx] ?? STAT_BOX_STYLES[0];
                  return (
                    <IconStatBox
                      key={box.label || idx}
                      icon={style.icon}
                      label={box.label}
                      value={box.value}
                      unit={box.unit}
                      description={box.description}
                      iconColor={style.iconColor}
                      delay={idx * 0.08}
                    />
                  );
                })}
              </div>

              {/* Performance Data Table */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="bg-white/[0.02] backdrop-blur-md rounded-[6px] border border-white/10 overflow-hidden shadow-2xl"
              >
                <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h3 className="font-bold text-lg font-sans text-white">{analysisCopy.tableHeading}</h3>
                  <button
                    onClick={() => downloadFile(analysisCopy.downloadHref, 'CFBF_Impact_Report_2025.pdf')}
                    className="flex items-center gap-2 text-xs font-bold text-brand-accent uppercase tracking-wider hover:text-white transition-colors interactive font-sans focus:outline-none"
                  >
                    <Download size={14} /> {analysisCopy.downloadLabel}
                  </button>
                </div>

                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-left border-collapse whitespace-nowrap">
                     <thead>
                       <tr className="bg-white/[0.02] border-b border-white/5 text-xs font-bold uppercase tracking-wider text-gray-400 font-mono">
                         {analysisCopy.columnHeads.map((head, idx) => (
                           <th
                             key={head.label || idx}
                             className={`p-4 ${idx === 0 ? 'pl-6' : ''} ${idx === analysisCopy.columnHeads.length - 1 ? 'pr-6' : ''}`}
                           >
                             {head.label}
                           </th>
                         ))}
                       </tr>
                     </thead>
                     <tbody className="text-sm font-sans text-gray-300 divide-y divide-white/5">
                       {projects.map((p) => (
                         <tr key={p.projectId} className="hover:bg-white/[0.02] transition-colors">
                           <td className="p-4 pl-6 font-semibold">
                             <Link
                               href={`/projects/${p.projectId}`}
                               className="text-white hover:text-[#81C34D] transition-colors font-semibold text-left focus:outline-none interactive"
                             >
                               {p.title}
                             </Link>
                           </td>
                           <td className="p-4">{p.capacity}</td>
                           <td className="p-4 font-mono font-medium text-brand-accent">{p.capital}</td>
                           <td className="p-4">{p.connections}</td>
                           <td className="p-4">{p.jobs}</td>
                           <td className="p-4">{p.ghg}/yr</td>
                           <td className="p-4 pr-6">
                             <span className={`px-3 py-1 rounded-[6px] text-[10px] font-bold uppercase tracking-wide border ${
                              p.status === analysisCopy.statusOperationalLabel
                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="border-t-2 border-white/10 bg-white/[0.02] text-xs font-mono font-bold text-white uppercase tracking-wider">
                      <tr>
                        <td className="p-4 pl-6 text-gray-400 font-sans normal-case">{analysisCopy.totalsRowLabel}</td>
                        <td className="p-4 text-[#81C34D]">{totalCapacity.toLocaleString()} {analysisCopy.capacityUnit}</td>
                        <td className="p-4 text-[#81C34D]">₦{totalCapital.toFixed(2)}b</td>
                        <td className="p-4 text-[#81C34D]">
                          {projects.reduce((sum, p) => {
                            if (p.connections.toLowerCase().includes('site')) return sum;
                            const num = parseInt(p.connections.replace(/[^0-9]/g, ''), 10);
                            return sum + (isNaN(num) ? 0 : num);
                          }, 0).toLocaleString()} {analysisCopy.totalsConnectionsSuffix}
                        </td>
                        <td className="p-4 text-[#81C34D]">{totalJobs.toLocaleString()}</td>
                        <td className="p-4 text-[#81C34D]">
                          {totalGHG.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })} {analysisCopy.ghgUnit}
                        </td>
                        <td className="p-4 pr-6"></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="pipeline-tab"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              {selectedState && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between bg-white/[0.02] border border-[#81C34D]/30 p-4 rounded-[6px] mb-4 text-xs md:text-sm font-sans"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="text-[#81C34D]" size={16} />
                    <span>
                      {pipelineCopy.filterBannerPrefix} <strong className="text-white">{ALL_STATES.find(s => s.mapId === selectedState)?.name} {pipelineCopy.stateSuffix}</strong>
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedState(null)}
                    className="text-[10px] font-bold text-[#81C34D] uppercase tracking-wider hover:text-white transition-colors border-b border-[#81C34D] hover:border-white pb-0.5 focus:outline-none"
                  >
                    {pipelineCopy.clearFilterLabel}
                  </button>
                </motion.div>
              )}

              {/* Category Filter Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex gap-4 overflow-x-auto pb-2 no-scrollbar"
              >
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-6 py-2 rounded-[6px] border text-xs tracking-wide transition-all duration-300 font-sans whitespace-nowrap focus:outline-none ${
                      filter === cat
                        ? 'bg-[#81C34D] text-[#051F1A] border-[#81C34D] font-semibold'
                        : 'bg-white/5 text-gray-400 border-white/10 hover:border-brand-accent hover:text-white font-light'
                    }`}
                  >
                    {cat.toUpperCase()}
                  </button>
                ))}
              </motion.div>

              {/* Interactive Accordion List */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="flex flex-col gap-4"
              >
                {filteredProjects.map((p) => {
                  const isHighlighted = selectedState && isProjectInSelectedState(p);
                  return (
                    <div
                      key={p.projectId}
                      className={`bg-white/[0.02] backdrop-blur-md rounded-[6px] border transition-all duration-300 overflow-hidden shadow-lg ${
                        isHighlighted
                          ? 'border-[#81C34D]/40 shadow-[0_0_15px_rgba(113,181,81,0.15)] ring-1 ring-[#81C34D]/30'
                          : expandedProject === p.projectId
                            ? 'ring-1 ring-brand-accent/20 shadow-xl border-brand-accent/20'
                            : 'border-white/10 hover:border-brand-accent/30'
                      }`}
                    >

                      {/* Header Row */}
                      <div
                        onClick={() => setExpandedProject(expandedProject === p.projectId ? null : p.projectId)}
                        className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 cursor-pointer interactive group"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <span className="text-xs text-brand-accent font-mono bg-brand-accent/10 px-2.5 py-1 rounded-[6px]">{pipelineCopy.projectIdPrefix}{p.projectId}</span>
                          <h3 className={`text-lg md:text-xl font-bold transition-colors ${expandedProject === p.projectId ? 'text-brand-accent' : 'text-white group-hover:text-brand-accent'}`}>
                            {p.title}
                          </h3>
                        </div>

                        <div className="flex items-center gap-6 mt-4 md:mt-0 font-sans text-xs uppercase tracking-wider text-gray-400">
                          <span>{p.location}</span>
                          <span className="hidden md:inline">•</span>
                          <span>{p.capacity}</span>
                          <div className={`w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-[#81C34D] group-hover:text-[#051F1A] transition-colors duration-300`}>
                            {expandedProject === p.projectId ? <Minus size={16} /> : <Plus size={16} />}
                          </div>
                        </div>
                      </div>

                      {/* Expandable Section Content */}
                      <AnimatePresence>
                        {expandedProject === p.projectId && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.35 }}
                            className="border-t border-white/5 bg-[#02100d]/30"
                          >
                            <div className="p-6 md:p-8">
                              <div className="grid lg:grid-cols-2 gap-8">
                                <div>
                                  <img src={p.image} alt={p.image_alt_text || p.title} className="w-full h-56 object-cover rounded-[6px] border border-white/10 shadow-md" />
                                </div>
                                <div className="flex flex-col justify-center space-y-4">
                                  <div>
                                    <h4 className="text-xs font-bold text-[#81C34D] uppercase tracking-widest mb-1.5">{pipelineCopy.challengeLabel}</h4>
                                    <p className="text-gray-300 text-sm leading-relaxed">{p.problem}</p>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 bg-white/[0.02] p-4 rounded-[6px] border border-white/5 shadow-md text-xs">
                                    <div>
                                      <span className="font-semibold text-gray-500 block mb-1">{pipelineCopy.financialCloseLabel}</span>
                                      <span className="text-white font-bold font-mono">{p.year}</span>
                                    </div>
                                    <div>
                                      <span className="font-semibold text-gray-500 block mb-1">{pipelineCopy.privateCapitalLabel}</span>
                                      <span className="text-brand-accent font-bold font-mono">{p.capital}</span>
                                    </div>
                                  </div>

                                  {/* Aligned SDG Goals */}
                                  <div>
                                    <span className="text-xs font-semibold text-gray-500 block mb-2 uppercase tracking-wider">{pipelineCopy.sdgGoalsLabel}</span>
                                    <div className="flex flex-wrap gap-2">
                                      {parseSdgs(p.sdgs).map(sdgNum => {
                                        const sdg = SDG_INFO[sdgNum];
                                        if (!sdg) return null;
                                        return (
                                          <div
                                            key={sdgNum}
                                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] border text-[10px] font-bold uppercase tracking-wider ${sdg.textClass}`}
                                          >
                                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sdg.color }} />
                                            SDG {sdgNum}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  <Link
                                    href={`/projects/${p.projectId}`}
                                    className="self-start flex items-center gap-1.5 text-xs font-bold text-brand-accent border-b border-brand-accent pb-0.5 hover:text-white hover:border-white transition-colors interactive font-sans uppercase tracking-wider mt-2"
                                  >
                                    {pipelineCopy.detailsLinkLabel} <ArrowUpRight size={14} />
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <PipelineConsole
        data={pipelineConsole}
        stageOverrides={stageOverrides}
        totalSectorPipeline={totalSectorPipeline}
        mandatedDeals={mandatedDeals}
        businessModelFooter={businessModelFooter}
      />

      <div className="container mx-auto px-6 pt-0 pb-0 relative z-10 text-left">
        {/* Contextual Eligibility CTA Banner */}
        <div className="relative z-10 w-full mt-24 border-t border-white/10 pt-20">
          <div className="min-h-[400px] relative flex items-center justify-center group overflow-hidden rounded-[8px] border border-white/5 shadow-2xl">
            {/* Background image */}
            <img
              src={ctaCopy.backgroundImage}
              alt={ctaCopy.backgroundImage_alt_text}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.02] pointer-events-none select-none"
            />
            {/* Dark overlay matching about page */}
            <div className="absolute inset-0 bg-[#051F1A]/70 group-hover:bg-[#051F1A]/65 transition-colors pointer-events-none z-10" />

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-20 text-center max-w-3xl px-6 flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-full bg-[#81C34D]/10 border border-[#81C34D]/20 flex items-center justify-center mb-6 text-[#81C34D]">
                <ShieldCheck size={24} />
              </div>

              <span className="text-brand-accent text-xs font-bold uppercase tracking-[0.25em] mb-4 block font-mono">{ctaCopy.eyebrow}</span>
              <h3 className="text-white text-3xl md:text-4xl font-bold font-sans mb-4 leading-tight">
                {ctaCopy.headingPartOne}<span className="text-brand-accent">{ctaCopy.headingHighlight}</span>{ctaCopy.headingPartTwo}
              </h3>

              <p className="text-white/70 font-sans text-sm md:text-base leading-relaxed mb-8 max-w-xl font-light">
                {ctaCopy.body}
              </p>

              <Link
                href={ctaCopy.ctaHref}
                className="inline-flex items-center justify-center gap-2 bg-[#81C34D] text-[#051F1A] hover:bg-white hover:text-brand-dark px-8 py-3.5 rounded-[6px] text-xs font-bold uppercase tracking-wider transition-all duration-300 interactive font-sans shadow-lg focus:outline-none"
              >
                {ctaCopy.ctaLabel} <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* National Footprint — 3-Column Interactive Map */}
        <motion.section
          id="national-footprint"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-24 border-t border-white/10 pt-16 scroll-mt-24"
        >
          <FootprintMap data={footprintMap} modalData={lgaModal} footprintData={footprintData} />
        </motion.section>
      </div>

      {/* ── NEXT STEPS CTA BAR (3 Columns - NO SELF LINKING) ────── */}
      <section className="mt-24 pt-12 pb-6 bg-[#051F1A] text-white relative z-10 border-t border-white/5">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="container mx-auto px-6 max-w-[1280px]"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#81C34D]" />
            <span className="text-[#81C34D] text-xs font-semibold tracking-[0.2em] uppercase font-mono">{nextStepsCopy.eyebrow}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            {nextStepsCopy.headingPartOne}<span className="text-[#9BB7B1] italic font-serif">{nextStepsCopy.headingItalic}</span>
          </h2>
        </motion.div>
      </section>

      <section className="bg-[#3da58a] relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
          className="max-w-[1280px] mx-auto px-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/20">
            {nextStepsCopy.links.map((link, idx) => (
              <Link
                key={link.href || idx}
                href={link.href}
                className="group flex items-center justify-between px-8 py-5 hover:bg-white/[0.07] transition-all duration-300 text-left cursor-pointer focus:outline-none"
              >
                <div className="flex items-center gap-6">
                  <span className="text-white/70 text-[10px] font-bold uppercase tracking-[0.2em] font-mono shrink-0">
                    {link.eyebrow}
                  </span>
                  <div className="h-8 w-px bg-white/25" />
                  <div>
                    <h4 className="text-white text-base font-bold font-sans group-hover:text-white/80 transition-colors duration-300">
                      {link.title}
                    </h4>
                    <p className="text-white/65 text-xs font-light mt-0.5 font-sans">
                      {link.description}
                    </p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all duration-300 shrink-0 ml-4" />
              </Link>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
