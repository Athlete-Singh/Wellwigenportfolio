import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// OLD CODE (commented by AI)
/*
import { 
  Users, 
  Activity, 
  ShieldCheck, 
  Zap, 
  ArrowUpRight,
  UserPlus,
  Clock,
  ExternalLink,
  Search,
  Filter,
  MoreHorizontal,
  ChevronRight,
  BarChart3,
  Globe,
  Database,
  Settings,
  Menu,
  CloseIcon,
  LayoutDashboard,
  ShoppingBag,
  Calendar,
  FileText,
  Building2,
  Bell,
  MessageSquare,
  Heart,
  Droplets,
  FlaskConical,
  Sparkles,
  MapPin,
  CheckCircle2,
  XCircle,
  Pencil,

  Trash2,
  Power,
  Ticket,
  Plus,
  ArrowLeft
} from 'lucide-react';
import { subscriptionPlanService } from '../../subscription/services/subscriptionPlanService';

import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import useAppStore from '../../../store/useAppStore';
import * as mapService from '../../../services/mapService';
import { db } from '../../../config/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
*/

// NEW CODE - Wellwigen restyle / Inquiries feature
import { 
  Users, 
  Activity, 
  ShieldCheck, 
  Zap, 
  ArrowUpRight,
  UserPlus,
  Clock,
  ExternalLink,
  Search,
  Filter,
  MoreHorizontal,
  ChevronRight,
  BarChart3,
  Globe,
  Database,
  Settings,
  Menu,
  X as CloseIcon,
  LayoutDashboard,
  ShoppingBag,
  Calendar,
  FileText,
  Building2,
  Bell,
  MessageSquare,
  Heart,
  Droplets,
  FlaskConical,
  Sparkles,
  MapPin,
  CheckCircle2,
  XCircle,
  Pencil,
  Trash2,
  Power,
  Ticket,
  Plus,
  ArrowLeft,
  Inbox
} from 'lucide-react';
import { subscriptionPlanService } from '../../subscription/services/subscriptionPlanService';
import InquiriesView from './InquiriesView';

import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import useAppStore from '../../../store/useAppStore';
import * as mapService from '../../../services/mapService';
import { db } from '../../../config/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Dummy Data
const APPOINTMENTS = [
  { id: 'APT-001', patient: 'Rajesh Kumar', doctor: 'Dr. Sarah Jenkins', date: '2026-05-10', time: '10:00 AM', status: 'Confirmed' },
  { id: 'APT-002', patient: 'Ananya Sharma', doctor: 'Dr. Julianne Smith', date: '2026-05-10', time: '11:30 AM', status: 'Pending' },
  { id: 'APT-003', patient: 'Vikram Singh', doctor: 'Dr. Michael Chen', date: '2026-05-11', time: '02:00 PM', status: 'Confirmed' },
  { id: 'APT-004', patient: 'Priya Verma', doctor: 'Dr. Sarah Jenkins', date: '2026-05-11', time: '04:30 PM', status: 'Cancelled' },
];

const RECORDS = [
  { id: 'REC-9921', patient: 'Rajesh Kumar', type: 'Blood Test', date: '2026-05-01', laboratory: 'Apollo Diagnostics' },
  { id: 'REC-9922', patient: 'Ananya Sharma', type: 'X-Ray Chest', date: '2026-04-28', laboratory: 'General Imaging' },
  { id: 'REC-9923', patient: 'Suresh Raina', type: 'MRI Scan', date: '2026-04-25', laboratory: 'City Scan Center' },
];

const VENDORS = [
  { id: 'VEN-001', name: 'Wellness Pharmacy', type: 'Pharmacy', status: 'Active', contact: 'Mr. Gupta' },
  { id: 'VEN-002', name: 'Precision Labs', type: 'Laboratory', status: 'Pending', contact: 'Ms. Reddy' },
  { id: 'VEN-003', name: 'MedEquip Inc', type: 'Equipment', status: 'Active', contact: 'Mr. Wilson' },
];

const MOCK_PENDING = [
  { _id: 'mock-1', businessName: 'City Pharma', licenseNumber: 'LIC-2026-001', type: 'Pharmacy', ownerName: 'Amit Shah', email: 'amit@citypharma.com', phone: '+91 98765 43210', verificationStatus: 'pending' },
  { _id: 'mock-2', businessName: 'Stellar Diagnostics', licenseNumber: 'LIC-2026-002', type: 'Laboratory', ownerName: 'Dr. Neha Kapoor', email: 'neha@stellar.com', phone: '+91 87654 32109', verificationStatus: 'pending' },
];

const MOCK_ACTIVE = [
  { _id: 'mock-3', businessName: 'Global Meds', licenseNumber: 'LIC-2025-998', type: 'Pharmacy', ownerName: 'John Doe', email: 'john@globalmeds.com', phone: '+91 76543 21098', verificationStatus: 'approved' },
  { _id: 'mock-4', businessName: 'Precision Pathology', licenseNumber: 'LIC-2025-999', type: 'Laboratory', ownerName: 'Sarah Smith', email: 'sarah@precision.com', phone: '+91 65432 10987', verificationStatus: 'approved' },
];





// OLD CODE (commented by AI)
/*
const AdminNavItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
      active 
        ? 'bg-[#eef2ff] text-blue-700' 
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    {icon}
    {label}
  </button>
);

const MetricCard = ({ title, value, unit, icon, trend, trendValue, status }) => (
  <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
    <div className={`absolute -right-2 -top-2 w-16 h-16 bg-slate-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity`}></div>
    
    <div className="flex justify-between items-start mb-6">
      <div className="p-2.5 bg-slate-50 text-slate-400 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-md uppercase tracking-widest ${
        trend === 'up' ? 'text-emerald-500 bg-emerald-50' : 
        trend === 'down' ? 'text-rose-500 bg-rose-50' : 'text-slate-500 bg-slate-50'
      }`}>
        {trendValue}
      </span>
    </div>
    
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <div className="flex items-baseline gap-2">
        <h4 className="text-2xl font-semibold text-slate-900 tracking-tighter">{value}</h4>
        <span className="text-sm font-semibold text-slate-400 uppercase">{unit}</span>
      </div>
    </div>
  </div>
);
*/

