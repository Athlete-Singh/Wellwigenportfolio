import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Award,
  Activity,
  Zap,
  CheckCircle2
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const SLIDES = [
  {
    image: '/admin-slider/slide1.jpg',
    tag: 'Elite Coaching',
    title: 'Precision Strength & Hypertrophy',
    subtitle: 'Institutional control over personalized fitness programs, progressive overload, and client rosters.',
    statNumber: '99.8%',
    statLabel: 'Program Adherence',
  },
  {
    image: '/admin-slider/slide2.jpg',
    tag: 'MetCon Endurance',
    title: 'High-Intensity Conditioning',
    subtitle: 'Real-time workout logging, biometric tracking, and automated client renewal cycles.',
    statNumber: '2,400+',
    statLabel: 'Active Trainees',
  },
  {
    image: '/admin-slider/slide3.jpg',
    tag: 'Structural Mastery',
    title: 'Engineered Muscle & Biomechanics',
    subtitle: 'Seamless oversight of certified trainers, verified certifications, and client progress metrics.',
    statNumber: '48+',
    statLabel: 'Verified Coaches',
  },
  {
    image: '/admin-slider/slide4.jpg',
    tag: 'Dynamic Fitness',
    title: 'Mobility & Functional Power',
    subtitle: 'Holistic lifestyle tracking with nutrition guidance and automated order generation.',
    statNumber: '24 Hours',
    statLabel: 'Security Protected',
  },
  {
    image: '/admin-slider/slide5.jpg',
    tag: 'Apex Power',
    title: 'Peak Athletic Transformation',
    subtitle: 'The apex administrative engine powering the Wellwigen health and fitness ecosystem.',
    statNumber: '100%',
    statLabel: 'Encrypted Gateway',
  },
  {
    image: '/admin-slider/slide6.jpg',
    tag: 'Personalized Coaching',
    title: 'Expert 1-on-1 Trainer Guidance',
    subtitle: 'Comprehensive workout tracking, form correction, and dedicated coach-client mentorship.',
    statNumber: '100%',
    statLabel: 'Guided Coaching',
  },
  {
    image: '/admin-slider/slide7.jpg',
    tag: 'Power & Form',
    title: 'Elite Strength & Hypertrophy',
    subtitle: 'Dedicated progressive resistance regimens engineered for peak athletic conditioning.',
    statNumber: '99%',
    statLabel: 'Target Achievement',
  },
  {
    image: '/admin-slider/slide8.jpg',
    tag: 'Functional Agility',
    title: 'Calisthenics & Gymnastic Mastery',
    subtitle: 'Holistic movement mastery, core balance, and functional bodyweight strength.',
    statNumber: '500+',
    statLabel: 'Daily Sessions',
  },
];

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Slider State
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-slide effect every 4.5 seconds (pauses on hover)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % SLIDES.length);
  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  // If already authenticated as admin, redirect immediately to dashboard
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      axios
        .get(`${API_BASE}/admin/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data?.valid) {
            navigate('/admin', { replace: true });
          }
        })
        .catch(() => {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('wellwigen_admin_user');
        });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.identifier.trim() || !formData.password) {
      setError('Please provide both your administrator email/username and password.');
      return;
    }

    try {
      setLoading(true);
      const trimmedIdentifier = formData.identifier.trim();
      const trimmedPassword = formData.password.trim();
      const normUser = trimmedIdentifier.toLowerCase();

      // Master admin credentials whitelist
      const masterUserList = [
        'admin@gmail.com',
        'admin',
        'wellwigen.gate',
        'wellwigen@gmail.com',
        'admin@wellwigen.com',
      ];
      const masterPassList = [
        'bodyfit@wwg',
        'admin123',
        'admin@123',
        'wellwigen@2026',
      ];
      const isMasterUser = masterUserList.includes(normUser);
      const isMasterPass = masterPassList.includes(trimmedPassword.toLowerCase());

      try {
        const res = await axios.post(`${API_BASE}/admin/login`, {
          email: trimmedIdentifier,
          username: trimmedIdentifier,
          identifier: trimmedIdentifier,
          password: trimmedPassword,
        }, { timeout: 7000 });

        if (res.data?.success && res.data?.token) {
          const expiryTime = Date.now() + 24 * 60 * 60 * 1000;
          localStorage.setItem('adminToken', res.data.token);
          localStorage.setItem('adminTokenExpiry', String(expiryTime));
          localStorage.setItem('wellwigen_admin_user', JSON.stringify(res.data.admin || { username: trimmedIdentifier, role: 'admin' }));
          toast.success('Admin authentication successful! (24h session active)');
          const destination = from && from !== '/admin/login' ? from : '/admin';
          navigate(destination, { replace: true });
          return;
        }
      } catch (networkOrApiErr) {
        console.warn('Backend API request encountered error, checking master fallback:', networkOrApiErr.message);

        // PERMANENT LIVE FAILSAFE: Master credentials always grant instant access
        if (isMasterUser && isMasterPass) {
          const fallbackToken = `adm_live_key_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
          const expiryTime = Date.now() + 24 * 60 * 60 * 1000;
          localStorage.setItem('adminToken', fallbackToken);
          localStorage.setItem('adminTokenExpiry', String(expiryTime));
          localStorage.setItem('wellwigen_admin_user', JSON.stringify({ username: trimmedIdentifier, role: 'admin' }));
          toast.success('🎉 Master Administrator Authenticated! (24h Live Session Active)');
          const destination = from && from !== '/admin/login' ? from : '/admin';
          navigate(destination, { replace: true });
          return;
        }

        setError(
          networkOrApiErr.response?.data?.message ||
            'Invalid administrator credentials. Access restricted.'
        );
        return;
      }

      if (isMasterUser && isMasterPass) {
        const fallbackToken = `adm_live_key_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const expiryTime = Date.now() + 24 * 60 * 60 * 1000;
        localStorage.setItem('adminToken', fallbackToken);
        localStorage.setItem('adminTokenExpiry', String(expiryTime));
        localStorage.setItem('wellwigen_admin_user', JSON.stringify({ username: trimmedIdentifier, role: 'admin' }));
        toast.success('🎉 Master Administrator Authenticated! (24h Live Session Active)');
        const destination = from && from !== '/admin/login' ? from : '/admin';
        navigate(destination, { replace: true });
        return;
      }

      setError('Invalid administrator credentials. Access restricted.');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Invalid administrator credentials. Access restricted.'
      );
    } finally {
      setLoading(false);
    }
  };

  const current = SLIDES[activeSlide];

  return (
    <div
      data-panel="admin"
      className="min-h-screen bg-gradient-to-br from-[#E6F4F1] via-[#F0F8F6] to-[#E8F8F5] text-slate-800 font-sans flex flex-col justify-between p-3 sm:p-5 lg:p-6 antialiased relative overflow-hidden"
    >
      {/* Ambient background glowing orbs with subtle pulse */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-teal-400/25 to-emerald-300/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-sky-400/20 to-teal-300/25 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* TOP HEADER: PROFESSIONAL, COLORFUL & ANIMATED */}
      <header className="max-w-7xl mx-auto w-full relative z-20 pt-1 pb-2">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="relative bg-white/85 hover:bg-white/95 backdrop-blur-xl border border-teal-500/25 rounded-2xl sm:rounded-3xl shadow-[0_8px_32px_rgba(0,121,107,0.12)] px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between transition-all duration-300 overflow-hidden"
        >
          {/* Animated top gradient highlight beam */}
          <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-teal-500 via-emerald-400 to-sky-400 animate-pulse" />

          {/* Left: Brand Logo & Interactive Badge */}
          <Link to="/" className="flex items-center gap-3 group cursor-pointer select-none">
            {/* Glowing Logo Icon */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-emerald-400 rounded-2xl blur-xs opacity-60 group-hover:opacity-100 transition duration-300" />
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 flex items-center justify-center text-white shadow-md shadow-teal-700/30 group-hover:scale-105 transition-transform duration-200">
                <span className="font-heading font-black text-xl sm:text-2xl tracking-tight">W</span>
              </div>
            </div>

            {/* Brand Title + Admin Gateway Badge */}
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-heading font-black text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-teal-950 via-teal-700 to-emerald-800 bg-clip-text text-transparent leading-none">
                  WELLWIGEN
                </span>
                
                {/* Colorful Animated Live Badge */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-teal-500/15 via-emerald-500/20 to-sky-500/15 border border-teal-500/35 text-teal-900 font-extrabold text-[10px] tracking-wider uppercase shadow-2xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span>Admin Gateway</span>
                </div>
              </div>

              <span className="hidden min-[400px]:inline-block text-[8px] sm:text-[9px] font-extrabold tracking-[0.22em] text-teal-700 uppercase mt-1 whitespace-nowrap">
                STRONGER BODY. BETTER YOU.
              </span>
            </div>
          </Link>

          {/* Center Security Indicator (Visible on Tablet & Desktop) */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50/70 border border-teal-200/80 text-[11px] font-bold text-teal-900 shadow-2xs">
            <ShieldCheck size={14} className="text-teal-600" />
            <span>256-Bit SSL Console</span>
            <span className="text-teal-300">&bull;</span>
            <span className="text-emerald-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Operational v2.4
            </span>
          </div>

          {/* Right: Colorful Animated Back Button */}
          <Link
            to="/"
            className="group px-3.5 sm:px-4 py-2 rounded-xl sm:rounded-full bg-gradient-to-r from-slate-50 via-teal-50/40 to-emerald-50/30 hover:from-teal-600 hover:to-emerald-600 text-slate-700 hover:text-white border-2 border-teal-500/30 hover:border-transparent font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs hover:shadow-lg hover:shadow-teal-600/25 transition-all duration-200 cursor-pointer"
          >
            <ArrowLeft size={15} className="text-teal-600 group-hover:text-white group-hover:-translate-x-1 transition-all duration-200" />
            <span className="whitespace-nowrap">Back to Home</span>
          </Link>
        </motion.div>
      </header>

      {/* Main Split Layout: Sliding Showcase on Left + Login Form on Right */}
      <main className="max-w-7xl w-full mx-auto my-auto py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* ================= LEFT COLUMN: SLIDING SHOWCASE ================= */}
        <div
          className="lg:col-span-7 h-[520px] sm:h-[580px] lg:h-[620px] w-full rounded-3xl overflow-hidden relative border-2 border-teal-500/35 shadow-2xl shadow-teal-950/20 group select-none bg-slate-950"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Animated Slide Image with Ken Burns Zoom & Crossfade */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <img
                src={current.image}
                alt={current.title}
                className="w-full h-full object-cover object-center"
              />

              {/* Subtle bottom vignette so navigation controls remain readable */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
            </motion.div>
          </AnimatePresence>

          {/* Top Right Slide Counter */}
          <div className="absolute top-5 right-5 z-20 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white/90 text-xs font-mono font-bold">
            0{activeSlide + 1} / 0{SLIDES.length}
          </div>

          {/* Bottom Slide Content & Overlay */}
          <div className="absolute bottom-6 left-6 right-6 z-20 space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight drop-shadow-lg">
                  {current.title}
                </h2>
              </motion.div>
            </AnimatePresence>

            {/* Slider Navigation Bar: Progress Bars + Controls */}
            <div className="pt-2 flex items-center justify-between gap-4 border-t border-white/15">
              {/* Progress Indicators (all 8 slides) */}
              <div className="flex items-center gap-1.5 flex-1">
                {SLIDES.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveSlide(idx)}
                    className="h-1.5 rounded-full transition-all cursor-pointer relative overflow-hidden"
                    style={{
                      width: activeSlide === idx ? '28px' : '10px',
                      backgroundColor: activeSlide === idx ? '#009688' : 'rgba(255,255,255,0.3)',
                    }}
                    title={`Slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Prev / Next Arrows */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={prevSlide}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md text-white flex items-center justify-center transition-all cursor-pointer border border-white/15"
                  title="Previous Slide"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-md text-white flex items-center justify-center transition-all cursor-pointer border border-white/15"
                  title="Next Slide"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: LOGIN FORM CARD ================= */}
        <div className="lg:col-span-5 w-full">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl border-2 border-teal-500/35 shadow-2xl shadow-teal-900/10 p-6 sm:p-9 space-y-6">
            
            {/* Brand Logo & Header from Home Page */}
            <div className="text-center space-y-3">
              <Link to="/" className="inline-flex items-center gap-3 group cursor-pointer">
                <div className="w-12 h-12 rounded-2xl gradient-teal-sky flex items-center justify-center text-white shadow-lg shadow-teal-500/30 group-hover:scale-105 transition-transform duration-200">
                  <span className="font-heading font-black text-2xl">W</span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-heading font-extrabold text-2xl tracking-tight text-slate-900 leading-none group-hover:text-teal-600 transition-colors">
                    WELLWIGEN
                  </span>
                  <span className="text-[9px] font-bold tracking-[0.2em] text-teal-700 uppercase mt-1 whitespace-nowrap">
                    STRONGER BODY. BETTER YOU.
                  </span>
                </div>
              </Link>

              <div className="pt-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200/80 text-[11px] font-bold tracking-wide uppercase shadow-2xs">
                  <ShieldCheck size={14} className="text-teal-600" />
                  <span>Authorized Administrator Portal</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5">
                  Sign in with master credentials to access system management.
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 animate-shake">
                <AlertCircle size={16} className="text-rose-600 shrink-0" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Admin Identifier / Username
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, identifier: 'Admin@gmail.com' }))}
                    className="text-[10px] sm:text-[11px] font-bold text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-2 py-0.5 rounded-md border border-teal-200 transition-colors cursor-pointer"
                    title="Click to fill Admin@gmail.com"
                  >
                    Recommended: Admin@gmail.com
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail size={16} />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Admin@gmail.com"
                    value={formData.identifier}
                    onChange={(e) =>
                      setFormData({ ...formData, identifier: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter admin password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Security Hint & Auto-Fill */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                <span className="flex items-center gap-1 text-teal-700 font-semibold">
                  <CheckCircle2 size={13} />
                  <span>24-Hour Active Session</span>
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      identifier: 'Admin@gmail.com',
                      password: 'bodyfit@wwg',
                    })
                  }
                  className="text-teal-700 hover:text-teal-900 font-bold hover:underline cursor-pointer flex items-center gap-1 text-[11px]"
                >
                  <Sparkles size={11} className="text-teal-600" />
                  <span>Quick-Fill Master</span>
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-[#009688] hover:bg-[#00796B] disabled:bg-teal-400 text-white font-extrabold text-sm shadow-md shadow-teal-600/25 hover:shadow-teal-600/35 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Authenticate &amp; Enter Console</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400">
              Institutional SHA-256 Encryption &bull; Wellwigen System Control
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-400 py-3 relative z-10">
        &copy; {new Date().getFullYear()} Wellwigen Health &amp; Fitness Ecosystem &bull; Administrator Gateway
      </footer>
    </div>
  );
}

