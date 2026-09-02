"use client";

import { motion } from 'framer-motion';
import { PlusIcon, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { ABOUT_PARTNERS_DEFAULTS } from '@/lib/cms/about-defaults';
import { withoutEmpty } from '@/lib/cms/content';
import type { AboutPartner, AboutPartnersSection } from '@/lib/cms/about-types';

// --- Easing ---
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];
const up = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-20px' },
  transition: { duration: 0.5, ease: EASE, delay },
});

/**
 * Per-partner presentation, matched positionally to `groups[i].partners[j]`.
 *
 * The CMS holds each partner's name, role and logo URL; what colour a text-only
 * wordmark turns on hover is a design decision that would be meaningless as an
 * editable field. `emptyCells` pads each row out to the four-up grid.
 *
 * Only wordmark partners need an entry — image logos all render at `LOGO_CLASS`
 * — so a partner with no entry here still renders, and adding one in Strapi
 * never leaves a hole.
 */
/** Type scale for a text-only wordmark, and the tighter variant for long ones. */
const WORDMARK_DEFAULT = 'text-[11px] tracking-widest';
const WORDMARK_SMALL = 'text-[10px] tracking-wide text-center leading-tight';

const GROUP_STYLES: {
  emptyCells: number;
  partners: { textColour?: string; textClass?: string }[];
}[] = [
  // The first three groups are image logos only — nothing to style per partner.
  { emptyCells: 3, partners: [] },
  { emptyCells: 2, partners: [] },
  { emptyCells: 3, partners: [] },
  {
    emptyCells: 0,
    partners: [
      { textColour: 'group-hover:text-[#C8102E]' },
      { textColour: 'group-hover:text-[#003087]' },
      { textColour: 'group-hover:text-[#0072CE]' },
      { textColour: 'group-hover:text-[#E31837]' },
      { textColour: 'group-hover:text-[#FF6600]' },
      // Longer acronyms drop a step in size and wrap rather than overflow.
      { textColour: 'group-hover:text-brand-accent', textClass: WORDMARK_SMALL },
      { textColour: 'group-hover:text-[#003087]', textClass: WORDMARK_SMALL },
    ],
  },
];

/** Every partner mark renders at one size, whatever its artwork's aspect ratio. */
const LOGO_CLASS = 'h-12 w-auto max-w-[160px]';
const DEFAULT_TEXT_COLOUR = 'group-hover:text-brand-accent';

/** The group that gets the "Partner with CFBF" call-to-action cell appended. */
const CTA_GROUP_CATEGORY = 'Domestic Institutional Investors';

/**
 * A partner's white knockout, lifting slightly on hover.
 *
 * The CMS also holds a full-colour variant per partner (`logoColour`, still
 * used by the footer marquee), but this grid deliberately ignores it: several
 * colour marks are near-black and read poorly on the near-black background.
 */
function LogoImg({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative flex items-center justify-center w-full h-full">
      <img
        src={src}
        alt={alt}
        className={`object-contain transition-transform duration-500 group-hover:scale-105 ${LOGO_CLASS}`}
        loading="lazy"
      />
    </div>
  );
}

/** Renders a partner's mark: an image logo if it has one, otherwise a wordmark. */
function PartnerLogo({
  partner,
  style,
}: {
  partner: AboutPartner;
  style?: { textColour?: string; textClass?: string };
}) {
  if (partner.logo) {
    return <LogoImg src={partner.logo} alt={partner.logo_alt_text || partner.name} />;
  }

  return (
    <div className="flex items-center justify-center">
      <span
        className={`text-white transition-colors duration-500 font-extrabold font-sans uppercase ${
          style?.textColour ?? DEFAULT_TEXT_COLOUR
        } ${style?.textClass ?? WORDMARK_DEFAULT}`}
      >
        {partner.logoText}
      </span>
    </div>
  );
}

type GridCell =
  | { type: 'partner'; partner: AboutPartner; style?: { textColour?: string; textClass?: string } }
  | { type: 'cta' }
  | { type: 'empty' };

