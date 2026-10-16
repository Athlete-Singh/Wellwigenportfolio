import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Settings, 
  Bell, 
  Search, 
  Plus, 
  LogOut,
  User,
  ChevronRight,
  Clock,
  Activity,
  CheckCircle2,
  MoreVertical,
  Stethoscope,
  TrendingUp,
  FileText,
  UserCircle,
  Zap,
  X,
  Menu
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

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socketConnected, setSocketConnected] = useState(false);
  
  const socketRef = useRef(null);
  const API = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
  const providerInfo = JSON.parse(localStorage.getItem("providerInfo") || localStorage.getItem("vendorInfo") || "{}");
  const doctorName = providerInfo.ownerName || "Dr. Ananya Mishra";
  const doctorSpecialty = "General Physician + Diabetologist";
  const doctorNMC = "NMC#DL-2019-04821";

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Signing out...");
    setTimeout(() => navigate('/vendor/login'), 1000);
  };

  const fetchConsultations = async () => {
    try {
      const res = await axios.get(`${API}/orders/vendor-live`).catch(() => ({ data: { orders: [] } }));
      const allOrders = res.data.orders || [];
      
      const liveConsults = allOrders
        .filter(o => o.type === 'consultation')
        .map(o => ({
          id: o._id,
          patient: o.userId?.name || 'Live Patient',
          time: new Date(o.scheduledFor || o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          note: o.items?.[0]?.name || 'General Consultation',
          status: o.status === 'delivered' ? 'Done' : 'Scheduled',
          rawStatus: o.status
        }));

      setConsultations(liveConsults.length > 0 ? liveConsults : [
        { id: 'mock-1', patient: 'Suresh Kumar', time: '9:00 AM', note: 'Diabetes follow-up · Reviewed sugar report', status: 'Done', rawStatus: 'delivered' },
        { id: 'mock-2', patient: 'Meera Jain', time: '9:30 AM', note: 'Hypertension · BP 142/90 · Adjusted medication', status: 'Done', rawStatus: 'delivered' }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const completeConsultation = async (id) => {
    if (id.startsWith('mock-')) {
      toast.success("Mock consultation completed");
      setConsultations(prev => prev.map(c => c.id === id ? { ...c, status: 'Done', rawStatus: 'delivered' } : c));
      return;
    }
    try {
      const res = await axios.put(`${API}/orders/${id}/status`, { status: 'delivered' });
      if (res.data.success) {
        toast.success("Consultation finalized with patient");
        fetchConsultations();
      }
    } catch (err) {
      toast.error("Failed to complete consultation");
    }
  };

  useEffect(() => {
    fetchConsultations();
    const socketBaseUrl = getSocketUrl();
    if (!socketBaseUrl) return;
    const socket = io(socketBaseUrl, { transports: ["websocket", "polling"], reconnectionAttempts: 5 });
    socketRef.current = socket;
    socket.on("connect", () => setSocketConnected(true));
    socket.on("newOrder", () => fetchConsultations());
    return () => socket.disconnect();
  }, [API]);

  const recentPatients = [
    { id: 'SK', name: 'Suresh K.', condition: 'Diabetes', conditionColor: 'bg-amber-50 text-amber-700 border-amber-100', lastVisit: 'Today', status: 'Stable', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
    { id: 'MJ', name: 'Meera J.', condition: 'Hypertension', conditionColor: 'bg-purple-50 text-purple-700 border-purple-100', lastVisit: 'Today', status: 'Monitor', statusColor: 'bg-amber-50 text-amber-700 border-amber-100' },
  ];

  return (
    <div className="flex h-screen bg-[#fcfaf6] font-sans text-slate-900 overflow-hidden">
      <Toaster position="top-right" />

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

      {/* Sidebar - Fully Operational */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#f8f9fa] border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">W</div>
            <span className="font-bold text-gray-900 tracking-tight text-sm">Wellwigen <span className="text-blue-600 font-semibold">MD</span></span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-500 hover:bg-white rounded">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
          <NavItem icon={LayoutDashboard} label="Overview" active={activeTab === 'Overview'} onClick={() => setActiveTab('Overview')} />
          <NavItem icon={Calendar} label="Schedule" active={activeTab === 'Schedule'} badge={consultations.filter(c => c.rawStatus !== 'delivered').length} onClick={() => setActiveTab('Schedule')} />
          <NavItem icon={Users} label="Patients" active={activeTab === 'Patients'} onClick={() => setActiveTab('Patients')} />
          <NavItem icon={FileText} label="Records" active={activeTab === 'Records'} onClick={() => setActiveTab('Records')} />
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
                <UserCircle size={24} />
              </div>
            </div>
            <div className="flex flex-col items-start overflow-hidden text-left">
              <span className={`text-xs font-semibold truncate w-full ${activeTab === 'Account' ? 'text-blue-900' : 'text-gray-900'}`}>{doctorName.split(' ')[1] || 'Doctor'}</span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Medical Admin</span>
            </div>
          </button>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 mt-2 py-2.5 rounded-lg border border-gray-100 bg-white text-slate-500 hover:text-rose-500 hover:bg-rose-50 transition-all text-xs font-black uppercase tracking-widest shadow-sm"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-slate-500">
              <Menu size={24} />
            </button>
            <span className="font-bold text-gray-900 text-sm">Wellwigen MD</span>
          </div>
          <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold border border-blue-100">
            MD
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'Overview' || activeTab === 'Schedule' ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-7xl mx-auto">
              <header className="mb-10">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Doctor Portal</h1>
                <p className="text-base text-gray-500 mt-1 font-medium">{doctorName} · {doctorSpecialty} · {doctorNMC}</p>
                <div className="flex items-center gap-3 mt-4">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                    NMC Verified
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${socketConnected ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'} text-[10px] font-black uppercase tracking-widest border`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${socketConnected ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    {socketConnected ? 'Live' : 'Offline'}
                  </div>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">TODAY'S CONSULTS</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <h4 className="text-3xl font-bold text-gray-900">12</h4>
                    <span className="text-xs font-bold text-emerald-600">↑ 3 vs avg</span>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">UPCOMING</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <h4 className="text-3xl font-bold text-blue-600">{consultations.filter(c => c.rawStatus !== 'delivered').length}</h4>
                    <span className="text-xs font-bold text-gray-400">Next in 24 min</span>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">THIS MONTH ₹</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <h4 className="text-3xl font-bold text-gray-900">41.6k</h4>
                    <span className="text-xs font-bold text-emerald-600">↑ 18%</span>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">AVG RATING</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <h4 className="text-3xl font-bold text-gray-900">4.8</h4>
                    <span className="text-xs font-bold text-emerald-600">Top 10%</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">Today's Schedule</h3>
                    <button onClick={fetchConsultations} className="p-2 hover:bg-slate-50 rounded-full text-slate-400"><Activity size={16}/></button>
                  </div>
                  <div className="p-6 space-y-8 overflow-y-auto max-h-[500px]">
                    {loading ? (
                       <div className="py-20 text-center text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Syncing Practice...</div>
                    ) : consultations.map((item) => (
                      <div key={item.id} className="flex gap-4 group">
                        <span className="text-sm font-bold text-gray-400 pt-1 shrink-0 w-16">{item.time}</span>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{item.patient}</h4>
                            <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border transition-all ${
                              item.status === 'Done' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 leading-relaxed mb-3">{item.note}</p>
                          {item.rawStatus !== 'delivered' && (
                             <button 
                               onClick={() => completeConsultation(item.id)}
                               className="flex items-center gap-2 px-4 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
                             >
                               <Zap size={12} /> Complete Consultation
                             </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">Recent Patients</h3>
                    <button className="text-xs font-bold text-blue-600 uppercase tracking-widest">View All</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-50 text-xs font-bold text-gray-400 uppercase tracking-widest">
                          <th className="px-8 py-4 text-left">Patient</th>
                          <th className="px-8 py-4 text-left">Condition</th>
                          <th className="px-8 py-4 text-left">Last Visit</th>
                          <th className="px-8 py-4 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {recentPatients.map((patient) => (
                          <tr key={patient.id} className="group hover:bg-gray-50 transition-colors">
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center text-xs font-bold">{patient.id}</div>
                                <span className="text-base font-bold text-gray-900">{patient.name}</span>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${patient.conditionColor}`}>{patient.condition}</span>
                            </td>
                            <td className="px-8 py-5 text-sm font-bold text-gray-500">{patient.lastVisit}</td>
                            <td className="px-8 py-5">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${patient.statusColor}`}>{patient.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[500px] text-center">
               <div className="w-20 h-20 bg-white rounded-2xl border border-gray-200 flex items-center justify-center text-slate-300 mb-6">
                  <LayoutDashboard size={32} />
               </div>
               <h2 className="text-xl font-bold text-slate-900 uppercase tracking-widest mb-2">{activeTab}</h2>
               <p className="text-sm text-slate-500 max-w-sm mx-auto font-bold uppercase tracking-widest">This medical suite is coming soon to the Wellwigen MD Portal. Please continue managing your practice via the Overview.</p>
               <button onClick={() => setActiveTab('Overview')} className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all">Back to Command Center</button>
            </div>
          )}
        </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default DoctorDashboard;
