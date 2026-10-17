import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../../components/common/Modal';
import { Eye, EyeOff, ArrowRight, HeartPulse, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import useAppStore from '../../../store/useAppStore';
import apiClient from '../../../services/apiClient';
import { requestNotificationPermission } from '../../../services/notificationService';

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);

    // Redirect provider if they are already logged in
    useEffect(() => {
        const providerToken = localStorage.getItem("providerToken") || localStorage.getItem("vendorToken");
        const providerInfoRaw = localStorage.getItem("providerInfo") || localStorage.getItem("vendorInfo");
        if (providerToken && providerInfoRaw) {
            try {
                const info = JSON.parse(providerInfoRaw);
                const type = (info.type || info.role || info.category || "").toLowerCase();
                if (type) {
                    navigate(`/${type}/dashboard`, { replace: true });
                } else {
                    navigate("/provider/dashboard", { replace: true });
                }
            } catch (e) {
                console.error("Error redirecting provider from user login page:", e);
            }
        }
    }, [navigate]);

    const auth = useAppStore((state) => state.auth);
    const login = useAppStore((state) => state.login);
    const clearAuthStatus = useAppStore((state) => state.clearAuthStatus);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            return useAppStore.setState({
                auth: { ...auth, error: 'Please fill all fields', success: null },
            });
        }

        try {
            const user = await login(formData);
            
            // Save user to local storage so dashboard can read it
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.removeItem("userSubscription");

            // Ask for notification permission
            try {
                await requestNotificationPermission(user.token, 'user');
            } catch (err) {
                console.warn("Failed to request notification permission:", err);
            }

             setTimeout(async () => {
                 try {
                     const userId = user.id || user._id;
                     const subRes = await apiClient.get(`/api/subscription/me/${userId}`);
                     if (subRes?.data?.data && (subRes.data.data.status === 'active' || subRes.data.data.status === 'Active')) {
                         const s = subRes.data.data;
                         const planMap = { fit_start: 'Silver', healthy_life: 'Gold', total_wellness: 'Platinum' };
                         localStorage.setItem("userSubscription", JSON.stringify({
                             plan: planMap[s.plan] || s.plan || 'Silver',
                             status: "Active",
                             nextBilling: s.endDate ? new Date(s.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A',
                             price: `₹${s.price || 499}/mo`
                         }));
                         navigate('/dashboard', { replace: true });
                     } else {
                         localStorage.removeItem("userSubscription");
                         navigate('/pricing', { replace: true });
                     }
                 } catch (err) {
                     console.error("Error checking subscription on login:", err);
                     const hasSubscription = localStorage.getItem("userSubscription");
                     if (hasSubscription) {
                         navigate('/dashboard', { replace: true });
                     } else {
                         navigate('/pricing', { replace: true });
                     }
                 }
             }, 1200);
        } catch {
            // Error state is managed by zustand store.
        }
    };

    const statusType = auth.error ? 'error' : auth.success ? 'success' : '';
    const statusMessage = auth.error || auth.success || '';

    return (
        <section className="min-h-screen bg-white flex flex-col md:flex-row relative overflow-hidden">
            
            {/* Left Side: Brand Visual */}
            <div className="hidden md:flex w-full md:w-1/2 lg:w-5/12 bg-gray-900 relative flex-col justify-between p-12 overflow-hidden">
                <img 
                    src="https://images.unsplash.com/photo-1571019614242-c5c5adee9f50?q=80&w=1400&auto=format&fit=crop" 
                    alt="Fitness Lifestyle" 
                    className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 via-teal-900/50 to-gray-900/90 z-0"></div>
                
                <div className="relative z-10 flex items-center">
                    <img 
                        src="/images/wellwigen-logo-white.webp" 
                        alt="Wellwigen" 
                        className="h-12 sm:h-14 md:h-16 w-auto object-contain select-none filter drop-shadow-[0_2px_12px_rgba(45,212,191,0.35)]" 
                    />
                </div>

                <div className="relative z-10 mt-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                    >
                        <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
                            Start your <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-300">
                                wellness journey.
                            </span>
                        </h2>
                        <p className="text-gray-300 text-base md:text-lg max-w-sm font-medium leading-relaxed">
                            Join the smartest fitness ecosystem. Access AI-driven meal plans, virtual training, and clinical insights—all in one place.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full md:w-1/2 lg:w-7/12 flex flex-col justify-center px-6 py-12 md:px-16 lg:px-24 xl:px-32 relative bg-white">
                
                <div className="max-w-md w-full mx-auto">
                    <div className="md:hidden mb-6 flex justify-center">
                        <img 
                            src="/images/wellwigen-logo.webp" 
                            alt="Wellwigen" 
                            className="h-11 sm:h-12 w-auto object-contain select-none" 
                        />
                    </div>
                    <div className="mb-6">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
                            Welcome Back
                        </h2>
                        <p className="text-gray-500 text-sm md:text-base font-medium">
                            Enter your credentials to access your personal dashboard.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div className="space-y-2">
                            <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-900 placeholder-gray-400 focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-50 outline-none transition-all"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div className="space-y-2 relative">
                            <label className="block text-[11px] font-extrabold text-gray-500 uppercase tracking-widest ml-1">Password</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-900 placeholder-gray-400 focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-50 outline-none transition-all pr-12"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-[34px] text-gray-400 hover:text-teal-600 transition-colors focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={auth.loading}
                                className="w-full bg-gray-900 text-white font-extrabold py-3.5 rounded-xl hover:bg-black transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {auth.loading ? 'Authenticating...' : (
                                    <>
                                        Sign In <ArrowRight size={16} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col items-center gap-4 text-center">
                        <p className="text-[13px] text-gray-500 font-medium">
                            Don't have an account?{' '}
                            <span
                                className="text-teal-600 cursor-pointer font-bold hover:underline"
                                onClick={() => navigate('/register')}
                            >
                                Create an account
                            </span>
                        </p>
                        
                    </div>
                </div>
            </div>

            <Modal isOpen={!!statusMessage} type={statusType} message={statusMessage} onClose={clearAuthStatus} />
        </section>
    );
};

export default Login;
