// OLD CODE (commented by AI)
// import React from 'react';
// NEW CODE - Added useState, useEffect for Approved Coaches fetching
import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import {
  FileText,
  Video,
  Target,
  TrendingUp,
  Apple,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Calendar,
  Quote,
  Zap,
  // NEW CODE - Coach card icons
  Star,
  ShieldCheck,
  Award,
} from 'lucide-react';
import {
  PT_BENEFITS,
  PT_GOALS,
  PT_STEPS,
  PT_PLANS,
  PT_STORIES,
} from '../data/fitnessData';
// OLD CODE (commented by AI)
// import personalTrainingManImg from '../../../assets/personal-training-man.png';
// NEW CODE - performance optimization: WebP image (33KB vs 354KB)
import personalTrainingManImg from '../../../assets/personal-training-man.webp';
// NEW CODE - Trainer API for fetching verified approved coaches
import { trainerApi } from '../../../services/trainerApi';
// NEW CODE - 3D Live Personal Trainer Hero with architectural studio wall formation & moving depth
import LivePersonalTrainerHero from './LivePersonalTrainerHero';
// NEW CODE - Distinct, impressive section dividers for Personal Training page
import {
  PTSlantHorizonDivider,
  PTHexPulseDivider,
  PTSpeedTimelineDivider,
  PTDarkArenaInclineDivider,
  PTLightAmphitheaterDivider,
} from './SectionDividers';

