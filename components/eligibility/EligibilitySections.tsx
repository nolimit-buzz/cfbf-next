"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Check,
  Download,
  ArrowRight,
  ArrowDown,
  ArrowLeft,
  Zap,
  Sprout,
  Clock,
  FileText,
  ShieldCheck,
  Activity,
  UserCheck,
  FolderCheck,
  Search,
  Sun,
  Radio,
  Flame,
  Home,
  ChevronLeft,
  ChevronRight,
  ScrollText,
  Building2,
} from 'lucide-react';
import GlassHero from '@/components/GlassHero';
import SectionHeader from '@/components/ui/SectionHeader';
import { withoutEmpty } from '@/lib/cms/content';
import {
  ELIGIBILITY_CRITERIA_PILLARS_DEFAULTS,
  ELIGIBILITY_FINAL_CTA_DEFAULTS,
  ELIGIBILITY_HERO_DEFAULTS,
  ELIGIBILITY_NEXT_STEPS_DEFAULTS,
  ELIGIBILITY_TIMELINE_WORKFLOW_DEFAULTS,
} from '@/lib/cms/eligibility-defaults';
import type {
  EligibilityCriteriaPillarsSection,
  EligibilityFinalCtaSection,
  EligibilityHeroSection,
  EligibilityNextStepsSection,
  EligibilitySectorItem,
  EligibilityTimelineWorkflowSection,
} from '@/lib/cms/eligibility-types';

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.75, ease: EASE, delay },
});

/**
 * Icon per sector card, positional rather than keyed by title so an editor
 * renaming a sector cannot drop its icon. The CMS supplies the text only.
 */
const SECTOR_ICONS = [Sun, Radio, Sprout, Flame, Home];

// Cycling color scheme: white → brand-cyan → brand-primary
const CARD_STYLES = [
  {
    wrapper: "bg-[#FAFDFB] border border-gray-200 shadow-sm",
    title: "text-[#051F1A]",
    desc: "text-[#051F1A]/70",
    iconBg: "bg-[#051F1A]/8 border-[#051F1A]/10",
    iconColor: "text-[#051F1A]",
    sdg: "text-[#051F1A]/50",
  },
  {
    wrapper: "bg-brand-cyan shadow-md",
    title: "text-white",
    desc: "text-white/90",
    iconBg: "bg-white/20 border-white/20",
    iconColor: "text-white",
    sdg: "text-white/70",
  },
  {
    wrapper: "bg-brand-primary shadow-md",
    title: "text-white",
    desc: "text-white/85",
    iconBg: "bg-white/20 border-white/20",
    iconColor: "text-white",
    sdg: "text-white/70",
  },
] as const;

/** Icon per timeline step, positional for the same reason as `SECTOR_ICONS`. */
const TIMELINE_ICONS = [
  FileText,
  Activity,
  UserCheck,
  FolderCheck,
  Search,
  Clock,
  ShieldCheck,
  Check,
  Zap,
];

