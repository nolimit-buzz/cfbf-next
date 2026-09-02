export interface PartnerLogoItem {
  name: string;
  logo: string;
  logo_alt_text: string;
  /** Full-colour artwork shown on hover. Null for partners with no colour variant. */
  logoColour?: string | null;
  logoColour_alt_text?: string | null;
}

export interface FooterSettings {
  partnerLogos: PartnerLogoItem[];
}

/**
 * Partner artwork lives in frontend/public/partners as a white/colour SVG pair
 * per brand, uploaded to this folder by cms/scripts/upload-partner-logos.mjs.
 * URLs are deliberately versionless — the uploads overwrite a stable public_id,
 * so redrawn artwork propagates instead of being pinned to an old version.
 */
const PARTNERS = 'https://res.cloudinary.com/diqfojkri/image/upload/climate%20facility/partners';
const partner = (slug: string) => ({
  logo: `${PARTNERS}/partner-${slug}-white.svg`,
  logoColour: `${PARTNERS}/partner-${slug}-colour.svg`,
});

/**
 * Bundled fallback for the footer's "Domestic Institutional Investors &
 * Partners" marquee, used when the CMS is unreachable. Mirrors the seed data
 * in cms/src/seed/footer-copy.ts, in the marquee's display order.
 */
export const FOOTER_DEFAULTS: FooterSettings = {
  partnerLogos: [
    { name: 'AIICO Insurance', ...partner('aiico'), logo_alt_text: 'AIICO Insurance PLC', logoColour_alt_text: 'AIICO Insurance PLC' },
    { name: 'Linkage Assurance', ...partner('linkage'), logo_alt_text: 'Linkage Assurance PLC', logoColour_alt_text: 'Linkage Assurance PLC' },
    { name: 'LEADWAY', ...partner('leadway'), logo_alt_text: 'Leadway Insurance', logoColour_alt_text: 'Leadway Insurance' },
    { name: 'Pension Custodian', ...partner('first-pension-custodian'), logo_alt_text: 'First Pension Custodian', logoColour_alt_text: 'First Pension Custodian' },
    { name: 'United Capital', ...partner('united-capital'), logo_alt_text: 'United Capital Plc', logoColour_alt_text: 'United Capital Plc' },
    { name: 'MERISTEM', ...partner('meristem'), logo_alt_text: 'Meristem', logoColour_alt_text: 'Meristem' },
    { name: 'InfraCredit', ...partner('infracredit'), logo_alt_text: 'InfraCredit', logoColour_alt_text: 'InfraCredit' },
    { name: 'FCDO', ...partner('uk-fcdo'), logo_alt_text: 'UK International Development', logoColour_alt_text: 'UK International Development' },
    { name: 'AfDB', ...partner('afdb'), logo_alt_text: 'African Development Bank', logoColour_alt_text: 'African Development Bank' },
    { name: 'USAID', ...partner('usaid'), logo_alt_text: 'USAID', logoColour_alt_text: 'USAID' },
    { name: 'Power Africa', ...partner('power-africa'), logo_alt_text: 'Power Africa', logoColour_alt_text: 'Power Africa' },
    { name: 'Shell Foundation', ...partner('shell-foundation'), logo_alt_text: 'Shell Foundation', logoColour_alt_text: 'Shell Foundation' },
    {
      // No artwork in the partners folder, so BII keeps its legacy white PNG
      // and renders without a colour swap. It moved here from the About page's
      // Anchor Funders grid, which now shows UK FCDO alone.
      name: 'BII',
      logo: 'https://infracredit.ng/climate-facility/wp-content/uploads/2022/10/BII_Logo_All_white_RGB.png',
      logo_alt_text: 'British International Investment',
      logoColour: null,
      logoColour_alt_text: null,
    },
  ],
};
