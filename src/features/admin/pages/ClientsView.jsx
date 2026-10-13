import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  CheckCircle2,
  Clock,
  Calendar,
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  Mail,
  Award,
  Sparkles,
  Dumbbell,
  X,
  Phone,
  ShieldCheck,
  UserCheck,
  Activity,
  Plus,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { trainerApi } from '../../../services/trainerApi';

// Initial pre-seeded mock activity logs
const DEFAULT_CLIENT_ACTIVITIES = {
  cli_1: [
    { id: 'act_1', type: 'Workout', title: 'Barbell Hypertrophy & Core', date: 'Today, 09:30 AM', duration: '50 mins', notes: 'Hit personal record on deadlift (120kg). Good pelvic control.' },
    { id: 'act_2', type: 'Check-in', title: 'Weekly Biometrics & Body Fat', date: 'Yesterday', duration: '15 mins', notes: 'Down 0.8kg, waist circumference reduced by 1cm.' },
    { id: 'act_3', type: 'Workout', title: 'MetCon Endurance Flow', date: '3 days ago', duration: '45 mins', notes: 'Completed 5 rounds under target time cap.' },
  ],
  cli_2: [
    { id: 'act_4', type: 'Workout', title: 'Kettlebell & Functional Conditioning', date: 'Yesterday, 08:00 AM', duration: '45 mins', notes: 'Form significantly improved on clean & press.' },
    { id: 'act_5', type: 'Nutrition', title: 'Protein Target Review', date: '4 days ago', duration: '20 mins', notes: 'Consistent with 110g protein daily goal.' },
  ],
  cli_3: [
    { id: 'act_6', type: 'Workout', title: 'Half-Marathon Tempo Run', date: '2 days ago', duration: '60 mins', notes: 'Paced at 5:15/km average. Hamstrings felt good with warm-up routine.' },
  ],
};

