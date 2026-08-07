/** Platforms the footer knows how to render an icon for. */
export type SocialPlatform = 'facebook' | 'twitter' | 'linkedin' | 'instagram' | 'youtube';

export interface SocialLinkItem {
  platform: SocialPlatform;
  url: string;
  label?: string;
}

export interface GlobalSettings {
  socialLinks: SocialLinkItem[];
}

/**
 * Blank URLs on purpose.
 *
 * The real profile handles are not known yet, and the footer renders an icon
 * only when its URL is filled in — so shipping these empty is what keeps dead
 * `href="#"` links off the site until an editor supplies the real ones.
 */
export const GLOBAL_DEFAULTS: GlobalSettings = {
  socialLinks: [
    { platform: 'facebook', url: '', label: 'Facebook' },
    { platform: 'twitter', url: '', label: 'X' },
    { platform: 'linkedin', url: '', label: 'LinkedIn' },
    { platform: 'instagram', url: '', label: 'Instagram' },
    { platform: 'youtube', url: '', label: 'YouTube' },
  ],
};
