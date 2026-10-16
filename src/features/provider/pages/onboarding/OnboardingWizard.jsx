import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  ShieldCheck, 
  FileCheck,
  Stethoscope,
  FlaskConical,
  Pill,
  Store,
  ArrowLeft,
  Apple,
  Info,
  Scale,
  FileText,
  Building2,
  User,
  Briefcase,
  Dumbbell,
  Mail,
  Lock,
  Phone,
  RotateCw,
  AlertCircle,
  UploadCloud,
  Trash2,
  Loader2,
  Check
} from 'lucide-react';
import { PROVIDER_TYPES, PROVIDER_CONFIG } from '../../constants/providerTypes';
import { useProviderStore } from '../../store/useProviderStore';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

const ROLE_IMAGES = {
  DOCTOR: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=800&auto=format&fit=crop',
  TRAINER: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop',
  PHARMACY: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?q=80&w=800&auto=format&fit=crop',
  LAB: 'https://images.unsplash.com/photo-1614935151651-0bea6508db6b?q=80&w=800&auto=format&fit=crop',
  NUTRITION: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop',
  VENDOR: 'https://images.unsplash.com/photo-1511317559916-56d5ddb62563?q=80&w=800&auto=format&fit=crop'
};

const OnboardingWizard = () => {
  const {
    saveProgress,
    registerProvider,
    uploadDocuments,
    sendEmailOtp,
    verifyEmailOtp,
    initialize,
    isLoading,
    provider
  } = useProviderStore();

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const fileInputRef = useRef(null);

  const initialStep = parseInt(searchParams.get('step')) || 1;
  const initialRole = searchParams.get('role') || null;

  const [step, setStep] = useState(initialStep);
  const [selectedType, setSelectedType] = useState(initialRole);

  // Initialize store and sync verified status from server on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Keep URL in sync with wizard state
  useEffect(() => {
    const params = new URLSearchParams();
    if (step > 1) params.set('step', step);
    if (selectedType) params.set('role', selectedType);
    
    if (searchParams.get('step') !== params.get('step') || searchParams.get('role') !== params.get('role')) {
      setSearchParams(params, { replace: true });
    }
  }, [step, selectedType, setSearchParams, searchParams]);

  // Real Email OTP Verification State (Production-Grade)
  const [emailState, setEmailState] = useState({
    isVerified: false,
    otpSent: false,
    otp: '',
    isSending: false,
    isVerifying: false,
    cooldown: 0,
    remainingAttempts: 5,
    error: '',
  });

  const [errors, setErrors] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploadingDocs, setIsUploadingDocs] = useState(false);

  const [formData, setFormData] = useState({
    type: '',
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    companyType: 'Individual',
    experience: '1-3 Years',
    licenseNumber: '',
    gstin: '',
    address: { street: '', city: '', state: '', pincode: '' },
    verificationConsent: false,
    
    specialization: '',
    consultationFee: '',
    hospitalName: '',
    registrationYear: '',
    medicalLicenseNo: '',
    
    labCategory: 'Pathology',
    homeCollection: 'Yes',
    isoCertified: 'No',
    nablAccredited: 'No',

    shopCategory: 'General Wellness',
    deliveryRadius: '5km',
    pharmacistName: '',
    pharmacistLicenseNo: '',
    
    certifyingBody: '',
    yearsOfExperience: '0-2 Years',
    
    degreeCertification: '',
    dietaryFocus: 'General',
    
    businessType: 'Retail',

    is24x7: 'No',
    testList: '',
    operatingHoursText: '',
    foodCategory: '',
    sourcing: '',
    deliveryType: '',
    
    onboardingStep: 1
  });

  // Load existing progress & sync email verification status from server
  useEffect(() => {
    if (provider) {
      setFormData(prev => ({
        ...prev,
        ...provider,
        address: { ...prev.address, ...(provider.address || {}) }
      }));
      if (provider.onboardingStep) setStep(provider.onboardingStep);
      if (provider.type) setSelectedType(provider.type);
      
      // Load verified flag strictly from database
      if (provider.emailVerified) {
        setEmailState(s => ({ ...s, isVerified: true, error: '' }));
      }
      if (provider.documents && Array.isArray(provider.documents)) {
        setUploadedFiles(provider.documents);
      }
    }
  }, [provider]);

  // Resend Cooldown Countdown (30s)
  useEffect(() => {
    if (emailState.cooldown <= 0) return;
    const timer = setInterval(() => {
      setEmailState(s => ({ ...s, cooldown: Math.max(0, s.cooldown - 1) }));
    }, 1000);
    return () => clearInterval(timer);
  }, [emailState.cooldown]);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateAddress = (field, value) => {
    setFormData(prev => ({ ...prev, address: { ...prev.address, [field]: value } }));
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    updateField('type', type);
    
    const next = step + 1;
    setStep(next);
    saveProgress({ ...formData, type, onboardingStep: next });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Real Production Email OTP Handlers ---

  const handleSendEmailOtp = async () => {
    const emailToVerify = formData.email ? formData.email.trim().toLowerCase() : '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailToVerify || !emailRegex.test(emailToVerify)) {
      setErrors(e => ({ ...e, email: 'Enter a valid email address first' }));
      toast.error('Please enter a valid email address.');
      return;
    }

    setErrors(e => ({ ...e, email: '' }));
    setEmailState(s => ({ ...s, isSending: true, error: '' }));

    try {
      // 1. Save draft progress first so provider document & JWT token exist
      await saveProgress({
        ...formData,
        email: emailToVerify,
        type: selectedType,
        onboardingStep: step,
      });

      // 2. Call backend to send 6-digit OTP via Gmail
      await sendEmailOtp(emailToVerify);

      setEmailState(s => ({
        ...s,
        isSending: false,
        otpSent: true,
        cooldown: 30,
        error: '',
        remainingAttempts: 5,
      }));
      toast.success('Verification code sent to your email!');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to send OTP.';
      setEmailState(s => ({ ...s, isSending: false, error: msg }));
      toast.error(msg);
    }
  };

  const handleVerifyEmailOtp = async () => {
    const rawOtp = emailState.otp ? emailState.otp.trim() : '';

    if (!rawOtp || rawOtp.length !== 6 || !/^\d{6}$/.test(rawOtp)) {
      setEmailState(s => ({ ...s, error: 'Please enter the 6-digit verification code' }));
      toast.error('Please enter a valid 6-digit code.');
      return;
    }

    setEmailState(s => ({ ...s, isVerifying: true, error: '' }));

    try {
      const res = await verifyEmailOtp(formData.email.trim().toLowerCase(), rawOtp);
      if (res?.emailVerified) {
        setEmailState(s => ({
          ...s,
          isVerifying: false,
          isVerified: true,
          otpSent: false,
          otp: '',
          error: '',
        }));
        toast.success('Email verified successfully!');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid or expired OTP code.';
      const remaining = err.response?.data?.remainingAttempts;
      setEmailState(s => ({
        ...s,
        isVerifying: false,
        error: msg,
        remainingAttempts: remaining !== undefined ? remaining : s.remainingAttempts,
      }));
      toast.error(msg);
    }
  };

  const handleChangeEmail = () => {
    setEmailState({
      isVerified: false,
      otpSent: false,
      otp: '',
      isSending: false,
      isVerifying: false,
      cooldown: 0,
      remainingAttempts: 5,
      error: '',
    });
    toast.info('Email unlocked. Please enter and verify your new email.');
  };

  // --- Step Validation ---
  const validateStep = (currentStep) => {
    let newErrors = {};

    if (currentStep === 3) {
      if (!formData.businessName?.trim()) newErrors.businessName = 'Business/Practice name is required';
      if (!formData.ownerName?.trim()) newErrors.ownerName = 'Primary Owner/Contact name is required';
      if (!formData.phone?.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.email?.trim()) newErrors.email = 'Email address is required';
      if (!formData.address?.street?.trim()) newErrors.street = 'Street address is required';
      if (!formData.address?.city?.trim()) newErrors.city = 'City is required';
      if (!formData.address?.state?.trim()) newErrors.state = 'State is required';
      if (!formData.address?.pincode?.trim()) newErrors.pincode = 'Pincode is required';
      else if (!/^\d{6}$/.test(formData.address.pincode)) newErrors.pincode = 'Invalid Pincode (6 digits required)';
      
      // Strict Email Verification Requirement
      if (!emailState.isVerified) {
        newErrors.email = 'Please verify your email address to continue';
      }
    } else if (currentStep === 4) {
      if (selectedType === 'DOCTOR') {
        if (!formData.specialization) newErrors.specialization = 'Specialization is required';
        if (!formData.medicalLicenseNo) newErrors.medicalLicenseNo = 'Medical License No. is required';
        if (!formData.consultationFee) newErrors.consultationFee = 'Consultation Fee is required';
      } else if (selectedType === 'TRAINER') {
        if (!formData.specialization) newErrors.specialization = 'Specialization is required';
        if (!formData.certifyingBody) newErrors.certifyingBody = 'Certifying Body is required';
      } else if (selectedType === 'PHARMACY') {
        if (!formData.pharmacistName) newErrors.pharmacistName = 'Pharmacist Name is required';
        if (!formData.pharmacistLicenseNo) newErrors.pharmacistLicenseNo = 'Pharmacist License No. is required';
      } else if (selectedType === 'LAB') {
        if (!formData.labCategory) newErrors.labCategory = 'Lab Category is required';
      } else if (selectedType === 'NUTRITION') {
        if (!formData.degreeCertification) newErrors.degreeCertification = 'Degree/Certification is required';
      } else if (selectedType === 'VENDOR') {
        if (!formData.shopCategory) newErrors.shopCategory = 'Shop Category is required';
        if (!formData.businessType) newErrors.businessType = 'Business Type is required';
      }
    }
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error('Please complete all required fields and verify your email.');
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (!validateStep(step)) return;
    setErrors({});
    const next = step + 1;
    setStep(next);
    saveProgress({ ...formData, onboardingStep: next });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    const prev = Math.max(1, step - 1);
    setStep(prev);
    saveProgress({ ...formData, onboardingStep: prev });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- Real Document File Upload Handler ---
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate size (max 10MB per file)
    for (const f of files) {
      if (f.size > 10 * 1024 * 1024) {
        toast.error(`File "${f.name}" exceeds the 10MB limit.`);
        return;
      }
    }

    const uploadFormData = new FormData();
    uploadFormData.append('providerId', provider?._id || '');
    uploadFormData.append('docType', 'Registration Document');
    files.forEach((f) => uploadFormData.append('files', f));

    setIsUploadingDocs(true);
    const toastId = toast.loading('Uploading documents...');

    try {
      const res = await uploadDocuments(uploadFormData);
      if (res?.data?.documents) {
        setUploadedFiles(res.data.documents);
      }
      toast.success('Documents uploaded successfully!', { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed', { id: toastId });
    } finally {
      setIsUploadingDocs(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFinalSubmit = async () => {
    if (!emailState.isVerified) {
      toast.error('Email verification is required before submitting.');
      setStep(3);
      return;
    }

    const loadingToast = toast.loading('Submitting final application...');
    try {
      await registerProvider({
        ...formData,
        providerId: provider?._id,
      });
      toast.success('Application submitted! Our team will review it within 48 hours.', { id: loadingToast });
      navigate('/provider/status');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed', { id: loadingToast });
    }
  };

  const currentConfig = PROVIDER_CONFIG[selectedType] || PROVIDER_CONFIG[PROVIDER_TYPES.VENDOR];
  const STEPS = [
    { id: 1, label: 'Role Selection', icon: Briefcase },
    { id: 2, label: 'Roadmap', icon: Info },
    { id: 3, label: 'Business Profile', icon: Building2 },
    { id: 4, label: 'Professional Data', icon: User },
    { id: 5, label: 'Documentation', icon: FileText },
    { id: 6, label: 'Legal Terms', icon: Scale },
    { id: 7, label: 'Review', icon: CheckCircle2 }
  ];

  return (
    <div className={`min-h-screen bg-[#f8fafc] font-sans ${step > 1 ? 'flex overflow-hidden' : ''}`}>
      
      {/* Sidebar Stepper - Only shown from Step 2 onwards */}
      {step > 1 && (
        <div className="hidden lg:flex w-80 bg-white border-r border-gray-100 flex-col p-10 h-screen overflow-y-auto">
          <Link to="/" className="flex items-center gap-3 mb-16 cursor-pointer hover:opacity-80 transition-opacity w-max">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-lg shadow-teal-100">W</div>
            <span className="text-xl font-bold tracking-tight text-gray-900">Wellwigen</span>
          </Link>

          <div className="space-y-1">
            {STEPS.map((s) => {
              const Icon = s.icon;
              const isActive = step === s.id;
              const isCompleted = step > s.id;
              return (
                <div key={s.id} className="relative">
                  {s.id !== STEPS.length && (
                    <div className={`absolute left-[15px] top-10 w-[2px] h-10 transition-colors duration-500 ${isCompleted ? 'bg-teal-600' : 'bg-gray-100'}`} />
                  )}
                  <div className="flex items-center gap-4 py-4 group">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 z-10 
                      ${isActive ? 'bg-teal-600 text-white shadow-lg shadow-teal-100' : 
                        isCompleted ? 'bg-teal-100 text-teal-600' : 'bg-white border-2 border-gray-100 text-gray-400'}`}>
                      {isCompleted ? <CheckCircle2 size={16} /> : <Icon size={14} />}
                    </div>
                    <span className={`text-[11px] font-bold tracking-wider transition-colors duration-300 ${isActive ? 'text-gray-900' : 'text-gray-400 uppercase'}`}>
                      {s.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className={`flex-1 ${step > 1 ? 'h-screen overflow-y-auto' : ''}`}>
        
        {/* Global Progress Bar */}
        {(step === 1 || window.innerWidth < 1024) && (
          <div className="fixed top-0 left-0 w-full h-1 bg-gray-100 z-50">
            <motion.div 
              className="h-full bg-teal-600"
              initial={{ width: 0 }}
              animate={{ width: `${(step / STEPS.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        )}

        <main className={`max-w-7xl mx-auto px-6 py-12 lg:py-20 ${step === 1 ? 'text-center lg:text-left' : ''}`}>
          
          {/* Header Branding (only if no sidebar) */}
          {step === 1 && (
            <Link to="/" className="flex items-center justify-center lg:justify-start gap-3 mb-12 cursor-pointer hover:opacity-80 transition-opacity w-max mx-auto lg:mx-0">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-lg shadow-teal-100">W</div>
              <span className="text-xl font-bold tracking-tight text-gray-900">Wellwigen <span className="text-teal-600">Health</span></span>
            </Link>
          )}
          
          <AnimatePresence mode="wait">
            
            {/* Step 1: Role Selection */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="space-y-3">
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-2">How will you <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-700">serve?</span></h2>
                  <p className="text-gray-500 font-medium text-lg">Select your primary role in the Wellwigen health ecosystem.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 text-left">
                  {Object.entries(PROVIDER_CONFIG).map(([key, config]) => {
                    return (
                      <button 
                        key={key} 
                        onClick={() => handleTypeSelect(key)} 
                        className="group relative h-72 rounded-[2rem] overflow-hidden text-left focus:outline-none focus:ring-4 focus:ring-teal-500/50 shadow-lg hover:shadow-2xl transition-all duration-500"
                      >
                        <div className="absolute inset-0">
                          <img 
                            src={ROLE_IMAGES[key]} 
                            alt={config.label}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                          />
                        </div>
                        
                        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/10 via-gray-900/40 to-gray-900/95 transition-opacity duration-500 group-hover:opacity-90"></div>
                        <div className="absolute inset-0 bg-teal-900/40 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                          <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-4 border border-white/30 group-hover:bg-teal-600 group-hover:border-teal-500 transition-colors duration-300 shadow-xl">
                            {key === 'VENDOR' && <Store size={26} strokeWidth={2.5} />}
                            {key === 'DOCTOR' && <Stethoscope size={26} strokeWidth={2.5} />}
                            {key === 'LAB' && <FlaskConical size={26} strokeWidth={2.5} />}
                            {key === 'PHARMACY' && <Pill size={26} strokeWidth={2.5} />}
                            {key === 'NUTRITION' && <Apple size={26} strokeWidth={2.5} />}
                            {key === 'TRAINER' && <Dumbbell size={26} strokeWidth={2.5} />}
                          </div>
                          
                          <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                            <h3 className="font-black text-white text-2xl mb-1 tracking-tight">{config.label}</h3>
                            <p className="text-xs text-gray-200 leading-relaxed font-bold uppercase tracking-wider opacity-90">{config.description}</p>
                          </div>
                          
                          <div className="absolute bottom-8 right-8 w-10 h-10 bg-white text-teal-600 rounded-full flex items-center justify-center opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 shadow-lg">
                            <ChevronRight size={20} strokeWidth={3} />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 2: Roadmap */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 max-w-3xl">
                <div className="flex items-center gap-2 text-teal-600 mb-2 cursor-pointer group w-max" onClick={prevStep}>
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
                  <span className="text-[11px] font-black uppercase tracking-widest">Change Role</span>
                </div>
                
                <div className="space-y-3">
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Setup your <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-700">workspace.</span></h2>
                  <p className="text-base text-gray-500 font-medium leading-relaxed max-w-xl">You are applying as a <strong className="text-gray-900">{currentConfig?.label}</strong>. {currentConfig?.instructions}</p>
                </div>
                
                <div className="relative bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden flex flex-col sm:flex-row min-h-[320px]">
                  <div className="p-8 sm:p-10 flex-1 relative z-10">
                    <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-6">Application Roadmap</h3>
                    <div className="space-y-5">
                      {currentConfig?.onboardingSteps.map((s, i) => (
                        <div key={i} className="flex gap-4 items-start group">
                          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-xs font-black text-gray-400 group-hover:bg-teal-500 group-hover:text-white group-hover:border-teal-400 group-hover:shadow-lg group-hover:shadow-teal-500/30 transition-all duration-300">
                            {i + 1}
                          </div>
                          <div className="pt-2.5">
                            <p className="text-sm font-bold text-gray-900 group-hover:text-teal-700 transition-colors">{s}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="hidden sm:block sm:w-5/12 relative">
                    <img src={ROLE_IMAGES[selectedType]} alt={currentConfig?.label} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/10 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                       <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white mb-3 border border-white/30 shadow-lg">
                          {selectedType === 'VENDOR' && <Store size={22} strokeWidth={2.5} />}
                          {selectedType === 'DOCTOR' && <Stethoscope size={22} strokeWidth={2.5} />}
                          {selectedType === 'LAB' && <FlaskConical size={22} strokeWidth={2.5} />}
                          {selectedType === 'PHARMACY' && <Pill size={22} strokeWidth={2.5} />}
                          {selectedType === 'NUTRITION' && <Apple size={22} strokeWidth={2.5} />}
                          {selectedType === 'TRAINER' && <Dumbbell size={22} strokeWidth={2.5} />}
                       </div>
                       <h4 className="text-white font-black text-xl drop-shadow-md tracking-tight">{currentConfig?.label}</h4>
                    </div>
                  </div>
                </div>
                
                <button onClick={nextStep} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200 flex justify-center items-center gap-3 group cursor-pointer">
                  Begin Application <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}

            {/* Step 3: Business Information & Real Email OTP Verification */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">Business Profile</h2>
                  <p className="text-[11px] text-gray-400 font-black uppercase tracking-[0.2em]">Tell us about your organization and verify your email.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <InputGroup 
                    label="Business / Practice Name" 
                    placeholder="e.g. Apex Health Clinic" 
                    value={formData.businessName} 
                    onChange={(v) => updateField('businessName', v)} 
                    error={errors.businessName} 
                  />
                  <InputGroup 
                    label="Primary Owner / Contact" 
                    placeholder="Full legal name" 
                    value={formData.ownerName} 
                    onChange={(v) => updateField('ownerName', v)} 
                    error={errors.ownerName} 
                  />
                  
                  {/* Normal Phone Number (Unverified, No OTP) */}
                  <div className="space-y-1.5 w-full">
                    <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${errors.phone ? 'text-red-500' : 'text-gray-500'}`}>
                      Phone Number (Direct Contact)
                    </label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                        <Phone size={14} />
                      </div>
                      <input 
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        className={`w-full bg-white border rounded-lg pl-9 pr-4 py-2.5 text-xs font-semibold text-gray-900 transition-all outline-none shadow-sm ${errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-50' : 'border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-50'}`}
                      />
                    </div>
                    {errors.phone && <span className="text-[9px] text-red-500 font-bold ml-1 block">{errors.phone}</span>}
                  </div>

                  {/* Production-Grade Email Input with Real Gmail OTP Verification */}
                  <div className="space-y-1.5 w-full">
                    <div className="flex items-center justify-between ml-1">
                      <label className={`text-[10px] font-black uppercase tracking-widest ${errors.email ? 'text-red-500' : 'text-gray-500'}`}>
                        Email Address (Verification Required)
                      </label>
                      {emailState.isVerified && (
                        <button
                          type="button"
                          onClick={handleChangeEmail}
                          className="text-[10px] font-bold text-teal-600 hover:text-teal-800 underline uppercase tracking-wider cursor-pointer"
                        >
                          Change Email
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                        <Mail size={14} />
                      </div>
                      <input 
                        type="email" 
                        placeholder="contact@business.com" 
                        value={formData.email} 
                        onChange={(e) => updateField('email', e.target.value)} 
                        disabled={emailState.isVerified}
                        className={`w-full bg-white border rounded-lg pl-9 pr-28 py-2.5 text-xs font-semibold text-gray-900 transition-all outline-none shadow-sm ${errors.email && !emailState.isVerified ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-50' : 'border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-50'} ${emailState.isVerified ? 'border-emerald-500 bg-emerald-50/60 text-emerald-800' : ''}`}
                      />

                      {/* Right action button inside email input */}
                      {!emailState.isVerified ? (
                        <button 
                          type="button"
                          disabled={emailState.isSending || emailState.cooldown > 0}
                          onClick={handleSendEmailOtp}
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-gray-900 text-white rounded-md text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                        >
                          {emailState.isSending ? (
                            <>
                              <Loader2 size={10} className="animate-spin" />
                              <span>Sending...</span>
                            </>
                          ) : emailState.cooldown > 0 ? (
                            <span>Resend in {emailState.cooldown}s</span>
                          ) : emailState.otpSent ? (
                            <span>Resend Code</span>
                          ) : (
                            <span>Verify Email</span>
                          )}
                        </button>
                      ) : (
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-600 flex items-center gap-1.5 font-black text-[10px] uppercase tracking-wider">
                          <CheckCircle2 size={15} />
                          <span>Verified</span>
                        </div>
                      )}
                    </div>
                    {errors.email && !emailState.isVerified && (
                      <span className="text-[9px] text-red-500 font-bold ml-1 block">{errors.email}</span>
                    )}
                  </div>
                </div>

                {/* 6-Digit Email OTP Verification Panel (Expands when OTP is sent) */}
                <AnimatePresence>
                  {emailState.otpSent && !emailState.isVerified && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 bg-teal-50/60 border-2 border-teal-500/30 rounded-2xl space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h4 className="text-xs font-black uppercase tracking-wider text-teal-900">Enter Verification Code</h4>
                            <p className="text-xs text-teal-700">
                              We sent a 6-digit code to <strong>{formData.email}</strong>. It expires in 5 minutes.
                            </p>
                          </div>
                          {emailState.remainingAttempts < 5 && (
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-300">
                              {emailState.remainingAttempts} attempt(s) remaining
                            </span>
                          )}
                        </div>

                        {/* 6-digit input box with paste support and autoFocus */}
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                          <div className="relative w-full sm:w-64">
                            <input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              maxLength={6}
                              autoFocus
                              placeholder="••••••"
                              value={emailState.otp}
                              onChange={(e) => {
                                const sanitized = e.target.value.replace(/\D/g, '').slice(0, 6);
                                setEmailState(s => ({ ...s, otp: sanitized, error: '' }));
                              }}
                              onPaste={(e) => {
                                e.preventDefault();
                                const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
                                setEmailState(s => ({ ...s, otp: paste, error: '' }));
                              }}
                              className="w-full text-center tracking-[0.5em] font-mono text-lg font-black bg-white border-2 border-teal-500/40 rounded-xl px-4 py-2.5 focus:border-teal-600 focus:outline-none shadow-sm"
                            />
                          </div>

                          <button
                            type="button"
                            disabled={emailState.isVerifying || emailState.otp.length !== 6}
                            onClick={handleVerifyEmailOtp}
                            className="w-full sm:w-auto px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md shadow-teal-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                          >
                            {emailState.isVerifying ? (
                              <>
                                <Loader2 size={13} className="animate-spin" />
                                <span>Verifying...</span>
                              </>
                            ) : (
                              <>
                                <Check size={14} />
                                <span>Confirm Code</span>
                              </>
                            )}
                          </button>

                          {emailState.cooldown > 0 ? (
                            <span className="text-[11px] font-medium text-slate-500">
                              Resend in {emailState.cooldown}s
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={handleSendEmailOtp}
                              disabled={emailState.isSending}
                              className="text-[11px] font-bold text-teal-700 hover:text-teal-900 underline uppercase tracking-wider cursor-pointer"
                            >
                              Resend OTP
                            </button>
                          )}
                        </div>

                        {emailState.error && (
                          <div className="flex items-center gap-1.5 text-xs text-rose-600 font-semibold">
                            <AlertCircle size={14} className="shrink-0" />
                            <span>{emailState.error}</span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Address & Company Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 pt-2">
                  <SelectGroup 
                    label="Company Entity Type" 
                    options={['Individual', 'Private Limited', 'Partnership', 'LLP', 'Sole Proprietorship']} 
                    value={formData.companyType} 
                    onChange={(v) => updateField('companyType', v)} 
                  />
                  <InputGroup 
                    label="Street Address / Clinic Address" 
                    placeholder="123 Wellness Avenue" 
                    value={formData.address?.street} 
                    onChange={(v) => updateAddress('street', v)} 
                    error={errors.street} 
                  />
                  <InputGroup 
                    label="City" 
                    placeholder="e.g. Mumbai" 
                    value={formData.address?.city} 
                    onChange={(v) => updateAddress('city', v)} 
                    error={errors.city} 
                  />
                  <InputGroup 
                    label="State" 
                    placeholder="e.g. Maharashtra" 
                    value={formData.address?.state} 
                    onChange={(v) => updateAddress('state', v)} 
                    error={errors.state} 
                  />
                  <InputGroup 
                    label="Pincode (6 Digits)" 
                    placeholder="400001" 
                    value={formData.address?.pincode} 
                    onChange={(v) => updateAddress('pincode', v)} 
                    error={errors.pincode} 
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <button onClick={prevStep} className="px-8 py-3 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:border-gray-300 hover:text-gray-900 hover:bg-gray-50 transition-all uppercase tracking-widest cursor-pointer">Previous</button>
                  <button 
                    onClick={nextStep} 
                    disabled={!emailState.isVerified}
                    className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-bold text-xs hover:bg-black shadow-lg shadow-gray-200 disabled:opacity-40 uppercase tracking-widest disabled:cursor-not-allowed cursor-pointer"
                  >
                    Save & Continue
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Professional Qualifications */}
            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">Qualifications</h2>
                  <p className="text-[11px] text-gray-400 font-black uppercase tracking-[0.2em]">Specific details for {currentConfig?.label} practice.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  {selectedType === 'DOCTOR' && (
                    <>
                      <InputGroup label="Medical Specialization" placeholder="e.g. Cardiologist" value={formData.specialization} onChange={(v) => updateField('specialization', v)} error={errors.specialization} />
                      <InputGroup label="Medical License No." placeholder="MCI-12345" value={formData.medicalLicenseNo} onChange={(v) => updateField('medicalLicenseNo', v)} error={errors.medicalLicenseNo} />
                      <InputGroup label="Year of Registration" placeholder="YYYY" value={formData.registrationYear} onChange={(v) => updateField('registrationYear', v)} error={errors.registrationYear} />
                      <InputGroup label="Consultation Fee (₹)" placeholder="e.g. 500" value={formData.consultationFee} onChange={(v) => updateField('consultationFee', v)} error={errors.consultationFee} />
                      <InputGroup label="Current Hospital/Clinic" placeholder="Name of hospital" value={formData.hospitalName} onChange={(v) => updateField('hospitalName', v)} error={errors.hospitalName} />
                      <SelectGroup label="Experience" options={['1-3 Years', '3-5 Years', '5-10 Years', '10+ Years']} value={formData.experience} onChange={(v) => updateField('experience', v)} />
                    </>
                  )}
                  {selectedType === 'TRAINER' && (
                    <>
                      <InputGroup label="Fitness Specialization" placeholder="e.g. Yoga, Crossfit, Strength" value={formData.specialization} onChange={(v) => updateField('specialization', v)} error={errors.specialization} />
                      <InputGroup label="Certifying Body" placeholder="e.g. ACE, NASM, ISSA" value={formData.certifyingBody} onChange={(v) => updateField('certifyingBody', v)} error={errors.certifyingBody} />
                      <SelectGroup label="Years of Experience" options={['0-2 Years', '2-5 Years', '5-10 Years', '10+ Years']} value={formData.yearsOfExperience} onChange={(v) => updateField('yearsOfExperience', v)} error={errors.yearsOfExperience} />
                      <InputGroup label="Session Fee (₹)" placeholder="e.g. 1000 per hour" value={formData.consultationFee} onChange={(v) => updateField('consultationFee', v)} error={errors.consultationFee} />
                    </>
                  )}
                  {selectedType === 'PHARMACY' && (
                    <>
                      <InputGroup label="Pharmacist Name" placeholder="Registered Pharmacist" value={formData.pharmacistName} onChange={(v) => updateField('pharmacistName', v)} error={errors.pharmacistName} />
                      <InputGroup label="Pharmacist License No." placeholder="LIC-12345" value={formData.pharmacistLicenseNo} onChange={(v) => updateField('pharmacistLicenseNo', v)} error={errors.pharmacistLicenseNo} />
                      <InputGroup label="GSTIN Number" placeholder="22AAAAA0000A1Z5" value={formData.gstin} onChange={(v) => updateField('gstin', v)} error={errors.gstin} />
                      <SelectGroup label="Shop Category" options={['General Pharmacy', 'Ayurvedic', 'Homeopathic', 'Surgicals']} value={formData.shopCategory} onChange={(v) => updateField('shopCategory', v)} error={errors.shopCategory} />
                      <SelectGroup label="Delivery Radius" options={['2km', '5km', '10km', 'No Delivery']} value={formData.deliveryRadius} onChange={(v) => updateField('deliveryRadius', v)} />
                    </>
                  )}
                  {selectedType === 'LAB' && (
                    <>
                      <SelectGroup label="Lab Category" options={['Pathology', 'Radiology', 'Comprehensive', 'Specialized']} value={formData.labCategory} onChange={(v) => updateField('labCategory', v)} error={errors.labCategory} />
                      <InputGroup label="GSTIN Number" placeholder="22AAAAA0000A1Z5" value={formData.gstin} onChange={(v) => updateField('gstin', v)} error={errors.gstin} />
                      <SelectGroup label="NABL Accredited?" options={['Yes', 'No', 'In Process']} value={formData.nablAccredited} onChange={(v) => updateField('nablAccredited', v)} />
                      <SelectGroup label="Home Collection" options={['Yes, Free', 'Yes, Paid', 'No']} value={formData.homeCollection} onChange={(v) => updateField('homeCollection', v)} />
                    </>
                  )}
                  {selectedType === 'VENDOR' && (
                    <>
                      <SelectGroup label="Business Type" options={['Retail', 'Wholesale', 'Manufacturer', 'Distributor']} value={formData.businessType} onChange={(v) => updateField('businessType', v)} error={errors.businessType} />
                      <InputGroup label="Shop/Product Category" placeholder="e.g. Health Supplements" value={formData.shopCategory} onChange={(v) => updateField('shopCategory', v)} error={errors.shopCategory} />
                      <InputGroup label="GSTIN Number" placeholder="22AAAAA0000A1Z5" value={formData.gstin} onChange={(v) => updateField('gstin', v)} error={errors.gstin} />
                      <SelectGroup label="Delivery Radius" options={['Local', 'City-wide', 'State-wide', 'National']} value={formData.deliveryRadius} onChange={(v) => updateField('deliveryRadius', v)} />
                    </>
                  )}
                  {selectedType === 'NUTRITION' && (
                    <>
                      <InputGroup label="Degree / Certification" placeholder="e.g. BSc Nutrition, Registered Dietitian" value={formData.degreeCertification} onChange={(v) => updateField('degreeCertification', v)} error={errors.degreeCertification} />
                      <SelectGroup label="Dietary Focus" options={['General', 'Vegan', 'Keto', 'Diabetes Friendly', 'Gluten Free', 'Sports Nutrition']} value={formData.dietaryFocus} onChange={(v) => updateField('dietaryFocus', v)} error={errors.dietaryFocus} />
                      <InputGroup label="Consultation Fee (₹)" placeholder="e.g. 500" value={formData.consultationFee} onChange={(v) => updateField('consultationFee', v)} error={errors.consultationFee} />
                      <SelectGroup label="Experience" options={['0-2 Years', '2-5 Years', '5-10 Years', '10+ Years']} value={formData.experience} onChange={(v) => updateField('experience', v)} />
                    </>
                  )}
                </div>
                <div className="flex gap-4 pt-6">
                  <button onClick={prevStep} className="px-8 py-3 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:border-gray-300 hover:text-gray-900 hover:bg-gray-50 transition-all uppercase tracking-widest cursor-pointer">Previous</button>
                  <button onClick={nextStep} className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-bold text-xs hover:bg-black shadow-lg shadow-gray-200 uppercase tracking-widest cursor-pointer">Save & Next</button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Documentation Upload */}
            {step === 5 && (
              <motion.div key="s5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">Legal Documents</h2>
                  <p className="text-[11px] text-gray-400 font-black uppercase tracking-[0.2em]">Required certifications for {currentConfig?.label}.</p>
                </div>
                <div className="space-y-6">
                  <InputGroup 
                    label="Primary License / Registration Number" 
                    placeholder="e.g. REG-0987654321" 
                    value={formData.licenseNumber} 
                    onChange={(v) => updateField('licenseNumber', v)} 
                  />
                  
                  {/* Real File Upload Dropzone */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.png,.jpg,.jpeg,.webp,application/pdf,image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />

                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white border-2 border-dashed border-teal-500/30 rounded-3xl p-12 text-center hover:border-teal-500 hover:bg-teal-50/20 transition-all cursor-pointer group shadow-sm"
                  >
                    <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 mx-auto mb-4 group-hover:scale-110 transition-transform">
                      {isUploadingDocs ? <Loader2 size={30} className="animate-spin" /> : <UploadCloud size={30} />}
                    </div>
                    <p className="text-base font-bold text-gray-900">
                      {isUploadingDocs ? 'Validating and Uploading...' : 'Upload Registration Documents'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1 font-medium">Click to browse files &bull; PDF, JPG, PNG, WebP (Max 10MB per file)</p>
                  </div>

                  {/* Uploaded Documents List */}
                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Uploaded Documents ({uploadedFiles.length})</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {uploadedFiles.map((doc, idx) => (
                          <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <FileCheck size={16} className="text-teal-600 shrink-0" />
                              <span className="font-semibold text-slate-800 truncate">{doc.docType || `Document #${idx + 1}`}</span>
                            </div>
                            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                              Uploaded
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-6">
                  <button onClick={prevStep} className="px-8 py-3 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:border-gray-300 hover:text-gray-900 hover:bg-gray-50 transition-all uppercase tracking-widest cursor-pointer">Previous</button>
                  <button onClick={nextStep} className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-bold text-xs hover:bg-black shadow-lg shadow-gray-200 uppercase tracking-widest cursor-pointer">Save & Continue</button>
                </div>
              </motion.div>
            )}

            {/* Step 6: Role-Specific Legal Terms */}
            {step === 6 && (
              <motion.div key="s6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">Legal & Consent</h2>
                  <p className="text-[11px] text-gray-400 font-black uppercase tracking-[0.2em]">Platform agreements for {currentConfig?.label}.</p>
                </div>
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm space-y-5">
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-4 text-xs font-medium text-gray-600 leading-relaxed scrollbar-hide">
                    {(currentConfig?.terms || [
                      '1. Wellwigen is a platform connecting health providers to users. We do not provide medical services directly.',
                      '2. Providers are responsible for the accuracy of their credentials and service quality.',
                      '3. Platform fees apply to transactions processed through our gateway.',
                      '4. Patient data must be handled in compliance with privacy laws (HIPAA/Digital Health standards).',
                      '5. We reserve the right to suspend accounts providing false information.'
                    ]).map((term, index) => (
                      <p key={index} className="pl-1">
                        <strong>{index + 1}.</strong> {term}
                      </p>
                    ))}
                  </div>
                  <label className="flex items-start gap-3 p-6 bg-gray-50 rounded-2xl cursor-pointer hover:bg-teal-50/50 transition-all">
                    <input 
                      type="checkbox" 
                      checked={formData.verificationConsent} 
                      onChange={(e) => updateField('verificationConsent', e.target.checked)} 
                      className="mt-1 w-5 h-5 rounded-lg border-gray-200 text-teal-600 focus:ring-teal-500 cursor-pointer" 
                    />
                    <span className="text-xs font-bold text-gray-900">
                      I agree to the Provider Terms of Service and consent to document and credential verification by the Wellwigen team.
                    </span>
                  </label>
                </div>
                <div className="flex gap-4 pt-6">
                  <button onClick={prevStep} className="px-8 py-3 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:border-gray-300 hover:text-gray-900 hover:bg-gray-50 transition-all uppercase tracking-widest cursor-pointer">Back</button>
                  <button onClick={nextStep} disabled={!formData.verificationConsent} className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-bold text-xs hover:bg-black shadow-lg shadow-gray-200 disabled:opacity-30 uppercase tracking-widest cursor-pointer">Review Application</button>
                </div>
              </motion.div>
            )}

            {/* Step 7: Final Review & Enforced Submit */}
            {step === 7 && (
              <motion.div key="s7" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">Final Review</h2>
                  <p className="text-[11px] text-gray-400 font-black uppercase tracking-[0.2em]">Check your details before submitting.</p>
                </div>
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm space-y-2">
                  <SummaryItem label="Practice Category" value={currentConfig?.label} />
                  <SummaryItem label="Business Name" value={formData.businessName} />
                  <SummaryItem label="Primary Owner" value={formData.ownerName} />
                  <SummaryItem 
                    label="Email (Verified)" 
                    value={
                      <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                        {formData.email}
                        <CheckCircle2 size={13} className="text-emerald-600 inline" />
                      </span>
                    } 
                  />
                  <SummaryItem label="Phone" value={formData.phone} />
                  <SummaryItem label="Location" value={`${formData.address?.city || ''}, ${formData.address?.state || ''}`} />
                  <SummaryItem label="License No." value={formData.licenseNumber} />
                </div>
                <div className="flex gap-4 pt-4">
                  <button onClick={prevStep} className="px-8 py-3 border border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:border-gray-300 hover:text-gray-900 hover:bg-gray-50 transition-all uppercase tracking-widest cursor-pointer">Back</button>
                  <button 
                    onClick={handleFinalSubmit} 
                    disabled={isLoading || !emailState.isVerified} 
                    className="flex-1 py-3.5 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black shadow-lg shadow-gray-200 transition-all flex justify-center items-center gap-2 uppercase tracking-widest cursor-pointer disabled:opacity-40"
                  >
                    {isLoading ? 'Finalizing Application...' : 'Submit Application Now'} <ChevronRight size={20} />
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

/* --- Refined UI Helper Components --- */

const InputGroup = ({ label, type = "text", placeholder, value, onChange, error }) => (
  <div className="space-y-1.5 w-full">
    <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${error ? 'text-red-500' : 'text-gray-500'}`}>{label}</label>
    <input 
      type={type} 
      placeholder={placeholder}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full bg-white border rounded-lg px-3.5 py-2.5 text-xs font-semibold text-gray-900 transition-all outline-none placeholder:text-gray-300 shadow-sm ${error ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-50' : 'border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-50'}`}
    />
    {error && <span className="text-[9px] text-red-500 font-bold ml-1 block">{error}</span>}
  </div>
);

const SelectGroup = ({ label, options, value, onChange, error }) => (
  <div className="space-y-1.5 w-full">
    <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${error ? 'text-red-500' : 'text-gray-500'}`}>{label}</label>
    <div className="relative">
      <select 
        value={value || options[0]}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-white border rounded-lg px-3.5 py-2.5 text-xs font-semibold text-gray-900 transition-all outline-none appearance-none cursor-pointer shadow-sm ${error ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-50' : 'border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-50'}`}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronRight size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
    </div>
    {error && <span className="text-[9px] text-red-500 font-bold ml-1 block">{error}</span>}
  </div>
);

const SummaryItem = ({ label, value }) => (
  <div className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0 last:pb-0">
    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
    <div className="text-xs font-bold text-gray-900">{value || '---'}</div>
  </div>
);

export default OnboardingWizard;
