"use client";

import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { ABOUT_MANDATE_DEFAULTS } from '@/lib/cms/about-defaults';
import { withoutEmpty } from '@/lib/cms/content';
import type { AboutMandateSection as AboutMandateSectionData } from '@/lib/cms/about-types';

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.75, ease: EASE, delay },
});

export default function MandateSection({
  data,
  onPlayVideo,
}: {
  data?: AboutMandateSectionData;
  onPlayVideo?: () => void;
}) {
  const c = { ...ABOUT_MANDATE_DEFAULTS, ...withoutEmpty(data) };

  // The bento grid is a fixed three-tile layout: a tall video tile on the left
  // and two stacked images on the right. Captions map onto it positionally, so
  // the tiles are read out by index rather than looped over.
  const [videoCaption, topCaption, bottomCaption] = c.captions ?? [];

  return (
    <section
      id="mandate"
      data-rag-chunk="about-mandate-v3"
      className="relative py-24 bg-[#FAFDFB] border-b border-gray-100 overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-brand-primary/[0.03] to-transparent rounded-full blur-[100px]" />
      </div>
      <div className="container mx-auto px-6 max-w-[1280px] relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">

          {/* Left Column - Text and Numbers */}
          <motion.div {...fadeUp(0)} className="lg:col-span-7 space-y-6 text-left">
            <div>
              <span className="text-brand-primary text-xs font-semibold tracking-[0.2em] uppercase font-mono block mb-2">
                {c.eyebrow}
              </span>
              <h2 className="text-3xl md:text-[2.5rem] font-bold text-brand-dark font-sans tracking-tight leading-[1.1] max-w-xl">
                {c.heading}
              </h2>
              <p className="text-gray-500 text-sm md:text-base font-sans leading-relaxed mt-4 max-w-xl">
                {c.body}
              </p>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <h3 className="text-xs font-bold text-brand-primary uppercase tracking-wider mb-3 font-mono">
                {c.mandateHeading}
              </h3>
              <div className="grid md:grid-cols-2 gap-6 text-xs md:text-sm text-gray-500 font-sans leading-relaxed">
                {c.paragraphs?.map((paragraph, i) => (
                  <p key={paragraph.id ?? i}>{paragraph.text}</p>
                ))}
              </div>
            </div>

            {/* The Numbers grid */}
            <div className="pt-6 border-t border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-4 font-mono">
                {c.numbersLabel}
              </span>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {c.numbers?.map((number, i) => (
                  <div key={number.id ?? i}>
                    <span className="text-2xl md:text-3xl font-bold font-mono text-brand-dark block">
                      {number.value}
                    </span>
                    <span className="text-[10px] text-gray-400 font-sans block mt-1">{number.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column - Bento Grid */}
          <motion.div {...fadeUp(0.12)} className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-4 h-[440px] md:h-[500px]">
              {/* Left tall card - looping video player */}
              <div className="relative rounded-[12px] overflow-hidden border border-gray-100/70 shadow-sm h-full flex flex-col justify-end group">
                <video
                  src={c.bentoVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-brand-dark/35 group-hover:bg-brand-dark/25 transition-colors z-10" />

                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onPlayVideo}
                    className="w-14 h-14 bg-brand-accent hover:bg-white text-brand-dark rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer focus:outline-none"
                    aria-label="Play Video"
                  >
                    <Play size={18} fill="currentColor" className="ml-0.5" />
                  </motion.button>
                </div>

                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent pointer-events-none z-10" />
                <span className="relative z-20 text-[10px] font-mono text-white/90 uppercase tracking-wider p-4 leading-none font-bold">
                  {videoCaption?.label}
                </span>
              </div>

              {/* Right stacked images */}
              <div className="grid grid-rows-2 gap-4 h-full">
                {[topCaption, bottomCaption].map((caption, i) => (
                  <div
                    key={caption?.id ?? i}
                    className="relative rounded-[12px] overflow-hidden border border-gray-100/70 shadow-sm h-full flex flex-col justify-end group"
                  >
                    <img
                      src={caption?.image}
                      alt={caption?.image_alt_text}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/50 via-transparent to-transparent pointer-events-none" />
                    <span className="relative z-10 text-[10px] font-mono text-white/90 uppercase tracking-wider p-4 leading-none font-bold">
                      {caption?.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
