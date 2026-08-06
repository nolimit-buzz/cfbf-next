"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Download, CheckCircle, Send, AlertCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import GlassHero, { heroRowVariants, heroCardVariants } from '@/components/GlassHero';
import StepCard, { StepTheme } from '@/components/ui/StepCard';
import { withoutEmpty } from '@/lib/cms/content';
import {
  CONTACT_DOWNLOAD_CTA_DEFAULTS,
  CONTACT_ELIGIBILITY_REMINDER_DEFAULTS,
  CONTACT_ENQUIRY_FORM_DEFAULTS,
  CONTACT_FACILITY_CONTACTS_DEFAULTS,
  CONTACT_FUN_STATS_DEFAULTS,
  CONTACT_HERO_DEFAULTS,
  CONTACT_NEXT_STEPS_DEFAULTS,
  CONTACT_SUBMISSION_SUCCESS_DEFAULTS,
} from '@/lib/cms/contact-defaults';
import type {
  ContactDownloadCtaSection,
  ContactEligibilityReminderSection,
  ContactEnquiryFormSection,
  ContactFacilityContactsSection,
  ContactFunStatsSection,
  ContactHeroSection,
  ContactNextStepsSection,
  ContactSubmissionSuccessSection,
} from '@/lib/cms/contact-types';

/**
 * Theme per hero card, positional rather than read from the CMS so an editor
 * reordering copy cannot break the white → cyan → green cycle. The `theme` field
 * on the component is carried for the seed's sake and deliberately ignored here.
 */
const HERO_CARD_THEMES: StepTheme[] = ['light', 'cyan', 'green'];

/**
 * The roles the form branches on. These are logic, not copy: the CMS supplies
 * only the tab labels, read by position, so an edited `value` cannot change
 * which fields a tab reveals.
 */
const ROLES = ['developer', 'investor', 'donor'] as const;
type Role = (typeof ROLES)[number];

/** How long each fun-stat card stays on screen, in ms. */
const STAT_ROTATE_MS = 4500;

