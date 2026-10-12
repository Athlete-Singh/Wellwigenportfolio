import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  User,
  Phone,
  MapPin,
  Globe,
  Award,
  Upload,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Camera,
  FileText,
  DollarSign,
  Calendar,
  Sparkles,
  ShieldCheck,
  Video,
  Instagram,
  Linkedin,
  AlertCircle,
  Clock,
  Eye,
  Trash2,
} from 'lucide-react';
import { trainerApi } from '../../../services/trainerApi';

const TOTAL_STEPS = 6;

const STEP_TITLES = [
  'Basic Info',
  'Professional Details',
  'Media & Certificates',
  'Services & Pricing',
  'Bio & Socials',
  'Review & Submit',
];

export default function TrainerOnboarding() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Read step from URL query param (?step=1..6)
  const rawStep = parseInt(searchParams.get('step') || '1', 10);
  const currentStep = Math.min(Math.max(isNaN(rawStep) ? 1 : rawStep, 1), TOTAL_STEPS);

  // Load existing onboarding data or seed from current user
  const [formData, setFormData] = useState(() => {
    const saved = trainerApi.getOnboardingData();
    const auth = trainerApi.getCurrentTrainer();
    return {
      name: saved.name || auth?.name || '',
      phone: saved.phone || auth?.phone || '',
      email: saved.email || auth?.email || '',
      city: saved.city || '',
      gender: saved.gender || 'Male',
      languages: saved.languages || ['English', 'Hindi'],
      specialization: saved.specialization || 'Strength & Conditioning',
      experience: saved.experience || '3-5 Years',
      certifications: saved.certifications || ['ACE Certified Personal Trainer'],
      institution: saved.institution || '',
      photoUrl: saved.photoUrl || '',
      certificateName: saved.certificateName || '',
      certificatePreview: saved.certificatePreview || '',
      services: {
        personalTraining: saved.services?.personalTraining !== false,
        groupClasses: saved.services?.groupClasses !== false,
        oneOnOnePriceMonthly: saved.services?.oneOnOnePriceMonthly || 4999,
        groupClassSeatPrice: saved.services?.groupClassSeatPrice || 499,
      },
      timeSlots: saved.timeSlots || ['Morning (06:00 AM - 10:00 AM)', 'Evening (05:00 PM - 09:00 PM)'],
      bio: saved.bio || '',
      videoUrl: saved.videoUrl || '',
      instagram: saved.instagram || '',
      linkedin: saved.linkedin || '',
      termsAccepted: false,
    };
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState(null);

  // Sync step change to URL query params
  const goToStep = (newStep) => {
    setError('');
    const target = Math.min(Math.max(newStep, 1), TOTAL_STEPS);
    setSearchParams({ step: target.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auto-save form data on change
  useEffect(() => {
    trainerApi.saveOnboardingData(formData);
  }, [formData]);

  // Handle Photo Upload with live preview
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Photo size should be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, photoUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Handle Certificate Upload
  const handleCertUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        certificateName: file.name,
        certificatePreview: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  // Step Validation before proceeding
  const handleNext = () => {
    setError('');

    if (currentStep === 1) {
      if (!formData.name.trim() || !formData.phone.trim() || !formData.city.trim()) {
        setError('Please enter your full name, phone number, and city.');
        return;
      }
      if (formData.languages.length === 0) {
        setError('Please select at least one language.');
        return;
      }
    }

    if (currentStep === 2) {
      if (!formData.specialization.trim() || !formData.experience.trim()) {
        setError('Please select your primary specialization and experience level.');
        return;
      }
      if (formData.certifications.length === 0) {
        setError('Please select or specify at least one certification.');
        return;
      }
    }

    if (currentStep === 3) {
      // Photo is encouraged
      if (!formData.photoUrl) {
        setError('Please upload a clear headshot photo for your coach profile.');
        return;
      }
    }

    if (currentStep === 4) {
      if (!formData.services.personalTraining && !formData.services.groupClasses) {
        setError('Please choose at least one service you provide (1-on-1 or Group Classes).');
        return;
      }
      if (formData.timeSlots.length === 0) {
        setError('Please select your available weekly time slots.');
        return;
      }
    }

    if (currentStep === 5) {
      if (!formData.bio.trim() || formData.bio.trim().length < 30) {
        setError('Please write at least 30 characters in your coaching bio.');
        return;
      }
    }

    if (currentStep < TOTAL_STEPS) {
      goToStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!formData.termsAccepted) {
      setError('Please accept the Coach Verification Terms & Code of Conduct.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const submitted = await trainerApi.submitOnboardingApplication(formData);
      setSubmittedApp(submitted);
    } catch (err) {
      setError(err.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // If application was just submitted, show celebration & review state
  if (submittedApp) {
    return (
      <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans flex flex-col justify-between p-4 sm:p-6 antialiased">
        <div className="max-w-2xl mx-auto my-auto w-full bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-6 sm:p-12 text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 size={40} className="stroke-[2.5]" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 uppercase tracking-widest">
              Application Status: Under Review
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight pt-2">
              Application Submitted Successfully!
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto">
              Thank you, <span className="font-bold text-slate-900">{submittedApp.name}</span>. Your coach onboarding package has been assigned reference ID:
            </p>
            <div className="p-3 bg-slate-100 rounded-xl max-w-xs mx-auto font-mono font-bold text-slate-900 text-sm tracking-wider">
              {submittedApp.applicationId}
            </div>
          </div>

          {/* Timeline */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-3 max-w-lg mx-auto">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">What happens next?</p>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  1
                </div>
                <p className="text-slate-700">
                  <span className="font-bold text-slate-900">Certificate Verification:</span> Our athletic board validates your certifications within 24-48 hours.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  2
                </div>
                <p className="text-slate-700">
                  <span className="font-bold text-slate-900">Coach Profile Activation:</span> Your profile will receive the Verified Coach badge and go live on Wellwigen.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  3
                </div>
                <p className="text-slate-700">
                  <span className="font-bold text-slate-900">Client Matchmaking:</span> You can start creating live class schedules and accepting 1-on-1 trainees.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate('/trainer/dashboard')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm shadow-md transition-all cursor-pointer"
            >
              Go to Coach Dashboard
            </button>
            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:text-slate-900 font-bold text-sm transition-all"
            >
              Back to Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const progressPercent = Math.round(((currentStep - 1) / (TOTAL_STEPS - 1)) * 100);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans flex flex-col justify-between p-4 sm:p-6 antialiased">
      {/* Top Header */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between py-2">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-sky-500 shadow-sm flex items-center justify-center text-white font-black text-sm shrink-0">
            W
          </div>
          <div>
            <span className="font-black text-slate-900 tracking-tight text-base">WELLWIGEN</span>
            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded uppercase tracking-wider ml-1.5 border border-teal-200/50">
              Coach Onboarding
            </span>
          </div>
        </Link>

        <Link
          to="/"
          className="text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft size={14} />
          <span>Exit to Website</span>
        </Link>
      </div>

      {/* Main Container */}
      <div className="max-w-3xl w-full mx-auto my-6">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 overflow-hidden">
          {/* Stepper Progress Bar Header */}
          <div className="p-6 sm:p-8 bg-slate-50/70 border-b border-slate-200/80">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[10.5px] font-bold text-teal-700 uppercase tracking-widest bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60">
                  Step {currentStep} of {TOTAL_STEPS}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                  {STEP_TITLES[currentStep - 1]}
                </h2>
              </div>
              <span className="text-sm font-black text-slate-500">{progressPercent}% Completed</span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-teal-500 to-sky-500 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Stepper Pills for quick jump */}
            <div className="grid grid-cols-6 gap-1.5 sm:gap-2 mt-4">
              {STEP_TITLES.map((title, i) => {
                const stepNum = i + 1;
                const isDone = stepNum < currentStep;
                const isCurrent = stepNum === currentStep;
                return (
                  <button
                    key={i}
                    onClick={() => goToStep(stepNum)}
                    className={`py-1.5 px-1 rounded-lg text-center transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-teal-600 text-white font-bold shadow-xs'
                        : isDone
                        ? 'bg-teal-50 text-teal-800 font-semibold hover:bg-teal-100'
                        : 'bg-slate-100 text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <span className="text-[10px] sm:text-xs block leading-tight">
                      {isDone ? '✓' : `0${stepNum}`}
                    </span>
                    <span className="text-[9px] hidden md:block truncate mt-0.5">{title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mx-6 sm:mx-8 mt-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
              <AlertCircle size={16} className="text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Step Contents */}
          <div className="p-6 sm:p-10 space-y-6">
            {/* ================= STEP 1: BASIC INFO ================= */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Rajput"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      WhatsApp / Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="coach@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      City / Base Location *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mumbai, Delhi, Bangalore, Jaipur"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Gender
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary / Other">Non-binary / Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Languages Spoken (select all that apply)
                    </label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {['English', 'Hindi', 'Punjabi', 'Bengali', 'Marathi', 'Gujarati', 'Tamil', 'Telugu'].map((lang) => {
                        const isSelected = formData.languages.includes(lang);
                        return (
                          <button
                            type="button"
                            key={lang}
                            onClick={() => {
                              const updated = isSelected
                                ? formData.languages.filter((l) => l !== lang)
                                : [...formData.languages, lang];
                              setFormData({ ...formData, languages: updated });
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-teal-600 text-white shadow-xs'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {lang} {isSelected && '✓'}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= STEP 2: PROFESSIONAL DETAILS ================= */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Primary Coaching Specialization *
                    </label>
                    <select
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    >
                      <option value="Strength & Conditioning">Strength &amp; Conditioning</option>
                      <option value="HIIT & Fat Loss">HIIT &amp; Fat Loss</option>
                      <option value="Bodybuilding & Hypertrophy">Bodybuilding &amp; Hypertrophy</option>
                      <option value="Functional Fitness">Functional Fitness &amp; Cross Training</option>
                      <option value="Mobility & Rehab">Mobility &amp; Posture Rehab</option>
                      <option value="Yoga & Flexibility">Yoga &amp; Flexibility Flow</option>
                      <option value="Calisthenics">Bodyweight &amp; Calisthenics</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Years of Coaching Experience *
                    </label>
                    <select
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    >
                      <option value="1-2 Years">1-2 Years</option>
                      <option value="3-5 Years">3-5 Years</option>
                      <option value="6-8 Years">6-8 Years</option>
                      <option value="8+ Years">8+ Years</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Certifications Held (Select or add) *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      'ACE Certified Personal Trainer',
                      'ISSA Strength Coach / CPT',
                      'NASM Certified Personal Trainer',
                      'CSCS (NSCA)',
                      'CrossFit Level 1 / 2 Trainer',
                      'REPs India Certified',
                      'Certified Nutrition Coach',
                      'B.P.Ed / M.P.Ed Sports Science',
                    ].map((cert) => {
                      const isSelected = formData.certifications.includes(cert);
                      return (
                        <div
                          key={cert}
                          onClick={() => {
                            const updated = isSelected
                              ? formData.certifications.filter((c) => c !== cert)
                              : [...formData.certifications, cert];
                            setFormData({ ...formData, certifications: updated });
                          }}
                          className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer flex items-center justify-between transition-all ${
                            isSelected
                              ? 'bg-teal-50 border-teal-300 text-teal-900'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span>{cert}</span>
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                            isSelected ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300'
                          }`}>
                            {isSelected ? '✓' : ''}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Certifying Institution / Academy
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. American Council on Exercise, K11 Fitness Academy, Gold's Gym Fitness Institute"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>
            )}

            {/* ================= STEP 3: PHOTO & CERTIFICATE UPLOAD ================= */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Professional Profile Photo *
                  </label>
                  <p className="text-xs text-slate-400 mb-3">
                    A clear athletic headshot increases client conversion by 4x.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50">
                    <div className="w-24 h-24 rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs flex items-center justify-center text-slate-400 shrink-0">
                      {formData.photoUrl ? (
                        <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <Camera size={32} />
                      )}
                    </div>

                    <div className="space-y-2 text-center sm:text-left flex-1">
                      <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                        <label className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs cursor-pointer transition-colors inline-flex items-center gap-1.5">
                          <Upload size={14} />
                          <span>{formData.photoUrl ? 'Change Photo' : 'Upload Headshot'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handlePhotoUpload}
                          />
                        </label>

                        {formData.photoUrl && (
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, photoUrl: '' })}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-xs font-bold"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">Supported formats: JPG, PNG, WEBP (Max 5MB)</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Primary Fitness Certificate (Document / Image)
                  </label>
                  <p className="text-xs text-slate-400 mb-3">
                    Upload a photo or scanned copy of your primary certification for verification.
                  </p>

                  <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 text-center space-y-3">
                    {formData.certificateName ? (
                      <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-teal-200 text-left">
                        <div className="flex items-center gap-3">
                          <FileText size={24} className="text-teal-600" />
                          <div>
                            <p className="text-xs font-bold text-slate-900">{formData.certificateName}</p>
                            <p className="text-[10px] text-emerald-600 font-semibold">Ready for verification</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, certificateName: '', certificatePreview: '' })}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
                          <Award size={24} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">Drag &amp; drop certificate here, or browse</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">PDF, PNG, JPG (Max 10MB)</p>
                        </div>
                        <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer transition-colors shadow-xs">
                          <Upload size={14} />
                          <span>Select Certificate File</span>
                          <input
                            type="file"
                            accept="image/*,application/pdf"
                            className="hidden"
                            onChange={handleCertUpload}
                          />
                        </label>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ================= STEP 4: SERVICES & PRICING ================= */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Services You Provide *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div
                      onClick={() =>
                        setFormData({
                          ...formData,
                          services: {
                            ...formData.services,
                            personalTraining: !formData.services.personalTraining,
                          },
                        })
                      }
                      className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                        formData.services.personalTraining
                          ? 'bg-teal-50/70 border-teal-300 ring-2 ring-teal-500/20'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-black text-slate-900 text-sm">1-on-1 Personal Training</span>
                        <span className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${
                          formData.services.personalTraining ? 'bg-teal-600 text-white' : 'border border-slate-300'
                        }`}>
                          {formData.services.personalTraining ? '✓' : ''}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Dedicated tailored coaching, form correction, and private workout sessions.
                      </p>
                    </div>

                    <div
                      onClick={() =>
                        setFormData({
                          ...formData,
                          services: {
                            ...formData.services,
                            groupClasses: !formData.services.groupClasses,
                          },
                        })
                      }
                      className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                        formData.services.groupClasses
                          ? 'bg-teal-50/70 border-teal-300 ring-2 ring-teal-500/20'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-black text-slate-900 text-sm">Live Online Group Classes</span>
                        <span className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${
                          formData.services.groupClasses ? 'bg-teal-600 text-white' : 'border border-slate-300'
                        }`}>
                          {formData.services.groupClasses ? '✓' : ''}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        High-energy group workouts (HIIT, Strength, Core) with 15-25 attendees per seat.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Pricing Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {formData.services.personalTraining && (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                        1-on-1 Monthly Coaching Fee (₹)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none font-bold text-slate-400">
                          ₹
                        </div>
                        <input
                          type="number"
                          value={formData.services.oneOnOnePriceMonthly}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              services: {
                                ...formData.services,
                                oneOnOnePriceMonthly: parseInt(e.target.value, 10) || 0,
                              },
                            })
                          }
                          className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-bold"
                        />
                      </div>
                      <p className="text-[10.5px] text-slate-400 mt-1">Suggested: ₹3,999 to ₹7,999 / month</p>
                    </div>
                  )}

                  {formData.services.groupClasses && (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                        Group Class Price Per Seat (₹)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none font-bold text-slate-400">
                          ₹
                        </div>
                        <input
                          type="number"
                          value={formData.services.groupClassSeatPrice}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              services: {
                                ...formData.services,
                                groupClassSeatPrice: parseInt(e.target.value, 10) || 0,
                              },
                            })
                          }
                          className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-bold"
                        />
                      </div>
                      <p className="text-[10.5px] text-slate-400 mt-1">Suggested: ₹299 to ₹699 / attendee</p>
                    </div>
                  )}
                </div>

                {/* Availability Slots */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    Preferred Coaching Time Blocks (Select all that apply) *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      'Early Morning (06:00 AM - 08:00 AM)',
                      'Morning (08:00 AM - 11:00 AM)',
                      'Afternoon (12:00 PM - 03:00 PM)',
                      'Evening (05:00 PM - 08:00 PM)',
                      'Late Evening (08:00 PM - 10:00 PM)',
                      'Weekend Specials (Sat & Sun)',
                    ].map((slot) => {
                      const isSelected = formData.timeSlots.includes(slot);
                      return (
                        <div
                          key={slot}
                          onClick={() => {
                            const updated = isSelected
                              ? formData.timeSlots.filter((s) => s !== slot)
                              : [...formData.timeSlots, slot];
                            setFormData({ ...formData, timeSlots: updated });
                          }}
                          className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer flex items-center justify-between transition-all ${
                            isSelected
                              ? 'bg-teal-50 border-teal-300 text-teal-900'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span>{slot}</span>
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                            isSelected ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-300'
                          }`}>
                            {isSelected ? '✓' : ''}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ================= STEP 5: BIO & SOCIALS ================= */}
            {currentStep === 5 && (
              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                      Coaching Bio &amp; Philosophy *
                    </label>
                    <span className="text-[11px] text-slate-400">
                      {formData.bio.length} characters (min 30)
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell prospective clients about your coaching background, training style, and what results they can expect from working with you..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Intro Video Link (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Video size={16} />
                    </div>
                    <input
                      type="url"
                      placeholder="https://youtube.com/watch?v=... or Google Drive link"
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">A short 60s intro video boosts client confidence.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Instagram Handle (Optional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Instagram size={16} />
                      </div>
                      <input
                        type="text"
                        placeholder="@coach_handle"
                        value={formData.instagram}
                        onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      LinkedIn Profile (Optional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Linkedin size={16} />
                      </div>
                      <input
                        type="text"
                        placeholder="linkedin.com/in/..."
                        value={formData.linkedin}
                        onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= STEP 6: REVIEW & SUBMIT ================= */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="p-4 bg-teal-50/80 border border-teal-200 rounded-2xl flex items-center gap-3">
                  <ShieldCheck size={24} className="text-teal-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-teal-950">Almost ready for submission</p>
                    <p className="text-[11px] text-teal-700">
                      Review your coaching profile below. You can edit any section before submitting for verification.
                    </p>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden text-xs sm:text-sm">
                  {/* Basic */}
                  <div className="p-4 sm:p-5 flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Basic Information
                      </span>
                      <p className="font-bold text-slate-900 text-base">{formData.name}</p>
                      <p className="text-slate-600">{formData.email} &bull; {formData.phone}</p>
                      <p className="text-slate-500">{formData.city} &bull; {formData.gender} &bull; {formData.languages.join(', ')}</p>
                    </div>
                    <button
                      onClick={() => goToStep(1)}
                      className="text-xs font-bold text-teal-600 hover:underline"
                    >
                      Edit
                    </button>
                  </div>

                  {/* Professional */}
                  <div className="p-4 sm:p-5 flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Specialization &amp; Certifications
                      </span>
                      <p className="font-bold text-slate-900">{formData.specialization} ({formData.experience})</p>
                      <p className="text-slate-600">Certifications: {formData.certifications.join(', ')}</p>
                      {formData.institution && <p className="text-slate-400">Institute: {formData.institution}</p>}
                    </div>
                    <button
                      onClick={() => goToStep(2)}
                      className="text-xs font-bold text-teal-600 hover:underline"
                    >
                      Edit
                    </button>
                  </div>

                  {/* Media */}
                  <div className="p-4 sm:p-5 flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Media &amp; Documents
                      </span>
                      <div className="flex items-center gap-3 pt-1">
                        {formData.photoUrl && (
                          <div className="w-12 h-12 rounded-xl border border-slate-200 overflow-hidden">
                            <img src={formData.photoUrl} alt="Coach Headshot" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-slate-800">
                            Headshot: {formData.photoUrl ? 'Attached ✓' : 'Missing'}
                          </p>
                          <p className="text-slate-500 text-xs">
                            Certificate: {formData.certificateName || 'Uploaded for review'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => goToStep(3)}
                      className="text-xs font-bold text-teal-600 hover:underline"
                    >
                      Edit
                    </button>
                  </div>

                  {/* Rates */}
                  <div className="p-4 sm:p-5 flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Services &amp; Pricing
                      </span>
                      <p className="font-bold text-slate-900">
                        1-on-1: {formData.services.personalTraining ? `₹${formData.services.oneOnOnePriceMonthly}/mo` : 'Disabled'} &bull; Group Classes: {formData.services.groupClasses ? `₹${formData.services.groupClassSeatPrice}/seat` : 'Disabled'}
                      </p>
                      <p className="text-slate-500">{formData.timeSlots.length} active time blocks selected</p>
                    </div>
                    <button
                      onClick={() => goToStep(4)}
                      className="text-xs font-bold text-teal-600 hover:underline"
                    >
                      Edit
                    </button>
                  </div>

                  {/* Bio */}
                  <div className="p-4 sm:p-5 flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Bio &amp; Philosophy
                      </span>
                      <p className="text-slate-700 italic">"{formData.bio}"</p>
                      {formData.instagram && <p className="text-slate-500">Instagram: {formData.instagram}</p>}
                    </div>
                    <button
                      onClick={() => goToStep(5)}
                      className="text-xs font-bold text-teal-600 hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                {/* Agreement Checkbox */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.termsAccepted}
                      onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                      className="mt-1 w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                    />
                    <span className="text-xs text-slate-700 leading-relaxed font-medium">
                      I declare that all provided personal credentials and certification documents are authentic. I agree to Wellwigen's Coach Code of Conduct and athlete safety guidelines.
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Stepper Footer Controls */}
          <div className="p-6 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>
            ) : (
              <Link
                to="/"
                className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
              >
                Cancel &amp; Return Home
              </Link>
            )}

            {currentStep < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-teal-600/20 flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmit}
                className="px-8 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-teal-600/25 flex items-center gap-2 transition-all cursor-pointer"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Submit Application</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-slate-400 py-3">
        &copy; 2026 Wellwigen Fitness &bull; Trainer &amp; Coach Onboarding
      </div>
    </div>
  );
}
