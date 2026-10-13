import React, { useState, useEffect } from 'react';
import {
  Dumbbell,
  Plus,
  Calendar,
  Clock,
  Video,
  Search,
  CheckCircle2,
  X,
  AlertCircle,
  Copy,
  Edit2,
  Edit3,
  Trash2,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Send,
  Check,
  Users,
  ShieldCheck,
  Share2,
  RotateCcw,
  Info,
} from 'lucide-react';
import { trainerApi } from '../../../services/trainerApi';

// Default fitness cover images based on category
const CATEGORY_COVERS = {
  'Strength & Conditioning': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
  'HIIT & Conditioning': 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?q=80&w=800&auto=format&fit=crop',
  'Mobility & Core': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop',
  'Yoga Flow': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
  'Functional Training': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
  'Pilates': 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop',
};

// Helper to sanitize title from any '(Copy)' suffixes in client messages
export const cleanClassTitle = (rawTitle) => {
  if (!rawTitle) return '';
  // Removes repeated '(Copy)', '(copy)', '(Copy 2)', etc.
  return rawTitle.replace(/\s*(\(\s*copy(\s*\d+)?\s*\))+/gi, '').trim();
};

/* [DISABLED FOR FUTURE USE] Old generateWhatsAppMessage without title sanitization
export const generateWhatsAppMessageOld = (cls, trainerName = 'Coach') => {
  const title = cls.title || 'Live Workout Class';
  ...
};
*/

// Generates an impressive, structured WhatsApp message for clients & groups
export const generateWhatsAppMessage = (cls, trainerName = 'Coach') => {
  // Always strip out '(Copy)' tags from client-facing workout invites
  const title = cleanClassTitle(cls?.title) || 'Live Workout Class';
  const category = cls?.category || 'Fitness & Conditioning';
  const fitnessLevel = cls?.fitnessLevel || 'All Fitness Levels';
  const duration = cls?.duration || (cls?.durationMins ? `${cls.durationMins} mins` : '45 mins');
  const dateStr = cls?.date || 'Today';
  const timeStr = cls?.time || '10:30 AM IST';
  const zoomUrl = cls?.zoomUrl || 'https://zoom.us';
  const meetingId = cls?.meetingId || '849 201 9284';
  const passcode = cls?.passcode || 'WLLWGN26';

  return `🔥 *WELLWIGEN LIVE WORKOUT SESSION* 🔥
━━━━━━━━━━━━━━━━━━━━━━━━━━
🏋️‍♂️ *Class:* ${title}
👨‍🏫 *Lead Coach:* ${trainerName}
🎯 *Track & Category:* ${category}
📊 *Level:* ${fitnessLevel}
⏱️ *Duration:* ${duration}

📅 *SCHEDULED TIME:*
🗓️ *Date:* ${dateStr}
⏰ *Time:* ${timeStr}

📌 *SESSION OVERVIEW & FOCUS:*
• High-energy interactive coaching, core stability & dynamic strength
• Real-time posture checks, alignment cues & form corrections
• Tailored progressions suited for beginner to advanced athletes
• Keep your energy high and stay consistent with your goals!

🔑 *LIVE ZOOM ACCESS CREDENTIALS:*
🌐 *Direct Link:* ${zoomUrl}
🆔 *Meeting ID:* ${meetingId}
🔐 *Passcode:* ${passcode}

💡 *PREPARATION GUIDELINES:*
1. Join the Zoom meeting *3 to 5 minutes early* to check your setup.
2. Have your workout mat, water bottle & sweat towel ready.
3. Keep your camera switched on for personalized coach corrections!

Let's show up and crush this workout together! 💪✨
*Wellwigen Fitness — Stronger Body. Better You.*`;
};

