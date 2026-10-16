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
  FileText,
  UserPlus,
  ShieldCheck,
  Check,
  Users,
  Dumbbell
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { trainerApi } from '../../../services/trainerApi';

const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && !envUrl.includes('localhost')) return envUrl;
  if (typeof window !== 'undefined' && window.location.protocol === 'https:' && window.location.hostname !== 'localhost') {
    return '/api';
  }
  return envUrl || 'http://localhost:8000/api';
};
const API_URL = getApiUrl();

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

// Subscription Plans matching website catalog for converting leads
const CONVERT_PLANS = [
  // 1-on-1 Personal Training Plans
  {
    id: 'pt_trial',
    name: '1-on-1 Trial Class',
    category: '1-on-1 Personal Training',
    program: 'Personal Training',
    price: 299,
    cycle: 'monthly',
    sessions: 1,
    badge: 'Trial',
    desc: '1 live 1-on-1 coaching session',
  },
  {
    id: 'pt_starter',
    name: 'Starter (3 Sessions/Week)',
    category: '1-on-1 Personal Training',
    program: 'Personal Training',
    price: 3999,
    cycle: 'monthly',
    sessions: 12,
    desc: '3 live coaching sessions weekly',
  },
  {
    id: 'pt_transformation',
    name: 'Transformation (5 Sessions/Week)',
    category: '1-on-1 Personal Training',
    program: 'Personal Training',
    price: 5999,
    cycle: 'monthly',
    sessions: 20,
    badge: 'Most Popular',
    desc: '5 live coaching sessions weekly',
  },
  {
    id: 'pt_premium',
    name: 'Premium 1:1 (Custom Schedule)',
    category: '1-on-1 Personal Training',
    program: 'Personal Training',
    price: 8999,
    cycle: 'monthly',
    sessions: 30,
    desc: 'Custom schedule & unlimited guidance',
  },

  // Live Group Classes Plans
  {
    id: 'gc_trial',
    name: 'Group Classes Trial Class',
    category: 'Live Group Classes',
    program: 'Group Classes (Live Online)',
    price: 99,
    cycle: 'monthly',
    sessions: 1,
    desc: '1 class access of your choice',
  },
  {
    id: 'gc_monthly',
    name: 'Group Classes Monthly Plan',
    category: 'Live Group Classes',
    program: 'Group Classes (Live Online)',
    price: 1999,
    cycle: 'monthly',
    sessions: 24,
    badge: 'Most Popular',
    desc: '6 live classes per week',
  },
  {
    id: 'gc_quarterly',
    name: 'Group Classes Quarterly Plan',
    category: 'Live Group Classes',
    program: 'Group Classes (Live Online)',
    price: 4999,
    cycle: 'quarterly',
    sessions: 72,
    badge: 'Best Value',
    desc: 'All 6 weekly classes (3 months)',
  },
  {
    id: 'gc_annual',
    name: 'Group Classes Annual Plan',
    category: 'Live Group Classes',
    program: 'Group Classes (Live Online)',
    price: 14999,
    cycle: 'annual',
    sessions: 288,
    badge: 'Save More',
    desc: 'Unlimited live classes (1 full year)',
  },
];

