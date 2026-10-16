import React, { useState, useEffect, useRef } from 'react';
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
  Inbox,
  // NEW CODE - Wellwigen Trainers feature
  Dumbbell,
  DollarSign,
  Mail,
  MessageCircle,
  ChevronDown,
  AlertCircle
} from 'lucide-react';
import { subscriptionPlanService } from '../../subscription/services/subscriptionPlanService';
import InquiriesView from './InquiriesView';
// NEW CODE - Wellwigen Trainers feature
import TrainersView from './TrainersView';
import ClientsView from './ClientsView';
import SubscriptionsView from './SubscriptionsView';
import SettingsView from './SettingsView';
import AdminClassesView from './AdminClassesView';
import { trainerApi } from '../../../services/trainerApi';

import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import useAppStore from '../../../store/useAppStore';
import * as mapService from '../../../services/mapService';
import { db } from '../../../config/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/* [DISABLED FOR FUTURE USE] Clinical & Vendor Mock Data (APPOINTMENTS, RECORDS, VENDORS, MOCK_PENDING, MOCK_ACTIVE)
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
*/





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

// OLD STYLES (commented by AI)
/*
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
*/

// NEW CODE - Modern SaaS Nav Item (Stripe/Linear style with clean pill indicator & brand teal/orange)
const AdminNavItem = ({ icon, label, active, onClick, badge }) => (
  <button 
    onClick={onClick}
    aria-label={label}
    className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
      active 
        ? 'bg-teal-500/10 text-teal-900 font-semibold ring-1 ring-teal-500/20 shadow-xs' 
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
    }`}
  >
    <div className="flex items-center gap-2.5">
      <span className={`transition-colors duration-150 ${active ? 'text-teal-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
        {icon}
      </span>
      <span>{label}</span>
    </div>
    {badge > 0 && (
      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#FF6B35] text-white shadow-2xs">
        {badge}
      </span>
    )}
  </button>
);

// OLD CODE (commented by AI)
/*
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
*/

// OLD STYLES (commented by AI)
/*
const MetricCard = ({ title, value, unit, icon, trend, trendValue, highlight = false, onClick }) => (
  <div 
    onClick={onClick}
    className={`p-5 bg-white border rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 group flex flex-col justify-between min-h-[140px] w-full ${
      onClick ? 'cursor-pointer hover:border-teal-400' : ''
    } ${
      highlight 
        ? 'border-teal-200 bg-gradient-to-br from-white via-teal-50/20 to-sky-50/30 ring-1 ring-teal-500/10' 
        : 'border-slate-200/90'
    }`}
  >
    <div className="flex items-center justify-between gap-2 mb-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
        highlight 
          ? 'bg-teal-50 text-teal-600 group-hover:bg-[#009688] group-hover:text-white' 
          : 'bg-slate-50 text-slate-600 group-hover:bg-[#009688] group-hover:text-white'
      }`}>
        {icon}
      </div>
      {trendValue && (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
          trend === 'up' ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' : 
          trend === 'down' ? 'text-rose-700 bg-rose-50 border border-rose-200' : 
          trend === 'stable' ? 'text-sky-700 bg-sky-50 border border-sky-200' :
          'text-slate-600 bg-slate-100'
        }`}>
          {trendValue}
        </span>
      )}
    </div>
    
    <div>
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate mb-1" title={title}>
        {title}
      </p>
      <div className="flex items-baseline gap-1.5 flex-wrap">
        <h4 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">{value}</h4>
        {unit && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{unit}</span>}
      </div>
    </div>
  </div>
);
*/

// NEW CODE - Modern SaaS Metric Card (Clear type scale, 8px grid, soft shadows, attractive visible colored border, brand teal/orange)
const MetricCard = ({ title, value, unit, icon, trend, trendValue, highlight = false, onClick }) => (
  <div 
    onClick={onClick}
    className={`p-5 bg-white/95 backdrop-blur-md border-2 rounded-2xl shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group flex flex-col justify-between min-h-[142px] w-full ${
      onClick ? 'cursor-pointer hover:border-teal-500' : ''
    } ${
      highlight 
        ? 'border-teal-500 bg-gradient-to-br from-white via-teal-50/40 to-sky-50/30 ring-2 ring-teal-500/20 shadow-teal-500/10' 
        : 'border-teal-500/30 hover:border-teal-500 shadow-teal-500/5'
    }`}
  >
    <div className="flex items-center justify-between gap-2 mb-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-200 ${
        highlight 
          ? 'bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white' 
          : 'bg-slate-50 text-slate-500 group-hover:bg-teal-600 group-hover:text-white'
      }`}>
        {icon}
      </div>
      {trendValue && (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 border ${
          trend === 'up' ? 'text-emerald-700 bg-emerald-50 border-emerald-200/80' : 
          trend === 'down' ? 'text-rose-700 bg-rose-50 border-rose-200/80' : 
          trend === 'stable' ? 'text-sky-700 bg-sky-50 border-sky-200/80' :
          'text-slate-600 bg-slate-100 border-slate-200'
        }`}>
          {trendValue}
        </span>
      )}
    </div>
    
    <div>
      <p className="text-xs font-medium text-slate-500 truncate mb-1" title={title}>
        {title}
      </p>
      <div className="flex items-baseline gap-1.5 flex-wrap">
        <h4 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">{value}</h4>
        {unit && <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{unit}</span>}
      </div>
    </div>
  </div>
);

// Skeleton loader for Metric Cards
const SkeletonMetricCard = () => (
  <div className="p-5 bg-white/90 backdrop-blur-md border-2 border-teal-500/20 rounded-2xl shadow-xs flex flex-col justify-between min-h-[142px] w-full animate-pulse">
    <div className="flex items-center justify-between mb-3">
      <div className="w-10 h-10 rounded-xl bg-slate-100" />
      <div className="w-16 h-5 rounded-full bg-slate-100" />
    </div>
    <div className="space-y-2">
      <div className="w-24 h-3.5 rounded bg-slate-100" />
      <div className="w-20 h-7 rounded bg-slate-100" />
    </div>
  </div>
);

