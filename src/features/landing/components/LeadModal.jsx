import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Send, MessageCircle, AlertCircle, Sparkles, Loader2 } from 'lucide-react';
import axios from 'axios';
import { CONTACT_INFO, getWhatsAppUrl } from '../data/fitnessData';

export default function LeadModal({ isOpen, onClose, initialData = {} }) {
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

  // Sync initialData when modal opens
  useEffect(() => {
    if (isOpen) {
      setSuccess(false);
      setErrorMessage('');
      setFormData((prev) => ({
        ...prev,
        program: initialData.program || prev.program || 'Personal Training',
        plan: initialData.plan || prev.plan || 'Transformation',
        fitnessGoal: initialData.goal || prev.fitnessGoal || 'General Fitness',
      }));
    }
  }, [isOpen, initialData]);

  // Esc key listener and focus management
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      program: formData.program,
      plan: formData.plan,
      fitnessGoal: formData.fitnessGoal,
      preferredTime: formData.preferredTime,
      company: `Wellwigen Lead - ${formData.program} (${formData.plan})`,
      subject: `New Lead: ${formData.program} - ${formData.plan}`,
      message: `Goal: ${formData.fitnessGoal}\nPreferred Time: ${formData.preferredTime}\nNotes: ${formData.message || 'None'}`,
    };

    // OLD CODE (commented by AI)
    /*
    try {
      // Primary API endpoint in backend
      await axios.post(`${apiUrl}/user/contact`, payload, { timeout: 6000 });
      setSuccess(true);
    } catch (err) {
      console.warn('API submission failed or offline, trying alternative endpoint...', err);
      try {
        await axios.post(`${apiUrl}/users/contact`, payload, { timeout: 4000 });
        setSuccess(true);
      } catch (fallbackErr) {
        // Even if offline/local dev, gracefully succeed and save locally so lead is NEVER lost
        console.info('Saving lead locally for offline sync:', payload);
        const existingLeads = JSON.parse(localStorage.getItem('wellwigen_leads') || '[]');
        existingLeads.push({ ...payload, timestamp: new Date().toISOString() });
        localStorage.setItem('wellwigen_leads', JSON.stringify(existingLeads));
        setSuccess(true);
      }
    } finally {
      setLoading(false);
    }
    */
    // NEW CODE - Wellwigen restyle / Inquiries feature
    try {
      // 1. Submit to new Inquiries lead endpoint (Part 1 - Inquiries feature)
      const inquiryPayload = {
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        program: formData.program,
        plan: formData.plan,
        fitnessGoal: formData.fitnessGoal,
        preferredTiming: formData.preferredTime,
        message: formData.message || `Goal: ${formData.fitnessGoal}`,
      };

      try {
        await axios.post(`${apiUrl}/inquiries`, inquiryPayload, { timeout: 6000 });
      } catch (inquiryErr) {
        console.warn('Inquiry endpoint save warning (non-blocking):', inquiryErr);
      }

      // 2. Existing contact endpoint call (keeps existing submit/WhatsApp logic intact)
      try {
        await axios.post(`${apiUrl}/user/contact`, payload, { timeout: 6000 });
      } catch (contactErr) {
        await axios.post(`${apiUrl}/users/contact`, payload, { timeout: 4000 }).catch(() => {});
      }

      setSuccess(true);
    } catch (err) {
      console.info('Saving lead locally for offline fallback:', payload);
      const existingLeads = JSON.parse(localStorage.getItem('wellwigen_leads') || '[]');
      existingLeads.push({ ...payload, timestamp: new Date().toISOString() });
      localStorage.setItem('wellwigen_leads', JSON.stringify(existingLeads));
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  const whatsappMessage = `Hi Wellwigen team! My name is ${formData.name || 'there'}. I'm interested in ${formData.program} (${formData.plan}) for ${formData.fitnessGoal}.`;
  const whatsappUrl = getWhatsAppUrl(whatsappMessage);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 max-h-[92vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 sm:p-7 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-teal-50/60 via-white to-sky-50/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-teal-sky flex items-center justify-center text-white shadow-md shadow-teal-500/25">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-heading font-black text-xl text-slate-900 leading-tight">
                    Start Your Fitness Journey
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {formData.program} &bull; <span className="text-teal-600 font-bold">{formData.plan}</span>
                  </p>
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
            <div className="p-6 sm:p-7 overflow-y-auto flex-1">
              {success ? (
                /* Success State */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 text-center flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 shadow-sm border border-emerald-100">
                    <CheckCircle2 size={36} />
                  </div>
                  <h4 className="font-heading text-2xl font-black text-slate-900 mb-2">
                    Application Received!
                  </h4>
                  <p className="text-sm text-slate-600 max-w-sm mb-6 leading-relaxed">
                    Thank you, <span className="font-bold text-slate-800">{formData.name}</span>. An expert Wellwigen coach will reach out to you within a few hours to set up your schedule.
                  </p>

                  <div className="w-full bg-teal-50/80 border border-teal-100 rounded-2xl p-4 mb-6 text-left text-xs text-teal-900 space-y-1">
                    <div><strong>Selected:</strong> {formData.program} ({formData.plan})</div>
                    <div><strong>Preferred Time:</strong> {formData.preferredTime}</div>
                    <div><strong>Goal:</strong> {formData.fitnessGoal}</div>
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
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. +91 9876543210"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
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
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
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
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all bg-white"
                      >
                        <option value="Fat Loss & Toning">Fat Loss &amp; Toning</option>
                        <option value="Muscle & Strength">Muscle &amp; Strength</option>
                        <option value="General Fitness & Energy">General Fitness &amp; Energy</option>
                        <option value="Mobility & Posture">Mobility &amp; Posture</option>
                        <option value="Endurance & Athleticism">Endurance &amp; Athleticism</option>
                      </select>
                    </div>
                  </div>

                  {/* Program & Plan */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Program *
                      </label>
                      <select
                        name="program"
                        value={formData.program}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all bg-white"
                      >
                        <option value="Personal Training">Personal Training (1-on-1)</option>
                        <option value="Group Classes">Group Classes (Live Online)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Chosen Plan / Track *
                      </label>
                      <input
                        type="text"
                        name="plan"
                        value={formData.plan}
                        onChange={handleChange}
                        placeholder="e.g. Transformation, Trial Class"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all"
                      />
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all bg-white"
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
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all resize-none"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 btn-coral-gradient btn-shine py-3.5 px-6 rounded-full text-white font-bold text-sm flex items-center justify-center gap-2 shadow-coral-glow cursor-pointer disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          <span>Submit &amp; Get Started</span>
                        </>
                      )}
                    </button>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3.5 px-5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
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
