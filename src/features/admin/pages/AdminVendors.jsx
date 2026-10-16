import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  PlusIcon, 
  CheckIcon, 
  XMarkIcon, 
  BuildingStorefrontIcon, 
  CheckBadgeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  UserIcon,
  ArrowRightIcon,
  SparklesIcon,
  EllipsisVerticalIcon
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function AdminVendors() {
  const [vendors, setVendors] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", password: "", storeName: "", storeAddress: "", phone: ""
  });
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

  const fetchVendors = async () => {
    try {
      const res = await axios.get(`${API}/vendor/all`);
      setVendors(res.data.vendors || []);
    } catch (err) {
      console.warn("Could not sync vendor database (passive notice):", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleApprove = async (id, status) => {
    try {
      await axios.put(`${API}/vendor/approve/${id}`, { status });
      toast.success(status === "approved" ? "Business account authorized" : "Application declined");
      fetchVendors();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/vendor/admin/add`, form);
      setShowAddModal(false);
      toast.success("New store established successfully");
      fetchVendors();
      setForm({ name: "", email: "", password: "", storeName: "", storeAddress: "", phone: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding vendor");
    }
  };

  const pendingVendors = vendors.filter(v => v.status === "pending");
  const approvedVendors = vendors.filter(v => v.status === "approved");

  return (
    <div className="min-h-screen bg-[#FDFEFF] p-6 md:p-12 font-sans selection:bg-teal-100 selection:text-teal-900">
      <div className="max-w-7xl mx-auto">
        
        {/* HERO SECTION */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-12 h-[2px] bg-slate-900"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Network Control</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none mb-6">
              Vendor <br/>
              <span className="text-teal-600">Ecosystem.</span>
            </h1>
            <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-lg">
              Authorized gateways for local health stores and professional partners to join the Wellwigen infrastructure.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-3 bg-slate-900 text-white px-10 py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-widest hover:bg-teal-600 hover:shadow-2xl hover:shadow-teal-100 transition-all active:scale-95 shadow-xl"
            >
              <PlusIcon className="w-6 h-6" /> Initialize New Store
            </button>
          </div>
        </header>

        {/* STATS HUB */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <StatCard label="Live Partners" value={approvedVendors.length} icon={<BuildingStorefrontIcon className="w-6 h-6 text-teal-600"/>} color="bg-teal-50" />
          <StatCard label="Pending Review" value={pendingVendors.length} icon={<ClockIcon className="w-6 h-6 text-amber-600"/>} color="bg-amber-50" />
          <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-teal-500/20 rounded-full blur-3xl group-hover:bg-teal-500/40 transition-colors duration-700"></div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Growth Rate</h4>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-black">+14%</span>
              <span className="text-xs font-bold text-teal-400 mb-2">this month</span>
            </div>
          </div>
        </div>

        {/* TABS & FILTERS */}
        <div className="bg-white/50 backdrop-blur-xl rounded-[3rem] border border-slate-100 p-4 mb-12 flex flex-wrap items-center justify-between gap-6 shadow-sm">
          <div className="flex gap-2">
            <TabButton active={activeTab === "pending"} onClick={() => setActiveTab("pending")} label="Pending" count={pendingVendors.length} />
            <TabButton active={activeTab === "approved"} onClick={() => setActiveTab("approved")} label="Authorized" count={approvedVendors.length} />
          </div>

          <div className="relative flex-1 max-w-md hidden md:block">
            <MagnifyingGlassIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
            <input type="text" placeholder="Search partner network..." className="w-full pl-14 pr-8 py-5 bg-white border border-slate-50 rounded-[2rem] outline-none focus:ring-4 focus:ring-teal-600/5 transition-all text-sm font-medium shadow-inner" />
          </div>
        </div>

        {/* VENDOR GRID */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-16 h-16 border-[6px] border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 animate-pulse">Scanning Network Nodes</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence mode="popLayout">
              {(activeTab === "pending" ? pendingVendors : approvedVendors).map((vendor, i) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05 } }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={vendor._id}
                  className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-xl shadow-slate-100/30 hover:shadow-2xl hover:shadow-teal-100/50 transition-all group relative overflow-hidden flex flex-col"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -mr-16 -mt-16 group-hover:bg-teal-50 transition-colors duration-500 -z-10"></div>
                  
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-20 h-20 bg-white rounded-3xl shadow-xl border border-slate-50 flex items-center justify-center font-black text-3xl text-slate-900 group-hover:scale-110 transition-transform duration-500 shadow-teal-100/20">
                      {(vendor.storeName || vendor.name || "V").charAt(0).toUpperCase()}
                    </div>
                    <div className="px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      ID: #{vendor._id.toString().substring(20)}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-3xl font-black text-slate-900 mb-2 tracking-tight leading-tight">{vendor.storeName || "Unnamed Node"}</h3>
                    <div className="flex items-center gap-2 mb-8">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                      <p className="text-xs font-black text-teal-600 uppercase tracking-widest">{vendor.name}</p>
                    </div>

                    <div className="space-y-4 mb-10">
                      <DetailRow icon={<EnvelopeIcon className="w-4 h-4"/>} text={vendor.email} />
                      <DetailRow icon={<PhoneIcon className="w-4 h-4"/>} text={vendor.phone} />
                      <DetailRow icon={<MapPinIcon className="w-4 h-4"/>} text={vendor.storeAddress} />
                    </div>
                  </div>

                  {activeTab === "pending" ? (
                    <div className="flex gap-3 pt-8 border-t border-slate-50">
                      <button 
                        onClick={() => handleApprove(vendor._id, 'approved')}
                        className="flex-1 py-4 bg-teal-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-teal-100"
                      >
                        Authorize
                      </button>
                      <button 
                        onClick={() => handleApprove(vendor._id, 'rejected')}
                        className="flex-1 py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 transition-all"
                      >
                        Decline
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between pt-8 border-t border-slate-50 mt-auto">
                      <div className="flex items-center gap-2">
                        <CheckBadgeIcon className="w-5 h-5 text-teal-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Active Node</span>
                      </div>
                      <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition-all">
                        <ArrowRightIcon className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[4rem] p-12 md:p-16 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-3 bg-teal-600"></div>
              
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">Onboard Partner</h2>
                  <p className="text-sm text-slate-400 font-medium mt-1">Manual node initialization for the ecosystem.</p>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-4 bg-slate-50 rounded-3xl text-slate-400 hover:text-slate-600 transition-all">
                  <XMarkIcon className="w-7 h-7" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormInput label="Full Name" value={form.name} onChange={v => setForm({...form, name: v})} placeholder="John Doe" />
                  <FormInput label="Security Email" value={form.email} onChange={v => setForm({...form, email: v})} placeholder="john@wellwigen.com" type="email" />
                  <FormInput label="Access Key" value={form.password} onChange={v => setForm({...form, password: v})} placeholder="••••••••" type="password" />
                  <FormInput label="Contact Phone" value={form.phone} onChange={v => setForm({...form, phone: v})} placeholder="+91 00000 00000" />
                  <FormInput label="Store Title" value={form.storeName} onChange={v => setForm({...form, storeName: v})} placeholder="Fresh Grocers" />
                  <FormInput label="Deployment Address" value={form.storeAddress} onChange={v => setForm({...form, storeAddress: v})} placeholder="123 Health St." />
                </div>

                <div className="flex gap-4 pt-6">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-6 bg-slate-50 text-slate-500 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all">Cancel</button>
                  <button type="submit" className="flex-[2] py-6 bg-teal-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:shadow-2xl hover:shadow-teal-100 transition-all shadow-xl">
                    Deploy Authorized Store
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

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm group hover:shadow-xl hover:-translate-y-1 transition-all">
      <div className={`w-16 h-16 ${color} rounded-[2rem] flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform`}>
        {icon}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
      <h4 className="text-4xl font-black text-slate-900 tracking-tight">{value}</h4>
    </div>
  );
}

function TabButton({ active, onClick, label, count }) {
  return (
    <button 
      onClick={onClick}
      className={`px-8 py-5 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all ${active ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"}`}
    >
      {label} {count !== undefined && <span className={`ml-2 text-[10px] ${active ? "text-teal-400" : "text-slate-300"}`}>({count})</span>}
    </button>
  );
}

function DetailRow({ icon, text }) {
  return (
    <div className="flex items-center gap-3 group/row">
      <div className="text-slate-300 group-hover/row:text-teal-500 transition-colors">{icon}</div>
      <p className="text-xs font-bold text-slate-500 group-hover/row:text-slate-800 transition-colors truncate">{text}</p>
    </div>
  );
}

function FormInput({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{label}</label>
      <input 
        type={type}
        required
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-8 py-5 bg-slate-50 border border-slate-50 rounded-[2rem] focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-600/5 transition-all outline-none font-bold text-slate-800"
      />
    </div>
  );
}

function ClockIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}