export default function TrainerClasses() {
  const [classes, setClasses] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // WhatsApp Share Modal states
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [selectedClassForWhatsApp, setSelectedClassForWhatsApp] = useState(null);
  const [editableMessage, setEditableMessage] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [copiedToast, setCopiedToast] = useState(false);
  const [actionNotice, setActionNotice] = useState('');

  const trainer = trainerApi.getCurrentTrainer() || {};
  const trainerName = trainer.name || 'Coach Aditya';

  // Modal Form State matching Image 1
  const [classForm, setClassForm] = useState({
    title: 'Morning Mobility & Core Ignition',
    category: 'Strength & Conditioning',
    fitnessLevel: 'All Levels',
    date: '2026-10-14',
    time: '09:00 AM',
    duration: 45,
    recurring: 'One-time Session',
    capacity: 20,
    isFreeDemo: true,
    allowedTiers: ['STARTER', 'GOLD', 'PLATINUM'],
    zoomUrl: 'https://us02web.zoom.us/j/8492019284?pwd=WLLWGN26',
    meetingId: '849 201 9284',
    passcode: 'WLLWGN26',
    coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
  });

  useEffect(() => {
    setClasses(trainerApi.getClasses());
  }, []);

  const showNotification = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(''), 3500);
  };

  // Open Create Modal with clean defaults
  const handleOpenCreate = () => {
    setEditingId(null);
    setClassForm({
      title: 'Morning Mobility & Core Ignition',
      category: 'Strength & Conditioning',
      fitnessLevel: 'All Levels',
      date: '2026-10-14',
      time: '09:00 AM',
      duration: 45,
      recurring: 'One-time Session',
      capacity: 20,
      isFreeDemo: true,
      allowedTiers: ['STARTER', 'GOLD', 'PLATINUM'],
      zoomUrl: 'https://us02web.zoom.us/j/8492019284?pwd=WLLWGN26',
      meetingId: '849 201 9284',
      passcode: 'WLLWGN26',
      coverImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
    });
    setShowModal(true);
  };

  // Open Edit Modal with existing class data
  const handleOpenEdit = (cls) => {
    setEditingId(cls.id);
    setClassForm({
      title: cls.title || '',
      category: cls.category || 'Strength & Conditioning',
      fitnessLevel: cls.fitnessLevel || 'All Levels',
      date: cls.date || '2026-10-14',
      time: cls.time || '09:00 AM',
      duration: cls.durationMins || parseInt(cls.duration, 10) || 45,
      recurring: cls.recurring || 'One-time Session',
      capacity: cls.capacity || 20,
      isFreeDemo: cls.isFreeDemo !== undefined ? cls.isFreeDemo : true,
      allowedTiers: cls.allowedTiers || ['STARTER', 'GOLD', 'PLATINUM'],
      zoomUrl: cls.zoomUrl || 'https://us02web.zoom.us/j/8492019284?pwd=WLLWGN26',
      meetingId: cls.meetingId || '849 201 9284',
      passcode: cls.passcode || 'WLLWGN26',
      coverImage: cls.coverImage || CATEGORY_COVERS[cls.category] || CATEGORY_COVERS['Strength & Conditioning'],
    });
    setShowModal(true);
  };

  // Toggle allowed tier in form
  const toggleTier = (tier) => {
    setClassForm((prev) => {
      const exists = prev.allowedTiers.includes(tier);
      const updated = exists ? prev.allowedTiers.filter((t) => t !== tier) : [...prev.allowedTiers, tier];
      return { ...prev, allowedTiers: updated.length ? updated : [tier] };
    });
  };

  // Save (Create or Update) class
  const handleSaveClass = async (e) => {
    e.preventDefault();
    if (!classForm.title.trim()) {
      alert('Please enter a class title.');
      return;
    }

    const payload = {
      ...classForm,
      subtitle: 'Live group training.',
      duration: `${classForm.duration} mins`,
      durationMins: parseInt(classForm.duration, 10) || 45,
      formattedDateTime: `${classForm.date} • ${classForm.time}`,
      status: 'Approved & Live',
      coverImage: classForm.coverImage || CATEGORY_COVERS[classForm.category] || CATEGORY_COVERS['Strength & Conditioning'],
    };

    if (editingId) {
      await trainerApi.updateClass(editingId, payload);
      showNotification('Workout class updated successfully!');
    } else {
      await trainerApi.createClass(payload);
      showNotification('New workout class scheduled successfully!');
    }

    setClasses(trainerApi.getClasses());
    setShowModal(false);
    setEditingId(null);
  };

  // Duplicate class
  const handleDuplicateClass = async (id) => {
    const duplicated = await trainerApi.duplicateClass(id);
    if (duplicated) {
      setClasses(trainerApi.getClasses());
      showNotification(`Duplicated class as "${duplicated.title}"`);
    }
  };

  // Delete class
  const handleDeleteClass = async (id) => {
    if (window.confirm('Are you sure you want to delete this workout class?')) {
      await trainerApi.deleteClass(id);
      setClasses(trainerApi.getClasses());
      showNotification('Workout class deleted.');
    }
  };

  // Start Zoom Meeting Directly (Auto-triggers native Zoom App + web fallback)
  const handleStartZoom = (cls) => {
    const rawMeetingId = cls.meetingId || '';
    const cleanMeetingId = rawMeetingId.replace(/\D/g, '') ||
      (cls.zoomUrl?.match(/\/j\/(\d+)/)?.[1] || '');
    const passcode = cls.passcode || (cls.zoomUrl?.match(/[?&]pwd=([^&#]+)/)?.[1] || '');
    const webUrl = cls.zoomUrl || (cleanMeetingId ? `https://us02web.zoom.us/j/${cleanMeetingId}${passcode ? `?pwd=${passcode}` : ''}` : 'https://zoom.us/join');

    if (cleanMeetingId) {
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
      window.open(webUrl, '_blank', 'noopener,noreferrer');
      showNotification(`🚀 Opening Zoom App for "${cls.title}"...`);
    } else {
      window.open(webUrl, '_blank', 'noopener,noreferrer');
      showNotification(`🚀 Opening Zoom room for "${cls.title}"...`);
    }
  };

  /* [DISABLED FOR FUTURE USE] Old read-only WhatsApp handlers
  const handleOpenWhatsAppOld = (cls) => {
    setSelectedClassForWhatsApp(cls);
    setRecipientPhone('');
    setCopiedToast(false);
    setShowWhatsAppModal(true);
  };
  const handleSendWhatsAppOld = (cls, phone) => {
    const message = generateWhatsAppMessage(cls, trainerName);
    ...
  };
  */

  // Open WhatsApp Share Dialog with prefilled editable message
  const handleOpenWhatsApp = (cls) => {
    setSelectedClassForWhatsApp(cls);
    const initialMessage = generateWhatsAppMessage(cls, trainerName);
    setEditableMessage(initialMessage);
    setRecipientPhone('');
    setCopiedToast(false);
    setShowWhatsAppModal(true);
  };

  // Reset editable message to clean default template
  const handleResetMessageTemplate = () => {
    if (selectedClassForWhatsApp) {
      const templateMsg = generateWhatsAppMessage(selectedClassForWhatsApp, trainerName);
      setEditableMessage(templateMsg);
    }
  };

  // Send WhatsApp invite with coach's customized message
  const handleSendWhatsApp = (phone) => {
    const messageToSend = editableMessage || generateWhatsAppMessage(selectedClassForWhatsApp, trainerName);
    const cleanPhone = phone ? phone.replace(/[^0-9]/g, '') : '';
    const encoded = encodeURIComponent(messageToSend);
    const waUrl = cleanPhone
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // Copy customized WhatsApp message to clipboard
  const handleCopyInvite = () => {
    const messageToCopy = editableMessage || generateWhatsAppMessage(selectedClassForWhatsApp, trainerName);
    navigator.clipboard.writeText(messageToCopy);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 3000);
  };

  // Filter and search
  const filtered = classes.filter((c) => {
    const matchesFilter =
      filter === 'All' ||
      (filter === 'Approved & Live' && (c.status?.toLowerCase().includes('approved') || c.status?.toLowerCase().includes('live'))) ||
      (filter === 'Under Review' && c.status?.toLowerCase().includes('review')) ||
      (filter === 'Scheduled' && (c.status?.toLowerCase().includes('scheduled') || c.status?.toLowerCase().includes('upcoming')));

    const matchesSearch =
      (c.title || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.category || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.time || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.date || '').toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header (Matching Image 2) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">My Classes</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Create, edit, duplicate, and monitor approval status of all workouts.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>Schedule New Class</span>
        </button>
      </div>

      {/* Action Notification Banner */}
      {actionNotice && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs flex items-center gap-2.5 shadow-xs">
          <CheckCircle2 size={16} className="text-teal-600 shrink-0" />
          <span className="font-semibold">{actionNotice}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['All', 'Approved & Live', 'Under Review', 'Scheduled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                filter === tab
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search classes by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>
      </div>

      {/* Classes List / Grid (Matching Image 2) */}
      {filtered.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Dumbbell size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No workout classes found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {search ? 'Try clearing your search query.' : 'Click "Schedule New Class" above to set up your workout session.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((cls) => {
            const coverImg =
              cls.coverImage ||
              CATEGORY_COVERS[cls.category] ||
              'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop';

            return (
              <div
                key={cls.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Class Cover Image with Category & Status Badges */}
                  <div className="h-52 w-full relative overflow-hidden bg-slate-900">
                    <img
                      src={coverImg}
                      alt={cls.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Top-Left Category Badge */}
                    <span className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-xs text-slate-900 font-extrabold text-[10px] tracking-wider px-3.5 py-1.5 rounded-full uppercase shadow-xs border border-white/60">
                      {cls.category || 'STRENGTH & CONDITIONING'}
                    </span>

                    {/* Top-Right Status Badge */}
                    <span className="absolute top-3.5 right-3.5 bg-emerald-50/95 backdrop-blur-xs text-emerald-800 border border-emerald-200 font-extrabold text-[10px] tracking-wider px-3 py-1.5 rounded-full uppercase shadow-xs flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {cls.status || 'APPROVED & LIVE'}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 leading-snug tracking-tight">
                        {cls.title}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        {cls.subtitle || 'Live group training.'}
                      </p>
                    </div>

                    {/* Light-grey Info Box (NO ENROLLMENT OPTION - as requested) */}
                    <div className="p-4 bg-slate-50/90 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                          DATE &amp; TIME
                        </span>
                        <span className="font-extrabold text-slate-800 text-sm tracking-tight">
                          {cls.formattedDateTime || `${cls.date} • ${cls.time || '10:30'}`}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                          DURATION
                        </span>
                        <span className="font-extrabold text-slate-800 text-sm">
                          {cls.duration || (cls.durationMins ? `${cls.durationMins} mins` : '45 mins')}
                        </span>
                      </div>
                    </div>

                    {/* Zoom ID / Passcode reference */}
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 px-1">
                      <Video size={13} className="text-teal-600 shrink-0" />
                      <span className="truncate">
                        Meeting ID: <strong className="text-slate-800 font-mono">{cls.meetingId || '849 201 9284'}</strong>
                        {cls.passcode && (
                          <> &bull; Pass: <strong className="text-slate-800 font-mono">{cls.passcode}</strong></>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions (Matching Image 2 + WhatsApp button) */}
                <div className="p-4 sm:px-6 sm:pb-6 border-t border-slate-100 flex items-center justify-between gap-2">
                  {/* Left Action Icons: Duplicate, Edit, Delete */}
                  <div className="flex items-center gap-1 text-slate-400">
                    <button
                      onClick={() => handleDuplicateClass(cls.id)}
                      title="Duplicate Class"
                      className="p-2 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(cls)}
                      title="Edit Class"
                      className="p-2 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteClass(cls.id)}
                      title="Delete Class"
                      className="p-2 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Right Actions: Share on WhatsApp & Start Zoom */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenWhatsApp(cls)}
                      title="Share Workout Details on WhatsApp"
                      className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center gap-1.5 border border-emerald-200 transition-colors cursor-pointer"
                    >
                      <MessageSquare size={14} className="text-emerald-600" />
                      <span>WhatsApp</span>
                    </button>

                    <button
                      onClick={() => handleStartZoom(cls)}
                      title="Directly launch the Zoom room for this workout"
                      className="px-4 py-2 rounded-xl bg-[#0f766e] hover:bg-[#115e59] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-teal-700/20 transition-all cursor-pointer"
                    >
                      <Video size={15} />
                      <span>Start Zoom</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= SCHEDULE / EDIT WORKOUT CLASS MODAL (Matching Image 1) ================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 my-8">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center shrink-0">
                  <Video size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    {editingId ? 'Edit Workout Class' : 'Schedule New Workout Class'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Classes require admin approval before appearing in client catalogs.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 cursor-pointer shrink-0"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="space-y-4">
              {/* Title input */}
              <div>
                <input
                  type="text"
                  required
                  placeholder="Morning Mobility & Core Ignition"
                  value={classForm.title}
                  onChange={(e) => setClassForm({ ...classForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              {/* Row 1: CATEGORY & FITNESS LEVEL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    CATEGORY
                  </label>
                  <select
                    value={classForm.category}
                    onChange={(e) =>
                      setClassForm({
                        ...classForm,
                        category: e.target.value,
                        coverImage: CATEGORY_COVERS[e.target.value] || classForm.coverImage,
                      })
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  >
                    <option value="Strength & Conditioning">Strength &amp; Conditioning</option>
                    <option value="HIIT & Conditioning">HIIT &amp; Conditioning</option>
                    <option value="Mobility & Core">Mobility &amp; Core</option>
                    <option value="Yoga Flow">Yoga Flow</option>
                    <option value="Pilates">Pilates</option>
                    <option value="Functional Training">Functional Training</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    FITNESS LEVEL
                  </label>
                  <select
                    value={classForm.fitnessLevel}
                    onChange={(e) => setClassForm({ ...classForm, fitnessLevel: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  >
                    <option value="All Levels">All Levels</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              {/* Row 2: DATE, START TIME, DURATION */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    DATE (YYYY-MM-DD) *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={classForm.date}
                      onChange={(e) => setClassForm({ ...classForm, date: e.target.value })}
                      className="w-full pl-3 pr-2 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    START TIME (IST) *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="09:00 AM"
                      value={classForm.time}
                      onChange={(e) => setClassForm({ ...classForm, time: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    DURATION (MINS)
                  </label>
                  <input
                    type="number"
                    min={15}
                    max={120}
                    value={classForm.duration}
                    onChange={(e) => setClassForm({ ...classForm, duration: parseInt(e.target.value, 10) || 45 })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>

              {/* Row 3: RECURRING SCHEDULE & MAX CAPACITY */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    RECURRING SCHEDULE
                  </label>
                  <select
                    value={classForm.recurring}
                    onChange={(e) => setClassForm({ ...classForm, recurring: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                  >
                    <option value="One-time Session">One-time Session</option>
                    <option value="Daily (Mon-Fri)">Daily (Mon-Fri)</option>
                    <option value="Weekly Recurring">Weekly Recurring</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    MAX CAPACITY
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={5}
                      max={100}
                      value={classForm.capacity}
                      onChange={(e) => setClassForm({ ...classForm, capacity: parseInt(e.target.value, 10) || 20 })}
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                    <Users size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Mint Card: Free Demo Class (3-Day Trial Access) & Subscription Tiers */}
              <div className="p-4 rounded-2xl bg-[#ecfdf5] border border-emerald-200/80 space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <Sparkles size={16} className="text-teal-600 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">
                        Free Demo Class (3-Day Trial Access)
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Marking this permits customers during their 3-day demo period to attend.
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={classForm.isFreeDemo}
                    onChange={(e) => setClassForm({ ...classForm, isFreeDemo: e.target.checked })}
                    className="w-5 h-5 rounded text-teal-600 focus:ring-teal-500 cursor-pointer mt-0.5"
                  />
                </div>

                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    ALLOWED SUBSCRIPTION TIERS
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {['STARTER', 'GOLD', 'PLATINUM'].map((tier) => {
                      const isSelected = classForm.allowedTiers.includes(tier);
                      return (
                        <button
                          key={tier}
                          type="button"
                          onClick={() => toggleTier(tier)}
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-[#0f766e] text-white shadow-xs'
                              : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          }`}
                        >
                          {tier}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Blue Card: Zoom Meeting Configuration * (Must be zoom.us / zoom.com) */}
              <div className="p-4 rounded-2xl bg-[#f0f9ff]/80 border border-sky-200/90 space-y-3">
                <div className="flex items-center gap-2">
                  <Video size={16} className="text-sky-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Zoom Meeting Configuration *
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    ZOOM MEETING URL * (MUST BE ZOOM.US / ZOOM.COM)
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://us02web.zoom.us/j/8492019284?pwd=..."
                    value={classForm.zoomUrl}
                    onChange={(e) => setClassForm({ ...classForm, zoomUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      MEETING ID (OPTIONAL)
                    </label>
                    <input
                      type="text"
                      placeholder="849 201 9284"
                      value={classForm.meetingId}
                      onChange={(e) => setClassForm({ ...classForm, meetingId: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      PASSCODE (OPTIONAL)
                    </label>
                    <input
                      type="text"
                      placeholder="WLLWGN26"
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
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition-all cursor-pointer"
                >
                  {editingId ? 'Save Changes' : 'Schedule Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= WHATSAPP SHARE & INVITE MODAL ================= */}
      {showWhatsAppModal && selectedClassForWhatsApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    Share Workout via WhatsApp
                  </h3>
                  <p className="text-xs text-slate-500">
                    Send high-converting invite with class details &amp; direct Zoom credentials.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowWhatsAppModal(false)}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Optional specific recipient phone */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Send to Specific Client Number (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. +91 98765 43210 (leave blank to choose any contact / group)"
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <p className="text-[11px] text-slate-400">
                Leaving this empty lets you select any athlete or workout group inside WhatsApp.
              </p>
            </div>

            {/* [DISABLED FOR FUTURE USE] Old read-only preview box
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Message Preview:</span>
                <span className="text-slate-400 text-[11px]">Formatted for WhatsApp</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-mono whitespace-pre-wrap max-h-56 overflow-y-auto leading-relaxed">
                {generateWhatsAppMessage(selectedClassForWhatsApp, trainerName)}
              </div>
            </div>
            */}

            {/* Editable Message Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-700">
                  <Edit3 size={13} className="text-emerald-600" />
                  <span>Customize Message Before Sending:</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetMessageTemplate}
                    title="Reset to default template format"
                    className="text-[11px] text-teal-600 hover:text-teal-800 font-bold hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RotateCcw size={11} />
                    <span>Reset Format</span>
                  </button>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-400 text-[11px] font-mono">
                    {editableMessage.length} chars
                  </span>
                </div>
              </div>

              <textarea
                rows={9}
                value={editableMessage}
                onChange={(e) => setEditableMessage(e.target.value)}
                placeholder="Customize your workout invite message here..."
                className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-mono leading-relaxed focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-y max-h-72 shadow-inner"
              />

              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <Info size={12} className="text-teal-600 shrink-0" />
                <span>Aap message mein koi bhi correction ya extra details manually edit kar sakte hain.</span>
              </div>
            </div>

            {/* Feedback alert */}
            {copiedToast && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <Check size={14} className="text-emerald-600" />
                <span>Custom invite message copied to clipboard!</span>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleCopyInvite}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Copy size={14} />
                <span>Copy Invite Message</span>
              </button>

              <button
                type="button"
                onClick={() => handleSendWhatsApp(recipientPhone)}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <Send size={14} />
                <span>Open in WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================================
// [DISABLED FOR FUTURE USE] Original TrainerClasses Component
// ==========================================================
// 
// import React, { useState, useEffect } from 'react';
// import {
//   Dumbbell,
//   Plus,
//   Calendar,
//   Clock,
//   Users,
//   Video,
//   Filter,
//   Search,
//   CheckCircle2,
//   X,
//   AlertCircle,
// } from 'lucide-react';
// ... (legacy component preserved)
// */
// 
// 