export default function ClientsView() {
  const [clients, setClients] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'expired' | 'trial'
  const [selectedClient, setSelectedClient] = useState(null);
  const [activities, setActivities] = useState(DEFAULT_CLIENT_ACTIVITIES);
  const [newActivityNote, setNewActivityNote] = useState('');
  const [newActivityTitle, setNewActivityTitle] = useState('');

  // Load clients & approved coaches
  useEffect(() => {
    try {
      const data = trainerApi.getClients();
      // Ensure each client has subscriptionStatus and assignedCoach properties
      const enriched = (Array.isArray(data) ? data : []).map((c, idx) => ({
        ...c,
        phone: c.phone || '+91 98765 ' + (10000 + idx),
        subscriptionStatus: c.status === 'Active' ? 'Active' : (idx === 2 ? 'Expired' : 'Active'),
        renewalDate: idx === 2 ? '2026-03-15 (Expired)' : '2026-05-15',
        assignedCoach: c.assignedCoach || 'Vikram Rajput',
        assignedCoachId: c.assignedCoachId || 'trn_demo_101',
      }));
      setClients(enriched);
    } catch (e) {
      console.error('Failed to load clients:', e);
    }

    // Load coaches
    const loadCoaches = async () => {
      try {
        const approved = await trainerApi.getApprovedTrainers();
        setCoaches(Array.isArray(approved) ? approved : []);
      } catch {
        setCoaches([]);
      }
    };
    loadCoaches();
  }, []);

  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  // Filter clients
  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const matchSearch =
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.goal?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.assignedCoach?.toLowerCase().includes(search.toLowerCase());

      const matchStatus =
        statusFilter === 'all' ||
        c.subscriptionStatus?.toLowerCase() === statusFilter.toLowerCase();

      return matchSearch && matchStatus;
    });
  }, [clients, search, statusFilter]);

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage) || 1;

  const paginatedClients = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredClients.slice(start, start + itemsPerPage);
  }, [filteredClients, page]);

  const totalSessionsCompleted = useMemo(() => {
    return clients.reduce((acc, c) => acc + (c.sessionsCompleted || 0), 0);
  }, [clients]);

  // Handle coach reassignment
  const handleReassignCoach = (clientId, newCoachName, newCoachId) => {
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId
          ? { ...c, assignedCoach: newCoachName, assignedCoachId: newCoachId }
          : c
      )
    );
    if (selectedClient && selectedClient.id === clientId) {
      setSelectedClient((prev) => ({
        ...prev,
        assignedCoach: newCoachName,
        assignedCoachId: newCoachId,
      }));
    }
    toast.success(`Assigned coach updated to ${newCoachName}!`);
  };

  // Add new activity log
  const handleAddActivity = (e) => {
    e.preventDefault();
    if (!newActivityTitle.trim() || !selectedClient) return;

    const newAct = {
      id: 'act_' + Date.now(),
      type: 'Workout',
      title: newActivityTitle.trim(),
      date: 'Just now',
      duration: '45 mins',
      notes: newActivityNote.trim() || 'Session successfully logged by admin.',
    };

    setActivities((prev) => ({
      ...prev,
      [selectedClient.id]: [newAct, ...(prev[selectedClient.id] || [])],
    }));

    setNewActivityTitle('');
    setNewActivityNote('');
    toast.success('Workout activity logged for ' + selectedClient.name);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* ================= PAGE HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded uppercase tracking-wider">
              Trainee Network
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Client Directory
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Client Management
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl">
            Monitor 1-on-1 trainees, assigned coaches, subscription statuses, and workout activity logs across the Wellwigen platform.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search trainee, coach, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 shadow-xs placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* ================= KPI STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
              Total Enrolled
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            {clients.length}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">Active registered trainees</p>
        </div>

        <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              Active Memberships
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-emerald-700 tracking-tight">
            {clients.filter((c) => c.subscriptionStatus === 'Active').length}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">Up to date on subscriptions</p>
        </div>

        <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">
              Expired Subscriptions
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-rose-700 tracking-tight">
            {clients.filter((c) => c.subscriptionStatus === 'Expired').length}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">Need renewal follow-up</p>
        </div>

        <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700">
              Completed Sessions
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <h3 className="text-2xl font-black text-sky-700 tracking-tight">
            {totalSessionsCompleted}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">Logged workouts platform-wide</p>
        </div>
      </div>

      {/* ================= CLIENTS TABLE & TOOLBAR ================= */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Enrolled Trainees
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
              {filteredClients.length}
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['all', 'active', 'expired'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#009688] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st === 'all' ? 'All Clients' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredClients.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Users size={36} className="mx-auto text-slate-300" />
            <h4 className="text-sm font-bold text-slate-800">No trainees found</h4>
            <p className="text-xs text-slate-400">
              {search ? 'Try clearing your search query.' : 'No trainees currently registered.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {paginatedClients.map((client) => {
              const progressPct =
                client.totalSessions > 0
                  ? Math.round((client.sessionsCompleted / client.totalSessions) * 100)
                  : 0;

              return (
                <div
                  key={client.id}
                  onClick={() => setSelectedClient(client)}
                  className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4 cursor-pointer"
                >
                  {/* Left: Avatar & Identity */}
                  <div className="flex items-center gap-4 min-w-[240px]">
                    <img
                      src={client.avatar}
                      alt={client.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100 shadow-xs"
                      onError={(e) => {
                        e.target.src =
                          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';
                      }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{client.name}</h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            client.subscriptionStatus === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {client.subscriptionStatus}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                        <Mail size={12} />
                        {client.email}
                      </p>
                    </div>
                  </div>

                  {/* Middle: Assigned Coach & Goal */}
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <Award size={13} className="text-teal-600" />
                      <span>{client.goal}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Dumbbell size={11} className="text-teal-600" />
                        Coach: {client.assignedCoach}
                      </span>
                      <span className="text-[10px] text-teal-700 font-semibold">
                        {client.plan}
                      </span>
                    </div>
                  </div>

                  {/* Sessions Progress Bar */}
                  <div className="w-full lg:w-44">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1">
                      <span>Progress</span>
                      <span>
                        {client.sessionsCompleted} / {client.totalSessions} ({progressPct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-teal-500 to-sky-600 h-full rounded-full transition-all"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Right: Next Session & Action */}
                  <div className="flex items-center justify-between lg:justify-end gap-3 min-w-[200px]">
                    <div className="text-left lg:text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Next Session
                      </p>
                      <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mt-0.5 lg:justify-end">
                        <Clock size={12} className="text-sky-600" />
                        {client.nextSession}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedClient(client);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-700 border border-slate-200 hover:border-teal-300 font-bold text-xs transition-all cursor-pointer"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing Page {page} of {totalPages} ({filteredClients.length} trainees)
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft size={14} />
                <span>Previous</span>
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= CLIENT PROFILE DRAWER ================= */}
      <AnimatePresence>
        {selectedClient && (
          <div className="fixed inset-0 z-[120] flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedClient(null)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            />

            {/* Slide-in Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative w-full max-w-xl bg-white shadow-2xl z-10 flex flex-col h-full overflow-hidden border-l border-slate-200"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedClient.avatar}
                    alt={selectedClient.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-200"
                  />
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900">{selectedClient.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          selectedClient.subscriptionStatus === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {selectedClient.subscriptionStatus}
                      </span>
                      <span className="text-xs text-slate-400">{selectedClient.email}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedClient(null)}
                  className="p-2 text-slate-400 hover:text-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
                {/* 1. Subscription & Package */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Subscription & Membership Status
                  </span>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-400 block mb-0.5">Active Package</span>
                      <span className="font-bold text-slate-900 text-sm">{selectedClient.plan}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Renewal Date</span>
                      <span className="font-bold text-slate-900">{selectedClient.renewalDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Sessions Progress</span>
                      <span className="font-bold text-teal-700">
                        {selectedClient.sessionsCompleted} of {selectedClient.totalSessions} Sessions
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Next Appointment</span>
                      <span className="font-bold text-slate-900">{selectedClient.nextSession}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Assigned Coach Management */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Assigned Fitness Coach
                    </span>
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                      1-on-1 Assigned
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                        <Dumbbell size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-xs">{selectedClient.assignedCoach}</p>
                        <p className="text-[10px] text-slate-400">Lead Strength Coach</p>
                      </div>
                    </div>

                    {/* Reassign Selector */}
                    <select
                      value={selectedClient.assignedCoach}
                      onChange={(e) => {
                        const newName = e.target.value;
                        const match = coaches.find((c) => c.name === newName);
                        handleReassignCoach(selectedClient.id, newName, match?.id || 'trn_demo_101');
                      }}
                      className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                    >
                      <option value="Vikram Rajput">Vikram Rajput</option>
                      {coaches.map((c) => (
                        <option key={c.id || c._id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 3. Fitness Goals & Target Metrics */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Target Fitness Goal & Program Focus
                  </span>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center gap-3">
                    <Award size={18} className="text-teal-600 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{selectedClient.goal}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Focused on progressive overload, posture realignment, and cardiovascular conditioning.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 4. Workout Activity History */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Workout Activity Log
                    </span>
                    <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full">
                      {(activities[selectedClient.id] || []).length} Logged
                    </span>
                  </div>

                  {/* Add Activity Form */}
                  <form onSubmit={handleAddActivity} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <p className="font-bold text-slate-700 text-xs">Log New Workout Note</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Upper Body Hypertrophy Session"
                        value={newActivityTitle}
                        onChange={(e) => setNewActivityTitle(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-[#009688] text-white font-bold rounded-lg hover:bg-[#00796B] transition-colors cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  </form>

                  {/* Activity List */}
                  <div className="space-y-2">
                    {(activities[selectedClient.id] || []).length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-3 text-center">
                        No recent workout activities logged for this trainee.
                      </p>
                    ) : (
                      (activities[selectedClient.id] || []).map((act) => (
                        <div
                          key={act.id}
                          className="p-3 bg-white rounded-xl border border-slate-200 space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                              <Activity size={13} className="text-teal-600" />
                              {act.title}
                            </span>
                            <span className="text-[10px] text-slate-400">{act.date}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 pl-4">{act.notes}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
