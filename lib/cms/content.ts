/**
 * Pure helpers for shaping CMS content.
 *
 * These live apart from `./home` and `./about` because client components import
 * them, and those pull in `next/cache`, which is server-only.
 */

/**
 * Returns the first section matching `component`, or `undefined`.
 *
 * Generic over the section union rather than tied to the homepage's, so every
 * page's dynamic zone can use it. `Extract` narrows the result to the one
 * member of the union carrying that `__component`, which is what lets callers
 * pass the result straight to a typed section prop.
 */
export function pickSection<S extends { __component: string }, K extends S['__component']>(
  sections: S[],
  component: K
): Extract<S, { __component: K }> | undefined {
  return sections.find((s) => s.__component === component) as
    | Extract<S, { __component: K }>
    | undefined;
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

/**
 * Trims text to `max` characters on a word boundary, appending an ellipsis.
 * Used for `<title>` fallbacks where the CMS didn't supply a short SEO title.
 */
export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}
