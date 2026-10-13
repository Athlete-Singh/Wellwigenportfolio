import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  RefreshCw,
  X,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  ExternalLink,
  ArrowUpDown,
  FileText,
  AlertCircle,
  Video,
  Dumbbell,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Instagram,
  Linkedin,
  ChevronLeft,
  ChevronRight,
  Filter,
  DollarSign,
  MessageSquare,
  Copy,
  Send,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { trainerApi } from '../../../services/trainerApi';

// [DISABLED FOR FUTURE USE] Old status config without suspended
/*
const STATUS_CONFIG = {
  pending: {
    bg: 'bg-amber-50 text-amber-700 border-amber-200/80',
    dot: 'bg-amber-500',
    label: 'Pending Review',
  },
  approved: {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    dot: 'bg-emerald-500',
    label: 'Approved Coach',
  },
  rejected: {
    bg: 'bg-rose-50 text-rose-700 border-rose-200/80',
    dot: 'bg-rose-500',
    label: 'Rejected',
  },
  onboarding: {
    bg: 'bg-sky-50 text-sky-700 border-sky-200/80',
    dot: 'bg-sky-500',
    label: 'Incomplete Draft',
  },
};
*/

// NEW CODE - Wellwigen Admin Coach Status Config with Suspended support
const STATUS_CONFIG = {
  pending: {
    bg: 'bg-amber-50 text-amber-700 border-amber-200/80',
    dot: 'bg-amber-500',
    label: 'Pending Review',
  },
  approved: {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    dot: 'bg-emerald-500',
    label: 'Approved Coach',
  },
  suspended: {
    bg: 'bg-amber-100 text-amber-900 border-amber-300',
    dot: 'bg-amber-600',
    label: 'Suspended Coach',
  },
  rejected: {
    bg: 'bg-rose-50 text-rose-700 border-rose-200/80',
    dot: 'bg-rose-500',
    label: 'Rejected',
  },
  onboarding: {
    bg: 'bg-sky-50 text-sky-700 border-sky-200/80',
    dot: 'bg-sky-500',
    label: 'Incomplete Draft',
  },
};

// Preset rejection quick-reasons for convenience
const REJECTION_PRESETS = [
  'Certification document is illegible or expired. Please re-upload.',
  'Missing valid fitness trainer accreditation (e.g. ACE, NASM, ISSA, or equivalent).',
  'Intro video link is inaccessible or private. Please provide a public link.',
  'Profile details and contact information require further athletic verification.',
];

