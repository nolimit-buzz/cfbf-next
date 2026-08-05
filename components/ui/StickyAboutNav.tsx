"use client";

import React, { useState, useEffect } from 'react';
import { ABOUT_STICKY_NAV_DEFAULTS } from '@/lib/cms/about-defaults';
import { withoutEmpty } from '@/lib/cms/content';
import type { AboutStickyNavSection } from '@/lib/cms/about-types';

export default function StickyAboutNav({ data }: { data?: AboutStickyNavSection }) {
  const { links: navItems } = { ...ABOUT_STICKY_NAV_DEFAULTS, ...withoutEmpty(data) };
  const [activeSection, setActiveSection] = useState(navItems[0]?.sectionId ?? 'mandate');

  // `navItems` is a fresh array each render, so the effect depends on the ids
  // rather than the array itself — otherwise the scroll listener would be torn
  // down and re-attached on every render.
  const sectionIds = navItems.map((item) => item.sectionId).join(',');

  useEffect(() => {
    const ids = sectionIds.split(',');

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 130;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const offsetPosition = elementRect - bodyRect - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-[72px] z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 py-3.5 shadow-sm transition-all select-none">
      <div className="max-w-[1280px] mx-auto px-6 flex items-center justify-start md:justify-center overflow-x-auto gap-6 md:gap-10 scrollbar-none">
        {navItems.map(item => (
          <button
            key={item.sectionId}
            onClick={() => scrollToSection(item.sectionId)}
            className={`text-[10px] font-bold uppercase tracking-widest transition-all duration-300 pb-1.5 border-b-2 font-mono whitespace-nowrap focus:outline-none ${
              activeSection === item.sectionId
                ? 'text-[#00A788] border-[#00A788]'
                : 'text-gray-400 border-transparent hover:text-[#051F1A]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
