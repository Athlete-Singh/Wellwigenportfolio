import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, FileText, RefreshCw } from 'lucide-react';

export default function LegalModal({ isOpen, type, onClose }) {
  if (!isOpen) return null;

  const content = {
    privacy: {
      title: 'Privacy Policy',
      icon: <ShieldCheck className="w-6 h-6 text-teal-600" />,
      body: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            At <strong>Wellwigen</strong>, your privacy and health confidentiality are our paramount commitments. This Privacy Policy details how we protect your personal and payment information when you utilize our online fitness and group coaching platform.
          </p>
          <h4 className="font-bold text-slate-900 text-sm">1. Information We Collect</h4>
          <p>
            When you register for our personal training or live group classes, we collect your name, email, contact telephone number, and self-reported fitness goals. We do not store raw credit card numbers; all payments are processed through certified, PCI-compliant gateways.
          </p>
          <h4 className="font-bold text-slate-900 text-sm">2. Use of Information</h4>
          <p>
            Information collected is strictly utilized to curate customized workout programs, connect you with qualified certified trainers, coordinate live class schedules, and send relevant membership updates.
          </p>
          <h4 className="font-bold text-slate-900 text-sm">3. Data Security</h4>
          <p>
            We implement industry-standard encryption protocols (HTTPS/TLS) across all communications. Your personal data is never sold or rented to third-party advertisers.
          </p>
        </div>
      ),
    },
    terms: {
      title: 'Terms & Conditions',
      icon: <FileText className="w-6 h-6 text-sky-600" />,
      body: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            Welcome to <strong>Wellwigen</strong>. By accessing or participating in any online coaching sessions, live classes, or subscription services, you agree to these terms.
          </p>
          <h4 className="font-bold text-slate-900 text-sm">1. Fitness Readiness &amp; Medical Disclaimer</h4>
          <p>
            Physical exercise involves inherent risks. You acknowledge that you are voluntarily participating in physical activity and affirm that you are medically fit to engage in vigorous exercise. Always consult a physician prior to commencing any new fitness program if you have pre-existing cardiovascular, musculoskeletal, or metabolic conditions.
          </p>
          <h4 className="font-bold text-slate-900 text-sm">2. Live Class Conduct</h4>
          <p>
            All participants are expected to maintain respect, sportsmanship, and appropriate conduct during live interactive video classes. Wellwigen reserves the right to suspend accounts engaging in inappropriate conduct.
          </p>
          <h4 className="font-bold text-slate-900 text-sm">3. Subscriptions &amp; Billing</h4>
          <p>
            Memberships grant access to specified workout sessions during the active billing period. Session cancellations or rescheduling for 1-on-1 personal training require at least 12 hours advance notification to your coach.
          </p>
        </div>
      ),
    },
    refund: {
      title: 'Refund Policy',
      icon: <RefreshCw className="w-6 h-6 text-amber-600" />,
      body: (
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>
            We want you to be 100% delighted with your coaching experience at <strong>Wellwigen</strong>.
          </p>
          <h4 className="font-bold text-slate-900 text-sm">1. Trial Class Guarantee</h4>
          <p>
            If you attend your initial Trial Class (₹99) and feel our instruction, video clarity, or coaching caliber did not meet expectations, notify us within 24 hours of completion for a full, no-questions-asked refund.
          </p>
          <h4 className="font-bold text-slate-900 text-sm">2. Monthly &amp; Multi-Month Subscriptions</h4>
          <p>
            For monthly or multi-month packages, refund requests submitted within 7 days of package activation will be processed pro-rata, deducting only sessions already attended.
          </p>
          <h4 className="font-bold text-slate-900 text-sm">3. How to Request</h4>
          <p>
            To submit a refund request, simply email <code>wellwigen@gmail.com</code> or reach our support team on WhatsApp with your booking details.
          </p>
        </div>
      ),
    },
  };

  const selected = content[type] || content.privacy;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 max-h-[85vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                {selected.icon}
              </div>
              <h3 className="font-heading font-black text-xl text-slate-900">
                {selected.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-7 overflow-y-auto flex-1">
            {selected.body}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
