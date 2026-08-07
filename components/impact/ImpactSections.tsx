"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, LayoutGrid, List, ArrowRight, ArrowUpRight, Globe, Users, BarChart3, ShieldCheck, FolderClosed, Zap, Leaf, Wifi } from 'lucide-react';
import GlassHero, { heroRowVariants, heroCardVariants } from '@/components/GlassHero';
import CountUp from '@/components/ui/CountUp';
import { withoutEmpty } from '@/lib/cms/content';
import {
  IMPACT_ASSETS_TAB_DEFAULTS,
  IMPACT_CONSOLE_DEFAULTS,
  IMPACT_HERO_DEFAULTS,
  IMPACT_INVESTMENTS_TAB_DEFAULTS,
  IMPACT_NEXT_STEPS_DEFAULTS,
  IMPACT_NUMBERS_TAB_DEFAULTS,
  IMPACT_PHILOSOPHY_DEFAULTS,
  IMPACT_STORIES_TAB_DEFAULTS,
  IMPACT_VIDEO_MODAL_DEFAULTS,
} from '@/lib/cms/impact-defaults';
import type {
  ImpactAssetsTabSection,
  ImpactConsoleSection,
  ImpactHeroSection,
  ImpactInvestmentsTabSection,
  ImpactNextStepsSection,
  ImpactNumbersTabSection,
  ImpactPhilosophySection,
  ImpactStoriesTabSection,
  ImpactVideoModalSection,
} from '@/lib/cms/impact-types';

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.75, ease: EASE, delay },
});

// SVG Wheel polar and arc helpers for Net Zero display
function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}
function arc(cx: number, cy: number, r: number, a1: number, a2: number) {
  const s = polar(cx, cy, r, a1);
  const e = polar(cx, cy, r, a2);
  const large = a2 - a1 > 180 ? 1 : 0;
  return `M ${s.x.toFixed(1)} ${s.y.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${e.x.toFixed(1)} ${e.y.toFixed(1)}`;
}

const AX = 180, AY = 170, AR = 135;
const A_START = -135, A_END = 135;
const PROGRESS = 0.16;

/**
 * Geometry and colour per wheel marker, positional so the CMS supplies only the
 * year and its legend label. `labelOffset` is the nudge that keeps each year
 * clear of the arc it sits on.
 */
const WHEEL_POINTS = [
  { point: polar(AX, AY, AR, A_START + 270 * 0.156), color: '#00A788', filled: true, labelOffset: { x: -18, y: 20 }, bold: true },
  { point: polar(AX, AY, AR, A_START + 270 * 0.333), color: '#009FD4', filled: false, labelOffset: { x: -10, y: -14 }, bold: false },
  { point: polar(AX, AY, AR, A_END), color: '#81C34D', filled: false, labelOffset: { x: 6, y: 6 }, bold: false },
];

/**
 * SDG chip palette for the hero cards.
 *
 * Stays in code on purpose: these are brand colours, not copy. The CMS supplies
 * which goal a stat is aligned to (`sdgBadge`), never what colour it renders.
 * Deliberately *not* the same values as `SDG_CARD_STYLES` below, which uses the
 * official UN hexes — the two palettes have always differed.
 */
const SDG_INFO: Record<number, { color: string; bg: string; text: string; border: string }> = {
  5: { color: '#FF4A6B', bg: 'bg-[#FF4A6B]/10', text: 'text-[#FF4A6B]', border: 'border-[#FF4A6B]/20' },
  7: { color: '#FDB713', bg: 'bg-[#FDB713]/10', text: 'text-[#FDB713]', border: 'border-[#FDB713]/20' },
  8: { color: '#FF4A6B', bg: 'bg-[#FF4A6B]/10', text: 'text-[#FF4A6B]', border: 'border-[#FF4A6B]/20' },
  9: { color: '#F36D25', bg: 'bg-[#F36D25]/10', text: 'text-[#F36D25]', border: 'border-[#F36D25]/20' },
  11: { color: '#FD9D24', bg: 'bg-[#FD9D24]/10', text: 'text-[#FD9D24]', border: 'border-[#FD9D24]/20' },
  13: { color: '#56C36A', bg: 'bg-[#56C36A]/10', text: 'text-[#56C36A]', border: 'border-[#56C36A]/20' },
  17: { color: '#19486A', bg: 'bg-[#19486A]/10', text: 'text-[#19486A]', border: 'border-[#19486A]/20' },
};

/** `"SDG 13"` -> `13`, so the chip palette can stay keyed by goal number. */
function sdgNumber(badge: string): number | undefined {
  const digits = badge.replace(/\D/g, '');
  return digits ? Number(digits) : undefined;
}

