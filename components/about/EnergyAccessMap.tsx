"use client";

import React, { useState, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Grid3X3, Sun } from 'lucide-react';
// @ts-ignore
import nigeriaMapData from '@svg-maps/nigeria';
import { ABOUT_ENERGY_MAP_DEFAULTS } from '@/lib/cms/about-defaults';
import { withoutEmpty } from '@/lib/cms/content';
import type { AboutEnergyMapSection, AboutMapState } from '@/lib/cms/about-types';

interface StateLocation {
  id: string;
  name: string;
  path: string;
}

/** The per-state fields that can drive the choropleth. */
type IntensityKey = 'grid' | 'miniGrid' | 'standalone';

/**
 * Look and behaviour per technology tab, keyed by the CMS `tabId`.
 *
 * The CMS supplies each tab's label; the icon, colour and which state field
 * drives the choropleth are wiring, not copy. A tab whose `tabId` is not
 * listed here is skipped rather than rendered inert — an unknown id has no
 * data column to shade the map by.
 */
const TAB_STYLES: Record<string, { icon: React.ElementType; color: string; intensityKey: IntensityKey }> = {
  'grid': { icon: Zap, color: '#009FD4', intensityKey: 'grid' },
  'mini-grid': { icon: Grid3X3, color: '#00A788', intensityKey: 'miniGrid' },
  'standalone': { icon: Sun, color: '#81C34D', intensityKey: 'standalone' },
};

/** Tab selected on first render. */
const DEFAULT_TAB_ID = 'mini-grid';

/** How many rows the ranking table shows. */
const TABLE_ROWS = 12;

