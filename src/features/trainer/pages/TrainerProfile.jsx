import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
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
  Camera,
  UploadCloud,
  Loader2,
  Trash2,
  Phone,
  Image,
  Sparkles,
} from 'lucide-react';
import { trainerApi } from '../../../services/trainerApi';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function TrainerProfile() {
  const [trainer, setTrainer] = useState(() => trainerApi.getCurrentTrainer() || {});
  const [isEditing, setIsEditing] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoMsg, setPhotoMsg] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Sync profile reactively across tabs and storage events
  useEffect(() => {
    const handleProfileUpdate = () => {
      const current = trainerApi.getCurrentTrainer() || {};
      setTrainer(current);
    };

    window.addEventListener('trainerProfileUpdated', handleProfileUpdate);
    window.addEventListener('storage', handleProfileUpdate);

    return () => {
      window.removeEventListener('trainerProfileUpdated', handleProfileUpdate);
      window.removeEventListener('storage', handleProfileUpdate);
    };
  }, []);

  // Helper to ensure legacy rupee values (>100) are replaced with percentages
  const parseSharePercent = (val, defaultVal) => {
    if (val !== undefined && val !== null && val !== '') {
      const num = Number(val);
      if (!isNaN(num) && num > 0 && num <= 100) {
        return num;
      }
    }
    return defaultVal;
  };

  // Sync live profile from MongoDB on mount
  useEffect(() => {
    const syncProfileFromDB = async () => {
      try {
        const synced = await trainerApi.syncTrainerStatus();
        if (synced) {
          setTrainer(synced);
        }
      } catch (err) {
        console.warn('Profile sync notice:', err);
      }
    };
    syncProfileFromDB();
  }, []);

  const [editForm, setEditForm] = useState(() => ({
    name: trainer?.name || '',
    specialization: trainer?.specialization || '',
    experience: trainer?.experience || '',
    city: trainer?.city || '',
    phone: trainer?.phone || '',
    bio: trainer?.bio || '',
    photoUrl: trainer?.photoUrl || trainer?.avatar || '',
    instagram: trainer?.instagram || '',
    oneOnOnePrice: parseSharePercent(trainer?.services?.oneOnOneSharePercent ?? trainer?.oneOnOneSharePercent, 50),
    groupSeatPrice: parseSharePercent(trainer?.services?.groupClassSharePercent ?? trainer?.groupClassSharePercent, 75),
  }));

  // Re-sync edit form when editing is toggled
  useEffect(() => {
    if (isEditing) {
      setEditForm({
        name: trainer?.name || '',
        specialization: trainer?.specialization || '',
        experience: trainer?.experience || '',
        city: trainer?.city || '',
        phone: trainer?.phone || '',
        bio: trainer?.bio || '',
        photoUrl: trainer?.photoUrl || trainer?.avatar || '',
        instagram: trainer?.instagram || '',
        oneOnOnePrice: parseSharePercent(trainer?.services?.oneOnOneSharePercent ?? trainer?.oneOnOneSharePercent, 50),
        groupSeatPrice: parseSharePercent(trainer?.services?.groupClassSharePercent ?? trainer?.groupClassSharePercent, 75),
      });
    }
  }, [isEditing, trainer]);

  // Safe initials generator (prevents substring / toUpperCase crashes)
  const getInitials = (nameStr) => {
    if (!nameStr || typeof nameStr !== 'string') return 'TR';
    const trimmed = nameStr.trim();
    if (!trimmed) return 'TR';
    const parts = trimmed.split(/\s+/);
    if (parts.length >= 2 && parts[0][0] && parts[1][0]) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return trimmed.substring(0, 2).toUpperCase();
  };

  // Safe certifications parser (handles strings, arrays of strings, and arrays of objects)
  const getCertificationsList = () => {
    const raw = trainer?.certifications;
    if (Array.isArray(raw) && raw.length > 0) {
      return raw.map((c) => {
        if (typeof c === 'string') return c;
        if (typeof c === 'object' && c !== null) {
          return c.name || c.title || c.certificateName || 'Certified Fitness Coach';
        }
        return String(c || 'Certified Coach');
      });
    }
    if (typeof raw === 'string' && raw.trim()) {
      return raw.split(',').map((s) => s.trim()).filter(Boolean);
    }
    return [];
  };

  // Safe languages parser (handles arrays, comma-separated strings, or empty defaults)
  const getLanguagesDisplay = () => {
    const raw = trainer?.languages;
    if (Array.isArray(raw)) {
      return raw.filter(Boolean).join(', ') || 'Not specified';
    }
    if (typeof raw === 'string' && raw.trim()) {
      return raw.trim();
    }
    return 'Not specified';
  };

  // Photo upload handler with Cloudinary / server upload & local fallback
  const handlePhotoUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, or WebP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size exceeds 10MB limit. Please choose a smaller photo.');
      return;
    }

    setUploadingPhoto(true);
    setPhotoMsg('');

    // Instant local preview
    const localPreviewUrl = URL.createObjectURL(file);
    setPhotoPreview(localPreviewUrl);

    let finalPhotoUrl = localPreviewUrl;

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('file', file);
      formData.append('folder', 'wellwigen/trainers');

      const res = await axios.post(`${API_BASE}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 10000,
      });

      if (res.data?.success && (res.data.url || res.data.secure_url)) {
        finalPhotoUrl = res.data.url || res.data.secure_url;
      }
    } catch (uploadErr) {
      console.warn('Server upload fallback to persistent base64 data URL:', uploadErr);
      finalPhotoUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    }

    const updated = await trainerApi.updateProfile({
      photoUrl: finalPhotoUrl,
      avatar: finalPhotoUrl,
    });

    setTrainer(updated);
    setEditForm((prev) => ({ ...prev, photoUrl: finalPhotoUrl }));
    setUploadingPhoto(false);
    setPhotoPreview(null);
    setPhotoMsg('Profile picture updated successfully!');
    setTimeout(() => setPhotoMsg(''), 3500);

    window.dispatchEvent(new Event('trainerProfileUpdated'));
  };

  const handleRemovePhoto = async () => {
    const updated = await trainerApi.updateProfile({
      photoUrl: '',
      avatar: '',
    });
    setTrainer(updated);
    setEditForm((prev) => ({ ...prev, photoUrl: '' }));
    setPhotoPreview(null);
    setPhotoMsg('Profile picture removed.');
    setTimeout(() => setPhotoMsg(''), 3000);
    window.dispatchEvent(new Event('trainerProfileUpdated'));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const updated = await trainerApi.updateProfile({
        name: editForm.name?.trim() || trainer?.name || 'Coach',
        specialization: editForm.specialization?.trim() || trainer?.specialization || 'Strength & Conditioning',
        experience: editForm.experience?.trim() || trainer?.experience || '3-5 Years',
        city: editForm.city?.trim() || trainer?.city || 'Pan-India',
        phone: editForm.phone?.trim() || trainer?.phone || '',
        bio: editForm.bio?.trim() || trainer?.bio || '',
        photoUrl: editForm.photoUrl || trainer?.photoUrl || '',
        avatar: editForm.photoUrl || trainer?.avatar || '',
        instagram: editForm.instagram?.trim() || '',
        linkedin: editForm.linkedin?.trim() || '',
        services: {
          ...(trainer?.services || {}),
          personalTraining: true,
          groupClasses: true,
          oneOnOneSharePercent: parseInt(editForm.oneOnOnePrice, 10) || 50,
          groupClassSharePercent: parseInt(editForm.groupSeatPrice, 10) || 75,
        },
      });

      setTrainer(updated);
      setIsEditing(false);
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 3500);
      window.dispatchEvent(new Event('trainerProfileUpdated'));
    } catch (err) {
      console.error('Failed to save trainer profile:', err);
    }
  };

  const currentPhoto = photoPreview || trainer?.photoUrl || trainer?.avatar || editForm.photoUrl || '';
  const currentName = trainer?.name || 'Coach';
  const currentSpecialization = trainer?.specialization || 'Fitness Coach';
  const currentExperience = trainer?.experience || 'Certified Coach';
  const currentRating = typeof trainer?.rating === 'number' && trainer.rating > 0 ? trainer.rating : null;
  const currentReviews = typeof trainer?.reviewsCount === 'number' ? trainer.reviewsCount : 0;
  const currentBio = trainer?.bio || '';
  const currentOneOnOneFee = trainer?.services?.oneOnOnePriceMonthly || 0;
  const currentGroupClassFee = trainer?.services?.groupClassSeatPrice || 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded uppercase tracking-wider border border-teal-200/60">
              Live Presence
            </span>
            <span className="text-xs text-slate-400">&bull; Member Discovery</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Coach Public Profile</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            This is how your athletic credentials, bio, and session offerings appear to prospective trainees across India.
          </p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-5 py-2.5 rounded-xl border-2 border-teal-500/30 bg-white hover:border-teal-500 hover:bg-teal-50/50 text-slate-700 font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          {isEditing ? <X size={16} /> : <Edit2 size={16} />}
          <span>{isEditing ? 'Cancel Editing' : 'Edit Profile'}</span>
        </button>
      </div>

      {savedMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-500/50 text-emerald-800 text-xs flex items-center gap-2.5 shadow-xs">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>Profile changes saved and updated successfully!</span>
        </div>
      )}

      {photoMsg && (
        <div className="p-4 rounded-xl bg-teal-50 border-2 border-teal-500/50 text-teal-800 text-xs flex items-center gap-2.5 shadow-xs">
          <CheckCircle2 size={16} className="text-teal-600 shrink-0" />
          <span>{photoMsg}</span>
        </div>
      )}

      {isEditing ? (
        /* Edit Mode */
        <form onSubmit={handleSave} className="p-6 sm:p-8 bg-white/95 backdrop-blur-md rounded-3xl border-2 border-teal-500/35 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-teal-500/20 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Update Coach Details</h3>
              <p className="text-xs text-slate-400 font-medium">Public profile information</p>
            </div>
            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              Editing Mode
            </span>
          </div>

          {/* Profile Picture Upload Section */}
          <div className="p-4 rounded-2xl bg-teal-50/40 border-2 border-teal-500/30 flex flex-col sm:flex-row items-center gap-5">
            <div className="relative group shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xl overflow-hidden border-2 border-white shadow-md">
                {currentPhoto ? (
                  <img
                    src={currentPhoto}
                    alt={editForm.name || 'Coach'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getInitials(editForm.name)
                )}
              </div>
              {uploadingPhoto && (
                <div className="absolute inset-0 bg-slate-900/60 rounded-2xl flex items-center justify-center text-white">
                  <Loader2 size={22} className="animate-spin" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-1 text-center sm:text-left">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Coach Profile Picture</h4>
              <p className="text-xs text-slate-500">
                Upload your picture to appear on your public coach profile and live group workout cards.
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handlePhotoUpload(e.target.files[0]);
                  }}
                />
                <button
                  type="button"
                  disabled={uploadingPhoto}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
                >
                  {uploadingPhoto ? <Loader2 size={13} className="animate-spin" /> : <Camera size={13} />}
                  <span>{uploadingPhoto ? 'Uploading...' : 'Upload New Photo'}</span>
                </button>
                {currentPhoto && (
                  <button
                    type="button"
                    disabled={uploadingPhoto}
                    onClick={handleRemovePhoto}
                    className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-600 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Coach Full Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-teal-500/30 text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">WhatsApp / Phone</label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-teal-500/30 text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Primary Specialization</label>
              <input
                type="text"
                value={editForm.specialization}
                onChange={(e) => setEditForm({ ...editForm, specialization: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-teal-500/30 text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Experience</label>
              <input
                type="text"
                value={editForm.experience}
                onChange={(e) => setEditForm({ ...editForm, experience: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-teal-500/30 text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">City / Base Location</label>
              <input
                type="text"
                value={editForm.city}
                onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-teal-500/30 text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Coaching Bio</label>
            <textarea
              rows={4}
              value={editForm.bio}
              onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-teal-500/30 text-sm leading-relaxed focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                1-on-1 Monthly Share (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={editForm.oneOnOnePrice}
                  onChange={(e) => {
                    const val = e.target.value === '' ? '' : Math.min(100, Math.max(0, parseInt(e.target.value, 10) || 0));
                    setEditForm({ ...editForm, oneOnOnePrice: val });
                  }}
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl border-2 border-teal-500/30 text-sm font-bold focus:border-teal-500 focus:outline-none"
                />
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none font-bold text-teal-700">
                  %
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Group Class Seat Share (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={editForm.groupSeatPrice}
                  onChange={(e) => {
                    const val = e.target.value === '' ? '' : Math.min(100, Math.max(0, parseInt(e.target.value, 10) || 0));
                    setEditForm({ ...editForm, groupSeatPrice: val });
                  }}
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl border-2 border-teal-500/30 text-sm font-bold focus:border-teal-500 focus:outline-none"
                />
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none font-bold text-teal-700">
                  %
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Instagram Handle</label>
              <input
                type="text"
                value={editForm.instagram}
                placeholder="@coach_handle"
                onChange={(e) => setEditForm({ ...editForm, instagram: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-teal-500/30 text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">LinkedIn Profile</label>
              <input
                type="text"
                value={editForm.linkedin}
                placeholder="linkedin.com/in/coach"
                onChange={(e) => setEditForm({ ...editForm, linkedin: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-teal-500/30 text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-teal-500/20">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-5 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-teal-600/20 cursor-pointer transition-all"
            >
              <Save size={15} /> Save Changes
            </button>
          </div>
        </form>
      ) : (
        /* Preview Card */
        <div className="bg-white/95 backdrop-blur-md rounded-3xl border-2 border-teal-500/35 shadow-sm overflow-hidden space-y-6">
          {/* Top Banner Cover */}
          <div className="h-32 bg-gradient-to-r from-teal-500 via-sky-600 to-indigo-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-radial-at-c from-white/10 to-transparent" />
          </div>

          {/* Avatar and Bio Header */}
          <div className="px-6 sm:px-10 -mt-16 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="flex items-end gap-4">
                <div className="relative group shrink-0">
                  <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg shrink-0 border-2 border-teal-500/40">
                    <div className="w-full h-full rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-2xl overflow-hidden relative">
                      {currentPhoto ? (
                        <img
                          src={currentPhoto}
                          alt={currentName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        getInitials(currentName)
                      )}
                      {uploadingPhoto && (
                        <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-white">
                          <Loader2 size={24} className="animate-spin" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900">{currentName}</h2>
                    <span className="p-1 rounded-full bg-teal-50 text-teal-600 border border-teal-200">
                      <ShieldCheck size={18} />
                    </span>
                  </div>
                  <p className="text-xs font-bold text-teal-600">
                    {currentSpecialization} &bull; {currentExperience}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-xl bg-amber-50 border-2 border-amber-400/60 text-amber-900 text-xs font-bold flex items-center gap-1.5 shadow-xs">
                  <Star size={15} className="text-amber-500 fill-amber-500" />
                  <span>
                    {currentReviews > 0
                      ? `${currentRating || '5.0'} (${currentReviews} Reviews)`
                      : 'New Verified Coach'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <p className="text-sm text-slate-600 leading-relaxed max-w-3xl pt-2 font-medium">
              "{currentBio}"
            </p>

            {/* Badges / Certifications */}
            <div className="pt-2">
              <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-widest mb-2">Verified Credentials</p>
              <div className="flex flex-wrap gap-2">
                {getCertificationsList().map((cert, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl bg-teal-50 text-teal-900 border-2 border-teal-500/30 text-xs font-bold flex items-center gap-1.5 shadow-xs"
                  >
                    <Award size={13} className="text-teal-600 shrink-0" />
                    <span>{cert}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Rates & Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-teal-500/20 pb-6 text-xs">
              <div className="p-3.5 bg-teal-50/40 rounded-2xl border-2 border-teal-500/25 space-y-1">
                <span className="text-slate-500 font-semibold">1-on-1 Payout Share</span>
                <p className="font-black text-slate-900 text-base">
                  {(trainer?.services?.oneOnOneSharePercent !== undefined && trainer?.services?.oneOnOneSharePercent !== null && trainer?.services?.oneOnOneSharePercent !== '')
                    ? `${trainer.services.oneOnOneSharePercent}%`
                    : (trainer?.oneOnOneSharePercent !== undefined && trainer?.oneOnOneSharePercent !== null && trainer?.oneOnOneSharePercent !== '')
                    ? `${trainer.oneOnOneSharePercent}%`
                    : '50%'}
                </p>
              </div>

              <div className="p-3.5 bg-teal-50/40 rounded-2xl border-2 border-teal-500/25 space-y-1">
                <span className="text-slate-500 font-semibold">Group Class Share</span>
                <p className="font-black text-slate-900 text-base">
                  {(trainer?.services?.groupClassSharePercent !== undefined && trainer?.services?.groupClassSharePercent !== null && trainer?.services?.groupClassSharePercent !== '')
                    ? `${trainer.services.groupClassSharePercent}%`
                    : (trainer?.groupClassSharePercent !== undefined && trainer?.groupClassSharePercent !== null && trainer?.groupClassSharePercent !== '')
                    ? `${trainer.groupClassSharePercent}%`
                    : '75%'}
                </p>
              </div>

              <div className="p-3.5 bg-teal-50/40 rounded-2xl border-2 border-teal-500/25 space-y-1">
                <span className="text-slate-500 font-semibold">Languages</span>
                <p className="font-bold text-slate-800">{getLanguagesDisplay()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
