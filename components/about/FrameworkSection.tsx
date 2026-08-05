"use client";

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Briefcase, Coins, Globe, ShieldCheck, Zap } from 'lucide-react';
import {
  ABOUT_CAPITAL_STACK_DEFAULTS,
  ABOUT_FRAMEWORK_DEFAULTS,
} from '@/lib/cms/about-defaults';
import { withoutEmpty } from '@/lib/cms/content';
import type {
  AboutCapitalStackSection,
  AboutFrameworkSection as AboutFrameworkSectionData,
} from '@/lib/cms/about-types';

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.75, ease: EASE, delay },
});

/** Accent colour and watermark icon per framework card, matched by position. */
const CARD_STYLES = [
  { color: '#009FD4', Icon: Briefcase },
  { color: '#00A788', Icon: ShieldCheck },
  { color: '#81C34D', Icon: Globe },
];

/** Icon and colour per capital-stack segment, matched by position. */
const SEGMENT_STYLES = [
  { Icon: ShieldCheck, tint: 'bg-[#051F1A]/10 text-[#051F1A]', border: 'border-gray-100/70 hover:border-gray-200/50', title: 'text-brand-dark', amount: 'text-brand-dark' },
  { Icon: Coins, tint: 'bg-brand-primary/10 text-brand-primary', border: 'border-brand-primary/10 hover:border-brand-primary/20', title: 'text-brand-primary', amount: 'text-brand-primary' },
  { Icon: Zap, tint: 'bg-[#009FD4]/10 text-[#009FD4]', border: 'border-[#009FD4]/10 hover:border-[#009FD4]/20', title: 'text-[#009FD4]', amount: 'text-brand-dark' },
];

/**
 * Bar colour, height and label tint per stack layer.
 *
 * The 60/20/20 split is the facility's actual structure and drives the amounts
 * below, so it lives in code rather than in editable copy — the CMS carries the
 * percentage *labels*, which an editor should never need to desynchronise from
 * these heights.
 */
const BAR_STYLES = [
  { share: 0.6, height: '60%', bg: 'bg-[#051F1A]', border: 'border-white/10', label: 'text-gray-300' },
  { share: 0.2, height: '20%', bg: 'bg-[#00A788]', border: 'border-white/5', label: 'text-white/95' },
  { share: 0.2, height: '20%', bg: 'bg-[#009FD4]', border: 'border-white/5', label: 'text-white/95' },
];

const MIN_PROJECT_SIZE = 5;
const MAX_PROJECT_SIZE = 30;

