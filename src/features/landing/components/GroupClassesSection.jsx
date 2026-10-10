import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Video,
  Award,
  Users,
  Activity,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  CalendarCheck,
  UserCheck,
  Layers,
  ChevronRight,
  Flame,
  Zap,
} from 'lucide-react';
import {
  GROUP_HERO_CHIPS,
  WEEKLY_CHALLENGES,
  GROUP_PLANS,
  WHY_GROUP_CLASSES_TILES,
} from '../data/fitnessData';

export default function GroupClassesSection({ onOpenLeadModal }) {
  const currentDayIndex = new Date().getDay(); // 0 is Sun, 1 is Mon, etc.
  const carouselRef = useRef(null);

  const getHeroChipIcon = (name) => {
    switch (name) {
      case 'Video': return <Video size={16} className="text-teal-600" />;
      case 'Award': return <Award size={16} className="text-sky-600" />;
      case 'Users': return <Users size={16} className="text-emerald-600" />;
      case 'Activity': return <Activity size={16} className="text-purple-600" />;
      default: return <Sparkles size={16} className="text-teal-600" />;
    }
  };

  const getWhyTileIcon = (name) => {
    switch (name) {
      case 'CalendarCheck': return <CalendarCheck className="w-6 h-6 text-teal-600" />;
      case 'UserCheck': return <UserCheck className="w-6 h-6 text-sky-600" />;
      case 'Layers': return <Layers className="w-6 h-6 text-amber-600" />;
      case 'Users': return <Users className="w-6 h-6 text-purple-600" />;
      case 'Activity': return <Activity className="w-6 h-6 text-emerald-600" />;
      default: return <Sparkles className="w-6 h-6 text-teal-600" />;
    }
  };

  // NEW CODE - mobile fix: smart per-image object positions so heads/faces are never cut off on mobile cards
  const getChallengeImagePosition = (dayCode) => {
    switch (dayCode) {
      case 'TUE': return 'object-[52%_15%] sm:object-center'; // jumping athlete midair
      case 'THU': return 'object-[50%_18%] sm:object-center'; // Thor heavy deadlifter head & eyes
      case 'FRI': return 'object-[50%_12%] sm:object-center'; // dual jumping cardio athletes
      case 'SAT': return 'object-[50%_18%] sm:object-center'; // dumbbell bicep curl athlete
      case 'WED': return 'object-[50%_25%] sm:object-center'; // jungle fit animal crawl posture
      case 'MON': return 'object-[50%_18%] sm:object-center'; // battle ropes athlete
      case 'SUN': return 'object-[55%_15%] sm:object-center'; // yoga mobility pose
      default: return 'object-[center_20%] sm:object-center';
    }
  };

  return (
    <section id="group-classes" className="relative overflow-hidden">

      {/* Side Vertical Text Rail on XL screens */}
      <div className="hidden xl:flex fixed left-4 top-1/2 -translate-y-1/2 flex-col items-center gap-4 z-20 pointer-events-none opacity-30">
        <span className="[writing-mode:vertical-rl] rotate-180 font-display text-[10px] tracking-[0.3em] font-bold uppercase text-slate-700">
          WELLWIGEN &bull; 03 GROUP CLASSES
        </span>
        <div className="w-px h-16 bg-teal-500/50" />
      </div>

      {/* ================= LIGHT HERO (PICTURE 2 EXACT) ================= */}
      <div data-nav-theme="light" className="relative pt-24 pb-16 bg-white hero-white-screen">
        <div className="absolute top-10 left-10 text-[18vw] watermark-text-light opacity-30 z-0">
          ENERGY
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center mb-16">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 space-y-6"
            >
              {/* OLD CODE (commented by AI) - Awkward pill badge removed per user request */}
              {/*
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100/70 border border-teal-200 text-teal-800 text-xs font-display font-extrabold uppercase tracking-wider shadow-sm">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                <span>LIVE ONLINE GROUP FITNESS</span>
              </div>
              */}
              {/* NEW CODE - Removed awkward pill badge */}

              {/* Headline */}
              <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.08]">
                Train Together. Stay Motivated.{' '}
                <span className="gradient-teal-sky-text block sm:inline">
                  Get Stronger.
                </span>
              </h2>

              {/* Subtext */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Join our live, expert-led group classes and be part of a supportive fitness community. Different styles. Same goal &mdash; a healthier, stronger you.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
                <button
                  onClick={() => onOpenLeadModal({ program: 'Group Classes', plan: 'Trial Class' })}
                  className="btn-power-coral btn-shine px-8 py-4 text-sm sm:text-base font-bold flex items-center justify-center gap-2 cursor-pointer shadow-coral-glow group"
                >
                  <span>Join Group Classes</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('weekly-schedule-anchor');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn-outline-brand px-7 py-4 text-sm sm:text-base font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow"
                >
                  <span>View Schedule</span>
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* 4 Chips */}
              <div className="pt-4 grid grid-cols-2 sm:flex sm:flex-wrap gap-2.5">
                {GROUP_HERO_CHIPS.map((chip) => (
                  <div
                    key={chip.id}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/95 border border-slate-200/90 shadow-soft-sm backdrop-blur-sm"
                  >
                    <div className="w-6 h-6 rounded-lg bg-teal-50 flex items-center justify-center">
                      {getHeroChipIcon(chip.icon)}
                    </div>
                    <span className="text-xs font-semibold text-slate-800">{chip.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-900 aspect-[16/10] bg-slate-900 group">
                <div className="corner-bracket-tl z-20" />
                <div className="corner-bracket-br z-20" />

                {/* OLD CODE (commented by AI)
                <img
                  src="/images/group_class_hero.jpg"
                  alt="Energetic group fitness class doing kettlebell squats guided by expert coach in studio"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                */}
                {/* NEW CODE - mobile fix: group class athletes and instructor head & form visibility on mobile */}
                <img
                  src="/images/group_class_hero.jpg"
                  alt="Energetic group fitness class doing kettlebell squats guided by expert coach in studio"
                  className="w-full h-full object-cover object-[50%_25%] sm:object-center group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent pointer-events-none" />

                {/* OLD CODE (commented by AI) - Awkward floating badge on image removed per user request */}
                {/*
                <div className="absolute top-4 right-4 bg-slate-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md border border-slate-700 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span className="text-[10px] font-display font-bold text-white uppercase tracking-wider">Live Online</span>
                </div>
                */}
                {/* NEW CODE - Removed awkward floating badge overlay */}
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* ================= DARK BAND: YOUR WEEKLY CHALLENGE (7 DAYS) ================= */}
      <div data-nav-theme="dark" id="weekly-schedule-anchor" className="relative py-28 bg-[#0E1420] text-white overflow-hidden scroll-mt-20">
        <div className="absolute inset-0 bg-blueprint-grid opacity-30 pointer-events-none" />
        <div className="absolute inset-0 bg-noise opacity-40 pointer-events-none" />

        {/* Watermark */}
        <div className="absolute top-8 left-4 text-[16vw] watermark-text opacity-25 z-0">
          CHALLENGE
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-display font-extrabold uppercase tracking-widest text-[#2DE2C8] bg-[#111B2E] border border-[#2A3547] px-4 py-1.5 rounded-full shadow-sm">
              WEEKLY WORKOUT SCHEDULE
            </span>
            <h3 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white mt-4 tracking-tight">
              Your Weekly Challenge
            </h3>
            <p className="text-slate-300 text-sm sm:text-base mt-2">
              Every day has a challenge. Every workout has a purpose.
            </p>
          </div>

          {/* OLD CODE (commented by AI)
          <div
            ref={carouselRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4 overflow-x-auto pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none"
          >
            {WEEKLY_CHALLENGES.map((item) => {
              const isToday = item.dayIndex === currentDayIndex;

              return (
                <div
                  key={item.dayCode}
                  onClick={() => onOpenLeadModal({ program: 'Group Classes', plan: item.name })}
                  className={`bg-[#111B2E] rounded-2xl overflow-hidden group cursor-pointer border flex flex-col justify-between transition-all duration-300 min-w-[210px] sm:min-w-0 shadow-dark-card ${isToday
                    ? 'ring-2 ring-[#2DE2C8] border-[#2DE2C8] shadow-[0_0_25px_rgba(45,226,200,0.4)] scale-102 z-10'
                    : 'border-[#2A3547] hover:border-teal-400 hover:-translate-y-1'
                    }`}
                >
                  <div>
                    <div className="relative h-32 overflow-hidden bg-slate-900">
                      <img
                        src={item.image}
                        alt={`${item.name} - ${item.type}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111B2E] via-transparent to-transparent pointer-events-none" />

                      <div className="absolute top-2 left-2 bg-slate-950/85 backdrop-blur-sm text-[#2DE2C8] border border-[#2DE2C8]/30 text-[10px] font-display font-black px-2 py-0.5 rounded uppercase tracking-wider">
                        {item.dayCode}
                      </div>

                      {isToday && (
                        <div className="absolute top-2 right-2 bg-[#C6F432] text-slate-950 text-[9px] font-display font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
                          TODAY
                        </div>
                      )}
                    </div>

                    <div className="p-3.5">
                      <div className="font-heading font-extrabold text-sm text-white group-hover:text-[#2DE2C8] transition-colors">
                        {item.name}
                      </div>
                      <div className="text-xs font-semibold text-[#2DE2C8] mt-0.5">
                        {item.type}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <div className="px-3.5 pb-3.5 pt-2 border-t border-[#2A3547] flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock size={12} className="text-[#2DE2C8]" />
                      {item.duration}
                    </span>
                    <span className="text-[#2DE2C8] font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      Join &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          */}

          {/* NEW CODE - mobile fix: taller image (4:3 aspect ratio), smart face-preserving positions, 12px badges, 20px card padding & typography, 44px tap target Join button, no horizontal scroll */}
          <div
            ref={carouselRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-5 sm:gap-4 pb-4 pt-2 px-0 sm:px-0"
          >
            {WEEKLY_CHALLENGES.map((item, idx) => {
              const isToday = item.dayIndex === currentDayIndex;

              return (
                /* OLD CODE (commented by AI)
                <div
                  key={item.dayCode}
                  onClick={() => onOpenLeadModal({ program: 'Group Classes', plan: item.name })}
                  className={`bg-[#111B2E] rounded-2xl overflow-hidden group cursor-pointer border flex flex-col justify-between transition-all duration-300 w-full min-w-0 shadow-dark-card ${isToday
                    ? 'ring-2 ring-[#2DE2C8] border-[#2DE2C8] shadow-[0_0_30px_rgba(45,226,200,0.35)] scale-[1.01] sm:scale-102 z-10'
                    : 'border-[#2A3547] hover:border-teal-400 hover:-translate-y-1'
                    }`}
                >
                */
                /* NEW CODE - smooth animation/performance: reveal-item with stagger and GPU hover */
                <div
                  key={item.dayCode}
                  onClick={() => onOpenLeadModal({ program: 'Group Classes', plan: item.name })}
                  className={`reveal-item reveal-stagger-${(idx % 6) + 1} bg-[#111B2E] rounded-2xl overflow-hidden group cursor-pointer border flex flex-col justify-between transition-[transform,border-color,box-shadow] duration-250 w-full min-w-0 shadow-dark-card [touch-action:manipulation] ${isToday
                    ? 'ring-2 ring-[#2DE2C8] border-[#2DE2C8] shadow-[0_0_30px_rgba(45,226,200,0.35)] scale-[1.01] sm:scale-102 z-10'
                    : 'border-[#2A3547] hover:border-teal-400 hover:-translate-y-1'
                    }`}
                >
                  <div>
                    {/* Thumbnail: Aspect ratio 4/3 on mobile with smart face/body object-position, desktop remains h-32 */}
                    <div className="relative w-full aspect-[4/3] sm:aspect-auto sm:h-32 lg:h-32 overflow-hidden bg-slate-900 rounded-t-2xl">
                      <img
                        src={item.image}
                        alt={`${item.name} - ${item.type}`}
                        className={`w-full h-full object-cover ${getChallengeImagePosition(item.dayCode)} group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-500`}
                        loading="lazy"
                      />
                      {/* Soft gradient overlay on bottom ~35% of the photo so faces stay bright while blending into card navy */}
                      <div className="absolute inset-x-0 bottom-0 h-[40%] sm:h-full bg-gradient-to-t from-[#111B2E] via-[#111B2E]/60 to-transparent pointer-events-none" />

                      {/* Day Code Badge: 12px spacing from top & left */}
                      <div className="absolute top-3 left-3 sm:top-2 sm:left-2 bg-slate-950/85 backdrop-blur-md text-[#2DE2C8] border border-[#2DE2C8]/40 text-xs sm:text-[10px] font-display font-black px-2.5 py-1 sm:px-2 sm:py-0.5 rounded-lg sm:rounded uppercase tracking-wider shadow-md">
                        {item.dayCode}
                      </div>

                      {/* Today Badge: 12px spacing from top & right */}
                      {isToday && (
                        <div className="absolute top-3 right-3 sm:top-2 sm:right-2 bg-[#C6F432] text-slate-950 text-xs sm:text-[9px] font-display font-black px-3 py-1 sm:px-2 sm:py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping" />
                          TODAY
                        </div>
                      )}
                    </div>

                    {/* Content: 18-20px padding on mobile, title 20-22px bold, subtitle 15-16px, description 14.5-15px */}
                    <div className="p-5 sm:p-3.5">
                      <div className="font-heading font-black text-xl sm:text-sm text-white group-hover:text-[#2DE2C8] transition-colors leading-tight">
                        {item.name}
                      </div>
                      <div className="text-[15px] sm:text-xs font-semibold text-[#2DE2C8] mt-1 sm:mt-0.5">
                        {item.type}
                      </div>
                      <p className="text-[14.5px] sm:text-[11px] text-slate-300 sm:text-slate-400 mt-2.5 sm:mt-2 line-clamp-3 sm:line-clamp-2 leading-[1.6]">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {/* Metadata & Tap Target Button (min 44px height on mobile) */}
                  <div className="px-5 py-4 sm:px-3.5 sm:pb-3.5 sm:pt-2 border-t border-[#2A3547] flex items-center justify-between text-sm sm:text-[11px] text-slate-300 sm:text-slate-400">
                    <span className="flex items-center gap-1.5 sm:gap-1 font-medium">
                      <Clock size={16} className="text-[#2DE2C8] sm:w-3 sm:h-3" />
                      <span>{item.duration}</span>
                    </span>
                    <span className="min-h-[44px] px-5 py-2.5 sm:min-h-0 sm:px-0 sm:py-0 rounded-full sm:rounded-none bg-teal-500/15 sm:bg-transparent border border-teal-500/40 sm:border-transparent text-[#2DE2C8] font-bold text-sm sm:text-[11px] flex items-center justify-center gap-1.5 group-hover:bg-[#2DE2C8] group-hover:text-slate-950 transition-[background-color,color] duration-200 active:scale-95 shadow-sm">
                      <span>Join</span>
                      <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* ================= LIGHT SECTION: CHOOSE YOUR PLAN (4 PLAN CARDS) ================= */}
      <div data-nav-theme="light" className="relative py-28 bg-transparent overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="text-center max-w-2xl mx-auto mb-14 relative">
            <span className="text-xs font-display font-extrabold uppercase tracking-widest text-teal-700 bg-teal-100/60 border border-teal-200 px-4 py-1.5 rounded-full">
              MEMBERSHIP TIERS
            </span>
            <h3 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mt-3 tracking-tight">
              Choose Your Plan
            </h3>
            <p className="text-slate-600 text-sm sm:text-base mt-2">
              One membership. All six classes. Find the plan that fits your goals.
            </p>

            {/* Handwritten style badge: "Try before you commit!" */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold mt-4 shadow-sm">
              <Sparkles size={13} className="text-amber-500" />
              <span>Try before you commit!</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch pt-4">
            {GROUP_PLANS.map((plan, idx) => {
              if (plan.primary) {
                // Monthly Plan with Conic Glow
                return (
                  <div key={plan.id} className={`reveal-item reveal-stagger-${(idx % 4) + 1} relative lg:scale-105 z-10 flex flex-col`}>
                    {/* Floating Badge (Unclipped above rotating glow border) */}
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 bg-gradient-to-r from-teal-500 to-[#2DE2C8] text-slate-950 font-display font-black text-[10px] px-3.5 py-1 rounded-full shadow-lg uppercase tracking-wider whitespace-nowrap">
                      {plan.highlightBadge}
                    </div>

                    <div className="conic-glow-wrapper shadow-2xl flex-1 flex flex-col h-full">
                      <div className="conic-glow-content p-6 flex flex-col justify-between h-full relative">
                        <div>
                          <div className="text-xs font-semibold text-slate-400 mb-1 pt-1">
                            {plan.tagline}
                          </div>
                          <h4 className="font-heading text-xl font-black text-slate-900 mb-4">
                            {plan.name}
                          </h4>

                          <div className="flex items-baseline gap-1 mb-1">
                            <span className="font-display text-3xl font-black text-slate-900">
                              {plan.price}
                            </span>
                            <span className="text-xs font-medium text-slate-500">
                              {plan.billingText}
                            </span>
                          </div>

                          <div className="w-full h-px bg-slate-100 my-4" />

                          <ul className="space-y-2.5 mb-8">
                            {plan.features.map((feature, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                                <CheckCircle2 size={15} className="text-teal-500 shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <button
                          onClick={() => onOpenLeadModal({ program: 'Group Classes', plan: plan.name })}
                          className="w-full btn-power-coral btn-shine py-3 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-coral-glow text-white"
                        >
                          <span>{plan.cta}</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                /* OLD CODE (commented by AI)
                <div
                  key={plan.id}
                  className="card-soft p-6 relative flex flex-col justify-between border border-slate-200/90 bg-white hover:border-teal-300 transition-all hover:-translate-y-1"
                >
                */
                /* NEW CODE - smooth animation/performance: reveal-item with stagger and GPU hover */
                <div
                  key={plan.id}
                  className={`reveal-item reveal-stagger-${(idx % 4) + 1} card-soft p-6 relative flex flex-col justify-between border border-slate-200/90 bg-white hover:border-teal-300 transition-[transform,border-color,box-shadow] duration-250 hover:-translate-y-1`}
                >
                  {plan.highlightBadge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-teal-sky text-white text-[10px] font-display font-black px-3 py-0.5 rounded-full shadow-md tracking-wider">
                      {plan.highlightBadge}
                    </div>
                  )}

                  <div>
                    <div className="text-xs font-semibold text-slate-400 mb-1">
                      {plan.tagline}
                    </div>
                    <h4 className="font-heading text-xl font-black text-slate-900 mb-4">
                      {plan.name}
                    </h4>

                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="font-display text-3xl font-black text-slate-900">
                        {plan.price}
                      </span>
                      <span className="text-xs font-medium text-slate-500">
                        {plan.billingText}
                      </span>
                    </div>

                    {plan.subtext && (
                      <div className="text-[11px] font-semibold text-teal-600 mb-4">
                        {plan.subtext}
                      </div>
                    )}

                    <div className="w-full h-px bg-slate-100 my-4" />

                    <ul className="space-y-2.5 mb-8">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 size={15} className="text-teal-500 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => onOpenLeadModal({ program: 'Group Classes', plan: plan.name })}
                    className="w-full btn-primary-gradient btn-shine py-3 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-teal-glow text-white"
                  >
                    <span>{plan.cta}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* ================= DARK TRIAL BAND (JUST RS 99 FOR 1 CLASS) ================= */}
      <div
        data-nav-theme="dark"
        className="relative mt-24 sm:mt-28 lg:mt-32 bg-gradient-to-r from-[#0E1420] via-[#0B3B3C] to-[#111B2E] text-white border-y border-[#2A3547] overflow-visible reveal-item"
      >
        <div className="absolute inset-0 bg-blueprint-grid opacity-25 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pt-2 pb-12 sm:py-16 lg:py-18">

          {/* Desktop Pop-Out Transparent Trainer Girl (Slightly reduced so words are 100% clear with zero overlap) */}
          <img
            src="/images/trial_trainer.png"
            alt="Wellwigen trial coach"
            width="454"
            height="760"
            loading="lazy"
            decoding="async"
            className="hidden sm:block absolute bottom-0 left-2 sm:left-4 lg:left-6 h-[130%] sm:h-[138%] md:h-[145%] lg:h-[152%] max-h-[305px] w-auto object-contain pointer-events-none select-none z-10"
            style={{
              bottom: 0,
            }}
          />

          {/* Mobile Trial Coach: Upper side with controlled subtle pop-out */}
          <div className="sm:hidden -mt-10 mb-2 flex justify-center pointer-events-none select-none relative z-10">
            <img
              src="/images/trial_trainer.png"
              alt="Wellwigen trial coach"
              width="454"
              height="760"
              loading="lazy"
              decoding="async"
              className="h-44 xs:h-48 w-auto object-contain"
              style={{
                maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
              }}
            />
          </div>

          <div className="relative z-20 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="sm:pl-56 md:pl-64 lg:pl-72 max-w-2xl text-center sm:text-left">
              <div className="inline-block text-[10px] font-display font-extrabold uppercase tracking-widest text-slate-950 bg-[#C6F432] px-2.5 py-0.5 rounded mb-2">
                SPECIAL OFFER
              </div>
              <h4 className="font-heading text-2xl sm:text-3xl font-black leading-tight text-white">
                Not sure? Start with a Trial.
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg">
                Just ₹99 for 1 class. Find your favorite workout, meet your coaches, and see the Wellwigen difference.
              </p>
            </div>

            <div className="flex flex-col items-center sm:items-end gap-2 shrink-0 relative z-30">
              <button
                onClick={() => onOpenLeadModal({ program: 'Group Classes', plan: 'Trial Class' })}
                className="btn-power-coral btn-shine px-8 py-4 rounded-full text-sm font-bold inline-flex items-center gap-2 shadow-coral-glow cursor-pointer"
              >
                <span>Try 1 Class for ₹99</span>
                <ArrowRight size={16} />
              </button>
              <span className="text-xs font-semibold text-[#2DE2C8] flex items-center gap-1">
                <CheckCircle2 size={13} />
                No commitment
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ================= LIGHT SECTION: WHY CHOOSE WELLWIGEN GROUP CLASSES? ================= */}
      <div data-nav-theme="light" className="relative py-24 bg-transparent overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-display font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 border border-teal-200 px-4 py-1.5 rounded-full">
              WHY US
            </span>
            <h3 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
              Why Choose Wellwigen Group Classes?
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {WHY_GROUP_CLASSES_TILES.map((tile, idx) => (
              /* OLD CODE (commented by AI)
              <div
                key={idx}
                className="card-soft p-5 border border-slate-200/90 hover:border-teal-300 transition-all flex flex-col justify-between"
              >
              */
              /* NEW CODE - smooth animation/performance: reveal-item with stagger and GPU hover */
              <div
                key={idx}
                className={`reveal-item reveal-stagger-${(idx % 5) + 1} card-soft p-5 border border-slate-200/90 hover:border-teal-300 transition-[transform,border-color,box-shadow] duration-250 flex flex-col justify-between`}
              >
                <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100/60 flex items-center justify-center mb-4">
                  {getWhyTileIcon(tile.icon)}
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-slate-900 mb-1.5 leading-snug">
                    {tile.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {tile.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

    </section>
  );
}
