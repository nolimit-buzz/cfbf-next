"use client";

import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { ABOUT_DOWNLOAD_CTA_DEFAULTS } from '@/lib/cms/about-defaults';
import { withoutEmpty } from '@/lib/cms/content';
import { downloadFile } from '@/lib/downloadFile';
import type { AboutDownloadCtaSection } from '@/lib/cms/about-types';

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.75, ease: EASE, delay },
});

export default function DownloadCta({ data }: { data?: AboutDownloadCtaSection }) {
  const c = { ...ABOUT_DOWNLOAD_CTA_DEFAULTS, ...withoutEmpty(data) };

  return (
    <div data-rag-chunk="about-download-cta" className="relative z-10">
      <div className="min-h-[460px] relative flex items-center justify-center group overflow-hidden">
        <img
          src={c.backgroundImage}
          alt={c.backgroundImage_alt_text}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-brand-dark/70 group-hover:bg-brand-dark/65 transition-colors z-10" />
        <motion.div {...fadeUp(0)} className="relative z-20 text-center max-w-2xl px-6 flex flex-col items-center">
          <span className="text-brand-accent text-xs font-bold uppercase tracking-[0.25em] mb-4 block font-mono">{c.eyebrow}</span>
          <h3 className="text-white text-3xl md:text-4xl font-bold font-sans mb-4 leading-tight">{c.heading}</h3>
          <p className="text-white/75 font-sans text-sm md:text-base leading-relaxed mb-8 max-w-xl">
            {c.body}
          </p>
          <motion.button
            onClick={() => downloadFile(c.buttonHref, c.downloadFileName)}
            whileHover={{ scale: 1.05, backgroundColor: '#ffffff', color: '#051F1A' }}
            whileTap={{ scale: 0.97 }}
            className="bg-brand-accent text-brand-dark px-8 py-4 rounded-[6px] flex items-center gap-3 font-bold uppercase tracking-wider text-xs shadow-lg shadow-brand-accent/25 transition-all duration-300 font-sans cursor-pointer focus:outline-none"
          >
            <Download size={16} />
            {c.buttonLabel}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