/**
 * Surface and arrow colour per hero card. Positional rather than keyed by label
 * so an editor renaming a card cannot drop its styling; the CMS fills in the
 * text only.
 */
const HERO_CARD_STYLES = [
  { bgClass: 'bg-brand-primary text-white border-brand-primary/20', arrowColor: '#81C34D' },
  { bgClass: 'bg-brand-cyan text-white border-brand-cyan/20', arrowColor: '#81C34D' },
  { bgClass: 'bg-brand-accent text-brand-dark border-brand-accent/20', arrowColor: '#051F1A' },
  { bgClass: 'bg-[#E6F0EA] text-brand-dark border-[#E6F0EA]/20', arrowColor: '#00A788' },
  { bgClass: 'bg-[#D1E5F8] text-brand-dark border-[#D1E5F8]/20', arrowColor: '#009FD4' },
  { bgClass: 'bg-brand-dark text-white border-brand-dark/20', arrowColor: '#81C34D' },
];

/** Icon per console tab, positional. */
const TAB_ICONS = [
  <LayoutGrid key="stories" size={16} />,
  <BarChart3 key="numbers" size={16} />,
  <ShieldCheck key="investments" size={16} />,
  <FolderClosed key="assets" size={16} />,
];

/** Icon and accent per numbers-tab metric tile, positional. */
const METRIC_STYLES = [
  { icon: <Zap />, iconColor: '#00A788' },
  { icon: <Leaf />, iconColor: '#81C34D' },
  { icon: <Users />, iconColor: '#FF4A6B' },
  { icon: <Wifi />, iconColor: '#009FD4' },
];

/**
 * Official UN goal colours for the SDG framework cards, positional. Note these
 * are *not* the `SDG_INFO` values above — unifying them would recolour the
 * cards.
 */
const SDG_CARD_STYLES = [
  { border: 'border-[#FCC30B]/15 hover:border-[#FCC30B]/30', arrow: 'group-hover:text-[#FCC30B]', badge: 'bg-[#FCC30B]' },
  { border: 'border-[#A21942]/15 hover:border-[#A21942]/30', arrow: 'group-hover:text-[#A21942]', badge: 'bg-[#A21942]' },
  { border: 'border-[#FD6925]/15 hover:border-[#FD6925]/30', arrow: 'group-hover:text-[#FD6925]', badge: 'bg-[#FD6925]' },
  { border: 'border-[#3F7E44]/15 hover:border-[#3F7E44]/30', arrow: 'group-hover:text-[#3F7E44]', badge: 'bg-[#3F7E44]' },
];

/** Story accents rotate every three cards, in both card and list view. */
const STORY_ACCENTS = [
  { badge: 'text-[#81C34D] bg-[#81C34D]/10 border-[#81C34D]/25', playBg: 'bg-[#81C34D]', topic: 'text-[#81C34D]', playFill: '#051F1A' },
  { badge: 'text-[#009FD4] bg-[#009FD4]/10 border-[#009FD4]/25', playBg: 'bg-[#009FD4]', topic: 'text-[#009FD4]', playFill: 'white' },
  { badge: 'text-[#00A788] bg-[#00A788]/10 border-[#00A788]/25', playBg: 'bg-[#00A788]', topic: 'text-[#00A788]', playFill: 'white' },
];

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
      <div style={{ color: iconColor }} className="opacity-60 group-hover:opacity-100 transition-opacity shrink-0 [&>svg]:w-5 [&>svg]:h-5 animate-none">
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

    <p className="text-gray-300 text-[14px] leading-relaxed font-sans font-light mt-auto">
      {description}
    </p>
  </motion.div>
);

export interface ImpactSectionsProps {
  hero?: ImpactHeroSection;
  philosophy?: ImpactPhilosophySection;
  impactConsole?: ImpactConsoleSection;
  storiesTab?: ImpactStoriesTabSection;
  numbersTab?: ImpactNumbersTabSection;
  investmentsTab?: ImpactInvestmentsTabSection;
  assetsTab?: ImpactAssetsTabSection;
  nextSteps?: ImpactNextStepsSection;
  videoModal?: ImpactVideoModalSection;
}

