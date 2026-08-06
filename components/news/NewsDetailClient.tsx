"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Tag,
  Clock,
  User,
  Share2,
  Linkedin,
  Twitter,
  Facebook,
  Link2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import GlassHero from '@/components/GlassHero';
import type { NewsArticleDetailSection, NewsArticleItem } from '@/lib/cms/news-types';

/** Copy for this view, already merged over the bundled defaults by the page. */
type DetailLabels = Omit<NewsArticleDetailSection, '__component' | 'id'>;

interface NewsDetailProps {
  /** `null` when the `[id]` segment matches no article. */
  article: NewsArticleItem | null;
  prevArticle: NewsArticleItem | null;
  nextArticle: NewsArticleItem | null;
  relatedArticles: NewsArticleItem[];
  labels: DetailLabels;
}

export default function NewsDetailPage({
  article,
  prevArticle,
  nextArticle,
  relatedArticles,
  labels,
}: NewsDetailProps) {
  const router = useRouter();

  if (!article) {
    return (
      <div className="bg-[#FAFDFB] text-brand-dark min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-3xl font-bold mb-4 font-sans text-brand-dark">{labels.notFoundTitle}</h2>
        <p className="text-gray-500 mb-8 font-sans">{labels.notFoundBody}</p>
        <button
          onClick={() => router.push('/news')}
          className="flex items-center gap-2 bg-brand-primary hover:bg-[#051F1A] text-white px-6 py-3 rounded-full font-bold uppercase tracking-wider text-xs shadow-md transition-all interactive font-sans"
        >
          <ArrowLeft size={16} /> {labels.notFoundCtaLabel}
        </button>
      </div>
    );
  }

  const renderTwoTonedHeader = (titleText: string) => {
    const words = titleText.split(' ');
    if (words.length <= 1) return titleText;
    const splitIndex = words.length > 5 ? words.length - 3 : words.length - 2;
    const firstPart = words.slice(0, splitIndex).join(' ');
    const secondPart = words.slice(splitIndex).join(' ');
    return (
      <>
        {firstPart}{' '}
        <span className="text-[#7C9590]">{secondPart}</span>
      </>
    );
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      alert(labels.copyLinkAlert);
    }
  };

  // Metadata and the NewsArticle JSON-LD are emitted by the server page, which
  // is where the CMS labels are merged and where `generateMetadata` belongs.

  return (
    <div className="bg-[#FAFDFB] text-brand-dark min-h-screen relative overflow-hidden">
      {/* ── HERO — white card at the standard placement (about-v2 hero) ── */}
      <GlassHero
        panel="white"
        fade="light"
        title={article.title}
        subtitle={article.tag}
        bgImage={article.image}
        currentPage={article.tag}
        parent={{ label: labels.breadcrumbParentLabel, href: '/news' }}
      >
        {/* Metadata row */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-mono text-gray-400 uppercase tracking-widest">
          <span className="flex items-center gap-1.5">
            <Clock size={11} className="text-brand-primary" />
            {article.readTime}
          </span>
          <span className="text-gray-200 hidden sm:inline">·</span>
          <span className="flex items-center gap-1.5">
            <Calendar size={11} className="text-brand-primary" />
            {article.date}
          </span>
          <span className="text-gray-200 hidden sm:inline">·</span>
          <span className="flex items-center gap-1.5">
            <User size={11} className="text-brand-primary" />
            {article.author}
          </span>
        </div>
      </GlassHero>

      {/* ── ARTICLE BODY ────────────────────────────────────────────────── */}
      <article className="container mx-auto px-6 py-20 relative z-10">

        <div className="mb-12 flex items-center justify-between border-b border-gray-100 pb-5 max-w-5xl mx-auto">
          <button
            onClick={() => router.push('/news')}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-brand-primary transition-colors uppercase font-bold tracking-wider focus:outline-none"
          >
            <ArrowLeft size={16} /> {labels.backLabel}
          </button>
          <div className="text-gray-400 text-xs font-mono uppercase">
            {labels.breadcrumbPrefix}{article.tag.toLowerCase().replace(' ', '-')}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 max-w-5xl mx-auto">

          {/* Sidebar */}
          <div className="lg:col-span-3 order-1 lg:order-1">
            <div className="sticky top-[110px] flex flex-col gap-10 text-left">

              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4 font-mono">{labels.postedByLabel}</h4>
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-100 shrink-0">
                    <img src={article.authorAvatar} alt={article.authorAvatar_alt_text || article.author} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-sm font-semibold text-brand-dark font-sans leading-snug">{article.author}</span>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4 font-mono">{labels.themesLabel}</h4>
                <div className="flex flex-wrap gap-2">
                  {article.themes.map((theme) => (
                    <span key={theme.label} className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider border rounded-[6px] border-gray-200/60 text-gray-500 bg-white">
                      {theme.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-l-2 border-brand-accent pl-4 py-1">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3 font-mono">{labels.contextLabel}</h4>
                <p className="text-xs italic leading-relaxed text-gray-500 font-sans">{article.keyContext}</p>
              </div>

            </div>
          </div>

          {/* Main body */}
          <div className="lg:col-span-9 order-2 lg:order-2 text-left">
            <div data-rag-chunk="news-body" className="prose prose-lg max-w-none text-gray-600 font-light leading-relaxed font-sans space-y-8">
              {article.paragraphs.map((item, idx) => {
                if (item.blockType === 'p') {
                  return (
                    <p key={idx} className="text-base md:text-lg leading-relaxed text-gray-600 font-light font-sans">
                      {item.text}
                    </p>
                  );
                }
                if (item.blockType === 'h2') {
                  return (
                    <h2 key={idx} className="text-2xl md:text-3xl font-bold text-brand-dark mt-12 mb-5 font-sans leading-tight pb-3 border-b border-gray-100 tracking-tight">
                      {renderTwoTonedHeader(item.text)}
                    </h2>
                  );
                }
                if (item.blockType === 'blockquote') {
                  return (
                    <blockquote key={idx} className="border-l-4 border-brand-primary pl-6 font-serif italic text-xl md:text-2xl text-brand-dark/95 leading-snug my-10 py-1">
                      "{item.text}"
                    </blockquote>
                  );
                }
                if (item.blockType === 'image') {
                  return (
                    <figure key={idx} className="my-12">
                      <div className="rounded-[6px] overflow-hidden border border-gray-200/40 shadow-md aspect-video max-h-[420px] w-full">
                        <img src={item.url ?? undefined} alt={item.url_alt_text || item.text} className="w-full h-full object-cover" />
                      </div>
                      {item.caption && (
                        <figcaption className="text-center text-xs text-gray-400 italic mt-3 font-sans">
                          {item.caption}
                        </figcaption>
                      )}
                    </figure>
                  );
                }
                return null;
              })}
            </div>

            {/* Share row */}
            <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold flex items-center gap-2 text-gray-400 font-sans">
                  <Share2 size={16} /> {labels.shareLabel}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center bg-white text-gray-500 hover:text-brand-primary hover:border-brand-primary transition-all focus:outline-none interactive"
                    aria-label={labels.shareLinkedinAriaLabel}
                  >
                    <Linkedin size={14} />
                  </button>
                  <button
                    onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`, '_blank')}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center bg-white text-gray-500 hover:text-brand-primary hover:border-brand-primary transition-all focus:outline-none interactive"
                    aria-label={labels.shareTwitterAriaLabel}
                  >
                    <Twitter size={14} />
                  </button>
                  <button
                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center bg-white text-gray-500 hover:text-brand-primary hover:border-brand-primary transition-all focus:outline-none interactive"
                    aria-label={labels.shareFacebookAriaLabel}
                  >
                    <Facebook size={14} />
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center bg-white text-gray-500 hover:text-brand-primary hover:border-brand-primary transition-all focus:outline-none interactive"
                    aria-label={labels.copyLinkAriaLabel}
                  >
                    <Link2 size={14} />
                  </button>
                </div>
              </div>
              <div className="text-xs text-gray-400 font-sans font-light">
                {labels.publishedInPrefix}{article.tag} · {article.date}
              </div>
            </div>

            {/* Prev / Next */}
            <div className="mt-12 grid grid-cols-2 gap-4 border-t border-gray-100 pt-8">
              {prevArticle ? (
                <Link href={`/news/${prevArticle.articleId}`} className="flex flex-col items-start gap-1 p-4 rounded-[6px] border border-gray-100 hover:border-brand-primary/20 hover:bg-gray-50/50 transition-all text-left group">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 font-mono">
                    <ChevronLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" /> {labels.previousArticleLabel}
                  </span>
                  <span className="text-sm font-semibold text-brand-dark group-hover:text-brand-primary transition-colors line-clamp-1 font-sans mt-1">
                    {prevArticle.title}
                  </span>
                </Link>
              ) : (
                <div className="opacity-20 border border-dashed border-gray-100 p-4 rounded-[6px] flex flex-col items-start">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">{labels.previousArticleLabel}</span>
                  <span className="text-sm font-light text-gray-400 font-sans mt-1">{labels.firstArticleLabel}</span>
                </div>
              )}

              {nextArticle ? (
                <Link href={`/news/${nextArticle.articleId}`} className="flex flex-col items-end gap-1 p-4 rounded-[6px] border border-gray-100 hover:border-brand-primary/20 hover:bg-gray-50/50 transition-all text-right group">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 font-mono">
                    {labels.nextArticleLabel} <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                  <span className="text-sm font-semibold text-brand-dark group-hover:text-brand-primary transition-colors line-clamp-1 font-sans mt-1">
                    {nextArticle.title}
                  </span>
                </Link>
              ) : (
                <div className="opacity-20 border border-dashed border-gray-100 p-4 rounded-[6px] flex flex-col items-end">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">{labels.nextArticleLabel}</span>
                  <span className="text-sm font-light text-gray-400 font-sans mt-1">{labels.latestArticleLabel}</span>
                </div>
              )}
            </div>

          </div>
        </div>
      </article>

      {/* ── RELATED ARTICLES ─────────────────────────────────────────────── */}
      <section className="bg-gray-50 border-t border-gray-200/50 py-24 relative z-10 text-left">
        <div className="container mx-auto px-6 max-w-5xl">
          <h3 className="text-2xl md:text-3xl font-bold text-brand-dark mb-10 font-sans tracking-tight">
            {labels.relatedHeadingPartOne} <span className="text-[#7C9590]">{labels.relatedHeadingHighlight}</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedArticles.map((item) => (
              <Link
                key={item.articleId}
                href={`/news/${item.articleId}`}
                className="group flex flex-col gap-4 bg-white border border-gray-200/40 p-4 rounded-[6px] shadow-[0_10px_30px_rgba(0,0,0,0.005)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.02)] transition-all cursor-pointer"
              >
                <div className="w-full aspect-[4/3] rounded-[6px] overflow-hidden border border-gray-100 shrink-0 relative">
                  <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={item.image_alt_text || item.title} />
                </div>
                <div className="flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[9px] font-bold bg-brand-light text-brand-primary px-2 py-0.5 rounded-[6px] uppercase tracking-wider font-mono">
                        {item.tag}
                      </span>
                      <span className="text-[10px] text-gray-400 font-light font-sans">{item.date}</span>
                    </div>
                    <h4 className="text-base font-bold text-brand-dark group-hover:text-brand-primary transition-colors leading-snug line-clamp-2 font-sans tracking-tight">
                      {item.title}
                    </h4>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-xs text-brand-accent font-bold uppercase tracking-wider font-sans group-hover:text-brand-primary transition-colors">
                    {labels.relatedCtaLabel} <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
