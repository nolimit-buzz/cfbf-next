"use client";

import { motion } from 'framer-motion';
import GlassHero from '@/components/GlassHero';
import { StatCard, SliderStatCard } from '@/components/ui/StatCard';
import { ABOUT_HERO_DEFAULTS } from '@/lib/cms/about-defaults';
import { withoutEmpty } from '@/lib/cms/content';
import type { AboutHeroSection } from '@/lib/cms/about-types';

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const statRow = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.55 } },
};

const statCard = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/**
 * Look of each stat card, positionally matched to `stats[]`.
 *
 * The CMS carries the words; the palette and card treatment are design, not
 * copy, so they stay here. Cards beyond this list are ignored rather than
 * rendered unstyled — the row is a fixed four-up layout.
 */
const STAT_STYLES = [
  { theme: 'light' as const, flat: true, accentColor: '#00A788' },
  { theme: 'cyan' as const, flat: false, accentColor: '#009FD4' },
];

export default function AboutHero({ data }: { data?: AboutHeroSection }) {
  const c = { ...ABOUT_HERO_DEFAULTS, ...withoutEmpty(data) };

  return (
    <GlassHero
      title={
        <>
          {c.headingPartOne}
          <span className="text-brand-accent">{c.headingHighlight}</span>
          {c.headingPartTwo}
          <span className="italic font-serif text-[#9BB7B1]">{c.headingItalic}</span>
        </>
      }
      subtitle={c.eyebrow}
      currentPage={c.breadcrumbLabel}
      bgImage={c.backgroundImage}
      description={
        <>
          <p>{c.bodyPartOne}</p>
          <p>{c.bodyPartTwo}</p>
        </>
      }
    >
      {/* Hero stats cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8"
        variants={statRow}
        initial="hidden"
        animate="show"
      >
        <motion.div
          variants={statCard}
          className="rounded-[6px] overflow-hidden min-h-[200px] lg:min-h-0 relative group"
          whileHover={{ scale: 1.01 }}
        >
          <img
            src={c.statImage}
            alt={c.statImage_alt_text}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/40 to-transparent" />
        </motion.div>

        {STAT_STYLES.map((style, i) => {
          const stat = c.stats?.[i];
          if (!stat) return null;

          return (
            <motion.div key={stat.cardNumber || i} variants={statCard} whileHover={{ y: -4 }}>
              <StatCard
                theme={style.theme}
                flat={style.flat}
                number={stat.cardNumber}
                value={stat.value}
                label={stat.label}
                sub={stat.sub}
                accentColor={style.accentColor}
                className="h-full"
              />
            </motion.div>
          );
        })}

        <motion.div variants={statCard} whileHover={{ y: -4 }}>
          <SliderStatCard
            theme="green"
            number="03"
            stats={c.sliderStats}
            accentColor="#81C34D"
            className="h-full"
          />
        </motion.div>
      </motion.div>
    </GlassHero>
  );
}
