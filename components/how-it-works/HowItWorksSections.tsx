"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import GlassHero, { heroRowVariants, heroCardVariants } from '@/components/GlassHero';
import StepCard, { StepTheme } from '@/components/ui/StepCard';
import SectionHeader from '@/components/ui/SectionHeader';
import { withoutEmpty } from '@/lib/cms/content';
import {
  HOW_IT_WORKS_FACILITY_STRUCTURE_DEFAULTS,
  HOW_IT_WORKS_FINANCING_STRUCTURE_DEFAULTS,
  HOW_IT_WORKS_HERO_DEFAULTS,
  HOW_IT_WORKS_NEXT_STEPS_DEFAULTS,
  HOW_IT_WORKS_PROCESS_DEFAULTS,
} from '@/lib/cms/how-it-works-defaults';
import type {
  HowItWorksFacilityStructureSection,
  HowItWorksFinancingStructureSection,
  HowItWorksHeroSection,
  HowItWorksNextStepsSection,
  HowItWorksPartnerLogoItem,
  HowItWorksProcessSection,
} from '@/lib/cms/how-it-works-types';

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.75, ease: EASE, delay },
});

/**
 * Card themes in render order. The CMS holds `theme` as free text, so an
 * unrecognised value falls back to the theme that position has always used
 * rather than breaking `StepCard`'s typing — the same reasoning as the
 * positional icon maps on the Eligibility page.
 */
const STEP_THEMES: StepTheme[] = ['light', 'cyan', 'green', 'dark'];

function stepTheme(value: string, index: number): StepTheme {
  return (STEP_THEMES as string[]).includes(value)
    ? (value as StepTheme)
    : STEP_THEMES[index % STEP_THEMES.length];
}

/** Logo alt text, preferring the media field's own sibling. */
function logoAlt(logo: HowItWorksPartnerLogoItem): string {
  return logo.src_alt_text || logo.alt;
}