function SectorScroller({
  sectors,
  sectorsLabel,
}: {
  sectors: EligibilitySectorItem[];
  sectorsLabel: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    function update() {
      const vc = window.innerWidth >= 1024 ? 3 : 1;
      setVisibleCount(vc);
      setActiveIndex(i => Math.min(i, Math.max(0, sectors.length - vc)));
    }
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [sectors.length]);

  const maxIndex = Math.max(0, sectors.length - visibleCount);
  const prev = () => setActiveIndex(i => Math.max(0, i - 1));
  const next = () => setActiveIndex(i => Math.min(maxIndex, i + 1));
  const translatePct = (activeIndex * (100 / visibleCount)).toFixed(4);

  return (
    <motion.div
      className="my-8"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
    >
      {/* Sub-heading */}
      <div className="flex items-center gap-2 mb-3 px-1.5">
        <div className="h-px w-4 bg-white/30" />
        <span className="text-[10px] font-semibold tracking-[0.2em] uppercase font-mono text-white/50">
          {sectorsLabel}
        </span>
      </div>

      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: `translateX(-${translatePct}%)` }}
        >
          {sectors.map((sector, idx) => {
            const Icon = SECTOR_ICONS[idx % SECTOR_ICONS.length];
            const style = CARD_STYLES[idx % 3];
            return (
              <div key={idx} className="flex-shrink-0 w-full lg:w-1/3 px-1.5">
                <div className={`${style.wrapper} rounded-[6px] p-8 min-h-[220px] h-full flex flex-col justify-between cursor-default group`}>
                  <div className={`w-10 h-10 rounded-full border flex items-center justify-center flex-shrink-0 ${style.iconBg}`}>
                    <Icon size={20} className={style.iconColor} />
                  </div>
                  <div>
                    <h3 className={`text-lg font-bold leading-tight font-sans mb-2 ${style.title}`}>{sector.title}</h3>
                    <p className={`text-sm leading-relaxed font-sans line-clamp-3 ${style.desc}`}>{sector.description}</p>
                    <span className={`text-[10px] font-bold uppercase tracking-wider font-mono mt-3 block ${style.sdg}`}>{sector.sdgBadge}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 px-1.5">
        <div className="flex gap-1.5 items-center">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`transition-all duration-200 rounded-full focus:outline-none ${
                i === activeIndex ? 'w-4 h-1.5 bg-[#81C34D]' : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={prev}
            disabled={activeIndex === 0}
            className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-[#81C34D] hover:text-[#81C34D] transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none"
          >
            <ChevronLeft size={12} />
          </button>
          <button
            onClick={next}
            disabled={activeIndex >= maxIndex}
            className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center text-white hover:border-[#81C34D] hover:text-[#81C34D] transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none"
          >
            <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

interface EligibilitySectionsProps {
  hero?: EligibilityHeroSection;
  criteriaPillars?: EligibilityCriteriaPillarsSection;
  timelineWorkflow?: EligibilityTimelineWorkflowSection;
  nextSteps?: EligibilityNextStepsSection;
  finalCta?: EligibilityFinalCtaSection;
}

export default function EligibilitySections({
  hero,
  criteriaPillars,
  timelineWorkflow,
  nextSteps,
  finalCta,
}: EligibilitySectionsProps) {
  const router = useRouter();

  const heroCopy = { ...ELIGIBILITY_HERO_DEFAULTS, ...withoutEmpty(hero) };
  const criteriaCopy = { ...ELIGIBILITY_CRITERIA_PILLARS_DEFAULTS, ...withoutEmpty(criteriaPillars) };
  const timelineCopy = { ...ELIGIBILITY_TIMELINE_WORKFLOW_DEFAULTS, ...withoutEmpty(timelineWorkflow) };
  const nextStepsCopy = { ...ELIGIBILITY_NEXT_STEPS_DEFAULTS, ...withoutEmpty(nextSteps) };
  const ctaCopy = { ...ELIGIBILITY_FINAL_CTA_DEFAULTS, ...withoutEmpty(finalCta) };

  // Opt-in diagnostic: shows whether each section rendered from the CMS or from
  // its bundled defaults. Off unless NEXT_PUBLIC_CMS_DEBUG=1, so visitors never
  // see it — but available in production, which a NODE_ENV check could not do.
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_CMS_DEBUG !== '1') return;

    const sections = { hero, criteriaPillars, timelineWorkflow, nextSteps, finalCta };
    const source = Object.fromEntries(
      Object.entries(sections).map(([name, value]) => [name, value ? 'cms' : 'default'])
    );

    console.log('[cms] eligibility sections', source, sections);
  }, [hero, criteriaPillars, timelineWorkflow, nextSteps, finalCta]);

  // The four bento cards have genuinely different bodies — prose, an ordered
  // list, bullets, a stat grid — so each keeps its own JSX and reads its copy by
  // position. A card the CMS omits falls back to the bundled one.
  const cards = criteriaCopy.cards;
  const cardAt = (idx: number) =>
    cards[idx] ?? ELIGIBILITY_CRITERIA_PILLARS_DEFAULTS.cards[idx];

  const fundingSteps = timelineCopy.steps;

  const orderClasses = [
    "md:order-1",
    "md:order-2",
    "md:order-3",
    "md:order-6",
    "md:order-5",
    "md:order-4",
    "md:order-7",
    "md:order-8",
    "md:order-9",
  ];

  const renderDesktopArrow = (idx: number) => {
    const baseArrowClass = "hidden md:flex absolute items-center justify-center text-[#81C34D] z-20 pointer-events-none";
    if (idx === 0 || idx === 1 || idx === 6 || idx === 7) {
      return (
        <div className={`${baseArrowClass} top-1/2 -right-7 -translate-y-1/2`}>
          <ArrowRight size={20} />
        </div>
      );
    }
    if (idx === 2 || idx === 5) {
      return (
        <div className={`${baseArrowClass} left-1/2 -bottom-10 -translate-x-1/2`}>
          <ArrowDown size={20} />
        </div>
      );
    }
    if (idx === 3 || idx === 4) {
      return (
        <div className={`${baseArrowClass} top-1/2 -left-7 -translate-y-1/2`}>
          <ArrowLeft size={20} />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#051F1A] text-white min-h-screen relative overflow-hidden font-sans text-left">
      <GlassHero
        title={
          <>
            {heroCopy.headingPartOne} <span className="text-[#9BB7B1]">{heroCopy.headingHighlight}</span>
          </>
        }
        subtitle={heroCopy.eyebrow}
        bgImage={heroCopy.backgroundImage}
        currentPage={heroCopy.currentPageLabel}
        description={
          <>
            <p>{heroCopy.descriptionPrimary}</p>
            <p className="text-white/50 text-sm mt-3">
              {heroCopy.descriptionSecondaryPrefix}{" "}
              <a
                href={heroCopy.descriptionSecondaryLinkHref}
                className="text-[#81C34D] underline underline-offset-2 hover:text-white transition-colors"
              >
                {heroCopy.descriptionSecondaryLinkLabel}
              </a>{" "}
              {heroCopy.descriptionSecondarySuffix}
            </p>
          </>
        }
      >
        <SectorScroller sectors={heroCopy.sectors} sectorsLabel={heroCopy.sectorsLabel} />
      </GlassHero>

      {/* Light Theme Wrapper: Asymmetric Bento Grid Criteria Console */}
      <div data-rag-chunk="eligibility-criteria-pillars" className="bg-[#FAFDFB] text-[#051F1A] py-24 relative z-10">
        <div className="container mx-auto px-6 max-w-[1280px]">
          <motion.div {...fadeUp(0)} className="mb-8">
            <SectionHeader
              sub={criteriaCopy.eyebrow}
              title={
                <>
                  {criteriaCopy.headingPartOne} <span className="text-[#7C9590]">{criteriaCopy.headingHighlight}</span>
                </>
              }
              dark={false}
            />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">

            {/* Cell 1: Technology & Sectors (Col-span 2) */}
            <motion.div
              {...fadeUp(0.04)}
              whileHover={{ y: -4 }}
              className="bg-[#02100d] border border-[#144D3F] text-white p-8 rounded-[6px] shadow-lg flex flex-col justify-between lg:col-span-2 min-h-[260px] relative overflow-hidden group transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#81C34D]/5 to-transparent opacity-30 pointer-events-none" />
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-full bg-[#81C34D]/10 border border-[#81C34D]/20 flex items-center justify-center mb-6 text-[#81C34D]">
                  <Zap size={18} />
                </div>
                <h4 className="font-bold text-lg font-sans mb-3">{cardAt(0).heading}</h4>
                <p className="text-xs text-gray-300 leading-relaxed font-sans max-w-2xl">
                  {cardAt(0).body}
                </p>
                <div className="h-px bg-white/10 my-4" />
                <p className="text-xs text-gray-400 font-sans leading-relaxed">
                  {cardAt(0).subNote}
                </p>
              </div>
              <span className="text-[9px] font-bold text-brand-primary uppercase tracking-wider font-mono mt-6 relative z-10">{cardAt(0).footerTag}</span>
            </motion.div>

            {/* Cell 2: Financial Suitability (Col-span 1) */}
            <motion.div
              {...fadeUp(0.08)}
              whileHover={{ y: -4 }}
              className="bg-white border border-gray-100 p-8 rounded-[6px] shadow-sm flex flex-col justify-between min-h-[260px] hover:shadow-md hover:border-brand-primary/30 transition-all duration-300"
            >
              <div>
                <div className="w-10 h-10 rounded-full bg-[#00A788]/10 border border-[#00A788]/20 flex items-center justify-center mb-6 text-[#00A788]">
                  <ScrollText size={18} />
                </div>
                <h4 className="font-bold text-base font-sans text-[#051F1A] mb-3">{cardAt(1).heading}</h4>
                <ul className="space-y-1.5 text-xs text-gray-500 font-sans list-decimal pl-4 leading-normal">
                  {cardAt(1).listItems.map((item, idx) => (
                    <li key={idx}>{item.text}</li>
                  ))}
                </ul>
              </div>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider font-mono mt-6">{cardAt(1).footerTag}</span>
            </motion.div>

            {/* Cell 3: Regulatory & ESG Compliance (Col-span 1) */}
            <motion.div
              {...fadeUp(0.12)}
              whileHover={{ y: -4 }}
              className="bg-white border border-gray-100 p-8 rounded-[6px] shadow-sm flex flex-col justify-between min-h-[260px] hover:shadow-md hover:border-brand-primary/30 transition-all duration-300"
            >
              <div>
                <div className="w-10 h-10 rounded-full bg-[#009FD4]/10 border border-[#009FD4]/20 flex items-center justify-center mb-6 text-[#009FD4]">
                  <ShieldCheck size={18} />
                </div>
                <h4 className="font-bold text-base font-sans text-[#051F1A] mb-3">{cardAt(2).heading}</h4>
                <ul className="space-y-2 text-xs text-gray-500 font-sans">
                  {cardAt(2).listItems.map((item, idx) => (
                    <li key={idx} className="flex gap-2"><span className="text-[#009FD4] font-bold">•</span> {item.text}</li>
                  ))}
                </ul>
              </div>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider font-mono mt-6">{cardAt(2).footerTag}</span>
            </motion.div>

            {/* Cell 4: Capacity & Scale (Col-span 2) */}
            <motion.div
              {...fadeUp(0.16)}
              whileHover={{ y: -4 }}
              className="bg-white border border-gray-100 p-8 rounded-[6px] shadow-sm flex flex-col justify-between lg:col-span-2 min-h-[260px] hover:shadow-md hover:border-brand-primary/30 transition-all duration-300"
            >
              <div>
                <div className="w-10 h-10 rounded-full bg-[#00A788]/10 border border-[#00A788]/20 flex items-center justify-center mb-6 text-[#00A788]">
                  <Building2 size={18} />
                </div>
                <h4 className="font-bold text-base font-sans text-[#051F1A] mb-6">{cardAt(3).heading}</h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-left">
                  {cardAt(3).stats.map((stat, idx) => (
                    <div key={idx}>
                      <span className="text-2xl md:text-3xl font-bold font-mono text-[#051F1A] block">{stat.value}</span>
                      <span className="text-[10px] text-gray-400 font-sans block mt-1">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider font-mono mt-6">{cardAt(3).footerTag}</span>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Dark Theme Wrapper: Timeline Workflow & Consolidated CTA */}
      <div id="process" data-rag-chunk="eligibility-timeline-workflow" className="bg-[#051F1A] text-white py-24 relative z-10 border-t border-white/5 scroll-mt-24">
        <div className="absolute top-[10vh] right-0 w-1/4 h-1/4 bg-brand-accent/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 left-0 w-1/4 h-1/4 bg-brand-accent/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 max-w-[1280px]">
          <motion.div {...fadeUp(0)} className="mb-28">
            <SectionHeader
              sub={timelineCopy.eyebrow}
              title={
                <>
                  {timelineCopy.headingPartOne} <span className="text-[#9BB7B1]">{timelineCopy.headingHighlight}</span>
                </>
              }
              dark={true}
            />
          </motion.div>

          {/* Serpentine 3x3 Grid flow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-x-12 md:gap-y-12 relative mt-16">
            {fundingSteps.map((step, idx) => {
              const Icon = TIMELINE_ICONS[idx % TIMELINE_ICONS.length];
              const orderClass = orderClasses[idx];
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: idx * 0.04 }}
                  className={`relative flex flex-col justify-between ${orderClass}`}
                >
                  <div className="bg-[#031411] border border-white/10 p-6 rounded-[6px] hover:border-white/20 hover:bg-[#06241e] transition-all duration-300 shadow-md h-full flex gap-4 items-start text-left group">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 text-brand-primary group-hover:text-[#81C34D] group-hover:border-[#81C34D] transition-colors duration-300">
                      <Icon size={18} />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-[#81C34D]/70 font-semibold tracking-wider block">{timelineCopy.stepLabelPrefix} {step.stepNumber}</span>
                      <h4 className="font-bold text-sm text-white font-sans">
                        {step.title}
                      </h4>
                      <p className="text-xs text-gray-400 leading-relaxed font-sans font-light">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Desktop Serpentine Arrows */}
                  {renderDesktopArrow(idx)}

                  {/* Mobile Down Arrows */}
                  {idx < fundingSteps.length - 1 && (
                    <div className="flex md:hidden justify-center my-2 text-[#81C34D]">
                      <ArrowDown size={18} />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── NEXT STEPS CTA BAR ────── */}
      <section className="pt-12 pb-6 bg-[#051F1A] text-white relative z-10 border-t border-white/5">
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
            {nextStepsCopy.headingPartOne} <span className="text-[#9BB7B1] italic font-serif">{nextStepsCopy.headingItalic}</span>
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
                key={idx}
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

      {/* Section 3: Consolidated Call To Action Panel */}
      <div className="relative z-10 w-full">
        <div className="min-h-[460px] relative flex items-center justify-center group overflow-hidden">
          <img
            src={ctaCopy.backgroundImage}
            alt={ctaCopy.backgroundImage_alt_text}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-brand-dark/70 group-hover:bg-brand-dark/65 transition-colors z-10" />

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-20 text-center max-w-3xl px-6 flex flex-col items-center"
          >
            <div className="w-12 h-12 rounded-full bg-[#81C34D]/10 border border-[#81C34D]/20 flex items-center justify-center mb-6 text-[#81C34D]">
              <FolderCheck size={24} />
            </div>

            <span className="text-brand-accent text-xs font-bold uppercase tracking-[0.25em] mb-4 block font-mono">{ctaCopy.eyebrow}</span>
            <h3 className="text-white text-3xl md:text-4xl font-bold font-sans mb-4 leading-tight">
              {ctaCopy.headingPartOne} <span className="text-brand-accent">{ctaCopy.headingHighlight}</span>
            </h3>

            <p className="text-white/75 font-sans text-sm md:text-base leading-relaxed mb-8 max-w-xl">
              {ctaCopy.body}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto">
              <button
                onClick={() => router.push(ctaCopy.primaryCtaHref)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#81C34D] text-[#051F1A] hover:bg-white hover:text-brand-dark px-8 py-3.5 rounded-[6px] text-xs font-bold uppercase tracking-wider transition-all duration-300 interactive font-sans shadow-lg cursor-pointer select-none focus:outline-none"
              >
                {ctaCopy.primaryCtaLabel} <ArrowRight size={16} />
              </button>
              <a
                href={ctaCopy.downloadCtaHref}
                download={ctaCopy.downloadFileName}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:border-[#81C34D] hover:bg-[#81C34D] hover:text-[#051F1A] text-white px-8 py-3.5 rounded-[6px] text-xs font-bold uppercase tracking-wider transition-all duration-300 interactive font-sans shrink-0 focus:outline-none"
              >
                <Download size={14} /> {ctaCopy.downloadCtaLabel}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
