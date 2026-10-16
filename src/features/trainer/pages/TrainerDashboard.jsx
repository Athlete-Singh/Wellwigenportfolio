import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Dumbbell,
  Calendar,
  TrendingUp,
  Clock,
  Sparkles,
  ShieldCheck,
  Video,
  Plus,
  ArrowUpRight,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Activity,
  Star,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { trainerApi } from '../../../services/trainerApi';

export default function TrainerDashboard() {
  const [stats, setStats] = useState(null);
  const [classes, setClasses] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  // NEW CODE - Wellwigen live status synchronization
  const [currentTrainer, setCurrentTrainer] = useState(trainerApi.getCurrentTrainer() || {});
  const trainer = currentTrainer || {};

  const isPending = trainer?.status === 'pending';
  const isRejected = trainer?.status === 'rejected';
  const isApproved = trainer?.status === 'approved';

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Sync live status from backend
        const synced = await trainerApi.syncTrainerStatus();
        if (synced) {
          setCurrentTrainer(synced);
        }
        const s = await trainerApi.getDashboardStats();
        setStats(s);
        setClasses(trainerApi.getClasses());
        setClients(trainerApi.getClients());
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();

    // Check status every 10s for immediate reaction to Admin approval/rejection
    const interval = setInterval(async () => {
      const synced = await trainerApi.syncTrainerStatus();
      if (synced) {
        setCurrentTrainer(synced);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Launch Zoom Meeting (Auto-triggers native Zoom app + web fallback)
  const handleStartZoom = (cls) => {
    const rawMeetingId = cls.meetingId || '';
    const cleanMeetingId = rawMeetingId.replace(/\D/g, '') ||
      (cls.zoomUrl?.match(/\/j\/(\d+)/)?.[1] || '');
    const passcode = cls.passcode || (cls.zoomUrl?.match(/[?&]pwd=([^&#]+)/)?.[1] || '');
    const webUrl = cls.zoomUrl || (cleanMeetingId ? `https://us02web.zoom.us/j/${cleanMeetingId}${passcode ? `?pwd=${passcode}` : ''}` : 'https://zoom.us/join');

    if (cleanMeetingId) {
      // Zoom Native App deep-link protocol: launches native Zoom desktop / mobile client
      const appProtocolUrl = `zoommtg://zoom.us/join?action=join&confno=${cleanMeetingId}${passcode ? `&pwd=${encodeURIComponent(passcode)}` : ''}`;
      
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = appProtocolUrl;
      document.body.appendChild(iframe);
      setTimeout(() => {
        try {
          document.body.removeChild(iframe);
        } catch {}
      }, 2000);

      // Also open web url in a new tab
      window.open(webUrl, '_blank', 'noopener,noreferrer');
      toast.success(`🚀 Launching Zoom App for "${cls.title}"...`);
    } else {
      window.open(webUrl, '_blank', 'noopener,noreferrer');
      toast.success(`🚀 Opening Zoom room for "${cls.title}"...`);
    }
  };

  // Share Zoom Session & Invite on WhatsApp
  const handleShareWhatsApp = (cls) => {
    const cleanMeetingId = (cls.meetingId || '849 201 9284');
    const passcode = cls.passcode || 'WLLWGN26';
    const zoomLink = cls.zoomUrl || `https://us02web.zoom.us/j/${cleanMeetingId.replace(/\s+/g, '')}?pwd=${passcode}`;

    const text = `🔥 *WELLWIGEN LIVE WORKOUT SESSION* 🔥
━━━━━━━━━━━━━━━━━━━━━━━━━━
🏋️‍♂️ *Class:* ${cls.title}
👨‍🏫 *Lead Coach:* ${trainer.name || 'Coach'}
🎯 *Track & Category:* ${cls.category}
📊 *Level:* ${cls.fitnessLevel || 'All Levels'}
⏱️ *Duration:* ${cls.duration || '45 mins'}

📅 *SCHEDULED TIME:*
🗓️ *Date:* ${cls.date || 'Today'}
⏰ *Time:* ${cls.time || 'Scheduled Slot'} IST

📌 *SESSION OVERVIEW & FOCUS:*
• High-energy interactive coaching, core stability & dynamic strength
• Real-time posture checks, alignment cues & form corrections
• Tailored progressions suited for beginner to advanced athletes
• Keep your energy high and stay consistent with your goals!

🔑 *LIVE ZOOM ACCESS CREDENTIALS:*
🌐 *Direct Link:* ${zoomLink}
🆔 *Meeting ID:* ${cleanMeetingId}
🔐 *Passcode:* ${passcode}

💡 *PREPARATION GUIDELINES:*
1. Join the Zoom meeting 3 to 5 minutes early to check your setup.
2. Have your workout mat, water bottle & sweat towel ready.
3. Keep your camera at full-body height for accurate posture feedback.

See you on the mat! 💪🔥
━━━━━━━━━━━━━━━━━━━━━━━━━━
*Team Wellwigen*`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Rejection Notice Banner with Mandatory Reason */}
      {isRejected && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-50 to-red-50 border border-rose-300 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <AlertCircle size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full border border-rose-200">
                  Action Required
                </span>
                <h3 className="text-sm font-bold text-rose-950">Application Status: Needs Revision</h3>
              </div>
              <p className="text-xs text-rose-900 mt-1 leading-relaxed">
                Your coach application was reviewed by our athletic board and requires updates:
              </p>
              <div className="mt-2 p-2.5 bg-white/90 rounded-lg border border-rose-200 text-xs font-semibold text-rose-950">
                "{currentTrainer?.rejectionReason || 'Please review your uploaded certification documents and resubmit.'}"
              </div>
            </div>
          </div>
          <Link
            to="/trainer/onboarding?step=1"
            className="px-4 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 shadow-sm transition-all shrink-0 whitespace-nowrap flex items-center gap-1.5"
          >
            <span>Update Application & Re-submit</span>
          </Link>
        </div>
      )}

      {/* Pending Approval Notice Banner */}
      {isPending && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Clock size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                  Pending Review
                </span>
                <h3 className="text-sm font-bold text-amber-950">Application Status: Verification in Progress</h3>
              </div>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                Your onboarding submission is currently being reviewed by the Wellwigen Verification Team. You can set up your class schedules and availability now; they will become publicly discoverable once approved.
              </p>
            </div>
          </div>
          <Link
            to="/trainer/onboarding?step=6"
            className="px-4 py-2 rounded-xl bg-white border border-amber-300 text-amber-900 font-bold text-xs hover:bg-amber-100/50 shadow-xs transition-colors shrink-0 whitespace-nowrap"
          >
            View Submitted Details
          </Link>
        </div>
      )}

      {/* Verified & Approved Banner */}
      {isApproved && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-50 to-emerald-50 border-2 border-teal-500/50 shadow-md shadow-teal-500/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
              <ShieldCheck size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-teal-950">Verified Wellwigen Master Coach</h3>
                <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                  Approved & Live
                </span>
              </div>
              <p className="text-xs text-teal-800 mt-0.5">
                Your athletic credentials and certificates have been verified. Your profile is discoverable by clients.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Coach Command Center</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Real-time telemetry on your live classes, 1-on-1 clients, and coaching revenue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/trainer/classes"
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={16} />
            <span>Schedule Group Class</span>
          </Link>
          {/* [DISABLED FOR FUTURE USE] Trainer Availability Manage Slots Button
          <Link
            to="/trainer/availability"
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-1.5"
          >
            <Calendar size={16} />
            <span>Manage Slots</span>
          </Link>
          */}
        </div>
      </div>

      {/* Metric Cards (Styled like AdminDashboard) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* [DISABLED FOR FUTURE USE] Trainer 1-on-1 Trainees Metric Card
        <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-xs hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Users size={20} />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              Active
            </span>
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">1-on-1 Trainees</p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-3xl font-black text-slate-900">{stats?.activeClients ?? clients.length}</h4>
            <span className="text-xs font-semibold text-slate-400">Athletes</span>
          </div>
        </div>
        */}

        <div className="p-6 bg-white/95 backdrop-blur-md border-2 border-teal-500/30 hover:border-teal-500 rounded-2xl shadow-xs hover:shadow-lg transition-all shadow-teal-500/5">
          <div className="flex justify-between items-start mb-4">
            <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Dumbbell size={20} />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
              Live Classes
            </span>
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Upcoming Classes</p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-3xl font-black text-slate-900">{classes.length}</h4>
            <span className="text-xs font-semibold text-slate-400">Scheduled</span>
          </div>
        </div>

        {/* [DISABLED FOR FUTURE USE] Estimated Earnings and Athlete Rating Metric Cards
        <div className="p-6 bg-white/95 backdrop-blur-md border-2 border-teal-500/30 hover:border-teal-500 rounded-2xl shadow-xs hover:shadow-lg transition-all shadow-teal-500/5">
          <div className="flex justify-between items-start mb-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              Live Payout
            </span>
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Estimated Earnings</p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-3xl font-black text-slate-900">{stats?.monthlyEarnings || '₹0'}</h4>
            <span className="text-xs font-semibold text-slate-400">This Month</span>
          </div>
        </div>

        <div className="p-6 bg-white/95 backdrop-blur-md border-2 border-teal-500/30 hover:border-teal-500 rounded-2xl shadow-xs hover:shadow-lg transition-all shadow-teal-500/5">
          <div className="flex justify-between items-start mb-4">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star size={20} className="fill-current" />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
              {trainer.reviewsCount ? `${trainer.reviewsCount} Reviews` : 'New Coach'}
            </span>
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Athlete Rating</p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-3xl font-black text-slate-900">{trainer.rating ? trainer.rating : '—'}</h4>
            <span className="text-xs font-semibold text-slate-400">/ 5.0</span>
          </div>
        </div>
        */}
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Upcoming Live Classes */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border-2 border-teal-500/30 hover:border-teal-500/50 shadow-xs p-6 space-y-5 shadow-teal-500/5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Live Group Classes Schedule</h3>
                <p className="text-xs text-slate-400">Upcoming sessions with enrolled attendees</p>
              </div>
              <Link
                to="/trainer/classes"
                className="text-xs font-bold text-teal-600 hover:text-teal-700 hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            {classes.length === 0 ? (
              <div className="p-8 text-center rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                <Dumbbell size={32} className="mx-auto text-slate-300" />
                <p className="text-sm font-bold text-slate-700">No classes scheduled yet</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Create your first live workout class to start hosting athletes across India.
                </p>
                <Link
                  to="/trainer/classes"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs"
                >
                  <Plus size={14} /> Schedule Class
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {classes.map((cls) => (
                  <div key={cls.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/50 uppercase">
                          {cls.category}
                        </span>
                        <span className="text-xs text-slate-400 font-semibold">{cls.duration}</span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{cls.title}</h4>
                      
                      {/* [DISABLED FOR FUTURE USE] Old enrollment display:
                      <p className="text-xs text-slate-500 flex items-center gap-3">
                        <span>🗓 {cls.date}</span>
                        <span>👥 {cls.enrolled} / {cls.capacity} Enrolled</span>
                      </p>
                      */}
                      
                      {/* NEW CODE - Date & Zoom credentials display without enrollment */}
                      <p className="text-xs text-slate-500 flex flex-wrap items-center gap-2.5">
                        <span>🗓 {cls.date} {cls.time ? `• ${cls.time}` : ''}</span>
                        {cls.meetingId && (
                          <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                            ID: {cls.meetingId}
                          </span>
                        )}
                        {cls.passcode && (
                          <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                            Pass: {cls.passcode}
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Start Zoom Button (Auto-opens Zoom Native Application) */}
                      <button
                        onClick={() => handleStartZoom(cls)}
                        title="Automatically launch Zoom App and join session"
                        className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap active:scale-95"
                      >
                        <Video size={14} />
                        <span>Start Zoom</span>
                      </button>

                      {/* Share on WhatsApp Button */}
                      <button
                        onClick={() => handleShareWhatsApp(cls)}
                        title="Share meeting credentials with athletes via WhatsApp"
                        className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer"
                      >
                        <MessageSquare size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* [DISABLED FOR FUTURE USE] Active 1-on-1 Trainees section
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Active 1-on-1 Trainees</h3>
                <p className="text-xs text-slate-400">Current athletes undergoing personal coaching</p>
              </div>
              <Link
                to="/trainer/clients"
                className="text-xs font-bold text-teal-600 hover:text-teal-700 hover:underline flex items-center gap-1"
              >
                <span>View Roster</span>
                <ChevronRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {clients.map((cli) => (
                <div key={cli.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-3">
                  <div className="flex items-center gap-3">
                    <img src={cli.avatar} alt={cli.name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">{cli.name}</h4>
                      <p className="text-[10px] text-teal-600 font-semibold">{cli.goal}</p>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500 space-y-1">
                    <p>Next: <span className="font-semibold text-slate-700">{cli.nextSession}</span></p>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-teal-500 h-full rounded-full"
                        style={{ width: `${(cli.sessionsCompleted / cli.totalSessions) * 100}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 text-right">
                      {cli.sessionsCompleted} of {cli.totalSessions} sessions
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          */}
        </div>

        {/* Right Col: Quick Summary & Tips */}
        <div className="space-y-6">
          {/* Coach Quick Card */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border-2 border-teal-500/30 hover:border-teal-500/50 shadow-xs p-6 space-y-4 shadow-teal-500/5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-500 text-white flex items-center justify-center font-black text-lg overflow-hidden shrink-0 shadow-sm">
                {trainer.photoUrl ? (
                  <img src={trainer.photoUrl} alt={trainer.name} className="w-full h-full object-cover" />
                ) : (
                  trainer.name?.substring(0, 2).toUpperCase() || 'TR'
                )}
              </div>
              <div className="min-w-0">
                <h4 className="text-base font-bold text-slate-900 truncate">{trainer.name || 'Coach'}</h4>
                <p className="text-xs text-teal-600 font-semibold truncate">{trainer.specialization || 'Fitness Coach'}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Member since {trainer.joinedDate || new Date().getFullYear()}</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>1-on-1 Fee:</span>
                <span className="font-bold text-slate-900">
                  {(trainer.services?.oneOnOneSharePercent !== undefined && trainer.services?.oneOnOneSharePercent !== null && trainer.services?.oneOnOneSharePercent !== '')
                    ? `${trainer.services.oneOnOneSharePercent}%`
                    : (trainer.oneOnOneSharePercent !== undefined && trainer.oneOnOneSharePercent !== null && trainer.oneOnOneSharePercent !== '')
                    ? `${trainer.oneOnOneSharePercent}%`
                    : '50%'}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Group Class:</span>
                <span className="font-bold text-slate-900">
                  {(trainer.services?.groupClassSharePercent !== undefined && trainer.services?.groupClassSharePercent !== null && trainer.services?.groupClassSharePercent !== '')
                    ? `${trainer.services.groupClassSharePercent}%`
                    : (trainer.groupClassSharePercent !== undefined && trainer.groupClassSharePercent !== null && trainer.groupClassSharePercent !== '')
                    ? `${trainer.groupClassSharePercent}%`
                    : '75%'}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Base Location:</span>
                <span className="font-bold text-slate-900">{trainer.city || 'Lucknow'}</span>
              </div>
            </div>

            <Link
              to="/trainer/profile"
              className="block w-full py-2.5 rounded-xl border-2 border-teal-500/30 hover:border-teal-500 hover:bg-teal-50/50 text-slate-700 font-bold text-xs text-center transition-all shadow-xs"
            >
              Edit Public Profile
            </Link>
          </div>

          {/* Quick Checklist */}
          <div className="bg-gradient-to-br from-teal-50/70 via-white to-sky-50/60 rounded-2xl border-2 border-teal-500/40 shadow-xs p-6 space-y-4 shadow-teal-500/5">
            <div className="flex items-center gap-2 text-teal-900 font-bold text-sm">
              <Sparkles size={18} className="text-teal-600" />
              <span>Coach Pro Tips</span>
            </div>
            <ul className="space-y-3 text-xs text-teal-950">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-teal-600 shrink-0 mt-0.5" />
                <span>Publish group class slots 3 days in advance to maximize seat fill rates.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-teal-600 shrink-0 mt-0.5" />
                <span>Keep WhatsApp notifications enabled for instant 1-on-1 booking requests.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="text-teal-600 shrink-0 mt-0.5" />
                <span>Weekly payouts process automatically every Monday at 10:00 AM IST.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
