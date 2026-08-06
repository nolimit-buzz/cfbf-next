import { NextResponse } from 'next/server';
import { projects } from '@/lib/projectsData';
import { getNewsArticles } from '@/lib/cms/news';

export async function GET() {
  const newsArticles = await getNewsArticles();

  const feed = {
    projects: Object.values(projects).map((p) => ({
      id: p.id,
      title: p.title,
      location: p.location,
      year: p.year,
      metrics: {
        capital: p.capital,
        capacity: p.capacity,
        connections: p.connections,
        jobs: p.jobs,
        ghg_avoided: p.ghg,
        status: p.status,
      },
      description: p.desc,
      financing_structure: p.financing,
      expected_impact: p.impact_desc,
      problem: p.problem,
      solution: p.solution,
      impact: p.impact,
    })),
    news: newsArticles.map((n) => ({
      id: n.articleId,
      tag: n.tag,
      date: n.date,
      readTime: n.readTime,
      themes: n.themes.map((theme) => theme.label),
      context: n.keyContext,
      title: n.title,
      excerpt: n.excerpt,
      author: n.author,
      body: n.paragraphs
        .filter((item) => item.blockType === 'p' || item.blockType === 'blockquote')
        .map((item) => item.text)
        .join(' '),
    })),
  };

  return NextResponse.json(feed, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600, s-maxage=1800',
    },
  });
}
