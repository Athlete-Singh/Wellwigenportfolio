import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Users,
  Tag,
  ShieldCheck,
  Settings,
  HelpCircle,
  LogOut,
  Sparkles,
  Activity,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar() {
  const location = useLocation();
  const [pendingCount, setPendingCount] = useState(0);

  /* [DISABLED FOR FUTURE USE] Pending Vendor Fetch
  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}/api/vendor/all`);
        const data = await res.json();
        const pending = (data.vendors || []).filter(v => v.status === "pending").length;
        setPendingCount(pending);
      } catch (err) {
        console.error("Failed to fetch pending vendors:", err);
      }
    };
    fetchPending();
  }, [location.pathname]);
  */

  const navItems = [
    { name: "Overview", icon: LayoutDashboard, route: "/admin" },
    /* [DISABLED FOR FUTURE USE] Appointments Nav Item
    { name: "Appointments", icon: Calendar, route: "/admin/appointments" },
    */
    /* [DISABLED FOR FUTURE USE] Medical Records Nav Item
    { name: "Medical Records", icon: FileText, route: "/admin/medical-records" },
    */
    /* [DISABLED FOR FUTURE USE] Vendor Partners Nav Item
    { name: "Vendor Partners", icon: Users, route: "/admin/vendors" },
    */
    /* [DISABLED FOR FUTURE USE] Health Categories Nav Item
    { name: "Health Categories", icon: Tag, route: "/admin/categories" },
    */
    { name: "Subscription Plans", icon: Sparkles, route: "/admin/subscriptions" },
    { name: "System Config", icon: Settings, route: "/admin/settings" },
  ];


  return (
    <aside className="w-72 min-h-screen bg-[#0F172A] border-r border-slate-800 flex flex-col sticky top-0 h-screen overflow-hidden font-sans text-slate-400">
      
      {/* BRANDING */}
      <div className="p-8 pb-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
            <Zap size={20} fill="currentColor" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white tracking-tight leading-none">Wellwigen</h1>
            <p className="text-[9px] font-bold text-teal-500 uppercase tracking-widest mt-1.5">Network Command</p>
          </div>
        </div>
      </div>

      {/* CORE STATS (SNEAK PEEK) */}
      <div className="px-8 mb-8">
        <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-700/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Live Traffic</span>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-teal-500">Normal</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-white">1.2k</span>
            <span className="text-[10px] font-bold text-emerald-500">+12%</span>
          </div>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 space-y-1 px-4 overflow-y-auto custom-scrollbar">
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 px-4">Operations Control</p>
        {navItems.map((item, i) => {
          const isActive = location.pathname === item.route;
          return (
            <Link to={item.route} key={i} className="block">
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group ${isActive ? "bg-teal-500/10 text-teal-400" : "hover:bg-slate-800/50 hover:text-white"}`}>
                <item.icon size={18} className={`${isActive ? "text-teal-400" : "text-slate-500 group-hover:text-slate-300"}`} />
                <span className="text-xs font-bold tracking-wide">{item.name}</span>
                
                {item.name === "Vendor Partners" && pendingCount > 0 && (
                  <span className={`ml-auto px-2 py-0.5 rounded-md text-[9px] font-black ${isActive ? "bg-teal-500 text-slate-900" : "bg-teal-500/20 text-teal-400"}`}>
                    {pendingCount}
                  </span>
                )}

                {isActive && <motion.div layoutId="nav-glow-admin" className="absolute left-0 w-1 h-5 bg-teal-500 rounded-r-full" />}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* FOOTER ACTIONS */}
      <div className="p-6 border-t border-slate-800 space-y-1 bg-slate-900/50">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-800 hover:text-white transition-all font-bold text-xs group">
          <HelpCircle size={18} className="text-slate-600 group-hover:text-slate-400" />
          Support Terminal
        </button>

        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-rose-500/10 hover:text-rose-500 transition-all font-bold text-xs group">
          <LogOut size={18} className="text-slate-600 group-hover:text-rose-500" />
          Terminate Session
        </button>
      </div>
    </aside>
  );
}