// OLD CODE (commented by AI)
/*
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Sparkles } from 'lucide-react';
*/
// OLD CODE (commented by AI)
/*
// NEW CODE - Trainer Portal feature: add Link and UserCheck icon
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Sparkles, UserCheck } from 'lucide-react';

export default function Navbar({ onOpenLeadModal }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
*/
// OLD CODE (commented by AI)
/*
import LiveAthlete from './LiveAthlete';
*/
// NEW CODE - Live 3D Athlete synchronized Head component
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, Sparkles, UserCheck } from 'lucide-react';
import LiveAthleteHead from './LiveAthleteHead';
import { trainerApi } from '../../../services/trainerApi';

export default function Navbar({ onOpenLeadModal }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Trainer Authentication State (flicker-free initial check from storage)
  const [isTrainerAuth, setIsTrainerAuth] = useState(() => {
    return trainerApi.isAuthenticated();
  });

  // Verify real auth against backend on mount & react to login/logout events without page refresh
  useEffect(() => {
    let isMounted = true;

    const checkRealAuth = async () => {
      const storedAuth = trainerApi.isAuthenticated();
      if (!storedAuth) {
        if (isMounted) setIsTrainerAuth(false);
        return;
      }

      // Already logged in locally; verify token/account against server to catch expired/invalid tokens
      try {
        const isValid = await trainerApi.verifyCurrentAuth();
        if (isMounted) setIsTrainerAuth(isValid);
      } catch (err) {
        if (isMounted) setIsTrainerAuth(false);
      }
    };

    checkRealAuth();

    const handleAuthEvent = () => {
      checkRealAuth();
    };

    window.addEventListener('trainerAuthChanged', handleAuthEvent);
    window.addEventListener('storage', handleAuthEvent);
    window.addEventListener('trainerProfileUpdated', handleAuthEvent);

    return () => {
      isMounted = false;
      window.removeEventListener('trainerAuthChanged', handleAuthEvent);
      window.removeEventListener('storage', handleAuthEvent);
      window.removeEventListener('trainerProfileUpdated', handleAuthEvent);
    };
  }, []);

  // Path checks
  const isPersonalTrainingPage = location.pathname === '/personal-training';
  const isGroupClassesPage = location.pathname === '/group-classes';
  const isHomePage = location.pathname === '/' || location.pathname === '';

  // Dynamic Trainer Button route & label based on authentication state
  const trainerRoute = isTrainerAuth ? '/trainer/dashboard' : '/trainer/login';
  const trainerLabel = isTrainerAuth ? 'Trainer' : 'Trainer (Login/Register)';

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

  // Route-based active pill highlight
  useEffect(() => {
    if (isPersonalTrainingPage) {
      setActiveSection('personal-training');
      return;
    }
    if (isGroupClassesPage) {
      setActiveSection('group-classes');
      return;
    }
    setActiveSection('home');
  }, [isPersonalTrainingPage, isGroupClassesPage, location.pathname]);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);

    if (id === 'personal-training') {
      if (location.pathname !== '/personal-training') {
        navigate('/personal-training');
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (id === 'group-classes') {
      if (location.pathname !== '/group-classes') {
        navigate('/group-classes');
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    if (id === 'home') {
      if (location.pathname !== '/') {
        navigate('/');
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.history.pushState(null, '', '#home');
      }
      return;
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
      {/* OLD CODE (commented by AI) - transparent gradient header that blended into home page
      <header
        style={{ transform: 'translateZ(0)' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-[padding,background-color,border-color,box-shadow] duration-250 ${
          isScrolled
            ? 'py-3.5 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/90'
            : 'py-3.5 sm:py-5 bg-white/90 sm:bg-gradient-to-b sm:from-white/95 sm:via-white/70 sm:to-transparent backdrop-blur-md sm:backdrop-blur-none border-b border-slate-200/60 sm:border-transparent'
        }`}
      >
      */}
      {/* NEW CODE - Distinct premium header: frosted glass surface, crisp border-b, and animated glowing teal accent line */}
      <header
        style={{ transform: 'translateZ(0)' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-[padding,background-color,border-color,box-shadow] duration-300 ${
          isScrolled
            ? 'py-3 bg-white/98 backdrop-blur-xl shadow-md border-b border-slate-200/90'
            : 'py-3.5 sm:py-4 bg-white/92 backdrop-blur-xl shadow-[0_4px_25px_-5px_rgba(15,23,42,0.06)] border-b border-slate-200/80'
        }`}
      >
        {/* Animated Bottom Border Accent Line: clearly distinguishes header with dynamic glowing energy */}
        <div className="absolute bottom-0 inset-x-0 h-[2px] overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/15 via-teal-500/40 to-sky-500/20" />
          <motion.div
            className="h-full w-72 bg-gradient-to-r from-transparent via-teal-500 via-sky-400 to-transparent opacity-90 shadow-[0_0_10px_rgba(45,212,191,0.6)]"
            animate={{
              x: ['-100%', '700%'],
            }}
            transition={{
              duration: 5.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollTo('home');
              }}
              className="flex items-center group cursor-pointer"
            >
              <img
                src="/images/wellwigen-logo.webp"
                alt="Wellwigen - Your Wellness Partner."
                className="h-12 sm:h-13 md:h-14 lg:h-16 w-auto object-contain select-none group-hover:scale-105 transition-transform duration-200"
                loading="eager"
              />
            </a>

            {/* Desktop Navigation Links (Rounded bracket with colored border line) */}
            <nav data-athlete-nav-pill className="hidden md:flex items-center gap-1 lg:gap-2 bg-slate-100/90 p-1.5 rounded-full border-2 border-teal-500/30 backdrop-blur-md shadow-xs">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => scrollTo(link.id)}
                    className={`relative px-4 py-2 rounded-full text-xs lg:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'text-teal-900 font-extrabold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activePill"
                        className="absolute inset-0 bg-white rounded-full border-2 border-teal-500 shadow-xs"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* OLD CODE (commented by AI)
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/trainer"
                className="px-5 py-2.5 rounded-full border-2 border-teal-600 hover:border-teal-700 text-teal-800 hover:text-teal-950 hover:bg-teal-50 text-xs lg:text-sm font-bold flex items-center gap-1.5 shadow-xs transition-all duration-200 cursor-pointer"
              >
                <span>Trainer</span>
              </Link>
              <button
                onClick={() => onOpenLeadModal({ program: 'Group Classes', plan: 'Trial Class' })}
                className="btn-power-coral px-6 py-2.5 rounded-full text-xs lg:text-sm font-bold flex items-center gap-1.5 shadow-coral-glow cursor-pointer group"
              >
                <span>Join Now</span>
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
            */}
            {/* OLD CODE (commented by AI) - mini athlete inside header
            <div className="hidden md:flex items-center gap-3">
              {isHomePage && (
                <div className="hidden lg:flex items-center justify-center mr-1 xl:mr-2">
                  <LiveAthlete />
                </div>
              )}
              <Link
                to="/trainer"
                className="px-5 py-2.5 rounded-full border-2 border-teal-600 hover:border-teal-700 text-teal-800 hover:text-teal-950 hover:bg-teal-50 text-xs lg:text-sm font-bold flex items-center gap-1.5 shadow-xs transition-all duration-200 cursor-pointer"
              >
                <span>Trainer</span>
              </Link>
              <button
                onClick={() => onOpenLeadModal({ program: 'Group Classes', plan: 'Trial Class' })}
                className="btn-power-coral px-6 py-2.5 rounded-full text-xs lg:text-sm font-bold flex items-center gap-1.5 shadow-coral-glow cursor-pointer group"
              >
                <span>Join Now</span>
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
            */}
            {/* Trainer & Join Now buttons preserved */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                data-athlete-trainer-btn
                to={trainerRoute}
                className="group h-11 px-5 rounded-full border-2 border-teal-600 text-teal-800 bg-white/90 hover:bg-teal-600 hover:border-teal-600 hover:text-white flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md hover:shadow-teal-600/30 transition-all duration-200 cursor-pointer whitespace-nowrap min-w-[130px]"
              >
                <span className="font-heading font-black text-xs sm:text-sm tracking-tight leading-none group-hover:text-white transition-colors">
                  Trainer
                </span>
                {!isTrainerAuth && (
                  <span className="text-[9px] sm:text-[10px] font-bold tracking-wide text-teal-700 group-hover:text-white/95 leading-none mt-0.5 transition-colors">
                    Login / Register
                  </span>
                )}
              </Link>
              <button
                onClick={() => onOpenLeadModal({ program: 'Group Classes', plan: 'Trial Class' })}
                className="btn-power-coral px-6 py-2.5 rounded-full text-xs lg:text-sm font-bold flex items-center gap-1.5 shadow-coral-glow cursor-pointer group"
              >
                <span>Join Now</span>
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-2 shrink-0">
              <button
                onClick={() => onOpenLeadModal({ program: 'Group Classes', plan: 'Trial Class' })}
                className="btn-power-coral h-10 px-3.5 sm:px-4 text-[13px] font-bold rounded-full whitespace-nowrap flex items-center justify-center shadow-coral-glow cursor-pointer shrink-0"
              >
                Join Now
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-800 hover:text-teal-700 transition-colors cursor-pointer shrink-0"
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
                  <a
                    href="#home"
                    onClick={(e) => {
                      e.preventDefault();
                      setMobileMenuOpen(false);
                      scrollTo('home');
                    }}
                    className="flex items-center"
                  >
                    <img
                      src="/images/wellwigen-logo.webp"
                      alt="Wellwigen"
                      className="h-11 sm:h-12 w-auto object-contain select-none"
                    />
                  </a>
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
                    to={trainerRoute}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-left px-4 py-3 rounded-xl font-bold text-sm text-teal-800 bg-teal-50/80 hover:bg-teal-600 hover:text-white border border-teal-200/80 flex items-center justify-between transition-all mt-1 group cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span className="font-heading font-black text-sm group-hover:text-white transition-colors">Trainer</span>
                      {!isTrainerAuth && (
                        <span className="text-[10px] text-teal-700 group-hover:text-white/95 font-semibold transition-colors">Login / Register</span>
                      )}
                    </div>
                    <ArrowRight size={15} className="text-teal-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
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