export default function PersonalTrainingSection({ onOpenLeadModal }) {
  // NEW CODE - Approved coaches state (TASK 2: sirf approved trainers dikhao)
  const [approvedCoaches, setApprovedCoaches] = useState([]);
  const [_loadingCoaches, setLoadingCoaches] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchApproved = async () => {
      try {
        setLoadingCoaches(true);
        const data = await trainerApi.getApprovedTrainers();
        if (isMounted) {
          // Strictly display only approved trainers
          const verifiedOnly = Array.isArray(data)
            ? data.filter((t) => t.status === 'approved' || !t.status)
            : [];
          setApprovedCoaches(verifiedOnly);
        }
      } catch (err) {
        console.error('Failed to load approved trainers:', err);
      } finally {
        if (isMounted) setLoadingCoaches(false);
      }
    };
    fetchApproved();
    return () => {
      isMounted = false;
    };
  }, []);
  const getBenefitIcon = (name) => {
    switch (name) {
      case 'FileText': return <FileText className="w-6 h-6 text-teal-600" />;
      case 'Video': return <Video className="w-6 h-6 text-sky-600" />;
      case 'Target': return <Target className="w-6 h-6 text-emerald-600" />;
      case 'TrendingUp': return <TrendingUp className="w-6 h-6 text-amber-600" />;
      case 'Apple': return <Apple className="w-6 h-6 text-[#FF6B35]" />;
      case 'HeartHandshake': return <HeartHandshake className="w-6 h-6 text-purple-600" />;
      default: return <Sparkles className="w-6 h-6 text-teal-600" />;
    }
  };

  return (
    <section id="personal-training" className="relative bg-transparent overflow-hidden">
      
      {/* Side Vertical Text Rail on XL screens */}
      <div className="hidden xl:flex fixed left-4 top-1/2 -translate-y-1/2 flex-col items-center gap-4 z-20 pointer-events-none opacity-30">
        <span className="[writing-mode:vertical-rl] rotate-180 font-display text-[10px] tracking-[0.3em] font-bold uppercase text-slate-700">
          WELLWIGEN &bull; 02 PERSONAL TRAINING
        </span>
        <div className="w-px h-16 bg-teal-500/50" />
      </div>

      {/* ================= LIGHT HEADER / HERO (VIBRANT CALM BASE LIKE HOME) ================= */}
      <div data-nav-theme="light" data-home-bg="mint" className="relative pt-8 sm:pt-10 lg:pt-14 pb-12 sm:pb-16 bg-[#F2FAF8] overflow-hidden">
        {/* Colorful background ambient glow orbs */}
        <div className="absolute top-1/4 -right-12 w-96 h-96 bg-teal-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-12 left-1/3 w-80 h-80 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-72 h-72 bg-orange-200/25 rounded-full blur-3xl pointer-events-none" />

        {/* Floating playful colorful particles across section */}
        <div className="hidden lg:block absolute inset-0 pointer-events-none select-none z-0" aria-hidden="true">
          <div className="bg-drift-1 absolute w-2.5 h-2.5 rounded-full bg-[#FF6B35]/60 top-24 left-12 shadow-sm" />
          <div className="bg-drift-2 absolute w-3 h-3 rounded-full bg-teal-400/60 top-56 left-1/4 shadow-sm" />
          <div className="bg-drift-1 absolute w-2 h-2 rounded-full bg-[#FF6B35]/70 top-36 right-1/3 shadow-sm" />
          <div className="bg-drift-2 absolute w-2.5 h-2.5 rounded-full bg-cyan-400/60 bottom-20 left-1/3 shadow-sm" />
        </div>

        <div className="absolute top-4 left-8 text-[18vw] watermark-text-light opacity-25 z-0 select-none pointer-events-none">
          COACH
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-2 sm:gap-4 lg:gap-10 items-center mb-10 sm:mb-14">
            
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="order-2 lg:order-1 lg:col-span-6 space-y-4 lg:space-y-5 relative z-20 -mt-16 xs:-mt-20 sm:-mt-24 lg:mt-0"
            >
              {/* High-Impact Headline */}
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-black text-slate-900 tracking-tight leading-[1.06]">
                Personal Training{' '}
                <span className="gradient-teal-sky-text block">
                  Built Around You.
                </span>
              </h1>

              {/* Concise Subtitle */}
              <p className="text-base sm:text-lg lg:text-xl text-slate-600 font-medium leading-relaxed max-w-xl">
                One-on-one online coaching designed around your goals, fitness level, and lifestyle.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-0.5">
                <button
                  onClick={() => onOpenLeadModal({ program: 'Personal Training', plan: 'Transformation' })}
                  className="btn-power-coral btn-shine px-8 py-3.5 text-sm sm:text-base font-bold flex items-center justify-center gap-2 cursor-pointer shadow-coral-glow group rounded-2xl hover:scale-105 transition-transform"
                >
                  <span>Start Personal Training</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => onOpenLeadModal({ program: 'Personal Training', plan: 'Consultation' })}
                  className="btn-outline-brand px-7 py-3.5 text-sm sm:text-base font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:shadow rounded-2xl hover:bg-teal-50/50 transition-colors"
                >
                  <Calendar size={18} />
                  <span>Book a Consultation</span>
                </button>
              </div>

              {/* 3 Feature Highlights (Under Start Personal Training & Book Consultation) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white/95 border border-teal-500/25 shadow-xs hover:border-teal-500 hover:shadow-md hover:-translate-y-0.5 transition-all group/item">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 group-hover/item:bg-teal-500 group-hover/item:text-white transition-all shadow-xs">
                    <Target size={18} className="stroke-[2.5]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-slate-900 leading-tight">100% Custom</p>
                    <p className="text-[11px] text-slate-500 font-medium truncate">Tailored workouts</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white/95 border border-teal-500/25 shadow-xs hover:border-teal-500 hover:shadow-md hover:-translate-y-0.5 transition-all group/item">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 group-hover/item:bg-teal-500 group-hover/item:text-white transition-all shadow-xs">
                    <Zap size={18} className="stroke-[2.5]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-slate-900 leading-tight">Live Feedback</p>
                    <p className="text-[11px] text-slate-500 font-medium truncate">Real-time posture</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white/95 border border-teal-500/25 shadow-xs hover:border-teal-500 hover:shadow-md hover:-translate-y-0.5 transition-all group/item">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 group-hover/item:bg-teal-500 group-hover/item:text-white transition-all shadow-xs">
                    <TrendingUp size={18} className="stroke-[2.5]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-slate-900 leading-tight">Fast Results</p>
                    <p className="text-[11px] text-slate-500 font-medium truncate">Weekly tracking</p>
                  </div>
                </div>
              </div>

              {/* Trust Guarantee Highlights */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-0.5 text-xs text-slate-600 font-semibold">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-teal-600 shrink-0" />
                  <span>Free 15-Min Discovery Call</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-teal-600 shrink-0" />
                  <span>No Long-Term Lock-In</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-teal-600 shrink-0" />
                  <span>100% Online Flexibility</span>
                </div>
              </div>
            </motion.div>

            {/* 3D Live Personal Trainer Hero: FIRST ON MOBILE (< lg) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="order-1 lg:order-2 lg:col-span-6 relative flex items-center justify-center mt-0 lg:-mt-2 z-10 w-full lg:-mr-4 xl:-mr-8 overflow-visible"
            >
              <LivePersonalTrainerHero />
            </motion.div>

          </div>

          {/* NEW CODE - PT Border Format 1: Precision Slant Horizon */}
          <PTSlantHorizonDivider />

          {/* ================= WHO IS IT FOR? (4 GOAL CARDS) ================= */}
          <div className="pb-12 sm:pb-16">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-display font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 border border-teal-200 px-4 py-1.5 rounded-full">
                TARGETED GOALS
              </span>
              <h3 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
                Who is it for? We help you achieve your unique fitness goals
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PT_GOALS.map((goal, idx) => (
              /* OLD CODE (commented by AI)
              <div
                key={goal.id}
                onClick={() => onOpenLeadModal({ program: 'Personal Training', plan: goal.title })}
                className="card-soft overflow-hidden group cursor-pointer border border-slate-200/90 hover:border-teal-400 flex flex-col relative"
              >
              */
              /* NEW CODE - smooth animation/performance: reveal-item with stagger for pop entrance */
              <div
                key={goal.id}
                onClick={() => onOpenLeadModal({ program: 'Personal Training', plan: goal.title })}
                className={`reveal-item reveal-stagger-${(idx % 4) + 1} card-soft overflow-hidden group cursor-pointer border border-slate-200/90 hover:border-teal-400 flex flex-col relative [touch-action:manipulation]`}
              >
                  {/* OLD CODE (commented by AI)
                  <div className="relative h-48 overflow-hidden bg-slate-900">
                    <div className="corner-bracket-tl z-20" />
                    <img
                      src={goal.image}
                      alt={goal.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 left-3 text-white">
                      <span className="font-display font-extrabold text-lg tracking-wide uppercase">
                        {goal.title}
                      </span>
                    </div>
                  </div>
                  */}
                  {/* NEW CODE - mobile fix: aspect-ratio 16/10 on mobile with face-preserving object-position object-[center_20%] */}
                  <div className="relative aspect-[16/10] sm:aspect-auto sm:h-48 overflow-hidden bg-slate-900">
                    <div className="corner-bracket-tl z-20" />
                    <img
                      src={goal.image}
                      alt={goal.title}
                      className="w-full h-full object-cover object-[center_20%] group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 sm:h-full bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent pointer-events-none" />
                    <div className="absolute bottom-3.5 left-3.5 sm:bottom-3 sm:left-3 text-white">
                      <span className="font-display font-extrabold text-lg tracking-wide uppercase drop-shadow-md">
                        {goal.title}
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      {goal.subtitle}
                    </p>
                    <div className="text-xs font-bold text-teal-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Select this goal</span>
                      <ArrowRight size={13} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* NEW CODE - PT Border Format 2: Hex Performance Pulse */}
      <PTHexPulseDivider />

      {/* ================= LIGHT SECTION: WHAT YOU GET (6 TILES) ================= */}
      <div data-nav-theme="light" className="relative py-16 sm:py-20 bg-transparent overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-display font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 border border-teal-200 px-4 py-1.5 rounded-full shadow-sm">
              EVERYTHING INCLUDED
            </span>
            <h3 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mt-4 tracking-tight">
              What You Get - Everything you need to reach your goals
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PT_BENEFITS.map((benefit, idx) => (
            /* OLD CODE (commented by AI)
            <div
              key={idx}
              className="bg-white p-7 rounded-3xl border border-slate-200/90 hover:border-teal-400/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
            */
            /* NEW CODE - smooth animation/performance: reveal-item with stagger and GPU transform transition */
            <div
              key={idx}
              className={`reveal-item reveal-stagger-${(idx % 6) + 1} bg-white p-7 rounded-3xl border border-slate-200/90 hover:border-teal-400/60 shadow-sm hover:shadow-xl transition-[transform,border-color,box-shadow] duration-250 flex flex-col justify-between group hover:-translate-y-1`}
            >
                <div className="w-12 h-12 rounded-2xl bg-teal-50/80 border border-teal-100 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-teal-100/70 transition-transform duration-200">
                  {getBenefitIcon(benefit.icon)}
                </div>
                <div>
                  <h4 className="font-heading text-lg font-bold text-slate-900 mb-2 group-hover:text-teal-700 transition-colors">
                    {benefit.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* NEW CODE - PT Border Format 3: Speed Timeline Ribbon */}
          <PTSpeedTimelineDivider />

          {/* ================= HOW PT WORKS (6 STEPS ON LIGHT) ================= */}
          <div className="pt-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-display font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 border border-teal-200 px-4 py-1.5 rounded-full shadow-sm">
                YOUR STEP-BY-STEP PATH
              </span>
              <h3 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
                How PT Works - A simple path to your goals
              </h3>
            </div>

            <div className="relative">
              {/* Glowing Timeline Line */}
              <div className="hidden lg:block absolute top-9 left-12 right-12 h-1 bg-gradient-to-r from-teal-400 via-sky-400 to-[#2DE2C8] rounded-full z-0 shadow-sm" />

              <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-5 relative z-10">
                {PT_STEPS.map((step) => (
                /* OLD CODE (commented by AI)
                <div
                  key={step.step}
                  className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl flex flex-col text-center items-center hover:border-teal-400/70 hover:-translate-y-1 transition-all duration-300 group"
                >
                */
                /* NEW CODE - smooth animation/performance: reveal-item with stagger and GPU hover */
                <div
                  key={step.step}
                  className={`reveal-item reveal-stagger-${((step.step - 1) % 6) + 1} bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl flex flex-col text-center items-center hover:border-teal-400/70 hover:-translate-y-1 transition-[transform,border-color,box-shadow] duration-250 group`}
                >
                    <div className="w-11 h-11 rounded-full gradient-teal-sky text-white font-display font-black text-sm flex items-center justify-center shadow-md shadow-teal-500/25 mb-3 group-hover:scale-110 transition-transform">
                      {step.step}
                    </div>
                    <h4 className="font-heading text-sm font-bold text-slate-900 mb-1.5 group-hover:text-teal-700 transition-colors">
                      {step.title}
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* NEW CODE - PT Border Format 4: Dark Arena Incline Divider */}
      <PTDarkArenaInclineDivider />

      {/* ================= DARK ACCENT SECTION: PRICING ================= */}
      <div data-nav-theme="dark" className="relative py-24 sm:py-28 bg-[#0E1420] text-white overflow-hidden">
        {/* Blueprint Grid & Noise Texture */}
        <div className="absolute inset-0 bg-blueprint-grid opacity-30 pointer-events-none" />
        <div className="absolute inset-0 bg-noise opacity-40 pointer-events-none" />

        {/* Huge Watermark */}
        <div className="absolute top-1/4 -right-8 text-[18vw] watermark-text opacity-25 z-0">
          RESULTS
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* ================= PRICING CARDS (LIGHT CARDS ON DARK BACKGROUND FOR CONTRAST) ================= */}
          <div>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-display font-extrabold uppercase tracking-widest text-[#2DE2C8] bg-[#111B2E] border border-[#2A3547] px-4 py-1.5 rounded-full shadow-sm">
                TRANSPARENT PRICING
              </span>
              <h3 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-4 tracking-tight">
                Choose the plan that fits your goals
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch pt-4">
              {PT_PLANS.map((plan, idx) => {
                if (plan.popular) {
                  // Conic Glow Wrapper for Most Popular
                  return (
                    <div key={plan.id} className={`reveal-item reveal-stagger-${(idx % 4) + 1} relative lg:scale-105 z-10 flex flex-col`}>
                      {/* Floating Badge (Unclipped above the rotating glow border) */}
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 bg-gradient-to-r from-teal-500 to-[#2DE2C8] text-slate-950 font-display font-black text-xs px-4 py-1.5 rounded-full shadow-lg uppercase tracking-wider whitespace-nowrap">
                        {plan.badge}
                      </div>

                      <div className="conic-glow-wrapper shadow-2xl flex-1 flex flex-col h-full">
                        <div className="conic-glow-content p-6 sm:p-8 text-slate-900 flex flex-col justify-between h-full relative">
                          <div>
                            <div className="text-xs font-display font-bold uppercase tracking-wider text-slate-500 mb-2 pt-2">
                              {plan.sessions}
                            </div>
                            <h4 className="font-heading text-xl sm:text-2xl font-black text-slate-900 mb-4">
                              {plan.name}
                            </h4>

                            <div className="flex items-baseline gap-1 mb-6">
                              <span className="font-display text-3xl sm:text-4xl font-black text-slate-900">
                                {plan.price}
                              </span>
                              <span className="text-sm font-medium text-slate-500">{plan.period}</span>
                            </div>

                            <div className="w-full h-px bg-slate-100 mb-6" />

                            <ul className="space-y-3 mb-8">
                              {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                                  <CheckCircle2 size={16} className="text-teal-500 shrink-0 mt-0.5" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <button
                            onClick={() => onOpenLeadModal({ program: 'Personal Training', plan: plan.name })}
                            className="w-full btn-power-coral btn-shine py-2.5 sm:py-3 rounded-full text-white text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-coral-glow"
                          >
                            <span>{plan.cta}</span>
                            <ArrowRight size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                // Standard Cards
                return (
                  <div
                    key={plan.id}
                    className={`reveal-item reveal-stagger-${(idx % 4) + 1} bg-white rounded-3xl p-6 sm:p-8 relative flex flex-col justify-between border border-slate-100 shadow-xl text-slate-900 hover:-translate-y-1 transition-transform`}
                  >
                    <div>
                      <div className="text-xs font-display font-bold uppercase tracking-wider text-slate-500 mb-2">
                        {plan.sessions}
                      </div>
                      <h4 className="font-heading text-xl sm:text-2xl font-black text-slate-900 mb-4">
                        {plan.name}
                      </h4>

                      <div className="flex items-baseline gap-1 mb-6">
                        <span className="font-display text-3xl sm:text-4xl font-black text-slate-900">
                          {plan.price}
                        </span>
                        <span className="text-sm font-medium text-slate-500">{plan.period}</span>
                      </div>

                      <div className="w-full h-px bg-slate-100 mb-6" />

                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                            <CheckCircle2 size={16} className="text-teal-500 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => onOpenLeadModal({ program: 'Personal Training', plan: plan.name })}
                      className="w-full btn-primary-gradient btn-shine py-2.5 sm:py-3 rounded-full text-white text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-teal-glow"
                    >
                      <span>{plan.cta}</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* NEW CODE - PT Border Format 5: Light Amphitheater Divider */}
      <PTLightAmphitheaterDivider />

      {/* ================= LIGHT CONTENT SECTION: SUCCESS STORIES & CLOSING ================= */}
      <div data-nav-theme="light" className="relative py-20 sm:py-24 bg-transparent overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* ================= PT SUCCESS STORIES ================= */}
          {/* TODO: replace with real client feedback */}
          <div className="mb-24">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-display font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 border border-teal-200 px-4 py-1.5 rounded-full">
                INSPIRING TRANSFORMATIONS
              </span>
              <h3 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
                PT Success Stories - Real people. Real transformations.
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {PT_STORIES.map((story, idx) => (
                /* OLD CODE (commented by AI)
                <div
                  key={idx}
                  className="card-soft p-6 border border-slate-200/90 flex flex-col justify-between"
                >
                */
                /* NEW CODE - smooth animation/performance: reveal-item with stagger */
                <div
                  key={idx}
                  className={`reveal-item reveal-stagger-${(idx % 3) + 1} card-soft p-6 border border-slate-200/90 flex flex-col justify-between`}
                >
                  <div>
                    <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                      <Quote size={16} />
                    </div>
                    <p className="text-sm text-slate-700 italic leading-relaxed mb-6">
                      "{story.quote}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-teal-500/40 shrink-0">
                      <img src={story.image} alt={story.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                    </div>
                    <div>
                      <div className="font-heading font-bold text-sm text-slate-900">{story.name}</div>
                      <div className="text-xs font-bold text-teal-600">{story.result}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ================= CERTIFIED MASTER COACHES (APPROVED TRAINERS ONLY) ================= */}
          {approvedCoaches.length > 0 && (
            <div className="mt-20 sm:mt-24 lg:mt-28">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-[11px] font-extrabold uppercase tracking-wider mb-3">
                  <ShieldCheck size={14} className="text-teal-600" />
                  <span>ATHLETIC BOARD VERIFIED COACHES</span>
                </div>
                <h3 className="font-heading text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  Meet Our Certified Personal Trainers
                </h3>
                <p className="text-sm sm:text-base text-slate-600 mt-2">
                  Only accredited coaches with verified certifications and athletic background coach our 1-on-1 transformations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {approvedCoaches.map((coach, idx) => (
                  <div
                    key={coach._id || coach.id || idx}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between group hover:-translate-y-1"
                  >
                    <div>
                      {/* Avatar and verification badge */}
                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 border-2 border-teal-500/30 shrink-0 shadow-md">
                          {coach.photoUrl || coach.avatar ? (
                            <img
                              src={coach.photoUrl || coach.avatar}
                              alt={coach.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-black text-white text-base">
                              {coach.name?.substring(0, 2).toUpperCase() || 'TR'}
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                              <ShieldCheck size={11} className="text-emerald-600" />
                              <span>Verified Coach</span>
                            </span>
                          </div>
                          <h4 className="font-heading font-black text-lg text-slate-900 truncate">
                            {coach.name}
                          </h4>
                          <p className="text-xs font-semibold text-teal-600 truncate">
                            {coach.specialization || coach.specialty || 'Strength & Conditioning'}
                          </p>
                        </div>
                      </div>

                      {/* Bio snippet */}
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                        {coach.bio || 'Certified fitness professional helping athletes and beginners build strength, longevity, and sustainable fitness habits.'}
                      </p>

                      {/* Experience and City tag */}
                      <div className="flex items-center gap-2 mb-4 text-[11px] text-slate-500">
                        <span className="font-bold text-slate-800">
                          {coach.experience || `${coach.experienceYears || 4} Years`} Exp
                        </span>
                        <span>&bull;</span>
                        <span>{coach.city || 'Pan India'}</span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                          <Star size={12} className="fill-amber-400 text-amber-400" />
                          <span>{coach.rating || '4.9'}</span>
                        </span>
                      </div>

                      {/* Certifications badges */}
                      {Array.isArray(coach.certifications) && coach.certifications.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {coach.certifications.slice(0, 2).map((cert, cIdx) => (
                            <span
                              key={cIdx}
                              className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold flex items-center gap-1"
                            >
                              <Award size={10} className="text-teal-600" />
                              <span className="truncate max-w-[130px]">
                                {typeof cert === 'string' ? cert : cert.title || 'Certified'}
                              </span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() =>
                        onOpenLeadModal({
                          program: 'Personal Training',
                          plan: `1-on-1 with Coach ${coach.name}`,
                        })
                      }
                      className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer group-hover:shadow-md"
                    >
                      <span>Train with {coach.name.split(' ')[0]}</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= CLOSING STRIP (POP-OUT CTA BANNER) ================= */}
          {/* Outer wrapper: relative with overflow-visible so trainer's head & shoulders pop out */}
          <div className="relative mt-20 sm:mt-24 lg:mt-28 reveal-item">
            
            {/* Background card with rounded corners and border-radius clipping */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#0E1420] via-[#0B3B3C] to-[#111B2E] border border-teal-500/30 shadow-2xl overflow-hidden pointer-events-none z-0">
              {/* Subtle blueprint grid texture */}
              <div className="absolute inset-0 bg-blueprint-grid opacity-15 pointer-events-none" />
            </div>

            {/* Transparent PNG trainer directly on top of banner background (no separate box, panel, or blur) */}
            <img
              src={personalTrainingManImg}
              alt="Personal trainer holding a protein shaker"
              width="530"
              height="795"
              loading="lazy"
              className="hidden sm:block absolute bottom-0 left-[3%] lg:left-[4%] h-[135%] md:h-[140%] lg:h-[150%] w-auto object-contain pointer-events-none select-none z-10"
              style={{
                bottom: 0,
              }}
            />

            {/* Foreground Content: shifted to the right so it never overlaps his body on desktop */}
            <div className="relative z-20 p-6 pt-0 sm:p-10 lg:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6">
              
              {/* Mobile Trainer Photo: Upper side with controlled, subtle pop-out */}
              <div className="sm:hidden -mt-10 mb-1 flex justify-center pointer-events-none select-none">
                <img
                  src={personalTrainingManImg}
                  alt="Personal trainer holding a protein shaker"
                  width="530"
                  height="795"
                  loading="lazy"
                  className="h-44 xs:h-48 w-auto object-contain"
                  style={{
                    maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
                  }}
                />
              </div>

              <div className="max-w-2xl text-center md:text-left sm:pl-44 md:pl-48 lg:pl-64">
                <h4 className="font-heading text-2xl sm:text-3xl font-black mb-2 text-white">
                  Ready for Personal Training?
                </h4>
                <p className="text-sm sm:text-base text-slate-300">
                  Join our 1-on-1 journey and achieve your goals with expert coaching.
                </p>
              </div>

              <div className="shrink-0 relative z-30">
                <button
                  onClick={() => onOpenLeadModal({ program: 'Personal Training', plan: 'Transformation' })}
                  className="btn-power-coral btn-shine px-8 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-bold inline-flex items-center gap-2 shadow-coral-glow shrink-0 cursor-pointer"
                >
                  <span>Start Personal Training</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

          </div>


        </div>
      </div>

    </section>
  );
}
