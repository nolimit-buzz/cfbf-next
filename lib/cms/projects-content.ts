/**
 * Pure helpers for shaping Projects page CMS content.
 *
 * These live apart from `./projects` because client components import them, and
 * that module pulls in `next/cache`, which is server-only.
 */

import type {
  ProjectsFootprintMapCopy,
  ProjectsFootprintMapSection,
  ProjectsStateProjectItem,
} from './projects-types';

/**
 * Narrows the footprint map section to the fields the page renders.
 *
 * Call this on the server, before the section crosses into a client component:
 * it drops `mapSvg` (tens of kilobytes of SVG), the state/LGA data and the
 * legend, all of which the map takes from `lib/mapData` and `@svg-maps/nigeria`
 * instead. Keeping the legend out is what guarantees the swatches keep their
 * `PROJECT_TYPE_LEGEND` colours rather than the CMS's different ones.
 */
export function pickFootprintMapCopy(
  section: ProjectsFootprintMapSection | undefined
): ProjectsFootprintMapCopy | undefined {
  if (!section) return undefined;

  const {
    __component: _component,
    mapSvg: _mapSvg,
    legend: _legend,
    states: _states,
    lgaProjects: _lgaProjects,
    ...copy
  } = section;

  return copy;
}

/**
 * Parses the CMS `sdgs` string (`'7, 13'`) into the goal numbers the SDG chips
 * are keyed by.
 *
 * The schema stores this as one string rather than a repeatable, which is why
 * the page no longer carries a `getProjectSDGs` switch. Non-numeric fragments
 * are dropped so a stray separator or a trailing comma cannot render an `SDG
 * NaN` chip.
 */
export function parseSdgs(sdgs: string | undefined): number[] {
  if (!sdgs) return [];

  return sdgs
    .split(',')
    .map((part) => Number.parseInt(part.trim(), 10))
    .filter((n) => Number.isFinite(n));
}

/**
 * Groups the flat `stateProjects` list into the `Record<mapId, project[]>` the
 * page's state filter reads.
 *
 * Flat in the CMS because Strapi repeatables cannot be keyed by a dynamic
 * string; a state with two projects (Ondo) is simply two rows sharing a
 * `stateMapId`.
 */
export function groupStateProjects(
  stateProjects: ProjectsStateProjectItem[] | undefined
): Record<string, ProjectsStateProjectItem[]> {
  const out: Record<string, ProjectsStateProjectItem[]> = {};

  for (const entry of stateProjects ?? []) {
    if (!entry.stateMapId) continue;
    (out[entry.stateMapId] ??= []).push(entry);
  }

  return out;
}
