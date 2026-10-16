import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  Search,
  ChevronRight,
  Info
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ProviderVerification = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  useEffect(() => {
    fetchPendingProviders();
  }, []);

  const fetchPendingProviders = async () => {
    try {
      const response = await axios.get(`${API_URL}/provider/admin/pending`);
      setProviders(response.data.data || []);
    } catch (err) {
      setProviders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id, status) => {
    const action = status === 'approved' ? 'Approving' : 'Rejecting';
    toast.loading(`${action} provider...`, { id: 'admin-act' });
    try {
      await axios.put(`${API_URL}/provider/admin/verify/${id}`, { status });
      toast.success(`Application ${status === 'approved' ? 'Approved' : 'Rejected'}`, { id: 'admin-act' });
      fetchPendingProviders();
      setSelectedProvider(null);
    } catch (err) {
      toast.error("Action failed", { id: 'admin-act' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto py-10 px-6">
        <header className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Pending Verifications</h1>
            <p className="text-sm text-gray-500 mt-1">Manage onboarding applications for medical partners.</p>
          </div>
          
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-gray-100 transition-all w-48"
              />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* List Section */}
          <div className="lg:col-span-7 space-y-px bg-gray-100 rounded-xl overflow-hidden border border-gray-100">
            {loading ? (
              <div className="bg-white p-20 text-center text-gray-400 text-sm font-medium">Loading applications...</div>
            ) : providers.length === 0 ? (
              <div className="bg-white p-20 text-center">
                <p className="text-sm text-gray-500 font-medium tracking-tight">No pending applications</p>
              </div>
            ) : (
              providers.map((p) => (
                <div 
                  key={p._id}
                  onClick={() => setSelectedProvider(p)}
                  className={`p-5 bg-white cursor-pointer transition-all flex justify-between items-center group ${
                    selectedProvider?._id === p._id ? 'bg-gray-50' : 'hover:bg-gray-50/50'
                  }`}
                >
                  <div className="flex gap-4 items-center">
                    <div className={`w-2 h-2 rounded-full ${selectedProvider?._id === p._id ? 'bg-blue-600' : 'bg-gray-200 group-hover:bg-gray-300'}`} />
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 tracking-tight">{p.businessName}</h3>
                      <p className="text-xs text-gray-500 font-medium">{p.type} • {p.ownerName}</p>
                    </div>
                  </div>
                  <ChevronRight size={14} className={`transition-all ${selectedProvider?._id === p._id ? 'text-blue-600 translate-x-1' : 'text-gray-300'}`} />
                </div>
              ))
            )}
          </div>

          {/* Detail View */}
          <div className="lg:col-span-5">
            {selectedProvider ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-50 rounded-2xl p-8 sticky top-10"
              >
                <div className="mb-10">
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-widest">Awaiting Review</span>
                  <h2 className="text-xl font-bold text-gray-900 mt-3 tracking-tight">{selectedProvider.businessName}</h2>
                  <p className="text-sm text-gray-500 font-medium">{selectedProvider.ownerName}</p>
                </div>

                <div className="space-y-5 mb-10">
                  <DetailItem label="License No." value={selectedProvider.licenseNumber} />
                  <DetailItem label="Email" value={selectedProvider.email} />
                  <DetailItem label="Phone" value={selectedProvider.phone} />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-6 border-t border-gray-200">
                  <button 
                    onClick={() => handleVerify(selectedProvider._id, 'rejected')}
                    className="py-2.5 rounded-lg text-xs font-bold text-gray-600 border border-gray-200 hover:bg-gray-100 transition-all"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => handleVerify(selectedProvider._id, 'approved')}
                    className="py-2.5 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-all"
                  >
                    Approve
                  </button>
                </div>
                
                <button className="w-full mt-4 py-2 text-xs text-gray-400 font-bold hover:text-gray-900 transition-colors uppercase tracking-widest">
                  View Documents
                </button>
              </motion.div>
            ) : (
              <div className="bg-gray-50 rounded-2xl p-20 text-center border border-dashed border-gray-200">
                <Info size={24} className="mx-auto text-gray-300 mb-2" />
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select an entry</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</span>
    <span className="text-sm font-semibold text-gray-800">{value}</span>
  </div>
);

export default ProviderVerification;
