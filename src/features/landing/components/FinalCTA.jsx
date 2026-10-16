import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Sparkles, Flame } from 'lucide-react';
import { getWhatsAppUrl } from '../data/fitnessData';

export default function FinalCTA({ onOpenLeadModal, onNavigateSection }) {
  const whatsappUrl = getWhatsAppUrl("Hi Wellwigen! I want to choose a program and take my first step toward a fitter, stronger me.");

  return (
    <section data-nav-theme="light" className="relative py-24 sm:py-28 bg-gradient-to-b from-[#F8FAFC] via-white to-[#E6F7F5] text-slate-900 overflow-hidden">
      {/* Soft Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl pointer-events-none" />

      {/* Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18vw] watermark-text opacity-5 text-slate-400 whitespace-nowrap z-0">
        NO EXCUSES
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        <div
          className="reveal-item bg-white rounded-3xl p-10 sm:p-16 border-2 border-teal-500/40 shadow-xl relative overflow-hidden"
        >
          {/* Corner brackets (Rounded with colored line) */}
          <div className="corner-bracket-tl z-20" />
          <div className="corner-bracket-br z-20" />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border-2 border-teal-500/40 text-teal-800 text-xs font-display font-extrabold uppercase tracking-widest mb-6 shadow-xs">
              <Flame size={14} className="text-[#FF6B35]" />
              <span>YOUR TRANSFORMATION AWAITS</span>
            </span>

            <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight max-w-3xl mx-auto">
              Ready to Get Started?
            </h2>

            <p className="text-base sm:text-lg text-slate-600 mt-4 max-w-2xl mx-auto leading-relaxed">
              Choose your program and take the first step toward a fitter, stronger you.
            </p>

            {/* Three CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <button
                onClick={() => onOpenLeadModal({ program: 'Personal Training', plan: 'Transformation' })}
                className="w-full sm:w-auto btn-power-coral btn-shine px-8 py-2.5 sm:py-3 text-sm sm:text-base font-bold flex items-center justify-center gap-2 cursor-pointer shadow-coral-glow group"
              >
                <span>Start Personal Training</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigateSection('group-classes')}
                className="w-full sm:w-auto btn-primary-gradient btn-shine px-8 py-2.5 sm:py-3 text-sm sm:text-base font-bold flex items-center justify-center gap-2 cursor-pointer shadow-teal-glow group"
              >
                <span>Join Group Classes</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              {/* OLD CODE (commented by AI)
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-4 rounded-full bg-[#25D366] text-white hover:bg-[#20bd5a] text-sm sm:text-base font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all hover:scale-105"
              >
              */}
              {/* NEW CODE - smooth animation/performance: specific transform transition with touch-action */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-2.5 sm:py-3 rounded-full bg-[#25D366] text-white hover:bg-[#20bd5a] text-sm sm:text-base font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-transform duration-200 hover:scale-105 [touch-action:manipulation]"
              >
                <MessageCircle size={18} />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
