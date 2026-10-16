import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ticket,
  Search,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Users,
  Calendar,
  X,
  Edit,
  Trash2,
  DollarSign,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Check,
  UserX
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { subscriptionPlanService } from '../../subscription/services/subscriptionPlanService';
import { trainerApi } from '../../../services/trainerApi';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';


// Default starter plans if API is loading or offline
const INITIAL_DEFAULT_PLANS = [
  {
    _id: 'plan_1',
    name: 'Strength & Conditioning Tier',
    tag: 'Popular',
    description: 'Personalized strength routines, weekly form check-ins, and progressive overload tracking.',
    prices: { monthly: 2999, annual: 29990 },
    deliveryDays: 4,
    features: ['4 Coaching Sessions/Week', 'Custom Workout App Access', 'Nutrition Macro Guidance', 'Direct Coach Chat'],
    status: 'active',
  },
  {
    _id: 'plan_2',
    name: 'Elite Transformation 1-on-1',
    tag: 'VIP Elite',
    description: 'Daily accountability, live 1-on-1 video training sessions, and customized biomechanics assessment.',
    prices: { monthly: 5999, annual: 59990 },
    deliveryDays: 6,
    features: ['Dedicated Personal Coach', 'Unlimited Form Checks', 'Weekly Body Composition Review', 'Priority Slot Booking'],
    status: 'active',
  },
  {
    _id: 'plan_3',
    name: 'Flex Mobility & Rehab Pass',
    tag: 'Starter',
    description: 'Postural correction, joint mobility protocols, and functional movement classes.',
    prices: { monthly: 1499, annual: 14990 },
    deliveryDays: 3,
    features: ['3 Mobility Sessions/Week', 'Posture Reset Protocol', 'Group Class Access', 'Video Library'],
    status: 'active',
  },
];

// Production subscription records mapping clients to plans
const INITIAL_MOCK_SUBSCRIPTIONS = [];

