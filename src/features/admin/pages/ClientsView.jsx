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
  AlertCircle,
  Trash2,
  Edit3,
  UserX,
  CreditCard,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { trainerApi } from '../../../services/trainerApi';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const AVAILABLE_PLANS = [
  'Strength & Conditioning Tier',
  'Elite Transformation 1-on-1',
  'Flex Mobility & Rehab Pass',
  '3-Month 1-on-1 Transformation',
  'Monthly 1-on-1 Coaching',
  'Bi-Weekly Check-in Plan',
  'Total Wellness Monthly',
];


// Real client activity logs
const DEFAULT_CLIENT_ACTIVITIES = {};

export default function ClientsView({ onNavigateToMemberships }) {
  const [clients, setClients] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending_trainer' | 'memberships' | 'active' | 'expired'
  const [selectedClient, setSelectedClient] = useState(null);
  const [activities, setActivities] = useState(DEFAULT_CLIENT_ACTIVITIES);
  const [newActivityNote, setNewActivityNote] = useState('');
  const [newActivityTitle, setNewActivityTitle] = useState('');

  // Modals & Action States
  const [deleteConfirmClient, setDeleteConfirmClient] = useState(null);
  const [cancelSubConfirmClient, setCancelSubConfirmClient] = useState(null);
  const [editingClient, setEditingClient] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', email: '', phone: '', goal: '', assignedCoach: '' });
  const [editingMembership, setEditingMembership] = useState(null);
  const [membershipFormData, setMembershipFormData] = useState({ plan: '', subscriptionStatus: 'Active', renewalDate: '', assignedCoach: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [addFormData, setAddFormData] = useState({
    name: '',
    email: '',
    phone: '',
    goal: 'Weight Loss & Hypertrophy',
    plan: 'Strength & Conditioning Tier',
    subscriptionStatus: 'Active',
    renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    assignedCoach: '',
  });

  // Delete Subscriber completely
  const handleDeleteClient = async (client) => {
    try {
      trainerApi.removeClient(client.id);
      try {
        await axios.delete(`${API_BASE}/admin/subscribers/${client.id || client.email}`);
      } catch (err) {
        // local fallback
      }
      if (selectedClient && selectedClient.id === client.id) {
        setSelectedClient(null);
      }
      setDeleteConfirmClient(null);
      loadClientsData();
      toast.success(`Subscriber "${client.name}" removed from platform.`);
    } catch (e) {
      toast.error('Failed to remove subscriber');
    }
  };

  // Remove / Cancel Subscription
  const handleCancelSubscription = async (client) => {
    try {
      trainerApi.removeClientSubscription(client.id);
      try {
        await axios.delete(`${API_BASE}/admin/subscriptions/${client.id || client.email}`);
      } catch (err) {
        // local fallback
      }
      if (selectedClient && selectedClient.id === client.id) {
        setSelectedClient((prev) => ({
          ...prev,
          plan: 'No Active Subscription',
          subscriptionStatus: 'Cancelled',
          status: 'Cancelled',
          renewalDate: 'N/A',
        }));
      }
      setCancelSubConfirmClient(null);
      loadClientsData();
      toast.success(`Subscription removed for "${client.name}".`);
    } catch (e) {
      toast.error('Failed to remove subscription');
    }
  };

  // Open Edit Profile Modal
  const handleOpenEditProfile = (client) => {
    setEditingClient(client);
    setEditFormData({
      name: client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      goal: client.goal || '',
      assignedCoach: (client.assignedCoach && client.assignedCoach !== 'Vikram Rajput' && client.assignedCoach !== 'Unassigned') ? client.assignedCoach : '',
    });
  };

  // Save Edit Profile
  const handleSaveEditProfile = (e) => {
    e.preventDefault();
    if (!editingClient) return;
    const matchCoach = coaches.find((c) => c.name === editFormData.assignedCoach);
    const updatedClientData = {
      ...editFormData,
      assignedCoachId: matchCoach?.id || matchCoach?._id || '',
    };
    trainerApi.updateClient(editingClient.id, updatedClientData);
    if (selectedClient && selectedClient.id === editingClient.id) {
      setSelectedClient((prev) => ({ ...prev, ...updatedClientData }));
    }

    if (editFormData.assignedCoach && editFormData.assignedCoach !== 'Unassigned') {
      trainerApi.assignCoachToTarget({
        assignmentType: 'client',
        targetId: editingClient.id,
        targetName: editFormData.name || editingClient.name,
        targetEmail: editFormData.email || editingClient.email,
        targetPhone: editFormData.phone || editingClient.phone,
        targetGoal: editFormData.goal || editingClient.goal,
        plan: editingClient.plan,
        totalSessions: editingClient.totalSessions || 12,
        coachName: editFormData.assignedCoach,
        coachId: matchCoach?.id || matchCoach?._id || '',
        adminNotes: 'Assigned via Profile Edit in Admin Panel',
      });

      if (editingClient.plan && editingClient.plan !== 'No Active Subscription') {
        trainerApi.syncClientToMembership({
          ...editingClient,
          ...updatedClientData,
        });
        toast.success(`🎉 ${editFormData.name} assigned to Coach ${editFormData.assignedCoach} and shifted to Memberships section!`);
      } else {
        toast.success('Client profile updated successfully!');
      }
    } else {
      toast.success('Client profile updated successfully!');
    }

    setEditingClient(null);
    loadClientsData();
  };

  // Open Edit Membership Modal
  const handleOpenEditMembership = (client) => {
    setEditingMembership(client);
    setMembershipFormData({
      plan: client.plan || AVAILABLE_PLANS[0],
      subscriptionStatus: client.subscriptionStatus || 'Active',
      renewalDate: client.renewalDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      assignedCoach: (client.assignedCoach && client.assignedCoach !== 'Unassigned' && client.assignedCoach !== 'Vikram Rajput') ? client.assignedCoach : '',
    });
  };

  // Save Edit Membership
  const handleSaveMembership = (e) => {
    e.preventDefault();
    if (!editingMembership) return;
    const matchCoach = coaches.find((c) => c.name === membershipFormData.assignedCoach);
    const updated = {
      plan: membershipFormData.plan,
      subscriptionStatus: membershipFormData.subscriptionStatus,
      status: membershipFormData.subscriptionStatus,
      renewalDate: membershipFormData.renewalDate,
      assignedCoach: membershipFormData.assignedCoach || '',
      assignedCoachId: matchCoach?.id || matchCoach?._id || '',
    };
    trainerApi.updateClient(editingMembership.id, updated);

    if (membershipFormData.assignedCoach && membershipFormData.assignedCoach !== 'Unassigned') {
      trainerApi.assignCoachToTarget({
        assignmentType: 'client',
        targetId: editingMembership.id,
        targetName: editingMembership.name,
        targetEmail: editingMembership.email,
        targetPhone: editingMembership.phone,
        targetGoal: editingMembership.goal,
        plan: membershipFormData.plan,
        totalSessions: editingMembership.totalSessions || 12,
        coachName: membershipFormData.assignedCoach,
        coachId: matchCoach?.id || matchCoach?._id || '',
        adminNotes: 'Assigned via Membership in Admin Panel',
      });
    }

    if (membershipFormData.assignedCoach && membershipFormData.assignedCoach !== 'Unassigned' && membershipFormData.plan && membershipFormData.plan !== 'No Active Subscription') {
      trainerApi.syncClientToMembership({ ...editingMembership, ...updated });
      toast.success(`🎉 ${editingMembership.name} shifted to the Memberships section!`);
    } else {
      toast.success('Membership & subscription updated!');
    }

    if (selectedClient && selectedClient.id === editingMembership.id) {
      setSelectedClient((prev) => ({
        ...prev,
        ...updated,
      }));
    }
    setEditingMembership(null);
    loadClientsData();
  };

  // Create New Subscriber
  const handleCreateClient = (e) => {
    e.preventDefault();
    if (!addFormData.name.trim()) {
      toast.error('Client name is required');
      return;
    }
    const created = trainerApi.addClient(addFormData);

    if (addFormData.assignedCoach && addFormData.assignedCoach !== 'Unassigned') {
      const matchCoach = coaches.find((c) => c.name === addFormData.assignedCoach);
      trainerApi.assignCoachToTarget({
        assignmentType: 'client',
        targetId: created?.id || `cli_${Date.now()}`,
        targetName: addFormData.name,
        targetEmail: addFormData.email,
        targetPhone: addFormData.phone,
        targetGoal: addFormData.goal,
        plan: addFormData.plan,
        totalSessions: 12,
        coachName: addFormData.assignedCoach,
        coachId: matchCoach?.id || matchCoach?._id || '',
        adminNotes: 'New Subscriber created by Admin',
      });
    }

    setShowAddModal(false);
    setAddFormData({
      name: '',
      email: '',
      phone: '',
      goal: 'General Fitness',
      plan: 'Strength & Conditioning Tier',
      subscriptionStatus: 'Active',
      renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      assignedCoach: '',
    });
    loadClientsData();
    toast.success(`New subscriber "${addFormData.name}" added successfully!`);
  };


  // Load clients & approved coaches
  const loadClientsData = () => {
    try {
      const data = trainerApi.getClients();
      const enriched = (Array.isArray(data) ? data : []).map((c) => {
        const createdTime = c.createdAt ? new Date(c.createdAt).getTime() : Date.now();
        const fallbackRenewal = new Date(createdTime + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const isFakePhone = c.phone && (c.phone.startsWith('+91 98765 1') || c.phone === '+91 98765 43210');

        const clientObj = {
          ...c,
          phone: isFakePhone ? '' : (c.phone || ''),
          subscriptionStatus: c.subscriptionStatus || (c.status === 'Active' ? 'Active' : 'Active'),
          renewalDate: (c.renewalDate && c.renewalDate !== '2026-05-15') ? c.renewalDate : fallbackRenewal,
          assignedCoach: (c.assignedCoach && c.assignedCoach !== 'Vikram Rajput' && c.assignedCoach !== 'Unassigned') ? c.assignedCoach : '',
          assignedCoachId: (c.assignedCoachId && c.assignedCoachId !== 'trn_demo_101') ? c.assignedCoachId : '',
        };

        if (clientObj.assignedCoach && clientObj.plan && clientObj.plan !== 'No Active Subscription') {
          trainerApi.syncClientToMembership(clientObj);
        }

        return clientObj;
      });
      setClients(enriched);
    } catch (e) {
      console.error('Failed to load clients:', e);
    }
  };

  useEffect(() => {
    loadClientsData();
    trainerApi.syncConvertedInquiriesFromBackend().then(() => {
      loadClientsData();
    });

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

    const handleUpdate = () => {
      loadClientsData();
    };

    window.addEventListener('wellwigen_clients_updated', handleUpdate);
    return () => window.removeEventListener('wellwigen_clients_updated', handleUpdate);
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

      const isAssigned = c.assignedCoach && c.assignedCoach !== 'Unassigned' && c.assignedCoach.trim() !== '';
      const hasPlan = c.plan && c.plan !== 'No Active Subscription' && c.plan.trim() !== '';
      const isInMembership = isAssigned && hasPlan;

      let matchStatus = true;
      if (statusFilter === 'pending_trainer') {
        matchStatus = !isAssigned || !hasPlan;
      } else if (statusFilter === 'memberships') {
        matchStatus = isInMembership;
      } else if (statusFilter !== 'all') {
        matchStatus = c.subscriptionStatus?.toLowerCase() === statusFilter.toLowerCase();
      }

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
    const coachNameClean = newCoachName === 'Unassigned' ? '' : newCoachName;
    const coachIdClean = newCoachName === 'Unassigned' ? '' : newCoachId;
    trainerApi.updateClient(clientId, {
      assignedCoach: coachNameClean,
      assignedCoachId: coachIdClean,
    });
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === clientId) {
          const updated = {
            ...c,
            assignedCoach: coachNameClean,
            assignedCoachId: coachIdClean,
          };
          if (coachNameClean && c.plan && c.plan !== 'No Active Subscription') {
            trainerApi.syncClientToMembership(updated);
            toast.success(`🎉 ${c.name} assigned to Coach ${coachNameClean} and shifted to Memberships section!`);
          }
          return updated;
        }
        return c;
      })
    );
    if (selectedClient && selectedClient.id === clientId) {
      setSelectedClient((prev) => ({
        ...prev,
        assignedCoach: coachNameClean,
        assignedCoachId: coachIdClean,
      }));
    }

    if (coachNameClean) {
      const targetClient = clients.find((c) => c.id === clientId) || selectedClient;
      if (targetClient) {
        trainerApi.assignCoachToTarget({
          assignmentType: 'client',
          targetId: targetClient.id,
          targetName: targetClient.name,
          targetEmail: targetClient.email,
          targetPhone: targetClient.phone,
          targetGoal: targetClient.goal,
          plan: targetClient.plan,
          totalSessions: targetClient.totalSessions || 12,
          coachName: coachNameClean,
          coachId: coachIdClean,
          adminNotes: `Reassigned by Admin to Coach ${coachNameClean}`,
        });
      }
    } else {
      toast.success('Coach status set to Unassigned');
    }
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

        {/* Actions: Search & Add Subscriber */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search trainee, coach, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 shadow-xs placeholder:text-slate-400 font-medium"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-[#009688] hover:bg-[#00796B] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Subscriber</span>
          </button>
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
          <p className="text-[11px] text-slate-400 mt-1">Up to date on memberships</p>
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
            {[
              { id: 'all', label: 'All Clients' },
              { id: 'pending_trainer', label: 'Needs Trainer' },
              { id: 'memberships', label: 'In Memberships' },
              { id: 'active', label: 'Active' },
              { id: 'expired', label: 'Expired' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === tab.id
                    ? 'bg-[#009688] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
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
                    {client.avatar ? (
                      <img
                        src={client.avatar}
                        alt={client.name}
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100 shadow-xs"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white font-extrabold text-base flex items-center justify-center ring-2 ring-slate-100 shadow-xs">
                        {client.name ? client.name.charAt(0).toUpperCase() : 'C'}
                      </div>
                    )}
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
                      <span>{client.goal || 'General Fitness'}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {client.assignedCoach ? (
                        <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Dumbbell size={11} className="text-teal-600" />
                          Coach: {client.assignedCoach}
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Dumbbell size={11} className="text-amber-500" />
                          Coach: Unassigned
                        </span>
                      )}
                      {client.plan && (
                        <span className="text-[10px] text-teal-700 font-semibold">
                          {client.plan}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* [COMMENTED OUT PER REQUEST] Sessions Progress Bar
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
                  */}

                  {/* Right: Next Session & Action */}
                  {/* Right: Actions */}
                  <div className="flex items-center justify-between lg:justify-end gap-2 shrink-0">
                    {/* Shifted to Memberships badge/link OR Assign Trainer prompt */}
                    {client.assignedCoach && client.assignedCoach !== 'Unassigned' && client.plan && client.plan !== 'No Active Subscription' ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onNavigateToMemberships) onNavigateToMemberships();
                        }}
                        title="Shifted to Memberships - Click to view in Memberships section"
                        className="px-2.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <CheckCircle2 size={13} className="text-teal-600" />
                        <span className="hidden sm:inline">In Memberships</span>
                        <ArrowRight size={11} className="text-teal-500" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditProfile(client);
                        }}
                        title="Assign Trainer & Enroll to shift this trainee to Memberships"
                        className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-800 border border-amber-300 font-bold text-xs transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                      >
                        <UserCheck size={13} className="text-amber-600" />
                        <span className="hidden sm:inline">Assign Trainer</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEditMembership(client);
                      }}
                      title="Manage / Change Membership Plan & Coach"
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <CreditCard size={13} />
                      <span className="hidden sm:inline">Membership</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCancelSubConfirmClient(client);
                      }}
                      title="Cancel / Remove Subscription"
                      disabled={client.subscriptionStatus === 'Cancelled'}
                      className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 disabled:opacity-40 font-bold text-xs transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <UserX size={14} />
                      <span className="hidden md:inline text-[11px]">Remove Sub</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmClient(client);
                      }}
                      title="Delete Subscriber Permanently"
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-all cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>

                    <button
                      type="button"
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
                  {selectedClient.avatar ? (
                    <img
                      src={selectedClient.avatar}
                      alt={selectedClient.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white font-extrabold text-lg flex items-center justify-center ring-2 ring-slate-200 shadow-xs">
                      {selectedClient.name ? selectedClient.name.charAt(0).toUpperCase() : 'C'}
                    </div>
                  )}
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
                      {selectedClient.phone && (
                        <span className="text-xs text-slate-500 font-medium">
                          • {selectedClient.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEditProfile(selectedClient)}
                    className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer border border-slate-200"
                    title="Edit Profile"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedClient(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
                {/* 1. Subscription & Package */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Subscription & Membership Status
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-teal-50 text-teal-700 border border-teal-200">
                      Tier Info
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-400 block mb-0.5">Active Package</span>
                      <span className="font-bold text-slate-900 text-sm">{selectedClient.plan}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-0.5">Renewal Date</span>
                      <span className="font-bold text-slate-900">{selectedClient.renewalDate}</span>
                    </div>
                  </div>

                  {/* Admin Membership Actions */}
                  <div className="pt-2 border-t border-slate-200/70 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditMembership(selectedClient)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <CreditCard size={13} />
                      <span>Change Plan / Status</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCancelSubConfirmClient(selectedClient)}
                      disabled={selectedClient.subscriptionStatus === 'Cancelled'}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-all disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
                    >
                      <UserX size={13} />
                      <span>Remove Subscription</span>
                    </button>
                  </div>
                </div>

                {/* 2. Assigned Coach Management */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Assigned Fitness Coach
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selectedClient.assignedCoach ? 'text-teal-700 bg-teal-50' : 'text-amber-700 bg-amber-50'
                    }`}>
                      {selectedClient.assignedCoach ? '1-on-1 Assigned' : 'Unassigned'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                        <Dumbbell size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-xs">
                          {selectedClient.assignedCoach || 'Unassigned (No Coach)'}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {selectedClient.assignedCoach ? 'Assigned Coach' : 'Awaiting Coach Assignment'}
                        </p>
                      </div>
                    </div>

                    {/* Reassign Selector */}
                    <select
                      value={selectedClient.assignedCoach || ''}
                      onChange={(e) => {
                        const newName = e.target.value;
                        const match = coaches.find((c) => c.name === newName);
                        handleReassignCoach(selectedClient.id, newName, match?.id || match?._id || '');
                      }}
                      className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
                    >
                      <option value="">Unassigned (No Coach)</option>
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
                {/* 5. Danger Zone: Remove Subscriber */}
                <div className="p-4 bg-rose-50/70 border border-rose-200/90 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                    <Trash2 size={15} />
                    <span>Danger Zone — Subscriber Deletion</span>
                  </div>
                  <p className="text-[11px] text-rose-700/80">
                    Completely remove this trainee, their subscription profile, and all session activity records from the platform.
                  </p>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmClient(selectedClient)}
                    className="w-full mt-2 py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Trash2 size={14} />
                    <span>Delete Subscriber Completely</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL 1: DELETE SUBSCRIBER CONFIRMATION ================= */}
      <AnimatePresence>
        {deleteConfirmClient && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmClient(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-100 z-10 space-y-5"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <Trash2 size={24} />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-black text-slate-900">Remove Subscriber?</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Are you sure you want to remove <span className="font-bold text-slate-900">{deleteConfirmClient.name}</span> ({deleteConfirmClient.email})? This action will permanently delete their account and associated subscriptions.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirmClient(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteClient(deleteConfirmClient)}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Trash2 size={14} />
                  <span>Yes, Delete</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL 2: CANCEL SUBSCRIPTION CONFIRMATION ================= */}
      <AnimatePresence>
        {cancelSubConfirmClient && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCancelSubConfirmClient(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-slate-100 z-10 space-y-5"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <UserX size={24} />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-black text-slate-900">Remove Active Subscription?</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Revoke active subscription package for <span className="font-bold text-slate-900">{cancelSubConfirmClient.name}</span>. Their tier will be set to <span className="font-semibold text-rose-600">"Cancelled / No Active Subscription"</span>.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCancelSubConfirmClient(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-all cursor-pointer"
                >
                  Keep Subscription
                </button>
                <button
                  type="button"
                  onClick={() => handleCancelSubscription(cancelSubConfirmClient)}
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <UserX size={14} />
                  <span>Confirm Removal</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL 3: MODIFY MEMBERSHIP ================= */}
      <AnimatePresence>
        {editingMembership && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingMembership(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-100 z-10 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Manage Membership</h3>
                    <p className="text-[11px] text-slate-400">Subscriber: {editingMembership.name}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingMembership(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveMembership} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Assigned Membership Tier / Plan
                  </label>
                  <select
                    value={membershipFormData.plan}
                    onChange={(e) => setMembershipFormData({ ...membershipFormData, plan: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  >
                    {AVAILABLE_PLANS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                    <option value="No Active Subscription">No Active Subscription</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Membership Status
                    </label>
                    <select
                      value={membershipFormData.subscriptionStatus}
                      onChange={(e) => setMembershipFormData({ ...membershipFormData, subscriptionStatus: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    >
                      <option value="Active">Active</option>
                      <option value="Trial">Trial</option>
                      <option value="Expired">Expired</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Renewal Date
                    </label>
                    <input
                      type="date"
                      value={membershipFormData.renewalDate}
                      onChange={(e) => setMembershipFormData({ ...membershipFormData, renewalDate: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="flex gap-2.5 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingMembership(null)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#009688] hover:bg-[#00796B] text-white font-bold cursor-pointer shadow-xs"
                  >
                    Save Membership
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL 4: EDIT CLIENT PROFILE ================= */}
      <AnimatePresence>
        {editingClient && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingClient(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-100 z-10 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                    <Edit3 size={18} />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">Edit Client Profile</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingClient(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveEditProfile} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Client Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={editFormData.phone}
                      onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Primary Fitness Goal
                  </label>
                  <input
                    type="text"
                    value={editFormData.goal}
                    onChange={(e) => setEditFormData({ ...editFormData, goal: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Assigned Coach
                  </label>
                  <select
                    value={editFormData.assignedCoach || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, assignedCoach: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  >
                    <option value="">Unassigned (No Coach)</option>
                    {coaches.map((c) => (
                      <option key={c.id || c._id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingClient(null)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#009688] hover:bg-[#00796B] text-white font-bold cursor-pointer shadow-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL 5: ADD NEW SUBSCRIBER ================= */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-100 z-10 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                    <Plus size={18} />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">Add New Subscriber</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateClient} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={addFormData.name}
                    onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="client@example.com"
                      value={addFormData.email}
                      onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. +91 98234 56789"
                      value={addFormData.phone}
                      onChange={(e) => setAddFormData({ ...addFormData, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Target Fitness Goal
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Weight Loss, Muscle Building"
                    value={addFormData.goal}
                    onChange={(e) => setAddFormData({ ...addFormData, goal: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Membership Plan
                    </label>
                    <select
                      value={addFormData.plan}
                      onChange={(e) => setAddFormData({ ...addFormData, plan: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    >
                      {AVAILABLE_PLANS.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Assigned Coach
                    </label>
                    <select
                      value={addFormData.assignedCoach || ''}
                      onChange={(e) => setAddFormData({ ...addFormData, assignedCoach: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    >
                      <option value="">Unassigned (No Coach)</option>
                      {coaches.map((c) => (
                        <option key={c.id || c._id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#009688] hover:bg-[#00796B] text-white font-bold cursor-pointer shadow-xs"
                  >
                    Add Subscriber
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

