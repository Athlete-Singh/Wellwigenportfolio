import React from 'react';
import { Phone } from 'lucide-react';
import { CONTACT_INFO, getWhatsAppUrl } from '../../features/landing/data/fitnessData';

const FloatingContact = () => {
  const whatsappUrl = getWhatsAppUrl("Hi Wellwigen! I'm interested in starting fitness coaching.");
  const callUrl = `tel:+${CONTACT_INFO.phoneRaw}`;

  return (
    <aside
      aria-label="Quick Contact Options"
      className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3 pointer-events-none"
    >
      {/* Phone Icon */}
      <a
        href={callUrl}
        className="pointer-events-auto group relative w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-tr from-teal-600 via-teal-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-teal-500/30 hover:scale-110 active:scale-95 transition-transform duration-300 border border-white/20"
        aria-label={`Call Us: ${CONTACT_INFO.phone}`}
      >
        <Phone className="w-5 h-5 text-white transition-transform group-hover:rotate-12 duration-200" />

        {/* Tooltip on hover (desktop only) */}
        <span className="hidden sm:inline-block absolute right-16 px-3 py-1.5 rounded-xl bg-slate-900/90 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-md border border-white/10">
          Call: {CONTACT_INFO.phone}
        </span>
      </a>

      {/* WhatsApp Icon */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto group relative w-[52px] h-[52px] sm:w-14 sm:h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-xl sm:shadow-2xl shadow-emerald-500/40 hover:scale-110 active:scale-95 transition-transform duration-300"
        aria-label="Chat on WhatsApp"
      >
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-25 sm:opacity-30 animate-ping pointer-events-none" />
        <span className="absolute -inset-1.5 rounded-full bg-[#25D366] opacity-15 sm:opacity-20 pointer-events-none" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="w-7 h-7 sm:w-8 sm:h-8 text-white relative z-10 drop-shadow-sm"
          aria-hidden="true"
        >
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
        </svg>

        {/* Tooltip on hover (desktop only) */}
        <span className="hidden sm:inline-block absolute right-16 px-3 py-1.5 rounded-xl bg-slate-900/90 text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-md border border-white/10">
          Chat on WhatsApp
        </span>
      </a>
    </aside>
  );
};

export default FloatingContact;
