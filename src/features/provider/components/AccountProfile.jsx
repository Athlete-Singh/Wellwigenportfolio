import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Camera, 
  Edit2, 
  Save, 
  X,
  CheckCircle,
  Globe,
  MapPin,
  Store,
  FileText,
  Tag,
  CreditCard,
  Calendar,
  ShieldCheck,
  LogOut,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AccountProfile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const storedInfo = JSON.parse(localStorage.getItem("providerInfo") || localStorage.getItem("vendorInfo") || "{}");
  
  const [profile, setProfile] = useState({
    name: storedInfo.ownerName || storedInfo.name || '',
    email: storedInfo.email || '',
    phone: storedInfo.phone || '',
    profileImage: storedInfo.profileImage || '',
    shopName: storedInfo.businessName || storedInfo.name || '',
    address: storedInfo.location || storedInfo.storeAddress || '',
    gstNumber: storedInfo.gstNumber || '',
    category: storedInfo.category || '',
    plan: storedInfo.plan || 'Standard Partner',
    planStatus: storedInfo.planStatus || 'Active',
    renewalDate: storedInfo.renewalDate || ''
  });

  const [editedProfile, setEditedProfile] = useState({ ...profile });
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedProfile(prev => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!editedProfile.name || !editedProfile.email) {
      toast.error("Required fields missing");
      return;
    }
    setProfile(editedProfile);
    setIsEditing(false);
    
    // Save to localStorage
    const updatedInfo = { ...storedInfo, ...editedProfile };
    localStorage.setItem("providerInfo", JSON.stringify(updatedInfo));
    localStorage.setItem("vendorInfo", JSON.stringify(updatedInfo));
    
    toast.success('Profile updated');
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({ ...prev, [name]: value }));
  };

  const updatePassword = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    toast.success('Password updated');
    setIsChangingPassword(false);
    setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {/* Header Section */}
        <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <div 
                onClick={handleImageClick}
                className={`relative w-24 h-24 rounded-full overflow-hidden border border-gray-200 shadow-sm ${isEditing ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''}`}
              >
                <img 
                  src={isEditing ? editedProfile.profileImage : profile.profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
                {isEditing && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="text-white w-6 h-6" />
                  </div>
                )}
              </div>
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{profile.name}</h1>
              <p className="text-gray-500 text-sm mt-1">{profile.shopName}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                  <CheckCircle size={12} /> Verified Account
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Edit2 size={16} /> Edit Profile
              </button>
            ) : (
              <>
                <button 
                  onClick={handleCancel}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  <Save size={16} /> Save Changes
                </button>
              </>
            )}
          </div>
        </div>

        <div className="p-8 space-y-10">
          {/* Basic Info Section */}
          <section>
            <h2 className="text-sm font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <User size={18} className="text-gray-400" /> Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SimpleField label="Full Name" name="name" value={isEditing ? editedProfile.name : profile.name} isEditing={isEditing} onChange={handleChange} />
              <SimpleField label="Email Address" name="email" value={isEditing ? editedProfile.email : profile.email} isEditing={isEditing} onChange={handleChange} />
              <SimpleField label="Phone Number" name="phone" value={isEditing ? editedProfile.phone : profile.phone} isEditing={isEditing} onChange={handleChange} />
            </div>
          </section>

          {/* Business Details Section */}
          <section className="pt-10 border-t border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Store size={18} className="text-gray-400" /> Business Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SimpleField label="Shop Name" name="shopName" value={isEditing ? editedProfile.shopName : profile.shopName} isEditing={isEditing} onChange={handleChange} />
              <SimpleField label="Service Category" name="category" value={isEditing ? editedProfile.category : profile.category} isEditing={isEditing} onChange={handleChange} />
              <SimpleField label="GST Number" name="gstNumber" value={isEditing ? editedProfile.gstNumber : profile.gstNumber} isEditing={isEditing} onChange={handleChange} />
              <div className="md:col-span-2">
                <SimpleField label="Business Address" name="address" value={isEditing ? editedProfile.address : profile.address} isEditing={isEditing} onChange={handleChange} />
              </div>
            </div>
          </section>

          {/* Subscription Section */}
          <section className="pt-10 border-t border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <CreditCard size={18} className="text-gray-400" /> Subscription & Billing
            </h2>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Current Plan</p>
                <div className="flex items-center gap-3 mt-1">
                  <h3 className="text-xl font-bold text-gray-900">{profile.plan}</h3>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase">{profile.planStatus}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1"><Calendar size={14} /> Next renewal: {profile.renewalDate}</p>
              </div>
              <button className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
                Manage Plan
              </button>
            </div>
          </section>

          {/* Account Settings Section */}
          <section className="pt-10 border-t border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <ShieldCheck size={18} className="text-gray-400" /> Account Security
            </h2>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setIsChangingPassword(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                <Lock size={16} /> Change Password
              </button>
              <button 
                onClick={() => { localStorage.clear(); navigate("/vendor/login"); }}
                className="inline-flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Change Password Modal */}
      <AnimatePresence>
        {isChangingPassword && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsChangingPassword(false)} className="absolute inset-0 bg-gray-900/40" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-white rounded-xl p-8 shadow-xl border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Change Password</h3>
                <button onClick={() => setIsChangingPassword(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={20} /></button>
              </div>
              <form onSubmit={updatePassword} className="space-y-4">
                <PasswordField label="Old Password" name="oldPassword" value={passwordData.oldPassword} onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})} />
                <PasswordField label="New Password" name="newPassword" value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} />
                <PasswordField label="Confirm New Password" name="confirmPassword" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} />
                <div className="pt-4 space-y-3">
                  <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">Update Password</button>
                  <button type="button" onClick={() => setIsChangingPassword(false)} className="w-full py-2 bg-white border border-gray-300 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SimpleField = ({ label, name, value, isEditing, onChange }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-medium text-gray-500">{label}</label>
    {isEditing ? (
      <input 
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
      />
    ) : (
      <p className="px-3 py-2 bg-gray-50 border border-transparent text-sm text-gray-900 font-medium rounded-lg">{value}</p>
    )}
  </div>
);

const PasswordField = ({ label, name, value, onChange }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-gray-500">{label}</label>
      <div className="relative">
        <input 
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          required
          className="w-full pl-3 pr-10 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
        <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
};

export default AccountProfile;
