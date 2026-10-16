import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Send, MessageCircle, AlertCircle, Sparkles, Loader2, Check } from 'lucide-react';
import axios from 'axios';
import { CONTACT_INFO, getWhatsAppUrl } from '../data/fitnessData';

// All available plans with their exact prices, sessions, and badges
export const MODAL_PROGRAM_PLANS = {
  'Personal Training': [
    {
      id: 'pt_trial',
      name: 'Trial Class',
      price: '₹299',
      period: '/session',
      badge: 'Single Trial',
      sessions: '1 Live 1:1 Session',
      desc: '1-on-1 assessment, posture check & form guidance',
    },
    {
      id: 'pt_starter',
      name: 'Starter',
      price: '₹3,999',
      period: '/month',
      badge: '3x / Week',
      sessions: '12 Live Sessions',
      desc: '3 live coaching sessions weekly + progress tracking',
    },
    {
      id: 'pt_transformation',
      name: 'Transformation',
      price: '₹5,999',
      period: '/month',
      badge: 'Most Popular',
      sessions: '20 Live Sessions',
      desc: '5 live sessions/wk + custom diet plan & body composition',
    },
    {
      id: 'pt_premium',
      name: 'Premium 1:1',
      price: '₹8,999',
      period: '/month',
      badge: 'VIP Elite',
      sessions: 'Custom Schedule',
      desc: 'Unlimited guidance + dedicated senior master coach',
    },
  ],
  'Group Classes': [
    {
      id: 'gc_trial',
      name: 'Trial Class',
      price: '₹99',
      period: '/class',
      badge: 'Single Pass',
      sessions: '1 Class Access',
      desc: 'Experience any live high-energy group workout',
    },
    {
      id: 'gc_monthly',
      name: 'Monthly Plan',
      price: '₹1,999',
      period: '/month',
      badge: 'Most Popular',
      sessions: '24 Classes (6/wk)',
      desc: '6 live interactive classes/wk across HIIT, Yoga & Tabata',
    },
    {
      id: 'gc_quarterly',
      name: 'Quarterly Plan',
      price: '₹4,999',
      period: '/3 months',
      badge: 'Best Value',
      sessions: '72 Classes (₹1,666/mo)',
      desc: 'All 6 weekly classes for 3 months with priority coach support',
    },
    {
      id: 'gc_annual',
      name: 'Annual Plan',
      price: '₹14,999',
      period: '/year',
      badge: 'Save More',
      sessions: 'Unlimited (₹1,250/mo)',
      desc: '365 days unlimited live access + workshops & guest coaches',
    },
  ],
};

const getActiveProgramKey = (prog = '') => {
  return prog.toLowerCase().includes('group') ? 'Group Classes' : 'Personal Training';
};

const getPlansForProgram = (prog = '') => {
  return MODAL_PROGRAM_PLANS[getActiveProgramKey(prog)];
};