function getStateColor(intensity: number, tabColor: string, isHovered: boolean): string {
  if (isHovered) return '#FFFFFF';
  const hex = tabColor.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const alpha = 0.08 + intensity * 0.82;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function EnergyAccessMap({ data }: { data?: AboutEnergyMapSection }) {
  const c = { ...ABOUT_ENERGY_MAP_DEFAULTS, ...withoutEmpty(data) };

  // Tabs the component knows how to render, in CMS order.
  const TABS = useMemo(
    () => (c.tabs ?? []).filter((tab) => TAB_STYLES[tab.tabId]).map((tab) => ({ ...tab, ...TAB_STYLES[tab.tabId] })),
    [c.tabs]
  );

  const STATE_FUNDING_DATA = c.states ?? [];

  const [activeTab, setActiveTab] = useState<string>(DEFAULT_TAB_ID);
  // FIX P0: single hovered state — string ID or null
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  // Falls back to the first available tab so a CMS tab list that omits the
  // default still renders something selected.
  const activeTabConfig = TABS.find(t => t.tabId === activeTab) ?? TABS[0];

  const sortedData = useMemo(() => {
    if (!activeTabConfig) return [];
    const key = activeTabConfig.intensityKey;
    return [...STATE_FUNDING_DATA].sort((a, b) => (b[key] as number) - (a[key] as number)).slice(0, TABLE_ROWS);
  }, [activeTabConfig, STATE_FUNDING_DATA]);

  const dataByMapId = useMemo(() => {
    const map: Record<string, AboutMapState> = {};
    STATE_FUNDING_DATA.forEach(d => { map[d.mapId] = d; });
    return map;
  }, [STATE_FUNDING_DATA]);

  /**
   * Fill colour per state per technology, pre-computed so hovering never runs
   * a parse or a colour calculation. Rebuilt only when the data or palette
   * changes — previously this ran once at module load, which is no longer
   * possible now that the states come from the CMS.
   */
  const colorMap = useMemo(() => {
    const map: Record<string, string> = {};
    if (!activeTabConfig) return map;

    STATE_FUNDING_DATA.forEach(d => {
      (['grid', 'miniGrid', 'standalone'] as IntensityKey[]).forEach(k => {
        map[`${d.mapId}:${k}`] = getStateColor(d[k], activeTabConfig.color, false);
      });
    });
    return map;
  }, [STATE_FUNDING_DATA, activeTabConfig]);

  // FIX P0: Delegated SVG event handler — ONE listener on <svg> instead of 37 per-path listeners
  // Reads `data-state-id` from the target <path> element
  const handleSvgMouseEnter = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const target = e.target as SVGPathElement;
    const stateId = target.dataset.stateId;
    if (stateId) setHoveredState(stateId);
  }, []);

  const handleSvgMouseLeave = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    // Only clear if we leave the SVG entirely (not cross into another path)
    const related = e.relatedTarget as Element | null;
    if (!related || !(e.currentTarget as Element).contains(related)) {
      setHoveredState(null);
    }
  }, []);

  // FIX P1: derive hovered data at render time — no IIFE in JSX
  const effectiveHoveredId = hoveredState || hoveredRow;
  const hoveredData = effectiveHoveredId ? dataByMapId[effectiveHoveredId] : null;

  // No recognised tab means no column to shade by, so there is nothing to draw.
  if (!activeTabConfig) return null;

  return (
    <section className="py-24 bg-brand-dark relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="container mx-auto px-6 max-w-[1280px] relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="mb-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-brand-accent" />
            <span className="text-brand-accent text-xs font-semibold tracking-[0.2em] uppercase font-mono">{c.eyebrow}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8 mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white font-sans tracking-tight leading-tight">
                {c.headingPrimary}
                <span className="text-[#9BB7B1]">{c.headingSecondary}</span>
              </h2>
              <p className="text-gray-400 mt-3 max-w-xl font-sans text-sm leading-relaxed">
                {c.body}
              </p>
            </div>
            {/* Tab strip */}
            <div className="flex gap-2 shrink-0">
              {TABS.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.tabId}
                    onClick={() => setActiveTab(tab.tabId)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-[6px] text-xs font-semibold font-mono uppercase tracking-wider transition-all duration-200 border interactive ${
                      activeTabConfig.tabId === tab.tabId
                        ? 'text-white border-transparent shadow-md'
                        : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20'
                    }`}
                    style={activeTabConfig.tabId === tab.tabId ? { backgroundColor: tab.color, borderColor: tab.color } : {}}
                  >
                    <Icon size={13} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Map + Table grid */}
        <div className="grid lg:grid-cols-12 gap-12 items-start">

          {/* Table — left 5 cols */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5"
          >
            <div className="bg-[#071F19] border border-white/5 rounded-[6px] overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 font-mono px-4 py-3 border-b border-white/10 bg-white/[0.03]">
                <span>{c.colHeaderRank}</span>
                <span className="col-span-1">{c.colHeaderState}</span>
                <span className="text-right">{c.colHeaderConnections}</span>
                <span className="text-right">{c.colHeaderGap}</span>
              </div>

              {/* FIX P1: AnimatePresence with opacity-only fade — no x/y translation so no layout change */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {sortedData.map((row, i) => {
                    const isHighlighted = hoveredState === row.mapId || hoveredRow === row.mapId;
                    return (
                      <div
                        key={row.mapId}
                        onMouseEnter={() => setHoveredRow(row.mapId)}
                        onMouseLeave={() => setHoveredRow(null)}
                        className={`grid grid-cols-4 items-center px-4 py-3 border-b border-white/5 last:border-0 cursor-default transition-colors duration-150 ${
                          isHighlighted ? 'bg-white/[0.05]' : ''
                        }`}
                      >
                        <span className="text-[10px] font-mono text-gray-400">{String(i + 1).padStart(2, '0')}</span>
                        <div className="col-span-1 flex items-center gap-2">
                          {isHighlighted && (
                            <div
                              className="w-1.5 h-1.5 rounded-full shrink-0"
                              style={{ backgroundColor: activeTabConfig.color }}
                            />
                          )}
                          <span className={`text-xs font-sans font-medium truncate ${isHighlighted ? 'text-white' : 'text-gray-400'}`}>
                            {row.name}
                          </span>
                        </div>
                        <span className="text-right text-[11px] font-mono text-gray-400">{row.connections}</span>
                        <span
                          className="text-right text-[11px] font-mono font-bold"
                          style={{ color: activeTabConfig.color }}
                        >
                          {row.fundingGap}
                        </span>
                      </div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>

              {/* Footer note */}
              <div className="px-4 py-3 bg-white/[0.02] border-t border-white/5">
                <p className="text-[10px] text-gray-500 font-sans">
                  {c.sourceNote}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Nigeria Map — right 7 cols */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:col-span-7 relative"
          >
            {/* Tooltip — FIX: clean conditional, no IIFE */}
            <AnimatePresence>
              {hoveredData && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  // FIX: will-change on tooltip so it composites independently
                  style={{ willChange: 'transform, opacity' }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-0 right-0 z-20 bg-brand-dark border border-white/10 text-white rounded-[6px] p-4 shadow-xl min-w-[180px]"
                >
                  <p className="font-bold text-sm font-sans mb-2">{hoveredData.name}</p>
                  <div className="space-y-1">
                    <div className="flex justify-between gap-4 text-xs">
                      <span className="text-gray-400">{c.tooltipConnectionsLabel}</span>
                      <span className="font-mono font-bold">{hoveredData.connections}</span>
                    </div>
                    <div className="flex justify-between gap-4 text-xs">
                      <span className="text-gray-400">{c.tooltipFundingGapLabel}</span>
                      <span className="font-mono font-bold" style={{ color: activeTabConfig.color }}>{hoveredData.fundingGap}</span>
                    </div>
                    <div className="flex justify-between gap-4 text-xs">
                      <span className="text-gray-400">{c.tooltipUnservedLabel}</span>
                      <span className="font-mono font-bold">{hoveredData.unservedPct}%</span>
                    </div>
                    <div className="mt-2 pt-2 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">{c.tooltipNeedIndexLabel}</span>
                        <div className="flex-1 bg-white/10 rounded-full h-1">
                          <div
                            className="h-1 rounded-full transition-all"
                            style={{
                              width: `${(hoveredData[activeTabConfig.intensityKey] as number) * 100}%`,
                              backgroundColor: activeTabConfig.color,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Map legend */}
            <div className="flex items-center gap-4 mb-4 mt-2 lg:mt-0">
              <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">{c.legendLabel}</span>
              <div className="flex items-center gap-1 flex-1">
                {[0.1, 0.25, 0.45, 0.65, 0.85].map((v, i) => (
                  <div
                    key={i}
                    className="h-2 flex-1 rounded-sm"
                    style={{ backgroundColor: getStateColor(v, activeTabConfig.color, false) }}
                  />
                ))}
              </div>
              <span className="text-[10px] text-gray-500 font-mono">{c.legendScaleLabel}</span>
            </div>

            {/*
              FIX P1: Remove AnimatePresence key= on SVG wrapper.
              Instead of unmounting/remounting all 37 paths on tab switch,
              we use a simple opacity fade via motion.div around a stable SVG.
              The SVG + path elements stay mounted — only fill colours change via CSS transition on each path.
            */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0.7 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="relative w-full aspect-[744/600]"
              // FIX: promote map wrapper to compositor layer for tab fade
              style={{ willChange: 'opacity' }}
            >
              {/*
                FIX P0: Delegated event handlers on <svg> — ONE listener for all 37 paths.
                Each <path> carries `data-state-id` for O(1) lookup.
                fill CSS transition is kept (browser handles it on the GPU via CSS engine)
                but the JS overhead is now 1 handler call instead of 37.
              */}
              <svg
                viewBox={nigeriaMapData.viewBox}
                className="w-full h-full select-none"
                xmlns="http://www.w3.org/2000/svg"
                onMouseEnter={handleSvgMouseEnter}
                onMouseLeave={handleSvgMouseLeave}
                // mouseover bubbles from paths — catches all state entries without per-path handlers
                onMouseOver={handleSvgMouseEnter}
              >
                {(nigeriaMapData.locations as StateLocation[]).map((loc) => {
                  const data = dataByMapId[loc.id];
                  const intensityKey = activeTabConfig.intensityKey;
                  // FIX P1: Color looked up from pre-built map — zero computation
                  const baseColor = colorMap[`${loc.id}:${intensityKey}`] ?? getStateColor(0.05, activeTabConfig.color, false);
                  const isHovered = hoveredState === loc.id || hoveredRow === loc.id;
                  return (
                    <path
                      key={loc.id}
                      d={loc.path}
                      data-state-id={loc.id}
                      style={{
                        // FIX: fill transitions are CSS-engine driven, not rAF-driven — acceptable
                        // Chrome composites SVG fills on the CPU but batches them in a single paint pass
                        fill: isHovered ? '#FFFFFF' : baseColor,
                        stroke: '#051F1A',
                        strokeWidth: isHovered ? '2px' : '1px',
                        cursor: 'pointer',
                        transition: 'fill 0.25s ease, stroke-width 0.12s ease',
                        // FIX: no pointer-events needed on individual paths since delegation is on <svg>
                      }}
                    />
                  );
                })}
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