// NEW CODE - Wellwigen restyle / Inquiries feature
const AdminNavItem = ({ icon, label, active, onClick, badge }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
      active 
        ? 'bg-gradient-to-r from-teal-500/10 to-sky-500/10 text-teal-800 border-l-4 border-teal-500 shadow-sm font-bold pl-3' 
        : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
    }`}
  >
    <div className="flex items-center gap-3">
      <span className={active ? 'text-teal-600' : 'text-slate-500'}>{icon}</span>
      <span>{label}</span>
    </div>
    {badge > 0 && (
      <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-[#F26B38] text-white shadow-xs animate-pulse">
        {badge}
      </span>
    )}
  </button>
);

const MetricCard = ({ title, value, unit, icon, trend, trendValue, highlight = false, onClick }) => (
  <div 
    onClick={onClick}
    className={`p-6 bg-white border rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 group relative ${
      onClick ? 'cursor-pointer' : ''
    } ${
      highlight 
        ? 'border-teal-200 bg-gradient-to-br from-white via-teal-50/20 to-sky-50/30 ring-1 ring-teal-500/10' 
        : 'border-slate-100'
    }`}
  >
    <div className="flex justify-between items-start mb-5 relative z-10">
      <div className={`p-3 rounded-xl transition-all duration-300 ${
        highlight 
          ? 'bg-teal-50 text-teal-600 group-hover:bg-gradient-to-tr group-hover:from-teal-500 group-hover:to-sky-600 group-hover:text-white' 
          : 'bg-slate-50 text-slate-500 group-hover:bg-gradient-to-tr group-hover:from-teal-500 group-hover:to-sky-600 group-hover:text-white'
      }`}>
        {icon}
      </div>
      {/* FIXED: Removed the overlapping decorative circle that cut off 'STABLE' to 'STAL...'. Added relative z-10, whitespace-nowrap and clean spacing */}
      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider whitespace-nowrap shrink-0 relative z-10 ${
        trend === 'up' ? 'text-emerald-700 bg-emerald-50 border border-emerald-100' : 
        trend === 'down' ? 'text-rose-700 bg-rose-50 border border-rose-100' : 
        trend === 'stable' ? 'text-blue-700 bg-blue-50 border border-blue-100' :
        'text-slate-600 bg-slate-100'
      }`}>
        {trendValue}
      </span>
    </div>
    
    <div className="relative z-10">
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{title}</p>
      <div className="flex items-baseline gap-2">
        <h4 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">{value}</h4>
        {unit && <span className="text-xs font-bold text-slate-400 uppercase">{unit}</span>}
      </div>
    </div>
  </div>
);

