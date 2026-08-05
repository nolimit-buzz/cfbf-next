"use client";

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, MapPin, Zap } from 'lucide-react';
import { LGAProjectEntry } from '@/lib/mapData';
import { withoutEmpty } from '@/lib/cms/content';
import { PROJECTS_LGA_MODAL_DEFAULTS } from '@/lib/cms/projects-defaults';
import type { ProjectsLgaModalSection } from '@/lib/cms/projects-types';

interface LGAModalProps {
  isOpen: boolean;

  lga: string;
  stateName: string;
  projects: LGAProjectEntry[];
  onClose: () => void;
  data?: ProjectsLgaModalSection;
}

/** Turns the CMS's repeatable of `{ projectType, … }` into a lookup by type. */
function byProjectType<T extends { projectType: string }, V>(
  items: T[],
  value: (item: T) => V
): Record<string, V> {
  const out: Record<string, V> = {};
  for (const item of items) {
    if (item.projectType) out[item.projectType] = value(item);
  }
  return out;
}

export default function LGAModal({
  isOpen,
  lga,
  stateName,
  projects,
  onClose,
  data,
}: LGAModalProps) {
  const copy = { ...PROJECTS_LGA_MODAL_DEFAULTS, ...withoutEmpty(data) };

  const projectTypeIcon = byProjectType(copy.projectTypeIcons, (i) => i.icon);
  const heroImages = byProjectType(copy.heroImages, (i) => i.image);

  const getHeroImage = (entries: LGAProjectEntry[]) => {
    if (!entries.length) return heroImages.default;
    return heroImages[entries[0].projectType] ?? heroImages.default;
  };

  const dialogRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // Mount guard — avoids document.body access during SSR
  useEffect(() => { setMounted(true); }, []);

  // ESC key close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const heroBg = getHeroImage(projects);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="lga-modal-overlay"
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Panel */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${lga} project data`}
            className="relative z-10 w-full max-w-5xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#051F1A]/95 backdrop-blur-xl"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Hero Header */}
            <div className="relative h-44 flex-shrink-0 overflow-hidden">
              <img
                src={heroBg}
                alt={lga}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#051F1A] via-[#051F1A]/60 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 text-center">
                <h2 className="text-3xl font-extrabold text-white tracking-tight font-sans">{lga}</h2>
                <p className="text-[#81C34D] text-xs font-bold uppercase tracking-[0.2em] mt-1 font-mono">
                  {copy.subtitlePrefix} · {stateName} {copy.subtitleStateSuffix}
                </p>
              </div>
              {/* Close Button */}
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="absolute top-4 right-4 w-9 h-9 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200 focus:outline-none interactive"
              >
                <X size={16} />
              </button>
            </div>

            {/* Summary Stats Row */}
            {projects.length > 0 && (
              <div className="flex-shrink-0 grid grid-cols-3 divide-x divide-white/5 border-b border-white/5 bg-white/[0.02]">
                <div className="px-6 py-3 flex items-center gap-2">
                  <Building2 size={14} className="text-[#81C34D]" />
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 font-mono">{copy.statLabelDevelopers}</p>
                    <p className="text-base font-bold text-white font-sans">
                      {[...new Set(projects.map(p => p.developer))].length}
                    </p>
                  </div>
                </div>
                <div className="px-6 py-3 flex items-center gap-2">
                  <MapPin size={14} className="text-[#FDB713]" />
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 font-mono">{copy.statLabelCommunities}</p>
                    <p className="text-base font-bold text-white font-sans">{projects.length}</p>
                  </div>
                </div>
                <div className="px-6 py-3 flex items-center gap-2">
                  <Zap size={14} className="text-[#56C36A]" />
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500 font-mono">{copy.statLabelPuePotential}</p>
                    <p className="text-base font-bold text-white font-sans">
                      {projects.reduce((s, p) => s + p.puePotential, 0)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Table Body — scrollable */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center px-8">
                  <MapPin size={32} className="text-brand-accent/30 mb-3" />
                  <p className="text-gray-400 text-sm font-sans">{copy.emptyTitle}</p>
                  <p className="text-gray-600 text-xs font-sans mt-1">{copy.emptyBody}</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-sm">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-white/[0.04] backdrop-blur-sm border-b border-white/5 text-xs font-bold uppercase tracking-wider text-gray-400 font-mono">
                      {copy.columnHeads.map((head, idx) => {
                        // The last two columns are numeric and centre-aligned;
                        // the first carries the table's left gutter.
                        const isNumeric = idx >= copy.columnHeads.length - 2;
                        return (
                          <th
                            key={head.label || idx}
                            className={`p-4 ${idx === 0 ? 'pl-6' : ''} ${
                              idx === copy.columnHeads.length - 1 ? 'pr-6' : ''
                            } ${isNumeric ? 'text-center' : ''}`}
                          >
                            {head.label}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04] font-sans text-gray-300 text-sm">
                    {projects.map((entry, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-white/[0.03] transition-colors duration-150 group"
                      >
                        <td className="p-4 pl-6">
                          <span className="font-semibold text-white text-xs">{entry.developer}</span>
                        </td>
                        <td className="p-4 text-xs text-gray-300 max-w-[200px]">{entry.community}</td>
                        <td className="p-4 text-xs">{entry.state}</td>
                        <td className="p-4 text-xs">{entry.lga}</td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium">
                            <span>{projectTypeIcon[entry.projectType] ?? copy.fallbackIcon}</span>
                            <span className="text-gray-300">{entry.projectType}</span>
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`text-xs font-bold font-mono ${entry.puePotential > 0 ? 'text-[#81C34D]' : 'text-gray-600'}`}>
                            {entry.puePotential}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-center">
                          <span className={`text-xs font-bold font-mono ${entry.enumerators > 0 ? 'text-[#FDB713]' : 'text-gray-600'}`}>
                            {entry.enumerators}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 flex items-center justify-between border-t border-white/5 px-6 py-3 bg-white/[0.01]">
              <p className="text-xs text-gray-600 font-mono uppercase tracking-widest">
                {copy.sourceLabel}
              </p>
              <button
                onClick={onClose}
                className="text-[11px] font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-wider font-mono flex items-center gap-1 focus:outline-none"
              >
                {copy.closeLabel} <X size={12} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
