/**
 * Canonical site origin, used for metadataBase, og:url, and JSON-LD `url` fields.
 * Set NEXT_PUBLIC_SITE_URL per environment (prod/staging) so these never drift
 * from the domain the site is actually deployed on.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://climatefacility.vercel.app';



