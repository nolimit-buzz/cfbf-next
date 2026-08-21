"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  XCircle,
  RotateCcw,
  Sparkles,
  Award,
  BookOpen,
  FileCheck
} from 'lucide-react';
import { withoutEmpty } from '@/lib/cms/content';
import {
  ELIGIBILITY_ASSESSMENT_CHROME_DEFAULTS,
  ELIGIBILITY_ASSESSMENT_RESULT_DEFAULTS,
  ELIGIBILITY_ASSESSMENT_STEPS_DEFAULTS,
} from '@/lib/cms/eligibility-defaults';
import type {
  EligibilityAssessmentChromeSection,
  EligibilityAssessmentResultSection,
  EligibilityAssessmentStepsSection,
  EligibilityOutcomeStatus,
} from '@/lib/cms/eligibility-types';

interface AnswerState {
  // Step 1: Corporate
  nigeriaBase: boolean | null;
  pencomCompliant: boolean | null;
  experienceYears: string; // '<2', '2-5', '5+'

  // Step 2: Tech & ESG
  techType: string; // 'solar-grid', 'cold-storage', 'clean-cooking', 'low-carbon-transport', 'fossil-fuel', 'other-green'
  humanRights: boolean | null;
  ifcCompliance: boolean | null;

  // Step 3: Scale
  capacityCheck: boolean | null; // '>=150kW', '<150kW'
  activeSites: number; // 0, 1, 2+
  payingCustomers: boolean | null; // '>=200', '<200'
  scalableModel: boolean | null;

  // Step 4: Finance
  nairaDenominated: boolean | null;
  fundingStructure: string; // 'debt', 'equity-only'
  tenorLimit: boolean | null;
  securityPackage: boolean | null;
}

const initialAnswers: AnswerState = {
  nigeriaBase: null,
  pencomCompliant: null,
  experienceYears: '',
  techType: '',
  humanRights: null,
  ifcCompliance: null,
  capacityCheck: null,
  activeSites: 0,
  payingCustomers: null,
  scalableModel: null,
  nairaDenominated: null,
  fundingStructure: '',
  tenorLimit: null,
  securityPackage: null
};

/**
 * The CMS supplies each question's wording and option labels; the field it
 * writes and the option `value`s stay in the JSX below, because
 * `calculateResult()` switches on them. Questions are therefore read by
 * position — index 0 is `nigeriaBase`, index 13 is `securityPackage`.
 */
interface AssessmentClientProps {
  chrome?: EligibilityAssessmentChromeSection;
  steps?: EligibilityAssessmentStepsSection;
  result?: EligibilityAssessmentResultSection;
}