// ─── TA Slider ─────────────────────────────────────────────────────────────
function TaSlider({
  providers,
  rotationMs,
}: {
  providers: HowItWorksPartnerLogoItem[];
  rotationMs: number;
}) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    // A CMS-emptied list would make the modulo below divide by zero.
    if (providers.length < 2) return;
    const t = setInterval(() => setCurrent(p => (p + 1) % providers.length), rotationMs);
    return () => clearInterval(t);
  }, [providers.length, rotationMs]);

  const item = providers[current];
  if (!item) return null;

  return (
    <div className="relative h-10 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.a
          key={current}
          href={item.href} target="_blank" rel="noopener noreferrer"
          className="absolute inset-0 flex items-center group/ta"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
        >
          <img src={item.src} alt={logoAlt(item)} className="h-7 w-auto object-contain brightness-0 invert opacity-70 group-hover/ta:opacity-100 transition-opacity duration-300" loading="lazy" />
        </motion.a>
      </AnimatePresence>
      <div className="absolute -bottom-4 left-0 flex gap-1.5">
        {providers.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`transition-all duration-200 rounded-full ${i === current ? 'w-3 h-1.5 bg-[#81C34D]' : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  );
}

interface HowItWorksSectionsProps {
  hero?: HowItWorksHeroSection;
  financingStructure?: HowItWorksFinancingStructureSection;
  facilityStructure?: HowItWorksFacilityStructureSection;
  process?: HowItWorksProcessSection;
  nextSteps?: HowItWorksNextStepsSection;
}

export default function HowItWorksSections({
  hero,
  financingStructure,
  facilityStructure,
  // Renamed on destructure: a binding called `process` would shadow the Node
  // global, and the debug effect below reads `process.env`.
  process: processSection,
  nextSteps,
}: HowItWorksSectionsProps) {
  const heroContent = { ...HOW_IT_WORKS_HERO_DEFAULTS, ...withoutEmpty(hero) };
  const financing = {
    ...HOW_IT_WORKS_FINANCING_STRUCTURE_DEFAULTS,
    ...withoutEmpty(financingStructure),
  };
  const facility = {
    ...HOW_IT_WORKS_FACILITY_STRUCTURE_DEFAULTS,
    ...withoutEmpty(facilityStructure),
  };
  const processContent = { ...HOW_IT_WORKS_PROCESS_DEFAULTS, ...withoutEmpty(processSection) };
  const nextStepsContent = { ...HOW_IT_WORKS_NEXT_STEPS_DEFAULTS, ...withoutEmpty(nextSteps) };

  const coFinancing = financing.coFinancingPartner;
  const taRotationMs = Number(financing.taRotationMs) || 2800;

  // Opt-in diagnostic: shows whether each section rendered from the CMS or from
  // its bundled defaults. Off unless NEXT_PUBLIC_CMS_DEBUG=1, so visitors never
  // see it — but available in production, which a NODE_ENV check could not do.
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_CMS_DEBUG !== '1') return;

    const sections = {
      hero, financingStructure, facilityStructure,
      process: processSection, nextSteps,
    };
    const source = Object.fromEntries(
      Object.entries(sections).map(([name, value]) => [name, value ? 'cms' : 'default'])
    );

    console.log('[cms] how-it-works sections', source, sections);
  }, [hero, financingStructure, facilityStructure, processSection, nextSteps]);

  return (
    <div className="bg-[#051F1A] text-white min-h-screen font-sans text-left">
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <GlassHero
        title={<>{heroContent.headingPartOne}<span className="text-[#9BB7B1]">{heroContent.headingHighlight}</span></>}
        subtitle={heroContent.eyebrow}
        bgImage={heroContent.backgroundImage}
        currentPage={heroContent.breadcrumbLabel}
        description={
          <>
            <p>{heroContent.descriptionPrimary}</p>
            <p className="text-white/50 text-sm mt-3">
              {heroContent.descriptionSecondaryPrefix}
              <a href={heroContent.descriptionSecondaryLinkHref} className="text-[#81C34D] underline underline-offset-2 hover:text-white transition-colors">
                {heroContent.descriptionSecondaryLinkLabel}
              </a>
              {heroContent.descriptionSecondarySuffix}
            </p>
          </>
        }
      >
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={heroRowVariants}
          initial="hidden"
          animate="show"
        >
          {heroContent.steps.map((s, i) => (
            <motion.a
              key={s.index}
              href={heroContent.stepCardHref}
              variants={heroCardVariants}
              whileHover={{ y: -4 }}
              className="block h-full focus:outline-none"
              aria-label={`${s.title} ${heroContent.stepCardAriaSuffix}`}
            >
              <StepCard index={s.index} range={s.range} title={s.title} desc={s.desc} theme={stepTheme(s.theme, i)} className="h-full" />
            </motion.a>
          ))}
        </motion.div>
      </GlassHero>

      {/* ── SECTION 1: OVERVIEW + FINANCING STRUCTURE ─────────────────── */}
      <div data-rag-chunk="how-it-works-financing-structure" className="bg-[#051F1A] text-white py-24 relative z-10 border-t border-white/5">
        <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-[#81C34D]/4 blur-[140px] rounded-full pointer-events-none" />
        <div className="container mx-auto px-6 max-w-[1280px] relative z-10">
          <motion.div {...fadeUp(0)}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#81C34D]" />
              <span className="text-[#81C34D] text-xs font-semibold tracking-[0.2em] uppercase font-mono">{financing.eyebrow}</span>
            </div>
            <div className="grid lg:grid-cols-2 gap-16 items-start">
              {/* Left: Copy */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold font-sans leading-tight tracking-tight mb-6">
                  {financing.headingPartOne}<span className="text-[#9BB7B1]">{financing.headingHighlight}</span>
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed mb-6 font-light">
                  {financing.bodyPrimary}
                </p>
                <p className="text-gray-400 text-base leading-relaxed mb-8 font-light">
                  {financing.bodySecondary}
                </p>
                <ul className="space-y-3">
                  {financing.bullets.map((point, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08, duration: 0.5 }}
                      className="flex items-start gap-3 text-sm text-gray-300 font-sans"
                    >
                      <CheckCircle2 size={16} className="text-[#81C34D] mt-0.5 shrink-0" />
                      {point.text}
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Right: Three partner logo blocks */}
              <div className="space-y-6">
                {/* Anchor Funders */}
                <motion.div
                  {...fadeUp(0.05)}
                  className="bg-white/[0.03] border border-white/8 rounded-[8px] p-6"
                >
                  <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/40 font-mono mb-5">{financing.anchorFundersLabel}</p>
                  <div className="flex items-center gap-8 flex-wrap">
                    {financing.anchorFunders.map((f) => (
                      <a key={f.alt} href={f.href} target="_blank" rel="noopener noreferrer" className="group/logo relative">
                        <img src={f.src} alt={logoAlt(f)} className="h-8 w-auto object-contain brightness-0 invert opacity-60 group-hover/logo:opacity-100 transition-all duration-300" loading="lazy" />
                      </a>
                    ))}
                  </div>
                </motion.div>

                {/* Co-Financing Partner */}
                <motion.div
                  {...fadeUp(0.1)}
                  className="bg-white/[0.03] border border-white/8 rounded-[8px] p-6"
                >
                  <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/40 font-mono mb-5">{financing.coFinancingLabel}</p>
                  <a href={coFinancing.href} target="_blank" rel="noopener noreferrer" className="inline-block group/ic relative">
                    <img src={coFinancing.srcWhite} alt={coFinancing.srcWhite_alt_text || coFinancing.alt} className="h-7 w-auto object-contain absolute transition-all duration-300 group-hover/ic:opacity-0 group-hover/ic:scale-95" loading="lazy" />
                    {/* Decorative hover swap of the logo above — never announced. */}
                    <img src={coFinancing.srcColour} alt="" aria-hidden="true" className="h-7 w-auto object-contain opacity-0 scale-95 transition-all duration-300 group-hover/ic:opacity-100 group-hover/ic:scale-100" loading="lazy" />
                    <span className="invisible text-white text-xs font-bold">{coFinancing.alt}</span>
                  </a>
                </motion.div>

                {/* Technical Assistance Providers */}
                <motion.div
                  {...fadeUp(0.15)}
                  className="bg-white/[0.03] border border-white/8 rounded-[8px] p-6 pb-10"
                >
                  <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/40 font-mono mb-5">{financing.taProvidersLabel}</p>
                  <TaSlider providers={financing.taProviders} rotationMs={taRotationMs} />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── SECTION 2: FACILITY STRUCTURE DIAGRAM (light) ─────────────── */}
      <div id="architecture" data-rag-chunk="how-it-works-facility-architecture" className="scroll-mt-24 bg-[#FAFDFB] text-[#051F1A] py-24 relative z-10">
        <div className="container mx-auto px-6 max-w-[1280px]">
          <motion.div {...fadeUp(0)}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-[#00A788]" />
              <span className="text-[#00A788] text-xs font-semibold tracking-[0.2em] uppercase font-mono">{facility.eyebrow}</span>
            </div>
            <div className="max-w-2xl mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-sans leading-tight tracking-tight mb-4">
                {facility.headingPartOne}<span className="text-[#7C9590]">{facility.headingHighlight}</span>
              </h2>
              <p className="text-gray-600 text-base leading-relaxed font-light">
                {facility.body}
              </p>
            </div>
          </motion.div>

          <motion.div
            {...fadeUp(0.12)}
            className="bg-white rounded-[8px] border border-gray-100 shadow-lg p-6 md:p-10 overflow-x-auto"
          >
            <div className="flex justify-center">
              <img
                src={facility.diagramSrc}
                alt={facility.diagramAlt}
                className="w-full max-w-4xl h-auto"
                loading="lazy"
                style={{ minWidth: 360 }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── SECTION 3: 9-STEP PROCESS (dark) ─────────────────────────── */}
      <div id="process" data-rag-chunk="how-it-works-timeline-process" className="scroll-mt-24 bg-[#051F1A] text-white py-24 relative z-10 border-t border-white/5">
        <div className="absolute top-[10vh] right-0 w-1/4 h-1/4 bg-[#81C34D]/4 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 left-0 w-1/4 h-1/4 bg-[#00A788]/4 blur-[100px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-6 max-w-[1280px] relative z-10">
          <motion.div {...fadeUp(0)}>
            <SectionHeader
              sub={processContent.eyebrow}
              title={<>{processContent.headingPartOne}<span className="text-[#9BB7B1]">{processContent.headingHighlight}</span></>}
              dark={true}
            />
            <p className="text-gray-400 text-base leading-relaxed font-light max-w-2xl mt-4">
              {processContent.intro}
            </p>
          </motion.div>

          <div className="relative border-l border-white/10 ml-4 md:ml-8 mt-16 pl-6 md:pl-10 space-y-12">
            {processContent.steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="relative group text-left"
              >
                <div className="absolute -left-[35px] md:-left-[51px] top-1.5 w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#051F1A] border-2 border-white/20 group-hover:border-[#81C34D] transition-colors duration-300 flex items-center justify-center text-[10px] md:text-xs font-bold text-gray-400 group-hover:text-white font-mono">
                  {step.step}
                </div>
                <div className="bg-white/[0.01] border border-white/5 p-5 md:p-6 rounded-[6px] hover:bg-white/[0.03] hover:border-white/10 transition-all duration-300">
                  <h4 className="font-bold text-base md:text-lg text-white font-sans mb-2 group-hover:text-[#81C34D] transition-colors duration-300">
                    {step.title}
                  </h4>
                  <p className="text-xs md:text-sm text-gray-400 leading-relaxed font-sans font-light">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── NEXT STEPS CTA BAR ─────────────────────────────────────────── */}
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
            <span className="text-[#81C34D] text-xs font-semibold tracking-[0.2em] uppercase font-mono">{nextStepsContent.eyebrow}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            {nextStepsContent.headingPartOne}<span className="text-[#9BB7B1] italic font-serif">{nextStepsContent.headingItalic}</span>
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
            {nextStepsContent.links.map((link) => (
              <Link key={link.href} href={link.href} className="group flex items-center justify-between px-8 py-5 hover:bg-white/[0.07] transition-all duration-300 text-left cursor-pointer focus:outline-none">
                <div className="flex items-center gap-6">
                  <span className="text-white/70 text-[10px] font-bold uppercase tracking-[0.2em] font-mono shrink-0">{link.eyebrow}</span>
                  <div className="h-8 w-px bg-white/25" />
                  <div>
                    <h4 className="text-white text-base font-bold font-sans group-hover:text-white/80 transition-colors duration-300">{link.title}</h4>
                    <p className="text-white/65 text-xs font-light mt-0.5 font-sans">{link.description}</p>
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
