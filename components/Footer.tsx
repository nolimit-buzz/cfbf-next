"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Facebook, Twitter, Linkedin, Instagram, Youtube, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { GLOBAL_DEFAULTS, type SocialLinkItem, type SocialPlatform } from '@/lib/cms/global-defaults';
import { FOOTER_DEFAULTS, type PartnerLogoItem } from '@/lib/cms/footer-defaults';

const BASE = "https://infracredit.ng/climate-facility/wp-content/uploads";

// Anchor funders — confirmed white PNG logos from live site
const ANCHOR_FUNDERS = [
  {
    src: `${BASE}/2022/10/UK-DEVELOPMENT-WHITE.png`,
    alt: "UK International Development",
    href: "https://www.gov.uk/government/organisations/foreign-commonwealth-development-office",
  },
  {
    src: `${BASE}/2022/10/BII_Logo_All_white_RGB.png`,
    alt: "British International Investment",
    href: "https://www.bii.co.uk/",
  },
];

// Co-financing — white PNG default, coloured SVG on hover
const CO_FINANCING = {
  // white version (PNG from live site)
  srcWhite: `${BASE}/2022/09/ICAsset-6@4x-8-002-1024x326-1.png`,
  // coloured SVG version
  srcColour: `${BASE}/2022/09/InfraCredit-1.svg`,
  alt: "InfraCredit",
  href: "https://infracredit.ng/",
};

// TA logos — already white or can be shown white via filter
const TA_PROVIDERS = [
  {
    src: `${BASE}/2022/10/FSD-Africa-logo-1.png`,
    alt: "FSD Africa",
    href: "https://fsdafrica.org/",
  },
  {
    src: `${BASE}/2022/10/Shell-foundation-1.png`,
    alt: "Shell Foundation",
    href: "https://shellfoundation.org/",
  },
  {
    src: `${BASE}/2022/10/kfw.png`,
    alt: "KfW",
    href: "https://www.kfw.de/",
  },
];

// Reusable logo component: white by default, colour on hover
const PartnerLogo = ({ src, alt, className = "" }: { src: string; alt: string; className?: string }) => (
  <div className="relative group/logo">
    {/* White default */}
    <img
      src={src}
      alt={alt}
      className={`object-contain brightness-0 invert transition-all duration-400 group-hover/logo:opacity-0 group-hover/logo:scale-95 ${className}`}
      loading="lazy"
    />
    {/* Colour on hover (same img, no filter) */}
    <img
      src={src}
      alt=""
      aria-hidden="true"
      className={`object-contain absolute inset-0 transition-all duration-400 opacity-0 scale-95 group-hover/logo:opacity-100 group-hover/logo:scale-100 ${className}`}
      loading="lazy"
    />
  </div>
);

