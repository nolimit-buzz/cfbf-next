import HomeSections from "@/components/home/HomeSections";
import { STRUCTURED_DATA_DEFAULTS } from "@/lib/cms/defaults";
import { pickSection, withoutEmpty } from "@/lib/cms/content";
import { getHomeSections } from "@/lib/cms/home";

export default async function Home() {
  const sections = await getHomeSections();
 

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
      />
    </>
  );
}
