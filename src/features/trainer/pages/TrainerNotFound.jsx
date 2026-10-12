import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, LayoutDashboard, Home } from 'lucide-react';

export default function TrainerNotFound() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-5 shadow-lg">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <AlertCircle size={32} />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-900">Page Not Found</h1>
          <p className="text-xs text-slate-500">
            The trainer route you are looking for does not exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            to="/trainer/dashboard"
            className="flex-1 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            <LayoutDashboard size={14} />
            <span>Trainer Dashboard</span>
          </Link>

          <Link
            to="/"
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Home size={14} />
            <span>Main Website</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
