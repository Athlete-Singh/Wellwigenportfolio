import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Sparkles, Flame } from 'lucide-react';
import { getWhatsAppUrl } from '../data/fitnessData';

export default function FinalCTA({ onOpenLeadModal, onNavigateSection }) {
  const whatsappUrl = getWhatsAppUrl("Hi Wellwigen! I want to choose a program and take my first step toward a fitter, stronger me.");

  return (
    <section data-nav-theme="dark" className="relative py-28 bg-[#0E1420] text-white overflow-hidden border-t border-[#2A3547]">
      {/* Blueprint Grid & Noise Texture */}
      <div className="absolute inset-0 bg-blueprint-grid opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-40 pointer-events-none" />

      {/* Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18vw] watermark-text opacity-15 whitespace-nowrap z-0">
        NO EXCUSES
      </div>

      {/* Soft Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#2DE2C8]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FF6B35]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-[#111B2E]/90 backdrop-blur-md rounded-3xl p-10 sm:p-16 border border-[#2A3547] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] relative overflow-hidden"
          style={{
            boxShadow: '0 25px 60px -15px rgba(0,0,0,0.8), 0 0 35px rgba(45,226,200,0.15)',
          }}
        >
          {/* Corner brackets */}
          <div className="corner-bracket-tl z-20" />
          <div className="corner-bracket-br z-20" />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0E1420] border border-[#2A3547] text-[#2DE2C8] text-xs font-display font-extrabold uppercase tracking-widest mb-6 shadow-sm">
              <Flame size={14} className="text-[#FF6B35]" />
              <span>YOUR TRANSFORMATION AWAITS</span>
            </span>

            <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-3xl mx-auto">
              Ready to Get Started?
            </h2>

            <p className="text-base sm:text-lg text-slate-300 mt-4 max-w-2xl mx-auto leading-relaxed">
              Choose your program and take the first step toward a fitter, stronger you.
            </p>

            {/* Three CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <button
                onClick={() => onOpenLeadModal({ program: 'Personal Training', plan: 'Transformation' })}
                className="w-full sm:w-auto btn-power-coral btn-shine px-8 py-4 text-sm sm:text-base font-bold flex items-center justify-center gap-2 cursor-pointer shadow-coral-glow group"
              >
                <span>Start Personal Training</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onNavigateSection('group-classes')}
                className="w-full sm:w-auto btn-primary-gradient btn-shine px-8 py-4 text-sm sm:text-base font-bold flex items-center justify-center gap-2 cursor-pointer shadow-teal-glow group"
              >
                <span>Join Group Classes</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-4 rounded-full bg-[#25D366] text-white hover:bg-[#20bd5a] text-sm sm:text-base font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all hover:scale-105"
              >
                <MessageCircle size={18} />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
