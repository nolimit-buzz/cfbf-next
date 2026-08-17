export interface PartnerLogoItem {
  name: string;
  logo: string;
  logo_alt_text: string;
}

export interface FooterSettings {
  partnerLogos: PartnerLogoItem[];
}

const ABOUT_PAGE_CLOUDINARY = 'https://res.cloudinary.com/diqfojkri/image/upload';
const WP = 'https://infracredit.ng/climate-facility/wp-content/uploads';

/**
 * Bundled fallback for the footer's "Domestic Institutional Investors &
 * Partners" marquee, used when the CMS is unreachable. Mirrors the seed data
 * in cms/src/seed/footer-copy.ts, in the marquee's display order.
 */
export const FOOTER_DEFAULTS: FooterSettings = {
  partnerLogos: [
    {
      name: 'AIICO Insurance',
      logo: `${ABOUT_PAGE_CLOUDINARY}/v1786962991/climate%20facility/about-page/partners-group-3-partner-2-logo.png`,
      logo_alt_text: 'AIICO Insurance',
    },
    {
      name: 'Linkage Assurance',
      logo: `${ABOUT_PAGE_CLOUDINARY}/v1786962993/climate%20facility/about-page/partners-group-3-partner-4-logo.png`,
      logo_alt_text: 'Linkage Assurance',
    },
    {
      name: 'LEADWAY',
      logo: `${ABOUT_PAGE_CLOUDINARY}/v1786962994/climate%20facility/about-page/partners-group-3-partner-5-logo.webp`,
      logo_alt_text: 'Leadway Insurance',
    },
    {
      name: 'Pension Custodian',
      logo: `${ABOUT_PAGE_CLOUDINARY}/v1786962999/climate%20facility/about-page/partners-group-3-partner-8-logo.png`,
      logo_alt_text: 'First Pension Custodian',
    },
    {
      name: 'United Capital',
      logo: 'https://res.cloudinary.com/diqfojkri/image/upload/v1786983650/climate%20facility/footer/footer-partner-united-capital-logo.png',
      logo_alt_text: 'United Capital Plc',
    },
    {
      name: 'MERISTEM',
      logo: 'https://res.cloudinary.com/diqfojkri/image/upload/v1786983651/climate%20facility/footer/footer-partner-meristem-logo.png',
      logo_alt_text: 'Meristem',
    },
    {
      name: 'InfraCredit',
      logo: `${WP}/2022/09/ICAsset-6@4x-8-002-1024x326-1.png`,
      logo_alt_text: 'InfraCredit',
    },
    {
      name: 'FCDO',
      logo: `${WP}/2022/10/UK-DEVELOPMENT-WHITE.png`,
      logo_alt_text: 'FCDO',
    },
    {
      name: 'AfDB',
      logo: 'https://res.cloudinary.com/diqfojkri/image/upload/v1786983652/climate%20facility/footer/footer-partner-afdb-logo.png',
      logo_alt_text: 'African Development Bank',
    },
    {
      name: 'USAID',
      logo: 'https://res.cloudinary.com/diqfojkri/image/upload/v1786983653/climate%20facility/footer/footer-partner-usaid-logo.svg',
      logo_alt_text: 'USAID',
    },
    {
      name: 'Power Africa',
      logo: 'https://res.cloudinary.com/diqfojkri/image/upload/v1786983656/climate%20facility/footer/footer-partner-power-africa-logo.png',
      logo_alt_text: 'Power Africa',
    },
    {
      name: 'Shell Foundation',
      logo: `${WP}/2022/10/Shell-foundation-1.png`,
      logo_alt_text: 'Shell Foundation',
    },
  ],
};
