import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle2, Save, AlertCircle } from 'lucide-react';
import { trainerApi } from '../../../services/trainerApi';

export default function TrainerAvailability() {
  const [availability, setAvailability] = useState(() => {
    return (
      trainerApi.getAvailability() || {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        timeSlots: [
          { time: '06:00 AM - 07:00 AM', active: true },
          { time: '07:00 AM - 08:00 AM', active: true },
          { time: '08:00 AM - 09:00 AM', active: false },
          { time: '05:00 PM - 06:00 PM', active: true },
          { time: '06:30 PM - 07:30 PM', active: true },
          { time: '08:00 PM - 09:00 PM', active: false },
        ],
        noticeHours: 12,
        bufferMinutes: 15,
      }
    );
  });

  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const toggleDay = (day) => {
    const updated = availability.days.includes(day)
      ? availability.days.filter((d) => d !== day)
      : [...availability.days, day];
    setAvailability({ ...availability, days: updated });
    setSaved(false);
  };

  const toggleSlot = (idx) => {
    const updated = availability.timeSlots.map((slot, i) =>
      i === idx ? { ...slot, active: !slot.active } : slot
    );
    setAvailability({ ...availability, timeSlots: updated });
    setSaved(false);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await trainerApi.updateAvailability(availability);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Availability &amp; Slots</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Configure your active coaching days, daily time blocks, and booking buffer rules.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-bold text-xs sm:text-sm shadow-md shadow-teal-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Save size={16} />
              <span>Save Schedule</span>
            </>
          )}
        </button>
      </div>

      {saved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>Your weekly availability schedule has been updated successfully!</span>
        </div>
      )}

      {/* Active Days */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">Coaching Days</h3>
        <p className="text-xs text-slate-500">Select the days you are available to host sessions.</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
          {ALL_DAYS.map((day) => {
            const isSelected = availability.days.includes(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-teal-50 border-teal-300 text-teal-900 font-bold shadow-xs'
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 font-medium'
                }`}
              >
                <span className="text-xs block">{day.slice(0, 3)}</span>
                <span className="text-[10px] mt-0.5 block text-slate-400">
                  {isSelected ? 'Active' : 'Off'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Daily Time Slots */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">Daily Time Slots</h3>
        <p className="text-xs text-slate-500">Toggle individual hours on or off for 1-on-1 bookings.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {availability.timeSlots.map((slot, idx) => (
            <div
              key={idx}
              onClick={() => toggleSlot(idx)}
              className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                slot.active
                  ? 'bg-teal-50/70 border-teal-300 ring-1 ring-teal-500/20'
                  : 'bg-slate-50/50 border-slate-200 opacity-60 hover:opacity-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <Clock size={16} className={slot.active ? 'text-teal-600' : 'text-slate-400'} />
                <span className={`text-xs font-bold ${slot.active ? 'text-slate-900' : 'text-slate-500'}`}>
                  {slot.time}
                </span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                slot.active ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {slot.active ? 'Available' : 'Disabled'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Rules */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">Booking Rules</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Advance Notice Required (Hours)
            </label>
            <select
              value={availability.noticeHours}
              onChange={(e) => setAvailability({ ...availability, noticeHours: parseInt(e.target.value, 10) })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500/20"
            >
              <option value={6}>6 Hours before session</option>
              <option value={12}>12 Hours before session</option>
              <option value={24}>24 Hours before session</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Buffer Between Sessions
            </label>
            <select
              value={availability.bufferMinutes}
              onChange={(e) => setAvailability({ ...availability, bufferMinutes: parseInt(e.target.value, 10) })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-teal-500/20"
            >
              <option value={10}>10 Minutes</option>
              <option value={15}>15 Minutes</option>
              <option value={30}>30 Minutes</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
