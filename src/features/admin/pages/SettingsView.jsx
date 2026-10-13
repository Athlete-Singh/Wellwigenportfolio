import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Search,
  Dumbbell,
  Users,
  Bell,
  Percent,
  CheckCircle2,
  Save,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Mail,
  Zap,
  Globe
} from 'lucide-react';
import toast from 'react-hot-toast';

const DEFAULT_SETTINGS = {
  // Coaching & Trainers
  coachCommissionRate: 80, // % paid to coach
  autoApproveCertifiedTrainers: false,
  requireGovtIdUpload: true,
  allowTrainerSelfRegistration: true,
  maxClientsPerTrainer: 25,

  // Trainees & Clients
  autoAssignNewSubscribers: true,
  freeTrialDurationDays: 7,
  sendWorkoutReminderHoursBefore: 2,
  allowClientTrainerSwitch: true,

  // Notifications & Alerts
  whatsappLeadAlerts: true,
  emailAdminDailyDigest: true,
  smsSessionConfirmation: true,
  inactivityAlertDays: 5,
};

export default function SettingsView() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all'); // 'all' | 'coaching' | 'clients' | 'notifications'
  const [isSaving, setIsSaving] = useState(false);

  // Load saved settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('wellwigen_admin_platform_settings');
    if (saved) {
      try {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
      } catch {
        setSettings(DEFAULT_SETTINGS);
      }
    }
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem('wellwigen_admin_platform_settings', JSON.stringify(settings));
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Platform settings saved successfully!');
    }, 300);
  };

  const handleReset = () => {
    if (window.confirm('Reset all settings to default values?')) {
      setSettings(DEFAULT_SETTINGS);
      localStorage.setItem('wellwigen_admin_platform_settings', JSON.stringify(DEFAULT_SETTINGS));
      toast.success('Settings reset to defaults');
    }
  };

  const toggleField = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const updateField = (key, val) => {
    setSettings((prev) => ({ ...prev, [key]: val }));
  };

  // Filtered settings sections based on search
  const matchesSearch = (text) => {
    if (!search.trim()) return true;
    return text.toLowerCase().includes(search.toLowerCase());
  };

  const showCoaching =
    (filterCategory === 'all' || filterCategory === 'coaching') &&
    (matchesSearch('coaching') ||
      matchesSearch('commission') ||
      matchesSearch('trainer') ||
      matchesSearch('certification') ||
      matchesSearch('onboarding'));

  const showClients =
    (filterCategory === 'all' || filterCategory === 'clients') &&
    (matchesSearch('client') ||
      matchesSearch('trainee') ||
      matchesSearch('trial') ||
      matchesSearch('auto-assignment') ||
      matchesSearch('reminder'));

  const showNotifications =
    (filterCategory === 'all' || filterCategory === 'notifications') &&
    (matchesSearch('notifications') ||
      matchesSearch('whatsapp') ||
      matchesSearch('email') ||
      matchesSearch('sms') ||
      matchesSearch('alerts'));

  const hasAnyMatch = showCoaching || showClients || showNotifications;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded uppercase tracking-wider">
              Administration
            </span>
            <span className="text-slate-300">/</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              System Configuration
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Platform Settings
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl">
            Configure fitness coaching commission rates, trainee auto-assignment, notification triggers, and onboarding rules.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <RotateCcw size={15} />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#009688] hover:bg-[#00796B] text-white rounded-xl text-xs font-bold shadow-md shadow-teal-700/20 transition-all cursor-pointer"
          >
            <Save size={15} />
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      {/* Toolbar: Search and Filter Pills */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search configuration parameters..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Settings' },
            { id: 'coaching', label: 'Coaches & Trainers' },
            { id: 'clients', label: 'Trainees & Clients' },
            { id: 'notifications', label: 'Alerts & Messages' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                filterCategory === cat.id
                  ? 'bg-[#009688] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {!hasAnyMatch ? (
        <div className="p-16 text-center bg-white border border-slate-200/80 rounded-2xl shadow-xs space-y-3">
          <Settings size={40} className="mx-auto text-slate-300" />
          <h4 className="text-base font-bold text-slate-800">No matching settings found</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search keyword or selecting "All Settings".
          </p>
          <button
            onClick={() => {
              setSearch('');
              setFilterCategory('all');
            }}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* SECTION 1: COACHING & TRAINERS */}
          {showCoaching && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Dumbbell size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Coach & Trainer Management
                  </h3>
                  <p className="text-xs text-slate-400">
                    Parameters governing coach onboarding, revenue sharing, and certification review.
                  </p>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {/* Commission Rate */}
                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Coach Commission Split (%)</p>
                    <p className="text-[11px] text-slate-400">
                      Percentage of client subscription revenue paid out directly to verified coaches.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="50"
                      max="95"
                      value={settings.coachCommissionRate}
                      onChange={(e) => updateField('coachCommissionRate', Number(e.target.value))}
                      className="w-24 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-center"
                    />
                    <span className="text-xs font-bold text-slate-500">%</span>
                  </div>
                </div>

                {/* Trainer Self-Registration */}
                <div className="py-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Trainer Self-Registration Portal</p>
                    <p className="text-[11px] text-slate-400">
                      Allow fitness trainers to apply and upload accreditations via the trainer portal.
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={settings.allowTrainerSelfRegistration}
                    aria-label="Trainer Self-Registration Portal"
                    onClick={() => toggleField('allowTrainerSelfRegistration')}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500/20 ${
                      settings.allowTrainerSelfRegistration ? 'bg-teal-600' : 'bg-slate-200'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                        settings.allowTrainerSelfRegistration ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Mandatory Gov ID */}
                <div className="py-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Require Accreditation Verification</p>
                    <p className="text-[11px] text-slate-400">
                      Require admin review of ACE/NASM/ISSA certification before public listing.
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={settings.requireGovtIdUpload}
                    aria-label="Require Accreditation Verification"
                    onClick={() => toggleField('requireGovtIdUpload')}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500/20 ${
                      settings.requireGovtIdUpload ? 'bg-teal-600' : 'bg-slate-200'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                        settings.requireGovtIdUpload ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Max Clients Per Trainer */}
                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Max Active Trainees per Coach</p>
                    <p className="text-[11px] text-slate-400">
                      Caps concurrent 1-on-1 clients per trainer to ensure coaching quality.
                    </p>
                  </div>
                  <input
                    type="number"
                    min="5"
                    max="50"
                    value={settings.maxClientsPerTrainer}
                    onChange={(e) => updateField('maxClientsPerTrainer', Number(e.target.value))}
                    className="w-24 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-center"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: CLIENTS & TRAINEES */}
          {showClients && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Users size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Trainee & Client Routing
                  </h3>
                  <p className="text-xs text-slate-400">
                    Settings for matching trainees, trial intervals, and automated reminders.
                  </p>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {/* Auto-Assign */}
                <div className="py-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Auto-Assign New Subscription Signups</p>
                    <p className="text-[11px] text-slate-400">
                      Automatically route new paying trainees to the best-matching available coach.
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={settings.autoAssignNewSubscribers}
                    aria-label="Auto-Assign New Subscription Signups"
                    onClick={() => toggleField('autoAssignNewSubscribers')}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-sky-500/20 ${
                      settings.autoAssignNewSubscribers ? 'bg-sky-600' : 'bg-slate-200'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                        settings.autoAssignNewSubscribers ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Free Trial Length */}
                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Free Trial Period (Days)</p>
                    <p className="text-[11px] text-slate-400">
                      Number of days prospective clients receive trial access before required renewal.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={settings.freeTrialDurationDays}
                      onChange={(e) => updateField('freeTrialDurationDays', Number(e.target.value))}
                      className="w-24 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-center"
                    />
                    <span className="text-xs font-bold text-slate-500">Days</span>
                  </div>
                </div>

                {/* Workout Reminder */}
                <div className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Workout Reminder Lead Time</p>
                    <p className="text-[11px] text-slate-400">
                      Hours prior to scheduled 1-on-1 session to dispatch automated push notifications.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="24"
                      value={settings.sendWorkoutReminderHoursBefore}
                      onChange={(e) => updateField('sendWorkoutReminderHoursBefore', Number(e.target.value))}
                      className="w-24 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-center"
                    />
                    <span className="text-xs font-bold text-slate-500">Hours</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: NOTIFICATIONS & ALERTS */}
          {showNotifications && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Bell size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Lead Inquiries & Notifications
                  </h3>
                  <p className="text-xs text-slate-400">
                    Control real-time notifications for website inquiries, WhatsApp alerts, and daily summaries.
                  </p>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {/* WhatsApp Alerts */}
                <div className="py-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Instant WhatsApp Lead Notification</p>
                    <p className="text-[11px] text-slate-400">
                      Notify admin on WhatsApp when a prospective trainee submits a website inquiry.
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={settings.whatsappLeadAlerts}
                    aria-label="Instant WhatsApp Lead Notification"
                    onClick={() => toggleField('whatsappLeadAlerts')}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                      settings.whatsappLeadAlerts ? 'bg-emerald-600' : 'bg-slate-200'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                        settings.whatsappLeadAlerts ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Email Daily Digest */}
                <div className="py-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Daily Administrator Email Digest</p>
                    <p className="text-[11px] text-slate-400">
                      Receive an end-of-day summary of new trainer applications and active subscriptions.
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={settings.emailAdminDailyDigest}
                    aria-label="Daily Administrator Email Digest"
                    onClick={() => toggleField('emailAdminDailyDigest')}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500/20 ${
                      settings.emailAdminDailyDigest ? 'bg-teal-600' : 'bg-slate-200'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                        settings.emailAdminDailyDigest ? 'right-1' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
