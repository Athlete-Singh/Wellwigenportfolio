import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, ShieldCheck, AlertCircle, FileText, CheckCircle2, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import socket from '../../../../config/socket';
import { providerService } from '../../services/providerService';

const ProviderStatus = () => {
  const [status, setStatus] = useState('pending');
  const navigate = useNavigate();

  useEffect(() => {
    const providerDataStr = localStorage.getItem('wellwigen_onboarding_provider');
    if (!providerDataStr) return;
    
    const providerData = JSON.parse(providerDataStr);
    const providerId = providerData._id || providerData.id;

    if (!providerId) return;

    const fetchStatus = async () => {
      try {
        const res = await providerService.getStatus(providerId);
        if (res.success && res.data) {
          setStatus(res.data.verificationStatus);
        }
      } catch (err) {
        console.error("Failed to fetch provider status:", err);
      }
    };

    // 1. Initial Fetch
    fetchStatus();

    // 2. Setup Socket Listener for real-time update
    socket.on('providerStatusUpdated', (data) => {
      if (data.providerId === providerId) {
        setStatus(data.status);
      }
    });

    // 3. Fallback Polling (Cron) - Every 10 seconds
    const interval = setInterval(() => {
      fetchStatus();
    }, 10000);

    return () => {
      socket.off('providerStatusUpdated');
      clearInterval(interval);
    };
  }, []);

  const handleGoToLogin = () => {
    // Clear onboarding data and navigate to login to use the credentials sent via email
    localStorage.removeItem('wellwigen_onboarding_provider');
    navigate('/vendor/login');
  };

  const steps = [
    { label: 'Application Submitted', completed: true, date: 'Oct 24, 2023' },
    { label: 'Document Verification', current: status === 'pending' || status === 'under_review', completed: status === 'approved', date: status === 'approved' ? 'Completed' : 'In progress' },
    { label: 'Profile Activation', current: false, completed: status === 'approved', date: status === 'approved' ? 'Active' : 'Pending' }
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white border border-gray-100 rounded-3xl p-10 shadow-xl shadow-gray-100/50">
        <div className="text-center space-y-4 mb-10">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            {status === 'approved' ? <ShieldCheck size={32} /> : <Clock size={32} />}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {status === 'approved' ? 'Verified Successfully' : 'Application Under Review'}
          </h1>
          <p className="text-gray-500 text-lg">
            {status === 'approved' 
              ? "Your provider profile is now active. Please check your email for login credentials."
              : "Our compliance team is verifying your documents. This usually takes 24-48 hours."}
          </p>
        </div>

        {/* Status Timeline */}
        <div className="space-y-6">
          {steps.map((step, idx) => (
            <div key={idx} className="flex gap-4 items-start relative">
              <div className="flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  step.completed ? 'bg-blue-600 border-blue-600 text-white' : 
                  step.current ? 'border-blue-600 text-blue-600' : 'border-gray-200'
                }`}>
                  {step.completed ? <CheckCircle2 size={14} /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                </div>
                {idx < steps.length - 1 && <div className="w-[1px] h-10 bg-gray-100 my-1" />}
              </div>
              <div className="flex-1 pb-4">
                <p className={`font-semibold ${step.current || step.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                  {step.label}
                </p>
                <p className="text-sm text-gray-500">{step.date}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Card */}
        <div className="mt-10 p-6 bg-gray-50 rounded-2xl border border-gray-100">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-white rounded-lg border border-gray-100">
              <Mail className="text-gray-400" size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Need help?</p>
              <p className="text-xs text-gray-500 mt-0.5">Contact our support team at <a href="mailto:wellwigen@gmail.com" className="font-semibold text-teal-700 underline">wellwigen@gmail.com</a> or WhatsApp <a href="https://wa.me/919598506627" target="_blank" rel="noopener noreferrer" className="font-semibold text-teal-700 underline">+91 9598506627</a> if you have any questions.</p>
            </div>
          </div>
        </div>

        {status === 'approved' && (
          <button onClick={handleGoToLogin} className="w-full mt-8 bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-lg shadow-gray-200">
            Go to Login
          </button>
        )}
      </div>

      <p className="mt-8 text-sm text-gray-400">© 2023 Wellwigen Health. All rights reserved.</p>
    </div>
  );
};

export default ProviderStatus;
