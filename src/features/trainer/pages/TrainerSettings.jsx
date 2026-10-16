import React, { useState, useEffect, useRef } from 'react';
import {
  Settings,
  Lock,
  CreditCard,
  Bell,
  CheckCircle2,
  Save,
  ShieldCheck,
  User,
  QrCode,
  Upload,
  Trash2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { trainerApi } from '../../../services/trainerApi';

export default function TrainerSettings() {
  const [trainer, setTrainer] = useState(() => trainerApi.getCurrentTrainer() || {});
  const qrFileInputRef = useRef(null);
  const [uploadError, setUploadError] = useState('');

  const [saved, setSaved] = useState(false);
  const [payoutData, setPayoutData] = useState(() => {
    const p = trainer?.payout || {};
    const isDemo = (val) => val === 'vikram.coach@okhdfcbank' || val === '••••••••4891' || val === 'HDFC0001234';
    return {
      upiId: isDemo(p.upiId) ? '' : (p.upiId || ''),
      bankName: (p.bankName === 'HDFC Bank' && !p.accountNumber) ? '' : (p.bankName || ''),
      accountNumber: isDemo(p.accountNumber) ? '' : (p.accountNumber || ''),
      ifsc: isDemo(p.ifsc) ? '' : (p.ifsc || ''),
      qrCodeUrl: p.qrCodeUrl || '',
    };
  });

  const [notifSaved, setNotifSaved] = useState(false);
  const [notifications, setNotifications] = useState(() => trainerApi.getNotificationSettings());

  // Sync live profile & payout from MongoDB backend
  useEffect(() => {
    const syncLiveProfile = async () => {
      try {
        const synced = await trainerApi.syncTrainerStatus();
        if (synced) {
          setTrainer(synced);
          if (synced.payout) {
            setPayoutData((prev) => ({
              ...prev,
              upiId: synced.payout.upiId ?? prev.upiId,
              bankName: synced.payout.bankName ?? prev.bankName,
              accountNumber: synced.payout.accountNumber ?? prev.accountNumber,
              ifsc: synced.payout.ifsc ?? prev.ifsc,
              qrCodeUrl: synced.payout.qrCodeUrl ?? prev.qrCodeUrl,
            }));
          }
        }
      } catch (e) {
        console.warn('Sync notice:', e);
      }
    };
    syncLiveProfile();
  }, []);

  const handleQrUpload = (e) => {
    setUploadError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('QR code image should be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPayoutData((prev) => ({ ...prev, qrCodeUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleToggleNotification = (key, val) => {
    const updated = { ...notifications, [key]: val };
    setNotifications(updated);
    trainerApi.saveNotificationSettings(updated);
    setNotifSaved(true);
    setTimeout(() => setNotifSaved(false), 2500);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await trainerApi.updateProfile({
        payout: payoutData,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3500);
    } catch (err) {
      console.error('Failed to save payout method:', err);
    }
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
          <span>Your payout banking details and QR code have been saved and sent to the admin panel!</span>
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
              value={trainer.phone || 'Not provided'}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Payout Banking / UPI Details */}
      <form onSubmit={handleSave} className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <CreditCard size={18} className="text-teal-600" />
            <span>Payout &amp; Banking Details</span>
          </div>
          {payoutData.qrCodeUrl && (
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 size={12} /> QR Code Added
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 -mt-2">
          Your weekly coaching payouts will be deposited directly to your bank account or transferred via your UPI QR code.
        </p>

        {/* Payment QR Code Upload Section */}
        <div className="p-5 bg-teal-50/40 rounded-2xl border-2 border-teal-500/25 space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <QrCode size={16} className="text-teal-600" />
              <span>Payout UPI QR Code (Visible in Admin Panel)</span>
            </label>
            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
              Instant Admin Payout
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Upload your Google Pay, PhonePe, Paytm, or BHIM QR code image. The admin will scan this QR directly from the admin panel to release your coaching earnings.
          </p>

          <input
            ref={qrFileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            className="hidden"
            onChange={handleQrUpload}
          />

          {uploadError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {payoutData.qrCodeUrl ? (
            <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-white border border-teal-200 shadow-xs">
              <div className="w-36 h-36 bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center shrink-0 overflow-hidden">
                <img
                  src={payoutData.qrCodeUrl}
                  alt="Payment QR Code"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="space-y-2 text-center sm:text-left flex-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                  <CheckCircle2 size={12} className="text-emerald-600" />
                  <span>UPI Payment QR Code Active</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  This QR code will be displayed in the Admin Panel so management can scan it to instantly payout your session fees.
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => qrFileInputRef.current?.click()}
                    className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Upload size={13} />
                    <span>Replace QR Image</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayoutData((prev) => ({ ...prev, qrCodeUrl: '' }))}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-600 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} />
                    <span>Remove QR</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              onClick={() => qrFileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-teal-500 hover:bg-white rounded-xl p-6 text-center cursor-pointer transition-all space-y-2 group bg-white/70"
            >
              <div className="w-12 h-12 rounded-2xl bg-teal-50 group-hover:bg-teal-100/70 text-teal-600 flex items-center justify-center mx-auto transition-colors">
                <QrCode size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800 group-hover:text-teal-700 transition-colors">
                  Click here to upload your UPI QR Code image
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Supports Google Pay, PhonePe, Paytm, BHIM (PNG, JPG, WEBP up to 5MB)
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 group-hover:bg-teal-600 group-hover:text-white text-slate-700 font-bold text-xs transition-all pointer-events-none"
              >
                <Upload size={13} />
                <span>Upload QR Image</span>
              </button>
            </div>
          )}
        </div>

        {/* Banking and UPI ID Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-600 font-bold uppercase mb-1">Primary UPI ID</label>
            <input
              type="text"
              placeholder="e.g. coach@okhdfcbank or 9876543210@paytm"
              value={payoutData.upiId}
              onChange={(e) => setPayoutData({ ...payoutData, upiId: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-bold uppercase mb-1">Bank Name</label>
            <input
              type="text"
              placeholder="e.g. HDFC Bank, ICICI Bank, State Bank of India"
              value={payoutData.bankName}
              onChange={(e) => setPayoutData({ ...payoutData, bankName: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-900 font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-600 font-bold uppercase mb-1">Bank Account Number</label>
            <input
              type="text"
              placeholder="e.g. 50100456789123"
              value={payoutData.accountNumber}
              onChange={(e) => setPayoutData({ ...payoutData, accountNumber: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-900 font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-bold uppercase mb-1">IFSC Code</label>
            <input
              type="text"
              placeholder="e.g. HDFC0001234"
              value={payoutData.ifsc}
              onChange={(e) => setPayoutData({ ...payoutData, ifsc: e.target.value.toUpperCase() })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-900 font-medium font-mono uppercase"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-teal-600/20 cursor-pointer transition-all"
          >
            <Save size={15} />
            <span>Save Payout Method</span>
          </button>
        </div>
      </form>

      {/* Notifications */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Bell size={18} className="text-teal-600" />
            <span>Notification Preferences</span>
          </div>

          {notifSaved && (
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 size={13} /> Preferences Saved
            </span>
          )}
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div>
              <p className="font-bold text-slate-900">WhatsApp Class Reminders</p>
              <p className="text-slate-500">Receive alerts 30 minutes before your scheduled live group class.</p>
            </div>
            <input
              type="checkbox"
              checked={!!notifications.whatsappAlerts}
              onChange={(e) => handleToggleNotification('whatsappAlerts', e.target.checked)}
              className="w-4 h-4 text-teal-600 rounded cursor-pointer accent-teal-600"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div>
              <p className="font-bold text-slate-900">New Client Inquiries</p>
              <p className="text-slate-500">Instant notification when a trainee requests a 1-on-1 slot.</p>
            </div>
            <input
              type="checkbox"
              checked={!!notifications.emailReminders}
              onChange={(e) => handleToggleNotification('emailReminders', e.target.checked)}
              className="w-4 h-4 text-teal-600 rounded cursor-pointer accent-teal-600"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div>
              <p className="font-bold text-slate-900">Daily Class &amp; Booking Digest</p>
              <p className="text-slate-500">Summary email of all classes scheduled for the day.</p>
            </div>
            <input
              type="checkbox"
              checked={!!notifications.dailySummary}
              onChange={(e) => handleToggleNotification('dailySummary', e.target.checked)}
              className="w-4 h-4 text-teal-600 rounded cursor-pointer accent-teal-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
