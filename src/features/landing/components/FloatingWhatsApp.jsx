import React from 'react';
import { MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '../data/fitnessData';

export default function FloatingWhatsApp() {
  const whatsappUrl = getWhatsAppUrl("Hi Wellwigen! I'm interested in starting fitness coaching.");

  return (
    <aside aria-label="WhatsApp Quick Contact" className="fixed bottom-6 right-6 z-40">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-2xl shadow-emerald-500/40 hover:scale-110 active:scale-95 transition-all duration-300"
        aria-label="Chat on WhatsApp with Wellwigen Coach"
      >
        {/* Soft pulse rings */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none" />
        <span className="absolute -inset-2 rounded-full bg-[#25D366] opacity-20 pointer-events-none" />

        <MessageCircle size={28} className="relative z-10" />

        {/* Tooltip on hover */}
        <span className="absolute right-16 px-3 py-1.5 rounded-xl bg-slate-900/90 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-md">
          Chat with us on WhatsApp
        </span>
      </a>
    </aside>
  );
}
