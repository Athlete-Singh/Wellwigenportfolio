import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  Dumbbell,
  Users,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Star,
  Award,
  Video,
} from 'lucide-react';
import { trainerApi } from '../../../services/trainerApi';

export default function TrainerIntro() {
  const isAuth = trainerApi.isAuthenticated();
  const currentTrainer = trainerApi.getCurrentTrainer();

  // If already logged in, redirect straight to dashboard or onboarding
  if (isAuth) {
    if (currentTrainer?.status === 'onboarding') {
      return <Navigate to="/trainer/onboarding?step=1" replace />;
    }
    return <Navigate to="/trainer/dashboard" replace />;
  }

  const benefits = [
    {
      icon: Users,
      title: 'Pan-India Client Network',
      desc: 'Connect with motivated clients seeking 1-on-1 personal training and live group sessions across India.',
      color: 'from-teal-500 to-emerald-500',
    },
    {
      icon: DollarSign,
      title: 'High-Earning Potential',
      desc: 'Set your own session fees and group class seat pricing with weekly direct payouts to your bank account.',
      color: 'from-sky-500 to-blue-500',
    },
    {
      icon: Calendar,
      title: 'Flexible Digital Schedule',
      desc: 'Coach from your own gym or home studio. You decide your morning and evening availability slots.',
      color: 'from-amber-500 to-orange-500',
    },
    {
      icon: ShieldCheck,
      title: 'Verified Coach Badge',
      desc: 'Earn credibility with our Wellwigen Verified Coach seal and automated progress tracking tools for your clients.',
      color: 'from-indigo-500 to-purple-500',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Register & Basic Info',
      desc: 'Create your coach account with phone and city details.',
    },
    {
      num: '02',
      title: 'Upload Credentials',
      desc: 'Share your fitness certifications (ACE, NASM, ISSA, etc.) and experience.',
    },
    {
      num: '03',
      title: 'Set Rates & Classes',
      desc: 'Configure 1-on-1 monthly fees, group classes, and weekly slot availability.',
    },
    {
      num: '04',
      title: 'Quick Verification & Launch',
      desc: 'Our team verifies credentials within 24-48 hours, and your profile goes live.',
    },
  ];

  return (
    <div data-panel="trainer" className="min-h-screen bg-transparent text-slate-800 font-sans antialiased">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b-2 border-teal-500/30 shadow-xs shadow-teal-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-sky-500 shadow-md shadow-teal-500/20 flex items-center justify-center text-white font-black text-base shrink-0 group-hover:scale-105 transition-transform">
              W
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-slate-900 tracking-tight text-lg">WELLWIGEN</span>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded uppercase tracking-wider border border-teal-200/50">
                  Coach
                </span>
              </div>
              <p className="text-[9.5px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                Trainer Portal
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/"
              className="text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">Back to</span> Website
            </Link>

            <Link
              to="/trainer/login"
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-bold text-xs sm:text-sm transition-all"
            >
              Trainer Login
            </Link>

            <Link
              to="/trainer/register"
              className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-600/20 transition-all flex items-center gap-1.5"
            >
              <span>Become a Trainer</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden bg-transparent">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold mb-6 shadow-xs">
            <Sparkles size={14} className="text-teal-600" />
            <span>Join Wellwigen's Elite Certified Trainer Network</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] mb-6">
            Empower Fitness Journeys. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-sky-600">
              Build Your Online Coaching Business.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Deliver transformative 1-on-1 personal training and high-energy live group classes. We take care of client matching, bookings, payments, and scheduling so you can focus 100% on coaching.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Link
              to="/trainer/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm shadow-lg shadow-teal-600/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Apply as a Trainer</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/trainer/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 font-extrabold text-sm shadow-xs transition-all flex items-center justify-center"
            >
              Existing Trainer Login
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto pt-10 border-t border-slate-200/80">
            <div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">₹60K+</p>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">Avg Monthly Earnings</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">100%</p>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">Direct Client Payouts</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">4.9 / 5</p>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">Average Coach Rating</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">24-48h</p>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">Fast Verification</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-black text-teal-600 uppercase tracking-widest mb-2">Why Coach With Wellwigen</p>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Everything you need to thrive as a modern fitness coach
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, i) => {
            const Icon = b.icon;
            return (
              <div
                key={i}
                className="bg-white/95 backdrop-blur-md p-7 rounded-2xl border-2 border-teal-500/30 hover:border-teal-500 shadow-xs hover:shadow-lg transition-all space-y-4 shadow-teal-500/5"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${b.color} text-white flex items-center justify-center shadow-md`}>
                  <Icon size={22} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{b.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4-Step Process */}
      <section className="py-20 bg-white/85 backdrop-blur-md border-y-2 border-teal-500/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs font-black text-teal-600 uppercase tracking-widest mb-2">Simple Onboarding</p>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Get onboarded in 4 easy steps
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, idx) => (
              <div key={idx} className="relative space-y-3">
                <span className="text-3xl font-black text-teal-600/30">{s.num}</span>
                <h4 className="text-base font-bold text-slate-900">{s.title}</h4>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/trainer/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm shadow-md transition-all"
            >
              <span>Start Application Now</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-xs text-slate-400 border-t border-slate-200">
        <p>&copy; 2026 Wellwigen. Empowering Coaches &amp; Athletes Across India.</p>
      </footer>
    </div>
  );
}
