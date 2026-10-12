import React, { useState } from 'react';
import {
  Settings,
  Lock,
  CreditCard,
  Bell,
  CheckCircle2,
  Save,
  ShieldCheck,
  User,
} from 'lucide-react';
import { trainerApi } from '../../../services/trainerApi';

export default function TrainerSettings() {
  const trainer = trainerApi.getCurrentTrainer() || {};

  const [saved, setSaved] = useState(false);
  const [payoutData, setPayoutData] = useState({
    upiId: 'vikram.coach@okhdfcbank',
    bankName: 'HDFC Bank',
    accountNumber: '••••••••4891',
    ifsc: 'HDFC0001234',
  });

  const [notifications, setNotifications] = useState({
    whatsappAlerts: true,
    emailReminders: true,
    clientChat: true,
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Coach Settings</h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Manage your account credentials, earnings payout details, and automated notification preferences.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>Your settings and payout preferences have been saved successfully!</span>
        </div>
      )}

      {/* Account Info */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <User size={18} className="text-teal-600" />
          <span>Account Credentials</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 font-bold uppercase mb-1">Email</label>
            <input
              type="text"
              disabled
              value={trainer.email || 'coach@example.com'}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 font-medium"
            />
          </div>
          <div>
            <label className="block text-slate-400 font-bold uppercase mb-1">WhatsApp / Phone</label>
            <input
              type="text"
              disabled
              value={trainer.phone || '+91 98765 43210'}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Payout Banking / UPI Details */}
      <form onSubmit={handleSave} className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-5">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <CreditCard size={18} className="text-teal-600" />
          <span>Payout &amp; Banking Details</span>
        </div>
        <p className="text-xs text-slate-500 -mt-2">
          Your weekly earnings from group classes and personal coaching will be deposited here.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-600 font-bold uppercase mb-1">Primary UPI ID</label>
            <input
              type="text"
              value={payoutData.upiId}
              onChange={(e) => setPayoutData({ ...payoutData, upiId: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-bold uppercase mb-1">Bank Name</label>
            <input
              type="text"
              value={payoutData.bankName}
              onChange={(e) => setPayoutData({ ...payoutData, bankName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-600 font-bold uppercase mb-1">Bank Account Number</label>
            <input
              type="text"
              value={payoutData.accountNumber}
              onChange={(e) => setPayoutData({ ...payoutData, accountNumber: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-bold uppercase mb-1">IFSC Code</label>
            <input
              type="text"
              value={payoutData.ifsc}
              onChange={(e) => setPayoutData({ ...payoutData, ifsc: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-teal-600/20 cursor-pointer"
          >
            <Save size={15} />
            <span>Save Payout Method</span>
          </button>
        </div>
      </form>

      {/* Notifications */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <Bell size={18} className="text-teal-600" />
          <span>Notification Preferences</span>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
            <div>
              <p className="font-bold text-slate-900">WhatsApp Class Reminders</p>
              <p className="text-slate-500">Receive alerts 30 minutes before your scheduled live group class.</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.whatsappAlerts}
              onChange={(e) => setNotifications({ ...notifications, whatsappAlerts: e.target.checked })}
              className="w-4 h-4 text-teal-600 rounded"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
            <div>
              <p className="font-bold text-slate-900">New Client Inquiries</p>
              <p className="text-slate-500">Instant notification when a trainee requests a 1-on-1 slot.</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.emailReminders}
              onChange={(e) => setNotifications({ ...notifications, emailReminders: e.target.checked })}
              className="w-4 h-4 text-teal-600 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