const TaSlider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % TA_PROVIDERS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const item = TA_PROVIDERS[current];

  return (
    <div className="relative h-10 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.a
          key={current}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 flex items-center justify-center lg:justify-start group/ta"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {/* White by default */}
          <img
            src={item.src}
            alt={item.alt}
            className="h-7 w-auto object-contain brightness-0 invert absolute transition-all duration-400 group-hover/ta:opacity-0 group-hover/ta:scale-95"
            loading="lazy"
          />
          {/* Colour on hover */}
          <img
            src={item.src}
            alt=""
            aria-hidden="true"
            className="h-7 w-auto object-contain absolute opacity-0 scale-95 transition-all duration-400 group-hover/ta:opacity-100 group-hover/ta:scale-100"
            loading="lazy"
          />
        </motion.a>
      </AnimatePresence>
      {/* Dot indicators */}
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 flex gap-1.5">
        {TA_PROVIDERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              i === current ? "bg-brand-accent w-3" : "bg-white/20"
            }`}
            aria-label={`View ${TA_PROVIDERS[i].alt}`}
          />
        ))}
      </div>
    </div>
  );
};

const PartnersColumn = () => (
  <div className="text-center lg:text-left space-y-8">
    {/* Anchor Funders */}
    <div>
      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 font-sans mb-4">
        Anchor Funders
      </p>
      {/* Stacked and centred on mobile, side-by-side from lg */}
      <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-center">
        {ANCHOR_FUNDERS.map((f) => (
          <a key={f.alt} href={f.href} target="_blank" rel="noopener noreferrer" className="interactive">
            <PartnerLogo src={f.src} alt={f.alt} className="h-8 w-auto" />
          </a>
        ))}
      </div>
    </div>

    {/* Co-Financing Partner */}
    <div>
      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 font-sans mb-4">
        Co-Financing Partner
      </p>
      <div className="flex justify-center lg:justify-start">
        <a href={CO_FINANCING.href} target="_blank" rel="noopener noreferrer" className="interactive relative inline-block group/ic">
          {/* White PNG default — kept in flow so the anchor has height */}
          <img
            src={CO_FINANCING.srcWhite}
            alt={CO_FINANCING.alt}
            className="h-7 w-auto object-contain transition-all duration-400 group-hover/ic:opacity-0 group-hover/ic:scale-95"
            loading="lazy"
          />
          {/* Coloured SVG on hover */}
          <img
            src={CO_FINANCING.srcColour}
            alt=""
            aria-hidden="true"
            className="h-7 w-auto object-contain absolute inset-0 opacity-0 scale-95 transition-all duration-400 group-hover/ic:opacity-100 group-hover/ic:scale-100"
            loading="lazy"
          />
        </a>
      </div>
    </div>

    {/* Technical Assistance Providers */}
    <div>
      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 font-sans mb-4">
        Technical Assistance Providers
      </p>
      <TaSlider />
    </div>
  </div>
);

// ─── Partner Marquee Logos (White-by-default, Colored-on-hover) ─────────────
// Generic, data-driven mark for any partner whose logo doesn't need special
// treatment: a single image, dimmed by default and full-opacity on hover.
const MarqueeLogo = ({ src, alt }: { src: string; alt: string }) => (
  <div className="relative h-8 w-24 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
    <img
      src={src}
      alt={alt}
      className="h-7 w-auto object-contain opacity-50 group-hover:opacity-100 transition-opacity duration-300"
      loading="lazy"
    />
  </div>
);

// InfraCredit and Shell Foundation need a white/invert default that
// crossfades to a true-colour version on hover (their marks read poorly at
// reduced opacity) — kept as bespoke overrides rather than CMS-driven data.
const InfraCreditMarqueeLogo = () => (
  <div className="relative h-8 w-28 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
    {/* White version default */}
    <img
      src={`${BASE}/2022/09/ICAsset-6@4x-8-002-1024x326-1.png`}
      alt="InfraCredit"
      className="h-7 w-auto object-contain absolute opacity-50 group-hover:opacity-0 transition-opacity duration-300"
      loading="lazy"
    />
    {/* Colored version hover */}
    <img
      src={`${BASE}/2022/09/InfraCredit-1.svg`}
      alt="InfraCredit"
      className="h-7 w-auto object-contain absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      loading="lazy"
    />
  </div>
);

const ShellFoundationMarqueeLogo = () => (
  <div className="relative h-8 w-24 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
    {/* White version (filtered) */}
    <img
      src={`${BASE}/2022/10/Shell-foundation-1.png`}
      alt="Shell Foundation"
      className="h-7 w-auto object-contain absolute brightness-0 invert opacity-50 group-hover:opacity-0 transition-all duration-300"
      loading="lazy"
    />
    {/* Colored version hover */}
    <img
      src={`${BASE}/2022/10/Shell-foundation-1.png`}
      alt="Shell Foundation"
      className="h-7 w-auto object-contain absolute opacity-0 group-hover:opacity-100 transition-all duration-300"
      loading="lazy"
    />
  </div>
);

/** Name -> bespoke override. Any partner not listed here renders via `MarqueeLogo`. */
const MARQUEE_LOGO_OVERRIDES: Record<string, React.ReactNode> = {
  InfraCredit: <InfraCreditMarqueeLogo />,
  'Shell Foundation': <ShellFoundationMarqueeLogo />,
};

const PartnerMarquee = ({ partnerLogos = FOOTER_DEFAULTS.partnerLogos }: { partnerLogos?: PartnerLogoItem[] }) => {
  const partners = partnerLogos.map((p) => ({
    name: p.name,
    logo: MARQUEE_LOGO_OVERRIDES[p.name] ?? (p.logo ? <MarqueeLogo src={p.logo} alt={p.logo_alt_text || p.name} /> : null),
  }));
  // Triplicate for seamless loop
  const items = [...partners, ...partners, ...partners];

  return (
    <div className="pt-20 pb-10 relative z-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <span className="text-[10px] font-bold tracking-[0.25em] text-brand-accent uppercase opacity-70 font-sans">
            Domestic Institutional Investors &amp; Partners
          </span>
        </div>

        <div className="relative w-full overflow-hidden border-y border-white/5 py-8">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#02100d] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#02100d] to-transparent z-10 pointer-events-none" />

          {/* Pure CSS marquee — GPU-accelerated, zero JS overhead */}
          <div
            className="flex items-center gap-16 md:gap-24 whitespace-nowrap"
            style={{
              width: 'max-content',
              animation: 'marquee-scroll 40s linear infinite',
              willChange: 'transform',
            }}
          >
            {items.map((partner, i) => (
              <div key={i} className="group flex flex-col items-center justify-center min-w-[140px] min-h-[52px] transition-all duration-300 px-4">
                {partner.logo ? (
                  <>
                    {partner.logo}
                    <span className="text-[10px] tracking-wider text-white/35 group-hover:text-white transition-colors duration-500 font-sans font-medium uppercase mt-2 select-none">
                      {partner.name}
                    </span>
                  </>
                ) : (
                  <span className="text-xs font-semibold tracking-wider text-white/45 group-hover:text-white transition-colors duration-500 font-sans uppercase select-none py-2 text-center">
                    {partner.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const CTASection = () => {
  return (
    <div className="py-12 relative z-10">
      <div className="container mx-auto px-6">
        <div className="relative w-full rounded-[6px] overflow-hidden min-h-[350px] flex items-center group shadow-2xl border border-white/5">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop"
              alt="Solar Engineer"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#051F1A] via-[#051F1A]/95 to-transparent z-10" />
          <div className="absolute inset-0 bg-brand-dark/20 z-10" />
          <div className="relative z-20 p-8 md:p-16 max-w-3xl flex flex-col justify-center h-full">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight font-sans tracking-tight">
              Download 2025 <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-white">Impact Report</span>
            </h2>
            <p className="text-gray-300 text-lg font-light mb-8 leading-relaxed font-sans max-w-lg">
              Access comprehensive data on our sustainable energy portfolio, financial performance, and environmental metrics.
            </p>
            <a
              href="/download.pdf"
              download="CFBF_Impact_Report_2025.pdf"
              className="bg-white text-brand-dark px-8 py-3 rounded-full flex items-center w-fit gap-4 font-bold uppercase tracking-wider text-xs transition-all duration-300 hover:bg-brand-accent hover:shadow-[0_0_30px_rgba(72,192,163,0.4)] interactive group/btn"
            >
              <span>Download PDF</span>
              <div className="w-8 h-8 bg-brand-dark text-white rounded-full flex items-center justify-center transition-transform duration-300 group-hover/btn:scale-110">
                <Download size={14} className="group-hover/btn:translate-y-0.5 transition-transform duration-300" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

/** Platform key -> icon. The CMS supplies the URL; the icon stays in code. */
const SOCIAL_ICONS: Record<SocialPlatform, LucideIcon> = {
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  instagram: Instagram,
  youtube: Youtube,
};

interface FooterProps {
  /** Footer social profiles from the CMS. Entries with a blank url are skipped. */
  socialLinks?: SocialLinkItem[];
  /** "Domestic Institutional Investors & Partners" marquee logos from the CMS. */
  partnerLogos?: PartnerLogoItem[];
}

const Footer = ({
  socialLinks = GLOBAL_DEFAULTS.socialLinks,
  partnerLogos = FOOTER_DEFAULTS.partnerLogos,
}: FooterProps) => (
  <footer className="bg-[#02100d] text-white pt-0 pb-12 border-t border-white/5 relative z-20 overflow-hidden">

    <PartnerMarquee partnerLogos={partnerLogos} />
    <CTASection />

    <div className="container mx-auto px-6 border-t border-white/10 pt-24 mt-8">
      <div className="grid lg:grid-cols-4 gap-12 mb-24">
        {/* Col 1: Brand */}
        <div className="flex flex-col items-center lg:items-start lg:col-span-1">
          <Link href="/" className="flex items-center mb-8 interactive group">
            <img
              src="https://infracredit.ng/climate-facility/wp-content/uploads/2022/09/climate-white-logo.svg"
              alt="CFBF Logo"
              className="h-10 w-auto transition-opacity duration-300"
            />
          </Link>
        </div>

        {/* Col 2: Quick Links */}
        <div className="text-center lg:text-left">
          <h4 className="font-bold text-lg mb-6 font-sans">Quick Links</h4>
          <ul className="space-y-3 text-gray-400 text-sm font-sans">
            {[
              { label: 'About', href: '/about' },
              { label: 'How It Works', href: '/how-it-works' },
              { label: 'Eligibility', href: '/eligibility' },
              { label: 'News', href: '/news' },
              { label: 'Impact', href: '/impact' },
              { label: 'Contact', href: '/contact' },
            ].map(({ label, href }) => (
              <li key={label} className="hover:text-brand-accent transition-colors interactive w-fit mx-auto lg:mx-0">
                <Link href={href}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: More from the Facility */}
        <div className="text-center lg:text-left">
          <h4 className="font-bold text-lg mb-6 font-sans">More from the Facility</h4>
          <ul className="space-y-3 text-gray-400 text-sm font-sans">
            {[
              { label: 'Projects', href: '/projects' },
              { label: 'Impact Report', href: '/impact' },
              { label: 'Eligibility Assessment', href: '/eligibility/assessment' },
              { label: 'Nigeria Energy Map', href: '/about#energy-map' },
              { label: 'Facility Architecture', href: '/how-it-works#architecture' },
              { label: 'Dealflow Overview', href: '/projects#facility-pipeline' },
              { label: 'Funder Login', href: '/funder-login' },
            ].map(({ label, href }) => (
              <li key={label} className="hover:text-brand-accent transition-colors interactive w-fit mx-auto lg:mx-0">
                <Link href={href}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Partners */}
        <PartnersColumn />
      </div>

      <div className="pt-12 border-t border-white/5 flex flex-col items-center gap-8">
        <div className="flex gap-6">
          {socialLinks.map((social, i) => {
            const Icon = SOCIAL_ICONS[social.platform];
            if (!Icon) return null;

            const href = (social.url ?? '').trim();
            const label = social.label || social.platform;
            const isLive = href !== '' && href !== '#';
            const icon = <Icon size={18} className="opacity-80 transition-opacity" />;

            // The row always shows all five icons so the footer never looks
            // half-built. Only the ones with a real URL become links — the
            // rest render as plain marks rather than the `href="#"` that made
            // them look clickable while doing nothing.
            return isLive ? (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-white hover:text-brand-accent cursor-pointer transition-colors interactive p-2 hover:bg-white/5 rounded-full focus:outline-none"
              >
                {icon}
              </a>
            ) : (
              <span
                key={i}
                aria-label={`${label} (coming soon)`}
                title={`${label} — link coming soon`}
                className="text-white/60 cursor-default p-2 rounded-full"
              >
                {icon}
              </span>
            );
          })}
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 text-gray-600 text-sm font-sans">
          <Link href="/privacy" className="hover:text-brand-accent transition-colors">Privacy Policy</Link>
          <span className="hidden md:inline text-gray-700">•</span>
          <Link href="/terms" className="hover:text-brand-accent transition-colors">Terms of Use</Link>
          <span className="hidden md:inline text-gray-700">•</span>
          <span>© 2025 Climate Finance Blending Facility</span>
          <span className="hidden md:inline text-gray-700">|</span>
          <span>
            <a
              href="https://nolimitbuzz.net"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-accent transition-colors"
            >
              Web Design
            </a>
          </span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
