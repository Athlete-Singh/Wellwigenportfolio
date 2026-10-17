import React, { useState, useEffect, useRef } from 'react';
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
  // NEW CODE - Wellwigen rejection alert icon
  AlertCircle,
  CheckCheck,
  Trash2,
  Video,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import socket from '../../../config/socket';
import { trainerApi } from '../../../services/trainerApi';
import ErrorBoundary from '../../../components/ErrorBoundary';

export default function TrainerLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [trainer, setTrainer] = useState(() => trainerApi.getCurrentTrainer() || {});
  
  // Interactive Notifications State
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => trainerApi.getNotifications());

  // Auto-dismiss notification dropdown when clicking anywhere else on screen
  const notificationsRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };

    if (isNotificationsOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isNotificationsOpen]);

  useEffect(() => {
    const handleProfileUpdate = () => {
      setTrainer(trainerApi.getCurrentTrainer() || {});
    };
    const handleNotificationsUpdate = () => {
      setNotifications(trainerApi.getNotifications());
    };

    window.addEventListener('trainerProfileUpdated', handleProfileUpdate);
    window.addEventListener('storage', handleProfileUpdate);
    window.addEventListener('trainerNotificationsUpdated', handleNotificationsUpdate);

    // Initial background sync for any newly assigned trainees/groups
    trainerApi.syncTrainerAssignmentNotifications();

    // Real-time socket event when cron or server dispatches an assignment
    const handleSocketNotification = (data) => {
      if (!data) return;
      const current = trainerApi.getCurrentTrainer();
      if (
        !data.coachName ||
        !current?.name ||
        data.coachName.toLowerCase() === current.name.toLowerCase()
      ) {
        trainerApi.addNotification({
          title: data.title || '🎯 New Client Assigned!',
          message: data.message || `You have been assigned to ${data.targetName || 'a trainee'}`,
          type: 'client',
          link: data.link || '/trainer/dashboard',
        });
        toast.success(`🎯 ${data.title || 'New Client Assigned!'}`, {
          duration: 5000,
          icon: '🏋️‍♂️',
        });
      }
    };

    if (socket) {
      socket.on('trainerNotification', handleSocketNotification);
    }

    return () => {
      window.removeEventListener('trainerProfileUpdated', handleProfileUpdate);
      window.removeEventListener('storage', handleProfileUpdate);
      window.removeEventListener('trainerNotificationsUpdated', handleNotificationsUpdate);
      if (socket) {
        socket.off('trainerNotification', handleSocketNotification);
      }
    };
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllAsRead = () => {
    const updated = trainerApi.markAllNotificationsAsRead();
    setNotifications(updated);
  };

  const handleClearAllNotifications = () => {
    const updated = trainerApi.clearAllNotifications();
    setNotifications(updated);
  };

  const handleNotificationClick = (item) => {
    if (item.unread) {
      trainerApi.markNotificationAsRead(item.id);
    }
    setIsNotificationsOpen(false);
    if (item.link) {
      navigate(item.link);
    }
  };

  const handleLogout = () => {
    trainerApi.logout();
    navigate('/trainer/login');
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, route: '/trainer/dashboard' },
    { name: 'My Classes', icon: Dumbbell, route: '/trainer/classes' },
    /* [DISABLED FOR FUTURE USE] Trainer Clients navigation
    { name: 'Clients', icon: Users, route: '/trainer/clients' },
    */
    /* [DISABLED FOR FUTURE USE] Trainer Availability navigation
    { name: 'Availability', icon: Calendar, route: '/trainer/availability' },
    */
    { name: 'Public Profile', icon: User, route: '/trainer/profile' },
    { name: 'Settings', icon: Settings, route: '/trainer/settings' },
  ];

  const isPending = trainer.status === 'pending';
  const isOnboarding = trainer.status === 'onboarding';

  return (
    <div data-panel="trainer" className="min-h-screen bg-transparent font-sans text-slate-800 flex flex-col lg:flex-row antialiased">
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
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/90 backdrop-blur-md border-r-2 border-teal-500/30 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 shadow-lg shadow-teal-500/5 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <Link to="/trainer/dashboard" className="flex flex-col items-start gap-1.5 group">
            <img
              src="/images/wellwigen-logo.webp"
              alt="Wellwigen"
              className="h-10 sm:h-11 md:h-12 w-auto object-contain select-none group-hover:scale-105 transition-transform duration-200"
            />
            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-teal-200/50 ml-0.5">
              Coach
            </span>
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
        <div className="p-4 border-t border-teal-500/20 bg-white/80 space-y-2">
          {/* Back to Website link */}
          <Link
            to="/"
            className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-teal-700 hover:bg-white border border-transparent hover:border-teal-500/30 transition-all shadow-xs"
          >
            <div className="flex items-center gap-2.5">
              <ArrowLeft size={15} className="text-slate-400" />
              <span>Back to Website</span>
            </div>
            <ExternalLink size={12} className="text-slate-400" />
          </Link>

          {/* Trainer Card */}
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/95 border-2 border-teal-500/30 shadow-xs shadow-teal-500/5">
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
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-transparent">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b-2 border-teal-500/30 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs shadow-teal-500/5">
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
            {/* OLD CODE (commented by AI)
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
            */}
            {/* NEW CODE - Wellwigen 3-state status badge */}
            {isPending ? (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                <Clock size={13} className="text-amber-600" />
                Under Review
              </span>
            ) : trainer.status === 'rejected' ? (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
                <AlertCircle size={13} className="text-rose-600" />
                Action Required
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <ShieldCheck size={13} className="text-emerald-600" />
                Approved Coach
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

            {/* [DISABLED FOR FUTURE USE] Static Notification Bell
            <div className="relative">
              <button
                className="w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors cursor-pointer"
                aria-label="Notifications"
              >
                <Bell size={17} />
              </button>
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-teal-500" />
            </div>
            */}

            {/* NEW CODE - Interactive Notification Bell with Popover Dropdown */}
            <div className="relative" ref={notificationsRef}>
              <button
                type="button"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className={`w-9 h-9 rounded-xl border transition-all flex items-center justify-center cursor-pointer relative ${
                  isNotificationsOpen
                    ? 'border-teal-500 bg-teal-50 text-teal-700 ring-2 ring-teal-500/20'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
                aria-label="Coach Notifications"
                title="Notifications & Alerts"
              >
                <Bell size={17} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center bg-teal-600 text-white font-black text-[10px] rounded-full shadow-xs">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              <AnimatePresence>
                {isNotificationsOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="absolute right-0 top-full mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden"
                    >
                      {/* Dropdown Header */}
                      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-teal-50/60 to-white">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-teal-600/10 text-teal-700 flex items-center justify-center">
                            <Bell size={15} />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 leading-tight">Coach Alerts</h4>
                            <p className="text-[11px] text-slate-500 font-medium">
                              {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up'}
                            </p>
                          </div>
                        </div>

                        {unreadCount > 0 && (
                          <button
                            type="button"
                            onClick={handleMarkAllAsRead}
                            className="text-[11px] font-bold text-teal-600 hover:text-teal-800 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCheck size={13} />
                            <span>Mark all read</span>
                          </button>
                        )}
                      </div>

                      {/* Notification Items List */}
                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center space-y-2">
                            <Bell size={28} className="mx-auto text-slate-300" />
                            <p className="text-xs font-bold text-slate-700">No notifications yet</p>
                            <p className="text-[11px] text-slate-400">
                              Upcoming class reminders and profile updates will show up here.
                            </p>
                          </div>
                        ) : (
                          notifications.map((item) => (
                            <div
                              key={item.id}
                              onClick={() => handleNotificationClick(item)}
                              className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer hover:bg-slate-50 ${
                                item.unread ? 'bg-teal-50/40' : 'bg-white'
                              }`}
                            >
                              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                                {item.type === 'class' && <Dumbbell size={15} className="text-teal-600" />}
                                {item.type === 'approval' && <CheckCircle2 size={15} className="text-emerald-600" />}
                                {item.type === 'zoom' && <Video size={15} className="text-sky-600" />}
                                {!['class', 'approval', 'zoom'].includes(item.type) && <Sparkles size={15} className="text-amber-600" />}
                              </div>

                              <div className="flex-1 min-w-0 space-y-0.5">
                                <div className="flex items-center justify-between gap-1">
                                  <h5 className={`text-xs font-bold truncate ${item.unread ? 'text-slate-900' : 'text-slate-700'}`}>
                                    {item.title}
                                  </h5>
                                  <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                                    {item.time}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                                  {item.message}
                                </p>
                              </div>

                              {item.unread && (
                                <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0 mt-1.5" />
                              )}
                            </div>
                          ))
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                        <Link
                          to="/trainer/settings"
                          onClick={() => setIsNotificationsOpen(false)}
                          className="text-[11px] text-slate-600 hover:text-slate-900 font-bold flex items-center gap-1"
                        >
                          <Settings size={12} />
                          <span>Notification Settings</span>
                        </Link>

                        {notifications.length > 0 && (
                          <button
                            type="button"
                            onClick={handleClearAllNotifications}
                            className="text-[11px] text-slate-400 hover:text-rose-600 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Trash2 size={12} />
                            <span>Clear all</span>
                          </button>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* User Avatar */}
            <Link
              to="/trainer/profile"
              className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-sky-500 text-white flex items-center justify-center font-bold text-xs shadow-xs hover:ring-2 hover:ring-teal-500/20 transition-all overflow-hidden"
            >
              {trainer?.photoUrl || trainer?.avatar ? (
                <img src={trainer.photoUrl || trainer.avatar} alt={trainer.name || 'Coach'} className="w-full h-full object-cover" />
              ) : (
                (typeof trainer?.name === 'string' && trainer.name.trim()) ? trainer.name.trim().substring(0, 2).toUpperCase() : 'TR'
              )}
            </Link>
          </div>
        </header>

        {/* Page View Body with Smooth Sliding Section Transition (matching Admin Panel) */}
        <main className="p-4 sm:p-8 flex-1 overflow-x-hidden">
          {/* OLD CODE (commented by AI)
          {children || <Outlet />}
          */}

          {/* NEW CODE - Wellwigen Smooth Sliding Section Transition (exact admin panel transition) */}
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 16, x: -6 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: -16, x: 6 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <ErrorBoundary>
                {children || <Outlet />}
              </ErrorBoundary>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
