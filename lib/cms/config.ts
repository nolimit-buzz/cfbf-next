/**
 * Base URL of the Strapi instance, without a trailing slash.
 *
 * Deliberately a constant rather than `process.env`: this is a public host, not a
 * secret, and hardcoding it keeps every deployment target — Netlify, Vercel, deploy
 * previews — working with no dashboard configuration to forget or mistype.
 *
 * Kept in its own module rather than in `defaults.ts`, which `"use client"`
 * components import: only the server-side fetchers below should pull this in.
 *
 * To point the app at a different CMS (a local Strapi, a staging instance), edit
 * this value — there is no environment override any more.
 *
 * `https://`: Traefik now serves the host with a real Let's Encrypt certificate, so
 * Node's `fetch` trusts the chain. Keep the scheme as-is — Traefik redirects `http://`
 * to `https://`, and sends HSTS, so a plain-HTTP value only buys an extra round trip.
 */
export const CMS_BASE_URL = 'https://cms.climatefacility.org'.replace(/\/+$/, '');
