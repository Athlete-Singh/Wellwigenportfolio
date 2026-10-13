// OLD CODE (commented by AI)
/*
import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  RefreshCw,
  Mail,
  MessageCircle,
  Trash2,
  X,
  CheckCircle2,
  Clock,
  Sparkles,
  UserCheck,
  Send,
  Calendar,
  Phone,
  AlertCircle,
  Copy,
  ExternalLink,
  ChevronDown,
  ArrowUpDown,
  FileText
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
*/

// NEW CODE - Wellwigen restyle / Smooth Transitions
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  RefreshCw,
  Mail,
  MessageCircle,
  Trash2,
  X,
  CheckCircle2,
  Clock,
  Sparkles,
  UserCheck,
  Send,
  Calendar,
  Phone,
  AlertCircle,
  Copy,
  ExternalLink,
  ChevronDown,
  ArrowUpDown,
  FileText
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Status badge styling
const STATUS_CONFIG = {
  New: {
    bg: 'bg-amber-50 text-amber-700 border-amber-200/80',
    dot: 'bg-amber-500',
    label: 'New',
  },
  Contacted: {
    bg: 'bg-sky-50 text-sky-700 border-sky-200/80',
    dot: 'bg-sky-500',
    label: 'Contacted',
  },
  Interested: {
    bg: 'bg-teal-50 text-teal-700 border-teal-200/80',
    dot: 'bg-teal-500',
    label: 'Interested',
  },
  Converted: {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    dot: 'bg-emerald-500',
    label: 'Converted',
  },
  Closed: {
    bg: 'bg-slate-100 text-slate-600 border-slate-200/80',
    dot: 'bg-slate-400',
    label: 'Closed',
  },
};

// Response Templates with Placeholders
const REPLY_TEMPLATES = [
  {
    id: 'consultation',
    title: 'Consultation & Discovery Call',
    subject: 'Your Wellwigen Fitness Consultation - {{program}}',
    body: `Hi {{name}},

Thank you for reaching out to Wellwigen! We received your inquiry regarding the {{program}} ({{plan}} track).

Our certified master coaches would love to schedule a quick 10-minute discovery call to understand your fitness goals and build a personalized routine for you.

When would be a convenient time for a brief call today or tomorrow?

Best regards,
The Wellwigen Coaching Team`,
  },
  {
    id: 'trial_class',
    title: 'Trial Class Welcome & Schedule',
    subject: 'Welcome to Wellwigen! Your {{program}} Trial Access',
    body: `Hi {{name}},

Welcome to Wellwigen! We're excited about your fitness journey with our {{program}}.

Your trial session for the {{plan}} plan is ready. You will get live interactive coaching from certified instructors and community support.

Please let us know your preferred time slot, and we'll send your private class link right away!

Stay strong,
The Wellwigen Team`,
  },
  {
    id: 'general_welcome',
    title: 'General Program Info & Pricing',
    subject: 'Wellwigen Fitness - Details on {{program}}',
    body: `Hi {{name}},

Thanks for your interest in Wellwigen! We would love to help you achieve your goals.

For {{program}} ({{plan}}), our workouts are fully interactive and built around your schedule with certified master coaches.

Feel free to reply to this message or WhatsApp us directly at this number to get started!

Warm regards,
Team Wellwigen`,
  },
];

