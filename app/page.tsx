import { Suspense } from "react";
import HomeSections from "@/components/home/HomeSections";
import { STRUCTURED_DATA_DEFAULTS } from "@/lib/cms/defaults";
import { pickSection, withoutEmpty } from "@/lib/cms/content";
import { getHomeSections } from "@/lib/cms/home";
import { getNewsArticles } from "@/lib/cms/news";
import { toNewsSummaries } from "@/lib/cms/news-content";

/**
 * The CMS-dependent body, split out so it can sit behind `<Suspense>`.
 *
 * Awaiting in `Home` itself would block the whole route: nothing could be
 * streamed until the slower of the two single types came back, which on a cold
 * cache is seconds. Behind a boundary the shell flushes immediately and this
 * swaps in when the data lands — the same reasoning as `NavbarWithNews` in
 * `app/layout.tsx`.
 */
async function HomeContent() {
  // Two independent single types — fetch them together rather than in series.
  const [sections, articles] = await Promise.all([getHomeSections(), getNewsArticles()]);


  const seo = {
    ...STRUCTURED_DATA_DEFAULTS,
    ...withoutEmpty(pickSection(sections, 'home-page.structured-data-section')),
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${seo.url}/#organization`,
        "name": seo.organizationName,
        "url": seo.url,
        "logo": {
          "@type": "ImageObject",
          "url": seo.logoUrl
        },
        "description": seo.description,
        "sponsor": seo.sponsors.map((sponsor) => ({
          "@type": "Organization",
          "name": sponsor.name
        }))
      },
      {
        "@type": "WebSite",
        "@id": `${seo.url}/#website`,
        "url": seo.url,
        "name": seo.siteName,
        "publisher": {
          "@id": `${seo.url}/#organization`
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeSections
        hero={pickSection(sections, 'home-page.hero-section')}
        about={pickSection(sections, 'home-page.about-section')}
        impact={pickSection(sections, 'home-page.impact-section')}
        projects={pickSection(sections, 'home-page.projects-section')}
        map={pickSection(sections, 'home-page.map-section')}
        stories={pickSection(sections, 'home-page.stories-section')}
        news={pickSection(sections, 'home-page.news-section')}
        netZero={pickSection(sections, 'home-page.net-zero-section')}
        newsArticles={toNewsSummaries(articles)}
      />
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="bg-brand-dark min-h-screen" aria-hidden="true" />}>
      <HomeContent />
    </Suspense>
  );
}
