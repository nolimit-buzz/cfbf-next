import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import NewsDetailPageClient from '@/components/news/NewsDetailClient';
import { getNewsSections } from '@/lib/cms/news';
import {
  NEWS_ARTICLES_DEFAULTS,
  NEWS_ARTICLE_DETAIL_DEFAULTS,
} from '@/lib/cms/news-defaults';
import { pickSection, withoutEmpty } from '@/lib/cms/content';

export const unstable_instant = {
  prefetch: 'static',
  samples: [
    { params: { id: '1' } }
  ]
};

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Resolves one article plus its neighbours from the CMS zone.
 *
 * `getNewsSections` is `'use cache'`, so calling this from both
 * `generateMetadata` and the page body costs a single fetch.
 */
async function getArticleContext(id: string) {
  const sections = await getNewsSections();

  const labels = {
    ...NEWS_ARTICLE_DETAIL_DEFAULTS,
    ...withoutEmpty(pickSection(sections, 'news-page.article-detail-section')),
  };

  const articles =
    pickSection(sections, 'news-page.articles-section')?.articles?.length
      ? pickSection(sections, 'news-page.articles-section')!.articles
      : NEWS_ARTICLES_DEFAULTS.articles;

  const index = articles.findIndex((item) => item.articleId === id);
  const article = index === -1 ? null : articles[index];

  return {
    labels,
    article,
    prevArticle: index > 0 ? articles[index - 1] : null,
    nextArticle: index !== -1 && index < articles.length - 1 ? articles[index + 1] : null,
    relatedArticles: articles.filter((item) => item.articleId !== id).slice(0, 3),
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const { article, labels } = await getArticleContext(id);

  if (!article) {
    return { title: labels.notFoundTitle };
  }

  const themes = article.themes.map((t) => t.label).join(', ');
  const publishedDate = new Date(article.date).toISOString().split('T')[0];

  return {
    title: `${article.title}${labels.titleSuffix}`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.image],
      type: 'article',
    },
    other: {
      'DC.title': article.title,
      'DC.creator': article.author,
      'DC.subject': themes,
      'DC.description': article.excerpt,
      'DC.publisher': labels.dcPublisher,
      'DC.language': labels.dcLanguage,
      'DC.date': publishedDate,
      'DC.type': labels.dcType,
    },
  };
}

async function NewsDetail({ params }: PageProps) {
  const { id } = await params;
  const { article, prevArticle, nextArticle, relatedArticles, labels } =
    await getArticleContext(id);

  const jsonLd = article && {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    image: [article.image],
    datePublished: new Date(article.date).toISOString().split('T')[0],
    author: [{ '@type': 'Person', name: article.author }],
    publisher: {
      '@type': 'Organization',
      name: labels.publisherName,
      logo: { '@type': 'ImageObject', url: labels.publisherLogoUrl },
    },
    description: article.excerpt,
    articleBody: article.paragraphs
      .filter((p) => p.blockType === 'p' || p.blockType === 'blockquote')
      .map((p) => p.text)
      .join(' '),
  };

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <NewsDetailPageClient
        article={article}
        prevArticle={prevArticle}
        nextArticle={nextArticle}
        relatedArticles={relatedArticles}
        labels={labels}
      />
    </>
  );
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { loadingLabel } = {
    ...NEWS_ARTICLE_DETAIL_DEFAULTS,
    ...withoutEmpty(pickSection(await getNewsSections(), 'news-page.article-detail-section')),
  };

  return (
    <Suspense fallback={<div className="bg-[#FAFDFB] min-h-screen text-brand-dark flex items-center justify-center font-mono text-xs uppercase tracking-widest">{loadingLabel}</div>}>
      <NewsDetail params={params} />
    </Suspense>
  );
}
