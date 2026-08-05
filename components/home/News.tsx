"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, List, Tag, Calendar, ArrowRight, User } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { newsArticles } from '@/lib/newsData';
import { NEWS_DEFAULTS } from '@/lib/cms/defaults';
import { withoutEmpty } from '@/lib/cms/content';
import type { NewsSection } from '@/lib/cms/types';

export default function LatestNews({ data }: { data?: NewsSection }) {
  const c = { ...NEWS_DEFAULTS, ...withoutEmpty(data) };
  const router = useRouter();
  const [viewMode, setViewMode] = useState('card');

  // The CMS mirrors `lib/newsData` by id, so the cards keep linking into the
  // /news/[id] detail route either way. Fall back to the local list when the
  // CMS has no articles.
  const newsItems = (c.articles.length > 0
    ? c.articles.map(article => ({
        id: article.articleId,
        image: article.image,
        tag: article.tag,
        date: article.date,
        title: article.title,
        author: article.author,
      }))
    : newsArticles
  ).slice(0, 3);

  return (
    <section id="news" className="py-24 bg-brand-light relative z-10 border-t border-gray-100">
      <div className="container mx-auto px-6">
        <SectionHeader
          sub={c.eyebrow}
          title={c.heading}
          activeTab={viewMode}
          onTabChange={setViewMode}
          tabs={c.viewTabs.map(tab => ({
            id: tab.tabId,
            label: tab.label,
            icon: tab.tabId === 'list' ? List : LayoutGrid
          }))}
        />

        <AnimatePresence mode="wait">
          {viewMode === 'card' ? (
            <motion.div
              key="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-3 gap-8"
            >
              {newsItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => router.push(`/news/${item.id}`)}
                  className="group cursor-pointer flex flex-col h-full interactive text-left"
                >
                  <div className="relative h-60 overflow-hidden rounded-[6px] mb-6 shadow-sm border border-gray-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-[6px] text-xs font-bold text-brand-primary uppercase tracking-wider shadow-sm flex items-center gap-2 font-sans">
                      <Tag size={12} className="text-brand-accent" />
                      {item.tag}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <div className="text-gray-400 text-sm font-medium mb-3 flex items-center gap-2 font-sans">
                      <Calendar size={14} className="text-brand-accent" />
                      <span>{item.date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-brand-dark mb-4 group-hover:text-brand-primary transition-colors leading-snug font-sans tracking-tight">
                      {item.title}
                    </h3>
                    <div className="mt-auto pt-4 flex items-center gap-2 text-brand-accent font-bold text-sm uppercase tracking-wider group-hover:gap-3 transition-all font-sans">
                      {c.readArticleLabel} <ArrowRight size={16} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-6"
            >
              {newsItems.map((item, i) => (
                <div
                  key={item.id}
                  onClick={() => router.push(`/news/${item.id}`)}
                  className="group flex flex-col md:flex-row gap-6 items-center bg-white border border-gray-100 p-6 rounded-[6px] hover:border-brand-accent/30 transition-all cursor-pointer interactive text-left"
                >
                  <div className="w-full md:w-32 h-32 rounded-[6px] overflow-hidden shrink-0">
                    <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.title} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold bg-brand-light text-brand-primary px-2 py-1 rounded-[6px] uppercase tracking-wider">{item.tag}</span>
                      <span className="text-xs text-gray-400 font-medium flex items-center gap-1"><Calendar size={12} /> {item.date}</span>
                    </div>
                    <h3 className="text-xl font-bold text-brand-dark mb-2 group-hover:text-brand-primary transition-colors">{item.title}</h3>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <User size={14} /> <span>{item.author}</span>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary transition-all">
                      <ArrowRight size={18} className="-rotate-45 group-hover:rotate-0 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 flex justify-center">
          <button
            onClick={() => router.push(c.ctaHref)}
            className="flex items-center gap-2 border-b border-brand-accent pb-1 text-brand-dark font-bold hover:text-brand-primary transition-colors font-sans uppercase tracking-wider text-sm focus:outline-none"
          >
            {c.ctaLabel} <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
