import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  CreditCard,
  User as UserIcon,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Zap,
  Star,
  Activity,
  Heart,
  Calendar,
  Utensils,
  Stethoscope,
  ShoppingBag,
  Plus,
  Truck,
  Apple,
  CheckCircle2,
  ChevronDown,
  ShoppingBasket,
  Clock,
  MapPin,
  Navigation,
  X,
  Camera,
  Save,
  Menu,
  FlaskConical,
  FileText
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { io } from "socket.io-client";
import { getSocketUrl } from "../../../config/socket";
import useAppStore from "../../../store/useAppStore";

const getUpcomingDeliveries = (plan, status) => {
  if (status && (status.toLowerCase() === 'expired' || status.toLowerCase() === 'cancelled')) return [];
  const today = new Date();
  const deliveries = [];
  const deliveredIds = JSON.parse(localStorage.getItem("deliveredDeliveries_v3") || "[]");
  const outForDeliveryIds = JSON.parse(localStorage.getItem("outForDeliveryDeliveries_v3") || "[]");

  const getStatus = (id) => {
    if (deliveredIds.includes(id)) return "Delivered";
    if (outForDeliveryIds.includes(id)) return "Out for Delivery";
    return "Scheduled";
  };
  
  // Calculate upcoming deliveries based on the day
  if (plan === 'Silver') {
    // 2 deliveries a week, e.g., Tuesday and Friday
    const d1 = new Date(today);
    d1.setDate(today.getDate() + ((2 + 7 - today.getDay()) % 7 || 7)); 
    const d2 = new Date(today);
    d2.setDate(today.getDate() + ((5 + 7 - today.getDay()) % 7 || 7));
    
    const id1 = `#WL-S${d1.getTime().toString().slice(-4)}`;
    const id2 = `#WL-S${d2.getTime().toString().slice(-4)}`;

    deliveries.push({ id: id1, date: d1.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }), status: getStatus(id1), items: "Fresh Seasonal Box", total: "Included" });
    deliveries.push({ id: id2, date: d2.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }), status: getStatus(id2), items: "Fresh Seasonal Box", total: "Included" });
  } else if (plan === 'Gold') {
    // 3 deliveries a week, e.g., Monday, Wednesday, Friday
    const days = [1, 3, 5];
    days.forEach(day => {
      const d = new Date(today);
      d.setDate(today.getDate() + ((day + 7 - today.getDay()) % 7 || 7));
      const id = `#WL-G${d.getTime().toString().slice(-4)}`;
      deliveries.push({ id: id, date: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }), status: getStatus(id), items: "Extended Variety Box", total: "Included" });
    });
  } else if (plan === 'Platinum') {
    // Daily
    const d = new Date(today);
    d.setDate(today.getDate() + 1);
    const id = `#WL-P${d.getTime().toString().slice(-4)}`;
    deliveries.push({ id: id, date: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }), status: getStatus(id), items: "Premium Organic Box", total: "Included" });
  } else {
    // Default fallback
    const d = new Date(today);
    d.setDate(today.getDate() + 2);
    const id = `#WL-D${d.getTime().toString().slice(-4)}`;
    deliveries.push({ id: id, date: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }), status: getStatus(id), items: "Standard Box", total: "Included" });
  }
  
  return deliveries.sort((a, b) => new Date(a.date) - new Date(b.date));
};