export default function PartnerShowcase({ data }: { data?: AboutPartnersSection }) {
  const c = { ...ABOUT_PARTNERS_DEFAULTS, ...withoutEmpty(data) };
  const PARTNER_GROUPS = c.groups ?? [];

  return (
    <section className="py-10 bg-[#010908] text-white relative flex items-center min-h-[90vh] lg:min-h-[95vh]">
      {/* Background grid lines */}
      <div className="absolute inset-0 opacity-[0.012] pointer-events-none overflow-hidden" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      <div className="container mx-auto px-6 max-w-[1280px] w-full flex flex-col justify-center relative z-10">

        {/* Header */}
        <div className="max-w-3xl mb-8 text-left shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-6 bg-brand-accent" />
            <span className="text-brand-accent text-[10px] font-bold tracking-[0.2em] uppercase font-mono">
              {c.eyebrow}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight">
            {c.headingPrimary}
            <span className="text-[#9BB7B1] italic font-serif">{c.headingSecondary}</span>
          </h2>
        </div>

        {/* Seamless Grid Wrapper */}
        <div className="flex flex-col border-t border-b border-white/5 bg-[#010908] select-none rounded-[4px] overflow-hidden shrink-0">
          {PARTNER_GROUPS.map((group, groupIdx) => {
            const isInvestors = group.category === CTA_GROUP_CATEGORY;
            const groupStyle = GROUP_STYLES[groupIdx];

            const cells: GridCell[] = [
              ...(group.partners ?? []).map((p, partnerIdx) => ({
                type: 'partner' as const,
                partner: p,
                style: groupStyle?.partners[partnerIdx],
              })),
              ...(isInvestors ? [{ type: 'cta' as const }] : []),
              ...Array.from({ length: groupStyle?.emptyCells ?? 0 }).map(() => ({ type: 'empty' as const }))
            ];

            return (
              <motion.div
                key={group.category}
                {...up(groupIdx * 0.04)}
                className={`grid lg:grid-cols-12 gap-0 items-stretch border-white/5 relative z-10 ${
                  groupIdx > 0 ? 'border-t' : ''
                }`}
              >
                {/* Left Category Slab (3 cols) */}
                <div className="lg:col-span-3 p-5 md:p-6 bg-[#010908]/90 text-left flex flex-col justify-center">
                  <h3 className="text-[10px] font-bold font-mono uppercase tracking-[0.16em] text-brand-accent">
                    {group.category}
                  </h3>
                  <p className="text-xs md:text-[13px] text-gray-400 font-light font-sans mt-1 max-w-[28ch] leading-relaxed">
                    {group.description}
                  </p>
                </div>

                {/* Right Logo Grid (9 cols) */}
                <div className="lg:col-span-9 bg-[#010908]">
                  <div className="grid grid-cols-2 md:grid-cols-4 bg-[#010908] gap-0">
                    {cells.map((cell, idx) => {
                      const borderRightClass = (idx + 1) % 2 === 0
                        ? "border-r-0 md:border-r"
                        : "border-r";
                      const desktopBorderRightClass = (idx + 1) % 4 === 0
                        ? "md:border-r-0"
                        : "";

                      if (cell.type === 'partner') {
                        return (
                          <div
                            key={cell.partner.name}
                            className={`relative flex flex-col justify-center items-center px-4 py-4 border-white/5 h-24 md:h-28 bg-[#010908] group cursor-default overflow-hidden border-b ${borderRightClass} ${desktopBorderRightClass}`}
                          >
                            {/* Logo Display Container — unconstrained height so
                                the hover scale has room before the cell clips. */}
                            <div className="relative w-full flex items-center justify-center">
                              <PartnerLogo partner={cell.partner} style={cell.style} />
                            </div>

                            {/* Intersection Crosshair */}
                            <PlusIcon
                              className="absolute -right-[12px] -bottom-[12px] z-10 size-6 text-white/5 group-hover:text-brand-accent/25 transition-colors pointer-events-none"
                              strokeWidth={0.75}
                            />
                          </div>
                        );
                      }

                      if (cell.type === 'cta') {
                        return (
                          <Link
                            href={c.ctaHref}
                            key="cta-card"
                            className={`relative flex flex-col justify-center items-center px-4 py-6 border-white/5 h-24 md:h-28 bg-brand-primary/[0.01] hover:bg-brand-primary/5 group cursor-pointer transition-colors duration-300 overflow-hidden border-b ${borderRightClass} ${desktopBorderRightClass}`}
                          >
                            <div className="flex flex-col items-center justify-center text-center transform group-hover:-translate-y-3 transition-transform duration-300 relative z-10">
                              <PlusIcon className="size-5 text-brand-accent mb-1 group-hover:rotate-90 transition-transform duration-300" strokeWidth={2} />
                              <span className="text-[9px] font-bold uppercase tracking-wider font-mono text-brand-accent">{c.ctaLabel}</span>
                            </div>
                            <div className="absolute bottom-2 inset-x-2 text-center opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none z-10">
                              <span className="text-[8px] font-bold text-white uppercase tracking-wider flex items-center justify-center gap-0.5">
                                {c.ctaHoverLabel} <ArrowUpRight size={8} />
                              </span>
                            </div>
                            <PlusIcon
                              className="absolute -right-[12px] -bottom-[12px] z-10 size-6 text-white/5 group-hover:text-brand-accent/25 transition-colors pointer-events-none"
                              strokeWidth={0.75}
                            />
                          </Link>
                        );
                      }

                      return (
                        <div
                          key={`empty-${idx}`}
                          className={`relative border-white/5 h-24 md:h-28 bg-[#010908] pointer-events-none border-b ${borderRightClass} ${desktopBorderRightClass}`}
                        >
                          <PlusIcon
                            className="absolute -right-[12px] -bottom-[12px] z-10 size-6 text-white/5 pointer-events-none"
                            strokeWidth={0.75}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