const InquiriesView = ({ onStatusChange, onNavigateToClients }) => {
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

  const [convertModalInquiry, setConvertModalInquiry] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState('pt_transformation');
  const [convertPlanName, setConvertPlanName] = useState('Transformation (5 Sessions/Week)');
  const [convertPrice, setConvertPrice] = useState(5999);
  const [convertBillingCycle, setConvertBillingCycle] = useState('monthly');
  const [convertCoach, setConvertCoach] = useState('');
  const [convertCoachId, setConvertCoachId] = useState('');
  const [convertSessions, setConvertSessions] = useState(20);
  const [convertNotes, setConvertNotes] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [coachesList, setCoachesList] = useState([]);

  // Sliding Plan Menu State
  const [isPlanMenuOpen, setIsPlanMenuOpen] = useState(false);
  const [planMenuFilter, setPlanMenuFilter] = useState('All Plans');
  const [customInquiredPlan, setCustomInquiredPlan] = useState(null);

  // Combines client's specific inquired plan at the top with all catalog plans
  const availablePlans = useMemo(() => {
    if (customInquiredPlan) {
      // Put client's inquired plan at the top of the menu
      return [customInquiredPlan, ...CONVERT_PLANS];
    }
    return CONVERT_PLANS;
  }, [customInquiredPlan]);

  const selectedPlan = useMemo(
    () => availablePlans.find((p) => p.id === selectedPlanId) || availablePlans[0],
    [availablePlans, selectedPlanId]
  );

  // Load coaches roster for assignment
  useEffect(() => {
    trainerApi.getApprovedTrainers().then((res) => {
      setCoachesList(Array.isArray(res) ? res : []);
    }).catch(() => {
      setCoachesList([]);
    });
  }, []);

  // Fetch inquiries from backend
  // Fetch inquiries from backend and merge with locally captured leads
  const fetchInquiries = async () => {
    try {
      setLoading(true);
      let serverLeads = [];
      let serverStats = null;

      try {
        const res = await axios.get(`${API_URL}/inquiries`, {
          params: {
            search: searchTerm,
            status: statusFilter,
            program: programFilter,
            sortOrder,
          },
          timeout: 7000,
        });

        if (res.data?.success) {
          serverLeads = Array.isArray(res.data.data) ? res.data.data : [];
          serverStats = res.data.stats || null;
        }
      } catch (networkErr) {
        console.warn('Backend inquiry fetch notice (using merged cache):', networkErr.message);
      }

      // Read locally captured leads (so 0 leads are lost even if backend cold-started)
      let cachedRaw = [];
      try {
        const leads1 = JSON.parse(localStorage.getItem('wellwigen_leads') || '[]');
        const leads2 = JSON.parse(localStorage.getItem('wellwigen_inquiries') || '[]');
        cachedRaw = [...leads1, ...leads2];
      } catch (cacheErr) {}

      const localMapped = cachedRaw.map((item, idx) => ({
        _id: item._id || item.id || `cached_${idx}`,
        fullName: item.fullName || item.name || 'Visitor',
        email: item.email || '',
        phone: item.phone || '',
        program: item.program || 'General Inquiry',
        plan: item.plan || 'Trial Class',
        fitnessGoal: item.fitnessGoal || '',
        preferredTiming: item.preferredTiming || item.preferredTime || '',
        message: item.message || '',
        status: item.status || 'New',
        adminNotes: item.adminNotes || '',
        createdAt: item.createdAt || item.timestamp || new Date().toISOString(),
      }));

      // Deduplicate and merge: prioritize server leads, append any unique local leads
      const combined = [...serverLeads];
      const seenKeys = new Set(
        serverLeads.map((s) => `${(s.email || '').toLowerCase()}_${(s.phone || '').replace(/\D/g, '')}`)
      );
      const seenIds = new Set(serverLeads.map((s) => String(s._id || s.id)));

      for (const loc of localMapped) {
        const locId = String(loc._id);
        const locKey = `${(loc.email || '').toLowerCase()}_${(loc.phone || '').replace(/\D/g, '')}`;
        if (!seenIds.has(locId) && (!locKey || locKey === '_' || !seenKeys.has(locKey))) {
          seenIds.add(locId);
          if (locKey && locKey !== '_') seenKeys.add(locKey);
          combined.unshift(loc);
        }
      }

      // Apply in-memory search and filter if filtering offline leads
      let finalInquiries = combined;
      if (searchTerm && searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        finalInquiries = finalInquiries.filter(
          (i) =>
            i.fullName?.toLowerCase().includes(q) ||
            i.email?.toLowerCase().includes(q) ||
            i.phone?.includes(q) ||
            i.program?.toLowerCase().includes(q) ||
            i.plan?.toLowerCase().includes(q)
        );
      }
      if (statusFilter === 'All') {
        // Converted inquiries have finished and shifted to the Clients section; remove them from active inquiry list
        finalInquiries = finalInquiries.filter((i) => i.status !== 'Converted');
      } else if (statusFilter) {
        finalInquiries = finalInquiries.filter((i) => i.status === statusFilter);
      }
      if (programFilter && programFilter !== 'All') {
        finalInquiries = finalInquiries.filter((i) => i.program === programFilter);
      }

      setInquiries(finalInquiries);

      // Compute stats
      const total = combined.length;
      const newCount = combined.filter((i) => i.status === 'New').length;
      const contactedCount = combined.filter((i) => i.status === 'Contacted').length;
      const convertedCount = combined.filter((i) => i.status === 'Converted').length;

      setStats({
        total: (serverStats && serverStats.total >= total) ? serverStats.total : total,
        new: newCount,
        contacted: contactedCount,
        converted: convertedCount,
      });

      if (typeof onStatusChange === 'function') {
        onStatusChange(newCount);
      }
    } catch (err) {
      console.warn('Inquiries processing notice:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [statusFilter, programFilter, sortOrder]);

  // Real-time listener: refresh inquiries immediately when a lead is submitted in any tab
  useEffect(() => {
    const handleLeadEvent = () => {
      console.log('⚡ Real-time lead event detected! Refreshing inquiries box...');
      fetchInquiries();
    };

    window.addEventListener('wellwigen_lead_submitted', handleLeadEvent);
    window.addEventListener('storage', handleLeadEvent);
    return () => {
      window.removeEventListener('wellwigen_lead_submitted', handleLeadEvent);
      window.removeEventListener('storage', handleLeadEvent);
    };
  }, []);

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
        if (newStatus === 'Converted') {
          // Shift to Clients section
          trainerApi.addClient({
            name: selectedInquiry.fullName,
            email: selectedInquiry.email,
            phone: selectedInquiry.phone,
            goal: selectedInquiry.fitnessGoal || 'General Fitness',
            plan: selectedInquiry.plan || 'Total Wellness Monthly',
            program: selectedInquiry.program || 'Personal Training',
            status: 'Active',
            subscriptionStatus: 'Active',
          });
          // Remove from inquiry records list
          setInquiries((prev) =>
            prev.filter((item) => (item._id || item.id) !== (selectedInquiry._id || selectedInquiry.id))
          );
          toast.success(`🎉 ${selectedInquiry.fullName} shifted to Clients section and removed from Inquiries!`);
        } else {
          setInquiries((prev) =>
            prev.map((item) => (item._id === selectedInquiry._id ? res.data.data : item))
          );
          toast.success(`Status updated to ${newStatus}`);
        }
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

  // Helper to accurately match or store the plan that client sent the inquiry for
  const findPlanForInquiry = (inq) => {
    if (!inq) return { matched: CONVERT_PLANS[2], isCustom: false };

    const rawPlan = (inq.plan || '').toLowerCase().trim();
    const rawProg = (inq.program || '').toLowerCase().trim();
    const isGroup = rawProg.includes('group') || rawPlan.includes('group');

    // 1. Direct name match in CONVERT_PLANS
    const direct = CONVERT_PLANS.find(
      (p) => p.name.toLowerCase() === rawPlan || p.id.toLowerCase() === rawPlan
    );
    if (direct) return { matched: direct, isCustom: false };

    // 2. Keyword matching for Group Classes
    if (isGroup) {
      if (rawPlan.includes('trial') || rawPlan.includes('demo') || rawPlan.includes('single')) {
        return { matched: CONVERT_PLANS.find((p) => p.id === 'gc_trial'), isCustom: false };
      }
      if (rawPlan.includes('quarter') || rawPlan.includes('3 month') || rawPlan.includes('90')) {
        return { matched: CONVERT_PLANS.find((p) => p.id === 'gc_quarterly'), isCustom: false };
      }
      if (rawPlan.includes('annual') || rawPlan.includes('year') || rawPlan.includes('365')) {
        return { matched: CONVERT_PLANS.find((p) => p.id === 'gc_annual'), isCustom: false };
      }
      if (rawPlan.includes('month') || rawPlan.includes('pass') || rawPlan.includes('group')) {
        return { matched: CONVERT_PLANS.find((p) => p.id === 'gc_monthly'), isCustom: false };
      }
    } else {
      // 3. Keyword matching for 1-on-1 Personal Training
      if (rawPlan.includes('trial') || rawPlan.includes('demo') || rawPlan.includes('single')) {
        return { matched: CONVERT_PLANS.find((p) => p.id === 'pt_trial'), isCustom: false };
      }
      if (rawPlan.includes('starter') || rawPlan.includes('3 session') || rawPlan.includes('3x')) {
        return { matched: CONVERT_PLANS.find((p) => p.id === 'pt_starter'), isCustom: false };
      }
      if (rawPlan.includes('transform') || rawPlan.includes('5 session') || rawPlan.includes('5x')) {
        return { matched: CONVERT_PLANS.find((p) => p.id === 'pt_transformation'), isCustom: false };
      }
      if (rawPlan.includes('premium') || rawPlan.includes('elite') || rawPlan.includes('custom') || rawPlan.includes('1:1')) {
        return { matched: CONVERT_PLANS.find((p) => p.id === 'pt_premium'), isCustom: false };
      }
    }

    // 4. If client inquired for a custom or specific plan string that isn't in standard 8:
    if (inq.plan && inq.plan.trim()) {
      const customPlan = {
        id: `inquiry_client_plan_${inq._id || 'custom'}`,
        name: inq.plan.trim(),
        category: inq.program || (isGroup ? 'Live Group Classes' : '1-on-1 Personal Training'),
        program: inq.program || (isGroup ? 'Group Classes (Live Online)' : 'Personal Training'),
        price: isGroup ? 1999 : 5999,
        cycle: 'monthly',
        sessions: isGroup ? 24 : 20,
        badge: 'Client Inquired',
        desc: `Inquired plan from lead submission`,
        isClientInquiry: true,
      };
      return { matched: customPlan, isCustom: true };
    }

    // Fallback based on program
    return {
      matched: isGroup
        ? CONVERT_PLANS.find((p) => p.id === 'gc_monthly')
        : CONVERT_PLANS.find((p) => p.id === 'pt_transformation'),
      isCustom: false,
    };
  };

  // Open Convert to Subscribed Client Modal
  const handleOpenConvertModal = (inq) => {
    setConvertModalInquiry(inq);
    setIsPlanMenuOpen(false);
    setPlanMenuFilter('All Plans');

    // Automatically store the plan that client sent the inquiry for
    const { matched, isCustom } = findPlanForInquiry(inq);
    if (isCustom) {
      setCustomInquiredPlan(matched);
    } else {
      setCustomInquiredPlan(null);
    }

    setSelectedPlanId(matched.id);
    setConvertPlanName(matched.name);
    setConvertPrice(matched.price);
    setConvertBillingCycle(matched.cycle);
    setConvertSessions(matched.sessions);
    setConvertCoach('');
    setConvertCoachId('');
    setConvertNotes(inq.plan ? `Client inquired for: ${inq.plan}` : '');
  };

  const handlePlanSelect = (planId) => {
    setSelectedPlanId(planId);
    const found = availablePlans.find((p) => p.id === planId);
    if (found) {
      setConvertPlanName(found.name);
      setConvertPrice(found.price);
      setConvertBillingCycle(found.cycle);
      setConvertSessions(found.sessions);
    }
  };

  // Confirm and Convert to Subscribed Client
  const handleConfirmConvertToClient = async () => {
    if (!convertModalInquiry) return;
    try {
      setIsConverting(true);
      const payload = {
        plan: convertPlanName,
        program: convertModalInquiry.program,
        price: Number(convertPrice) || 1999,
        billingCycle: convertBillingCycle,
        assignedCoach: convertCoach,
        assignedCoachId: convertCoachId,
        totalSessions: Number(convertSessions) || 12,
        adminNotes: convertNotes,
      };

      // 1. Call Backend API
      let backendClient = null;
      try {
        const res = await axios.post(`${API_URL}/inquiries/${convertModalInquiry._id}/convert-to-client`, payload);
        if (res.data?.success) {
          backendClient = res.data.client;
        }
      } catch (apiErr) {
        console.warn('Backend convert API notice:', apiErr.message);
      }

      // 2. Add client into trainerApi Client store so it immediately shows up in Clients tab
      const clientData = {
        id: backendClient?.id || `cli_${Date.now()}`,
        name: convertModalInquiry.fullName,
        email: convertModalInquiry.email,
        phone: convertModalInquiry.phone,
        goal: convertModalInquiry.fitnessGoal || 'General Fitness',
        plan: convertPlanName,
        program: convertModalInquiry.program,
        sessionsCompleted: 0,
        totalSessions: Number(convertSessions) || 12,
        nextSession: 'Session 1: Initial Assessment',
        status: 'Active',
        subscriptionStatus: 'Active',
        renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        assignedCoach: convertCoach,
        assignedCoachId: convertCoachId,
      };

      trainerApi.addClient(clientData);

      if (convertCoach && convertCoach !== 'Unassigned') {
        trainerApi.assignCoachToTarget({
          assignmentType: 'client',
          targetId: clientData.id,
          targetName: clientData.name,
          targetEmail: clientData.email,
          targetPhone: clientData.phone,
          targetGoal: clientData.goal,
          plan: clientData.plan,
          totalSessions: clientData.totalSessions,
          coachName: convertCoach,
          coachId: convertCoachId,
          adminNotes: convertNotes || `Converted from Inquiry`,
        });
        trainerApi.syncClientToMembership(clientData);
      }

      // Remove converted inquiry from active inquiries table
      setInquiries((prev) =>
        prev.filter((item) => (item._id || item.id) !== (convertModalInquiry._id || convertModalInquiry.id))
      );

      if (selectedInquiry?._id === convertModalInquiry._id) {
        setSelectedInquiry((prev) => ({ ...prev, status: 'Converted' }));
      }

      toast.success(`🎉 ${convertModalInquiry.fullName} shifted to Clients section and removed from Inquiries!`);
      setConvertModalInquiry(null);
      fetchInquiries();
      if (onStatusChange) onStatusChange();
    } catch (err) {
      toast.error('Failed to convert inquiry to client: ' + (err.message || 'Server error'));
    } finally {
      setIsConverting(false);
    }
  };

  // Delete Inquiry
  const handleDeleteInquiry = async () => {
    if (!selectedInquiry) return;
    const targetId = selectedInquiry._id || selectedInquiry.id;
    if (!targetId) {
      toast.error('Inquiry identifier not found');
      return;
    }

    try {
      setIsDeleting(true);
      const res = await axios.delete(`${API_URL}/inquiries/${targetId}`);
      if (res.data?.success) {
        toast.success('Inquiry record deleted successfully');
        setInquiries((prev) =>
          prev.filter((item) => (item._id || item.id) !== targetId && item._id !== targetId)
        );

        // Also clean from localStorage cache if present
        try {
          const cachedLeads = JSON.parse(localStorage.getItem('wellwigen_leads') || '[]');
          const updatedCache = cachedLeads.filter(
            (c) => (c._id || c.id) !== targetId && c.email !== selectedInquiry.email
          );
          localStorage.setItem('wellwigen_leads', JSON.stringify(updatedCache));
        } catch (_cacheErr) {
          // ignore cache parsing error
        }

        setSelectedInquiry(null);
        fetchInquiries();
      } else {
        toast.error(res.data?.message || 'Failed to delete inquiry');
      }
    } catch (err) {
      console.error('Delete inquiry error:', err);
      toast.error(err.response?.data?.message || 'Failed to delete inquiry');
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
                  <th className="px-5 py-3.5 min-w-[230px]">Program & Plan</th>
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
                      <td className="px-5 py-4 min-w-[230px]">
                        {(() => {
                          const rawProg = inq.program || 'Fitness Program';
                          const isGroup = rawProg.toLowerCase().includes('group');
                          const isPersonal = rawProg.toLowerCase().includes('personal');

                          const planName = inq.plan || 'Trial Class';
                          const isTrial = planName.toLowerCase().includes('trial');

                          return (
                            <div className="flex flex-col gap-1.5 items-start">
                              {/* Program Header */}
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                                    isGroup
                                      ? 'bg-violet-100/80 text-violet-700'
                                      : isPersonal
                                      ? 'bg-teal-100/80 text-teal-700'
                                      : 'bg-slate-100 text-slate-700'
                                  }`}
                                >
                                  {isGroup ? <Users size={11} /> : <Dumbbell size={11} />}
                                </span>
                                <span className="font-extrabold text-slate-900 text-xs tracking-tight">
                                  {rawProg}
                                </span>
                              </div>

                              {/* Plan Badge */}
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10.5px] font-semibold tracking-wide bg-gradient-to-r from-teal-50/90 via-emerald-50/70 to-teal-50/90 text-teal-900 border border-teal-200/80 shadow-2xs">
                                <Sparkles
                                  size={10}
                                  className={isTrial ? 'text-amber-500 shrink-0' : 'text-teal-600 shrink-0'}
                                />
                                <span className="font-medium whitespace-nowrap" title={planName}>
                                  {planName}
                                </span>
                              </div>
                            </div>
                          );
                        })()}
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
                        <div className="flex items-center justify-end gap-1.5">
                          {inq.status === 'Converted' ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onNavigateToClients) onNavigateToClients();
                              }}
                              className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-[11px] inline-flex items-center gap-1 transition-all"
                              title="Subscribed Client - Click to View in Clients Section"
                            >
                              <ShieldCheck size={13} className="text-emerald-600" />
                              <span>Client</span>
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenConvertModal(inq);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 text-purple-700 border border-purple-200/90 font-bold text-[11px] inline-flex items-center gap-1 transition-all shadow-xs"
                              title="Customer subscribed? Add to Clients section"
                            >
                              <UserPlus size={12} className="text-purple-600" />
                              <span>+ Client</span>
                            </button>
                          )}
                          <a
                            href={`https://wa.me/${getCleanWhatsAppPhone(inq.phone)}?text=${encodeURIComponent(
                              `Hi ${inq.fullName}! This is Wellwigen Coaching. We received your inquiry regarding ${inq.program} (${inq.plan || 'Trial Class'}). Are you ready to get started?`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-all inline-flex items-center justify-center"
                            title={`Chat with ${inq.fullName} on WhatsApp`}
                          >
                            <MessageCircle size={14} />
                          </a>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDrawer(inq);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300 transition-all text-xs"
                          >
                            View
                          </button>
                        </div>
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

              {/* Convert to Subscribed Client Action Card */}
              {selectedInquiry.status === 'Converted' ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200/90 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-emerald-950">Enrolled Subscribed Client</h5>
                      <p className="text-[11px] text-emerald-700">Client profile is active in Clients section.</p>
                    </div>
                  </div>
                  {onNavigateToClients && (
                    <button
                      onClick={onNavigateToClients}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <span>View in Clients</span>
                      <ExternalLink size={12} />
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-gradient-to-r from-purple-50/80 via-indigo-50/50 to-white rounded-2xl border border-purple-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold shrink-0">
                      <UserPlus size={19} />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-purple-950">Client bought a subscription?</h5>
                      <p className="text-[11px] text-purple-700/80">Add {selectedInquiry.fullName} to your Clients section.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleOpenConvertModal(selectedInquiry)}
                    className="py-2 px-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-purple-500/20 flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <UserPlus size={14} />
                    <span>Add to Clients</span>
                  </button>
                </div>
              )}

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
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Program</span>
                    <span className="font-extrabold text-slate-900 inline-flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-md bg-violet-100/70 text-violet-700 inline-flex items-center justify-center shrink-0">
                        {selectedInquiry.program?.toLowerCase().includes('group') ? (
                          <Users size={11} />
                        ) : (
                          <Dumbbell size={11} />
                        )}
                      </span>
                      {selectedInquiry.program}
                    </span>
                  </div>
                  <div className="p-3 bg-white border border-slate-200 rounded-xl">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Chosen Plan</span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-gradient-to-r from-teal-50 to-emerald-50 text-teal-900 border border-teal-200/90 shadow-2xs">
                      <Sparkles size={11} className="text-teal-600" />
                      {selectedInquiry.plan || 'Not specified'}
                    </span>
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

      {/* ================= CONVERT TO SUBSCRIBED CLIENT MODAL ================= */}
      <AnimatePresence>
        {convertModalInquiry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isConverting && setConvertModalInquiry(null)}
              className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10 flex flex-col my-auto"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-purple-50 via-indigo-50/50 to-white flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/25">
                    <UserPlus size={20} />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-xl text-slate-900 leading-tight">
                      Enroll as Subscribed Client
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Adds this customer to your Active Clients directory.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => !isConverting && setConvertModalInquiry(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Form Content */}
              <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                {/* Client Info Banner */}
                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">
                      {convertModalInquiry.fullName}
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      {convertModalInquiry.phone} &bull; {convertModalInquiry.email}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 font-bold text-[10px] inline-block">
                      {convertModalInquiry.program || 'Fitness Program'}
                    </span>
                    {convertModalInquiry.plan && (
                      <span className="text-[10px] text-purple-700 font-semibold block mt-0.5">
                        Inquired: <strong>{convertModalInquiry.plan}</strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* Plan Selection - Sliding Menu Box */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Select Purchased Subscription Plan *
                    </label>
                    <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                      {selectedPlan?.category || 'All Plans'}
                    </span>
                  </div>

                  {/* The Sliding Menu Box Trigger */}
                  <div
                    onClick={() => setIsPlanMenuOpen((prev) => !prev)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between bg-white shadow-xs hover:border-purple-300 ${
                      isPlanMenuOpen
                        ? 'border-purple-500 ring-4 ring-purple-500/10'
                        : 'border-slate-200 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs shadow-purple-500/30">
                        {selectedPlan?.category?.includes('Group') ? (
                          <Users size={16} />
                        ) : (
                          <Dumbbell size={16} />
                        )}
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900">
                            {selectedPlan?.name || 'Choose Subscription Plan'}
                          </span>
                          {selectedPlan?.isClientInquiry ? (
                            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                              Client Inquired Plan
                            </span>
                          ) : selectedPlan?.badge ? (
                            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                              {selectedPlan.badge}
                            </span>
                          ) : null}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span>{selectedPlan?.sessions} sessions</span>
                          <span>&bull;</span>
                          <span className="capitalize">{selectedPlan?.cycle} billing</span>
                          {selectedPlan?.desc && (
                            <>
                              <span>&bull;</span>
                              <span className="text-slate-400 truncate max-w-[200px]">{selectedPlan.desc}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-black text-base text-purple-700 tracking-tight">
                        ₹{(selectedPlan?.price || 0).toLocaleString('en-IN')}
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-200 ${
                            isPlanMenuOpen ? 'rotate-180 text-purple-600' : ''
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sliding Menu Down Box */}
                  <AnimatePresence>
                    {isPlanMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: -4 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -4 }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                        className="mt-2 bg-white rounded-2xl border border-purple-200/90 shadow-2xl shadow-purple-950/15 overflow-hidden z-30"
                      >
                        {/* Sliding Menu Filter Tabs */}
                        <div className="p-2 bg-slate-50/90 border-b border-slate-100 flex items-center gap-1.5 text-[11px]">
                          {['All Plans', '1-on-1 Personal Training', 'Live Group Classes'].map((tab) => {
                            const isTabActive = planMenuFilter === tab;
                            return (
                              <button
                                key={tab}
                                type="button"
                                onClick={() => setPlanMenuFilter(tab)}
                                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                                  isTabActive
                                    ? 'bg-purple-600 text-white shadow-xs shadow-purple-600/30'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                                }`}
                              >
                                {tab}
                              </button>
                            );
                          })}
                        </div>

                        {/* Plans List inside Sliding Menu */}
                        <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 p-1.5 space-y-1">
                          {availablePlans.filter((p) => {
                            if (planMenuFilter === 'All Plans') return true;
                            return p.category === planMenuFilter;
                          }).map((plan) => {
                            const isSelected = selectedPlanId === plan.id;
                            return (
                              <div
                                key={plan.id}
                                onClick={() => {
                                  handlePlanSelect(plan.id);
                                  setIsPlanMenuOpen(false);
                                }}
                                className={`p-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                                  isSelected
                                    ? 'bg-purple-50 border border-purple-300'
                                    : 'hover:bg-slate-50 border border-transparent'
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <div
                                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                      isSelected
                                        ? 'border-purple-600 bg-purple-600 text-white'
                                        : 'border-slate-300'
                                    }`}
                                  >
                                    {isSelected && <Check size={10} strokeWidth={3} />}
                                  </div>

                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-xs font-bold text-slate-900">
                                        {plan.name}
                                      </span>
                                      {plan.badge && (
                                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-200">
                                          {plan.badge}
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[10px] text-slate-500">
                                      <span className="text-purple-700 font-semibold">{plan.category}</span>
                                      {' '}&bull; {plan.sessions} sessions &bull; {plan.cycle} billing
                                    </div>
                                  </div>
                                </div>

                                <span className="font-black text-sm text-purple-700 shrink-0 ml-2">
                                  ₹{plan.price.toLocaleString('en-IN')}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Coach Assignment & Sessions */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Assign Master Coach (Optional)
                    </label>
                    <select
                      value={convertCoach}
                      onChange={(e) => {
                        const val = e.target.value;
                        setConvertCoach(val);
                        const c = coachesList.find((item) => item.name === val);
                        setConvertCoachId(c ? (c.id || c._id || '') : '');
                      }}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:border-purple-500"
                    >
                      <option value="">
                        {coachesList.length === 0 ? 'No Coaches Available (Unassigned)' : 'Unassigned (Assign Later)'}
                      </option>
                      {coachesList.map((coach) => (
                        <option key={coach.id || coach._id || coach.name} value={coach.name}>
                          {coach.name} ({coach.specialization || 'Coach'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Included Sessions Count
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={200}
                      value={convertSessions}
                      onChange={(e) => setConvertSessions(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Price and Billing Cycle */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Price Paid (₹) *
                    </label>
                    <input
                      type="number"
                      value={convertPrice}
                      onChange={(e) => setConvertPrice(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Billing Cycle
                    </label>
                    <select
                      value={convertBillingCycle}
                      onChange={(e) => setConvertBillingCycle(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:border-purple-500"
                    >
                      <option value="monthly">Monthly (30 Days)</option>
                      <option value="quarterly">Quarterly (90 Days)</option>
                      <option value="annual">Annual (365 Days)</option>
                    </select>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Onboarding / Payment Notes (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Paid via UPI, preferred evening batch 6 PM"
                    value={convertNotes}
                    onChange={(e) => setConvertNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={isConverting}
                  onClick={() => setConvertModalInquiry(null)}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isConverting}
                  onClick={handleConfirmConvertToClient}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-purple-500/25 transition-all disabled:opacity-50"
                >
                  {isConverting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Enrolling Client...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus size={15} />
                      <span>Confirm &amp; Add to Clients</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InquiriesView;