export default function UserDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || "Overview");
  const [showTracking, setShowTracking] = useState(false);

  // Auth and Route Guard
  useEffect(() => {
    const providerToken = localStorage.getItem("providerToken") || localStorage.getItem("vendorToken");
    const providerInfoRaw = localStorage.getItem("providerInfo") || localStorage.getItem("vendorInfo");
    const userToken = localStorage.getItem("user") || localStorage.getItem("userInfo");

    // Redirect provider to their dashboard if they land here by mistake
    if (providerToken && providerInfoRaw && !userToken) {
      try {
        const info = JSON.parse(providerInfoRaw);
        const type = (info.type || info.role || info.category || "").toLowerCase();
        if (type) {
          navigate(`/${type}/dashboard`, { replace: true });
        } else {
          navigate("/provider/dashboard", { replace: true });
        }
      } catch (e) {
        console.error("Error parsing providerInfo in UserDashboard:", e);
      }
      return;
    }

    // Redirect logged-out visitors to login page
    if (!userToken && !providerToken) {
      navigate("/login", { replace: true });
      return;
    }

    // Ensure logged-in user has an active subscription
    if (userToken) {
      const hasSubscription = localStorage.getItem("userSubscription");
      if (!hasSubscription) {
        const checkBackendSub = async () => {
          try {
            const user = JSON.parse(userToken);
            const userId = user.id || user._id;
            if (userId) {
              const apiEndpoint = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
              const res = await axios.get(`${apiEndpoint}/subscription/me/${userId}`).catch(() => null);
              if (res?.data?.data && (res.data.data.status === 'active' || res.data.data.status === 'Active')) {
                const s = res.data.data;
                const planMap = { fit_start: 'Silver', healthy_life: 'Gold', total_wellness: 'Platinum' };
                localStorage.setItem("userSubscription", JSON.stringify({
                  plan: planMap[s.plan] || s.plan || 'Silver',
                  status: "Active",
                  nextBilling: s.endDate ? new Date(s.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A',
                  price: `₹${s.price || 499}/mo`
                }));
                // Reload to refresh state
                window.location.reload();
                return;
              }
            }
            // Redirect to pricing if no active subscription exists
            navigate('/pricing', { replace: true });
          } catch (err) {
            console.error("Error checking subscription on dashboard load:", err);
            navigate('/pricing', { replace: true });
          }
        };
        checkBackendSub();
      }
    }
  }, [navigate]);
  const [isEditing, setIsEditing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Settings States
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [subscriptionAlerts, setSubscriptionAlerts] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: "VISA", last4: "4242", expiry: "12/28", isDefault: true }
  ]);
  
  // Get active user from global store
  const authUser = useAppStore((state) => state.auth?.user);

  // Simulated User Data with local persistence & dynamic fallback
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem("userData");
    if (saved) return JSON.parse(saved);
    
    // Fallback to real logged-in user details if available
    const storedUser = authUser || JSON.parse(localStorage.getItem("user") || localStorage.getItem("userInfo") || "{}");
    if (storedUser && storedUser.name) {
      return {
        name: storedUser.name,
        email: storedUser.email || "",
        phone: storedUser.phone || storedUser.mobile || "",
        avatar: storedUser.avatar || "https://i.pravatar.cc/150?img=32",
        joinDate: storedUser.joinDate || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      };
    }

    return {
      name: "User",
      email: "",
      phone: "",
      avatar: "",
      joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };
  });

  const [subscription, setSubscription] = useState(() => {
    const saved = localStorage.getItem("userSubscription");
    return saved ? JSON.parse(saved) : {
      plan: "Gold",
      status: "Active",
      nextBilling: "June 05, 2026",
      price: "₹999/mo"
    };
  });

  // Latest Order from LocalStorage
  const [latestOrder, setLatestOrder] = useState(() => {
    const saved = localStorage.getItem("latestOrder");
    return saved ? JSON.parse(saved) : null;
  });

  const [socketConnected, setSocketConnected] = useState(false);

  const [orderHistory, setOrderHistory] = useState([]);
  const [upcomingOrders, setUpcomingOrders] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [lastSynced, setLastSynced] = useState(new Date().toLocaleTimeString());

  const API = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
  const fetchUserData = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const storedUserInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const providerInfo = JSON.parse(localStorage.getItem("providerInfo") || localStorage.getItem("vendorInfo") || "{}");
      
      const userId = storedUser.id || storedUser._id || 
                     storedUserInfo.id || storedUserInfo._id || 
                     providerInfo.id || providerInfo._id;

      console.log("👤 [USER-DASHBOARD] Identity Detection:", {
        userId,
        hasUser: !!storedUser.id,
        hasUserInfo: !!storedUserInfo.id,
        hasProviderInfo: !!providerInfo.id
      });

      if (!userId) {
        console.warn("⚠️ [USER-DASHBOARD] No valid userId found in storage.");
        return;
      }

      // Fetch subscription
      const subRes = await axios.get(`${API}/subscription/me/${userId}`).catch(() => null);
      if (subRes?.data?.data) {
        const s = subRes.data.data;
        const planMap = { fit_start: 'Silver', healthy_life: 'Gold', total_wellness: 'Platinum' };
        setSubscription({
          plan: planMap[s.plan] || s.plan || 'Silver',
          status: s.status || 'active',
          nextBilling: s.endDate ? new Date(s.endDate).toLocaleDateString('en-IN') : 'N/A',
          price: `₹${s.price || 499}/mo`
        });
      }

      // Fetch real orders
      const orderRes = await axios.get(`${API}/orders/user/${userId}`).catch(() => null);
      
      if (orderRes?.data && Array.isArray(orderRes.data)) {
        const formattedOrders = orderRes.data.map(o => {
          if (!o || !o._id) return null;
          const firstItem = o.items?.[0] || {};
          const isLab = firstItem.name?.toLowerCase().includes('lab') || firstItem.name?.toLowerCase().includes('checkup');
          
          return {
            id: `#WL-${o._id.toString().slice(-4).toUpperCase()}`,
            _id: o._id,
            date: new Date(o.scheduledFor || o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: o.status === 'out_for_delivery' ? (isLab ? 'Report Ready' : 'Out for Delivery') :
                    o.status === 'delivered' ? (isLab ? 'Report Sent' : 'Delivered') :
                    o.status === 'pending' ? 'Scheduled' :
                    o.status?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Pending',
            items: firstItem.name || 'Wellwigen Service',
            total: o.totalAmount ? `₹${o.totalAmount}` : 'Included',
            isLab: isLab
          };
        }).filter(Boolean);
        
        let labs = formattedOrders.filter(o => o.isLab);
        let upcoming = formattedOrders.filter(o => !o.isLab && o.status !== 'Delivered');

        // Feature Padding: Ensure 2 fruit deliveries and 1 lab test are shown for Silver/Gold
        if (subscription.plan !== 'Platinum' && upcoming.length < 2) {
          const paddingCount = 2 - upcoming.length;
          for(let i=0; i<paddingCount; i++) {
            upcoming.push({
              id: `#WL-SCH${i}`,
              date: new Date(Date.now() + (i+2)*86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              status: 'Scheduled',
              items: 'Fresh Seasonal Box',
              total: 'Included',
              isLab: false
            });
          }
        }

        if (subscription.plan !== 'Platinum' && labs.length === 0) {
          labs.push({
            id: '#WL-LAB-SCH',
            date: new Date(Date.now() + 5*86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            status: 'Scheduled',
            items: 'Full Body Checkup',
            total: 'Included',
            isLab: true
          });
        }
        
        setOrderHistory(formattedOrders.filter(o => !o.isLab));
        setUpcomingOrders(upcoming);
        setLabTests(labs);
      } else {
        // Fallback if no real data at all - Ensure the 2+1 pattern
        setUpcomingOrders([
          { id: '#WL-SCH1', date: 'In 2 days', status: 'Scheduled', items: 'Fresh Seasonal Box', total: 'Included', isLab: false },
          { id: '#WL-SCH2', date: 'In 5 days', status: 'Scheduled', items: 'Fresh Seasonal Box', total: 'Included', isLab: false }
        ]);
        setLabTests([
          { id: '#WL-LAB1', date: 'Next Tuesday', status: 'Scheduled', items: 'Comprehensive Lab Test', total: 'Included', isLab: true }
        ]);
        setOrderHistory([]);
      }
    } catch (err) {
      console.error("❌ [USER-DASHBOARD] Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchUserData();
    
    // Polling fallback: Refresh every 10 seconds to ensure sync even if sockets fail
    const refreshInterval = setInterval(fetchUserData, 10000);
    
    // Setup Socket.io
    const socketUserInfo = JSON.parse(localStorage.getItem("userInfo") || localStorage.getItem("user") || "{}");
    const userId = socketUserInfo._id || socketUserInfo.id || 'demo-user-id';
    const socketBaseUrl = getSocketUrl();
    let socket = null;
    let registrationInterval = null;

    if (socketBaseUrl) {
      socket = io(socketBaseUrl, {
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
      });

      socket.on("connect", () => {
        console.log("✅ [REAL-TIME] Socket Connected:", socket.id);
        setSocketConnected(true);
        socket.emit("registerUser", userId); 
      });

      // Keep the handshake alive by re-registering every 5 seconds
      registrationInterval = setInterval(() => {
        if (socket?.connected && userId) {
          socket.emit("registerUser", userId);
        }
      }, 5000);

      socket.on("connect_error", () => setSocketConnected(false));

      socket.on("orderStatusUpdated", (data) => {
        console.log("📡 [REAL-TIME] Update received:", data);
        setLastSynced(new Date().toLocaleTimeString()); // Force UI repaint
        fetchUserData(); 
        toast.success("🚚 Real-time update received!", { position: 'bottom-right' });
      });

      socket.on("subscriptionExpiringSoon", (data) => {
        console.log("🔔 Subscription Expiring Soon:", data);
        toast(data.message, { icon: '⚠️', duration: 6000 });
        setSubscription(prev => ({ ...prev, status: "Expiring Soon" }));
      });

      socket.on("subscriptionExpired", (data) => {
        console.log("🛑 Subscription Expired:", data);
        toast.error(data.message, { duration: 6000 });
        setSubscription(prev => ({ ...prev, status: "Expired" }));
      });

      socket.on("storesClosed", (data) => {
        console.log("🛑 Stores Closed Alert:", data);
        toast.error(data.message, { icon: '🏪', duration: 8000 });
      });
    }

    return () => {
      clearInterval(refreshInterval);
      if (registrationInterval) clearInterval(registrationInterval);
      if (socket) socket.disconnect();
    };
  }, [API]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleDeleteAccount = () => {
    toast.success("Account deleted successfully.");
    handleLogout();
  };

  const handleTogglePreference = (setting) => {
    if (setting === 'orders') {
      setOrderUpdates(!orderUpdates);
      toast.success(orderUpdates ? "Order updates disabled" : "Order updates enabled");
    } else {
      setSubscriptionAlerts(!subscriptionAlerts);
      toast.success(subscriptionAlerts ? "Subscription alerts disabled" : "Subscription alerts enabled");
    }
  };

  const handleAddPayment = (e) => {
    e.preventDefault();
    const newMethod = {
      id: Date.now(),
      type: "MASTERCARD",
      last4: Math.floor(1000 + Math.random() * 9000).toString(),
      expiry: "11/29",
      isDefault: false
    };
    setPaymentMethods([...paymentMethods, newMethod]);
    setShowPaymentModal(false);
    toast.success("Payment method added successfully!");
  };

  const handleBrowseProducts = () => {
    navigate('/vendor/dashboard', { state: { activeTab: 'Customization' } });
  };

  const handleSaveProfile = () => {
    localStorage.setItem("userData", JSON.stringify(userData));
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData({ ...userData, avatar: reader.result });
        localStorage.setItem("userData", JSON.stringify({ ...userData, avatar: reader.result }));
        toast.success("Avatar updated!");
      };
      reader.readAsDataURL(file);
    }
  };

  const planFeatures = {
    Silver: [
      { icon: <ShoppingBag size={20} />, label: "2 Fruit Deliveries/Week", desc: "Fresh seasonal picks" },
      { icon: <Stethoscope size={20} />, label: "1 GP Consultation/Month", desc: "Expert medical advice" },
      { icon: <Activity size={20} />, label: "1 Basic Lab Panel/Month", desc: "Essential health check" }
    ],
    Gold: [
      { icon: <ShoppingBag size={20} />, label: "3 Fruit Deliveries/Week", desc: "Extended variety & exotic picks" },
      { icon: <Stethoscope size={20} />, label: "3 Consultations/Month", desc: "Priority specialist access" },
      { icon: <Zap size={20} />, label: "8 Trainer Sessions/Month", desc: "1-on-1 fitness coaching" }
    ],
    Platinum: [
      { icon: <ShoppingBag size={20} />, label: "Daily Fruit Delivery", desc: "Fresh organic items daily" },
      { icon: <Stethoscope size={20} />, label: "Unlimited Consultations", desc: "On-demand specialist access" },
      { icon: <Plus size={20} />, label: "Up to 4 Family Members", desc: "Cover your loved ones" }
    ]
  };

  const currentFeatures = planFeatures[subscription.plan] || planFeatures.Silver;


  const getBadgeStyle = (status) => {
    const s = status.toLowerCase();
    if (s === 'active') return 'text-blue-700 bg-blue-50';
    if (s === 'expiring soon') return 'text-amber-700 bg-amber-50';
    return 'text-rose-700 bg-rose-50';
  };

  useEffect(() => {
    setUpcomingOrders(getUpcomingDeliveries(subscription.plan, subscription.status));
  }, [subscription.plan, subscription.status]);

  const upcomingDeliveries = upcomingOrders;
  return (
    <div className="flex h-screen bg-[#f9fafb] font-sans text-slate-900 overflow-hidden">
      {/* Overlay for mobile sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#f8f9fa] border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">W</div>
            <span className="font-bold text-gray-900 tracking-tight">Wellwigen <span className="text-blue-600 font-semibold">User</span></span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-slate-500 hover:bg-white rounded">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
          <NavItem icon={<LayoutDashboard size={18} />} label="Overview" active={activeTab === 'Overview'} onClick={() => { setActiveTab('Overview'); setIsSidebarOpen(false); }} />
          <NavItem icon={<Truck size={18} />} label="My Order" active={activeTab === 'Orders'} onClick={() => { setActiveTab('Orders'); setIsSidebarOpen(false); }} />
          <NavItem icon={<FlaskConical size={18} />} label="Lab Tests" active={activeTab === 'Lab'} onClick={() => { setActiveTab('Lab'); setIsSidebarOpen(false); }} />
          <NavItem icon={<CreditCard size={18} />} label="My Subscription" active={activeTab === 'Subscription'} onClick={() => { setActiveTab('Subscription'); setIsSidebarOpen(false); }} />
          <NavItem icon={<Settings size={18} />} label="Settings" active={activeTab === 'Settings'} onClick={() => { setActiveTab('Settings'); setIsSidebarOpen(false); }} />
        </nav>

        <div className="p-4 border-t border-gray-200 bg-[#f8f9fa]">
          <button 
            onClick={() => { setActiveTab('Account'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
              activeTab === 'Account' ? 'bg-[#eef2ff] border border-blue-100' : 'hover:bg-white border border-transparent'
            }`}
          >
            <div className="relative">
              <img src={userData.avatar} alt="Profile" className="w-10 h-10 rounded object-cover" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-600 rounded-full border-2 border-[#f8f9fa] flex items-center justify-center text-[10px] text-white">
                <ShieldCheck size={10} />
              </div>
            </div>
            <div className="flex flex-col items-start overflow-hidden text-left">
              <span className={`text-sm font-semibold truncate w-full ${activeTab === 'Account' ? 'text-blue-900' : 'text-gray-900'}`}>{userData.name.split(' ')[0]}</span>
              <span className="text-xs font-semibold uppercase text-blue-600 tracking-widest">My Account</span>
            </div>
            <ChevronRight size={14} className={`ml-auto ${activeTab === 'Account' ? 'text-blue-600' : 'text-gray-400'}`} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-slate-500">
              <Menu size={24} />
            </button>
            <span className="font-bold text-gray-900 text-sm">Wellwigen</span>
          </div>
          <div className="flex items-center gap-3">
            <img 
              src={userData.avatar} 
              alt="Profile" 
              className="w-8 h-8 rounded border border-gray-200 object-cover"
            />
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-100 pb-6 gap-4">
            <div>
              <h1 className="text-xl lg:text-2xl font-semibold text-slate-900">
                {activeTab === 'Account' ? 'Account Settings' : `Welcome, ${userData.name.split(' ')[0]}`}
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                {activeTab === 'Account' ? 'Manage your profile and security' : 'Your Daily Health Summary'}
              </p>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <button className="p-2 bg-white border border-gray-200 rounded text-slate-500 hover:text-blue-600 transition relative">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </button>
            
            {/* Live Socket Indicator */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all ${socketConnected ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${socketConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
              {socketConnected ? 'Live' : 'Offline'}
            </div>

            <button onClick={handleLogout} className="p-2 bg-white border border-gray-200 rounded text-slate-500 hover:text-red-600 transition"><LogOut size={18} /></button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'Overview' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Heart Rate" value="72" unit="bpm" trend="Normal" icon={<Heart className="text-rose-500" size={20} />} />
                <StatCard label="Blood Oxygen" value="98" unit="%" trend="Optimal" icon={<Zap className="text-amber-500" size={20} />} />
                <StatCard label="Daily Steps" value="8,432" unit="steps" trend="+12%" icon={<Activity className="text-teal-500" size={20} />} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Your {subscription.plan} Perks</h2>
                    <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${getBadgeStyle(subscription.status)}`}>{subscription.status}</span>
                  </div>
                  <div className="space-y-4">
                    {currentFeatures.map((feature, i) => (
                      <div key={i} className="flex items-start gap-4 p-3 rounded hover:bg-gray-50 transition-colors group">
                        <div className="text-blue-600">{feature.icon}</div>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">{feature.label}</h4>
                          <p className="text-sm text-gray-500 mt-0.5">{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-8 space-y-8">
                   <div className="bg-white border border-gray-200 rounded-lg p-6">
                     <div className="relative z-10">
                       <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                         <h2 className="text-lg font-semibold text-gray-900">Current Basket</h2>
                         <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded uppercase tracking-wider">
                           {latestOrder ? latestOrder.status : 'Planning Mode'}
                         </span>
                       </div>
                       
                       {latestOrder ? (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                           {latestOrder.items.map((item, i) => (
                             <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                               <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-teal-600 shadow-sm font-bold text-sm">{item.quantity}x</div>
                                 <span className="text-sm font-bold text-gray-700">{item.name}</span>
                               </div>
                               <span className="text-sm font-black text-gray-400">₹{item.total}</span>
                             </div>
                           ))}
                         </div>
                       ) : (
                         <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-slate-100 rounded-[2rem] mb-8 bg-slate-50/50">
                            <ShoppingBasket className="text-slate-300 mb-3" size={32} />
                            <p className="text-sm font-bold text-slate-400">Your basket is waiting to be filled.</p>
                         </div>
                       )}

                       <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                          <div>
                            <p className="text-xs font-black text-gray-300 uppercase tracking-widest">Order Status</p>
                            <p className="text-sm font-bold text-gray-900">{latestOrder ? latestOrder.orderId : 'Not Yet Placed'}</p>
                          </div>
                          <button 
                            onClick={handleBrowseProducts} 
                            disabled={['expired', 'cancelled'].includes(subscription.status.toLowerCase())}
                            className={`px-4 py-2 text-white rounded text-xs font-bold uppercase tracking-widest transition-all ${['expired', 'cancelled'].includes(subscription.status.toLowerCase()) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                            {latestOrder ? 'Update Basket' : 'Place Now'}
                          </button>
                       </div>
                     </div>
                   </div>

                   <div className="bg-slate-900 rounded-lg p-6 text-white shadow-sm relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                     <h3 className="text-sm font-bold text-blue-400 uppercase tracking-[0.2em] mb-6 border-b border-white/10 pb-4">Delivery Details</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="flex gap-4">
                         <div className="w-12 h-12 bg-white/10 rounded flex items-center justify-center border border-white/10"><Truck className="text-blue-400" size={20} /></div>
                         <div>
                            <h4 className="text-base font-semibold">Next Delivery</h4>
                            <p className="text-slate-400 text-sm mt-1">
                              {upcomingOrders.length > 0 
                                ? new Date(upcomingOrders[0].date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
                                : 'Checking schedule...'}
                            </p>
                          </div>
                       </div>
                       <div className="flex gap-4">
                         <div className="w-12 h-12 bg-white/10 rounded flex items-center justify-center border border-white/10"><Clock className="text-blue-400" size={20} /></div>
                         <div>
                            <h4 className="text-base font-semibold">Current Status</h4>
                            <p className="text-slate-400 text-sm mt-1">
                              {upcomingOrders.length > 0 ? upcomingOrders[0].status : 'Waiting for Vendor'}
                            </p>
                          </div>
                       </div>
                     </div>
                     <button onClick={() => setShowTracking(true)} className="w-full mt-6 py-3 bg-white/10 border border-white/10 hover:bg-white/20 text-white rounded font-semibold text-sm transition-all">Track Order Live</button>
                   </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'Orders' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-lg p-8">
                <header className="mb-8 flex justify-between items-center border-b border-gray-100 pb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Upcoming Deliveries</h2>
                    <p className="text-slate-500 text-sm mt-1">Track your scheduled fresh produce deliveries based on your {subscription.plan} plan.</p>
                  </div>
                  <button 
                    onClick={handleBrowseProducts} 
                    disabled={['expired', 'cancelled'].includes(subscription.status.toLowerCase())}
                    className={`px-4 py-2 text-white rounded font-semibold text-sm transition-all ${['expired', 'cancelled'].includes(subscription.status.toLowerCase()) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                    Customize Next Box
                  </button>
                </header>
                <div className="space-y-4">
                   {/* Real Orders from Backend */}
                    {/* Scheduled Deliveries (Logic Based) */}
                    <div>
                     <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Scheduled Deliveries</h3>
                     <div className="space-y-4">
                        {upcomingOrders.map((order, idx) => (
                          <OrderRow 
                            key={`upcoming-${idx}`} 
                            id={order.id} 
                            date={order.date} 
                            status={order.status} 
                            items={order.items} 
                            total={order.total} 
                            onClick={() => setSelectedOrder(order)}
                          />
                        ))}
                     </div>
                   </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'Lab' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-lg p-8">
                <header className="mb-8 flex justify-between items-center border-b border-gray-100 pb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">Lab Diagnostics</h2>
                    <p className="text-slate-500 text-sm mt-1">Track your biological markers and diagnostic reports.</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                    <FlaskConical size={12} /> Live Tracking
                  </div>
                </header>
                
                {labTests.length === 0 ? (
                  <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/30">
                    <FlaskConical className="mx-auto text-slate-300 mb-4" size={48} />
                    <h3 className="text-lg font-bold text-slate-900">No Tests Scheduled</h3>
                    <p className="text-slate-500 text-sm mt-2">Your diagnostic requests will appear here once booked.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {labTests.map((test, idx) => (
                      <div key={idx} className="p-5 border border-gray-100 rounded-2xl hover:border-purple-200 transition-all group">
                         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all">
                                  <FileText size={20} />
                               </div>
                               <div>
                                  <h4 className="font-bold text-slate-900">{test.items}</h4>
                                  <p className="text-xs text-slate-500 font-medium">Request ID: {test.id} &bull; {test.date}</p>
                               </div>
                            </div>
                            <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-gray-50">
                               <div className="text-left md:text-right">
                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${
                                     test.status === 'Scheduled' ? 'bg-amber-50 text-amber-600' :
                                     test.status === 'Sample Collected' ? 'bg-purple-50 text-purple-600' :
                                     test.status === 'Report Ready' ? 'bg-emerald-50 text-emerald-700' :
                                     'bg-slate-100 text-slate-600'
                                  }`}>{test.status}</span>
                               </div>
                               {test.status === 'Report Ready' ? (
                                 <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-purple-700 transition-all shadow-lg shadow-purple-100">
                                   Download Report
                                 </button>
                               ) : (
                                 <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full bg-purple-600 transition-all duration-1000 ${
                                      test.status === 'Sample Collected' ? 'w-2/3' : 'w-1/3'
                                    }`} />
                                 </div>
                               )}
                            </div>
                         </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'Subscription' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Active Plan Header */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-6 flex-col md:flex-row gap-6 border-b border-gray-100 pb-6">
                    <div>
                      <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${getBadgeStyle(subscription.status)}`}>
                        {subscription.status}
                      </span>
                      <h2 className="text-xl font-semibold mt-3 text-gray-900">{subscription.plan} Plan</h2>
                      <p className="text-gray-500 text-sm mt-1">Your premium health & wellness package.</p>
                    </div>
                    <div className="md:text-right">
                      <p className="text-xl font-semibold text-gray-900">{subscription.price}</p>
                      <p className="text-sm text-gray-500 mt-1">Next Billing: {subscription.nextBilling}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                     <button 
                       onClick={() => navigate('/pricing')} 
                       className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-sm transition-colors"
                     >
                       Manage Plan
                     </button>
                     <button className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded font-medium text-sm transition-colors">View Billing History</button>
                  </div>
                </div>

                {/* Plan Features Grid */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-4">Included in your plan</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentFeatures.map((feature, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded flex items-center justify-center shrink-0">
                          {feature.icon}
                        </div>
                        <div>
                           <h4 className="font-semibold text-gray-900 text-sm mb-1">{feature.label}</h4>
                           <p className="text-sm text-gray-500">{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Upcoming Deliveries Summary */}
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-gray-600 border border-gray-200">
                         <Calendar size={20} />
                      </div>
                      <div>
                         <h4 className="font-semibold text-gray-900">Delivery Schedule</h4>
                         <p className="text-sm text-gray-600">
                           {subscription.plan === 'Silver' ? 'Tue, Fri (Morning Slots)' :
                            subscription.plan === 'Gold' ? 'Mon, Wed, Fri (Morning Slots)' :
                            subscription.plan === 'Platinum' ? 'Daily (Morning Slots)' :
                            'Flexible Schedule'}
                         </p>
                      </div>
                   </div>
                   <button onClick={() => setActiveTab('Orders')} className="p-2 text-gray-400 hover:text-teal-600 transition-colors">
                      <ChevronRight size={20} />
                   </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'Settings' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-white border border-gray-200 rounded-xl p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h3>
                  
                  <div className="space-y-6">
                    {/* Notification Preferences */}
                    <div className="pb-6 border-b border-gray-100">
                      <h4 className="font-semibold text-gray-900 mb-4">Notifications</h4>
                      <div className="space-y-4">
                        <label className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Order Updates</p>
                            <p className="text-sm text-gray-500">Receive SMS & Email notifications about your deliveries</p>
                          </div>
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 accent-teal-600" 
                            checked={orderUpdates}
                            onChange={() => handleTogglePreference('orders')} 
                          />
                        </label>
                        <label className="flex items-center justify-between cursor-pointer">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Subscription Alerts</p>
                            <p className="text-sm text-gray-500">Get notified when your plan is about to expire</p>
                          </div>
                          <input 
                            type="checkbox" 
                            className="w-5 h-5 accent-teal-600" 
                            checked={subscriptionAlerts}
                            onChange={() => handleTogglePreference('subscriptions')} 
                          />
                        </label>
                      </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="pb-6 border-b border-gray-100">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold text-gray-900">Payment Methods</h4>
                        <button onClick={() => setShowPaymentModal(true)} className="text-sm text-teal-600 font-medium hover:text-teal-700">Add New</button>
                      </div>
                      <div className="space-y-3">
                        {paymentMethods.map(pm => (
                          <div key={pm.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                            <div className="w-12 h-8 bg-slate-100 rounded flex items-center justify-center">
                              <span className="font-bold text-slate-800 text-sm">{pm.type}</span>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">•••• •••• •••• {pm.last4}</p>
                              <p className="text-sm text-gray-500">Expires {pm.expiry}</p>
                            </div>
                            {pm.isDefault && <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">Default</span>}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div>
                      <h4 className="font-semibold text-red-600 mb-4">Danger Zone</h4>
                      <button 
                        onClick={() => setShowDeleteModal(true)}
                        className="px-6 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-sm font-medium transition-colors"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'Account' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="max-w-4xl mx-auto">
                <div className="bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-sm">
                  <div className="flex flex-col md:flex-row gap-10 items-start">
                    <div className="relative group">
                      <img src={userData.avatar} alt="Profile" className="w-32 h-32 rounded-[2rem] object-cover border-4 border-white shadow-xl transition-all group-hover:brightness-90" />
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-2 -right-2 p-3 bg-teal-600 text-white rounded-xl shadow-lg hover:scale-110 transition-transform flex items-center justify-center"
                      >
                        <Plus size={16} />
                      </button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleAvatarChange} 
                        className="hidden" 
                        accept="image/*"
                      />
                    </div>
                    <div className="flex-1 space-y-8 w-full">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                          <input 
                            type="text" 
                            value={userData.name} 
                            onChange={(e) => setUserData({...userData, name: e.target.value})}
                            disabled={!isEditing}
                            className={`w-full px-6 py-4 rounded-2xl font-bold outline-none transition-all ${
                              isEditing ? 'bg-white border-teal-600 border-2 shadow-xl ring-4 ring-teal-50' : 'bg-slate-50 border border-slate-100 text-slate-900'
                            }`}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                          <input 
                            type="email" 
                            value={userData.email} 
                            onChange={(e) => setUserData({...userData, email: e.target.value})}
                            disabled={!isEditing}
                            className={`w-full px-6 py-4 rounded-2xl font-bold outline-none transition-all ${
                              isEditing ? 'bg-white border-teal-600 border-2 shadow-xl ring-4 ring-teal-50' : 'bg-slate-50 border border-slate-100 text-slate-900'
                            }`}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                          <input 
                            type="text" 
                            value={userData.phone} 
                            onChange={(e) => setUserData({...userData, phone: e.target.value})}
                            disabled={!isEditing}
                            className={`w-full px-6 py-4 rounded-2xl font-bold outline-none transition-all ${
                              isEditing ? 'bg-white border-teal-600 border-2 shadow-xl ring-4 ring-teal-50' : 'bg-slate-50 border border-slate-100 text-slate-900'
                            }`}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Member Since</label>
                          <input type="text" value={userData.joinDate} readOnly className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-400 outline-none" />
                        </div>
                      </div>
                      
                      <div className="flex gap-4">
                        {isEditing ? (
                          <button 
                            onClick={handleSaveProfile}
                            className="flex-1 md:flex-none px-10 py-4 bg-teal-600 text-white rounded-2xl font-bold text-sm hover:bg-teal-700 transition-all shadow-xl shadow-teal-100 flex items-center justify-center gap-2"
                          >
                            <Save size={18} /> Save Changes
                          </button>
                        ) : (
                          <button 
                            onClick={() => setIsEditing(true)}
                            className="flex-1 md:flex-none px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-all shadow-xl shadow-slate-200"
                          >
                            Edit Profile Details
                          </button>
                        )}
                        {isEditing && (
                          <button 
                            onClick={() => setIsEditing(false)}
                            className="px-10 py-4 bg-white border border-gray-200 text-slate-400 rounded-2xl font-bold text-sm hover:bg-gray-50 transition-all"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      {/* Live Tracking Modal */}
      <AnimatePresence>
        {showTracking && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-4xl rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row h-[600px]"
            >
              <div className="flex-1 bg-slate-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/75.80,26.90,12,0/800x600?access_token=pk.eyJ1IjoiZGV2ZWxvcGVyIiwiYSI6ImNrY3h...')] bg-cover opacity-50"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                   <svg className="w-full h-full absolute">
                      <motion.path d="M100,500 Q200,300 400,100" fill="none" stroke="#0d9488" strokeWidth="4" strokeDasharray="10 10" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, repeat: Infinity }} />
                   </svg>
                   <motion.div initial={{ y: 0 }} animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-[50px] left-[100px] flex flex-col items-center"><div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center text-white shadow-xl border-4 border-white"><ShoppingBasket size={20} /></div></motion.div>
                   <motion.div className="absolute top-[100px] right-[100px] flex flex-col items-center"><div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white shadow-xl border-4 border-white animate-bounce"><Truck size={20} /></div></motion.div>
                </div>
              </div>
              <div className="w-full md:w-80 bg-white p-10 flex flex-col border-l border-gray-100">
                <div className="flex justify-between items-center mb-10"><h3 className="text-xl font-black">Track Order</h3><button onClick={() => setShowTracking(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><X size={20} /></button></div>
                <div className="space-y-8 flex-1">
                   <TrackingStep icon={<ShoppingBag size={18} />} title="Order Confirmed" time="09:00 AM" active />
                   <TrackingStep icon={<ShoppingBasket size={18} />} title="Customizing Basket" time="10:15 AM" active />
                   <TrackingStep icon={<Truck size={18} />} title="Out for Delivery" time="11:30 AM" active current />
                   <TrackingStep icon={<MapPin size={18} />} title="Arriving Soon" time="ETA 12:15 PM" />
                </div>
                <div className="pt-8 border-t border-gray-100">
                   <div className="flex items-center gap-4 mb-6"><img src="https://i.pravatar.cc/150?img=12" className="w-12 h-12 rounded-2xl object-cover shadow-lg" /><div><p className="text-sm font-black">Rahul Singh</p><p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Delivery Hero</p></div></div>
                   <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm">Call Rahul</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPaymentModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl p-8 relative"
            >
              <button onClick={() => setShowPaymentModal(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900"><X size={20} /></button>
              <h3 className="text-2xl font-black text-slate-900 mb-6">Add Payment Method</h3>
              <form onSubmit={handleAddPayment} className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 block">Card Number</label>
                  <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-500" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 block">Expiry Date</label>
                    <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-500" required />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2 block">CVV</label>
                    <input type="text" placeholder="123" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-teal-500" required />
                  </div>
                </div>
                <button type="submit" className="w-full py-4 mt-4 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors">Save Card</button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {showDeleteModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Delete Account?</h3>
              <p className="text-slate-500 mb-8">This action cannot be undone. All your data, subscriptions, and delivery history will be permanently erased.</p>
              <div className="flex gap-4">
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors">Cancel</button>
                <button onClick={handleDeleteAccount} className="flex-1 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors">Yes, Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {selectedOrder && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[2rem] overflow-hidden shadow-2xl relative"
            >
              <div className="bg-slate-50 p-8 border-b border-gray-100 flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 mb-1">Order Details</h3>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{selectedOrder.id} &bull; {selectedOrder.date}</p>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 bg-white text-gray-400 hover:text-gray-900 rounded-xl shadow-sm transition-colors"><X size={20} /></button>
              </div>
              
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Status</span>
                  <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                    selectedOrder.status === 'Processing' ? 'bg-amber-50 text-amber-600' : 'bg-teal-50 text-teal-600'
                  }`}>
                    {selectedOrder.status}
                  </span>
                </div>

                <div className="space-y-4 mb-8">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Items</span>
                  {selectedOrder.fullItems ? (
                     selectedOrder.fullItems.map((item, idx) => (
                       <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                         <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-black text-teal-600 text-sm shadow-sm">{item.quantity}x</div>
                           <span className="font-bold text-sm text-slate-900">{item.name}</span>
                         </div>
                         <span className="font-black text-slate-400 text-sm">₹{item.total}</span>
                       </div>
                     ))
                  ) : (
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                       <span className="font-bold text-sm text-slate-900">{selectedOrder.items}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-gray-100 mb-8">
                  <span className="font-bold text-slate-900">Total Paid</span>
                  <span className="text-2xl font-black text-teal-600">{selectedOrder.total}</span>
                </div>

                <div className="flex gap-4">
                  {selectedOrder.status === 'Processing' && (
                    <button 
                      onClick={() => { setSelectedOrder(null); setShowTracking(true); }}
                      className="flex-1 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition-colors"
                    >
                      Track Order
                    </button>
                  )}
                  <button onClick={handleBrowseProducts} className="flex-1 py-4 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-colors">
                    Reorder Items
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
        </AnimatePresence>
      </main>
    </div>
  </div>
);
}

function TrackingStep({ icon, title, time, active, current }) {
   return (
      <div className="flex gap-4 relative">
         {!title.includes("Arriving") && <div className={`absolute left-[13px] top-[30px] w-0.5 h-[50px] ${active ? 'bg-teal-600' : 'bg-gray-100'}`} />}
         <div className={`w-7 h-7 rounded-lg flex items-center justify-center relative z-10 transition-all ${
            current ? 'bg-teal-600 text-white scale-125 shadow-lg shadow-teal-100' : active ? 'bg-teal-50 text-teal-600' : 'bg-gray-50 text-gray-300'
         }`}>{icon}</div>
         <div><p className={`text-sm font-bold ${active ? 'text-slate-900' : 'text-slate-300'}`}>{title}</p><p className="text-xs font-black text-slate-400 uppercase tracking-widest">{time}</p></div>
      </div>
   );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${active ? 'bg-[#eef2ff] text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
      {icon}<span>{label}</span>
    </button>
  );
}

function StatCard({ label, value, unit, trend, icon }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex justify-between items-start mb-4"><div className="text-blue-600">{icon}</div><span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded">{trend}</span></div>
      <p className="text-gray-500 text-sm font-semibold">{label}</p>
      <div className="flex items-baseline gap-1 mt-1"><h4 className="text-2xl font-bold text-gray-900">{value}</h4><span className="text-sm font-medium text-gray-400">{unit}</span></div>
    </div>
  );
}

function OrderRow({ id, date, status, items, total, onClick }) {
  const isDelivered = status.toLowerCase() === 'delivered';
  const isOutForDelivery = status.toLowerCase() === 'out for delivery';
  
  return (
    <div onClick={onClick} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer transition-colors">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded flex items-center justify-center text-sm font-bold ${
          isDelivered ? 'bg-blue-50 text-blue-600' : 
          isOutForDelivery ? 'bg-blue-50 text-blue-500' :
          'bg-gray-50 text-gray-600'
        }`}>
          {isDelivered ? <ShieldCheck size={18} /> : 
           isOutForDelivery ? <Truck size={18} /> : 
           id.slice(1, 3)}
        </div>
        <div>
          <h4 className="font-semibold text-slate-900 text-sm">{id}</h4>
          <p className="text-sm text-slate-500 mt-0.5">{date} • {items}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-900">{total}</p>
          <span className={`text-xs font-bold px-2 py-0.5 rounded ${
            isDelivered ? 'text-blue-700 bg-blue-50' : 
            isOutForDelivery ? 'text-blue-600 bg-blue-50' :
            status === 'Processing' ? 'text-amber-600 bg-amber-50' : 
            'text-slate-500 bg-slate-100'
          }`}>
            {status}
          </span>
        </div>
        <ChevronRight size={16} className="text-slate-400" />
      </div>
    </div>
  );
}