function FunStatsCarousel({ funStats }: { funStats?: ContactFunStatsSection }) {
  const copy = { ...CONTACT_FUN_STATS_DEFAULTS, ...withoutEmpty(funStats) };
  const stats = copy.stats;

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % stats.length);
    }, STAT_ROTATE_MS);
    return () => clearInterval(interval);
  }, [stats.length]);

  const stat = stats[activeIndex] ?? stats[0];

  return (
    <div className="space-y-4">
      {/* Title Header */}
      <div className="flex items-center gap-2 text-[#00A788]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#00A788] animate-pulse"></span>
        <span className="text-[11px] font-bold tracking-[0.2em] uppercase font-mono">
          {copy.eyebrow}
        </span>
      </div>

      {/* Main image container */}
      <div className="relative w-full aspect-square sm:aspect-[16/10] md:aspect-[4/3] lg:aspect-square xl:aspect-[16/10] min-h-[380px] rounded-[6px] overflow-hidden shadow-lg bg-[#02100d] flex items-center justify-center group">
        {/* Background Image with Tint Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 scale-100 group-hover:scale-105"
          role={copy.backgroundImage_alt_text ? 'img' : undefined}
          aria-label={copy.backgroundImage_alt_text || undefined}
          style={{
            backgroundImage: `url('${copy.backgroundImage}')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#02100d]/90 via-[#042d24]/65 to-[#02100d]/90" />

        {/* Center Card Container */}
        <div className="relative z-10 w-[85%] max-w-[420px] bg-[#021a15]/95 border border-[#043329] rounded-[6px] p-6 sm:p-8 shadow-2xl backdrop-blur-md min-h-[270px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 flex flex-col justify-between"
            >
              <div>
                {/* Custom TrendingUp Icon — inline markup authored in the CMS. */}
                <div className="mb-4" dangerouslySetInnerHTML={{ __html: copy.statIconSvg }} />

                {/* Big Metric Title */}
                <h4 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight font-sans tracking-tight mb-2">
                  {stat.value} <br />
                  <span className="text-[#00A788]">{stat.label}</span>
                </h4>

                {/* Horizontal Green Line Divider */}
                <div className="w-12 h-0.5 bg-[#00A788] my-4 rounded-full" />
              </div>

              {/* Subtext explanation in sentence case */}
              <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
                {stat.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Indicators at the bottom */}
          <div className="flex gap-1.5 mt-6 items-center">
            {stats.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer focus:outline-none ${
                  i === activeIndex ? 'w-6 bg-[#00A788]' : 'w-1.5 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ContactSectionsProps {
  hero?: ContactHeroSection;
  facilityContacts?: ContactFacilityContactsSection;
  eligibilityReminder?: ContactEligibilityReminderSection;
  funStats?: ContactFunStatsSection;
  enquiryForm?: ContactEnquiryFormSection;
  submissionSuccess?: ContactSubmissionSuccessSection;
  nextSteps?: ContactNextStepsSection;
  downloadCta?: ContactDownloadCtaSection;
}

export default function ContactSections({
  hero,
  facilityContacts,
  eligibilityReminder,
  funStats,
  enquiryForm,
  submissionSuccess,
  nextSteps,
  downloadCta,
}: ContactSectionsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const heroCopy = { ...CONTACT_HERO_DEFAULTS, ...withoutEmpty(hero) };
  const contactsCopy = { ...CONTACT_FACILITY_CONTACTS_DEFAULTS, ...withoutEmpty(facilityContacts) };
  const reminderCopy = { ...CONTACT_ELIGIBILITY_REMINDER_DEFAULTS, ...withoutEmpty(eligibilityReminder) };
  const formCopy = { ...CONTACT_ENQUIRY_FORM_DEFAULTS, ...withoutEmpty(enquiryForm) };
  const successCopy = { ...CONTACT_SUBMISSION_SUCCESS_DEFAULTS, ...withoutEmpty(submissionSuccess) };
  const nextStepsCopy = { ...CONTACT_NEXT_STEPS_DEFAULTS, ...withoutEmpty(nextSteps) };
  const ctaCopy = { ...CONTACT_DOWNLOAD_CTA_DEFAULTS, ...withoutEmpty(downloadCta) };

  // Opt-in diagnostic: shows whether each section rendered from the CMS or from
  // its bundled defaults. Off unless NEXT_PUBLIC_CMS_DEBUG=1, so visitors never
  // see it — but available in production, which a NODE_ENV check could not do.
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_CMS_DEBUG !== '1') return;

    const sections = {
      hero,
      facilityContacts,
      eligibilityReminder,
      funStats,
      enquiryForm,
      submissionSuccess,
      nextSteps,
      downloadCta,
    };
    const source = Object.fromEntries(
      Object.entries(sections).map(([name, value]) => [name, value ? 'cms' : 'default'])
    );

    console.log('[cms] contact sections', source, sections);
  }, [
    hero,
    facilityContacts,
    eligibilityReminder,
    funStats,
    enquiryForm,
    submissionSuccess,
    nextSteps,
    downloadCta,
  ]);

  // Read URL search params
  const readiness = searchParams.get('readiness'); // 'qualified' | 'technical-assistance'
  const score = searchParams.get('score');
  const tech = searchParams.get('tech');

  const [role, setRole] = useState<Role>('developer');
  const [submitted, setSubmitted] = useState(false);

  // Form input states
  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [techType, setTechType] = useState(
    () => formCopy.technologyOptions[0]?.label ?? CONTACT_ENQUIRY_FORM_DEFAULTS.technologyOptions[0].label
  );
  const [capacity, setCapacity] = useState('');
  const [message, setMessage] = useState('');

  // Handle URL Pre-fill parameters
  useEffect(() => {
    if (!readiness) return;

    setRole('developer');

    const intro = formCopy.prefillIntroTemplate.replace('${score}', score ?? '');
    const body =
      readiness === 'qualified'
        ? formCopy.prefillQualifiedBody
        : readiness === 'technical-assistance'
          ? formCopy.prefillTechnicalAssistanceBody
          : '';
    setMessage(intro + body);

    if (tech) {
      const mapped = formCopy.technologyParamMap.find((m) => m.paramValue === tech);
      setTechType(mapped?.label ?? formCopy.defaultTechnologyLabel);
    }
    // `formCopy` is rebuilt each render; the CMS copy behind it is stable for the
    // lifetime of the page, so the prefill stays keyed on the query params only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readiness, score, tech]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  /** Tab label by position, so a card the CMS omits falls back to the bundled one. */
  const roleTabAt = (idx: number) =>
    formCopy.roleTabs[idx] ?? CONTACT_ENQUIRY_FORM_DEFAULTS.roleTabs[idx];

  return (
    <div className="bg-[#FAFDFB] text-brand-dark min-h-screen relative overflow-hidden">
      {/* Floating Glassmorphism Hero Section (about-v2 standard) */}
      <GlassHero
        title={
          <>
            {heroCopy.headingPartOne}
            <span className="text-[#9BB7B1]">{heroCopy.headingHighlight}</span>
          </>
        }
        subtitle={heroCopy.eyebrow}
        bgImage={heroCopy.backgroundImage}
        currentPage="contact"
        description={<p>{heroCopy.description}</p>}
      >
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          variants={heroRowVariants}
          initial="hidden"
          animate="show"
        >
          {heroCopy.cards.map((card, i) => (
            <motion.div key={card.index} variants={heroCardVariants} whileHover={{ y: -4 }}>
              <StepCard
                index={card.index}
                title={card.title}
                desc={card.description}
                theme={HERO_CARD_THEMES[i] ?? 'light'}
                className="h-full"
              />
            </motion.div>
          ))}
        </motion.div>
      </GlassHero>

      <div className="container mx-auto px-6 pt-20 pb-0 relative z-10">

        {/* Contact Content Grid */}
        <div className="grid lg:grid-cols-12 gap-16 items-start">

          {/* Left Column: Info & Downloads */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="lg:col-span-5 space-y-8 text-left"
          >
            <div className="bg-white p-8 rounded-[6px] border border-gray-200/35 space-y-6">
              <h3 className="text-xl font-bold font-sans text-[#051F1A]">{contactsCopy.heading}</h3>

              <div className="flex gap-4 items-start">
                <MapPin className="text-brand-primary shrink-0 mt-1" size={20} />
                <div>
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block font-sans mb-1">{contactsCopy.officeLocationLabel}</span>
                  <p className="text-gray-600 text-sm font-sans leading-relaxed">
                    {contactsCopy.officeAddressLineOne} <br />
                    {contactsCopy.officeAddressLineTwo}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <Mail className="text-brand-primary shrink-0 mt-1" size={20} />
                <div>
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block font-sans mb-1">{contactsCopy.emailLabel}</span>
                  <a href={contactsCopy.emailHref} className="text-brand-primary text-sm font-sans hover:text-[#051F1A] transition-colors font-medium interactive focus:outline-none">
                    {contactsCopy.emailAddress}
                  </a>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <Phone className="text-brand-primary shrink-0 mt-1" size={20} />
                <div>
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block font-sans mb-1">{contactsCopy.phoneLabel}</span>
                  <a href={contactsCopy.phoneHref} className="text-brand-primary text-sm font-sans hover:text-[#051F1A] transition-colors font-medium interactive focus:outline-none">
                    {contactsCopy.phoneNumber}
                  </a>
                </div>
              </div>
            </div>

            {/* Pre-qualification checklist reminder card */}
            <div className="bg-[#FAFDFB] rounded-[6px] p-8 border border-[#81C34D]/30 space-y-4">
              <div className="flex items-center gap-2 text-[#00A788]">
                <ShieldCheck size={20} className="shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider font-mono">{reminderCopy.eyebrow}</span>
              </div>
              <h4 className="font-bold text-lg font-sans text-brand-dark">{reminderCopy.heading}</h4>
              <p className="text-xs text-gray-500 font-sans leading-relaxed">
                {reminderCopy.description}
              </p>
              <Link
                href={reminderCopy.ctaHref}
                className="w-full bg-[#051F1A] text-white py-3.5 rounded-[6px] flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-xs hover:bg-brand-primary transition-all interactive font-sans justify-center"
              >
                {reminderCopy.ctaLabel}
              </Link>
            </div>

            {/* Fun Stats & Impact Carousel */}
            <FunStatsCarousel funStats={funStats} />
          </motion.div>

          {/* Right Column: Dynamic Form & Carousel */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="bg-white p-8 md:p-10 rounded-[6px] border border-gray-200/35 text-left"
            >
              <AnimatePresence mode="wait">
                {!submitted ? (
                <motion.form
                  key="contact-form"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <h3 className="text-2xl font-bold font-sans mb-4 text-[#051F1A]">{formCopy.heading}</h3>

                  {/* Dynamic Alert Banner for pre-fills */}
                  {readiness && (
                    <div className={`p-4 rounded-[6px] border mb-6 text-xs flex items-start gap-2.5 font-sans ${
                      readiness === 'qualified'
                        ? 'bg-green-50 text-green-800 border-green-200'
                        : 'bg-blue-50 text-blue-800 border-blue-200'
                    }`}>
                      {readiness === 'qualified' ? (
                        <CheckCircle className="shrink-0 mt-0.5 text-green-600" size={16} />
                      ) : (
                        <AlertCircle className="shrink-0 mt-0.5 text-blue-600" size={16} />
                      )}
                      <div>
                        <span className="font-bold uppercase tracking-wider block mb-0.5 font-mono">
                          {formCopy.readinessAlertLabelPrefix} {score}{formCopy.readinessAlertLabelSuffix}
                        </span>
                        <p className="font-light leading-relaxed">
                          {readiness === 'qualified'
                            ? formCopy.qualifiedAlertBody
                            : formCopy.technicalAssistanceAlertBody
                          }
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Role Selector Tabs */}
                  <div className="flex border-b border-gray-100 pb-2">
                    {ROLES.map((value, i) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRole(value)}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider border-b-2 font-sans transition-colors interactive focus:outline-none ${
                          role === value ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-400 hover:text-[#051F1A]'
                        }`}
                      >
                        {roleTabAt(i).label}
                      </button>
                    ))}
                  </div>

                  {/* Form Fields */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative mt-2">
                      <input
                        required
                        type="text"
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder=" "
                        className="peer block w-full px-4 pt-6 pb-2 text-sm text-[#051F1A] bg-transparent border border-gray-200 rounded-[6px] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all font-sans placeholder-transparent"
                      />
                      <label
                        htmlFor="fullName"
                        className="absolute text-xs text-gray-400 font-bold uppercase tracking-wider duration-300 transform -translate-y-3 scale-90 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-gray-500 peer-focus:scale-90 peer-focus:-translate-y-3 peer-focus:text-brand-primary peer-focus:font-bold pointer-events-none"
                      >
                        {formCopy.fullNameLabel}
                      </label>
                    </div>

                    <div className="relative mt-2">
                      <input
                        required
                        type="text"
                        id="organization"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder=" "
                        className="peer block w-full px-4 pt-6 pb-2 text-sm text-[#051F1A] bg-transparent border border-gray-200 rounded-[6px] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all font-sans placeholder-transparent"
                      />
                      <label
                        htmlFor="organization"
                        className="absolute text-xs text-gray-400 font-bold uppercase tracking-wider duration-300 transform -translate-y-3 scale-90 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-gray-500 peer-focus:scale-90 peer-focus:-translate-y-3 peer-focus:text-brand-primary peer-focus:font-bold pointer-events-none"
                      >
                        {formCopy.organizationLabel}
                      </label>
                    </div>
                  </div>

                  <div className="relative mt-2">
                    <input
                      required
                      type="email"
                      id="emailAddress"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      placeholder=" "
                      className="peer block w-full px-4 pt-6 pb-2 text-sm text-[#051F1A] bg-transparent border border-gray-200 rounded-[6px] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all font-sans placeholder-transparent"
                    />
                    <label
                      htmlFor="emailAddress"
                      className="absolute text-xs text-gray-400 font-bold uppercase tracking-wider duration-300 transform -translate-y-3 scale-90 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-gray-500 peer-focus:scale-90 peer-focus:-translate-y-3 peer-focus:text-brand-primary peer-focus:font-bold pointer-events-none"
                    >
                      {formCopy.emailAddressLabel}
                    </label>
                  </div>

                  {/* Dynamic Developer Fields */}
                  {role === 'developer' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="grid md:grid-cols-2 gap-6"
                    >
                      <div className="relative mt-2">
                        <select
                          id="techType"
                          value={techType}
                          onChange={(e) => setTechType(e.target.value)}
                          className="peer block w-full px-4 pt-6 pb-2 text-sm text-[#051F1A] bg-transparent border border-gray-200 rounded-[6px] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all font-sans bg-white"
                        >
                          {formCopy.technologyOptions.map((option) => (
                            <option key={option.label}>{option.label}</option>
                          ))}
                        </select>
                        <label
                          htmlFor="techType"
                          className="absolute text-xs text-brand-primary font-bold uppercase tracking-wider top-1.5 left-4 pointer-events-none"
                        >
                          {formCopy.technologyTypeLabel}
                        </label>
                      </div>

                      <div className="relative mt-2">
                        <input
                          required
                          type="text"
                          id="capacity"
                          value={capacity}
                          onChange={(e) => setCapacity(e.target.value)}
                          placeholder=" "
                          className="peer block w-full px-4 pt-6 pb-2 text-sm text-[#051F1A] bg-transparent border border-gray-200 rounded-[6px] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all font-sans placeholder-transparent"
                        />
                        <label
                          htmlFor="capacity"
                          className="absolute text-xs text-gray-400 font-bold uppercase tracking-wider duration-300 transform -translate-y-3 scale-90 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-gray-500 peer-focus:scale-90 peer-focus:-translate-y-3 peer-focus:text-brand-primary peer-focus:font-bold pointer-events-none"
                        >
                          {formCopy.capacityLabel}
                        </label>
                      </div>
                    </motion.div>
                  )}

                  {/* Dynamic Investor Fields */}
                  {role === 'investor' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="grid md:grid-cols-2 gap-6"
                    >
                      <div className="relative mt-2">
                        <select
                          id="institutionType"
                          className="peer block w-full px-4 pt-6 pb-2 text-sm text-[#051F1A] bg-transparent border border-gray-200 rounded-[6px] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all font-sans bg-white"
                        >
                          {formCopy.institutionOptions.map((option) => (
                            <option key={option.label}>{option.label}</option>
                          ))}
                        </select>
                        <label
                          htmlFor="institutionType"
                          className="absolute text-xs text-brand-primary font-bold uppercase tracking-wider top-1.5 left-4 pointer-events-none"
                        >
                          {formCopy.institutionTypeLabel}
                        </label>
                      </div>

                      <div className="relative mt-2">
                        <input
                          required
                          type="text"
                          id="investmentTranche"
                          placeholder=" "
                          className="peer block w-full px-4 pt-6 pb-2 text-sm text-[#051F1A] bg-transparent border border-gray-200 rounded-[6px] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all font-sans placeholder-transparent"
                        />
                        <label
                          htmlFor="investmentTranche"
                          className="absolute text-xs text-gray-400 font-bold uppercase tracking-wider duration-300 transform -translate-y-3 scale-90 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-gray-500 peer-focus:scale-90 peer-focus:-translate-y-3 peer-focus:text-brand-primary peer-focus:font-bold pointer-events-none"
                        >
                          {formCopy.investmentTrancheLabel}
                        </label>
                      </div>
                    </motion.div>
                  )}

                  <div className="relative mt-2">
                    <textarea
                      required
                      id="message"
                      rows={6}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder=" "
                      className="peer block w-full px-4 pt-6 pb-2 text-sm text-[#051F1A] bg-transparent border border-gray-200 rounded-[6px] focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all font-sans placeholder-transparent"
                    />
                    <label
                      htmlFor="message"
                      className="absolute text-xs text-gray-400 font-bold uppercase tracking-wider duration-300 transform -translate-y-3 scale-90 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-gray-500 peer-focus:scale-90 peer-focus:-translate-y-3 peer-focus:text-brand-primary peer-focus:font-bold pointer-events-none"
                    >
                      {formCopy.messageLabel}
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-brand-primary hover:bg-[#051F1A] text-white py-4 rounded-full flex items-center justify-center gap-3 font-bold uppercase tracking-wider text-xs shadow-lg shadow-brand-primary/20 transition-all interactive font-sans focus:outline-none"
                  >
                    <Send size={14} />
                    {formCopy.submitLabel}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="submission-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12 space-y-6"
                >
                  <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="text-2xl font-bold font-sans text-brand-primary">{successCopy.heading}</h3>
                  <p className="text-gray-500 text-sm max-w-md mx-auto font-sans leading-relaxed font-light">
                    {successCopy.description}
                  </p>
                  <div className="pt-6 flex justify-center gap-4">
                    <button
                      onClick={() => router.push(successCopy.primaryCtaHref)}
                      className="px-8 py-3 bg-brand-primary text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-brand-dark transition-all interactive font-sans focus:outline-none"
                    >
                      {successCopy.primaryCtaLabel}
                    </button>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-3 bg-gray-50 text-gray-500 border border-gray-200 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-gray-100 transition-all interactive font-sans focus:outline-none"
                    >
                      {successCopy.secondaryCtaLabel}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </div>

      {/* ── NEXT STEPS CTA BAR (3 Columns - NO SELF LINKING) ────── */}
      <section className="mt-24 pt-12 pb-6 bg-[#051F1A] text-white relative z-10 border-t border-white/5">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="container mx-auto px-6 max-w-[1280px]"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#81C34D]" />
            <span className="text-[#81C34D] text-xs font-semibold tracking-[0.2em] uppercase font-mono">{nextStepsCopy.eyebrow}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            {nextStepsCopy.headingPartOne}<span className="text-[#9BB7B1] italic font-serif">{nextStepsCopy.headingItalic}</span>
          </h2>
        </motion.div>
      </section>

      <section className="bg-[#3da58a] relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
          className="max-w-[1280px] mx-auto px-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/20">
            {nextStepsCopy.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center justify-between px-8 py-5 hover:bg-white/[0.07] transition-all duration-300 text-left cursor-pointer focus:outline-none"
              >
                <div className="flex items-center gap-6">
                  <span className="text-white/70 text-[10px] font-bold uppercase tracking-[0.2em] font-mono shrink-0">
                    {link.eyebrow}
                  </span>
                  <div className="h-8 w-px bg-white/25" />
                  <div>
                    <h4 className="text-white text-base font-bold font-sans group-hover:text-white/80 transition-colors duration-300">
                      {link.title}
                    </h4>
                    <p className="text-white/65 text-xs font-light mt-0.5 font-sans">
                      {link.description}
                    </p>
                  </div>
                </div>
                <ArrowRight size={16} className="text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all duration-300 shrink-0 ml-4" />
              </Link>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── 9. DOWNLOAD CTA (Brochure visual banner) ────── */}
      <div className="relative z-10 w-full">
        <div className="min-h-[460px] relative flex items-center justify-center group overflow-hidden">
          {/* Background image */}
          <img
            src={ctaCopy.backgroundImage}
            alt={ctaCopy.backgroundImage_alt_text}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-brand-dark/70 group-hover:bg-brand-dark/65 transition-colors z-10" />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-20 text-center max-w-2xl px-6 flex flex-col items-center"
          >
            <span className="text-brand-accent text-xs font-bold uppercase tracking-[0.25em] mb-4 block font-mono">{ctaCopy.eyebrow}</span>
            <h3 className="text-white text-3xl md:text-4xl font-bold font-sans mb-4 leading-tight">{ctaCopy.heading}</h3>
            <p className="text-white/75 font-sans text-sm md:text-base leading-relaxed mb-8 max-w-xl">
              {ctaCopy.description}
            </p>
            <motion.a
              href={ctaCopy.fileHref}
              download={ctaCopy.downloadFileName}
              whileHover={{ scale: 1.05, backgroundColor: '#ffffff', color: '#051F1A' }}
              whileTap={{ scale: 0.97 }}
              className="bg-brand-accent text-brand-dark px-8 py-4 rounded-[6px] flex items-center gap-3 font-bold uppercase tracking-wider text-xs shadow-lg shadow-brand-accent/25 transition-all duration-300 font-sans cursor-pointer focus:outline-none"
            >
              <Download size={16} />
              {ctaCopy.ctaLabel}
            </motion.a>
          </motion.div>
        </div>
      </div>
    </div>
);
}
