import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  AlertTriangle,
  Clock,
  Calendar,
  Video,
  HeartPulse,
  Printer,
  ArrowLeft,
  CheckCircle2,
  Lock,
  UserCheck,
  Sparkles,
  FileText,
  BadgeAlert,
  Dumbbell
} from 'lucide-react';

export default function TrainerSafetyGuidelines() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F0F8F6] text-slate-800 font-sans p-4 sm:p-6 lg:p-10 antialiased selection:bg-teal-500 selection:text-white">
      {/* Ambient background glows */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-teal-300/15 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-blue-300/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        {/* Top Header with Home Page Brand Logo */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-teal-500/25">
          <Link to="/" className="flex items-center gap-3 group cursor-pointer">
            <img
              src="/images/wellwigen-logo.webp"
              alt="Wellwigen"
              className="h-12 sm:h-14 md:h-16 w-auto object-contain select-none group-hover:scale-105 transition-transform duration-200"
            />
            <span className="text-[10px] font-bold text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded uppercase tracking-wider border border-teal-300/60">
              Coach Governance
            </span>
          </Link>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              type="button"
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs hover:shadow-xs cursor-pointer print:hidden"
            >
              <Printer size={15} />
              <span>Print Guidelines</span>
            </button>
            <button
              onClick={() => window.close()}
              type="button"
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-md shadow-teal-600/20 flex items-center gap-1.5 cursor-pointer print:hidden"
            >
              <ArrowLeft size={14} />
              <span>Back / Close Window</span>
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl border-2 border-teal-500/30 shadow-xl p-6 sm:p-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200">
              <ShieldCheck size={14} className="text-blue-600" />
              Official Institutional Policy
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold border border-teal-200">
              <Sparkles size={14} className="text-teal-600" />
              Effective: October 2026
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
              <BadgeAlert size={14} className="text-amber-600" />
              Mandatory Coach Agreement
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Coach Code of Conduct &amp; Athlete Safety Guidelines
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
            As a certified Wellwigen Coach, you represent the highest standard of fitness engineering, athletic responsibility, and client trust. These guidelines govern your professional practice, athlete injury prevention, leave protocols, and operational safety.
          </p>
        </div>

        {/* Core Policies Grid */}
        <div className="space-y-6">

          {/* 1. 15-Day Exit & Resignation Notice */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
                <Calendar size={24} />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                  Section 1 • Resignation Protocol
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                  1. Mandatory 15-Day Exit &amp; Transition Notice
                </h2>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed pl-0 sm:pl-16">
              <p>
                <strong>Uninterrupted Client Progression:</strong> Wellwigen trainees invest significant time and financial commitment into their ongoing fitness regimens. A trainer <strong className="text-slate-900">cannot exit or terminate their coaching services immediately</strong> without providing at least <strong className="text-amber-800 font-bold underline">15 calendar days' written notice</strong> to the Wellwigen administration.
              </p>
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-amber-950 space-y-2">
                <p className="font-bold flex items-center gap-1.5 text-xs sm:text-sm">
                  <AlertTriangle size={16} className="text-amber-600 shrink-0" />
                  During the 15-day notice period, the coach must:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>Complete all remaining pre-booked training sessions or hand them over smoothly.</li>
                  <li>Update client workout records, biometric progression logs, and current split programs.</li>
                  <li>Brief the newly assigned replacement certified coach to ensure seamless client continuity.</li>
                </ul>
              </div>
              <p className="text-[11px] text-slate-500">
                <em>*Immediate abandonment without notice results in forfeiture of unpaid payout incentives and permanent deactivation of verified coach status.</em>
              </p>
            </div>
          </div>

          {/* 2. 24-Hour Leave & Absence Protocol */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
                <Clock size={24} />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60">
                  Section 2 • Schedule Reliability
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                  2. Mandatory 24-Hour Prior Leave Notification
                </h2>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed pl-0 sm:pl-16">
              <p>
                <strong>Scheduled Session Accountability:</strong> Consistency is the core pillar of athletic results. Coaches must adhere strictly to agreed live slots:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-1.5">
                  <p className="font-bold text-blue-950 text-xs sm:text-sm flex items-center gap-1.5">
                    <CheckCircle2 size={15} className="text-blue-600 shrink-0" />
                    Planned Absences (24h Rule)
                  </p>
                  <p className="text-xs text-blue-900 leading-relaxed">
                    Any planned leave, personal commitment, or slot reschedule must be submitted <strong className="underline">at least 24 hours in advance</strong> via the Coach Dashboard or to the administration, allowing trainees to be informed timely.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-1.5">
                  <p className="font-bold text-rose-950 text-xs sm:text-sm flex items-center gap-1.5">
                    <AlertTriangle size={15} className="text-rose-600 shrink-0" />
                    Medical &amp; Emergency Exemption
                  </p>
                  <p className="text-xs text-rose-900 leading-relaxed">
                    In cases of sudden medical emergency or acute illness, inform the Wellwigen Emergency Ops Desk at the earliest so automated session rescheduling credits can be disbursed to the trainee.
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">
                <em>*Unannounced no-shows cause irreversible client dissatisfaction and incur disciplinary penalties on the coach rating score.</em>
              </p>
            </div>
          </div>

          {/* 3. Online Class Safety & Injury Prevention */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center shrink-0">
                <Video size={24} />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60">
                  Section 3 • Virtual Coaching Protocols
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                  3. Online Class Standards &amp; Athlete Safety
                </h2>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed pl-0 sm:pl-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <HeartPulse size={16} className="text-teal-600" />
                    <span>Pre-Session Health &amp; Injury Check</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Always ask the trainee at the start of every workout: <em>"Are you feeling any muscle pain, joint discomfort, or dizziness today?"</em> Modify sets immediately if pain is detected.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <Video size={16} className="text-teal-600" />
                    <span>Camera Alignment &amp; Visual Form Auditing</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Ensure the trainee's full body is visible in frame during complex multi-joint movements (Squats, Deadlifts, Lunges) so you can actively check knee-tracking, spine curvature, and posture.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <Dumbbell size={16} className="text-teal-600" />
                    <span>Mandatory Warm-Up &amp; Cool-Down</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Never jump directly into high-intensity loading. Every session must include a <strong>5–7 minute dynamic joint mobility warm-up</strong> and conclude with a <strong>5-minute static stretch &amp; parasympathetic cool-down</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold">
                    <AlertTriangle size={16} className="text-teal-600" />
                    <span>Home Workout Space Safety</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Verify that the client's training area is free from slippery surfaces, sharp edges, and tripping hazards before recommending jumping or high-impact calisthenics.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Professional Conduct, Privacy & Platform Integrity */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-8 space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
                <Lock size={24} />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                  Section 4 • Ethics &amp; Confidentiality
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                  4. Professional Conduct, Ethics &amp; Privacy
                </h2>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed pl-0 sm:pl-16">
              <ul className="space-y-2.5">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Zero Tolerance Harassment Policy:</strong> All interactions must remain strictly professional, encouraging, and respectful. Inappropriate speech, offensive humor, or unprofessional boundary violations result in immediate termination.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Trainee Confidentiality:</strong> Client medical data, body measurements, progress photos, and phone numbers are strictly private. Do not post or distribute trainee media on personal social platforms without signed written authorization.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Platform Integrity (Anti-Poaching):</strong> All client enrollments, renewals, scheduling, and monetary transactions must occur transparently through the Wellwigen platform. Direct private billing or poaching clients is strictly prohibited.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Scope of Practice:</strong> Provide evidence-based workout programming and general wellness nutrition. Coaches must not prescribe medical treatments, prescription drugs, or unapproved supplements without medical licensure.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Signature & Confirmation Footer */}
        <div className="p-6 sm:p-8 bg-white/90 backdrop-blur-md rounded-3xl border border-teal-500/20 shadow-md text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto border border-teal-200">
            <UserCheck size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900">Coach Agreement Commitment</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto mt-1">
              By checking the agreement box on the coach onboarding portal, you legally confirm that you have read, understood, and agreed to abide by all the above Wellwigen safety and operational guidelines.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 print:hidden">
            <button
              onClick={() => window.close()}
              type="button"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              I Understand &amp; Close Window
            </button>
            <Link
              to="/trainer/onboarding?step=6"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
            >
              Return to Coach Onboarding
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