const InquiriesView = () => {
  const [inquiries, setInquiries] = useState([]);
  const [stats, setStats] = useState({ total: 0, new: 0, contacted: 0, converted: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [programFilter, setProgramFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' | 'asc'

  // Drawer & Composer State
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState('consultation');
  const [composerSubject, setComposerSubject] = useState('');
  const [composerMessage, setComposerMessage] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [notesSaving, setNotesSaving] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Fetch inquiries from backend
  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/inquiries`, {
        params: {
          search: searchTerm,
          status: statusFilter,
          program: programFilter,
          sortOrder,
        },
      });

      if (res.data.success) {
        setInquiries(res.data.data || []);
        if (res.data.stats) {
          setStats(res.data.stats);
        }
      }
    } catch (err) {
      console.error('Failed to fetch inquiries:', err);
      toast.error('Could not load inquiries. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter, programFilter, sortOrder]);

  // Handle Search on Enter or debounced
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchInquiries();
  };

  // Helper to replace template placeholders
  const renderTemplate = (text, inq) => {
    if (!text || !inq) return '';
    return text
      .replace(/{{name}}/g, inq.fullName || 'there')
      .replace(/{{program}}/g, inq.program || 'Fitness Program')
      .replace(/{{plan}}/g, inq.plan || 'Plan');
  };

  // Open Inquiry Detail Drawer
  const handleOpenDrawer = (inq) => {
    setSelectedInquiry(inq);
    setAdminNotes(inq.adminNotes || '');
    setShowDeleteConfirm(false);

    // Default template fill
    const template = REPLY_TEMPLATES.find((t) => t.id === selectedTemplateId) || REPLY_TEMPLATES[0];
    setComposerSubject(renderTemplate(template.subject, inq));
    setComposerMessage(renderTemplate(template.body, inq));
  };

  // Switch template
  const handleTemplateChange = (templateId) => {
    setSelectedTemplateId(templateId);
    if (!selectedInquiry) return;
    const template = REPLY_TEMPLATES.find((t) => t.id === templateId);
    if (template) {
      setComposerSubject(renderTemplate(template.subject, selectedInquiry));
      setComposerMessage(renderTemplate(template.body, selectedInquiry));
    }
  };

  // Status Change
  const handleStatusChange = async (newStatus) => {
    if (!selectedInquiry) return;
    try {
      const res = await axios.patch(`${API_URL}/inquiries/${selectedInquiry._id}`, {
        status: newStatus,
      });
      if (res.data.success) {
        setSelectedInquiry(res.data.data);
        setInquiries((prev) =>
          prev.map((item) => (item._id === selectedInquiry._id ? res.data.data : item))
        );
        toast.success(`Status updated to ${newStatus}`);
        fetchInquiries();
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  // Auto-save Admin Notes
  const handleSaveNotes = async () => {
    if (!selectedInquiry) return;
    try {
      setNotesSaving(true);
      const res = await axios.patch(`${API_URL}/inquiries/${selectedInquiry._id}`, {
        adminNotes,
      });
      if (res.data.success) {
        setSelectedInquiry(res.data.data);
        setInquiries((prev) =>
          prev.map((item) => (item._id === selectedInquiry._id ? res.data.data : item))
        );
        toast.success('Notes saved');
      }
    } catch (err) {
      toast.error('Failed to save notes');
    } finally {
      setNotesSaving(false);
    }
  };

  // Delete Inquiry
  const handleDeleteInquiry = async () => {
    if (!selectedInquiry) return;
    try {
      setIsDeleting(true);
      const res = await axios.delete(`${API_URL}/inquiries/${selectedInquiry._id}`);
      if (res.data.success) {
        toast.success('Inquiry deleted');
        setInquiries((prev) => prev.filter((item) => item._id !== selectedInquiry._id));
        setSelectedInquiry(null);
        fetchInquiries();
      }
    } catch (err) {
      toast.error('Failed to delete inquiry');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Format clean WhatsApp phone number (+91 prefixed if 10 digits)
  const getCleanWhatsAppPhone = (phoneStr) => {
    if (!phoneStr) return '';
    let digits = phoneStr.replace(/\D/g, '');
    if (digits.length === 10) {
      digits = `91${digits}`;
    }
    return digits;
  };

  // Reply via WhatsApp
  const handleReplyWhatsApp = async () => {
    if (!selectedInquiry) return;
    const cleanNumber = getCleanWhatsAppPhone(selectedInquiry.phone);
    if (!cleanNumber) {
      toast.error('Invalid phone number for WhatsApp');
      return;
    }

    const encodedText = encodeURIComponent(composerMessage);
    const waUrl = `https://wa.me/${cleanNumber}?text=${encodedText}`;

    // Open WhatsApp in new tab
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    // Update backend status to Contacted
    try {
      const res = await axios.patch(`${API_URL}/inquiries/${selectedInquiry._id}/contacted`, {
        contactedVia: 'whatsapp',
      });
      if (res.data.success) {
        setSelectedInquiry(res.data.data);
        setInquiries((prev) =>
          prev.map((item) => (item._id === selectedInquiry._id ? res.data.data : item))
        );
        toast.success('WhatsApp opened & inquiry marked as Contacted!');
        fetchInquiries();
      }
    } catch (err) {
      console.warn('Could not auto-mark contacted:', err);
    }
  };

  // Reply via Email
  const handleReplyEmail = async () => {
    if (!selectedInquiry) return;
    try {
      setIsSendingEmail(true);
      const res = await axios.post(`${API_URL}/inquiries/${selectedInquiry._id}/reply-email`, {
        subject: composerSubject,
        message: composerMessage,
        recipientEmail: selectedInquiry.email,
        recipientName: selectedInquiry.fullName,
      });

      if (res.data.success) {
        toast.success(`Email sent to ${selectedInquiry.email}!`);
        if (res.data.data) {
          setSelectedInquiry(res.data.data);
          setInquiries((prev) =>
            prev.map((item) => (item._id === selectedInquiry._id ? res.data.data : item))
          );
        }
        fetchInquiries();
      } else if (res.data.fallbackMailto) {
        // Fallback to mailto
        window.location.href = res.data.fallbackMailto;
        toast('SMTP not configured; opened your local email app instead.', { icon: 'ℹ️' });
        if (res.data.data) {
          setSelectedInquiry(res.data.data);
        }
        fetchInquiries();
      }
    } catch (err) {
      console.error('Email reply error:', err);
      // Client-side fallback mailto
      const mailtoUrl = `mailto:${selectedInquiry.email}?subject=${encodeURIComponent(
        composerSubject
      )}&body=${encodeURIComponent(composerMessage)}`;
      window.location.href = mailtoUrl;
      toast('Opening your default email client...', { icon: '✉️' });
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Reply via Both (Email + WhatsApp)
  const handleReplyBoth = async () => {
    await handleReplyEmail();
    handleReplyWhatsApp();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans">
      {/* ================= HEADER & ACTIONS ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              Subscription Leads
            </span>
            <span className="text-slate-400 text-xs">&bull;</span>
            <span className="text-xs text-slate-500 font-medium">Auto-Sync MongoDB</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Customer Inquiries
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time leads from the public website's "Start Your Fitness Journey" modal.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchInquiries}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 shadow-sm transition-all"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin text-teal-600' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* ================= 4 SUMMARY STAT CARDS ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Inquiries */}
        <div className="p-5 sm:p-6 bg-white border border-slate-200/90 rounded-2xl shadow-sm hover:shadow transition-all relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Leads</span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
              <FileText size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#0F172A]">{stats.total}</div>
          <p className="text-[11px] text-slate-400 mt-1">All recorded submissions</p>
        </div>

        {/* New Inquiries (Highlighted) */}
        <div className="p-5 sm:p-6 bg-white border border-amber-200 rounded-2xl shadow-sm hover:shadow transition-all relative overflow-hidden ring-1 ring-amber-400/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">New / Uncontacted</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Sparkles size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600">{stats.new}</div>
          <p className="text-[11px] text-amber-600/80 mt-1">Requires follow-up response</p>
        </div>

        {/* Contacted */}
        <div className="p-5 sm:p-6 bg-white border border-slate-200/90 rounded-2xl shadow-sm hover:shadow transition-all relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700">Contacted</span>
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
              <Clock size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-sky-600">{stats.contacted}</div>
          <p className="text-[11px] text-slate-400 mt-1">Followed up via Email/WA</p>
        </div>

        {/* Converted */}
        <div className="p-5 sm:p-6 bg-white border border-slate-200/90 rounded-2xl shadow-sm hover:shadow transition-all relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Converted</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <UserCheck size={18} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600">{stats.converted}</div>
          <p className="text-[11px] text-slate-400 mt-1">Joined program successfully</p>
        </div>
      </div>

      {/* ================= SEARCH & FILTER CONTROLS ================= */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3.5">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by visitor name, email, phone, or goal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1FB5A3]/20 focus:border-[#1FB5A3] transition-all text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-[#1FB5A3]"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Interested">Interested</option>
              <option value="Converted">Converted</option>
              <option value="Closed">Closed</option>
            </select>

            {/* Program Filter */}
            <select
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value)}
              className="px-3 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-[#1FB5A3]"
            >
              <option value="All">All Programs</option>
              <option value="Personal Training">Personal Training</option>
              <option value="Group Classes">Group Classes</option>
            </select>

            {/* Sort Toggle */}
            <button
              type="button"
              onClick={() => setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))}
              className="px-3 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
              title="Toggle Sort Order"
            >
              <ArrowUpDown size={14} />
              <span className="hidden sm:inline">{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* ================= INQUIRIES DATA TABLE ================= */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-black text-base text-[#0F172A] tracking-tight">
              Inquiry Records
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[11px] font-bold text-slate-600">
              {inquiries.length} found
            </span>
          </div>
          <span className="text-xs text-slate-400">Click any row to view details & reply</span>
        </div>

        {/* OLD CODE (commented by AI)
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400 space-y-3">
            <div className="w-8 h-8 border-3 border-[#1FB5A3] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold tracking-wider uppercase">Loading Inquiries...</p>
          </div>
        ) : ...
        */}
        {/* NEW CODE - Modern SaaS Skeleton Table Loader */}
        {loading ? (
          <div className="p-6 space-y-4 animate-pulse">
            {[1, 2, 3, 4, 5].map((idx) => (
              <div key={idx} className="flex items-center justify-between gap-4 py-3 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100" />
                  <div className="space-y-1.5">
                    <div className="w-32 h-4 rounded bg-slate-100" />
                    <div className="w-40 h-3 rounded bg-slate-100" />
                  </div>
                </div>
                <div className="hidden sm:block space-y-1.5">
                  <div className="w-28 h-4 rounded bg-slate-100" />
                  <div className="w-20 h-3 rounded bg-slate-100" />
                </div>
                <div className="hidden md:block w-20 h-6 rounded-full bg-slate-100" />
                <div className="w-20 h-7 rounded-xl bg-slate-100" />
              </div>
            ))}
          </div>
        ) : inquiries.length === 0 ? (
          <div className="py-24 text-center px-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Sparkles size={24} />
            </div>
            <h4 className="font-bold text-slate-800 text-base">No inquiries found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {searchTerm || statusFilter !== 'All' || programFilter !== 'All'
                ? 'Try clearing your search or status filter to see other records.'
                : 'When visitors submit the form on the landing page, their leads will show up here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  <th className="px-5 py-3.5">Visitor</th>
                  <th className="px-5 py-3.5">Contact</th>
                  <th className="px-5 py-3.5">Program & Plan</th>
                  <th className="px-5 py-3.5">Fitness Goal</th>
                  <th className="px-5 py-3.5">Timing</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {inquiries.map((inq) => {
                  const statusStyle = STATUS_CONFIG[inq.status] || STATUS_CONFIG.New;
                  const isSelected = selectedInquiry?._id === inq._id;

                  return (
                    <tr
                      key={inq._id}
                      onClick={() => handleOpenDrawer(inq)}
                      className={`hover:bg-teal-50/30 transition-colors cursor-pointer group ${
                        isSelected ? 'bg-teal-50/50' : ''
                      }`}
                    >
                      {/* Visitor Name */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                          {inq.fullName}
                        </div>
                        {inq.contactedVia !== 'none' && (
                          <span className="text-[10px] text-slate-400 font-medium inline-flex items-center gap-1 mt-0.5">
                            via {inq.contactedVia}
                          </span>
                        )}
                      </td>

                      {/* Phone & Email */}
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-800">{inq.phone}</div>
                        <div className="text-[11px] text-slate-500 font-normal truncate max-w-[160px]">
                          {inq.email}
                        </div>
                      </td>

                      {/* Program & Plan */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-800">{inq.program}</div>
                        <div className="text-[11px] text-teal-700 font-medium">{inq.plan || 'Trial'}</div>
                      </td>

                      {/* Goal */}
                      <td className="px-5 py-4 text-slate-600 max-w-[150px] truncate">
                        {inq.fitnessGoal || '&mdash;'}
                      </td>

                      {/* Timing */}
                      <td className="px-5 py-4 text-slate-500 whitespace-nowrap">
                        {inq.preferredTiming || 'Flexible'}
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-slate-500 whitespace-nowrap">
                        {new Date(inq.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </td>

                      {/* Status Chip */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusStyle.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                          {statusStyle.label}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-4 py-4 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDrawer(inq);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 transition-all text-xs"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= RIGHT DETAIL DRAWER ================= */}
      {/* OLD CODE (commented by AI) */}
      {/*
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <div
            onClick={() => setSelectedInquiry(null)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
          />
          <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col z-10 border-l border-slate-200 animate-in slide-in-from-right duration-200">
      */}

      {/* NEW CODE - Wellwigen Smooth Sliding Detail Drawer */}
      <AnimatePresence>
        {selectedInquiry && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelectedInquiry(null)}
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
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-teal-50/50 to-white">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      (STATUS_CONFIG[selectedInquiry.status] || STATUS_CONFIG.New).bg
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        (STATUS_CONFIG[selectedInquiry.status] || STATUS_CONFIG.New).dot
                      }`}
                    />
                    {selectedInquiry.status}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Received{' '}
                    {new Date(selectedInquiry.createdAt).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <h3 className="font-heading font-black text-2xl text-[#0F172A] tracking-tight">
                  {selectedInquiry.fullName}
                </h3>
              </div>

              <button
                onClick={() => setSelectedInquiry(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
              {/* Quick Actions (Reply via WhatsApp / Email) */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleReplyWhatsApp}
                  className="py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <MessageCircle size={16} />
                  <span>Reply on WhatsApp</span>
                </button>

                <button
                  onClick={handleReplyEmail}
                  disabled={isSendingEmail}
                  className="py-3 px-4 rounded-xl bg-[#FF6B35] hover:bg-[#F25A24] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
                >
                  <Mail size={16} />
                  <span>{isSendingEmail ? 'Sending...' : 'Reply via Email'}</span>
                </button>
              </div>

              {/* Status Selector */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">
                  Lead Status Workflow
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  {['New', 'Contacted', 'Interested', 'Converted', 'Closed'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(st)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                        selectedInquiry.status === st
                          ? 'bg-[#0F172A] text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inquiry Details Grid */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Inquiry Information
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white border border-slate-200 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Phone</span>
                    <span className="font-bold text-slate-900 select-all">{selectedInquiry.phone}</span>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Email</span>
                    <span className="font-bold text-slate-900 select-all truncate block">
                      {selectedInquiry.email}
                    </span>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Program</span>
                    <span className="font-bold text-teal-800">{selectedInquiry.program}</span>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Chosen Plan</span>
                    <span className="font-bold text-slate-900">{selectedInquiry.plan || 'Not specified'}</span>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Goal</span>
                    <span className="font-bold text-slate-900">
                      {selectedInquiry.fitnessGoal || 'Not specified'}
                    </span>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Preferred Time</span>
                    <span className="font-bold text-slate-900">
                      {selectedInquiry.preferredTiming || 'Flexible'}
                    </span>
                  </div>
                </div>

                {/* Visitor's Notes/Message */}
                {selectedInquiry.message && (
                  <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-xl">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Visitor's Questions / Notes
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {selectedInquiry.message}
                    </p>
                  </div>
                )}
              </div>

              {/* Message Composer with Templates */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Quick Response Composer
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span>Template:</span>
                    <select
                      value={selectedTemplateId}
                      onChange={(e) => handleTemplateChange(e.target.value)}
                      className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-teal-800 focus:outline-none"
                    >
                      {REPLY_TEMPLATES.map((tpl) => (
                        <option key={tpl.id} value={tpl.id}>
                          {tpl.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Email Subject Field */}
                <div>
                  <input
                    type="text"
                    value={composerSubject}
                    onChange={(e) => setComposerSubject(e.target.value)}
                    placeholder="Email subject..."
                    className="w-full px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>

                {/* Message Textarea */}
                <div>
                  <textarea
                    rows={6}
                    value={composerMessage}
                    onChange={(e) => setComposerMessage(e.target.value)}
                    placeholder="Compose message..."
                    className="w-full p-3 text-xs leading-relaxed bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-teal-500 font-mono"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Supports placeholders: <code className="text-teal-700">&#123;&#123;name&#125;&#125;</code>,{' '}
                    <code className="text-teal-700">&#123;&#123;program&#125;&#125;</code>,{' '}
                    <code className="text-teal-700">&#123;&#123;plan&#125;&#125;</code>
                  </p>
                </div>

                {/* Composer Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleReplyBoth}
                    className="flex-1 py-2.5 px-3 bg-gradient-to-r from-teal-600 to-[#1FB5A3] hover:from-teal-700 hover:to-teal-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <Send size={13} />
                    <span>Send to Both (Email + WA)</span>
                  </button>
                </div>
              </div>

              {/* Admin Notes Section */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    Internal Admin Notes
                  </span>
                  {notesSaving && <span className="text-[10px] text-teal-600 font-bold">Saving...</span>}
                </div>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  onBlur={handleSaveNotes}
                  placeholder="Add private staff notes about this inquiry..."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-teal-500"
                />
                <button
                  onClick={handleSaveNotes}
                  disabled={notesSaving}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-[11px] hover:bg-slate-50 transition-colors"
                >
                  Save Notes
                </button>
              </div>

              {/* Delete Inquiry Action */}
              <div className="pt-4 border-t border-slate-100">
                {showDeleteConfirm ? (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between">
                    <span className="text-xs text-rose-800 font-bold">Are you sure?</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-2.5 py-1 text-xs bg-white border border-slate-200 text-slate-600 rounded-lg font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDeleteInquiry}
                        disabled={isDeleting}
                        className="px-3 py-1 text-xs bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold"
                      >
                        {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-xs text-rose-600 hover:text-rose-700 font-bold inline-flex items-center gap-1.5"
                  >
                    <Trash2 size={13} />
                    <span>Delete this inquiry record</span>
                  </button>
                )}
              </div>
            {/* OLD CODE (commented by AI) */}
            {/*
            </div>
          </div>
        </div>
      )}
      */}

      {/* NEW CODE - Close motion.div and AnimatePresence */}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </div>
  );
};

export default InquiriesView;