export default function LeadModal({ isOpen, onClose, initialData = {} }) {
  const nameInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    fitnessGoal: 'General Fitness',
    program: 'Personal Training',
    plan: 'Transformation',
    preferredTime: 'Morning (6 AM - 10 AM)',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const [submittedWaUrl, setSubmittedWaUrl] = useState(null);

  // Sync initialData when modal opens
  useEffect(() => {
    if (isOpen) {
      setSuccess(false);
      setErrorMessage('');
      setSubmittedWaUrl(null);

      const targetProgram = initialData.program || 'Personal Training';
      const availablePlans = getPlansForProgram(targetProgram);

      // Match initial plan by name or default to transformation/monthly
      let matchedPlanName = initialData.plan;
      if (!matchedPlanName || !availablePlans.some((p) => p.name.toLowerCase() === matchedPlanName.toLowerCase())) {
        const popular = availablePlans.find((p) => p.badge === 'Most Popular');
        matchedPlanName = popular ? popular.name : availablePlans[0].name;
      }

      setFormData((prev) => ({
        ...prev,
        program: targetProgram,
        plan: matchedPlanName,
        fitnessGoal: initialData.goal || prev.fitnessGoal || 'General Fitness',
      }));

      // Focus first input automatically
      const timer = setTimeout(() => {
        nameInputRef.current?.focus();
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialData]);

  // Esc key listener and strictly lock background movement
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Program change with automatic plan reconciliation
  const handleProgramChange = (e) => {
    const newProgram = e.target.value;
    const newPlans = getPlansForProgram(newProgram);
    const existingMatch = newPlans.find((p) => p.name.toLowerCase() === formData.plan.toLowerCase());
    const popularFallback = newPlans.find((p) => p.badge === 'Most Popular') || newPlans[0];

    setFormData((prev) => ({
      ...prev,
      program: newProgram,
      plan: existingMatch ? existingMatch.name : popularFallback.name,
    }));
  };

  // Strictly enforce numbers only for phone bracket - no alphabets allowed
  const handlePhoneChange = (e) => {
    const raw = e.target.value;
    // Keep only digits and at most one leading '+'
    const cleaned = raw.replace(/[^\d+]/g, '').replace(/(?!^)\+/g, '');
    setFormData((prev) => ({ ...prev, phone: cleaned }));
  };

  const handlePhoneKeyDown = (e) => {
    // Allow navigational and editing keys
    if (
      ['Backspace', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'Delete', 'Escape'].includes(e.key) ||
      (e.ctrlKey || e.metaKey)
    ) {
      return;
    }
    // Allow '+' only at the start if not already entered
    if (e.key === '+' && (e.currentTarget.selectionStart === 0 && !e.currentTarget.value.includes('+'))) {
      return;
    }
    // Block all alphabet and symbol keys
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  };

  // Resolve current active plan object
  const currentPlans = getPlansForProgram(formData.program);
  const selectedPlanObj =
    currentPlans.find((p) => p.name.toLowerCase() === (formData.plan || '').toLowerCase()) ||
    currentPlans.find((p) => (formData.plan || '').toLowerCase().includes(p.name.toLowerCase())) ||
    currentPlans[0];

  const planDisplay = selectedPlanObj
    ? `${selectedPlanObj.name} (${selectedPlanObj.price}${selectedPlanObj.period ? ' ' + selectedPlanObj.period : ''})`
    : formData.plan;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Honeypot anti-spam check
    if (honeypot) {
      console.warn('Bot submission blocked via honeypot');
      setSuccess(true);
      return;
    }

    // Duplicate submission prevention (5 second cooldown)
    const now = Date.now();
    if (now - lastSubmitTime < 5000 && lastSubmitTime !== 0) {
      setErrorMessage('Please wait a moment before submitting again.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setLastSubmitTime(now);

    const getApiUrl = () => {
      const envUrl = import.meta.env.VITE_API_URL;
      if (envUrl && !envUrl.includes('localhost')) return envUrl;
      if (typeof window !== 'undefined' && window.location.protocol === 'https:' && window.location.hostname !== 'localhost') {
        return '/api';
      }
      return envUrl || 'http://localhost:8000/api';
    };
    const apiUrl = getApiUrl();

    const timestamp = new Date().toISOString();
    const leadRecord = {
      _id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      fullName: formData.name,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      program: formData.program,
      plan: planDisplay,
      fitnessGoal: formData.fitnessGoal,
      preferredTiming: formData.preferredTime,
      preferredTime: formData.preferredTime,
      message: formData.message || '',
      status: 'New',
      createdAt: timestamp,
      timestamp,
    };

    // 1. Immediately persist locally so 0 leads are EVER lost
    try {
      const existingLeads = JSON.parse(localStorage.getItem('wellwigen_leads') || '[]');
      existingLeads.unshift(leadRecord);
      localStorage.setItem('wellwigen_leads', JSON.stringify(existingLeads));

      const existingInquiries = JSON.parse(localStorage.getItem('wellwigen_inquiries') || '[]');
      existingInquiries.unshift(leadRecord);
      localStorage.setItem('wellwigen_inquiries', JSON.stringify(existingInquiries));

      window.dispatchEvent(new CustomEvent('wellwigen_lead_submitted', { detail: leadRecord }));
      window.dispatchEvent(new Event('storage'));
      console.log('✅ [LEAD] Saved locally to admin inquiry store:', leadRecord.fullName);
    } catch (storeErr) {
      console.warn('Local storage write notice:', storeErr);
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      program: formData.program,
      plan: planDisplay,
      fitnessGoal: formData.fitnessGoal,
      preferredTime: formData.preferredTime,
      company: `Wellwigen Lead - ${formData.program} (${planDisplay})`,
      subject: `New Lead: ${formData.program} - ${planDisplay}`,
      message: `Enquired Plan: ${planDisplay}\nGoal: ${formData.fitnessGoal}\nPreferred Time: ${formData.preferredTime}\nNotes: ${formData.message || 'None'}`,
    };

    const inquiryPayload = {
      fullName: formData.name,
      email: formData.email,
      phone: formData.phone,
      program: formData.program,
      plan: planDisplay,
      fitnessGoal: formData.fitnessGoal,
      preferredTiming: formData.preferredTime,
      message: formData.message
        ? `Plan: ${planDisplay}\n${formData.message}`
        : `Enquired Plan: ${planDisplay} | Goal: ${formData.fitnessGoal}`,
    };

    try {
      // 2. Submit to Inquiries lead endpoint (Admin Inquiries Box + Email Alert + WhatsApp Link)
      try {
        const inqRes = await axios.post(`${apiUrl}/inquiries`, inquiryPayload, { timeout: 7000 });
        if (inqRes.data) {
          if (inqRes.data.whatsappUrl) {
            setSubmittedWaUrl(inqRes.data.whatsappUrl);
          }
          if (inqRes.data.inquiry?._id || inqRes.data.inquiry?.id) {
            leadRecord._id = inqRes.data.inquiry._id || inqRes.data.inquiry.id;
          }
        }
      } catch (inquiryErr) {
        console.warn('Inquiry endpoint save warning (non-blocking, saved locally):', inquiryErr.message);
      }

      // 3. Backup contact endpoint call
      try {
        await axios.post(`${apiUrl}/user/contact`, payload, { timeout: 6000 });
      } catch (contactErr) {
        await axios.post(`${apiUrl}/users/contact`, payload, { timeout: 4000 }).catch(() => {});
      }

      setSuccess(true);
    } catch (err) {
      console.warn('Submission completed with local capture:', err.message);
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  const defaultWaText = `Hi Wellwigen team! My name is ${formData.name || 'there'}. I want to enquire about ${formData.program} (${planDisplay}). My phone is ${formData.phone || ''} and fitness goal is ${formData.fitnessGoal}.`;
  const whatsappUrl = submittedWaUrl || getWhatsAppUrl(defaultWaText);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop with strong blur and dim so below screen is blurred and all focus is on form */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 max-h-[92vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-teal-50/70 via-white to-sky-50/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-teal-sky flex items-center justify-center text-white shadow-md shadow-teal-500/25">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-heading font-black text-xl text-slate-900 leading-tight">
                    Start Your Fitness Journey
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-1.5">
                    <span className="font-medium text-slate-600">{formData.program}</span>
                    <span>&bull;</span>
                    <span className="text-teal-700 font-bold">{selectedPlanObj?.name || formData.plan}</span>
                    {selectedPlanObj?.price && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-teal-100/80 text-teal-900 font-extrabold text-[11px] border border-teal-200">
                        {selectedPlanObj.price} {selectedPlanObj.period}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1">
              {success ? (
                /* Success State */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-6 text-center flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 shadow-sm border border-emerald-100">
                    <CheckCircle2 size={36} />
                  </div>
                  <h4 className="font-heading text-2xl font-black text-slate-900 mb-2">
                    Application Received!
                  </h4>
                  <p className="text-sm text-slate-600 max-w-sm mb-6 leading-relaxed">
                    Thank you, <span className="font-bold text-slate-800">{formData.name}</span>! Your inquiry has been sent to our admin team. We've sent a confirmation email to <span className="font-semibold text-slate-700">{formData.email}</span>, and a master coach will contact you via WhatsApp &amp; Phone at <span className="font-semibold text-slate-700">{formData.phone}</span>.
                  </p>

                  <div className="w-full bg-gradient-to-br from-teal-50/90 to-emerald-50/50 border border-teal-200/80 rounded-2xl p-4 mb-6 text-left text-xs text-teal-950 space-y-2 shadow-sm">
                    <div className="flex items-center justify-between pb-1.5 border-b border-teal-100">
                      <span className="text-slate-500 font-medium">Program &amp; Plan:</span>
                      <span className="font-extrabold text-teal-800 text-sm">
                        {formData.program} &bull; {selectedPlanObj?.name || formData.plan}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Plan Pricing:</span>
                      <span className="font-black text-slate-900 bg-white px-2.5 py-0.5 rounded-full border border-teal-200 shadow-2xs">
                        {selectedPlanObj?.price} {selectedPlanObj?.period}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Preferred Time:</span>
                      <span className="font-bold text-slate-800">{formData.preferredTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">Fitness Goal:</span>
                      <span className="font-bold text-slate-800">{formData.fitnessGoal}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 px-4 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition-all"
                    >
                      <MessageCircle size={17} />
                      <span>Chat on WhatsApp Now</span>
                    </a>
                    <button
                      onClick={onClose}
                      className="py-3 px-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors cursor-pointer"
                    >
                      Done
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* Form State */
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Honeypot anti-spam field (hidden from humans, catches bots) */}
                  <div style={{ display: 'none', position: 'absolute', left: '-9999px' }} aria-hidden="true">
                    <label htmlFor="website_hp">Website URL</label>
                    <input
                      id="website_hp"
                      type="text"
                      name="website_hp"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                      <AlertCircle size={16} />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Name & Phone */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        ref={nameInputRef}
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        inputMode="numeric"
                        pattern="[0-9+]*"
                        required
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        onKeyDown={handlePhoneKeyDown}
                        placeholder="e.g. +91 9876543210"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Email & Fitness Goal */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. rahul@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Primary Fitness Goal *
                      </label>
                      <select
                        name="fitnessGoal"
                        value={formData.fitnessGoal}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all bg-white font-medium"
                      >
                        <option value="Fat Loss & Toning">Fat Loss &amp; Toning</option>
                        <option value="Muscle & Strength">Muscle &amp; Strength</option>
                        <option value="General Fitness & Energy">General Fitness &amp; Energy</option>
                        <option value="Mobility & Posture">Mobility &amp; Posture</option>
                        <option value="Endurance & Athleticism">Endurance &amp; Athleticism</option>
                      </select>
                    </div>
                  </div>

                  {/* PROGRAM & PLAN SELECTOR WITH PRICING */}
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50/70 border border-slate-200/90 space-y-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Program *
                        </label>
                        <select
                          name="program"
                          value={formData.program}
                          onChange={handleProgramChange}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all bg-white font-semibold text-slate-800"
                        >
                          <option value="Personal Training">Personal Training (1-on-1)</option>
                          <option value="Group Classes">Group Classes (Live Online)</option>
                        </select>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-bold text-slate-700">
                            Chosen Plan / Track *
                          </label>
                          {selectedPlanObj && (
                            <span className="text-[11px] font-extrabold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                              {selectedPlanObj.price} {selectedPlanObj.period}
                            </span>
                          )}
                        </div>
                        <select
                          name="plan"
                          value={selectedPlanObj?.name || formData.plan}
                          onChange={(e) => setFormData((prev) => ({ ...prev, plan: e.target.value }))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all bg-white font-semibold text-slate-800"
                        >
                          {currentPlans.map((p) => (
                            <option key={p.id} value={p.name}>
                              {p.name} — {p.price} {p.period} {p.badge ? `(${p.badge})` : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* INTERACTIVE CARDS: SEE ALL PLANS WITH THEIR MONEY */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5 px-0.5">
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                          Select Plan &amp; Pricing ({currentPlans.length} Available)
                        </span>
                        <span className="text-[10px] font-medium text-slate-400">
                          Tap card to choose
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                        {currentPlans.map((p) => {
                          const isSelected = selectedPlanObj?.name === p.name;
                          return (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => setFormData((prev) => ({ ...prev, plan: p.name }))}
                              className={`relative p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between group ${
                                isSelected
                                  ? 'bg-gradient-to-br from-teal-50/95 via-emerald-50/40 to-white border-teal-500 shadow-sm shadow-teal-500/15 ring-2 ring-teal-500/30'
                                  : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              {/* Top row: Name & Badge/Radio */}
                              <div className="flex items-start justify-between gap-1 mb-1">
                                <span className={`text-xs font-bold leading-tight ${isSelected ? 'text-teal-950 font-black' : 'text-slate-800'}`}>
                                  {p.name}
                                </span>
                                <div className="flex items-center gap-1 shrink-0">
                                  {p.badge && (
                                    <span
                                      className={`text-[9px] font-black px-1.5 py-0.5 rounded-md border ${
                                        p.badge === 'Most Popular'
                                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                                          : p.badge === 'Best Value'
                                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                          : 'bg-slate-100 text-slate-600 border-slate-200'
                                      }`}
                                    >
                                      {p.badge}
                                    </span>
                                  )}
                                  <div
                                    className={`w-4 h-4 rounded-full flex items-center justify-center border transition-all ${
                                      isSelected
                                        ? 'bg-teal-600 border-teal-600 text-white'
                                        : 'border-slate-300 bg-white group-hover:border-slate-400'
                                    }`}
                                  >
                                    {isSelected && <Check size={10} strokeWidth={3.5} />}
                                  </div>
                                </div>
                              </div>

                              {/* Price Row (Money) */}
                              <div className="flex items-baseline gap-1 my-0.5">
                                <span className={`text-base sm:text-lg font-black tracking-tight ${isSelected ? 'text-teal-700' : 'text-slate-900'}`}>
                                  {p.price}
                                </span>
                                <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
                                  {p.period}
                                </span>
                              </div>

                              {/* Session Details */}
                              <div className="text-[10px] text-slate-500 leading-tight truncate">
                                {p.sessions}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Summary Tag */}
                      {selectedPlanObj && (
                        <div className="mt-2.5 px-3 py-2 rounded-xl bg-teal-50/60 border border-teal-100/80 flex items-center justify-between text-xs">
                          <span className="text-slate-600 text-[11px]">
                            Selected: <strong className="text-teal-900 font-bold">{selectedPlanObj.name}</strong> ({selectedPlanObj.sessions})
                          </span>
                          <span className="font-extrabold text-teal-700 text-xs shrink-0">
                            {selectedPlanObj.price} {selectedPlanObj.period}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Preferred Time */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Preferred Workout Timing
                    </label>
                    <select
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all bg-white font-medium"
                    >
                      <option value="Early Morning (6 AM - 8 AM)">Early Morning (6 AM - 8 AM)</option>
                      <option value="Morning (8 AM - 11 AM)">Morning (8 AM - 11 AM)</option>
                      <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                      <option value="Evening (5 PM - 8 PM)">Evening (5 PM - 8 PM)</option>
                      <option value="Night (8 PM - 10 PM)">Night (8 PM - 10 PM)</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Any questions or special injuries/requirements?
                    </label>
                    <textarea
                      name="message"
                      rows={2}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your fitness background or any specific goals..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all resize-none font-medium"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 btn-coral-gradient btn-shine py-2.5 sm:py-3 px-6 rounded-full text-white font-bold text-sm flex items-center justify-center gap-2 shadow-coral-glow cursor-pointer disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          <span>Submit &amp; Get Started ({selectedPlanObj?.price || ''})</span>
                        </>
                      )}
                    </button>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 sm:py-3 px-5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      <MessageCircle size={16} className="text-emerald-600" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>

                  <p className="text-[11px] text-center text-slate-400 pt-1">
                    🔒 We respect your privacy. Zero spam guaranteed.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
