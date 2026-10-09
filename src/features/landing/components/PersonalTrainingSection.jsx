import React from 'react';
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
} from 'lucide-react';
import {
  PT_BENEFITS,
  PT_GOALS,
  PT_STEPS,
  PT_PLANS,
  PT_STORIES,
} from '../data/fitnessData';
import personalTrainingManImg from '../../../assets/personal-training-man.png';

export default function PersonalTrainingSection({ onOpenLeadModal }) {
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

      {/* ================= LIGHT HEADER / HERO ================= */}
      <div data-nav-theme="light" className="relative pt-24 pb-16 bg-white hero-white-screen">
        <div className="absolute top-8 left-10 text-[18vw] watermark-text-light opacity-30 z-0">
          COACH
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center mb-16">
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-6 space-y-6"
            >
              {/* OLD CODE (commented by AI) - Awkward pill badge removed per user request */}
              {/*
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-display font-extrabold uppercase tracking-wider shadow-sm">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                <span>PERSONAL TRAINING</span>
              </div>
              */}
              {/* NEW CODE - Removed awkward pill badge */}

              <h2 className="font-heading text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Personal Training{' '}
                <span className="gradient-teal-sky-text block sm:inline">
                  Built Around You.
                </span>
              </h2>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                One-on-one online coaching designed around your goals, fitness level and lifestyle.
              </p>

              <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
                <button
                  onClick={() => onOpenLeadModal({ program: 'Personal Training', plan: 'Transformation' })}
                  className="btn-power-coral btn-shine px-8 py-4 text-sm sm:text-base font-bold flex items-center justify-center gap-2 cursor-pointer shadow-coral-glow group"
                >
                  <span>Start Personal Training</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => onOpenLeadModal({ program: 'Personal Training', plan: 'Consultation' })}
                  className="btn-outline-brand px-7 py-4 text-sm sm:text-base font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow"
                >
                  <Calendar size={18} />
                  <span>Book a Consultation</span>
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-900 aspect-[4/3] bg-slate-900 group">
                {/* Athletic Corner Brackets */}
                <div className="corner-bracket-tl z-20" />
                <div className="corner-bracket-br z-20" />

                {/* OLD CODE (commented by AI)
                <img
                  src="/images/pt_coaching.jpg"
                  alt="Woman doing squats during live online 1-on-1 personal training with laptop coach"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                */}
                {/* NEW CODE - mobile fix: focus on athlete form & laptop coach on mobile */}
                <img
                  src="/images/pt_coaching.jpg"
                  alt="Woman doing squats during live online 1-on-1 personal training with laptop coach"
                  className="w-full h-full object-cover object-[55%_35%] sm:object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent pointer-events-none" />
                
                {/* OLD CODE (commented by AI) - Awkward floating badge on image removed per user request */}
                {/*
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-white flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-display font-bold text-slate-800 tracking-wider uppercase">
                    1:1 Dedicated Master Coach
                  </span>
                </div>
                */}
                {/* NEW CODE - Removed awkward floating badge overlay */}
              </div>
            </motion.div>

          </div>

          {/* ================= WHO IS IT FOR? (4 GOAL CARDS) ================= */}
          <div className="pb-16">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-display font-extrabold uppercase tracking-widest text-teal-700 bg-teal-50 border border-teal-200 px-4 py-1.5 rounded-full">
                TARGETED GOALS
              </span>
              <h3 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
                Who is it for? We help you achieve your unique fitness goals
              </h3>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PT_GOALS.map((goal) => (
                <div
                  key={goal.id}
                  onClick={() => onOpenLeadModal({ program: 'Personal Training', plan: goal.title })}
                  className="card-soft overflow-hidden group cursor-pointer border border-slate-200/90 hover:border-teal-400 flex flex-col relative"
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

      {/* ================= LIGHT SECTION: WHAT YOU GET (6 TILES) ================= */}
      <div data-nav-theme="light" className="relative py-24 bg-transparent border-t border-slate-200/80 overflow-hidden">
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
              <div
                key={idx}
                className="bg-white p-7 rounded-3xl border border-slate-200/90 hover:border-teal-400/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-teal-50/80 border border-teal-100 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-teal-100/70 transition-all">
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

          {/* ================= HOW PT WORKS (6 STEPS ON LIGHT) ================= */}
          <div className="pt-24 mt-24 border-t border-slate-200/80">
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
                  <div
                    key={step.step}
                    className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl flex flex-col text-center items-center hover:border-teal-400/70 hover:-translate-y-1 transition-all duration-300 group"
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

      {/* ================= DARK ACCENT SECTION: PRICING ================= */}
      <div data-nav-theme="dark" className="relative py-28 bg-[#0E1420] text-white overflow-hidden">
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

            <div className="grid md:grid-cols-3 gap-8 items-stretch pt-4">
              {PT_PLANS.map((plan) => {
                if (plan.popular) {
                  // Conic Glow Wrapper for Most Popular
                  return (
                    <div key={plan.id} className="relative scale-105 z-10 flex flex-col">
                      {/* Floating Badge (Unclipped above the rotating glow border) */}
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 bg-gradient-to-r from-teal-500 to-[#2DE2C8] text-slate-950 font-display font-black text-xs px-4 py-1.5 rounded-full shadow-lg uppercase tracking-wider whitespace-nowrap">
                        {plan.badge}
                      </div>

                      <div className="conic-glow-wrapper shadow-2xl flex-1 flex flex-col h-full">
                        <div className="conic-glow-content p-8 sm:p-9 text-slate-900 flex flex-col justify-between h-full relative">
                          <div>
                            <div className="text-xs font-display font-bold uppercase tracking-wider text-slate-500 mb-2 pt-2">
                              {plan.sessions}
                            </div>
                            <h4 className="font-heading text-2xl font-black text-slate-900 mb-4">
                              {plan.name}
                            </h4>

                            <div className="flex items-baseline gap-1 mb-6">
                              <span className="font-display text-4xl font-black text-slate-900">
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
                            className="w-full btn-power-coral btn-shine py-3.5 rounded-full text-white text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-coral-glow"
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
                    className="bg-white rounded-3xl p-8 relative flex flex-col justify-between border border-slate-100 shadow-xl text-slate-900 hover:-translate-y-1 transition-transform"
                  >
                    <div>
                      <div className="text-xs font-display font-bold uppercase tracking-wider text-slate-500 mb-2">
                        {plan.sessions}
                      </div>
                      <h4 className="font-heading text-2xl font-black text-slate-900 mb-4">
                        {plan.name}
                      </h4>

                      <div className="flex items-baseline gap-1 mb-6">
                        <span className="font-display text-4xl font-black text-slate-900">
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
                      className="w-full btn-primary-gradient btn-shine py-3.5 rounded-full text-white text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-teal-glow"
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

      {/* ================= LIGHT CONTENT SECTION: SUCCESS STORIES & CLOSING ================= */}
      <div data-nav-theme="light" className="relative py-24 bg-transparent overflow-hidden">
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
                <div
                  key={idx}
                  className="card-soft p-6 border border-slate-200/90 flex flex-col justify-between"
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
                      <img src={story.image} alt={story.name} className="w-full h-full object-cover" />
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

          {/* ================= CLOSING STRIP (POP-OUT CTA BANNER) ================= */}
          {/* Outer wrapper: relative with overflow-visible so trainer's head & shoulders pop out */}
          <div className="relative mt-20 sm:mt-24 lg:mt-28">
            
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
                filter: 'drop-shadow(0 0 40px rgba(45, 212, 191, 0.3))',
              }}
            />

            {/* Foreground Content: shifted to the right so it never overlaps his body */}
            <div className="relative z-20 p-8 sm:p-10 lg:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6">
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
                  className="btn-power-coral btn-shine px-8 py-4 rounded-full text-sm sm:text-base font-bold inline-flex items-center gap-2 shadow-coral-glow shrink-0 cursor-pointer"
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
