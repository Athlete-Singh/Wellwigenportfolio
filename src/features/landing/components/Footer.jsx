// OLD CODE (commented by AI)
/*
import React from 'react';
import { Phone, Mail, MapPin, Instagram, Twitter, Facebook, Linkedin, ArrowUp } from 'lucide-react';
import { CONTACT_INFO } from '../data/fitnessData';
*/
// NEW CODE - Trainer Portal feature: add Link from react-router-dom
import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Twitter, Facebook, Linkedin, ArrowUp } from 'lucide-react';
import { CONTACT_INFO } from '../data/fitnessData';
// NEW CODE - Distinct Border Format 7: Stepped Stadium Arch & Neon Fiber-Optic Laser Divider
import { SteppedStadiumArchDivider } from './SectionDividers';

export default function Footer({ onNavigateSection, onOpenLegalModal }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* OLD CODE (commented by AI)
  // <footer data-nav-theme="dark" className="bg-[#092B28] text-slate-300 pt-20 pb-12 border-t border-teal-800/40 relative overflow-hidden">
  */

  // NEW CODE - mobile fix: pb-28 on mobile (~110px padding) so floating WhatsApp button never covers footer content
  return (
    <footer data-nav-theme="dark" className="bg-[#092B28] text-slate-300 pt-20 sm:pt-24 lg:pt-28 pb-28 sm:pb-12 relative overflow-hidden">
      {/* NEW CODE - Distinct Border Format 7: Stepped Stadium Arch & Neon Fiber-Optic Laser Divider */}
      <div className="absolute top-0 inset-x-0">
        <SteppedStadiumArchDivider />
      </div>

      {/* Dynamic Glow Line Accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-400/60 to-transparent shadow-[0_0_12px_rgba(45,226,200,0.6)]" />

      {/* Ambient Gym Grid & Glow */}
      <div className="absolute inset-0 bg-blueprint opacity-[0.03] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-teal-800/40">
          
          {/* Col 1: Brand Info (2 columns wide on large screens) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative inline-flex items-center group">
              {/* Ambient Backlight Energy Glow */}
              <div className="absolute -inset-3 bg-gradient-to-r from-teal-500/30 via-cyan-400/25 to-teal-400/15 rounded-full blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              {/* Logo directly with backlight, no outer border */}
              <img
                src="/images/wellwigen-logo-white.webp"
                alt="Wellwigen - Your Wellness Partner."
                className="relative z-10 h-12 sm:h-14 md:h-16 w-auto object-contain select-none filter drop-shadow-[0_2px_14px_rgba(45,212,191,0.45)] group-hover:scale-[1.02] transition-transform duration-300"
              />
            </div>

            <p className="text-xs sm:text-sm text-teal-100/70 max-w-sm leading-relaxed">
              Empowering you to build lasting strength and sustainable fitness habits through expert 1-on-1 coaching and high-energy live classes.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={CONTACT_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-teal-900/60 hover:bg-teal-700/60 text-teal-200 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={17} />
              </a>
              <a
                href={CONTACT_INFO.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-teal-900/60 hover:bg-teal-700/60 text-teal-200 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={17} />
              </a>
              <a
                href={CONTACT_INFO.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-teal-900/60 hover:bg-teal-700/60 text-teal-200 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={17} />
              </a>
              <a
                href={CONTACT_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-teal-900/60 hover:bg-teal-700/60 text-teal-200 hover:text-white flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={17} />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h5 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-4">
              Quick Links
            </h5>
            {/* OLD CODE (commented by AI)
            <ul className="space-y-2.5 text-xs sm:text-sm text-teal-100/80">
              <li>
                <button
                  onClick={() => onNavigateSection('home')}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('personal-training')}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  Personal Training
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('group-classes')}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  Group Classes
                </button>
              </li>
            </ul>
            */}
            {/* NEW CODE - Trainer Portal feature: add Become a Trainer and Trainer Login */}
            <ul className="space-y-2.5 text-xs sm:text-sm text-teal-100/80">
              <li>
                <button
                  onClick={() => onNavigateSection('home')}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('personal-training')}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  Personal Training
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('group-classes')}
                  className="hover:text-teal-300 transition-colors cursor-pointer"
                >
                  Group Classes
                </button>
              </li>
              <li className="pt-1.5 border-t border-teal-800/40">
                <Link
                  to="/trainer"
                  className="text-teal-300 hover:text-white transition-colors flex items-center gap-1 font-semibold"
                >
                  <span>Become a Trainer</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/trainer/login"
                  className="text-teal-300/80 hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>Trainer Login</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Programs */}
          <div>
            <h5 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-4">
              Programs
            </h5>
            <ul className="space-y-2.5 text-xs sm:text-sm text-teal-100/80">
              <li>
                <button
                  onClick={() => onNavigateSection('group-classes')}
                  className="hover:text-teal-300 transition-colors cursor-pointer text-left"
                >
                  Group Classes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('personal-training')}
                  className="hover:text-teal-300 transition-colors cursor-pointer text-left"
                >
                  Personal Training
                </button>
              </li>
              <li className="flex items-center gap-2">
                <span>Nutrition</span>
                <span className="text-[10px] font-bold text-amber-300 bg-amber-900/40 px-2 py-0.5 rounded-full border border-amber-600/30">
                  Coming Soon
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h5 className="font-heading font-bold text-white text-sm uppercase tracking-wider mb-4">
              Contact
            </h5>
            <ul className="space-y-3 text-xs sm:text-sm text-teal-100/80">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="text-teal-400 shrink-0 mt-0.5" />
                <span>{CONTACT_INFO.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="text-teal-400 shrink-0" />
                <a
                  href={`tel:${CONTACT_INFO.phoneRaw}`}
                  className="hover:text-teal-300 transition-colors"
                >
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="text-teal-400 shrink-0" />
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="hover:text-teal-300 transition-colors"
                >
                  {CONTACT_INFO.email}
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-teal-200/60">
          <div>
            &copy; 2026 Wellwigen. All Rights Reserved.
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={scrollToTop}
              className="hover:text-teal-200 transition-colors cursor-pointer flex items-center gap-1 text-teal-300/80"
              aria-label="Back to top"
            >
              <span>Top</span>
              <ArrowUp size={12} />
            </button>
            <button
              onClick={() => onOpenLegalModal('privacy')}
              className="hover:text-teal-200 transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onOpenLegalModal('terms')}
              className="hover:text-teal-200 transition-colors cursor-pointer"
            >
              Terms &amp; Conditions
            </button>
            <button
              onClick={() => onOpenLegalModal('refund')}
              className="hover:text-teal-200 transition-colors cursor-pointer"
            >
              Refund Policy
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
