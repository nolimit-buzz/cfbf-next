"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, List, Clock } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';
import { STORIES_DEFAULTS } from '@/lib/cms/defaults';
import { withoutEmpty } from '@/lib/cms/content';
import type { StoriesSection } from '@/lib/cms/types';

/** Turns a youtu.be / youtube.com/watch URL into an embeddable youtube.com/embed URL. Returns null if the URL isn't recognized. */
function toYoutubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed${parsed.pathname}`;
    }
    if (parsed.hostname.endsWith('youtube.com')) {
      const id = parsed.searchParams.get('v');
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
  } catch {
    // not a valid URL — fall through to null
  }
  return null;
}

/** Renders a story's media area: the real embedded YouTube player if it has a video, otherwise the fallback image. */
function StoryMedia({ story }: { story: { image: string; image_alt_text: string | null; title: string; youtubeUrl: string | null } }) {
  const embedUrl = story.youtubeUrl ? toYoutubeEmbedUrl(story.youtubeUrl) : null;

  if (embedUrl) {
    return (
      <iframe
        src={embedUrl}
        title={story.title}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <img
      src={story.image}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
      alt={story.image_alt_text ?? story.title}
    />
  );
}

/** Accent palette applied to the story cards by position. */
const STORY_ACCENTS = [
  { badge: 'text-[#81C34D] bg-[#81C34D]/25 border-[#81C34D]/30', play: 'bg-[#81C34D]', text: 'text-[#81C34D]', glyph: '#051F1A' },
  { badge: 'text-[#009FD4] bg-[#009FD4]/25 border-[#009FD4]/30', play: 'bg-[#009FD4]', text: 'text-[#009FD4]', glyph: 'white' },
  { badge: 'text-[#00A788] bg-[#00A788]/25 border-[#00A788]/30', play: 'bg-[#00A788]', text: 'text-[#00A788]', glyph: 'white' },
] as const;

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.75, ease: EASE, delay },
});

export default function FeaturedStories({ data }: { data?: StoriesSection }) {
  const c = { ...STORIES_DEFAULTS, ...withoutEmpty(data) };
  const [viewMode, setViewMode] = useState('card');

  const stories = c.stories;

  return (
    <section className="py-24 bg-white">
      <motion.div {...fadeUp(0)} className="container mx-auto px-6">
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
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {stories.map((story, i) => {
                const accent = STORY_ACCENTS[i % STORY_ACCENTS.length];

                return (
                  <div key={story.id ?? i} className="group cursor-pointer flex flex-col border border-gray-100 rounded-[6px] overflow-hidden bg-white hover:-translate-y-1 transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.01)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.025)] hover:border-gray-200 text-left">
                    {/* Media area */}
                    <div className="relative aspect-video bg-[#051F1A] overflow-hidden">
                      <StoryMedia story={story} />
                      {/* Category badge bottom-left */}
                      <div className="absolute bottom-3 left-3 pointer-events-none">
                        <span className={`backdrop-blur-md text-xs font-bold tracking-wider uppercase px-3 py-0.5 rounded-full font-mono border ${accent.badge}`}>
                          {story.badge}
                        </span>
                      </div>
                    </div>
                    {/* Metadata details */}
                    <div className="p-4 flex flex-col gap-0 text-left flex-1 justify-between">
                      <h3 className="text-[#051F1A] text-base font-bold font-sans mb-2 leading-snug group-hover:text-opacity-80 transition-colors min-h-[48px] line-clamp-2">
                        {story.title}
                      </h3>
                      
                      <div className="space-y-0">
                        <div className="flex justify-between border-t border-gray-100 py-1.5">
                          <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">{c.roleLabel}</span>
                          <span className="text-xs font-bold font-mono text-[#051F1A]">{story.role}</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-100 py-1.5">
                          <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">{c.locationLabel}</span>
                          <span className="text-xs font-bold font-mono text-[#051F1A]">{story.location}</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-100 py-1.5">
                          <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">{c.typeLabel}</span>
                          <span className={`text-xs font-bold font-mono ${accent.text}`}>{story.storyType}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-6"
            >
              {stories.map((story, i) => {
                const accent = STORY_ACCENTS[i % STORY_ACCENTS.length];

                return (
                  <div key={story.id ?? i} className="group flex flex-col md:flex-row gap-6 bg-white border border-gray-100 p-4 rounded-[8px] shadow-[0_4px_16px_rgba(0,0,0,0.01)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.025)] hover:border-gray-200 transition-all duration-300 cursor-pointer text-left">
                    {/* Media area */}
                    <div className="w-full md:w-48 aspect-video rounded-[6px] overflow-hidden shrink-0 relative bg-[#051F1A]">
                      <StoryMedia story={story} />
                      {/* Category badge bottom-left */}
                      <div className="absolute bottom-2.5 left-2.5 pointer-events-none">
                        <span className={`backdrop-blur-md text-xs font-bold tracking-wider uppercase px-3 py-0.5 rounded-full font-mono border ${accent.badge}`}>
                          {story.badge}
                        </span>
                      </div>
                    </div>
                    {/* Content area */}
                    <div className="flex-1 flex flex-col justify-between py-0.5 text-left">
                      <div>
                        <h3 className="text-base font-bold text-[#051F1A] mb-1 group-hover:text-opacity-80 transition-colors leading-snug">
                          {story.title}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed font-light mb-3 line-clamp-1">{story.excerpt}</p>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-3">
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-mono text-gray-400 uppercase tracking-wider block mb-0.5">{c.roleLabel}</span>
                          <span className="text-xs font-bold font-mono text-[#051F1A]">{story.role}</span>
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-mono text-gray-400 uppercase tracking-wider block mb-0.5">{c.locationLabel}</span>
                          <span className="text-xs font-bold font-mono text-[#051F1A]">{story.location}</span>
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-mono text-gray-400 uppercase tracking-wider block mb-0.5">{c.typeLabel}</span>
                          <span className={`text-xs font-bold font-mono ${accent.text}`}>{story.storyType}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
