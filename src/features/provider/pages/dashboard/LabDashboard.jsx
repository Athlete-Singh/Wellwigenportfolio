import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FlaskConical,
  Bell,
  ChevronRight,
  LogOut,
  LayoutDashboard,
  Users,
  Settings,
  Activity,
  AlertCircle,
  Clock,
  CheckCircle2,
  Calendar,
  Zap,
  ShoppingBag,
  BarChart,
  Award,
  HelpCircle,
  ShieldCheck,
  User,
  Search,
  Menu,
  Send,
  FileCheck,
  TestTube2,
  X as CloseIcon,
  Activity as ActivityIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from "socket.io-client";
import { getSocketUrl } from '../../../../config/socket';
import toast, { Toaster } from 'react-hot-toast';

const NavItem = ({ icon: Icon, label, active, onClick, badge }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
      active 
        ? 'bg-[#eef2ff] text-blue-700' 
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    <Icon size={18} />
    <span className="flex-1 text-left">{label}</span>
    {badge > 0 && (
      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
        {badge}
      </span>
    )}
  </button>
);

const StatCard = ({ label, value, trend, icon, positive = true }) => (
  <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="text-blue-600">{icon}</div>
      <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
        positive ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
      }`}>
        {trend}
      </span>
    </div>
    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{label}</p>
    <h4 className="text-2xl font-bold text-gray-900 mt-1 tracking-tight">{value}</h4>
  </div>
);

const LabDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const handleSignOut = () => {
    localStorage.clear();
    toast.success("Signing out...");
    setTimeout(() => navigate('/vendor/login'), 1000);
  };

  const socketRef = useRef(null);
  const API = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
  const providerInfo = JSON.parse(localStorage.getItem("providerInfo") || localStorage.getItem("vendorInfo") || "{}");
  const providerName = providerInfo.businessName || 'Wellwigen Diagnostic Center';

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API}/orders/vendor-live`).catch(() => ({ data: { orders: [] } }));
      const allOrders = res.data.orders || [];
      
      const labOrders = allOrders
        .filter(o => o.type === 'lab_test')
        .map(o => ({
          id: o._id,
          customer: o.userId?.name || 'Suresh Kumar',
          tests: o.items?.[0]?.name || 'HbA1c + FBS + Lipid Panel',
          price: `₹${o.totalAmount || '799'}`,
          status: o.status,
          displayStatus: o.status === 'delivered' ? 'REPORT SENT' : 
                         o.status === 'out_for_delivery' ? 'REPORT READY' : 
                         'REPORT PENDING',
          statusColor: o.status === 'delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 
                       o.status === 'out_for_delivery' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 
                       'bg-amber-50 text-amber-700 border border-amber-100'
        }));

      setOrders(labOrders.length > 0 ? labOrders : [
        { id: 'mock-1', customer: 'Suresh Kumar', tests: 'HbA1c + FBS + Lipid Panel', price: '₹799', status: 'out_for_delivery', displayStatus: 'REPORT READY', statusColor: 'bg-blue-50 text-blue-700 border border-blue-100' },
        { id: 'mock-2', customer: 'Meera Jain', tests: 'CBC + Electrolytes - Home', price: '₹450', status: 'pending', displayStatus: 'REPORT PENDING', statusColor: 'bg-amber-50 text-amber-700 border border-amber-100' }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    if (orderId.startsWith('mock-')) {
      setOrders(prev => prev.map(o => o.id === orderId ? { 
        ...o, 
        status: newStatus,
        displayStatus: newStatus === 'delivered' ? 'REPORT SENT' : newStatus === 'out_for_delivery' ? 'REPORT READY' : 'REPORT PENDING',
        statusColor: newStatus === 'delivered' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 
                     newStatus === 'out_for_delivery' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 
                     'bg-amber-50 text-amber-700 border border-amber-100'
      } : o));
      toast.success(`Status updated to ${newStatus}`);
      return;
    }

    try {
      const res = await axios.put(`${API}/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        toast.success("Syncing status with patient...");
        fetchOrders();
      }
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchOrders();
    const socketBaseUrl = getSocketUrl();
    if (!socketBaseUrl) return;
    const socket = io(socketBaseUrl, { transports: ["websocket", "polling"], reconnectionAttempts: 5 });
    socketRef.current = socket;

    socket.on("connect", () => setSocketConnected(true));
    socket.on("labReminder", () => fetchOrders());
    socket.on("newOrder", () => fetchOrders());

    return () => socket.disconnect();
  }, [API]);

  return (
    <div className="flex h-screen bg-[#f9fafb] font-sans text-slate-900 overflow-hidden">
      <Toaster position="top-right" />

      {/* Sidebar - Vendor Style */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#f8f9fa] border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">W</div>
            <span className="font-bold text-gray-900 tracking-tight text-sm">Wellwigen <span className="text-blue-600 font-semibold">Portal</span></span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-500 hover:bg-white rounded">
            <CloseIcon size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
          <NavItem icon={LayoutDashboard} label="Overview" active={activeTab === 'Overview'} onClick={() => setActiveTab('Overview')} />
          <NavItem icon={ShoppingBag} label="Test Queue" active={activeTab === 'Orders'} badge={orders.length} onClick={() => setActiveTab('Orders')} />
          <NavItem icon={Users} label="Patients" active={activeTab === 'Patients'} onClick={() => setActiveTab('Patients')} />
          <NavItem icon={ActivityIcon} label="Growth Insights" active={activeTab === 'Insights'} onClick={() => setActiveTab('Insights')} />
          <NavItem icon={Settings} label="Settings" active={activeTab === 'Settings'} onClick={() => setActiveTab('Settings')} />
        </nav>

        <div className="p-4 border-t border-gray-200 bg-[#f8f9fa]">
          <button 
            onClick={() => setActiveTab('Account')}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              activeTab === 'Account' ? 'bg-[#eef2ff]' : 'hover:bg-white'
            }`}
          >
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-slate-400 border border-gray-200">
                <User size={20} />
              </div>
            </div>
            <div className="flex flex-col items-start overflow-hidden text-left">
              <span className={`text-xs font-semibold truncate w-full ${activeTab === 'Account' ? 'text-blue-900' : 'text-gray-900'}`}>Lab Manager</span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Settings</span>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-slate-500">
              <Menu size={24} />
            </button>
            <span className="font-bold text-gray-900 text-sm">Wellwigen</span>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-100 pb-6 gap-4">
            <div>
              <h1 className="text-xl lg:text-2xl font-semibold text-slate-900">
                {activeTab === 'Orders' ? 'Test Queue' : 'Lab Dashboard'}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {providerName} · Diagnostic Command Center
              </p>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
              {/* Socket Status */}
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded border text-[10px] font-black uppercase tracking-wider transition-all ${socketConnected ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${socketConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                {socketConnected ? 'Live' : 'Offline'}
              </div>

              <button className="p-2 bg-white border border-gray-200 rounded text-slate-500 hover:text-blue-600 transition relative">
                <Bell size={18} />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              </button>
              <button onClick={handleSignOut} className="p-2 bg-white border border-gray-200 rounded text-slate-500 hover:text-red-600 transition">
                <LogOut size={18} />
              </button>
            </div>
          </header>

          <AnimatePresence mode="wait">
            {activeTab === 'Overview' || activeTab === 'Orders' ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                {/* Stats Grid - Vendor Style */}
                <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-4">
                  <StatCard label="Total Tests" value="1,248" trend="+12%" icon={<ActivityIcon size={20} />} />
                  <StatCard label="Pending" value={String(orders.filter(o => o.status !== 'delivered').length)} trend="Action Required" icon={<Clock size={20} />} positive={orders.length === 0} />
                  <StatCard label="Patients" value="48" trend="+5.4%" icon={<Users size={20} />} />
                  <StatCard label="Revenue" value="₹68.2k" trend="+24%" icon={<Award size={20} />} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h3 className="font-semibold text-gray-900 text-sm">Today's Test Queue</h3>
                        <div className="flex gap-2">
                           <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded">Live Sync</span>
                        </div>
                      </div>
                      <div className="p-0">
                        {orders.length === 0 ? (
                          <div className="py-24 text-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto mb-4">
                              <FlaskConical size={32} />
                            </div>
                            <h3 className="text-slate-900 font-bold text-sm uppercase tracking-widest mb-2">No Active Tests</h3>
                            <p className="text-slate-400 text-xs font-semibold">New diagnostic orders will appear here in real-time.</p>
                          </div>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="bg-gray-50/30 border-b border-gray-100">
                                  <th className="py-3 px-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Patient</th>
                                  <th className="py-3 px-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Test Details</th>
                                  <th className="py-3 px-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Action</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                {orders.map((order) => (
                                  <tr key={order.id} className="group hover:bg-blue-50/30 transition-colors">
                                    <td className="py-4 px-6">
                                      <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all font-bold text-xs border border-gray-100">
                                          {order.customer.charAt(0)}
                                        </div>
                                        <div>
                                          <span className="text-sm font-semibold text-gray-900">{order.customer}</span>
                                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">ID: {order.id.slice(-6).toUpperCase()}</p>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="py-4 px-6">
                                      <div className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">{order.tests}</span>
                                        <div className="flex items-center gap-2 mt-1">
                                          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${order.statusColor}`}>
                                            {order.displayStatus}
                                          </span>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="py-4 px-6">
                                      <div className="flex items-center justify-end gap-2">
                                        {order.status === 'pending' && (
                                          <button
                                            onClick={() => updateStatus(order.id, 'out_for_delivery')}
                                            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-[10px] font-black uppercase tracking-wider flex items-center gap-2"
                                          >
                                            <Zap size={11} /> Ready
                                          </button>
                                        )}
                                        {order.status === 'out_for_delivery' && (
                                          <button
                                            onClick={() => updateStatus(order.id, 'delivered')}
                                            className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all text-[10px] font-black uppercase tracking-wider flex items-center gap-2"
                                          >
                                            <Send size={11} /> Send
                                          </button>
                                        )}
                                        {order.status === 'delivered' && (
                                          <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 text-[10px] font-black uppercase tracking-widest">
                                            <CheckCircle2 size={12} /> Sent
                                          </div>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sidebar Widget - Vendor Style */}
                  <div className="space-y-6">
                    <div className="bg-slate-900 rounded-lg p-6 text-white shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                      <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4 border-b border-white/10 pb-4">Diagnostic Tools</h3>
                      <p className="text-slate-400 text-sm mb-6 leading-relaxed">Upgrade your sequencing equipment with our latest automated laboratory kits.</p>
                      <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-all">
                        Browse Kits
                      </button>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Test Accuracy</h3>
                      <div className="space-y-4">
                        {[
                          { label: 'Diabetes Panel', val: '98%', color: 'bg-blue-600' },
                          { label: 'Lipid Profile', val: '96%', color: 'bg-emerald-500' },
                          { label: 'Thyroid Care', val: '94%', color: 'bg-amber-500' }
                        ].map(stat => (
                          <div key={stat.label}>
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</span>
                              <span className="text-[10px] font-black text-slate-900">{stat.val}</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div className={`h-full ${stat.color}`} style={{ width: stat.val }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                 <div className="w-20 h-20 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center text-slate-300 mb-6">
                    <LayoutDashboard size={32} />
                 </div>
                 <h2 className="text-xl font-bold text-slate-900 mb-2">{activeTab} coming soon</h2>
                 <p className="text-sm text-slate-500 max-w-sm mx-auto">This module is currently under development to provide a more comprehensive laboratory management experience.</p>
                 <button onClick={() => setActiveTab('Overview')} className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold">Back to Overview</button>
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default LabDashboard;
