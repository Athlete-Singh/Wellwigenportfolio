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
} from 'lucide-react';
import { trainerApi } from '../../../services/trainerApi';

export default function TrainerDashboard() {
  const [stats, setStats] = useState(null);
  const [classes, setClasses] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const trainer = trainerApi.getCurrentTrainer() || {};
  const isPending = trainer.status === 'pending';

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
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
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Pending Approval Notice Banner */}
      {isPending && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Clock size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-950">Application Status: Verification in Progress</h3>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
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
          <Link
            to="/trainer/availability"
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-1.5"
          >
            <Calendar size={16} />
            <span>Manage Slots</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards (Styled like AdminDashboard) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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

        <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-xs hover:shadow-md transition-all">
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

        <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-xs hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp size={20} />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              +18.4% MoM
            </span>
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Estimated Earnings</p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-3xl font-black text-slate-900">{stats?.monthlyEarnings || '₹48,500'}</h4>
            <span className="text-xs font-semibold text-slate-400">This Month</span>
          </div>
        </div>

        <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-xs hover:shadow-md transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star size={20} className="fill-current" />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
              38 Reviews
            </span>
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Athlete Rating</p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-3xl font-black text-slate-900">{trainer.rating || '4.9'}</h4>
            <span className="text-xs font-semibold text-slate-400">/ 5.0</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Upcoming Live Classes */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5">
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
                      <p className="text-xs text-slate-500 flex items-center gap-3">
                        <span>🗓 {cls.date}</span>
                        <span>👥 {cls.enrolled} / {cls.capacity} Enrolled</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => alert(`Starting Live Stream Session: ${cls.title}`)}
                        className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Video size={14} />
                        <span>Launch Session</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active 1-on-1 Clients */}
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
        </div>

        {/* Right Col: Quick Summary & Tips */}
        <div className="space-y-6">
          {/* Coach Quick Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-500 text-white flex items-center justify-center font-black text-lg overflow-hidden shrink-0 shadow-sm">
                {trainer.photoUrl ? (
                  <img src={trainer.photoUrl} alt={trainer.name} className="w-full h-full object-cover" />
                ) : (
                  trainer.name?.substring(0, 2).toUpperCase() || 'TR'
                )}
              </div>
              <div className="min-w-0">
                <h4 className="text-base font-bold text-slate-900 truncate">{trainer.name || 'Coach Vikram'}</h4>
                <p className="text-xs text-teal-600 font-semibold truncate">{trainer.specialization || 'Strength Coach'}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Member since {trainer.joinedDate || '2026'}</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>1-on-1 Fee:</span>
                <span className="font-bold text-slate-900">₹{trainer.services?.oneOnOnePriceMonthly || 4999}/mo</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Group Class:</span>
                <span className="font-bold text-slate-900">₹{trainer.services?.groupClassSeatPrice || 499}/seat</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Base Location:</span>
                <span className="font-bold text-slate-900">{trainer.city || 'Pan-India'}</span>
              </div>
            </div>

            <Link
              to="/trainer/profile"
              className="block w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs text-center transition-colors"
            >
              Edit Public Profile
            </Link>
          </div>

          {/* Quick Checklist */}
          <div className="bg-gradient-to-br from-teal-50/50 to-sky-50/50 rounded-2xl border border-teal-200/70 p-6 space-y-4">
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
