import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Dumbbell,
  Users,
  Calendar,
  User,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X as CloseIcon,
  Bell,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { trainerApi } from '../../../services/trainerApi';

export default function TrainerLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const trainer = trainerApi.getCurrentTrainer() || {};

  const handleLogout = () => {
    trainerApi.logout();
    navigate('/trainer/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, route: '/trainer/dashboard' },
    { name: 'My Classes', icon: Dumbbell, route: '/trainer/classes' },
    { name: 'Clients', icon: Users, route: '/trainer/clients' },
    { name: 'Availability', icon: Calendar, route: '/trainer/availability' },
    { name: 'Public Profile', icon: User, route: '/trainer/profile' },
    { name: 'Settings', icon: Settings, route: '/trainer/settings' },
  ];

  const isPending = trainer.status === 'pending';
  const isOnboarding = trainer.status === 'onboarding';

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800 flex flex-col lg:flex-row antialiased">
      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <Link to="/trainer/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-sky-500 shadow-md shadow-teal-500/20 flex items-center justify-center text-white font-black text-base shrink-0 group-hover:scale-105 transition-transform">
              W
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-slate-900 tracking-tight text-base">WELLWIGEN</span>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded uppercase tracking-wider border border-teal-200/50">
                  Coach
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Trainer Portal</p>
            </div>
          </Link>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {/* Verification Status Notice */}
        {isPending && (
          <div className="mx-4 mt-4 p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-amber-900 text-xs">
            <div className="flex items-center gap-2 font-bold mb-1">
              <Clock size={14} className="text-amber-600 shrink-0" />
              <span>Pending Approval</span>
            </div>
            <p className="text-[11px] text-amber-700 leading-tight">
              Our coaching team is reviewing your profile.
            </p>
          </div>
        )}

        {isOnboarding && (
          <div className="mx-4 mt-4 p-3 bg-teal-50/80 border border-teal-200 rounded-xl text-teal-900 text-xs">
            <div className="flex items-center gap-2 font-bold mb-1">
              <Sparkles size={14} className="text-teal-600 shrink-0" />
              <span>Incomplete Profile</span>
            </div>
            <Link
              to="/trainer/onboarding"
              className="text-[11px] font-bold text-teal-700 hover:underline flex items-center gap-1 mt-1"
            >
              Resume Onboarding <ChevronRight size={12} />
            </Link>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Coach Management
          </p>
          {navItems.map((item) => {
            const isActive = location.pathname === item.route;
            const Icon = item.icon;
            return (
              <Link
                key={item.route}
                to={item.route}
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-500/10 to-sky-500/10 text-teal-800 border-l-4 border-teal-500 shadow-xs pl-3'
                    : 'text-slate-600 hover:bg-slate-100/70 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={17} className={isActive ? 'text-teal-600' : 'text-slate-400'} />
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions & Website Link */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60 space-y-2">
          {/* Back to Website link */}
          <Link
            to="/"
            className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-teal-700 hover:bg-white border border-transparent hover:border-slate-200 transition-all"
          >
            <div className="flex items-center gap-2.5">
              <ArrowLeft size={15} className="text-slate-400" />
              <span>Back to Website</span>
            </div>
            <ExternalLink size={12} className="text-slate-400" />
          </Link>

          {/* Trainer Card */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
            <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
              {trainer.photoUrl ? (
                <img src={trainer.photoUrl} alt={trainer.name} className="w-full h-full object-cover" />
              ) : (
                trainer.name?.substring(0, 2).toUpperCase() || 'TR'
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate leading-tight">
                {trainer.name || 'Coach'}
              </p>
              <p className="text-[10px] text-teal-600 font-semibold truncate">
                {trainer.specialization || 'Fitness Trainer'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              aria-label="Open sidebar menu"
            >
              <Menu size={20} />
            </button>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
                Welcome back, {trainer.name ? trainer.name.split(' ')[0] : 'Coach'} 👋
              </h2>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Manage your live classes, 1-on-1 clients, and schedule
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Status Pill */}
            {isPending ? (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                <Clock size={13} className="text-amber-600" />
                Under Review
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                <ShieldCheck size={13} className="text-teal-600" />
                Verified Coach
              </span>
            )}

            {/* Back to Website button in header */}
            <Link
              to="/"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors"
            >
              <ArrowLeft size={13} />
              <span>Website</span>
            </Link>

            {/* Notification Bell */}
            <div className="relative">
              <button
                className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors cursor-pointer"
                aria-label="Notifications"
              >
                <Bell size={17} />
              </button>
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-teal-500" />
            </div>

            {/* User Avatar */}
            <Link
              to="/trainer/profile"
              className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-sky-500 text-white flex items-center justify-center font-bold text-xs shadow-xs hover:ring-2 hover:ring-teal-500/20 transition-all overflow-hidden"
            >
              {trainer.photoUrl ? (
                <img src={trainer.photoUrl} alt={trainer.name} className="w-full h-full object-cover" />
              ) : (
                trainer.name?.substring(0, 2).toUpperCase() || 'TR'
              )}
            </Link>
          </div>
        </header>

        {/* Page View Body */}
        <main className="p-4 sm:p-8 flex-1">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
