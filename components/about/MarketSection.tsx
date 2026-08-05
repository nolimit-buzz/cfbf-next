"use client";

import { motion } from 'framer-motion';
import { Building2, Briefcase, Landmark, TrendingUp, Users } from 'lucide-react';
import { ABOUT_MARKET_DEFAULTS } from '@/lib/cms/about-defaults';
import { withoutEmpty } from '@/lib/cms/content';
import type { AboutMarketSection as AboutMarketSectionData } from '@/lib/cms/about-types';

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.75, ease: EASE, delay },
});

export default function MarketSection({ data }: { data?: AboutMarketSectionData }) {
  const c = { ...ABOUT_MARKET_DEFAULTS, ...withoutEmpty(data) };

  /**
   * The bento is a hand-tuned mosaic — each tile has its own span, palette,
   * watermark icon and type scale — so tiles are written out rather than
   * looped. Only the words come from the CMS, read positionally.
   *
   * The photo tile has no `cards[]` entry of its own (it holds no copy), which
   * is why the card indices below skip over it.
   */
  const card = (i: number) => c.cards?.[i] ?? ABOUT_MARKET_DEFAULTS.cards[i];

  const gdp = card(0);
  const businesses = card(1);
  const employment = card(2);
  const pension = card(3);
  const smeCount = card(4);
  const pensionTarget = card(5);

  return (
    <section
      id="market"
      data-rag-chunk="about-market-thesis-v3"
      className="py-24 bg-white relative z-10 border-b border-gray-100 overflow-hidden"
    >
      <div className="container mx-auto px-6 max-w-[1280px] relative z-10 w-full">
        {/* Header row */}
        <motion.div {...fadeUp(0)} className="text-left mb-12 space-y-4">
          <div>
            <span className="text-brand-primary text-xs font-semibold tracking-[0.2em] uppercase font-mono block mb-2">
              {c.eyebrow}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-brand-dark font-sans tracking-tight leading-tight">
              {c.headingPrimary}
              <span className="text-[#7C9590] italic font-serif">{c.headingSecondary}</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 pt-4">
            <p className="text-gray-500 text-sm leading-relaxed">{c.bodyOne}</p>
            <p className="text-gray-500 text-sm leading-relaxed">{c.bodyTwo}</p>
          </div>
        </motion.div>

        {/* Bento Grid */}
        <motion.div {...fadeUp(0.08)} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 auto-rows-[minmax(150px,auto)] md:auto-rows-[160px]">
          {/* Card 1 */}
          <div className="col-span-2 row-span-2 bg-[#009FD4] text-white p-6 md:p-8 flex flex-col justify-between rounded-[8px] relative overflow-hidden group border border-[#009FD4]/10 transition-all duration-500 ease-[0.16,1,0.3,1] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#009FD4]/10 text-left">
            <div className="absolute -bottom-4 -right-4 opacity-[0.05] text-white group-hover:scale-105 transition-transform duration-500 pointer-events-none">
              <TrendingUp size={140} />
            </div>
            <div>
              <span className="text-5xl md:text-7xl font-bold font-mono leading-none tracking-tight block mb-3">{gdp.value}</span>
              <span className="text-xs md:text-sm font-sans text-white/90 block leading-snug max-w-md">
                {gdp.description}
              </span>
            </div>
            <div className="pt-4 border-t border-white/20 text-[11px] md:text-xs text-white/75 font-sans leading-relaxed mt-4">
              {gdp.footer}
            </div>
          </div>

          {/* Card 2 */}
          <div className="col-span-1 rounded-[8px] overflow-hidden border border-gray-100 shadow-sm h-full group relative transition-all duration-500 ease-[0.16,1,0.3,1] hover:-translate-y-1 hover:shadow-lg">
            <img
              src={c.bentoImage}
              alt={c.bentoImage_alt_text}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[0.16,1,0.3,1] group-hover:scale-[1.05]"
            />
            <div className="absolute inset-0 bg-brand-dark/10" />
          </div>

          {/* Card 3 */}
          <div className="col-span-1 border border-gray-100 bg-white rounded-[8px] p-5 md:p-6 text-left flex flex-col justify-between relative overflow-hidden group shadow-sm transition-all duration-500 ease-[0.16,1,0.3,1] hover:-translate-y-1 hover:shadow-lg hover:border-brand-primary/10">
            <div className="absolute -bottom-2 -right-2 opacity-[0.03] text-brand-dark group-hover:scale-105 transition-transform duration-500 pointer-events-none">
              <Building2 size={80} />
            </div>
            <span className="text-3xl md:text-4xl font-bold font-mono text-brand-dark leading-none block mb-4">{businesses.value}</span>
            <div>
              <span className="text-[9px] font-bold font-mono text-[#7C9590] uppercase tracking-widest block mb-1">{businesses.eyebrow}</span>
              <span className="text-xs text-gray-500 font-sans leading-snug">
                {businesses.description}
              </span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="col-span-1 bg-[#00A788] text-white p-5 md:p-6 flex flex-col justify-between rounded-[8px] relative overflow-hidden group shadow-sm transition-all duration-500 ease-[0.16,1,0.3,1] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#00A788]/10 text-left">
            <div className="absolute -bottom-2 -right-2 opacity-[0.06] text-white group-hover:scale-105 transition-transform duration-500 pointer-events-none">
              <Users size={80} />
            </div>
            <span className="text-3xl md:text-4xl font-bold font-mono leading-none tracking-tight block mb-4">{employment.value}</span>
            <span className="text-xs font-sans text-white/90 block leading-snug">
              {employment.description}
            </span>
          </div>

          {/* Card 5 */}
          <div className="col-span-1 bg-[#051F1A] text-white p-5 md:p-6 flex flex-col justify-between rounded-[8px] relative overflow-hidden group shadow-sm transition-all duration-500 ease-[0.16,1,0.3,1] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#051F1A]/20 text-left">
            <div className="absolute -bottom-2 -right-2 opacity-[0.06] text-white group-hover:scale-105 transition-transform duration-500 pointer-events-none">
              <Landmark size={80} />
            </div>
            <span className="text-3xl md:text-4xl font-bold font-mono leading-none tracking-tight block mb-4">{pension.value}</span>
            <div>
              <span className="text-[9px] font-bold font-mono text-brand-accent uppercase tracking-widest block mb-1">{pension.eyebrow}</span>
              <span className="text-xs font-sans text-white/80 block leading-snug">
                {pension.description}
              </span>
            </div>
          </div>

          {/* Card 6 */}
          <div className="col-span-2 bg-[#051F1A] text-white p-5 md:p-6 flex flex-col justify-between rounded-[8px] relative overflow-hidden group shadow-sm transition-all duration-500 ease-[0.16,1,0.3,1] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#051F1A]/20 text-left">
            <div className="absolute -bottom-4 -right-4 opacity-[0.06] text-white group-hover:scale-105 transition-transform duration-500 pointer-events-none">
              <Briefcase size={100} />
            </div>
            <span className="text-4xl md:text-5xl lg:text-6xl font-bold font-mono leading-none tracking-tight block mb-4">{smeCount.value}</span>
            <div>
              <span className="text-[9px] font-bold font-mono text-brand-accent uppercase tracking-widest block mb-1">
                {smeCount.eyebrow}
              </span>
              <span className="text-xs font-sans text-white/80 block leading-snug max-w-xl">
                {smeCount.description}
              </span>
            </div>
          </div>

          {/* Card 7 */}
          <div className="col-span-2 bg-[#81C34D] text-[#051F1A] p-5 md:p-6 flex flex-col justify-between rounded-[8px] relative overflow-hidden group shadow-sm transition-all duration-500 ease-[0.16,1,0.3,1] hover:-translate-y-1 hover:shadow-lg hover:shadow-[#81C34D]/20 text-left">
            <div className="absolute -bottom-4 -right-4 opacity-[0.08] text-[#051F1A] group-hover:scale-105 transition-transform duration-500 pointer-events-none">
              <TrendingUp size={100} />
            </div>
            <span className="text-4xl md:text-5xl lg:text-6xl font-bold font-mono leading-none tracking-tight block mb-4">{pensionTarget.value}</span>
            <p className="text-xs font-sans text-[#051F1A]/95 leading-snug max-w-xl">
              {pensionTarget.description}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
