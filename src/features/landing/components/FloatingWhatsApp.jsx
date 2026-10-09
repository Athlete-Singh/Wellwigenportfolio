import React from 'react';
import { MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '../data/fitnessData';

export default function FloatingWhatsApp() {
  const whatsappUrl = getWhatsAppUrl("Hi Wellwigen! I'm interested in starting fitness coaching.");

  /* OLD CODE (commented by AI)
  return (
    <aside aria-label="WhatsApp Quick Contact" className="fixed bottom-6 right-6 z-40">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-2xl shadow-emerald-500/40 hover:scale-110 active:scale-95 transition-all duration-300"
        aria-label="Chat on WhatsApp with Wellwigen Coach"
      >
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none" />
        <span className="absolute -inset-2 rounded-full bg-[#25D366] opacity-20 pointer-events-none" />

        <MessageCircle size={28} className="relative z-10" />

        <span className="absolute right-16 px-3 py-1.5 rounded-xl bg-slate-900/90 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-md">
          Chat with us on WhatsApp
        </span>
      </a>
    </aside>
  );
  */

  // NEW CODE - mobile fix: 52px compact diameter on mobile, env(safe-area-inset-bottom) positioning, gentle pulse
  return (
    <aside
      aria-label="WhatsApp Quick Contact"
      className="fixed right-4 sm:right-6 bottom-[max(1.25rem,env(safe-area-inset-bottom,20px))] sm:bottom-6 z-40"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-[52px] h-[52px] sm:w-14 sm:h-14 bg-[#25D366] text-white rounded-full shadow-xl sm:shadow-2xl shadow-emerald-500/30 hover:scale-105 sm:hover:scale-110 active:scale-95 transition-all duration-300"
        aria-label="Chat on WhatsApp with Wellwigen Coach"
      >
        {/* Soft pulse rings - subtle on mobile to avoid obscuring card content */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-15 sm:opacity-30 animate-ping pointer-events-none" />
        <span className="absolute -inset-1.5 rounded-full bg-[#25D366] opacity-10 sm:opacity-20 pointer-events-none" />

        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 relative z-10" />

        {/* Tooltip on hover (desktop only) */}
        <span className="hidden sm:inline-block absolute right-16 px-3 py-1.5 rounded-xl bg-slate-900/90 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-md">
          Chat with us on WhatsApp
        </span>
      </a>
    </aside>
  );
}
