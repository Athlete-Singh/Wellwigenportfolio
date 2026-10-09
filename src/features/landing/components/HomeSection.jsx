// OLD CODE (commented by AI)
/*
import React, { useState } from 'react';
import { motion } from 'framer-motion';
*/

// NEW CODE - Wellwigen alternating hero images
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  Globe,
  Target,
  Users,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Clock,
  MapPin,
  Flame,
  Star,
  Sparkles,
  Zap,
  Activity,
  Dumbbell,
} from 'lucide-react';
import {
  HOME_TRUST_CHIPS,
  WHY_WELLWIGEN_TILES,
  HOW_IT_WORKS_STEPS,
  CLASS_TYPES,
  HOME_TESTIMONIALS,
} from '../data/fitnessData';
import GymMarqueeTicker from './GymMarqueeTicker';

export default function HomeSection({ onOpenLeadModal, onNavigateSection }) {
  // NEW CODE - Alternating Hero Background Images (preserves all 4 images)
  const HERO_IMAGES = [
    {
      src: '/images/hero_workout.jpg',
      alt: 'Wellwigen elite athletic power training in gym',
      position: 'object-[70%_20%] sm:object-[68%_25%] lg:object-[68%_20%]',
    },
    {
      src: '/images/hero_sled_push.jpg',
      alt: 'Athletic power sled push training at Wellwigen',
      position: 'object-[75%_35%] sm:object-[70%_30%] lg:object-[65%_25%]',
    },
    {
      src: '/images/hero_home_plank.jpg',
      alt: 'Live online virtual personal training session with coach',
      position: 'object-[45%_12%] sm:object-[48%_10%] lg:object-[50%_8%]',
    },
    {
      src: '/images/hero_bench_athlete.jpg',
      alt: 'Muscular athlete focus training at Wellwigen gym',
      position: 'object-[80%_30%] sm:object-[75%_25%] lg:object-[70%_20%]',
    },
    {
      src: '/images/hero_online_coach.jpg',
      alt: 'Expert online personal fitness coach conducting live consultation',
      position: 'object-[20%_8%] sm:object-[22%_6%] lg:object-[25%_5%]',
    },
  ];

  const [currentHeroImage, setCurrentHeroImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 3800); // Snappier rotation: 3.8 seconds so visitors see the next image promptly
    return () => clearInterval(timer);
  }, [HERO_IMAGES.length]);
  const getTileIcon = (name) => {
    switch (name) {
      case 'Award': return <Award className="w-6 h-6 text-teal-600" />;
      case 'MapPin': return <MapPin className="w-6 h-6 text-sky-600" />;
      case 'Target': return <Target className="w-6 h-6 text-emerald-600" />;
      case 'TrendingUp': return <TrendingUp className="w-6 h-6 text-amber-600" />;
      case 'Users': return <Users className="w-6 h-6 text-purple-600" />;
      case 'Clock': return <Clock className="w-6 h-6 text-rose-600" />;
      default: return <Sparkles className="w-6 h-6 text-teal-600" />;
    }
  };

  const getChipIcon = (name) => {
    switch (name) {
      case 'Award': return <Award size={15} className="text-teal-600" />;
      case 'Globe': return <Globe size={15} className="text-sky-600" />;
      case 'Target': return <Target size={15} className="text-emerald-600" />;
      case 'Users': return <Users size={15} className="text-purple-600" />;
      default: return <Sparkles size={15} className="text-teal-600" />;
    }
  };

  return (
    <section id="home" className="relative overflow-hidden">

      {/* Side Vertical Text Rail on XL screens */}
      <div className="hidden xl:flex fixed left-4 top-1/2 -translate-y-1/2 flex-col items-center gap-4 z-20 pointer-events-none opacity-40">
        <span className="[writing-mode:vertical-rl] rotate-180 font-display text-[10px] tracking-[0.3em] font-bold uppercase text-slate-400">
          WELLWIGEN &bull; 01 HOME
        </span>
        <div className="w-px h-16 bg-teal-500/50" />
      </div>

      {/* ================= FULLSCREEN CINEMATIC HERO (EDGE-TO-EDGE) ================= */}
      <div data-nav-theme="dark" className="relative min-h-[92vh] lg:min-h-screen flex items-center pt-28 pb-20 lg:pt-36 lg:pb-24 bg-[#0E1420]">

        {/* Whole Screen Background Image */}
        {/* OLD CODE (commented by AI) */}
        {/*
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/images/hero_workout.jpg"
            alt="Wellwigen elite athletic power training in gym"
            className="w-full h-full object-cover object-[70%_20%] sm:object-[68%_25%] lg:object-[68%_20%] filter brightness-[0.9] contrast-[1.12]"
            loading="eager"
            fetchPriority="high"
          />
        */}

        {/* NEW CODE - Wellwigen alternating hero images (both images crossfade smoothly time to time) */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {HERO_IMAGES.map((img, idx) => (
            <motion.img
              key={img.src}
              src={img.src}
              alt={img.alt}
              initial={false}
              animate={{
                opacity: currentHeroImage === idx ? 1 : 0,
                scale: currentHeroImage === idx ? 1 : 1.04,
              }}
              transition={{
                opacity: { duration: 0.75, ease: 'easeInOut' },
                scale: { duration: 3.8, ease: 'easeOut' },
              }}
              className={`absolute inset-0 w-full h-full object-cover ${img.position} filter brightness-[0.88] contrast-[1.12]`}
              loading={idx === 0 ? 'eager' : 'lazy'}
              fetchPriority={idx === 0 ? 'high' : 'auto'}
            />
          ))}

          {/* Interactive Slide Switcher Indicator */}
          <div className="absolute bottom-8 right-8 z-30 hidden sm:flex items-center gap-2 bg-slate-900/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-teal-500/30">
            {HERO_IMAGES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentHeroImage(idx)}
                aria-label={`Switch to hero photo ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${currentHeroImage === idx
                  ? 'w-6 h-1.5 bg-[#2DE2C8]'
                  : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                  }`}
              />
            ))}
          </div>

          {/* Deep Cinematic Multi-layer Gradient Overlays for Razor-Sharp Readability */}
          {/* Left vignette backdrop */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0E1420] via-[#0E1420]/90 to-transparent lg:w-[68%]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0E1420]/80 via-[#0E1420]/50 to-transparent" />

          {/* Top fade for transparent sticky navbar */}
          <div className="absolute top-0 inset-x-0 h-44 bg-gradient-to-b from-[#0E1420]/95 via-[#0E1420]/50 to-transparent pointer-events-none" />

          {/* Bottom fade into Marquee ticker band */}
          <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#0E1420] via-[#0E1420]/80 to-transparent pointer-events-none" />

          {/* Blueprint Grid & Noise Texture */}
          <div className="absolute inset-0 bg-blueprint opacity-[0.03] pointer-events-none" />
          <div className="absolute inset-0 bg-noise opacity-25 pointer-events-none" />

          {/* Ambient Teal Atmospheric Glow Orb */}
          <div className="absolute top-1/4 left-1/4 w-[480px] h-[480px] bg-teal-500/15 rounded-full blur-[130px] pointer-events-none" />
        </div>

        {/* Giant Faded Outline Display Watermark behind content */}
        <div className="absolute top-24 left-6 text-[15vw] font-display font-black text-transparent stroke-text select-none pointer-events-none opacity-20 z-0 leading-none">
          BEAST MODE
        </div>

        {/* Content Container (Left-aligned cinematic layout matching references) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="max-w-2xl lg:max-w-3xl space-y-6 sm:space-y-7">

            {/* OLD CODE (commented by AI) - Awkward top pill badge removed per user request */}
            {/*
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/80 border border-teal-500/40 text-teal-300 text-xs font-display font-bold uppercase tracking-wider backdrop-blur-md shadow-lg"
            >
              <span className="w-2 h-2 rounded-full bg-[#2DE2C8] animate-ping" />
              <span>ONLINE PERSONAL TRAINING &amp; LIVE GROUP FITNESS</span>
            </motion.div>
            */}
            {/* NEW CODE - Removed awkward pill badge */}

            {/* Massive Athletic Display Headline (Matches reference mockups: BUILD YOUR BODY) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] tracking-tight text-white uppercase leading-[0.92]">
                BUILD YOUR BODY.<br />
                <span className="gradient-teal-sky-text drop-shadow-[0_0_35px_rgba(45,226,200,0.35)]">
                  STAY CONSISTENT.
                </span>
              </h1>
            </motion.div>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-xl font-normal leading-relaxed drop-shadow"
            >
              Personalized 1-on-1 personal training &amp; live interactive online group fitness classes. Train from anywhere with certified master coaches. Real results, guaranteed consistency.
            </motion.p>

            {/* Action Buttons (Matches reference mockups 1 & 2: Join Now + Secondary) */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1"
            >
              {/* Primary Power Coral CTA */}
              <button
                onClick={() => onOpenLeadModal({ program: 'Personal Training', plan: 'Transformation' })}
                className="btn-power-coral btn-shine px-8 py-4 rounded-xl text-base font-bold flex items-center justify-center gap-2.5 cursor-pointer shadow-coral-glow hover:scale-[1.02] active:scale-[0.98] transition-all group"
              >
                <span>Join Now</span>
                <ArrowRight size={19} className="group-hover:translate-x-1.5 transition-transform" />
              </button>

              {/* Secondary CTA */}
              <button
                onClick={() => onNavigateSection('group-classes')}
                className="px-7 py-4 rounded-xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-700/80 text-white font-bold text-base flex items-center justify-center gap-2.5 backdrop-blur-md hover:border-teal-400/50 transition-all cursor-pointer shadow-lg"
              >
                <span>Explore Group Classes</span>
                <ArrowRight size={18} className="text-teal-400" />
              </button>
            </motion.div>

            {/* Member Trust & 5-Star Rating Cluster (Matches reference mockup 2) */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center gap-4 pt-1"
            >
              {/* Member Avatars */}
              <div className="flex -space-x-2.5">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"
                  alt="Member"
                  className="w-10 h-10 rounded-full border-2 border-[#0E1420] object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80"
                  alt="Member"
                  className="w-10 h-10 rounded-full border-2 border-[#0E1420] object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&h=100&q=80"
                  alt="Member"
                  className="w-10 h-10 rounded-full border-2 border-[#0E1420] object-cover"
                />
                <div className="w-10 h-10 rounded-full border-2 border-[#0E1420] bg-teal-600 text-white flex items-center justify-center text-xs font-bold font-display">
                  +6k
                </div>
              </div>

              {/* Star Rating & Text */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-xs font-bold text-white ml-1.5">5.0</span>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  Trusted by 6,000+ members worldwide
                </span>
              </div>
            </motion.div>

            {/* Athletic Category Tag Pills (Matches reference mockup 2) */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="pt-1 flex flex-wrap gap-2 sm:gap-2.5"
            >
              {[
                'Personal Training',
                'Live Group Classes',
                'HIIT & Tabata',
                'Strength & Conditioning',
                'Functional Workouts',
                'Custom Nutrition',
              ].map((pill, idx) => (
                <button
                  key={idx}
                  onClick={() => onNavigateSection('personal-training')}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-teal-500/50 text-slate-300 hover:text-white text-xs font-medium backdrop-blur-sm transition-all cursor-pointer"
                >
                  {pill}
                </button>
              ))}
            </motion.div>

          </div>
        </div>

      </div>

      {/* ================= DARK MARQUEE TICKER BAND ================= */}
      <GymMarqueeTicker />

      {/* ================= CHOOSE HOW YOU WANT TO TRAIN (DARK ACCENT SECTION) ================= */}
      <div data-nav-theme="dark" className="relative py-28 bg-[#0E1420] text-white overflow-hidden">
        {/* Background Blueprint Grid & Noise Texture */}
        <div className="absolute inset-0 bg-blueprint-grid opacity-30 pointer-events-none" />
        <div className="absolute inset-0 bg-noise opacity-40 pointer-events-none" />

        {/* Huge Watermark Word */}
        <div className="absolute top-8 right-4 text-[16vw] watermark-text opacity-30 z-0">
          POWER
        </div>

        {/* Glow orbs */}
        <div className="absolute top-1/2 left-10 w-96 h-96 bg-[#1FB5A3]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#3B9BD4]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-display font-extrabold uppercase tracking-widest text-[#2DE2C8] bg-[#111B2E] border border-[#2A3547] px-4 py-1.5 rounded-full shadow-sm">
              PROGRAM TRACKS
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-4 tracking-tight">
              Choose How You Want To Train
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-2">
              Whether you need dedicated individual accountability or vibrant group energy, we have the ideal plan.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">

            {/* Card 1: Personal Training (Light Card on Dark Background for High Contrast) */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 relative flex flex-col justify-between overflow-hidden group shadow-2xl border border-slate-100 hover:-translate-y-1.5 transition-all duration-300">
              <div className="absolute top-0 right-0 w-36 h-36 bg-teal-100/60 rounded-full blur-2xl group-hover:scale-125 transition-transform" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-display font-extrabold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200/60 px-3 py-1 rounded-full">
                    1-on-1 FOCUSED
                  </span>
                  <div className="w-11 h-11 rounded-2xl gradient-teal-sky text-white flex items-center justify-center shadow-md">
                    <Target size={22} />
                  </div>
                </div>

                <h3 className="font-heading text-2xl sm:text-3xl font-black text-slate-900 mb-2">
                  Personal Training
                </h3>
                <p className="text-teal-700 font-bold text-sm mb-6">
                  1-on-1 Coaching Built Around You.
                </p>

                <ul className="space-y-3.5 mb-8">
                  {[
                    'Personalized workout plan',
                    'Goal-based training',
                    'Expert coach guidance',
                    'Progress tracking',
                    'Nutrition guidance',
                    'Flexible online sessions',
                  ].map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                      <CheckCircle2 size={18} className="text-teal-500 shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => onNavigateSection('personal-training')}
                className="w-full btn-primary-gradient px-6 py-4 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-teal-glow group/btn"
              >
                <span>Explore Personal Training</span>
                <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Card 2: Online Group Classes (Light Card on Dark Background) */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 relative flex flex-col justify-between overflow-hidden group shadow-2xl border border-slate-100 hover:-translate-y-1.5 transition-all duration-300">
              <div className="absolute top-0 right-0 w-36 h-36 bg-sky-100/60 rounded-full blur-2xl group-hover:scale-125 transition-transform" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-display font-extrabold uppercase tracking-wider text-sky-800 bg-sky-50 border border-sky-200/60 px-3 py-1 rounded-full">
                    LIVE COMMUNITY
                  </span>
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center shadow-md">
                    <Users size={22} />
                  </div>
                </div>

                <h3 className="font-heading text-2xl sm:text-3xl font-black text-slate-900 mb-2">
                  Online Group Classes
                </h3>
                <p className="text-sky-700 font-bold text-sm mb-6">
                  Live Workouts. Real Coaches. Real Community.
                </p>

                <ul className="space-y-3.5 mb-8">
                  {[
                    'Live instructor-led workouts',
                    'Multiple class types',
                    'Weekly schedule',
                    'Beginner friendly',
                    'Community motivation',
                    'Train from home',
                  ].map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                      <CheckCircle2 size={18} className="text-sky-500 shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => onNavigateSection('group-classes')}
                className="w-full btn-primary-gradient px-6 py-4 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-teal-glow group/btn"
              >
                <span>Explore Group Classes</span>
                <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

        </div>

        {/* Slanted Bottom Divider Transitioning back */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-transparent to-transparent pointer-events-none" />
      </div>

      {/* ================= LIGHT CONTENT SECTION: WHY WELLWIGEN & HOW IT WORKS ================= */}
      <div data-nav-theme="light" className="relative py-24 bg-transparent overflow-hidden">

        {/* Huge Watermark */}
        <div className="absolute top-1/4 -right-10 text-[18vw] watermark-text-light opacity-40 z-0">
          COMMUNITY
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* ================= WHY WELLWIGEN ================= */}
          <div className="mb-28">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="text-xs font-display font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 border border-teal-200 px-4 py-1.5 rounded-full">
                THE WELLWIGEN ADVANTAGE
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
                Why Wellwigen? More Than Just Workouts. It's a Fitness Community.
              </h2>
              <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
                We believe in real people, real support and real results. With expert coaches, flexible training and a motivating community, Wellwigen helps you stay consistent and achieve your goals.
              </p>
            </div>

            {/* 6 Feature Tiles */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {WHY_WELLWIGEN_TILES.map((tile, idx) => (
                <div
                  key={idx}
                  className="card-soft p-6 border border-slate-200/90 flex flex-col justify-between group hover:border-teal-400"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-soft-sm border border-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {getTileIcon(tile.icon)}
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-slate-900 mb-1.5">
                      {tile.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {tile.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ================= HOW WELLWIGEN WORKS ================= */}
          <div className="mb-28">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-display font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 border border-teal-200 px-4 py-1.5 rounded-full">
                HOW IT WORKS
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
                How Wellwigen Works - Simple steps. Real results.
              </h2>
            </div>

            <div className="relative">
              {/* Connecting Line for desktop */}
              <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-1 bg-gradient-to-r from-teal-400 via-sky-400 to-teal-400 rounded-full -translate-y-1/2 z-0" />

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                {HOW_IT_WORKS_STEPS.map((step) => (
                  <div
                    key={step.step}
                    className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft-sm text-center flex flex-col items-center hover:shadow-md transition-shadow"
                  >
                    <div className="w-12 h-12 rounded-full gradient-teal-sky text-white font-display font-black text-lg flex items-center justify-center shadow-teal-glow mb-4">
                      {step.step}
                    </div>
                    <h3 className="font-heading text-base font-bold text-slate-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ================= FEATURE BANNERS ================= */}
          <div className="grid lg:grid-cols-2 gap-8 mb-28">

            {/* Banner 1: Your Goals. Your Focus. */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-8 sm:p-10 text-white min-h-[380px] group border border-teal-500/30">
              {/* Background Photo */}
              <img
                src="/images/card_goals_focus.jpg"
                alt="Athletes performing kettlebell workouts during personal training"
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              {/* Balanced scrim: keeps athletes & gym details clearly visible while guaranteeing word priority */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-slate-950/20 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/35 pointer-events-none" />

              <div className="relative z-10 mb-8 max-w-md">
                <span className="inline-block text-xs font-display font-extrabold uppercase tracking-widest text-[#2DE2C8] bg-slate-950/80 border border-teal-400/60 px-3.5 py-1 rounded-full backdrop-blur-md shadow-lg">
                  1-ON-1 FOCUS
                </span>
                <h3 className="font-heading text-3xl sm:text-4xl font-black mt-3 leading-tight text-white drop-shadow-[0_4px_14px_rgba(0,0,0,0.95)]">
                  Your Goals.{' '}
                  <span className="text-[#2DE2C8] drop-shadow-[0_0_20px_rgba(45,226,200,0.45)]">
                    Your Focus.
                  </span>
                </h3>
                <p className="text-sm sm:text-base text-white/95 font-medium mt-2.5 max-w-sm leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                  Get customized training, expert guidance and real progress — all from the comfort of your home.
                </p>
              </div>

              <div className="relative z-10">
                <button
                  onClick={() => onNavigateSection('personal-training')}
                  className="bg-white text-slate-900 hover:bg-teal-50 font-bold px-6 py-3 rounded-full text-sm inline-flex items-center gap-2 shadow-xl transition-all hover:scale-105 cursor-pointer group/btn"
                >
                  <span>Explore Personal Training</span>
                  <ArrowRight size={16} className="text-teal-600 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Banner 2: Live Classes. Real Energy. Better Results. */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-display font-bold uppercase tracking-widest text-sky-700 bg-sky-50 px-3 py-1 rounded-full">
                    ALL CLASS TYPES
                  </span>
                  <button
                    onClick={() => onNavigateSection('group-classes')}
                    className="text-xs font-bold text-teal-600 hover:underline inline-flex items-center gap-1"
                  >
                    <span>View All Classes</span>
                    <ArrowRight size={12} />
                  </button>
                </div>

                <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
                  Live Classes. Real Energy. Better Results.
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mb-6">
                  Four distinct class disciplines to keep every workout exhilarating and well-rounded.
                </p>

                {/* 4 Class Chips */}
                <div className="grid grid-cols-2 gap-3">
                  {CLASS_TYPES.map((cls) => (
                    <div
                      key={cls.id}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-teal-300 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-display font-black text-sm text-slate-900">{cls.name}</span>
                        <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                          {cls.tag}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2">{cls.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* ================= REAL PEOPLE. REAL RESULTS (TESTIMONIALS) ================= */}
          <div className="mb-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-display font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 border border-teal-200 px-4 py-1.5 rounded-full">
                COMMUNITY VOICES
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
                Real People. Real Results.
              </h2>
              <p className="text-slate-600 text-sm mt-2">
                Hear from our Wellwigen members achieving authentic health transformations.
              </p>
            </div>

            {/* Testimonial Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {HOME_TESTIMONIALS.map((t) => (
                <div
                  key={t.id}
                  className="card-soft p-6 border border-slate-200/80 flex flex-col justify-between hover:border-teal-300 transition-all"
                >
                  <div>
                    {/* Star Rating */}
                    <div className="flex items-center gap-1 mb-4 text-amber-400">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} size={15} className="fill-amber-400" />
                      ))}
                    </div>

                    <p className="text-sm text-slate-700 italic leading-relaxed mb-6">
                      "{t.quote}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-teal-500/30 shrink-0">
                      <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-heading font-bold text-sm text-slate-900">{t.name}</div>
                      <div className="text-xs font-semibold text-teal-600">{t.result}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