export default function FrameworkSection({
  data,
  capitalStack,
  projectSize,
  onProjectSizeChange,
  isSimulatorExpanded,
  onToggleSimulator,
}: {
  data?: AboutFrameworkSectionData;
  capitalStack?: AboutCapitalStackSection;
  projectSize: number;
  onProjectSizeChange: (size: number) => void;
  isSimulatorExpanded: boolean;
  onToggleSimulator: (expanded: boolean) => void;
}) {
  const c = { ...ABOUT_FRAMEWORK_DEFAULTS, ...withoutEmpty(data) };
  const s = { ...ABOUT_CAPITAL_STACK_DEFAULTS, ...withoutEmpty(capitalStack) };

  const segmentAmounts = BAR_STYLES.map((bar) => projectSize * bar.share);

  return (
    <section id="framework" className="py-24 bg-white relative z-10">
      <div className="container mx-auto px-6 max-w-[1280px]">
        <div className="grid md:grid-cols-2 gap-10 xl:gap-20 items-end mb-16">
          <motion.div {...fadeUp(0)}>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-brand-primary" />
              <span className="text-brand-primary text-xs font-semibold tracking-[0.2em] uppercase font-mono">{c.eyebrow}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-brand-dark font-sans tracking-tight leading-[1.1]">
              {c.headingPrimary}
              <span className="text-[#7C9590]">{c.headingSecondary}</span>
            </h2>
          </motion.div>
          <motion.p {...fadeUp(0.08)} className="text-gray-500 leading-relaxed font-sans pb-2">
            {c.intro}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {c.cards?.map((item, i) => {
            const style = CARD_STYLES[i] ?? CARD_STYLES[CARD_STYLES.length - 1];

            return (
              <motion.div
                key={item.cardNumber || i}
                {...fadeUp(i * 0.07)}
                whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.15)' }}
                transition={{ duration: 0.3, ease: EASE }}
                className="relative rounded-[6px] overflow-hidden flex flex-col justify-between h-[360px] sm:h-[400px] group border border-white/10 transition-all duration-300 cursor-default"
              >
                <img
                  src={item.bgImage}
                  alt={item.bgImage_alt_text || item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[#051F1A]/92 group-hover:bg-[#051F1A]/85 transition-colors duration-300" />

                {/* Top bar & Fixed Header (always in place) */}
                <div className="relative z-10 p-8 pt-12 sm:pt-16 pb-0 flex flex-col justify-start h-full text-left">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-2xl font-light font-mono text-white/30 leading-none">{item.cardNumber}</span>
                    <ArrowUpRight size={14} className="text-white/60 group-hover:text-white transition-colors" />
                  </div>
                  <h3
                    className="text-xl font-bold font-sans group-hover:!text-white transition-colors duration-300"
                    style={{ color: style.color }}
                  >
                    {item.title}
                  </h3>
                </div>

                {/* Static gradient background overlay under text */}
                <div className="absolute bottom-0 left-0 right-0 h-[220px] bg-gradient-to-t from-[#051F1A] via-[#051F1A]/95 to-transparent pointer-events-none z-0" />

                {/* Bottom sliding block wrapper (description & tag) */}
                <div className="absolute bottom-8 left-8 right-8 overflow-hidden h-[180px] z-10">
                  <div className="translate-y-[134px] group-hover:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1] flex flex-col text-left">
                    <p className="text-gray-300 text-sm leading-relaxed font-sans font-light mb-6">{item.body}</p>
                    <div>
                      <span
                        className="inline-flex text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1.5 rounded-[6px] border bg-white/5"
                        style={{ color: style.color, borderColor: `${style.color}30` }}
                      >
                        {item.tag}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Collapsible Simulator Call to Action Card */}
        <motion.div
          layout
          {...fadeUp(0.15)}
          transition={{ duration: 0.45, ease: EASE }}
          className="mt-16 bg-white border border-gray-100/70 rounded-[12px] p-6 md:p-8 text-left relative overflow-hidden"
        >
          {/* Background decorative circles */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-primary/[0.01] rounded-full blur-[80px] pointer-events-none" />

          <AnimatePresence mode="wait">
            {!isSimulatorExpanded ? (
              <motion.div
                key="collapsed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: EASE }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                <div className="max-w-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-px w-6 bg-brand-primary" />
                    <span className="text-brand-primary text-[10px] font-bold tracking-[0.2em] uppercase font-mono">
                      {s.eyebrow}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-brand-dark tracking-tight mb-2">
                    {s.headingPrimary}
                    <span className="text-[#7C9590] italic font-serif">{s.headingSecondary}</span>
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed font-sans font-light">
                    {s.collapsedBody}
                  </p>
                </div>
                <button
                  onClick={() => onToggleSimulator(true)}
                  className="shrink-0 inline-flex items-center justify-center gap-2 border border-gray-200/70 hover:border-brand-primary hover:bg-[#F3FAF6] text-brand-dark px-6 py-3 rounded-[6px] text-xs font-bold uppercase tracking-wider transition-all duration-300 interactive font-sans select-none focus:outline-none"
                >
                  {s.launchLabel} <ArrowRight size={14} />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: EASE }}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-gray-50 pb-6">
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-px w-6 bg-brand-primary" />
                      <span className="text-brand-primary text-[10px] font-bold tracking-[0.2em] uppercase font-mono">
                        {s.eyebrow}
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-brand-dark tracking-tight mb-2">
                      {s.headingPrimary}
                      <span className="text-[#7C9590] italic font-serif">{s.headingSecondary}</span>
                    </h3>
                    <p className="text-gray-400 text-xs leading-relaxed font-sans font-light">
                      {s.expandedBody}
                    </p>
                  </div>
                  <button
                    onClick={() => onToggleSimulator(false)}
                    className="shrink-0 inline-flex items-center justify-center gap-2 border border-gray-200/70 hover:border-brand-primary hover:bg-[#FAFDFB] text-brand-dark px-6 py-3 rounded-[6px] text-xs font-bold uppercase tracking-wider transition-all duration-300 interactive font-sans select-none focus:outline-none"
                  >
                    {s.collapseLabel}
                  </button>
                </div>

                {/* Simulator Grid */}
                <div className="grid lg:grid-cols-12 gap-10 items-stretch">

                  {/* Controls & Metrics */}
                  <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
                    <div>
                      {/* Slider Control */}
                      <div className="bg-white border border-gray-100/70 rounded-[6px] p-6 mb-6">
                        <div className="flex justify-between items-baseline mb-4">
                          <label className="text-xs font-bold font-mono text-gray-500 uppercase tracking-wider">{s.sliderLabel}</label>
                          <div className="text-3xl font-extrabold text-brand-dark tracking-tight">
                            ₦{projectSize.toFixed(1)}<span className="text-lg font-medium text-gray-400">{s.sliderUnitLabel}</span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min={MIN_PROJECT_SIZE}
                          max={MAX_PROJECT_SIZE}
                          step="1"
                          value={projectSize}
                          onChange={(e) => onProjectSizeChange(Number(e.target.value))}
                          className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#00A788]"
                        />
                        <div className="flex justify-between text-[10px] font-mono text-gray-400 mt-2">
                          <span>{s.minLabel}</span>
                          <span>{s.maxLabel}</span>
                        </div>
                      </div>

                      {/* Segment Explanations */}
                      <div className="space-y-4">
                        {s.segments?.map((segment, i) => {
                          const style = SEGMENT_STYLES[i] ?? SEGMENT_STYLES[SEGMENT_STYLES.length - 1];
                          const Icon = style.Icon;

                          return (
                            <div
                              key={segment.id ?? i}
                              className={`flex items-start gap-4 p-4 rounded-[6px] border bg-white transition-all ${style.border}`}
                            >
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${style.tint}`}>
                                <Icon size={16} />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-baseline mb-1">
                                  <h4 className={`text-xs font-bold uppercase tracking-wider ${style.title}`}>{segment.title}</h4>
                                  <span className={`text-xs font-bold font-mono ${style.amount}`}>
                                    ₦{(segmentAmounts[i] ?? 0).toFixed(1)}B
                                  </span>
                                </div>
                                <p className="text-[11px] text-gray-400 leading-relaxed font-sans font-light">
                                  {segment.description}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Stack Visualization */}
                  <div className="lg:col-span-6 flex flex-col items-center justify-center">
                    <div className="relative w-full max-w-[320px] aspect-[4/5] bg-white border border-gray-100/70 rounded-[12px] p-8 flex flex-col justify-end">

                      {/* InfraCredit AAA wrap boundary */}
                      <div className="absolute inset-x-4 top-10 bottom-20 border-2 border-dashed border-[#81C34D] rounded-[6px] pointer-events-none flex items-start justify-center">
                        <div className="bg-[#81C34D] text-[#051F1A] px-3 py-1 text-[8px] font-mono font-bold uppercase tracking-widest rounded-full -mt-2.5 shadow-md flex items-center gap-1">
                          <ShieldCheck size={10} />
                          {s.wrapBadge}
                        </div>
                      </div>

                      {/* Bar chart area */}
                      <div className="flex-grow flex items-end justify-center w-full relative pt-12 pb-2 h-[260px]">
                        <motion.div
                          layout
                          style={{ height: `${(projectSize / MAX_PROJECT_SIZE) * 100}%` }}
                          transition={{ type: "spring", stiffness: 260, damping: 26 }}
                          className="w-24 flex flex-col justify-end gap-1.5 z-10"
                        >
                          {BAR_STYLES.map((bar, i) => {
                            const content = s.bars?.[i] ?? ABOUT_CAPITAL_STACK_DEFAULTS.bars[i];

                            return (
                              <motion.div
                                key={content?.label ?? i}
                                layout
                                style={{ height: bar.height }}
                                className={`w-full rounded-[4px] flex flex-col justify-between p-3 cursor-pointer border ${bar.bg} ${bar.border}`}
                                whileHover={{ scale: 1.02 }}
                              >
                                <span className="text-[10px] font-bold text-white font-mono leading-none">{content?.percent}</span>
                                <span className={`text-[8px] font-mono uppercase truncate tracking-wider ${bar.label}`}>{content?.label}</span>
                              </motion.div>
                            );
                          })}
                        </motion.div>
                      </div>

                      {/* Dynamic Label */}
                      <div className="border-t border-gray-150 pt-4 mt-2 text-center">
                        <span className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-widest block">{s.totalLabel}</span>
                        <span className="text-xl font-bold font-sans text-brand-dark">₦{projectSize.toFixed(1)}{s.totalSuffix}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