export default function ImpactSections(props: ImpactSectionsProps) {
  const {
    hero, philosophy, impactConsole, storiesTab, numbersTab,
    investmentsTab, assetsTab, nextSteps, videoModal,
  } = props;

  const heroCopy = { ...IMPACT_HERO_DEFAULTS, ...withoutEmpty(hero) };
  const philosophyCopy = { ...IMPACT_PHILOSOPHY_DEFAULTS, ...withoutEmpty(philosophy) };
  const consoleCopy = { ...IMPACT_CONSOLE_DEFAULTS, ...withoutEmpty(impactConsole) };
  const storiesCopy = { ...IMPACT_STORIES_TAB_DEFAULTS, ...withoutEmpty(storiesTab) };
  const numbersCopy = { ...IMPACT_NUMBERS_TAB_DEFAULTS, ...withoutEmpty(numbersTab) };
  const investmentsCopy = { ...IMPACT_INVESTMENTS_TAB_DEFAULTS, ...withoutEmpty(investmentsTab) };
  const assetsCopy = { ...IMPACT_ASSETS_TAB_DEFAULTS, ...withoutEmpty(assetsTab) };
  const nextStepsCopy = { ...IMPACT_NEXT_STEPS_DEFAULTS, ...withoutEmpty(nextSteps) };
  const videoModalCopy = { ...IMPACT_VIDEO_MODAL_DEFAULTS, ...withoutEmpty(videoModal) };

  const stories = storiesCopy.stories;

  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState('card');
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; title: string } | null>(null);
  const [visibleStories, setVisibleStories] = useState(3);
  const [activeImpactTab, setActiveImpactTab] = useState(consoleCopy.tabs[0]?.tabId ?? 'stories');

  // Auto-play modal trigger via search param
  useEffect(() => {
    const playParam = searchParams.get('play');
    if (playParam) {
      const story = stories[Number(playParam)] || stories[0];
      if (story) setSelectedVideo({ url: story.video, title: story.title });
    }
  }, [searchParams, stories]);

  // Opt-in diagnostic: shows whether each section rendered from the CMS or from
  // its bundled defaults. Off unless NEXT_PUBLIC_CMS_DEBUG=1, so visitors never
  // see it — but available in production, which a NODE_ENV check could not do.
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_CMS_DEBUG !== '1') return;

    const sections = {
      hero, philosophy, impactConsole, storiesTab, numbersTab,
      investmentsTab, assetsTab, nextSteps, videoModal,
    };
    const source = Object.fromEntries(
      Object.entries(sections).map(([name, value]) => [name, value ? 'cms' : 'default'])
    );

    console.log('[cms] impact sections', source, sections);
  }, [hero, philosophy, impactConsole, storiesTab, numbersTab, investmentsTab, assetsTab, nextSteps, videoModal]);

  return (
    <div className="bg-[#FAFDFB] text-brand-dark min-h-screen relative font-sans antialiased text-left selection:bg-brand-accent selection:text-brand-dark">
      {/* Hero */}
      <GlassHero
        title={
          <>
            {heroCopy.headingPartOne}<span className="text-[#9BB7B1]">{heroCopy.headingHighlight}</span>
          </>
        }
        subtitle={heroCopy.eyebrow}
        bgImage={heroCopy.backgroundImage}
        currentPage={heroCopy.breadcrumbLabel}
        description={
          <>
            <p className="text-base">{heroCopy.descriptionPrimary}</p>
            <p className="text-white/50 text-base">{heroCopy.descriptionSecondary}</p>
          </>
        }
      >
        {/* Top metrics inside Hero */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={heroRowVariants}
          initial="hidden"
          animate="show"
        >
          {heroCopy.stats.map((s, idx) => {
            const style = HERO_CARD_STYLES[idx] ?? HERO_CARD_STYLES[0];
            const sdg = sdgNumber(s.sdgBadge);
            const info = sdg ? SDG_INFO[sdg] : undefined;

            return (
              <motion.div
                key={s.label || idx}
                variants={heroCardVariants}
                whileHover={{ y: -4, scale: 1.01, borderColor: style.arrowColor + '40' }}
                className={`rounded-[6px] border ${style.bgClass} p-6 flex flex-col justify-between h-full min-h-[220px] md:min-h-[240px] shadow-lg transition-all duration-300 group cursor-default relative will-change-transform`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-mono block opacity-60">
                    {s.category}
                  </span>
                  <ArrowUpRight size={16} className="opacity-60 group-hover:opacity-100 transition-opacity" style={{ color: style.arrowColor }} />
                </div>

                <div className="my-4 flex items-baseline">
                  <span className="text-4xl md:text-5xl font-light font-sans tracking-tight">
                    <CountUp value={s.value} />
                  </span>
                </div>

                <p className="text-xs md:text-sm leading-relaxed font-sans font-light opacity-90 mb-4">
                  {s.description}
                </p>

                {/* SDG badge */}
                {info && (
                  <div className="flex flex-wrap gap-1 mt-auto">
                    <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded border ${info.border} ${info.bg} ${info.text} text-[9px] font-bold uppercase tracking-wider self-start font-sans`}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: info.color }} />
                      {s.sdgBadge}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </GlassHero>

      {/* ── IMPACT PHILOSOPHY / INTRO SECTION ────── */}
      <section className="py-20 bg-white relative z-10 border-b border-gray-100/40">
        <div className="container mx-auto px-6 max-w-[1280px]">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 text-left">
              <span className="text-brand-primary text-xs font-semibold tracking-[0.2em] uppercase font-mono block mb-2">
                {philosophyCopy.eyebrow}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-dark font-sans tracking-tight leading-tight mb-6">
                {philosophyCopy.headingPartOne}<span className="text-[#7C9590]">{philosophyCopy.headingHighlight}</span>
              </h2>
              <p className="text-gray-500 text-base leading-relaxed mb-6 font-light font-sans">
                {philosophyCopy.bodyPartOne}
              </p>
              <p className="text-gray-500 text-base leading-relaxed font-light font-sans">
                {philosophyCopy.bodyPartTwo}
              </p>
            </div>

            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
              {philosophyCopy.pillars.map((item, idx) => (
                <div
                  key={item.number || idx}
                  className="bg-[#FAFDFB] border border-gray-100/70 p-6 rounded-[6px] text-left flex flex-col justify-between min-h-[160px] hover:border-brand-primary/20 transition-all duration-300"
                >
                  <div>
                    <span className="text-[10px] font-mono font-bold text-brand-primary/40 block mb-3">/ {item.number}</span>
                    <h4 className="text-sm font-bold text-brand-dark font-sans mb-2">{item.title}</h4>
                    <p className="text-xs text-gray-400 font-sans font-light leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── IMPACT STORIES & METRICS CONSOLE SECTION ────── */}
      <section id="stories" className="py-24 bg-[#02100d] text-white relative z-10 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-[1280px]">

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 border-b border-white/10 pb-8 gap-6">
            <div>
              <span className="text-brand-accent text-xs font-semibold tracking-[0.2em] uppercase font-mono block mb-2">
                {consoleCopy.eyebrow}
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-white font-sans tracking-tight leading-tight">
                {consoleCopy.headingPartOne}<span className="text-[#9BB7B1]">{consoleCopy.headingHighlight}</span>
              </h2>
            </div>

            {/* Console Tab Buttons */}
            <div className="flex gap-8 overflow-x-auto no-scrollbar pb-2 lg:pb-0 w-full lg:w-auto">
              {consoleCopy.tabs.map((tab, idx) => (
                <button
                  key={tab.tabId || idx}
                  onClick={() => setActiveImpactTab(tab.tabId)}
                  className={`text-sm tracking-wide transition-all duration-300 font-sans interactive relative pb-2 flex items-center gap-2 focus:outline-none whitespace-nowrap ${
                    activeImpactTab === tab.tabId ? 'text-white font-semibold' : 'text-gray-400 hover:text-gray-300 font-normal'
                  }`}
                >
                  {TAB_ICONS[idx] ?? TAB_ICONS[0]}
                  {tab.label}
                  {activeImpactTab === tab.tabId && (
                    <motion.div layoutId="impactPageTabLine" className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-accent" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeImpactTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              {activeImpactTab === 'stories' && (
                <div>
                  {/* View mode buttons & info row */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs text-gray-400 font-sans font-light">
                      {storiesCopy.countPrefix} {Math.min(visibleStories, stories.length)} {storiesCopy.countMiddle} {stories.length} {storiesCopy.countSuffix}
                    </span>
                    <div className="flex items-center gap-2 rounded-full p-1 bg-white/5 border border-white/10">
                      <button
                        onClick={() => setViewMode('card')}
                        className={`p-2 rounded-full transition-all duration-300 ${
                          viewMode === 'card'
                            ? 'bg-brand-accent text-brand-dark'
                            : 'text-gray-400 hover:text-white'
                        }`}
                        aria-label="Card View"
                      >
                        <LayoutGrid size={16} />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-full transition-all duration-300 ${
                          viewMode === 'list'
                            ? 'bg-brand-accent text-brand-dark'
                            : 'text-gray-400 hover:text-white'
                        }`}
                        aria-label="List View"
                      >
                        <List size={16} />
                      </button>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {viewMode === 'card' ? (
                      <motion.div
                        key="card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                      >
                        {stories.slice(0, visibleStories).map((story, i) => {
                          const accent = STORY_ACCENTS[i % 3];

                          return (
                            <div
                              key={i}
                              onClick={() => setSelectedVideo({ url: story.video, title: story.title })}
                              className="group cursor-pointer flex flex-col border border-white/10 rounded-[6px] overflow-hidden bg-white/[0.02] hover:-translate-y-0.5 transition-all duration-300 hover:border-white/20 text-left"
                            >
                              {/* Media area */}
                              <div className="relative aspect-video bg-[#051F1A] overflow-hidden">
                                <img
                                  src={story.image}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                                  alt={story.image_alt_text || story.title}
                                />
                                {/* Play button */}
                                <div className={`absolute top-4 right-4 w-10 h-10 rounded-[6px] flex items-center justify-center ${accent.playBg} group-hover:scale-105 transition-transform duration-300`}>
                                  <Play size={14} fill={accent.playFill} stroke="none" className="ml-0.5" />
                                </div>
                                {/* Category badge */}
                                <div className="absolute bottom-3 left-3">
                                  <span className={`backdrop-blur-md text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full font-mono border ${accent.badge}`}>
                                    {story.badge}
                                  </span>
                                </div>
                              </div>

                              {/* Metadata Details */}
                              <div className="p-5 flex flex-col gap-0 text-left flex-1 justify-between bg-[#051F1A]/40">
                                <div>
                                  <h3 className="text-white text-sm font-bold font-sans mb-3 leading-snug group-hover:text-brand-accent transition-colors min-h-[40px] line-clamp-2">
                                    {story.title}
                                  </h3>
                                  <p className="text-gray-300 text-xs font-light leading-relaxed mb-4 line-clamp-2">{story.excerpt}</p>
                                </div>

                                <div className="space-y-0 mt-2">
                                  <div className="flex justify-between border-t border-white/5 py-2">
                                    <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">{storiesCopy.roleLabel}</span>
                                    <span className="text-[9px] font-bold font-mono text-white">{story.role}</span>
                                  </div>
                                  <div className="flex justify-between border-t border-white/5 py-2">
                                    <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">{storiesCopy.locationLabel}</span>
                                    <span className="text-[9px] font-bold font-mono text-white">{story.location}</span>
                                  </div>
                                  <div className="flex justify-between border-t border-white/5 py-2">
                                    <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">{storiesCopy.typeLabel}</span>
                                    <span className={`text-[9px] font-bold font-mono ${accent.topic}`}>{story.type}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="list"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col gap-6"
                      >
                        {stories.slice(0, visibleStories).map((story, i) => {
                          const accent = STORY_ACCENTS[i % 3];

                          return (
                            <div
                              key={i}
                              onClick={() => setSelectedVideo({ url: story.video, title: story.title })}
                              className="group flex flex-col md:flex-row gap-6 bg-white/[0.02] border border-white/10 p-4 rounded-[8px] hover:border-white/20 transition-all duration-300 cursor-pointer text-left"
                            >
                              {/* Media area */}
                              <div className="w-full md:w-48 aspect-video rounded-[6px] overflow-hidden shrink-0 relative bg-[#051F1A]">
                                <img src={story.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" alt={story.image_alt_text || story.title} />
                                {/* Play button */}
                                <div className="absolute top-3 right-3 w-8 h-8 rounded-[4px] flex items-center justify-center bg-white/20 group-hover:scale-105 transition-transform duration-300">
                                  <Play size={12} fill="white" stroke="none" className="ml-0.5" />
                                </div>
                                {/* Category badge */}
                                <div className="absolute bottom-2.5 left-2.5">
                                  <span className={`backdrop-blur-md text-[8px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full font-mono border ${accent.badge}`}>
                                    {story.badge}
                                  </span>
                                </div>
                              </div>

                              {/* Content area */}
                              <div className="flex-1 flex flex-col justify-between py-1 text-left">
                                <div>
                                  <h3 className="text-base font-bold text-white mb-1 group-hover:text-brand-accent transition-colors leading-snug font-sans">
                                    {story.title}
                                  </h3>
                                  <p className="text-gray-350 text-xs font-light leading-relaxed mb-3 line-clamp-1">{story.excerpt}</p>
                                </div>

                                <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-3">
                                  <div className="flex flex-col text-left">
                                    <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block mb-0.5">{storiesCopy.roleLabel}</span>
                                    <span className="text-[9px] font-bold font-mono text-white">{story.role}</span>
                                  </div>
                                  <div className="flex flex-col text-left">
                                    <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block mb-0.5">{storiesCopy.locationLabel}</span>
                                    <span className="text-[9px] font-bold font-mono text-white">{story.location}</span>
                                  </div>
                                  <div className="flex flex-col text-left">
                                    <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block mb-0.5">{storiesCopy.typeLabel}</span>
                                    <span className={`text-[9px] font-bold font-mono ${accent.topic}`}>{story.type}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* View More Button */}
                  {visibleStories < stories.length && (
                    <div className="flex justify-center mt-12">
                      <button
                        onClick={() => setVisibleStories(stories.length)}
                        className="inline-flex items-center justify-center gap-2 border border-white/10 hover:border-brand-accent text-white hover:text-brand-accent px-8 py-3.5 rounded-[6px] text-xs font-bold uppercase tracking-wider transition-all duration-300 interactive font-sans select-none focus:outline-none bg-white/[0.02]"
                      >
                        {storiesCopy.viewMoreLabel} <ArrowRight size={14} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeImpactTab === 'numbers' && (
                <div>
                  {/* Metric Box Tiles */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {numbersCopy.metrics.map((metric, idx) => {
                      const style = METRIC_STYLES[idx] ?? METRIC_STYLES[0];
                      return (
                        <IconStatBox
                          key={metric.label || idx}
                          icon={style.icon}
                          label={metric.label}
                          value={metric.value}
                          unit={metric.unit}
                          description={metric.description}
                          iconColor={style.iconColor}
                          delay={0.05 * (idx + 1)}
                        />
                      );
                    })}
                  </div>

                  {/* Transition Dial & Penetrability indicator row */}
                  <div className="grid lg:grid-cols-2 gap-8 items-stretch">

                    {/* Left Column: Progress Wheel */}
                    <div className="flex flex-col h-full bg-white/[0.02] border border-white/10 rounded-[12px] p-8 text-center md:text-left">
                      <div className="relative mb-6">
                        <svg viewBox="0 0 360 300" className="w-full max-w-sm mx-auto md:mx-0" style={{ overflow: 'visible' }}>
                          {[-90, -45, 0, 45, 90].map(a => {
                            const inner = polar(AX, AY, 40, a);
                            const outer = polar(AX, AY, 148, a);
                            return <line key={a} x1={inner.x.toFixed(1)} y1={inner.y.toFixed(1)} x2={outer.x.toFixed(1)} y2={outer.y.toFixed(1)} stroke="#00A788" strokeWidth="1" opacity="0.15" />;
                          })}
                          {[50, 90, 130].map(r => <circle key={r} cx={AX} cy={AY} r={r} fill="none" stroke="#00A788" strokeWidth="1" opacity="0.1" />)}
                          <path d={arc(AX, AY, AR, A_START, A_END)} fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="14" strokeLinecap="round" />
                          <motion.path d={arc(AX, AY, AR, A_START, A_END)} fill="none" stroke="#00A788" strokeWidth="14" strokeLinecap="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: PROGRESS }} viewport={{ once: true, margin: '-50px' }} transition={{ duration: 2.2, ease: 'easeOut', delay: 0.4 }} />

                          {numbersCopy.timelinePoints.map((tp, idx) => {
                            const style = WHEEL_POINTS[idx];
                            if (!style) return null;
                            const { point, color, filled, labelOffset, bold } = style;
                            return (
                              <React.Fragment key={tp.year || idx}>
                                {filled ? (
                                  <>
                                    <circle cx={point.x.toFixed(1)} cy={point.y.toFixed(1)} r="7" fill={color} />
                                    <circle cx={point.x.toFixed(1)} cy={point.y.toFixed(1)} r="12" fill="none" stroke={color} strokeWidth="1.5" opacity="0.5" />
                                  </>
                                ) : (
                                  <>
                                    <circle cx={point.x.toFixed(1)} cy={point.y.toFixed(1)} r="6" fill="none" stroke={color} strokeWidth="2" />
                                    <circle cx={point.x.toFixed(1)} cy={point.y.toFixed(1)} r="2" fill={color} />
                                  </>
                                )}
                                <text
                                  x={(point.x + labelOffset.x).toFixed(1)}
                                  y={(point.y + labelOffset.y).toFixed(1)}
                                  fill={color}
                                  fontSize="9"
                                  fontFamily="monospace"
                                  fontWeight={bold ? 'bold' : undefined}
                                >
                                  {tp.year}
                                </text>
                              </React.Fragment>
                            );
                          })}

                          <text x={AX} y={AY - 10} textAnchor="middle" fill="white" fontSize="48" fontFamily="monospace" fontWeight="bold" className="fill-white">{numbersCopy.wheelCenterYear}</text>
                          <text x={AX} y={AY + 16} textAnchor="middle" fill="#7C9590" fontSize="11" fontFamily="sans-serif" className="fill-gray-400">{numbersCopy.wheelCenterLabel}</text>
                          <text x={AX} y={AY + 38} textAnchor="middle" fill="#00A788" fontSize="10" fontFamily="monospace" fontWeight="bold" className="fill-[#00A788]">{numbersCopy.wheelProgressLabel}</text>
                        </svg>
                        <div className="flex flex-wrap items-center justify-center gap-6 mt-4">
                          {numbersCopy.timelinePoints.map((tp, idx) => {
                            const style = WHEEL_POINTS[idx] ?? WHEEL_POINTS[0];
                            return (
                              <div key={tp.year || idx} className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full border-2" style={{ backgroundColor: style.filled ? style.color : 'transparent', borderColor: style.color }} />
                                <span className="text-[10px] font-mono text-gray-400">{tp.year} — {tp.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Detailed parameters */}
                    <div className="flex flex-col justify-between space-y-4">
                      <div className="bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-300 rounded-[6px] p-6 flex-1 flex flex-col justify-center text-left">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-7 h-7 rounded-[6px] bg-[#00A788]/10 flex items-center justify-center"><Globe size={14} className="text-[#00A788]" /></div>
                          <span className="text-[10px] font-mono text-[#00A788] uppercase tracking-widest font-bold">{numbersCopy.etpLabel}</span>
                        </div>
                        <p className="text-gray-355 font-sans text-xs leading-relaxed font-light">
                          {numbersCopy.etpBody}
                        </p>
                      </div>

                      <div className="bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-300 rounded-[6px] p-6 flex-1 flex flex-col justify-center text-left">
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-[10px] font-mono text-[#009FD4] uppercase tracking-widest font-bold">{numbersCopy.pensionLabel}</span>
                          <span className="text-[#009FD4] font-bold font-mono text-sm">{numbersCopy.pensionTargetValue}</span>
                        </div>
                        <div className="relative h-2 bg-white/10 rounded-full overflow-hidden mb-1.5">
                          <motion.div initial={{ width: 0 }} whileInView={{ width: '30%' }} viewport={{ once: true }} transition={{ duration: 1.4, ease: 'easeOut', delay: 0.5 }} className="absolute inset-y-0 left-0 bg-[#009FD4] rounded-full" />
                          <div className="absolute inset-y-0 left-[6.67%] w-px bg-white/30" />
                        </div>
                        <div className="flex justify-between text-[10px] font-mono text-gray-400">
                          <span>{numbersCopy.pensionCurrentLabel}</span>
                          <span>{numbersCopy.pensionTargetLabel}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeImpactTab === 'investments' && (
                <div>
                  {/* 4 Pillars Grid */}
                  <h3 className="text-sm font-bold font-mono uppercase tracking-[0.25em] text-[#81C34D] mb-6 block text-left">
                    {investmentsCopy.pillarsHeading}
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {investmentsCopy.pillars.map((item, idx) => (
                      <div
                        key={item.number || idx}
                        className="group relative bg-[#051F1A] border border-white/10 p-6 pt-10 sm:pt-12 rounded-[8px] flex flex-col justify-between h-[220px] overflow-hidden hover:border-white/20 transition-all duration-300 text-left cursor-default"
                      >
                        <div className="relative z-10">
                          <span className="text-[10px] font-mono font-bold text-brand-accent block mb-3">/ {item.number}</span>
                          <h4 className="text-sm font-bold text-white font-sans mb-2">{item.title}</h4>
                        </div>

                        {/* Static gradient background overlay under text */}
                        <div className="absolute bottom-0 left-0 right-0 h-[120px] bg-gradient-to-t from-[#051F1A] via-[#051F1A]/95 to-transparent pointer-events-none z-0" />

                        {/* Text wrapper to restrict clipping above bottom margin */}
                        <div className="absolute bottom-6 left-6 right-6 overflow-hidden h-[75px] z-10">
                          <div className="translate-y-[52px] group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]">
                            <p className="text-[14px] text-gray-300 font-sans font-light leading-relaxed">{item.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 4 SDG Integration Cards */}
                  <h3 className="text-sm font-bold font-mono uppercase tracking-[0.25em] text-[#81C34D] mb-6 block text-left">
                    {investmentsCopy.sdgHeading}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {investmentsCopy.sdgCards.map((card, idx) => {
                      const style = SDG_CARD_STYLES[idx] ?? SDG_CARD_STYLES[0];
                      return (
                        <div
                          key={card.number || idx}
                          className={`relative rounded-[6px] overflow-hidden flex flex-col justify-between h-[320px] sm:h-[350px] group border ${style.border} transition-all duration-300 cursor-default text-left`}
                        >
                          <img
                            src={card.image}
                            alt={card.image_alt_text || card.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-[#051F1A]/92 group-hover:bg-[#051F1A]/85 transition-colors duration-300" />

                          {/* Top bar & Fixed Header */}
                          <div className="relative z-10 p-6 pt-10 sm:pt-12 flex flex-col justify-start h-full">
                            <div className="flex justify-between items-center mb-4">
                              <span className="text-2xl font-light font-mono text-white/30 leading-none">{card.number}</span>
                              <ArrowUpRight size={14} className={`text-white/60 ${style.arrow} transition-colors`} />
                            </div>
                            <h4 className="font-bold text-sm text-white font-sans mb-1.5">{card.title}</h4>
                            <div>
                              <span className={`inline-block text-[8px] font-bold text-white font-mono ${style.badge} px-2 py-0.5 rounded-full`}>{card.badgeLabel}</span>
                            </div>
                          </div>

                          {/* Static gradient background overlay under text */}
                          <div className="absolute bottom-0 left-0 right-0 h-[150px] bg-gradient-to-t from-[#051F1A] via-[#051F1A]/95 to-transparent pointer-events-none z-0" />

                          {/* Bottom sliding description wrapper */}
                          <div className="absolute bottom-6 left-6 right-6 overflow-hidden h-[95px] z-10">
                            <div className="translate-y-[55px] group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]">
                              <p className="text-[14px] text-gray-300 font-sans leading-relaxed font-light">
                                {card.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeImpactTab === 'assets' && (
                <div className="overflow-x-auto bg-white/[0.01] border border-white/10 rounded-[10px] shadow-xl">
                  <table className="w-full border-collapse text-left text-xs md:text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider bg-white/[0.02]">
                        {assetsCopy.columns.map((col, idx) => (
                          <th key={col.label || idx} className="py-4 px-6">{col.label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {assetsCopy.assets.map((asset) => (
                        <tr key={asset.assetId} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-4 px-6 font-bold text-white">{asset.title}</td>
                          <td className="py-4 px-6 text-gray-355">{asset.location}</td>
                          <td className="py-4 px-6 text-gray-355">{asset.category}</td>
                          <td className="py-4 px-6 text-gray-355 font-mono">{asset.capacity}</td>
                          <td className="py-4 px-6 text-gray-355 font-mono">{asset.connections}</td>
                          <td className="py-4 px-6 text-gray-355 font-mono">{asset.jobs}</td>
                          <td className="py-4 px-6">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider font-mono border ${
                              asset.status === 'Operational'
                                ? 'text-[#81C34D] bg-[#81C34D]/10 border-[#81C34D]/25'
                                : 'text-[#009FD4] bg-[#009FD4]/10 border-[#009FD4]/25'
                            }`}>
                              {asset.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── NEXT STEPS CTA BAR (3 Columns - NO SELF LINKING) ────── */}
      <section className="pt-12 pb-6 bg-[#051F1A] text-white relative z-10 border-t border-white/5">
        <motion.div {...fadeUp(0)} className="container mx-auto px-6 max-w-[1280px]">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-brand-accent" />
            <span className="text-brand-accent text-xs font-semibold tracking-[0.2em] uppercase font-mono">{nextStepsCopy.eyebrow}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            {nextStepsCopy.headingPartOne}<span className="text-[#9BB7B1] italic font-serif">{nextStepsCopy.headingItalic}</span>
          </h2>
        </motion.div>
      </section>

      <section className="bg-[#3da58a] relative z-10">
        <motion.div {...fadeUp(0.08)} className="max-w-[1280px] mx-auto px-6">
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

      {/* ── VIDEO PLAYER MODAL OVERLAY ────── */}
      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVideo(null)}
              className="absolute inset-0 bg-brand-dark/90 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#051F1A] border border-white/10 rounded-[12px] shadow-2xl w-full max-w-4xl overflow-hidden relative z-10 flex flex-col text-left"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white hover:text-brand-accent p-2 rounded-full border border-white/5 transition-colors cursor-pointer z-50 focus:outline-none"
                aria-label="Close"
              >
                <X className="size-5" />
              </button>

              {/* Responsive Video Container */}
              <div className="relative aspect-video w-full bg-black">
                <video
                  src={selectedVideo.url}
                  autoPlay
                  controls
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Title Strip */}
              <div className="p-5 border-t border-white/5 bg-[#02100d] text-white">
                <span className="text-[10px] font-mono text-brand-accent uppercase tracking-widest block mb-1">{videoModalCopy.nowPlayingLabel}</span>
                <h4 className="text-sm font-bold font-sans line-clamp-1">{selectedVideo.title}</h4>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
