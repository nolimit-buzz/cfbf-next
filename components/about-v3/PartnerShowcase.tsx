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
 * The CMS holds each partner's name, role and logo URL; how big that logo
 * renders, and what colour a text-only wordmark turns on hover, are design
 * decisions that would be meaningless as editable fields. `emptyCells` pads
 * each row out to the four-up grid.
 *
 * A partner with no entry here still renders — it just falls back to the
 * default logo size and accent — so adding one in Strapi never leaves a hole.
 */
/** Type scale for a text-only wordmark, and the tighter variant for long ones. */
const WORDMARK_DEFAULT = 'text-[11px] tracking-widest';
const WORDMARK_SMALL = 'text-[10px] tracking-wide text-center leading-tight';

const GROUP_STYLES: {
  emptyCells: number;
  partners: { logoClass?: string; textColour?: string; textClass?: string }[];
}[] = [
  {
    emptyCells: 2,
    partners: [{ logoClass: 'h-9 w-auto max-w-[110px]' }, { logoClass: 'h-9 w-auto max-w-[120px]' }],
  },
  {
    emptyCells: 2,
    partners: [{ logoClass: 'h-8 w-auto max-w-[110px]' }, { logoClass: 'h-8 w-auto max-w-[110px]' }],
  },
  {
    emptyCells: 3,
    partners: [{ logoClass: 'h-7 w-auto max-w-[130px]' }],
  },
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

const DEFAULT_LOGO_CLASS = 'h-8 w-auto max-w-[110px]';
const DEFAULT_TEXT_COLOUR = 'group-hover:text-brand-accent';

/** The group that gets the "Partner with CFBF" call-to-action cell appended. */
const CTA_GROUP_CATEGORY = 'Domestic Institutional Investors';

// Reusable: white by default → full colour on hover
function LogoImg({
  src,
  alt,
  className = "h-8 w-auto",
  colourSrc,
}: {
  src: string;
  alt: string;
  className?: string;
  colourSrc?: string; // if a separate coloured version exists
}) {
  const colour = colourSrc ?? src;
  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {/* White version */}
      <img
        src={src}
        alt={alt}
        className={`object-contain brightness-0 invert transition-all duration-500 absolute group-hover:opacity-0 group-hover:scale-90 ${className}`}
        loading="lazy"
      />
      {/* Colour version */}
      <img
        src={colour}
        alt=""
        aria-hidden="true"
        className={`object-contain transition-all duration-500 absolute opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 ${className}`}
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
  style?: { logoClass?: string; textColour?: string; textClass?: string };
}) {
  if (partner.logo) {
    return (
      <LogoImg
        src={partner.logo}
        alt={partner.logo_alt_text || partner.name}
        colourSrc={partner.logoColour ?? undefined}
        className={style?.logoClass ?? DEFAULT_LOGO_CLASS}
      />
    );
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
  | { type: 'partner'; partner: AboutPartner; style?: { logoClass?: string; textColour?: string; textClass?: string } }
  | { type: 'cta' }
  | { type: 'empty' };

export default function PartnerShowcase({ data }: { data?: AboutPartnersSection }) {
  const c = { ...ABOUT_PARTNERS_DEFAULTS, ...withoutEmpty(data) };
  const PARTNER_GROUPS = c.groups ?? [];

  return (
    <section className="py-10 bg-[#010908] text-white relative overflow-hidden flex items-center min-h-[90vh] lg:min-h-0 lg:h-[95vh]">
      {/* Background grid lines */}
      <div className="absolute inset-0 opacity-[0.012] pointer-events-none" style={{
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
                            className={`relative flex flex-col justify-center items-center px-4 py-6 border-white/5 h-24 md:h-28 bg-[#010908] group cursor-default overflow-hidden border-b ${borderRightClass} ${desktopBorderRightClass}`}
                          >
                            {/* Logo Display Container */}
                            <div className="relative h-12 w-full flex items-center justify-center">
                              <PartnerLogo partner={cell.partner} style={cell.style} />
                            </div>

                            {/* Name panel — fades/slides up on hover */}
                            <div className="absolute bottom-2 inset-x-2 text-center opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 pointer-events-none z-10">
                              <span className="text-[9px] text-white block font-sans truncate font-semibold leading-none">
                                {cell.partner.name}
                              </span>
                              <span className="text-[7.5px] font-bold text-brand-accent uppercase tracking-widest font-mono block mt-0.5 opacity-90">
                                {cell.partner.role}
                              </span>
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
