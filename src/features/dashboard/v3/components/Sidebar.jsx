import React from 'react';
import { Home, ClipboardList, CalendarDays, Layers, BarChart3, Users, Star, MessageSquare, Bell, UserCheck, HelpCircle, LogOut } from 'lucide-react';

const navConfig = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'orders', label: 'Orders / Requests', icon: ClipboardList },
  { id: 'schedule', label: 'Schedule Calendar', icon: CalendarDays },
  { id: 'inventory', label: 'Inventory / Services', icon: Layers },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'performance', label: 'Performance Score', icon: Star },
  { id: 'reviews', label: 'Reviews', icon: MessageSquare },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'profile', label: 'Profile & Verification', icon: UserCheck },
];

const Sidebar = ({ activeView, onSelect, provider }) => {
  return (
    <aside className="fixed left-0 top-0 h-full w-72 border-r border-slate-200 bg-white shadow-sm">
      <div className="flex h-24 items-center px-6 border-b border-slate-200">
        <div className="flex flex-col gap-1">
          <img
            src="/images/wellwigen-logo.webp"
            alt="Wellwigen"
            className="h-10 sm:h-11 md:h-12 w-auto object-contain select-none"
          />
          <p className="text-[11px] font-semibold text-slate-500 capitalize pl-0.5">{provider?.roleLabel || 'Command'} dashboard</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1 p-4">
        {navConfig.map((item) => {
          const Icon = item.icon;
          const active = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`group flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-semibold transition ${
                active ? 'bg-teal-50 text-teal-700 shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className={`h-5 w-5 ${active ? 'text-teal-600' : 'text-slate-400 group-hover:text-teal-600'}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 bg-white p-6">
        <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">V</div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{provider.name}</p>
            <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500">{provider.status}</p>
          </div>
        </div>

        <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