/* [DISABLED FOR FUTURE USE] FacilityCard & DataTable Helper Components
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
*/


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
  const [pendingTrainersCount, setPendingTrainersCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  // NEW CODE - Top bar profile menu and confirmation modal states
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Alert and notification checking states
  const [inquiriesChecked, setInquiriesChecked] = useState(() => {
    return localStorage.getItem('wellwigen_admin_inquiries_checked') === 'true';
  });
  const [trainersChecked, setTrainersChecked] = useState(() => {
    return localStorage.getItem('wellwigen_admin_trainers_checked') === 'true';
  });
  const [notificationsChecked, setNotificationsChecked] = useState(() => {
    return localStorage.getItem('wellwigen_admin_notifications_checked') === 'true';
  });
  const [lastCheckedInquiriesCount, setLastCheckedInquiriesCount] = useState(() => {
    return parseInt(localStorage.getItem('wellwigen_last_checked_inquiries_count') || '0', 10);
  });
  const [lastCheckedTrainersCount, setLastCheckedTrainersCount] = useState(() => {
    return parseInt(localStorage.getItem('wellwigen_last_checked_trainers_count') || '0', 10);
  });

  // Handlers for checking sections and notifications
  const handleOpenInquiriesTab = () => {
    setActiveTab('Inquiries');
    setInquiriesChecked(true);
    setNotificationsChecked(true);
    setLastCheckedInquiriesCount(newInquiriesCount);
    try {
      localStorage.setItem('wellwigen_admin_inquiries_checked', 'true');
      localStorage.setItem('wellwigen_admin_notifications_checked', 'true');
      localStorage.setItem('wellwigen_last_checked_inquiries_count', String(newInquiriesCount));
    } catch (e) {}
    setIsSidebarOpen(false);
    setIsNotificationsOpen(false);
  };

  const handleOpenTrainersTab = () => {
    setActiveTab('Trainers');
    setTrainersChecked(true);
    setNotificationsChecked(true);
    setLastCheckedTrainersCount(pendingTrainersCount);
    try {
      localStorage.setItem('wellwigen_admin_trainers_checked', 'true');
      localStorage.setItem('wellwigen_admin_notifications_checked', 'true');
      localStorage.setItem('wellwigen_last_checked_trainers_count', String(pendingTrainersCount));
    } catch (e) {}
    setIsSidebarOpen(false);
    setIsNotificationsOpen(false);
  };

  // Sync checked state when activeTab changes
  useEffect(() => {
    if (activeTab === 'Inquiries') {
      setInquiriesChecked(true);
      setNotificationsChecked(true);
      setLastCheckedInquiriesCount(newInquiriesCount);
      try {
        localStorage.setItem('wellwigen_admin_inquiries_checked', 'true');
        localStorage.setItem('wellwigen_admin_notifications_checked', 'true');
        localStorage.setItem('wellwigen_last_checked_inquiries_count', String(newInquiriesCount));
      } catch (e) {}
    } else if (activeTab === 'Trainers') {
      setTrainersChecked(true);
      setNotificationsChecked(true);
      setLastCheckedTrainersCount(pendingTrainersCount);
      try {
        localStorage.setItem('wellwigen_admin_trainers_checked', 'true');
        localStorage.setItem('wellwigen_admin_notifications_checked', 'true');
        localStorage.setItem('wellwigen_last_checked_trainers_count', String(pendingTrainersCount));
      } catch (e) {}
    }
  }, [activeTab, newInquiriesCount, pendingTrainersCount]);

  // When new inquiries arrive and admin is not on Inquiries, start blinking permanently again
  useEffect(() => {
    if (newInquiriesCount > lastCheckedInquiriesCount) {
      if (activeTab === 'Inquiries') {
        setLastCheckedInquiriesCount(newInquiriesCount);
        try {
          localStorage.setItem('wellwigen_last_checked_inquiries_count', String(newInquiriesCount));
        } catch (e) {}
      } else {
        setInquiriesChecked(false);
        setNotificationsChecked(false);
        try {
          localStorage.setItem('wellwigen_admin_inquiries_checked', 'false');
          localStorage.setItem('wellwigen_admin_notifications_checked', 'false');
        } catch (e) {}
      }
    }
  }, [newInquiriesCount, activeTab, lastCheckedInquiriesCount]);

  // When new trainer applications arrive and admin is not on Trainers, start blinking permanently again
  useEffect(() => {
    if (pendingTrainersCount > lastCheckedTrainersCount) {
      if (activeTab === 'Trainers') {
        setLastCheckedTrainersCount(pendingTrainersCount);
        try {
          localStorage.setItem('wellwigen_last_checked_trainers_count', String(pendingTrainersCount));
        } catch (e) {}
      } else {
        setTrainersChecked(false);
        setNotificationsChecked(false);
        try {
          localStorage.setItem('wellwigen_admin_trainers_checked', 'false');
          localStorage.setItem('wellwigen_admin_notifications_checked', 'false');
        } catch (e) {}
      }
    }
  }, [pendingTrainersCount, activeTab, lastCheckedTrainersCount]);

  // Auto-dismiss dropdowns on outside click anywhere on screen
  const notificationsRef = useRef(null);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isNotificationsOpen || isProfileMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isNotificationsOpen, isProfileMenuOpen]);

  const [rejectModalTrainer, setRejectModalTrainer] = useState(null);
  const [rejectReasonText, setRejectReasonText] = useState('');
  const [isRejectingLoading, setIsRejectingLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);

  // Real MongoDB data states for trainer/client dashboard
  const [allTrainers, setAllTrainers] = useState([]);
  const [pendingTrainersList, setPendingTrainersList] = useState([]);
  const [topTrainersList, setTopTrainersList] = useState([]);
  const [recentInquiriesList, setRecentInquiriesList] = useState([]);
  const [clientsList, setClientsList] = useState([]);
  const [clientsCount, setClientsCount] = useState(0);
  const [activeSubsCount, setActiveSubsCount] = useState(0);
  const [revenueTotal, setRevenueTotal] = useState('₹48,500');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Fetch real inquiries from MongoDB
  const fetchInquiriesData = async () => {
    try {
      let serverLeads = [];
      let newCount = 0;

      try {
        const res = await axios.get(`${API_URL}/inquiries?limit=20`);
        if (res.data?.success) {
          if (res.data.stats) {
            newCount = res.data.stats.new || 0;
          }
          if (Array.isArray(res.data.data)) {
            serverLeads = res.data.data;
          }
        }
      } catch (networkErr) {
        // Fallback to local storage
      }

      // Read locally captured leads and deduplicate by email, phone, and ID
      let cachedRaw = [];
      try {
        const leads1 = JSON.parse(localStorage.getItem('wellwigen_leads') || '[]');
        const leads2 = JSON.parse(localStorage.getItem('wellwigen_inquiries') || '[]');
        cachedRaw = [...leads1, ...leads2];
      } catch (e) {}

      // Deduplicate raw local leads first by email and phone
      const localUnique = [];
      const seenLocalKeys = new Set();
      for (const item of cachedRaw) {
        const emailKey = (item.email || item.emailAddress || '').toLowerCase().trim();
        const phoneKey = (item.phone || item.phoneNumber || '').replace(/\D/g, '');
        const key = `${emailKey}_${phoneKey}`;
        const idKey = String(item._id || item.id || '');
        if (key && key !== '_') {
          if (!seenLocalKeys.has(key)) {
            seenLocalKeys.add(key);
            if (idKey) seenLocalKeys.add(idKey);
            localUnique.push(item);
          }
        } else if (idKey) {
          if (!seenLocalKeys.has(idKey)) {
            seenLocalKeys.add(idKey);
            localUnique.push(item);
          }
        }
      }

      const localMapped = localUnique.map((item, idx) => ({
        _id: item._id || item.id || `cached_${idx}`,
        fullName: item.fullName || item.name || 'Visitor',
        email: item.email || item.emailAddress || '',
        phone: item.phone || item.phoneNumber || '',
        program: item.program || 'General Inquiry',
        plan: item.plan || 'Trial Class',
        fitnessGoal: item.fitnessGoal || '',
        preferredTiming: item.preferredTiming || item.preferredTime || '',
        message: item.message || '',
        status: item.status || 'New',
        adminNotes: item.adminNotes || '',
        createdAt: item.createdAt || item.timestamp || new Date().toISOString(),
      }));

      // Combine and deduplicate against server leads
      const combined = [...serverLeads];
      const seenKeys = new Set(
        serverLeads.map((s) => `${(s.email || '').toLowerCase().trim()}_${(s.phone || '').replace(/\D/g, '')}`)
      );
      const seenIds = new Set(serverLeads.map((s) => String(s._id || s.id)));

      for (const loc of localMapped) {
        const locId = String(loc._id);
        const locKey = `${(loc.email || '').toLowerCase().trim()}_${(loc.phone || '').replace(/\D/g, '')}`;
        if (!seenIds.has(locId) && (!locKey || locKey === '_' || !seenKeys.has(locKey))) {
          seenIds.add(locId);
          if (locKey && locKey !== '_') seenKeys.add(locKey);
          combined.unshift(loc);
        }
      }

      setRecentInquiriesList(combined.slice(0, 10));
      setNotifications(combined.slice(0, 10));
      const verifiedNewCount = combined.filter((i) => i.status === 'New').length;
      setNewInquiriesCount(verifiedNewCount);
    } catch (err) {
      console.warn('Dashboard inquiries load notice:', err.message);
    }
  };

  const fetchInquiriesCount = (overrideCount) => {
    if (typeof overrideCount === 'number') {
      setNewInquiriesCount(overrideCount);
    } else {
      fetchInquiriesData();
    }
  };

  // Fetch real trainers from MongoDB
  const fetchTrainersData = async () => {
    try {
      const res = await trainerApi.getAdminTrainers({ status: 'All' });
      if (res && res.trainers) {
        setAllTrainers(res.trainers);
        const pending = res.trainers.filter((t) => t.status === 'pending');
        const approved = res.trainers.filter((t) => t.status === 'approved');
        setPendingTrainersList(pending);
        setPendingTrainersCount(pending.length);
        setTopTrainersList(approved.slice(0, 5));
      }
    } catch (err) {
      console.warn('Could not fetch trainers for dashboard:', err);
    }
  };

  // Fetch real clients
  const fetchClientsData = () => {
    try {
      const list = trainerApi.getClients();
      const safeList = Array.isArray(list) ? list : [];
      setClientsList(safeList);
      setClientsCount(safeList.length);
    } catch (e) {
      setClientsList([]);
    }
  };

  // Fetch real subscriptions from localStorage / backend
  const fetchSubscriptionsData = () => {
    try {
      const savedSubs = localStorage.getItem('wellwigen_admin_subscriptions');
      if (savedSubs) {
        const subs = JSON.parse(savedSubs);
        const active = subs.filter((s) => s.status === 'Active');
        setActiveSubsCount(active.length);
        let total = 0;
        active.forEach((s) => {
          const num = parseInt(String(s.price).replace(/[^0-9]/g, ''), 10);
          if (!isNaN(num)) total += num;
        });
        setRevenueTotal(total > 0 ? `₹${total.toLocaleString('en-IN')}` : '₹0');
      } else {
        setActiveSubsCount(0);
        setRevenueTotal('₹0');
      }
    } catch (e) {
      setActiveSubsCount(0);
      setRevenueTotal('₹0');
    }
  };

  useEffect(() => {
    fetchInquiriesData();
    fetchTrainersData();
    fetchClientsData();
    fetchSubscriptionsData();

    // Live update listeners for trainer application submission
    const handleTrainerSubmitted = (e) => {
      fetchTrainersData();
      const coachName = e?.detail?.name || 'A coach';
      toast.success(`🚨 New Coach Application: "${coachName}" submitted onboarding and is awaiting your approval!`, {
        duration: 6500,
        id: 'new-coach-alert-' + Date.now(),
      });
    };

    window.addEventListener('wellwigen_trainer_application_submitted', handleTrainerSubmitted);
    window.addEventListener('storage', fetchTrainersData);

    const interval = setInterval(() => {
      fetchInquiriesData();
      fetchTrainersData();
      fetchClientsData();
      fetchSubscriptionsData();
    }, 15000);
    return () => {
      clearInterval(interval);
      window.removeEventListener('wellwigen_trainer_application_submitted', handleTrainerSubmitted);
      window.removeEventListener('storage', fetchTrainersData);
    };
  }, []);

  // Quick Approve Trainer
  const handleQuickApprove = async (trainer) => {
    const id = trainer._id || trainer.id;
    try {
      await trainerApi.updateTrainerStatus(id, { status: 'approved' });
      toast.success(`🎉 ${trainer.name} approved as verified coach!`);
      fetchTrainersData();
    } catch (err) {
      toast.error('Failed to approve coach application');
    }
  };

  // OLD CODE (commented by AI)
  /*
  const handleQuickReject = async (trainer) => {
    const reason = window.prompt(
      `Provide rejection reason for ${trainer.name}:`,
      'Credentials require further verification.'
    );
    if (!reason) return;
    const id = trainer._id || trainer.id;
    try {
      await trainerApi.updateTrainerStatus(id, {
        status: 'rejected',
        rejectionReason: reason,
      });
      toast.success(`Application for ${trainer.name} rejected.`);
      fetchTrainersData();
    } catch (err) {
      toast.error('Failed to reject application');
    }
  };
  */

  // NEW CODE - Modern SaaS Confirmation Dialog for Rejecting Trainer
  const handleQuickReject = (trainer) => {
    setRejectModalTrainer(trainer);
    setRejectReasonText('Credentials require further verification. Please re-upload valid athletic certification.');
  };

  const handleConfirmReject = async () => {
    if (!rejectModalTrainer) return;
    const id = rejectModalTrainer._id || rejectModalTrainer.id;
    try {
      setIsRejectingLoading(true);
      await trainerApi.updateTrainerStatus(id, {
        status: 'rejected',
        rejectionReason: rejectReasonText,
      });
      toast.success(`Application for ${rejectModalTrainer.name} rejected.`);
      setRejectModalTrainer(null);
      fetchTrainersData();
    } catch (err) {
      toast.error('Failed to reject application');
    } finally {
      setIsRejectingLoading(false);
    }
  };

  // Quick Reply Email for Inquiry
  const handleQuickReplyEmail = (inq) => {
    const mailtoUrl = `mailto:${inq.email}?subject=Wellwigen%20Fitness%20Subscription%20Inquiry&body=Hi%20${encodeURIComponent(
      inq.fullName || 'there'
    )}%2C%0A%0AThank%20you%20for%20your%20inquiry%20regarding%20Wellwigen%20${encodeURIComponent(
      inq.program || 'training'
    )}.%20We%20would%20love%20to%20get%20you%20started!`;
    window.location.href = mailtoUrl;
    toast.success(`Opening email client for ${inq.email}`);
  };

  // Quick Reply WhatsApp for Inquiry
  const handleQuickReplyWhatsApp = (inq) => {
    const digits = (inq.phone || '').replace(/\D/g, '');
    const cleanPhone = digits.length === 10 ? `91${digits}` : digits;
    if (!cleanPhone) {
      toast.error('Invalid phone number for WhatsApp');
      return;
    }
    const text = encodeURIComponent(
      `Hi ${inq.fullName || ''}! We received your Wellwigen fitness inquiry for ${
        inq.program || 'training'
      }. How can our head coach assist you today?`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
    toast.success('WhatsApp opened!');
  };

  /* [DISABLED FOR FUTURE USE] Vendor Management & Location State
  const [vendorTab, setVendorTab] = useState('Pending');
  const [pendingVendors, setPendingVendors] = useState([]);
  const [activeVendors, setActiveVendors] = useState([]);
  const [isLoadingVendors, setIsLoadingVendors] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [locationData, setLocationData] = useState(null);
  */

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

  // Fetch subscription plans & message data on mount and when switching to relevant tabs
  useEffect(() => {
    fetchPlans();
    fetchMessages();
  }, []);

  useEffect(() => {
    console.log("🎯 ACTIVE_TAB_CHANGED:", activeTab);
    if (activeTab === 'Messages') {
      fetchMessages();
    }
  }, [activeTab]);

  /* [DISABLED FOR FUTURE USE] Vendor & Hospital Location API Handlers (fetchPendingVendors, fetchActiveVendors, fetchLocation, handleVendorAction, handleDeleteVendor)
  const fetchLocation = async () => {
    try {
      const data = await mapService.getHospitalLocation();
      setLocationData(data);
    } catch (err) {
      console.error("Failed to fetch location:", err);
    }
  };

  const fetchPendingVendors = async () => {
    try {
      setIsLoadingVendors(true);
      const response = await axios.get(`${API_URL}/provider/admin/pending`);
      if (response.data && response.data.success) {
        setPendingVendors(Array.isArray(response.data.data) ? response.data.data : []);
      }
    } catch (err) {
      console.error("Failed to fetch pending vendors, using mock data:", err);
    } finally {
      setIsLoadingVendors(false);
    }
  };

  const fetchActiveVendors = async () => {
    try {
      setIsLoadingVendors(true);
      const response = await axios.get(`${API_URL}/provider/admin/active`);
      if (response.data && response.data.success) {
        setActiveVendors(Array.isArray(response.data.data) ? response.data.data : []);
      }
    } catch (err) {
      console.error("Failed to fetch active vendors, using mock data:", err);
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
  */

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
        return <InquiriesView onStatusChange={fetchInquiriesCount} onNavigateToClients={() => setActiveTab('Clients')} />;
      // NEW CODE - Wellwigen Trainers feature
      case 'Trainers':
        return <TrainersView onStatusChange={setPendingTrainersCount} />;
      /* [DISABLED FOR FUTURE USE] Admin Classes & Trainer Scheduling feature
      case 'Classes':
        return <AdminClassesView onNavigateToTrainers={() => setActiveTab('Trainers')} />;
      */
      // NEW CODE - Wellwigen Clients feature
      case 'Clients':
        return <ClientsView />;
      // NEW CODE - Wellwigen Subscriptions feature
      case 'Subscriptions':
        return <SubscriptionsView />;
      // NEW CODE - Wellwigen Platform Settings feature
      case 'Settings':
        return <SettingsView />;

      /* [DISABLED FOR FUTURE USE] Appointments View
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
      */

      /* [DISABLED FOR FUTURE USE] Medical Records View
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
      */

      /* [DISABLED FOR FUTURE USE] Hospital Facilities View
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
      */
      /* [DISABLED FOR FUTURE USE] Vendors View
      case 'Vendors':
        return (
          <div className="max-w-7xl mx-auto space-y-10">
            {/* Header * /}
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

            {/* Summary Cards * /}
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

            {/* Tabs & Table * /}
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

            {/* Vendor Review Modal * /}
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
      */

      /* [DISABLED FOR FUTURE USE] Inline Subscriptions & Medical Settings View
      case 'Subscriptions_Legacy':
        return (
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Subscription Plans</h1>
                <p className="text-slate-500 text-sm">Manage tiers, pricing, and features for the platform.</p>
              </div>
            </div>
          </div>
        );
      */

      default: { // Dashboard - Wellwigen Core Admin View
        const adminName = user?.name || user?.email?.split('@')[0] || 'Administrator';
        const totalPendingNotifications = (pendingTrainersList?.length || 0) + (newInquiriesCount || 0);

        return (
          <div className="max-w-7xl mx-auto space-y-8 pb-12">
            {/* ================= BREADCRUMBS & WELCOME BANNER ================= */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-teal-500/10 text-teal-700 text-[10px] font-bold uppercase tracking-wider rounded-md">
                  Wellwigen Command
                </span>
                <span className="text-slate-300">/</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Admin & Coach Hub
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                Welcome back, {adminName}!
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                {totalPendingNotifications > 0 ? (
                  <span>
                    You have <strong className="text-teal-700 font-bold">{totalPendingNotifications} pending item{totalPendingNotifications === 1 ? '' : 's'}</strong> requiring review across coach onboarding and trainee inquiries.
                  </span>
                ) : (
                  <span>All coach verification queues and trainee subscription inquiries are up to date.</span>
                )}
              </p>
            </div>

            {/* ================= STAT CARDS GRID (BALANCED 5-COLUMN LAYOUT) ================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              <MetricCard 
                title="Total Trainers" 
                value={allTrainers.length} 
                unit="Coaches" 
                icon={<Dumbbell size={18} />} 
                trend="up" 
                trendValue="ACTIVE"
                onClick={() => setActiveTab('Trainers')}
              />
              <MetricCard 
                title="Pending Approvals" 
                value={pendingTrainersList.length} 
                unit="In Queue" 
                icon={<Clock size={18} />} 
                trend={pendingTrainersList.length > 0 ? 'down' : 'stable'} 
                trendValue={pendingTrainersList.length > 0 ? 'ACTION' : 'CLEAR'}
                highlight={pendingTrainersList.length > 0}
                onClick={() => setActiveTab('Trainers')}
              />
              <MetricCard 
                title="Total Clients" 
                value={clientsCount} 
                unit="Trainees" 
                icon={<Users size={18} />} 
                trend="up" 
                trendValue="ROSTER" 
                onClick={() => setActiveTab('Clients')}
              />
              <MetricCard 
                title="Active Memberships" 
                value={activeSubsCount} 
                unit="Members" 
                icon={<CheckCircle2 size={18} />} 
                trend="up" 
                trendValue="TIERS" 
                onClick={() => setActiveTab('Subscriptions')}
              />
              <MetricCard 
                title="New Inquiries" 
                value={newInquiriesCount} 
                unit="Leads" 
                icon={<Inbox size={18} />} 
                trend={newInquiriesCount > 0 ? 'up' : 'stable'} 
                trendValue={newInquiriesCount > 0 ? 'NEW' : 'CHECKED'}
                highlight={newInquiriesCount > 0}
                onClick={() => setActiveTab('Inquiries')}
              />
              {/* [DISABLED PER REQUEST] Revenue Metric Card
              <MetricCard 
                title="Revenue" 
                value={revenueTotal} 
                unit="Monthly" 
                icon={<DollarSign size={18} />} 
                trend="up" 
                trendValue="LIVE" 
                onClick={() => setActiveTab('Subscriptions')}
              />
              */}
            </div>

            {/* ================= PENDING TRAINER APPROVALS TABLE ================= */}
            <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                    Pending Trainer Approvals
                  </h3>
                  <p className="text-xs text-slate-400">Applications submitted from the Trainer Onboarding Portal</p>
                </div>
                {pendingTrainersList.length > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                    {pendingTrainersList.length} Action Required
                  </span>
                )}
              </div>

              {pendingTrainersList.length === 0 ? (
                <div className="p-12 text-center space-y-2">
                  <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-1" />
                  <h4 className="text-sm font-bold text-slate-800">No pending approvals right now</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    All trainer onboarding applications have been reviewed. New applications from the trainer portal will appear here immediately.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <tr>
                        <th className="px-5 py-3">Applicant Coach</th>
                        <th className="px-5 py-3">Specialization & Credentials</th>
                        <th className="px-5 py-3">Contact</th>
                        <th className="px-5 py-3">Applied</th>
                        <th className="px-5 py-3 text-right">Quick Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {pendingTrainersList.map((trn) => (
                        <tr key={trn._id || trn.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-5 py-4">
                            <div className="font-bold text-slate-900">{trn.name}</div>
                            <div className="text-[11px] text-slate-400">{trn.email}</div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="font-semibold text-slate-800">{trn.specialization || 'Personal Trainer'}</div>
                            <div className="text-[10px] text-teal-700 font-medium">
                              {Array.isArray(trn.certifications) ? trn.certifications.join(', ') : 'Accredited'}
                            </div>
                          </td>
                          <td className="px-5 py-4 text-slate-600">
                            <div>{trn.phone || 'Phone not provided'}</div>
                            <div className="text-[10px] text-slate-400">{trn.city || 'India'}</div>
                          </td>
                          <td className="px-5 py-4 text-slate-500 whitespace-nowrap">
                            {trn.joinedDate || 'Recent'}
                          </td>
                          <td className="px-5 py-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleQuickApprove(trn)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleQuickReject(trn)}
                                className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-colors cursor-pointer"
                              >
                                Reject
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

            {/* ================= RECENT INQUIRIES LIST ================= */}
            <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                    Recent Website Subscription Inquiries
                  </h3>
                  <p className="text-xs text-slate-400">Prospective trainees looking for coaching and transformation programs</p>
                </div>
                <button
                  onClick={() => setActiveTab('Inquiries')}
                  className="text-xs font-bold text-teal-700 hover:text-teal-800 hover:underline cursor-pointer"
                >
                  View All &rarr;
                </button>
              </div>

              {recentInquiriesList.length === 0 ? (
                <div className="p-12 text-center space-y-2">
                  <Inbox size={32} className="mx-auto text-slate-300 mb-1" />
                  <h4 className="text-sm font-bold text-slate-800">No recent inquiries right now</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    New subscription leads submitted through the landing page form will automatically stream here.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {recentInquiriesList.slice(0, 5).map((inq) => (
                    <div
                      key={inq._id || inq.id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{inq.fullName}</h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              inq.status === 'New'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {inq.status || 'New'}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-500 mt-1">
                          <span className="font-semibold text-teal-700">{inq.program}</span>
                          {inq.fitnessGoal && <span>&bull; Goal: {inq.fitnessGoal}</span>}
                          <span>&bull; {inq.phone}</span>
                        </div>
                      </div>

                      {/* Quick Reply Buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleQuickReplyEmail(inq)}
                          className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Mail size={13} className="text-slate-500" />
                          <span>Reply via Email</span>
                        </button>
                        <button
                          onClick={() => handleQuickReplyWhatsApp(inq)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <MessageCircle size={13} />
                          <span>Reply via WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ================= TWO-COLUMN: RECENT CLIENTS & TOP TRAINERS ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Column 1: Recent Clients */}
              <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                        Recent Trainees
                      </h3>
                      <p className="text-xs text-slate-400">Latest active clients across coaching programs</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('Clients')}
                      className="text-xs font-bold text-teal-700 hover:text-teal-800 hover:underline cursor-pointer"
                    >
                      Manage Roster &rarr;
                    </button>
                  </div>

                  {clientsList.length === 0 ? (
                    <div className="p-10 text-center space-y-2">
                      <Users size={30} className="mx-auto text-slate-300 mb-1" />
                      <h4 className="text-sm font-bold text-slate-800">No trainees enrolled yet</h4>
                      <p className="text-xs text-slate-400">Clients will appear once subscribed or assigned.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {clientsList.slice(0, 4).map((cli) => (
                        <div key={cli.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors">
                          <div className="flex items-center gap-3">
                            <img
                              src={cli.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                              alt={cli.name}
                              className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-100"
                            />
                            <div>
                              <p className="font-bold text-slate-900 text-xs">{cli.name}</p>
                              <p className="text-[11px] text-teal-700 font-medium">{cli.goal}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                              {cli.status || 'Active'}
                            </span>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {cli.sessionsCompleted || 0} sessions
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Column 2: Top Trainers */}
              <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                        Top Coaches & Trainers
                      </h3>
                      <p className="text-xs text-slate-400">Verified athletic coaches leading member transformations</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('Trainers')}
                      className="text-xs font-bold text-teal-700 hover:text-teal-800 hover:underline cursor-pointer"
                    >
                      View All Coaches &rarr;
                    </button>
                  </div>

                  {topTrainersList.length === 0 && allTrainers.length === 0 ? (
                    <div className="p-10 text-center space-y-2">
                      <Dumbbell size={30} className="mx-auto text-slate-300 mb-1" />
                      <h4 className="text-sm font-bold text-slate-800">No verified coaches yet</h4>
                      <p className="text-xs text-slate-400">Approved coaches will be listed here.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {(topTrainersList.length > 0 ? topTrainersList : allTrainers).slice(0, 4).map((trn) => (
                        <div key={trn._id || trn.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors">
                          <div className="flex items-center gap-3">
                            <img
                              src={trn.photoUrl || trn.avatar || 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=200&q=80'}
                              alt={trn.name}
                              className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-100"
                            />
                            <div>
                              <p className="font-bold text-slate-900 text-xs">{trn.name}</p>
                              <p className="text-[11px] text-slate-500">{trn.specialization || 'Strength Coach'}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                              ⭐ {trn.rating || 4.9} Rating
                            </span>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {trn.experience || '6 Years exp'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ================= GROWTH CHART: CLIENT SIGNUPS & SUBSCRIPTIONS ================= */}
            <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                    Client Registrations & Subscriptions Growth
                  </h3>
                  <p className="text-xs text-slate-400">Monthly new trainees enrolled vs. active subscription renewals</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-[#009688]"></span>
                    <span className="text-slate-600">Client Signups</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-md bg-[#0284C7]"></span>
                    <span className="text-slate-600">Active Memberships</span>
                  </div>
                </div>
              </div>

              {/* Chart Visual Representation */}
              <div className="pt-4">
                <div className="grid grid-cols-6 gap-2 sm:gap-6 items-end h-48 border-b border-slate-100 pb-2">
                  {[
                    { month: 'Nov', clients: 6, subs: 4 },
                    { month: 'Dec', clients: 11, subs: 8 },
                    { month: 'Jan', clients: 18, subs: 14 },
                    { month: 'Feb', clients: 25, subs: 19 },
                    { month: 'Mar', clients: 34, subs: 28 },
                    { month: 'Apr', clients: 42, subs: 36 },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2 group h-full justify-end">
                      <div className="w-full flex items-end justify-center gap-1 sm:gap-2.5 h-36">
                        {/* Client Bar */}
                        <div
                          className="w-3 sm:w-5 bg-gradient-to-t from-[#009688] to-teal-400 rounded-t-lg transition-all duration-300 group-hover:brightness-110 relative"
                          style={{ height: `${(item.clients / 50) * 100}%` }}
                        >
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-teal-800 bg-teal-50 px-1 rounded shadow-xs pointer-events-none whitespace-nowrap">
                            {item.clients}
                          </span>
                        </div>
                        {/* Subs Bar */}
                        <div
                          className="w-3 sm:w-5 bg-gradient-to-t from-[#0284C7] to-sky-400 rounded-t-lg transition-all duration-300 group-hover:brightness-110 relative"
                          style={{ height: `${(item.subs / 50) * 100}%` }}
                        >
                          <span className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-sky-800 bg-sky-50 px-1 rounded shadow-xs pointer-events-none whitespace-nowrap">
                            {item.subs}
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-slate-400 group-hover:text-slate-800 transition-colors">
                        {item.month}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      }
    }
    /* [DISABLED FOR FUTURE USE] Stray extra closing brace
    }
    */
  };

  const renderRightPanel = () => {
    switch (activeTab) {
      /* [DISABLED FOR FUTURE USE] Appointments Right Panel
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
      */

      /* [DISABLED FOR FUTURE USE] Medical Records Right Panel
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
      */

      /* [DISABLED FOR FUTURE USE] Hospital Facilities Right Panel
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
      */

      /* [DISABLED FOR FUTURE USE] Vendors Right Panel
      case 'Vendors':
        return null;
      */
      case 'Trainers':
      case 'Clients':
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
        /* [DISABLED FOR FUTURE USE] Dashboard Right Column (Upcoming Session, Hospital Location, Hospital Address)
        return (
          <div className="space-y-10">
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
        */
        return null;
    }
  };


  return (
    <div data-panel="admin" className="flex h-screen bg-transparent font-sans text-slate-900 overflow-hidden">
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
        fixed inset-y-0 left-0 z-50 w-64 bg-white/90 backdrop-blur-md border-r-2 border-teal-500/30 flex flex-col transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 shadow-lg shadow-teal-500/5
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

        {/* OLD CODE (commented by AI)
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
        */}
        {/* NEW CODE - Wellwigen Core Admin (Dashboard, Trainers, Classes & Schedule, Clients, Subscriptions, Inquiries, Settings) */}
        <nav className="flex-1 px-4 space-y-1.5 mt-4 overflow-y-auto">
          <AdminNavItem icon={<LayoutDashboard size={18} />} label="Dashboard" active={activeTab === 'Dashboard'} onClick={() => { setActiveTab('Dashboard'); setIsSidebarOpen(false); }} />
          <AdminNavItem icon={<Dumbbell size={18} />} label="Trainers" badge={trainersChecked ? 0 : pendingTrainersCount} active={activeTab === 'Trainers'} onClick={handleOpenTrainersTab} />
          {/* [DISABLED FOR FUTURE USE] Classes & Schedule Admin Nav Option
          <AdminNavItem icon={<Calendar size={18} />} label="Classes & Schedule" active={activeTab === 'Classes'} onClick={() => { setActiveTab('Classes'); setIsSidebarOpen(false); }} />
          */}
          <AdminNavItem icon={<Users size={18} />} label="Clients" active={activeTab === 'Clients'} onClick={() => { setActiveTab('Clients'); setIsSidebarOpen(false); }} />
          <AdminNavItem icon={<Ticket size={18} />} label="Memberships" active={activeTab === 'Subscriptions'} onClick={() => { setActiveTab('Subscriptions'); setIsSidebarOpen(false); }} />
          <AdminNavItem icon={<Inbox size={18} />} label="Inquiries" badge={inquiriesChecked ? 0 : newInquiriesCount} active={activeTab === 'Inquiries'} onClick={handleOpenInquiriesTab} />
          <AdminNavItem icon={<Settings size={18} />} label="Settings" active={activeTab === 'Settings'} onClick={() => { setActiveTab('Settings'); setIsSidebarOpen(false); }} />

          {/* [DISABLED FOR FUTURE USE] Sidebar Appointments Item
          <AdminNavItem icon={<Calendar size={18} />} label="Appointments" active={activeTab === 'Appointments'} onClick={() => { setActiveTab('Appointments'); setIsSidebarOpen(false); }} />
          */}

          {/* [DISABLED FOR FUTURE USE] Sidebar Records Item
          <AdminNavItem icon={<FileText size={18} />} label="Records" active={activeTab === 'Records'} onClick={() => { setActiveTab('Records'); setIsSidebarOpen(false); }} />
          */}

          {/* [DISABLED FOR FUTURE USE] Sidebar Facilities Item
          <AdminNavItem icon={<Building2 size={18} />} label="Facilities" active={activeTab === 'Facilities'} onClick={() => { setActiveTab('Facilities'); setIsSidebarOpen(false); }} />
          */}

          {/* [DISABLED FOR FUTURE USE] Sidebar Vendors Item
          <AdminNavItem icon={<Users size={18} />} label="Vendors" active={activeTab === 'Vendors'} onClick={() => { setActiveTab('Vendors'); setIsSidebarOpen(false); }} />
          */}
        </nav>

        <div className="p-4 border-t border-teal-500/20 bg-white/80 space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-white border border-teal-500/30 shadow-xs group hover:border-teal-500 transition-all">
            <div className="w-10 h-10 rounded bg-slate-900 flex items-center justify-center text-white font-bold text-xs">
              {user?.name?.substring(0, 2).toUpperCase() || 'AD'}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900 leading-none mb-1">{user?.name || 'System Admin'}</span>
              <span className="text-[10px] text-teal-600 font-bold uppercase tracking-widest">{user?.role || 'Superuser'}</span>
            </div>
          </div>
          <button 
            onClick={() => {
              localStorage.removeItem('adminToken');
              localStorage.removeItem('wellwigen_admin_user');
              logout();
              toast.success("Admin signed out successfully");
              navigate('/admin/login', { replace: true });
            }}
            className="w-full py-3 bg-white border border-teal-500/30 text-slate-600 rounded-xl text-xs font-bold hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <XCircle size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-transparent">
        {/* Header / Top Bar */}
        <div className="h-16 bg-white/90 backdrop-blur-md border-b-2 border-teal-500/30 sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8 shrink-0 shadow-xs shadow-teal-500/5">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-slate-500">
              <Menu size={24} />
            </button>
            <div className="relative hidden sm:block">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              {/* OLD CODE (commented by AI)
              <input 
                type="text" 
                placeholder="Search facilities, records..." 
                className="bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all w-64"
              />
              */}
              {/* NEW CODE - Trainer/Client search with SaaS kbd shortcut */}
              <input 
                type="text" 
                aria-label="Global search"
                placeholder="Search coaches, trainees, subscriptions..." 
                className="bg-slate-50 border border-slate-200/90 rounded-xl pl-9 pr-12 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all w-72"
              />
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded-md shadow-2xs pointer-events-none">
                ⌘K
              </kbd>
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

          {/* Top Bar Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Go to Website Option */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-600 text-teal-800 hover:text-white border border-teal-500/35 hover:border-teal-600 text-xs font-bold transition-all duration-200 shadow-2xs hover:shadow-sm hover:shadow-teal-600/20 group cursor-pointer"
              title="Open Public Website (Opens in new tab)"
            >
              <Globe size={15} className="text-teal-600 group-hover:text-white transition-colors shrink-0" />
              <span className="hidden sm:inline">Go to Website</span>
              <span className="sm:hidden text-[11px]">Website</span>
              <ExternalLink size={12} className="text-teal-500 group-hover:text-white/80 transition-colors shrink-0" />
            </a>

            <div className="flex items-center gap-2 relative">
              {/* Corner Bell Button with Live Notification Badge */}
              <div className="relative" ref={notificationsRef}>
                {(() => {
                  const displayInquiries = inquiriesChecked ? 0 : (newInquiriesCount || 0);
                  const displayTrainers = trainersChecked ? 0 : (pendingTrainersCount || 0);
                  const totalAlertsCount = displayInquiries + displayTrainers;
                  const isBlinking = !notificationsChecked && totalAlertsCount > 0;

                  return (
                    <>
                      <button 
                        onClick={() => {
                          const nextOpen = !isNotificationsOpen;
                          setIsNotificationsOpen(nextOpen);
                          setIsMessagesOpen(false);
                          if (nextOpen) {
                            setNotificationsChecked(true);
                            try {
                              localStorage.setItem('wellwigen_admin_notifications_checked', 'true');
                            } catch (e) {}
                          }
                        }}
                        className={`p-2.5 rounded-xl transition-all relative ${
                          isNotificationsOpen 
                            ? 'bg-teal-50 text-teal-700 ring-2 ring-teal-500/20' 
                            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                        title="Notifications & New Leads"
                      >
                        <Bell size={19} />
                        {totalAlertsCount > 0 && (
                          <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] px-1 items-center justify-center">
                            {isBlinking && (
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F26B38] opacity-75"></span>
                            )}
                            <span className="relative inline-flex rounded-full h-4 min-w-[16px] px-1 bg-gradient-to-r from-[#F26B38] to-[#E05B28] text-[10px] font-black text-white items-center justify-center shadow-sm">
                              {totalAlertsCount}
                            </span>
                          </span>
                        )}
                      </button>

                      {/* Smooth Slide-down Notifications Dropdown */}
                      <AnimatePresence>
                        {isNotificationsOpen && (
                          <>
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
                                      {totalAlertsCount > 0 ? (
                                        <span>
                                          {displayTrainers > 0 && (
                                            <span className="text-amber-700 font-bold">
                                              {displayTrainers} coach{displayTrainers > 1 ? 'es' : ''} awaiting approval
                                            </span>
                                          )}
                                          {displayTrainers > 0 && displayInquiries > 0 && ' • '}
                                          {displayInquiries > 0 && (
                                            <span>{displayInquiries} new leads</span>
                                          )}
                                        </span>
                                      ) : (
                                        'All caught up'
                                      )}
                                    </p>
                                  </div>
                                </div>
                                {totalAlertsCount > 0 && (
                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#F26B38] text-white">
                                    {totalAlertsCount} NEW
                                  </span>
                                )}
                              </div>

                              {/* Notifications List */}
                              <div className="max-h-96 overflow-y-auto divide-y divide-slate-50">
                                {/* COACH APPLICATIONS SECTION */}
                                {pendingTrainersList.length > 0 && (
                                  <div className="bg-amber-50/50 p-3 border-b border-amber-100">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                                        <Dumbbell size={13} className="text-amber-600 shrink-0" />
                                        <span>Coach Applications Awaiting Approval ({pendingTrainersList.length})</span>
                                      </span>
                                    </div>
                                    <div className="space-y-2">
                                      {pendingTrainersList.map((trn) => (
                                        <div
                                          key={trn._id || trn.id}
                                          onClick={handleOpenTrainersTab}
                                          className="p-2.5 rounded-xl bg-white border border-amber-200/90 shadow-2xs hover:border-teal-400 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3 group"
                                        >
                                          <div className="flex items-center gap-2.5 min-w-0">
                                            {trn.photoUrl ? (
                                              <img src={trn.photoUrl} alt="" className="w-9 h-9 rounded-xl object-cover border border-amber-200 shrink-0" />
                                            ) : (
                                              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                                                {trn.name ? trn.name.charAt(0).toUpperCase() : 'C'}
                                              </div>
                                            )}
                                            <div className="min-w-0">
                                              <p className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition-colors truncate">
                                                {trn.name}
                                              </p>
                                              <p className="text-[10px] text-slate-500 truncate">
                                                {trn.specialization || 'Strength & Conditioning'} • {trn.experience || '3-5 Yrs'}
                                              </p>
                                              <p className="text-[9px] font-mono font-semibold text-teal-700 mt-0.5">
                                                ID: {trn.applicationId || 'Submitted'}
                                              </p>
                                            </div>
                                          </div>
                                          <span className="px-2 py-1 rounded-lg text-[10px] font-extrabold bg-amber-500 hover:bg-amber-600 text-white shadow-2xs shrink-0 flex items-center gap-1 transition-colors">
                                            <span>Review</span>
                                            <ChevronRight size={11} />
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* CUSTOMER LEADS & INQUIRIES SECTION */}
                                {notifications.length > 0 && (
                                  notifications.map((item) => (
                                    <div
                                      key={item._id}
                                      onClick={handleOpenInquiriesTab}
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
                                )}

                                {pendingTrainersList.length === 0 && notifications.length === 0 && (
                                  <div className="py-10 text-center px-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
                                      <CheckCircle2 size={18} />
                                    </div>
                                    <p className="text-xs font-semibold text-slate-600">No pending notifications</p>
                                    <p className="text-[11px] text-slate-400 mt-0.5">New coach applications and customer leads will appear here instantly.</p>
                                  </div>
                                )}
                              </div>

                              {/* Dropdown Footer */}
                              <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2">
                                {pendingTrainersCount > 0 && (
                                  <button
                                    onClick={handleOpenTrainersTab}
                                    className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                                  >
                                    <Dumbbell size={13} />
                                    <span>Review Coaches ({pendingTrainersCount})</span>
                                  </button>
                                )}
                                <button
                                  onClick={handleOpenInquiriesTab}
                                  className="flex-1 py-2 bg-white border border-slate-200 hover:border-teal-300 hover:bg-teal-50/50 text-slate-800 hover:text-teal-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                                >
                                  <span>Inquiries ({newInquiriesCount})</span>
                                  <ChevronRight size={13} />
                                </button>
                              </div>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </>
                  );
                })()}
              </div>

              {/* Message Square Button */}
              <button 
                onClick={() => setActiveTab('Inquiries')}
                className="p-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                title="View Customer Messages & Inquiries"
                aria-label="View Customer Messages and Inquiries"
              >
                <MessageSquare size={19} />
              </button>

              <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

              {/* Top Bar Admin Profile Menu */}
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(!isProfileMenuOpen);
                    setIsNotificationsOpen(false);
                    setIsMessagesOpen(false);
                  }}
                  aria-label="Admin Profile Menu"
                  aria-expanded={isProfileMenuOpen}
                  className="flex items-center gap-2 p-1.5 hover:bg-slate-100/80 rounded-xl transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                    {user?.name?.substring(0, 2).toUpperCase() || 'AD'}
                  </div>
                  <div className="hidden md:flex flex-col text-left">
                    <span className="text-xs font-semibold text-slate-800 leading-tight">
                      {user?.name || 'Administrator'}
                    </span>
                    <span className="text-[10px] text-teal-600 font-bold uppercase tracking-wider">
                      {user?.role || 'Super Admin'}
                    </span>
                  </div>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180 text-teal-600' : ''}`} />
                </button>

                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <>
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 p-2 overflow-hidden ring-1 ring-black/5"
                      >
                        <div className="p-3 bg-slate-50 rounded-xl mb-1 border border-slate-100">
                          <p className="text-xs font-bold text-slate-900">{user?.name || 'Administrator'}</p>
                          <p className="text-[11px] text-slate-500 truncate">{user?.email || 'wellwigen@gmail.com'}</p>
                          <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-teal-50 text-teal-700 border border-teal-200/60 uppercase tracking-wider">
                            Verified Admin
                          </span>
                        </div>

                        <div className="space-y-0.5">
                          <button
                            onClick={() => {
                              setActiveTab('Settings');
                              setIsProfileMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-teal-700 hover:bg-teal-50/50 transition-colors cursor-pointer"
                          >
                            <Settings size={15} className="text-slate-400" />
                            Platform Settings
                          </button>
                          <a
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-teal-700 hover:bg-teal-50/50 transition-colors"
                          >
                            <ExternalLink size={15} className="text-slate-400" />
                            View Public Site
                          </a>
                        </div>

                        <div className="pt-1 mt-1 border-t border-slate-100">
                          <button
                            onClick={() => {
                              localStorage.removeItem('adminToken');
                              localStorage.removeItem('wellwigen_admin_user');
                              logout();
                              toast.success("Admin signed out successfully");
                              navigate('/admin/login', { replace: true });
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <XCircle size={15} className="text-rose-500" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
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
                    className="w-full lg:w-96 bg-white/95 backdrop-blur-md border-l-2 border-teal-500/30 overflow-y-auto p-8 shrink-0 transition-all duration-300 shadow-xl shadow-teal-500/5"
                  >
                    {panel}
                  </motion.div>
                )}
              </AnimatePresence>
            );
          })()}
      </div>

      {/* ================= REJECT TRAINER CONFIRMATION DIALOG ================= */}
      <AnimatePresence>
        {rejectModalTrainer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
              onClick={() => !isRejectingLoading && setRejectModalTrainer(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 z-10 overflow-hidden"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">Reject Coach Application</h3>
                  <p className="text-xs text-slate-500">Provide feedback for applicant {rejectModalTrainer.name}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <label className="text-xs font-semibold text-slate-700">
                  Rejection Reason / Guidance:
                </label>
                <textarea
                  value={rejectReasonText}
                  onChange={(e) => setRejectReasonText(e.target.value)}
                  rows={3}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-slate-800"
                  placeholder="Provide instructions to the applicant..."
                />
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Certification document is illegible',
                    'Missing athletic accreditation',
                    'Intro video link inaccessible',
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setRejectReasonText(preset)}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  disabled={isRejectingLoading}
                  onClick={() => setRejectModalTrainer(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isRejectingLoading || !rejectReasonText.trim()}
                  onClick={handleConfirmReject}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {isRejectingLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Rejecting...</span>
                    </>
                  ) : (
                    <span>Confirm Rejection</span>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