export default function SubscriptionsView() {
  const [activeSubTab, setActiveSubTab] = useState('memberships'); // 'memberships' | 'mapping' | 'plans'
  const [plans, setPlans] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Plan creation / editing modal state
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planFormData, setPlanFormData] = useState({
    name: '',
    tag: '',
    description: '',
    monthlyPrice: 2999,
    annualPrice: 29990,
    deliveryDays: 4,
    featuresText: '4 Coaching Sessions/Week\nCustom Workout App Access\nNutrition Macro Guidance',
  });

  // Load plans & subscriptions
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await subscriptionPlanService.getAllPlans();
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        setPlans(res.data);
      } else {
        setPlans(INITIAL_DEFAULT_PLANS);
      }
    } catch (err) {
      console.warn('API error fetching subscription plans, using fallback:', err);
      setPlans(INITIAL_DEFAULT_PLANS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
    // Load subscriptions from local state/storage (purge legacy mock subscriptions)
    try {
      const savedSubs = localStorage.getItem('wellwigen_admin_subscriptions');
      if (savedSubs) {
        if (savedSubs.includes('sub_101') || savedSubs.includes('Arjun Mehra')) {
          localStorage.setItem('wellwigen_admin_subscriptions', JSON.stringify([]));
          setSubscriptions([]);
        } else {
          setSubscriptions(JSON.parse(savedSubs));
        }
      } else {
        setSubscriptions([]);
      }
    } catch {
      setSubscriptions([]);
    }
  }, []);

  // Save subscriptions to storage
  const updateSubscriptions = (newSubs) => {
    setSubscriptions(newSubs);
    localStorage.setItem('wellwigen_admin_subscriptions', JSON.stringify(newSubs));
  };

  // Open modal for new or editing plan
  const handleOpenPlanModal = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setPlanFormData({
        name: plan.name || '',
        tag: plan.tag || '',
        description: plan.description || '',
        monthlyPrice: plan.prices?.monthly || 0,
        annualPrice: plan.prices?.annual || 0,
        deliveryDays: plan.deliveryDays || 3,
        featuresText: Array.isArray(plan.features) ? plan.features.join('\n') : '',
      });
    } else {
      setEditingPlan(null);
      setPlanFormData({
        name: '',
        tag: 'Popular',
        description: '',
        monthlyPrice: 2999,
        annualPrice: 29990,
        deliveryDays: 4,
        featuresText: '4 Coaching Sessions/Week\nProgressive Overload Tracking\nNutrition Macro Guidance',
      });
    }
    setShowPlanModal(true);
  };

  // Handle Plan Form Submit
  const handlePlanSubmit = async (e) => {
    e.preventDefault();
    const featuresArray = planFormData.featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const planPayload = {
      name: planFormData.name,
      tag: planFormData.tag,
      description: planFormData.description,
      prices: {
        monthly: Number(planFormData.monthlyPrice),
        annual: Number(planFormData.annualPrice),
      },
      deliveryDays: Number(planFormData.deliveryDays),
      features: featuresArray,
      status: 'active',
    };

    try {
      if (editingPlan) {
        await subscriptionPlanService.updatePlan(editingPlan._id, planPayload);
        toast.success(`Plan "${planFormData.name}" updated successfully!`);
      } else {
        await subscriptionPlanService.createPlan(planPayload);
        toast.success(`New plan "${planFormData.name}" created!`);
      }
      setShowPlanModal(false);
      fetchPlans();
    } catch (err) {
      // Offline fallback: update local plans array
      if (editingPlan) {
        setPlans((prev) =>
          prev.map((p) => (p._id === editingPlan._id ? { ...p, ...planPayload } : p))
        );
        toast.success(`Plan "${planFormData.name}" updated locally!`);
      } else {
        const newPlan = { ...planPayload, _id: 'plan_' + Date.now() };
        setPlans((prev) => [newPlan, ...prev]);
        toast.success(`New plan "${planFormData.name}" created locally!`);
      }
      setShowPlanModal(false);
    }
  };

  // Toggle Plan Status (Active / Disabled)
  const handleTogglePlanStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await subscriptionPlanService.togglePlanStatus(id);
      toast.success(`Plan is now ${newStatus}`);
      fetchPlans();
    } catch {
      setPlans((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status: newStatus } : p))
      );
      toast.success(`Plan status changed to ${newStatus}`);
    }
  };

  // OLD CODE (commented by AI)
  /*
  const handleDeletePlan = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await subscriptionPlanService.deletePlan(id);
      toast.success('Plan removed');
      fetchPlans();
    } catch {
      setPlans((prev) => prev.filter((p) => p._id !== id));
      toast.success('Plan removed');
    }
  };
  */

  // NEW CODE - Modern SaaS Confirmation Dialog for Deleting Plan
  const [planToDelete, setPlanToDelete] = useState(null);
  const [isDeletingPlan, setIsDeletingPlan] = useState(false);

  const handleDeletePlan = (id, name) => {
    setPlanToDelete({ id, name });
  };

  const handleConfirmDeletePlan = async () => {
    if (!planToDelete) return;
    try {
      setIsDeletingPlan(true);
      await subscriptionPlanService.deletePlan(planToDelete.id);
      toast.success(`Plan "${planToDelete.name}" deleted`);
      fetchPlans();
    } catch {
      setPlans((prev) => prev.filter((p) => p._id !== planToDelete.id));
      toast.success(`Plan "${planToDelete.name}" removed`);
    } finally {
      setIsDeletingPlan(false);
      setPlanToDelete(null);
    }
  };

  // Extend Subscription
  const handleExtendSubscription = (subId) => {
    const updated = subscriptions.map((s) => {
      if (s.id === subId) {
        const currentExp = new Date(s.expiryDate);
        currentExp.setDate(currentExp.getDate() + 30);
        const newExpStr = currentExp.toISOString().split('T')[0];
        return { ...s, expiryDate: newExpStr, status: 'Active' };
      }
      return s;
    });
    updateSubscriptions(updated);
    toast.success('Membership extended by 30 days!');
  };

  // Cancel / Remove Subscription
  const handleRemoveSubscription = async (sub) => {
    const updated = subscriptions.map((s) => {
      if (s.id === sub.id) {
        return { ...s, status: 'Cancelled' };
      }
      return s;
    });
    updateSubscriptions(updated);
    if (sub.clientId || sub.clientEmail) {
      trainerApi.removeClientSubscription(sub.clientId || sub.clientEmail);
    }
    try {
      await axios.delete(`${API_BASE}/admin/subscriptions/${sub.id || sub.clientEmail}`);
    } catch {
      // local fallback
    }
    toast.success(`Subscription cancelled for "${sub.clientName}".`);
  };

  // Delete Subscriber completely
  const handleDeleteSubscriber = async (sub) => {
    const updated = subscriptions.filter((s) => s.id !== sub.id);
    updateSubscriptions(updated);
    if (sub.clientId || sub.clientEmail) {
      trainerApi.removeClient(sub.clientId || sub.clientEmail);
    }
    try {
      await axios.delete(`${API_BASE}/admin/subscribers/${sub.clientId || sub.clientEmail}`);
    } catch {
      // local fallback
    }
    toast.success(`Subscriber "${sub.clientName}" removed from platform.`);
  };

  // Change Subscription Status
  const handleChangeSubStatus = (subId, newStatus) => {
    const updated = subscriptions.map((s) => {
      if (s.id === subId) {
        return { ...s, status: newStatus };
      }
      return s;
    });
    updateSubscriptions(updated);
    toast.success(`Membership status updated to ${newStatus}.`);
  };


  // Filtered Plans
  const filteredPlans = useMemo(() => {
    return plans.filter((p) => {
      const matchSearch =
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase()) ||
        p.tag?.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && p.status === 'active') ||
        (statusFilter === 'inactive' && p.status !== 'active');
      return matchSearch && matchStatus;
    });
  }, [plans, search, statusFilter]);

  // Filtered Subscriptions
  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((s) => {
      const matchSearch =
        s.clientName?.toLowerCase().includes(search.toLowerCase()) ||
        s.clientEmail?.toLowerCase().includes(search.toLowerCase()) ||
        s.planName?.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
        statusFilter === 'all' || s.status?.toLowerCase() === statusFilter.toLowerCase();
      return matchSearch && matchStatus;
    });
  }, [subscriptions, search, statusFilter]);

  // Mapping Stats: count clients per plan
  const planClientCounts = useMemo(() => {
    const counts = {};
    subscriptions.forEach((s) => {
      counts[s.planName] = (counts[s.planName] || 0) + 1;
    });
    return counts;
  }, [subscriptions]);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* ================= PAGE HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded uppercase tracking-wider">
              Membership Engine
            </span>
            {/* [DISABLED FOR FUTURE USE] Subscriptions breadcrumb
            <span className="text-slate-300">/</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Subscriptions
            </span>
            */}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Memberships
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl">
            Monitor active and expired client memberships, renewal dates, and coach assignments.
          </p>
        </div>

        {/* [COMMENTED OUT PER REQUEST] Create Plan Button
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleOpenPlanModal()}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#009688] hover:bg-[#00796B] text-white rounded-xl text-xs font-bold shadow-md shadow-teal-700/20 transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>Create New Plan</span>
          </button>
        </div>
        */}
      </div>

      {/* ================= KPI TELEMETRY ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
              Active Tiers
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Ticket size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {plans.filter((p) => p.status === 'active').length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Live tiers available to trainees</p>
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
          <div className="text-2xl font-black text-emerald-700">
            {subscriptions.filter((s) => s.status === 'Active').length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Currently paying members</p>
        </div>

        <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">
              Expired Memberships
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-700">
            {subscriptions.filter((s) => s.status === 'Expired').length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Eligible for renewal campaign</p>
        </div>

        <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700">
              Free Trials
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Sparkles size={16} />
            </div>
          </div>
          <div className="text-2xl font-black text-sky-700">
            {subscriptions.filter((s) => s.status === 'Trial').length}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Prospective tier converts</p>
        </div>
      </div>

      {/* ================= SUB-TABS NAVIGATION ================= */}
      <div className="border-b border-slate-200">
        <div className="flex gap-8">
          {/* [DISABLED FOR FUTURE USE] Plans & Tiers Sub-tab Option
          <button
            onClick={() => {
              setActiveSubTab('plans');
              setStatusFilter('all');
            }}
            className={`pb-4 text-xs font-bold uppercase tracking-wider transition-all relative ${
              activeSubTab === 'plans'
                ? 'text-[#009688] border-b-2 border-[#009688]'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            Plans & Tiers ({plans.length})
          </button>
          */}
          <button
            onClick={() => {
              setActiveSubTab('memberships');
              setStatusFilter('all');
            }}
            className={`pb-4 text-xs font-bold uppercase tracking-wider transition-all relative ${
              activeSubTab === 'memberships'
                ? 'text-[#009688] border-b-2 border-[#009688]'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            1. Active &amp; Expired Memberships ({subscriptions.length})
          </button>
          <button
            onClick={() => {
              setActiveSubTab('mapping');
              setStatusFilter('all');
            }}
            className={`pb-4 text-xs font-bold uppercase tracking-wider transition-all relative ${
              activeSubTab === 'mapping'
                ? 'text-[#009688] border-b-2 border-[#009688]'
                : 'text-slate-400 hover:text-slate-700'
            }`}
          >
            2. Client-to-Plan Mapping
          </button>
        </div>
      </div>

      {/* ================= TOOLBAR (SEARCH & FILTERS) ================= */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search client or membership..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {activeSubTab === 'plans' ? (
            ['all', 'active', 'inactive'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#009688] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st === 'all' ? 'All Plans' : st}
              </button>
            ))
          ) : (
            ['all', 'active', 'expired', 'trial'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-[#009688] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st === 'all' ? 'All Memberships' : st}
              </button>
            ))
          )}
        </div>
      </div>

      {/* ================= TAB 1: PLANS & TIERS ================= */}
      {activeSubTab === 'plans' && (
        <div>
          {filteredPlans.length === 0 ? (
            <div className="p-16 text-center bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-3">
              <Ticket size={40} className="mx-auto text-slate-300" />
              <h4 className="text-base font-bold text-slate-800">No subscription plans found</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {search ? 'Try clearing your search query.' : 'Create your first coaching tier to get started.'}
              </p>
              <button
                onClick={() => handleOpenPlanModal()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#009688] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#00796B] transition-all cursor-pointer"
              >
                <Plus size={14} />
                <span>Create Plan</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlans.map((plan) => (
                <div
                  key={plan._id}
                  className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Tag & Status */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                        {plan.tag || 'Tier'}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          plan.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {plan.status === 'active' ? 'Active' : 'Disabled'}
                      </span>
                    </div>

                    {/* Plan Name & Desc */}
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">{plan.name}</h3>
                    <p className="text-xs text-slate-500 mt-1 min-h-[36px]">{plan.description}</p>

                    {/* Pricing */}
                    <div className="my-5 p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monthly</p>
                        <p className="text-lg font-black text-slate-900">₹{plan.prices?.monthly?.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Annual</p>
                        <p className="text-lg font-black text-teal-700">₹{plan.prices?.annual?.toLocaleString('en-IN')}</p>
                      </div>
                    </div>

                    {/* Features list */}
                    {Array.isArray(plan.features) && plan.features.length > 0 && (
                      <div className="space-y-2 mb-6">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">What’s Included:</p>
                        {plan.features.map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                            <Check size={13} className="text-teal-600 shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-slate-100 flex gap-2">
                    <button
                      onClick={() => handleOpenPlanModal(plan)}
                      className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <Edit size={13} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleTogglePlanStatus(plan._id, plan.status)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                        plan.status === 'active'
                          ? 'bg-amber-50 hover:bg-amber-100 text-amber-700'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      {plan.status === 'active' ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => handleDeletePlan(plan._id, plan.name)}
                      className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-all"
                      title="Delete Plan"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: ACTIVE & EXPIRED SUBSCRIPTIONS ================= */}
      {activeSubTab === 'memberships' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Trainee Membership Roster
            </h3>
            <span className="text-xs font-bold text-slate-400">
              Showing {filteredSubscriptions.length} memberships
            </span>
          </div>

          {filteredSubscriptions.length === 0 ? (
            <div className="p-16 text-center space-y-3">
              <Users size={36} className="mx-auto text-slate-300" />
              <h4 className="text-sm font-bold text-slate-800">No memberships match filters</h4>
              <p className="text-xs text-slate-400">Try searching a different client name or resetting status filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">Client</th>
                    <th className="px-5 py-3.5">Plan / Tier</th>
                    <th className="px-5 py-3.5">Billing & Price</th>
                    <th className="px-5 py-3.5">Assigned Coach</th>
                    <th className="px-5 py-3.5">Valid Until</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSubscriptions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Client */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900">{sub.clientName}</div>
                        <div className="text-[11px] text-slate-400">{sub.clientEmail}</div>
                      </td>

                      {/* Plan */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-800">{sub.planName}</div>
                        <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                          {sub.planTier}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900">{sub.price}</div>
                        <div className="text-[10px] text-slate-400">{sub.billingCycle}</div>
                      </td>

                      {/* Coach */}
                      <td className="px-5 py-4 font-semibold text-slate-700">
                        {sub.assignedCoach}
                      </td>

                      {/* Expiry */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-800">{sub.expiryDate}</div>
                        <div className="text-[10px] text-slate-400">Started: {sub.startDate}</div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <select
                          value={sub.status}
                          onChange={(e) => handleChangeSubStatus(sub.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border cursor-pointer focus:outline-none transition-all ${
                            sub.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : sub.status === 'Trial'
                              ? 'bg-sky-50 text-sky-700 border-sky-200'
                              : sub.status === 'Cancelled'
                              ? 'bg-slate-100 text-slate-700 border-slate-300'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          <option value="Active">Active</option>
                          <option value="Trial">Trial</option>
                          <option value="Expired">Expired</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleExtendSubscription(sub.id)}
                            className="px-2.5 py-1.5 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                          >
                            Extend (+30d)
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveSubscription(sub)}
                            disabled={sub.status === 'Cancelled'}
                            title="Cancel / Remove Subscription"
                            className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 disabled:opacity-40 font-bold text-xs transition-all cursor-pointer flex items-center gap-1"
                          >
                            <UserX size={14} />
                            <span className="hidden xl:inline text-[11px]">Remove Sub</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSubscriber(sub)}
                            title="Delete Subscriber Completely"
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-all cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: CLIENT-TO-PLAN MAPPING ================= */}
      {activeSubTab === 'mapping' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const enrolled = subscriptions.filter((s) => s.planName === plan.name);
              return (
                <div
                  key={plan._id}
                  className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{plan.name}</h4>
                      <span className="text-[10px] font-bold text-teal-600 uppercase">
                        {plan.tag}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 bg-teal-50 text-teal-700 font-extrabold text-xs rounded-full">
                      {enrolled.length} Trainees
                    </span>
                  </div>

                  {enrolled.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-4 text-center">
                      No trainees currently assigned to this tier.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                      {enrolled.map((sub) => (
                        <div
                          key={sub.id}
                          className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between text-xs"
                        >
                          <div>
                            <p className="font-bold text-slate-800">{sub.clientName}</p>
                            <p className="text-[10px] text-slate-400">{sub.assignedCoach}</p>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              sub.status === 'Active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {sub.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= MODAL: CREATE / EDIT PLAN ================= */}
      <AnimatePresence>
        {showPlanModal && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl border border-slate-100"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/70">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {editingPlan ? 'Edit Coaching Tier' : 'Create Coaching Tier'}
                  </h2>
                  <p className="text-xs text-slate-400">Configure subscription tier attributes and pricing.</p>
                </div>
                <button
                  onClick={() => setShowPlanModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handlePlanSubmit} className="p-6 sm:p-8 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Tier Name
                    </label>
                    <input
                      required
                      value={planFormData.name}
                      onChange={(e) => setPlanFormData({ ...planFormData, name: e.target.value })}
                      placeholder="e.g. Strength & Conditioning Tier"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-500 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Tag / Badge
                    </label>
                    <input
                      value={planFormData.tag}
                      onChange={(e) => setPlanFormData({ ...planFormData, tag: e.target.value })}
                      placeholder="e.g. Popular, Elite"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Description
                  </label>
                  <textarea
                    required
                    value={planFormData.description}
                    onChange={(e) => setPlanFormData({ ...planFormData, description: e.target.value })}
                    rows={2}
                    placeholder="Short description of this tier's training methodology..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-teal-500 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Monthly ₹
                    </label>
                    <input
                      type="number"
                      required
                      value={planFormData.monthlyPrice}
                      onChange={(e) => setPlanFormData({ ...planFormData, monthlyPrice: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Annual ₹
                    </label>
                    <input
                      type="number"
                      required
                      value={planFormData.annualPrice}
                      onChange={(e) => setPlanFormData({ ...planFormData, annualPrice: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Sessions/Wk
                    </label>
                    <input
                      type="number"
                      value={planFormData.deliveryDays}
                      onChange={(e) => setPlanFormData({ ...planFormData, deliveryDays: e.target.value })}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Included Features (One per line)
                  </label>
                  <textarea
                    value={planFormData.featuresText}
                    onChange={(e) => setPlanFormData({ ...planFormData, featuresText: e.target.value })}
                    rows={3}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div className="flex gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowPlanModal(false)}
                    className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#009688] hover:bg-[#00796B] text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg shadow-teal-700/20 transition-all cursor-pointer"
                  >
                    Save Tier
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= DELETE PLAN CONFIRMATION DIALOG ================= */}
      <AnimatePresence>
        {planToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
              onClick={() => !isDeletingPlan && setPlanToDelete(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 z-10 overflow-hidden"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <Trash2 size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">Delete Tier Plan</h3>
                  <p className="text-xs text-slate-500">Are you sure you want to remove "{planToDelete.name}"?</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 mb-6">
                Existing active subscribers on this tier will retain their benefits, but new trainees will no longer be able to select it.
              </p>
              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  disabled={isDeletingPlan}
                  onClick={() => setPlanToDelete(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeletingPlan}
                  onClick={handleConfirmDeletePlan}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isDeletingPlan ? 'Deleting...' : 'Delete Plan'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