export default function AssessmentClient({
  chrome,
  steps: stepsSection,
  result: resultSection,
}: AssessmentClientProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<AnswerState>(initialAnswers);
  const cardRef = useRef<HTMLDivElement>(null);

  const chromeCopy = { ...ELIGIBILITY_ASSESSMENT_CHROME_DEFAULTS, ...withoutEmpty(chrome) };
  const stepsCopy = { ...ELIGIBILITY_ASSESSMENT_STEPS_DEFAULTS, ...withoutEmpty(stepsSection) };
  const resultCopy = { ...ELIGIBILITY_ASSESSMENT_RESULT_DEFAULTS, ...withoutEmpty(resultSection) };

  // Opt-in diagnostic: shows whether each section rendered from the CMS or from
  // its bundled defaults. Off unless NEXT_PUBLIC_CMS_DEBUG=1.
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_CMS_DEBUG !== '1') return;

    const sections = { chrome, steps: stepsSection, result: resultSection };
    const source = Object.fromEntries(
      Object.entries(sections).map(([name, value]) => [name, value ? 'cms' : 'default'])
    );

    console.log('[cms] eligibility assessment sections', source, sections);
  }, [chrome, stepsSection, resultSection]);

  /** Step copy by position, falling back to the bundled step. */
  const stepAt = (idx: number) =>
    stepsCopy.steps[idx] ?? ELIGIBILITY_ASSESSMENT_STEPS_DEFAULTS.steps[idx];

  /** Question copy by position — see `QUESTION_ORDER`. */
  const q = (idx: number) =>
    stepsCopy.questions[idx] ?? ELIGIBILITY_ASSESSMENT_STEPS_DEFAULTS.questions[idx];

  /** One option's label, falling back to the bundled wording. */
  const opt = (questionIdx: number, optionIdx: number) =>
    q(questionIdx).options[optionIdx]?.label ??
    ELIGIBILITY_ASSESSMENT_STEPS_DEFAULTS.questions[questionIdx].options[optionIdx].label;

  /** Renders the shared `LABEL *` line above a question's options. */
  const questionLabel = (idx: number) => (
    <label id={`q-${idx}-label`} className="text-xs font-semibold text-gray-300 block uppercase tracking-wider">
      {q(idx).label} <span className="text-[#81C34D] font-bold">{q(idx).requiredMarker}</span>
    </label>
  );

  /** `role`/`aria-labelledby` for the options container of question `idx`. */
  const radioGroupProps = (idx: number) => ({
    role: 'radiogroup' as const,
    'aria-labelledby': `q-${idx}-label`,
  });

  const logRowAt = (idx: number) =>
    resultCopy.logRows[idx] ?? ELIGIBILITY_ASSESSMENT_RESULT_DEFAULTS.logRows[idx];

  const outcomeFor = (status: EligibilityOutcomeStatus) =>
    resultCopy.outcomes.find((o) => o.status === status) ??
    ELIGIBILITY_ASSESSMENT_RESULT_DEFAULTS.outcomes.find((o) => o.status === status)!;

  // Auto scroll to top of card on step change
  useEffect(() => {
    cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [step]);

  const handleSelect = (field: keyof AnswerState, value: any) => {
    setAnswers(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(prev => prev + 1);
    } else {
      setStep(5); // Show results
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    } else {
      router.push('/eligibility');
    }
  };

  const restartQuiz = () => {
    setAnswers(initialAnswers);
    setStep(1);
  };

  // Validation checking per step
  const isStepValid = () => {
    if (step === 1) {
      return answers.nigeriaBase !== null && answers.pencomCompliant !== null && answers.experienceYears !== '';
    }
    if (step === 2) {
      return answers.techType !== '' && answers.humanRights !== null && answers.ifcCompliance !== null;
    }
    if (step === 3) {
      return answers.capacityCheck !== null && answers.payingCustomers !== null && answers.scalableModel !== null;
    }
    if (step === 4) {
      return answers.nairaDenominated !== null && answers.fundingStructure !== '' && answers.tenorLimit !== null && answers.securityPackage !== null;
    }
    return true;
  };

  // Readiness Calculations
  const calculateResult = () => {
    // 1. Check fatal exclusions
    const hasFatalFailure =
      answers.nigeriaBase === false ||
      answers.pencomCompliant === false ||
      answers.techType === 'fossil-fuel' ||
      answers.humanRights === false ||
      answers.ifcCompliance === false ||
      answers.capacityCheck === false ||
      answers.activeSites === 0 ||
      answers.nairaDenominated === false ||
      answers.fundingStructure === 'equity-only' ||
      answers.securityPackage === false;

    if (hasFatalFailure) {
      // Excluded
      // Calculate score based on total positive checks passed
      let passedChecks = 0;
      if (answers.nigeriaBase) passedChecks++;
      if (answers.pencomCompliant) passedChecks++;
      if (answers.techType !== 'fossil-fuel' && answers.techType !== '') passedChecks++;
      if (answers.humanRights) passedChecks++;
      if (answers.ifcCompliance) passedChecks++;
      if (answers.capacityCheck) passedChecks++;
      if (answers.activeSites > 0) passedChecks++;
      if (answers.nairaDenominated) passedChecks++;
      if (answers.fundingStructure === 'debt') passedChecks++;
      if (answers.securityPackage) passedChecks++;

      const pct = Math.round((passedChecks / 10) * 40); // Max 40% if fatal failed
      const outcome = outcomeFor('excluded');
      return {
        status: 'excluded' as const,
        score: pct,
        title: outcome.title,
        desc: outcome.description
      };
    }

    // 2. Check operational/capacity thresholds
    const isEarlyStageOrUnderScale =
      answers.experienceYears === '<2' ||
      answers.payingCustomers === false ||
      answers.scalableModel === false;

    if (isEarlyStageOrUnderScale) {
      // Eligible with Technical Assistance
      // Base score 60%, plus 10% for experience, 10% for active sites
      let bonus = 0;
      if (answers.experienceYears === '2-5') bonus += 5;
      if (answers.experienceYears === '5+') bonus += 10;
      if (answers.activeSites > 1) bonus += 10;

      const pct = 60 + bonus;
      const outcome = outcomeFor('technical-assistance');
      return {
        status: 'technical-assistance' as const,
        score: pct,
        title: outcome.title,
        desc: outcome.description
      };
    }

    // 3. Fully Qualified
    let scoreBonus = 0;
    if (answers.experienceYears === '5+') scoreBonus += 5;
    if (answers.activeSites > 1) scoreBonus += 5;
    const pct = 90 + scoreBonus;

    const outcome = outcomeFor('qualified');
    return {
      status: 'qualified' as const,
      score: pct,
      title: outcome.title,
      desc: outcome.description
    };
  };

  const result = step === 5 ? calculateResult() : null;

  // Handle Submit & Route Pre-fill
  const handleResultSubmit = () => {
    if (!result) return;
    const query = new URLSearchParams({
      readiness: result.status,
      score: String(result.score),
      tech: answers.techType,
      capacity: answers.capacityCheck ? 'eligible' : 'under',
      customers: answers.payingCustomers ? 'eligible' : 'under'
    });
    router.push(`/contact?${query.toString()}`);
  };

  // SVG Circumference calculation
  const radius = 60;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = result ? circumference - (result.score / 100) * circumference : circumference;

  return (
    <div className="bg-[#051F1A] text-white min-h-screen pb-24 font-sans text-left flex flex-col pt-44 px-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-brand-accent/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-1/4 h-1/4 bg-brand-accent/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Form Content Wrapper */}
      <div
        ref={cardRef}
        className="w-full container mx-auto max-w-5xl relative z-10"
      >
        {/* Distraction-free wizard header */}
        <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-5">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors uppercase font-bold tracking-wider focus:outline-none"
          >
            <ArrowLeft size={16} /> {chromeCopy.backLabel}
          </button>

          {step <= 4 ? (
            <span className="text-[10px] font-mono font-bold text-brand-accent uppercase tracking-widest bg-brand-accent/10 px-2.5 py-1 rounded">
              {chromeCopy.stepCounterPrefix} {step} {chromeCopy.stepCounterMiddle} {chromeCopy.stepCounterTotal}
            </span>
          ) : (
            <span className="text-[10px] font-mono font-bold text-white uppercase tracking-widest bg-white/10 px-2.5 py-1 rounded">
              {chromeCopy.summaryBadge}
            </span>
          )}
        </div>

        {/* Step Progress Line */}
        {step <= 4 && (
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-10 flex">
            <div
              className="h-full bg-brand-accent transition-all duration-500 ease-out"
              style={{ width: `${(step - 1) * 25}%` }}
            />
          </div>
        )}

        {/* Form Screens Inside AnimatePresence */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h3 className="text-xl md:text-2xl font-bold tracking-tight font-sans text-white">
                {stepAt(0).title}
              </h3>
              <p className="text-xs md:text-sm text-gray-400 leading-relaxed font-light mb-8">
                {stepAt(0).description}
              </p>

              {/* Q1: Nigeria Base */}
              <div className="space-y-3">
                {questionLabel(0)}
                <div {...radioGroupProps(0)} className="grid grid-cols-2 gap-4">
                  <button
                    role="radio"
                    aria-checked={answers.nigeriaBase === true}
                    onClick={() => handleSelect('nigeriaBase', true)}
                    className={`py-3.5 rounded-[6px] border text-xs font-bold transition-all focus:outline-none ${
                      answers.nigeriaBase === true
                        ? 'bg-brand-accent text-brand-dark border-brand-accent'
                        : 'bg-white/5 border-white/10 hover:border-white/30 text-gray-300'
                    }`}
                  >
                    {opt(0, 0)}
                  </button>
                  <button
                    role="radio"
                    aria-checked={answers.nigeriaBase === false}
                    onClick={() => handleSelect('nigeriaBase', false)}
                    className={`py-3.5 rounded-[6px] border text-xs font-bold transition-all focus:outline-none ${
                      answers.nigeriaBase === false
                        ? 'bg-red-500/20 text-red-400 border-red-500/50'
                        : 'bg-white/5 border-white/10 hover:border-white/30 text-gray-300'
                    }`}
                  >
                    {opt(0, 1)}
                  </button>
                </div>
                <p className="text-[10px] text-gray-500 leading-normal">
                  {q(0).helperText}
                </p>
              </div>

              {/* Q2: PENCOM Compliance */}
              <div className="space-y-3 pt-2">
                {questionLabel(1)}
                <div {...radioGroupProps(1)} className="grid grid-cols-2 gap-4">
                  <button
                    role="radio"
                    aria-checked={answers.pencomCompliant === true}
                    onClick={() => handleSelect('pencomCompliant', true)}
                    className={`py-3.5 rounded-[6px] border text-xs font-bold transition-all focus:outline-none ${
                      answers.pencomCompliant === true
                        ? 'bg-brand-accent text-brand-dark border-brand-accent'
                        : 'bg-white/5 border-white/10 hover:border-white/30 text-gray-300'
                    }`}
                  >
                    {opt(1, 0)}
                  </button>
                  <button
                    role="radio"
                    aria-checked={answers.pencomCompliant === false}
                    onClick={() => handleSelect('pencomCompliant', false)}
                    className={`py-3.5 rounded-[6px] border text-xs font-bold transition-all focus:outline-none ${
                      answers.pencomCompliant === false
                        ? 'bg-red-500/20 text-red-400 border-red-500/50'
                        : 'bg-white/5 border-white/10 hover:border-white/30 text-gray-300'
                    }`}
                  >
                    {opt(1, 1)}
                  </button>
                </div>
                <p className="text-[10px] text-gray-500 leading-normal">
                  {q(1).helperText}
                </p>
              </div>

              {/* Q3: Experience Years */}
              <div className="space-y-3 pt-2">
                {questionLabel(2)}
                <div {...radioGroupProps(2)} className="grid grid-cols-3 gap-3">
                  {q(2).options.map(option => (
                    <button
                      key={option.value}
                      role="radio"
                      aria-checked={answers.experienceYears === option.value}
                      onClick={() => handleSelect('experienceYears', option.value)}
                      className={`py-3.5 rounded-[6px] border text-xs font-bold transition-all focus:outline-none ${
                        answers.experienceYears === option.value
                          ? 'bg-brand-accent text-brand-dark border-brand-accent'
                          : 'bg-white/5 border-white/10 hover:border-white/30 text-gray-300'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h3 className="text-xl md:text-2xl font-bold tracking-tight font-sans text-white">
                {stepAt(1).title}
              </h3>
              <p className="text-xs md:text-sm text-gray-400 leading-relaxed font-light mb-8">
                {stepAt(1).description}
              </p>

              {/* Q4: Tech Sector */}
              <div className="space-y-3">
                {questionLabel(3)}
                <div {...radioGroupProps(3)} className="grid grid-cols-2 gap-3">
                  {q(3).options.map(tech => (
                    <button
                      key={tech.value}
                      role="radio"
                      aria-checked={answers.techType === tech.value}
                      onClick={() => handleSelect('techType', tech.value)}
                      className={`py-3 px-2 rounded-[6px] border text-xs font-bold transition-all focus:outline-none ${
                        answers.techType === tech.value
                          ? tech.value === 'fossil-fuel'
                            ? 'bg-red-500/20 text-red-400 border-red-500/50'
                            : 'bg-brand-accent text-brand-dark border-brand-accent'
                          : 'bg-white/5 border-white/10 hover:border-white/30 text-gray-300'
                      }`}
                    >
                      {tech.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Q5: Human Rights */}
              <div className="space-y-3 pt-2">
                {questionLabel(4)}
                <div {...radioGroupProps(4)} className="grid grid-cols-2 gap-4">
                  <button
                    role="radio"
                    aria-checked={answers.humanRights === true}
                    onClick={() => handleSelect('humanRights', true)}
                    className={`py-3.5 rounded-[6px] border text-xs font-bold transition-all focus:outline-none ${
                      answers.humanRights === true
                        ? 'bg-brand-accent text-brand-dark border-brand-accent'
                        : 'bg-white/5 border-white/10 hover:border-white/30 text-gray-300'
                    }`}
                  >
                    {opt(4, 0)}
                  </button>
                  <button
                    role="radio"
                    aria-checked={answers.humanRights === false}
                    onClick={() => handleSelect('humanRights', false)}
                    className={`py-3.5 rounded-[6px] border text-xs font-bold transition-all focus:outline-none ${
                      answers.humanRights === false
                        ? 'bg-red-500/20 text-red-400 border-red-500/50'
                        : 'bg-white/5 border-white/10 hover:border-white/30 text-gray-300'
                    }`}
                  >
                    {opt(4, 1)}
                  </button>
                </div>
              </div>

              {/* Q6: IFC ESG Compliance */}
              <div className="space-y-3 pt-2">
                {questionLabel(5)}
                <div {...radioGroupProps(5)} className="grid grid-cols-2 gap-4">
                  <button
                    role="radio"
                    aria-checked={answers.ifcCompliance === true}
                    onClick={() => handleSelect('ifcCompliance', true)}
                    className={`py-3.5 rounded-[6px] border text-xs font-bold transition-all focus:outline-none ${
                      answers.ifcCompliance === true
                        ? 'bg-brand-accent text-brand-dark border-brand-accent'
                        : 'bg-white/5 border-white/10 hover:border-white/30 text-gray-300'
                    }`}
                  >
                    {opt(5, 0)}
                  </button>
                  <button
                    role="radio"
                    aria-checked={answers.ifcCompliance === false}
                    onClick={() => handleSelect('ifcCompliance', false)}
                    className={`py-3.5 rounded-[6px] border text-xs font-bold transition-all focus:outline-none ${
                      answers.ifcCompliance === false
                        ? 'bg-red-500/20 text-red-400 border-red-500/50'
                        : 'bg-white/5 border-white/10 hover:border-white/30 text-gray-300'
                    }`}
                  >
                    {opt(5, 1)}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h3 className="text-xl md:text-2xl font-bold tracking-tight font-sans text-white">
                {stepAt(2).title}
              </h3>
              <p className="text-xs md:text-sm text-gray-400 leading-relaxed font-light mb-8">
                {stepAt(2).description}
              </p>

              {/* Q7: Capacity check */}
              <div className="space-y-3">
                {questionLabel(6)}
                <div {...radioGroupProps(6)} className="grid grid-cols-2 gap-4">
                  <button
                    role="radio"
                    aria-checked={answers.capacityCheck === true}
                    onClick={() => handleSelect('capacityCheck', true)}
                    className={`py-3.5 rounded-[6px] border text-xs font-bold transition-all focus:outline-none ${
                      answers.capacityCheck === true
                        ? 'bg-brand-accent text-brand-dark border-brand-accent'
                        : 'bg-white/5 border-white/10 hover:border-white/30 text-gray-300'
                    }`}
                  >
                    {opt(6, 0)}
                  </button>
                  <button
                    role="radio"
                    aria-checked={answers.capacityCheck === false}
                    onClick={() => handleSelect('capacityCheck', false)}
                    className={`py-3.5 rounded-[6px] border text-xs font-bold transition-all focus:outline-none ${
                      answers.capacityCheck === false
                        ? 'bg-red-500/20 text-red-400 border-red-500/50'
                        : 'bg-white/5 border-white/10 hover:border-white/30 text-gray-300'
                    }`}
                  >
                    {opt(6, 1)}
                  </button>
                </div>
              </div>

              {/* Q8: Active Sites */}
              <div className="space-y-3 pt-2">
                {questionLabel(7)}
                <div {...radioGroupProps(7)} className="grid grid-cols-3 gap-3">
                  {q(7).options.map(option => {
                    const val = Number(option.value);
                    return (
                      <button
                        key={option.value}
                        role="radio"
                        aria-checked={answers.activeSites === val}
                        onClick={() => handleSelect('activeSites', val)}
                        className={`py-3.5 rounded-[6px] border text-xs font-bold transition-all focus:outline-none ${
                          answers.activeSites === val
                            ? val === 0
                              ? 'bg-red-500/20 text-red-400 border-red-500/50'
                              : 'bg-brand-accent text-brand-dark border-brand-accent'
                            : 'bg-white/5 border-white/10 hover:border-white/30 text-gray-300'
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Q9: Paying Customers */}
              <div className="space-y-3 pt-2">
                {questionLabel(8)}
                <div {...radioGroupProps(8)} className="grid grid-cols-2 gap-4">
                  <button
                    role="radio"
                    aria-checked={answers.payingCustomers === true}
                    onClick={() => handleSelect('payingCustomers', true)}
                    className={`py-3.5 rounded-[6px] border text-xs font-bold transition-all focus:outline-none ${
                      answers.payingCustomers === true
                        ? 'bg-brand-accent text-brand-dark border-brand-accent'
                        : 'bg-white/5 border-white/10 hover:border-white/30 text-gray-300'
                    }`}
                  >
                    {opt(8, 0)}
                  </button>
                  <button
                    role="radio"
                    aria-checked={answers.payingCustomers === false}
                    onClick={() => handleSelect('payingCustomers', false)}
                    className={`py-3.5 rounded-[6px] border text-xs font-bold transition-all focus:outline-none ${
                      answers.payingCustomers === false
                        ? 'bg-white/10 text-white border-white/10 hover:border-white/30'
                        : 'bg-white/5 border-white/10 hover:border-white/30 text-gray-300'
                    }`}
                  >
                    {opt(8, 1)}
                  </button>
                </div>
              </div>

              {/* Q10: Scalable model */}
              <div className="space-y-3 pt-2">
                {questionLabel(9)}
                <div {...radioGroupProps(9)} className="grid grid-cols-2 gap-4">
                  <button
                    role="radio"
                    aria-checked={answers.scalableModel === true}
                    onClick={() => handleSelect('scalableModel', true)}
                    className={`py-3.5 rounded-[6px] border text-xs font-bold transition-all focus:outline-none ${
                      answers.scalableModel === true
                        ? 'bg-brand-accent text-brand-dark border-brand-accent'
                        : 'bg-white/5 border-white/10 hover:border-white/30 text-gray-300'
                    }`}
                  >
                    {opt(9, 0)}
                  </button>
                  <button
                    role="radio"
                    aria-checked={answers.scalableModel === false}
                    onClick={() => handleSelect('scalableModel', false)}
                    className={`py-3.5 rounded-[6px] border text-xs font-bold transition-all focus:outline-none ${
                      answers.scalableModel === false
                        ? 'bg-white/10 text-white border-white/10 hover:border-white/30'
                        : 'bg-white/5 border-white/10 hover:border-white/30 text-gray-300'
                    }`}
                  >
                    {opt(9, 1)}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h3 className="text-xl md:text-2xl font-bold tracking-tight font-sans text-white">
                {stepAt(3).title}
              </h3>
              <p className="text-xs md:text-sm text-gray-400 leading-relaxed font-light mb-8">
                {stepAt(3).description}
              </p>

              {/* Q11: Naira Denominated */}
              <div className="space-y-3">
                {questionLabel(10)}
                <div {...radioGroupProps(10)} className="grid grid-cols-2 gap-4">
                  <button
                    role="radio"
                    aria-checked={answers.nairaDenominated === true}
                    onClick={() => handleSelect('nairaDenominated', true)}
                    className={`py-3.5 rounded-[6px] border text-xs font-bold transition-all focus:outline-none ${
                      answers.nairaDenominated === true
                        ? 'bg-brand-accent text-brand-dark border-brand-accent'
                        : 'bg-white/5 border-white/10 hover:border-white/30 text-gray-300'
                    }`}
                  >
                    {opt(10, 0)}
                  </button>
                  <button
                    role="radio"
                    aria-checked={answers.nairaDenominated === false}
                    onClick={() => handleSelect('nairaDenominated', false)}
                    className={`py-3.5 rounded-[6px] border text-xs font-bold transition-all focus:outline-none ${
                      answers.nairaDenominated === false
                        ? 'bg-red-500/20 text-red-400 border-red-500/50'
                        : 'bg-white/5 border-white/10 hover:border-white/30 text-gray-300'
                    }`}
                  >
                    {opt(10, 1)}
                  </button>
                </div>
              </div>

              {/* Q12: Funding type */}
              <div className="space-y-3 pt-2">
                {questionLabel(11)}
                <div {...radioGroupProps(11)} className="grid grid-cols-2 gap-4">
                  <button
                    role="radio"
                    aria-checked={answers.fundingStructure === 'debt'}
                    onClick={() => handleSelect('fundingStructure', 'debt')}
                    className={`py-3.5 rounded-[6px] border text-xs font-bold transition-all focus:outline-none ${
                      answers.fundingStructure === 'debt'
                        ? 'bg-brand-accent text-brand-dark border-brand-accent'
                        : 'bg-white/5 border-white/10 hover:border-white/30 text-gray-300'
                    }`}
                  >
                    {opt(11, 0)}
                  </button>
                  <button
                    role="radio"
                    aria-checked={answers.fundingStructure === 'equity-only'}
                    onClick={() => handleSelect('fundingStructure', 'equity-only')}
                    className={`py-3.5 rounded-[6px] border text-xs font-bold transition-all focus:outline-none ${
                      answers.fundingStructure === 'equity-only'
                        ? 'bg-red-500/20 text-red-400 border-red-500/50'
                        : 'bg-white/5 border-white/10 hover:border-white/30 text-gray-300'
                    }`}
                  >
                    {opt(11, 1)}
                  </button>
                </div>
              </div>

              {/* Q13: Tenor limit */}
              <div className="space-y-3 pt-2">
                {questionLabel(12)}
                <div {...radioGroupProps(12)} className="grid grid-cols-2 gap-4">
                  <button
                    role="radio"
                    aria-checked={answers.tenorLimit === true}
                    onClick={() => handleSelect('tenorLimit', true)}
                    className={`py-3.5 rounded-[6px] border text-xs font-bold transition-all focus:outline-none ${
                      answers.tenorLimit === true
                        ? 'bg-brand-accent text-brand-dark border-brand-accent'
                        : 'bg-white/5 border-white/10 hover:border-white/30 text-gray-300'
                    }`}
                  >
                    {opt(12, 0)}
                  </button>
                  <button
                    role="radio"
                    aria-checked={answers.tenorLimit === false}
                    onClick={() => handleSelect('tenorLimit', false)}
                    className={`py-3.5 rounded-[6px] border text-xs font-bold transition-all focus:outline-none ${
                      answers.tenorLimit === false
                        ? 'bg-white/10 text-white border-white/10 hover:border-white/30'
                        : 'bg-white/5 border-white/10 hover:border-white/30 text-gray-300'
                    }`}
                  >
                    {opt(12, 1)}
                  </button>
                </div>
              </div>

              {/* Q14: Security Package */}
              <div className="space-y-3 pt-2">
                {questionLabel(13)}
                <div {...radioGroupProps(13)} className="grid grid-cols-2 gap-4">
                  <button
                    role="radio"
                    aria-checked={answers.securityPackage === true}
                    onClick={() => handleSelect('securityPackage', true)}
                    className={`py-3.5 rounded-[6px] border text-xs font-bold transition-all focus:outline-none ${
                      answers.securityPackage === true
                        ? 'bg-brand-accent text-brand-dark border-brand-accent'
                        : 'bg-white/5 border-white/10 hover:border-white/30 text-gray-300'
                    }`}
                  >
                    {opt(13, 0)}
                  </button>
                  <button
                    role="radio"
                    aria-checked={answers.securityPackage === false}
                    onClick={() => handleSelect('securityPackage', false)}
                    className={`py-3.5 rounded-[6px] border text-xs font-bold transition-all focus:outline-none ${
                      answers.securityPackage === false
                        ? 'bg-red-500/20 text-red-400 border-red-500/50'
                        : 'bg-white/5 border-white/10 hover:border-white/30 text-gray-300'
                    }`}
                  >
                    {opt(13, 1)}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 5 && result && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-8 text-center flex flex-col items-center"
            >
              {/* Dynamic Readiness Chart Dial */}
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r={radius}
                    className="stroke-white/5 fill-none"
                    strokeWidth={strokeWidth}
                  />
                  <motion.circle
                    cx="72"
                    cy="72"
                    r={radius}
                    className={`fill-none ${
                      result.status === 'qualified'
                        ? 'stroke-brand-accent'
                        : result.status === 'technical-assistance'
                          ? 'stroke-[#009FD4]'
                          : 'stroke-red-500'
                    }`}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-white font-mono tracking-tighter">
                    {result.score}%
                  </span>
                  <span className="text-[8px] text-gray-500 uppercase tracking-widest font-bold font-mono">
                    {resultCopy.readinessLabel}
                  </span>
                </div>
              </div>

              {/* Status Header & Icon */}
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  {result.status === 'qualified' && (
                    <div className="p-1 rounded-full bg-brand-accent/10 border border-brand-accent/25 text-brand-accent">
                      <Award size={20} />
                    </div>
                  )}
                  {result.status === 'technical-assistance' && (
                    <div className="p-1 rounded-full bg-[#009FD4]/10 border border-[#009FD4]/25 text-[#009FD4]">
                      <Sparkles size={20} />
                    </div>
                  )}
                  {result.status === 'excluded' && (
                    <div className="p-1 rounded-full bg-red-500/10 border border-red-500/25 text-red-400">
                      <XCircle size={20} />
                    </div>
                  )}
                  <h3 className="text-xl md:text-2xl font-extrabold text-white font-sans tracking-tight">
                    {result.title}
                  </h3>
                </div>

                <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-light max-w-lg mx-auto">
                  {result.desc}
                </p>
              </div>

              {/* Summary parameters checklist preview */}
              <div className="w-full bg-[#02100d] border border-white/5 rounded-[6px] p-5 text-left text-xs font-sans space-y-2.5">
                <h5 className="font-bold text-gray-400 uppercase tracking-wider text-[10px] border-b border-white/5 pb-2 mb-2 font-mono">
                  {resultCopy.logHeading}
                </h5>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">{logRowAt(0).label}</span>
                  <span className={answers.nigeriaBase ? 'text-[#81C34D] font-bold' : 'text-red-400 font-bold'}>
                    {answers.nigeriaBase ? logRowAt(0).passLabel : logRowAt(0).failLabel}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">{logRowAt(1).label}</span>
                  <span className={answers.humanRights && answers.ifcCompliance ? 'text-[#81C34D] font-bold' : 'text-red-400 font-bold'}>
                    {answers.humanRights && answers.ifcCompliance ? logRowAt(1).passLabel : logRowAt(1).failLabel}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">{logRowAt(2).label}</span>
                  <span className={answers.capacityCheck ? 'text-[#81C34D] font-bold' : 'text-red-400 font-bold'}>
                    {answers.capacityCheck ? logRowAt(2).passLabel : logRowAt(2).failLabel}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">{logRowAt(3).label}</span>
                  <span className={answers.payingCustomers ? 'text-[#81C34D] font-bold' : 'text-yellow-400 font-bold'}>
                    {answers.payingCustomers ? logRowAt(3).passLabel : logRowAt(3).failLabel}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">{logRowAt(4).label}</span>
                  <span className={answers.nairaDenominated ? 'text-[#81C34D] font-bold' : 'text-red-400 font-bold'}>
                    {answers.nairaDenominated ? logRowAt(4).passLabel : logRowAt(4).failLabel}
                  </span>
                </div>
              </div>

              {/* Action CTAs */}
              <div className="flex flex-col md:flex-row gap-4 w-full pt-4">
                {result.status !== 'excluded' ? (
                  <button
                    onClick={handleResultSubmit}
                    className="flex-1 py-3.5 rounded-full bg-[#81C34D] hover:bg-white text-brand-dark hover:text-[#051F1A] font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 focus:outline-none interactive"
                  >
                    <FileCheck size={16} />
                    {outcomeFor(result.status).ctaLabel}
                  </button>
                ) : (
                  <button
                    onClick={() => router.push('/eligibility')}
                    className="flex-1 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 focus:outline-none interactive"
                  >
                    <BookOpen size={16} /> {resultCopy.excludedCtaLabel}
                  </button>
                )}

                <button
                  onClick={restartQuiz}
                  className="py-3.5 px-6 rounded-full bg-white/5 border border-white/10 hover:border-white/30 text-gray-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5 focus:outline-none interactive"
                >
                  <RotateCcw size={14} /> {resultCopy.restartLabel}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next / Back navigation buttons (Footer of card) */}
        {step <= 4 && (
          <div className="flex justify-between items-center mt-10 pt-5 border-t border-white/5">
            <button
              onClick={handleBack}
              className="px-6 py-2.5 rounded text-xs text-gray-400 hover:text-white transition-colors uppercase font-bold tracking-wider focus:outline-none"
            >
              {step === 1 ? chromeCopy.cancelLabel : chromeCopy.backLabel}
            </button>

            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 focus:outline-none interactive ${
                isStepValid()
                  ? 'bg-brand-accent text-brand-dark hover:bg-white'
                  : 'bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed'
              }`}
            >
              {chromeCopy.nextLabel} <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
