// OLD CODE (commented by AI)
/*
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';
*/
// NEW CODE - Trainer Portal feature: add Link and UserCheck icon
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Sparkles, UserCheck } from 'lucide-react';

export default function Navbar({ onOpenLeadModal }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // OLD CODE (commented by AI)
  /*
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  */
  // NEW CODE - smooth animation/performance: throttle state updates on scroll to prevent layout churn
  useEffect(() => {
    let lastScrolled = window.scrollY > 30;
    setIsScrolled(lastScrolled);

    const handleScroll = () => {
      const nowScrolled = window.scrollY > 30;
      if (nowScrolled !== lastScrolled) {
        lastScrolled = nowScrolled;
        setIsScrolled(nowScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver for active section highlight
  useEffect(() => {
    const sectionIds = ['home', 'personal-training', 'group-classes'];
    const observers = [];

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -50% 0px',
      threshold: 0,
    };

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) {
        const obs = new IntersectionObserver(observerCallback, observerOptions);
        obs.observe(el);
        observers.push(obs);
      }
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      // Update hash without jumping
      window.history.pushState(null, '', `#${id}`);
    }
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'personal-training', label: 'Personal Training' },
    { id: 'group-classes', label: 'Group Classes' },
  ];

  return (
    <>
      {/* OLD CODE (commented by AI)
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'py-3.5 bg-[#0E1420]/95 backdrop-blur-md shadow-[0_4px_25px_rgba(0,0,0,0.5)] border-b border-slate-800'
            : 'py-5 bg-gradient-to-b from-[#0E1420]/85 via-[#0E1420]/40 to-transparent'
        }`}
      >
      */}
      {/* OLD CODE (commented by AI)
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'py-3.5 bg-[#0E1420]/95 backdrop-blur-md shadow-[0_4px_25px_rgba(0,0,0,0.5)] border-b border-slate-800'
            : 'py-3.5 sm:py-5 bg-[#0E1420]/95 sm:bg-gradient-to-b sm:from-[#0E1420]/85 sm:via-[#0E1420]/40 sm:to-transparent backdrop-blur-md sm:backdrop-blur-none border-b border-slate-800/60 sm:border-transparent'
        }`}
      >
      */}
      {/* NEW CODE - smooth animation/performance: GPU translateZ(0) layer promotion, specific background/padding/shadow transition */}
      <header
        style={{ transform: 'translateZ(0)' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-[padding,background-color,border-color,box-shadow] duration-250 ${
          isScrolled
            ? 'py-3.5 bg-[#0E1420]/95 backdrop-blur-md shadow-[0_4px_25px_rgba(0,0,0,0.5)] border-b border-slate-800'
            : 'py-3.5 sm:py-5 bg-[#0E1420]/95 sm:bg-gradient-to-b sm:from-[#0E1420]/85 sm:via-[#0E1420]/40 sm:to-transparent backdrop-blur-md sm:backdrop-blur-none border-b border-slate-800/60 sm:border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('home');
              }}
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl gradient-teal-sky flex items-center justify-center text-white shadow-md shadow-teal-500/25 group-hover:scale-105 transition-transform duration-200">
                <span className="font-heading font-black text-lg">W</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-heading font-extrabold text-xl tracking-tight text-white leading-tight group-hover:text-teal-400 transition-colors">
                  WELLWIGEN
                </span>
                {/* OLD CODE (commented by AI)
                <span className="text-[8.5px] font-bold tracking-[0.2em] text-[#2DE2C8] uppercase -mt-0.5">
                  STRONGER BODY. BETTER YOU.
                </span>
                */}
                {/* NEW CODE - mobile fix: single line tagline, compact font size, hidden below 360px to prevent word-wrap */}
                <span className="hidden min-[360px]:inline-block text-[7.5px] sm:text-[8.5px] font-bold tracking-[0.15em] sm:tracking-[0.2em] text-[#2DE2C8] uppercase -mt-0.5 whitespace-nowrap">
                  STRONGER BODY. BETTER YOU.
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2 bg-slate-900/70 p-1 rounded-full border border-slate-700/60 backdrop-blur-md shadow-inner">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => scrollTo(link.id)}
                    className={`relative px-4 py-2 rounded-full text-xs lg:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'text-white font-bold'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activePill"
                        className="absolute inset-0 bg-teal-500/25 rounded-full border border-teal-400/50 shadow-[0_0_12px_rgba(45,226,200,0.3)]"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Desktop CTA Button */}
            {/* OLD CODE (commented by AI)
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => onOpenLeadModal({ program: 'Group Classes', plan: 'Trial Class' })}
                className="btn-power-coral px-6 py-2.5 rounded-xl text-xs lg:text-sm font-bold flex items-center gap-1.5 shadow-coral-glow cursor-pointer group"
              >
                <span>Join Now</span>
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
            */}
            {/* NEW CODE - Trainer Portal feature: add outline/teal Trainer button alongside Join Now */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/trainer"
                className="px-5 py-2.5 rounded-xl border border-teal-400/50 hover:border-teal-300 text-teal-300 hover:text-white hover:bg-teal-500/10 text-xs lg:text-sm font-bold flex items-center gap-1.5 shadow-xs transition-all duration-200 cursor-pointer"
              >
                <span>Trainer</span>
              </Link>
              <button
                onClick={() => onOpenLeadModal({ program: 'Group Classes', plan: 'Trial Class' })}
                className="btn-power-coral px-6 py-2.5 rounded-xl text-xs lg:text-sm font-bold flex items-center gap-1.5 shadow-coral-glow cursor-pointer group"
              >
                <span>Join Now</span>
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* OLD CODE (commented by AI)
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => onOpenLeadModal({ program: 'Group Classes', plan: 'Trial Class' })}
                className="btn-power-coral px-4 py-2 text-xs font-bold rounded-xl"
              >
                Join Now
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-10 h-10 rounded-xl bg-slate-900/80 border border-slate-700 flex items-center justify-center text-slate-200 hover:text-white transition-colors cursor-pointer"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
            */}

            {/* NEW CODE - mobile fix: compact single-line pill (whitespace: nowrap, 13px, 40px height) vertically aligned with hamburger */}
            <div className="flex md:hidden items-center gap-2 shrink-0">
              <button
                onClick={() => onOpenLeadModal({ program: 'Group Classes', plan: 'Trial Class' })}
                className="btn-power-coral h-10 px-3.5 sm:px-4 text-[13px] font-bold rounded-full whitespace-nowrap flex items-center justify-center shadow-coral-glow cursor-pointer shrink-0"
              >
                Join Now
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-10 h-10 rounded-xl bg-slate-900/90 border border-slate-700/80 flex items-center justify-center text-slate-200 hover:text-white transition-colors cursor-pointer shrink-0"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide-in Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-white shadow-2xl z-50 p-6 flex flex-col justify-between md:hidden"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg gradient-teal-sky flex items-center justify-center text-white font-bold text-sm">
                      W
                    </div>
                    <div>
                      <div className="font-heading font-black text-slate-900 text-base">WELLWIGEN</div>
                      <div className="text-[7.5px] font-bold tracking-widest text-teal-600 uppercase">
                        STRONGER BODY
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Navigation Links */}
                {/* OLD CODE (commented by AI)
                <div className="py-6 flex flex-col gap-2">
                  {navLinks.map((link) => {
                    const isActive = activeSection === link.id;
                    return (
                      <button
                        key={link.id}
                        onClick={() => scrollTo(link.id)}
                        className={`w-full text-left px-4 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-between ${
                          isActive
                            ? 'bg-teal-50 text-teal-800 font-bold border border-teal-100'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{link.label}</span>
                        {isActive && <span className="w-2 h-2 rounded-full bg-teal-500" />}
                      </button>
                    );
                  })}
                </div>
                */}
                {/* NEW CODE - Trainer Portal feature: add Trainer Portal link in mobile drawer */}
                <div className="py-6 flex flex-col gap-2">
                  {navLinks.map((link) => {
                    const isActive = activeSection === link.id;
                    return (
                      <button
                        key={link.id}
                        onClick={() => scrollTo(link.id)}
                        className={`w-full text-left px-4 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-between ${
                          isActive
                            ? 'bg-teal-50 text-teal-800 font-bold border border-teal-100'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{link.label}</span>
                        {isActive && <span className="w-2 h-2 rounded-full bg-teal-500" />}
                      </button>
                    );
                  })}

                  <Link
                    to="/trainer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-left px-4 py-3 rounded-xl font-bold text-sm text-teal-700 bg-teal-50/80 border border-teal-200/80 flex items-center justify-between transition-all mt-1"
                  >
                    <span>Trainer Portal</span>
                    <ArrowRight size={14} className="text-teal-600" />
                  </Link>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-6 border-t border-slate-100 space-y-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLeadModal({ program: 'Personal Training', plan: 'Transformation' });
                  }}
                  className="w-full py-3 px-4 rounded-xl btn-primary-gradient font-bold text-sm text-center shadow-teal-glow flex items-center justify-center gap-2"
                >
                  <Sparkles size={16} />
                  <span>Start Your Journey</span>
                </button>
                <div className="text-center text-xs text-slate-400">
                  Need help? WhatsApp us directly
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
