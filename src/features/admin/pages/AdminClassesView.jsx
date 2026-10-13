import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Video,
  UserCheck,
  UserX,
  ExternalLink,
  Edit2,
  Trash2,
  X,
  ShieldCheck,
  Dumbbell,
  Users,
  ChevronRight,
  Info,
  RefreshCw,
  Sparkles,
  Award,
  Layers,
  ArrowRight,
  Check,
} from 'lucide-react';
import { trainerApi, DEFAULT_COACHES_ROSTER } from '../../../services/trainerApi';

// Default fitness cover images based on category
const CATEGORY_COVERS = {
  'Strength & Conditioning': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
  'HIIT & Conditioning': 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?q=80&w=800&auto=format&fit=crop',
  'Mobility & Core': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop',
  'Yoga Flow': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
  'Functional Training': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
  'Pilates': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop',
};

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function AdminClassesView({ onNavigateToTrainers }) {
  const [classes, setClasses] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDayInspection, setSelectedDayInspection] = useState('Wednesday');
  const [notification, setNotification] = useState('');

  // Modals state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedClassForAssign, setSelectedClassForAssign] = useState(null);
  const [selectedCoachId, setSelectedCoachId] = useState('');
  const [editingClassId, setEditingClassId] = useState(null);

  // New Class Form State
  const [classForm, setClassForm] = useState({
    title: 'Core Stability & Functional Mobility',
    category: 'Strength & Conditioning',
    fitnessLevel: 'All Levels',
    date: '2026-10-14',
    time: '10:30 AM',
    duration: 45,
    capacity: 20,
    isFreeDemo: true,
    allowedTiers: ['STARTER', 'GOLD', 'PLATINUM'],
    zoomUrl: 'https://us02web.zoom.us/j/8492019284?pwd=WLLWGN26',
    meetingId: '849 201 9284',
    passcode: 'WLLWGN26',
    coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
    assignedCoachId: 'trn_aditya',
  });

  // Load classes and coaches
  const loadData = () => {
    const classList = trainerApi.getClasses();
    setClasses(classList);
    const coachesList = trainerApi.getCoachesWithAvailability();
    setCoaches(coachesList);
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('classesUpdated', handleUpdate);
    return () => window.removeEventListener('classesUpdated', handleUpdate);
  }, []);

  const triggerNotice = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  // Determine day of week from date string
  const getDayNameFromDate = (dateString) => {
    try {
      if (!dateString) return 'Wednesday';
      const parts = String(dateString).split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        return d.toLocaleDateString('en-US', { weekday: 'long' });
      }
      const d = new Date(dateString);
      return !isNaN(d.getTime()) ? d.toLocaleDateString('en-US', { weekday: 'long' }) : 'Wednesday';
    } catch {
      return 'Wednesday';
    }
  };

  // Availability breakdown for selected day in the summary bar
  const inspectedDayAvailability = useMemo(() => {
    const available = [];
    const unavailable = [];

    coaches.forEach((coach) => {
      const isAvailable = coach.availability?.days?.includes(selectedDayInspection);
      if (isAvailable) {
        available.push(coach);
      } else {
        unavailable.push(coach);
      }
    });

    return { available, unavailable };
  }, [coaches, selectedDayInspection]);

  // Open Assign Modal for a specific class
  const handleOpenAssignModal = (cls) => {
    setSelectedClassForAssign(cls);
    setSelectedCoachId(cls.trainerId || '');
    setShowAssignModal(true);
  };

  // Confirm Coach Assignment
  const handleConfirmAssignment = async () => {
    if (!selectedClassForAssign) return;

    if (!selectedCoachId) {
      alert('Please select a coach to assign.');
      return;
    }

    const targetCoach = coaches.find((c) => c.id === selectedCoachId);
    if (!targetCoach) return;

    await trainerApi.assignCoachToClass(selectedClassForAssign.id, {
      id: targetCoach.id,
      name: targetCoach.name,
      photoUrl: targetCoach.photoUrl,
      specialization: targetCoach.specialization,
    });

    loadData();
    setShowAssignModal(false);
    triggerNotice(`Assigned ${targetCoach.name} to "${selectedClassForAssign.title}" successfully!`);
  };

  // Open Schedule Modal (Create or Edit)
  const handleOpenScheduleModal = (cls = null) => {
    if (cls) {
      setEditingClassId(cls.id);
      setClassForm({
        title: cls.title || '',
        category: cls.category || 'Strength & Conditioning',
        fitnessLevel: cls.fitnessLevel || 'All Levels',
        date: cls.date || '2026-10-14',
        time: cls.time || '10:30 AM',
        duration: cls.durationMins || parseInt(cls.duration, 10) || 45,
        capacity: cls.capacity || 20,
        isFreeDemo: cls.isFreeDemo !== undefined ? cls.isFreeDemo : true,
        allowedTiers: cls.allowedTiers || ['STARTER', 'GOLD', 'PLATINUM'],
        zoomUrl: cls.zoomUrl || 'https://us02web.zoom.us/j/8492019284?pwd=WLLWGN26',
        meetingId: cls.meetingId || '849 201 9284',
        passcode: cls.passcode || 'WLLWGN26',
        coverImage: cls.coverImage || CATEGORY_COVERS[cls.category] || CATEGORY_COVERS['Strength & Conditioning'],
        assignedCoachId: cls.trainerId || 'trn_aditya',
      });
    } else {
      setEditingClassId(null);
      setClassForm({
        title: 'Core Stability & Functional Mobility',
        category: 'Strength & Conditioning',
        fitnessLevel: 'All Levels',
        date: '2026-10-14',
        time: '10:30 AM',
        duration: 45,
        capacity: 20,
        isFreeDemo: true,
        allowedTiers: ['STARTER', 'GOLD', 'PLATINUM'],
        zoomUrl: 'https://us02web.zoom.us/j/8492019284?pwd=WLLWGN26',
        meetingId: '849 201 9284',
        passcode: 'WLLWGN26',
        coverImage: CATEGORY_COVERS['Strength & Conditioning'],
        assignedCoachId: 'trn_aditya',
      });
    }
    setShowScheduleModal(true);
  };

  // Save Schedule Class
  const handleSaveScheduleClass = async (e) => {
    e.preventDefault();
    if (!classForm.title.trim()) {
      alert('Please enter a class title.');
      return;
    }

    const assignedCoach = coaches.find((c) => c.id === classForm.assignedCoachId) || coaches[0];

    const payload = {
      ...classForm,
      subtitle: 'Live group training.',
      duration: `${classForm.duration} mins`,
      durationMins: parseInt(classForm.duration, 10) || 45,
      formattedDateTime: `${classForm.date} • ${classForm.time}`,
      status: 'Approved & Live',
      trainerId: assignedCoach?.id || '',
      trainerName: assignedCoach?.name || 'Coach Aditya',
      trainerPhoto: assignedCoach?.photoUrl || '',
      trainerSpecialization: assignedCoach?.specialization || '',
      coverImage: classForm.coverImage || CATEGORY_COVERS[classForm.category] || CATEGORY_COVERS['Strength & Conditioning'],
    };

    if (editingClassId) {
      await trainerApi.updateClass(editingClassId, payload);
      triggerNotice(`Updated workout class "${payload.title}"!`);
    } else {
      await trainerApi.createClass(payload);
      triggerNotice(`Scheduled new class and assigned ${assignedCoach?.name || 'Coach'}!`);
    }

    loadData();
    setShowScheduleModal(false);
    setEditingClassId(null);
  };

  // Delete Class
  const handleDeleteClass = async (id) => {
    if (window.confirm('Are you sure you want to remove this workout class?')) {
      await trainerApi.deleteClass(id);
      loadData();
      triggerNotice('Workout class removed.');
    }
  };

  // Filter and search
  const filteredClasses = classes.filter((cls) => {
    const matchesFilter =
      activeFilter === 'All' ||
      (activeFilter === 'Assigned' && cls.trainerName) ||
      (activeFilter === 'Unassigned' && !cls.trainerName) ||
      (cls.category && cls.category.toLowerCase().includes(activeFilter.toLowerCase()));

    const matchesSearch =
      (cls.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cls.trainerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cls.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cls.time || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cls.date || '').toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Class Scheduling &amp; Trainer Assignment
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-bold">
              Admin Control
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Check live coach availability schedules and assign qualified trainers to upcoming live workout classes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onNavigateToTrainers && (
            <button
              onClick={onNavigateToTrainers}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Users size={15} className="text-slate-500" />
              <span>All Trainers ({coaches.length})</span>
            </button>
          )}

          <button
            onClick={() => handleOpenScheduleModal()}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus size={16} />
            <span>Schedule New Class</span>
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {notification && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs flex items-center gap-2.5 shadow-xs">
          <CheckCircle2 size={16} className="text-teal-600 shrink-0" />
          <span className="font-semibold">{notification}</span>
        </div>
      )}

      {/* ================= REAL-TIME TRAINER AVAILABILITY INTELLIGENCE BAR ================= */}
      <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-teal-600" />
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Coach Availability Inspector
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any day of the week to check how many coaches are available for scheduling.
            </p>
          </div>

          {/* Quick Day Selector Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {DAYS_OF_WEEK.map((day) => {
              const isSelected = selectedDayInspection === day;
              const availableCount = coaches.filter((c) => c.availability?.days?.includes(day)).length;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDayInspection(day)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{day.substring(0, 3)}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      availableCount > 0 ? 'bg-emerald-400' : 'bg-slate-400'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Day Availability Breakdown Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Card 1: Availability Ratio */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                {selectedDayInspection} Status
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-slate-900">
                  {inspectedDayAvailability.available.length} of {coaches.length}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                  Available
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-teal-600 flex items-center justify-center font-bold text-xs shadow-xs">
              {Math.round((inspectedDayAvailability.available.length / coaches.length) * 100)}%
            </div>
          </div>

          {/* Card 2: Available Coaches List */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-600" />
                Available Coaches ({inspectedDayAvailability.available.length})
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold">Active Duty</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {inspectedDayAvailability.available.map((c) => (
                <span
                  key={c.id}
                  className="px-2.5 py-1 rounded-lg bg-white border border-emerald-200 text-emerald-950 font-bold text-[11px] flex items-center gap-1.5 shadow-2xs"
                >
                  <img src={c.photoUrl} alt={c.name} className="w-4 h-4 rounded-full object-cover" />
                  <span>{c.name}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Card 3: Off-Duty Coaches */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <UserX size={13} className="text-slate-400" />
                Off-Duty Coaches ({inspectedDayAvailability.unavailable.length})
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">Rest Day</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {inspectedDayAvailability.unavailable.length === 0 ? (
                <span className="text-[11px] text-slate-400 italic">All coaches available on this day.</span>
              ) : (
                inspectedDayAvailability.unavailable.map((c) => (
                  <span
                    key={c.id}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-500 font-medium text-[11px] flex items-center gap-1.5 shadow-2xs"
                  >
                    <img src={c.photoUrl} alt={c.name} className="w-4 h-4 rounded-full object-cover grayscale opacity-70" />
                    <span>{c.name}</span>
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= FILTER & SEARCH BAR ================= */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['All', 'Assigned', 'Unassigned', 'Strength & Conditioning', 'HIIT & Conditioning', 'Mobility & Core'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                activeFilter === tab
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search class, coach, or date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>
      </div>

      {/* ================= CLASSES GRID ================= */}
      {filteredClasses.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Dumbbell size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No workout classes found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search filter or schedule a new workout class above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((cls) => {
            const classDay = getDayNameFromDate(cls.date);
            const assignedCoach = coaches.find((c) => c.id === cls.trainerId || c.name === cls.trainerName);
            const coachAvailability = assignedCoach
              ? trainerApi.getCoachAvailabilityStatus(assignedCoach, cls.date, cls.time)
              : null;

            return (
              <div
                key={cls.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Class Cover Image with Category & Day Badge */}
                  <div className="h-48 w-full relative overflow-hidden bg-slate-900">
                    <img
                      src={cls.coverImage || CATEGORY_COVERS[cls.category] || CATEGORY_COVERS['Strength & Conditioning']}
                      alt={cls.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Category Badge */}
                    <span className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-xs text-slate-900 font-extrabold text-[10px] tracking-wider px-3 py-1 rounded-full uppercase shadow-xs">
                      {cls.category || 'WORKOUT'}
                    </span>

                    {/* Day / Status Badge */}
                    <span className="absolute top-3.5 right-3.5 bg-emerald-50/95 backdrop-blur-xs text-emerald-800 border border-emerald-200 font-extrabold text-[10px] tracking-wider px-3 py-1 rounded-full uppercase shadow-xs flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {classDay}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 leading-snug tracking-tight">
                        {cls.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-1">
                        <Calendar size={13} className="text-teal-600" />
                        <span>{cls.date || '2026-10-14'}</span>
                        <span>&bull;</span>
                        <Clock size={13} className="text-teal-600" />
                        <span>{cls.time || '10:30 AM'} ({cls.duration || '45 mins'})</span>
                      </div>
                    </div>

                    {/* ASSIGNED TRAINER SECTION */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Assigned Lead Trainer
                        </span>
                        {assignedCoach && coachAvailability?.isAvailable ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 size={11} /> Available on {classDay}
                          </span>
                        ) : assignedCoach && !coachAvailability?.isAvailable ? (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <AlertCircle size={11} /> Off-Duty {classDay}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full">
                            Needs Assignment
                          </span>
                        )}
                      </div>

                      {cls.trainerName ? (
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                cls.trainerPhoto ||
                                assignedCoach?.photoUrl ||
                                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
                              }
                              alt={cls.trainerName}
                              className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-xs"
                            />
                            <div>
                              <p className="font-bold text-xs text-slate-900">{cls.trainerName}</p>
                              <p className="text-[10px] text-teal-700 font-medium">
                                {cls.trainerSpecialization || assignedCoach?.specialization || 'Fitness Coach'}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleOpenAssignModal(cls)}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-[11px] transition-colors cursor-pointer shrink-0"
                          >
                            Change
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-amber-700 font-semibold italic">
                            No coach assigned yet.
                          </span>
                          <button
                            type="button"
                            onClick={() => handleOpenAssignModal(cls)}
                            className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-[11px] shadow-xs transition-colors cursor-pointer"
                          >
                            Assign Coach
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Zoom Meeting Credential Info */}
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Video size={14} className="text-sky-600" />
                        <span className="font-mono">ID: {cls.meetingId || '849 201 9284'}</span>
                      </div>
                      <span className="font-mono text-slate-400">PWD: {cls.passcode || 'WLLWGN26'}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-4">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenScheduleModal(cls)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Edit Class Details"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteClass(cls.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Class"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenAssignModal(cls)}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <UserCheck size={14} />
                    <span>Assign Coach</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= ASSIGN COACH MODAL ================= */}
      {showAssignModal && selectedClassForAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 gap-3">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Assign Coach for Class
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Class: <strong className="text-slate-800">{selectedClassForAssign.title}</strong>
                </p>
              </div>
              <button
                onClick={() => setShowAssignModal(false)}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Target Class Schedule Banner */}
            <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200/80 flex items-center justify-between text-xs text-teal-900 font-semibold">
              <div className="flex items-center gap-2">
                <Calendar size={15} className="text-teal-700" />
                <span>
                  {selectedClassForAssign.date} ({getDayNameFromDate(selectedClassForAssign.date)})
                </span>
                <span>&bull;</span>
                <Clock size={15} className="text-teal-700" />
                <span>{selectedClassForAssign.time}</span>
              </div>
              <span className="text-[11px] font-bold text-teal-800 bg-white px-2.5 py-0.5 rounded-full border border-teal-200">
                {selectedClassForAssign.category}
              </span>
            </div>

            {/* Coaches Availability List for this specific date */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">
                  Select Lead Coach (Ranked by Availability):
                </span>
                <span className="text-[11px] text-slate-400">
                  Day: {getDayNameFromDate(selectedClassForAssign.date)}
                </span>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {coaches.map((coach) => {
                  const classDay = getDayNameFromDate(selectedClassForAssign.date);
                  const isAvailable = coach.availability?.days?.includes(classDay);
                  const isSelected = selectedCoachId === coach.id;

                  return (
                    <div
                      key={coach.id}
                      onClick={() => setSelectedCoachId(coach.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/70'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={coach.photoUrl}
                          alt={coach.name}
                          className="w-11 h-11 rounded-2xl object-cover border border-slate-200 shadow-2xs shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">{coach.name}</span>
                            <span className="text-[10px] text-slate-400 font-semibold">&bull; {coach.experience}</span>
                          </div>
                          <p className="text-[11px] text-teal-700 font-medium">{coach.specialization}</p>

                          <div className="flex items-center gap-2 pt-1">
                            {isAvailable ? (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md flex items-center gap-1">
                                <CheckCircle2 size={10} /> Available on {classDay}s
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded-md flex items-center gap-1">
                                <AlertCircle size={10} /> Off-Duty on {classDay}s
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-xs">
                            <Check size={14} />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setShowAssignModal(false)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAssignment}
                className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all cursor-pointer"
              >
                Confirm Coach Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= SCHEDULE NEW / EDIT CLASS MODAL ================= */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 gap-3">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  {editingClassId ? 'Edit Workout Class' : 'Schedule New Workout Class'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure session details, Zoom link, and assign an available coach.
                </p>
              </div>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveScheduleClass} className="space-y-4">
              {/* Class Title */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Class Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Core Stability & Dynamic Power"
                  value={classForm.title}
                  onChange={(e) => setClassForm({ ...classForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              {/* Category & Fitness Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Category
                  </label>
                  <select
                    value={classForm.category}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      setClassForm({
                        ...classForm,
                        category: newCat,
                        coverImage: CATEGORY_COVERS[newCat] || classForm.coverImage,
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  >
                    <option value="Strength & Conditioning">Strength &amp; Conditioning</option>
                    <option value="HIIT & Conditioning">HIIT &amp; Conditioning</option>
                    <option value="Mobility & Core">Mobility &amp; Core</option>
                    <option value="Yoga Flow">Yoga Flow</option>
                    <option value="Functional Training">Functional Training</option>
                    <option value="Pilates">Pilates</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Fitness Level
                  </label>
                  <select
                    value={classForm.fitnessLevel}
                    onChange={(e) => setClassForm({ ...classForm, fitnessLevel: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  >
                    <option value="All Levels">All Levels</option>
                    <option value="Beginner">Beginner Friendly</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced Athlete</option>
                  </select>
                </div>
              </div>

              {/* Date, Time & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={classForm.date}
                    onChange={(e) => setClassForm({ ...classForm, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                  <span className="text-[10px] text-teal-700 font-bold mt-0.5 block">
                    Day: {getDayNameFromDate(classForm.date)}
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    placeholder="10:30 AM"
                    value={classForm.time}
                    onChange={(e) => setClassForm({ ...classForm, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Duration (Mins)
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="180"
                    value={classForm.duration}
                    onChange={(e) => setClassForm({ ...classForm, duration: parseInt(e.target.value, 10) || 45 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>

              {/* ASSIGN COACH DROPDOWN WITH REAL-TIME AVAILABILITY */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700">
                    Assign Lead Coach According to Availability
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Day: {getDayNameFromDate(classForm.date)}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1">
                  {coaches.map((coach) => {
                    const classDay = getDayNameFromDate(classForm.date);
                    const isAvail = coach.availability?.days?.includes(classDay);
                    const isSelected = classForm.assignedCoachId === coach.id;

                    return (
                      <div
                        key={coach.id}
                        onClick={() => setClassForm({ ...classForm, assignedCoachId: coach.id })}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                          isSelected
                            ? 'border-teal-600 bg-white ring-2 ring-teal-500/20'
                            : 'border-slate-200 hover:border-slate-300 bg-white/70'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={coach.photoUrl}
                            alt={coach.name}
                            className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-[11px] text-slate-900 leading-none">{coach.name}</p>
                            <p className="text-[10px] text-teal-700 font-medium truncate max-w-[120px]">{coach.specialization}</p>
                            <span className={`text-[9px] font-bold ${isAvail ? 'text-emerald-700' : 'text-rose-600'}`}>
                              {isAvail ? 'Available' : `Off-Duty on ${classDay}`}
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0">
                            <Check size={11} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Zoom Credentials */}
              <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-sky-900 block">
                  Live Zoom Credentials
                </span>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1">Zoom Meeting Link</label>
                  <input
                    type="url"
                    value={classForm.zoomUrl}
                    onChange={(e) => setClassForm({ ...classForm, zoomUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Meeting ID</label>
                    <input
                      type="text"
                      value={classForm.meetingId}
                      onChange={(e) => setClassForm({ ...classForm, meetingId: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 mb-1">Passcode</label>
                    <input
                      type="text"
                      value={classForm.passcode}
                      onChange={(e) => setClassForm({ ...classForm, passcode: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all cursor-pointer"
                >
                  {editingClassId ? 'Save Changes' : 'Schedule Class & Assign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