export default function TrainersView({ onStatusChange, onNavigateToClasses }) {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' | 'asc'
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [counts, setCounts] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [totalPages, setTotalPages] = useState(1);

  // Reject modal state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [trainerToReject, setTrainerToReject] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  // Load trainers from backend / trainerApi
  const fetchTrainers = async () => {
    try {
      setLoading(true);
      const res = await trainerApi.getAdminTrainers({
        status: statusFilter,
        search: searchTerm,
        page,
        limit,
        sortOrder,
      });

      if (res && res.trainers) {
        setTrainers(res.trainers);
        if (res.counts) {
          setCounts(res.counts);
          if (onStatusChange) {
            onStatusChange(res.counts.pending || 0);
          }
        }
        if (res.pagination) {
          setTotalPages(res.pagination.pages || 1);
        }
      }
    } catch (err) {
      console.error('Error fetching admin trainers:', err);
      toast.error('Failed to load trainer applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, [statusFilter, page, sortOrder]);

  // Handle Search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTrainers();
  };

  // Open trainer detail drawer
  const handleOpenDrawer = (trainer) => {
    setSelectedTrainer(trainer);
  };

  const [allClients, setAllClients] = useState([]);

  // Load clients to display coach assigned clients
  useEffect(() => {
    try {
      const cls = trainerApi.getClients();
      setAllClients(Array.isArray(cls) ? cls : []);
    } catch {
      setAllClients([]);
    }
  }, []);

  // Approve Trainer Handler
  const handleApprove = async (trainer) => {
    const id = trainer._id || trainer.id;
    try {
      setIsSubmittingAction(true);
      await trainerApi.updateTrainerStatus(id, { status: 'approved' });
      toast.success(`🎉 ${trainer.name} has been approved as a verified coach!`);
      
      // Update local view
      if (selectedTrainer && (selectedTrainer._id === id || selectedTrainer.id === id)) {
        setSelectedTrainer((prev) => ({ ...prev, status: 'approved', rejectionReason: '' }));
      }
      fetchTrainers();
    } catch (err) {
      toast.error(err.message || 'Failed to approve trainer');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  // NEW CODE - Suspend Trainer Handler
  const handleSuspend = async (trainer) => {
    const id = trainer._id || trainer.id;
    try {
      setIsSubmittingAction(true);
      await trainerApi.updateTrainerStatus(id, { status: 'suspended' });
      toast.success(`⚠️ Coach ${trainer.name} has been suspended.`);
      
      // Update local view
      if (selectedTrainer && (selectedTrainer._id === id || selectedTrainer.id === id)) {
        setSelectedTrainer((prev) => ({ ...prev, status: 'suspended' }));
      }
      fetchTrainers();
    } catch (err) {
      toast.error(err.message || 'Failed to suspend coach');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  // Open Reject Modal
  const handleOpenRejectModal = (trainer) => {
    setTrainerToReject(trainer);
    setRejectionReason('');
    setRejectModalOpen(true);
  };

  const [notifyWhatsApp, setNotifyWhatsApp] = useState(true);

  // Generate official WhatsApp message for Rejection
  const getWhatsAppRejectionMessage = (trainer, reason) => {
    return `🚨 *WELLWIGEN FITNESS - COACH APPLICATION UPDATE* 🚨
━━━━━━━━━━━━━━━━━━━━━━━━━━
Hello *${trainer?.name || 'Coach'}*,

Thank you for your interest in joining Wellwigen as a fitness coach. 

Following a review by our verification board, your coach application could not be approved at this time.

📋 *STATUS:* Rejected / Action Required
⚠️ *REASON PROVIDED:*
"${reason}"

💡 *NEXT STEPS TO GET APPROVED:*
Please log into your Coach Hub portal to update your credentials and re-submit your profile:
🔗 *Coach Portal:* ${window.location.origin}/trainer/onboarding

Once updated, re-submit your profile for fast-track review.

For assistance, please contact support@wellwigen.com.
━━━━━━━━━━━━━━━━━━━━━━━━━━
*Wellwigen Verification Team*`;
  };

  // Generate official WhatsApp message for Approval
  const getWhatsAppApprovalMessage = (trainer) => {
    return `🎉 *WELLWIGEN FITNESS - COACH PROFILE APPROVED* 🎉
━━━━━━━━━━━━━━━━━━━━━━━━━━
Hello *${trainer?.name || 'Coach'}*,

Congratulations! Our athletic verification board has verified your credentials and approved your Wellwigen coach application. 

✅ *STATUS:* Verified & Live
🏆 *Coach ID:* ${trainer?.applicationId || trainer?._id || 'Verified Coach'}

You can now log in to schedule live group classes, set up Zoom credentials, and accept trainees:
🔗 *Coach Portal:* ${window.location.origin}/trainer/dashboard

Welcome aboard!
━━━━━━━━━━━━━━━━━━━━━━━━━━
*Wellwigen Verification Team*`;
  };

  // Open WhatsApp with formatted notice
  const openWhatsAppNotice = (trainer, type = 'rejection', customReason = '') => {
    const reason = customReason || trainer?.rejectionReason || 'Please review your uploaded certification documents and re-apply.';
    const msg = type === 'rejection' 
      ? getWhatsAppRejectionMessage(trainer, reason)
      : getWhatsAppApprovalMessage(trainer);

    const cleanPhone = (trainer?.phone || '').replace(/[^0-9]/g, '');
    const waUrl = cleanPhone
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(msg)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;

    window.open(waUrl, '_blank');
    toast.success(`WhatsApp message ready for ${trainer?.name || 'Coach'}`);
  };

  // Confirm Reject
  const handleConfirmReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Rejection reason is strictly required.');
      return;
    }

    const id = trainerToReject._id || trainerToReject.id;
    const targetTrainer = { ...trainerToReject };
    const reasonText = rejectionReason.trim();

    try {
      setIsSubmittingAction(true);
      await trainerApi.updateTrainerStatus(id, {
        status: 'rejected',
        rejectionReason: reasonText,
      });

      // If notifyWhatsApp is checked, open WhatsApp message immediately
      if (notifyWhatsApp) {
        openWhatsAppNotice(targetTrainer, 'rejection', reasonText);
      }

      toast.success(`Application for ${targetTrainer.name} marked as Rejected. Email sent & status synced to Trainer Panel.`);
      
      setRejectModalOpen(false);
      setTrainerToReject(null);
      setRejectionReason('');

      if (selectedTrainer && (selectedTrainer._id === id || selectedTrainer.id === id)) {
        setSelectedTrainer((prev) => ({
          ...prev,
          status: 'rejected',
          rejectionReason: reasonText,
        }));
      }
      fetchTrainers();
    } catch (err) {
      toast.error(err.message || 'Failed to reject application');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* ================= PAGE HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded uppercase tracking-wider">
              Verification Desk
            </span>
            <span className="text-xs text-slate-400">&bull; Live Applications</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Trainer Applications
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Review athletic credentials, inspect Cloudinary certificates, and approve certified master coaches.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {onNavigateToClasses && (
            <button
              onClick={onNavigateToClasses}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar size={14} />
              <span>Classes &amp; Schedule</span>
            </button>
          )}

          <button
            onClick={fetchTrainers}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin text-teal-600' : ''} />
            <span>Refresh Queue</span>
          </button>
        </div>
      </div>

      {/* ================= STAT SUMMARY CARDS ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Applications */}
        <div 
          onClick={() => { setStatusFilter('All'); setPage(1); }}
          className={`p-5 rounded-2xl bg-white border transition-all cursor-pointer shadow-xs hover:shadow-md ${
            statusFilter === 'All' ? 'border-teal-500 ring-2 ring-teal-500/10' : 'border-slate-200/90'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Coaches</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <Dumbbell size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {counts.total}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">All registrations in system</p>
        </div>

        {/* Pending Review */}
        <div 
          onClick={() => { setStatusFilter('pending'); setPage(1); }}
          className={`p-5 rounded-2xl bg-white border transition-all cursor-pointer shadow-xs hover:shadow-md ${
            statusFilter === 'pending' ? 'border-amber-500 ring-2 ring-amber-500/10' : 'border-slate-200/90'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Pending Review</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-700 tracking-tight flex items-center gap-2">
            <span>{counts.pending}</span>
            {counts.pending > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold uppercase">
                Action Req.
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Awaiting certificate verification</p>
        </div>

        {/* Approved Coaches */}
        <div 
          onClick={() => { setStatusFilter('approved'); setPage(1); }}
          className={`p-5 rounded-2xl bg-white border transition-all cursor-pointer shadow-xs hover:shadow-md ${
            statusFilter === 'approved' ? 'border-emerald-500 ring-2 ring-emerald-500/10' : 'border-slate-200/90'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Approved Coaches</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight">
            {counts.approved}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Active on public website</p>
        </div>

        {/* Rejected */}
        <div 
          onClick={() => { setStatusFilter('rejected'); setPage(1); }}
          className={`p-5 rounded-2xl bg-white border transition-all cursor-pointer shadow-xs hover:shadow-md ${
            statusFilter === 'rejected' ? 'border-rose-500 ring-2 ring-rose-500/10' : 'border-slate-200/90'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">Rejected</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-700 tracking-tight">
            {counts.rejected}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Declined or requires re-upload</p>
        </div>
      </div>

      {/* ================= SEARCH & FILTER TOOLBAR ================= */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Status Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {['All', 'pending', 'approved', 'suspended', 'rejected'].map((st) => {
              const active = statusFilter === st;
              const label =
                st === 'All'
                  ? 'All Coaches'
                  : st === 'pending'
                  ? 'Pending'
                  : st === 'approved'
                  ? 'Approved'
                  : st === 'suspended'
                  ? 'Suspended'
                  : 'Rejected';
              return (
                <button
                  key={st}
                  onClick={() => {
                    setStatusFilter(st);
                    setPage(1);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-[#009688] text-white shadow-xs shadow-teal-700/20'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search coach, city, specialty..."
                className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
              />
            </div>

            <button
              type="button"
              onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
              className="p-2 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              title="Toggle Sort Order"
            >
              <ArrowUpDown size={15} />
            </button>
          </form>
        </div>
      </div>

      {/* ================= TRAINERS DATA TABLE ================= */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-black text-base text-[#0F172A] tracking-tight">
              Coach Registry & Applications
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[11px] font-bold text-slate-600">
              {trainers.length} shown
            </span>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Click any row to view certificates & approve/reject
          </span>
        </div>

        {/* OLD CODE (commented by AI)
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400 space-y-3">
            <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold tracking-wider uppercase">Loading applications...</p>
          </div>
        ) : ...
        */}
        {/* NEW CODE - Modern SaaS Skeleton Table Loader */}
        {loading ? (
          <div className="p-6 space-y-4 animate-pulse">
            {[1, 2, 3, 4, 5].map((idx) => (
              <div key={idx} className="flex items-center justify-between gap-4 py-3 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100" />
                  <div className="space-y-1.5">
                    <div className="w-32 h-4 rounded bg-slate-100" />
                    <div className="w-44 h-3 rounded bg-slate-100" />
                  </div>
                </div>
                <div className="hidden sm:block space-y-1.5">
                  <div className="w-28 h-4 rounded bg-slate-100" />
                  <div className="w-20 h-3 rounded bg-slate-100" />
                </div>
                <div className="hidden md:block w-24 h-6 rounded-full bg-slate-100" />
                <div className="w-24 h-8 rounded-xl bg-slate-100" />
              </div>
            ))}
          </div>
        ) : trainers.length === 0 ? (
          <div className="py-24 text-center px-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Sparkles size={24} />
            </div>
            <h4 className="font-bold text-slate-800 text-base">No trainer applications found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {searchTerm || statusFilter !== 'All'
                ? 'Try clearing your search query or switching to another status filter.'
                : 'When new coaches register and complete onboarding, their submissions will appear here for review.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  <th className="px-5 py-3.5">Coach Applicant</th>
                  <th className="px-5 py-3.5">Specialization & Exp</th>
                  <th className="px-5 py-3.5">Contact & City</th>
                  <th className="px-5 py-3.5">Certificates</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {trainers.map((trn) => {
                  const statusKey = trn.status || 'pending';
                  const statusStyle = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;
                  const isSelected = (selectedTrainer?._id || selectedTrainer?.id) === (trn._id || trn.id);
                  const certCount = Array.isArray(trn.certifications) ? trn.certifications.length : (trn.certificateUrl ? 1 : 0);

                  return (
                    <tr
                      key={trn._id || trn.id}
                      onClick={() => handleOpenDrawer(trn)}
                      className={`hover:bg-teal-50/30 transition-colors cursor-pointer group ${
                        isSelected ? 'bg-teal-50/50' : ''
                      }`}
                    >
                      {/* Coach Name & Avatar */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center overflow-hidden shrink-0 border border-slate-200">
                            {trn.photoUrl || trn.avatar ? (
                              <img
                                src={trn.photoUrl || trn.avatar}
                                alt={trn.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              trn.name?.substring(0, 2).toUpperCase() || 'TR'
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                              {trn.name}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {trn.applicationId || trn.id || trn._id?.toString().substring(0, 8)}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Specialization & Experience */}
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-800">
                          {trn.specialization || trn.specialty || 'General Fitness'}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {trn.experience || `${trn.experienceYears || 3} Years`} exp
                        </div>
                      </td>

                      {/* Contact & City */}
                      <td className="px-5 py-4">
                        <div className="font-medium text-slate-700 truncate max-w-[180px]">
                          {trn.email}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          {trn.phone && <span>{trn.phone}</span>}
                          {trn.city && <span>&bull; {trn.city}</span>}
                        </div>
                      </td>

                      {/* Certificates */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px]">
                            <Award size={12} className="text-teal-600" />
                            <span>{certCount} docs</span>
                          </span>
                          {trn.certificateUrl && (
                            <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded">
                              Cloudinary
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusStyle.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                          {statusStyle.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        {/* OLD CODE (commented by AI)
                        <div className="flex items-center justify-end gap-1.5">
                          {statusKey !== 'approved' && (
                            <button
                              onClick={() => handleApprove(trn)}
                              disabled={isSubmittingAction}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                              title="Approve Coach Profile"
                            >
                              <CheckCircle2 size={12} />
                              <span className="hidden sm:inline">Approve</span>
                            </button>
                          )}
                          {statusKey !== 'rejected' && (
                            <button
                              onClick={() => handleOpenRejectModal(trn)}
                              disabled={isSubmittingAction}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                              title="Reject Application"
                            >
                              <X size={12} />
                              <span className="hidden sm:inline">Reject</span>
                            </button>
                          )}
                        </div>
                        */}

                        {/* NEW CODE - Approve / Suspend / Reactivate / Reject */}
                        <div className="flex items-center justify-end gap-1.5">
                          {statusKey === 'approved' && (
                            <button
                              onClick={() => handleSuspend(trn)}
                              disabled={isSubmittingAction}
                              className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                              title="Suspend Coach"
                            >
                              <span>Suspend</span>
                            </button>
                          )}
                          {statusKey === 'suspended' && (
                            <button
                              onClick={() => handleApprove(trn)}
                              disabled={isSubmittingAction}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                              title="Reactivate Coach"
                            >
                              <CheckCircle2 size={12} />
                              <span>Reactivate</span>
                            </button>
                          )}
                          {statusKey !== 'approved' && statusKey !== 'suspended' && (
                            <button
                              onClick={() => handleApprove(trn)}
                              disabled={isSubmittingAction}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                              title="Approve Coach Profile"
                            >
                              <CheckCircle2 size={12} />
                              <span className="hidden sm:inline">Approve</span>
                            </button>
                          )}
                          {statusKey === 'rejected' && (
                            <button
                              onClick={() => openWhatsAppNotice(trn, 'rejection')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                              title="Send Rejection Notice on WhatsApp"
                            >
                              <MessageSquare size={12} className="text-emerald-600" />
                              <span className="hidden sm:inline">WhatsApp</span>
                            </button>
                          )}
                          {statusKey !== 'rejected' && (
                            <button
                              onClick={() => handleOpenRejectModal(trn)}
                              disabled={isSubmittingAction}
                              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                              title="Reject Application"
                            >
                              <X size={12} />
                              <span className="hidden sm:inline">Reject</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors flex items-center gap-1"
              >
                <ChevronLeft size={14} />
                <span>Previous</span>
              </button>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page >= totalPages}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors flex items-center gap-1"
              >
                <span>Next</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= RIGHT DETAIL DRAWER ================= */}
      <AnimatePresence>
        {selectedTrainer && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelectedTrainer(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            {/* Drawer Body */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col z-10 border-l border-slate-200"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-teal-50/60 to-white">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white font-black text-lg flex items-center justify-center overflow-hidden shrink-0 border-2 border-white shadow-md">
                    {selectedTrainer.photoUrl || selectedTrainer.avatar ? (
                      <img
                        src={selectedTrainer.photoUrl || selectedTrainer.avatar}
                        alt={selectedTrainer.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      selectedTrainer.name?.substring(0, 2).toUpperCase() || 'TR'
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          (STATUS_CONFIG[selectedTrainer.status] || STATUS_CONFIG.pending).bg
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            (STATUS_CONFIG[selectedTrainer.status] || STATUS_CONFIG.pending).dot
                          }`}
                        />
                        {(STATUS_CONFIG[selectedTrainer.status] || STATUS_CONFIG.pending).label}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {selectedTrainer.applicationId || 'APP-' + (selectedTrainer._id || selectedTrainer.id)}
                      </span>
                    </div>
                    <h3 className="font-heading font-black text-xl text-[#0F172A] tracking-tight">
                      {selectedTrainer.name}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedTrainer(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
                {/* Rejection Notice Banner (if rejected) */}
                {selectedTrainer.status === 'rejected' && (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-xs text-rose-700 uppercase tracking-wider">
                        <AlertCircle size={14} />
                        <span>Application Rejected</span>
                      </div>
                      <span className="text-[10px] font-bold bg-white text-rose-700 px-2 py-0.5 rounded-full border border-rose-200">
                        Dispatched
                      </span>
                    </div>
                    <p className="text-xs text-rose-800 leading-relaxed font-medium">
                      "{selectedTrainer.rejectionReason || 'Application details could not be validated.'}"
                    </p>
                    <div className="pt-1 flex items-center gap-2">
                      <button
                        onClick={() => openWhatsAppNotice(selectedTrainer, 'rejection')}
                        className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      >
                        <MessageSquare size={13} />
                        <span>Send WhatsApp Rejection Notice</span>
                      </button>
                      <button
                        onClick={() => handleOpenRejectModal(selectedTrainer)}
                        className="py-2 px-3 rounded-lg bg-white border border-rose-300 text-rose-700 hover:bg-rose-100/50 font-bold text-xs transition-colors cursor-pointer"
                      >
                        <span>Edit Reason</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* OLD CODE (commented by AI)
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleApprove(selectedTrainer)}
                    disabled={isSubmittingAction || selectedTrainer.status === 'approved'}
                    className="py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 size={16} />
                    <span>{selectedTrainer.status === 'approved' ? 'Verified & Active' : 'Approve Application'}</span>
                  </button>

                  <button
                    onClick={() => handleOpenRejectModal(selectedTrainer)}
                    disabled={isSubmittingAction}
                    className="py-3 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <X size={16} />
                    <span>{selectedTrainer.status === 'rejected' ? 'Update Rejection Reason' : 'Reject Application'}</span>
                  </button>
                </div>
                */}

                {/* NEW CODE - Approve / Suspend / Reactivate / Reject Drawer Actions */}
                <div className="grid grid-cols-2 gap-3">
                  {selectedTrainer.status === 'approved' ? (
                    <button
                      onClick={() => handleSuspend(selectedTrainer)}
                      disabled={isSubmittingAction}
                      className="py-3 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                      <span>Suspend Coach</span>
                    </button>
                  ) : selectedTrainer.status === 'suspended' ? (
                    <button
                      onClick={() => handleApprove(selectedTrainer)}
                      disabled={isSubmittingAction}
                      className="py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                      <CheckCircle2 size={16} />
                      <span>Reactivate Coach</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApprove(selectedTrainer)}
                      disabled={isSubmittingAction}
                      className="py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                      <CheckCircle2 size={16} />
                      <span>Approve Application</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleOpenRejectModal(selectedTrainer)}
                    disabled={isSubmittingAction}
                    className="py-3 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <X size={16} />
                    <span>{selectedTrainer.status === 'rejected' ? 'Update Rejection Reason' : 'Reject Application'}</span>
                  </button>
                </div>

                {/* Direct WhatsApp Channel Button */}
                {selectedTrainer.status === 'approved' && (
                  <button
                    onClick={() => openWhatsAppNotice(selectedTrainer, 'approval')}
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <MessageSquare size={14} className="text-emerald-600" />
                    <span>Notify Coach on WhatsApp (Approval Welcome)</span>
                  </button>
                )}

                {/* Contact & Location Block */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Contact & Demographics
                  </span>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block mb-0.5">Email</span>
                      <a
                        href={`mailto:${selectedTrainer.email}`}
                        className="font-bold text-slate-800 hover:text-teal-600 flex items-center gap-1.5 truncate"
                      >
                        <Mail size={12} className="text-slate-400 shrink-0" />
                        <span className="truncate">{selectedTrainer.email}</span>
                      </a>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Phone</span>
                      <a
                        href={`tel:${selectedTrainer.phone}`}
                        className="font-bold text-slate-800 hover:text-teal-600 flex items-center gap-1.5"
                      >
                        <Phone size={12} className="text-slate-400 shrink-0" />
                        <span>{selectedTrainer.phone || 'Not provided'}</span>
                      </a>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">City / Base</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <MapPin size={12} className="text-slate-400 shrink-0" />
                        <span>{selectedTrainer.city || 'Remote / Pan India'}</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Languages</span>
                      <span className="font-bold text-slate-800">
                        {Array.isArray(selectedTrainer.languages)
                          ? selectedTrainer.languages.join(', ')
                          : 'English, Hindi'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Athletic Specialization & Experience */}
                <div className="space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Athletic Background
                  </span>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                      <span className="text-slate-400 block text-[11px]">Primary Specialization</span>
                      <span className="font-bold text-slate-900 mt-0.5 block">
                        {selectedTrainer.specialization || selectedTrainer.specialty || 'Strength & Conditioning'}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                      <span className="text-slate-400 block text-[11px]">Experience</span>
                      <span className="font-bold text-slate-900 mt-0.5 block">
                        {selectedTrainer.experience || `${selectedTrainer.experienceYears || 3} Years`}
                      </span>
                    </div>
                  </div>

                  {Array.isArray(selectedTrainer.secondarySpecializations) &&
                    selectedTrainer.secondarySpecializations.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {selectedTrainer.secondarySpecializations.map((spec, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 text-[11px] font-semibold border border-teal-200/70"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    )}
                </div>

                {/* Professional Bio */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Coach Biography
                  </span>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
                    {selectedTrainer.bio || 'No detailed biography submitted.'}
                  </div>
                </div>

                {/* Certifications & Cloudinary Documents */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Certificates & Credentials
                    </span>
                    <span className="text-[11px] text-teal-700 font-bold">
                      {selectedTrainer.institution || 'Verified Body'}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {/* Cloudinary Certificate Direct Link */}
                    {selectedTrainer.certificateUrl ? (
                      <a
                        href={selectedTrainer.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3.5 rounded-xl bg-teal-50/70 border border-teal-200 hover:bg-teal-100/50 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0">
                            <FileText size={18} />
                          </div>
                          <div>
                            <div className="font-bold text-xs text-teal-950 group-hover:text-teal-700">
                              {selectedTrainer.certificateName || 'Uploaded Certification Document'}
                            </div>
                            <div className="text-[10px] text-teal-700 font-mono">
                              Cloudinary Verified Asset
                            </div>
                          </div>
                        </div>
                        <ExternalLink size={14} className="text-teal-600 group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    ) : (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                        <FileText size={16} className="text-slate-400" />
                        <span>No Cloudinary certificate file attached directly.</span>
                      </div>
                    )}

                    {/* Named certifications */}
                    {Array.isArray(selectedTrainer.certifications) && selectedTrainer.certifications.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        {selectedTrainer.certifications.map((c, i) => {
                          const title = typeof c === 'string' ? c : c.title || 'Certified Trainer';
                          return (
                            <div
                              key={i}
                              className="flex items-center justify-between px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800"
                            >
                              <div className="flex items-center gap-2">
                                <Award size={14} className="text-teal-600" />
                                <span>{title}</span>
                              </div>
                              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                                Verified
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Intro Video */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Introduction Video
                  </span>
                  {selectedTrainer.videoUrl ? (
                    <a
                      href={selectedTrainer.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-teal-500 text-white flex items-center justify-center shrink-0">
                          <Video size={16} />
                        </div>
                        <div>
                          <div className="font-bold text-xs">Watch Coach Introduction</div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[240px]">
                            {selectedTrainer.videoUrl}
                          </div>
                        </div>
                      </div>
                      <ExternalLink size={14} className="text-teal-400 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  ) : (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-400 flex items-center gap-2">
                      <Video size={16} className="text-slate-400" />
                      <span>No intro video URL submitted.</span>
                    </div>
                  )}
                </div>

                {/* Services & Pricing */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Offered Services & Pricing
                  </span>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">1-on-1 Personal Training</span>
                      <span className="font-black text-slate-900 text-sm mt-0.5 block">
                        ₹{selectedTrainer.services?.oneOnOnePriceMonthly || 4999}
                        <span className="text-slate-400 text-xs font-normal"> / month</span>
                      </span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Live Group Classes</span>
                      <span className="font-black text-slate-900 text-sm mt-0.5 block">
                        ₹{selectedTrainer.services?.groupClassSeatPrice || 499}
                        <span className="text-slate-400 text-xs font-normal"> / seat</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* NEW CODE - Coach Weekly Availability & Working Slots */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Weekly Availability &amp; Working Slots
                    </span>
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                      Live Schedule
                    </span>
                  </div>

                  {/* Active Days */}
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1.5">
                      Working Days Active
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                        const coachDays = selectedTrainer.availability?.days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                        const isActive = coachDays.includes(day);
                        return (
                          <span
                            key={day}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                              isActive
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-slate-200 text-slate-400 line-through'
                            }`}
                          >
                            {day.substring(0, 3)}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Active Time Slots */}
                  <div className="pt-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block mb-1.5">
                      Active Time Slots
                    </span>
                    <div className="space-y-1">
                      {(selectedTrainer.availability?.timeSlots || [
                        { time: '06:00 AM - 07:00 AM', active: true },
                        { time: '07:00 AM - 08:00 AM', active: true },
                        { time: '09:00 AM - 10:00 AM', active: true },
                        { time: '10:30 AM - 11:30 AM', active: true },
                        { time: '05:00 PM - 06:00 PM', active: true },
                        { time: '06:30 PM - 07:30 PM', active: true },
                      ])
                        .filter((s) => s.active)
                        .map((slot, i) => (
                          <div
                            key={i}
                            className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-800 font-semibold flex items-center justify-between"
                          >
                            <span className="font-mono">{slot.time}</span>
                            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                              Active
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* NEW CODE - Assigned Clients Section */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Assigned Trainees ({allClients.length})
                    </span>
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                      Roster Active
                    </span>
                  </div>

                  {allClients.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-2 text-center">
                      No trainees currently assigned to this coach.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {allClients.map((cli) => (
                        <div
                          key={cli.id}
                          className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={cli.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                              alt={cli.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-bold text-slate-900">{cli.name}</p>
                              <p className="text-[10px] text-teal-700 font-medium">{cli.goal}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                              {cli.status || 'Active'}
                            </span>
                            <p className="text-[10px] text-slate-400 mt-0.5">{cli.sessionsCompleted} sessions</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Social Handles */}
                {(selectedTrainer.instagram || selectedTrainer.linkedin) && (
                  <div className="flex items-center gap-3 pt-2">
                    {selectedTrainer.instagram && (
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl font-medium">
                        <Instagram size={14} className="text-pink-600" />
                        <span>{selectedTrainer.instagram}</span>
                      </span>
                    )}
                    {selectedTrainer.linkedin && (
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl font-medium">
                        <Linkedin size={14} className="text-sky-600" />
                        <span>{selectedTrainer.linkedin}</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= REJECTION MODAL (REASON MANDATORY) ================= */}
      <AnimatePresence>
        {rejectModalOpen && trainerToReject && (
          <div className="fixed inset-0 z-60 overflow-y-auto flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRejectModalOpen(false)}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 z-10 space-y-5"
            >
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-base">
                      Reject Trainer Application
                    </h3>
                    <p className="text-xs text-slate-500">
                      Applicant: <span className="font-bold text-slate-800">{trainerToReject.name}</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setRejectModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3">
                {/* Multi-Channel Dispatch Info */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 text-xs space-y-2">
                  <span className="font-bold text-[11px] uppercase tracking-wider text-slate-500 block">
                    Automated Notifications On Confirm:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                    <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center gap-2">
                      <Mail size={14} className="text-teal-600 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-800 block">Email Notice</span>
                        <span className="text-[10px] text-slate-500 truncate block">Sent to {trainerToReject.email || 'Email'}</span>
                      </div>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center gap-2">
                      <MessageSquare size={14} className="text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-800 block">WhatsApp Msg</span>
                        <span className="text-[10px] text-slate-500 truncate block">{trainerToReject.phone || 'Ready to send'}</span>
                      </div>
                    </div>
                    <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center gap-2">
                      <AlertCircle size={14} className="text-rose-600 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-800 block">Trainer Panel</span>
                        <span className="text-[10px] text-slate-500 block">Live Dashboard Alert</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-amber-900 text-xs leading-relaxed">
                  <strong>Important:</strong> Rejection reason is strictly mandatory. It will be emailed directly to the coach and displayed prominently on their Trainer Dashboard so they can fix their credentials and re-submit.
                </div>

                {/* Quick Presets */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Click a preset reason or type below:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {REJECTION_PRESETS.map((p, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setRejectionReason(p)}
                        className="text-left text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 transition-colors border border-transparent hover:border-teal-200 cursor-pointer"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Textarea */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 block">
                    Rejection Reason <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Enter detailed reason (e.g. Please upload clear scan of ACE certification and update your intro video link)..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white transition-all resize-none"
                  />
                  {rejectionReason.trim().length === 0 && (
                    <span className="text-[10px] text-rose-500 font-semibold block">
                      * Cannot be empty
                    </span>
                  )}
                </div>

                {/* WhatsApp Auto-Dispatch Checkbox */}
                <label className="flex items-center gap-2 p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-200/80 cursor-pointer text-xs text-emerald-950 font-medium">
                  <input
                    type="checkbox"
                    checked={notifyWhatsApp}
                    onChange={(e) => setNotifyWhatsApp(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                  />
                  <span>
                    Open WhatsApp with pre-formatted rejection notice for <strong>{trainerToReject.phone || trainerToReject.name}</strong>
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRejectModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReject}
                  disabled={!rejectionReason.trim() || isSubmittingAction}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmittingAction ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <X size={14} />
                  )}
                  <span>Confirm Rejection</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
