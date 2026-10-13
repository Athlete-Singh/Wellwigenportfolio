import React, { useState, useRef } from 'react';
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
  const previewFileInputRef = useRef(null);

  /* [DISABLED FOR FUTURE USE] Old editForm without photoUrl & phone
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
  */

  // NEW CODE - Extended editForm with profile photo, phone, and credentials
  const [editForm, setEditForm] = useState({
    name: trainer.name || '',
    specialization: trainer.specialization || '',
    experience: trainer.experience || '',
    city: trainer.city || '',
    phone: trainer.phone || '',
    bio: trainer.bio || '',
    photoUrl: trainer.photoUrl || trainer.avatar || '',
    instagram: trainer.instagram || '',
    linkedin: trainer.linkedin || '',
    oneOnOnePrice: trainer.services?.oneOnOnePriceMonthly || 4999,
    groupSeatPrice: trainer.services?.groupClassSeatPrice || 499,
  });

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

    // Notify TrainerLayout and dashboard reactively
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

  /* [DISABLED FOR FUTURE USE] Old handleSave without photoUrl & phone
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
  */

  // NEW CODE - Comprehensive profile save including photo and contact
  const handleSave = async (e) => {
    e.preventDefault();
    const updated = await trainerApi.updateProfile({
      name: editForm.name,
      specialization: editForm.specialization,
      experience: editForm.experience,
      city: editForm.city,
      phone: editForm.phone,
      bio: editForm.bio,
      photoUrl: editForm.photoUrl || trainer.photoUrl || '',
      avatar: editForm.photoUrl || trainer.avatar || '',
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
    setTimeout(() => setSavedMsg(false), 3500);
    window.dispatchEvent(new Event('trainerProfileUpdated'));
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

      {photoMsg && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs flex items-center gap-2.5 shadow-xs">
          <CheckCircle2 size={16} className="text-teal-600 shrink-0" />
          <span>{photoMsg}</span>
        </div>
      )}

      {isEditing ? (
        /* Edit Mode */
        <form onSubmit={handleSave} className="p-6 sm:p-8 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="text-base font-bold text-slate-900">Update Coach Details</h3>
            <span className="text-xs text-slate-400 font-medium">Public profile information</span>
          </div>

          {/* Profile Picture Upload Section */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center gap-5">
            <div className="relative group shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xl overflow-hidden border-2 border-white shadow-md">
                {photoPreview || editForm.photoUrl ? (
                  <img
                    src={photoPreview || editForm.photoUrl}
                    alt={editForm.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  editForm.name?.substring(0, 2).toUpperCase() || 'TR'
                )}
              </div>
              {uploadingPhoto && (
                <div className="absolute inset-0 bg-slate-900/60 rounded-2xl flex items-center justify-center text-white">
                  <Loader2 size={22} className="animate-spin" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-1 text-center sm:text-left">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Coach Profile Picture</h4>
              <p className="text-xs text-slate-500">
                Upload your picture to appear on your public coach profile and member class cards.
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
                {(editForm.photoUrl || photoPreview) && (
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
              {photoMsg && (
                <p className="text-[11px] font-semibold text-teal-600 pt-1 flex items-center gap-1 justify-center sm:justify-start">
                  <CheckCircle2 size={12} /> {photoMsg}
                </p>
              )}
            </div>
          </div>

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
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">WhatsApp / Phone</label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm"
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
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Experience</label>
              <input
                type="text"
                value={editForm.experience}
                onChange={(e) => setEditForm({ ...editForm, experience: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <div className="relative group shrink-0">
                  <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg shrink-0">
                    <div className="w-full h-full rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-2xl overflow-hidden relative">
                      {photoPreview || trainer.photoUrl ? (
                        <img
                          src={photoPreview || trainer.photoUrl}
                          alt={trainer.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        trainer.name?.substring(0, 2).toUpperCase() || 'TR'
                      )}
                      {uploadingPhoto && (
                        <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-white">
                          <Loader2 size={24} className="animate-spin" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* [DISABLED FOR FUTURE USE] Quick camera button badge on preview card avatar (now only accessible in Edit Profile mode)
                  <input
                    ref={previewFileInputRef}
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
                    onClick={() => previewFileInputRef.current?.click()}
                    title="Change Profile Picture"
                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center shadow-md transition-transform hover:scale-110 cursor-pointer border-2 border-white"
                  >
                    {uploadingPhoto ? <Loader2 size={13} className="animate-spin" /> : <Camera size={14} />}
                  </button>
                  */}
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
