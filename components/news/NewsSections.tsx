"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, List, Calendar, ArrowRight, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import GlassHero from '@/components/GlassHero';
import SectionHeader from '@/components/ui/SectionHeader';
import { withoutEmpty } from '@/lib/cms/content';
import {
  NEWS_ARTICLES_DEFAULTS,
  NEWS_HERO_DEFAULTS,
  NEWS_LISTING_DEFAULTS,
  NEWS_NEXT_STEPS_DEFAULTS,
} from '@/lib/cms/news-defaults';
import type {
  NewsArticlesSection,
  NewsHeroSection,
  NewsListingSection,
  NewsNextStepsSection,
} from '@/lib/cms/news-types';

/**
 * Icon per view tab, positional rather than keyed by label so an editor
 * renaming a tab cannot drop its icon. The CMS supplies the text only.
 */
const VIEW_TAB_ICONS = [LayoutGrid, List];

interface NewsSectionsProps {
  hero?: NewsHeroSection;
  listing?: NewsListingSection;
  articles?: NewsArticlesSection;
  nextSteps?: NewsNextStepsSection;
}

export default function NewsSections({ hero, listing, articles, nextSteps }: NewsSectionsProps) {
  const heroCopy = { ...NEWS_HERO_DEFAULTS, ...withoutEmpty(hero) };
  const listingCopy = { ...NEWS_LISTING_DEFAULTS, ...withoutEmpty(listing) };
  const articlesCopy = { ...NEWS_ARTICLES_DEFAULTS, ...withoutEmpty(articles) };
  const nextStepsCopy = { ...NEWS_NEXT_STEPS_DEFAULTS, ...withoutEmpty(nextSteps) };

  const newsArticles = articlesCopy.articles;
  const categories = listingCopy.categories;

  const [viewMode, setViewMode] = useState(listingCopy.viewTabs[0]?.tabId ?? 'grid');
  const [activeFilter, setActiveFilter] = useState(categories[0]?.label ?? 'All');

  // Carousel slider state for inner page hero
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(2);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setItemsPerPage(1);
      else if (window.innerWidth < 1024) setItemsPerPage(2);
      else setItemsPerPage(3);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, newsArticles.length - itemsPerPage);

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };

  // The first category is the "show everything" entry whatever it is called.
  const allLabel = categories[0]?.label ?? 'All';
  // A category label and an article tag are free-text fields on two unrelated
  // Strapi components, so nothing keeps their casing or padding in step.
  // Compare them normalised — a stray capital should not empty the page.
  const normalise = (s?: string) => (s ?? '').trim().toLowerCase();
  const filteredArticles = normalise(activeFilter) === normalise(allLabel)
    ? newsArticles
    : newsArticles.filter(item => normalise(item.tag) === normalise(activeFilter));

  const GAP = 24;
  const cardWidth = `calc((100% - ${(itemsPerPage - 1) * GAP}px) / ${itemsPerPage})`;
  const translateValue = `calc(-${currentIndex} * (${cardWidth} + ${GAP}px))`;

  return (
    <div className="bg-[#FAFDFB] text-brand-dark min-h-screen relative overflow-hidden">
      {/* Floating Glassmorphism Hero Section (about-v2 standard) */}
      <GlassHero
        title={
          <>
            {heroCopy.headingPartOne} <span className="text-[#9BB7B1]">{heroCopy.headingHighlight}</span>
          </>
        }
        subtitle={heroCopy.subtitle}
        bgImage={heroCopy.bgImage}
        homeLabel={heroCopy.breadcrumbHomeLabel}
        currentPage={heroCopy.breadcrumbCurrentPage}
      >
        <motion.div
          className="w-full mt-4 flex flex-col gap-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        >
          <div className="relative w-full overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out gap-6"
              style={{ transform: `translateX(${translateValue})` }}
            >
              {newsArticles.map((article) => (
                <Link
                  href={`/news/${article.articleId}`}
                  key={article.articleId}
                  style={{ width: cardWidth }}
                  className="shrink-0 bg-white border border-gray-200/60 hover:border-brand-primary/30 shadow-sm hover:shadow-md transition-all duration-300 rounded-[6px] p-5 flex gap-4 h-40 md:h-44 cursor-pointer group select-none"
                >
                  {/* Thumbnail */}
                  <div className="w-20 md:w-24 h-full rounded-[6px] overflow-hidden shrink-0 border border-gray-100 relative bg-[#051F1A]">
                    <img
                      src={article.image}
                      alt={article.image_alt_text || article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between text-left">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="text-[9px] font-bold text-brand-primary uppercase tracking-wider font-mono">
                          {article.tag}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">{article.date}</span>
                      </div>
                      <h3 className="text-base md:text-lg font-bold text-brand-dark group-hover:text-brand-primary transition-colors font-sans leading-snug line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-xs text-gray-500 font-sans font-light mt-1.5 line-clamp-1 leading-relaxed hidden sm:block">
                        {article.excerpt}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-brand-primary group-hover:text-brand-dark transition-colors mt-2">
                      <span>{heroCopy.cardCtaLabel}</span>
                      <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Slider bottom-right navigation bar */}
          <div className="flex items-center justify-between md:justify-end gap-6 mt-2 pb-2">
            {/* Progress Bar / Slider Track */}
            <div className="relative w-32 h-[3px] bg-white/25 rounded-full overflow-hidden hidden sm:block">
              <div
                className="absolute top-0 h-full bg-[#81C34D] transition-all duration-300 rounded-full"
                style={{
                  left: `${maxIndex > 0 ? (currentIndex / maxIndex) * (100 - 25) : 0}%`,
                  width: '25%'
                }}
              />
            </div>

            {/* Prev/Next Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all focus:outline-none interactive ${
                  currentIndex === 0
                    ? 'border-white/10 text-white/30 bg-white/[0.02] cursor-not-allowed'
                    : 'border-white/35 text-white bg-white/[0.05] hover:bg-white/[0.15] hover:border-[#81C34D] hover:scale-105'
                }`}
                aria-label={heroCopy.prevAriaLabel}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all focus:outline-none interactive ${
                  currentIndex >= maxIndex
                    ? 'border-white/10 text-white/30 bg-white/[0.02] cursor-not-allowed'
                    : 'border-white/35 text-white bg-white/[0.05] hover:bg-white/[0.15] hover:border-[#81C34D] hover:scale-105'
                }`}
                aria-label={heroCopy.nextAriaLabel}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      </GlassHero>

      {/* Main Listing Section */}
      <div data-rag-chunk="news-archive-container" className="container mx-auto px-6 py-24 relative z-10">

        {/* Section Title & View Toggle */}
        <SectionHeader
          sub={listingCopy.sectionSub}
          title={listingCopy.sectionTitle}
          activeTab={viewMode}
          onTabChange={setViewMode}
          tabs={listingCopy.viewTabs.map((tab, i) => ({
            id: tab.tabId,
            label: tab.label,
            icon: VIEW_TAB_ICONS[i] ?? LayoutGrid,
          }))}
          dark={false}
        />

        {/* Category Filters */}
        <div className="flex gap-3 mb-16 overflow-x-auto pb-4 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat.label}
              onClick={() => setActiveFilter(cat.label)}
              className={`px-5 py-2.5 rounded-full border text-xs tracking-wide transition-all duration-300 font-sans whitespace-nowrap focus:outline-none interactive ${
                activeFilter === cat.label
                  ? 'bg-brand-primary text-white border-brand-primary font-medium shadow-md shadow-brand-primary/10'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-brand-primary hover:text-brand-primary font-light'
              }`}
            >
              {cat.label.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Articles List / Grid Container */}
        <AnimatePresence mode="wait">
          {filteredArticles.length === 0 ? (
            /* Without this the grid still renders its padding — a tall blank
               band that reads as a broken page rather than an empty category. */
            <motion.div
              key={`empty-${activeFilter}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="border border-dashed border-gray-300 rounded-[6px] py-16 px-6 text-center"
            >
              <p className="text-brand-dark font-sans font-medium">
                No articles in {activeFilter} yet.
              </p>
              <p className="text-gray-500 text-sm font-sans font-light mt-2">
                Try another category, or check back soon.
              </p>
            </motion.div>
          ) : viewMode === (listingCopy.viewTabs[0]?.tabId ?? 'grid') ? (
            <motion.div
              key={`grid-${activeFilter}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredArticles.map((article, i) => (
                <Link href={`/news/${article.articleId}`} key={article.articleId} className="block h-full">
                  <motion.div
                    // `animate`, not `whileInView`: these cards remount on every
                    // filter change inside the AnimatePresence above, so their
                    // visibility depended entirely on an intersection callback
                    // landing after a mid-transition mount. A missed callback
                    // left the whole list stranded at `opacity: 0` — a blank
                    // band under the tabs, on every tab. `once: false` made it
                    // worse by re-hiding cards each time they scrolled away.
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group cursor-pointer flex flex-col h-full bg-white rounded-[6px] border border-gray-200/50 hover:border-brand-primary/20 shadow-[0_10px_30px_rgba(0,0,0,0.01)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.03)] transition-all duration-500 interactive"
                  >
                    <div className="relative h-56 overflow-hidden rounded-t-[6px] border-b border-gray-100">
                      <img
                        src={article.image}
                        alt={article.image_alt_text || article.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-[6px] text-[10px] font-bold text-brand-primary uppercase tracking-wider shadow-sm flex items-center gap-1.5 font-sans">
                        <Tag size={10} className="text-brand-accent" />
                        {article.tag}
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-gray-400 text-xs font-medium mb-3 flex items-center gap-2 font-sans">
                          <Calendar size={12} className="text-brand-accent" />
                          <span>{article.date}</span>
                          <span>•</span>
                          <span>{article.readTime}</span>
                        </div>
                        <h3 className="text-lg font-bold text-brand-dark mb-3 group-hover:text-brand-primary transition-colors leading-snug font-sans line-clamp-2 tracking-tight">{article.title}</h3>
                        <p className="text-gray-500 text-xs leading-relaxed mb-6 font-sans font-light">{article.excerpt}</p>
                      </div>

                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-brand-accent font-bold text-xs uppercase tracking-wider group-hover:text-brand-primary transition-colors font-sans">
                        <span>{articlesCopy.gridCtaLabel}</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={`list-${activeFilter}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-6"
            >
              {filteredArticles.map((article, i) => (
                <Link href={`/news/${article.articleId}`} key={article.articleId} className="block">
                  <motion.div
                    // `animate`, not `whileInView`: these cards remount on every
                    // filter change inside the AnimatePresence above, so their
                    // visibility depended entirely on an intersection callback
                    // landing after a mid-transition mount. A missed callback
                    // left the whole list stranded at `opacity: 0` — a blank
                    // band under the tabs, on every tab. `once: false` made it
                    // worse by re-hiding cards each time they scrolled away.
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group flex flex-col md:flex-row gap-6 items-center bg-white border border-gray-200/50 hover:border-brand-primary/20 p-5 rounded-[6px] shadow-[0_10px_30px_rgba(0,0,0,0.01)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.03)] transition-all cursor-pointer interactive"
                  >
                    <div className="w-full md:w-48 aspect-video md:aspect-[4/3] rounded-[6px] overflow-hidden shrink-0 border border-gray-100 relative">
                      <img
                        src={article.image}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        alt={article.image_alt_text || article.title}
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className="text-[10px] font-bold bg-brand-light text-brand-primary px-2.5 py-1 rounded-[6px] uppercase tracking-wider">{article.tag}</span>
                        <span className="text-xs text-gray-400 font-medium flex items-center gap-1.5"><Calendar size={12}/> {article.date}</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs text-gray-400 font-light">{article.readTime}</span>
                      </div>
                      <h3 className="text-xl font-bold text-brand-dark mb-2 group-hover:text-brand-primary transition-colors leading-snug font-sans tracking-tight">{article.title}</h3>
                      <p className="text-gray-500 text-sm font-sans line-clamp-2 leading-relaxed font-light">{article.excerpt}</p>
                    </div>
                    <div className="hidden md:block pr-2">
                      <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary transition-all">
                        <ArrowRight size={18} className="-rotate-45 group-hover:rotate-0 transition-transform"/>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── NEXT STEPS CTA BAR (3 Columns - NO SELF LINKING) ────── */}
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
            <span className="text-[#81C34D] text-xs font-semibold tracking-[0.2em] uppercase font-mono">{nextStepsCopy.eyebrow}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            {nextStepsCopy.headingPartOne} <span className="text-[#9BB7B1] italic font-serif">{nextStepsCopy.headingItalic}</span>
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
            {nextStepsCopy.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center justify-between px-8 py-5 hover:bg-white/[0.07] transition-all duration-300 text-left cursor-pointer focus:outline-none"
              >
                <div className="flex items-center gap-6">
                  <span className="text-white/70 text-[10px] font-bold uppercase tracking-[0.2em] font-mono shrink-0">
                    {link.eyebrow}
                  </span>
                  <div className="h-8 w-px bg-white/25" />
                  <div>
                    <h4 className="text-white text-base font-bold font-sans group-hover:text-white/80 transition-colors duration-300">
                      {link.title}
                    </h4>
                    <p className="text-white/65 text-xs font-light mt-0.5 font-sans">
                      {link.description}
                    </p>
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