const FacilityCard = ({ title, status, icon, statusColor }) => (
  <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-all group relative">
    <div className="flex justify-between items-center mb-4">
      <div className="p-2 bg-slate-50 text-slate-400 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
        {icon}
      </div>
      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-widest border ${statusColor}`}>
        {status}
      </span>
    </div>
    <h4 className="text-sm font-bold text-slate-900">{title}</h4>
  </div>
);

const DataTable = ({ title, columns, data }) => (
  <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">{title}</h3>
      <button className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline">Export CSV</button>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50">
            {columns.map((col, idx) => (
              <th key={idx} className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-slate-50 transition-colors">
              {Object.values(row).map((val, i) => (
                <td key={i} className="px-6 py-4 text-sm text-slate-600 font-medium">
                  {val === 'Confirmed' || val === 'Active' || val === 'Verified' ? (
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-[10px] font-bold uppercase">{val}</span>
                  ) : val === 'Pending' ? (
                    <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded text-[10px] font-bold uppercase">{val}</span>
                  ) : val === 'Cancelled' ? (
                    <span className="px-2 py-1 bg-rose-50 text-rose-600 rounded text-[10px] font-bold uppercase">{val}</span>
                  ) : val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);


// OLD CODE (commented by AI)
/*
const AdminDashboard = () => {
  console.log("🛡️ ADMIN_DASHBOARD_RENDER_TRIGGERED");
  const navigate = useNavigate();
  const user = useAppStore((state) => state.auth.user);
  const logout = useAppStore((state) => state.logout);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
*/

// NEW CODE - Wellwigen restyle / Inquiries feature
const AdminDashboard = ({ initialTab = 'Dashboard' }) => {
  console.log("🛡️ ADMIN_DASHBOARD_RENDER_TRIGGERED");
  const navigate = useNavigate();
  const user = useAppStore((state) => state.auth.user);
  const logout = useAppStore((state) => state.logout);
  
  // OLD CODE (commented by AI)
  /*
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [newInquiriesCount, setNewInquiriesCount] = useState(0);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const fetchInquiriesCount = async () => {
    try {
      const res = await axios.get(`${API_URL}/inquiries?limit=1`);
      if (res.data?.success && res.data?.stats) {
        setNewInquiriesCount(res.data.stats.new || 0);
      }
    } catch (err) {
      // Graceful fallback
    }
  };

  useEffect(() => {
    fetchInquiriesCount();
    const interval = setInterval(fetchInquiriesCount, 30000);
    return () => clearInterval(interval);
  }, []);
  */

  // NEW CODE - Wellwigen notifications and smooth tabs state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [newInquiriesCount, setNewInquiriesCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const fetchInquiriesCount = async () => {
    try {
      const res = await axios.get(`${API_URL}/inquiries?limit=6`);
      if (res.data?.success) {
        if (res.data.stats) {
          setNewInquiriesCount(res.data.stats.new || 0);
        }
        if (Array.isArray(res.data.data)) {
          setNotifications(res.data.data);
        }
      }
    } catch (err) {
      // Graceful fallback
    }
  };

  useEffect(() => {
    fetchInquiriesCount();
    const interval = setInterval(fetchInquiriesCount, 15000);
    return () => clearInterval(interval);
  }, []);
  const [vendorTab, setVendorTab] = useState('Pending');
  const [pendingVendors, setPendingVendors] = useState(MOCK_PENDING);
  const [activeVendors, setActiveVendors] = useState(MOCK_ACTIVE);
  const [isLoadingVendors, setIsLoadingVendors] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [locationData, setLocationData] = useState(null);

  // Subscription State
  const [plans, setPlans] = useState([]);
  const [isSubLoading, setIsSubLoading] = useState(true);
  const [showSubModal, setShowSubModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [subFormData, setSubFormData] = useState({
    name: "",
    description: "",
    prices: { monthly: 0, quarterly: 0, annual: 0 },
    features: [""],
    status: "active",
    deliveryDays: 0,
    quantity: 0,
    duration: "1 Month",
    tag: "",
    razorpayPlanIds: { monthly: "", quarterly: "", annual: "" }
  });

  // Contact Messages State
  const [messages, setMessages] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessages = async () => {
    try {
      setIsLoadingMessages(true);
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const msgs = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        let dateStr = 'Recent';
        if (data.createdAt?.toDate) {
          dateStr = data.createdAt.toDate().toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
          });
        } else if (data.submittedAt) {
          dateStr = new Date(data.submittedAt).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
          });
        }
        return {
          id: docSnap.id,
          ...data,
          formattedDate: dateStr,
        };
      });
      setMessages(msgs);
    } catch (err) {
      console.error('Failed to fetch messages from Firestore:', err);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Fetch vendor & message data on mount and when switching to relevant tabs
  useEffect(() => {
    fetchPendingVendors();
    fetchActiveVendors();
    fetchPlans();
    fetchMessages();
  }, []);

  useEffect(() => {
    console.log("🎯 ACTIVE_TAB_CHANGED:", activeTab);
    if (activeTab === 'Vendors') {
      fetchPendingVendors();
      fetchActiveVendors();
    }
    if (activeTab === 'Messages') {
      fetchMessages();
    }
    if (activeTab === 'Dashboard') {
      fetchLocation();
    }
  }, [activeTab]);

  const fetchLocation = async () => {
    try {
      const data = await mapService.getHospitalLocation();
      setLocationData(data);
    } catch (err) {
      console.error("Failed to fetch location:", err);
    }
  };

  useEffect(() => {
    console.log("📂 VENDOR_TAB_CHANGED:", vendorTab);
  }, [vendorTab]);

  const fetchPendingVendors = async () => {
    try {
      setIsLoadingVendors(true);
      const response = await axios.get(`${API_URL}/provider/admin/pending`);
      if (response.data && response.data.success) {
        // Always use real DB data — if empty, show empty (not mocks)
        setPendingVendors(Array.isArray(response.data.data) ? response.data.data : []);
      }
    } catch (err) {
      console.error("Failed to fetch pending vendors, using mock data:", err);
      // Only keep mocks on true network failure
      setPendingVendors(MOCK_PENDING);
    } finally {
      setIsLoadingVendors(false);
    }
  };

  const fetchActiveVendors = async () => {
    try {
      setIsLoadingVendors(true);
      const response = await axios.get(`${API_URL}/provider/admin/active`);
      if (response.data && response.data.success) {
        // Always use real DB data — if empty, show empty (not mocks)
        setActiveVendors(Array.isArray(response.data.data) ? response.data.data : []);
      }
    } catch (err) {
      console.error("Failed to fetch active vendors, using mock data:", err);
      // Only keep mocks on true network failure
      setActiveVendors(MOCK_ACTIVE);
    } finally {
      setIsLoadingVendors(false);
    }
  };

  const handleVendorAction = async (id, status) => {
    const action = status === 'approved' ? 'Approving' : 'Rejecting';
    toast.loading(`${action} application...`, { id: 'admin-action' });
    try {
      await axios.put(`${API_URL}/provider/admin/verify/${id}`, { status });
      toast.success(`Application ${status === 'approved' ? 'Approved' : 'Rejected'}`, { id: 'admin-action' });
      setSelectedVendor(null);
      fetchPendingVendors();
      fetchActiveVendors();
    } catch (err) {
      toast.error("Action failed", { id: 'admin-action' });
    }
  };

  const handleDeleteVendor = async (id, name) => {
    if (!window.confirm(`⚠️ CRITICAL ACTION: Are you sure you want to PERMANENTLY DELETE "${name}"? This action cannot be undone.`)) {
      return;
    }
    
    toast.loading(`Removing ${name}...`, { id: 'admin-delete' });
    try {
      await axios.delete(`${API_URL}/provider/admin/remove/${id}`);
      toast.success(`${name} removed successfully`, { id: 'admin-delete' });
      setSelectedVendor(null);
      fetchPendingVendors();
      fetchActiveVendors();
    } catch (err) {
      toast.error("Deletion failed", { id: 'admin-delete' });
    }
  };

  const fetchPlans = async () => {
    try {
      setIsSubLoading(true);
      const res = await subscriptionPlanService.getAllPlans();
      if (res.success) setPlans(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubLoading(false);
    }
  };

  const handleOpenSubModal = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setSubFormData({ ...plan, features: plan.features.length > 0 ? plan.features : [""] });
    } else {
      setEditingPlan(null);
      setSubFormData({
        name: "", description: "", prices: { monthly: 0, quarterly: 0, annual: 0 },
        features: [""], status: "active", deliveryDays: 0, quantity: 0,
        duration: "1 Month", tag: "", razorpayPlanIds: { monthly: "", quarterly: "", annual: "" }
      });
    }
    setShowSubModal(true);
  };

  const handleSubSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("📤 Submitting Plan Data:", subFormData);
      const res = editingPlan 

        ? await subscriptionPlanService.updatePlan(editingPlan._id, subFormData)
        : await subscriptionPlanService.createPlan(subFormData);
      if (res.success) {
        toast.success(editingPlan ? "Plan updated" : "Plan created");
        setShowSubModal(false);
        fetchPlans();
      } else {
        toast.error(res.message || "Operation failed");
      }

    } catch (err) {
      console.error("Subscription Action Error:", err);
      toast.error(err.message || "Operation failed");
    }

  };

  const handleToggleSubStatus = async (id) => {
    try {
      const res = await subscriptionPlanService.togglePlanStatus(id);
      if (res.success) {
        toast.success(`Plan ${res.data.status}`);
        fetchPlans();
      }
    } catch (err) {
      toast.error(err.message || "Toggle failed");
    }

  };

  const handleDeleteSub = async (id) => {
    if (!window.confirm("Delete this plan?")) return;
    try {
      const res = await subscriptionPlanService.deletePlan(id);
      if (res.success) {
        toast.success("Plan removed");
        fetchPlans();
      }
    } catch (err) {
      toast.error(err.message || "Delete failed");
    }

  };


  const renderContent = () => {
    switch (activeTab) {
      // NEW CODE - Wellwigen Inquiries feature
      case 'Inquiries':
        return <InquiriesView onStatusChange={fetchInquiriesCount} />;
      // OLD CODE (commented by AI)
      /*
      case 'Appointments':
        return (
      */
      // NEW CODE - Preserving Appointments case
      case 'Appointments':
        return (
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Appointments</h1>
              <p className="text-slate-500 text-sm">Manage and schedule patient visits across all departments.</p>
            </div>
            <DataTable 
              title="Recent Bookings" 
              columns={['ID', 'Patient', 'Doctor', 'Date', 'Time', 'Status']} 
              data={APPOINTMENTS} 
            />
          </div>
        );
      case 'Records':
        return (
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Medical Records</h1>
              <p className="text-slate-500 text-sm">Secure access to clinical data and diagnostic reports.</p>
            </div>
            <DataTable 
              title="Patient Records" 
              columns={['ID', 'Patient', 'Type', 'Date', 'Laboratory']} 
              data={RECORDS} 
            />
          </div>
        );
      case 'Facilities':
        return (
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Hospital Facilities</h1>
              <p className="text-slate-500 text-sm">Real-time status and capacity of clinical units.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FacilityCard title="General Medicine" status="OPEN" icon={<Users size={18} />} statusColor="bg-emerald-50 text-emerald-600 border-emerald-100" />
              <FacilityCard title="Cardiology Unit" status="BUSY" icon={<Heart size={18} />} statusColor="bg-rose-50 text-rose-600 border-rose-100" />
              <FacilityCard title="Imaging & Radiology" status="OPEN" icon={<Sparkles size={18} />} statusColor="bg-emerald-50 text-emerald-600 border-emerald-100" />
              <FacilityCard title="Intensive Care" status="AT CAPACITY" icon={<Activity size={18} />} statusColor="bg-rose-50 text-rose-600 border-rose-100" />
              <FacilityCard title="Pharmacy" status="OPEN" icon={<ShoppingBag size={18} />} statusColor="bg-emerald-50 text-emerald-600 border-emerald-100" />
              <FacilityCard title="Laboratory" status="BUSY" icon={<FlaskConical size={18} />} statusColor="bg-rose-50 text-rose-600 border-rose-100" />
            </div>
          </div>
        );
      case 'Vendors':
        return (
          <div className="max-w-7xl mx-auto space-y-10">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">Vendor Management</h1>
                <p className="text-slate-500 text-sm max-w-xl">
                  Review and approve vendor store applications, or manually onboard new partners.
                </p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    fetchPendingVendors();
                    fetchActiveVendors();
                    toast.success("Refreshing vendor data...");
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all"
                >
                  <Activity size={18} />
                  Refresh
                </button>
                <button className="flex items-center gap-2 px-6 py-3 bg-[#009688] hover:bg-[#00796B] text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-900/10 transition-all">
                  <UserPlus size={18} />
                  Manually Add Store
                </button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Active Stores</p>
                  <h4 className="text-3xl font-bold text-slate-900">{activeVendors.length}</h4>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6">
                <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Pending Approvals</p>
                  <h4 className="text-3xl font-bold text-slate-900">{pendingVendors.length}</h4>
                </div>
              </div>

              <div className="bg-[#1e293b] p-8 rounded-2xl shadow-xl relative overflow-hidden flex flex-col justify-center">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full -mr-12 -mt-12 blur-2xl"></div>
                <h4 className="text-lg font-bold text-white mb-1">Expand Your Reach</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Invite local businesses to scale the platform.
                </p>
              </div>
            </div>

            {/* Tabs & Table */}
            <div className="space-y-6">
              <div className="flex gap-8 border-b border-slate-200">
                <button 
                  onClick={() => setVendorTab('Pending')}
                  className={`pb-4 text-sm font-bold transition-all relative ${vendorTab === 'Pending' ? 'text-[#009688]' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Pending Requests
                  {vendorTab === 'Pending' && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#009688] rounded-t-full"></div>}
                </button>
                <button 
                  onClick={() => setVendorTab('Active')}
                  className={`pb-4 text-sm font-bold transition-all relative ${vendorTab === 'Active' ? 'text-[#009688]' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Active Stores
                  {vendorTab === 'Active' && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#009688] rounded-t-full"></div>}
                </button>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm min-h-[400px] flex flex-col">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Store Identity</th>
                      <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Vendor Details</th>
                      <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Contact</th>
                      <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {isLoadingVendors ? (
                      <tr>
                        <td colSpan="5" className="py-20 text-center text-slate-400 text-sm font-medium">Loading applications...</td>
                      </tr>
                    ) : vendorTab === 'Pending' && pendingVendors.length > 0 ? (
                      (() => {
                        const grouped = pendingVendors.reduce((acc, vendor) => {
                          const type = (vendor.type || "VENDOR").toUpperCase();
                          if (!acc[type]) acc[type] = [];
                          acc[type].push(vendor);
                          return acc;
                        }, {});

                        const PROVIDER_CATEGORIES = {
                          DOCTOR: "🩺 Medical Professionals (Doctors)",
                          LAB: "🔬 Diagnostic Laboratories",
                          PHARMACY: "💊 Pharmacies",
                          NUTRITION: "🥗 Nutrition & Diet",
                          TRAINER: "🏋️ Fitness Trainers",
                          VENDOR: "🛒 Retail Vendors"
                        };

                        return Object.entries(grouped).map(([category, list]) => (
                          <React.Fragment key={category}>
                            <tr className="bg-slate-100/70 border-y border-slate-200/80">
                              <td colSpan="5" className="px-8 py-3.5">
                                <div className="flex items-center gap-3">
                                  <span className="text-xs font-black text-[#009688] tracking-widest uppercase">
                                    {PROVIDER_CATEGORIES[category] || `${category}s`}
                                  </span>
                                  <span className="px-2.5 py-0.5 bg-emerald-50 text-[#009688] text-[10px] font-bold rounded-full">
                                    {list.length} pending
                                  </span>
                                </div>
                              </td>
                            </tr>
                            {list.map((vendor) => (
                              <tr key={vendor._id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-8 py-5">
                                  <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs uppercase">
                                      {vendor.businessName.substring(0, 2)}
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-sm font-bold text-slate-900">{vendor.businessName}</span>
                                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{vendor.licenseNumber}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-8 py-5">
                                  <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-slate-700">{vendor.type}</span>
                                    <span className="text-xs text-slate-500">{vendor.ownerName}</span>
                                  </div>
                                </td>
                                <td className="px-8 py-5">
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium text-slate-600">{vendor.email}</span>
                                    <span className="text-[10px] text-slate-400">{vendor.phone}</span>
                                  </div>
                                </td>
                                <td className="px-8 py-5">
                                  <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded text-[10px] font-bold uppercase tracking-widest">Awaiting Review</span>
                                </td>
                                <td className="px-8 py-5">
                                  <div className="flex justify-end">
                                    <button 
                                      onClick={() => setSelectedVendor(vendor)}
                                      className="px-5 py-2 bg-[#009688] hover:bg-[#00796B] text-white rounded-lg text-xs font-bold shadow-md shadow-emerald-900/10 transition-all flex items-center gap-2"
                                    >
                                      Review
                                      <ChevronRight size={14} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </React.Fragment>
                        ));
                      })()
                      ) : vendorTab === 'Active' && activeVendors.length > 0 ? (
                        activeVendors.map((vendor) => (
                          <tr key={vendor._id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 font-bold text-xs uppercase flex items-center justify-center shrink-0">
                                  {vendor.businessName.substring(0, 2)}
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-sm font-bold text-slate-900">{vendor.businessName}</span>
                                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{vendor.licenseNumber}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-slate-700">{vendor.type}</span>
                                <span className="text-xs text-slate-500">{vendor.ownerName}</span>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-600">{vendor.email}</span>
                                <span className="text-[10px] text-slate-400">{vendor.phone}</span>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-[10px] font-bold uppercase tracking-widest">Active</span>
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex justify-end">
                                <button 
                                  onClick={() => setSelectedVendor(vendor)}
                                  className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-white hover:text-slate-900 transition-all"
                                >
                                  View Details
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="py-32 text-center">
                            <div className="flex flex-col items-center gap-4">
                              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                                <ShoppingBag size={32} />
                              </div>
                              <p className="text-slate-400 font-medium text-sm">
                                {vendorTab === 'Pending' ? 'No pending requests at this time.' : 'No active stores available.'}
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Vendor Review Modal */}
            <AnimatePresence>
              {selectedVendor && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
                  >
                    <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                      <div>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-widest mb-2 inline-block">
                          {selectedVendor.verificationStatus === 'approved' ? 'Store Profile' : 'Application Review'}
                        </span>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                          {selectedVendor.verificationStatus === 'approved' ? selectedVendor.businessName : `Review ${selectedVendor.businessName}`}
                        </h2>
                      </div>
                      <button 
                        onClick={() => setSelectedVendor(null)}
                        className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl transition-all"
                      >
                        <CloseIcon size={24} />
                      </button>
                    </div>

                    <div className="p-10 space-y-8">
                      <div className="grid grid-cols-2 gap-10">
                        <div className="space-y-6">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Business Details</p>
                            <h4 className="text-sm font-bold text-slate-900">{selectedVendor.businessName}</h4>
                            <p className="text-xs text-slate-500 font-medium">{selectedVendor.type}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">License Number</p>
                            <h4 className="text-sm font-bold text-slate-900">{selectedVendor.licenseNumber}</h4>
                          </div>
                        </div>
                        <div className="space-y-6">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Owner / Primary Contact</p>
                            <h4 className="text-sm font-bold text-slate-900">{selectedVendor.ownerName}</h4>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Contact Info</p>
                            <p className="text-sm font-medium text-slate-700">{selectedVendor.email}</p>
                            <p className="text-sm font-medium text-slate-700">{selectedVendor.phone}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100">
                              <FileText size={20} />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900">Registration Documents</p>
                              <p className="text-[10px] text-slate-400 font-medium tracking-wide">Business License, ID Proof, Certificates</p>
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-white border border-slate-200 text-blue-600 rounded-lg text-xs font-bold shadow-sm hover:shadow-md transition-all">
                            View All
                          </button>
                        </div>
                      </div>
                    </div>

                    {selectedVendor.verificationStatus !== 'approved' && (
                      <div className="p-8 bg-slate-50/50 border-t border-slate-100 grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => {
                            if(window.confirm(`Are you sure you want to REJECT ${selectedVendor.businessName}?`)) {
                              handleVendorAction(selectedVendor._id, 'rejected');
                            }
                          }}
                          className="py-4 rounded-2xl text-sm font-bold text-rose-600 border border-rose-100 bg-rose-50/50 hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
                        >
                          <XCircle size={18} />
                          Reject Application
                        </button>
                        <button 
                          onClick={() => {
                            if(window.confirm(`Are you sure you want to APPROVE ${selectedVendor.businessName}?`)) {
                              handleVendorAction(selectedVendor._id, 'approved');
                            }
                          }}
                          className="py-4 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-black transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 size={18} />
                          Approve Application
                        </button>
                      </div>
                    )}
                    
                    {selectedVendor.verificationStatus === 'approved' && (
                      <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex gap-4">
                        <button 
                          onClick={() => handleDeleteVendor(selectedVendor._id, selectedVendor.businessName)}
                          className="flex-1 py-4 bg-white border border-rose-100 text-rose-600 rounded-2xl text-sm font-bold hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
                        >
                          <XCircle size={18} />
                          Remove Store
                        </button>
                        <button 
                          onClick={() => setSelectedVendor(null)}
                          className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-black transition-all shadow-lg"
                        >
                          Close Profile
                        </button>
                      </div>
                    )}
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        );

      case 'Subscriptions':
        return (
          <div className="max-w-7xl mx-auto space-y-8">

            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Subscription Plans</h1>
                <p className="text-slate-500 text-sm">Manage tiers, pricing, and features for the platform.</p>
              </div>
              <button 
                onClick={() => handleOpenSubModal()}
                className="flex items-center gap-2 px-6 py-3 bg-[#009688] hover:bg-[#00796B] text-white rounded-xl font-bold text-sm shadow-sm transition-all"
              >
                <Plus size={18} />
                Create New Tier
              </button>
            </div>

            {isSubLoading ? (
              <div className="py-20 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">Loading...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <div key={plan._id} className={`p-6 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-all relative flex flex-col ${plan.status === 'inactive' ? 'opacity-60 grayscale' : ''}`}>
                    <div className="flex justify-between items-start mb-6">
                      <div className="p-2.5 bg-slate-50 text-slate-400 rounded-lg">
                        <Ticket size={20} />
                      </div>
                      {plan.tag && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 uppercase tracking-widest">
                          {plan.tag}
                        </span>
                      )}
                    </div>
                    
                    <h4 className="text-sm font-bold text-slate-900 mb-1">{plan.name}</h4>
                    <p className="text-xs text-slate-500 mb-6 line-clamp-2 leading-relaxed">{plan.description}</p>
                    
                    <div className="grid grid-cols-3 gap-4 mb-6 pt-6 border-t border-slate-50">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Monthly</p>
                        <p className="text-sm font-semibold text-slate-900">₹{plan.prices.monthly}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Annual</p>
                        <p className="text-sm font-semibold text-slate-900">₹{plan.prices.annual}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Dlvrs</p>
                        <p className="text-sm font-semibold text-slate-900">{plan.deliveryDays}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <button onClick={() => handleOpenSubModal(plan)} className="flex-1 py-2 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-slate-100 transition-all">Edit</button>
                      <button onClick={() => handleToggleSubStatus(plan._id)} className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${plan.status === 'active' ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}>
                        {plan.status === 'active' ? 'Disable' : 'Enable'}
                      </button>
                      <button onClick={() => handleDeleteSub(plan._id)} className="flex-1 py-2 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-rose-100 transition-all">Del</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Modal - Also simplified to match rest of dashboard */}
            <AnimatePresence>
              {showSubModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-xl w-full max-w-xl overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                      <h2 className="text-lg font-bold text-slate-900">{editingPlan ? 'Edit Plan' : 'Create Plan'}</h2>
                      <button onClick={() => setShowSubModal(false)} className="p-2 text-slate-400 hover:text-slate-900 transition-all"><CloseIcon size={20} /></button>
                    </div>
                    <form onSubmit={handleSubSubmit} className="p-8 space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Plan Name</label>
                          <input required value={subFormData.name} onChange={e => setSubFormData({...subFormData, name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tag</label>
                          <input value={subFormData.tag} onChange={e => setSubFormData({...subFormData, tag: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10" placeholder="e.g. Popular" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</label>
                        <textarea required value={subFormData.description} onChange={e => setSubFormData({...subFormData, description: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm min-h-[80px]" />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monthly ₹</label>
                          <input type="number" value={subFormData.prices.monthly} onChange={e => setSubFormData({...subFormData, prices: {...subFormData.prices, monthly: Number(e.target.value)}})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Annual ₹</label>
                          <input type="number" value={subFormData.prices.annual} onChange={e => setSubFormData({...subFormData, prices: {...subFormData.prices, annual: Number(e.target.value)}})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Deliveries</label>
                          <input type="number" value={subFormData.deliveryDays} onChange={e => setSubFormData({...subFormData, deliveryDays: Number(e.target.value)})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
                        </div>
                      </div>
                      <div className="flex gap-3 pt-4">
                        <button type="button" onClick={() => setShowSubModal(false)} className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-widest">Cancel</button>
                        <button type="submit" className="flex-1 py-3 bg-slate-900 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-black transition-all shadow-lg">Save Changes</button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        );


      case 'Settings':
        return (
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">System Settings</h1>
              <p className="text-slate-500 text-sm">Configure global parameters and user permissions.</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl p-8 space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm font-bold text-slate-900">Automatic Sync</p>
                  <p className="text-xs text-slate-500">Sync patient data across all nodes every 5 minutes.</p>
                </div>
                <div className="w-12 h-6 bg-blue-600 rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm font-bold text-slate-900">Email Notifications</p>
                  <p className="text-xs text-slate-500">Send automated reminders for upcoming appointments.</p>
                </div>
                <div className="w-12 h-6 bg-slate-200 rounded-full relative">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        );
      default: // Dashboard
        return (
          <div className="max-w-7xl mx-auto space-y-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-0.5 bg-blue-600/10 text-blue-600 text-[10px] font-bold uppercase tracking-widest rounded-md">System Administration</span>
              <span className="text-slate-300">/</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Master View</span>
            </div>
            
            <div className="mb-10">
              <h1 className="text-5xl font-bold text-slate-900 tracking-tight mb-2">Admin Panel</h1>
              <p className="text-slate-500 text-base">Welcome back, your sanctuary is ready. You have <span className="text-blue-600 font-bold">3 pending notifications.</span></p>
            </div>

            {/* OLD CODE (commented by AI) */}
            {/*
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <MetricCard 
                title="Active Partners" 
                value={Array.isArray(activeVendors) ? activeVendors.length : 0} 
                unit="Stores" 
                icon={<ShoppingBag size={18} />} 
                trend="up" 
                trendValue="+12%" 
              />
              <MetricCard 
                title="Approval Queue" 
                value={Array.isArray(pendingVendors) ? pendingVendors.length : 0} 
                unit="Pending" 
                icon={<Clock size={18} />} 
                trend="down" 
                trendValue="-2" 
              />
              <MetricCard 
                title="System Uptime" 
                value="99.9" 
                unit="%" 
                icon={<ShieldCheck size={18} />} 
                trend="stable" 
                trendValue="STABLE" 
              />
              <MetricCard 
                title="Active Tiers" 
                value={plans.filter(p => p.status === 'active').length} 
                unit="Plans" 
                icon={<Ticket size={18} />} 
                trend="up" 
                trendValue="LIVE" 
              />
            </div>
            */}

            {/* NEW CODE - Wellwigen restyle / Inquiries feature */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              <MetricCard 
                title="New Inquiries" 
                value={newInquiriesCount} 
                unit="Leads" 
                icon={<Inbox size={18} />} 
                trend="up" 
                trendValue="LIVE"
                highlight={true}
                onClick={() => setActiveTab('Inquiries')}
              />
              <MetricCard 
                title="Active Partners" 
                value={Array.isArray(activeVendors) ? activeVendors.length : 0} 
                unit="Stores" 
                icon={<ShoppingBag size={18} />} 
                trend="up" 
                trendValue="+12%" 
              />
              <MetricCard 
                title="Approval Queue" 
                value={Array.isArray(pendingVendors) ? pendingVendors.length : 0} 
                unit="Pending" 
                icon={<Clock size={18} />} 
                trend="down" 
                trendValue="-2" 
              />
              <MetricCard 
                title="System Uptime" 
                value="99.9" 
                unit="%" 
                icon={<ShieldCheck size={18} />} 
                trend="stable" 
                trendValue="STABLE" 
              />
              <MetricCard 
                title="Active Tiers" 
                value={plans.filter(p => p.status === 'active').length} 
                unit="Plans" 
                icon={<Ticket size={18} />} 
                trend="up" 
                trendValue="LIVE" 
              />
            </div>


            <section className="mt-16">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-slate-900 uppercase tracking-widest">Facility Directory</h3>
                <button className="text-sm font-bold text-blue-600 uppercase tracking-widest hover:underline">View All Facilities</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FacilityCard 
                  title="General Medicine" 
                  status="OPEN" 
                  icon={<Users size={18} />} 
                  statusColor="bg-emerald-50 text-emerald-600 border-emerald-100" 
                />
                <FacilityCard 
                  title="Cardiology Unit" 
                  status="BUSY" 
                  icon={<Heart size={18} />} 
                  statusColor="bg-rose-50 text-rose-600 border-rose-100" 
                />
                <FacilityCard 
                  title="Imaging & Radiology" 
                  status="OPEN" 
                  icon={<Sparkles size={18} />} 
                  statusColor="bg-emerald-50 text-emerald-600 border-emerald-100" 
                />
              </div>
            </section>
          </div>
        );
    }
  };

  const renderRightPanel = () => {
    switch (activeTab) {
      case 'Appointments':
        return (
          <div className="space-y-10">
            <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-xl">
              <h4 className="text-sm font-bold uppercase tracking-widest mb-4">Daily Summary</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="text-xs opacity-80">Total Slots</span>
                  <span className="text-lg font-bold">24</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span className="text-xs opacity-80">Confirmed</span>
                  <span className="text-lg font-bold">18</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs opacity-80">Available</span>
                  <span className="text-lg font-bold">6</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Quick Actions</h4>
              <button className="w-full py-3 bg-white border border-slate-200 text-slate-900 rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all mb-3">
                Bulk Reschedule
              </button>
              <button className="w-full py-3 bg-white border border-slate-200 text-slate-900 rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all">
                Download Schedule
              </button>
            </div>
          </div>
        );
      case 'Records':
        return (
          <div className="space-y-10">
            <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Storage Health</h4>
              <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden mb-2">
                <div className="absolute left-0 top-0 h-full bg-blue-600 w-[72%]"></div>
              </div>
              <div className="flex justify-between text-[10px] font-bold text-slate-900">
                <span>720GB USED</span>
                <span>1TB TOTAL</span>
              </div>
            </div>
            <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl">
              <div className="flex items-center gap-3 mb-4 text-emerald-600">
                <ShieldCheck size={20} />
                <h4 className="text-xs font-bold uppercase tracking-widest">Encryption On</h4>
              </div>
              <p className="text-[10px] text-emerald-700 font-medium leading-relaxed">
                All clinical records are protected with AES-256 bit encryption. Last scan completed 2h ago.
              </p>
            </div>
          </div>
        );
      case 'Facilities':
        return (
          <div className="space-y-10">
            <div className="p-6 bg-slate-900 rounded-2xl text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600/20 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Emergency Status</h4>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-xl font-bold tracking-tight">System Normal</span>
              </div>
              <button className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg">
                Activate Alert Protocol
              </button>
            </div>
          </div>
        );
      case 'Vendors':
      case 'Subscriptions':
        return null;

      case 'Settings':
        return (
          <div className="space-y-10">
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">System Health</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-slate-600">Database</span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">UP</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-slate-600">Auth Service</span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">UP</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-slate-600">Storage API</span>
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">LAGGING</span>
                </div>
              </div>
            </div>
            <button className="w-full py-4 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all shadow-lg">
              Download System Logs
            </button>
          </div>
        );
      default: // Dashboard
        return (
          <div className="space-y-10">
            {/* OLD CODE (commented by AI) */}
            {/*
            <div>
              <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                
                <p className="text-[10px] font-bold uppercase tracking-widest mb-6 text-slate-500">Upcoming Appointment</p>
                
                <h4 className="text-3xl font-bold mb-1 tracking-tight">Dr. Sarah Jenkins</h4>
                <p className="text-sm text-slate-400 mb-8 font-medium">Annual Health Assessment</p>
                
                <div className="flex justify-between items-center mb-8 bg-white/5 p-5 rounded-xl border border-white/5">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Date</p>
                    <p className="text-lg font-bold">24 Oct</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Time</p>
                    <p className="text-lg font-bold">10:30 AM</p>
                  </div>
                </div>

                <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                  <Calendar size={16} />
                  Manage Booking
                </button>
              </div>
            </div>
            */}

            {/* NEW CODE - Wellwigen restyle (Brand Navy + Orange CTA) */}
            <div>
              <div className="bg-[#0B132B] rounded-3xl p-7 text-white relative overflow-hidden shadow-xl border border-teal-500/20 hover:-translate-y-0.5 transition-all duration-300">
                <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500/15 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-sky-500/10 rounded-full -ml-16 -mb-16 blur-2xl pointer-events-none"></div>
                
                <div className="flex items-center justify-between mb-5 relative z-10">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-teal-400">Upcoming Session</p>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                </div>
                
                <h4 className="text-2xl font-black mb-1 tracking-tight text-white relative z-10">Dr. Sarah Jenkins</h4>
                <p className="text-xs text-slate-300 mb-6 font-medium relative z-10">Annual Health Assessment</p>
                
                <div className="flex justify-between items-center mb-6 bg-white/[0.07] backdrop-blur-sm p-4 rounded-2xl border border-white/10 relative z-10">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-0.5">Date</p>
                    <p className="text-base font-bold text-white">24 Oct</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-0.5">Time</p>
                    <p className="text-base font-bold text-white">10:30 AM</p>
                  </div>
                </div>

                <button className="w-full py-3.5 bg-gradient-to-r from-[#F26B38] to-[#E05B28] hover:from-[#E05B28] hover:to-[#C94A1C] text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 relative z-10 hover:shadow-xl active:scale-[0.99]">
                  <Calendar size={15} />
                  Manage Booking
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Hospital Location</h4>
                <a 
                  href={locationData ? mapService.getGoogleMapsLink(locationData.lat, locationData.lng) : '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] font-bold text-blue-600 uppercase hover:underline"
                >
                  Get Directions
                </a>
              </div>
              
              <div className="aspect-video bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 relative group cursor-pointer overflow-hidden shadow-sm">
                {locationData ? (
                  <img 
                    src={mapService.getStaticMapUrl(locationData.lat, locationData.lng)} 
                    alt="Map" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Loading Map...</span>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-blue-900/0 transition-colors"></div>
                
                <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full shadow-sm flex items-center gap-2 z-10">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-[9px] font-bold text-slate-900 uppercase tracking-tight">Live Satellite</span>
                </div>

                <div className="absolute top-4 right-4 flex flex-col gap-1 z-10">
                  <div className="w-8 h-8 bg-white/90 backdrop-blur-md rounded-lg shadow-sm flex items-center justify-center text-slate-600 font-bold hover:bg-white transition-colors">+</div>
                  <div className="w-8 h-8 bg-white/90 backdrop-blur-md rounded-lg shadow-sm flex items-center justify-center text-slate-600 font-bold hover:bg-white transition-colors">-</div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-xl p-2 shadow-sm border border-white/20 flex items-center gap-3 z-10 transform translate-y-2 group-hover:translate-y-0 transition-all opacity-0 group-hover:opacity-100">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shrink-0">
                    <Search size={14} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest truncate">
                    {locationData?.address || 'Searching location...'}
                  </span>
                </div>

                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl border border-slate-100 relative z-10 transition-transform group-hover:scale-110">
                  <div className="absolute inset-0 bg-blue-600/20 rounded-full animate-ping"></div>
                  <MapPin size={20} className="text-blue-600 relative z-10" />
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <p className="text-xs font-bold text-blue-800 mb-1 flex items-center gap-2">
                  <Activity size={14} />
                  Hospital Address
                </p>
                <p className="text-[10px] text-blue-600 font-medium leading-relaxed">
                  {locationData?.address || 'Detecting system location...'}
                </p>
              </div>
            </div>
          </div>
        );
    }
  };


  return (
    <div className="flex h-screen bg-[#f9fafb] font-sans text-slate-900 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#f8f9fa] border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* OLD CODE (commented by AI) */}
        {/*
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">W</div>
            <span className="font-bold text-gray-900 tracking-tight">Wellwigen <span className="text-blue-600 font-semibold">Admin</span></span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-500 hover:bg-white rounded">
            <CloseIcon size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
          <AdminNavItem icon={<LayoutDashboard size={18} />} label="Dashboard" active={activeTab === 'Dashboard'} onClick={() => setActiveTab('Dashboard')} />
          <AdminNavItem icon={<Calendar size={18} />} label="Appointments" active={activeTab === 'Appointments'} onClick={() => setActiveTab('Appointments')} />
          <AdminNavItem icon={<FileText size={18} />} label="Records" active={activeTab === 'Records'} onClick={() => setActiveTab('Records')} />
          <AdminNavItem icon={<Building2 size={18} />} label="Facilities" active={activeTab === 'Facilities'} onClick={() => setActiveTab('Facilities')} />
          <AdminNavItem icon={<Users size={18} />} label="Vendors" active={activeTab === 'Vendors'} onClick={() => setActiveTab('Vendors')} />
          <AdminNavItem icon={<Ticket size={18} />} label="Subscriptions" active={activeTab === 'Subscriptions'} onClick={() => setActiveTab('Subscriptions')} />
          <AdminNavItem icon={<Settings size={18} />} label="Settings" active={activeTab === 'Settings'} onClick={() => setActiveTab('Settings')} />

        </nav>
        */}

        {/* NEW CODE - Wellwigen restyle / Inquiries feature */}
        <div className="p-6 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00C9B7] to-[#0284C7] shadow-md shadow-teal-500/20 flex items-center justify-center text-white font-black text-sm shrink-0">
              W
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base tracking-tight text-[#0F172A]">WELLWIGEN</span>
                <span className="text-[9px] font-bold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded uppercase tracking-wider">Admin</span>
              </div>
              <span className="text-[10px] font-medium text-slate-400 tracking-tight">Stronger Body. Better You.</span>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-500 hover:bg-white rounded-lg">
            <CloseIcon size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-4 overflow-y-auto">
          <AdminNavItem icon={<LayoutDashboard size={18} />} label="Dashboard" active={activeTab === 'Dashboard'} onClick={() => setActiveTab('Dashboard')} />
          <AdminNavItem icon={<Calendar size={18} />} label="Appointments" active={activeTab === 'Appointments'} onClick={() => setActiveTab('Appointments')} />
          <AdminNavItem icon={<FileText size={18} />} label="Records" active={activeTab === 'Records'} onClick={() => setActiveTab('Records')} />
          <AdminNavItem icon={<Building2 size={18} />} label="Facilities" active={activeTab === 'Facilities'} onClick={() => setActiveTab('Facilities')} />
          <AdminNavItem icon={<Users size={18} />} label="Vendors" active={activeTab === 'Vendors'} onClick={() => setActiveTab('Vendors')} />
          <AdminNavItem icon={<Ticket size={18} />} label="Subscriptions" active={activeTab === 'Subscriptions'} onClick={() => setActiveTab('Subscriptions')} />
          <AdminNavItem icon={<Inbox size={18} />} label="Inquiries" badge={newInquiriesCount} active={activeTab === 'Inquiries'} onClick={() => setActiveTab('Inquiries')} />
          <AdminNavItem icon={<Settings size={18} />} label="Settings" active={activeTab === 'Settings'} onClick={() => setActiveTab('Settings')} />
        </nav>

        <div className="p-4 border-t border-gray-200 bg-[#f8f9fa] space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-100 shadow-sm group hover:border-blue-200 transition-all">
            <div className="w-10 h-10 rounded bg-slate-900 flex items-center justify-center text-white font-bold text-xs">
              {user?.name?.substring(0, 2).toUpperCase() || 'AD'}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900 leading-none mb-1">{user?.name || 'System Admin'}</span>
              <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">{user?.role || 'Superuser'}</span>
            </div>
          </div>
          <button 
            onClick={() => {
              logout();
              toast.success("Logged out successfully");
              navigate('/login');
            }}
            className="w-full py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all flex items-center justify-center gap-2"
          >
            <XCircle size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F8FAFC]">
        {/* Header / Top Bar */}
        <div className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-slate-500">
              <Menu size={24} />
            </button>
            <div className="relative hidden sm:block">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search facilities, records..." 
                className="bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all w-64"
              />
            </div>
          </div>

          {/* OLD CODE (commented by AI) */}
          {/*
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                <Bell size={18} />
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                <MessageSquare size={18} />
              </button>
            </div>
          </div>
          */}

          {/* NEW CODE - Interactive Corner Notifications & Live Alerts */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 relative">
              {/* Corner Bell Button with Live Notification Badge */}
              <div className="relative">
                <button 
                  onClick={() => {
                    setIsNotificationsOpen(!isNotificationsOpen);
                    setIsMessagesOpen(false);
                  }}
                  className={`p-2.5 rounded-xl transition-all relative ${
                    isNotificationsOpen 
                      ? 'bg-teal-50 text-teal-700 ring-2 ring-teal-500/20' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  title="Notifications & New Leads"
                >
                  <Bell size={19} />
                  {newInquiriesCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] px-1 items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F26B38] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 min-w-[16px] px-1 bg-gradient-to-r from-[#F26B38] to-[#E05B28] text-[10px] font-black text-white items-center justify-center shadow-sm">
                        {newInquiriesCount}
                      </span>
                    </span>
                  )}
                </button>

                {/* Smooth Slide-down Notifications Dropdown */}
                <AnimatePresence>
                  {isNotificationsOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setIsNotificationsOpen(false)} 
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute right-0 top-full mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden ring-1 ring-black/5"
                      >
                        {/* Dropdown Header */}
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-teal-50/60 via-sky-50/30 to-white">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center font-bold text-xs">
                              <Bell size={15} />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-900 leading-tight">Notifications</h4>
                              <p className="text-[11px] text-slate-500 font-medium">
                                {newInquiriesCount > 0 ? `${newInquiriesCount} new leads requiring follow-up` : 'All caught up'}
                              </p>
                            </div>
                          </div>
                          {newInquiriesCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#F26B38] text-white">
                              {newInquiriesCount} NEW
                            </span>
                          )}
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                          {notifications.length > 0 ? (
                            notifications.map((item) => (
                              <div
                                key={item._id}
                                onClick={() => {
                                  setActiveTab('Inquiries');
                                  setIsNotificationsOpen(false);
                                }}
                                className="p-3.5 hover:bg-teal-50/40 transition-colors cursor-pointer group flex items-start gap-3"
                              >
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-sky-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                                  {item.fullName ? item.fullName.charAt(0).toUpperCase() : 'W'}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-0.5">
                                    <span className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition-colors truncate">
                                      {item.fullName}
                                    </span>
                                    <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                                      {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-600 truncate font-medium">
                                    {item.program} • <span className="text-teal-600 font-semibold">{item.plan || 'Trial'}</span>
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                                      item.status === 'New' 
                                        ? 'bg-amber-50 text-amber-600 border border-amber-200/60' 
                                        : 'bg-sky-50 text-sky-600'
                                    }`}>
                                      {item.status}
                                    </span>
                                    {item.fitnessGoal && (
                                      <span className="text-[10px] text-slate-400 truncate">
                                        Goal: {item.fitnessGoal}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="py-10 text-center px-4">
                              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
                                <CheckCircle2 size={18} />
                              </div>
                              <p className="text-xs font-semibold text-slate-600">No pending notifications</p>
                              <p className="text-[11px] text-slate-400 mt-0.5">New customer leads will appear here instantly.</p>
                            </div>
                          )}
                        </div>

                        {/* Dropdown Footer */}
                        <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                          <button
                            onClick={() => {
                              setActiveTab('Inquiries');
                              setIsNotificationsOpen(false);
                            }}
                            className="w-full py-2 bg-white border border-slate-200 hover:border-teal-300 hover:bg-teal-50/50 text-slate-800 hover:text-teal-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                          >
                            <span>Open Inquiries Panel</span>
                            <ChevronRight size={13} />
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Message Square Button */}
              <button 
                onClick={() => setActiveTab('Inquiries')}
                className="p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                title="View Customer Messages & Inquiries"
              >
                <MessageSquare size={19} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          {/* Main Scrollable Content with Smooth Sliding Transitions */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-10">
            {/* OLD CODE (commented by AI) */}
            {/*
            {renderContent()}
            */}

            {/* NEW CODE - Wellwigen Smooth Sliding Section Transition */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 16, x: -6 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, y: -16, x: 6 }}
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Dedicated Panel with Smooth Sliding Transition */}
          {(() => {
            const panel = renderRightPanel();
            return (
              <AnimatePresence mode="wait">
                {panel && (
                  <motion.div
                    key={`right-panel-${activeTab}`}
                    initial={{ opacity: 0, x: 26 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 26 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full lg:w-96 bg-white border-l border-slate-200 overflow-y-auto p-8 shrink-0 transition-all duration-300"
                  >
                    {panel}
                  </motion.div>
                )}
              </AnimatePresence>
            );
          })()}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
