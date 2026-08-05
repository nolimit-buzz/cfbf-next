import type { HomeSection, SectionByComponent } from './types';

/**
 * Pure helpers for shaping CMS content.
 *
 * These live apart from `./home` because client components import them, and
 * `./home` pulls in `next/cache`, which is server-only.
 */

/** Returns the first section matching `component`, or `undefined`. */
export function pickSection<K extends keyof SectionByComponent>(
  sections: HomeSection[],
  component: K
): SectionByComponent[K] | undefined {
  return sections.find((s) => s.__component === component) as SectionByComponent[K] | undefined;
}

/**
 * Drops `null`, `undefined`, empty-string and empty-array values so that a
 * blank field in Strapi falls back to the bundled default instead of rendering
 * as nothing. Used as `{ ...DEFAULTS, ...withoutEmpty(data) }`.
 */
export function withoutEmpty<T extends object>(data: T | undefined): Partial<T> {
  if (!data) return {};

  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) continue;
    if (typeof value === 'string' && value.trim() === '') continue;
    if (Array.isArray(value) && value.length === 0) continue;
    out[key] = value;
  }
  return out as Partial<T>;
}
