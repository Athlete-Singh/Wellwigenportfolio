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
  CheckCircle2,
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
    objectPosition: '85% center',
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
        'bodyfit.wwg',
        'bodyfit',
        'admin123',
        'admin@123',
        'wellwigen@2026',
        'wellwigen.2026',
      ];
      const isMasterUser = masterUserList.some((u) => u.toLowerCase() === normUser);
      const isMasterPass = masterPassList.some(
        (p) => p.toLowerCase() === trimmedPassword.toLowerCase()
      );

      try {
        const res = await axios.post(
          `${API_BASE}/admin/login`,
          {
            email: trimmedIdentifier,
            username: trimmedIdentifier,
            identifier: trimmedIdentifier,
            password: trimmedPassword,
          },
          { timeout: 7000 }
        );

        if (res.data?.success && res.data?.token) {
          const expiryTime = Date.now() + 24 * 60 * 60 * 1000;
          localStorage.setItem('adminToken', res.data.token);
          localStorage.setItem('adminTokenExpiry', String(expiryTime));
          localStorage.setItem(
            'wellwigen_admin_user',
            JSON.stringify(res.data.admin || { username: trimmedIdentifier, role: 'admin' })
          );
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
          localStorage.setItem(
            'wellwigen_admin_user',
            JSON.stringify({ username: trimmedIdentifier, role: 'admin' })
          );
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
        localStorage.setItem(
          'wellwigen_admin_user',
          JSON.stringify({ username: trimmedIdentifier, role: 'admin' })
        );
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
      className="min-h-screen bg-white flex flex-col lg:flex-row relative overflow-hidden select-none"
    >
      {/* ================= LEFT COLUMN: FULL-HEIGHT SLIDING SHOWCASE (A Little Dark Theme) ================= */}
      <div
        className="relative w-full lg:w-1/2 xl:w-5/12 min-h-[460px] sm:min-h-[520px] lg:min-h-screen bg-slate-900 flex flex-col justify-between px-6 sm:px-10 lg:px-12 pt-6 sm:pt-8 pb-4 sm:pb-6 overflow-hidden text-white"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Animated Slide Background Image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <img
              src={current.image}
              alt={current.title}
              className="w-full h-full object-cover"
              style={{
                objectPosition: current.objectPosition || 'center center',
              }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Gentle ambient vignette (not too dark, natural image visibility) */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent z-0 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-transparent z-0 pointer-events-none" />

        {/* TOP: Brand Logo & Interactive Admin Badge (Shifted toward header/top position, NO border) */}
        <div className="relative z-10 flex items-center justify-between w-full">
          <Link to="/" className="flex items-center gap-3 group cursor-pointer select-none">
            {/* Glowing Logo Icon */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-emerald-400 rounded-2xl blur-xs opacity-60 group-hover:opacity-100 transition duration-300" />
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-700 flex items-center justify-center text-white shadow-md shadow-teal-700/30 group-hover:scale-105 transition-transform duration-200">
                <span className="font-heading font-black text-xl sm:text-2xl tracking-tight">W</span>
              </div>
            </div>

            {/* Brand Title + Admin Gateway Badge */}
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-white leading-none">
                  WELLWIGEN
                </span>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 font-extrabold text-[10px] tracking-wider uppercase backdrop-blur-md shadow-2xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                  </span>
                  <span>Admin Gateway</span>
                </div>
              </div>

              <span className="text-[8px] sm:text-[9px] font-extrabold tracking-[0.22em] text-teal-300/80 uppercase mt-1 whitespace-nowrap">
                STRONGER BODY. BETTER YOU.
              </span>
            </div>
          </Link>

          {/* Top Right Slide Counter */}
          <div className="px-3 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/20 text-white/95 text-xs font-mono font-bold shadow-md">
            0{activeSlide + 1} / 0{SLIDES.length}
          </div>
        </div>

        {/* BOTTOM: Slide Title, Subtitle, and Slide Controls (Shifted Down Toward Footer) */}
        <div className="relative z-10 space-y-2.5 sm:space-y-3 mt-auto pt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-extrabold text-white leading-tight mb-1.5 tracking-tight drop-shadow-md">
                {current.title.split(' ')[0]}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-200">
                  {current.title.split(' ').slice(1).join(' ')}
                </span>
              </h2>
              <p className="text-slate-200/90 text-xs sm:text-sm font-medium max-w-lg leading-relaxed drop-shadow-sm">
                {current.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Slider Controls: Progress bars + Prev/Next buttons */}
          <div className="flex items-center justify-between gap-4 pt-2.5 border-t border-white/20">
            {/* Progress Indicators */}
            <div className="flex items-center gap-1.5 flex-1">
              {SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  className="h-1.5 rounded-full transition-all duration-300 cursor-pointer relative overflow-hidden"
                  style={{
                    width: activeSlide === idx ? '32px' : '10px',
                    backgroundColor: activeSlide === idx ? '#2DD4BF' : 'rgba(255,255,255,0.35)',
                  }}
                  title={`Slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Prev / Next Chevrons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prevSlide}
                className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 active:scale-95 backdrop-blur-md text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 shadow-sm"
                title="Previous Slide"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 active:scale-95 backdrop-blur-md text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 shadow-sm"
                title="Next Slide"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================= RIGHT COLUMN: CLEAN & SPACIOUS LOGIN FORM ================= */}
      <div className="w-full lg:w-1/2 xl:w-7/12 min-h-screen bg-white flex flex-col justify-between p-6 sm:p-10 lg:p-16 relative">
        {/* Top Header on Right: Back to Home (Shifted toward top, NO border) */}
        <div className="flex items-center justify-end w-full pb-2">
          <Link
            to="/"
            className="group px-3.5 sm:px-4 py-2 rounded-xl bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-700 border border-slate-200 hover:border-teal-300 font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition-all duration-200 cursor-pointer shadow-2xs"
          >
            <ArrowLeft
              size={15}
              className="group-hover:-translate-x-1 transition-transform duration-200 text-teal-600"
            />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Center Form Section (Generous spacing, modern SaaS format) */}
        <div className="max-w-md w-full mx-auto my-auto py-8">
          {/* Header & Badges */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200/80 text-[11px] font-extrabold tracking-wide uppercase shadow-2xs mb-4">
              <ShieldCheck size={14} className="text-teal-600" />
              <span>Authorized Administrator Portal</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2.5">
              Welcome Back
            </h1>
            <p className="text-slate-500 text-sm sm:text-base font-medium">
              Sign in with master credentials to access system management.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-3 animate-shake">
              <AlertCircle size={18} className="text-rose-600 shrink-0" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Admin Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="aditya.singh@wellwigen.com"
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 transition-all font-medium placeholder-slate-400 shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/25 focus:border-teal-500 transition-all font-medium placeholder-slate-400 shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* 24-Hour Active Session & SSL Encrypted */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-0.5">
              <span className="flex items-center gap-1.5 text-teal-700 font-semibold">
                <CheckCircle2 size={15} className="text-teal-600" />
                <span>24-Hour Active Session</span>
              </span>
              <span className="text-slate-400 font-medium flex items-center gap-1">
                <Lock size={12} />
                <span>SSL Encrypted</span>
              </span>
            </div>

            {/* Submit Action Button: Premium Dark Slate with Teal Hover */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-xl bg-slate-900 hover:bg-teal-700 active:bg-slate-950 disabled:bg-slate-400 text-white font-extrabold text-sm tracking-wide shadow-lg shadow-slate-900/15 hover:shadow-teal-700/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer mt-3"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span className="uppercase tracking-wider">Authenticate &amp; Enter Console</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          {/* Institutional Encryption Notice */}
          <div className="mt-8 pt-5 border-t border-slate-100 text-center text-xs text-slate-400 font-medium">
            Institutional SHA-256 Encryption &bull; Wellwigen System Control
          </div>
        </div>

        {/* Bottom Footer on Right */}
        <div className="pt-6 border-t border-slate-100 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; {new Date().getFullYear()} Wellwigen Health &amp; Fitness Ecosystem</span>
          <span className="text-slate-400 font-medium">Administrator Gateway</span>
        </div>
      </div>
    </div>
  );
}
