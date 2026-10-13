import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  MessageSquare,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  ArrowLeft,
} from 'lucide-react';
import { trainerApi } from '../../../services/trainerApi';

export default function TrainerClients() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setClients(trainerApi.getClients());
  }, []);

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.goal.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Paused Section Notice */}
      <div className="p-8 sm:p-12 text-center rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
          <Users size={28} />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">1-on-1 Client Management Paused</h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1.5 max-w-md mx-auto">
            This section has been temporarily paused and preserved for future updates. You can manage your live classes and public coach profile.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/trainer/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm shadow-teal-600/20 transition-all"
          >
            <ArrowLeft size={14} />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </div>

      {/* [DISABLED FOR FUTURE USE] 1-on-1 Client Roster */}
      {false && (
        <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">1-on-1 Client Roster</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Track private training clients, program milestones, and upcoming individual sessions.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search trainees by name or goal..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 shadow-xs"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
          <Users size={40} className="mx-auto text-slate-300" />
          <h3 className="text-base font-bold text-slate-800">No trainees found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {search ? 'Try clearing your search query.' : 'New clients booking your 1-on-1 personal training packages will appear here.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((cli) => (
            <div
              key={cli.id}
              className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={cli.avatar}
                      alt={cli.name}
                      className="w-12 h-12 rounded-full object-cover border border-slate-100 shadow-xs"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">{cli.name}</h3>
                      <p className="text-[11px] text-teal-600 font-semibold">{cli.goal}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    {cli.status}
                  </span>
                </div>

                <div className="p-3 bg-slate-50/70 rounded-xl space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Enrolled Plan:</span>
                    <span className="font-semibold text-slate-800">{cli.plan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Next Slot:</span>
                    <span className="font-semibold text-slate-800">{cli.nextSession}</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-medium">Session Progress</span>
                    <span className="font-bold text-slate-800">
                      {cli.sessionsCompleted} / {cli.totalSessions} Sessions
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-sky-500 h-full rounded-full"
                      style={{ width: `${(cli.sessionsCompleted / cli.totalSessions) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <a
                  href={`https://wa.me/?text=Hi%20${encodeURIComponent(cli.name)},%20this%20is%20your%20Wellwigen%20Coach.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageSquare size={13} className="text-emerald-600" />
                  <span>WhatsApp</span>
                </a>

                <button
                  onClick={() => alert(`Opening training logs for ${cli.name}`)}
                  className="flex-1 py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Calendar size={13} />
                  <span>Log Workout</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    )}
    </div>
  );
}
