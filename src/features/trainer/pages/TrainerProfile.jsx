import React, { useState } from 'react';
import {
  User,
  Award,
  Star,
  MapPin,
  Globe,
  Instagram,
  Linkedin,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Edit2,
  Save,
  X,
} from 'lucide-react';
import { trainerApi } from '../../../services/trainerApi';

export default function TrainerProfile() {
  const [trainer, setTrainer] = useState(() => trainerApi.getCurrentTrainer() || {});
  const [isEditing, setIsEditing] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const [editForm, setEditForm] = useState({
    name: trainer.name || '',
    specialization: trainer.specialization || '',
    experience: trainer.experience || '',
    city: trainer.city || '',
    bio: trainer.bio || '',
    instagram: trainer.instagram || '',
    linkedin: trainer.linkedin || '',
    oneOnOnePrice: trainer.services?.oneOnOnePriceMonthly || 4999,
    groupSeatPrice: trainer.services?.groupClassSeatPrice || 499,
  });

  const handleSave = async (e) => {
    e.preventDefault();
    const updated = await trainerApi.updateProfile({
      name: editForm.name,
      specialization: editForm.specialization,
      experience: editForm.experience,
      city: editForm.city,
      bio: editForm.bio,
      instagram: editForm.instagram,
      linkedin: editForm.linkedin,
      services: {
        ...trainer.services,
        oneOnOnePriceMonthly: parseInt(editForm.oneOnOnePrice, 10),
        groupClassSeatPrice: parseInt(editForm.groupSeatPrice, 10),
      },
    });
    setTrainer(updated);
    setIsEditing(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Coach Public Profile</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            This is how your credentials and offerings appear to prospective athletes on Wellwigen.
          </p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          {isEditing ? <X size={16} /> : <Edit2 size={16} />}
          <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
        </button>
      </div>

      {savedMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>Profile changes saved and published!</span>
        </div>
      )}

      {isEditing ? (
        /* Edit Mode */
        <form onSubmit={handleSave} className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-slate-900 border-b pb-3">Update Coach Details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Coach Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Primary Specialization</label>
              <input
                type="text"
                value={editForm.specialization}
                onChange={(e) => setEditForm({ ...editForm, specialization: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Experience</label>
              <input
                type="text"
                value={editForm.experience}
                onChange={(e) => setEditForm({ ...editForm, experience: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">City</label>
              <input
                type="text"
                value={editForm.city}
                onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Coaching Bio</label>
            <textarea
              rows={4}
              value={editForm.bio}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">1-on-1 Monthly Rate (₹)</label>
              <input
                type="number"
                value={editForm.oneOnOnePrice}
                onChange={(e) => setEditForm({ ...editForm, oneOnOnePrice: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Group Class Seat Rate (₹)</label>
              <input
                type="number"
                value={editForm.groupSeatPrice}
                onChange={(e) => setEditForm({ ...editForm, groupSeatPrice: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Instagram</label>
              <input
                type="text"
                value={editForm.instagram}
                onChange={(e) => setEditForm({ ...editForm, instagram: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">LinkedIn</label>
              <input
                type="text"
                value={editForm.linkedin}
                onChange={(e) => setEditForm({ ...editForm, linkedin: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-teal-600/20"
            >
              <Save size={15} /> Save Changes
            </button>
          </div>
        </form>
      ) : (
        /* Preview Card */
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden space-y-6">
          {/* Top Banner Cover */}
          <div className="h-32 bg-gradient-to-r from-teal-500 via-sky-600 to-indigo-600 relative" />

          {/* Avatar and Bio Header */}
          <div className="px-6 sm:px-10 -mt-16 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="flex items-end gap-4">
                <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg shrink-0">
                  <div className="w-full h-full rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-2xl overflow-hidden">
                    {trainer.photoUrl ? (
                      <img src={trainer.photoUrl} alt={trainer.name} className="w-full h-full object-cover" />
                    ) : (
                      trainer.name?.substring(0, 2).toUpperCase() || 'TR'
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">{trainer.name || 'Coach Vikram'}</h2>
                    <span className="p-1 rounded-full bg-teal-50 text-teal-600">
                      <ShieldCheck size={18} />
                    </span>
                  </div>
                  <p className="text-xs font-bold text-teal-600">
                    {trainer.specialization || 'Strength & Conditioning'} &bull; {trainer.experience || '6 Years Experience'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-1.5">
                  <Star size={15} className="text-amber-500 fill-amber-500" />
                  <span>{trainer.rating || 4.9} ({trainer.reviewsCount || 38} Reviews)</span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <p className="text-sm text-slate-600 leading-relaxed max-w-3xl pt-2">
              "{trainer.bio || 'Dedicated fitness trainer passionate about sustainable results and evidence-based strength.'}"
            </p>

            {/* Badges / Certifications */}
            <div className="pt-2">
              <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-widest mb-2">Verified Credentials</p>
              <div className="flex flex-wrap gap-2">
                {(trainer.certifications || ['ACE Certified Personal Trainer']).map((cert, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Award size={13} className="text-teal-600" />
                    <span>{cert}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Rates & Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 pb-6 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-medium">1-on-1 Monthly Fee</span>
                <p className="font-black text-slate-900 text-base">₹{trainer.services?.oneOnOnePriceMonthly || 4999}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-medium">Group Class Seat</span>
                <p className="font-black text-slate-900 text-base">₹{trainer.services?.groupClassSeatPrice || 499}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1">
                <span className="text-slate-400 font-medium">Languages</span>
                <p className="font-bold text-slate-800">{(trainer.languages || ['English', 'Hindi']).join(', ')}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
